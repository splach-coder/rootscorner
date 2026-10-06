import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "./Reveal";
import MoreRugs from "./MoreRugs";
import RugGallery from "./RugGallery";
import { RUG_SHOTS } from "@/lib/catalog";
import { getDictionary, type Locale } from "@/lib/dictionaries";
import { rugLabels } from "@/lib/rug-labels";
import { rugFaq } from "@/lib/rug-faq";
import { whatsappHref } from "@/lib/site";

/** The house's own photographs of its rugs in rooms. */
const REEL = [
  { src: "/rugs/series/floor-fire.jpg", w: 1600, h: 2400 },
  { src: "/rugs/interior-fire.jpg", w: 1800, h: 2700 },
  { src: "/rugs/series/floor-shelves.jpg", w: 1600, h: 2400 },
  { src: "/rugs/mrirt-room.jpg", w: 1206, h: 1889 },
];

export type RugImage = { src: string; w: number; h: number; alt: string };

/**
 * A rug's page — benirugs.com's product page, structure for structure, in
 * this house's palette and type (client, 6 Oct: "our rug product is identical
 * to the articles, we don't want that"). The piece pages hang an object beside
 * its label; a rug is chosen, so it gets the shape of a page you order from:
 *
 *   1. The order panel on the LEFT, narrow — breadcrumb, the name with the
 *      figure beside it, one line, the choices, one filled bar, the weaving
 *      link, the lead time, three folds. The photographs on the RIGHT, large,
 *      on the tile ground the rug wall uses.
 *   2. "Les détails" — four short facts, each with one photograph.
 *   3. A ruled box that offers help, and nothing else.
 *   4. One room, full width.
 *   5. How it is made: a photograph and the cooperative, side by side.
 *   6. More rugs — the other collections and the rugs already woven.
 *
 * Plus the bar that docks at the foot of the screen once the panel has gone
 * (RugDock). Every sentence is the house's own copy or the FAQ's
 * (lib/rug-faq.ts); the photographs beside the facts are the house's own rug
 * photographs, never a street photograph tied to a claim about wool (§51).
 */
