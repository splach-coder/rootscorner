import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import RugBuy from "@/components/RugBuy";
import JsonLd from "@/components/JsonLd";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/dictionaries";
import { allRugSeries, fromPrice, rugSeriesByHandle } from "@/lib/rugs";
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
  return pageMeta({
    locale,
    path: `/tapis/${handle}`,
    title: `${l.collectionEyebrow} ${series.title} — The Roots Corner`,
    description: series.description || `${l.collectionEyebrow} ${series.title}. ${l.collectionNote}`,
    ...(image ? { image: { url: image.src, width: image.w, height: image.h } } : {}),
  });
}

/**
 * A Mrirt series — benirugs.com's product page, in this site's language.
 *
 * The photographs on the left (the series' images in Shopify), the order panel on the
 * right — colour, size, the price of that pair, one bar to add it — then the
 * weaving, the delivery, and the way to ask for anything the list lacks.
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

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "The Roots Corner", path: `/${locale}` },
          { name: l.collectionEyebrow, path: `/${locale}/mrirt` },
          { name: series.title, path: `/${locale}/tapis/${handle}` },
        ])}
      />
      {from !== null && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${l.collectionEyebrow} ${series.title}`,
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

      <article className="rug-page">
        <div className="shell rug-page-inner">
          <div className="rug-page-media">
            {series.images.map((img, i) => (
              <Reveal key={img.src} variant="frame" delay={i * 60} className="frame rug-page-frame">
                <Image
                  src={img.src}
                  alt={img.alt ?? `${l.collectionEyebrow} ${series.title}`}
                  width={img.w}
                  height={img.h}
                  priority={i === 0}
                  sizes="(max-width: 939px) 100vw, 55vw"
                />
              </Reveal>
            ))}
          </div>

          <div className="rug-page-panel">
            <Reveal>
              <p className="label">
                <Link href={`/${locale}/mrirt`} className="link">
                  {l.collectionEyebrow}
                </Link>
              </p>
              <h1 className="display d-1 rug-page-title">{series.title}</h1>
              {series.description && <p className="prose rug-page-lede">{series.description}</p>}
            </Reveal>

            <Reveal delay={90}>
              <RugBuy
                series={series}
                swatches={swatches}
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
            </Reveal>

            <Reveal delay={150} className="rug-page-details">
              <details>
                <summary className="label">{l.craft}</summary>
                <p className="prose">{t.rugs.body[0]}</p>
                <p className="prose">{t.rugs.body[1]}</p>
              </details>
              <details>
                <summary className="label">{l.shipping}</summary>
                <p className="prose">{l.shippingBody}</p>
              </details>
              <details>
                <summary className="label">{l.custom}</summary>
                <p className="prose">{l.customBody}</p>
                <Link href={`/${locale}/mrirt#comment`} className="link label">
                  {l.customCta}
                </Link>
              </details>
            </Reveal>
          </div>
        </div>
      </article>
    </>
  );
}
