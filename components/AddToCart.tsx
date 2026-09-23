"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { liveAvailability } from "@/lib/shopify";

type AddToCartProps = {
  slug: string;
  labels: { add: string; added: string; view: string; sold: string; soldNote: string };
};

/**
 * The buy action on a piece page.
 *
 * There is no quantity control and there will not be one: every piece in this
 * collection is the only one of it (lib/cart.ts). Once a piece is in the cart
 * the button stops being an action and becomes a statement plus a way back to
 * the cart — offering "add" again would promise a second one.
 *
 * The page was built with the stock Shopify had at build time. Before the
 * button is trusted, Shopify is asked again; if the piece has sold since, the
 * button becomes the same sold statement the server renders for a sold piece,
 * and it is taken out of the cart so nobody reaches checkout with it.
 */
export default function AddToCart({ slug, labels }: AddToCartProps) {
  const { has, add, remove, setOpen, ready } = useCart();
  const [gone, setGone] = useState(false);
  const inCart = ready && has(slug);

  useEffect(() => {
    let live = true;
    liveAvailability(slug).then((available) => {
      if (live && available === false) setGone(true);
    });
    return () => {
      live = false;
    };
  }, [slug]);

  useEffect(() => {
    if (gone && ready && has(slug)) remove(slug);
  }, [gone, ready, has, remove, slug]);

  if (gone) {
    return (
      <div className="piece-buy is-gone" role="status">
        <p className="piece-price display d-3 is-gone">{labels.sold}</p>
        <p className="label piece-cta-note">{labels.soldNote}</p>
      </div>
    );
  }

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
