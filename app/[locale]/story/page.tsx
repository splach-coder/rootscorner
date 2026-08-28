import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import Reveal from "@/components/Reveal";
import ClosingBand from "@/components/ClosingBand";
import { getDictionary, isLocale, type Locale } from "@/lib/dictionaries";
import { scene } from "@/lib/instagram";
import { INSTAGRAM, INSTAGRAM_HANDLE, PLACE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);

  return {
    title: `${t.story.heading} — The Roots Corner`,
    description: t.story.body[0],
    alternates: {
      canonical: `/${locale}/story`,
      languages: { fr: "/fr/story", en: "/en/story", "x-default": "/fr/story" },
    },
  };
}

/**
 * Our Story — read as chapters.
 *
 * Four sourced sentences exist about Dahab and the house and §5 forbids writing
 * a fifth, so the page cannot be made longer with words. It is made longer with
 * ROOMS: two full-bleed interiors that hold the whole screen, and four chapters
 * that each carry one thing the client has actually said.
 *
 * The empty portrait frame is gone at the client's instruction. It was there to
 * keep an owed asset visible (§13) rather than let a still life stand in
 * silently; that debt is now recorded in this file and in §13, not printed on
 * the page.
 *
 * Every chapter's copy is sourced:
 *   the route      t.story.body[0]      — her own sentence
 *   the place      PLACE                — Marrakech and its coordinates, no prose
 *   the founder    t.presentation.body  — the live site's About copy
 *   the hands      t.rugs.body[1]       — the weaving cooperative, verbatim
 *   what it is for t.story.body[1]      — the live site's mission line
 *
 * The place chapter deliberately has no paragraph. Anything written about
 * Marrakech here would be invented, and a title card with the city's name and
 * its coordinates says the true thing at the right scale.
 */
