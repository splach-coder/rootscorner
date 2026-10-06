import Image from "next/image";
import RugBrowser, { type RugTile } from "@/components/RugBrowser";
import HeroMedia from "@/components/HeroMedia";
import { isIllustrativeSeries, allRugSeries, colourName, formatEuro, seriesTitle } from "@/lib/rugs";
import { rugLabels } from "@/lib/rug-labels";
import { rugChoices } from "@/lib/rug-options";
import { pageMeta, og } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import InquiryForm, { type InquiryField } from "@/components/InquiryForm";
import { getDictionary, isLocale, type Locale } from "@/lib/dictionaries";
import { RUG_DEMO, RUG_SHOTS, WOVEN_RUGS, readyRugs } from "@/lib/catalog";
import { INSTAGRAM, whatsappDigits } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);

  return pageMeta({
    locale,
    path: "/mrirt",
    title: `${t.nav.rugs} | The Roots Corner`,
    description: t.rugs.body[0],
    image: og("mrirt.jpg"),
    index: !RUG_DEMO,
  });
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
  custom: "#sur-mesure",
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
  /*
    The terms, numbered as the client asked (§11). The series and the sizes
    come from Shopify (lib/rug-options.ts) — Beni's structure: a series is a
    product, its colourways and sizes are its options, and the house edits
    them in the admin. Texture stays a free answer.
  */
  const choices = rugChoices(locale as Locale);
  const series = allRugSeries();
  const rl = rugLabels(locale as Locale);
  const fr = locale === "fr";

  /* The wall: one tile per colourway of every collection, then the rugs
     already woven. A colourway without its own photograph takes the
     collection's photographs in turn, so the wall does not repeat one frame. */
  const tiles: RugTile[] = [
    ...WOVEN_RUGS.map((woven) => {
      const key = woven.id as keyof typeof t.mrirtPage.woven.items;
      const name = woven.name?.[locale as Locale] ?? t.mrirtPage.woven.items[key];
      return {
        key: `woven-${woven.id}`,
        href: woven.slug ? `/${locale}/piece/${woven.slug}` : "#sur-mesure",
        src: woven.src,
        w: woven.width,
        h: woven.height,
        alt: name,
        kind: "ready" as const,
        collection: "",
        name,
        detail: null,
        price: rl.onRequest,
      };
    }),
    ...series.flatMap((sr) => {
      const title = seriesTitle(sr, locale);
      return sr.colours.map((c, i) => {
        const img = c.image
          ? { src: c.image, w: sr.images[0]?.w ?? 1600, h: sr.images[0]?.h ?? 2000 }
          : sr.images[i % Math.max(1, sr.images.length)];
        const from = isIllustrativeSeries(sr)
          ? []
          : sr.variants.filter((v) => v.colour === c.name && v.price > 0).map((v) => v.price);
        const colour = colourName(c.name, locale);
        return {
          key: `${sr.handle}-${c.name}`,
          href: `/${locale}/tapis/${sr.handle}?couleur=${encodeURIComponent(c.name)}`,
          src: img?.src ?? "",
          w: img?.w ?? 1600,
          h: img?.h ?? 2000,
          alt: `${rl.rugName} ${title}, ${colour}`,
          kind: "order" as const,
          collection: sr.handle,
          name: title,
          detail: colour,
          price: from.length ? `${rl.from} ${formatEuro(Math.min(...from), locale)}` : rl.onRequest,
        };
      });
    }),
  ].filter((tile) => tile.src);
  const collectionsList = series.map((sr) => ({ handle: sr.handle, name: seriesTitle(sr, locale) }));

  /*
    V1 feedback §7–9: what can be customised — dimensions, colours, texture
    and design — each a real choice. Texture was an empty box; it is the
    house's four answers now, the last of which is "advise me". And one
    yes/no to be guided through the whole choice.
  */
  const m = t.mrirtPage;
  const fields: InquiryField[] = [
    { name: "size", label: t.rugs.axes.size, hint: t.rugs.axisNotes.size, no: "01", kind: "choice", layout: "grid", ...choices.size },
    {
      name: "series",
      label: m.seriesLabel,
      hint: m.seriesHint,
      no: "02",
      kind: "choice",
      layout: "list",
      ...choices.series,
    },
    {
      name: "texture",
      label: t.rugs.axes.texture,
      hint: t.rugs.axisNotes.texture,
      no: "03",
      kind: "choice",
      layout: "list",
      options: m.textureOptions.map((value) => ({ value })),
      placeholder: fr ? "Choisir une texture" : "Choose a texture",
    },
    { name: "guidance", label: m.guidance, no: "04", kind: "check", defaultValue: m.guidanceYes },
    { name: "name", label: t.form.name, required: true },
    { name: "email", label: t.form.email, kind: "email" as const, required: true },
    { name: "message", label: t.form.message, kind: "textarea" as const },
  ];

  return (
    <>
      {/* The lede says "nothing here is in stock". The moment a finished rug
          is, that is false — so it follows the shelf rather than being a fixed
          claim about a page that now sells two different things. */}
      {/* --- The opening: the homepage's own hero (client, 6 Oct) — full
           screen, the same load sequence (dark ground, photograph, then the
           words), the same light header over it. After benirugs.com's
           collection page, which opens on a room the same way.

           A room with a rug in it, full bleed, the name of the page set over
           its top edge the way Beni sets theirs — and, as on the homepage, no
           tint laid over the photograph: the type carries its own soft shadow
           (client, 5 Oct). The house's own photograph. --- */}
      <section className="hero rugs-page-hero">
        <div className="hero-media">
          <HeroMedia src="/rugs/series/floor-fire.jpg" width={1600} height={2400} />
        </div>
        <div className="hero-plate">
          <Reveal as="div" className="hero-inner shell">
            <div>
              <h1 className="display d-hero hero-title">{t.nav.rugs}</h1>
              <div className="hero-line">
                <p className="hero-tagline label">{t.mrirtPage.place}</p>
              </div>
              <p className="hero-lead">{rl.shopIntro}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section rugs-shop" id="tapis">
        {/* The three entries still land somewhere: the wall filters itself. */}
        <span id="disponibles" className="rugs-anchor" />
        <span id="sur-commande" className="rugs-anchor" />
        <div className="shell">
          {RUG_DEMO && <p className="label rug-demo-note">{rl.illustration}</p>}
          <RugBrowser tiles={tiles} collections={collectionsList} labels={rl.browser} />
        </div>
      </section>

      {/* --- The rug itself — what a Mrirt rug is, before any choice.

           The label, the wool, the women who weave it, and the way through to
           the form: everything the page knows about the object before it asks
           anyone to describe one.

           The material answers it — skeins of dyed yarn drying in Marrakech,
           from the client's own Drive (§51). The caption says dyed YARN, not
           wool: Marrakech dyers hang viscose and sabra as readily as wool, and
           tying a street photograph to the passage beside it about the wool of
           a Mrirt rug would be invented provenance with a camera (§5). --- */}
      <section id="savoir-faire" className="section mrirt-pair">
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

            {/* One heading and one sentence; the rest of the house's copy is
                folded, not cut (client, 5 Oct: the page read like a book). */}
            <Reveal delay={90} className="mrirt-said">
              <h2 className="display d-2 mrirt-heading">{m.coopHeading}</h2>
              <p className="prose">{t.rugs.body[1]}</p>
              <details className="mrirt-more">
                <summary className="label">{fr ? "En savoir plus" : "Read more"}</summary>
                <p className="prose">{t.rugs.body[0]}</p>
                <p className="prose">{t.rugs.craft}</p>
                <p className="prose">{t.rugs.wool}</p>
              </details>
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

      {/* --- 3. Tapis sur mesure — the terms, as the form.

           V1 §7: the customer must understand exactly what can be set —
           dimensions, colours, texture, and design.

           This is the page's whole commercial action, so it takes the
           composition Beni Rugs gives an order panel: the questions in one
           column, one filled bar closing them, and beside it the photograph
           that argues for the first question. The room is the only frame on
           this page that carries SCALE, and the first thing the form asks is
           size. --- */}
      <section id="sur-mesure" className="section mrirt-order">
        <div className="shell mrirt-order-inner">
          <div className="mrirt-ask">
            <Reveal>
              <h2 className="display d-2 mrirt-ask-heading">{m.entries[2].name}</h2>
              <p className="prose mrirt-ask-note">{m.customTerms}</p>
            </Reveal>

            {/* The shelf's cards jump here, so the anchor sits on a plain
                element — Reveal takes no id. */}
            <div id="demander" className="mrirt-form-anchor" />
            <Reveal delay={120} className="mrirt-form">
              {/* Their own invitation, verbatim, and then the line that says
                  none of the four below is required. Both sit ABOVE the fields,
                  which is the only place an instruction for a form belongs. */}
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
{/* No pieces here: the rug pages show rugs only (client, 5 Oct). */}
    </>
  );
}
