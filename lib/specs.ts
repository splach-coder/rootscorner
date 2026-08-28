/**
 * The label schema.
 *
 * Every piece on the site is labelled the same way, with the same fields in the
 * same order. That uniformity is what makes the collection read as a collection
 * rather than as a grid of products — a museum wall label, not marketing copy.
 *
 * The schema is deliberately austere: fact only. "Wood. Côte d'Ivoire. 34 × 30 cm."
 * never "craftsmanship you can feel."
 *
 * A field the client has not supplied is OMITTED, never filled. See CLAUDE.md §5.
 * That rule does real work here: only 22 of 38 pieces carry a usable dimension,
 * and seven still hold Jimdo's untouched sample text.
 */

import type { Piece } from "./catalog";

export type Lang = "fr" | "en";

/* ------------------------------------------------------------------ *
 * Dimensions
 * ------------------------------------------------------------------ */

/**
 * Strings the client's store returns that are NOT dimensions.
 *
 * Seven pieces still carry Jimdo's untouched sample text, and it is live on
 * therootscorner.com today. Several more promise dimensions "very soon". These
 * must render as absent, not as text.
 */
const NOT_A_DIMENSION = [
  /here you can describe the exact dimensions/i,
  /exact dimensions (will be )?available very soon/i,
  /^\s*[sml]\s*$/i, // a lone size letter carries no measurement
];

/** Leading field names the client typed into the value itself. */
const LABEL_PREFIX = /^\s*(features?|dimensions?|taille|size)\s*[:-]?\s*/i;

/**
 * Axis words the client wrote inside the measurement ("Height: 56 cm",
 * "61 cm and 55 cm", "Between 73 et 83 cm"). They carry real information, so
 * they are translated rather than stripped — and the client mixes English and
 * French inside the same English-language field.
 *
 * Word boundaries matter here: without them "et" matches inside "diameter".
 */
const AXIS_WORDS: [RegExp, Record<Lang, string>][] = [
  [/\bheight\b/gi, { en: "Height", fr: "Hauteur" }],
  [/\blength\b/gi, { en: "Length", fr: "Longueur" }],
  [/\bdiameter\b/gi, { en: "Diameter", fr: "Diamètre" }],
  [/\bwidth\b/gi, { en: "Width", fr: "Largeur" }],
  [/\bbetween\b/gi, { en: "Between", fr: "Entre" }],
  [/\band\b/gi, { en: "and", fr: "et" }],
  [/\bet\b/gi, { en: "and", fr: "et" }],
];

/**
 * Normalise a dimension string for display, or return null if there isn't one.
 *
 * Only formatting is changed — the numbers are never altered, converted, or
 * inferred. Separators are unified to "×", the client's decimal commas are kept
 * as written, and a non-breaking space is inserted before each unit so "34 cm"
 * can never break across a line.
 */
export function normaliseDimensions(raw: string | null, locale: Lang = "en"): string | null {
  if (!raw) return null;

  const trimmed = raw.replace(/ /g, " ").trim();
  if (!trimmed) return null;
  if (NOT_A_DIMENSION.some((re) => re.test(trimmed))) return null;

  let value = trimmed.replace(LABEL_PREFIX, "");
  if (!/\d/.test(value)) return null; // no number left: not a measurement

  value = value
    .replace(/\s*[*x×]\s*/gi, " × ")
    .replace(/\s*\/\s*/g, " × ")
    .replace(/\s+/g, " ")
    .replace(/\s*-\s*$/, "")
    .trim()
    .replace(/[.,;]$/, "");

  // Translate the axis words before gluing units, so boundaries still hold.
  for (const [re, forms] of AXIS_WORDS) {
    value = value.replace(re, forms[locale]);
  }

  // Glue every number to its unit so the pair never breaks across lines.
  value = value.replace(/(\d(?:[.,]\d+)?)\s*(cm|mm|m|in)\b/gi, "$1 $2");

  return value || null;
}

/* ------------------------------------------------------------------ *
 * Origin
 * ------------------------------------------------------------------ */

/**
 * Origin is read only from terms the client themselves put in the piece name.
 *
 * Note what this deliberately does NOT do: it does not resolve a cultural
 * attribution into a country. "Dogon Stool" yields "Dogon", not "Mali" — the
 * client never wrote Mali, so neither do we. Turning an attribution into a
 * nationality is exactly the invented provenance CLAUDE.md §5 forbids, and on
 * antique objects it is frequently wrong.
 *
 * Order matters: the most specific term wins.
 */