export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);

  return (
    <>
      <PageHead
        eyebrow={t.story.eyebrow}
        heading={t.story.heading}
        meta={`${PLACE.city}, ${PLACE.country[locale]}`}
        lede={t.storyPage.lede}
      />

      {/* ---- The route.

           Paris and Marrakech at either end of a rule spanning the page. The
           rule DRAWS itself left to right when the section arrives and the mark
           lands at the far end after it — the one animated gesture on the site
           that carries meaning rather than decorating, because the thing being
           drawn is the journey the page is about. */}
      <section className="section chapter chapter-route">
        <div className="shell">
          <Reveal className="hinge-route">
            <span className="hinge-station display d-3">{t.storyPage.from}</span>
            <span className="hinge-line" aria-hidden="true" />
            <span className="hinge-station hinge-station-end display d-3">
              {t.storyPage.to}
            </span>
          </Reveal>

          <div className="hinge-inner">
            {/* Waits for the line: the sentence is the arrival. */}
            <Reveal as="blockquote" delay={900} className="hinge-quote display">
              {t.story.body[0]}
            </Reveal>

            <Reveal variant="frame" delay={220} className="frame hinge-plate">
              <Image
                src="/rugs/interior-lamp.jpg"
                alt={
                  locale === "fr"
                    ? "Un intérieur à Marrakech, éclairé par une lampe"
                    : "A Marrakech interior, lit by a lamp"
                }
                width={810}
                height={1256}
                quality={90}
                sizes="(max-width: 940px) 76vw, 34vw"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- A room, and nothing else on the screen. */}
      <section className="section story-room">
        <Reveal variant="frame" className="frame story-room-frame cine">
          <Image
            src="/rugs/interior-fire.jpg"
            alt={
              locale === "fr"
                ? "Intérieur à Marrakech, feu allumé dans une cheminée de plâtre"
                : "A Marrakech interior, a fire lit in a plaster hearth"
            }
            width={1800}
            height={2700}
            sizes="100vw"
          />
        </Reveal>
      </section>

      {/* ---- The intent.

           One sentence, alone, at scale. Verbatim from the client's own About
           page — the only place they say why any of this exists rather than
           what it is. It earns a whole screen because there is exactly one of
           it. */}
      <section className="section statement">
        <div className="shell">
          <Reveal as="p" className="label statement-eyebrow">
            {t.storyPage.purposeEyebrow}
          </Reveal>
          <Reveal as="p" delay={140} className="display statement-line">
            {t.storyPage.purpose}
          </Reveal>
        </div>
      </section>

      {/* ---- The place. A title card: the city, where it is, and a room in it.

           No paragraph, on purpose. Anything written about Marrakech here would
           be invented (§5); the name at scale and the coordinates are true. */}
      <section className="section chapter chapter-place">
        <div className="shell chapter-inner">
          <div className="chapter-said">
            <Reveal as="p" className="label chapter-eyebrow">
              {t.storyPage.placeEyebrow}
            </Reveal>
            <Reveal delay={90} as="h2" className="display chapter-title">
              {PLACE.city}
            </Reveal>
            <Reveal delay={200} as="p" className="label chapter-coords">
              {PLACE.lat} · {PLACE.lon}
            </Reveal>
          </div>

          {/* interior-table.jpg, not the Instagram frame of the same room —
              they are the same dining room and this file is 1036px wide against
              516. Where a scene exists in both sets, the site's own copy wins. */}
          <Reveal variant="frame" delay={120} className="frame chapter-plate">
            <Image
              src="/rugs/interior-table.jpg"
              alt={
                locale === "fr"
                  ? "Une salle à manger : pièces posées sur des étagères de plâtre, table ronde, chaise noire"
                  : "A dining room: pieces set on plaster shelves, a round table, a black chair"
              }
              width={1036}
              height={1499}
              sizes="(max-width: 940px) 88vw, 34vw"
            />
          </Reveal>
        </div>
      </section>

      {/* ---- The founder. What is known, and where she posts. */}
      <section className="section chapter chapter-founder">
        <div className="shell chapter-inner chapter-inner-flip">
          <div className="chapter-said">
            <Reveal as="p" className="label chapter-eyebrow">
              {t.storyPage.founderEyebrow}
            </Reveal>
            <Reveal delay={90} className="founder-prose">
              {t.presentation.body.map((line, i) => (
                <p key={i} className={i === 0 ? "display founder-lead" : "prose"}>
                  {line}
                </p>
              ))}
            </Reveal>
            <Reveal delay={180}>
              <a
                href={INSTAGRAM}
                className="link label founder-instagram"
                target="_blank"
                rel="noreferrer noopener"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </Reveal>
          </div>

          {/* A close frame, not another room. There is no portrait of Dahab
              (§13) and the chapter is about her, so the photograph beside it is
              the one intimate shot in the set rather than a fourth wide
              interior — which would have read as more of the same house. */}
          <Reveal variant="frame" delay={120} className="frame chapter-plate">
            <Image
              src={scene("detail")}
              alt={
                locale === "fr"
                  ? "Un tabouret sculpté posé sur un tapis, près d’un rideau"
                  : "A carved stool on a rug, beside a curtain"
              }
              width={512}
              height={640}
              quality={90}
              sizes="(max-width: 940px) 88vw, 34vw"
            />
          </Reveal>
        </div>
      </section>

      {/* ---- The hands. The client's own sentence about the cooperative — the
           most artisan-forward thing they have written, and the only place on
           the site where the people who make something are named. */}
      <section className="section story-room story-room-tall">
        <Reveal variant="frame" className="frame story-room-frame cine">
          <Image
            src="/rugs/mrirt-room.jpg"
            alt={
              locale === "fr"
                ? "Un tapis Mrirt dans une pièce"
                : "A Mrirt rug in a room"
            }
            width={1206}
            height={1889}
            sizes="100vw"
          />
        </Reveal>
      </section>

      <section className="section chapter chapter-hands">
        <div className="shell chapter-words">
          <Reveal as="p" className="label chapter-eyebrow">
            {t.storyPage.artisansEyebrow}
          </Reveal>
          <Reveal delay={90} as="h2" className="display d-1 chapter-heading">
            {t.mrirtPage.coopHeading}
          </Reveal>
          <Reveal delay={160} as="p" className="lede chapter-body">
            {t.rugs.body[1]}
          </Reveal>
          <Reveal delay={230}>
            <Link href={`/${locale}/mrirt`} className="link label chapter-cta">
              {t.rugs.cta}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---- What the collection is for. */}
      <section className="section chapter chapter-mission">
        <div className="shell chapter-inner chapter-inner-flip">
          <div className="chapter-said">
            <Reveal as="p" className="label chapter-eyebrow">
              {t.storyPage.missionEyebrow}
            </Reveal>
            <Reveal delay={90} as="h2" className="display d-1 chapter-heading">
              {t.storyPage.missionHeading}
            </Reveal>
            <Reveal delay={160} as="p" className="lede chapter-body">
              {t.story.body[1]}
            </Reveal>
            <Reveal delay={230}>
              <Link href={`/${locale}/collection`} className="link label chapter-cta">
                {t.selection.viewAll}
              </Link>
            </Reveal>
          </div>

          <Reveal variant="frame" delay={120} className="frame chapter-plate">
            <Image
              src={scene("evening")}
              alt={
                locale === "fr"
                  ? "Une alcôve éclairée le soir : une jarre, des livres, un tabouret et une lampe"
                  : "A lit alcove in the evening: a jar, books, a stool and a lamp"
              }
              width={512}
              height={640}
              quality={90}
              sizes="(max-width: 940px) 88vw, 34vw"
            />
          </Reveal>
        </div>
      </section>

      <ClosingBand locale={locale as Locale} t={t.closing} labels={t.pieceLabel} />
    </>
  );
}
