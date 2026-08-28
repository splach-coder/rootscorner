/**
 * Checkout — the swap point for Shopify.
 *
 * This is the whole commerce seam. Everything above it (the cart, the panel,
 * the checkout page) is finished and works today; the only thing missing is a
 * payment processor, and it plugs in here.
 *
 * ---------------------------------------------------------------------------
 * WHY THERE IS NO CARD FORM ON THIS SITE, AND WHY THERE NEVER WILL BE
 *
 * Shopify's checkout is HOSTED. The correct integration creates a cart through
 * the Storefront API, gets back a `checkoutUrl`, and sends the buyer there —
 * Shopify collects the address, calculates shipping and takes the payment on
 * its own domain, under its own PCI compliance.
 *
 * So this site must never render card fields. Building a card form here would
 * either be a lie (it goes nowhere) or a liability (it doesn't). What our
 * checkout page collects is nothing: it is a review step that hands over.
 * ---------------------------------------------------------------------------
 *
 * To switch it on:
 *
 *   1. Set NEXT_PUBLIC_SHOPIFY_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN.
 *   2. Give every piece its Shopify variant ID — `docs/catalog.json` gains a
 *      `variantId` per record, or lib/catalog.ts maps slug → variant.
 *   3. Implement `createShopifyCheckout` below against `cartCreate`.
 *
 * Nothing else in the app changes.
 */

export const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || null;
export const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || null;

/** Whether a real payment processor is connected. */
export function paymentReady(): boolean {
  return Boolean(SHOPIFY_DOMAIN && SHOPIFY_TOKEN);
}

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; reason: "not-connected" | "failed" };

/**
 * Hand the cart to Shopify and get back the hosted checkout URL.
 *
 * `slugs` rather than variant IDs, because the app has no reason to know what a
 * variant ID is until this file does.
 */
export async function startCheckout(slugs: string[]): Promise<CheckoutResult> {
  if (!paymentReady()) return { ok: false, reason: "not-connected" };

  try {
    const url = await createShopifyCheckout(slugs);
    return url ? { ok: true, url } : { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

/**
 * The one function to write when Shopify is set up.
 *
 * Sketch of the real thing — `cartCreate` on the Storefront API, one line per
 * slug at quantity 1 (stock is one of everything), returning `cart.checkoutUrl`:
 *
 *   const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2025-01/graphql.json`, {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *       "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN!,
 *     },
 *     body: JSON.stringify({
 *       query: `mutation($lines:[CartLineInput!]!){
 *         cartCreate(input:{lines:$lines}){ cart { checkoutUrl } }
 *       }`,
 *       variables: { lines: slugs.map((s) => ({ merchandiseId: variantIdFor(s), quantity: 1 })) },
 *     }),
 *   });
 *   const json = await res.json();
 *   return json?.data?.cartCreate?.cart?.checkoutUrl ?? null;
 */
async function createShopifyCheckout(slugs: string[]): Promise<string | null> {
  void slugs;
  return null;
}
