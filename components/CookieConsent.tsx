"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CONSENT_CHANGED,
  CONSENT_NONE,
  categoriesInUse,
  consentNeeded,
  saveConsent,
  storedConsent,
  type ConsentCategory,
} from "@/lib/consent";
import type { Locale } from "@/lib/dictionaries";

/**
 * The cookie banner, and the panel behind it.
 *
 * It renders NOTHING while the site sets no cookies — see lib/consent.ts for
 * why that is the correct behaviour rather than a missing feature, and for the
 * one environment variable that wakes it.
 *
 * What makes it a compliant banner rather than a decorative one:
 *
 *  - **Refuse is exactly as easy as Accept.** Same size, same weight, side by
 *    side, one tap each. A "Refuse" hidden behind a settings screen while
 *    "Accept" is a filled button is the specific pattern the CNIL fines for.
 *  - **Nothing runs before a choice.** `allows()` defaults to deny, so no
 *    script waits on this component's opinion.
 *  - **Dismissal is not consent.** There is no ✕. Escape does not close it,
 *    and no outside click closes it — because either would be an ambiguous
 *    non-answer that a visitor could mistake for a decision. The only ways out
 *    are Accept, Refuse, or saving a choice.
 *  - **It is withdrawable**, from the Cookie Policy page, at any time.
 *
 * It is deliberately NOT a full-screen modal and does not trap focus: it is a
 * notice, the page behind it stays readable and usable, and blocking a whole
 * site until someone answers a cookie question is its own dark pattern.
 */
export default function CookieConsent({
  locale,
  t,
}: {
  locale: Locale;
  t: {
    title: string;
    body: string;
    accept: string;
    reject: string;
    settings: string;
    policy: string;
    panelTitle: string;
    panelBody: string;
    save: string;
    close: string;
    necessaryName: string;
    necessaryBody: string;
    necessaryAlways: string;
    analyticsName: string;
    analyticsBody: string;
    marketingName: string;
    marketingBody: string;
  };
}) {
  /**
   * `null` until the effect has read storage.
   *
   * The server cannot see localStorage, so rendering a decision before the
   * client has read it is a guaranteed hydration mismatch — the same rule the
   * cart follows with its `ready` flag. Nothing is rendered until then, which
   * also means the banner never flashes for someone who already answered.
   */
  const [open, setOpen] = useState<boolean | null>(null);
  const [panel, setPanel] = useState(false);
  const [choice, setChoice] = useState<Record<ConsentCategory, boolean>>(CONSENT_NONE);
  const panelRef = useRef<HTMLDivElement>(null);

  const cats = categoriesInUse();

  useEffect(() => {
    if (!consentNeeded()) {
      setOpen(false);
      return;
    }
    setOpen(storedConsent() === null);

    /* Another tab, or "withdraw consent" on the policy page. */
    const onChanged = () => setOpen(storedConsent() === null);
    window.addEventListener(CONSENT_CHANGED, onChanged);
    return () => window.removeEventListener(CONSENT_CHANGED, onChanged);
  }, []);

  /**
   * The panel is a dialog, so it behaves like one: Tab is kept inside it and
   * Escape returns to the banner. Escape does NOT dismiss the banner itself —
   * closing the choices is not the same as making one.
   */
  useEffect(() => {
    if (!panel) return;
    const box = panelRef.current;
    const opener = document.activeElement as HTMLElement | null;

    const focusable = () =>
      Array.from(
        box?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null);

    focusable()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanel(false);
        opener?.focus?.();
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
    return () => document.removeEventListener("keydown", onKey);
  }, [panel]);

  if (open !== true) return null;

  const decide = (value: Record<ConsentCategory, boolean>) => {
    saveConsent(value);
    setPanel(false);
    setOpen(false);
  };

  const all = (on: boolean) =>
    Object.fromEntries(cats.map((c) => [c, on])) as Record<ConsentCategory, boolean>;

  const rows: { key: ConsentCategory; name: string; body: string }[] = [
    { key: "analytics", name: t.analyticsName, body: t.analyticsBody },
    { key: "marketing", name: t.marketingName, body: t.marketingBody },
  ].filter((r) => cats.includes(r.key as ConsentCategory)) as typeof rows;

  return (
    <div
      className="consent"
      role="region"
      aria-label={t.title}
      /* A live region would announce the whole banner over whatever the visitor
         is reading. It is reachable in the tab order instead, which is how a
         notice of this weight should arrive. */
    >
      <div className="consent-inner shell">
        <div className="consent-said">
          <p className="label consent-title">{t.title}</p>
          <p className="consent-body">
            {t.body}{" "}
            <Link href={`/${locale}/legal/cookies`} className="link consent-policy">
              {t.policy}
            </Link>
          </p>
        </div>

        {/* Refuse and Accept carry identical weight. The third control is the
            way to a finer choice, set quieter because it is not a decision. */}
        <div className="consent-acts">
          <button
            type="button"
            className="label consent-more"
            onClick={() => {
              setChoice(storedConsent() ?? CONSENT_NONE);
              setPanel(true);
            }}
            aria-haspopup="dialog"
            aria-expanded={panel}
          >
            {t.settings}
          </button>
          <button
            type="button"
            className="label consent-btn"
            onClick={() => decide(all(false))}
          >
            {t.reject}
          </button>
          <button
            type="button"
            className="label consent-btn"
            onClick={() => decide(all(true))}
          >
            {t.accept}
          </button>
        </div>
      </div>

      {panel && (
        <div
          className="consent-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label={t.panelTitle}
        >
          <div className="consent-panel-inner shell">
            <p className="label consent-title">{t.panelTitle}</p>

            <ul className="consent-list">
              {/* Not a toggle. A switch that cannot be switched is the pattern
                  regulators name; this states the fact instead. */}
              <li className="consent-row">
                <div className="consent-row-said">
                  <p className="consent-row-name">{t.necessaryName}</p>
                  <p className="consent-row-body">{t.necessaryBody}</p>
                </div>
                <span className="label consent-always">{t.necessaryAlways}</span>
              </li>

              {rows.map((row) => (
                <li key={row.key} className="consent-row">
                  <div className="consent-row-said">
                    <p className="consent-row-name">{row.name}</p>
                    <p className="consent-row-body">{row.body}</p>
                  </div>
                  <label className="consent-switch">
                    <input
                      type="checkbox"
                      checked={choice[row.key]}
                      onChange={(e) =>
                        setChoice((c) => ({ ...c, [row.key]: e.target.checked }))
                      }
                    />
                    <span className="consent-switch-track" aria-hidden="true">
                      <span className="consent-switch-dot" />
                    </span>
                    <span className="sr-only">{row.name}</span>
                  </label>
                </li>
              ))}
            </ul>

            <p className="consent-note">{t.panelBody}</p>

            <div className="consent-acts consent-acts-panel">
              <button
                type="button"
                className="label consent-more"
                onClick={() => setPanel(false)}
              >
                {t.close}
              </button>
              <button
                type="button"
                className="label consent-btn"
                onClick={() => decide(choice)}
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
