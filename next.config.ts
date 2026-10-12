import type { NextConfig } from "next";
import { GROUP_OF } from "./lib/piece-copy";

const nextConfig: NextConfig = {
  // Next appends its own notes to CLAUDE.md otherwise; that file is the
  // project's design record and is maintained by hand.
  agentRules: false,
  /*
    ⚠️ Do not remove (5 Oct outage, CLAUDE.md §70).

    Next 16 bundles small prefetch responses together by default
    ("prefetch inlining"). Under that setting the router still asks for a
    segment (`Next-Router-Segment-Prefetch: /_tree`), but @opennextjs/aws's
    cache interceptor skips segment data whenever prefetchInlining is truthy
    and answers with the FULL page payload. The router cannot use it and asks
    again at once, forever: ~200 requests/s per open tab, which emptied the
    Workers daily quota and took the site down. Off, OpenNext serves the
    stored segment and each link is fetched once.
  */
  experimental: {
    prefetchInlining: false,
  },
  /*
    Next's own trailing-slash redirect is a 308, which Meta's link crawler
    (Facebook, Instagram, WhatsApp) does not follow, and it ran before the
    redirects below, so every old Jimdo URL (they all end in a slash) died at
    it. Off, those URLs reach their 301 in one hop, and a page asked for with a
    slash (/fr/) is served as is, its canonical naming the address without.
  */
  skipTrailingSlashRedirect: true,
  /*
    V2 feedback (10 Oct): the apartments and artisans pages are gone. Old links
    land on the homepage rather than on a 404. Here and not in proxy.ts: the
    proxy's matcher only reaches the bare root.

    301, not Next's default 308, for every permanent redirect: Meta's link
    crawler (Facebook, Instagram, WhatsApp) follows a 301 and stops at a 308.
    Measured on Cloudflare, 12 Oct: 315 requests for / in a day, 3 followed on.
    Google treats the two the same.
  */
  async redirects() {
    const gone = ["fr", "en"].flatMap((locale) =>
      ["stay", "artisans"].map((page) => ({
        source: `/${locale}/${page}`,
        destination: `/${locale}`,
        statusCode: 301 as const,
      })),
    );
    /*
      The old Jimdo site's addresses (docs/reference/old-site-sitemap.xml),
      301'd to their new pages so their Google listings and the links people
      shared keep working and pass on to the new site (SEO audit, 11 Oct). An
      old product URL /collection/<room>/<slug> lands on the same piece; an old
      room lands on its category (the [category] page redirects old rooms).
    */
    const old: [string, string][] = [
      // Old rooms straight to their category, in one hop (before the generic rule).
      ...Object.entries(GROUP_OF).flatMap(([room, group]): [string, string][] => [
        [`/collection/${room}`, `/fr/collection/${group}`],
        [`/fr/collection/${room}`, `/fr/collection/${group}`],
        [`/en/collection/${room}`, `/en/collection/${group}`],
      ]),
      ["/collection/:room/:slug", "/fr/piece/:slug"],
      ["/collection/:room", "/fr/collection/:room"],
      ["/collection", "/fr/collection"],
      ["/accueil", "/fr"],
      ["/home", "/fr"],
      ["/about-us", "/fr/story"],
      ["/story", "/fr/story"],
      ["/contact", "/fr/contact"],
      ["/faq", "/fr/faq"],
      ["/mrirt", "/fr/mrirt"],
      ["/mrirt-rugs", "/fr/mrirt"],
      ["/products", "/fr/collection"],
      ["/our-airbnb", "/fr"],
      ["/evenements", "/fr"],
      ["/withdrawal", "/fr/legal/withdrawal"],
      ["/right-of-withdrawal", "/fr/legal/withdrawal"],
      ["/terms-and-conditions", "/fr/legal/terms"],
      ["/imprint", "/fr/legal/imprint"],
      ["/privacy-policy", "/fr/legal/privacy"],
      ["/cookie-policy", "/fr/legal/cookies"],
      ["/delivery-policy", "/fr/legal/delivery"],
    ];
    return [...gone, ...old.map(([source, destination]) => ({ source, destination, statusCode: 301 as const }))];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Piece photography is portrait-heavy and shown large; these widths cover
    // the hero (full-bleed) down to the smallest thumbnail on a 390pt iPhone.
    deviceSizes: [390, 640, 828, 1080, 1200, 1600, 2000],
    // Next 16 requires every quality used in the app to be declared. 75 is the
    // default; 90 is for the two Instagram interiors, which are only 512x640 —
    // the smallest files on the site, so they can least afford re-compression.
    qualities: [75, 90],
    // Photographs of pieces the house adds in Shopify after launch are served
    // from Shopify's CDN (lib/catalog.ts, scripts/shopify-pull.mjs).
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
};

export default nextConfig;
