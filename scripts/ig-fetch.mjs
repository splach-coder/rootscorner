/**
 * Pull the client's own Instagram grid with a real browser.
 *
 * curl gets the login wall, because the profile is rendered by script and the
 * server has no reason to hand a bare HTTP client anything. A real Chrome runs
 * that script, so the public grid is in the DOM even when a "log in" modal is
 * drawn over the top of it — the images are behind the modal, not absent.
 *
 * Reads only what a logged-out visitor can see. No credentials, no cookies, no
 * private endpoints. This is the client's own public account.
 *
 * Usage: node scripts/ig-fetch.mjs [handle] [count]
 * Writes: public/instagram/<n>.jpg  +  docs/instagram.json
 */
import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const HANDLE = process.argv[2] || "therootscorner.m";
const WANT = Number(process.argv[3] || 12);
const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const OUT_DIR = path.join(process.cwd(), "public", "instagram");
const MANIFEST = path.join(process.cwd(), "docs", "instagram.json");

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--disable-blink-features=AutomationControlled"],
});

const context = await browser.newContext({
  viewport: { width: 1400, height: 1000 },
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  locale: "en-GB",
});

const page = await context.newPage();

/**
 * Instagram serves the grid thumbnails through its own JSON as well as in the
 * markup, and the JSON carries the largest candidate. Catch both: whatever the
 * page fetches for itself is the highest-quality URL available without an API.
 */
const fromNetwork = new Map();
page.on("response", async (res) => {
  const url = res.url();
  if (!/\/(graphql|api\/v1)/.test(url)) return;
  let body;
  try {
    body = await res.text();
  } catch {
    return;
  }
  if (!body.includes("display_url") && !!body.includes("image_versions") === false) return;
  // Pull every candidate URL out of whatever shape the payload happens to be.
  for (const m of body.matchAll(/"(?:display_url|url)"\s*:\s*"([^"]+t51[^"]+)"/g)) {
    const clean = m[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/");
    if (!fromNetwork.has(clean)) fromNetwork.set(clean, true);
  }
});

console.log(`opening instagram.com/${HANDLE}/ in a real browser …`);
await page.goto(`https://www.instagram.com/${HANDLE}/`, {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(6000);

// The modal is drawn over the grid; the grid is still in the DOM underneath.
// Try to close it so lazy loading keeps going, but do not depend on it.
for (const label of ["Close", "Fermer", "Not Now", "Plus tard"]) {
  const btn = page.locator(`[aria-label="${label}"], button:has-text("${label}")`).first();
  if (await btn.count().catch(() => 0)) {
    await btn.click({ timeout: 1500 }).catch(() => {});
    break;
  }
}
await page.keyboard.press("Escape").catch(() => {});
await page.waitForTimeout(1500);

// Scroll to pull in more of the grid.
for (let i = 0; i < 6; i += 1) {
  await page.mouse.wheel(0, 1400);
  await page.waitForTimeout(1200);
}

const fromDom = await page.evaluate(() =>
  [...document.querySelectorAll("img")]
    .map((img) => ({
      src: img.currentSrc || img.src,
      srcset: img.srcset || "",
      alt: img.alt || "",
      w: img.naturalWidth,
    }))
    .filter((i) => /cdninstagram|fbcdn/.test(i.src) && !/rsrc\.php|\/s150x150\//.test(i.src)),
);

// Prefer the widest candidate each srcset offers.
const widest = (entry) => {
  if (!entry.srcset) return entry.src;
  const best = entry.srcset
    .split(",")
    .map((part) => part.trim().split(/\s+/))
    .map(([url, w]) => ({ url, w: parseInt(w, 10) || 0 }))
    .sort((a, b) => b.w - a.w)[0];
  return best?.url || entry.src;
};

const seen = new Set();
const candidates = [];
for (const entry of fromDom) {
  const url = widest(entry);
  const key = (url.match(/\/([0-9_]+)_n\.jpg/) || [, url])[1];
  if (seen.has(key)) continue;
  seen.add(key);
  candidates.push({ url, alt: entry.alt, natural: entry.w });
}
for (const url of fromNetwork.keys()) {
  const key = (url.match(/\/([0-9_]+)_n\.jpg/) || [, url])[1];
  if (seen.has(key)) continue;
  seen.add(key);
  candidates.push({ url, alt: "", natural: 0 });
}

console.log(`  in the DOM: ${fromDom.length} image elements`);
console.log(`  from its own JSON: ${fromNetwork.size} media URLs`);
console.log(`  unique candidates: ${candidates.length}`);

if (candidates.length === 0) {
  await page.screenshot({ path: "scripts/.ig-debug.png" }).catch(() => {});
  const title = await page.title();
  console.log(`\nNothing reachable. Page title: "${title}"`);
  console.log("A screenshot of what the browser actually saw is at scripts/.ig-debug.png");
  await browser.close();
  process.exit(2);
}

await mkdir(OUT_DIR, { recursive: true });
const kept = [];

for (const candidate of candidates) {
  if (kept.length >= WANT) break;
  // Fetch inside the page so the request carries the page's own origin and
  // referer; the CDN rejects a bare request for some assets.
  const b64 = await page.evaluate(async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const buf = await res.arrayBuffer();
      let s = "";
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.length; i += 1) s += String.fromCharCode(bytes[i]);
      return btoa(s);
    } catch {
      return null;
    }
  }, candidate.url);

  if (!b64) continue;
  const buffer = Buffer.from(b64, "base64");
  if (buffer.length < 12000) continue; // avatar / sprite, not a post

  const name = `${String(kept.length + 1).padStart(2, "0")}.jpg`;
  await writeFile(path.join(OUT_DIR, name), buffer);
  kept.push({ file: name, bytes: buffer.length, alt: candidate.alt });
  console.log(`  saved ${name}  ${(buffer.length / 1024).toFixed(0)} KB`);
}

/**
 * Alt text is written by Instagram's own auto-captioner ("Photo by … on …") as
 * often as by a person, and that is not a description of the piece. Anything
 * that looks generated is dropped rather than shipped — CLAUDE.md §5.
 */
const useful = (alt) =>
  alt &&
  alt.length > 12 &&
  !/^photo (by|shared by)/i.test(alt) &&
  !/may be an image of/i.test(alt);

await writeFile(
  MANIFEST,
  `${JSON.stringify(
    kept.map((k) => (useful(k.alt) ? { file: k.file, alt: k.alt } : { file: k.file })),
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(`\n${kept.length} frames in public/instagram/, listed in docs/instagram.json`);
await browser.close();
