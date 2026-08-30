"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PieceImage } from "@/lib/catalog";
import PieceZoom from "./PieceZoom";

type PieceGalleryProps = {
  images: PieceImage[];
  /** The piece's name — carried by the lead photograph only. */
  name: string;
  /** "{n} photographs", already filled. */
  countLabel: string;
  /** Accessible name for the thumbnail rail. */
  railLabel: string;
  /** Strings for the full-screen view. */
  zoomLabels: {
    open: string;
    close: string;
    in: string;
    out: string;
    reset: string;
    hint: string;
    hintTouch: string;
  };
};

/**
 * The gallery.
 *
 * The piece page used to be a column of photographs stacked one under another
 * with the label beside the first. Two things were wrong with it. There was no
 * gallery — you could not tell how many photographs existed or move between
 * them, you could only scroll and hope. And the lead column was sized as a
 * fraction of the page (58fr) while the photographs in it are portrait, so a
 * 500px image sat in a 760px column and the label was pushed 600px away from
 * the work it describes.
 *
 * So: a fixed stage, and a contact-sheet rail under it.
 *
 * THE STAGE HAS A FIXED HEIGHT AND EVERY IMAGE IS `contain`ed IN IT. That is
 * the whole trick, and it is what lets this page keep the site's no-cropping
 * rule (§24) without the layout jumping every time you change photograph:
 * ratios here run 0.56 to 1.50, so sizing the stage to the image would move the
 * label on every click. The stage holds still; the photograph sits in it at
 * whatever shape it was shot.
 *
 * All the images are rendered and crossfaded rather than swapped by `src`.
 * There are at most nine, they are already the point of the page, and a
 * dissolve is the gesture this site already uses for a second view of a piece
 * (§20). Swapping `src` would flash.
 */
