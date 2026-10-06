/**
 * The name, origin and nature of each of the original 38 pieces, in both
 * languages — V1 feedback §3 and §6.
 *
 * ## Why this file exists
 *
 * The house asked for French names on the French site ("Tabouret sculpté à la
 * main — Côte d’Ivoire", "Pot en argile noircie — Maroc", "Bâton tribal
 * Dogon"), English names on the English one, and no mix. Their records carry
 * one shouting English name each ("HANDCRAFTED WOOD STOOL – CÔTE D’IVOIRE"), so
 * both display names are written here, keyed by slug, and the record itself is
 * left untouched.
 *
 * ## What a name may say
 *
 * Only what the house's own record says about the piece — its name, its
 * description, its details (§5). A name never adds an origin, an age or an
 * attribution the record does not carry. Where the record is silent, so is the
 * name.
 *
 * ## Origin (§6 of V1)
 *
 * "Do not simply use 'Origine : Dogon'." A cultural attribution is stated as
 * one, with the region the house's own copy gives or the broad region the
 * tradition belongs to — never resolved into a country it might not be from:
 *
 *   confirmed in the record   → "Vallée du Bandama, Côte d’Ivoire"
 *   attribution only          → "Afrique de l’Ouest — attribué à la tradition Dogon"
 *
 * The second form is the house's own wording for exactly this case. If a
 * provenance is later confirmed, change that one line (e.g. "Pays Dogon,
 * Mali").
 *
 * ## Nature and period
 *
 * `nature` separates antique, vintage and artisanal pieces (V1 §6), and is set
 * ONLY where the record itself uses the word — "antique", "vintage",
 * "handcrafted / hand-carved". `period` only where the record dates the piece.
 *
 * A piece added in Shopify after launch is not in this list; it shows the name
 * the house typed there, in whichever language she typed it.
 */

import type { Lang } from "./specs";

type Both = Record<Lang, string>;

export type Nature = "antique" | "vintage" | "artisanal";

export type PieceText = {
  name: Both;
  origin?: Both;
  nature?: Nature;
  period?: Both;
};

const dogon: Both = {
  fr: "Afrique de l’Ouest, attribué à la tradition Dogon",
  en: "West Africa, attributed to the Dogon tradition",
};

