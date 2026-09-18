/**
 * Match the catalogue to a Shopify store and write docs/shopify.json.
 *
 *   node scripts/shopify-link.mjs           # report what would be written
 *   node scripts/shopify-link.mjs --write   # write it
 *
 * Reads NEXT_PUBLIC_SHOPIFY_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
 * from the environment or from .env.local.
 *
 * WHY THIS EXISTS RATHER THAN A HAND-TYPED MAP: a cart line references a
 * Shopify variant ID (`gid://shopify/ProductVariant/…`) and nothing else. Those
 * are 40-character opaque strings, one per piece, and a single wrong character
 * sells the wrong object. This reads them from the store itself.
 *
 * IT NEVER GUESSES. A piece is linked only when exactly one product in the
 * store matches it, by handle or by an exact normalised title. Anything
 * ambiguous is reported and left out — an unlinked piece keeps the enquiry it
 * has always had, which is a working state; a mislinked one takes money for the
 * wrong thing.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WRITE = process.argv.includes("--write");

// .env.local is gitignored and is where these normally live in development.
for (const file of [".env.local", ".env"]) {
  const path = join(ROOT, file);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const value = m[2].trim().replace(/^["']|["']$/g, "");
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

if (!DOMAIN || !TOKEN) {
  console.error(
    "No store configured.\n" +
      "  NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com\n" +
      "  NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=…\n\n" +
      "The token is the STOREFRONT one (Shopify admin → Settings → Apps and\n" +
      "sales channels → Develop apps → Storefront API). Never the Admin token.",
  );
  process.exit(1);
}

/** Same normalisation lib/catalog.ts uses to build a slug from a name. */
const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const catalog = JSON.parse(readFileSync(join(ROOT, "docs/catalog.json"), "utf8"));
const pieces = (Array.isArray(catalog) ? catalog : Object.values(catalog)).map((p) => ({
  slug: slugify(p.name),
  name: p.name,
}));

/** Every published product in the store, paged. */
async function allProducts() {
  const out = [];
  let after = null;
  for (let page = 0; page < 20; page++) {
    const res = await fetch(`https://${DOMAIN}/api/2025-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({
        query: `query($after:String){
          products(first: 100, after: $after) {
            pageInfo { hasNextPage endCursor }
            nodes {
              handle title
              variants(first: 1) { nodes { id title availableForSale } }
            }
          }
        }`,
        variables: { after },
      }),
    });
    if (!res.ok) throw new Error(`Storefront API returned HTTP ${res.status}`);
    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
    const conn = json.data.products;
    out.push(...conn.nodes);
    if (!conn.pageInfo.hasNextPage) break;
    after = conn.pageInfo.endCursor;
  }
  return out;
}

const products = await allProducts();
console.log(`store: ${DOMAIN}\nproducts published: ${products.length}\ncatalogue pieces: ${pieces.length}\n`);

const byHandle = new Map();
const byTitle = new Map();
for (const p of products) {
  byHandle.set(p.handle, p);
  const key = norm(p.title);
  // A title shared by two products is not a match — it is a question.
  byTitle.set(key, byTitle.has(key) ? null : p);
}

const map = {};
const unmatched = [];
const noVariant = [];

for (const piece of pieces) {
  const hit = byHandle.get(piece.slug) ?? byTitle.get(norm(piece.name)) ?? null;
  if (!hit) {
    unmatched.push(piece);
    continue;
  }
  const variant = hit.variants?.nodes?.[0];
  if (!variant?.id) {
    noVariant.push(piece);
    continue;
  }
  map[piece.slug] = variant.id;
}

const linked = Object.keys(map).length;
console.log(`linked:    ${linked} / ${pieces.length}`);
if (noVariant.length) console.log(`no variant: ${noVariant.length}`);
if (unmatched.length) {
  console.log(`\nnot found in the store (${unmatched.length}) — these keep the enquiry:`);
  for (const p of unmatched) console.log(`  ${p.slug}   "${p.name}"`);
}

const extra = products.filter(
  (p) => !pieces.some((x) => x.slug === p.handle || norm(x.name) === norm(p.title)),
);
if (extra.length) {
  console.log(`\nin the store but not in the catalogue (${extra.length}):`);
  for (const p of extra) console.log(`  ${p.handle}   "${p.title}"`);
}

if (!WRITE) {
  console.log("\nDry run. Re-run with --write to save docs/shopify.json.");
  process.exit(0);
}

writeFileSync(
  join(ROOT, "docs/shopify.json"),
  JSON.stringify(Object.fromEntries(Object.entries(map).sort()), null, 1) + "\n",
);
console.log("\nwrote docs/shopify.json");

if (linked > 0) {
  console.log(
    "\n⚠️  Payment is now live, which means lib/legal.ts's `cookies` document\n" +
      "   is WRONG: it states this site sets no cookies, and Shopify's hosted\n" +
      "   checkout sets third-party ones. Rewrite it in this same change, and\n" +
      "   check the consent banner arms (CLAUDE.md §44).",
  );
}
