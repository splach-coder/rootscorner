"use client";

import { useState } from "react";
import AddToCart from "./AddToCart";

type Option = { id: string; label: string; price: number; available: boolean };

/**
 * The price and the buy button of a piece — with a size choice when the piece
 * is sold in several sizes (V2: "customers cannot select between sizes S and
 * M… the price updates accordingly"). The sizes are the piece's Shopify
 * variants; the cart carries the chosen one as "slug::variantId".
 */
export default function PieceBuy({
  slug,
  locale,
  price,
  unit,
  options,
  sizeLabel,
  labels,
}: {
  slug: string;
  locale: string;
  /** The formatted price of a piece with one size. */
  price: string | null;
  /** "/ pièce" where several objects are photographed together. */
  unit?: string | null;
  options?: Option[];
  sizeLabel: string;
  labels: { add: string; added: string; view: string; sold: string; soldNote: string };
}) {
  const sellable = (options ?? []).filter((o) => o.available);
  const [chosen, setChosen] = useState<string>(sellable[0]?.id ?? options?.[0]?.id ?? "");
  const fmt = (n: number) =>
    new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n);

  if (!options || options.length < 2) {
    return (
      <>
        {price && (
          <p className="piece-price display d-3">
            {price}
            {unit && <span className="wall-label-unit"> {unit}</span>}
          </p>
        )}
        {price && <AddToCart slug={slug} labels={labels} />}
      </>
    );
  }

  const opt = options.find((o) => o.id === chosen) ?? options[0];
  return (
    <>
      <p className="piece-price display d-3" aria-live="polite">
        {fmt(opt.price)}
      </p>
      <div className="piece-sizes" role="radiogroup" aria-label={sizeLabel}>
        <p className="label piece-sizes-key">{sizeLabel}</p>
        <div className="piece-sizes-row">
          {options.map((o) => (
            <label key={o.id} className={`piece-size${o.available ? "" : " is-gone"}`}>
              <input
                type="radio"
                name={`size-${slug}`}
                value={o.id}
                checked={chosen === o.id}
                disabled={!o.available}
                onChange={() => setChosen(o.id)}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </div>
      <AddToCart key={opt.id} slug={`${slug}::${opt.id}`} labels={labels} />
    </>
  );
}
