/**
 * The intro's job is to be absent correctly.
 *
 * It must not run twice in a session, must not run under reduced motion, and
 * must never be able to leave the page scroll-locked or a section invisible.
 */
import { chromium } from "playwright-core";

const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath: CHROME, headless: true });

const state = (page) =>
  page.evaluate(() => ({
    intro: document.documentElement.dataset.intro ?? "(absent)",
    veil: getComputedStyle(document.querySelector(".intro")).display,
    scrollLocked: getComputedStyle(document.body).overflow === "hidden",
    pictoOpacity: +getComputedStyle(document.querySelector("[data-mark-target]")).opacity,
    pictoAnim: getComputedStyle(document.querySelector("[data-mark-target]")).animationName,
    invisible: [...document.querySelectorAll("body *")]
      .filter((el) => {
        const s = getComputedStyle(el);
        return (
          s.display !== "none" &&
          s.visibility !== "hidden" &&
          +s.opacity < 0.05 &&
          el.getBoundingClientRect().width > 0
        );
      })
      .map((el) => el.className?.baseVal ?? el.className ?? el.tagName),
  }));

const settle = (page) =>
  page
    .waitForFunction(() => document.documentElement.dataset.intro !== "run", { timeout: 9000 })
    .catch(() => {})
    .then(() => page.waitForTimeout(500));

/* --- 1. first visit, then a reload in the same session --- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3111/fr", { waitUntil: "load" });
  await settle(page);
  console.log("first visit   ", JSON.stringify(await state(page)));

  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(600);
  console.log("same session  ", JSON.stringify(await state(page)));
  await page.close();
}

/* --- 2. reduced motion: the intro must not exist at all --- */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3111/fr?intro", { waitUntil: "load" });
  await page.waitForTimeout(700);
  console.log("reduced motion", JSON.stringify(await state(page)));
  await ctx.close();
}

/* --- 3. phone --- */
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("http://localhost:3111/fr?intro", { waitUntil: "load" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "shots/intro/phone-write.png" });
  await settle(page);
  await page.screenshot({ path: "shots/intro/phone-done.png" });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  console.log("phone         ", JSON.stringify({ ...(await state(page)), overflowPx: overflow }));
  await page.close();
}

/* --- 4. no JavaScript: the veil must never paint --- */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3111/fr?intro", { waitUntil: "load" });
  console.log(
    "no js         ",
    JSON.stringify(
      await page.evaluate(() => ({
        veil: getComputedStyle(document.querySelector(".intro")).display,
        scrollLocked: getComputedStyle(document.body).overflow === "hidden",
        pictoOpacity: +getComputedStyle(document.querySelector("[data-mark-target]")).opacity,
      })),
    ),
  );
  await ctx.close();
}

await browser.close();
