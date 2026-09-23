import type { MetadataRoute } from "next";
import { allPieces, categorySlugs } from "@/lib/catalog";
import { locales } from "@/lib/dictionaries";
import { LEGAL_SLUGS } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

/**
 * Every indexable page, in both locales, each carrying its hreflang pair.
 * Checkout is left out on purpose: it is noindex (a review step with nothing
 * in it for a search engine), and listing a noindex URL here contradicts it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/collection",
    ...categorySlugs().map((c) => `/collection/${c}`),
    ...allPieces().map((p) => `/piece/${p.slug}`),
    "/story",
    "/mrirt",
    "/artisans",
    "/stay",
    "/contact",
    "/faq",
    ...LEGAL_SLUGS.map((s) => `/legal/${s}`),
  ];

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
        ),
      },
    })),
  );
}
