/**
 * Create the Mrirt rug SERIES in Shopify, the way benirugs.com is organised.
 *
 *   node scripts/shopify-rugs.mjs --dry
 *   node scripts/shopify-rugs.mjs
 *
 * One product per series (Beni: "Formation", "Après"…), each with two options
 * — Couleur (the colourways) and Taille (the sizes) — all in one automatic
 * collection, "Tapis Mrirt" (rule: product type equals "Tapis Mrirt").
 *
 * From then on the house manages them in the Shopify admin like any product:
 * rename a series, add a colourway or a size, upload a photo, and the Mrirt
 * form on the site follows on the next sync (scripts/shopify-pull.mjs). A
 * colourway gets its swatch from the variant's own image if she adds one,
 * otherwise from the colour words in its name (lib/rug-options.ts).
 *
 * NOT FOR SALE AS CREATED. A Mrirt rug is woven to order (brief §6): the form
 * is an enquiry. Variants are created tracked at quantity 0 with DENY, so
 * nothing here can reach a checkout by accident, and no price is shown on the
 * site while it is 0. To sell a series directly she sets a price and stock.
 *
 * ⚠️ The four series and their colourways are PLACEHOLDERS for the house to
 * rename — the client has not yet named the cooperative's series. Created only
 * if missing: re-running never overwrites what she has edited.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
for (const l of existsSync(join(ROOT, ".env.local")) ? readFileSync(join(ROOT, ".env.local"), "utf8").split("\n") : []) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}
const SHOP = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const a = await (await fetch(`https://${SHOP}/admin/oauth/access_token`, {
  method: "POST",
  body: new URLSearchParams({ grant_type: "client_credentials", client_id: process.env.SHOPIFY_CLIENT_ID, client_secret: process.env.SHOPIFY_CLIENT_SECRET }),
})).json();
async function gql(query, variables = {}) {
  const r = await fetch(`https://${SHOP}/admin/api/2025-01/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": a.access_token },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors?.length) throw new Error(j.errors.map((e) => e.message).join("; "));
  return j.data;
}
const errs = (d) => {
  const e = Object.values(d)[0]?.userErrors;
  if (e?.length) throw new Error(e.map((x) => `${x.field ?? ""} ${x.message}`).join("; "));
};

export const RUG_TYPE = "Tapis Mrirt";
const SIZES = ["60 × 90 cm", "80 × 150 cm", "120 × 180 cm", "160 × 230 cm", "200 × 300 cm", "250 × 350 cm"];
const SERIES = [
  { handle: "mrirt-uni", title: "Uni", colours: ["Laine naturelle", "Caramel", "Taupe"] },
  { handle: "mrirt-lignes", title: "Lignes", colours: ["Laine naturelle + Taupe", "Laine naturelle + Noir"] },
  { handle: "mrirt-losanges", title: "Losanges", colours: ["Laine naturelle + Brun chocolat", "Terracotta + Brun chocolat + Taupe"] },
  { handle: "mrirt-graphique", title: "Graphique", colours: ["Sable + Taupe", "Terracotta + Brun chocolat"] },
];

const loc = (await gql(`{ locations(first: 5) { nodes { id isActive } } }`)).locations.nodes.find((l) => l.isActive);
const online = (await gql(`{ publications(first: 20) { nodes { id name } } }`)).publications.nodes.find((p) => p.name === "Online Store");

for (const s of SERIES) {
  const found = (await gql(`query($h: String!) { productByHandle(handle: $h) { id } }`, { h: s.handle })).productByHandle;
  if (found) { console.log(`series ${s.title}: exists — left as the house edited it`); continue; }
  if (DRY) { console.log(`series ${s.title}: would create ${s.colours.length}×${SIZES.length} variants`); continue; }
  const d = await gql(
    `mutation($input: ProductSetInput!) { productSet(synchronous: true, input: $input) { product { id } userErrors { field message } } }`,
    {
      input: {
        handle: s.handle,
        title: s.title,
        vendor: "The Roots Corner",
        productType: RUG_TYPE,
        status: "ACTIVE",
        productOptions: [
          { name: "Couleur", values: s.colours.map((name) => ({ name })) },
          { name: "Taille", values: SIZES.map((name) => ({ name })) },
        ],
        variants: s.colours.flatMap((c) =>
          SIZES.map((z) => ({
            optionValues: [{ optionName: "Couleur", name: c }, { optionName: "Taille", name: z }],
            price: "0.00",
            inventoryPolicy: "DENY",
            inventoryItem: { tracked: true },
            inventoryQuantities: [{ locationId: loc.id, name: "available", quantity: 0 }],
          })),
        ),
      },
    },
  );
  errs(d);
  const id = d.productSet.product.id;
  await gql(`mutation($id: ID!, $input: [PublicationInput!]!) { publishablePublish(id: $id, input: $input) { userErrors { message } } }`, { id, input: [{ publicationId: online.id }] });
  console.log(`series ${s.title}: created and published`);
}

const col = (await gql(`{ collectionByHandle(handle: "tapis-mrirt") { id } }`)).collectionByHandle;
if (!col && !DRY) {
  const c = await gql(
    `mutation($i: CollectionInput!) { collectionCreate(input: $i) { collection { id } userErrors { field message } } }`,
    { i: { title: "Tapis Mrirt", handle: "tapis-mrirt", ruleSet: { appliedDisjunctively: false, rules: [{ column: "TYPE", relation: "EQUALS", condition: RUG_TYPE }] } } },
  );
  errs(c);
  await gql(`mutation($id: ID!, $input: [PublicationInput!]!) { publishablePublish(id: $id, input: $input) { userErrors { message } } }`, { id: c.collectionCreate.collection.id, input: [{ publicationId: online.id }] });
  console.log("collection Tapis Mrirt: created");
} else console.log(`collection Tapis Mrirt: ${col ? "exists" : "would create"}`);
