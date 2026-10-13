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
 * **price**, **availability** and **sizes**. Since V2 (10 Oct) it is also where
 * the house edits, for every piece, the **French name** (product title), the
 * **French text** (description: first paragraph = "Description courte", the
 * rest = "À propos de cette pièce") and the **photographs** (media, in order).
 * The site's own files keep what Shopify does not hold: the English name and
 * text, and the facts (origin, dimensions…) in lib/piece-names.ts.
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
import { createHash } from "node:crypto";
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
  // V2 (10 Oct): the five collection groups are the product types now. A piece
  // added under a group lands in a room that lib/piece-copy.ts maps back to it.
  // V3 (11 Oct): "et" rather than "&" in every title.
  "Sièges et Tabourets": "stools",
  "Objets et Sculptures": "decoration",
  "Poteries et Céramiques": "pots",
  "Objets Anciens et Artisanat": "african-decoration",
  "Mobilier et Luminaires": "lamp",
  "Sièges & Tabourets": "stools",
  "Objets & Sculptures": "decoration",
  "Poteries & Céramiques": "pots",
  "Objets Anciens & Artisanat": "african-decoration",
  "Mobilier & Luminaires": "lamp",
  // The old room types, still understood.
  "Tabourets & sièges": "stools",
  "Pièces africaines": "african-decoration",
  "Pots & contenants": "pots",
  "Céramiques de Tamegroute": "ceramics-tamegroute",
  Vases: "vases",
  Objets: "decoration",
  "Lumière": "lamp",
  Tapis: "rugs",
};

/*
 * The details of a piece, as product fields the house edits in the admin
 * (namespace "trc", created by scripts/shopify-facts.mts). Shopify key →
 * the site's key (lib/specs.ts FACT_KEYS).
 */
const FACT_FIELDS = {
  origine: "origin",
  region: "region",
  epoque: "period",
  matiere: "material",
  dimensions: "dimensions",
  nature: "nature",
  etat: "condition",
};
/* V5 (14 Oct): a rug's kind (lib/rug-types.ts), chosen from a list in the
   product field "Type de tapis" (scripts/shopify-rug-types.mts). */
const RUG_TYPE_KEY = "type_tapis";
const FACT_IDS = `[${[...Object.keys(FACT_FIELDS), RUG_TYPE_KEY].map((k) => `{namespace: "trc", key: "${k}"}`).join(", ")}]`;
const rugTypeOf = (node) => {
  const v = (node?.metafields ?? []).find((m) => m?.key === RUG_TYPE_KEY)?.value?.trim();
  return v ? { rugType: v } : {};
};
const factsOf = (node) =>
  Object.fromEntries(
    (node?.metafields ?? [])
      .filter((m) => m && m.key in FACT_FIELDS && m.value && m.value.trim())
      .map((m) => [FACT_FIELDS[m.key], m.value.trim()]),
  );

const QUERY = `query($after: String) {
  products(first: 100, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes {
      handle title productType description descriptionHtml
      metafields(identifiers: ${FACT_IDS}) { key value }
      images(first: 12) { nodes { url width height altText } }
      options { name optionValues { name } }
      variants(first: 100) { nodes { id availableForSale price { amount currencyCode }
        image { url } selectedOptions { name value } } }
    }
  }
}`;

/*
 * The description as paragraphs. Read from the HTML, not the plain-text
 * `description`, because Shopify's plain text runs paragraphs together.
 */
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", eacute: "é", egrave: "è", agrave: "à", ccedil: "ç", ecirc: "ê", ocirc: "ô" };
function paragraphs(html, plain) {
  if (!html) return (plain || "").split(/\n\s*\n|\n/).map((x) => x.trim()).filter(Boolean);
  return html
    .replace(/<\/(p|div|li|h[1-6])>|<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) =>
      e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENTITIES[e.toLowerCase()] ?? m,
    )
    .split("\n")
    .map((x) => x.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}
const imagesOf = (p) =>
  p.images.nodes
    .filter((i) => i.url && i.width && i.height)
    .map((i) => ({ src: i.url, w: i.width, h: i.height, alt: i.altText || null }));

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

/*
 * The same products in ENGLISH (store language "en", edited in Translate &
 * Adapt). Shopify answers an untranslated field with the French, so English
 * is kept only where it differs from the French; the site then falls back to
 * its own English (lib/piece-names.ts, lib/piece-copy.ts, lib/rugs.ts).
 */
