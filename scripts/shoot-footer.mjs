/**
 * Capture the footer, desktop and phone.
 *
 * The viewport is grown to the footer's own height rather than stitching: the
 * ground is fixed and scroll-driven, so slices taken at different scroll
 * positions carry different ground colours and show seams that are not there
 * (CLAUDE.md §19).
 */
import { chromium } from "playwright-core";
import { skipIntro } from "./lib/no-intro.mjs";
import { mkdirSync } from "node:fs";

const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = process.argv[2] ?? "shots/footer";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

for (const [name, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["phone", { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport });
  await skipIntro(page);
  await page.goto("http://localhost:3111/fr", { waitUntil: "load" });

  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 130));
    }
  });
  await page.waitForTimeout(1500);

  const height = await page.evaluate(
    () => Math.ceil(document.querySelector(".site-footer").getBoundingClientRect().height),
  );
  await page.setViewportSize({ width: viewport.width, height: height + 60 });
  await page.waitForTimeout(500);
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }),
  );
  await page.waitForTimeout(800);

  const clip = await page.evaluate(() => {
    const r = document.querySelector(".site-footer").getBoundingClientRect();
    return {
      x: 0,
      y: Math.max(0, Math.floor(r.y)),
      width: window.innerWidth,
      height: Math.min(Math.ceil(r.height), window.innerHeight - Math.max(0, Math.floor(r.y))),
    };
  });
  await page.screenshot({ path: `${OUT}/${name}.png`, clip });

  /* Every link in here is 0.7rem label text. Report the real tap heights and
     the contrast each one holds against the night ground, rather than assuming
     small type on a dark band is fine. */
  const report = await page.evaluate(() => {
    const parse = (c) => (c.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
    const lum = (rgb) =>
      rgb
        .map((v) => {
          const x = v / 255;
          return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
        })
        .reduce((a, v, i) => a + [0.2126, 0.7152, 0.0722][i] * v, 0);
    const ratio = (a, b) => {
      const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
      return (x + 0.05) / (y + 0.05);
    };
    // The footer paints its own night background — it is the only dark block
    // on the site, and the scroll-driven ground stops at golden. Reading the
    // ground here reported 1.2:1 for cream text that is actually on #1f1d1b.
    const footerEl = document.querySelector(".site-footer");
    const ground = parse(getComputedStyle(footerEl).backgroundColor);
    const links = [...document.querySelectorAll(".site-footer a")];
    let minTap = Infinity;
    let minRatio = Infinity;
    for (const a of links) {
      minTap = Math.min(minTap, a.getBoundingClientRect().height);
      minRatio = Math.min(minRatio, ratio(parse(getComputedStyle(a).color), ground));
    }
    const text = [...document.querySelectorAll(".site-footer p")];
    let minText = Infinity;
    for (const el of text)
      minText = Math.min(minText, ratio(parse(getComputedStyle(el).color), ground));
    return {
      links: links.length,
      minTap: +minTap.toFixed(1),
      minLinkContrast: +minRatio.toFixed(2),
      minTextContrast: +minText.toFixed(2),
    };
  });

  console.log(
    `${name}: footer ${height}px · ${report.links} links · smallest tap ${report.minTap}px · ` +
      `link contrast ${report.minLinkContrast}:1 · text contrast ${report.minTextContrast}:1`,
  );
  await page.close();
}
await browser.close();
