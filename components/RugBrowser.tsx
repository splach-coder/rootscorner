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

        <CollectionMenu
          label={labels.collection}
          allLabel={labels.allCollections}
          value={collection}
          options={collections}
          onChange={(v) => {
            setCollection(v);
            if (v) setKind("order");
          }}
        />

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

/**
 * The collection choice, drawn in the site's own hand rather than the
 * system's (client, 6 Oct: the native list opened in the OS's blue). A row
 * that states the current choice, opening onto a plain list under a hairline;
 * the chosen line is underlined, as in the type filter beside it. A listbox
 * to a keyboard and a screen reader: arrows move, Enter chooses, Escape and an
 * outside click close.
 */
function CollectionMenu({
  label,
  allLabel,
  value,
  options,
  onChange,
}: {
  label: string;
  allLabel: string;
  value: string;
  options: { handle: string; name: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const list = [{ handle: "", name: allLabel }, ...options];
  const current = list.find((o) => o.handle === value) ?? list[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        root.current?.querySelector<HTMLButtonElement>(".rug-menu-toggle")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    root.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus();
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const move = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = [...(root.current?.querySelectorAll<HTMLButtonElement>(".rug-menu-option") ?? [])];
    const at = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = items[(at + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length];
    next?.focus();
  };

  return (
    <div ref={root} className="rug-bar-cell rug-bar-menu">
      <span className="label rug-bar-key" id="rug-menu-label">
        {label}
      </span>
      <button
        type="button"
        className="label rug-menu-toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="rug-menu-label rug-menu-current"
        onClick={() => setOpen((o) => !o)}
      >
        <span id="rug-menu-current">{current.name}</span>
        <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true" className="rug-menu-caret">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>
      <ul
        className="rug-menu-list"
        role="listbox"
        aria-labelledby="rug-menu-label"
        hidden={!open}
        onKeyDown={move}
      >
        {list.map((o) => (
          <li key={o.handle || "all"} role="none">
            <button
              type="button"
              role="option"
              aria-selected={o.handle === value}
              className="rug-menu-option"
              onClick={() => {
                onChange(o.handle);
                setOpen(false);
              }}
            >
              <span className="display">{o.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
