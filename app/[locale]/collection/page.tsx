import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import Reveal from "@/components/Reveal";
import PieceCard from "@/components/PieceCard";
import RoomsStrip from "@/components/RoomsStrip";
import { getDictionary, isLocale, fill, type Locale } from "@/lib/dictionaries";
import Image from "next/image";
import { categories, collectionOrder, imagePath } from "@/lib/catalog";

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

          {/* One nav, two forms.

              Wide screens keep the rail: eight short names and their counts on
              one line, which is the right shape when they fit (§30). On a phone
              they do not fit — they wrap onto four ragged lines of pure text —
              so the same rooms are shown as a strip of their own covers that
              you push sideways. `categories()` already carries a cover
              photograph per room and the rail was throwing it away.

              The covers are rendered for every viewport and hidden by CSS on
              desktop rather than branched in JS: the server cannot know the
              width, and a swap after hydration would flash. Next/Image only
              fetches what the `sizes` query resolves to, and that query is
              `(min-width: 700px) 0px`, so a desktop visitor downloads none of
              them. */}
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

          {/* aria-hidden, and every card here duplicates a link in the rail
              above: a screen reader or a keyboard already has the whole list in
              the nav, and offering it twice would double every room in the tab
              order for a gesture neither can use. */}
          {/* tabIndex={-1} because a scroll container is keyboard-focusable by
              default — correct in general, so the arrow keys can scroll it, and
              wrong inside an aria-hidden subtree, where it was a tab stop
              leading into content that has been hidden from the tree. The rail
              above holds every one of these destinations for a keyboard, and is
              visually hidden rather than removed for exactly that reason. */}
          {/* `reveal` is on the strip itself, with the same 120ms stagger the
              rail beside it uses, so the covers settle in AFTER the eyebrow
              above them rather than alongside it. RoomsStrip then waits for
              this transition to end before it drifts — see the component. */}
          <RoomsStrip
            className="rooms-strip reveal"
            revealDelay={120}
            aria-hidden="true"
            tabIndex={-1}
          >
            {/* Where you already are, and it leads the strip for the same reason
                it leads the rail: a visitor who has narrowed to one room needs
                the way back to everything, and on this page that is the state
                they are already in. Stated, not a card — it has no cover of its
                own, and borrowing a piece's photograph to stand for "all of it"
                would make one object speak for thirty-eight. */}
            <span className="rooms-strip-cell rooms-strip-all" aria-current="page">
              <span className="rooms-strip-all-said">{t.category.all}</span>
              <span className="rooms-strip-count label">{pieces.length}</span>
            </span>

            {rooms.map((room) => {
              const src = imagePath(room.cover?.images[0]);
              return (
                <Link
                  key={room.slug}
                  href={`/${locale}/collection/${room.slug}`}
                  className="rooms-strip-cell"
                  tabIndex={-1}
                >
                  <span className="frame rooms-strip-frame">
                    {src && (
                      <Image
                        src={src}
                        alt=""
                        width={1200}
                        height={1600}
                        sizes="(min-width: 700px) 0px, 34vw"
                      />
                    )}
                  </span>
                  <span className="rooms-strip-name">
                    {t.categories.items[room.slug] ?? room.slug}
                  </span>
                  <span className="rooms-strip-count label">{room.count}</span>
                </Link>
              );
            })}
          </RoomsStrip>
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
