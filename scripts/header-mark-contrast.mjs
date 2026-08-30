/**
 * Contrast of the header LOCKUP against whatever is behind it.
 *
 * No text-contrast script can see a logo: contrast-photo.mjs and
 * contrast-scroll.mjs both collect text nodes, and the header mark is an SVG.
 * §38 records the same blind spot for the phone hero title, which is why
 * hero-mark-contrast.mjs exists; this is that check for the bar.
 *
 * It samples the pixels behind the mark's box with the mark hidden, and scores
 * the mark's colour against the WORST pixel found — not the average. An average
 * passes happily over a lamp.
 *
 * Usage: node scripts/header-mark-contrast.mjs [url]
 */
import { chromium } from "playwright-core";
import { skipIntro } from "./lib/no-intro.mjs";

const URL = process.argv[2] || "http://localhost:3111/fr";
const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const lum = ([r, g, b]) => {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const parse = (s) => s.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
let bad = 0;

for (const [name, width, height] of [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await skipIntro(page);
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);

  // The dev badge is a fixed element that lands on the bar at phone width and
  // would be read as the background (§28). It is not part of the page.
  await page.evaluate(() => document.querySelector("nextjs-portal")?.remove());

  const marks = await page.evaluate(() =>
    [".site-header-picto", ".site-header-lockup"]
      .map((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const st = getComputedStyle(el);
        if (st.display === "none" || st.visibility === "hidden" || +st.opacity === 0)
          return null;
        const b = el.getBoundingClientRect();
        if (b.width < 1 || b.height < 1) return null;
        return {
          sel,
          color: st.color,
          box: { x: b.x, y: b.y, width: b.width, height: b.height },
        };
      })
      .filter(Boolean),
  );

  // Hide the marks and photograph what was behind them.
  await page.evaluate(() =>
    document
      .querySelectorAll(".site-header-picto, .site-header-lockup")
      .forEach((el) => (el.style.visibility = "hidden")),
  );
  await page.waitForTimeout(120);

  console.log(`\n${name} ${width}x${height} — header mark on its ground:`);

  for (const m of marks) {
    const clip = {
      x: Math.max(0, Math.floor(m.box.x)),
      y: Math.max(0, Math.floor(m.box.y)),
      width: Math.max(1, Math.ceil(m.box.width)),
      height: Math.max(1, Math.ceil(m.box.height)),
    };
    const buf = await page.screenshot({ clip });
    const worst = await page.evaluate(
      ([b64, w, h, fg]) =>
        new Promise((res) => {
          const img = new Image();
          img.onload = () => {
            const c = document.createElement("canvas");
            c.width = w;
            c.height = h;
            const g = c.getContext("2d");
            g.drawImage(img, 0, 0);
            const d = g.getImageData(0, 0, w, h).data;
            let lo = Infinity;
            let px = null;
            const L = ([r, gg, bb]) => {
              const f = (v) => {
                v /= 255;
                return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
              };
              return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(bb);
            };
            const t = fg;
            for (let i = 0; i < d.length; i += 4) {
              const p = [d[i], d[i + 1], d[i + 2]];
              const [hi, lw] = [L(t), L(p)].sort((a, b2) => b2 - a);
              const r2 = (hi + 0.05) / (lw + 0.05);
              if (r2 < lo) {
                lo = r2;
                px = p;
              }
            }
            res({ ratio: +lo.toFixed(2), pixel: px });
          };
          img.src = "data:image/png;base64," + b64;
        }),
      [buf.toString("base64"), clip.width, clip.height, parse(m.color)],
    );

    // A logo is large-scale graphics: WCAG 1.4.11 non-text contrast wants 3:1.
    const ok = worst.ratio >= 3;
    if (!ok) bad++;
    console.log(
      `  ${ok ? "PASS" : "FAIL"}  ${worst.ratio}:1 (needs 3)  ${m.sel}  ` +
        `fg ${m.color} vs worst rgb(${worst.pixel.join(",")})`,
    );
  }
  await page.close();
}

await browser.close();
console.log(
  bad === 0 ? "\nthe header mark clears on its ground" : `\n${bad} FAILING`,
);
process.exit(bad === 0 ? 0 : 1);
