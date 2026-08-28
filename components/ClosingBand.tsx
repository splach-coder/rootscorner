import Link from "next/link";
import Reveal from "./Reveal";
import PieceFrame from "./PieceFrame";
import PieceLabel from "./PieceLabel";
import { closingBand } from "@/lib/catalog";
import type { Locale } from "@/lib/dictionaries";

type ClosingBandProps = {
  locale: Locale;
  t: { eyebrow: string; heading: string; cta: string };
  labels: { material: string; origin: string; dimensions: string };
  /** Slugs already shown on this page, so nothing appears twice on one screen. */
  exclude?: string[];
};

/**
 * What is still here, at the foot of a page.
 *
 * This is the hang — three pieces at three different heights, the composition
 * the homepage opens with and the piece page closes with under "Continue
 * looking". It has been three other things: gapless full-bleed panes (which
 * existed to hide the sundown, CLAUDE.md §29), then a shelf of objects standing
 * on a rule. The client picked the hang, and picking one composition for both
 * places is the right call regardless — a visitor meets "more pieces" twice on
 * a piece page, and meeting it in two different layouts reads as two different
 * sites.
 *
 * So there is now exactly one way this site says "here are three more": works
 * hung at three heights, name and price beneath. Both call sites use it.
 */
export default function ClosingBand({
  locale,
  t,
  labels,
  exclude = [],
}: ClosingBandProps) {
  const band = closingBand(exclude, 3);
  if (band.length === 0) return null;

  return (
    <section className="section closing">
      <div className="shell">
        <Reveal className="closing-head">
          <div>
            <p className="label">{t.eyebrow}</p>
            <h2 className="display d-1 closing-heading">{t.heading}</h2>
          </div>
          <Link href={`/${locale}/collection`} className="link label closing-cta">
            {t.cta}
          </Link>
        </Reveal>

        <ul className="hang">
          {band.map(({ piece }, i) => (
            <li key={piece.slug} className={`hang-item hang-${i + 1}`}>
              <Link
                href={`/${locale}/piece/${piece.slug}`}
                className="hang-link swap-host"
              >
                <PieceFrame
                  piece={piece}
                  delay={i * 100}
                  width={piece.images[0]?.w ?? 1400}
                  height={piece.images[0]?.h ?? 2100}
                  sizes="(max-width: 700px) 84vw, 30vw"
                />
                <Reveal delay={i * 100 + 80} className="hang-caption">
                  <PieceLabel
                    piece={piece}
                    locale={locale}
                    labels={labels}
                    variant="sell"
                  />
                </Reveal>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
