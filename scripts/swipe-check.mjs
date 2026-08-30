/**
 * The gallery swipe — driven, not screenshotted.
 *
 *   node scripts/swipe-check.mjs [url]
 *
 * Every check here is a behaviour a picture cannot show, and most of them are
 * regressions this feature can cause rather than things it should do:
 *
 *  - does a swipe actually change the photograph
 *  - does a swipe ALSO open the zoom (it must not — the stage is a <button>)
 *  - does a tap still open the zoom
 *  - can the page still be scrolled vertically with a finger on the photograph
 *  - does the rail follow, so the active thumbnail is never off-screen
 *  - is a mouse drag ignored, so a mis-aimed desktop click cannot skip a shot
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

const activeIndex = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll(".gallery-shot")].findIndex((el) =>
      el.classList.contains("is-active"),
    ),
  );

/** A real finger: touch pointer, several move steps, then lift. */
const swipe = async (page, box, dx, dy = 0) => {
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.evaluate(
    ([x, y, ddx, ddy]) => {
      const el = document.querySelector(".gallery-stage");
      const send = (type, px, py) =>
        el.dispatchEvent(
          new PointerEvent(type, {
            pointerId: 1,
            pointerType: "touch",
            isPrimary: true,
            clientX: px,
            clientY: py,
            bubbles: true,
            cancelable: true,
          }),
        );
      send("pointerdown", x, y);
      for (let i = 1; i <= 10; i++) send("pointermove", x + (ddx * i) / 10, y + (ddy * i) / 10);
      send("pointerup", x + ddx, y + ddy);
      // The click the browser synthesises after a touch sequence.
      el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    },
    [cx, cy, dx, dy],
  );
  await page.waitForTimeout(450);
};

const run = async (page, width, height, label) => {
  console.log(`\n${label}  ${width}x${height}`);
  await page.setViewportSize({ width, height });
  await skipIntro(page);
  await page.goto(URL_, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  await page.evaluate(() => document.querySelector("nextjs-portal")?.remove());

  const count = await page.locator(".gallery-thumb").count();
  const stage = await page.locator(".gallery-stage").boundingBox();
  check("gallery has several photographs", count > 1, `${count}`);

  // --- touch-action lets the page keep vertical -------------------------
  const touchAction = await page
    .locator(".gallery-stage")
    .evaluate((el) => getComputedStyle(el).touchAction);
  check("stage yields vertical scroll to the page", touchAction === "pan-y", touchAction);

  // --- swipe left advances ----------------------------------------------
  const before = await activeIndex(page);
  await swipe(page, stage, -160);
  const afterLeft = await activeIndex(page);
  check("swipe left goes to the next photograph", afterLeft === (before + 1) % count,
    `${before} → ${afterLeft}`);

  // --- and it did NOT open the zoom -------------------------------------
  check("a swipe does not open the full-screen view",
    (await page.locator(".zoom").count()) === 0);

  // --- swipe right goes back --------------------------------------------
  await swipe(page, stage, 160);
  check("swipe right goes back", (await activeIndex(page)) === before,
    `→ ${await activeIndex(page)}`);

  // --- a short drag is a tap, not a swipe -------------------------------
  const beforeShort = await activeIndex(page);
  await swipe(page, stage, -20);
  check("a 20px wobble does not change the photograph",
    (await activeIndex(page)) === beforeShort);
  // that wobble WAS a tap, so it should have opened the zoom
  const openedByTap = (await page.locator(".zoom").count()) === 1;
  check("a tap still opens the full-screen view", openedByTap);
  if (openedByTap) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(350);
  }

  // --- a mostly-vertical drag belongs to the page -----------------------
  const beforeV = await activeIndex(page);
  await swipe(page, stage, -60, 200);
  check("a vertical drag does not change the photograph",
    (await activeIndex(page)) === beforeV);
  if ((await page.locator(".zoom").count()) === 1) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(350);
  }

  // --- a MOUSE drag is ignored ------------------------------------------
  const beforeMouse = await activeIndex(page);
  await page.mouse.move(stage.x + stage.width * 0.7, stage.y + stage.height / 2);
  await page.mouse.down();
  await page.mouse.move(stage.x + stage.width * 0.2, stage.y + stage.height / 2, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(350);
  check("a mouse drag does not change the photograph",
    (await activeIndex(page)) === beforeMouse);
  if ((await page.locator(".zoom").count()) === 1) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(350);
  }

  // --- the page still scrolls with a finger on the photograph -----------
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  const y0 = await page.evaluate(() => window.scrollY);
  await page.mouse.move(stage.x + stage.width / 2, stage.y + stage.height / 2);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(350);
  const y1 = await page.evaluate(() => window.scrollY);
  check("vertical wheel over the photograph still scrolls the page", y1 > y0 + 50,
    `${y0} → ${y1}`);

  // --- the rail keeps up -------------------------------------------------
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(300);
  // walk to the last photograph via the rail's own keyboard path
  await page.evaluate((n) => {
    const rail = document.querySelector(".gallery-rail");
    rail.querySelectorAll("button")[n - 1].click();
  }, count);
  /* scroll-behavior: smooth means the rail is still travelling; measuring
     before it lands reads the fade of the position it is leaving. */
  await page.waitForTimeout(1200);
  const railState = await page.evaluate(() => {
    const rail = document.querySelector(".gallery-rail");
    const active = rail.querySelector(".gallery-thumb.is-active");
    const rr = rail.getBoundingClientRect();
    const ar = active.getBoundingClientRect();
    return {
      overflow: rail.dataset.overflow,
      visible: ar.left >= rr.left - 2 && ar.right <= rr.right + 2,
    };
  });
  check("active thumbnail is scrolled into view", railState.visible);
  /* At the LAST thumbnail the hidden content is behind us, so the fade must be
     on the leading edge — a trailing fade there would dim the thumbnail just
     selected. */
  check("fade marks the edge that actually has more", railState.overflow === "start",
    String(railState.overflow));
};

const main = async () => {
  const browser = await chromium.launch({ executablePath: CHROME_PATH });
  const page = await browser.newPage({ hasTouch: true });
  try {
    await run(page, 390, 844, "phone");
    await run(page, 1440, 900, "desktop");
  } finally {
    await browser.close();
  }
  console.log(failures === 0 ? "\nPASS — all checks" : `\nFAIL — ${failures}`);
  process.exit(failures === 0 ? 0 : 1);
};

main();
