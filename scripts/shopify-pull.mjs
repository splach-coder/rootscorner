/**
 * Take a snapshot of the store for the build: docs/shopify-live.json.
 *
 *   node scripts/shopify-pull.mjs
 *
 * Runs before every Cloudflare build (`npm run cf:build`). Reads ONLY the
 * Storefront API — the public token, published products — so it needs nothing
 * secret and can run on any machine or in CI.
 *
 * ---------------------------------------------------------------------------
 * WHAT SHOPIFY DECIDES, AND WHAT IT DOES NOT
 *
 * Shopify is the source of truth for what a buyer pays and whether they can:
 * **price** and **availability**. The client edits those in the admin and the
 * next build shows them. For the 38 original pieces, the site's own copy
 * (names, French translations, photography, dimensions) stays in charge —
 * that copy was cleaned and translated here (§46) and Shopify holds none of it.
 *
 * A product that exists ONLY in Shopify — a piece added by the house after
 * launch — is taken whole: title, room (from its Type), description, photos.
 * That is how a new piece reaches the site without anybody touching code.
 *
 * Matching is by VARIANT ID (docs/shopify.json), never by handle: Shopify
 * collapses repeated hyphens in handles, so the two systems do not agree on
 * that string (§61).
 *
 * If the store cannot be reached, the previous snapshot is kept and the build
 * goes on — a network blip must not take the shop down. It says so loudly.
 * ---------------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "docs/shopify-live.json");

for (const file of [".env.local", ".env"]) {
  const path = join(ROOT, file);
  if (!existsSync(path)) continue;
  for (const l of readFileSync(path, "utf8").split("\n")) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const SHOP = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

function keep(why) {
  console.warn(`⚠️  shopify-pull: ${why} — keeping the previous snapshot.`);
  if (!existsSync(OUT)) writeFileSync(OUT, JSON.stringify({ pulledAt: null, pieces: {}, extra: [] }, null, 1) + "\n");
  process.exit(0);
}
if (!SHOP || !TOKEN) keep("no store credentials");

/* The room names the house picks as "Type" in the admin → the site's slugs.
   Kept identical to scripts/shopify-setup.mjs and lib/dictionaries.ts. */
const ROOM_BY_TYPE = {
  "Tabourets & sièges": "stools",
  "Pièces africaines": "african-decoration",
  "Pots & contenants": "pots",
  "Céramiques de Tamegroute": "ceramics-tamegroute",
  Vases: "vases",
  Objets: "decoration",
  "Lumière": "lamp",
  Tapis: "rugs",
};

const QUERY = `query($after: String) {
  products(first: 100, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes {
      handle title productType description
      images(first: 12) { nodes { url width height altText } }
      variants(first: 1) { nodes { id availableForSale price { amount currencyCode } } }
    }
  }
}`;

const products = [];
try {
  let after = null;
  do {
    const r = await fetch(`https://${SHOP}/api/2025-01/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": TOKEN },
      body: JSON.stringify({ query: QUERY, variables: { after } }),
    });
    if (!r.ok) keep(`HTTP ${r.status}`);
    const j = await r.json();
    if (j.errors?.length) keep(j.errors.map((e) => e.message).join("; "));
    products.push(...j.data.products.nodes);
    after = j.data.products.pageInfo.hasNextPage ? j.data.products.pageInfo.endCursor : null;
  } while (after);
} catch (e) {
  keep(e.message);
}

const variants = JSON.parse(readFileSync(join(ROOT, "docs/shopify.json"), "utf8"));
const slugByVariant = Object.fromEntries(Object.entries(variants).map(([s, v]) => [v, s]));

const pieces = {};
const extra = [];
for (const p of products) {
  const v = p.variants.nodes[0];
  if (!v) continue;
  const price = Number(v.price.amount);
  const known = slugByVariant[v.id];
  if (known) {
    pieces[known] = { price, available: v.availableForSale };
    continue;
  }
  const category = ROOM_BY_TYPE[p.productType?.trim()];
  if (!category) {
    console.warn(`   skipped "${p.title}": its Type "${p.productType}" is not one of the rooms`);
    continue;
  }
  extra.push({
    slug: p.handle,
    variantId: v.id,
    name: p.title,
    price,
    currency: v.price.currencyCode,
    available: v.availableForSale,
    category,
    // Shopify's plain-text description, split into paragraphs. The house wrote
    // it; nothing is added (§5).
    description: (p.description || "").split(/\n\s*\n|\n/).map((s) => s.trim()).filter(Boolean),
    images: p.images.nodes
      .filter((i) => i.url && i.width && i.height)
      .map((i) => ({ src: i.url, w: i.width, h: i.height, alt: i.altText || null })),
  });
}

// A linked piece the storefront no longer returns has been unpublished or
// deleted in the admin. It must not stay buyable on the site, so it is
// recorded as unavailable rather than left to the scrape's old state.
const missing = Object.keys(variants).filter((s) => !(s in pieces));
for (const s of missing) pieces[s] = { price: null, available: false };
writeFileSync(
  OUT,
  JSON.stringify({ pulledAt: new Date().toISOString(), pieces, extra }, null, 1) + "\n",
);
console.log(
  `shopify-pull: ${Object.keys(pieces).length} linked piece(s), ${extra.length} added in Shopify` +
    (missing.length ? `, ${missing.length} no longer published (${missing.join(", ")})` : ""),
);