const EN_QUERY = `query($after: String) @inContext(language: EN) {
  products(first: 100, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes { handle title description descriptionHtml metafields(identifiers: ${FACT_IDS}) { key value } }
  }
}`;
const english = {};
try {
  let after = null;
  do {
    const r = await fetch(`https://${SHOP}/api/2025-01/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": TOKEN },
      body: JSON.stringify({ query: EN_QUERY, variables: { after } }),
    });
    const j = await r.json();
    if (!r.ok || j.errors?.length) break;
    for (const n of j.data.products.nodes) english[n.handle] = n;
    after = j.data.products.pageInfo.hasNextPage ? j.data.products.pageInfo.endCursor : null;
  } while (after);
} catch {
  // No English is not a failure: the site has its own.
}
function englishOf(p) {
  const e = english[p.handle];
  if (!e) return {};
  const out = {};
  if (e.title?.trim() && e.title.trim() !== p.title.trim()) out.enTitle = e.title.trim();
  const fr = paragraphs(p.descriptionHtml, p.description);
  const en = paragraphs(e.descriptionHtml, e.description);
  if (en.length && en.join("\n") !== fr.join("\n")) out.enText = en;
  return out;
}
/* The details in both languages; English only where it differs. */
function detailsOf(p) {
  const fr = factsOf(p);
  if (!Object.keys(fr).length) return {};
  const en = factsOf(english[p.handle]);
  return { facts: { fr, en: Object.fromEntries(Object.entries(en).filter(([k, v]) => v !== fr[k])) } };
}

const variants = JSON.parse(readFileSync(join(ROOT, "docs/shopify.json"), "utf8"));
const slugByVariant = Object.fromEntries(Object.entries(variants).map(([s, v]) => [v, s]));

const pieces = {};
const extra = [];
/*
  Mrirt rug SERIES (scripts/shopify-rugs.mjs): one product per series, options
  Couleur and Taille. Kept apart from the catalogue — they are the choices on
  the made-to-order form, not pieces. The house edits them in the admin.
*/
const rugSeries = [];
/*
  Shopify attaches the product's photo to every variant, so a colourway image
  that is the same for all colourways says nothing about the colour. A swatch
  is kept only where she has given colours photographs of their own.
*/
const distinctSwatches = (series) => {
  const imgs = series.colours.map((c) => c.image);
  if (new Set(imgs).size < 2) series.colours = series.colours.map((c) => ({ ...c, image: null }));
  return series;
};
for (const p of products) {
  if (p.productType?.trim() === "Tapis Mrirt") {
    const opt = (n) => p.options.find((o) => o.name.toLowerCase() === n)?.optionValues.map((v) => v.name) ?? [];
    const enS = englishOf(p);
    rugSeries.push(distinctSwatches({
      handle: p.handle,
      title: p.title.trim(),
      ...(enS.enTitle ? { titleEn: enS.enTitle } : {}),
      ...(enS.enText ? { descriptionEn: enS.enText.join(" ") } : {}),
      description: (p.description || "").trim(),
      ...rugTypeOf(p),
      image: p.images.nodes[0] ? { src: p.images.nodes[0].url, w: p.images.nodes[0].width, h: p.images.nodes[0].height } : null,
      colours: opt("couleur").map((name) => ({
        name,
        // Her own photo of the colourway, if she has attached one to a variant.
        image: p.variants.nodes.find((v) => v.image && v.selectedOptions.some((o) => o.value === name))?.image?.url ?? null,
      })),
      sizes: opt("taille"),
      images: p.images.nodes
        .filter((i) => i.url && i.width && i.height)
        .map((i) => ({ src: i.url, w: i.width, h: i.height, alt: i.altText || null })),
      // Every colour × size, with its own price: that is what goes in the cart.
      variants: p.variants.nodes.map((v) => ({
        id: v.id,
        colour: v.selectedOptions.find((o) => o.name.toLowerCase() === "couleur")?.value ?? null,
        size: v.selectedOptions.find((o) => o.name.toLowerCase() === "taille")?.value ?? null,
        price: Number(v.price.amount),
        currency: v.price.currencyCode,
        available: v.availableForSale,
      })),
    }));
    continue;
  }
  const v = p.variants.nodes[0];
  if (!v) continue;
  const price = Number(v.price.amount);
  // Matched on any of its variants: adding sizes in the admin keeps the link.
  const known = p.variants.nodes.map((x) => slugByVariant[x.id]).find(Boolean);
  if (known) {
    pieces[known] = {
      price,
      available: p.variants.nodes.some((x) => x.availableForSale),
      // What the house edits in the admin (V2): French name, text, photos.
      title: p.title.trim(),
      text: paragraphs(p.descriptionHtml, p.description),
      images: imagesOf(p),
      ...englishOf(p),
      ...detailsOf(p),
    };
    // V2: a piece sold in several sizes (Tamegroute candles, S and M). Each
    // Shopify variant becomes a choice on the piece page, with its own price.
    if (p.variants.nodes.length > 1) {
      pieces[known].options = p.variants.nodes.map((x) => ({
        id: x.id,
        label: x.selectedOptions.map((o) => o.value).join(" · "),
        price: Number(x.price.amount),
        available: x.availableForSale,
      }));
    }
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
    description: paragraphs(p.descriptionHtml, p.description),
    images: imagesOf(p),
    ...englishOf(p),
    ...detailsOf(p),
    ...(category === "rugs" ? rugTypeOf(p) : {}),
  });
}

// A linked piece the storefront no longer returns has been unpublished or
// deleted in the admin. It must not stay buyable on the site, so it is
// recorded as unavailable rather than left to the scrape's old state.
const missing = Object.keys(variants).filter((s) => !(s in pieces));
for (const s of missing) pieces[s] = { price: null, available: false };
// A fingerprint of what the site would show. The deployed site serves it at
// /api/catalog-version, and the scheduled workflow compares the two: equal
// means nothing changed in Shopify, so there is nothing to rebuild.
// `pulledAt` is left out on purpose — it changes every run.
const hash = createHash("sha256").update(JSON.stringify({ pieces, extra, rugSeries })).digest("hex").slice(0, 16);
writeFileSync(
  OUT,
  JSON.stringify({ pulledAt: new Date().toISOString(), hash, pieces, extra, rugSeries }, null, 1) + "\n",
);
if (process.argv.includes("--hash")) console.log(`HASH=${hash}`);
console.log(
  `shopify-pull: ${Object.keys(pieces).length} linked piece(s), ${extra.length} added in Shopify, ${rugSeries.length} rug series` +
    (missing.length ? `, ${missing.length} no longer published (${missing.join(", ")})` : ""),
);
