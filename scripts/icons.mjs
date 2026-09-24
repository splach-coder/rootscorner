/**
 * App and search icons from the client's own picto (brand/picto.svg), unaltered
 * — only placed on the page ground and scaled (§2: never redrawn).
 *
 *   node scripts/icons.mjs
 *
 * public/brand/icon-512.png  — the logo Google shows for the business, and the
 *                              manifest icon Android uses on the home screen
 * public/brand/icon-192.png  — manifest
 * public/apple-touch-icon.png — iPhone "Add to Home Screen" and iMessage;
 *                              iOS ignores SVG icons entirely
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(ROOT, "brand/picto.svg"));
const GROUND = { r: 247, g: 245, b: 242 };

async function icon(size, out, share = 0.62) {
  const mark = await sharp(svg, { density: 1200 }).resize({ height: Math.round(size * share) }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 3, background: GROUND } })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toFile(join(ROOT, "public", out));
}
await icon(512, "brand/icon-512.png");
await icon(192, "brand/icon-192.png");
await icon(180, "apple-touch-icon.png", 0.58);
console.log("icons written");
