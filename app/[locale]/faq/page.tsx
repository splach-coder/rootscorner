import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { breadcrumbLd, faqLd, og, pageMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import FaqBrowser from "@/components/FaqBrowser";
import { isLocale, type Locale } from "@/lib/dictionaries";
import { CARE_GUIDE, FAQ, MRIRT } from "@/lib/copy-v2";

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
    image: og(`${lang}/faq.jpg`),
    description:
      lang === "fr"
        ? "Livraison au Maroc et à l’international, frais, délais, paiement, retours, suivi de commande et tapis Mrirt : les réponses de The Roots Corner."
        : "Delivery to Morocco and abroad, costs, times, payment, returns, order tracking and Mrirt rugs: answers from The Roots Corner.",
  });
}

/**
 * The FAQ — after benirugs.com's: the categories first; choosing one shows
 * its questions, folded (V3: nothing else on screen until a category is
 * chosen). The client's final copy, in
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

  /* The four categories, then the rugs (11 Oct): the same four questions the
     Mrirt page carries, shown here when that category is chosen. One source,
     MRIRT.faq in lib/copy-v2.ts. */
  const groups = [
    ...FAQ.map((c) => ({
      id: c.id,
      title: c.title[lang],
      items: c.items.map((i) => ({ q: i.q[lang], a: i.a.map((p) => p[lang]) })),
    })),
    {
      id: "tapis-mrirt",
      title: lang === "fr" ? "Tapis Mrirt" : "Mrirt rugs",
      items: MRIRT.faq.map((i) => ({
        q: i.q[lang],
        a: [i.a[lang]],
        // "Retrouvez nos conseils dans notre guide d'entretien" now has one (V4).
        link: /guide/i.test(i.a[lang]) ? { href: `/${locale}/guide-entretien#tapis`, label: CARE_GUIDE.link[lang] } : undefined,
      })),
    },
  ];
  const ld: [string, string][] = groups.flatMap((g) => g.items.map((i) => [i.q, i.a.join(" ")] as [string, string]));

  return (
    <>
      <JsonLd data={faqLd(lang, ld)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "The Roots Corner", path: `/${locale}` },
          { name: TITLE[lang], path: `/${locale}/faq` },
        ])}
      />
      <section className="faq-v2">
        <div className="shell faq-v2-inner">
          <Reveal className="faq-v2-head">
            <h1 className="display d-1 faq-v2-title">{TITLE[lang]}</h1>
          </Reveal>

          <FaqBrowser label={TITLE[lang]} groups={groups} />

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
