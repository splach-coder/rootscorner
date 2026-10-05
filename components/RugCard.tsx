import Image from "next/image";
import Link from "next/link";
import { fromPrice, formatEuro, seriesLine, seriesTitle, type RugSeries } from "@/lib/rugs";

/**
 * A Mrirt series in the rug collection — the same card as the shop's pieces
 * (PieceCard): the image, the name, the price, nothing else.
 *
 * The photograph is the series' first image in Shopify.
 */
export default function RugCard({
  series,
  locale,
  labels,
}: {
  series: RugSeries;
  locale: string;
  labels: { from: string; onRequest: string; colourways: string; colourwaysOne: string };
}) {
  const image = series.images[0];
  const from = fromPrice(series);
  const title = seriesTitle(series, locale);
  const line = seriesLine(series, locale);

  return (
    <li className="card rug-card">
      <Link href={`/${locale}/tapis/${series.handle}`} className="card-link">
        <div className="frame card-frame">
          {image && (
            <Image src={image.src} alt={`${locale === "fr" ? "Tapis Mrirt" : "Mrirt rug"} ${title}`} width={image.w} height={image.h} sizes="(max-width: 640px) 50vw, 25vw" />
          )}
        </div>
        <div className="card-said">
          {/* V1 §8: the collection's own line, not "3 colours". */}
          <div className="wall-label wall-label-sell">
            <h3 className="display d-3 wall-label-name">{title}</h3>
            {line && <p className="rug-card-line">{line}</p>}
            <p className="wall-label-price">
              {from !== null ? `${labels.from} ${formatEuro(from, locale)}` : labels.onRequest}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
}
