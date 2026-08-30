"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PieceImage } from "@/lib/catalog";

type ZoomLabels = {
  close: string;
  in: string;
  out: string;
  reset: string;
  hint: string;
  hintTouch: string;
};

type PieceZoomProps = {
  images: PieceImage[];
  name: string;
  /** Index of the photograph the visitor clicked. */
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  labels: ZoomLabels;
  railLabel: string;
};

/**
 * The full-screen view — "look closer".
 *
 * The piece page's stage is capped at 76svh and everything in this collection
 * is portrait, so a typical frame draws about 430px wide however wide its
 * column is (pages.css, `.piece-inner`). That is enough to read the object and
 * not enough to read the PATINA — which is the whole proposition of the brand
 * (CLAUDE.md §1: materials, patina, imperfection). This is where the grain of
 * the wood and the wear on an edge actually become visible.
 *
 * ## The three decisions worth keeping
 *
 * **The surround is the page's own ground, not a black scrim.** Nothing on this
 * site paints black behind a photograph (§18 forbids laying anything over one
 * at all), and every piece is shot on pale plaster. A dark surround would
 * change how the object reads — a warm ecru object on black is a different
 * photograph. The overlay is `--hour-morning`, the colour the page opens on.
 *
 * **Zoom is capped by the source file, not by taste.** These are 2000px CDN
 * derivatives (§13 — the originals are still owed), so past the point where one
 * source pixel covers ~2.6 screen pixels there is no more detail to find and
 * the visitor is looking at interpolation. `maxScale` is therefore DERIVED from
 * the image's own width against the size it is drawn at, not a constant. A
 * 1200px macro and a 2666px full-length shot get different ceilings, which is
 * correct: they carry different amounts of information. When the client sends
 * originals the cap rises on its own with no code change.
 *
 * **Reduced motion turns off the ENTRANCE, not the zoom.** Zoom is a control;
 * refusing to move under a visitor's finger because they asked for less motion
 * would break the feature rather than calm it. What stops is the fade-in and
 * the eased settle after a double-click.
 */
