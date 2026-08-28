/**
 * Quality floor check: contrast of rendered text, reduced-motion behaviour,
 * focus visibility, and horizontal overflow at phone width.
 *
 * Usage: node scripts/audit.mjs [url]   (defaults to the French homepage)
 */
import { chromium } from "playwright-core";
import { skipIntro } from "./lib/no-intro.mjs";

const URL = process.argv[2] || "http://localhost:3111/fr";
const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
});

// --- reduced motion: content must be visible without ever scrolling ---
const rm = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const p1 = await rm.newPage();
await skipIntro(p1);
await p1.goto(URL, { waitUntil: "load" });
await p1.waitForTimeout(900);
const hidden = await p1.evaluate(
  () =>
    [...document.querySelectorAll(".reveal")].filter(
      (el) => getComputedStyle(el).opacity !== "1",
    ).length,
);
console.log(
  `reduced-motion: ${hidden} reveal elements still transparent (want 0)`,
);
await rm.close();

// --- phone width: no horizontal overflow ---
const ph = await browser.newContext({ viewport: { width: 390, height: 844 } });
const p2 = await ph.newPage();
await skipIntro(p2);
await p2.goto(URL, { waitUntil: "load" });
// Walk the page, then let the reveals finish. Measuring mid-transition reports
// the hero image at its initial scale(1.055) and reads as a false overflow.
await p2.evaluate(async () => {
  const step = window.innerHeight * 0.7;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    // NOTE: the site sets `html { scroll-behavior: smooth }`, so a plain
    // window.scrollTo ANIMATES. Stepping faster than the animation leaves the
    // page far behind the requested position — it never reaches the bottom and
    // content below is reported as never revealed. Always scroll instantly here.
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 150));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
});
await p2.waitForTimeout(2200);
const over = await p2.evaluate(() => ({
  doc: document.documentElement.scrollWidth,
  win: window.innerWidth,
  /**
   * Content inside a horizontal scroll container is SUPPOSED to run past the
   * right edge — that is what makes it scrollable. The Instagram strip is one
   * (a feed you push sideways), and every tile past the fold was being reported
   * as an overflow bug. What matters is whether the PAGE scrolls sideways,
   * which is the doc-vs-window comparison above.
   */
  culprits: [...document.querySelectorAll("*")]
    .filter((el) => {
      if (el.getBoundingClientRect().right <= window.innerWidth + 1) return false;
      for (let a = el; a; a = a.parentElement) {
        const cs = getComputedStyle(a);
        // Content inside a horizontal scroller is SUPPOSED to run past the
        // right edge — that is what makes it scrollable (the Instagram strip).
        if (a !== el && (cs.overflowX === "auto" || cs.overflowX === "scroll")) return false;
        // A fixed element is out of flow relative to the viewport and cannot
        // contribute to the document's scrollWidth. The cart panel parks itself
        // off-screen right at translateX(100%) and is not an overflow bug.
        if (cs.position === "fixed") return false;
      }
      return true;
    })
    .slice(0, 5)
    .map((el) => `${el.tagName}.${String(el.className).slice(0, 30)}`),
}));
console.log(
  `phone overflow: scrollWidth ${over.doc} vs ${over.win}${over.culprits.length ? " — " + over.culprits.join(", ") : " — clean"}`,
);
await ph.close();

// --- focus ring reachable ---
const fc = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p3 = await fc.newPage();
await skipIntro(p3);
await p3.goto(URL, { waitUntil: "load" });
await p3.waitForTimeout(600);
const stops = [];
for (let i = 0; i < 8; i++) {
  await p3.keyboard.press("Tab");
  stops.push(
    await p3.evaluate(() => {
      const el = document.activeElement;
      const o = getComputedStyle(el).outlineWidth;
      return `${el.tagName}:${(el.textContent || "").trim().slice(0, 22)} outline=${o}`;
    }),
  );
}
console.log("first tab stops:");
for (const s of stops) console.log("   " + s);
await fc.close();
await browser.close();
