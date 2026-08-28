"use client";

import { useCart } from "./CartProvider";

/**
 * The cart's handle, in the header.
 *
 * Renders no count until the provider has read storage — the server cannot know
 * what is in localStorage, so showing a number before then is a guaranteed
 * hydration mismatch.
 */
export default function CartButton({ label }: { label: string }) {
  const { slugs, ready, setOpen } = useCart();
  const count = ready ? slugs.length : 0;

  return (
    <button
      type="button"
      className="label site-cart"
      onClick={() => setOpen(true)}
      aria-label={count > 0 ? `${label} (${count})` : label}
    >
      <span>{label}</span>
      {count > 0 && (
        <>
          {/* The site's own separator, as used on piece numbers. A gap alone
              ran the count straight onto the word: "PANIER2". */}
          <span className="site-cart-sep" aria-hidden="true">
            ·
          </span>
          <span className="site-cart-count" aria-hidden="true">
            {count}
          </span>
        </>
      )}
    </button>
  );
}
