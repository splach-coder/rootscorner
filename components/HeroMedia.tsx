"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

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
 */
export default function HeroMedia({ src, width, height }: { src: string; width: number; height: number }) {
  const ref = useRef<HTMLImageElement>(null);

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

  return (
    <Image
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
  );
}
