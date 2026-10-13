import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import RugBrowser from "@/components/RugBrowser";
import { getDictionary, type Locale } from "@/lib/dictionaries";
import { MRIRT } from "@/lib/copy-v2";
import { rugLabels } from "@/lib/rug-labels";
import { RUG_TYPES, RUGS_NAME, type RugType } from "@/lib/rug-types";
import { rugWall } from "@/lib/rug-wall";
import { breadcrumbLd } from "@/lib/seo";

const COPY = {
  others: { fr: "Les autres tapis", en: "Other rugs" },
  empty: {
    fr: "Pas encore de tapis de ce type en ligne.",
    en: "No rugs of this kind online yet.",
  },
  all: { fr: "Voir tous les tapis", en: "See all rugs" },
  write: { fr: "Nous écrire", en: "Write to us" },
} as const;

/**
 * One kind of Berber rug (V5, 14 Oct): its name, then its rugs on the same
 * wall as /mrirt, then the way into the other kinds — the shape of a
 * collection category page.
 *
 * Nothing is written about the kind itself: the house has not, and a line
 * about where Azilal rugs come from would be authored here, not sourced (§5).
 * A kind with no rug yet says so plainly and offers the two ways on.
 */
export default function RugTypeView({ locale, type }: { locale: Locale; type: RugType }) {
  const wall = rugWall(locale, type.slug);
  const rl = rugLabels(locale);
  const entries = getDictionary(locale).mrirtPage.entries;
  const others = RUG_TYPES.filter((o) => o.slug !== type.slug);
  const madeToOrder = wall.tiles.some((tile) => tile.kind === "order");

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "The Roots Corner", path: `/${locale}` },
          { name: RUGS_NAME[locale], path: `/${locale}/mrirt` },
          { name: type.name[locale], path: `/${locale}/tapis/${type.slug}` },
        ])}
      />
      <section className="collection-head shell">
        <Reveal>
          <Link href={`/${locale}/mrirt`} className="link label collection-back">
            {RUGS_NAME[locale]}
          </Link>
          <h1 className="display d-1 collection-title">{type.name[locale]}</h1>
        </Reveal>
      </section>

      <section className="section rugs-shop rugs-kind">
        <div className="shell">
          {wall.tiles.length > 0 ? (
            <>
              {madeToOrder && <p className="mrirt-variations">{MRIRT.variationsNote[locale]}</p>}
              <RugBrowser
                tiles={wall.tiles}
                collections={wall.collections}
                // The made-to-measure form is the Mrirt cooperative's, on /mrirt.
                labels={type.slug === "mrirt" ? rl.browser : { ...rl.browser, custom: undefined }}
                customHref={`/${locale}/mrirt#sur-mesure`}
                notes={{
                  ready: entries[0].note,
                  order: entries[1].note,
                  collections: wall.collectionNotes,
                }}
              />
            </>
          ) : (
            <Reveal className="rugs-kind-empty">
              <p className="prose">{COPY.empty[locale]}</p>
              <p className="rugs-kind-ways">
                <Link href={`/${locale}/mrirt`} className="link label">
                  {COPY.all[locale]}
                </Link>
                <Link href={`/${locale}/contact`} className="link label">
                  {COPY.write[locale]}
                </Link>
              </p>
            </Reveal>
          )}

          <Reveal className="room-rail">
            <p className="label room-rail-key">{COPY.others[locale]}</p>
            <ul className="room-rail-list">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/${locale}/tapis/${o.slug}`} className="link display d-3 room-rail-link">
                    {o.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
