/**
 * The two parts of the business the brief never described.
 *
 * Both were found on the client's live site while transcribing the legal pages:
 * two apartments in Marrakech, and a page paying tribute to the artisans behind
 * the pieces. Neither appears in the commercial proposal or the
 * brief, and the photography for both was pulled from the live site — see
 * docs/reference/pages/harvest.json for the capture.
 *
 * Every string is theirs, transcribed. French is a translation (CLAUDE.md §11).
 */

import type { Locale } from "./dictionaries";
import { whatsappHref } from "./site";

export type Apartment = {
  key: string;
  name: string;
  blurb: string;
  /**
   * Where "book your stay" goes: a WhatsApp chat opened on this apartment.
   *
   * It was the client's own listing on a letting platform. They asked for the
   * platform out — stays are arranged directly now — so the link is built from
   * the house's own number and carries the apartment's name, the same way a
   * piece enquiry carries its piece.
   */
  href: string;
  image: { src: string; w: number; h: number; alt: string };
};

/**
 * Booking, as a message rather than a platform.
 *
 * These were the two "BOOK YOUR STAY" buttons off the client's live page,
 * carried with their own share tracking. The client asked for the platform
 * removed: a stay is arranged directly now, on the same WhatsApp number the
 * rest of the site uses.
 *
 * The chat opens already naming the apartment, so the house knows which one is
 * being asked about before anyone types — exactly what a piece enquiry does
 * with its piece (§24).
 *
 * `whatsappHref` returns null when no number is configured, which is a real
 * state and not a defect: the environment is the single place that decides
 * (§49). So this falls back to the contact page, which always exists and always
 * reaches someone. The button can never be a link to nowhere.
 */
function bookHref(locale: Locale, apartment: string): string {
  return whatsappHref(apartment) ?? `/${locale}/contact`;
}

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
        href: bookHref(locale, "Appartement I"),
        image: { ...ROOM_SHOTS.one, alt: "Séjour aux chaises noires" },
      },
      {
        key: "two",
        name: "Appartement II",
        blurb:
          "Notre second appartement offre une atmosphère plus intime, faite d’intérieurs chaleureux, de matières naturelles et d’un quotidien paisible.",
        href: bookHref(locale, "Appartement II"),
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
      href: bookHref(locale, "Apartment I"),
      // The client's own alt text on the live site.
      image: { ...ROOM_SHOTS.one, alt: "Living room with black chairs" },
    },
    {
      key: "two",
      name: "Apartment II",
      blurb:
        "Our second apartment offers a more intimate atmosphere, shaped by warm interiors, natural textures and calm everyday living.",
      href: bookHref(locale, "Apartment II"),
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
