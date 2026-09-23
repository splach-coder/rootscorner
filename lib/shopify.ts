import variants from "@/docs/shopify.json";
import live from "@/docs/shopify-live.json";

/**
 * The Shopify Storefront API — the only Shopify this site talks to.
 *
 * ---------------------------------------------------------------------------
 * TWO TOKENS, AND ONLY ONE OF THEM MAY EVER BE PUBLIC
 *
 * `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` is a **Storefront** access token. It
 * is designed to be shipped to a browser: it can read published products and
 * create a cart, and it can do nothing else. Putting it in a client bundle is
 * the intended use, not a leak.
 *
 * `SHOPIFY_ADMIN_TOKEN` (lib/…/subscribe, §26) is the opposite. It can read
 * customers and orders and edit the store. It has NO `NEXT_PUBLIC_` prefix and
 * must never be given one — that prefix is what inlines a value into every
 * JavaScript bundle the site serves. If the two are ever confused, the store is
 * compromised the moment the site deploys.
 * ---------------------------------------------------------------------------
 */

/** Pinned. An unpinned version silently changes the schema under the app. */
const API_VERSION = "2025-01";

export const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || null;
export const SHOPIFY_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || null;

/**
 * Where a buyer goes to see their own orders.
 *
 * Shopify HOSTS customer accounts, the same way it hosts checkout — and for the
 * same reason we do not rebuild it (§37): the orders live there, Shopify owns
 * the authentication, and this site never touches a credential. Sign-in is
 * passwordless (a six-digit code by e-mail), so there is no password for us to
 * store, leak, or reset.
 *
 * The value is either Shopify's own `https://shopify.com/<shop_id>/account` or
 * a branded subdomain — `https://account.therootscorner.com` — which is the
 * better one to set, because it keeps the house's name in front of someone
 * checking on a parcel.
 *
 * Unset, no account link renders anywhere. An account link that leads nowhere
 * is worse than none, and until the store exists there are no orders to show.
 */
export const ACCOUNT_URL =
  process.env.NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL?.trim() || null;

/**
 * slug → Shopify variant ID, from docs/shopify.json.
 *
 * A SEPARATE manifest, not a field added to docs/catalog.json: that file is the
 * client's own record exactly as it was scraped and is deliberately never
 * edited (§46). This is our mapping onto their store, so it lives in our file.
 *
 * **Empty is the supported state**, the same way an empty Instagram manifest is
 * (lib/instagram.ts). It means no store is linked yet, `paymentReady()` is
 * false, and every buy action stays the enquiry it has always been.
 *
 * `scripts/shopify-link.mjs` writes it: it reads the store's own products and
 * matches them to the catalogue, so nobody types a `gid://` by hand.
 */
const VARIANTS: Record<string, string> = {
  ...(variants as Record<string, string>),
  // Pieces the house added in Shopify after launch, from the build snapshot
  // (scripts/shopify-pull.mjs). They were never in docs/shopify.json.
  ...Object.fromEntries(
    (live as { extra: { slug: string; variantId: string }[] }).extra.map((e) => [e.slug, e.variantId]),
  ),
};

/** The variant ID for a piece, or null if the store does not carry it. */
export function variantFor(slug: string): string | null {
  const id = VARIANTS[slug];
  return typeof id === "string" && id.length > 0 ? id : null;
}

/** How many of the catalogue's pieces are actually linked to the store. */
export function linkedCount(): number {
  return Object.values(VARIANTS).filter(
    (id) => typeof id === "string" && id.length > 0,
  ).length;
}

/** Whether the store's credentials are both present. */
export function storeConfigured(): boolean {
  return Boolean(SHOPIFY_DOMAIN && SHOPIFY_TOKEN);
}

export type StorefrontResult<T> = { data?: T; errors?: { message: string }[] };

/**
 * One GraphQL call to the Storefront API.
 *
 * `cache: "no-store"` because every call this app makes is a mutation that
 * creates a cart. A cached cart would hand two different buyers the same
 * checkout URL — which, with stock of one of everything, means selling the same
 * object twice.
 */
export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<StorefrontResult<T>> {
  if (!storeConfigured()) return { errors: [{ message: "not configured" }] };

  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN as string,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    },
  );

  if (!res.ok) return { errors: [{ message: `HTTP ${res.status}` }] };
  return (await res.json()) as StorefrontResult<T>;
}

/**
 * Is this piece still for sale, right now?
 *
 * The build snapshot (docs/shopify-live.json) can be hours old, and with stock
 * of one "sold an hour ago" is a normal state. The piece page asks Shopify
 * directly from the browser before offering the button. Resolves to null when
 * the answer is unknown (no store, network error) — the caller keeps what the
 * build said rather than guessing either way.
 */
export async function liveAvailability(slug: string): Promise<boolean | null> {
  const id = variantFor(slug);
  if (!id) return null;
  try {
    const r = await storefront<{ node: { availableForSale: boolean } | null }>(
      `query($id: ID!) { node(id: $id) { ... on ProductVariant { availableForSale } } }`,
      { id },
    );
    if (r.errors?.length || !r.data) return null;
    // A variant the storefront no longer returns has been unpublished.
    return r.data.node ? r.data.node.availableForSale : false;
  } catch {
    return null;
  }
}
