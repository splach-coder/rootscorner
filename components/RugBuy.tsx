"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AddToCart from "./AddToCart";
import RugDock from "./RugDock";
import type { RugSeries } from "@/lib/rugs";

type Labels = {
  colour: string;
  size: string;
  from: string;
  onRequest: string;
  onRequestNote: string;
  ask: string;
  madeToOrder: string;
  /** Beni's line under the size grid; ours restates "confirmed with the quote". */
  leadNote?: string;
  /** Beni's underlined "CRAFT" under the bar — to the weaving, below. */
  craftLink?: string;
  askBar?: string;
  /** The docked bar at the foot of the screen (after Beni). */
  dockName?: string;
  dockEdit?: string;
  cart: { add: string; added: string; view: string; sold: string; soldNote: string };
};

/**
 * The buy panel of a Mrirt collection.
 *
 * It sits in the piece page's own label column, so it speaks the piece page's
 * language: a price in the same type, the same filled "Ajouter au panier", the
 * same quiet rules. The colour and the size are two CLOSED rows — the shape of
 * benirugs.com's panel that the house sent as reference — each opening onto
 * its options and closing again on a choice. Open, every option was a filled
 * block on the page and the panel read as a different site (client, 5 Oct).
 *
 * Real radio inputs throughout, so it is a radio group to a keyboard and a
 * screen reader; only the drawing is ours. Escape and an outside click close.
 */
export default function RugBuy({
  series,
  swatches,
  colourLabels,
  locale,
  labels,
  demo = false,
}: {
  series: RugSeries;
  swatches: Record<string, string[] | undefined>;
  /** Colour name as shown in this locale, keyed by Shopify's own value. */
  colourLabels: Record<string, string>;
  locale: string;
  labels: Labels & { demoAsk?: string };
  /** Demo photographs (RUG_DEMO): show, never sell. */
  demo?: boolean;
}) {
  const [colour, setColour] = useState(series.colours[0]?.name ?? "");
  const [size, setSize] = useState(series.sizes[0] ?? "");

  /* Arriving from a tile on /mrirt, the colourway you chose is already set. */
  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get("couleur");
    if (asked && series.colours.some((c) => c.name === asked)) setColour(asked);
  }, [series]);

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

  const ask = `/${locale}/mrirt#sur-mesure`;

  const action =
    !demo && price !== null && variant ? (
      <AddToCart key={variant.id} slug={`rug:${variant.id}`} labels={labels.cart} price={fmt(price)} />
    ) : (
      <Link href={ask} className="piece-buy-add label has-price rug-buy-ask">
        <span>{labels.askBar ?? labels.demoAsk ?? labels.ask}</span>
        <span className="piece-buy-price">{labels.onRequest}</span>
      </Link>
    );

  return (
    <div className="rug-buy">
      {series.colours.length > 0 && (
        <Picker
          id="rug-colour"
          label={labels.colour}
          value={colour}
          display={colourLabels[colour] ?? colour}
          swatch={swatches[colour]}
          layout="list"
          options={series.colours.map((c) => ({
            value: c.name,
            label: colourLabels[c.name] ?? c.name,
            swatch: swatches[c.name],
          }))}
          onChange={setColour}
        />
      )}

      {series.sizes.length > 0 && (
        <Picker
          id="rug-size"
          label={labels.size}
          value={size}
          display={size}
          layout="grid"
          options={series.sizes.map((z) => ({ value: z, label: z }))}
          onChange={setSize}
          note={labels.leadNote}
        />
      )}

      <p className="label rug-buy-note">{labels.madeToOrder}</p>

      {/* Beni's bar: one filled row, the action on the left and the figure on
          the right, so the price is read on the thing that spends it. */}
      <div className="rug-buy-bar">
        {action}
        {!demo && price === null && <p className="label piece-cta-note">{labels.onRequestNote}</p>}
      </div>

      {labels.craftLink && (
        <a href="#tissage" className="link label rug-buy-craft">
          {labels.craftLink}
        </a>
      )}
      {labels.dockName && (
        <RugDock
          name={labels.dockName}
          detail={[size, colourLabels[colour] ?? colour].filter(Boolean).join(" | ")}
          editLabel={labels.dockEdit ?? ""}
        >
          {action}
        </RugDock>
      )}
    </div>
  );
}

type Option = { value: string; label: string; swatch?: string[] };

function Picker({
  id,
  label,
  value,
  display,
  swatch,
  layout,
  options,
  onChange,
  note,
}: {
  note?: string;
  id: string;
  label: string;
  value: string;
  display: string;
  swatch?: string[];
  layout: "list" | "grid";
  options: Option[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="rug-buy-group" role="radiogroup" aria-labelledby={`${id}-label`}>
      <p id={`${id}-label`} className="label rug-buy-key">
        {label}
      </p>
      <button
        type="button"
        className="choice-current"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        onClick={() => setOpen((o) => !o)}
      >
        {swatch && <Swatch colours={swatch} />}
        <span className="label choice-current-text">{display}</span>
        <span className="choice-caret" aria-hidden="true" />
      </button>
      <div id={`${id}-options`} className={`choice-options choice-${layout}`} hidden={!open}>
        {options.map((o) => (
          <label key={o.value} className="choice-option">
            <input
              type="radio"
              name={id}
              value={o.value}
              checked={value === o.value}
              onChange={() => {
                onChange(o.value);
                setOpen(false);
              }}
            />
            {o.swatch && <Swatch colours={o.swatch} />}
            <span className="label">{o.label}</span>
          </label>
        ))}
      </div>
      {note && <p className="rug-buy-lead">· {note}</p>}
    </div>
  );
}

function Swatch({ colours }: { colours: string[] }) {
  return (
    <span className="choice-swatch" aria-hidden="true">
      {colours.map((c, i) => (
        <span key={i} style={{ background: c }} />
      ))}
    </span>
  );
}
