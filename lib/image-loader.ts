/**
 * Shopify photographs are resized BY SHOPIFY (components/Img.tsx uses this).
 *
 * The URL takes a `width` and Shopify's CDN returns that size, in WebP or AVIF
 * when the browser accepts it, so these photographs never pass through the
 * Worker. Before, every size of every product photo was fetched and resized
 * inside the Cloudflare Worker (/_next/image): a Worker request each, a
 * 7-second limit on fetching the original, and Cloudflare's resizing on top —
 * the one place on the site that failed under a burst of photographs (client,
 * 11 Oct: broken photos on the rug wall). The site's own photographs (public/)
 * keep Next's default loader.
 */
export const SHOPIFY_CDN = "https://cdn.shopify.com/";

export function shopifyLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const url = new URL(src);
  url.searchParams.set("width", String(width));
  return url.toString();
}
