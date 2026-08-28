import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import Reveal from "@/components/Reveal";
import PieceCard from "@/components/PieceCard";
import { getDictionary, isLocale, fill, type Locale } from "@/lib/dictionaries";
import { categories, collectionOrder } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);

  return {
    title: `${t.collection.heading} — The Roots Corner`,
    description: t.collection.lede,
    alternates: {
      canonical: `/${locale}/collection`,
      languages: {
        fr: "/fr/collection",
        en: "/en/collection",
        "x-default": "/fr/collection",
      },
    },
  };
}

/**
 * The collection.
 *
 * Rebuilt. It used to be two halves: a grid of room photographs, then the
 * register — all 38 pieces as one numbered list with the same six fields,
 * read down the page like an archive.
 *
 * The register was the better idea and the wrong one. It came out of the
 * brief's ban on catalogue presentation, and it did something no grid can: a
 * uniform schema made the gaps in the client's data visible instead of papered
 * over. But this page has to sell, and nobody buys from a list — you cannot see
 * what you are being offered. The client asked for cards, and they are right.
 *
 * So the page is now one thing, not two. The rooms stop being a section and
 * become what they always were on this page — navigation, a rail of names and
 * counts across the top. Everything below is the collection itself, every piece
 * at the same size, photograph first.
 *
 * The closing band is gone with them: the grid shows all 38, so a band of four
 * more was a second sighting of pieces already on the screen.
 */
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);

  // Interleaved by room, not in source order — see collectionOrder().
  const pieces = collectionOrder();
  const rooms = categories();

  return (
    <>
      <PageHead
        eyebrow={t.collection.eyebrow}
        heading={t.collection.heading}
        meta={fill(t.collection.count, { pieces: pieces.length, rooms: rooms.length })}
        lede={t.collection.lede}
      />

      {/* --- The rooms, as a rail.

           They were a grid of seven large photographs, which made a visitor
           choose a room before they had seen a single piece — a whole screen
           spent on navigation. The photographs still do that job on the
           homepage, where a visitor genuinely does not know what is here yet.
           On this page the rooms are a way to narrow what is already in front
           of you, so they are set as what they are: names and counts. --- */}
      <section className="section rooms-rail-section">
        <div className="shell">
          <Reveal as="p" className="label rooms-rail-key">
            {t.collection.roomsEyebrow}
          </Reveal>

          <Reveal delay={60} as="nav" className="rooms-rail" aria-label={t.collection.roomsHeading}>
            <span className="rooms-rail-link is-here" aria-current="page">
              {t.category.all}
              <span className="rooms-rail-count">{pieces.length}</span>
            </span>

            {rooms.map((room) => (
              <Link
                key={room.slug}
                href={`/${locale}/collection/${room.slug}`}
                className="rooms-rail-link"
              >
                {t.categories.items[room.slug] ?? room.slug}
                <span className="rooms-rail-count">{room.count}</span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* --- Everything, at the same size. --- */}
      <section className="section cards-section">
        <div className="shell">
          <ul className="cards">
            {pieces.map((piece, i) => (
              <PieceCard
                key={piece.slug}
                piece={piece}
                locale={locale as Locale}
                labels={t.pieceLabel}
                room={t.categories.items[piece.category] ?? piece.category}
                sold={t.common.sold}
                delay={(i % 3) * 70}
              />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
