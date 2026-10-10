import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PieceFrame from "@/components/PieceFrame";
import PieceLabel from "@/components/PieceLabel";
import PieceGallery from "@/components/PieceGallery";
import AddToCart from "@/components/AddToCart";
import PieceBuy from "@/components/PieceBuy";
import ClosingBand from "@/components/ClosingBand";
import MoreRugs from "@/components/MoreRugs";
import RugProduct from "@/components/RugProduct";
import { rugLabels } from "@/lib/rug-labels";
import { getDictionary, isLocale, fill, locales, type Locale } from "@/lib/dictionaries";
import {
  allPieces,
  formatPrice,
  pieceBySlug,
  relatedPieces,
  isMultiple,
  groupOf,
  groupBySlug,
} from "@/lib/catalog";
import { MRIRT, PRODUCT } from "@/lib/copy-v2";
import { displayName, labelFor, materialOf, originOf, pieceWords } from "@/lib/specs";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, pageMeta, pieceOg, productLd } from "@/lib/seo";
import { enLine, enLines, frLine, frLines } from "@/lib/product-fr";

/**
 * The client's product copy, in the reading language.
 *
 * Translation only, never authorship (§11): an untranslated line falls back to
 * the client's English rather than vanishing, so the page is always complete
 * and `scripts/check-fr.mjs` is what reports the gap. Product NAMES are
 * deliberately not translated — see the docblock in lib/product-fr.ts.
 */
