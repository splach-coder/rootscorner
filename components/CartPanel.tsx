"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "./CartProvider";
import { cartLines, cartTotal } from "@/lib/cart";
import { imagePath } from "@/lib/catalog";
import { displayName } from "@/lib/specs";
import type { Locale } from "@/lib/dictionaries";

export type CartLabels = {
  title: string;
  empty: string;
  emptyCta: string;
  remove: string;
  subtotal: string;
  shippingNote: string;
  checkout: string;
  close: string;
  unique: string;
};

/**
 * The cart, as a panel from the right.
 *
 * It lists what is in it and hands over — no quantity controls, because stock
 * is one of everything (lib/cart.ts), and no shipping estimate, because that is
 * calculated at payment by whoever takes it.
 *
 * Modal behaviour is not decoration here: it locks the page scroll, so it has
 * to trap Tab, close on Escape and return focus to whatever opened it.
 * `components/Header.tsx` does the same for the nav panel and for the same
 * reason.
 */
export default function CartPanel({
  locale,
  t,
}: {
  locale: Locale;
  t: CartLabels;
}) {
  const { slugs, open, setOpen, remove } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  const lines = cartLines(slugs, locale);
  const { total } = cartTotal(lines, locale);

  useEffect(() => {
    if (!open) return;

    returnTo.current = document.activeElement as HTMLElement;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";

    const focusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusable()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const stops = focusable();
      if (stops.length === 0) return;
      const first = stops[0];
      const last = stops[stops.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previous;
      returnTo.current?.focus?.();
    };
  }, [open, setOpen]);

  return (
    <div className={open ? "cart is-open" : "cart"} aria-hidden={!open}>
      <button
        type="button"
        className="cart-veil"
        aria-label={t.close}
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />

      <div
        className="cart-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
      >
        <div className="cart-head">
          <p className="label cart-title">{t.title}</p>
          <button type="button" className="label cart-close" onClick={() => setOpen(false)}>
            {t.close}
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="cart-empty">
            <p className="prose">{t.empty}</p>
            <Link
              href={`/${locale}/collection`}
              className="link label"
              onClick={() => setOpen(false)}
            >
              {t.emptyCta}
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-lines">
              {lines.map(({ piece, price }) => {
                const src = imagePath(piece.images[0]);
                return (
                  <li key={piece.slug} className="cart-line">
                    <Link
                      href={`/${locale}/piece/${piece.slug}`}
                      className="cart-line-frame frame"
                      onClick={() => setOpen(false)}
                    >
                      {src && (
                        <Image
                          src={src}
                          alt=""
                          width={piece.images[0].w}
                          height={piece.images[0].h}
                          sizes="96px"
                        />
                      )}
                    </Link>

                    <div className="cart-line-said">
                      <Link
                        href={`/${locale}/piece/${piece.slug}`}
                        className="cart-line-name display d-3"
                        onClick={() => setOpen(false)}
                      >
                        {displayName(piece)}
                      </Link>
                      {price && <p className="cart-line-price">{price}</p>}
                      <button
                        type="button"
                        className="label cart-line-remove"
                        onClick={() => remove(piece.slug)}
                      >
                        {t.remove}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="cart-foot">
              <div className="cart-sum">
                <span className="label">{t.subtotal}</span>
                <span className="cart-sum-value display d-3">{total}</span>
              </div>
              <p className="label cart-note">{t.shippingNote}</p>
              <p className="label cart-note cart-note-unique">{t.unique}</p>
              <Link
                href={`/${locale}/checkout`}
                className="cart-checkout label"
                onClick={() => setOpen(false)}
              >
                {t.checkout}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
