/** Capture the Mrirt section alone, desktop and phone. */
import { chromium } from "playwright-core";
import { skipIntro } from "./lib/no-intro.mjs";
import { mkdirSync } from "node:fs";

const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
mkdirSync("shots/rugs", { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true });

for (const [name, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["phone", { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport });
  await skipIntro(page);
  await page.goto("http://localhost:3111/fr", { waitUntil: "load" });

  // Walk the page so every reveal fires, then come back and settle.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 130));
    }
  });
  await page.waitForTimeout(1800);

  /* The section runs taller than a screen. Grow the viewport to fit it rather
     than stitching: the ground is fixed and scroll-driven, so slices taken at
     different scroll positions would carry different ground colours and show
     seams that do not exist (CLAUDE.md §19). */
  const height = await page.evaluate(
    () => Math.ceil(document.querySelector(".rugs").getBoundingClientRect().height),
  );
  await page.setViewportSize({ width: viewport.width, height: height + 40 });
  await page.waitForTimeout(500);

  await page.evaluate(() => {
    const r = document.querySelector(".rugs").getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + r.top - 20, behavior: "instant" });
  });
  await page.waitForTimeout(800);

  const clip = await page.evaluate(() => {
    const r = document.querySelector(".rugs").getBoundingClientRect();
    return { x: 0, y: Math.max(0, r.y), width: window.innerWidth, height: Math.ceil(r.height) };
  });
  await page.screenshot({ path: `shots/rugs/${name}.png`, clip });
  console.log(`${name}: section ${height}px tall = ${(height / viewport.height).toFixed(2)} screens`);
  await page.close();
}
await browser.close();
