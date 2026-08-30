/**
 * Verify the intro, and capture it.
 *
 * Two things can break silently:
 *
 *  1. The write leaves part of the letter unpainted. The mask stroke has to be
 *     wide enough to cover every point of the glyph; if it is not, a sliver of
 *     the crescent never appears and the mark is subtly wrong forever after.
 *  2. The morph misses the header's picto, so the handover at the end jumps.
 *
 * Pass 1 drives the write animation by hand through the Web Animations API —
 * pausing it also stops the sequence, since Intro waits on .finished, which
 * leaves the veil up for as long as the measurement needs. Do NOT test this by
 * cloning the SVG into a data URI: the class that animates the nib lives in the
 * document stylesheet, so the clone renders with no dash at all and reports
 * perfect coverage no matter how narrow the stroke is.
 *
 * Pass 2 runs the whole thing untouched and records where the morph landed.
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const OUT = process.argv[2] ?? "shots/intro";
const PHONE = process.argv[3] === "phone";
const VIEW = PHONE ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = "http://localhost:3111/fr?intro"; // ?intro forces the gate open

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true });

/* ---------------- pass 1: the write, stepped by hand ---------------- */
{
  const page = await browser.newPage({ viewport: VIEW });
  await page.goto(URL, { waitUntil: "commit" });
  // The nib lives inside <defs>, so it is never "visible" — attached is the
  // only state it can reach.
  await page.waitForSelector(".intro-nib", { state: "attached" });

  const dur = await page.evaluate(() => {
    const a = document.querySelector(".intro-nib").getAnimations()[0];
    a.pause();
    a.currentTime = 0;
    return a.effect.getTiming().duration;
  });

  const clip = await page.evaluate(() => {
    const r = document.querySelector(".intro-mark").getBoundingClientRect();
    const pad = 8;
    return {
      x: Math.floor(r.x - pad),
      y: Math.floor(r.y - pad),
      width: Math.ceil(r.width + pad * 2),
      height: Math.ceil(r.height + pad * 2),
    };
  });

  const ink = async () => {
    const buf = await page.screenshot({ clip });
    return buf;
  };

  for (const p of [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1]) {
    await page.evaluate((t) => {
      document.querySelector(".intro-nib").getAnimations()[0].currentTime = t;
    }, p * dur);
    await page.screenshot({ path: `${OUT}/write-${String(Math.round(p * 100)).padStart(3, "0")}.png` });
  }

  /* Written in full vs the same glyph with the mask taken off. */
  const written = await ink();
  await page.evaluate(() => document.querySelector(".intro-mark path[mask]").removeAttribute("mask"));
  const bare = await ink();

  const count = async (buf) => {
    const p = await browser.newPage({ viewport: { width: clip.width, height: clip.height } });
    const n = await p.evaluate(
      ([b64, w, h]) =>
        new Promise((res) => {
          const img = new Image();
          img.onload = () => {
            const c = document.createElement("canvas");
            c.width = w;
            c.height = h;
            const x = c.getContext("2d");
            x.drawImage(img, 0, 0);
            const d = x.getImageData(0, 0, w, h).data;
            let ink = 0;
            // The veil is #f7f5f2; the mark is taupe #6c645d. Anything well
            // below the veil's luminance is ink.
            for (let i = 0; i < d.length; i += 4) if (d[i] < 200) ink++;
            res(ink);
          };
          img.src = "data:image/png;base64," + b64;
        }),
      [buf.toString("base64"), clip.width, clip.height],
    );
    await p.close();
    return n;
  };

  const a = await count(written);
  const b = await count(bare);
  console.log(
    `write coverage: ${a} / ${b} px = ${((a / b) * 100).toFixed(2)}%  ${a >= b ? "(complete)" : "(GAP — widen the nib)"}`,
  );
  await page.close();
}

/* ---------------- pass 2: the real sequence, untouched ---------------- */
{
  const page = await browser.newPage({ viewport: VIEW });

  /* Record the landing at the moment the morph's transition ends — after that
     the veil hides and every rect reads as zero. */
  await page.addInitScript(() => {
    // Sampled every frame and kept, rather than read once on transitionend:
    // once the veil hides, every rect in here reads as zero, and a single
    // event that happens to fire on that frame measures nothing.
    const tick = () => {
      const el = document.querySelector(".intro-mark");
      const t = document.querySelector("[data-mark-target]");
      if (el && t) {
        const a = el.getBoundingClientRect();
        const b = t.getBoundingClientRect();
        if (a.width > 0 && b.width > 0)
          window.__landed = {
            dx: +(a.left + a.width / 2 - (b.left + b.width / 2)).toFixed(2),
            dy: +(a.top + a.height / 2 - (b.top + b.height / 2)).toFixed(2),
            scaleErr: +(a.width / b.width - 1).toFixed(4),
          };
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  const t0 = Date.now();
  await page.goto(URL, { waitUntil: "commit" });

  /* Screenshots cost real time, so each frame records when it was actually
     taken rather than pretending it hit the mark. */
  const taken = [];
  for (const at of [0, 160, 340, 520, 700, 860, 1020, 1240, 1500, 1800, 2200]) {
    const wait = at - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    const real = Date.now() - t0;
    await page.screenshot({ path: `${OUT}/t-${String(at).padStart(4, "0")}.png` });
    taken.push(`${at}:${real}`);
  }
  console.log("frames asked:actual ms —", taken.join("  "));

  await page.waitForFunction(() => document.documentElement.dataset.intro === "done", {
    timeout: 9000,
  });
  await page.waitForTimeout(400);

  console.log(
    JSON.stringify(
      await page.evaluate(() => ({
        landed: window.__landed ?? "morph transition never ended",
        introDisplay: getComputedStyle(document.querySelector(".intro")).display,
        scrollLocked: getComputedStyle(document.body).overflow === "hidden",
        /* The bar carries no crescent, so there is usually no FLIP target and
           `landed` reads "morph transition never ended" by design — the mark
           settles and fades instead. Queried defensively so this check keeps
           working either way rather than crashing on a null element. */
        headerPicto: (() => {
          const el = document.querySelector("[data-mark-target]");
          return el ? +getComputedStyle(el).opacity : "no target — settle-and-fade";
        })(),
        headerName: +getComputedStyle(document.querySelector(".site-header-lockup")).opacity,
        markFaded: +getComputedStyle(document.querySelector(".intro-mark")).opacity,
        heroRevealed: document.querySelector(".hero-wall")?.classList.contains("is-visible"),
      })),
      null,
      2,
    ),
  );
  await page.close();
}

await browser.close();
