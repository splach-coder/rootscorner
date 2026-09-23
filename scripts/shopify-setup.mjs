/**
 * Make the Shopify admin usable by the house, not just by the site.
 *
 *   node scripts/shopify-setup.mjs --dry     # print the plan, write nothing
 *   node scripts/shopify-setup.mjs           # apply
 *
 * Idempotent: re-running updates in place and never duplicates.
 *
 * ---------------------------------------------------------------------------
 * 1. CATEGORIES AS PRODUCT TYPES, IN FRENCH
 *
 * Every product's "Type" becomes the French room name the site shows
 * ("Tabourets & sièges", not "stools"). Shopify autocompletes types, so when
 * Dahab adds a piece she picks its room from a list she can read.
 *
 * 2. ONE AUTOMATIC COLLECTION PER ROOM
 *
 * Rule: Type equals the room name. A new piece lands in its collection the
 * moment its type is chosen; nobody maintains collections by hand. "Tapis"
 * is created empty — it fills the day a finished rug is added (§32).
 *
 * 3. SHIPPING = THE HOUSE'S OWN PUBLISHED RATES
 *
 * The store came with Shopify's example rates (France 7.99, EU 22, …), which
 * nobody chose and which undercharge badly for a stool shipped from Marrakech.
 * They are replaced by the table on the client's own Delivery Policy
 * (lib/legal.ts, transcribed from therootscorner.com):
 *
 *     Maroc                          25 €
 *     International, under 200 €     50 €
 *     International, 200 € and up    80 €
 *
 * ⚠️ The last row means a bigger order pays MORE shipping. That is what the
 * policy says and it is reproduced, not corrected — flagged to the client
 * (CLAUDE.md §24). No delivery TIMES are put on the rates: the product pages,
 * the FAQ and the policy disagree (§9.3).
 * ---------------------------------------------------------------------------
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const API = "2025-01";
const DRY = process.argv.includes("--dry");

if (existsSync(join(ROOT, ".env.local"))) {
  for (const l of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}
const SHOP = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const auth = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
  method: "POST",
  body: new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.SHOPIFY_CLIENT_ID,
    client_secret: process.env.SHOPIFY_CLIENT_SECRET,
  }),
});
if (!auth.ok) {
  console.error("Auth failed", auth.status);
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
const userErrors = (x) => {
  const e = Object.values(x)[0]?.userErrors;
  if (e?.length) throw new Error(e.map((u) => `${u.field ?? ""} ${u.message}`).join("; "));
};

/* The room names, from lib/dictionaries.ts (FR). The store's language is French. */
const ROOMS = {
  stools: "Tabourets & sièges",
  "african-decoration": "Pièces africaines",
  pots: "Pots & contenants",
  "ceramics-tamegroute": "Céramiques de Tamegroute",
  vases: "Vases",
  decoration: "Objets",
  lamp: "Lumière",
  rugs: "Tapis",
};

/* ---- 1. product types ---------------------------------------------------- */

const catalog = JSON.parse(readFileSync(join(ROOT, "docs/catalog.json"), "utf8"));
const items = Array.isArray(catalog) ? catalog : Object.values(catalog);
const variants = JSON.parse(readFileSync(join(ROOT, "docs/shopify.json"), "utf8"));
const slugOf = (url) => (url || "").replace(/\/+$/, "").split("/").pop() ?? "";

let typed = 0;
for (const entry of items) {
  const variant = variants[slugOf(entry.url)];
  const type = ROOMS[entry.category];
  if (!variant || !type) continue;
  if (DRY) {
    typed++;
    continue;
  }
  const v = await gql(`query($id: ID!) { productVariant(id: $id) { product { id productType } } }`, { id: variant });
  const product = v.productVariant?.product;
  if (!product || product.productType === type) continue;
  userErrors(
    await gql(
      `mutation($p: ProductUpdateInput!) { productUpdate(product: $p) { userErrors { field message } } }`,
      { p: { id: product.id, productType: type } },
    ),
  );
  typed++;
}
console.log(`types:       ${typed} product(s) ${DRY ? "would be" : ""} set to their French room`);

