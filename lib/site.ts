/**
 * Facts about the house that are not products.
 *
 * Everything here is sourced. Nothing is a plausible-looking placeholder:
 * CLAUDE.md §5 forbids inventing information, and an invented email address or
 * street address is the most damaging kind — a visitor would act on it.
 */

/** The client's own account, and their primary channel (CLAUDE.md §2). */
export const INSTAGRAM = "https://www.instagram.com/therootscorner.m/";
export const INSTAGRAM_HANDLE = "@therootscorner.m";

/**
 * The address SHOWN on the page, for someone who would rather write from their
 * own mail client than use the form.
 *
 * This is not where the form delivers — that is lib/enquiry.ts, server-side, so
 * the delivery address never has to be published to publish a form. The two are
 * deliberately separate: a house may well take enquiries at an address it does
 * not want scraped off a public page.
 *
 * SOURCED, at last. This was switched off rather than invented for as long as
 * we had nothing (CLAUDE.md §5) — their commercial proposal still lists
 * "coordonnées de contact" among the things owed. But their own Legal Notice
 * and Privacy Policy both publish therootscornerm@gmail.com as the address for
 * code-of-conduct reports and GDPR requests, so it is the house's own published
 * address and the default here. Override it the moment they want a different
 * one on the site.
 */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "therootscornerm@gmail.com";

/**
 * The registered address, from the client's own Legal Notice — transcribed in
 * lib/legal.ts and captured in docs/reference/legal/imprint.txt.
 *
 * This was an unknown until the legal pages were transcribed, and the site was
 * built to show nothing rather than guess. It is now sourced, published by the
 * house itself on its own imprint, so it can be shown.
 */
export const ADDRESS = {
  street: "Rue de la liberté 48",
  city: "40000 Marrakech",
  country: { fr: "Maroc", en: "Morocco" },
  /** Moroccan company identifiers, as the imprint gives them. */
  ice: "003729558000059",
  rc: "165659",
} as const;

/**
 * WhatsApp.
 *
 * Held as the client writes it — international form, spacing and all — because
 * that string is what a visitor reads, and only the client knows how their own
 * number should be grouped. The link strips it back to digits itself.
 *
 * Switched off rather than invented, the same rule as CONTACT_EMAIL: a wrong
 * phone number is the single worst thing this site could publish, because it is
 * the one piece of information a visitor acts on without checking. Set
 * NEXT_PUBLIC_WHATSAPP to e.g. "+212 6 12 34 56 78" and it appears.
 */
export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.trim() || null;

/**
 * A click-to-chat link, optionally opening with the message already written.
 *
 * wa.me is WhatsApp's own short domain and takes the number as digits only —
 * no plus, no spaces. Returns null when the number is absent or too short to be
 * a real one, so a malformed environment variable renders nothing rather than a
 * link that dead-ends.
 */
export function whatsappHref(text?: string): string | null {
  const digits = whatsappDigits();
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/**
 * The number reduced to digits, or null if there isn't a plausible one.
 *
 * Handed to the enquiry form so it can build its own link at the moment a send
 * fails, carrying whatever the visitor had just typed. Eight is the shortest
 * any national number runs to; below that the value is a typo, and rendering
 * nothing beats rendering a link that dead-ends.
 */
export function whatsappDigits(): string | null {
  if (!WHATSAPP) return null;
  const digits = WHATSAPP.replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}

/**
 * Marrakech. Public geographic fact, not a claim about the business — the
 * brand's own material places the house in Marrakech, and these are the
 * coordinates of that city, not of any premises we have been told about.
 */
export const PLACE = {
  city: "Marrakech",
  country: { fr: "Maroc", en: "Morocco" },
  lat: "31.6295° N",
  lon: "7.9811° W",
} as const;

/**
 * The channels the house is actually on.
 *
 * Instagram is sourced — it is the client's own account and their primary
 * channel. The rest are switched off, not invented: the same rule as
 * CONTACT_EMAIL above. A visitor who clicks a Facebook icon that leads to a
 * page the client does not run is worse served than one who never sees it.
 *
 * Set NEXT_PUBLIC_FACEBOOK / _PINTEREST / _TIKTOK to a full URL and that
 * channel appears everywhere at once. This is the single place that decides.
 */
export const SOCIAL: { key: string; label: string; href: string }[] = [
  { key: "instagram", label: "Instagram", href: INSTAGRAM },
  { key: "facebook", label: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK || "" },
  { key: "pinterest", label: "Pinterest", href: process.env.NEXT_PUBLIC_PINTEREST || "" },
  { key: "tiktok", label: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK || "" },
].filter((s) => s.href.length > 0);
