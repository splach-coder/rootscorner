import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { og, pageMeta } from "@/lib/seo";
import { isLocale, type Locale } from "@/lib/dictionaries";
import { CARE_GUIDE } from "@/lib/copy-v2";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMeta({
    locale,
    path: "/guide-entretien",
    title: `${CARE_GUIDE.title[locale]} | The Roots Corner`,
    description: CARE_GUIDE.sections[0].body[0][locale],
    image: og("guide.jpg"),
  });
}

/**
 * The care guide (V4, 11 Oct): the house's own advice for the wool rugs and
 * the wooden pieces, which the rug FAQ points to. Laid out like the FAQ:
 * one centred column, quiet type.
 */
export default async function CareGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale as Locale;

  return (
    <section className="faq-v2 care-guide">
      <div className="shell faq-v2-inner">
        <Reveal className="faq-v2-head">
          <h1 className="display d-1 faq-v2-title">{CARE_GUIDE.title[lang]}</h1>
        </Reveal>
        {CARE_GUIDE.sections.map((s) => (
          <Reveal key={s.id} as="section" className="faq-v2-group care-guide-group">
            <h2 id={s.id} className="display faq-v2-group-title">
              {s.heading[lang]}
            </h2>
            {"subheading" in s && s.subheading && <p className="label care-guide-sub">{s.subheading[lang]}</p>}
            <div className="care-guide-body">
              {s.body.map((p, i) => (
                <p key={i}>{p[lang]}</p>
              ))}
            </div>
          </Reveal>
        ))}
        <div className="faq-v2-still">
          <Link href={`/${locale}/faq`} className="link label">
            {lang === "fr" ? "Questions fréquentes" : "Frequently asked questions"}
          </Link>
          <Link href={`/${locale}/contact`} className="link label">
            {lang === "fr" ? "Nous écrire" : "Write to us"}
          </Link>
        </div>
      </div>
    </section>
  );
}
