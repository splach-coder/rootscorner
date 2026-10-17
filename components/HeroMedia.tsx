"use client";

import Img from "@/components/Img";
import { useEffect, useRef, useState } from "react";

/**
 * The hero photograph, and the one rule that keeps the opening clean: nothing
 * written over it appears before it does.
 *
 * Client, 5 Oct: on a slow load the title showed — shadow and all — over the
 * empty ecru page, then the photograph arrived under it. So the hero holds a
 * dark ground the colour of the frame, the photograph fades in once it is
 * decoded, and `data-ready` on `.hero` is what releases the type (see the CSS
 * beside `.hero-media`). One sequence: ground, photograph, words.
 *
 * A cached image is complete before React attaches onLoad, so readiness is
 * also checked on mount. And a 2.5 s ceiling, so a photograph that never
 * arrives can never keep the name of the house off the screen.
 *
 * With a `video` (chosen in Shopify, lib/hero.ts) the image still comes first
 * and keeps every rule above; the film is laid over it, silent and looping,
 * and fades in only once it is actually playing. Phones set to save data, and
 * anyone who asks for reduced motion, keep the image.
 */
export default function HeroMedia({
  src,
  width,
  height,
  video,
}: {
  src: string;
  width: number;
  height: number;
  video?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [film, setFilm] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const hero = ref.current?.closest<HTMLElement>(".hero");
    if (!hero) return;
    const ready = () => {
      hero.dataset.ready = "";
    };
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) {
      img.decode?.().then(ready, ready) ?? ready();
    }
    const ceiling = window.setTimeout(ready, 2500);
    return () => window.clearTimeout(ceiling);
  }, []);

  useEffect(() => {
    if (!video) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setFilm(!still && !saveData);
  }, [video]);

  return (
    <>
      <Img
        ref={ref}
        src={src}
        alt=""
        width={width}
        height={height}
        sizes="100vw"
        priority
        fetchPriority="high"
        quality={78}
        onLoad={(e) => {
          const img = e.currentTarget;
          const hero = img.closest<HTMLElement>(".hero");
          const done = () => {
            if (hero) hero.dataset.ready = "";
          };
          (img.decode?.() ?? Promise.resolve()).then(done, done);
        }}
      />
      {film && video && (
        <video
          className={`hero-video${playing ? " is-playing" : ""}`}
          src={video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
        />
      )}
    </>
  );
}
