/**
 * Link-preview images — what WhatsApp, Instagram DMs, Facebook, iMessage,
 * LinkedIn and Slack show when someone pastes a link to the site.
 *
 *   node scripts/og-images.mjs
 *
 * Runs before every build (package.json cf:build and the deploy workflow),
 * after the Shopify snapshot is pulled, so a piece the house adds or a lead
 * photograph she changes in Shopify gets its own preview on the next deploy.
 *
 * Writes public/og/**.jpg at 1200×630, the size every one of those platforms
 * expects, as baseline JPEG under ~250 KB: WhatsApp quietly drops a preview
 * whose image is too heavy or in a format it will not decode (AVIF, often
 * WebP, a 4 MB PNG), and the link then arrives as bare text. That is why no
 * page ever points its og:image at Shopify's CDN directly.
 *
 * And docs/og.json: every file with a short hash of its bytes. lib/seo.ts
 * adds it as ?v=… to the URL, because WhatsApp and iMessage cache a preview
 * by URL forever — a changed image must arrive under a new address.
 *
 * Two treatments:
 *   PIECES  CONTAINED on the page ground (#f7f5f2): the whole object, never
 *           cropped (§24). Pieces, rugs, rug collections, categories.
 *   SCENES  rooms and landscapes fill the frame.
 */
import sharp from "sharp";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/og");
const W = 1200;
const H = 630;
const GROUND = { r: 247, g: 245, b: 242 };
for (const d of ["pieces", "groups", "tapis"]) mkdirSync(join(OUT, d), { recursive: true });

const manifest = {};
const jpeg = (img) => img.jpeg({ quality: 80, mozjpeg: true, progressive: false });
async function save(img, out) {
  const buf = await jpeg(img).toBuffer();
  writeFileSync(join(OUT, out), buf);
  manifest[out] = createHash("sha1").update(buf).digest("hex").slice(0, 8);
}

async function scene(src, out, { brighten = 1 } = {}) {
  let img = sharp(join(ROOT, "public", src)).resize(W, H, { fit: "cover", position: "attention" });
  if (brighten !== 1) img = img.modulate({ brightness: brighten });
  await save(img, out);
}

/** The object at 88% of the frame height, centred on the ground. */
async function contained(input, out) {
  const inner = await sharp(input)
    .rotate()
    .resize({ height: Math.round(H * 0.88), width: Math.round(W * 0.9), fit: "inside" })
    .flatten({ background: GROUND })
    .toBuffer();
  await save(
    sharp({ create: { width: W, height: H, channels: 3, background: GROUND } }).composite([
      { input: inner, gravity: "centre" },
    ]),
    out,
  );
}

/** A Shopify photograph, fetched as JPEG at a sane size. */
async function fetchShopify(src) {
  const url = new URL(src);
  url.searchParams.set("width", "1400");
  const res = await fetch(url, { headers: { Accept: "image/jpeg,image/png;q=0.9" } });
  if (!res.ok) throw new Error(`${res.status} ${src}`);
  return Buffer.from(await res.arrayBuffer());
}

/* Scenes — the photograph each page opens on, or the one that best says it. */
const SCENES = [
  ["default.jpg", "place/hanging-cloth.jpg", { brighten: 1.18 }], // the homepage hero
  ["story.jpg", "story/atlas-valley.jpg", {}],
  ["mrirt.jpg", "rugs/mrirt-rug.jpg", {}],
  ["collection.jpg", "rugs/interior-table.jpg", { brighten: 1.06 }],
  ["contact.jpg", "story/ochre-wall.jpg", {}],
  ["guide.jpg", "rugs/series/floor-fire.jpg", { brighten: 1.08 }],
];
for (const [out, src, opts] of SCENES) {
  if (existsSync(join(ROOT, "public", src))) await scene(src, out, opts);
}

/* Pieces: the lead photograph the site shows (the Shopify snapshot), else the
   site's own copy. */
const catalog = JSON.parse(readFileSync(join(ROOT, "docs/catalog.json"), "utf8"));
const images = JSON.parse(readFileSync(join(ROOT, "docs/images.json"), "utf8"));
const live = existsSync(join(ROOT, "docs/shopify-live.json"))
  ? JSON.parse(readFileSync(join(ROOT, "docs/shopify-live.json"), "utf8"))
  : { pieces: {}, extra: [], rugSeries: [] };
const slugOf = (url) => (url || "").replace(/\/+$/, "").split("/").pop() ?? "";

const GROUP_OF = {
  stools: "sieges-tabourets",
  decoration: "objets-sculptures",
  pots: "poteries-ceramiques",
  vases: "poteries-ceramiques",
  "ceramics-tamegroute": "poteries-ceramiques",
  "african-decoration": "objets-anciens-artisanat",
  lamp: "mobilier-luminaires",
};
const GROUP_OVERRIDE = { "vintage-moroccan-shelf-berbere": "mobilier-luminaires" };

let pieces = 0;
const groupLead = {};
async function leadOf(slug) {
  const shop = live.pieces?.[slug]?.images?.[0]?.src;
  if (shop) {
    try {
      return await fetchShopify(shop);
    } catch (e) {
      console.warn(`og: ${slug}: ${e.message}, using the site's copy`);
    }
  }
  const file = images[slug]?.images?.[0]?.file;
  return file ? join(ROOT, "public/pieces", file) : null;
}
for (const entry of catalog) {
  const slug = slugOf(entry.url);
  const lead = await leadOf(slug);
  if (!lead) continue;
  await contained(lead, `pieces/${slug}.jpg`);
  const group = GROUP_OVERRIDE[slug] ?? GROUP_OF[entry.category];
  if (group && !groupLead[group]) groupLead[group] = lead;
  pieces++;
}
/* Pieces added in Shopify, and the finished rugs. */
for (const e of live.extra ?? []) {
  const src = e.images?.[0]?.src;
  if (!src) continue;
  try {
    await contained(await fetchShopify(src), `pieces/${e.slug}.jpg`);
    pieces++;
  } catch (err) {
    console.warn(`og: ${e.slug}: ${err.message}`);
  }
}
/* The categories: their first piece, as on the collection page. */
for (const [group, lead] of Object.entries(groupLead)) await contained(lead, `groups/${group}.jpg`);
/* The Mrirt collections. */
let tapis = 0;
for (const s of live.rugSeries ?? []) {
  const src = s.images?.[0]?.src;
  if (!src) continue;
  try {
    await contained(await fetchShopify(src), `tapis/${s.handle}.jpg`);
    tapis++;
  } catch (err) {
    console.warn(`og: ${s.handle}: ${err.message}`);
  }
}

writeFileSync(join(ROOT, "docs/og.json"), JSON.stringify(manifest, null, 1) + "\n");
console.log(
  `og: ${SCENES.length} scenes, ${pieces} pieces, ${Object.keys(groupLead).length} categories, ${tapis} rug collections → public/og/ (docs/og.json)`,
);
