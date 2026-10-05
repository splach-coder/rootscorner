"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type RugSlide = {
  key: string;
  href: string;
  src: string;
  w: number;
  h: number;
  alt: string;
  name: string;
  /** The collection's own line, or what the woven rug is. */
  line: string | null;
  /** "À partir de 290 €", or "Prix sur demande". */
  price: string;
};

/**
 * The rugs, as a slider — the homepage's first shop (client, 5 Oct: "rugs
 * first, then the pieces", after benirugs.com's carousel).
 *
 * A native scroll-snap track, so a phone swipes it with its own momentum and
 * a trackpad scrolls it sideways; the two arrows move one card at a time and
 * disable themselves at either end. The slide nearest the start of the track
 * is the "current" one and carries the full-strength label; the others rest
 * at a lower contrast, which is what makes the row read as a sequence you move
 * through rather than as a grid that happens to overflow.
 */
export default function RugSlider({
  slides,
  labels,
}: {
  slides: RugSlide[];
  labels: { prev: string; next: string; region: string };
}) {
  const track = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  const [edge, setEdge] = useState<{ start: boolean; end: boolean }>({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const items = [...el.children] as HTMLElement[];
    const left = el.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    items.forEach((item, i) => {
      const d = Math.abs(item.offsetLeft - el.offsetLeft - left);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setCurrent(best);
    setEdge({ start: left <= 4, end: left + el.clientWidth >= el.scrollWidth - 4 });
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
    const target = items[Math.max(0, Math.min(items.length - 1, current + dir))];
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="rug-slider" role="region" aria-roledescription="carousel" aria-label={labels.region}>
      <ul ref={track} className="rug-slider-track">
        {slides.map((s, i) => (
          <li
            key={s.key}
            className={`rug-slide${i === current ? " is-current" : ""}`}
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${slides.length}`}
          >
            <Link href={s.href} className="rug-slide-link">
              <span className="rug-slide-frame">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={s.w}
                  height={s.h}
                  sizes="(max-width: 700px) 78vw, (max-width: 1100px) 44vw, 30vw"
                />
              </span>
              <span className="rug-slide-said">
                <span className="rug-slide-top">
                  <span className="display rug-slide-name">{s.name}</span>
                  <span className="rug-slide-price">{s.price}</span>
                </span>
                {s.line && <span className="rug-slide-line">{s.line}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="rug-slider-nav">
        <button
          type="button"
          className="rug-slider-arrow"
          onClick={() => go(-1)}
          disabled={edge.start}
          aria-label={labels.prev}
        >
          <svg viewBox="0 0 24 12" width="24" height="12" aria-hidden="true">
            <path d="M23 6H1M6 1L1 6l5 5" fill="none" stroke="currentColor" strokeWidth="1.1" />
          </svg>
        </button>
        <span className="rug-slider-count" aria-hidden="true">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          className="rug-slider-arrow"
          onClick={() => go(1)}
          disabled={edge.end}
          aria-label={labels.next}
        >
          <svg viewBox="0 0 24 12" width="24" height="12" aria-hidden="true">
            <path d="M1 6h22M18 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