const say = (locale: Locale, lines: string[]) =>
  locale === "fr" ? frLines(lines) : enLines(lines);

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
  const name = displayName(piece, locale as Locale);

  // The client's own first sentence where there is one. Where there is none,
  // the facts the label already shows — room, material, origin as the client
  // named it, price — and the uniqueness line. Never a generated description
  // of an object nobody described (CLAUDE.md §5). Translated too: this is the
  // sentence Google and WhatsApp print under the French page.
  const own = pieceWords(piece, locale as Locale).short ?? undefined;
  const first = piece.description[0];
  const facts = [
    materialOf(piece, locale),
    originOf(piece, locale),
    formatPrice(piece, locale),
  ].filter(Boolean);
  const description =
    own ??
    (first
      ? locale === "fr"
        ? frLine(first)
        : enLine(first)
      : `${name}. ${facts.join(" · ")}.`);

  return pageMeta({
    locale,
    path: `/piece/${slug}`,
    title: `${name} | The Roots Corner`,
    description,
    image: pieceOg(piece, name),
  });
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
  const name = displayName(piece, locale as Locale);
  const price = formatPrice(piece, locale);
  const room = t.categories.items[piece.category] ?? piece.category;
  // A rug suggests rugs only (client, 6 Oct) — MoreRugs below; a piece, pieces.
  const isRug = piece.category === "rugs";
  const related = isRug ? [] : relatedPieces(piece);
  const lang = locale as Locale;
  const words0 = pieceWords(piece, lang);
  const groupSlug = groupOf(piece);
  const group = groupSlug ? groupBySlug(groupSlug) : undefined;
  // French: the text the house edits in Shopify; English: lib/piece-copy.ts
  // (lib/specs.ts pieceWords). Failing both, the scraped description, split
  // the same way: first paragraph short, the rest "À propos".
  const ownWords = say(lang, piece.description);
  const shortText = words0.short ?? (ownWords[0] ?? null);
  const aboutText = words0.short ? words0.about : ownWords.slice(1);
  const fields = labelFor(piece, lang);

  // The slug, not a display string: contact resolves it back to the record and
  // can then show the photograph, the label and the price of what is being
  // asked about, and open the message with the piece's own number.
  const enquiry = `/${locale}/contact?piece=${piece.slug}`;

  /* A finished rug is shown the way a rug is chosen — benirugs.com's product
     page (components/RugProduct) — not the way an object is hung (client,
     6 Oct: "our rug product is identical to the articles"). */
  if (isRug) {
    const l = rugLabels(locale as Locale);
    const cartLabels = {
      add: t.cart.add,
      added: t.cart.added,
      view: t.cart.view,
      sold: t.common.sold,
      soldNote: t.piece.soldNote,
    };
    const sellable = piece.available && piece.price !== null;
    const action = !piece.available ? (
      <div className="piece-buy is-gone" role="status">
        <p className="piece-price display d-3 is-gone">{t.common.sold}</p>
        <p className="label piece-cta-note">{t.piece.soldNote}</p>
      </div>
    ) : sellable ? (
      <AddToCart slug={piece.slug} labels={cartLabels} price={price ?? undefined} />
    ) : (
      <Link href={enquiry} className="piece-buy-add label has-price rug-buy-ask">
        <span>{l.askBar}</span>
        <span className="piece-buy-price">{l.onRequest}</span>
      </Link>
    );
    const words = say(locale as Locale, piece.description);
    return (
      <>
        <JsonLd
          data={breadcrumbLd([
            { name: "The Roots Corner", path: `/${locale}` },
            { name: l.shopCrumb, path: `/${locale}/mrirt` },
            { name, path: `/${locale}/piece/${piece.slug}` },
          ])}
        />
        <RugProduct
          locale={locale as Locale}
          crumbs={[
            { label: l.shopCrumb, href: `/${locale}/mrirt` },
            { label: l.readyCrumb, href: `/${locale}/mrirt#disponibles` },
          ]}
          title={name}
          headPrice={!piece.available ? t.common.sold : sellable && price ? price : l.onRequest}
          line={
            pieceWords(piece, locale as Locale).short ??
            words.find((w) => !/^photos?\s+d[’']illustration\.?$/i.test(w.trim())) ??
            null
          }
          note={MRIRT.availableNote[locale as Locale]}
          images={piece.images.map((img) => ({
            src: img.src ?? `/pieces/${img.file}`,
            w: img.w,
            h: img.h,
            alt: name,
          }))}
          exclude={{ piece: piece.slug }}
          specs={
            labelFor(piece, locale as Locale).length > 0 ? (
              <PieceLabel piece={piece} locale={locale} labels={t.pieceLabel} variant="specs" />
            ) : null
          }
          order={
            <div className="rug-buy">
              <p className="piece-unique label">
                {t.selection.unique}
                {piece.available && (
                  <>
                    <span aria-hidden="true"> · </span>
                    {t.common.available}
                  </>
                )}
              </p>
              <div className="rug-buy-bar">{action}</div>
              <a href="#tissage" className="link label rug-buy-craft">
                {l.craftLink}
              </a>
            </div>
          }
        />
      </>
    );
  }

  return (
    <>
      <JsonLd
        data={productLd({
          piece,
          locale: locale as Locale,
          name,
          description: shortText ?? undefined,
          category: group ? group.name[lang] : room,
          material: materialOf(piece, locale as Locale),
          origin: originOf(piece, locale as Locale),
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "The Roots Corner", path: `/${locale}` },
          { name: t.nav.collection, path: `/${locale}/collection` },
          ...(group ? [{ name: group.name[lang], path: `/${locale}/collection/${group.slug}` }] : []),
          { name, path: `/${locale}/piece/${piece.slug}` },
        ])}
      />
      <article className="piece">
        <div className="shell piece-inner">
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

          {/* --- V2 §19, one template for every piece: name and price, the
               short description, then the facts in a fixed order (Origine,
               Région, Époque, Matière, Dimensions, Nature, État), each only
               where it is known. À propos, Entretien and Livraison & retours
               follow below the photographs. --- */}
          <div className="piece-label-column">
            <Reveal className="piece-label-sticky">
              <p className="label piece-accession">
                {fill(PRODUCT.pieceNo[lang], { n: String(piece.index).padStart(3, "0") })}
                {group && (
                  <>
                    <span aria-hidden="true"> · </span>
                    <Link href={`/${locale}/collection/${group.slug}`} className="link">
                      {group.name[lang]}
                    </Link>
                  </>
                )}
              </p>

              <h1 className="display d-2 piece-name">{name}</h1>

              <div className="piece-action">
                {!piece.available ? (
                  <>
                    <p className="piece-price display d-3 is-gone">{t.common.sold}</p>
                    <p className="label piece-cta-note">{t.piece.soldNote}</p>
                  </>
                ) : piece.price !== null ? (
                  <>
                    <PieceBuy
                      slug={piece.slug}
                      locale={locale}
                      price={price}
                      unit={isMultiple(piece) ? t.pieceLabel.perPiece : null}
                      options={piece.options}
                      sizeLabel={PRODUCT.size[lang]}
                      labels={{
                        add: t.cart.add,
                        added: t.cart.added,
                        view: t.cart.view,
                        sold: t.common.sold,
                        soldNote: t.piece.soldNote,
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
              </div>

              {shortText && <p className="piece-short">{shortText}</p>}

              {fields.length > 0 && (
                <dl className="piece-facts">
                  {fields.map((f) => (
                    <div key={f.key} className="piece-fact">
                      <dt className="label">
                        {PRODUCT.fields[f.key as keyof typeof PRODUCT.fields]?.[lang] ?? f.key}
                      </dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </Reveal>
          </div>
        </div>

        <div className="shell piece-words piece-words-v2">
          {aboutText.length > 0 && (
            <Reveal className="piece-block">
              <h2 className="label piece-block-key">{PRODUCT.about[lang]}</h2>
              <div className="prose piece-prose">
                {aboutText.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </Reveal>
          )}

          {piece.care.length > 0 && (
            <Reveal delay={60} className="piece-block">
              <h2 className="label piece-block-key">{PRODUCT.care[lang]}</h2>
              <ul className="piece-spec-list">
                {say(lang, piece.care).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal delay={120} className="piece-block">
            <h2 className="label piece-block-key">{PRODUCT.shipping[lang]}</h2>
            <div className="prose piece-prose">
              <p>{PRODUCT.shippingBody[lang]}</p>
              <p>{PRODUCT.returnsBody[lang]}</p>
            </div>
            <p className="piece-block-links">
              <Link href={enquiry} className="link label">
                {PRODUCT.quote[lang]}
              </Link>
              <Link href={`/${locale}/legal/delivery`} className="link label">
                {PRODUCT.deliveryLink[lang]}
              </Link>
              <Link href={`/${locale}/legal/withdrawal`} className="link label">
                {PRODUCT.policyLink[lang]}
              </Link>
            </p>
          </Reveal>
        </div>
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
                      locale={locale as Locale}
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

      {isRug ? (
        <MoreRugs
          locale={locale as Locale}
          heading={t.piece.more}
          excludePiece={piece.slug}
          labels={{
            from: locale === "fr" ? "À partir de" : "From",
            onRequest: locale === "fr" ? "Prix sur demande" : "Price on request",
            rugName: locale === "fr" ? "Tapis Mrirt" : "Mrirt rug",
          }}
        />
      ) : (
        <ClosingBand
          locale={locale as Locale}
          t={t.closing}
          labels={t.pieceLabel}
          exclude={[piece.slug, ...related.map((other) => other.slug)]}
        />
      )}
    </>
  );
}
