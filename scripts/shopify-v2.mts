/**
 * V2 feedback (10 Oct) in the Shopify admin, so the store matches the site.
 *
 *   npx tsx scripts/shopify-v2.mts --dry   # say what would change
 *   npx tsx scripts/shopify-v2.mts         # do it
 *
 * 1. Every piece's TITLE becomes its French name (lib/piece-names.ts). The
 *    store's language is French, so this is the name on the Shopify payment
 *    page, in the order confirmation e-mail and in the admin. The site itself
 *    reads its names from lib/piece-names.ts, so nothing on it changes.
 * 2. Every piece's TYPE becomes one of the five collection groups
 *    (GROUPS in lib/copy-v2.ts). A new piece lands in its group the moment
 *    its type is chosen.
 * 3. One automatic collection per group (rule: Type equals the group name),
 *    published to the Online Store. The seven old room collections are
 *    deleted once nothing is typed into them any more. "Tapis" and
 *    "Tapis Mrirt" are left alone.
 *
 * 4. Every piece's DESCRIPTION becomes the house's French copy, where it is
 *    still empty — so Shopify is where names, texts and photos are edited.
 *
 * Idempotent: a second run changes nothing. Prices, stock, photos and the
 * rugs are never touched.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connect, gql, userErrors, ROOT } from "./lib/shopify-admin.mjs";
import { PIECE_TEXT } from "../lib/piece-names";
import { GROUPS } from "../lib/copy-v2";
import { GROUP_OF, GROUP_OVERRIDE, PIECE_COPY } from "../lib/piece-copy";

const DRY = process.argv.includes("--dry");
const OLD_ROOMS = ["stools", "african-decoration", "pots", "ceramics-tamegroute", "vases", "decoration", "lamp"];

const catalog = JSON.parse(readFileSync(join(ROOT, "docs/catalog.json"), "utf8"));
const items: { url: string; category: string }[] = Array.isArray(catalog) ? catalog : Object.values(catalog);
const variants: Record<string, string> = JSON.parse(readFileSync(join(ROOT, "docs/shopify.json"), "utf8"));
const slugOf = (url: string) => (url || "").replace(/\/+$/, "").split("/").pop() ?? "";
const groupName = (slug: string) => GROUPS.find((g) => g.slug === slug)?.name.fr;

await connect();

/* ---- 1 + 2. titles and types -------------------------------------------- */
let changed = 0;
for (const entry of items) {
  const slug = slugOf(entry.url);
  const variant = variants[slug];
  const name = PIECE_TEXT[slug]?.name.fr;
  const group = (GROUP_OVERRIDE as Record<string, string>)[slug] ?? (GROUP_OF as Record<string, string>)[entry.category];
  const type = group ? groupName(group) : undefined;
  if (!variant || !name || !type) {
    console.warn(`skip ${slug}: ${!variant ? "no variant" : !name ? "no French name" : "no group"}`);
    continue;
  }
  const d = await gql(`query($id: ID!) { productVariant(id: $id) { product { id title productType } } }`, { id: variant });
  const product = d.productVariant?.product;
  if (!product) {
    console.warn(`skip ${slug}: variant not found in the store`);
    continue;
  }
  if (product.title === name && product.productType === type) continue;
  console.log(`${DRY ? "would set" : "set"}  ${product.title}  →  ${name}  [${type}]`);
  changed++;
  if (DRY) continue;
  userErrors(
    await gql(
      `mutation($p: ProductUpdateInput!) { productUpdate(product: $p) { userErrors { field message } } }`,
      { p: { id: product.id, title: name, productType: type } },
    ),
  );
}
console.log(`products: ${changed} ${DRY ? "would change" : "changed"}`);

/* ---- 3. collections ------------------------------------------------------ */
const pubs = await gql(`{ publications(first: 20) { nodes { id name } } }`);
const online = pubs.publications.nodes.find((p: { name: string }) => p.name === "Online Store");

