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
 * her own variant photo when she has attached one; otherwise there is none.
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


/**
 * A colourway's swatch is her own photograph of it — the image she attaches to
 * that variant in Shopify — and nothing else. No drawn colour chips: the
 * client's rule is that this site does not invent shapes (feedback, 25 Sept).
 */
export function swatchFor(_colourway: string, image: string | null): string[] | undefined {
  if (!image) return undefined;
  return [`url("${image}${image.includes("?") ? "&" : "?"}width=120") center / cover`];
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
