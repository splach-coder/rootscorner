// Cloudflare Workers build (see docs/SHOPIFY.md §8 and CLAUDE.md §62).
//
// The static-assets cache serves the prerendered pages straight from Workers
// Assets and never writes. That fits this site: every page is built once at
// deploy and nothing revalidates, so the R2 cache the template reaches for
// would be a bucket (and a billing profile) holding copies of files the
// assets directory already has.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
