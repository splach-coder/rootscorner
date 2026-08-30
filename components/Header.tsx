"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CartButton from "./CartButton";
import { Wordmark } from "./BrandMarks";
import type { Locale } from "@/lib/dictionaries";

/**
 * Languages by their own name.
 *
 * Endonyms, not translations: a French speaker looking for their language scans
 * for "Français", not for "French". Same list in both dictionaries, which is
 * why it lives here rather than in lib/dictionaries.ts.
 */
const LANGS: Record<Locale, { short: string; name: string }> = {
  fr: { short: "FR", name: "Français" },
  en: { short: "EN", name: "English" },
};

type HeaderProps = {
  locale: Locale;
  /** "Cart", in the current language. */
  cart: string;
  labels: {
    collection: string;
    story: string;
    rugs: string;
    contact: string;
    menu: string;
    close: string;
    switchTo: string;
    switchLabel: string;
  };
};

/**
 * The header always carries a ground rather than floating over the photography
 * — an earlier version was transparent over the hero and the nav landed on the
 * dappled wall unreadable. It takes the tone of whichever hour sits under it,
 * so it inverts across the dusk and night sections instead of cutting a bright
 * band through them.
 */
export default function Header({ locale, cart, labels }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [onHero, setOnHero] = useState(false);
  const [retracted, setRetracted] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  /* True for one frame after a navigation, to kill the tone transition. */
  const [repainting, setRepainting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  /**
   * The page travels from morning ecru to night umber, so a header locked to
   * one ground would sit as a bright bar across the dark hours. Instead it
   * reads whichever section is under it and takes that section's tone.
   */
  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;

    const measure = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);

      /**
       * Retract while reading downward, return the moment the visitor looks
       * back up. The brief wants the pieces to be the stars; a bar pinned
       * across every photograph is chrome they did not ask for. Never retract
       * near the top, or it flickers against the hero.
       */
      if (Math.abs(y - lastY) > 6) {
        setRetracted(y > lastY && y > 260);
        lastY = y;
      }

      const line = 40; // just below the header's own centre line

      /**
       * While the header is still over the hero it borrows the hero's cream and
       * drops its own ground, so the photograph runs unbroken to the top edge.
       * Deliberately NOT driven by [data-tone]: Ground.tsx reads the first
       * dark-toned section to place the sundown, and marking the hero would move
       * that window to the top of the page.
       */
      const hero = document.querySelector<HTMLElement>(".hero");
      setOnHero(hero ? hero.getBoundingClientRect().bottom > line : false);
      const zones = document.querySelectorAll<HTMLElement>("[data-tone]");
      let tone = "light";
      for (const zone of zones) {
        const box = zone.getBoundingClientRect();
        if (box.top <= line && box.bottom > line) tone = zone.dataset.tone ?? "light";
      }
      setDark(tone === "dark");
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    /*
      Arrive at the new page's tone rather than travelling to it.

      The bar carries a 700ms background transition, which is right while
      scrolling and wrong across a navigation: the new page would inherit the
      old page's colour and fade out of it. Coming back from a dark footer that
      fade IS the flash. Suppressed while the first measurement lands, then
      released so ordinary scrolling animates exactly as before.
    */
    setRepainting(true);
    const release = window.setTimeout(() => setRepainting(false), 90);

    measure();

    /*
      Measure again once the new page has actually laid out.

      A route change swaps the sections under a header that is still wearing the
      last page's tone, and no scroll event fires to correct it — so the bar sat
      opaque (or dark, arriving from a footer) until the visitor nudged the
      page. Two frames is enough for the new DOM to be measurable; the timeout
      covers a late-arriving image changing the section heights under it.
    */
    const settle = [
      requestAnimationFrame(() => requestAnimationFrame(measure)),
      window.setTimeout(measure, 250),
    ] as const;

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(settle[0]);
      window.clearTimeout(settle[1]);
      window.clearTimeout(release);
      if (frame) cancelAnimationFrame(frame);
    };
    // Re-runs on navigation: the sections it measures are the page's, not the
    // header's, and they are replaced wholesale under it.
  }, [pathname]);

  /*
    Smooth scrolling, armed only for an anchor jump.

    globals.css keeps `scroll-behavior` behind `html[data-anchor]` because on
    `html` unconditionally it also animated the browser's jump-to-top on a route
    change — a second of flight back through the old page. This stamps the
    attribute when a same-page link is clicked and clears it once the jump has
    settled, so #main, #selection and #demander still glide and navigation does
    not.
  */
  useEffect(() => {
    let clear = 0;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const link = (event.target as HTMLElement | null)?.closest?.("a");
      const href = link?.getAttribute("href");
      if (!href?.startsWith("#") || href === "#") return;

      document.documentElement.dataset.anchor = "";
      window.clearTimeout(clear);
      // Long enough for the glide to finish; harmless if it already has.
      clear = window.setTimeout(() => {
        delete document.documentElement.dataset.anchor;
      }, 1200);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.clearTimeout(clear);
      delete document.documentElement.dataset.anchor;
    };
  }, []);

  // Close the panel on navigation and on Escape.
  useEffect(() => setOpen(false), [pathname]);
  /**
   * The panel locks page scroll while it is open, so it behaves as a modal and
   * has to be operated like one: Escape closes it, Tab is kept inside it, and
   * focus returns to the toggle that opened it.
   */
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const opener = document.activeElement as HTMLElement | null;

    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      ).filter((el) => el.offsetParent !== null);

    focusable()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus?.();
    };
  }, [open]);

  const other: Locale = locale === "fr" ? "en" : "fr";
  const swapped = pathname.replace(/^\/(fr|en)/, `/${other}`);

  /**
   * Split around the centred mark: the ways into the collection on the left,
   * the house and how to reach it on the right. Four items stacked on one side
   * against a lone language switch on the other read as lopsided rather than
   * composed.
   */
  const shopLinks = [
    { href: `/${locale}/collection`, label: labels.collection },
    { href: `/${locale}/mrirt`, label: labels.rugs },
  ];

  const houseLinks = [
    { href: `/${locale}/story`, label: labels.story },
    { href: `/${locale}/contact`, label: labels.contact },
  ];

  // The panel still offers everything, in reading order.
  const links = [...shopLinks, ...houseLinks];

  /* A menu that stays open after you have looked away is a stuck menu. */
  useEffect(() => {
    if (!langOpen) return;

    const onDown = (event: MouseEvent) => {
      if (!langRef.current?.contains(event.target as Node)) setLangOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLangOpen(false);
        langRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [langOpen]);

  return (
    <header
      /*
        While the menu is open the header stops reading the page underneath it.
        The panel is a full screen of morning ecru, so a header still wearing
        the night hour's inverted treatment — or the hero's over-photograph
        treatment — would be cream type on a pale ground, and the Close it
        carries would be the thing that disappeared.
      */
      className={`site-header${scrolled ? " is-scrolled" : ""}${
        dark && !open ? " is-dark" : ""
      }${onHero && !open ? " is-on-hero" : ""}${open ? " is-menu-open" : ""}${
        retracted && !open ? " is-retracted" : ""
      }${repainting ? " is-repainting" : ""}`}
    >
      <div className="site-header-bar shell">
        <nav className="site-nav" aria-label={labels.collection}>
          <ul className="site-nav-list">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link site-nav-link label">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href={`/${locale}`} className="site-header-mark" aria-label="The Roots Corner">
          {/* The client's own artwork, not the name typeset.

              It was a <span> set in Jost — close to the logo's letterforms but
              not them, and a logo reassembled out of a typeface every time it
              is drawn is not a logo. This is the Illustrator export itself
              (§2), with its viewBox trimmed to the lettering's own bounds.
              Nothing is redrawn, only placed and scaled.

              The crescent is not here at ANY width, at the client's
              instruction — it briefly returned to the desktop bar and they
              asked for it out again. It remains the favicon, the mark the intro
              writes, and part of the footer lockup; it simply is not in the bar.

              Dropping it also removes the intro's FLIP target, which is
              deliberate and handled: `morph()` finds no `[data-mark-target]`
              and the written crescent settles and fades as the veil lifts,
              exactly as §38 describes. Give a header mark `data-mark-target`
              and the FLIP branch picks it up again with no other change. */}
          <Wordmark className="site-header-lockup" crescent={false} />
        </Link>

        <div className="site-header-end">
          <nav className="site-nav" aria-label={labels.story}>
            <ul className="site-nav-list">
              {houseLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link site-nav-link label">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* A menu, not a toggle.

              A single "EN" link is only legible if you already know it swaps
              the language — it states the destination and not the control. A
              named list says what the choice is, and the current language is
              shown rather than hidden. Two items today; it costs nothing when a
              third arrives. */}
          <div className="site-lang" ref={langRef}>
            <button
              type="button"
              className="label site-lang-toggle"
              aria-expanded={langOpen}
              aria-haspopup="menu"
              aria-label={labels.switchLabel}
              onClick={() => setLangOpen((v) => !v)}
            >
              <span>{LANGS[locale].short}</span>
              <svg
                className="site-lang-caret"
                viewBox="0 0 10 6"
                width="10"
                height="6"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M1 1l4 4 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <ul className="site-lang-menu" role="menu" hidden={!langOpen}>
              {(Object.keys(LANGS) as Locale[]).map((code) => (
                <li key={code} role="none">
                  <Link
                    role="menuitem"
                    href={code === locale ? pathname : swapped}
                    className="site-lang-option"
                    lang={code}
                    hrefLang={code}
                    aria-current={code === locale ? "true" : undefined}
                    onClick={() => setLangOpen(false)}
                  >
                    {LANGS[code].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <CartButton label={cart} />

          <button
            type="button"
            className="label site-menu-toggle"
            aria-expanded={open}
            aria-controls="site-panel"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? labels.close : labels.menu}
          </button>
        </div>
      </div>

      {/*
        The menu, on a phone, is the whole page.

        NOT `hidden`, which cannot be transitioned — the panel is taken out of
        the layout with `visibility` instead, so it can fade both ways from CSS
        alone with no closing timer to keep in step with the animation.
        `visibility: hidden` also takes its links out of the tab order and the
        accessibility tree, which `opacity: 0` on its own would not.

        It sits UNDER the header bar in the stack, so the mark and the Close
        stay on top of it and the way out is always where the way in was.
      */}
      <div
        id="site-panel"
        ref={panelRef}
        className={`site-panel${open ? " is-open" : ""}`}
      >
        <div className="site-panel-inner shell">
          <nav className="site-panel-nav" aria-label={labels.menu}>
            <ul className="site-panel-list">
              {links.map((link, i) => (
                <li
                  key={link.href}
                  className="site-panel-item"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <Link href={link.href} className="display d-1 site-panel-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* What the bar used to carry on a phone. The cart and the language
              are not dropped, they are moved: a header with four controls in it
              at 390px is a toolbar, and this site is meant to look like a wall
              before it looks like software. */}
          <div
            className="site-panel-foot site-panel-item"
            style={{ "--i": links.length } as React.CSSProperties}
          >
            <div className="site-panel-cart">
              <CartButton label={cart} withLabel />
            </div>

            <ul className="site-panel-langs" aria-label={labels.switchLabel}>
              {(Object.keys(LANGS) as Locale[]).map((code) => (
                <li key={code}>
                  <Link
                    href={code === locale ? pathname : swapped}
                    className="label site-panel-lang"
                    lang={code}
                    hrefLang={code}
                    aria-current={code === locale ? "true" : undefined}
                  >
                    {LANGS[code].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