export default function PieceZoom({
  images,
  name,
  index,
  onIndex,
  onClose,
  labels,
  railLabel,
}: PieceZoomProps) {
  const image = images[index];

  const surfaceRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* scale 1 == the photograph fitted to the screen. */
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [maxScale, setMaxScale] = useState(3);
  const [touch, setTouch] = useState(false);

  /* The fitted size of the current photograph, in CSS pixels. Everything —
     the pan clamp, the zoom ceiling — is derived from this, so it is measured
     rather than assumed. */
  const fittedRef = useRef({ w: 0, h: 0 });

  /* Live values for the pointer handlers, which are attached natively (see
     the wheel effect) and must not close over stale state. */
  const view = useRef({ scale: 1, x: 0, y: 0 });
  useEffect(() => {
    view.current = { scale, x: offset.x, y: offset.y };
  }, [scale, offset]);

  /* --- Measuring -------------------------------------------------------- */

  const measure = useCallback(() => {
    const surface = surfaceRef.current;
    if (!surface || !image) return;

    const box = surface.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return;

    /* object-fit: contain, computed by hand because we need the number. */
    const ratio = image.w / image.h;
    let w = box.width;
    let h = w / ratio;
    if (h > box.height) {
      h = box.height;
      w = h * ratio;
    }
    fittedRef.current = { w, h };

    /* The ceiling: how far the source can be pushed before one source pixel
       covers more than ~2.6 screen pixels. Held to a sane band — a very small
       source should still zoom a little, and a very large one should not
       become a microscope. */
    const headroom = (image.w / Math.max(w, 1)) * 2.6;
    setMaxScale(Math.min(6, Math.max(1.8, Number(headroom.toFixed(2)))));
  }, [image]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const onResize = () => {
      measure();
      /* A rotation can leave the photograph parked outside the new viewport. */
      setOffset((o) => clamp(o, view.current.scale, fittedRef.current, surfaceRef.current));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  /* Changing photograph resets the view: arriving at a new object already
     zoomed into the corner of it is disorienting. */
  useEffect(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, [index]);

  /* --- Zooming ---------------------------------------------------------- */

  /* Zoom about a point, so the pixel under the cursor or between the fingers
     stays under it. Zooming about the centre instead makes the thing you were
     looking at slide away, which is the single most common way this control is
     got wrong. */
  const zoomTo = useCallback(
    (next: number, originX?: number, originY?: number) => {
      const surface = surfaceRef.current;
      if (!surface) return;

      const bounded = Math.min(maxScale, Math.max(1, next));
      const box = surface.getBoundingClientRect();
      const cx = (originX ?? box.left + box.width / 2) - box.left - box.width / 2;
      const cy = (originY ?? box.top + box.height / 2) - box.top - box.height / 2;

      const { scale: s, x, y } = view.current;
      const k = bounded / s;
      const nextOffset =
        bounded === 1
          ? { x: 0, y: 0 }
          : clamp({ x: cx - (cx - x) * k, y: cy - (cy - y) * k }, bounded, fittedRef.current, surface);

      view.current = { scale: bounded, x: nextOffset.x, y: nextOffset.y };
      setScale(bounded);
      setOffset(nextOffset);
    },
    [maxScale],
  );

  /* Wheel is attached natively and non-passively: React's onWheel is passive,
     so preventDefault() inside it is ignored and the PAGE scrolls behind the
     overlay while you are trying to zoom. */
  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      /* A trackpad reports many small deltas and a mouse a few large ones;
         exponentiating keeps both feeling like the same control. */
      const factor = Math.exp(-event.deltaY * 0.0016);
      zoomTo(view.current.scale * factor, event.clientX, event.clientY);
    };

    surface.addEventListener("wheel", onWheel, { passive: false });
    return () => surface.removeEventListener("wheel", onWheel);
  }, [zoomTo]);

  /* --- Dragging and pinching -------------------------------------------- */

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ dist: number; scale: number } | null>(null);
  const start = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const moved = useRef(false);

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "touch") setTouch(true);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    moved.current = false;

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: view.current.scale };
      start.current = null;
    } else {
      start.current = {
        x: event.clientX,
        y: event.clientY,
        ox: view.current.x,
        oy: view.current.y,
      };
    }
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 2 && gesture.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (gesture.current.dist > 0) {
        moved.current = true;
        zoomTo(
          gesture.current.scale * (dist / gesture.current.dist),
          (a.x + b.x) / 2,
          (a.y + b.y) / 2,
        );
      }
      return;
    }

    const from = start.current;
    if (!from || view.current.scale === 1) return;
    const dx = event.clientX - from.x;
    const dy = event.clientY - from.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved.current = true;

    const next = clamp(
      { x: from.ox + dx, y: from.oy + dy },
      view.current.scale,
      fittedRef.current,
      surfaceRef.current,
    );
    view.current = { ...view.current, x: next.x, y: next.y };
    setOffset(next);
  };

  const onPointerUp = (event: React.PointerEvent) => {
    /* Swipe to the next photograph — but ONLY while fitted to the screen.
     *
     * Once magnified, a horizontal drag is a pan: the visitor is moving around
     * inside one picture, and skipping to the next one would throw away what
     * they were looking at. So this is gated on scale, not on distance. It is
     * also touch/pen only, matching the gallery below — a mouse drag on a
     * fitted photograph is far more likely to be a mis-aimed click. */
    const from = start.current;
    if (
      from &&
      event.pointerType !== "mouse" &&
      images.length > 1 &&
      view.current.scale <= 1.01 &&
      pointers.current.size === 1
    ) {
      const dx = event.clientX - from.x;
      const dy = event.clientY - from.y;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
        moved.current = true; // so the surround-click test does not close it
        onIndex((index + (dx < 0 ? 1 : -1) + images.length) % images.length);
      }
    }

    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) gesture.current = null;
    if (pointers.current.size === 0) start.current = null;
  };

  /* Click the surround to close.
   *
   * Tested against the PHOTOGRAPH'S OWN RECT, not against DOM containment:
   * the frame is pinned to the whole surface and the image inside it is
   * `object-fit: contain`, so the element covers the entire screen while the
   * picture occupies only the middle of it. `contains()` would therefore
   * report every click as landing on the photograph and the surround would
   * never close.
   *
   * And never at the end of a drag, or panning to the edge dismisses the
   * thing you were looking at. */
  const onSurfaceClick = (event: React.MouseEvent) => {
    if (moved.current) return;

    const surface = surfaceRef.current;
    const { w, h } = fittedRef.current;
    if (surface && w > 0) {
      const box = surface.getBoundingClientRect();
      const cx = box.left + box.width / 2 + view.current.x;
      const cy = box.top + box.height / 2 + view.current.y;
      const half = { w: (w * view.current.scale) / 2, h: (h * view.current.scale) / 2 };
      const onPhotograph =
        Math.abs(event.clientX - cx) <= half.w && Math.abs(event.clientY - cy) <= half.h;
      if (onPhotograph) return;
    }

    onClose();
  };

  const onDoubleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    zoomTo(scale > 1.05 ? 1 : Math.min(maxScale, 2.4), event.clientX, event.clientY);
  };

  /* --- Keyboard, scroll lock, focus ------------------------------------- */

  useEffect(() => {
    closeRef.current?.focus();

    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          onClose();
          return;
        case "ArrowRight":
          if (images.length > 1) {
            event.preventDefault();
            onIndex((index + 1) % images.length);
          }
          return;
        case "ArrowLeft":
          if (images.length > 1) {
            event.preventDefault();
            onIndex((index - 1 + images.length) % images.length);
          }
          return;
        case "+":
        case "=":
          event.preventDefault();
          zoomTo(view.current.scale * 1.35);
          return;
        case "-":
        case "_":
          event.preventDefault();
          zoomTo(view.current.scale / 1.35);
          return;
        case "0":
          event.preventDefault();
          zoomTo(1);
          return;
        case "Tab": {
          /* Modal: it locks scroll, so it must trap focus (§14 made the same
             argument for the menu panel). */
          const stops = rootRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          );
          if (!stops || stops.length === 0) return;
          const first = stops[0];
          const last = stops[stops.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [images.length, index, onIndex, onClose, zoomTo]);

  if (!image) return null;

  const zoomed = scale > 1.01;

  return (
    <div
      className="zoom"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={name}
    >
      {/* The bar is FIRST in the DOM as well as at the top of the screen, so
          Close is the first thing a keyboard reaches and the reading order
          matches the visual one. The grid places by named row, not by source
          order, so this is free. */}
      <div className="zoom-bar">
        <button
          type="button"
          className="zoom-close label"
          ref={closeRef}
          onClick={onClose}
        >
          {labels.close}
        </button>

        <p className="label zoom-hint" aria-hidden="true">
          {touch ? labels.hintTouch : labels.hint}
        </p>

        <div className="zoom-controls">
          <button
            type="button"
            className="zoom-step"
            aria-label={labels.out}
            disabled={scale <= 1.01}
            onClick={() => zoomTo(view.current.scale / 1.35)}
          >
            <span aria-hidden="true">−</span>
          </button>
          <button
            type="button"
            className="zoom-step"
            aria-label={labels.reset}
            disabled={!zoomed}
            onClick={() => zoomTo(1)}
          >
            <span className="label" aria-hidden="true">
              {Math.round(scale * 100)}%
            </span>
          </button>
          <button
            type="button"
            className="zoom-step"
            aria-label={labels.in}
            disabled={scale >= maxScale - 0.01}
            onClick={() => zoomTo(view.current.scale * 1.35)}
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>

      <div
        className="zoom-surface"
        ref={surfaceRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onSurfaceClick}
        onDoubleClick={onDoubleClick}
        data-zoomed={zoomed ? "true" : undefined}
      >
        <div
          className="zoom-frame"
          ref={frameRef}
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
          }}
        >
          <Image
            src={`/pieces/${image.file}`}
            alt={name}
            width={image.w}
            height={image.h}
            /* The visitor asked for this one specifically. */
            priority
            quality={90}
            sizes="100vw"
            draggable={false}
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="zoom-rail" role="group" aria-label={railLabel}>
          {images.map((shot, i) => (
            <button
              key={shot.file}
              type="button"
              className={i === index ? "zoom-thumb is-active" : "zoom-thumb"}
              aria-current={i === index ? "true" : undefined}
              aria-label={`${i + 1} / ${images.length}`}
              onClick={() => onIndex(i)}
            >
              <Image
                src={`/pieces/${shot.file}`}
                alt=""
                width={shot.w}
                height={shot.h}
                loading="lazy"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Keep the photograph's own edges from coming inside the screen.
 *
 * Once magnified past the fit, the visitor may pan — but only within the part
 * of the photograph that exists. Without this you can drag the object off the
 * screen entirely and be left looking at empty ground, which reads as the
 * control being broken.
 *
 * When an axis still fits on screen at this scale there is nothing to pan
 * along it, so it is pinned to centre rather than left to drift.
 */
function clamp(
  offset: { x: number; y: number },
  scale: number,
  fitted: { w: number; h: number },
  surface: HTMLElement | null,
) {
  if (!surface || fitted.w === 0) return offset;
  const box = surface.getBoundingClientRect();
  const slackX = Math.max(0, (fitted.w * scale - box.width) / 2);
  const slackY = Math.max(0, (fitted.h * scale - box.height) / 2);
  return {
    x: Math.min(slackX, Math.max(-slackX, offset.x)),
    y: Math.min(slackY, Math.max(-slackY, offset.y)),
  };
}
