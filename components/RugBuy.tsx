"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AddToCart from "./AddToCart";
import type { RugSeries } from "@/lib/rugs";

type Labels = {
  colour: string;
  size: string;
  from: string;
  onRequest: string;
  onRequestNote: string;
  ask: string;
  madeToOrder: string;
  cart: { add: string; added: string; view: string; sold: string; soldNote: string };
};

/**
 * The order panel of a Mrirt series — benirugs.com's shape: the colourways as
 * rows with a swatch, the sizes as a grid, the price of the chosen pair, one
 * filled bar to add it.
 *
 * The price shown is exactly the variant's Shopify price. A pair the house has
 * not priced yet (0) shows "prix sur demande" and the enquiry instead of a
 * button: nothing is sold at a price nobody set (§5).
 */
export default function RugBuy({
  series,
  swatches,
  locale,
  labels,
}: {
  series: RugSeries;
  swatches: Record<string, string[] | undefined>;
  locale: string;
  labels: Labels;
}) {
  const [colour, setColour] = useState(series.colours[0]?.name ?? "");
  const [size, setSize] = useState(series.sizes[0] ?? "");

  const variant = useMemo(
    () => series.variants.find((v) => v.colour === colour && v.size === size) ?? null,
    [series, colour, size],
  );
  const price = variant && variant.price > 0 ? variant.price : null;
  const fmt = (n: number) =>
    new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
      style: "currency",
      currency: variant?.currency || "EUR",
      maximumFractionDigits: 0,
    }).format(n);

  const ask = `/${locale}/mrirt#comment`;

  return (
    <div className="rug-buy">
      <div className="rug-buy-group" role="radiogroup" aria-labelledby="rug-colour">
        <p id="rug-colour" className="label rug-buy-key">
          {labels.colour} <span className="rug-buy-chosen">{colour}</span>
        </p>
        <div className="choice-options choice-list rug-buy-options">
          {series.colours.map((c) => (
            <label key={c.name} className="choice-option">
              <input
                type="radio"
                name="rug-colour"
                value={c.name}
                checked={colour === c.name}
                onChange={() => setColour(c.name)}
              />
              {swatches[c.name] && (
                <span className="choice-swatch" aria-hidden="true">
                  {swatches[c.name]!.map((bg, i) => (
                    <span key={i} style={{ background: bg }} />
                  ))}
                </span>
              )}
              <span className="label">{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="rug-buy-group" role="radiogroup" aria-labelledby="rug-size">
        <p id="rug-size" className="label rug-buy-key">
          {labels.size} <span className="rug-buy-chosen">{size}</span>
        </p>
        <div className="choice-options choice-grid rug-buy-options">
          {series.sizes.map((z) => (
            <label key={z} className="choice-option">
              <input type="radio" name="rug-size" value={z} checked={size === z} onChange={() => setSize(z)} />
              <span className="label">{z}</span>
            </label>
          ))}
        </div>
        <p className="label rug-buy-note">{labels.madeToOrder}</p>
      </div>

      <div className="rug-buy-bar">
        {price !== null && variant ? (
          <>
            <p className="display d-3 rug-buy-price">{fmt(price)}</p>
            <AddToCart key={variant.id} slug={`rug:${variant.id}`} labels={labels.cart} />
          </>
        ) : (
          <>
            <p className="display d-3 rug-buy-price">{labels.onRequest}</p>
            <p className="prose rug-buy-onrequest">{labels.onRequestNote}</p>
            <Link href={ask} className="piece-buy-add label">
              {labels.ask}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
