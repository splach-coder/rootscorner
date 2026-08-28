/** Quick look at the live dev page. node scripts/look.mjs <out> [path] [w] [h] */
import { chromium } from "playwright-core";
const [OUT, path = "/fr", w = "1440", h = "900"] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto("http://localhost:3111" + path, { waitUntil: "load" });
await p.waitForTimeout(7000);
await p.screenshot({ path: `${OUT}/shot.png` });
await b.close();
