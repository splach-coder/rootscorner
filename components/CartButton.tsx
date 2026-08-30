"use client";

import { useCart } from "./CartProvider";

/**
 * The cart's handle, in the header.
 *
 * Renders no count until the provider has read storage — the server cannot know
 * what is in localStorage, so showing a number before then is a guaranteed
 * hydration mismatch.
 *
 * The word became a mark. The bar is the one place on this site where every
 * other control is a word, so a cart set as "PANIER" read as one more page to
 * visit rather than as the thing holding what you have chosen — and it measured
 * differently in the two languages, which pulled the row off centre.
 *
 * It is DRAWN, not imported: an icon set would bring in a second hand, and this
 * bar already has a hairline vocabulary — the language caret is 1.2 of
 * currentColor on an open path. The basket matches it exactly. The label
 * survives as the accessible name, so nothing is lost to a screen reader.
 */
export default function CartButton({
  label,
  withLabel = false,
}: {
  label: string;
  withLabel?: boolean;
}) {
  const { slugs, ready, setOpen } = useCart();
  const count = ready ? slugs.length : 0;

  return (
    <button
      type="button"
      className={`label site-cart${withLabel ? " site-cart-worded" : ""}`}
      onClick={() => setOpen(true)}
      aria-label={count > 0 ? `${label} (${count})` : label}
    >
      <svg
        className="site-cart-mark"
        viewBox="0 0 20 20"
        width="20"
        height="20"
        aria-hidden="true"
        focusable="false"
      >
        {/* A basket, not a trolley: a trolley is a supermarket and this is a
            room with objects in it. Open path, flat base, tapered sides, with
            the handle as a half-round rising out of the rim. */}
        <path
          d="M2.6 7.1h14.8l-1.5 9a1.4 1.4 0 0 1-1.4 1.2H5.5a1.4 1.4 0 0 1-1.4-1.2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M6.9 7.1a3.1 3.1 0 0 1 6.2 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>

      {/* In the phone panel the mark stands among display-scale words, where a
          20px glyph alone reads as a stray dot rather than as a control. There
          it keeps the word; in the bar the mark carries it. */}
      {withLabel && <span aria-hidden="true">{label}</span>}

      {count > 0 && (
        <span className="site-cart-count" aria-hidden="true">
          {count}
        </span>
      )}
    </button>
  );
}
