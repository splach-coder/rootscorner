/**
 * Prove the finished-rug shelf renders, without shipping invented stock.
 *
 * readyRugs() is empty because the client has no finished rugs in the
 * catalogue, so the card grid on the Mrirt page cannot be seen. This injects
 * throwaway entries, leaves them in place for a screenshot, and puts the
 * catalogue back exactly as it was — verified by hash, because a half-restored
 * catalogue is a far worse bug than the one this is checking.
 *
 *   node scripts/preview-rugs.mjs inject     then: npm run build && shoot
 *   node scripts/preview-rugs.mjs restore
 *
 * Never leave a tree with `inject` applied. The entries are named so that a
 * stray one is obvious on sight.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";

const CATALOG = "docs/catalog.json";
const IMAGES = "docs/images.json";
const BACKUP = ".rug-preview-backup.json";
const mode = process.argv[2];

const hash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 12);

if (mode === "inject") {
  if (existsSync(BACKUP)) throw new Error("backup already exists — run `restore` first");

  const catalogRaw = readFileSync(CATALOG, "utf8");
  const imagesRaw = readFileSync(IMAGES, "utf8");
  writeFileSync(
    BACKUP,
    JSON.stringify({
      catalog: catalogRaw,
      images: imagesRaw,
      hashes: { catalog: hash(catalogRaw), images: hash(imagesRaw) },
    }),
  );

  const catalog = JSON.parse(catalogRaw);
  const images = JSON.parse(imagesRaw);

  /* Photography is borrowed from real pieces on purpose: this proves the grid,
     it is not a dress rehearsal for the client's own rugs. */
  const donors = Object.keys(images).slice(0, 3);
  const samples = donors.map((donor, i) => ({
    slug: `preview-rug-${i + 1}`,
    name: `PREVIEW RUG ${i + 1} — NOT REAL STOCK`,
    price: [1450, 980, 2200][i],
    dimensions: ["200 cm × 300 cm", "160 cm × 240 cm", "250 cm × 350 cm"][i],
    donor,
  }));

  for (const s of samples) {
    catalog.push({
      url: `/collection/rugs/${s.slug}/`,
      category: "rugs",
      name: s.name,
      price: s.price,
      currency: "EUR",
      availability: s.slug.endsWith("2") ? "OutOfStock" : "InStock",
      dimensions: s.dimensions,
      delivery: "1 - 2 Weeks",
      description: ["Injected by scripts/preview-rugs.mjs. Not client copy."],
      details: [],
      care: [],
    });
    images[s.slug] = { images: images[s.donor].images.slice(0, 2), swap: 1 };
  }

  writeFileSync(CATALOG, JSON.stringify(catalog, null, 1));
  writeFileSync(IMAGES, JSON.stringify(images, null, 1));
  console.log(`injected ${samples.length} preview rugs — REMEMBER: node scripts/preview-rugs.mjs restore`);
} else if (mode === "restore") {
  if (!existsSync(BACKUP)) throw new Error("no backup to restore from");
  const b = JSON.parse(readFileSync(BACKUP, "utf8"));
  writeFileSync(CATALOG, b.catalog);
  writeFileSync(IMAGES, b.images);

  const ok =
    hash(readFileSync(CATALOG, "utf8")) === b.hashes.catalog &&
    hash(readFileSync(IMAGES, "utf8")) === b.hashes.images;
  if (!ok) throw new Error("restore did not reproduce the original files");
  unlinkSync(BACKUP);
  console.log("catalogue restored, hashes match");
} else {
  throw new Error("usage: preview-rugs.mjs inject|restore");
}
