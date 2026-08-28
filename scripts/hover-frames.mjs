/**
 * Capture a piece resting, mid-crossfade and hovered, to check the second look.
 * Usage: node scripts/hover-frames.mjs <out-dir>
 */
import { chromium } from "playwright-core";

const OUT = process.argv[2];
const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3111/fr", { waitUntil: "load" });
await page.waitForTimeout(6000); // wait out the intro veil

// Bring the card fully into view and let every reveal finish BEFORE measuring.
// Playwright's .hover() scrolls the target into view itself, so if the card is
// only partly visible the page shifts between shots and the crop appears to
// change size — an artifact, not a layout bug.
await page.evaluate(() =>
  document
    .querySelectorAll(".hang-item")[2]
    .scrollIntoView({ block: "center", behavior: "instant" }),
);
await page.waitForTimeout(2600); // reveals are 1100ms plus stagger

const card = page.locator(".hang-item").nth(2); // the Baule chair
const box = await card.boundingBox();
const clip = { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 620) };

await page.screenshot({ path: `${OUT}/rest.png`, clip });
// A real pointer move: card.hover() scrolls the target into view, which shifts
// the page between shots and makes the crop look like it changed size.
const cb = await card.boundingBox();
await page.mouse.move(cb.x + cb.width / 2, cb.y + 100);
await page.waitForTimeout(430); // the dissolve passes 50% here
await page.screenshot({ path: `${OUT}/mid.png`, clip });
await page.waitForTimeout(1400);
await page.screenshot({ path: `${OUT}/hover.png`, clip });

const state = await page.evaluate(() => {
  const swap = document.querySelectorAll(".hang-item")[2].querySelector(".is-swap");
  const base = document.querySelectorAll(".hang-item")[2].querySelector("img");
  return {
    swapExists: !!swap,
    swapOpacity: swap ? getComputedStyle(swap).opacity : null,
    baseOpacity: getComputedStyle(base).opacity,
  };
});
console.log("while hovered:", state);
await browser.close();
