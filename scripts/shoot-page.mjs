/**
 * Capture a whole page as a sequence of full viewports.
 *
 * Not fullPage and not stitched: the ground is fixed and scroll-driven, so a
 * composite made from slices at different scroll positions shows seams that do
 * not exist (CLAUDE.md §19). Each frame here is one real screen.
 */
import { chromium } from "playwright-core";
import { skipIntro } from "./lib/no-intro.mjs";
import { mkdirSync } from "node:fs";

/* Git Bash rewrites a bare "/fr/mrirt" argument into a Windows path before
   node ever sees it, so callers pass "fr/mrirt" and the slash is added here. */
const PATHNAME = "/" + (process.argv[2] ?? "fr/mrirt").replace(/^\/+/, "");
const OUT = process.argv[3] ?? "shots/page";
const PHONE = process.argv[4] === "phone";
const viewport = PHONE ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport });
await skipIntro(page);
await page.goto(`http://localhost:3111${PATHNAME}`, { waitUntil: "load" });

await page.evaluate(async () => {
  const step = window.innerHeight * 0.7;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 140));
  }
});
await page.waitForTimeout(1800);

const max = await page.evaluate(
  () => document.documentElement.scrollHeight - window.innerHeight,
);
const screens = Math.max(1, Math.ceil(max / viewport.height) + 1);
for (let i = 0; i < screens; i++) {
  const y = Math.min(max, i * viewport.height);
  await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y);
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${OUT}/${String(i).padStart(2, "0")}.png` });
}
/* Anything captured is also checked for the two failures a screenshot hides:
   a page wider than its viewport, and an element left transparent because its
   reveal never fired. */
const health = await page.evaluate(() => ({
  overflowPx: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  unrevealed: [...document.querySelectorAll(".reveal")].filter(
    (el) => +getComputedStyle(el).opacity < 0.05,
  ).length,
  missingAlt: [...document.querySelectorAll("img")].filter(
    (i) => i.alt === null || i.alt === undefined,
  ).length,
}));

console.log(
  `${PATHNAME} ${PHONE ? "phone" : "desktop"}: ${max + viewport.height}px, ${screens} screens · ` +
    `overflow ${health.overflowPx}px · ${health.unrevealed} unrevealed · ${health.missingAlt} missing alt`,
);
await browser.close();