const ORIGIN_TERMS: [RegExp, Record<Lang, string>][] = [
  [/c[oô]te\s*d['’]?\s*ivoire/i, { en: "Côte d’Ivoire", fr: "Côte d’Ivoire" }],
  [/cameroon/i, { en: "Cameroon", fr: "Cameroun" }],
  [/ethiopian?\b/i, { en: "Ethiopia", fr: "Éthiopie" }],
  [/tam[ea]groute/i, { en: "Tamegroute", fr: "Tamegroute" }],
  [/moroccan|morocco/i, { en: "Morocco", fr: "Maroc" }],
  [/indonesian?|lombok|gasing/i, { en: "Indonesia", fr: "Indonésie" }],
  [/berbere|berber/i, { en: "Berber", fr: "Berbère" }],
  [/tuareg/i, { en: "Tuareg", fr: "Touareg" }],
  [/senufo/i, { en: "Senufo", fr: "Sénoufo" }],
  [/baule/i, { en: "Baule", fr: "Baoulé" }],
  [/dogon/i, { en: "Dogon", fr: "Dogon" }],
  [/west african|african/i, { en: "African", fr: "Africaine" }],
];

export function originOf(piece: Piece, locale: Lang = "en"): string | null {
  for (const [re, forms] of ORIGIN_TERMS) {
    if (re.test(piece.name)) return forms[locale];
  }
  return null;
}

/**
 * Several names end in a parenthetical repeating the origin — "Baule Chair
 * (Cote d'Ivoire)". Origin is its own label field now, so the parenthetical is
 * redundant and worse-formed than the field (it loses the circumflex). It is
 * dropped from the *display* name only; the underlying record is untouched.
 */
const REDUNDANT_TAIL =
  /\s*\((?:[^)]*(?:ivoire|morocco|moroccan|indonesian?|cameroon|berbere|berber|gasing)[^)]*)\)\s*$/i;

export function displayName(piece: Piece): string {
  return piece.name.replace(REDUNDANT_TAIL, "").trim() || piece.name;
}

/* ------------------------------------------------------------------ *
 * Material
 * ------------------------------------------------------------------ */

/**
 * Material is read from the client's own description text. Only a single,
 * clearly stated material is accepted; where a description names several we say
 * nothing rather than guess which one the piece is made of.
 */
const MATERIAL_TERMS: [RegExp, Record<Lang, string>][] = [
  [/terracotta/i, { en: "Terracotta", fr: "Terre cuite" }],
  [/\bwool\b/i, { en: "Wool", fr: "Laine" }],
  [/blackened clay|\bclay\b/i, { en: "Clay", fr: "Argile" }],
  [/ceramic|pottery|glazed/i, { en: "Ceramic", fr: "Céramique" }],
  [/\biron\b|\bmetal\b/i, { en: "Iron", fr: "Fer" }],
  [/\bwood(en)?\b|carved from/i, { en: "Wood", fr: "Bois" }],
];

export function materialOf(piece: Piece, locale: Lang): string | null {
  const blob = [...piece.description, ...piece.details].join(" ");
  if (!blob) return null;
  const hits = MATERIAL_TERMS.filter(([re]) => re.test(blob));
  if (hits.length !== 1) return null; // ambiguous or absent — say nothing
  return hits[0][1][locale];
}

/* ------------------------------------------------------------------ *
 * The label
 * ------------------------------------------------------------------ */

export type LabelField = { key: string; value: string };

/**
 * Build the label for a piece. Fields appear in a fixed order and absent fields
 * simply do not appear, so the schema survives being read half-cropped.
 */
export function labelFor(piece: Piece, locale: Lang): LabelField[] {
  const fields: LabelField[] = [];

  const material = materialOf(piece, locale);
  if (material) fields.push({ key: "material", value: material });

  const origin = originOf(piece, locale);
  if (origin) fields.push({ key: "origin", value: origin });

  const dims = normaliseDimensions(piece.dimensions, locale);
  if (dims) fields.push({ key: "dimensions", value: dims });

  return fields;
}

/** How complete the catalogue actually is — used by the content-gap report. */
export function coverage(pieces: Piece[], locale: Lang = "en") {
  return {
    total: pieces.length,
    withDimensions: pieces.filter((p) => normaliseDimensions(p.dimensions, locale)).length,
    withOrigin: pieces.filter((p) => originOf(p, locale)).length,
    withMaterial: pieces.filter((p) => materialOf(p, locale)).length,
    withDescription: pieces.filter((p) => p.description.length > 0).length,
    placeholderDimensions: pieces.filter(
      (p) => p.dimensions && !normaliseDimensions(p.dimensions, locale),
    ).length,
  };
}
