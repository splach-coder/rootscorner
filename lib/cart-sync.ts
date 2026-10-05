import { CART_KEY, readCart, writeCart } from "./cart";
import { storefront, variantFor } from "./shopify";

/**
 * Keeping the site's cart in step with Shopify (client, 6 Oct).
 *
 * The cart lives in this browser; payment happens on Shopify's hosted
 * checkout. Without a link between the two, a buyer who paid came back to a
 * cart still holding the piece they had just bought.
 *
 * THE LINK. When the buyer is handed to Shopify, the cart Shopify created is
 * remembered here with the slugs it carried. Coming back to the site, that
 * cart is looked up:
 *
 *   - Shopify answers `cart: null` → the checkout was COMPLETED (a cart that
 *     has become an order is no longer served). Those pieces leave the cart.
 *   - Shopify still has the cart → the payment was cancelled or abandoned.
 *     Nothing changes; the buyer can pick up where they left off.
 *   - No answer (offline, error) → nothing changes. Only a clean `null` ever
 *     removes anything.
 *
 * Every visit also drops pieces Shopify no longer sells (sold elsewhere, or
 * unpublished). With stock of one, that is a normal event.
 *
 * ONE request per check, at most one check every 20 seconds per tab. After the
 * 5 Oct flood (CLAUDE.md §70) nothing in this site may poll Shopify or the
 * Worker in a loop.
 */

const PENDING_KEY = "trc:checkout";
const MIN_GAP_MS = 20_000;
/** A checkout nobody returned to in this long is forgotten, not acted on. */
const PENDING_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type Pending = { cartId: string; slugs: string[]; at: number };

let lastRun = 0;
let running = false;

export function rememberCheckout(cartId: string, slugs: string[]): void {
  try {
    const pending: Pending = { cartId, slugs, at: Date.now() };
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  } catch {
    /* Private window: the cart simply won't clear itself after payment. */
  }
}

function readPending(): Pending | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Pending;
    if (!p?.cartId || !Array.isArray(p.slugs)) return null;
    if (Date.now() - p.at > PENDING_TTL_MS) {
      localStorage.removeItem(PENDING_KEY);
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

/** The result, for a caller that wants to say "thank you". */
export type SyncResult = { completed: boolean; removed: string[] };

type Answer = {
  cart?: { id: string } | null;
  nodes?: ({ id: string; availableForSale?: boolean } | null)[];
};

export async function syncCartWithShopify(): Promise<SyncResult | null> {
  if (running || Date.now() - lastRun < MIN_GAP_MS) return null;
  const pending = readPending();
  const slugs = readCart();
  if (!pending && slugs.length === 0) return null;

  running = true;
  lastRun = Date.now();
  try {
    // Variant ids for what is in the cart now. A rug line IS its variant id.
    const ids = slugs
      .map((slug) => (slug.startsWith("rug:") ? slug.slice(4) : variantFor(slug)))
      .filter((id): id is string => Boolean(id));

    // One request answers both questions.
    const query = `query($cartId: ID!, $ids: [ID!]!, $withCart: Boolean!) {
      cart(id: $cartId) @include(if: $withCart) { id }
      nodes(ids: $ids) { ... on ProductVariant { id availableForSale } }
    }`;
    const r = await storefront<Answer>(query, {
      cartId: pending?.cartId ?? "gid://shopify/Cart/none",
      withCart: Boolean(pending),
      ids,
    });
    if (r.errors?.length || !r.data) return null;

    const removed = new Set<string>();
    let completed = false;

    if (pending && r.data.cart === null) {
      completed = true;
      pending.slugs.forEach((s) => removed.add(s));
      localStorage.removeItem(PENDING_KEY);
    }

    const sold = new Set(
      (r.data.nodes ?? [])
        .filter((n): n is { id: string; availableForSale?: boolean } => Boolean(n?.id))
        .filter((n) => n.availableForSale === false)
        .map((n) => n.id),
    );
    for (const slug of slugs) {
      const id = slug.startsWith("rug:") ? slug.slice(4) : variantFor(slug);
      if (id && sold.has(id)) removed.add(slug);
    }

    if (removed.size > 0) {
      // Re-read: the buyer may have changed the cart while we were asking.
      writeCart(readCart().filter((s) => !removed.has(s)));
    }
    return { completed, removed: [...removed] };
  } catch {
    return null;
  } finally {
    running = false;
  }
}

export { CART_KEY };
