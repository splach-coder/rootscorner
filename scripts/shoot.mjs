/**
 * Screenshot the running site at desktop and phone widths.
 *
 * Usage: node scripts/shoot.mjs <out-dir> [url]
 *
 * Captures by scrolling a fixed viewport and stitching the slices, rather than
 * Playwright's fullPage mode. fullPage resizes the viewport to the height of
 * the document, which makes the hero's `100svh` expand to the whole page and
 * the capture come back wrong. Stitching keeps viewport units honest.
 *
 * The page is scrolled through once before capture so every reveal has fired.
 */
import { chromium } from "playwright-core";
import { skipIntro } from "./lib/no-intro.mjs";
import { writeFile } from "node:fs/promises";

const OUT = process.argv[2];
const URL = process.argv[3] || "http://localhost:3111/fr";
const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

if (!OUT) {
  console.error("usage: node scripts/shoot.mjs <out-dir> [url]");
  process.exit(1);
}

const VIEWPORTS = [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
];

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
});

for (const [name, width, height] of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2,
  });
  await skipIntro(page);
await page.goto(URL, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1200);

  // Walk the page so IntersectionObservers fire and images decode.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      // NOTE: the site sets `html { scroll-behavior: smooth }`, so a plain
      // window.scrollTo ANIMATES. Stepping faster than the animation leaves the
      // page far behind the requested position — it never reaches the bottom and
      // content below is reported as never revealed. Always scroll instantly here.
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 240));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 800));
  });
  await page.waitForTimeout(900);

  await page.screenshot({ path: `${OUT}/${name}-hero.png` });

  const docHeight = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  const slices = [];
  for (let y = 0; y < docHeight; y += height) {
    const target = Math.min(y, docHeight - height);
    await page.evaluate((v) => window.scrollTo(0, v), target);
    await page.waitForTimeout(320);
    // The fixed header would print into every slice; hide it after the first.
    if (target > 0) {
      await page.evaluate(() => {
        const h = document.querySelector(".site-header");
        if (h) h.style.visibility = "hidden";
      });
    }
    slices.push({ top: target, buffer: await page.screenshot() });
  }

  await writeFile(
    `${OUT}/${name}-slices.json`,
    JSON.stringify({ width, height, docHeight, count: slices.length }),
  );
  for (const [i, s] of slices.entries()) {
    await writeFile(
      `${OUT}/${name}-slice-${String(i).padStart(2, "0")}.png`,
      s.buffer,
    );
  }

  console.log(
    `${name}  ${width}x${height}  doc ${docHeight}px  ${slices.length} slices`,
  );
  await page.close();
}

await browser.close();
