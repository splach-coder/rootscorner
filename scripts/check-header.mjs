import { chromium } from "playwright-core";
import { skipIntro } from "./lib/no-intro.mjs";
const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = process.argv[2];
const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
await skipIntro(page);
await page.goto("http://localhost:3111/fr", { waitUntil: "load" });
await page.waitForTimeout(1200);
for (const [label, sel] of [
  ["dusk", ".invitation"],
  ["night", "footer"],
]) {
  await page.evaluate(
    (s) =>
      document
        .querySelector(s)
        .scrollIntoView({ block: "start", behavior: "instant" }),
    sel,
  );
  await page.waitForTimeout(1400);
  const cls = await page.evaluate(
    () => document.querySelector(".site-header").className,
  );
  console.log(`${label}: header class = "${cls}"`);
  await page.screenshot({
    path: `${OUT}/header-${label}.png`,
    clip: { x: 0, y: 0, width: 1440, height: 90 },
  });
}
await browser.close();