export default function RugProduct({
  locale,
  crumbs,
  title,
  headPrice,
  line,
  note,
  images,
  specs,
  order,
  exclude,
}: {
  locale: Locale;
  crumbs: { label: string; href: string }[];
  title: string;
  headPrice: string;
  line?: string | null;
  note?: string | null;
  images: RugImage[];
  specs?: ReactNode;
  order: ReactNode;
  exclude: { piece?: string; series?: string };
}) {
  const t = getDictionary(locale);
  const l = rugLabels(locale);
  const faq = Object.fromEntries(rugFaq(locale).map((r) => [r.key, r.a]));
  const wa = whatsappHref(title);
  const help = wa ?? `/${locale}/mrirt#sur-mesure`;

  const details: { key: string; title: string; body: string; src: string; w: number; h: number }[] = [
    {
      key: "unique",
      title: l.details.unique,
      body: faq.variations,
      src: (images[1] ?? images[0])?.src ?? RUG_SHOTS.pile,
      w: (images[1] ?? images[0])?.w ?? 784,
      h: (images[1] ?? images[0])?.h ?? 784,
    },
    { key: "wool", title: l.details.wool, body: t.rugs.wool, src: RUG_SHOTS.pile, w: 784, h: 784 },
    { key: "weaving", title: l.details.weaving, body: t.rugs.body[0], src: RUG_SHOTS.rug, w: 1800, h: 3200 },
    { key: "custom", title: l.details.custom, body: faq.choose, src: RUG_SHOTS.room, w: 1206, h: 1889 },
  ];

  return (
    <>
      <article className="rugp">
        {/* --- 1. Panel left, photographs right. --- */}
        <div className="rugp-top">
          <div className="rugp-panel" id="rug-order">
            <div className="rugp-panel-inner">
              <p className="label rugp-crumbs">
                {crumbs.map((c, i) => (
                  <span key={c.href}>
                    {i > 0 && <span className="rugp-crumb-sep" aria-hidden="true"> | </span>}
                    <Link href={c.href} className="rugp-crumb">
                      {c.label}
                    </Link>
                  </span>
                ))}
              </p>

              <div className="rug-head">
                <h1 className="display d-2 piece-name">{title}</h1>
                <p className="display d-3 rug-head-price">{headPrice}</p>
              </div>
              {line && <p className="rugp-line">{line}</p>}
              {note && <p className="label rug-demo-note">{note}</p>}

              {specs}

              {order}

              <div className="rug-lead">
                <p className="label rug-lead-key">{l.leadKey}</p>
                <p className="rug-lead-body">{l.leadBody}</p>
              </div>
              <div className="rug-folds">
                <details className="piece-fold">
                  <summary className="label">{l.variationsKey}</summary>
                  <p>{faq.variations}</p>
                </details>
                <details className="piece-fold">
                  <summary className="label">{l.helpKey}</summary>
                  <p>{l.helpBody}</p>
                  <p className="rug-fold-links">
                    {wa && (
                      <a href={wa} className="label rug-btn rug-btn-fill" target="_blank" rel="noreferrer noopener">
                        {l.helpWhatsapp}
                      </a>
                    )}
                    <Link href={`/${locale}/mrirt#sur-mesure`} className="label rug-btn">
                      {l.helpForm}
                    </Link>
                  </p>
                </details>
                <details className="piece-fold">
                  <summary className="label">{l.returnsKey}</summary>
                  <p>{faq.returns}</p>
                  <p>{l.shippingBody}</p>
                  <p className="rug-fold-links">
                    <Link href={`/${locale}/legal/withdrawal`} className="label rug-btn">
                      {t.legal.items.withdrawal}
                    </Link>
                  </p>
                </details>
              </div>
            </div>
          </div>

          <div className="rugp-media">
            <RugGallery slides={images} labels={{ prev: l.prev, next: l.next }} />
          </div>
        </div>

        {/* --- 2. Les détails. --- */}
        <section className="rugp-details" id="tissage">
          <h2 className="display d-1 rugp-h">{l.detailsHeading}</h2>
          <div className="rugp-details-grid">
            {details.map((d) => (
              <Reveal key={d.key} className="rugp-detail">
                <div className="rugp-detail-said">
                  <h3 className="display d-3">{d.title}</h3>
                  <p>{d.body}</p>
                </div>
                <div className="rugp-detail-plate">
                  <Image src={d.src} alt="" width={d.w} height={d.h} sizes="(max-width: 700px) 50vw, 16vw" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* --- 3. Help, in a ruled box. --- */}
        <section className="rugp-help">
          <Reveal className="rugp-help-box">
            <p className="display d-3">{l.helpBox}</p>
            <a
              href={help}
              className="link label"
              {...(wa ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            >
              {l.helpBoxCta}
            </a>
          </Reveal>
        </section>

        {/* --- 4. A big slider of the rugs at home — the house's own rooms. --- */}
        <section className="rugp-reel">
          <RugGallery variant="reel" slides={REEL.map((r) => ({ ...r, alt: t.mrirtPage.roomAlt }))} labels={{ prev: l.prev, next: l.next }} />
        </section>

        {/* --- 5. How it is made. --- */}
        <section className="rugp-process">
          <div className="rugp-process-plate">
            <Image src={RUG_SHOTS.rug} alt={t.mrirtPage.rug.alt} width={1800} height={3200} sizes="(max-width: 900px) 100vw, 56vw" />
          </div>
          <div className="rugp-process-said">
            <p className="label">{l.processEyebrow}</p>
            <h2 className="display d-1">{t.mrirtPage.coopHeading}</h2>
            <div className="rugp-process-body">
              <p>{t.rugs.body[1]}</p>
              <p>{t.rugs.craft}</p>
            </div>
          </div>
        </section>
      </article>

      {/* --- 6. More rugs. --- */}
      <MoreRugs
        locale={locale}
        heading={l.moreFrom}
        excludePiece={exclude.piece}
        excludeSeries={exclude.series}
        layout="cards"
        labels={{ from: l.from, onRequest: l.onRequest, rugName: l.rugName, line: l.cardLine }}
      />
    </>
  );
}
