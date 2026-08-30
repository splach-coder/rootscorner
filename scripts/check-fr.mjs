/**
 * French product-copy coverage.
 *
 *   node scripts/check-fr.mjs
 *
 * Three questions, all of which have bitten this project:
 *
 * 1. **What is still English on /fr?** Every line the catalogue renders that
 *    has no entry in PRODUCT_FR. These fall back to English rather than
 *    disappearing, so they are invisible in testing — the page looks fine and
 *    is half-translated.
 *
 * 2. **What is translated but no longer used?** A stale key is dead weight and,
 *    worse, hides the fact that the sentence it covered has changed.
 *
 * 3. **Is the French actually French?** A stray character from another script
 *    is trivially easy to type and impossible to see in a diff. One did get in
 *    here (a Chinese "变" inside a sentence about temperature) and this check
 *    is why it did not ship.
 */
import { readFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync(new URL("../docs/catalog.json", import.meta.url)));
const source = readFileSync(new URL("../lib/product-fr.ts", import.meta.url), "utf8");

/* The filters in lib/catalog.ts, mirrored. Kept in step by the assertion at
   the end, which fails if the count of live lines moves unexpectedly. */
const NOT_PRODUCT_COPY = [
  /^this is a good place for any specific policies/i,
  /^describe your product in detail/i,
  /^use this text to briefly describe your product/i,
  /^authentic craftsmanship & ethnic-inspired decor/i,
  /^©$/,
  /^\d{4}-\d{4} the roots corner\.?$/i,
  /^(contact|faq|imprint|privacy policy|cookie settings)$/i,
  /^(delivery|withdrawal) policy$/i,
  /^terms and conditions$/i,
  /^withdraw contract$/i,
  /^(care|details|description)$/i,
];

const isProductCopy = (line) => {
  const text = line.trim();
  return text !== "" && !NOT_PRODUCT_COPY.some((p) => p.test(text));
};

const reflow = (lines) => {
  const out = [];
  for (const line of lines) {
    const previous = out[out.length - 1];
    const continues =
      previous !== undefined &&
      !/[.!?:;]["')\]]?$/.test(previous.trim()) &&
      /^[a-z(]/.test(line.trim());
    if (continues) out[out.length - 1] = `${previous} ${line.trim()}`;
    else out.push(line.trim());
  }
  return out;
};

const entries = Array.isArray(catalog) ? catalog : catalog.products;

/* Every distinct line the site actually renders. */
const live = new Set();
for (const entry of entries) {
  reflow((entry.description ?? []).filter(isProductCopy)).forEach((l) => live.add(l));
  for (const field of ["details", "care"]) {
    (entry[field] ?? []).filter(isProductCopy).forEach((l) => live.add(l.trim()));
  }
  if (entry.delivery) live.add(String(entry.delivery).trim());
}

/* Parse the keys out of the module rather than importing it — this script is
   plain node and the module is TypeScript.
 *
 * The colon may sit on the NEXT line: prettier wraps a long entry as
 *   "…the hand of the artisan.":\n    "Sculpté à la main…",
 * so a pattern requiring `":` on one line silently missed those keys and
 * reported them as both untranslated AND stale — the same sentence in both
 * lists, which is the signature of a parser bug rather than a data gap.
 * The key body excludes newlines explicitly. Without that, `s` let the body
 * run past its own closing quote onto later lines and backtrack to a nearer
 * `":`, so a long key matched only its first clause — which is why one
 * sentence appeared truncated in "stale" and whole in "untranslated". */
const keys = new Set();
for (const match of source.matchAll(/^ {2}"((?:[^"\\\n]|\\.)*)"[ \t]*\n?[ \t]*:/gm)) {
  keys.add(match[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
}

/* Compare NORMALISED, exactly as lib/product-fr.ts does at runtime.
 *
 * The scrape carries non-breaking spaces inside ordinary sentences, and a key
 * typed with a plain space then fails to match a line that looks identical
 * everywhere a human would inspect it. Comparing raw strings here reported one
 * sentence as untranslated AND stale simultaneously — which is the tell. */
const normalise = (text) =>
  text.replace(/[   ]/g, " ").replace(/\s+/g, " ").trim();

const keysNorm = new Set([...keys].map(normalise));
const liveNorm = new Set([...live].map(normalise));

const missing = [...live].filter((l) => !keysNorm.has(normalise(l))).sort();
const stale = [...keys].filter((k) => !liveNorm.has(normalise(k))).sort();

/* Latin, punctuation, and the accents French actually uses. Anything else is
   almost certainly a typo from another keyboard layout. */
const SUSPECT = /[^\p{Script=Latin}\p{P}\p{N}\p{Zs}·×°ᵉ«»’“”—–…]/u;
const foreign = [];
for (const match of source.matchAll(/:\s*\n?\s*"((?:[^"\\]|\\.)*)",?\s*$/gm)) {
  const value = match[1];
  const bad = [...value].filter((c) => SUSPECT.test(c));
  if (bad.length) foreign.push({ value: value.slice(0, 70), bad: [...new Set(bad)] });
}

console.log(`lines rendered by the catalogue : ${live.size}`);
console.log(`translated                      : ${live.size - missing.length}`);
console.log(`still English on /fr             : ${missing.length}`);
console.log(`stale keys (translated, unused) : ${stale.length}`);

if (missing.length) {
  console.log("\n--- untranslated ---");
  missing.forEach((l) => console.log("  · " + l));
}
if (stale.length) {
  console.log("\n--- stale ---");
  stale.forEach((l) => console.log("  · " + l.slice(0, 90)));
}
if (foreign.length) {
  console.log("\n--- NON-LATIN CHARACTERS IN FRENCH ---");
  foreign.forEach((f) => console.log(`  ${JSON.stringify(f.bad)} in "${f.value}…"`));
}

const ok = missing.length === 0 && stale.length === 0 && foreign.length === 0;
console.log(ok ? "\nPASS" : "\nFAIL");
process.exit(ok ? 0 : 1);
