"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
        onClick={() => setZoomOpen(true)}
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
