/**
 * The mobile hero title is artwork now, not text, so no text-contrast script
 * sees it. Sample the photograph under its box and measure cream against the
 * WORST pixel there, not the average — an average passes happily over a lamp.
 */
import { chromium } from "playwright-core";
import { skipIntro } from "./lib/no-intro.mjs";
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath: CHROME, headless: true });

for (const locale of ["en", "fr"]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await skipIntro(page);
  await page.goto(`http://localhost:3111/${locale}`, { waitUntil: "load" });
  await page.waitForTimeout(2200);

  const box = await page.evaluate(() => {
    const el = document.querySelector(".hero-title-mark");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const fill = getComputedStyle(el).color;
    el.style.visibility = "hidden";
    return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height), fill };
  });
  if (!box) { console.log(locale, "no mark (desktop-only rule?)"); await page.close(); continue; }

  const shot = await page.screenshot({ clip: { x: box.x, y: box.y, width: box.width, height: box.height } });
  await page.evaluate(() => { document.querySelector(".hero-title-mark").style.visibility = ""; });

  const stats = await page.evaluate(async ({ data, fill }) => {
    const img = new Image();
    img.src = "data:image/png;base64," + data;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const px = ctx.getImageData(0, 0, c.width, c.height).data;
    const lum = ([r, g, b]) => {
      const a = [r, g, b].map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    };
    const fg = lum(fill.match(/\d+/g).slice(0, 3).map(Number));
    let worst = Infinity, worstPx = null;
    for (let i = 0; i < px.length; i += 4) {
      const bg = lum([px[i], px[i + 1], px[i + 2]]);
      const [hi, lo] = [fg, bg].sort((m, n) => n - m);
      const ratio = (hi + 0.05) / (lo + 0.05);
      if (ratio < worst) { worst = ratio; worstPx = [px[i], px[i + 1], px[i + 2]]; }
    }
    return { worst: +worst.toFixed(2), worstPx };
  }, { data: shot.toString("base64"), fill: box.fill });

  // Large text: WCAG asks 3:1. This lettering is far larger than 24px.
  console.log(`${locale}  worst ${stats.worst}:1 (large text needs 3)  on rgb(${stats.worstPx})  ${stats.worst >= 3 ? "PASS" : "FAIL"}`);
  await page.close();
}
await browser.close();
