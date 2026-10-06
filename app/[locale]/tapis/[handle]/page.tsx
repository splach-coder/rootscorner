import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RUG_DEMO } from "@/lib/catalog";
import RugBuy from "@/components/RugBuy";
import RugProduct from "@/components/RugProduct";
import JsonLd from "@/components/JsonLd";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/dictionaries";
import { allRugSeries, colourName, fromPrice, isIllustrativeSeries, rugSeriesByHandle, seriesLine, seriesTitle } from "@/lib/rugs";
import { rugLabels } from "@/lib/rug-labels";
import { swatchFor } from "@/lib/rug-options";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { formatEuro } from "@/lib/rugs";

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
    index: !RUG_DEMO,
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

      <RugProduct
        locale={locale as Locale}
        crumbs={[
          { label: l.shopCrumb, href: `/${locale}/mrirt` },
          { label: l.collectionEyebrow, href: `/${locale}/mrirt#sur-commande` },
        ]}
        title={title}
        headPrice={from !== null ? `${l.from} ${formatEuro(from, locale)}` : l.onRequest}
        line={line}
        note={isIllustrativeSeries(series) ? l.illustration : null}
        images={series.images.map((i) => ({ src: i.src, w: i.w, h: i.h, alt: `${l.rugName} ${title}` }))}
        exclude={{ series: series.handle }}
        order={
          <RugBuy
            demo={isIllustrativeSeries(series)}
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
              demoAsk: l.demoAsk,
              askBar: l.askBar,
              leadNote: l.leadNote,
              craftLink: l.craftLink,
              dockName: `${l.rugName} ${title}`,
              dockEdit: l.dockEdit,
              cart: {
                add: t.cart.add,
                added: t.cart.added,
                view: t.cart.view,
                sold: t.common.sold,
                soldNote: t.piece.soldNote,
              },
            }}
          />
        }
      />
    </>
  );
}
