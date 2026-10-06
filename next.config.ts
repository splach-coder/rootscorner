import type { NextConfig } from "next";

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
