/**
 * Spot-check the label normaliser against the client's real dimension strings.
 * Mirrors lib/specs.ts; run after changing either.
 */
import catalog from "../docs/catalog.json" with { type: "json" };

const NOT_A_DIMENSION = [
  /here you can describe the exact dimensions/i,
  /exact dimensions (will be )?available very soon/i,
  /^\s*[sml]\s*$/i,
];
const LABEL_PREFIX = /^\s*(features?|dimensions?|taille|size)\s*[:-]?\s*/i;
const AXIS_WORDS = [
  [/\bheight\b/gi, { en: "Height", fr: "Hauteur" }],
  [/\blength\b/gi, { en: "Length", fr: "Longueur" }],
  [/\bdiameter\b/gi, { en: "Diameter", fr: "Diamètre" }],
  [/\bwidth\b/gi, { en: "Width", fr: "Largeur" }],
  [/\bbetween\b/gi, { en: "Between", fr: "Entre" }],
  [/\band\b/gi, { en: "and", fr: "et" }],
  [/\bet\b/gi, { en: "and", fr: "et" }],
];

function norm(raw, locale = "en") {
  if (!raw) return null;
  const t = raw.replace(/ /g, " ").trim();
  if (!t || NOT_A_DIMENSION.some((re) => re.test(t))) return null;
  let v = t.replace(LABEL_PREFIX, "");
  if (!/\d/.test(v)) return null;
  v = v
    .replace(/\s*[*x×]\s*/gi, " × ")
    .replace(/\s*\/\s*/g, " × ")
    .replace(/\s+/g, " ")
    .replace(/\s*-\s*$/, "")
    .trim()
    .replace(/[.,;]$/, "");
  for (const [re, forms] of AXIS_WORDS) v = v.replace(re, forms[locale]);
  return v.replace(/(\d(?:[.,]\d+)?)\s*(cm|mm|m|in)\b/gi, "$1 $2") || null;
}

let fails = 0;
console.log("raw -> en | fr\n");
for (const p of catalog) {
  const en = norm(p.dimensions, "en");
  const fr = norm(p.dimensions, "fr");
  if (!en) continue;
  console.log(`${JSON.stringify(p.dimensions)}\n   en: ${en}\n   fr: ${fr}`);
  // The boundary bug: "diameter" must not become "diamand" or similar.
  if (/diam(?!eter|ètre)/i.test(en) || /diam(?!eter|ètre)/i.test(fr)) {
    console.log("   !! BOUNDARY BUG");
    fails++;
  }
}
console.log(
  `\nusable: ${catalog.filter((p) => norm(p.dimensions)).length}/${catalog.length}`,
);
console.log(fails ? `FAILURES: ${fails}` : "no boundary failures");
