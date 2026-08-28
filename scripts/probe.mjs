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
await page.waitForTimeout(1500);
const boxes = await page.evaluate(() =>
  [...document.querySelectorAll("main > section, footer")].map((el) => {
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      cls: el.className.slice(0, 46),
      top: Math.round(r.top + scrollY),
      h: Math.round(r.height),
    };
  }),
);
console.log(
  "doc height:",
  await page.evaluate(() => document.documentElement.scrollHeight),
);
for (const b of boxes)
  console.log(
    `  ${String(b.top).padStart(6)}  h=${String(b.h).padStart(5)}  ${b.tag}  ${b.cls}`,
  );
// capture the footer region directly
await page.evaluate(() =>
  document.querySelector("footer").scrollIntoView({ block: "end" }),
);
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/footer.png` });
await browser.close();
