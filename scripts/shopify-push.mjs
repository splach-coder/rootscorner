/**
 * Create the catalogue in Shopify, from the client's own records.
 *
 *   node scripts/shopify-push.mjs --dry        # what would change, no writes
 *   node scripts/shopify-push.mjs --limit 1    # do one, to prove the shape
 *   node scripts/shopify-push.mjs              # all 38
 *
 * The alternative is `scripts/shopify-csv.mjs` plus a manual import. This is
 * better once the app has `write_products`: it is idempotent, so re-running
 * after a price change updates rather than duplicating, and it reads the
 * variant IDs straight back — which is the whole point, since a cart line
 * references a variant ID and nothing else.
 *
 * ---------------------------------------------------------------------------
 * WHAT IT SETS, AND WHAT IT REFUSES TO
 *
 * `productSet` upserts on the handle, and the handle is `slugOf(url)` — the
 * last segment of the client's own product URL, exactly as lib/catalog.ts
 * derives it. Anything else and the site and the store disagree about what a
 * piece is called (§59: a name-based slug matches 0 of 38).
 *
 * Inventory is **1, tracked, DENY**. Stock is one of everything (§6), so
 * overselling a one-of-a-kind is the one inventory bug that cannot be
 * apologised away.
 *
 * Description is left EMPTY, as the CSV does: the site owns the copy, Shopify
 * owns price, stock and fulfilment. The raw scrape carries the old site's
 * footer as care instructions (§46).
 *
 * No weight is set. Nothing in the client's data records one, and a guessed
 * weight is a wrong shipping price charged to a real customer (§5).
 * ---------------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const API = "2025-01";
const DRY = process.argv.includes("--dry");
const LIMIT = (() => {
  const i = process.argv.indexOf("--limit");
  return i > -1 ? Number(process.argv[i + 1]) : Infinity;
})();

if (existsSync(join(ROOT, ".env.local"))) {
  for (const l of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const SHOP = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const ID = process.env.SHOPIFY_CLIENT_ID;
const SECRET = process.env.SHOPIFY_CLIENT_SECRET;
if (!SHOP || !ID || !SECRET) {
  console.error("Missing NEXT_PUBLIC_SHOPIFY_DOMAIN / SHOPIFY_CLIENT_ID / SHOPIFY_CLIENT_SECRET in .env.local");
  process.exit(1);
}

const auth = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "client_credentials", client_id: ID, client_secret: SECRET }),
});
if (!auth.ok) {
  const t = await auth.text();
  console.error("Auth failed:", auth.status, t.match(/Oauth error (\w+)/)?.[1] ?? "");
  process.exit(1);
}
const { access_token: TOKEN } = await auth.json();

async function gql(query, variables = {}) {
  const r = await fetch(`https://${SHOP}/admin/api/${API}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors?.length) throw new Error(j.errors.map((e) => e.message).join("; "));
  return j.data;
}

/* ---- where stock lives -------------------------------------------------- */

const locs = await gql(`{ locations(first: 5) { nodes { id name isActive } } }`);
const location = locs.locations.nodes.find((l) => l.isActive) ?? locs.locations.nodes[0];
if (!location) {
  console.error("No location on this store — inventory cannot be set.");
  process.exit(1);
}
console.log(`location: ${location.name}\n`);

/* ---- the catalogue ------------------------------------------------------ */

const catalog = JSON.parse(readFileSync(join(ROOT, "docs/catalog.json"), "utf8"));
const images = JSON.parse(readFileSync(join(ROOT, "docs/images.json"), "utf8"));
const items = (Array.isArray(catalog) ? catalog : Object.values(catalog)).slice(0, LIMIT);

const slugOf = (url) => (url || "").replace(/\/+$/, "").split("/").pop() ?? "";
const MINOR = new Set(["a","an","and","as","at","by","for","from","in","of","on","or","the","to","with","de","du","des","et","la","le","les"]);
const titleCase = (s) =>
  s.trim().replace(/\s+/g, " ").toLowerCase().split(" ")
    .map((w, i) => (i > 0 && MINOR.has(w) ? w : w.replace(/[a-zà-ÿ]/, (c) => c.toUpperCase()).replace(/([-'’])([a-zà-ÿ])/g, (_m, a, b) => a + b.toUpperCase())))
    .join(" ");

const map = existsSync(join(ROOT, "docs/shopify.json"))
  ? JSON.parse(readFileSync(join(ROOT, "docs/shopify.json"), "utf8"))
  : {};

let done = 0;
const failed = [];

for (const entry of items) {
  const handle = slugOf(entry.url);
  const title = titleCase(entry.name ?? handle.replace(/-/g, " "));
  const srcs = (images[handle]?.images ?? [])
    .map((i) => i.original)
    .filter((u) => typeof u === "string" && u.startsWith("http"));
  const qty = entry.availability === "OutOfStock" ? 0 : 1;

  if (DRY) {
    console.log(`${handle}  "${title}"  ${entry.price} EUR  qty ${qty}  ${srcs.length} images`);
    continue;
  }

  try {
    const data = await gql(
      `mutation($input: ProductSetInput!) {
        productSet(synchronous: true, input: $input) {
          product { id handle variants(first: 1) { nodes { id } } }
          userErrors { field message code }
        }
      }`,
      {
        input: {
          handle,
          title,
          vendor: "The Roots Corner",
          productType: entry.category ?? "",
          tags: entry.category ? [entry.category] : [],
          status: "ACTIVE",
          productOptions: [{ name: "Title", values: [{ name: "Default Title" }] }],
          files: srcs.map((src) => ({ originalSource: src, contentType: "IMAGE" })),
          variants: [
            {
              optionValues: [{ optionName: "Title", name: "Default Title" }],
              price: String(entry.price ?? "0"),
              inventoryPolicy: "DENY",
              inventoryItem: { tracked: true },
              inventoryQuantities: [
                { locationId: location.id, name: "available", quantity: qty },
              ],
            },
          ],
        },
      },
    );

    const errs = data.productSet.userErrors;
    if (errs?.length) {
      failed.push({ handle, why: errs.map((e) => e.message).join("; ") });
      console.log(`✗ ${handle} — ${errs.map((e) => e.message).join("; ")}`);
      continue;
    }

    const variantId = data.productSet.product.variants.nodes[0]?.id;
    map[handle] = variantId;
    done++;
    console.log(`✓ ${handle}  ${srcs.length} img  qty ${qty}  ${variantId}`);
  } catch (e) {
    failed.push({ handle, why: e.message });
    console.log(`✗ ${handle} — ${e.message}`);
  }
}

if (DRY) {
  console.log(`\n--dry: ${items.length} pieces, nothing written.`);
  process.exit(0);
}

writeFileSync(
  join(ROOT, "docs/shopify.json"),
  JSON.stringify(Object.fromEntries(Object.entries(map).sort()), null, 1) + "\n",
);

console.log(`\ncreated/updated: ${done}`);
console.log(`variant map:     ${Object.keys(map).length} entries -> docs/shopify.json`);
if (failed.length) {
  console.log(`\nfailed (${failed.length}):`);
  for (const f of failed) console.log(`  ${f.handle}: ${f.why}`);
}
