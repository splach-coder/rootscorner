/**
 * The zoom — driven, not screenshotted.
 *
 * Everything here is a behaviour a picture cannot show: whether the pinch
 * actually magnifies, whether the photograph can be dragged off the screen,
 * whether the page behind the overlay scrolls when you spin the wheel, and
 * whether a keyboard can get out of a modal that has locked the scroll.
 *
 *   node scripts/zoom-check.mjs [url]
 *
 * macOS needs CHROME_PATH exported (CLAUDE.md §39).
 */
import { chromium } from "playwright-core";
import { skipIntro } from "./lib/no-intro.mjs";

const URL_ =
  process.argv[2] ??
  "http://localhost:3111/fr/piece/hand-carved-tribal-stool-wood";

const CHROME_PATH =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

let failures = 0;
const check = (name, pass, detail = "") => {
  console.log(`  ${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
  if (!pass) failures++;
};

/**
 * The rendered box of the PHOTOGRAPH, not of its element.
 *
 * The img fills the frame and is `object-fit: contain`ed inside it, so its
 * bounding rect is the frame's box and says nothing about where the picture
 * actually is. The visible rect has to be derived from the natural ratio —
 * which is also what makes "can it be dragged off screen" a real test rather
 * than a test of a box that always covers the viewport.
 */
const frameBox = (page) =>
  page.evaluate(async () => {
    const img = document.querySelector(".zoom-frame img");
    if (!img) return null;
    // naturalHeight is 0 until the file has decoded, which makes every
    // derived number NaN. Wait for it rather than sleeping and hoping.
    if (!img.complete || img.naturalHeight === 0) {
      await img.decode().catch(() => {});
    }
    const r = img.getBoundingClientRect();
    const ratio = img.naturalWidth / img.naturalHeight;
    let w = r.width;
    let h = w / ratio;
    if (h > r.height) {
      h = r.height;
      w = h * ratio;
    }
    return {
      x: r.x + (r.width - w) / 2,
      y: r.y + (r.height - h) / 2,
      w,
      h,
    };
  });

const run = async (page, width, height, label) => {
  console.log(`\n${label}  ${width}x${height}`);
  await page.setViewportSize({ width, height });
  await skipIntro(page);
  await page.goto(URL_, { waitUntil: "networkidle" });

  // --- opening ---------------------------------------------------------
  const stage = page.locator(".gallery-stage");
  check("stage is a real button", (await stage.evaluate((el) => el.tagName)) === "BUTTON");

  await stage.click();
  await page.waitForSelector(".zoom", { state: "visible" });
  // The entrance fades over 260ms and the frame is measured on layout; both
  // must settle before any geometry here means anything.
  await page.waitForTimeout(600);
  check("overlay opens", await page.locator(".zoom").isVisible());

  // The photograph must FIT the surround before anyone zooms it.
  const fit = await frameBox(page);
  const surf = await page.locator(".zoom-surface").boundingBox();
  check(
    "photograph fits the screen at rest",
    fit.w > 0 && fit.w <= surf.width + 1 && fit.h <= surf.height + 1,
    `${Math.round(fit.w)}x${Math.round(fit.h)} in ${Math.round(surf.width)}x${Math.round(surf.height)}`,
  );

  // The surround must be the page ground, never a dark scrim (§18).
  const bg = await page.locator(".zoom").evaluate((el) => getComputedStyle(el).backgroundColor);
  const [r, g, b] = bg.match(/\d+/g).map(Number);
  check("surround is the page ground, not black", r > 200 && g > 200 && b > 200, bg);

  // --- the page behind must not move -----------------------------------
  const scrollBefore = await page.evaluate(() => window.scrollY);
  const box = await page.locator(".zoom-surface").boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, -600);
  await page.waitForTimeout(220);
  const scrollAfter = await page.evaluate(() => window.scrollY);
  check("wheel does not scroll the page behind", scrollBefore === scrollAfter,
    `${scrollBefore} → ${scrollAfter}`);

  // --- and the wheel actually zooms ------------------------------------
  const zoomed = await frameBox(page);
  check(
    "wheel magnifies the photograph",
    zoomed.w > fit.w + 2,
    `${Math.round(fit.w)} → ${Math.round(zoomed.w)}px wide`,
  );

  const pct = await page.locator(".zoom-step[aria-label]").nth(1).innerText();
  check("readout shows a magnification above 100%", parseInt(pct, 10) > 100, pct);

  // --- the object cannot be dragged off the screen ---------------------
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) {
    await page.mouse.move(box.x + box.width / 2 + i * 300, box.y + box.height / 2 + i * 300);
  }
  await page.mouse.up();
  await page.waitForTimeout(160);
  const dragged = await frameBox(page);
  const onScreen =
    dragged.x < width && dragged.x + dragged.w > 0 &&
    dragged.y < height && dragged.y + dragged.h > 0;
  check("photograph cannot be dragged off screen", onScreen,
    `x ${Math.round(dragged.x)}..${Math.round(dragged.x + dragged.w)}`);

  // --- reset ------------------------------------------------------------
  // The reset control is deliberately disabled at 100%, so it is only
  // clickable while zoomed — which is the state the drag above left us in.
  check(
    "fit-to-screen is enabled while zoomed",
    !(await page.locator(".zoom-step").nth(1).isDisabled()),
  );
  await page.locator(".zoom-step").nth(1).click();
  await page.waitForTimeout(300);
  const reset = await page.locator(".zoom-step").nth(1).innerText();
  check("fit-to-screen returns to 100%", parseInt(reset, 10) === 100, reset);

  // --- focus is trapped, and Escape closes ------------------------------
  // A real Tab sweep — synthetic KeyboardEvents do not move focus, so a
  // dispatched one would prove nothing.
  let outside = 0;
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press("Tab");
    const held = await page.evaluate(() => !!document.activeElement?.closest(".zoom"));
    if (!held) outside++;
  }
  check("focus never leaves the overlay", outside === 0, `${outside} stops escaped`);

  // --- clicking the photograph must NOT close ---------------------------
  // The frame is pinned to the whole surface with the picture contained in
  // the middle, so this is the case a DOM-containment test gets wrong.
  const centre = await frameBox(page);
  await page.mouse.click(centre.x + centre.w / 2, centre.y + centre.h / 2);
  await page.waitForTimeout(250);
  check("clicking the photograph does not close it", (await page.locator(".zoom").count()) === 1);

  // --- clicking the surround DOES close ---------------------------------
  // A point beside the picture but inside the surround. Only meaningful when
  // the photograph does not already span the full width.
  if (centre.x > 12) {
    await page.mouse.click(centre.x / 2, height / 2);
    await page.waitForTimeout(280);
    check("clicking the surround closes it", (await page.locator(".zoom").count()) === 0);
    await stage.click();
    await page.waitForSelector(".zoom", { state: "visible" });
    await page.waitForTimeout(400);
  }

  await page.keyboard.press("Escape");
  await page.waitForTimeout(320);
  check("Escape closes it", (await page.locator(".zoom").count()) === 0);

  const returned = await page.evaluate(
    () => document.activeElement?.classList.contains("gallery-stage"),
  );
  check("focus returns to the stage", returned === true);

  // --- and the page can scroll again ------------------------------------
  const unlocked = await page.evaluate(() => getComputedStyle(document.body).overflow);
  check("scroll lock is released", unlocked !== "hidden", unlocked);
};

const main = async () => {
  const browser = await chromium.launch({ executablePath: CHROME_PATH });
  const page = await browser.newPage();
  try {
    await run(page, 1440, 900, "desktop");
    await run(page, 390, 844, "phone");
  } finally {
    await browser.close();
  }
  console.log(failures === 0 ? "\nPASS — all checks" : `\nFAIL — ${failures}`);
  process.exit(failures === 0 ? 0 : 1);
};

main();
