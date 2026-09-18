import {
  SHOPIFY_DOMAIN,
  SHOPIFY_TOKEN,
  linkedCount,
  storeConfigured,
  storefront,
  variantFor,
} from "./shopify";

/**
 * Checkout — the seam, now wired.
 *
 * Everything above this file (the cart, the panel, the checkout page) was
 * finished long before Shopify existed. This is the only place that knows the
 * store exists at all.
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
 * To switch it on — and note that only the first is code we control:
 *
 *   1. `NEXT_PUBLIC_SHOPIFY_DOMAIN` + `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`.
 *   2. The 38 pieces have to EXIST in the store, because a cart line references
 *      a variant ID and nothing else. `node scripts/shopify-link.mjs` reads the
 *      store and writes docs/shopify.json; it never invents an ID.
 *
 * ⚠️ Turning this on is TWO jobs, and the second is not optional: Shopify's
 * hosted checkout sets third-party cookies, which makes `cookies` in
 * lib/legal.ts — a document that currently states this site sets none — wrong
 * in the permissive direction, and arms the consent banner (§44). Do both in
 * the same change.
 */

export { SHOPIFY_DOMAIN, SHOPIFY_TOKEN };

/**
 * Whether a real payment processor is connected.
 *
 * Credentials are not enough. A store with no products linked would send a
 * buyer to a Shopify cart with nothing in it, so this also requires at least
 * one piece in the manifest — the difference between "configured" and "able to
 * sell something".
 */
export function paymentReady(): boolean {
  return storeConfigured() && linkedCount() > 0;
}

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; reason: "not-connected" | "failed" };

type CartCreate = {
  cartCreate?: {
    cart?: { checkoutUrl?: string } | null;
    userErrors?: { message: string }[];
  };
};

const CART_CREATE = `
  mutation trcCartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl }
      userErrors { field message }
    }
  }
`;

/**
 * Hand the cart to Shopify and get back the hosted checkout URL.
 *
 * Takes slugs rather than variant IDs, because nothing above this file has any
 * reason to know what a variant ID is.
 */
export async function startCheckout(slugs: string[]): Promise<CheckoutResult> {
  if (!paymentReady()) return { ok: false, reason: "not-connected" };
  if (slugs.length === 0) return { ok: false, reason: "failed" };

  /*
    Every line must resolve, or none of them go.

    A partially linked store is a real state — the pieces are added to Shopify
    over time — and dropping the unresolved lines would be the worst possible
    handling: the buyer reaches Shopify, sees a smaller order than the one they
    reviewed, and has no way to know what happened or why. Refusing sends them
    to the enquiry with the order they actually chose.

    It reports `not-connected` rather than `failed` on purpose. "Failed" invites
    a retry, and retrying cannot help — nothing about the next attempt will be
    different until someone links that piece.
  */
  const lines: { merchandiseId: string; quantity: number }[] = [];
  for (const slug of slugs) {
    const merchandiseId = variantFor(slug);
    if (!merchandiseId) return { ok: false, reason: "not-connected" };
    // Quantity is always 1. Stock is one of everything (§6), so there is no
    // quantity anywhere in this app to pass through.
    lines.push({ merchandiseId, quantity: 1 });
  }

  try {
    const { data, errors } = await storefront<CartCreate>(CART_CREATE, { lines });
    if (errors?.length) return { ok: false, reason: "failed" };
    if (data?.cartCreate?.userErrors?.length) return { ok: false, reason: "failed" };

    const url = data?.cartCreate?.cart?.checkoutUrl;
    return url ? { ok: true, url } : { ok: false, reason: "failed" };
  } catch {
    // Offline, DNS, a blocked request — the buyer needs the other route, not a
    // spinner. CheckoutOrder keeps the order on screen and offers the enquiry.
    return { ok: false, reason: "failed" };
  }
}
