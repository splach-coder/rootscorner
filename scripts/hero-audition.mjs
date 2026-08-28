/**
 * Audition hero photographs against the real renderer.
 *
 * Swaps the hero image at runtime, then measures every piece of hero and header
 * text against the pixels actually behind it — the same hidden-text method as
 * scripts/contrast-photo.mjs.
 *
 * This exists because modelling the crop offline in Python disagreed with the
 * browser by a factor of three on one candidate (predicted 5.98:1, rendered
 * 1.63:1) and nearly shipped an unreadable hero. Shortlist by eye, decide here.
 *
 * Usage: node scripts/hero-audition.mjs [scrim] [url]
 *   scrim: "on" (default) or "off"
 */
import { chromium } from "playwright-core";

const SCRIM = (process.argv[2] || "on") !== "off";
const URL = process.argv[3] || "http://localhost:3111/fr";
const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const CANDIDATES = [
  "dogon-tribal-staff-01.jpg",
  "dogon-tribal-staff-03.jpg",
  "handcrafted-wood-stool---cote-d-ivoire-02.jpg",
  "hand-carved-tribal-stool-wood-02.jpg",
  "turtle-shaped-indonesia-03.jpg",
  "lombok-weel-indonesian-04.jpg",
  "loom-beater-african-art-02.jpg",
  "baule-chair-cote-d-ivoire-04.jpg",
  "hand-carved-tribal-stool-wood-08.jpg",
  "solid-wood-pedestal-bowl---ethiopian-and-west-african-craftsmanship-1-01.jpg",
];

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

for (const [label, width, height] of [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(URL, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(6500);

  console.log(`\n=== ${label} ${width}x${height}  scrim ${SCRIM ? "on" : "off"} ===`);

  for (const file of CANDIDATES) {
    await page.evaluate(
      async ({ file, scrim }) => {
        const img = document.querySelector(".hero-media img");
        img.removeAttribute("srcset");
        img.removeAttribute("sizes");
        img.src = "/pieces/" + file;
        await img.decode().catch(() => {});
        const hero = document.querySelector(".hero");
        hero.dataset.scrim = scrim ? "on" : "off";
        // Restore any text hidden by a previous round.
        for (const el of document.querySelectorAll("[data-was-hidden]")) {
          el.style.visibility = "";
          el.removeAttribute("data-was-hidden");
        }
      },
      { file, scrim: SCRIM },
    );
    await page.waitForTimeout(500);

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
      const parse = (c) => (c.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
      const roots = [document.querySelector(".hero"), document.querySelector(".site-header")];
      const nodes = roots.filter(Boolean).flatMap((root) =>
        [...root.querySelectorAll("h1,h2,p,a,span,button")].filter(
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
          text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 24),
          rect: { x: r.left, y: r.top, w: r.width, h: r.height },
          fg: parse(cs.color),
          need: size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5,
        });
        el.style.visibility = "hidden";
        el.setAttribute("data-was-hidden", "");
      }
      return out;
    });

    const shot = (await page.screenshot({ type: "png" })).toString("base64");

    const scored = await page.evaluate(
      async ({ b64, boxes }) => {
        const img = new Image();
        img.src = "data:image/png;base64," + b64;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext("2d", { willReadFrequently: true });
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
            const v = ratio(fgL, lum(px[i], px[i + 1], px[i + 2]));
            if (v < worst) worst = v;
          }
          return { text: b.text, need: b.need, ratio: +worst.toFixed(2) };
        });
      },
      { b64: shot, boxes },
    );

    const fails = scored.filter((r) => r.ratio < r.need);
    const margin = Math.min(...scored.map((r) => r.ratio - r.need));
    console.log(
      `  ${fails.length === 0 ? "PASS" : "FAIL"}  margin ${margin.toFixed(2).padStart(6)}  ${file}` +
        (fails.length ? `   worst: ${fails.map((f) => `${f.text} ${f.ratio}/${f.need}`).join(", ")}` : ""),
    );
  }

  await page.close();
}

await browser.close();
