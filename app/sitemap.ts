import type { MetadataRoute } from "next";
import { allPieces, categorySlugs } from "@/lib/catalog";
import { locales } from "@/lib/dictionaries";
import { LEGAL_SLUGS } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

/**
 * Every indexable page, in both locales, each carrying its hreflang pair.
 * Piece pages also list their photographs, so Google Images can find them —
 * for a collection sold on photography, that is a second way in.
 *
 * Checkout is left out on purpose: it is noindex (a review step with nothing
 * in it for a search engine), and listing a noindex URL here contradicts it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; images?: string[]; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/collection", priority: 0.9 },
    ...categorySlugs().map((c) => ({ path: `/collection/${c}`, priority: 0.8 })),
    ...allPieces().map((p) => ({
      path: `/piece/${p.slug}`,
      priority: p.available ? 0.8 : 0.4,
      images: p.images.slice(0, 6).map((i) => i.src ?? `${SITE_URL}/pieces/${i.file}`),
    })),
    { path: "/mrirt", priority: 0.8 },
    { path: "/story", priority: 0.6 },
    { path: "/artisans", priority: 0.5 },
    { path: "/stay", priority: 0.5 },
    { path: "/contact", priority: 0.5 },
    { path: "/faq", priority: 0.3 },
    ...LEGAL_SLUGS.map((s) => ({ path: `/legal/${s}`, priority: 0.2 })),
  ];

  return pages.flatMap(({ path, images, priority }) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      priority,
      ...(images?.length ? { images } : {}),
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      },
    })),
  );
}
