"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CartButton from "./CartButton";
import { ACCOUNT_URL } from "@/lib/shopify";
import { Wordmark } from "./BrandMarks";
import Img from "./Img";
import type { Locale } from "@/lib/dictionaries";
import { ALL_SLUG, COLLECTION, GROUPS } from "@/lib/copy-v2";
import { ALL_RUGS, RUG_TYPES } from "@/lib/rug-types";

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

export type CollectionMenuItem = {
  href: string;
  label: string;
  no: string;
  image: { src: string; w: number; h: number } | null;
};

type HeaderProps = {
  locale: Locale;
  /** The Collection panel: categories with their photographs (layout.tsx). */
  collectionMenu?: CollectionMenuItem[];
  /** The Berber rugs panel (V5): every rug, then each kind (layout.tsx). */
  rugMenu?: CollectionMenuItem[];
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
    account: string;
  };
};

/**
 * The header always carries a ground rather than floating over the photography
 * — an earlier version was transparent over the hero and the nav landed on the
 * dappled wall unreadable. It takes the tone of whichever hour sits under it,
 * so it inverts across the dusk and night sections instead of cutting a bright
 * band through them.
 */
/** The two nav items that open a panel rather than going to a page. */
type MegaKey = "rugs" | "collection";

export default function Header({ locale, cart, labels, collectionMenu = [], rugMenu = [] }: HeaderProps) {
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
  /* V3: "Collection" opens its categories, after HOMURA's menu; V5: "Tapis
     berbères" opens the kinds of rug the same way. One panel, two lists. */
  const [mega, setMega] = useState<MegaKey | null>(null);
  /* The list the panel shows; kept after closing so it fades out with its words. */
  const [megaShown, setMegaShown] = useState<MegaKey>("collection");
  const colOpen = mega !== null;
  const [panelSub, setPanelSub] = useState<MegaKey | null>(null);
  const colRef = useRef<HTMLUListElement>(null);
  const colTimer = useRef<number | null>(null);
  /* Opened by the pointer resting on it: a click then must not close it. */
  const colHover = useRef(false);
  /* The category whose photograph the panel shows. */
  const [colActive, setColActive] = useState(0);
  const megaRef = useRef<HTMLDivElement>(null);

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
    settled, so #main, #demander and #comment still glide and navigation does
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
  /*
    No prefetch on any header or footer link (5 Oct incident). These links are
    on screen on every page, all the time, and on 5 Oct one browser re-fetched
    their four pages ~200 times a second until the Workers daily quota was
    gone and the whole site returned 429. Not reproducible here, so the fix is
    structural: chrome that never leaves the screen does not prefetch. A
    click still navigates; the page is fetched then, from the edge cache.
  */
  const links: { href: string; label: string; menu?: MegaKey }[] = [
    { href: `/${locale}/mrirt`, label: labels.rugs, menu: "rugs" },
    { href: `/${locale}/collection`, label: labels.collection, menu: "collection" },
    { href: `/${locale}/story`, label: labels.story },
    { href: `/${locale}/contact`, label: labels.contact },
  ];

  /* The categories, in the order of the collection page, then everything. */
  const collectionLinks: CollectionMenuItem[] = collectionMenu.length
    ? collectionMenu
    : [
        { href: `/${locale}/collection/${ALL_SLUG}`, label: COLLECTION.all[locale], no: "", image: null },
        ...GROUPS.map((g) => ({ href: `/${locale}/collection/${g.slug}`, label: g.name[locale], no: g.no, image: null })),
      ];
  const rugLinks: CollectionMenuItem[] = rugMenu.length
    ? rugMenu
    : [
        { href: `/${locale}/mrirt`, label: ALL_RUGS[locale], no: "", image: null },
        ...RUG_TYPES.map((k) => ({ href: `/${locale}/tapis/${k.slug}`, label: k.name[locale], no: "", image: null })),
      ];
  const menuItems: Record<MegaKey, CollectionMenuItem[]> = { rugs: rugLinks, collection: collectionLinks };
  const menuLabel: Record<MegaKey, string> = { rugs: labels.rugs, collection: labels.collection };

  /* Closed on navigation, outside click and Escape, like the language menu. */
  useEffect(() => {
    setMega(null);
    setPanelSub(null);
  }, [pathname]);
  useEffect(() => {
    if (!colOpen) return;
    const onDown = (event: MouseEvent) => {
      const t = event.target as Node;
      if (!colRef.current?.contains(t) && !megaRef.current?.contains(t)) setMega(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        colRef.current?.querySelector<HTMLButtonElement>(`[data-menu="${mega}"]`)?.focus();
        setMega(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [colOpen, mega]);
  /* Hover opens it on a pointer device; a short delay on leaving, so the gap
     between the word and the panel does not close it. */
  const openMega = (key: MegaKey) => {
    if (key !== megaShown) setColActive(0);
    setMegaShown(key);
    setMega(key);
  };
  const hoverOpen = (key: MegaKey) => {
    if (colTimer.current) window.clearTimeout(colTimer.current);
    colHover.current = true;
    openMega(key);
  };
  /* The pointer moving from the word into the panel keeps what is open. */
  const hoverStay = () => {
    if (colTimer.current) window.clearTimeout(colTimer.current);
    colHover.current = true;
  };
  const hoverClose = () => {
    colHover.current = false;
    if (colTimer.current) window.clearTimeout(colTimer.current);
    colTimer.current = window.setTimeout(() => setMega(null), 180);
  };

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
        dark && !open && !colOpen ? " is-dark" : ""
      }${onHero && !open && !colOpen ? " is-on-hero" : ""}${open ? " is-menu-open" : ""}${colOpen ? " is-mega-open" : ""}${
        retracted && !open ? " is-retracted" : ""
      }${repainting ? " is-repainting" : ""}`}
    >
      <div className="site-header-bar shell">
        <Link prefetch={false} href={`/${locale}`} className="site-header-mark" aria-label="The Roots Corner">
          {/* The client's own artwork, viewBox trimmed to the lettering (§39). */}
          <Wordmark className="site-header-lockup" crescent={false} />
        </Link>

        {/* One nav, evenly spaced, in the order a visitor shops: the rugs
            first (client, 5 Oct), the pieces, the house, and how to reach it (client, 5 Oct). It used
            to be two lists with two different gaps, which read as uneven. */}
        <nav className="site-nav" aria-label={labels.menu}>
          <ul className="site-nav-list" ref={colRef}>
            {links.map((link) =>
              link.menu ? (
                <li
                  key={link.href}
                  className="site-nav-collection"
                  onMouseEnter={() => hoverOpen(link.menu!)}
                  onMouseLeave={hoverClose}
                >
                  <button
                    type="button"
                    className="link site-nav-link label site-nav-toggle"
                    data-menu={link.menu}
                    aria-expanded={mega === link.menu}
                    aria-controls="site-mega"
                    onClick={() => {
                      const key = link.menu!;
                      // Opened by the pointer resting on it: a click keeps it open.
                      if (colHover.current && mega === key) return;
                      if (mega === key) setMega(null);
                      else openMega(key);
                    }}
                  >
                    {link.label}
                    <svg className="site-lang-caret" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true" focusable="false">
                      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </li>
              ) : (
                <li key={link.href}>
                  <Link prefetch={false} href={link.href} className="link site-nav-link label">
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        {/* The tools, set apart from the nav: language, orders, cart. "Mes
            commandes" is an icon here — as a fifth word in the row it read as
            a page of the site, and on a phone it appeared twice. */}
        <div className="site-header-end">
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
                    prefetch={false}
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

          {/* Shopify hosts the account and owns the sign-in (§58). Rendered
              only when its URL is configured. */}
          {ACCOUNT_URL && (
            <a
              href={`${ACCOUNT_URL}?locale=${locale}`}
              className="site-account"
              target="_blank"
              rel="noreferrer noopener"
              aria-label={labels.account}
              title={labels.account}
            >
              <svg
                viewBox="0 0 20 20"
                width="19"
                height="19"
                aria-hidden="true"
                focusable="false"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <circle cx="10" cy="6.6" r="3.4" />
                <path d="M3.4 17.6c.9-3.3 3.5-5.2 6.6-5.2s5.7 1.9 6.6 5.2" strokeLinecap="round" />
              </svg>
            </a>
          )}

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
      {/* The Collection panel (V3, after Chabi Chic's menu): full width under
          the bar, 45% of the screen high. The categories on the left; on the
          right the photograph of the one under the pointer, which changes by
          a slow dissolve-and-settle rather than a cut. Every photograph is in
          the DOM so the change never waits on a download. */}
      <div
        id="site-mega"
        ref={megaRef}
        className={`site-mega${colOpen ? " is-open" : ""}`}
        onMouseEnter={hoverStay}
        onMouseLeave={hoverClose}
      >
        <div className="site-mega-inner">
          <nav className="site-mega-nav shell" aria-label={menuLabel[megaShown]}>
            <ul className="site-mega-list" key={megaShown}>
              {menuItems[megaShown].map((c, i) => (
                <li key={c.href}>
                  <Link
                    prefetch={false}
                    href={c.href}
                    className={`site-mega-link${i === colActive ? " is-active" : ""}`}
                    aria-current={pathname === c.href ? "page" : undefined}
                    onMouseEnter={() => setColActive(i)}
                    onFocus={() => setColActive(i)}
                    onClick={() => setMega(null)}
                  >
                    <span className="label site-mega-no">{c.no ? `N° ${c.no}` : ""}</span>
                    <span className="display site-mega-name">{c.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="site-mega-photos" aria-hidden="true">
            {(Object.keys(menuItems) as MegaKey[]).flatMap((key) =>
              menuItems[key].map((c, i) =>
                c.image ? (
                  <Img
                    key={`${key}-${c.href}`}
                    src={c.image.src}
                    alt=""
                    width={c.image.w}
                    height={c.image.h}
                    sizes="(min-width: 940px) 40vw, 1px"
                    className={`site-mega-photo${key === megaShown && i === colActive ? " is-active" : ""}`}
                  />
                ) : null,
              ),
            )}
          </div>
        </div>
      </div>

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
                  {link.menu ? (
                    <>
                      <button
                        type="button"
                        className="display d-1 site-panel-link site-panel-toggle"
                        aria-expanded={panelSub === link.menu}
                        aria-controls={`site-panel-${link.menu}`}
                        onClick={() => setPanelSub((v) => (v === link.menu ? null : link.menu!))}
                      >
                        {link.label}
                      </button>
                      <ul id={`site-panel-${link.menu}`} className="site-panel-sub" hidden={panelSub !== link.menu}>
                        {menuItems[link.menu].map((c) => (
                          <li key={c.href}>
                            <Link prefetch={false} href={c.href} className="site-panel-sublink">
                              {c.no && <span className="site-collection-no">N° {c.no}</span>}
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link prefetch={false} href={link.href} className="display d-1 site-panel-link">
                      {link.label}
                    </Link>
                  )}
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
            {ACCOUNT_URL && (
              <a
                href={`${ACCOUNT_URL}?locale=${locale}`}
                className="label site-panel-account"
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setOpen(false)}
              >
                {labels.account}
              </a>
            )}

            <ul className="site-panel-langs" aria-label={labels.switchLabel}>
              {(Object.keys(LANGS) as Locale[]).map((code) => (
                <li key={code}>
                  <Link
                    prefetch={false}
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
