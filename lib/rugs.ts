import live from "@/docs/shopify-live.json";
import type { Piece, PieceImage } from "@/lib/catalog";

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

export function allRugSeries(): RugSeries[] {
  return SERIES;
}

export function rugSeriesByHandle(handle: string): RugSeries | undefined {
  return SERIES.find((s) => s.handle === handle);
}

/** The lowest price the house has set, or null if none yet. */
export function fromPrice(series: RugSeries): number | null {
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
  return found && found.variant.price > 0 ? id : null;
}

/**
 * A rug variant in the shape the cart already renders. Null when the variant
 * is gone from Shopify or has no price — the cart drops it rather than let
 * someone reach payment with a line nobody can price.
 */
export function rugAsPiece(entry: string, locale: string): Piece | null {
  if (!entry.startsWith(RUG_PREFIX)) return null;
  const found = findVariant(entry.slice(RUG_PREFIX.length));
  if (!found || found.variant.price <= 0 || !found.variant.available) return null;
  const { series, variant } = found;
  const image = series.colours.find((c) => c.name === variant.colour)?.image ?? series.images[0]?.src;
  const images: PieceImage[] = image
    ? [{ file: image, original: image, src: image, w: series.images[0]?.w ?? 800, h: series.images[0]?.h ?? 1000 }]
    : [];
  return {
    slug: entry,
    index: 0,
    name: [locale === "fr" ? "Tapis Mrirt" : "Mrirt rug", series.title, variant.colour, variant.size]
      .filter(Boolean)
      .join(" — "),
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
