import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RUG_DEMO } from "@/lib/catalog";
import RugBuy from "@/components/RugBuy";
import RugProduct from "@/components/RugProduct";
import JsonLd from "@/components/JsonLd";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/dictionaries";
import { allRugSeries, colourName, fromPrice, isIllustrativeSeries, rugSeriesByHandle, seriesLine, seriesRugType, seriesTitle } from "@/lib/rugs";
import { rugLabels } from "@/lib/rug-labels";
import { swatchFor } from "@/lib/rug-options";
import { breadcrumbLd, clip, hasOg, og, pageMeta } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { formatEuro } from "@/lib/rugs";
import { MRIRT } from "@/lib/copy-v2";
import RugTypeView from "@/components/RugTypeView";
import { RUG_TYPES, RUGS_NAME, rugTypeBySlug } from "@/lib/rug-types";
import { rugWall } from "@/lib/rug-wall";

export function generateStaticParams() {
  // V5: the kinds of rug (/tapis/azilal …) share this segment with the series.
  return locales.flatMap((locale) => [
    ...RUG_TYPES.map((k) => ({ locale, handle: k.slug })),
    ...allRugSeries().map((s) => ({ locale, handle: s.handle })),
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<Metadata> {
  const { locale, handle } = await params;
  const kind = rugTypeBySlug(handle);
  if (isLocale(locale) && kind) {
    const n = rugWall(locale, kind.slug).tiles.length;
    return pageMeta({
      locale,
      path: `/tapis/${kind.slug}`,
      title: `${kind.name[locale]} | The Roots Corner`,
      description:
        locale === "fr"
          ? `${kind.name[locale]} : les tapis berbères de ce type chez The Roots Corner, à Marrakech.`
          : `${kind.name[locale]}: the Berber rugs of this kind at The Roots Corner, Marrakech.`,
      image: og(`${locale}/mrirt.jpg`),
      // A kind with nothing in it is not a page to send anyone to from a search.
      index: !RUG_DEMO && n > 0,
    });
  }
  const series = rugSeriesByHandle(handle);
  if (!isLocale(locale) || !series) return {};
  const l = rugLabels(locale);
  const image = series.images[0];
  const title = seriesTitle(series, locale);
  return pageMeta({
    locale,
    path: `/tapis/${handle}`,
    title: `${l.rugName} ${title} | The Roots Corner`,
    // The collection's own line, then what every Mrirt rug is (both already on the site).
    description: clip(
      `${l.rugName} ${title}. ${seriesLine(series, locale) ?? l.collectionNote} ${
        locale === "fr"
          ? "Tissé à la main sur commande par une coopérative de femmes à Mrirt, dans le Moyen Atlas."
          : "Handwoven to order by a women’s cooperative in Mrirt, in the Middle Atlas."
      }`,
    ),
    // A JPEG built for the preview, never the raw Shopify file (4 MB PNGs
    // that WhatsApp drops): see scripts/og-images.mjs.
    image: hasOg(`${locale}/tapis/${handle}.jpg`) ? og(`${locale}/tapis/${handle}.jpg`) : og(`${locale}/mrirt.jpg`),
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
  const kind = rugTypeBySlug(handle);
  if (isLocale(locale) && kind) return <RugTypeView locale={locale as Locale} type={kind} />;
  const series = rugSeriesByHandle(handle);
  if (!isLocale(locale) || !series) notFound();
  const t = getDictionary(locale as Locale);
  const l = rugLabels(locale as Locale);
  const swatches = Object.fromEntries(series.colours.map((c) => [c.name, swatchFor(c.name, c.image)]));
  const from = fromPrice(series);
  const title = seriesTitle(series, locale);
  const line = seriesLine(series, locale);
  const seriesKind = rugTypeBySlug(seriesRugType(series));
  const colourLabels = Object.fromEntries(series.colours.map((c) => [c.name, colourName(c.name, locale)]));

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "The Roots Corner", path: `/${locale}` },
          { name: RUGS_NAME[locale as Locale], path: `/${locale}/mrirt` },
          ...(seriesKind ? [{ name: seriesKind.name[locale as Locale], path: `/${locale}/tapis/${seriesKind.slug}` }] : []),
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
          ...(seriesKind
            ? [{ label: seriesKind.name[locale as Locale], href: `/${locale}/tapis/${seriesKind.slug}` }]
            : [{ label: l.collectionEyebrow, href: `/${locale}/mrirt#sur-commande` }]),
        ]}
        title={title}
        headPrice={from !== null ? `${l.from} ${formatEuro(from, locale)}` : l.onRequest}
        line={line}
        note={MRIRT.orderNote[locale as Locale]}
        images={series.images.map((i) => ({ src: i.src, w: i.w, h: i.h, alt: `${l.rugName} ${title}` }))}
        exclude={{ series: series.handle }}
        order={
          <RugBuy
            seriesLabel={title}
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
