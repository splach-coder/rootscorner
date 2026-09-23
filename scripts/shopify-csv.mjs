/**
 * Build a Shopify product-import CSV from the client's own catalogue.
 *
 *   node scripts/shopify-csv.mjs            # writes docs/shopify-import.csv
 *   node scripts/shopify-csv.mjs --check    # report only, write nothing
 *
 * Why this exists: the 38 pieces have to EXIST in Shopify before anything can
 * be sold, because a cart line references a variant ID and nothing else. Typing
 * them in by hand is an evening of work and a guaranteed source of drift
 * between the two systems.
 *
 * ---------------------------------------------------------------------------
 * THE HANDLE IS THE WHOLE POINT
 *
 * Shopify's `Handle` is set to the SAME slug this site uses — taken from the
 * last segment of the client's own product URL, exactly as lib/catalog.ts does
 * it. That is what lets `scripts/shopify-link.mjs` match all 38 on the first
 * run without anyone reading a `gid://`.
 *
 * It must be `slugOf(url)` and NOT a slug derived from the product name. They
 * differ: the client's URLs contain runs like `stool---cote-d-ivoire` (three
 * hyphens) that no name-based slugify would ever produce.
 * ---------------------------------------------------------------------------
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const OUT = join(ROOT, "docs/shopify-import.csv");

const catalog = JSON.parse(readFileSync(join(ROOT, "docs/catalog.json"), "utf8"));
const images = JSON.parse(readFileSync(join(ROOT, "docs/images.json"), "utf8"));
const items = Array.isArray(catalog) ? catalog : Object.values(catalog);

/** lib/catalog.ts's slugOf — the last segment of the client's own URL. */
const slugOf = (url) => (url || "").replace(/\/+$/, "").split("/").pop() ?? "";

