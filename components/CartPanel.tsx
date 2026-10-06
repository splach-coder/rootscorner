"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "./CartProvider";
import { cartLines, cartTotal } from "@/lib/cart";
import { imagePath } from "@/lib/catalog";
import { displayName, normaliseDimensions, originOf } from "@/lib/specs";
import { whatsappHref } from "@/lib/site";
import { Picto } from "./BrandMarks";
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
  count: string;
  origin: string;
  dimensions: string;
  colour: string;
  size: string;
  price: string;
  uniqueTag: string;
  orderTag: string;
  emptyRugs: string;
  help: string;
  helpLink: string;
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
  const wa = whatsappHref();

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
        {/* After benirugs.com's drawer: the title large, the count beside
            it, a chevron to close; each line a thumbnail on the tile ground,
            the name, and a small ruled list of what it is. */}
        <div className="cart-head">
          <p className="display d-2 cart-title">
            {t.title}
            {lines.length > 0 && <span className="cart-count">{t.count.replace("{n}", String(lines.length))}</span>}
          </p>
          <button type="button" className="cart-close" aria-label={t.close} onClick={() => setOpen(false)}>
            <svg viewBox="0 0 12 20" width="10" height="16" aria-hidden="true">
              <path d="M2 2l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="cart-empty">
            <Picto className="cart-empty-mark" />
            <p className="display d-3 cart-empty-line">{t.empty}</p>
            <div className="cart-empty-ways">
              <Link href={`/${locale}/collection`} className="cart-checkout label" onClick={() => setOpen(false)}>
                {t.emptyCta}
              </Link>
              <Link href={`/${locale}/mrirt`} className="cart-ghost label" onClick={() => setOpen(false)}>
                {t.emptyRugs}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="cart-lines">
              {lines.map(({ piece, price }) => {
                const src = imagePath(piece.images[0]);
                const href = piece.href ?? `/${locale}/piece/${piece.slug}`;
                const isRug = piece.slug.startsWith("rug:");
                // A rug line's name is "Mrirt rug · Series · Colour · Size".
                const parts = isRug ? piece.name.split(" · ") : [];
                const title = isRug ? parts.slice(0, 2).join(" ") : displayName(piece, locale);
                const rows: [string, string][] = isRug
                  ? ([
                      [t.colour, parts[2]],
                      [t.size, parts[3]],
                    ].filter(([, v]) => v) as [string, string][])
                  : ([
                      [t.origin, originOf(piece, locale)],
                      [t.dimensions, normaliseDimensions(piece.dimensions, locale)],
                    ].filter(([, v]) => v) as [string, string][]);
                if (price) rows.push([t.price, price]);
                return (
                  <li key={piece.slug} className="cart-line">
                    <Link href={href} className={`cart-line-frame${isRug ? " is-rug" : ""}`} onClick={() => setOpen(false)} tabIndex={-1} aria-hidden="true">
                      {src && (
                        <Image src={src} alt="" width={piece.images[0].w} height={piece.images[0].h} sizes="112px" />
                      )}
                    </Link>

                    <div className="cart-line-said">
                      <div className="cart-line-top">
                        <div>
                          <p className="label cart-line-tag">{isRug ? t.orderTag : t.uniqueTag}</p>
                          <Link href={href} className="cart-line-name display" onClick={() => setOpen(false)}>
                            {title}
                          </Link>
                        </div>
                        <button
                          type="button"
                          className="label cart-line-remove"
                          aria-label={`${t.remove}: ${title}`}
                          onClick={() => remove(piece.slug)}
                        >
                          {t.remove}
                          <svg viewBox="0 0 10 10" width="8" height="8" aria-hidden="true">
                            <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.2" />
                          </svg>
                        </button>
                      </div>
                      <dl className="cart-line-specs">
                        {rows.map(([k, v]) => (
                          <div key={k} className="cart-line-row">
                            <dt className="label">{k}</dt>
                            <dd>{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="cart-foot">
              <div className="cart-sum">
                <span className="label">{t.subtotal}</span>
                <span className="cart-sum-value">{total}</span>
              </div>
              <p className="cart-note">{t.shippingNote}</p>
              <Link href={`/${locale}/checkout`} className="cart-checkout label" onClick={() => setOpen(false)}>
                <span>{t.checkout}</span>
                <span className="cart-checkout-sum">{total}</span>
              </Link>
              <p className="cart-help">
                {t.help}{" "}
                {wa ? (
                  <a href={wa} className="link" target="_blank" rel="noreferrer noopener">
                    {t.helpLink}
                  </a>
                ) : (
                  <Link href={`/${locale}/contact`} className="link" onClick={() => setOpen(false)}>
                    {t.helpLink}
                  </Link>
                )}
              </p>
              <p className="cart-note cart-note-unique">{t.unique}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
