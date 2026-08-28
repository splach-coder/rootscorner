import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next appends its own notes to CLAUDE.md otherwise; that file is the
  // project's design record and is maintained by hand.
  agentRules: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Piece photography is portrait-heavy and shown large; these widths cover
    // the hero (full-bleed) down to the smallest thumbnail on a 390pt iPhone.
    deviceSizes: [390, 640, 828, 1080, 1200, 1600, 2000],
    // Next 16 requires every quality used in the app to be declared. 75 is the
    // default; 90 is for the two Instagram interiors, which are only 512x640 —
    // the smallest files on the site, so they can least afford re-compression.
    qualities: [75, 90],
  },
};

export default nextConfig;
