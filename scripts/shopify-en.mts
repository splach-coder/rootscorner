/**
 * English in Shopify, beside the French (10 Oct).
 *
 *   npx tsx scripts/shopify-en.mts --dry
 *   npx tsx scripts/shopify-en.mts
 *
 * 1. Adds English as a store language and publishes it, so the Storefront API
 *    (and so the site, the payment page and the order e-mails) can serve it.
 * 2. Registers the site's current English as each product's English
 *    translation: title + description for the 38 pieces and the two rugs
 *    (lib/piece-names.ts, lib/piece-copy.ts), title + description for the four
 *    Mrirt series (SERIES_TEXT in lib/rugs.ts).
 *
 * From then on the house edits English in Shopify's "Translate & Adapt" app,
 * next to the French. A translation that already exists is never overwritten,
 * so re-running this cannot undo her work.
 *
 * Needs the app scopes read/write_translations and read/write_locales.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connect, gql, userErrors, ROOT } from "./lib/shopify-admin.mjs";
import { PIECE_TEXT } from "../lib/piece-names";
import { PIECE_COPY } from "../lib/piece-copy";
import { SERIES_TEXT_EN } from "../lib/rugs";

const DRY = process.argv.includes("--dry");
const { scope } = await connect();
for (const s of ["write_translations", "write_locales"]) {
  if (!scope.split(",").includes(s)) {
    console.error(`The app does not have ${s} yet. Approve the new app version in the store admin, then re-run.`);
    process.exit(1);
  }
}

/* ---- 1. the language ------------------------------------------------------ */
const loc = await gql(`{ shopLocales { locale primary published } }`);
const en = loc.shopLocales.find((l: { locale: string }) => l.locale === "en");
console.log(`store languages: ${loc.shopLocales.map((l: any) => `${l.locale}${l.primary ? " (primary)" : ""}${l.published ? "" : " (unpublished)"}`).join(", ")}`);
if (!en && !DRY) userErrors(await gql(`mutation { shopLocaleEnable(locale: "en") { userErrors { field message } } }`));
if ((!en || !en.published) && !DRY) {
  userErrors(
    await gql(`mutation { shopLocaleUpdate(locale: "en", shopLocale: { published: true }) { userErrors { field message } } }`),
  );
  console.log("English: enabled and published");
}

/* ---- 2. the translations --------------------------------------------------- */
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const variants: Record<string, string> = JSON.parse(readFileSync(join(ROOT, "docs/shopify.json"), "utf8"));
const jobs: { label: string; id: string; title?: string; body?: string }[] = [];

for (const [slug, variant] of Object.entries(variants)) {
  const d = await gql(`query($id: ID!) { productVariant(id: $id) { product { id } } }`, { id: variant });
  const id = d.productVariant?.product?.id;
  if (!id) continue;
  const copy = PIECE_COPY[slug];
  jobs.push({
    label: slug,
    id,
    title: PIECE_TEXT[slug]?.name.en,
    body: copy ? `<p>${esc(copy.short.en)}</p>\n<p>${esc(copy.about.en)}</p>` : undefined,
  });
}
for (const handle of ["tapis-laine-sable-carreaux-ocre", "tapis-laine-prune-frise", ...Object.keys(SERIES_TEXT_EN)]) {
  const d = await gql(`query($h: String!) { productByHandle(handle: $h) { id } }`, { h: handle });
  const id = d.productByHandle?.id;
  if (!id) continue;
  const copy = PIECE_COPY[handle];
  const series = SERIES_TEXT_EN[handle];
  jobs.push({
    label: handle,
    id,
    title: PIECE_TEXT[handle]?.name.en ?? series?.title,
    body: copy
      ? `<p>${esc(copy.short.en)}</p>\n<p>${esc(copy.about.en)}</p>`
      : series
        ? `<p>${esc(series.line)}</p>`
        : undefined,
  });
}

let written = 0;
for (const job of jobs) {
  const r = await gql(
    `query($id: ID!) { translatableResource(resourceId: $id) {
       translatableContent { key value digest }
       translations(locale: "en") { key value }
     } }`,
    { id: job.id },
  );
  const res = r.translatableResource;
  const has = new Set(res.translations.map((t: { key: string }) => t.key));
  const input: { locale: string; key: string; value: string; translatableContentDigest: string }[] = [];
  for (const [key, value] of [["title", job.title], ["body_html", job.body]] as const) {
    if (!value || has.has(key)) continue;
    const content = res.translatableContent.find((c: { key: string }) => c.key === key);
    if (!content?.digest) continue;
    input.push({ locale: "en", key, value, translatableContentDigest: content.digest });
  }
  if (!input.length) continue;
  console.log(`${DRY ? "would translate" : "translate"}  ${job.label}  (${input.map((i) => i.key).join(", ")})`);
  written++;
  if (DRY) continue;
  userErrors(
    await gql(
      `mutation($id: ID!, $t: [TranslationInput!]!) { translationsRegister(resourceId: $id, translations: $t) { userErrors { field message } } }`,
      { id: job.id, t: input },
    ),
  );
}
console.log(`translations: ${written} product(s) ${DRY ? "would be translated" : "translated"}`);
