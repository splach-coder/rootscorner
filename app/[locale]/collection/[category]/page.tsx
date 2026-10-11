import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import PieceCard from "@/components/PieceCard";
import { breadcrumbLd, itemListLd, pageMeta, og } from "@/lib/seo";
import { displayName } from "@/lib/specs";
import { fill, getDictionary, isLocale, locales, type Locale } from "@/lib/dictionaries";
import { collectionPieces, groupBySlug, groups, piecesByGroup } from "@/lib/catalog";
import { ALL_SLUG, COLLECTION, GROUPS } from "@/lib/copy-v2";
import { GROUP_OF } from "@/lib/piece-copy";

export function generateStaticParams() {
  return locales.flatMap((locale) => [
    ...GROUPS.map((g) => ({ locale, category: g.slug })),
    { locale, category: ALL_SLUG },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  if (isLocale(locale) && category === ALL_SLUG) {
    const n = collectionPieces().length;
    return pageMeta({
      locale,
      path: `/collection/${ALL_SLUG}`,
      title: `${COLLECTION.all[locale]} | The Roots Corner`,
      description: `${COLLECTION.all[locale]}: ${fill(COLLECTION.count[locale], { n })}.`,
      image: og("collection.jpg"),
    });
  }
  const g = groupBySlug(category);
  if (!isLocale(locale) || !g) return {};
  const count = piecesByGroup(category).length;
  return pageMeta({
    locale,
    path: `/collection/${category}`,
    title: `N° ${g.no} · ${g.name[locale]} | The Roots Corner`,
    description: `${g.name[locale]}: ${fill(count === 1 ? COLLECTION.countOne[locale] : COLLECTION.count[locale], { n: count })}.`,
    image: og("collection.jpg"),
  });
}

/**
 * One of the five categories (V2): its number and title, then its pieces,
 * then the way into the other four.
 */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  if (!isLocale(locale)) notFound();
  const isAll = category === ALL_SLUG;
  const found = groupBySlug(category);
  // "Toute la collection" (V3) behaves as a sixth category holding everything.
  const g = isAll ? { slug: ALL_SLUG, no: "", name: COLLECTION.all } : found;
  if (!g) {
    // The old rooms (stools, pots, …) now live inside the five categories.
    const moved = GROUP_OF[category];
    if (moved) permanentRedirect(`/${locale}/collection/${moved}`);
    notFound();
  }
  const t = getDictionary(locale as Locale);
  const pieces = isAll ? collectionPieces() : piecesByGroup(category);
  const others = groups().filter((o) => o.slug !== category);

  return (
    <>
      <JsonLd data={itemListLd(locale as Locale, pieces, (p) => displayName(p, locale as Locale))} />
      <JsonLd
        data={breadcrumbLd([
          { name: "The Roots Corner", path: `/${locale}` },
          { name: COLLECTION.title[locale], path: `/${locale}/collection` },
          { name: g.name[locale], path: `/${locale}/collection/${category}` },
        ])}
      />
      <section className="collection-head shell">
        <Reveal>
          <Link href={`/${locale}/collection`} className="link label collection-back">
            {COLLECTION.title[locale]}
          </Link>
          {g.no && <p className="label collection-head-no">N° {g.no}</p>}
          <h1 className="display d-1 collection-title">{g.name[locale]}</h1>
          <p className="label collection-head-count">
            {fill(pieces.length === 1 ? COLLECTION.countOne[locale] : COLLECTION.count[locale], {
              n: pieces.length,
            })}
          </p>
        </Reveal>
      </section>

      <section className="section room">
        <div className="shell">
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

          <Reveal className="room-rail">
            <p className="label room-rail-key">{COLLECTION.others[locale]}</p>
            <ul className="room-rail-list">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/${locale}/collection/${o.slug}`} className="link display d-3 room-rail-link">
                    <span className="label room-rail-no">N° {o.no}</span> {o.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
