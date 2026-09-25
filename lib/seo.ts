import type { Metadata } from "next";
import type { Locale } from "@/lib/dictionaries";
import type { Piece } from "@/lib/catalog";
import { ADDRESS, CONTACT_EMAIL, INSTAGRAM, SITE_URL, WHATSAPP } from "@/lib/site";

/**
 * One place that decides what a page tells search engines, AI answer engines
 * and link previews (WhatsApp, Instagram, Facebook, iMessage…).
 *
 * Why a helper: Next REPLACES a parent's `openGraph` object rather than merging
 * it. Pages that set only a title and a description therefore inherited the
 * layout's `og:url` — the homepage — and every shared link to a room or to the
 * story told WhatsApp and Facebook it was the homepage. Every page now builds
 * its whole block here, so it cannot be half-set again.
 *
 * Nothing here writes copy. Titles and descriptions come from the dictionaries
 * and the client's own records (§5).
 */

export type OgImage = { url: string; width: number; height: number; alt?: string };

/** The site-wide preview image: the hero photograph, 1200×630 (scripts/og-images.mjs). */
export const DEFAULT_OG: OgImage = { url: "/og/default.jpg", width: 1200, height: 630 };

/** A scene for a page, from public/og (scripts/og-images.mjs). */
export const og = (file: string): OgImage => ({ url: `/og/${file}`, width: 1200, height: 630 });

export function pageMeta({
  locale,
  path,
  title,
  description,
  image = DEFAULT_OG,
  type = "website",
  index = true,
}: {
  locale: Locale;
  /** After the locale, with a leading slash; "" for the homepage. */
  path: string;
  title: string;
  description?: string;
  image?: OgImage;
  type?: "website" | "article";
  index?: boolean;
}): Metadata {
  const url = `/${locale}${path}`;
  const images = [{ ...image, alt: image.alt ?? title }];
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { fr: `/fr${path}`, en: `/en${path}`, "x-default": `/fr${path}` },
    },
    openGraph: {
      type,
      siteName: "The Roots Corner",
      title,
      description,
      url,
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? ["en_GB"] : ["fr_FR"],
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
    ...(index ? {} : { robots: { index: false, follow: true } }),
  };
}

/** A piece's preview: its own image on the page ground, or its Shopify photo. */
export function pieceOg(piece: Piece, alt: string): OgImage {
  const lead = piece.images[0];
  if (lead?.src) {
    // Added in Shopify: its CDN resizes on request, and that is already a JPEG.
    return { url: `${lead.src}${lead.src.includes("?") ? "&" : "?"}width=1200`, width: 1200, height: Math.round((1200 * lead.h) / lead.w), alt };
  }
  return { url: `/og/pieces/${piece.slug}.jpg`, width: 1200, height: 630, alt };
}

/* ------------------------------------------------------------------------ *
 * Structured data (schema.org JSON-LD)
 *
 * What Google reads for rich results (price and availability under a product
 * link, the breadcrumb trail, the business panel), and what AI answer engines
 * read to state facts about the house correctly. Every value is one the site
 * already shows or the client already published: no rating, no review count,
 * no founding year, no "condition" — none of those is sourced, and a made-up
 * field in structured data is a made-up fact Google will repeat (§5).
 * ------------------------------------------------------------------------ */

const ORG_ID = `${SITE_URL}/#organization`;

export function organizationLd(locale: Locale, description: string) {
  const phone = WHATSAPP ? WHATSAPP.replace(/[^\d+]/g, "") : undefined;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "OnlineStore"],
        "@id": ORG_ID,
        name: "The Roots Corner",
        url: SITE_URL,
        logo: `${SITE_URL}/brand/icon-512.png`,
        image: `${SITE_URL}${DEFAULT_OG.url}`,
        description,
        slogan: locale === "fr" ? "Pièces rares. Histoires. Matières." : "Rare pieces. Stories. Materials.",
        email: CONTACT_EMAIL,
        ...(phone ? { telephone: phone } : {}),
        address: {
          "@type": "PostalAddress",
          streetAddress: ADDRESS.street,
          postalCode: "40000",
          addressLocality: "Marrakech",
          addressCountry: "MA",
        },
        sameAs: [INSTAGRAM],
        identifier: [
          { "@type": "PropertyValue", propertyID: "ICE", value: ADDRESS.ice },
          { "@type": "PropertyValue", propertyID: "RC", value: ADDRESS.rc },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "The Roots Corner",
        inLanguage: ["fr", "en"],
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function productLd({
  piece,
  locale,
  name,
  description,
  category,
  material,
  origin,
}: {
  piece: Piece;
  locale: Locale;
  name: string;
  description?: string;
  category: string;
  material?: string | null;
  origin?: string | null;
}) {
  const url = `${SITE_URL}/${locale}/piece/${piece.slug}`;
  const images = piece.images.slice(0, 6).map((i) => (i.src ? i.src : `${SITE_URL}/pieces/${i.file}`));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name,
    url,
    image: images,
    ...(description ? { description } : {}),
    category,
    brand: { "@type": "Brand", name: "The Roots Corner" },
    ...(material ? { material } : {}),
    // Not `countryOfOrigin`: that field means a country, and the client's own
    // names mostly carry a cultural attribution ("Dogon", "Baule") that must
    // not be resolved into one (§14). The attribution goes in as a plain
    // property, exactly as written.
    ...(origin ? { additionalProperty: [{ "@type": "PropertyValue", name: "origin", value: origin }] } : {}),
    ...(piece.price !== null
      ? {
          offers: {
            "@type": "Offer",
            url,
            price: piece.price.toFixed(2),
            priceCurrency: piece.currency || "EUR",
            availability: piece.available ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
            seller: { "@id": ORG_ID },
            shippingDetails: [
              shipping(["MA"], 25),
              shipping(ABROAD, piece.price >= 200 ? 80 : 50),
            ],
          },
        }
      : {}),
  };
}

/** The house's own published rates (lib/legal.ts, delivery), as Shopify charges them. */
function shipping(countries: string[], amount: number) {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: amount.toFixed(2), currency: "EUR" },
    shippingOrigin: { "@type": "DefinedRegion", addressCountry: "MA" },
    shippingDestination: countries.map((c) => ({ "@type": "DefinedRegion", addressCountry: c })),
  };
}

/** Schema.org has no "rest of world": the markets the brief names, then the obvious next. */
const ABROAD = ["FR", "BE", "CH", "DE", "NL", "LU", "ES", "IT", "PT", "GB", "US", "CA"];

export function itemListLd(locale: Locale, pieces: Piece[], name: (p: Piece) => string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: pieces.length,
    itemListElement: pieces.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/${locale}/piece/${p.slug}`,
      name: name(p),
    })),
  };
}

/**
 * FAQPage — built from the FAQ exactly as the page renders it, so the markup
 * can never say something the visible page does not (Google's own rule, and
 * §5's). Its answers are the ones in lib/legal.ts `faq`, which only states
 * facts the site holds.
 */
export function faqLd(locale: Locale, items: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/${locale}/faq#faq`,
    inLanguage: locale,
    mainEntity: items.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
