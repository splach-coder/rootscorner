import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/dictionaries";
import { LEGAL_SLUGS, isLegalSlug, legalDoc } from "@/lib/legal";

export function generateStaticParams() {
  return locales.flatMap((locale) => LEGAL_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isLegalSlug(slug)) return {};
  const doc = legalDoc(locale, slug);
  if (!doc) return {};

  return {
    title: `${doc.title} — The Roots Corner`,
    // The document's own opening line. Never a written summary: a description
    // of a legal text that paraphrases it is a second, unreviewed version of it.
    description: doc.blocks.find((b) => b.kind === "p")?.text.slice(0, 155),
    alternates: {
      canonical: `/${locale}/legal/${slug}`,
      languages: {
        fr: `/fr/legal/${slug}`,
        en: `/en/legal/${slug}`,
        "x-default": `/fr/legal/${slug}`,
      },
    },
    // These pages exist to be found by someone looking for them, not by search.
    robots: { index: true, follow: true },
  };
}

/**
 * The client's legal pages, transcribed from their live site.
 *
 * One route for all six: they are the same kind of document and differ only in
 * their text, so giving each its own file would be six copies of one layout.
 * The FAQ has its own route because it is not a legal document and a visitor
 * looking for it should not have to find it under /legal/.
 */
export default async function LegalDocPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isLegalSlug(slug)) notFound();

  const doc = legalDoc(locale as Locale, slug);
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
