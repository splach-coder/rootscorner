"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CART_CHANGED, readCart, writeCart } from "@/lib/cart";

type CartContext = {
  /** Slugs in the cart. Empty until the client has read storage. */
  slugs: string[];
  /** False until mount — the server cannot know what is in storage. */
  ready: boolean;
  has: (slug: string) => boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const Ctx = createContext<CartContext | null>(null);

/**
 * Cart state, shared by the header button, the panel and the piece page.
 *
 * `ready` exists because the cart lives in localStorage and the server cannot
 * see it. Rendering a count on the server and a different one after hydration
 * is a mismatch; every consumer renders the empty state until `ready` is true.
 * That costs one frame and removes a whole class of hydration bug.
 */
export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSlugs(readCart());
    setReady(true);

    // Same tab: our own writes. Other tabs: the storage event.
    const sync = () => setSlugs(readCart());
    window.addEventListener(CART_CHANGED, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_CHANGED, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((slug: string) => {
    const next = readCart();
    // One of everything: adding twice is not an increment, it is a no-op.
    if (!next.includes(slug)) writeCart([...next, slug]);
    setOpen(true);
  }, []);

  const remove = useCallback((slug: string) => {
    writeCart(readCart().filter((s) => s !== slug));
  }, []);

  const clear = useCallback(() => writeCart([]), []);

  const value = useMemo<CartContext>(
    () => ({
      slugs,
      ready,
      has: (slug) => slugs.includes(slug),
      add,
      remove,
      clear,
      open,
      setOpen,
    }),
    [slugs, ready, add, remove, clear, open],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
