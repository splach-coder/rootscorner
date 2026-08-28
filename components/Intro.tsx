"use client";

import { useEffect, useRef, useState } from "react";
import { CRESCENT_D, CRESCENT_STROKE, CRESCENT_VIEWBOX } from "./BrandMarks";

/* -------------------------------------------------------------------------- *
 * The intro.
 *
 * The crescent is an Arabic-inspired "R" (CLAUDE.md §2), so it is written
 * rather than faded in: a pen travels from the top tip down and around to the
 * tail — right to left, the direction that letterform is actually written.
 *
 * It is a filled outline, not a stroke, so it cannot be drawn with
 * stroke-dashoffset directly; that would trace its silhouette instead of
 * writing it. The fill is revealed through a mask whose content is one thick
 * stroke running down the middle of the glyph (see BrandMarks.CRESCENT_STROKE).
 * pathLength="1" lets the dash animate in normalised units, so no measurement
 * is needed at runtime.
 *
 * Then it morphs: the same element travels and scales into the header's picto
 * slot, measured live (FLIP), while the veil lifts. There is no second mark and
 * no cross-fade — the thing you watched being written is the thing that ends up
 * in the header.
 *
 * Whether it runs at all is decided before paint by the inline script in the
 * layout, which sets data-intro on <html>. That keeps the veil out of the DOM's
 * way on repeat visits, under prefers-reduced-motion, and with JS off.
 * -------------------------------------------------------------------------- */

/** The nib travels. Quick out of the gate, long settle — a written stroke. */
const WRITE = 720;
/** The ink is allowed to sit for a beat before it is asked to move. */
const HOLD = 70;
/** Travel and scale into the header slot. */
const OPEN = 760;
/**
 * The veil starts lifting after the morph has visibly begun, so the mark is
 * already travelling when the page arrives under it.
 */
const LIFT_DELAY = 120;
const LIFT = 640;
/**
 * The handover waits a beat past the end of the morph. Scheduling it for the
 * same instant is a race the mark can lose — the veil hides while the mark is
 * still a frame short of its slot, and it visibly jumps. Overlapping instead is
 * free: the two crescents are the same glyph at the same box by then, so the
 * frames where both are painted are indistinguishable from either alone.
 */
const SETTLE = 90;

/** Reveal listens for this so the page's own gesture is not spent behind the veil. */
export const INTRO_DONE = "trc:intro-done";

export default function Intro() {
  const [phase, setPhase] = useState<"write" | "open">("write");
  const markRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    // Repeat visit, reduced motion, or no scripting — the veil is display:none
    // and there is nothing to run.
    if (root.dataset.intro !== "run") return;

    let live = true;
    const timers: number[] = [];

    /**
     * The write is a CSS animation, so it starts at first paint; this effect
     * runs at hydration. Timing the morph with a plain setTimeout from here
     * therefore drifts by however long hydration took — measured at over 500ms
     * on a cold production start, which was enough to fire the morph before the
     * nib had finished. Waiting on the animation itself removes the guesswork:
     * .finished resolves even if the write completed before we asked.
     */
    const nib = markRef.current?.querySelector(".intro-nib");
    const running = nib?.getAnimations?.() ?? [];
    const written = running.length
      ? Promise.all(running.map((a) => a.finished)).catch(() => {})
      : new Promise((r) => timers.push(window.setTimeout(r, WRITE)));

    written.then(() => {
      if (!live) return;

      timers.push(
        window.setTimeout(() => {
          morph(markRef.current);
          setPhase("open");
        }, HOLD),

        window.setTimeout(
          () => window.dispatchEvent(new Event(INTRO_DONE)),
          HOLD + LIFT_DELAY,
        ),

        window.setTimeout(() => {
          // "done" both unlocks the page and tells the header its picto is now
          // its own to show — without replaying the crescent-swing, which the
          // write-on has just stood in for.
          root.dataset.intro = "done";
        }, HOLD + OPEN + SETTLE),
      );
    });

    return () => {
      live = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      className="intro"
      data-phase={phase}
      aria-hidden="true"
      style={
        {
          "--intro-write": `${WRITE}ms`,
          "--intro-open": `${OPEN}ms`,
          "--intro-lift": `${LIFT}ms`,
          "--intro-lift-at": `${LIFT_DELAY}ms`,
        } as React.CSSProperties
      }
    >
      <div className="intro-veil" />

      <svg ref={markRef} className="intro-mark" viewBox={CRESCENT_VIEWBOX} fill="currentColor">
        <defs>
          {/* userSpaceOnUse: the nib is 19 wide and bulges past the glyph's
              own box, which the default objectBoundingBox region would clip. */}
          <mask
            id="intro-write"
            maskUnits="userSpaceOnUse"
            x="-16"
            y="-16"
            width="118"
            height="143"
          >
            <path
              className="intro-nib"
              d={CRESCENT_STROKE}
              pathLength="1"
              fill="none"
              stroke="#fff"
              strokeWidth="19"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>
        <path d={CRESCENT_D} mask="url(#intro-write)" />
      </svg>
    </div>
  );
}

/**
 * FLIP onto the header's picto. Both are the same SVG at the same viewBox, so
 * matching centre and width lands them on each other exactly and the handover
 * at the end needs no cross-fade.
 */
function morph(mark: SVGSVGElement | null) {
  const target = document.querySelector<HTMLElement>("[data-mark-target]");
  if (!mark || !target) return;

  const from = mark.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  if (from.width === 0 || to.width === 0) return;

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  mark.style.transform = `translate(${dx}px, ${dy}px) scale(${to.width / from.width})`;
}
