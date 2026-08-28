import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import Reveal from "@/components/Reveal";
import InquiryForm, { type InquiryField } from "@/components/InquiryForm";
import ClosingBand from "@/components/ClosingBand";
import { getDictionary, isLocale, type Locale } from "@/lib/dictionaries";
import { RUG_SHOTS, WOVEN_RUGS, loomShots, readyRugs } from "@/lib/catalog";
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
 * This page once showed the weaving comb in place of a rug, because there was
 * no photograph of one. There is now — three frames from the client's own site,
 * recorded in docs/site-images.json.
 *
 * THE LAYOUT PROBLEM, AND THE RULE THAT COMES OUT OF IT
 *
 * The first version of this page put each tall portrait photograph in its own
 * column beside a short block of text, four times over. Every one of those
 * pairings left several hundred pixels of empty ground beside the text, because
 * a 900px frame next to a 200px paragraph cannot be balanced by spacing — only
 * by content. The page read as mostly air.
 *
 * So the columns are loaded instead of padded. Each photograph now stands
 * against a *stack* tall enough to answer it, and the photographs bleed out to
 * the viewport edge rather than sitting politely inside the gutter:
 *
 *   1. the rug (bleeding left) against label → the four terms → a detail
 *   2. the wool and the weavers — text only, and short on purpose, so the
 *      page has one place to breathe between two full ones
 *   3. the room (bleeding right) against the form it argues for: the frame
 *      that carries scale, beside the field that asks for size
 *
 * Merging the draft into (3) removed a whole section and roughly a thousand
 * pixels of page. Alternating which edge the photographs escape from is what
 * keeps two full-bleed frames from reading as a template.
 *
 * The label in (1) is the site's own schema (§14), and every value in it comes
 * from the client's Mrirt copy. There is no dimensions row: a rug that does not
 * exist yet has no dimensions, and the schema omits a field rather than
 * inventing one (§5).
 */
