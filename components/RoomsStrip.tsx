"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The rooms strip, and its one-shot look-through.
 *
 * The strip bleeds off the right edge so its last cell is visibly cut, which is
 * how it says "there is more, one push away" without an arrow. That reads if you
 * are looking at it; it does not if the covers are still below the fold when you
 * arrive. So the first time the strip is seen it drifts sideways on its own to
 * show the rooms further along, then eases back to the start.
 *
 * ---------------------------------------------------------------------------
 * Rules this obeys, all of them the brief's or the project's own:
 *
 * - **Once per page load.** A carousel that moves every time you come back to a
 *   page is exactly the "excessive animation" the brief bans. A module-scope
 *   flag is the whole mechanism: it survives client-side navigation within the
 *   app (so returning from a piece is quiet) and dies on a real reload, which
 *   is what "once per page load" means. Deliberately NOT sessionStorage — that
 *   is the intro veil's rule (§21) and would stay quiet across a refresh too.
 *
 * - **It never fights the visitor.** Any touch, wheel, keypress or manual
 *   scroll of the strip cancels it instantly and leaves the strip wherever the
 *   hand put it. An animation that argues with a finger is worse than none.
 *
 * - **Off entirely under `prefers-reduced-motion`.**
 *
 * - **It waits until the strip is actually on screen**, using the same
 *   rAF-throttled rect check Reveal uses rather than IntersectionObserver —
 *   see components/Reveal.tsx for why IO is not trusted here.
 * ---------------------------------------------------------------------------
 */

/**
 * Module scope, so it persists across client-side navigation and resets on a
 * real page load. This is the "once per page load, not every time we come
 * back" rule, and it is one line rather than a storage key.
 */
let played = false;

/** Milliseconds spent drifting out, holding, and easing back. */
const OUT = 1500;
const HOLD = 620;
const BACK = 1100;

/**
 * Wait after the strip has FINISHED revealing, so the drift is noticed rather
 * than missed — and so it never overlaps the settle it follows.
 */
const SETTLE = 420;

/** `--dur-reveal` (1100ms) plus the stagger, since the drift waits for both. */
const REVEAL = 1100;

/** Ease-in-out: it has to leave AND arrive gently, so not --ease-material. */
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

export default function RoomsStrip({
  className,
  children,
  revealDelay = 0,
  ...rest
}: {
  className?: string;
  children: ReactNode;
  /** Stagger against the eyebrow above, in ms. Matches the rail's own. */
  revealDelay?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Reduced motion still has to SHOW the strip — it only skips the movement.
       Returning early before this was set would leave `.reveal` at opacity 0
       and the covers would never appear at all. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    if (played) {
      setVisible(true);
      return;
    }

    /* Nothing to look through if it does not overflow — a wide phone, or a
       catalogue that has shrunk to four rooms. */
    const travel = () => el.scrollWidth - el.clientWidth;

    let raf = 0;
    let timer = 0;
    let animating = false;
    let done = false;

    const cleanup = () => {
      done = true;
      // Snapping comes back on however the gesture ended, including an abort.
      el.classList.remove("is-looking");
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onPageScroll);
      window.removeEventListener("resize", onPageScroll);
      for (const ev of ["pointerdown", "touchstart", "wheel", "keydown"] as const) {
        el.removeEventListener(ev, abort);
      }
      el.removeEventListener("scroll", onStripScroll);
    };

    /**
     * The visitor took over. Stop where we are — never snap back to 0, which
     * would throw away the position their own hand chose.
     */
    function abort() {
      if (done) return;
      played = true;
      cleanup();
    }

    /**
     * A scroll on the strip that this animation did not cause is the visitor's.
     * `expected` is what the last frame wrote; anything else came from a hand.
     */
    let expected = -1;
    function onStripScroll() {
      if (!animating) return;
      if (Math.abs(el!.scrollLeft - expected) > 2) abort();
    }

    /** Drive scrollLeft directly rather than with scroll-behavior: smooth —
        that property is armed only for anchor jumps now (§40) and a native
        smooth scroll cannot be interrupted mid-flight the way this can.
    
        Requires `.is-looking` to be on, which turns scroll-snap off: snap acts
        on programmatic writes too, so without it every frame is quantised to
        the nearest cell and a 1.5s glide collapses into one 144px jump. */
    const run = (from: number, to: number, ms: number, then: () => void) => {
      const t0 = performance.now();
      const step = (now: number) => {
        if (done) return;
        const p = Math.min(1, (now - t0) / ms);
        const x = from + (to - from) * ease(p);
        expected = x;
        el.scrollLeft = x;
        if (p < 1) raf = requestAnimationFrame(step);
        else then();
      };
      raf = requestAnimationFrame(step);
    };

    const play = () => {
      if (done || played) return;
      /* Nothing to look through if it does not overflow — a wide phone, or a
         catalogue that has shrunk to four rooms. Checked HERE rather than on
         mount: on desktop the strip is display:none and measures zero, and
         bailing out early would have skipped the reveal above with it. */
      if (travel() <= 8) return;
      played = true;
      animating = true;

      /* Far enough to show that the row continues and that the rooms further
         along are different objects — not all the way to the end, which would
         read as a carousel playing itself rather than as a glance. */
      const to = Math.min(travel(), el.clientWidth * 0.72);

      el.classList.add("is-looking");
      el.addEventListener("scroll", onStripScroll, { passive: true });
      run(0, to, OUT, () => {
        timer = window.setTimeout(() => {
          run(el.scrollLeft, 0, BACK, () => {
            animating = false;
            cleanup();
          });
        }, HOLD);
      });
    };

    /* Same rect check as Reveal: fire once the strip has risen above 88% of the
       viewport, or immediately if it is already on screen at rest.

       Two things happen then, in order. The strip SETTLES first, exactly as
       every other block on the page does — and only once that transition has
       finished does it drift.

       Sequencing matters here and was the bug: the strip was not wrapped in a
       reveal at all, so it sat at full opacity from 37ms and began moving at
       2228ms — while its own eyebrow was still fading in and 151ms short of
       being readable. A strip that moves before its heading can be read is two
       animations arguing, not one gesture. */
    function onPageScroll() {
      if (done) return;
      const box = el!.getBoundingClientRect();
      const limit = window.scrollY === 0 ? window.innerHeight : window.innerHeight * 0.88;
      if (box.top < limit && box.bottom > 0) {
        window.removeEventListener("scroll", onPageScroll);
        window.removeEventListener("resize", onPageScroll);
        setVisible(true);
        timer = window.setTimeout(play, revealDelay + REVEAL + SETTLE);
      }
    }

    for (const ev of ["pointerdown", "touchstart", "wheel", "keydown"] as const) {
      el.addEventListener(ev, abort, { passive: true });
    }
    window.addEventListener("scroll", onPageScroll, { passive: true });
    window.addEventListener("resize", onPageScroll, { passive: true });
    onPageScroll();

    return cleanup;
  }, [revealDelay]);

  return (
    <div
      ref={ref}
      className={`${className ?? ""}${visible ? " is-visible" : ""}`}
      style={
        revealDelay
          ? ({ "--reveal-delay": `${revealDelay}ms` } as React.CSSProperties)
          : undefined
      }
      {...rest}
    >
      {children}
    </div>
  );
}
