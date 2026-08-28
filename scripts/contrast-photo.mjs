/**
 * Contrast check for text sitting on a photograph.
 *
 * scripts/contrast-scroll.mjs measures against the page ground, which is right
 * everywhere except the hero — there the text sits on an image and a scrim, and
 * the ground is irrelevant.
 *
 * Method: record every text box, then screenshot the hero with the text HIDDEN
 * and read the pixels that were behind it. Sampling inside a visible text box
 * does not work — the glyphs are in the sample, so the darkest "background"
 * pixel found is the text itself and everything scores about 1.0:1.
 *
 * Reports the worst case, not the average: a headline that clears on the
 * shadowed half and fails on the lit half is a failing headline.
 *
 * Usage: node scripts/contrast-photo.mjs [url]
 */
import { chromium } from "playwright-core";

const URL = process.argv[2] || "http://localhost:3111/fr";
const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
let failures = 0;

for (const [label, width, height] of [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(URL, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(6500); // intro finishes, images decode

  // 1. Record each text box and its colour, then hide the text.
  /**
   * Take the dev overlay off the page first.
   *
   * next dev paints a fixed badge in the bottom-left corner. It lands straight
   * on the hero cue at phone width, and because this script reports the WORST
   * pixel behind a text box it reads the badge as the background and returns
   * something like 1.06:1 for text that is perfectly legible. That false
   * failure has now been chased twice (CLAUDE.md notes the first time), so the
   * overlay is removed rather than worked around.
   */
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("nextjs-portal, #__next-build-watcher")) {
      el.remove();
    }
  });

  const boxes = await page.evaluate(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return [];
    const parse = (c) => (c.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);

    /**
     * The header is included deliberately. It floats at the top of the hero, so
     * whatever is behind it is the photograph — and an earlier version checked
     * only `.hero` descendants, which let a transparent header put ink nav
     * straight onto a dark carved door without a single test failing.
     */
    const header = document.querySelector(".site-header");
    const scope = header ? [hero, header] : [hero];

    const nodes = scope.flatMap((root) =>
      [...root.querySelectorAll("h1, h2, p, a, span, button")].filter(
        (el) => (el.textContent || "").trim().length > 1 && !el.querySelector("h1,h2,p,a,span"),
      ),
    );

    const out = [];
    for (const el of nodes) {
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4 || r.top > window.innerHeight) continue;
      const cs = getComputedStyle(el);
      /**
       * `visibility: hidden` keeps its geometry.
       *
       * The nav panel is closed with `visibility` rather than `display` or the
       * `hidden` attribute, because those cannot be transitioned — so its links
       * still report a real box while being invisible and out of the tab order.
       * Measuring them reported four confident failures for text nobody can
       * see. contrast-scroll.mjs has always skipped these; these two did not.
       */
      if (cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
      const size = parseFloat(cs.fontSize);
      const weight = Number(cs.fontWeight) || 400;
      out.push({
        text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 34),
        rect: { x: r.left, y: r.top, w: r.width, h: r.height },
        fg: parse(cs.color),
        size: Math.round(size),
        need: size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5,
      });
      el.style.visibility = "hidden";
    }
    return out;
  });

  const shot = (await page.screenshot({ type: "png" })).toString("base64");

  // 2. Measure what was behind each box.
  const results = await page.evaluate(
    async ({ b64, boxes }) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const scale = img.width / window.innerWidth;

      const lum = (r, g, b) => {
        const a = [r, g, b].map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
      };
      const ratio = (a, b) => {
        const [x, y] = [a, b].sort((m, n) => n - m);
        return (x + 0.05) / (y + 0.05);
      };

      return boxes.map((b) => {
        const fgL = lum(...b.fg);
        const px = ctx.getImageData(
          Math.max(0, Math.round(b.rect.x * scale)),
          Math.max(0, Math.round(b.rect.y * scale)),
          Math.max(1, Math.round(b.rect.w * scale)),
          Math.max(1, Math.round(b.rect.h * scale)),
        ).data;

        let worst = Infinity;
        for (let i = 0; i < px.length; i += 4 * 5) {
          const c = ratio(fgL, lum(px[i], px[i + 1], px[i + 2]));
          if (c < worst) worst = c;
        }
        return { ...b, ratio: +worst.toFixed(2), pass: worst >= b.need };
      });
    },
    { b64: shot, boxes },
  );

  console.log(`\n${label} ${width}x${height} — hero text on the photograph:`);
  for (const r of results) {
    if (!r.pass) failures += 1;
    console.log(
      `  ${r.pass ? "PASS" : "FAIL"}  ${r.ratio}:1 (needs ${r.need}, ${r.size}px)  "${r.text}"`,
    );
  }
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} failing` : "\nall hero text clears on the photograph");
process.exit(failures ? 1 : 0);
