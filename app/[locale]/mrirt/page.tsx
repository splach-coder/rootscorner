import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import Reveal from "@/components/Reveal";
import InquiryForm, { type InquiryField } from "@/components/InquiryForm";
import ClosingBand from "@/components/ClosingBand";
import { getDictionary, isLocale, type Locale } from "@/lib/dictionaries";
import { RUG_SHOTS, WOVEN_RUGS, readyRugs } from "@/lib/catalog";
import PieceCard from "@/components/PieceCard";
import { INSTAGRAM, whatsappDigits } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);

  return {
    title: `${t.nav.rugs} — The Roots Corner`,
    description: t.rugs.body[0],
    alternates: {
      canonical: `/${locale}/mrirt`,
      languages: { fr: "/fr/mrirt", en: "/en/mrirt", "x-default": "/fr/mrirt" },
    },
  };
}

/**
 * Mrirt rugs.
 *
 * The only page on the site that does not sell anything. Mrirt rugs are
 * handwoven to order by a women's cooperative in the Middle Atlas and are
 * customisable in size, colour, design and texture, so there is no object to
 * put in a cart — forcing one into the shop would misrepresent what is being
 * offered (CLAUDE.md §6).
 *
 * REBUILT, and the client named both faults.
 *
 * 1. THE PAGE ASKED THE SAME FOUR QUESTIONS TWICE. The four terms of a
 *    made-to-measure rug were a numbered list near the top — "01 Les dimensions
 *    · Indiquez les dimensions souhaitées" — and then the form at the foot
 *    asked for the same four under the same four hints. A visitor read the
 *    instruction, scrolled past three sections, and met it again as a box. That
 *    is why the form read as something bolted on rather than as the point of
 *    the page. The numbered terms ARE the form now: one block, one place.
 *
 * 2. THE OPENING PHOTOGRAPH WAS SMALL IN A LARGE SURFACE. It sat contained on
 *    a tinted plate, after Beni Rugs, who shoot every rug flat and whole on
 *    exactly such a surface. Their rugs fill it; this frame is 9/16, so
 *    containing it drew the picture at about 70% of a box that was itself half
 *    the screen — a small photograph surrounded by ground, which is the one
 *    thing the brief bans outright. The plate is gone and the photograph runs
 *    the full width of the page.
 *
 * The three sections below are the client's own §10: what a rug made to order
 * is, how to order one, and what is already woven. Each is a real destination,
 * so the three named entries at the top land in three different places.
 */
/** Where each of §10's three entries actually goes on this page. */
const ENTRY_ANCHORS: Record<string, string> = {
  ready: "#disponibles",
  order: "#sur-commande",
  how: "#comment",
};

