import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PieceFrame from "@/components/PieceFrame";
import PieceLabel from "@/components/PieceLabel";
import PieceGallery from "@/components/PieceGallery";
import AddToCart from "@/components/AddToCart";
import ClosingBand from "@/components/ClosingBand";
import { getDictionary, isLocale, fill, locales, type Locale } from "@/lib/dictionaries";
import {
  accession,
  allPieces,
  formatPrice,
  pieceBySlug,
  relatedPieces,
} from "@/lib/catalog";
import { displayName } from "@/lib/specs";
import { frLine, frLines } from "@/lib/product-fr";

/**
 * The client's product copy, in the reading language.
 *
 * Translation only, never authorship (§11): an untranslated line falls back to
 * the client's English rather than vanishing, so the page is always complete
 * and `scripts/check-fr.mjs` is what reports the gap. Product NAMES are
 * deliberately not translated — see the docblock in lib/product-fr.ts.
 */
const say = (locale: Locale, lines: string[]) =>
  locale === "fr" ? frLines(lines) : lines;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    allPieces().map((piece) => ({ locale, slug: piece.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const piece = pieceBySlug(slug);
  if (!isLocale(locale) || !piece) return {};
  const t = getDictionary(locale);
  const name = displayName(piece);

  // The client's own first sentence where there is one; otherwise the site's
  // uniqueness line. Never a generated description of an object nobody
  // described — that is exactly the invented copy CLAUDE.md §5 forbids.
  // Translated too: this is the sentence Google prints under the French page,
  // and an English meta description on a /fr URL is the one place a
  // half-translated site is most visible.
  const first = piece.description[0];
  const description = first
    ? locale === "fr"
      ? frLine(first)
      : first
    : t.selection.unique;
  const image = piece.images[0];

  return {
    title: `${name} — The Roots Corner`,
    description,
    alternates: {
      canonical: `/${locale}/piece/${slug}`,
      languages: {
        fr: `/fr/piece/${slug}`,
        en: `/en/piece/${slug}`,
        "x-default": `/fr/piece/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: name,
      description,
      images: image ? [{ url: `/pieces/${image.file}`, width: image.w, height: image.h }] : [],
    },
  };
}

/**
 * The piece. The most important page on the site (CLAUDE.md §5).
 *
 * Two columns that behave differently: the photographs run down the page at
 * their own proportions, and the label stays put beside them. That is how an
 * object is actually looked at in a gallery — you move along the work, the
 * label does not move.
 *
 * Four decisions worth knowing about:
 *
 * NO CROPPING. Every photograph is rendered at its own ratio, taken from the
 * file (scripts/image-dims.mjs). Ratios in this set run 0.56 to 1.50; forcing
 * a house ratio would cut most of them, and on a site whose whole subject is
 * the object, cropping the object is the one unforgivable move.
 *
 * NO INVENTED FIELDS. Material, origin and dimensions come from lib/specs.ts,
 * which reads only what the client wrote. Description, details and care are
 * their text verbatim. Where a section has no content it does not render — 16
 * of 38 pieces have no usable dimension and 16 have no description at all, and
 * those pages have to be honest rather than padded.
 *
 * SOLD IS A NORMAL STATE. Stock is effectively one of everything, so "sold" is
 * frequent and designed for rather than handled: the label states it plainly
 * and the enquiry action is replaced instead of being left to fail.
 *
 * THE ENQUIRY IS TEMPORARY. Checkout belongs to Shopify (CLAUDE.md §6) and is
 * not wired yet. Rather than a button that does nothing, the action is a real
 * message that reaches a real person today. Swap this one link for the cart.
 */
export default async function PiecePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const piece = pieceBySlug(slug);
  if (!isLocale(locale) || !piece) notFound();

  const t = getDictionary(locale as Locale);
  const name = displayName(piece);
  const no = accession(piece);
  const price = formatPrice(piece, locale);
  const room = t.categories.items[piece.category] ?? piece.category;
  const related = relatedPieces(piece);

  // The slug, not a display string: contact resolves it back to the record and
  // can then show the photograph, the label and the price of what is being
  // asked about, and open the message with the piece's own number.
  const enquiry = `/${locale}/contact?piece=${piece.slug}`;

  return (
    <>
      <article className="piece">
        <div className="shell piece-inner">
          {/* --- The photographs, as a gallery.

               A fixed stage with a contact-sheet rail under it, rather than a
               column of images stacked one under another. The stage holds its
               height and every photograph is contained in it, which is what
               lets the page keep the no-cropping rule without the label moving
               each time you change shot — ratios here run 0.56 to 1.50. --- */}
          <div className="piece-gallery-column">
            <PieceGallery
              images={piece.images}
              name={name}
              countLabel={fill(
                piece.images.length === 1 ? t.piece.photographsOne : t.piece.photographs,
                { n: piece.images.length },
              )}
              railLabel={t.piece.photographsRail}
              zoomLabels={t.piece.zoom}
            />
          </div>

          {/* --- The label. Stays put while the photographs go past. --- */}
          <div className="piece-label-column">
            <Reveal className="piece-label-sticky">
              <p className="label piece-accession">
                {t.piece.accession} {no}
                <span aria-hidden="true"> · </span>
                <Link href={`/${locale}/collection/${piece.category}`} className="link">
                  {room}
                </Link>
              </p>

              <h1 className="display d-2 piece-name">{name}</h1>

              {/* Specs only: the name is this page's h1 and the price sits
                  with the enquiry action below. */}
              <PieceLabel
                piece={piece}
                locale={locale}
                labels={t.pieceLabel}
                variant="specs"
              />

              <p className="piece-unique label">{t.selection.unique}</p>

              <div className="piece-action">
                {piece.available ? (
                  <>
                    {price && <p className="piece-price display d-3">{price}</p>}

                    {/* Buy, or ask.

                        A priced piece can go in the cart; one the client never
                        priced cannot be sold from the site, so it keeps the
                        enquiry it always had. Nothing invents a price to make
                        the button work. */}
                    {piece.price !== null ? (
                      <>
                        <AddToCart
                          slug={piece.slug}
                          labels={{
                            add: t.cart.add,
                            added: t.cart.added,
                            view: t.cart.view,
                          }}
                        />
                        <Link href={enquiry} className="link label piece-ask">
                          {t.piece.enquire}
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href={enquiry} className="link label piece-cta">
                          {t.piece.enquire}
                        </Link>
                        <p className="label piece-cta-note">{t.piece.enquireNote}</p>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <p className="piece-price display d-3 is-gone">{t.common.sold}</p>
                    <p className="label piece-cta-note">{t.piece.soldNote}</p>
                  </>
                )}
              </div>

              {piece.delivery && (
                <dl className="piece-delivery">
                  <dt className="label">{t.piece.delivery}</dt>
                  <dd>{locale === "fr" ? frLine(piece.delivery) : piece.delivery}</dd>
                  <dd className="label piece-delivery-note">{t.piece.deliveryNote}</dd>
                </dl>
              )}
            </Reveal>
          </div>

        </div>

        {/* --- The client's own words. Nothing renders that they did not write. --- */}
        {(piece.description.length > 0 ||
          piece.details.length > 0 ||
          piece.care.length > 0) && (
          <div className="shell piece-words">
            {piece.description.length > 0 && (
              <Reveal className="piece-story">
                <p className="label">{t.piece.about}</p>
                <div className="prose piece-prose">
                  {say(locale, piece.description).map((line, i) => (
                    <p key={i} className={i === 0 ? "lede" : undefined}>
                      {line}
                    </p>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal delay={80} className="piece-specs">
              {piece.details.length > 0 && (
                <div className="piece-spec-block">
                  <p className="label">{t.piece.details}</p>
                  <ul className="piece-spec-list">
                    {say(locale, piece.details).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}

              {piece.care.length > 0 && (
                <div className="piece-spec-block">
                  <p className="label">{t.piece.care}</p>
                  <ul className="piece-spec-list">
                    {say(locale, piece.care).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>
          </div>
        )}
      </article>

      {/* --- Where to look next. --- */}
      {related.length > 0 && (
        <section className="section piece-more">
          <div className="shell">
            <Reveal>
              <p className="label">{t.piece.more}</p>
            </Reveal>
            <ul className="hang">
              {related.map((other, i) => (
                <li key={other.slug} className={`hang-item hang-${i + 1}`}>
                  <Link
                    href={`/${locale}/piece/${other.slug}`}
                    className="hang-link swap-host"
                  >
                    <PieceFrame
                      piece={other}
                      delay={i * 100}
                      width={other.images[0]?.w ?? 1400}
                      height={other.images[0]?.h ?? 2100}
                      sizes="(max-width: 700px) 84vw, 30vw"
                    />
                    {/* `sell`, like every other grid on the site. The full
                        schema belongs on a piece page, which is where the
                        visitor already is — repeating it under three thumbnails
                        turns them back into catalogue entries (§26). */}
                    <Reveal delay={i * 100 + 80} className="hang-caption">
                      <PieceLabel
                        piece={other}
                        locale={locale}
                        labels={t.pieceLabel}
                        variant="sell"
                      />
                    </Reveal>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ClosingBand
        locale={locale as Locale}
        t={t.closing}
        labels={t.pieceLabel}
        exclude={[piece.slug, ...related.map((other) => other.slug)]}
      />
    </>
  );
}