export default function PieceGallery({
  images,
  name,
  countLabel,
  railLabel,
  zoomLabels,
}: PieceGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLButtonElement>(null);

  const step = useCallback(
    (delta: number) =>
      setActive((i) => (i + delta + images.length) % images.length),
    [images.length],
  );

  /* --- Swipe ------------------------------------------------------------
   *
   * The rail is precise — it jumps to a known shot — but on a phone it asks
   * you to hit a 4.4rem target, and the photograph itself, which is the
   * biggest thing on the screen, ignored touch entirely. Dragging the picture
   * sideways is what anyone who has ever used a phone will try first.
   *
   * Three rules make it behave rather than fight the page:
   *
   * 1. THE GESTURE IS CLAIMED ONLY ONCE IT IS CLEARLY HORIZONTAL. Until the
   *    pointer has moved further across than down, the browser keeps it and
   *    the page scrolls normally. Claiming on the first pixel would make the
   *    gallery a dead zone you cannot scroll past on a phone.
   * 2. A SWIPE MUST NOT OPEN THE ZOOM. The stage is a <button>, so a drag
   *    that ends on it still fires a click; `swiped` suppresses exactly that
   *    one.
   * 3. MOUSE DRAGS DO NOT SWIPE. A pointer-agnostic version made desktop
   *    text-selection feel broken and, worse, made a mis-aimed click open a
   *    different photograph. Touch and pen only; desktop has the rail, the
   *    arrow keys, and a trackpad two-finger swipe (a wheel event, handled
   *    separately below).
   */
  const swipe = useRef<{ x: number; y: number; axis: "" | "x" | "y" } | null>(null);
  const swiped = useRef(false);

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") return;
    swipe.current = { x: event.clientX, y: event.clientY, axis: "" };
    swiped.current = false;
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const from = swipe.current;
    if (!from) return;

    if (from.axis !== "") return;

    const dx = event.clientX - from.x;
    const dy = event.clientY - from.y;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;

    from.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    /* A vertical drag is the page's, and we never take it back. */
    if (from.axis === "y") swipe.current = null;
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const from = swipe.current;
    swipe.current = null;
    if (!from || from.axis !== "x") return;

    const dx = event.clientX - from.x;
    /* 48px, not a few pixels: below that it is a tap that wobbled, and
       stealing it would make the zoom feel like it opens at random. */
    if (Math.abs(dx) < 48) return;

    swiped.current = true;
    step(dx < 0 ? 1 : -1);
  };

  /* Trackpad two-finger swipe, for desktop.
   *
   * Attached natively and non-passively because React's onWheel is passive,
   * so preventDefault() there is ignored and the PAGE scrolls while you are
   * trying to move through the set — the same trap the zoom overlay hit.
   *
   * Only horizontal-dominant wheel events are taken, so an ordinary vertical
   * scroll over the gallery still scrolls the page. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || zoomOpen || images.length < 2) return;

    let cooling = false;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      if (Math.abs(event.deltaX) < 12) return;
      event.preventDefault();
      if (cooling) return;
      cooling = true;
      /* A trackpad flick is one gesture reported as dozens of events; without
         a gate a single swipe runs the whole set. */
      window.setTimeout(() => (cooling = false), 420);
      step(event.deltaX > 0 ? 1 : -1);
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [step, zoomOpen, images.length]);

  /* Keep the rail showing where you are.
   *
   * Eight thumbnails measure 486px in a 350px rail, so three sit off-screen
   * with the scrollbar deliberately hidden — move past them by swiping and the
   * active thumbnail is somewhere you cannot see, which makes the rail look
   * broken rather than scrollable. `nearest` so it only moves when it has to. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const thumb = rail.querySelectorAll("button")[active];
    thumb?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [active]);

  /* Whether the rail actually has anything hidden.
   *
   * CSS cannot ask, so the fade on the trailing edge is driven from here —
   * and it has to be re-measured on resize, because a rail that overflows at
   * 390px does not at 1440 and a stale fade dims the last thumbnail of a set
   * that is entirely visible. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const measure = () => {
      const overflows = rail.scrollWidth > rail.clientWidth + 1;
      if (!overflows) {
        delete rail.dataset.overflow;
        return;
      }
      /* WHICH edge has more, not merely whether any does.
         A single trailing fade stays on at the end of the rail and dims the
         very thumbnail you just selected — the fade has to mean "more this
         way", so it belongs only on a side that actually has more. */
      const atStart = rail.scrollLeft <= 1;
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1;
      rail.dataset.overflow = atStart ? "end" : atEnd ? "start" : "both";
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    rail.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      rail.removeEventListener("scroll", measure);
    };
  }, [images.length]);

  // Arrow keys move through the set while the gallery has focus inside it.
  // Not while the full-screen view is open: it runs its own arrow keys, and
  // two handlers on one key advances the set twice.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || zoomOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (!rail.contains(document.activeElement)) return;
      event.preventDefault();
      const next =
        event.key === "ArrowRight"
          ? (active + 1) % images.length
          : (active - 1 + images.length) % images.length;
      setActive(next);
      rail.querySelectorAll("button")[next]?.focus();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, images.length, zoomOpen]);

  // Closing returns focus to the stage that opened it, rather than dropping the
  // visitor back at the top of the document.
  const closeZoom = () => {
    setZoomOpen(false);
    stageRef.current?.focus();
  };

  if (images.length === 0) return null;

  return (
    <div className="gallery">
      {/* The stage is the trigger. A photograph on a shop page is the thing a
          visitor reaches for, so the affordance belongs on the picture itself
          rather than on a separate control beside it — but it has to be a real
          button, not a div with a click handler, or it is unreachable by
          keyboard and unannounced by a screen reader. */}
      <button
        type="button"
        className="gallery-stage"
        ref={stageRef}
        onClick={() => {
          /* The swipe that just ended also fires a click on this button.
             Swallow that one, or every swipe opens the full-screen view. */
          if (swiped.current) {
            swiped.current = false;
            return;
          }
          setZoomOpen(true);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipe.current = null;
        }}
        aria-label={`${zoomLabels.open} — ${name}`}
      >
        {images.map((image, i) => (
          <Image
            key={image.file}
            src={`/pieces/${image.file}`}
            /* Only the lead names the piece. Repeating the name on every view
               of the same object is noise in a screen reader. */
            alt={i === 0 ? name : ""}
            aria-hidden={i === 0 ? undefined : true}
            width={image.w}
            height={image.h}
            priority={i === 0}
            loading={i === 0 ? undefined : "lazy"}
            sizes="(max-width: 940px) 92vw, 38vw"
            className={i === active ? "gallery-shot is-active" : "gallery-shot"}
          />
        ))}
      </button>

      {/* Outside the stage button, so it cannot change the stage's height —
          and on the page ground, where its contrast is the same on all 38
          pieces rather than depending on how dark the wood happens to be. */}
      <span className="gallery-open label" aria-hidden="true">
        {zoomLabels.open}
      </span>

      {images.length > 1 && (
        <>
          <div
            className="gallery-rail"
            ref={railRef}
            role="group"
            aria-label={railLabel}
          >
            {images.map((image, i) => (
              <button
                key={image.file}
                type="button"
                className={i === active ? "gallery-thumb is-active" : "gallery-thumb"}
                aria-current={i === active ? "true" : undefined}
                aria-label={`${i + 1} / ${images.length}`}
                onClick={() => setActive(i)}
              >
                <Image
                  src={`/pieces/${image.file}`}
                  alt=""
                  width={image.w}
                  height={image.h}
                  loading="lazy"
                  sizes="120px"
                />
              </button>
            ))}
          </div>

          <p className="label gallery-count">
            <span className="gallery-count-now">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true"> / </span>
            <span>{String(images.length).padStart(2, "0")}</span>
            <span className="gallery-count-of">{countLabel}</span>
          </p>
        </>
      )}

      {zoomOpen && (
        <PieceZoom
          images={images}
          name={name}
          index={active}
          onIndex={setActive}
          onClose={closeZoom}
          labels={zoomLabels}
          railLabel={railLabel}
        />
      )}
    </div>
  );
}