export default async function MrirtPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);
  const rug = t.mrirtPage.rug;
  // Empty until the client stocks finished rugs — see readyRugs() in lib/catalog.
  const ready = readyRugs();

  /*
    The four terms, from the client's own sentence — size, colour, design,
    texture — each with the one line of instruction they wrote for it (§11).

    They are FIELDS, not a list. `no` carries the numbering the report asked
    for and also suppresses the "(optional)" suffix: the sentence above the
    block already says none of the four is required, and printing it four times
    under a heading that invites someone to describe a rug makes the page's one
    commercial action read as tentative.
  */
  const axes = [
    { key: "size", label: t.rugs.axes.size, hint: t.rugs.axisNotes.size },
    { key: "colour", label: t.rugs.axes.colour, hint: t.rugs.axisNotes.colour },
    { key: "design", label: t.rugs.axes.design, hint: t.rugs.axisNotes.design },
    { key: "texture", label: t.rugs.axes.texture, hint: t.rugs.axisNotes.texture },
  ];

  const fields: InquiryField[] = [
    ...axes.map((axis, i) => ({
      name: axis.key,
      label: axis.label,
      hint: axis.hint,
      no: String(i + 1).padStart(2, "0"),
    })),
    { name: "name", label: t.form.name, required: true },
    { name: "email", label: t.form.email, kind: "email" as const, required: true },
    { name: "message", label: t.form.message, kind: "textarea" as const },
  ];

  return (
    <>
      {/* The lede says "nothing here is in stock". The moment a finished rug
          is, that is false — so it follows the shelf rather than being a fixed
          claim about a page that now sells two different things. */}
      <PageHead
        eyebrow={t.rugs.eyebrow}
        heading={t.rugs.heading}
        meta={t.mrirtPage.place}
        lede={ready.length > 0 ? t.mrirtPage.ledeStocked : t.mrirtPage.lede}
      />

      {/* --- The rug, the full width of the page.

           One photograph, edge to edge. The subject is WOOL — depth, density,
           the shadow between the tufts — and that is a thing you can either see
           at size or not show at all. It is the client's own photograph from
           their Mrirt page, the weaving comb resting on the pile where they
           laid it.

           `cover`, and that is not the cropping §24 forbids: there is no object
           in this frame to cut into. It is a surface, and a surface is the one
           subject that loses nothing to a crop. --- */}
      <section className="mrirt-opening">
        <Reveal variant="frame" className="frame mrirt-opening-frame">
          <Image
            src={RUG_SHOTS.rug}
            alt={rug.alt}
            width={1800}
            height={3200}
            priority
            sizes="100vw"
          />
        </Reveal>
        <div className="shell">
          <Reveal as="p" delay={80} className="label mrirt-opening-caption">
            {rug.name}
          </Reveal>
        </div>
      </section>

      {/* --- §10 — three entries, named and separated.

           The report is explicit that rugs already woven must not be mixed with
           rugs made to order, and that the structure has to be easy to extend.
           Naming the three at the top is what makes the separation legible
           before a visitor has scrolled past any of it.

           All three land somewhere different now: what a made-to-order rug is,
           the form that starts one, and the shelf of finished ones. Two of them
           used to arrive at the same place (§48). --- */}
      <section className="section mrirt-entries">
        <div className="shell">
          <Reveal as="p" className="label mrirt-eyebrow">
            {t.mrirtPage.entriesEyebrow}
          </Reveal>
          <ol className="mrirt-entry-list">
            {t.mrirtPage.entries.map((entry, i) => (
              <li key={entry.key} className="mrirt-entry">
                <a href={ENTRY_ANCHORS[entry.key]} className="mrirt-entry-link">
                  <span className="label mrirt-entry-no">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mrirt-entry-said">
                    <span className="display d-3 mrirt-entry-name">{entry.name}</span>
                    <span className="mrirt-entry-note">{entry.note}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --- 1. Tapis sur commande — what one actually is.

           The label, the wool, the women who weave it, and the way through to
           the form: everything the page knows about the object before it asks
           anyone to describe one.

           The material answers it — skeins of dyed yarn drying in Marrakech,
           from the client's own Drive (§51). The caption says dyed YARN, not
           wool: Marrakech dyers hang viscose and sabra as readily as wool, and
           tying a street photograph to the passage beside it about the wool of
           a Mrirt rug would be invented provenance with a camera (§5). --- */}
      <section id="sur-commande" className="section mrirt-pair">
        <div className="shell mrirt-pair-inner">
          <div className="mrirt-said-stack">
            <Reveal className="mrirt-label">
              <p className="display d-3 wall-label-name mrirt-label-name">{rug.name}</p>
              <dl className="wall-label-specs">
                <div className="wall-label-row">
                  <dt className="label wall-label-key">{t.pieceLabel.origin}</dt>
                  <dd className="wall-label-value">{rug.origin}</dd>
                </div>
                <div className="wall-label-row">
                  <dt className="label wall-label-key">{t.pieceLabel.material}</dt>
                  <dd className="wall-label-value">{rug.material}</dd>
                </div>
                <div className="wall-label-row">
                  <dt className="label wall-label-key">{rug.madeKey}</dt>
                  <dd className="wall-label-value">{rug.made}</dd>
                </div>
              </dl>
              {/* No dimensions row. A rug that does not exist yet has none, and
                  the schema omits a field rather than inventing one (§5). */}
              <p className="label mrirt-label-order">{t.rugs.order}</p>
            </Reveal>

            <Reveal delay={90} className="mrirt-said">
              <p className="label mrirt-eyebrow">{t.mrirtPage.matterEyebrow}</p>
              <h2 className="display d-2 mrirt-heading">{t.mrirtPage.matterHeading}</h2>
              <p className="prose">{t.rugs.body[0]}</p>
              {/* Two more sentences from their own /mrirt-rugs/ page, which
                  this copy did not have: what the making amounts to, and what
                  the wool feels like. */}
              <p className="prose">{t.rugs.craft}</p>
              <p className="prose mrirt-wool">{t.rugs.wool}</p>
            </Reveal>

            <Reveal delay={150} className="mrirt-said">
              <p className="label mrirt-eyebrow">{t.mrirtPage.coopEyebrow}</p>
              <h2 className="display d-2 mrirt-heading">{t.mrirtPage.coopHeading}</h2>
              <p className="prose">{t.rugs.body[1]}</p>
            </Reveal>

            <Reveal delay={200}>
              <a href="#comment" className="label rugs-start">
                {t.rugs.startCta}
              </a>
            </Reveal>
          </div>

          <figure className="mrirt-yarn">
            <Reveal variant="frame" delay={140} className="frame mrirt-yarn-frame">
              <Image
                src="/place/dyed-yarn.jpg"
                alt={t.mrirtPage.yarnAlt}
                width={1333}
                height={2000}
                sizes="(max-width: 900px) 100vw, 38vw"
              />
            </Reveal>
            <Reveal as="figcaption" delay={200} className="label mrirt-figure-caption">
              {t.mrirtPage.yarnCaption}
            </Reveal>
          </figure>
        </div>
      </section>

      {/* --- 2. Comment commander — the four terms, as the form.

           This is the page's whole commercial action, so it takes the
           composition Beni Rugs gives an order panel: the questions in one
           column, one filled bar closing them, and beside it the photograph
           that argues for the first question. The room is the only frame on
           this page that carries SCALE, and the first thing the form asks is
           size. --- */}
      <section id="comment" className="section mrirt-order">
        <div className="shell mrirt-order-inner">
          <div className="mrirt-ask">
            <Reveal>
              <p className="label mrirt-eyebrow">{t.mrirtPage.roomEyebrow}</p>
              <h2 className="display d-1 mrirt-ask-heading">{t.mrirtPage.roomHeading}</h2>
              <p className="prose mrirt-ask-note">{t.mrirtPage.roomNote}</p>
            </Reveal>

            {/* The shelf's cards jump here, so the anchor sits on a plain
                element — Reveal takes no id. */}
            <div id="demander" className="mrirt-form-anchor" />
            <Reveal delay={120} className="mrirt-form">
              {/* Their own invitation, verbatim, and then the line that says
                  none of the four below is required. Both sit ABOVE the fields,
                  which is the only place an instruction for a form belongs. */}
              <p className="prose mrirt-form-note">{t.rugs.invite}</p>
              <p className="prose mrirt-form-note">{t.rugs.axesNote}</p>
              <InquiryForm
                fields={fields}
                topic="rug"
                instagram={INSTAGRAM}
                whatsappDigits={whatsappDigits()}
                labels={{
                  send: t.form.send,
                  sending: t.form.sending,
                  sent: t.form.sent,
                  error: t.form.error,
                  optional: t.form.optional,
                  viaInstagram: t.form.viaInstagram,
                  viaWhatsapp: t.form.viaWhatsapp,
                  photoTooBig: t.form.photoTooBig,
                }}
              />
            </Reveal>
          </div>

          {/* The wrapper is the grid item and it STRETCHES; the frame inside
              it is what sticks. Making the frame itself both stretch and keep
              an aspect-ratio is a fight the ratio loses — it would be drawn the
              full height of the column. Same shape as the sticky wall label on
              a piece page (§24). */}
          <div className="mrirt-room-column">
            <Reveal variant="frame" delay={80} className="frame mrirt-room-frame bleed-right">
              <Image
                src={RUG_SHOTS.room}
                alt={t.mrirtPage.roomAlt}
                width={1206}
                height={1889}
                sizes="(max-width: 900px) 100vw, 44vw"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- 3. What is already woven.

           A second product line, not a change to the first: these are finished
           rugs, sold like anything else in the collection, and they use the
           same card so a visitor meets the same object at the same size
           wherever they find it.

           The shelf is empty today and says so. Inventing two rugs to make the
           row look full would be inventing stock, which is the one kind of
           invention a shop actually punishes a visitor for (§5). --- */}
      <section id="disponibles" className="section mrirt-ready">
        <div className="shell">
          <Reveal className="mrirt-ready-head">
            <p className="label mrirt-eyebrow">{t.mrirtPage.readyEyebrow}</p>
            <h2 className="display d-1 mrirt-ready-heading">{t.mrirtPage.readyHeading}</h2>
            <p className="prose mrirt-ready-note">
              {ready.length > 0 ? t.mrirtPage.readyNote : t.mrirtPage.woven.note}
            </p>
          </Reveal>

          {ready.length > 0 ? (
            /* Real stock, when there is any: the collection's own card, so a
               rug meets a visitor exactly as every other object does. */
            <ul className="cards mrirt-ready-cards">
              {ready.map((piece, i) => (
                <PieceCard
                  key={piece.slug}
                  piece={piece}
                  locale={locale as Locale}
                  labels={t.pieceLabel}
                  sold={t.common.sold}
                  delay={(i % 4) * 70}
                />
              ))}
            </ul>
          ) : (
            /* Until then: the rugs the client has actually photographed, shown
               as woven work rather than as priced stock. Same card shape, but
               no price and no piece page — neither exists — so each one leads
               to the enquiry instead. */
            <ul className="cards mrirt-ready-cards">
              {WOVEN_RUGS.map((woven, i) => {
                const key = woven.id as keyof typeof t.mrirtPage.woven.items;
                return (
                  <li key={woven.id} className="card">
                    <a href="#demander" className="card-link">
                      <Reveal variant="frame" delay={(i % 3) * 70} className="frame card-frame">
                        <Image
                          src={woven.src}
                          alt={t.mrirtPage.woven.alts[key]}
                          width={woven.width}
                          height={woven.height}
                          sizes="(max-width: 640px) 46vw, 49vw"
                        />
                      </Reveal>
                      <Reveal delay={(i % 3) * 70 + 60} className="card-said">
                        <p className="display d-3 wall-label-name">
                          {t.mrirtPage.woven.items[key]}
                        </p>
                        <p className="label card-state">{t.mrirtPage.woven.ask}</p>
                      </Reveal>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <ClosingBand locale={locale as Locale} t={t.closing} labels={t.pieceLabel} />
    </>
  );
}
