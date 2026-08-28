import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import Reveal from "@/components/Reveal";
import PieceCard from "@/components/PieceCard";
import ClosingBand from "@/components/ClosingBand";
import { getDictionary, isLocale, fill, locales, type Locale } from "@/lib/dictionaries";
import { categorySlugs, hasCategory, piecesByCategory } from "@/lib/catalog";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categorySlugs().map((category) => ({ locale, category })),
  );
}

function roomName(locale: Locale, slug: string): string {
  return getDictionary(locale).categories.items[slug] ?? slug;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isLocale(locale) || !hasCategory(category)) return {};
  const t = getDictionary(locale);
  const name = roomName(locale, category);
  const count = piecesByCategory(category).length;

  return {
    title: `${name} — The Roots Corner`,
    // Built from counts and the room's own name: it states what is on the page
    // and claims nothing about any object.
    description: `${name} — ${fill(count === 1 ? t.category.countOne : t.category.count, {
      n: count,
    })}. ${t.selection.unique}`,
    alternates: {
      canonical: `/${locale}/collection/${category}`,
      languages: {
        fr: `/fr/collection/${category}`,
        en: `/en/collection/${category}`,
        "x-default": `/fr/collection/${category}`,
      },
    },
  };
}

/**
 * One room.
 *
 * Deliberately sparse — the brief asks for a selection, not a catalogue, and
 * the largest room here holds twelve pieces. They hang two across at
 * alternating heights rather than in a grid, which is the same argument as the
 * homepage's staggered trio: a row of equal cards reads as stock, a wall of
 * works hung at different heights reads as a collection.
 *
 * Every piece carries the same wall label as everywhere else on the site.
 */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  if (!isLocale(locale) || !hasCategory(category)) notFound();

  const t = getDictionary(locale as Locale);
  const pieces = piecesByCategory(category);
  const others = categorySlugs().filter((slug) => slug !== category);

  return (
    <>
      <PageHead
        eyebrow={t.category.eyebrow}
        heading={roomName(locale as Locale, category)}
        meta={fill(pieces.length === 1 ? t.category.countOne : t.category.count, {
          n: pieces.length,
        })}
      >
        <Link href={`/${locale}/collection`} className="link label page-head-back">
          {t.category.all}
        </Link>
      </PageHead>

      <section className="section room">
        <div className="shell">
          {/* The same cards as /collection.

              A room used to be two across, staggered, with the full wall label
              under each — a hang. That was right when the collection page was a
              register and this was the only place you could see the pieces. Now
              both pages are the shop, and a visitor moving from one to the other
              should find the same object at the same size, not a different
              layout for the same job. */}
          <ul className="cards">
            {pieces.map((piece, i) => (
              <PieceCard
                key={piece.slug}
                piece={piece}
                locale={locale as Locale}
                labels={t.pieceLabel}
                sold={t.common.sold}
                delay={(i % 4) * 70}
              />
            ))}
          </ul>

          {/* The rail of other rooms. Walking out of a room should put you in
              the corridor, not back at the front door. */}
          <Reveal className="room-rail">
            <p className="label room-rail-key">{t.category.others}</p>
            <ul className="room-rail-list">
              {others.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${locale}/collection/${slug}`}
                    className="link display d-3 room-rail-link"
                  >
                    {roomName(locale as Locale, slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <ClosingBand
        locale={locale as Locale}
        t={t.closing}
        labels={t.pieceLabel}
        exclude={pieces.map((piece) => piece.slug)}
      />
    </>
  );
}
