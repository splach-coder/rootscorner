import type { Locale } from "@/lib/dictionaries";

/**
 * The series offered on the made-to-measure Mrirt form.
 *
 * Feedback, 25 Sept, verbatim: "For the rugs, include all the different series
 * in the available options. Examples: Formation - Terracotta + Chocolate
 * Brown + Taupe" — the format of benirugs.com: a SERIES (a design) followed by
 * its colourway, each shown with a swatch.
 *
 * "Formation" is Beni's own series name and is not used here. The names below
 * are plain descriptions of the design, in the house's own palette family.
 *
 * ⚠️ A PROPOSAL FOR THE HOUSE TO CONFIRM. The client has not yet named the
 * cooperative's series; replace this list with theirs when they do. Every
 * series is something a visitor may ASK for — the form is an enquiry, answered
 * personally — not a claim about a rug already woven (§5).
 */

export type Series = { value: string; swatch: string[] };

const W = {
  natural: "#ece4d6",
  sand: "#beab93",
  taupe: "#8e857b",
  caramel: "#b98a5a",
  terracotta: "#b0634a",
  chocolate: "#4b3123",
  black: "#2a2623",
};

type Row = { design: { fr: string; en: string }; colours: { fr: string; en: string; c: string }[] };

const C = {
  natural: { fr: "Laine naturelle", en: "Natural wool", c: W.natural },
  sand: { fr: "Sable", en: "Sand", c: W.sand },
  taupe: { fr: "Taupe", en: "Taupe", c: W.taupe },
  caramel: { fr: "Caramel", en: "Caramel", c: W.caramel },
  terracotta: { fr: "Terracotta", en: "Terracotta", c: W.terracotta },
  chocolate: { fr: "Brun chocolat", en: "Chocolate brown", c: W.chocolate },
  black: { fr: "Noir", en: "Black", c: W.black },
};

const SERIES: Row[] = [
  { design: { fr: "Uni", en: "Plain" }, colours: [C.natural] },
  { design: { fr: "Uni", en: "Plain" }, colours: [C.caramel] },
  { design: { fr: "Lignes", en: "Lines" }, colours: [C.natural, C.taupe] },
  { design: { fr: "Lignes", en: "Lines" }, colours: [C.natural, C.black] },
  { design: { fr: "Losanges", en: "Diamonds" }, colours: [C.natural, C.chocolate] },
  { design: { fr: "Losanges", en: "Diamonds" }, colours: [C.terracotta, C.chocolate, C.taupe] },
  { design: { fr: "Graphique", en: "Graphic" }, colours: [C.sand, C.taupe] },
  { design: { fr: "Graphique", en: "Graphic" }, colours: [C.terracotta, C.chocolate] },
];

export function rugSeries(locale: Locale): {
  options: Series[];
  other: { label: string; hint: string };
  placeholder: string;
} {
  const fr = locale === "fr";
  return {
    options: SERIES.map((s) => ({
      value: `${fr ? s.design.fr : s.design.en} — ${s.colours.map((c) => (fr ? c.fr : c.en)).join(" + ")}`,
      swatch: s.colours.map((c) => c.c),
    })),
    other: fr
      ? { label: "Autre série", hint: "Décrivez le motif et les couleurs que vous imaginez." }
      : { label: "Another series", hint: "Describe the pattern and colours you have in mind." },
    placeholder: fr ? "Choisir une série" : "Choose a series",
  };
}
