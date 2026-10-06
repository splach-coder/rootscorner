"use client";

import { useRef } from "react";

/**
 * A horizontal strip a mouse can drag, the way a finger already swipes it.
 *
 * Touch and pen use the browser's own scrolling (momentum and all); this only
 * adds the mouse: grab, drag, and a short glide on release that carries the
 * speed of the throw and settles. A drag never counts as a click, so letting
 * go over a photograph does not open it. Snapping is suspended while the hand
 * is on it — snap fights every frame of a drag — and resumes after the glide.
 */
export default function DragScroll({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const s = useRef({ down: false, moved: false, x: 0, left: 0, lastX: 0, lastT: 0, v: 0, raf: 0 });

  const stopGlide = () => cancelAnimationFrame(s.current.raf);

  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !ref.current) return;
    stopGlide();
    s.current = { ...s.current, down: true, moved: false, x: e.clientX, left: ref.current.scrollLeft, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const st = s.current;
    const el = ref.current;
    if (!st.down || !el) return;
    const dx = e.clientX - st.x;
    if (!st.moved && Math.abs(dx) > 5) {
      st.moved = true;
      el.classList.add("is-dragging");
      el.setPointerCapture(e.pointerId);
    }
    if (!st.moved) return;
    el.scrollLeft = st.left - dx;
    const dt = Math.max(1, e.timeStamp - st.lastT);
    st.v = (e.clientX - st.lastX) / dt; // px per ms
    st.lastX = e.clientX;
    st.lastT = e.timeStamp;
  };

  const release = (e: React.PointerEvent<HTMLUListElement>) => {
    const st = s.current;
    const el = ref.current;
    if (!st.down || !el) return;
    st.down = false;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    if (!st.moved) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let v = reduce ? 0 : -st.v * 16; // px per frame
    const glide = () => {
      if (Math.abs(v) < 0.4) {
        el.classList.remove("is-dragging");
        return;
      }
      el.scrollLeft += v;
      v *= 0.92;
      st.raf = requestAnimationFrame(glide);
    };
    glide();
  };

  return (
    <ul
      ref={ref}
      className={`drag-scroll ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      onClickCapture={(e) => {
        if (s.current.moved) {
          e.preventDefault();
          e.stopPropagation();
          s.current.moved = false;
        }
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </ul>
  );
}
