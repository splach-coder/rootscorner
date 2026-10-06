"use client";

import { useEffect, useState } from "react";

/**
 * A small WhatsApp mark, bottom right, that arrives once the visitor starts
 * scrolling (client, 6 Oct: she wants to be reachable on WhatsApp).
 *
 * Not on the first screen: the hero is the photograph and the name, nothing
 * else. Drawn in the site's own hand — a 44px umber square (Send and Add to
 * cart are the only other filled things here), the glyph in cream, no radius,
 * no shadow, no green — and it fades in rather than popping. One passive
 * scroll listener, rAF-throttled. Renders nothing when no number is set.
 */
export default function WhatsAppButton({ href, label }: { href: string | null; label: string }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      setShown(window.scrollY > 320);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
      className={`wa-float${shown ? " is-shown" : ""}`}
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.98.99-3.63-.23-.37a9.78 9.78 0 0 1-1.5-5.22c0-5.41 4.41-9.82 9.83-9.82 2.62 0 5.09 1.03 6.94 2.88a9.75 9.75 0 0 1 2.88 6.95c0 5.41-4.41 9.81-9.82 9.81zm8.37-18.18A11.76 11.76 0 0 0 12.05.15C5.5.15.18 5.47.18 12.01c0 2.09.55 4.13 1.59 5.93L.08 24l6.22-1.63a11.84 11.84 0 0 0 5.75 1.46h.01c6.54 0 11.87-5.32 11.87-11.86 0-3.17-1.24-6.15-3.48-8.39z" />
      </svg>
    </a>
  );
}