/* ---- 2. collections ------------------------------------------------------ */

const pubs = await gql(`{ publications(first: 20) { nodes { id name } } }`);
const online = pubs.publications.nodes.find((p) => p.name === "Online Store");

for (const [handle, title] of Object.entries(ROOMS)) {
  const found = await gql(`query($h: String!) { collectionByHandle(handle: $h) { id } }`, { h: handle });
  const input = {
    title,
    handle,
    sortOrder: "CREATED_DESC",
    ruleSet: {
      appliedDisjunctively: false,
      rules: [{ column: "TYPE", relation: "EQUALS", condition: title }],
    },
  };
  if (DRY) {
    console.log(`collection:  ${handle} "${title}" ${found.collectionByHandle ? "(update)" : "(create)"}`);
    continue;
  }
  let id = found.collectionByHandle?.id;
  if (id) {
    userErrors(
      await gql(
        `mutation($i: CollectionInput!) { collectionUpdate(input: $i) { userErrors { field message } } }`,
        { i: { id, title, sortOrder: input.sortOrder, ruleSet: input.ruleSet } },
      ),
    );
  } else {
    const c = await gql(
      `mutation($i: CollectionInput!) { collectionCreate(input: $i) { collection { id } userErrors { field message } } }`,
      { i: input },
    );
    userErrors(c);
    id = c.collectionCreate.collection.id;
  }
  if (online) {
    await gql(
      `mutation($id: ID!, $input: [PublicationInput!]!) { publishablePublish(id: $id, input: $input) { userErrors { message } } }`,
      { id, input: [{ publicationId: online.id }] },
    );
  }
  console.log(`collection:  ${handle} "${title}" ✓`);
}

/* ---- 3. shipping --------------------------------------------------------- */

const prof = await gql(`{
  deliveryProfiles(first: 5) { nodes { id default
    profileLocationGroups { locationGroup { id }
      locationGroupZones(first: 20) { nodes { zone { id name } } } } } }
}`);
const general = prof.deliveryProfiles.nodes.find((p) => p.default);
const group = general.profileLocationGroups[0];
const oldZones = group.locationGroupZones.nodes.map((n) => n.zone);

const eur = (amount) => ({ amount: String(amount), currencyCode: "EUR" });
const zones = [
  {
    name: "Maroc",
    countries: [{ code: "MA", includeAllProvinces: true }],
    methodDefinitionsToCreate: [
      { name: "Livraison", active: true, rateDefinition: { price: eur(25) } },
    ],
  },
  {
    name: "International",
    countries: [{ restOfWorld: true }],
    methodDefinitionsToCreate: [
      {
        name: "Livraison internationale",
        active: true,
        rateDefinition: { price: eur(50) },
        priceConditionsToCreate: [{ criteria: eur(199.99), operator: "LESS_THAN_OR_EQUAL_TO" }],
      },
      {
        name: "Livraison internationale",
        active: true,
        rateDefinition: { price: eur(80) },
        priceConditionsToCreate: [{ criteria: eur(200), operator: "GREATER_THAN_OR_EQUAL_TO" }],
      },
    ],
  },
];

if (DRY) {
  console.log(`shipping:    would delete zones ${oldZones.map((z) => z.name).join(", ")}`);
  console.log(`shipping:    would create Maroc 25 € · International 50 € (<200) / 80 € (≥200)`);
} else {
  userErrors(
    await gql(
      `mutation($id: ID!, $p: DeliveryProfileInput!) { deliveryProfileUpdate(id: $id, profile: $p) { userErrors { field message } } }`,
      {
        id: general.id,
        p: {
          zonesToDelete: oldZones.map((z) => z.id),
          locationGroupsToUpdate: [{ id: group.locationGroup.id, zonesToCreate: zones }],
        },
      },
    ),
  );
  console.log(`shipping:    ${oldZones.length} example zone(s) removed · Maroc 25 € · International 50 € / 80 € ✓`);
}
