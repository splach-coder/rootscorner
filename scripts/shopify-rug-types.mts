/**
 * The kind of every rug, as a product field in Shopify (V5, 14 Oct).
 *
 *   npx tsx scripts/shopify-rug-types.mts --dry
 *   npx tsx scripts/shopify-rug-types.mts
 *
 * 1. Creates the product field "Type de tapis" (namespace trc, key
 *    type_tapis): a list to choose from, the kinds in lib/rug-types.ts,
 *    pinned, readable by the Storefront API.
 * 2. Sets "Mrirt" on the rugs that are Mrirt by their own Shopify record —
 *    the series (product type "Tapis Mrirt") and the finished rugs (type
 *    "Tapis") whose title the house wrote as "Tapis Mrirt, …" — only where the
 *    field is still empty, so her choices are never overwritten.
 *
 * The site reads it back in scripts/shopify-pull.mjs.
 */
import { connect, gql, userErrors } from "./lib/shopify-admin.mjs";
import { RUG_TYPES } from "../lib/rug-types";

const DRY = process.argv.includes("--dry");
const NS = "trc";
const KEY = "type_tapis";

await connect();

const found = await gql(
  `query($ns: String!, $k: String!) { metafieldDefinitions(first: 1, ownerType: PRODUCT, namespace: $ns, key: $k) { nodes { id } } }`,
  { ns: NS, k: KEY },
);
if (!found.metafieldDefinitions.nodes.length) {
  console.log(`${DRY ? "would create" : "create"} field Type de tapis (${RUG_TYPES.map((t) => t.value).join(", ")})`);
  if (!DRY) {
    userErrors(
      await gql(
        `mutation($d: MetafieldDefinitionInput!) { metafieldDefinitionCreate(definition: $d) { createdDefinition { id } userErrors { field message } } }`,
        {
          d: {
            name: "Type de tapis",
            namespace: NS,
            key: KEY,
            description: "Pour les tapis uniquement : le type, qui range le tapis dans le menu Tapis berbères. Laisser vide pour les autres pièces.",
            type: "single_line_text_field",
            ownerType: "PRODUCT",
            pin: true,
            access: { storefront: "PUBLIC_READ" },
            validations: [{ name: "choices", value: JSON.stringify(RUG_TYPES.map((t) => t.value)) }],
          },
        },
      ),
    );
  }
}

type Node = { id: string; title: string; productType: string; metafield: { value: string } | null };
const rugs: Node[] = [];
for (const q of [`product_type:'Tapis Mrirt'`, `product_type:Tapis`]) {
  const d = await gql(
    `query($q: String!) { products(first: 100, query: $q) { nodes { id title productType metafield(namespace: "${NS}", key: "${KEY}") { value } } } }`,
    { q },
  );
  rugs.push(...d.products.nodes);
}

let set = 0;
for (const p of rugs) {
  const isMrirt = p.productType.trim() === "Tapis Mrirt" || /^tapis mrirt\b/i.test(p.title.trim());
  if (!isMrirt || p.metafield?.value?.trim()) {
    console.log(`  leave ${p.title} (${p.productType})${p.metafield?.value ? ` = ${p.metafield.value}` : ""}`);
    continue;
  }
  console.log(`${DRY ? "would set" : "set"}  ${p.title} (${p.productType}) = Mrirt`);
  set++;
  if (DRY) continue;
  userErrors(
    await gql(
      `mutation($m: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $m) { metafields { id } userErrors { field message } } }`,
      { m: [{ ownerId: p.id, namespace: NS, key: KEY, type: "single_line_text_field", value: "Mrirt" }] },
    ),
  );
}
console.log(`${rugs.length} rug product(s); ${set} ${DRY ? "would be set" : "set"} to Mrirt`);
