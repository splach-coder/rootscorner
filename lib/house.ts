/**
 * The two parts of the business the brief never described.
 *
 * Both were found on the client's live site while transcribing the legal pages:
 * an Airbnb of two apartments in Marrakech, and a page paying tribute to the
 * artisans behind the pieces. Neither appears in the commercial proposal or the
 * brief, and the photography for both was pulled from the live site — see
 * docs/reference/pages/harvest.json for the capture.
 *
 * Every string is theirs, transcribed. French is a translation (CLAUDE.md §11).
 */

import type { Locale } from "./dictionaries";

export type Apartment = {
  key: string;
  name: string;
  blurb: string;
  /** The client's own Airbnb listing. Real links, taken off their live page. */
  href: string;
  image: { src: string; w: number; h: number; alt: string };
};

/**
 * The listings, verbatim from the "BOOK YOUR STAY" buttons on
 * therootscorner.com/our-airbnb/. The share tracking is left on the URLs as
 * the client set them — stripping it would quietly change what their own
 * analytics see.
 */
const LISTINGS = {
  one: "https://www.airbnb.fr/rooms/1373865440056311546?unique_share_id=dacb37a3-4bfc-4cab-bf1f-a671bdee5374&viralityEntryPoint=1&s=76&source_impression_id=p3_1777311626_P3qn3RvGwiKCA6jD",
  two: "https://www.airbnb.fr/rooms/7242470?unique_share_id=62e4fb10-9c91-44c2-bfad-4f08ff3ce061&viralityEntryPoint=1&s=76&source_impression_id=p3_1777759823_P3kkDJ4d5quk3LCA",
} as const;

/** Measured from the downloaded files, so nothing reflows as they decode. */
const ROOM_SHOTS = {
  one: { src: "/rooms/rooms-01.jpg", w: 1024, h: 768 },
  two: { src: "/rooms/rooms-02.jpg", w: 800, h: 599 },
} as const;

export function apartments(locale: Locale): Apartment[] {
  if (locale === "fr") {
    return [
      {
        key: "one",
        name: "Appartement I",
        blurb:
          "Un appartement calme et pensé avec soin, près de la médina de Marrakech, où les intérieurs contemporains rencontrent les textures chaudes du Maroc.",
        href: LISTINGS.one,
        image: { ...ROOM_SHOTS.one, alt: "Séjour aux chaises noires" },
      },
      {
        key: "two",
        name: "Appartement II",
        blurb:
          "Notre second appartement offre une atmosphère plus intime, faite d’intérieurs chaleureux, de matières naturelles et d’un quotidien paisible.",
        href: LISTINGS.two,
        image: {
          ...ROOM_SHOTS.two,
          alt: "Objet décoratif dans une lumière douce",
        },
      },
    ];
  }

  return [
    {
      key: "one",
      name: "Apartment I",
      blurb:
        "A calm and thoughtfully designed apartment near the medina of Marrakech, blending contemporary interiors with warm Moroccan textures.",
      href: LISTINGS.one,
      // The client's own alt text on the live site.
      image: { ...ROOM_SHOTS.one, alt: "Living room with black chairs" },
    },
    {
      key: "two",
      name: "Apartment II",
      blurb:
        "Our second apartment offers a more intimate atmosphere, shaped by warm interiors, natural textures and calm everyday living.",
      href: LISTINGS.two,
      image: {
        ...ROOM_SHOTS.two,
        alt: "A decorative item that creates a soothing atmosphere",
      },
    },
  ];
}

/**
 * The places named on the collaboration page, in the client's order.
 *
 * The names are theirs, including "Cote d'ivoire" as they spell it — corrected
 * only for the circumflex and capitalisation the rest of this site already
 * applies to the same country (lib/specs.ts). Nothing is added: they name three
 * places and give no further detail, so the page says three places.
 *
 * The photographs are unlabelled on the live site. They are therefore NOT
 * captioned as any particular country here — pairing a face or a workshop with
 * a country nobody named would be inventing a provenance (CLAUDE.md §5).
 */
export type ArtisanPlace = { key: string; name: string };

export function artisanPlaces(locale: Locale): ArtisanPlace[] {
  const fr = locale === "fr";
  return [
    { key: "senegal", name: fr ? "Sénégal" : "Senegal" },
    { key: "ivory", name: "Côte d’Ivoire" },
    { key: "morocco", name: fr ? "Maroc — Marrakech" : "Morocco — Marrakech" },
  ];
}

/** Measured from the downloaded files. */
export const ARTISAN_SHOTS = [
  { src: "/artisans/artisans-01.jpg", w: 1280, h: 959 },
  { src: "/artisans/artisans-02.jpg", w: 1280, h: 960 },
] as const;
