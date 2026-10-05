import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PieceGallery from "@/components/PieceGallery";
import type { PieceImage } from "@/lib/catalog";
import RugBuy from "@/components/RugBuy";
import JsonLd from "@/components/JsonLd";
import { fill, getDictionary, isLocale, locales, type Locale } from "@/lib/dictionaries";
import { allRugSeries, colourName, fromPrice, rugSeriesByHandle, seriesLine, seriesTitle } from "@/lib/rugs";
import { rugLabels } from "@/lib/rug-labels";
import { swatchFor } from "@/lib/rug-options";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return locales.flatMap((locale) => allRugSeries().map((s) => ({ locale, handle: s.handle })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<Metadata> {
  const { locale, handle } = await params;
  const series = rugSeriesByHandle(handle);
  if (!isLocale(locale) || !series) return {};
  const l = rugLabels(locale);
  const image = series.images[0];
  const title = seriesTitle(series, locale);
  return pageMeta({
    locale,
    path: `/tapis/${handle}`,
    title: `${l.rugName} ${title} | The Roots Corner`,
    description: seriesLine(series, locale) ?? `${l.rugName} ${title}. ${l.collectionNote}`,
    ...(image ? { image: { url: image.src, width: image.w, height: image.h } } : {}),
  });
}

/**
 * A Mrirt collection — built on the piece page itself.
 *
 * Client, 5 Oct: the rugs "looked like a different site". So this is the piece
 * page's gallery, label column and words, with benirugs.com's two closed
 * pickers (colour, size) where a piece has none — the house's own reference.
 */
export default async function RugSeriesPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { locale, handle } = await params;
  const series = rugSeriesByHandle(handle);
  if (!isLocale(locale) || !series) notFound();
  const t = getDictionary(locale as Locale);
  const l = rugLabels(locale as Locale);
  const swatches = Object.fromEntries(series.colours.map((c) => [c.name, swatchFor(c.name, c.image)]));
  const from = fromPrice(series);
  const title = seriesTitle(series, locale);
  const line = seriesLine(series, locale);
  const colourLabels = Object.fromEntries(series.colours.map((c) => [c.name, colourName(c.name, locale)]));
  // The gallery takes the piece shape; a series' photographs live on Shopify.
  const images: PieceImage[] = series.images.map((i) => ({ file: i.src, original: i.src, src: i.src, w: i.w, h: i.h }));

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "The Roots Corner", path: `/${locale}` },
          { name: l.collectionEyebrow, path: `/${locale}/mrirt` },
          { name: title, path: `/${locale}/tapis/${handle}` },
        ])}
      />
      {from !== null && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${l.rugName} ${title}`,
            url: `${SITE_URL}/${locale}/tapis/${handle}`,
            ...(series.images[0] ? { image: series.images.map((i) => i.src) } : {}),
            brand: { "@type": "Brand", name: "The Roots Corner" },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "EUR",
              lowPrice: from.toFixed(2),
              offerCount: series.variants.filter((v) => v.price > 0).length,
            },
          }}
        />
      )}

      {/* The piece page's own structure — gallery, label column, the words
          below — so a rug is met exactly the way every piece is (client,
          5 Oct: the rugs looked like a different site). */}
      <article className="piece rug-piece">
        <div className="shell piece-inner">
          <div className="piece-gallery-column">
            <PieceGallery
              images={images}
              name={`${l.rugName} ${title}`}
              countLabel={fill(images.length === 1 ? t.piece.photographsOne : t.piece.photographs, {
                n: images.length,
              })}
              railLabel={t.piece.photographsRail}
              zoomLabels={t.piece.zoom}
            />
          </div>

          <div className="piece-label-column">
            <Reveal className="piece-label-sticky">
              <p className="label piece-accession">
                <Link href={`/${locale}/mrirt`} className="link">
                  {t.nav.rugs}
                </Link>
                <span aria-hidden="true"> · </span>
                <Link href={`/${locale}/mrirt#sur-commande`} className="link">
                  {l.collectionEyebrow}
                </Link>
              </p>

              <h1 className="display d-2 piece-name">{title}</h1>
              {line && <p className="prose rug-piece-line">{line}</p>}

              {/* The same label schema as a piece: what it is made of, where,
                  and how — all from the house's own Mrirt copy. */}
              <div className="wall-label wall-label-schema">
                <dl className="wall-label-specs">
                  <div className="wall-label-row">
                    <dt className="label wall-label-key">{t.pieceLabel.material}</dt>
                    <dd className="wall-label-value">{t.mrirtPage.rug.material}</dd>
                  </div>
                  <div className="wall-label-row">
                    <dt className="label wall-label-key">{t.pieceLabel.origin}</dt>
                    <dd className="wall-label-value">{t.mrirtPage.rug.origin}</dd>
                  </div>
                  <div className="wall-label-row">
                    <dt className="label wall-label-key">{t.mrirtPage.rug.madeKey}</dt>
                    <dd className="wall-label-value">{t.mrirtPage.rug.made}</dd>
                  </div>
                </dl>
              </div>

              <RugBuy
                series={series}
                swatches={swatches}
                colourLabels={colourLabels}
                locale={locale}
                labels={{
                  colour: l.colour,
                  size: l.size,
                  from: l.from,
                  onRequest: l.onRequest,
                  onRequestNote: l.onRequestNote,
                  ask: l.ask,
                  madeToOrder: l.madeToOrder,
                  cart: {
                    add: t.cart.add,
                    added: t.cart.added,
                    view: t.cart.view,
                    sold: t.common.sold,
                    soldNote: t.piece.soldNote,
                  },
                }}
              />

              <dl className="piece-delivery">
                <dt className="label">{l.shipping}</dt>
                <dd>{l.shippingBody}</dd>
                <dd className="label piece-delivery-note">
                  <Link href={`/${locale}/mrirt#sur-mesure`} className="link">
                    {l.custom}
                  </Link>
                </dd>
              </dl>
            </Reveal>
          </div>
        </div>

        {/* The words, under a hairline — as on a piece page. */}
        <div className="shell piece-words">
          <Reveal className="piece-story">
            <p className="label">{l.craft}</p>
            <div className="prose piece-prose">
              <p className="lede">{t.rugs.body[0]}</p>
              <p>{t.rugs.body[1]}</p>
            </div>
          </Reveal>
          <Reveal delay={80} className="piece-specs">
            <div className="piece-spec-block">
              <p className="label">{l.material}</p>
              <ul className="piece-spec-list">
                <li>{l.materialBody}</li>
                <li>{t.rugs.wool}</li>
              </ul>
            </div>
            <div className="piece-spec-block">
              <p className="label">{l.custom}</p>
              <ul className="piece-spec-list">
                <li>{l.customBody}</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </article>
{/* No pieces here: the rug pages show rugs only (client, 5 Oct). */}
    </>
  );
}
