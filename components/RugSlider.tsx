"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type RugSlide = {
  key: string;
  href: string;
  src: string;
  /** A second photograph of the same rug, for the hover — the site's "second look" (§20). */
  swap?: string | null;
  w: number;
  h: number;
  alt: string;
  /** The overline every card on the site carries: what kind of thing this is. */
  kind: string;
  name: string;
  /** The collection's own line (V1 §8). */
  line: string | null;
  price: string;
};

/**
 * The rugs, first on the homepage (client, 5 Oct), in the site's own language.
 *
 * Each slide IS the collection card — photograph, overline, name, price — with
 * no plate, border or shadow under it, because nothing on this site is boxed
 * (§30). Hovering crossfades to the rug's second photograph, exactly as a
 * piece card does (§20). The controls are the site's hairlines: a progress
 * rule, a count, and two bare arrows, grouped at the right of the shell.
 *
 * The track is native scroll-snap, so a phone swipes with its own momentum and
 * a trackpad scrolls sideways. A mouse can also drag it; a drag that moved
 * more than a few pixels does not count as a click on the card it ended on.
 */
export default function RugSlider({
  slides,
  labels,
}: {
  slides: RugSlide[];
  labels: { prev: string; next: string; region: string };
}) {
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);
  const [edge, setEdge] = useState({ start: true, end: false });
  const drag = useRef({ active: false, x: 0, left: 0, moved: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const items = [...el.children] as HTMLElement[];
    const base = items[0]?.offsetLeft ?? 0;
    let best = 0;
    let bestDist = Infinity;
    items.forEach((item, i) => {
      const d = Math.abs(item.offsetLeft - base - el.scrollLeft);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    const max = el.scrollWidth - el.clientWidth;
    const atEnd = el.scrollLeft >= max - 4;
    // At the end the last card is fully in view even if it is not first.
    setCurrent(atEnd ? items.length - 1 : best);
    setEdge({ start: el.scrollLeft <= 4, end: atEnd });
    if (bar.current) {
      const visible = max > 0 ? el.clientWidth / el.scrollWidth : 1;
      const progress = max > 0 ? el.scrollLeft / max : 0;
      bar.current.style.width = `${visible * 100}%`;
      bar.current.style.transform = `translateX(${progress * (1 / visible - 1) * 100}%)`;
    }
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const items = [...el.children] as HTMLElement[];
    const index = Math.max(0, Math.min(items.length - 1, current + dir));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: items[index].offsetLeft - (items[0]?.offsetLeft ?? 0),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  /* Mouse drag. Touch and pen already scroll natively. */
  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = track.current;
    if (!el) return;
    drag.current = { active: true, x: e.clientX, left: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    const el = track.current;
    if (!d.active || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      el.classList.add("is-dragging");
      el.setPointerCapture(e.pointerId);
    }
    if (d.moved) el.scrollLeft = d.left - dx;
  };
  const endDrag = (e: React.PointerEvent<HTMLUListElement>) => {
    const el = track.current;
    if (!drag.current.active || !el) return;
    drag.current.active = false;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    el.classList.remove("is-dragging");
    if (drag.current.moved) {
      // Let snap settle the track onto the nearest card.
      const items = [...el.children] as HTMLElement[];
      const base = items[0]?.offsetLeft ?? 0;
      const nearest = items.reduce(
        (best, item) =>
          Math.abs(item.offsetLeft - base - el.scrollLeft) <
          Math.abs(best.offsetLeft - base - el.scrollLeft)
            ? item
            : best,
        items[0],
      );
      el.scrollTo({ left: nearest.offsetLeft - base, behavior: "smooth" });
    }
  };

  return (
    <div className="rug-slider" role="region" aria-roledescription="carousel" aria-label={labels.region}>
      <ul
        ref={track}
        className="rug-slider-track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
      >
        {slides.map((s, i) => (
          <li
            key={s.key}
            className="rug-slide"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${slides.length}`}
          >
            <Link href={s.href} className="rug-slide-link swap-host" draggable={false}>
              <span className={`frame rug-slide-frame${s.swap ? " frame-swap" : ""}`}>
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={s.w}
                  height={s.h}
                  draggable={false}
                  sizes="(max-width: 699px) 74vw, (max-width: 1100px) 40vw, 27vw"
                />
                {s.swap && (
                  <Image
                    src={s.swap}
                    alt=""
                    aria-hidden="true"
                    width={s.w}
                    height={s.h}
                    draggable={false}
                    className="is-swap"
                    sizes="(max-width: 699px) 74vw, (max-width: 1100px) 40vw, 27vw"
                  />
                )}
              </span>
              <span className="card-said rug-slide-said">
                <span className="label card-room">{s.kind}</span>
                <span className="display d-3 wall-label-name rug-slide-name">{s.name}</span>
                {s.line && <span className="rug-slide-line">{s.line}</span>}
                <span className="wall-label-price">{s.price}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="shell rug-slider-nav">
        <span className="rug-slider-rule" aria-hidden="true">
          <span ref={bar} className="rug-slider-progress" />
        </span>
        <span className="label rug-slider-count" aria-live="polite">
          {String(current + 1).padStart(2, "0")}
          <span className="rug-slider-of"> / {String(slides.length).padStart(2, "0")}</span>
        </span>
        <span className="rug-slider-arrows">
          <button
            type="button"
            className="rug-slider-arrow"
            onClick={() => go(-1)}
            disabled={edge.start}
            aria-label={labels.prev}
          >
            <svg viewBox="0 0 28 12" width="28" height="12" aria-hidden="true">
              <path d="M27 6H1.5M6.5 1L1.5 6l5 5" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
          <button
            type="button"
            className="rug-slider-arrow"
            onClick={() => go(1)}
            disabled={edge.end}
            aria-label={labels.next}
          >
            <svg viewBox="0 0 28 12" width="28" height="12" aria-hidden="true">
              <path d="M1 6h25.5M21.5 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </span>
      </div>
    </div>
  );
}
