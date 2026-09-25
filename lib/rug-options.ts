import type { Locale } from "@/lib/dictionaries";

/**
 * The choices offered on the made-to-measure Mrirt form.
 *
 * Feedback, 25 Sept: "For the rugs, include all the different series in the
 * available options", with benirugs.com's Formation rug as the example — a
 * colour series picked from a list of named combinations with swatches, a size
 * grid, the construction (pile), and tassels.
 *
 * ⚠️ THESE LISTS ARE A PROPOSAL FOR THE HOUSE TO CONFIRM, not a record of what
 * the cooperative has woven. The client's own copy says a Mrirt rug is "fully
 * customizable in size, color, design, and texture", so every option here is
 * something a visitor may ASK for — the form is an enquiry, and the house
 * answers each one personally. Nothing here is a price, a lead time or a claim
 * about a finished rug, and no series takes a competitor's product name: the
 * colour names are plain wool colours in the site's own palette family.
 *
 * Edit this file to change what is offered. Every list also ends with "other",
 * a free-text answer, because a made-to-measure rug can always be something a
 * list does not name.
 */

type Option = { value: string; swatch?: string[] };
type Choice = { options: Option[]; other: { label: string; hint: string }; placeholder: string };

/* Wool colours for the swatches. Warm and earth only (§2). */
const W = {
  natural: "#ece4d6",
  sand: "#beab93",
  taupe: "#8e857b",
  caramel: "#b98a5a",
  terracotta: "#b0634a",
  rust: "#94472d",
  chocolate: "#4b3123",
  black: "#2a2623",
};

const SERIES: { fr: string; en: string; swatch: string[] }[] = [
  { fr: "Laine naturelle", en: "Natural wool", swatch: [W.natural] },
  { fr: "Laine naturelle + Taupe", en: "Natural wool + Taupe", swatch: [W.natural, W.taupe] },
  { fr: "Laine naturelle + Brun chocolat", en: "Natural wool + Chocolate brown", swatch: [W.natural, W.chocolate] },
  { fr: "Laine naturelle + Noir", en: "Natural wool + Black", swatch: [W.natural, W.black] },
  { fr: "Caramel + Laine naturelle", en: "Caramel + Natural wool", swatch: [W.caramel, W.natural] },
  { fr: "Sable + Taupe", en: "Sand + Taupe", swatch: [W.sand, W.taupe] },
  { fr: "Terracotta + Brun chocolat", en: "Terracotta + Chocolate brown", swatch: [W.terracotta, W.chocolate] },
  { fr: "Terracotta + Brun chocolat + Taupe", en: "Terracotta + Chocolate brown + Taupe", swatch: [W.terracotta, W.chocolate, W.taupe] },
  { fr: "Rouille + Sable", en: "Rust + Sand", swatch: [W.rust, W.sand] },
];

/** Centimetres, length × width — the sizes a room is usually measured for. */
const SIZES = [
  "60 × 90", "80 × 150", "120 × 180", "140 × 200", "160 × 230", "170 × 240",
  "200 × 250", "200 × 300", "250 × 300", "250 × 350", "300 × 400",
].map((s) => `${s} cm`.replace(/ /g, " ").replace(" × ", " × "));

export function rugChoices(locale: Locale): Record<"size" | "colour" | "design" | "texture" | "fringe", Choice> {
  const fr = locale === "fr";
  const pick = fr ? "Choisir" : "Choose";
  return {
    size: {
      options: SIZES.map((value) => ({ value })),
      other: fr
        ? { label: "Sur mesure", hint: "Longueur × largeur, en centimètres." }
        : { label: "Made to measure", hint: "Length × width, in centimetres." },
      placeholder: pick,
    },
    colour: {
      options: SERIES.map((s) => ({ value: fr ? s.fr : s.en, swatch: s.swatch })),
      other: fr
        ? { label: "Autre couleur", hint: "Décrivez les couleurs que vous imaginez." }
        : { label: "Another colour", hint: "Describe the colours you have in mind." },
      placeholder: pick,
    },
    design: {
      options: (fr
        ? ["Uni", "Lignes", "Losanges", "Motif graphique"]
        : ["Plain", "Lines", "Diamonds", "Graphic pattern"]
      ).map((value) => ({ value })),
      other: fr
        ? { label: "Votre motif", hint: "Décrivez-le — vous pourrez aussi nous envoyer une image." }
        : { label: "Your own pattern", hint: "Describe it — you can also send us an image." },
      placeholder: pick,
    },
    texture: {
      options: (fr
        ? ["Velours épais", "Velours moyen", "Velours ras"]
        : ["Deep pile", "Medium pile", "Low pile"]
      ).map((value) => ({ value })),
      other: fr
        ? { label: "Autre texture", hint: "Décrivez le toucher que vous cherchez." }
        : { label: "Another texture", hint: "Describe the feel you are after." },
      placeholder: pick,
    },
    fringe: {
      options: (fr ? ["Avec franges", "Sans franges"] : ["With fringes", "Without fringes"]).map(
        (value) => ({ value }),
      ),
      other: fr
        ? { label: "À discuter", hint: "Dites-nous ce que vous préférez." }
        : { label: "Let’s discuss", hint: "Tell us what you prefer." },
      placeholder: pick,
    },
  };
}