for (const [i, g] of GROUPS.entries()) {
  const title = g.name.fr;
  const found = await gql(`query($h: String!) { collectionByHandle(handle: $h) { id title } }`, { h: g.slug });
  const ruleSet = { appliedDisjunctively: false, rules: [{ column: "TYPE", relation: "EQUALS", condition: title }] };
  const existing = found.collectionByHandle;
  console.log(`collection ${g.slug} "${title}" ${existing ? "(update)" : "(create)"}`);
  if (DRY) continue;
  let id = existing?.id;
  if (id) {
    userErrors(
      await gql(`mutation($i: CollectionInput!) { collectionUpdate(input: $i) { userErrors { field message } } }`, {
        i: { id, title, ruleSet },
      }),
    );
  } else {
    const c = userErrors(
      await gql(
        `mutation($i: CollectionInput!) { collectionCreate(input: $i) { collection { id } userErrors { field message } } }`,
        { i: { title, handle: g.slug, sortOrder: "CREATED_DESC", ruleSet } },
      ),
    );
    id = c.collectionCreate.collection.id;
  }
  if (online) {
    await gql(
      `mutation($id: ID!, $input: [PublicationInput!]!) { publishablePublish(id: $id, input: $input) { userErrors { message } } }`,
      { id, input: [{ publicationId: online.id }] },
    );
  }
  void i;
}

for (const handle of OLD_ROOMS) {
  const found = await gql(`query($h: String!) { collectionByHandle(handle: $h) { id title ruleSet { rules { condition } } } }`, { h: handle });
  const c = found.collectionByHandle;
  if (!c) continue;
  // Never delete a room something is still typed into. Checked against the
  // products' types, not productsCount: an automatic collection's count is
  // recomputed in the background and still shows the old members for a while.
  const all = await gql(`{ products(first: 250) { nodes { productType } } }`);
  const inUse = new Set(all.products.nodes.map((p: { productType: string }) => p.productType));
  if (!DRY && c.ruleSet?.rules.some((r: { condition: string }) => inUse.has(r.condition))) {
    console.warn(`keep ${handle}: products are still typed into it`);
    continue;
  }
  console.log(`${DRY ? "would delete" : "delete"} old collection ${handle} "${c.title}"`);
  if (DRY) continue;
  userErrors(
    await gql(`mutation($i: CollectionDeleteInput!) { collectionDelete(input: $i) { userErrors { field message } } }`, {
      i: { id: c.id },
    }),
  );
}
/* ---- 4. descriptions ----------------------------------------------------- */
/*
 * The house's French copy (lib/piece-copy.ts) becomes each product's
 * description in Shopify: first paragraph = "Description courte", the rest =
 * "À propos de cette pièce". From then on Shopify is where it is edited; the
 * site reads it back (scripts/shopify-pull.mjs). Written only where the
 * description is still EMPTY, so a re-run never overwrites her edits.
 */
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rugHandles = ["tapis-laine-sable-carreaux-ocre", "tapis-laine-prune-frise"];
const targets: { slug: string; id: string }[] = [];
for (const entry of items) {
  const slug = slugOf(entry.url);
  const variant = variants[slug];
  if (!variant) continue;
  const d = await gql(`query($id: ID!) { productVariant(id: $id) { product { id } } }`, { id: variant });
  if (d.productVariant?.product) targets.push({ slug, id: d.productVariant.product.id });
}
for (const h of rugHandles) {
  const d = await gql(`query($h: String!) { productByHandle(handle: $h) { id } }`, { h });
  if (d.productByHandle) targets.push({ slug: h, id: d.productByHandle.id });
}
let described = 0;
for (const { slug, id } of targets) {
  const copy = PIECE_COPY[slug];
  if (!copy) continue;
  const cur = await gql(`query($id: ID!) { product(id: $id) { descriptionHtml } }`, { id });
  const existing = (cur.product?.descriptionHtml ?? "").replace(/<[^>]+>/g, "").trim();
  const isPlaceholder = /^photos?\s+d[’']illustration\.?$/i.test(existing);
  if (existing && !isPlaceholder) continue;
  const html = `<p>${esc(copy.short.fr)}</p>\n<p>${esc(copy.about.fr)}</p>`;
  console.log(`${DRY ? "would describe" : "describe"}  ${slug}`);
  described++;
  if (DRY) continue;
  userErrors(
    await gql(`mutation($p: ProductUpdateInput!) { productUpdate(product: $p) { userErrors { field message } } }`, {
      p: { id, descriptionHtml: html },
    }),
  );
}
console.log(`descriptions: ${described} ${DRY ? "would be written" : "written"}`);

console.log(DRY ? "dry run, nothing written" : "done");
