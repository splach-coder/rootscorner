/**
 * Cookie consent — the state, and the question of whether to ask at all.
 *
 * ---------------------------------------------------------------------------
 * THE BANNER IS DORMANT BY DESIGN.
 *
 * This site currently sets no cookies. There is no `document.cookie`, no
 * Set-Cookie, no analytics, no tag manager and no third-party script tag; the
 * only browser storage is `trc:cart` and `trc:intro`, both first-party and
 * strictly functional. Under GDPR and ePrivacy, strictly necessary storage
 * needs no consent — and the site's own published Cookie Policy says exactly
 * that, in as many words:
 *
 *     "No consent banner is shown because there is nothing to consent to."
 *
 * So showing a banner today would make that page false and would ask a visitor
 * to consent to tracking that does not happen. For a French-market site the
 * CNIL treats that as a dark pattern, and CLAUDE.md §5's rule against stating
 * things that are not true applies to compliance copy most of all.
 *
 * The whole system is therefore built and wired, and `consentNeeded()` returns
 * false until something real needs consent. Set one of the environment
 * variables below and the banner appears on its own, with nothing to retrofit.
 *
 * ⚠️ WHOEVER TURNS ON ANALYTICS, SEARCH CONSOLE OR SHOPIFY CHECKOUT owns two
 * jobs, not one: set the flag here, AND rewrite `cookies` in lib/legal.ts,
 * which currently states there are none. A compliance document that is wrong
 * in the permissive direction is worse than no document.
 * ---------------------------------------------------------------------------
 */

/** localStorage key. Same `trc:` namespace as the cart and the intro. */
export const CONSENT_KEY = "trc:consent";

/** Fired on the window when the choice changes, so listeners can react. */
export const CONSENT_CHANGED = "trc:consent-changed";

/**
 * How long a decision stands before it is asked again.
 *
 * Six months would be the CNIL's own recommendation for a re-prompt. Thirteen
 * months is its stated maximum for the consent record itself. Six is used here
 * because re-asking is the safer error.
 */
export const CONSENT_MAX_AGE_DAYS = 182;

/**
 * The categories.
 *
 * `necessary` is not listed because it is not a choice: the cart and the intro
 * key are what make the site work, they are exempt from consent, and offering a
 * toggle that cannot be turned off is the pattern regulators single out. It is
 * described on the Cookie Policy page instead, which is where it belongs.
 */
export type ConsentCategory = "analytics" | "marketing";

export type Consent = {
  analytics: boolean;
  marketing: boolean;
  /** ISO date the choice was made, so it can be expired and evidenced. */
  at: string;
  /**
   * Which set of categories was on offer when they answered. If the site later
   * adds a category this visitor never saw, their old answer cannot stand for
   * it — `storedConsent()` treats that as no answer and asks again.
   */
  asked: ConsentCategory[];
};

/** Everything off. What a refusal stores, and what a non-answer means. */
export const CONSENT_NONE: Record<ConsentCategory, boolean> = {
  analytics: false,
  marketing: false,
};

/**
 * Whether anything on this site actually requires consent.
 *
 * Read from `NEXT_PUBLIC_*` so the client bundle can see it — the banner is a
 * client component and has to make this decision before paint. Any of these
 * being set means a third party is loaded and the banner is due.
 */
export function consentNeeded(): boolean {
  return categoriesInUse().length > 0;
}

/** The categories this build actually has something to put in. */
export function categoriesInUse(): ConsentCategory[] {
  const out: ConsentCategory[] = [];
  // Google Analytics / Search Console — measurement, not advertising.
  if (process.env.NEXT_PUBLIC_GA_ID) out.push("analytics");
  // Anything that profiles a visitor across sites. Nothing sets this yet.
  if (process.env.NEXT_PUBLIC_MARKETING_PIXEL) out.push("marketing");
  return out;
}

/**
 * Read the stored decision, or null if there is none that still stands.
 *
 * Returns null — meaning "ask" — when the record is missing, unparseable,
 * older than CONSENT_MAX_AGE_DAYS, or was made before a category now on offer
 * existed. Every one of those is a case where the honest answer is that this
 * visitor has not decided about what is being asked today.
 */
export function storedConsent(): Consent | null {
  if (typeof window === "undefined") return null;

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CONSENT_KEY);
  } catch {
    // Private mode, or storage disabled. Treated as no answer, and writing it
    // back will fail the same way — the banner simply reappears, which is the
    // correct behaviour for a browser that refuses to remember.
    return null;
  }
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object") return null;
  const c = parsed as Partial<Consent>;
  if (typeof c.at !== "string") return null;

  const at = Date.parse(c.at);
  if (Number.isNaN(at)) return null;
  if (Date.now() - at > CONSENT_MAX_AGE_DAYS * 86_400_000) return null;

  // A category added since they answered has never been put to this visitor.
  const asked = Array.isArray(c.asked) ? c.asked : [];
  if (categoriesInUse().some((cat) => !asked.includes(cat))) return null;

  return {
    analytics: c.analytics === true,
    marketing: c.marketing === true,
    at: c.at,
    asked: asked as ConsentCategory[],
  };
}

/** Persist a decision and tell the page. Never throws. */
export function saveConsent(choice: Record<ConsentCategory, boolean>): Consent {
  const record: Consent = {
    ...choice,
    at: new Date().toISOString(),
    asked: categoriesInUse(),
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    /* Storage refused. The choice still applies for this page view. */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED, { detail: record }));
  return record;
}

/** Forget the decision, so the banner asks again. Backs "Withdraw consent". */
export function clearConsent(): void {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* nothing to do */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED, { detail: null }));
}

/**
 * Whether a given category may run right now.
 *
 * Default DENY: with no stored answer nothing non-essential runs. That is the
 * strict reading of GDPR — consent must be given, and silence is not consent —
 * and it is the only safe one for a site selling into France, Belgium and
 * Switzerland.
 */
export function allows(category: ConsentCategory): boolean {
  const c = storedConsent();
  return c ? c[category] === true : false;
}
