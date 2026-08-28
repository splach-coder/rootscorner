"use client";

import { useCart } from "./CartProvider";

type AddToCartProps = {
  slug: string;
  labels: { add: string; added: string; view: string };
};

/**
 * The buy action on a piece page.
 *
 * There is no quantity control and there will not be one: every piece in this
 * collection is the only one of it (lib/cart.ts). Once a piece is in the cart
 * the button stops being an action and becomes a statement plus a way back to
 * the cart — offering "add" again would promise a second one.
 */
export default function AddToCart({ slug, labels }: AddToCartProps) {
  const { has, add, setOpen, ready } = useCart();
  const inCart = ready && has(slug);

  if (inCart) {
    return (
      <div className="piece-buy is-in">
        <p className="label piece-buy-state">{labels.added}</p>
        <button type="button" className="link label" onClick={() => setOpen(true)}>
          {labels.view}
        </button>
      </div>
    );
  }

  return (
    <button type="button" className="piece-buy-add label" onClick={() => add(slug)}>
      {labels.add}
    </button>
  );
}