/** lib/catalog.ts's titleCase, so Shopify and the site say the same name. */
const MINOR = new Set([
  "a", "an", "and", "as", "at", "by", "for", "from", "in", "of", "on",
  "or", "the", "to", "with", "de", "du", "des", "et", "la", "le", "les",
]);
const titleCase = (input) =>
  input
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word, i) =>
      i > 0 && MINOR.has(word)
        ? word
        : word
            .replace(/[a-zà-ÿ]/, (ch) => ch.toUpperCase())
            .replace(/([-'’])([a-zà-ÿ])/g, (_m, sep, ch) => sep + ch.toUpperCase()),
    )
    .join(" ");

/** RFC 4180: quote everything, double any internal quote. */
const CRLF = String.fromCharCode(13, 10);

const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

/*
  TWO HEADER DIALECTS, AND THE STORE DECIDES WHICH.

  Shopify's current help pages document friendly column names ("URL handle",
  "Description", "Price"). Its own exporter has for years produced the classic
  ones ("Handle", "Body (HTML)", "Variant Price"), and the importer has accepted
  those throughout — every migration tool emits them.

  Rather than bet on which this store wants, both are here. The authoritative
  answer takes thirty seconds and needs no products at all:

      Shopify admin -> Products -> Export -> export all, as CSV

  An empty store still exports its HEADER ROW. Match that row and the import
  cannot fail on a column name.

      node scripts/shopify-csv.mjs            # classic (Shopify's own export)
      node scripts/shopify-csv.mjs --modern   # the names in the current docs

  One column does not merely rename — it INVERTS. Classic
  `Variant Inventory Policy` takes `deny` / `continue`; the modern
  `Continue selling when out of stock` is a boolean, where that same intent is
  FALSE. Carrying the value across unchanged would turn "never oversell a
  one-of-a-kind" into "always oversell it".
*/
const MODERN = process.argv.includes("--modern");

/** classic -> modern. Anything absent keeps its classic name. */
const RENAME = {
  "Handle": "URL handle",
  "Body (HTML)": "Description",
  "Published": "Published on online store",
  "Option1 Name": "Option1 name",
  "Option1 Value": "Option1 value",
  "Variant SKU": "SKU",
  "Variant Inventory Tracker": "Inventory tracker",
  "Variant Inventory Qty": "Inventory quantity",
  "Variant Inventory Policy": "Continue selling when out of stock",
  "Variant Fulfillment Service": "Fulfillment service",
  "Variant Price": "Price",
  "Variant Requires Shipping": "Requires shipping",
  "Variant Taxable": "Charge tax",
  "Image Src": "Product image URL",
  "Image Position": "Image position",
};

const CLASSIC = [
  "Handle",
  "Title",
  "Body (HTML)",
  "Vendor",
  "Type",
  "Tags",
  "Published",
  "Option1 Name",
  "Option1 Value",
  "Variant SKU",
  "Variant Inventory Tracker",
  "Variant Inventory Qty",
  "Variant Inventory Policy",
  "Variant Fulfillment Service",
  "Variant Price",
  "Variant Requires Shipping",
  "Variant Taxable",
  "Image Src",
  "Image Position",
  "Status",
];

const rows = [];
const report = [];
let noImages = 0;

for (const entry of items) {
  const handle = slugOf(entry.url);
  const record = images[handle];
  const srcs = (record?.images ?? [])
    .map((img) => img.original)
    .filter((u) => typeof u === "string" && u.startsWith("http"));

  if (srcs.length === 0) noImages++;

  const inStock = entry.availability !== "OutOfStock";

  /*
    Body (HTML) is deliberately EMPTY.

    The site is the source of every word about a piece: lib/catalog.ts filters
    the scrape (it contained the old site's FOOTER as care instructions — §46)
    and lib/product-fr.ts holds the French. Exporting the raw description here
    would republish that junk into Shopify, and duplicating §46's filter list in
    this script would give the project two copies of it to keep in step.

    The division is clean: Shopify owns price, stock and fulfilment. The site
    owns the copy.
  */
  rows.push([
    handle,
    titleCase(entry.name ?? handle.replace(/-/g, " ")),
    "",
    "The Roots Corner",
    entry.category ?? "",
    entry.category ?? "",
    "TRUE",
    // Shopify's convention for a product with no options at all.
    "Title",
    "Default Title",
    handle,
    "shopify",
    // Stock is one of everything (CLAUDE.md §6). Sold is a normal state.
    inStock ? 1 : 0,
    // `deny`, never `continue`: a one-of-a-kind piece must not oversell.
    "deny",
    "manual",
    entry.price ?? "",
    "TRUE",
    "TRUE",
    srcs[0] ?? "",
    srcs.length > 0 ? 1 : "",
    "active",
  ]);

  // Shopify takes extra images as further rows carrying only the handle.
  for (let i = 1; i < srcs.length; i++) {
    const extra = new Array(CLASSIC.length).fill("");
    extra[0] = handle;
    extra[CLASSIC.indexOf("Image Src")] = srcs[i];
    extra[CLASSIC.indexOf("Image Position")] = i + 1;
    rows.push(extra);
  }

  report.push({ handle, images: srcs.length, price: entry.price, inStock });
}

/*
  The inventory policy is the one value that changes MEANING, not just name.
  Classic `deny` means "stop selling at zero"; the modern column is a boolean
  where that same intent is FALSE.
*/
const policyAt = CLASSIC.indexOf("Variant Inventory Policy");
const body = MODERN
  ? rows.map((r) =>
      r.map((v, i) =>
        i === policyAt && v !== "" ? (v === "continue" ? "TRUE" : "FALSE") : v,
      ),
    )
  : rows;

const header = MODERN ? CLASSIC.map((c) => RENAME[c] ?? c) : CLASSIC;
const csv =
  [header, ...body].map((r) => r.map(cell).join(",")).join(CRLF) + CRLF;

console.log(`header:        ${MODERN ? "modern (current docs)" : "classic (Shopify export)"}`);
console.log(`pieces:        ${items.length}`);
console.log(`CSV rows:      ${rows.length}  (one per piece + one per extra image)`);
console.log(`in stock:      ${report.filter((r) => r.inStock).length}`);
console.log(`out of stock:  ${report.filter((r) => !r.inStock).length}  → imported at qty 0`);
console.log(`images total:  ${report.reduce((n, r) => n + r.images, 0)}`);
if (noImages) console.log(`⚠️  pieces with NO image: ${noImages}`);

const unpriced = report.filter((r) => !r.price);
if (unpriced.length) {
  console.log(`\n⚠️  unpriced (${unpriced.length}) — these import at no price and cannot be sold:`);
  for (const r of unpriced) console.log(`   ${r.handle}`);
}

if (CHECK) {
  console.log("\n--check: nothing written.");
  process.exit(0);
}

// No BOM. Shopify reads UTF-8, and a BOM ahead of the header turns the first
// column into "﻿Handle" and fails the import.
writeFileSync(OUT, csv, "utf8");
console.log(`\nwrote docs/shopify-import.csv  (${(csv.length / 1024).toFixed(0)} KB)`);
console.log(
  "\nImport it: Shopify admin → Products → Import → upload this file.\n" +
    "  · Images are fetched from the CLIENT'S LIVE SITE at import time, so the\n" +
    "    old site must still be up when you press import. Shopify copies each\n" +
    "    one onto its own CDN, so the link is only needed during the import.\n" +
    "  · Do NOT open and re-save this in Excel — it mangles the accents.\n" +
    "  · No weights are set: nothing in the client's data records one, and a\n" +
    "    guessed weight is a wrong shipping price. Set shipping rates by price\n" +
    "    or zone, or add real weights in Shopify.\n" +
    "\nThen: node scripts/shopify-link.mjs --write",
);