export const PIECE_TEXT: Record<string, PieceText> = {
  // ---- Sièges & tabourets ------------------------------------------------
  "handcrafted-wood-stool---cote-d-ivoire": {
    // V1 feedback §3, verbatim.
    name: { fr: "Tabouret sculpté à la main, Côte d’Ivoire", en: "Hand-carved wooden stool, Côte d’Ivoire" },
    origin: { fr: "Côte d’Ivoire", en: "Côte d’Ivoire" },
    nature: "artisanal",
  },
  "hand-carved-tribal-stool-wood": {
    name: { fr: "Tabouret tribal sculpté en bois", en: "Hand-carved tribal wooden stool" },
    nature: "artisanal",
  },
  "handmade-wooden-stool": {
    // The record: "Antique Bamileke royal wooden stool from Cameroon, dating
    // back to the first half of the 20th century."
    name: { fr: "Tabouret royal Bamileke, Cameroun", en: "Bamileke royal stool, Cameroon" },
    origin: { fr: "Cameroun, tradition Bamileke", en: "Cameroon, Bamileke tradition" },
    nature: "antique",
    period: { fr: "Première moitié du XXᵉ siècle", en: "First half of the 20th century" },
  },
  "decorative-wooden-stool": {
    name: { fr: "Tabouret en bois", en: "Wooden stool" },
  },
  "wooden-carved-stool": {
    // The record: "Origin: Bandama Valley (Ivory Coast), 20th century" and
    // "This vintage piece…".
    name: { fr: "Tabouret en bois noir verni, Côte d’Ivoire", en: "Black varnished wooden stool, Côte d’Ivoire" },
    origin: { fr: "Vallée du Bandama, Côte d’Ivoire", en: "Bandama Valley, Côte d’Ivoire" },
    nature: "vintage",
    period: { fr: "XXᵉ siècle", en: "20th century" },
  },
  "handcrafted-stool": {
    name: { fr: "Tabouret en bois brun au liseré doré", en: "Brown wooden stool with a gilded rim" },
    nature: "artisanal",
  },
  "handcrafted-varnished-wooden-stool": {
    name: { fr: "Tabouret ajouré en bois verni", en: "Openwork varnished wooden stool" },
    nature: "artisanal",
  },
  "handcrafted-wooden-stool": {
    name: { fr: "Tabouret ajouré en bois noir", en: "Openwork black wooden stool" },
    nature: "artisanal",
  },
  "handcrafted-stool-from-cameroon": {
    name: { fr: "Tabouret traditionnel, Cameroun", en: "Traditional stool, Cameroon" },
    origin: { fr: "Cameroun", en: "Cameroon" },
    nature: "artisanal",
  },
  "dogon-stool": {
    name: { fr: "Tabouret Dogon", en: "Dogon stool" },
    origin: dogon,
  },
  "senufo-stool": {
    // The record: "a timeless object originating from West Africa".
    name: { fr: "Tabouret Sénoufo", en: "Senufo stool" },
    origin: {
      fr: "Afrique de l’Ouest, attribué à la tradition sénoufo",
      en: "West Africa, attributed to the Senufo tradition",
    },
    nature: "artisanal",
  },
  "baule-chair-cote-d-ivoire": {
    name: { fr: "Chaise Baoulé, Côte d’Ivoire", en: "Baule chair, Côte d’Ivoire" },
    origin: {
      fr: "Côte d’Ivoire, attribué à la tradition baoulé",
      en: "Côte d’Ivoire, attributed to the Baule tradition",
    },
    nature: "artisanal",
  },

  // ---- Vases ---------------------------------------------------------------
  "antique-moroccan-vase": {
    name: { fr: "Vase ancien en terre cuite, Maroc", en: "Antique terracotta vase, Morocco" },
    origin: { fr: "Maroc", en: "Morocco" },
    nature: "antique",
  },
  "antique-berber-vase": {
    name: { fr: "Vase berbère ancien émaillé", en: "Antique glazed Berber vase" },
    origin: {
      fr: "Afrique du Nord, attribué à la tradition berbère",
      en: "North Africa, attributed to the Berber tradition",
    },
    nature: "antique",
  },

  // ---- Pots & contenants --------------------------------------------------
  "handmade-blackened-clay-pot---morocco": {
    // V1 feedback §3, verbatim.
    name: { fr: "Pot en argile noircie, Maroc", en: "Blackened clay pot, Morocco" },
    origin: { fr: "Maroc", en: "Morocco" },
    nature: "artisanal",
  },
  "decorative-ceramic-pot": {
    name: { fr: "Pot traditionnel en céramique, Maroc", en: "Traditional ceramic pot, Morocco" },
    origin: { fr: "Maroc", en: "Morocco" },
    nature: "artisanal",
  },
  "timeless-hand-carved-wooden-bowl-1": {
    name: { fr: "Bol en bois sculpté à la main", en: "Hand-carved wooden bowl" },
    nature: "artisanal",
  },
  "ancient-african-mortar": {
    name: { fr: "Mortier ancien en bois, Afrique", en: "Antique wooden mortar, Africa" },
    origin: { fr: "Afrique", en: "Africa" },
    nature: "antique",
  },
  "antique-moroccan-pot": {
    name: { fr: "Pot ancien, Maroc", en: "Antique pot, Morocco" },
    origin: { fr: "Maroc", en: "Morocco" },
    nature: "antique",
  },

  // ---- Céramiques de Tamegroute ------------------------------------------
  "handmade-pottery-vase-made-in-morocco": {
    name: { fr: "Vase sculptural en céramique, Maroc", en: "Sculptural ceramic vase, Morocco" },
    origin: { fr: "Maroc", en: "Morocco" },
    nature: "artisanal",
  },
  "tamegroute-candle-s-and-m": {
    name: { fr: "Bougie de Tamegroute (S et M)", en: "Tamegroute candle (S & M)" },
    origin: { fr: "Tamegroute, Maroc", en: "Tamegroute, Morocco" },
    nature: "artisanal",
  },
  "handmade-ceramic-candlestick-tamgroute": {
    name: { fr: "Bougeoir en céramique de Tamegroute", en: "Tamegroute ceramic candlestick" },
    origin: { fr: "Tamegroute, Maroc", en: "Tamegroute, Morocco" },
    nature: "artisanal",
  },

  // ---- Luminaires ----------------------------------------------------------
  "wabi-sabi-moroccan-vase-lamp": {
    name: { fr: "Lampe wabi-sabi, vase marocain ancien", en: "Wabi-sabi lamp, antique Moroccan vase" },
    origin: { fr: "Maroc", en: "Morocco" },
    nature: "artisanal",
  },

  // ---- Pièces anciennes & tribales ---------------------------------------
  "dogon-tribal-staff": {
    // V1 feedback §3, verbatim.
    name: { fr: "Bâton tribal Dogon", en: "Dogon tribal staff" },
    origin: dogon,
  },
  "tuareg-tent-stakes": {
    name: { fr: "Piquets de tente touaregs", en: "Tuareg tent stakes" },
    origin: {
      fr: "Sahara, attribué à la tradition touarègue",
      en: "Sahara, attributed to the Tuareg tradition",
    },
    nature: "antique",
  },
  "authentic-wooden-tent-peg": {
    name: { fr: "Piquet de tente en bois", en: "Wooden tent peg" },
  },
  "decorative-wooden-tray": {
    // The record describes "an antique wooden tablet bearing traces of Arabic
    // writing"; the listing holds two boards (lib/catalog SOLD_AS_MULTIPLE).
    name: { fr: "Tablette ancienne en bois, écriture arabe", en: "Antique wooden tablet, Arabic script" },
    nature: "antique",
  },
  "solid-wood-pedestal-bowl---ethiopian-and-west-african-craftsmanship-1": {
    name: { fr: "Coupe sur pied en bois massif", en: "Solid wood pedestal bowl" },
    // The record: "Ethiopian & West African craftsmanship".
    origin: { fr: "Éthiopie et Afrique de l’Ouest", en: "Ethiopia and West Africa" },
  },
  "antique-comb-used-for-weaving-moroccan-rugs": {
    name: { fr: "Peigne ancien de tisserand", en: "Antique weaver’s comb" },
    // The record: "used for weaving Moroccan rugs", engraved with Berber designs.
    origin: { fr: "Maroc", en: "Morocco" },
    nature: "antique",
  },
  "loom-beater-african-art": {
    name: { fr: "Battant de métier à tisser, art africain", en: "Loom beater, African art" },
    origin: { fr: "Afrique", en: "Africa" },
  },
  "vintage-moroccan-shelf-berbere": {
    name: { fr: "Étagère berbère vintage, Maroc", en: "Vintage Berber shelf, Morocco" },
    origin: { fr: "Maroc, tradition berbère", en: "Morocco, Berber tradition" },
    nature: "vintage",
  },

  // ---- Objets & sculptures -------------------------------------------------
  "turtle-shaped-indonesia": {
    name: { fr: "Objet en forme de tortue, Indonésie", en: "Turtle-shaped object, Indonesia" },
    origin: { fr: "Indonésie", en: "Indonesia" },
  },
  "vintage-moroccan-teapot": {
    name: { fr: "Théière marocaine vintage", en: "Vintage Moroccan teapot" },
    origin: { fr: "Maroc", en: "Morocco" },
    nature: "vintage",
  },
  "antique-lombok-spinning-top": {
    name: { fr: "Toupie ancienne, Lombok", en: "Antique spinning top, Lombok" },
    origin: { fr: "Lombok, Indonésie", en: "Lombok, Indonesia" },
    nature: "antique",
  },
  "spinning-top-gasing-indonesia": {
    name: { fr: "Toupie gasing, Indonésie", en: "Gasing spinning top, Indonesia" },
    origin: { fr: "Indonésie", en: "Indonesia" },
  },
  "spice-rack-morocco": {
    name: { fr: "Étagère à épices, Maroc", en: "Spice rack, Morocco" },
    origin: { fr: "Maroc", en: "Morocco" },
  },
  "decorative-iron-disc-indonesian": {
    name: { fr: "Disque décoratif en fer, Indonésie", en: "Decorative iron disc, Indonesia" },
    origin: { fr: "Indonésie", en: "Indonesia" },
  },
  "lombok-weel-indonesian": {
    name: { fr: "Roue de Lombok, Indonésie", en: "Lombok wheel, Indonesia" },
    origin: { fr: "Lombok, Indonésie", en: "Lombok, Indonesia" },
  },

  // ---- Tapis (Shopify-only) ------------------------------------------------
  // The house's own Shopify titles, given an English name so /en never shows
  // French (V1 §3). Nothing added beyond the title.
  "tapis-laine-sable-carreaux-ocre": {
    name: { fr: "Tapis Mrirt, laine sable, carreaux ocre", en: "Mrirt rug, sand wool, ochre squares" },
  },
  "tapis-laine-prune-frise": {
    name: { fr: "Tapis Mrirt, laine prune, frise", en: "Mrirt rug, plum wool, border" },
  },
};

export const NATURE_LABEL: Record<Nature, Both> = {
  antique: { fr: "Pièce ancienne", en: "Antique" },
  vintage: { fr: "Pièce vintage", en: "Vintage" },
  artisanal: { fr: "Pièce artisanale", en: "Handmade" },
};
