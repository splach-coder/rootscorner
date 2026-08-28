"use client";

import { useEffect, useRef } from "react";

/**
 * The ground.
 *
 * A fixed, viewport-filling surface whose colour is driven by scroll — so the
 * whole screen changes tone at once and there is no edge anywhere.
 *
 * This replaces a page-length vertical gradient. However smooth that gradient
 * was, it still put a *boundary* on the page, and scrolling dragged that
 * boundary up through the viewport: you could always see the moment arrive.
 * Tying the colour to scroll instead means nothing ever travels past. The room
 * simply gets darker while you are in it.
 *
 * ---------------------------------------------------------------------------
 * Two rules govern where the colour is allowed to move, and both come from
 * measurement rather than taste (CLAUDE.md §17):
 *
 * 1. The light hours advance with DISTANCE TRAVELLED, not with a fraction of
 *    the page. Ecru to golden is 26 units of red; spread over LIGHT_RUN that
 *    is about one unit per 230px of scrolling, which is below the threshold at
 *    which the eye reads a change. Scaling it to page length instead would make
 *    a short page — contact, say — dim visibly under the reader, because the
 *    same 26 units would be crossed in a third of the distance. A long page is
 *    simply a longer afternoon.
 *
 * 2. It stops at golden and never goes to night. See the note above sample()
 *    for why the sundown was removed rather than tuned.
 * ---------------------------------------------------------------------------
 */

type RGB = [number, number, number];

/** The hours of daylight, as a fraction of LIGHT_RUN. */
const LIGHT: [number, RGB][] = [
  [0.0, [247, 245, 242]], // ecru — morning
  [0.36, [244, 240, 233]], // late morning
  [0.62, [239, 232, 220]], // midday
  [0.83, [231, 220, 203]], // afternoon
  [1.0, [221, 205, 182]], // golden
];

/**
 * Scrolling distance over which the day fully turns, in CSS pixels. Set from
 * the homepage, where the light hours were measured as imperceptible.
 */
const LIGHT_RUN = 6400;

/**
 * There is no sundown any more, and that is a decision, not a regression.
 *
 * The ground used to fall all the way to night, which meant the last three
 * blocks of every page — the closing words, the letter, the footer — sat on
 * brown. The client asked twice for that brown to go, and then asked for the
 * sections above the footer to be light "like the rest of the website". Once
 * only the footer is dark, a scroll-driven descent has nothing left to do: the
 * footer simply paints itself (--hour-night), and its top edge is a structural
 * edge you expect to meet, not a gradient boundary sliding up the screen.
 *
 * That deletes a large amount of machinery — the descent window, the
 * [data-descent-from] markers, scripts/descent-cover.mjs — and with it the
 * whole class of bug where reordering a section moved the drop under a
 * paragraph. The day still runs: ecru at the top to golden at the foot. It just
 * never turns into night.
 *
 * [data-tone="dark"] survives on the footer because Header.tsx reads it to
 * decide when the header goes light-on-dark. Ground no longer looks at it.
 */
function sample(stops: [number, RGB][], t: number): RGB {
  let i = 0;
  while (i < stops.length - 2 && t > stops[i + 1][0]) i += 1;

  const [p0, c0] = stops[i];
  const [p1, c1] = stops[i + 1];
  const span = p1 - p0;
  const k = span <= 0 ? 0 : Math.min(1, Math.max(0, (t - p0) / span));

  return [
    Math.round(c0[0] + (c1[0] - c0[0]) * k),
    Math.round(c0[1] + (c1[1] - c0[1]) * k),
    Math.round(c0[2] + (c1[2] - c0[2]) * k),
  ];
}

export default function Ground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;

    const paint = () => {
      frame = 0;
      const colour = sample(LIGHT, Math.min(1, Math.max(0, window.scrollY / LIGHT_RUN)));
      el.style.backgroundColor = `rgb(${colour[0]} ${colour[1]} ${colour[2]})`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    el.dataset.live = "true";

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className="ground" aria-hidden="true" />;
}
