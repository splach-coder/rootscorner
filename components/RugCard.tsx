import Image from "next/image";
import Link from "next/link";
import { fromPrice, formatEuro, type RugSeries } from "@/lib/rugs";
import { swatchFor } from "@/lib/rug-options";

/**
 * A Mrirt series in the rug collection — the same card as the shop's pieces
 * (PieceCard): the image, the name, the price, nothing else.
 *
 * Until the house adds a photograph to the series in Shopify, the card shows
 * its colourways as a woven plate: broad bands of the wool colours, which is
 * what the series actually offers. A photograph of another rug in its place
 * would show a rug this series is not (§5).
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
  const bands = series.colours.flatMap((c) => swatchFor(c.name, null) ?? []);
  const n = series.colours.length;

  return (
    <li className="card rug-card">
      <Link href={`/${locale}/tapis/${series.handle}`} className="card-link">
        <div className="frame card-frame">
          {image ? (
            <Image src={image.src} alt={image.alt ?? series.title} width={image.w} height={image.h} sizes="(max-width: 640px) 50vw, 25vw" />
          ) : (
            <div className="rug-plate" aria-hidden="true">
              {bands.map((bg, i) => (
                <span key={i} style={{ background: bg }} />
              ))}
            </div>
          )}
        </div>
        <div className="card-said">
          <p className="label card-room">
            {n} {n === 1 ? labels.colourwaysOne : labels.colourways}
          </p>
          <div className="wall-label wall-label-sell">
            <h3 className="display d-3 wall-label-name">{series.title}</h3>
            <p className="wall-label-price">
              {from !== null ? `${labels.from} ${formatEuro(from, locale)}` : labels.onRequest}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
}
