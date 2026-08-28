import Link from "next/link";
import { Wordmark } from "./BrandMarks";
import Social from "./Social";
import type { Locale } from "@/lib/dictionaries";

type FooterProps = {
  locale: Locale;
  t: {
    tagline: string;
    place: string;
    navLabel: string;
    instagramNote: string;
    rights: string;
    collection: string;
    story: string;
    rugs: string;
    contact: string;
    artisans: string;
    stay: string;
    faq: string;
    terms: string;
    privacy: string;
    withdrawal: string;
  };
  /** Names of the legal documents, in the client's own footer order. */
  legal: { alsoHere: string; faq: string; items: Record<string, string> };
};

/**
 * Night — the last hour.
 *
 * The brief asks for a "very simple" footer, and an early version that ignored
 * that — four columns of link lists in a newsletter voice — was rejected as the
 * shape of a large retailer. So this stays three bands: the house, the ways in,
 * the fine print. What changed is the composition, not the amount.
 *
 * The lockup is the client's actual artwork now, not a reconstruction of it.
 * The previous version set the crescent above the name and then typeset "The
 * Roots Corner" in Marcellus underneath — close, but the wrong letterforms, and
 * a logo assembled out of a different typeface every time it is drawn is not a
 * logo. Wordmark is the Illustrator export: crescent, name, spacing and all.
 * Nothing here is redrawn (CLAUDE.md §2); it is placed and scaled.
 *
 * It is also the largest thing in the footer on purpose. The page travels from
 * morning to night and the mark is a crescent, so at the end of the day it
 * reads as the moon over the room.
 *
 * Each band now has a left and a right. The old footer put everything in the
 * left column and left half the width empty, which reads as an unfinished
 * composition rather than as space.
 */
export default function Footer({ locale, t, legal: names }: FooterProps) {
  const links = [
    { href: `/${locale}/collection`, label: t.collection },
    { href: `/${locale}/mrirt`, label: t.rugs },
    { href: `/${locale}/story`, label: t.story },
    { href: `/${locale}/artisans`, label: t.artisans },
    { href: `/${locale}/stay`, label: t.stay },
    { href: `/${locale}/faq`, label: names.faq },
    { href: `/${locale}/contact`, label: t.contact },
  ];

  /**
   * All six, in the order the client's own footer lists them — a visitor who
   * knows the old site finds the same names in the same sequence. The
   * documents behind them are their text, transcribed (lib/legal.ts).
   */
  const legal = ["imprint", "privacy", "cookies", "delivery", "withdrawal", "terms"].map(
    (slug) => ({ href: `/${locale}/legal/${slug}`, label: names.items[slug] ?? slug }),
  );

  return (
    <footer className="section site-footer after-dark" data-tone="dark">
      <div className="shell site-footer-inner">
        {/* The house signs off. */}
        <div className="site-footer-sign">
          <Wordmark className="site-footer-mark" title="The Roots Corner" />

          <div className="site-footer-said">
            <p className="site-footer-tagline">{t.tagline}</p>
            <p className="label site-footer-place">{t.place}</p>
          </div>
        </div>

        {/* The ways in. The channels are pulled out of the row: they are where
            the brand actually lives, not two more pages of the site. */}
        <div className="site-footer-ways">
          <nav className="site-footer-links label" aria-label={t.navLabel}>
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="site-footer-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <Social className="site-footer-social" />
        </div>

        {/* The fine print. */}
        <div className="site-footer-end label label-inverse">
          <p>
            © {new Date().getFullYear()} {t.rights}
          </p>
          <p className="site-footer-legal">
            {legal.map((link, i) => (
              <span key={link.href}>
                {i > 0 && <span aria-hidden="true"> · </span>}
                <Link href={link.href} className="site-footer-link">
                  {link.label}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
