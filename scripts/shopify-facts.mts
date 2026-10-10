/**
 * The details of every piece as product fields in Shopify (10 Oct).
 *
 *   npx tsx scripts/shopify-facts.mts --dry
 *   npx tsx scripts/shopify-facts.mts
 *
 * 1. Creates seven product fields (metafield definitions, namespace "trc"),
 *    pinned so they show on every product page in the admin, readable by the
 *    Storefront API: Origine, Région, Époque, Matière, Dimensions, Nature, État.
 * 2. Fills them with what the site states today (lib/specs.ts siteFacts), in
 *    French — only where a field is still EMPTY, so her edits are never
 *    overwritten.
 * 3. Registers the site's English for each value as its English translation
 *    (edited afterwards in Translate & Adapt) — again only where none exists.
 *
 * The site reads them back in scripts/shopify-pull.mjs; an empty field is a
 * detail that is not shown.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connect, gql, userErrors, ROOT } from "./lib/shopify-admin.mjs";
import { allPieces } from "../lib/catalog";
import { siteFacts } from "../lib/specs";

const DRY = process.argv.includes("--dry");
const NS = "trc";
/** Site key → Shopify key, name and the hint shown under the field. */
const FIELDS: { site: string; key: string; name: string; description: string }[] = [
  { site: "origin", key: "origine", name: "Origine", description: "Pays ou tradition, uniquement si c’est établi. Laisser vide sinon." },
  { site: "region", key: "region", name: "Région", description: "Région ou ville d’origine, si elle est connue." },
  { site: "period", key: "epoque", name: "Époque", description: "Période ou date, uniquement si elle est connue." },
  { site: "material", key: "matiere", name: "Matière", description: "Ex. : Bois, Céramique, Laine." },
  { site: "dimensions", key: "dimensions", name: "Dimensions", description: "Ex. : Hauteur 32 cm × Diamètre 33,5 cm." },
  { site: "nature", key: "nature", name: "Nature", description: "Pièce ancienne, Pièce vintage, Pièce artisanale ou Pièce contemporaine." },
  { site: "condition", key: "etat", name: "État", description: "Ex. : Bon état, traces d’usage visibles." },
];

await connect();

/* ---- 1. the fields --------------------------------------------------------- */
for (const f of FIELDS) {
  const found = await gql(
    `query($ns: String!, $k: String!) { metafieldDefinitions(first: 1, ownerType: PRODUCT, namespace: $ns, key: $k) { nodes { id } } }`,
    { ns: NS, k: f.key },
  );
  if (found.metafieldDefinitions.nodes.length) continue;
  console.log(`${DRY ? "would create" : "create"} field ${f.name}`);
  if (DRY) continue;
  userErrors(
    await gql(
      `mutation($d: MetafieldDefinitionInput!) { metafieldDefinitionCreate(definition: $d) { createdDefinition { id } userErrors { field message } } }`,
      {
        d: {
          name: f.name,
          namespace: NS,
          key: f.key,
          description: f.description,
          type: "single_line_text_field",
          ownerType: "PRODUCT",
          pin: true,
          access: { storefront: "PUBLIC_READ" },
        },
      },
    ),
  );
}

/* ---- 2 + 3. the values, French then English -------------------------------- */
const variants: Record<string, string> = JSON.parse(readFileSync(join(ROOT, "docs/shopify.json"), "utf8"));
const productIdOf = async (slug: string): Promise<string | null> => {
  if (variants[slug]) {
    const d = await gql(`query($id: ID!) { productVariant(id: $id) { product { id } } }`, { id: variants[slug] });
    return d.productVariant?.product?.id ?? null;
  }
  const d = await gql(`query($h: String!) { productByHandle(handle: $h) { id } }`, { h: slug });
  return d.productByHandle?.id ?? null;
};

let filled = 0;
let translated = 0;
for (const piece of allPieces()) {
  const id = await productIdOf(piece.slug);
  if (!id) continue;
  const fr = Object.fromEntries(siteFacts(piece, "fr").map((x) => [x.key, x.value]));
  const en = Object.fromEntries(siteFacts(piece, "en").map((x) => [x.key, x.value]));

  const cur = await gql(
    `query($id: ID!) { product(id: $id) { metafields(first: 20, namespace: "${NS}") { nodes { id key value } } } }`,
    { id },
  );
  const existing = new Map<string, { id: string; value: string }>(
    cur.product.metafields.nodes.map((m: { id: string; key: string; value: string }) => [m.key, m]),
  );

  const toSet = FIELDS.filter((f) => fr[f.site] && !existing.get(f.key)?.value?.trim()).map((f) => ({
    ownerId: id,
    namespace: NS,
    key: f.key,
    type: "single_line_text_field",
    value: fr[f.site],
  }));
  if (toSet.length) {
    console.log(`${DRY ? "would fill" : "fill"}  ${piece.slug}: ${toSet.map((m) => `${m.key}=${m.value}`).join(" · ")}`);
    filled++;
    if (!DRY) {
      const r = userErrors(
        await gql(
          `mutation($m: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $m) { metafields { id key value } userErrors { field message } } }`,
          { m: toSet },
        ),
      );
      for (const m of r.metafieldsSet.metafields) existing.set(m.key, m);
    }
  }
  if (DRY) continue;

  // English for each value the site has in English and that differs.
  for (const f of FIELDS) {
    const mf = existing.get(f.key);
    const value = en[f.site];
    if (!mf || !value || value === mf.value || fr[f.site] !== mf.value) continue;
    const res = await gql(
      `query($id: ID!) { translatableResource(resourceId: $id) { translatableContent { key digest } translations(locale: "en") { key } } }`,
      { id: mf.id },
    );
    const tr = res.translatableResource;
    if (!tr || tr.translations.some((t: { key: string }) => t.key === "value")) continue;
    const digest = tr.translatableContent.find((c: { key: string }) => c.key === "value")?.digest;
    if (!digest) continue;
    userErrors(
      await gql(
        `mutation($id: ID!, $t: [TranslationInput!]!) { translationsRegister(resourceId: $id, translations: $t) { userErrors { field message } } }`,
        { id: mf.id, t: [{ locale: "en", key: "value", value, translatableContentDigest: digest }] },
      ),
    );
    translated++;
  }
}
console.log(`values: ${filled} product(s) ${DRY ? "would be filled" : "filled"}; ${translated} English value(s) registered`);
