"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export type RugTile = {
  key: string;
  href: string;
  src: string;
  w: number;
  h: number;
  alt: string;
  /** "ready" — already woven; "order" — a collection colourway woven to order. */
  kind: "ready" | "order";
  /** Collection handle, for the collection filter. Empty for woven rugs. */
  collection: string;
  name: string;
  detail: string | null;
  price: string;
};

type Labels = {
  type: string;
  all: string;
  ready: string;
  order: string;
  collection: string;
  allCollections: string;
  view: string;
  grid: string;
  column: string;
  count: string;
  countOne: string;
  empty: string;
};

/**
 * The rug wall — after benirugs.com's collection page, in this house's
 * language (client, 5 Oct).
 *
 * Their move, kept: a thin ruled bar of filters, then a dense wall of rugs on
 * a warm ground with the words held back until you reach for one. Ours: the
 * ground is the page's own sand, the type is the site's, every tile is one
 * colourway of a collection (or a rug already woven), and the two views are a
 * wall (dense) and a column (large, two across) for looking closely.
 *
 * Filters are real buttons and a real select; the count is announced. The
 * view choice is remembered for this visitor only.
 */
export default function RugBrowser({
  tiles,
  collections,
  labels,
}: {
  tiles: RugTile[];
  collections: { handle: string; name: string }[];
  labels: Labels;
}) {
  const [kind, setKind] = useState<"all" | "ready" | "order">("all");
  const [collection, setCollection] = useState("");
  const [view, setView] = useState<"grid" | "column">("grid");
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("trc:rug-view");
      if (saved === "grid" || saved === "column") setView(saved);
    } catch {}
  }, []);

  const choose = (v: "grid" | "column") => {
    setView(v);
    try {
      localStorage.setItem("trc:rug-view", v);
    } catch {}
  };

  const shown = useMemo(
    () =>
      tiles.filter(
        (t) =>
          (kind === "all" || t.kind === kind) &&
          (!collection || t.collection === collection),
      ),
    [tiles, kind, collection],
  );

  const kinds: { value: "all" | "ready" | "order"; label: string; n: number }[] = [
    { value: "all", label: labels.all, n: tiles.length },
    { value: "ready", label: labels.ready, n: tiles.filter((t) => t.kind === "ready").length },
    { value: "order", label: labels.order, n: tiles.filter((t) => t.kind === "order").length },
  ];

  return (
    <div className="rug-browser">
      <div className="rug-bar">
        <div className="rug-bar-cell rug-bar-kinds" role="group" aria-label={labels.type}>
          <span className="label rug-bar-key">{labels.type}</span>
          {kinds.map((k) => (
            <button
              key={k.value}
              type="button"
              className="label rug-bar-option"
              aria-pressed={kind === k.value}
              onClick={() => {
                setKind(k.value);
                if (k.value === "ready") setCollection("");
              }}
            >
              {k.label}
              <span className="rug-bar-n">{k.n}</span>
            </button>
          ))}
        </div>

        <label className="rug-bar-cell rug-bar-select">
          <span className="label rug-bar-key">{labels.collection}</span>
          <select
            value={collection}
            onChange={(e) => {
              setCollection(e.target.value);
              if (e.target.value) setKind("order");
            }}
            className="label"
          >
            <option value="">{labels.allCollections}</option>
            {collections.map((c) => (
              <option key={c.handle} value={c.handle}>
                {c.name}
              </option>
            ))}
          </select>
          <svg className="rug-bar-caret" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
            <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </label>

        <div className="rug-bar-cell rug-bar-view" role="group" aria-label={labels.view}>
          <span className="label rug-bar-key">{labels.view}</span>
          <button
            type="button"
            className="label rug-bar-option"
            aria-pressed={view === "grid"}
            onClick={() => choose("grid")}
          >
            {labels.grid}
          </button>
          <button
            type="button"
            className="label rug-bar-option"
            aria-pressed={view === "column"}
            onClick={() => choose("column")}
          >
            {labels.column}
          </button>
        </div>
      </div>

      <p className="label rug-wall-count" aria-live="polite">
        {(shown.length === 1 ? labels.countOne : labels.count).replace("{n}", String(shown.length))}
      </p>

      {shown.length === 0 ? (
        <p className="prose rug-wall-empty">{labels.empty}</p>
      ) : (
        <ul ref={listRef} className={`rug-wall is-${view}`}>
          {shown.map((t) => (
            <li key={t.key} className="rug-tile">
              <Link href={t.href} className="rug-tile-link">
                <span className="rug-tile-ground">
                  <Image
                    src={t.src}
                    alt={t.alt}
                    width={t.w}
                    height={t.h}
                    sizes={
                      view === "grid"
                        ? "(max-width: 699px) 46vw, (max-width: 1100px) 31vw, 22vw"
                        : "(max-width: 699px) 92vw, 46vw"
                    }
                  />
                  {t.kind === "ready" && <span className="label rug-tile-flag">{labels.ready}</span>}
                </span>
                <span className="rug-tile-said">
                  <span className="display rug-tile-name">{t.name}</span>
                  <span className="rug-tile-price">{t.price}</span>
                  {t.detail && <span className="rug-tile-detail">{t.detail}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
