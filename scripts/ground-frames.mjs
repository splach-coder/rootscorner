/**
 * Capture whole viewports across the descent.
 *
 * The ground is scroll-linked, so a stitched full-page composite cannot show it
 * — each slice is captured at a different scroll position and therefore a
 * different ground colour, which produces edges that do not exist in use.
 * These are real screens instead.
 */
import { chromium } from "playwright-core";
import { skipIntro } from "./lib/no-intro.mjs";

const OUT = process.argv[2];
const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await skipIntro(page);
await page.goto("http://localhost:3111/fr", { waitUntil: "load" });
await page.waitForTimeout(1200);

await page.evaluate(async () => {
  const s = window.innerHeight * 0.7;
  for (let y = 0; y < document.body.scrollHeight; y += s) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 140));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
});
await page.waitForTimeout(1200);

const max = await page.evaluate(
  () => document.documentElement.scrollHeight - window.innerHeight,
);

for (const p of [0.8, 0.86, 0.9, 0.94, 1.0]) {
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    Math.round(max * p),
  );
  await page.waitForTimeout(600);
  const ground = await page.evaluate(
    () => getComputedStyle(document.querySelector(".ground")).backgroundColor,
  );
  await page.screenshot({ path: `${OUT}/p${String(Math.round(p * 100))}.png` });
  console.log(`progress ${p.toFixed(2)}  ground ${ground}`);
}

await browser.close();
