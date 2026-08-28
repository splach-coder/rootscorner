"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { cartLines, cartTotal } from "@/lib/cart";
import { formatPrice, imagePath } from "@/lib/catalog";
import { displayName } from "@/lib/specs";
import { paymentReady, startCheckout } from "@/lib/checkout";
import type { Locale } from "@/lib/dictionaries";

type CheckoutLabels = {
  order: string;
  subtotal: string;
  shippingNote: string;
  pay: string;
  back: string;
  empty: string;
  emptyCta: string;
  notConnected: string;
  notConnectedNote: string;
  enquire: string;
  failed: string;
};

/**
 * The order, and the handover.
 *
 * The cart lives in the browser, so the summary has to be rendered on the
 * client — and until the provider has read storage, `ready` is false and this
 * shows nothing rather than flashing an empty order at someone who has one.
 */
export default function CheckoutOrder({
  locale,
  t,
  cart,
  contactEmail,
  instagram,
}: {
  locale: Locale;
  t: CheckoutLabels;
  cart: { remove: string; unique: string };
  contactEmail: string | null;
  instagram: string;
}) {
  const { slugs, ready, remove } = useCart();
  const [state, setState] = useState<"idle" | "sending" | "not-connected" | "failed">("idle");

  const lines = cartLines(slugs, locale);
  const { total } = cartTotal(lines, locale);

  if (!ready) return <div className="shell checkout-inner" aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className="shell checkout-inner">
        <div className="checkout-empty">
          <p className="lede">{t.empty}</p>
          <Link href={`/${locale}/collection`} className="link label">
            {t.emptyCta}
          </Link>
        </div>
      </div>
    );
  }

  /**
   * The order as a message — the fallback that works today, and a genuinely
   * useful thing to have even once payment is live: it is how someone asks a
   * question about an order they are about to place.
   */
  const summary = lines
    .map((line) => `· ${displayName(line.piece)} — ${formatPrice(line.piece, locale) ?? "—"}`)
    .join("\n");
  const subject =
    locale === "fr" ? "Commande — The Roots Corner" : "Order — The Roots Corner";
  const body = `${summary}\n\n${t.subtotal}: ${total ?? "—"}\n`;
  const enquiryHref = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : instagram;

  async function onPay() {
    setState("sending");
    const result = await startCheckout(slugs);
    if (result.ok) {
      window.location.href = result.url;
      return;
    }
    setState(result.reason === "not-connected" ? "not-connected" : "failed");
  }

  return (
    <div className="shell checkout-inner">
      <div className="checkout-lines">
        <p className="label checkout-key">{t.order}</p>

        <ul className="checkout-list">
          {lines.map(({ piece, price }) => {
            const src = imagePath(piece.images[0]);
            return (
              <li key={piece.slug} className="checkout-line">
                <Link href={`/${locale}/piece/${piece.slug}`} className="frame checkout-frame">
                  {src && (
                    <Image
                      src={src}
                      alt=""
                      width={piece.images[0].w}
                      height={piece.images[0].h}
                      sizes="120px"
                    />
                  )}
                </Link>

                <div className="checkout-said">
                  <Link
                    href={`/${locale}/piece/${piece.slug}`}
                    className="checkout-name display d-3"
                  >
                    {displayName(piece)}
                  </Link>
                  <button
                    type="button"
                    className="label checkout-remove"
                    onClick={() => remove(piece.slug)}
                  >
                    {cart.remove}
                  </button>
                </div>

                {price && <p className="checkout-price">{price}</p>}
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="checkout-sum">
        <div className="checkout-total">
          <span className="label">{t.subtotal}</span>
          <span className="display d-2 checkout-total-value">{total}</span>
        </div>

        <p className="prose checkout-shipping">{t.shippingNote}</p>

        <button
          type="button"
          className="checkout-pay label"
          onClick={onPay}
          disabled={state === "sending"}
        >
          {t.pay}
        </button>

        {/* Stated plainly rather than hidden behind a disabled button. Someone
            who has chosen a piece deserves to know exactly where this stops and
            what to do instead. */}
        {(state === "not-connected" || state === "failed") && (
          <div className="checkout-notice" role="status">
            <p className="label checkout-notice-key">
              {state === "failed" ? t.failed : t.notConnected}
            </p>
            {state === "not-connected" && (
              <p className="prose checkout-notice-body">{t.notConnectedNote}</p>
            )}
            <a
              href={enquiryHref}
              className="link label"
              {...(contactEmail ? {} : { target: "_blank", rel: "noreferrer noopener" })}
            >
              {t.enquire}
            </a>
          </div>
        )}

        {!paymentReady() && state === "idle" && (
          <p className="label checkout-pending">{t.notConnected}</p>
        )}

        <p className="label checkout-unique">{cart.unique}</p>

        <Link href={`/${locale}/collection`} className="link label checkout-back">
          {t.back}
        </Link>
      </aside>
    </div>
  );
}
