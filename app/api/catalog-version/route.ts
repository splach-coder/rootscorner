import live from "@/docs/shopify-live.json";

/**
 * The fingerprint of the Shopify snapshot this deploy was built from
 * (scripts/shopify-pull.mjs). The scheduled workflow pulls Shopify, computes
 * the same fingerprint, and rebuilds only when the two differ — so a change
 * in the admin reaches the site in minutes without a rebuild every ten.
 */
export const dynamic = "force-static";

export function GET() {
  const { hash, pulledAt } = live as { hash?: string; pulledAt: string | null };
  return Response.json({ hash: hash ?? null, pulledAt });
}