export default async function MrirtPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);
  const loom = loomShots();
  const rug = t.mrirtPage.rug;
  // Empty until the client stocks finished rugs — see readyRugs() in lib/catalog.
  const ready = readyRugs();

  const axes = [
    { key: "size", label: t.rugs.axes.size, hint: t.mrirtPage.sizeHint },
    { key: "colour", label: t.rugs.axes.colour, hint: t.mrirtPage.hint },
    { key: "design", label: t.rugs.axes.design, hint: t.mrirtPage.hint },
    { key: "texture", label: t.rugs.axes.texture, hint: t.mrirtPage.hint },
  ];

  const fields: InquiryField[] = [
    ...axes.map((axis) => ({ name: axis.key, label: axis.label, hint: axis.hint })),
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

      {/* --- 1. The rug, escaping left, against everything there is to say
           about it: the label, the four terms, and a detail of the pile. Three
           stacked blocks are what make the column tall enough to stand beside a
           frame this size.

           It used to carry a third: the caramel pile macro, captioned as a
           detail of this rug. It is not — that is a DIFFERENT rug, and the
           cream hero above it made the pairing read as one object. It is now a
           card on the shelf, where being its own rug is the point. --- */}
      <section className="section mrirt-plate">
        <div className="shell mrirt-plate-inner">
          <Reveal variant="frame" className="frame mrirt-plate-frame bleed-left">
            <Image
              src={RUG_SHOTS.rug}
              alt={rug.alt}
              width={1800}
              height={3200}
              priority
              sizes="(max-width: 900px) 100vw, 52vw"
            />
          </Reveal>

          <div className="mrirt-spec">
            <Reveal delay={110} className="mrirt-label">
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
            </Reveal>

            {/* The four terms, stated once here as a specification. The form at
                the foot asks for the same four as fields, so they are not
                repeated as a list — this is the only place they are ruled. */}
            <Reveal delay={170} className="mrirt-terms">
              <p className="label mrirt-label-order">{t.rugs.order}</p>
              <dl className="rugs-axes">
                {axes.map((axis) => (
                  <div key={axis.key} className="rugs-axis">
                    <dt className="label rugs-axis-key">{axis.label}</dt>
                    <dd className="rugs-axis-value">
                      {locale === "fr" ? "Au choix" : "Yours to set"}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

          </div>
        </div>
      </section>

      {/* --- 2. The wool, and the women who weave it.

           Deliberately the short section: two columns of text between two full
           ones, so the page has somewhere to breathe that is not an accident of
           a tall photograph. --- */}
      <section className="section mrirt-pair">
        <div className="shell mrirt-pair-inner">
          {/* Both passages stack in one column. Splitting them left and right
              left whichever column lacked the comb several hundred pixels
              short — two short texts and one image cannot be balanced two
              across, whichever side the image goes. */}
          <div className="mrirt-said-stack">
            <Reveal className="mrirt-said">
              <p className="label mrirt-eyebrow">{t.mrirtPage.matterEyebrow}</p>
              <h2 className="display d-2 mrirt-heading">{t.mrirtPage.matterHeading}</h2>
              <p className="prose">{t.rugs.body[0]}</p>
              {/* Two more sentences from their own /mrirt-rugs/ page, which
                  this copy did not have: what the making amounts to, and what
                  the wool feels like. */}
              <p className="prose">{t.rugs.craft}</p>
              <p className="prose mrirt-wool">{t.rugs.wool}</p>
            </Reveal>

            <Reveal delay={120} className="mrirt-said">
              <p className="label mrirt-eyebrow">{t.mrirtPage.coopEyebrow}</p>
              <h2 className="display d-2 mrirt-heading">{t.mrirtPage.coopHeading}</h2>
              <p className="prose">{t.rugs.body[1]}</p>
            </Reveal>
          </div>

          {loom && (
            <figure className="mrirt-tool">
              <Reveal variant="frame" delay={180} className="frame mrirt-tool-frame">
                <Image
                  src={loom.detail}
                  alt={t.mrirtPage.combAlt}
                  width={2000}
                  height={3000}
                  sizes="(max-width: 900px) 62vw, 22vw"
                />
              </Reveal>
              <Reveal as="figcaption" delay={240} className="label mrirt-tool-caption">
                {t.rugs.figure.caption}
              </Reveal>
            </figure>
          )}
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
      <section className="section mrirt-ready">
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
                          sizes="(max-width: 640px) 46vw, (max-width: 1100px) 31vw, 30vw"
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

      {/* --- 4. The room, escaping right, against the form.

           These were two sections and both were half empty: a photograph whose
           whole job is to convey scale, and a form whose first question is size.
           Put together they fill each other, and the page loses a section. --- */}
      <section className="section mrirt-order">
        <div className="shell mrirt-order-inner">
          <div className="mrirt-ask">
            <Reveal>
              <p className="label mrirt-eyebrow">{t.mrirtPage.roomEyebrow}</p>
              <h2 className="display d-1 mrirt-ask-heading">{t.mrirtPage.roomHeading}</h2>
              <p className="prose mrirt-ask-note">{t.mrirtPage.roomNote}</p>
            </Reveal>

            {/* The shelf's cards link here, so the anchor sits on a plain
                element — Reveal takes no id. */}
            <div id="demander" className="mrirt-form-anchor" />
            <Reveal delay={120} className="mrirt-form">
              {/* Their own invitation, verbatim. */}
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
                }}
              />
            </Reveal>
          </div>

          <Reveal variant="frame" delay={80} className="frame mrirt-room-frame bleed-right">
            <Image
              src={RUG_SHOTS.room}
              alt={t.mrirtPage.roomAlt}
              width={1206}
              height={1889}
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </Reveal>
        </div>
      </section>

      <ClosingBand locale={locale as Locale} t={t.closing} labels={t.pieceLabel} />
    </>
  );
}
