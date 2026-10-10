import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { faqLd, pageMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { isLocale, type Locale } from "@/lib/dictionaries";
import { FAQ } from "@/lib/copy-v2";

const TITLE = { fr: "Questions fréquentes", en: "Frequently asked questions" };
const STILL = {
  fr: "Vous ne trouvez pas votre réponse ?",
  en: "Can’t find your answer?",
};
const WRITE = { fr: "Nous écrire", en: "Write to us" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const lang = locale as Locale;

  return pageMeta({
    locale,
    path: "/faq",
    title: `${TITLE[lang]} | The Roots Corner`,
    description: FAQ.flatMap((c) => c.items.map((i) => i.q[lang]))
      .join(" ")
      .slice(0, 155),
  });
}

/**
 * The FAQ — V2, after benirugs.com's: the categories as anchors at the top,
 * then each category with its questions folded. The client's final copy, in
 * their four categories. The Mrirt questions live on the Mrirt page.
 */
export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale as Locale;

  const ld: [string, string][] = FAQ.flatMap((c) =>
    c.items.map((i) => [i.q[lang], i.a.map((p) => p[lang]).join(" ")] as [string, string]),
  );

  return (
    <>
      <JsonLd data={faqLd(lang, ld)} />
      <section className="faq-v2">
        <div className="shell faq-v2-inner">
          <Reveal className="faq-v2-head">
            <h1 className="display d-1 faq-v2-title">{TITLE[lang]}</h1>
            <nav className="faq-v2-nav" aria-label={TITLE[lang]}>
              <ul>
                {FAQ.map((c) => (
                  <li key={c.id}>
                    <a href={`#${c.id}`} className="faq-v2-anchor">
                      {c.title[lang]}
                    </a>
                  </li>
                ))}
                <li>
                  <Link href={`/${locale}/mrirt#questions`} className="faq-v2-anchor">
                    {lang === "fr" ? "Tapis Mrirt" : "Mrirt rugs"}
                  </Link>
                </li>
              </ul>
            </nav>
          </Reveal>

          {FAQ.map((c) => (
            <section key={c.id} id={c.id} className="faq-v2-group" aria-labelledby={`${c.id}-title`}>
              <h2 id={`${c.id}-title`} className="display faq-v2-group-title">
                {c.title[lang]}
              </h2>
              <div className="faq-v2-list">
                {c.items.map((item, i) => (
                  <details key={i} className="faq-v2-item">
                    <summary>{item.q[lang]}</summary>
                    <div className="faq-v2-answer">
                      {item.a.map((p, j) => (
                        <p key={j}>{p[lang]}</p>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <div className="faq-v2-still">
            <p>{STILL[lang]}</p>
            <Link href={`/${locale}/contact`} className="link label">
              {WRITE[lang]}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
