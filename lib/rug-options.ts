import type { Locale } from "@/lib/dictionaries";
import live from "@/docs/shopify-live.json";

/**
 * The Mrirt series on the made-to-order form — FROM SHOPIFY.
 *
 * Feedback, 25 Sept: "include all the different series in the available
 * options. Examples: Formation - Terracotta + Chocolate Brown + Taupe", and
 * "link them to Shopify, she will update from there, same as collections".
 *
 * So each series is a Shopify product of type "Tapis Mrirt" (collection
 * "Tapis Mrirt"), with a Couleur option and a Taille option — benirugs.com's
 * own structure. scripts/shopify-pull.mjs snapshots them before every build;
 * the scheduled sync redeploys when she edits one. Nothing about a series is
 * written here: rename it, add a colourway or a size in the admin, and the
 * form follows.
 *
 * Options read "Series — Colourway", the format of her example. A swatch is
 * her own variant photo when she has attached one, otherwise drawn from the
 * colour words in the name. An unknown word gets no swatch rather than a
 * guessed colour.
 */

type Snapshot = {
  rugSeries?: {
    title: string;
    colours: { name: string; image: string | null }[];
    sizes: string[];
  }[];
};
const SERIES = (live as Snapshot).rugSeries ?? [];

export type ChoiceOption = { value: string; swatch?: string[] };

/* Wool colour words → swatch. Warm and earth only (§2). */
const WORDS: [RegExp, string][] = [
  [/laine naturelle|natural wool|naturel|ivoire|ivory|cr[èe]me|cream|[ée]cru/i, "#ece4d6"],
  [/sable|sand|beige/i, "#beab93"],
  [/taupe|gris|grey|gray/i, "#8e857b"],
  [/caramel|miel|honey|ocre|ochre/i, "#b98a5a"],
  [/terracotta|terre cuite/i, "#b0634a"],
  [/rouille|rust|rouge|red|brique|brick/i, "#94472d"],
  [/brun|brown|chocolat|chocolate|marron/i, "#4b3123"],
  [/noir|black/i, "#2a2623"],
];

function swatchFor(colourway: string, image: string | null): string[] | undefined {
  if (image) return [`url("${image}&width=120") center / cover`];
  const parts = colourway.split(/\s*\+\s*/);
  const colours = parts.map((p) => WORDS.find(([re]) => re.test(p))?.[1]);
  return colours.every(Boolean) ? (colours as string[]) : undefined;
}

export function rugChoices(locale: Locale) {
  const fr = locale === "fr";
  const series: ChoiceOption[] = SERIES.flatMap((s) =>
    s.colours.map((c) => ({ value: `${s.title} — ${c.name}`, swatch: swatchFor(c.name, c.image) })),
  );
  // Every size any series offers, in the order she lists them.
  const sizes = [...new Set(SERIES.flatMap((s) => s.sizes))].map((value) => ({ value }));

  return {
    series: {
      options: series,
      other: fr
        ? { label: "Autre série", hint: "Décrivez le motif et les couleurs que vous imaginez." }
        : { label: "Another series", hint: "Describe the pattern and colours you have in mind." },
      placeholder: fr ? "Choisir une série" : "Choose a series",
    },
    size: {
      options: sizes,
      other: fr
        ? { label: "Sur mesure", hint: "Longueur × largeur, en centimètres." }
        : { label: "Made to measure", hint: "Length × width, in centimetres." },
      placeholder: fr ? "Choisir une taille" : "Choose a size",
    },
  };
}
