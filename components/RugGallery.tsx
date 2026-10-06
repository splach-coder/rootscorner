"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = { src: string; w: number; h: number; alt: string };

/**
 * The rug's photographs as one slider — benirugs.com's product page (client,
 * 6 Oct: "we miss the slider, the image sticks and the description goes").
 * One photograph at a time on the tile ground, a "1 | 3" counter and two
 * arrows under it. On a desktop the whole column stays put while the order
 * panel beside it scrolls; on a phone it comes first and is swiped.
 *
 * Native scroll-snap does the moving, so a finger, a trackpad and the arrows
 * all drive the same track, and the counter reads the track rather than its
 * own state.
 */
export default function RugGallery({
  slides,
  labels,
  variant = "plate",
}: {
  slides: Slide[];
  labels: { prev: string; next: string };
  /** "reel" — the big full-width slider of rooms further down the page. */
  variant?: "plate" | "reel";
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      // Slides can be narrower than the track (the reel's columns), so the
      // current one is the slide whose left edge is nearest the scroll.
      const kids = [...el.children] as HTMLElement[];
      let best = 0;
      kids.forEach((k, i) => {
        if (Math.abs(k.offsetLeft - el.scrollLeft) < Math.abs(kids[best].offsetLeft - el.scrollLeft)) best = i;
      });
      setIndex(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const go = useCallback(
    (to: number) => {
      const el = track.current;
      if (!el) return;
      const n = (to + slides.length) % slides.length;
      const slide = el.children[n] as HTMLElement | undefined;
      el.scrollTo({ left: slide ? slide.offsetLeft : 0, behavior: "smooth" });
    },
    [slides.length],
  );

  return (
    <div className={`rugg rugg-${variant}`}>
      <div
        ref={track}
        className="rugg-track"
        tabIndex={0}
        aria-roledescription="carousel"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(index + 1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(index - 1);
          }
        }}
      >
        {slides.map((s, i) => (
          <div key={s.src} className="rugg-slide" aria-label={`${i + 1} / ${slides.length}`}>
            <Image
              src={s.src}
              alt={s.alt}
              width={s.w}
              height={s.h}
              priority={variant === "plate" && i === 0}
              sizes={variant === "reel" ? "(max-width: 900px) 80vw, 36rem" : "(max-width: 900px) 100vw, 64vw"}
            />
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="rugg-bar">
          <p className="rugg-count" aria-live="polite">
            {index + 1} <span aria-hidden="true">|</span> {slides.length}
          </p>
          <div className="rugg-arrows">
            <button type="button" className="rugg-arrow" aria-label={labels.prev} onClick={() => go(index - 1)}>
              <svg viewBox="0 0 24 12" width="24" height="12" aria-hidden="true">
                <path d="M23 6H1M6 1L1 6l5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            <button type="button" className="rugg-arrow" aria-label={labels.next} onClick={() => go(index + 1)}>
              <svg viewBox="0 0 24 12" width="24" height="12" aria-hidden="true">
                <path d="M1 6h22M18 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
