import live from "@/docs/shopify-live.json";
import { isIllustration, type Piece, type PieceImage } from "@/lib/catalog";

/**
 * Mrirt rugs — sold like benirugs.com.
 *
 * Each SERIES is a Shopify product of type "Tapis Mrirt" (scripts/
 * shopify-rugs.mjs) with a Couleur option and a Taille option; every colour ×
 * size is a variant with its own price. They are woven to order, so stock is
 * not tracked: a variant can be bought as soon as it has a price.
 *
 * A price of 0 means the house has not set one yet. The site then says "prix
 * sur demande" and offers the enquiry — it never sells at a price nobody chose
 * (§5). Everything here is read from the build snapshot; the house edits it in
 * the Shopify admin.
 *
 * In the cart a rug is the string `rug:<variant gid>`, beside the pieces'
 * slugs, so the one cart and the one checkout carry both.
 */

export type RugVariant = {
  id: string;
  colour: string | null;
  size: string | null;
  price: number;
  currency: string;
  available: boolean;
};

export type RugSeries = {
  handle: string;
  title: string;
  description: string;
  colours: { name: string; image: string | null }[];
  sizes: string[];
  images: { src: string; w: number; h: number; alt: string | null }[];
  variants: RugVariant[];
};

const SERIES: RugSeries[] = ((live as { rugSeries?: RugSeries[] }).rugSeries ?? []).map((s) => ({
  ...s,
  images: s.images ?? [],
  variants: s.variants ?? [],
}));

export const RUG_PREFIX = "rug:";

/**
 * V1 feedback §8 — "instead of technical wording such as '3 colours Uni', make
 * every collection feel like its own universe." The four lines are the
 * house's own, verbatim in French. A description typed in the Shopify admin
 * takes over the French line, so the house can rewrite it without a deploy.
 *
 * The collection and colour NAMES are Shopify's (French) and stay the values
 * the cart and checkout match on; on /en they are DISPLAYED in English, so the
 * English site never mixes the two languages (V1 §3).
 */
const SERIES_TEXT: Record<string, { fr: string; en: string; titleEn: string }> = {
  "mrirt-uni": {
    fr: "Laine naturelle, caramel ou taupe.",
    en: "Natural wool, caramel or taupe.",
    titleEn: "Plain",
  },
  "mrirt-lignes": {
    fr: "Des lignes graphiques dans des tons naturels.",
    en: "Graphic lines in natural tones.",
    titleEn: "Lines",
  },
  "mrirt-losanges": {
    fr: "Un motif traditionnel revisité dans des teintes contemporaines.",
    en: "A traditional motif, revisited in contemporary shades.",
    titleEn: "Diamonds",
  },
  "mrirt-graphique": {
    fr: "Des compositions plus affirmées, pensées pour des intérieurs contemporains.",
    en: "Bolder compositions, conceived for contemporary interiors.",
    titleEn: "Graphic",
  },
};

const COLOUR_EN: Record<string, string> = {
  "laine naturelle": "Natural wool",
  caramel: "Caramel",
  taupe: "Taupe",
  noir: "Black",
  "brun chocolat": "Chocolate brown",
  terracotta: "Terracotta",
  sable: "Sand",
  crème: "Cream",
  creme: "Cream",
  blanc: "White",
  gris: "Grey",
  rouge: "Red",
  ocre: "Ochre",
};

export function seriesTitle(series: RugSeries, locale: string): string {
  if (locale === "fr") return series.title;
  return SERIES_TEXT[series.handle]?.titleEn ?? series.title;
}

export function seriesLine(series: RugSeries, locale: string): string | null {
  const text = SERIES_TEXT[series.handle];
  if (locale === "fr") return series.description || text?.fr || null;
  return text?.en ?? null;
}

/** "Terracotta + Brun chocolat" → "Terracotta + Chocolate brown" on /en. */
export function colourName(name: string, locale: string): string {
  if (locale === "fr") return name;
  return name
    .split("+")
    .map((part) => COLOUR_EN[part.trim().toLowerCase()] ?? part.trim())
    .join(" + ");
}

/** Its photographs are still placeholders (Shopify alt "Photo d'illustration"): shown, never sold. */
export function isIllustrativeSeries(series: RugSeries): boolean {
  return series.images.some((i) => isIllustration(i.alt));
}

export function allRugSeries(): RugSeries[] {
  return SERIES;
}

export function rugSeriesByHandle(handle: string): RugSeries | undefined {
  return SERIES.find((s) => s.handle === handle);
}

/** The lowest price the house has set, or null if none yet. */
export function fromPrice(series: RugSeries): number | null {
  // Placeholder photographs: no price shown anywhere (6 Oct).
  if (isIllustrativeSeries(series)) return null;
  const priced = series.variants.map((v) => v.price).filter((p) => p > 0);
  return priced.length ? Math.min(...priced) : null;
}

export function formatEuro(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function findVariant(id: string): { series: RugSeries; variant: RugVariant } | null {
  for (const series of SERIES) {
    const variant = series.variants.find((v) => v.id === id);
    if (variant) return { series, variant };
  }
  return null;
}

/** The Shopify variant behind a `rug:` cart entry. */
export function rugVariantId(entry: string): string | null {
  if (!entry.startsWith(RUG_PREFIX)) return null;
  const id = entry.slice(RUG_PREFIX.length);
  const found = findVariant(id);
  return found && found.variant.price > 0 && !isIllustrativeSeries(found.series) ? id : null;
}

/**
 * A rug variant in the shape the cart already renders. Null when the variant
 * is gone from Shopify or has no price — the cart drops it rather than let
 * someone reach payment with a line nobody can price.
 */
export function rugAsPiece(entry: string, locale: string): Piece | null {
  if (!entry.startsWith(RUG_PREFIX)) return null;
  const found = findVariant(entry.slice(RUG_PREFIX.length));
  if (!found || found.variant.price <= 0 || !found.variant.available || isIllustrativeSeries(found.series)) return null;
  const { series, variant } = found;
  const image = series.colours.find((c) => c.name === variant.colour)?.image ?? series.images[0]?.src;
  const images: PieceImage[] = image
    ? [{ file: image, original: image, src: image, w: series.images[0]?.w ?? 800, h: series.images[0]?.h ?? 1000 }]
    : [];
  return {
    slug: entry,
    index: 0,
    name: [
      locale === "fr" ? "Tapis Mrirt" : "Mrirt rug",
      seriesTitle(series, locale),
      variant.colour ? colourName(variant.colour, locale) : null,
      variant.size,
    ]
      .filter(Boolean)
      .join(" · "),
    price: variant.price,
    currency: variant.currency || "EUR",
    category: "rugs",
    images,
    swapImage: null,
    dimensions: variant.size,
    available: true,
    delivery: null,
    description: [],
    details: [],
    care: [],
    href: `/${locale}/tapis/${series.handle}`,
  };
}
