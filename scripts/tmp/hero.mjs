import { chromium } from "playwright-core";
import { skipIntro } from "../lib/no-intro.mjs";
import { mkdir } from "node:fs/promises";
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
await mkdir("shots/hero", { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const [name, w, h] of [["phone", 390, 844], ["desktop", 1440, 900]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await skipIntro(page);
  await page.goto("http://localhost:3111/en", { waitUntil: "load" });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `shots/hero/${name}.png` });
  console.log(name, await page.evaluate(() => {
    const pick = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); const c = getComputedStyle(e);
      return { top: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width), size: c.fontSize, lh: c.lineHeight, text: (e.textContent||"").trim().slice(0,28) }; };
    return { plate: pick(".hero-plate"), title: pick(".hero-title"), tagline: pick(".hero-tagline"), intro: pick(".hero-intro"), cue: pick(".hero-cue") };
  }));
  await page.close();
}
await browser.close();
