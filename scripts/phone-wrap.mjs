/**
 * Phone wrap check — finds text that is crammed on a phone (client, 6 Oct:
 * "too much wrapped text … it looks rubbish").
 *
 *   node scripts/phone-wrap.mjs [base]        default http://localhost:3111
 *
 * Loads one page of every kind at 390×844, scrolls it so every reveal has
 * run, and measures every text block (one with its own text, not a wrapper):
 *
 *   SQUEEZED  3+ lines averaging under 16 characters a line — a name broken
 *             into a stack of single words.
 *   NARROW    2+ lines in a box under 120px wide.
 *
 * Prints the offenders grouped by class, with the text, so each can be fixed
 * at its source. Exit code is the number of offenders, capped at 1.
 */
import { chromium } from "playwright-core";
import { skipIntro } from "./lib/no-intro.mjs";

const BASE = process.argv[2] ?? "http://localhost:3111";
const PATHS = [
  "/fr", "/en", "/fr/collection", "/fr/collection/stools", "/fr/piece/dogon-tribal-staff",
  "/fr/piece/solid-wood-pedestal-bowl---ethiopian-and-west-african-craftsmanship-1",
  "/fr/mrirt", "/fr/tapis/mrirt-losanges", "/fr/story", "/fr/stay", "/fr/artisans",
  "/fr/contact", "/fr/faq", "/fr/legal/withdrawal", "/fr/checkout",
];

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
let total = 0;
for (const path of PATHS) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await skipIntro(page);
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForTimeout(800);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(1500);
  const hits = await page.evaluate(() => {
    const out = [];
    const all = document.querySelectorAll("body *:not(script):not(style):not(svg *)");
    for (const el of all) {
      // Text blocks only: an element whose own direct text is non-trivial.
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim();
      if (own.length < 8) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) === 0) continue;
      if (el.closest(".sr-only, [aria-hidden='true'], .site-panel, .consent, .rug-menu-list[hidden]")) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 2 || rect.height === 0) continue;
      // Visually hidden on purpose (the .sr-only technique: a 1px clipped box).
      let hidden = false;
      for (let a = el; a && a !== document.body; a = a.parentElement) {
        const ac = getComputedStyle(a);
        if (ac.clipPath === "inset(50%)" || (a.getBoundingClientRect().width <= 2 && ac.overflow === "hidden")) { hidden = true; break; }
      }
      if (hidden) continue;
      const range = document.createRange();
      range.selectNodeContents(el);
      const tops = [...range.getClientRects()].filter((r) => r.width > 1).map((r) => r.top).sort((a, b) => a - b);
      let lines = tops.length ? 1 : 0;
      for (let i = 1; i < tops.length; i++) if (tops[i] - tops[i - 1] > 6) lines++;
      lines = Math.max(1, lines);
      const text = (el.innerText || own).replace(/\s+/g, " ").trim();
      const perLine = text.length / lines;
      let kind = null;
      if (lines >= 3 && perLine < 16) kind = "SQUEEZED";
      else if (lines >= 2 && rect.width < 120) kind = "NARROW";
      if (!kind) continue;
      const cls = (typeof el.className === "string" ? el.className : "").split(/\s+/).filter(Boolean).slice(0, 3).join(".");
      out.push({ kind, cls: `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`, lines, w: Math.round(rect.width), text: text.slice(0, 60) });
    }
    return out;
  });
  // One line per class per page.
  const seen = new Map();
  for (const h of hits) if (!seen.has(h.cls)) seen.set(h.cls, { ...h, n: hits.filter((x) => x.cls === h.cls).length });
  if (seen.size) {
    console.log(`\n${path}`);
    for (const h of seen.values()) {
      console.log(`  ${h.kind.padEnd(8)} ×${h.n}  ${h.cls}  (${h.lines} lines, ${h.w}px)  “${h.text}”`);
    }
  }
  total += seen.size;
  await page.close();
}
await browser.close();
console.log(`\n${total} cramped text patterns across ${PATHS.length} pages`);
process.exit(total ? 1 : 0);
