import { chromium } from "playwright-core";
import { skipIntro } from "../lib/no-intro.mjs";
import { mkdir } from "node:fs/promises";
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
await mkdir("shots/pdf", { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const [name, url, w, h] of [
  ["home", "/fr", 1440, 900],
  ["story", "/fr/story", 1440, 900],
  ["mrirt", "/fr/mrirt", 1440, 900],
  ["contact", "/fr/contact", 1440, 900],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await skipIntro(page);
  await page.goto("http://localhost:3111" + url, { waitUntil: "load" });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `shots/pdf/${name}.png` });
  console.log(name, "doc", await page.evaluate(() => document.documentElement.scrollHeight));
  await page.close();
}
await browser.close();
