import Link from "next/link";
import { Wordmark } from "./BrandMarks";
import FooterNewsletter from "./FooterNewsletter";
import type { Locale } from "@/lib/dictionaries";
import { FOOTER } from "@/lib/copy-v2";
import { SOCIAL } from "@/lib/site";

type FooterProps = {
  locale: Locale;
  t: {
    navLabel: string;
    rights: string;
    collection: string;
    story: string;
    rugs: string;
    contact: string;
  };
  /** Names of the legal documents, in the client's own footer order. */
  legal: { faq: string; items: Record<string, string> };
};

/**
 * The footer — V2 (10 Oct), after benirugs.com's.
 *
 * The client: a structured, minimal, editorial layout; the newsletter sign-up
 * as a prominent but elegant section, then clearly organised links; a smaller
 * logo; the dark ground kept; the legal information more discreet; one footer
 * statement on every page.
 */
export default function Footer({ locale, t, legal: names }: FooterProps) {
  const groups = [
    {
      title: FOOTER.groups.shop[locale],
      links: [
        { href: `/${locale}/mrirt`, label: t.rugs },
        { href: `/${locale}/collection`, label: t.collection },
      ],
    },
    {
      title: FOOTER.groups.house[locale],
      links: [
        { href: `/${locale}/story`, label: t.story },
        { href: `/${locale}/faq`, label: names.faq },
        { href: `/${locale}/contact`, label: t.contact },
      ],
    },
  ];

  const legal = ["imprint", "privacy", "cookies", "delivery", "withdrawal", "terms"].map((slug) => ({
    href: `/${locale}/legal/${slug}`,
    label: names.items[slug] ?? slug,
  }));

  return (
    <footer className="site-footer foot-v2 after-dark" data-tone="dark">
      <div className="shell foot-top">
        <FooterNewsletter
          privacyHref={`/${locale}/legal/privacy`}
          labels={{
            heading: FOOTER.newsletter.heading[locale],
            body: FOOTER.newsletter.body[locale],
            placeholder: FOOTER.newsletter.placeholder[locale],
            submit: FOOTER.newsletter.submit[locale],
            consent: FOOTER.newsletter.consent[locale],
            privacy: FOOTER.newsletter.privacy[locale],
            done: FOOTER.newsletter.done[locale],
            error: FOOTER.newsletter.error[locale],
          }}
        />

        <nav className="foot-cols" aria-label={t.navLabel}>
          {groups.map((g) => (
            <div key={g.title} className="foot-col">
              <p className="label foot-col-title">{g.title}</p>
              <ul>
                {g.links.map((link) => (
                  <li key={link.href}>
                    <Link prefetch={false} href={link.href} className="foot-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="foot-col">
            <p className="label foot-col-title">{FOOTER.groups.follow[locale]}</p>
            <ul>
              {SOCIAL.map((channel) => (
                <li key={channel.key}>
                  <a href={channel.href} className="foot-link" target="_blank" rel="noreferrer noopener">
                    {channel.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="shell foot-sign">
        <Wordmark className="foot-mark" title="The Roots Corner" />
        <div className="foot-sign-said">
          <p className="foot-statement">{FOOTER.statement[locale]}</p>
          <p className="label foot-place">{FOOTER.place[locale]}</p>
        </div>
      </div>

      <div className="shell foot-legal">
        <p>
          © {new Date().getFullYear()} {t.rights}
        </p>
        <ul>
          {legal.map((link) => (
            <li key={link.href}>
              <Link prefetch={false} href={link.href} className="foot-legal-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
