import type { Metadata } from "next";
import type { Locale } from "@/lib/dictionaries";
import type { Piece } from "@/lib/catalog";
import { SOCIAL, ADDRESS, CONTACT_EMAIL, INSTAGRAM, SITE_URL, WHATSAPP } from "@/lib/site";
import ogFiles from "@/docs/og.json";

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

/*
 * Every preview is a 1200×630 JPEG in public/og, built by scripts/og-images.mjs
 * before each deploy and listed in docs/og.json with a hash of its bytes. The
 * hash goes into the URL: WhatsApp and iMessage cache a preview by URL for
 * good, so a new image has to arrive at a new address.
 */
const OG_FILES = ogFiles as Record<string, string>;
export const hasOg = (file: string) => file in OG_FILES;

/** A preview image from public/og, versioned. */
export const og = (file: string): OgImage => ({
  url: `/og/${file}${OG_FILES[file] ? `?v=${OG_FILES[file]}` : ""}`,
  width: 1200,
  height: 630,
});

/** The site-wide preview image: the hero photograph. */
export const DEFAULT_OG: OgImage = og("default.jpg");

/** Cut a description at the last whole word under `max` characters. */
export function clip(text: string | undefined, max = 155): string | undefined {
  if (!text) return text;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  // A whole sentence if one ends late enough; otherwise the last whole word.
  const sentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  if (sentence > max * 0.55) return cut.slice(0, sentence + 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:·\s]+$/, "")}…`;
}

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
  // Every preview is a JPEG; WhatsApp and Facebook read the type first.
  const images = [{ ...image, alt: image.alt ?? title, type: "image/jpeg" }];
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => ({ url: i.url, alt: i.alt })),
    },
    ...(index ? {} : { robots: { index: false, follow: true } }),
  };
}

/** A piece's preview: its own image on the page ground, or its Shopify photo. */
export function pieceOg(piece: Piece, alt: string): OgImage {
  // Built for every piece, including those added in Shopify (scripts/og-images.mjs).
  const slug = piece.slug.split("::")[0];
  if (hasOg(`pieces/${slug}.jpg`)) return { ...og(`pieces/${slug}.jpg`), alt };
  // Added since the last build: the collection's preview until the next one.
  return { ...og("collection.jpg"), alt };
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
        // Name variants only, no new facts (SEO audit, 11 Oct): what people
        // type when they look for the house.
        alternateName: ["Roots Corner", "TheRootsCorner", "The Roots Corner Marrakech"],
        url: SITE_URL,
        logo: `${SITE_URL}/brand/icon-512.png`,
        image: `${SITE_URL}${DEFAULT_OG.url}`,
        description,
        slogan: "Rooted in every corner",
        email: CONTACT_EMAIL,
        ...(phone ? { telephone: phone } : {}),
        address: {
          "@type": "PostalAddress",
          streetAddress: ADDRESS.street,
          postalCode: "40000",
          addressLocality: "Marrakech",
          addressCountry: "MA",
        },
        sameAs: [INSTAGRAM, ...SOCIAL.filter((s) => s.key !== "instagram" && s.key !== "whatsapp").map((s) => s.href)],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: CONTACT_EMAIL,
            ...(phone ? { telephone: phone } : {}),
            availableLanguage: ["fr", "en"],
          },
        ],
        areaServed: ["MA", ...ABROAD],
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
        alternateName: ["Roots Corner", "TheRootsCorner"],
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
    sku: piece.slug,
    ...(piece.price !== null
      ? {
          offers:
            piece.options && piece.options.length > 1
              ? {
                  "@type": "AggregateOffer",
                  url,
                  lowPrice: Math.min(...piece.options.map((o) => o.price)).toFixed(2),
                  highPrice: Math.max(...piece.options.map((o) => o.price)).toFixed(2),
                  offerCount: piece.options.length,
                  priceCurrency: piece.currency || "EUR",
                  availability: piece.available ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
                  seller: { "@id": ORG_ID },
                }
              : {
                  "@type": "Offer",
                  url,
                  price: piece.price.toFixed(2),
                  priceCurrency: piece.currency || "EUR",
                  availability: piece.available ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
                  seller: { "@id": ORG_ID },
                  hasMerchantReturnPolicy: returnPolicy(locale),
                },
        }
      : {}),
  };
}

/** The withdrawal policy (lib/legal.ts): 14 days from receipt, return by post at the buyer's cost. */
function returnPolicy(locale: Locale) {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: ["MA", ...ABROAD],
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 14,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
    merchantReturnLink: `${SITE_URL}/${locale}/legal/withdrawal`,
  };
}

/** A page that is ABOUT the house (story) or for reaching it (contact). */
export function pageLd(type: "AboutPage" | "ContactPage" | "CollectionPage", locale: Locale, path: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    url: `${SITE_URL}/${locale}${path}`,
    name,
    inLanguage: locale,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": ORG_ID },
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
