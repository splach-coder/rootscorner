/**
 * Write each photograph's true pixel size into docs/images.json.
 *
 * The piece detail page shows the client's photographs at their own proportion
 * rather than cropped to a house ratio — the frame has to know the ratio before
 * the image loads or the page reflows as each one decodes. Ratios in this set
 * run 0.67–0.85, so a single house ratio would crop most of them.
 *
 * Reads the JPEG SOFn marker directly rather than adding a dependency.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath, not url.pathname: the project directory has a space in its
// name, and pathname hands it back percent-encoded.
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PIECES = join(ROOT, "public", "pieces");
const INDEX = join(ROOT, "docs", "images.json");

/** SOF0..SOF15, excluding the non-frame markers DHT (C4), JPG (C8), DAC (CC). */
const isSOF = (m) => m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc;

function jpegSize(buf) {
  if (buf.readUInt16BE(0) !== 0xffd8) return null;
  let i = 2;
  while (i < buf.length - 1) {
    if (buf[i] !== 0xff) { i += 1; continue; }       // resync over fill bytes
    const marker = buf[i + 1];
    if (marker === 0xff) { i += 1; continue; }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
    const length = buf.readUInt16BE(i + 2);
    if (isSOF(marker)) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + length;
  }
  return null;
}

const index = JSON.parse(readFileSync(INDEX, "utf8"));
let done = 0;
let missing = 0;

for (const record of Object.values(index)) {
  for (const image of record.images ?? []) {
    const path = join(PIECES, image.file);
    if (!existsSync(path)) { missing += 1; continue; }
    const size = jpegSize(readFileSync(path));
    if (!size) { missing += 1; continue; }
    image.w = size.w;
    image.h = size.h;
    done += 1;
  }
}

writeFileSync(INDEX, JSON.stringify(index, null, 2) + "\n");

const ratios = Object.values(index)
  .flatMap((r) => r.images ?? [])
  .filter((i) => i.w)
  .map((i) => i.w / i.h);

console.log(`measured ${done}, unreadable ${missing}`);
console.log(`ratio min ${Math.min(...ratios).toFixed(3)}  max ${Math.max(...ratios).toFixed(3)}`);
console.log(`landscape (ratio > 1): ${ratios.filter((r) => r > 1).length}`);
