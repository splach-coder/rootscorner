/**
 * Contrast check for the scroll-driven ground.
 *
 * The ground colour changes with scroll position, so a text element that reads
 * fine when centred can be unreadable as it enters the viewport. This walks the
 * page and, at every step, checks each *visible* text element against the
 * ground colour at that moment.
 *
 * Run after changing the STOPS in components/Ground.tsx or the section order.
 *
 * Usage: node scripts/contrast-scroll.mjs [url]
 */
import { chromium } from "playwright-core";
import { skipIntro } from "./lib/no-intro.mjs";

const URL = process.argv[2] || "http://localhost:3111/fr";
const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const STEP = 120; // px between samples

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await skipIntro(page);
await page.goto(URL, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(1500);

// Let every reveal fire so nothing is measured at opacity 0.
await page.evaluate(async () => {
  const s = window.innerHeight * 0.7;
  for (let y = 0; y < document.body.scrollHeight; y += s) {
    // NOTE: the site sets `html { scroll-behavior: smooth }`, so a plain
    // window.scrollTo ANIMATES. Stepping faster than the animation leaves the
    // page far behind the requested position — it never reaches the bottom and
    // content below is reported as never revealed. Always scroll instantly here.
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
});
await page.waitForTimeout(1200);

const failures = await page.evaluate(async (step) => {
  const parse = (c) => (c.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
  const lum = (rgb) => {
    const a = rgb.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };

  const nodes = [
    ...document.querySelectorAll("p, h1, h2, h3, a, dt, dd, span, button"),
  ].filter(
    (el) =>
      el.textContent &&
      el.textContent.trim().length > 1 &&
      el.children.length === 0,
  );

  const out = [];
  const seen = new Set();
  const max = document.documentElement.scrollHeight - window.innerHeight;

  for (let y = 0; y <= max; y += step) {
    // NOTE: the site sets `html { scroll-behavior: smooth }`, so a plain
    // window.scrollTo ANIMATES. Stepping faster than the animation leaves the
    // page far behind the requested position — it never reaches the bottom and
    // content below is reported as never revealed. Always scroll instantly here.
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );
    await new Promise((r) => setTimeout(r, 220)); // let the 160ms transition land

    const groundEl = document.querySelector(".ground");
    const ground = parse(getComputedStyle(groundEl).backgroundColor);

    for (const el of nodes) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 8 || r.top > window.innerHeight - 8 || r.height === 0)
        continue;

      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || Number(cs.opacity) < 0.9) continue;

      // Skip anything sitting on a photograph or its own painted panel.
      // The hero is text over an image and a scrim, where the page ground is
      // irrelevant — scripts/contrast-photo.mjs measures that against the
      // actual rendered pixels instead.
      // .site-footer paints its own night background (it is the only dark
      // block on the site), so the page ground behind it is irrelevant and
      // measuring against it reports a false 1.2:1. scripts/shoot-footer.mjs
      // checks the footer against the colour it actually sits on.
      if (
        el.closest(
          ".hero, .frame, .matter-wall, .rugs-frame, .site-header, .site-footer",
        )
      )
        continue;

      /**
       * Measure against whatever is actually painted behind the text.
       *
       * Everything on this site sits on the page ground, so the ground is
       * almost always the right comparison — but not for an element that
       * paints its own panel, and there is now one: the enquiry form's Send
       * button is solid umber with cream on it. Measured against the light
       * ground that reads as a catastrophic failure and is in fact 9.9:1.
       *
       * So walk up for the nearest opaque background and use it. Falls back to
       * the ground, which is the case for all but a handful of nodes.
       *
       * The walk STOPS BELOW <body>. body carries a dark colour as the no-JS
       * fallback for the night hours, and the fixed .ground element covers it
       * entirely — so treating it as "what is painted behind" reports every
       * piece label on the site as cream-on-dark and fails the whole page.
       */
      let behind = ground;
      for (let node = el; node && node !== document.body; node = node.parentElement) {
        const bg = getComputedStyle(node).backgroundColor;
        const parts = parse(bg);
        const alpha = /rgba/.test(bg) ? Number(bg.split(",")[3]) : 1;
        if (parts.length === 3 && alpha > 0.85) {
          behind = parts;
          break;
        }
      }

      const fg = parse(cs.color);
      const size = parseFloat(cs.fontSize);
      const weight = Number(cs.fontWeight) || 400;
      const isLarge = size >= 24 || (size >= 18.66 && weight >= 700);
      const need = isLarge ? 3 : 4.5;
      const got = ratio(fg, behind);

      if (got < need) {
        const key = el.textContent.trim().slice(0, 30);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
          text: key,
          scrollY: y,
          ratio: +got.toFixed(2),
          need,
          size: Math.round(size),
          ground: `rgb(${behind.join(",")})`,
        });
      }
    }
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  return out;
}, STEP);

if (failures.length === 0) {
  console.log("contrast across the whole scroll: PASS");
} else {
  console.log(`contrast FAILURES: ${failures.length}`);
  for (const f of failures) {
    console.log(
      `  "${f.text}"  at scrollY ${f.scrollY}  ${f.ratio}:1 (needs ${f.need}, ${f.size}px) on ${f.ground}`,
    );
  }
}

await browser.close();
process.exit(failures.length ? 1 : 0);
