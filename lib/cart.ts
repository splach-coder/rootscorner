import { formatPrice, pieceBySlug, type Piece } from "./catalog";

/**
 * The cart.
 *
 * Stock is one of everything — every piece in this collection is the only one
 * of it — so the cart is a SET OF SLUGS, not a list of line items with
 * quantities. There is no quantity stepper anywhere in this UI because a
 * quantity of two is not a thing that can exist here, and building the control
 * would be promising something the inventory cannot honour.
 *
 * Only slugs are stored. Name, price and availability are resolved from the
 * catalogue on every render, so a cart left open overnight cannot show a stale
 * price or offer something that has since sold. When Shopify becomes the source
 * of truth (lib/catalog.ts is the swap point) that stays true for free.
 */

export const CART_KEY = "trc:cart";

/** Fired on the window whenever the stored cart changes, in this tab. */
export const CART_CHANGED = "trc:cart-changed";

export type CartLine = {
  piece: Piece;
  /** Formatted in the current locale, or null where the client gave no price. */
  price: string | null;
};

/** Reads the stored slugs. Safe on the server and in a private window. */
export function readCart(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    // Private windows, cleared site data, storage disabled — an empty cart is
    // the correct answer to all of them.
    return [];
  }
}

export function writeCart(slugs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(slugs));
  } catch {
    /* Nothing to do: the cart lives in memory for this page either way. */
  }
  window.dispatchEvent(new Event(CART_CHANGED));
}

/**
 * Slugs → lines, dropping anything that no longer exists or has since sold.
 *
 * Dropping silently is deliberate: telling someone a piece they chose is gone
 * belongs in the moment they look at the cart, which the cart panel does by
 * simply not listing it. Keeping a dead line would let them reach payment with
 * an object nobody can ship.
 */
export function cartLines(slugs: string[], locale: string): CartLine[] {
  return slugs.flatMap((slug) => {
    const piece = pieceBySlug(slug);
    if (!piece || !piece.available) return [];
    return [{ piece, price: formatPrice(piece, locale) }];
  });
}

/** The sum, and how many lines could not be priced. */
export function cartTotal(
  lines: CartLine[],
  locale: string,
): { total: string | null; unpriced: number } {
  const priced = lines.filter((line) => line.piece.price !== null);
  const unpriced = lines.length - priced.length;
  if (priced.length === 0) return { total: null, unpriced };

  const sum = priced.reduce((n, line) => n + (line.piece.price ?? 0), 0);
  const currency = priced[0].piece.currency || "EUR";

  return {
    total: new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(sum),
    unpriced,
  };
}
