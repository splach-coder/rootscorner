"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { INTRO_DONE } from "./Intro";

/* -------------------------------------------------------------------------- *
 * A single shared scroll check for every reveal on the page.
 *
 * This deliberately does NOT use IntersectionObserver. IO delivers the state at
 * callback time rather than for every position passed through, so a fast flick
 * or a programmatic jump can coalesce callbacks and report "not intersecting"
 * for an element that was on screen moments earlier. The element then stays
 * invisible for good. That is a content-loss bug, not a cosmetic one, and it
 * reproduced reliably under scripts/audit.mjs.
 *
 * Reading rects on a rAF-throttled scroll is deterministic: an element cannot
 * be missed, because we test its actual position rather than trusting an event.
 * One listener serves the whole page, and each element is dropped from the set
 * the moment it is revealed.
 * -------------------------------------------------------------------------- */

type Pending = { el: HTMLElement; show: () => void };

const pending = new Set<Pending>();
let frame = 0;
let listening = false;

/** Reveal once the element's top has risen above 88% of the viewport height. */
const TRIGGER = 0.88;

function check() {
  frame = 0;
  const vh = window.innerHeight;

  /**
   * Before the visitor has scrolled, anything already on screen reveals —
   * the trigger line does not apply to the first view.
   *
   * Without this, content sitting just below 88% of the first viewport is
   * stranded: it never reaches the line without scrolling, and by the time you
   * scroll it has left the screen. The hero note lived at 795px against a
   * 792px line and simply never appeared.
   */
  const limit = window.scrollY === 0 ? vh : vh * TRIGGER;

  for (const entry of [...pending]) {
    // top < threshold covers both "entering from below" and "already scrolled
    // past" (where top is negative), so nothing can be left behind.
    if (entry.el.getBoundingClientRect().top < limit) {
      entry.show();
      pending.delete(entry);
    }
  }

  if (pending.size === 0) stop();
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(check);
}

function start() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
}

function stop() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
}

function watch(entry: Pending) {
  pending.add(entry);
  start();
  schedule();
  return () => {
    pending.delete(entry);
    if (pending.size === 0) stop();
  };
}

/* -------------------------------------------------------------------------- */

type RevealProps = {
  children: ReactNode;
  /** `frame` also settles the image inside it out of a slight scale. */
  variant?: "text" | "frame";
  /** Stagger within a group, in ms. Keep small — the tempo is already slow. */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/**
 * The page's single motion gesture: content settles into place once, slowly.
 *
 * Deliberately not a scroll-linked effect. The brief bans excessive animation,
 * and anything tied continuously to scroll position reads as a gimmick on a
 * site whose job is to hold still and let photographs be looked at.
 */
export default function Reveal({
  children,
  variant = "text",
  delay = 0,
  as: Tag = "div",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect the OS setting: no watching, no transition, just show it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    let unwatch: (() => void) | undefined;
    const begin = () => {
      unwatch = watch({ el, show: () => setVisible(true) });
    };

    /**
     * The intro veil covers the page, so revealing now would spend the page's
     * one gesture behind it and the hero would simply be there when the veil
     * lifted. Wait for the signal instead — which the layout's inline script
     * guarantees to send even if this bundle never runs.
     */
    if (document.documentElement.dataset.intro === "run") {
      window.addEventListener(INTRO_DONE, begin, { once: true });
      return () => {
        window.removeEventListener(INTRO_DONE, begin);
        unwatch?.();
      };
    }

    begin();
    return () => unwatch?.();
  }, []);

  const base = variant === "frame" ? "reveal reveal-frame" : "reveal";

  return (
    <Tag
      ref={ref}
      className={`${base}${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
