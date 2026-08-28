import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getDictionary, isLocale, type Locale } from "@/lib/dictionaries";
import { legalDoc } from "@/lib/legal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const doc = legalDoc(locale, "faq");

  return {
    title: `${doc?.title ?? "FAQ"} — The Roots Corner`,
    description: doc?.blocks
      .flatMap((b) => (b.kind === "dl" ? b.items.map(([q]) => q) : []))
      .join(" · ")
      .slice(0, 155),
    alternates: {
      canonical: `/${locale}/faq`,
      languages: { fr: "/fr/faq", en: "/en/faq", "x-default": "/fr/faq" },
    },
  };
}

/** The client's own FAQ, transcribed. Its own route: it is not a legal page. */
export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const doc = legalDoc(locale as Locale, "faq");
  if (!doc) notFound();
  const t = getDictionary(locale as Locale);

  return (
    <LegalPage
      doc={doc}
      locale={locale as Locale}
      eyebrow={t.legal.eyebrow}
      index={t.legal.items}
      indexLabel={t.legal.alsoHere}
      faqLabel={t.legal.faq}
    />
  );
}
