/** Measure the lettering's true bounds so the trimmed viewBox is not a guess. */
import { chromium } from "playwright-core";
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.goto("http://localhost:3111/en", { waitUntil: "load" });
await page.waitForTimeout(1500);
console.log(await page.evaluate(() => {
  const svg = document.querySelector(".site-footer-mark");
  if (!svg) return "no footer mark";
  const paths = [...svg.querySelectorAll("path")];
  const letters = paths.slice(1); // everything after the crescent
  const box = letters.reduce((acc, p) => {
    const b = p.getBBox();
    return {
      x1: Math.min(acc.x1, b.x), y1: Math.min(acc.y1, b.y),
      x2: Math.max(acc.x2, b.x + b.width), y2: Math.max(acc.y2, b.y + b.height),
    };
  }, { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity });
  return {
    letteringViewBox: `${box.x1.toFixed(2)} ${box.y1.toFixed(2)} ${(box.x2 - box.x1).toFixed(2)} ${(box.y2 - box.y1).toFixed(2)}`,
    ratio: ((box.x2 - box.x1) / (box.y2 - box.y1)).toFixed(3),
  };
}));
await browser.close();
