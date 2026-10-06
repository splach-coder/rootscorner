import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { formatPrice, readyRugs, type Piece } from "@/lib/catalog";
import { allRugSeries, formatEuro, fromPrice, seriesTitle, type RugSeries } from "@/lib/rugs";
import type { Locale } from "@/lib/dictionaries";

type Item = { key: string; href: string; src: string; w: number; h: number; name: string; price: string };

/**
 * "Continue looking" on a rug's page — rugs only (client, 6 Oct: from a rug,
 * the site suggests rugs, never a stool or a pot).
 *
 * The other rugs already woven, then the collections woven to order, minus the
 * one being looked at. Same `.hang` as the pieces' band, so it is the site's
 * one way of saying "here are three more".
 */
export default function MoreRugs({
  locale,
  heading,
  excludePiece,
  excludeSeries,
  labels,
  layout = "hang",
}: {
  /** "cards" — benirugs.com's "More from…": equal tiles, name and figure on
      one line, the material under them. Used by the rug product page. */
  layout?: "hang" | "cards";
  locale: Locale;
  heading: string;
  excludePiece?: string;
  excludeSeries?: string;
  labels: { from: string; onRequest: string; rugName: string; line?: string };
}) {
  const fromPiece = (p: Piece): Item | null => {
    const img = p.images[0];
    if (!img) return null;
    return {
      key: p.slug,
      href: `/${locale}/piece/${p.slug}`,
      src: img.src ?? `/pieces/${img.file}`,
      w: img.w,
      h: img.h,
      name: p.name,
      price: formatPrice(p, locale) ?? labels.onRequest,
    };
  };
  const fromSeries = (s: RugSeries): Item | null => {
    const img = s.images[0];
    if (!img) return null;
    const from = fromPrice(s);
    return {
      key: s.handle,
      href: `/${locale}/tapis/${s.handle}`,
      src: img.src,
      w: img.w,
      h: img.h,
      name: `${labels.rugName} ${seriesTitle(s, locale)}`,
      price: from !== null ? `${labels.from} ${formatEuro(from, locale)}` : labels.onRequest,
    };
  };

  const ready = readyRugs().filter((p) => p.slug !== excludePiece).map(fromPiece);
  const series = allRugSeries().filter((s) => s.handle !== excludeSeries).map(fromSeries);
  // From a finished rug: the other finished ones first. From a collection: the
  // other collections first.
  const ordered = excludeSeries ? [...series, ...ready] : [...ready, ...series];
  const items = ordered.filter((x): x is Item => x !== null).slice(0, 3);
  if (items.length === 0) return null;

  if (layout === "cards") {
    return (
      <section className="rugp-more">
        <h2 className="display d-1 rugp-h">{heading}</h2>
        <ul className="rugp-more-list">
          {items.map((it) => (
            <li key={it.key} className="rugp-more-item">
              <Link href={it.href} className="rugp-more-link">
                <span className="rugp-more-plate">
                  <Image src={it.src} alt={it.name} width={it.w} height={it.h} sizes="(max-width: 700px) 84vw, 32vw" />
                </span>
                <span className="rugp-more-said">
                  <span className="display d-3 rugp-more-name">{it.name}</span>
                  <span className="rugp-more-price">{it.price}</span>
                </span>
                {labels.line && <span className="rugp-more-line">{labels.line}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="section piece-more">
      <div className="shell">
        <Reveal>
          <p className="label">{heading}</p>
        </Reveal>
        <ul className="hang">
          {items.map((it, i) => (
            <li key={it.key} className={`hang-item hang-${i + 1}`}>
              <Link href={it.href} className="hang-link">
                <Reveal variant="frame" delay={i * 100} className="frame rug-more-frame">
                  <Image src={it.src} alt={it.name} width={it.w} height={it.h} sizes="(max-width: 700px) 84vw, 30vw" />
                </Reveal>
                <Reveal delay={i * 100 + 80} className="hang-caption">
                  <div className="wall-label wall-label-sell">
                    <h3 className="display d-3 wall-label-name">{it.name}</h3>
                    <p className="wall-label-price">{it.price}</p>
                  </div>
                </Reveal>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
