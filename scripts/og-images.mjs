/**
 * Link-preview images — what WhatsApp, Instagram DMs, Facebook, iMessage,
 * LinkedIn and Slack show when someone pastes a link to the site.
 *
 *   node scripts/og-images.mjs
 *
 * Writes public/og/*.jpg at 1200×630, the size every one of those platforms
 * expects, as baseline JPEG under ~250 KB: WhatsApp quietly drops a preview
 * whose image is too heavy or in a format it will not decode (AVIF, often
 * WebP), and the link then arrives as bare text.
 *
 * Two treatments, because the material asks for two:
 *
 *   PIECES  are CONTAINED on the page ground (#f7f5f2) — the whole object,
 *           never cropped. Almost every piece is photographed portrait on a
 *           pale wall; a 1.9:1 crop would cut the object to a fragment, which
 *           is §24's no-cropping rule. The ground continues the wall (§12).
 *   SCENES  (home, story, rugs, the apartments…) are rooms and streets, where
 *           there is no single object to cut into, so they fill the frame.
 *
 * Re-run after changing a lead photograph. Pieces added in Shopify after
 * launch use their Shopify image directly (lib/seo.ts), so nothing here has
 * to run for them.
 */
import sharp from "sharp";
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/og");
const W = 1200;
const H = 630;
const GROUND = { r: 247, g: 245, b: 242 };
mkdirSync(join(OUT, "pieces"), { recursive: true });
mkdirSync(join(OUT, "rooms"), { recursive: true });

const jpeg = (img) => img.jpeg({ quality: 80, mozjpeg: true, progressive: false });

async function scene(src, out, position = "attention") {
  await jpeg(sharp(join(ROOT, "public", src)).resize(W, H, { fit: "cover", position })).toFile(join(OUT, out));
}

async function piece(src, out) {
  // The object at 88% of the frame height, centred on the ground.
  const inner = await sharp(join(ROOT, "public", src))
    .resize({ height: Math.round(H * 0.88), width: Math.round(W * 0.9), fit: "inside" })
    .toBuffer();
  await jpeg(
    sharp({ create: { width: W, height: H, channels: 3, background: GROUND } }).composite([
      { input: inner, gravity: "centre" },
    ]),
  ).toFile(join(OUT, out));
}

/* Scenes — the photograph each page actually opens on. */
const SCENES = {
  "default.jpg": "place/shadow-tree.jpg",
  "story.jpg": "place/rug-shop.jpg",
  "mrirt.jpg": "rugs/mrirt-rug.jpg",
  "stay.jpg": "rooms/stay-living.jpg",
  "artisans.jpg": "artisans/artisans-01.jpg",
  "collection.jpg": "rugs/interior-table.jpg",
};
for (const [out, src] of Object.entries(SCENES)) {
  if (existsSync(join(ROOT, "public", src))) await scene(src, out);
}

/* Pieces and rooms, from the site's own catalogue and photography. */
const catalog = JSON.parse(readFileSync(join(ROOT, "docs/catalog.json"), "utf8"));
const images = JSON.parse(readFileSync(join(ROOT, "docs/images.json"), "utf8"));
const slugOf = (url) => (url || "").replace(/\/+$/, "").split("/").pop() ?? "";
const firstOf = {};
let n = 0;
for (const entry of catalog) {
  const slug = slugOf(entry.url);
  const lead = images[slug]?.images?.[0]?.file;
  if (!lead) continue;
  await piece(`pieces/${lead}`, `pieces/${slug}.jpg`);
  firstOf[entry.category] ??= lead;
  n++;
}
for (const [room, lead] of Object.entries(firstOf)) await piece(`pieces/${lead}`, `rooms/${room}.jpg`);

console.log(`og: ${Object.keys(SCENES).length} scenes, ${n} pieces, ${Object.keys(firstOf).length} rooms → public/og/`);
