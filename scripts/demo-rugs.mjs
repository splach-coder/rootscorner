/**
 * LOCAL DEMO ONLY — rug photographs from benirugs.com, for showing the layout
 * before the house's own flat rug shoot exists.
 *
 *   node scripts/demo-rugs.mjs apply     point the rug collections at public/demo-rugs/
 *   node scripts/demo-rugs.mjs restore   put docs/shopify-live.json back exactly
 *   node scripts/demo-rugs.mjs check     exit 1 if any demo trace is present
 *
 * These are another company's copyrighted photographs. They must never reach
 * Shopify or the live site:
 *   - the files live in public/demo-rugs/ (git-ignored);
 *   - `apply` edits only the local snapshot docs/shopify-live.json, which
 *     `shopify-pull` rewrites from the real store before every deploy;
 *   - `npm run cf:build` runs `check` first and refuses to build while the
 *     folder or any reference to it exists.
 * Nothing here talks to Shopify.
 */
import { existsSync, readFileSync, writeFileSync, copyFileSync, unlinkSync } from "node:fs";

const SNAP = "docs/shopify-live.json";
const BACKUP = "docs/.shopify-live.demo-backup.json";
const DIR = "public/demo-rugs";

const img = (file) => ({ src: `/demo-rugs/${file}.jpg`, w: 1600, h: 2195, alt: null });

/** Two photographs per collection, so the hover's second look works. */
const SERIES = {
  "mrirt-uni": ["jameson-natural-wool-amber", "jameson-taupe-pinecone"],
  "mrirt-lignes": ["austin-oat-pinecone", "mikey-medium-brown-chocolate-brown"],
  "mrirt-losanges": ["lattice", "ridgeline-chocolate-brown-amber"],
  "mrirt-graphique": ["weft-chocolate-brown-sienna", "sundial-oxblood-taupe"],
};

/** The two "already woven" slots, with names that describe these photographs. */
const WOVEN = [
  {
    id: "fire",
    ...img("parterre"),
    name: { fr: "Laine sable, carreaux ocre", en: "Sand wool, ochre squares" },
  },
  {
    id: "pile",
    ...img("niko-pinecone-taupe"),
    name: { fr: "Laine prune, frise grecque", en: "Plum wool, Greek key border" },
  },
];

const mode = process.argv[2];

if (mode === "check") {
  const snap = existsSync(SNAP) ? readFileSync(SNAP, "utf8") : "";
  if (existsSync(DIR) || snap.includes("/demo-rugs/") || existsSync(BACKUP)) {
    console.error(
      "\n  ✗ Demo rug photographs are present (public/demo-rugs or docs/shopify-live.json).\n" +
        "    They are another company's images and must not be deployed.\n" +
        "    Run: node scripts/demo-rugs.mjs restore  and delete public/demo-rugs/\n",
    );
    process.exit(1);
  }
  console.log("demo-rugs: clean");
} else if (mode === "apply") {
  if (!existsSync(DIR)) throw new Error(`${DIR} is missing`);
  if (!existsSync(BACKUP)) copyFileSync(SNAP, BACKUP);
  const live = JSON.parse(readFileSync(BACKUP, "utf8"));
  for (const series of live.rugSeries ?? []) {
    const files = SERIES[series.handle];
    if (!files) continue;
    series.images = files.map(img);
    series.image = img(files[0]);
  }
  live.demoWoven = WOVEN.map(({ id, src, w, h, name }) => ({ id, src, w, h, name }));
  writeFileSync(SNAP, JSON.stringify(live, null, 1) + "\n");
  console.log("demo-rugs: applied (local snapshot only). Rebuild to see it.");
} else if (mode === "restore") {
  if (!existsSync(BACKUP)) {
    console.log("demo-rugs: nothing to restore");
  } else {
    copyFileSync(BACKUP, SNAP);
    unlinkSync(BACKUP);
    console.log("demo-rugs: snapshot restored");
  }
} else {
  console.log("usage: node scripts/demo-rugs.mjs apply|restore|check");
  process.exit(2);
}
