import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import Reveal from "@/components/Reveal";
import ClosingBand from "@/components/ClosingBand";
import { getDictionary, isLocale, type Locale } from "@/lib/dictionaries";
import { INSTAGRAM, INSTAGRAM_HANDLE } from "@/lib/site";

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
 * Our Story.
 *
 * Rebuilt to §6 of the client's final report: this page tells The Roots
 * Corner — its world, its identity, its way of working — and NOT a personal
 * route. The ruled line from Paris to Marrakech, the timeline and the title
 * card naming the cities are all gone at their instruction, along with the
 * graphic detail around them. What is asked for is "très simple, très épuré".
 *
 * So the page is their own §7 text in four movements, two rooms, the line that
 * closes it, and §8's paragraph about the founder. Every word is theirs.
 *
 * There is still no portrait of Dahab in the files we hold (§13). The page does
 * not stand a still life in for her.
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
        heading={t.story.eyebrow}
      />

      {/* ---- The house, in four movements.

           §7 of the client's report, verbatim, alternating with two rooms.
           What used to be here — the ruled line from Paris to Marrakech, the
           timeline, the title card of the city — is gone at their instruction
           (§6): the page tells The Roots Corner, not a personal route, and it
           is meant to be very simple. Four headings, six paragraphs, two
           photographs and a closing line. Nothing else. */}
      {t.storyPage.heritage.map((part, i) => (
        <section key={part.eyebrow} className="section chapter">
          <div className="shell chapter-inner-plain">
            <Reveal as="p" className="label chapter-eyebrow">
              {part.eyebrow}
            </Reveal>
            <Reveal delay={90} className="chapter-prose">
              {part.body.map((line, j) => (
                <p key={j} className={j === 0 ? "lede" : "prose"}>
                  {line}
                </p>
              ))}
            </Reveal>
          </div>

          {/* A room after the first and third movements, so the page breathes
              without a photograph beside every paragraph. */}
          {(i === 0 || i === 2) && (
            <Reveal variant="frame" delay={140} className="frame story-room-frame cine">
              <Image
                src={i === 0 ? "/rugs/interior-fire.jpg" : "/rugs/interior-table.jpg"}
                alt={
                  i === 0
                    ? locale === "fr"
                      ? "Intérieur à Marrakech, feu allumé dans une cheminée de plâtre"
                      : "A Marrakech interior, a fire lit in a plaster hearth"
                    : locale === "fr"
                      ? "Une salle à manger : pièces posées sur des étagères de plâtre"
                      : "A dining room: pieces set on plaster shelves"
                }
                width={i === 0 ? 1800 : 1036}
                height={i === 0 ? 2700 : 1499}
                sizes="100vw"
              />
            </Reveal>
          )}
        </section>
      ))}

      {/* ---- The line that closes them, at scale. */}
      <section className="section statement">
        <div className="shell">
          <Reveal as="p" className="display statement-line">
            {t.storyPage.heritageClose}
          </Reveal>
        </div>
      </section>

      {/* ---- The founder. §8, verbatim, and where she posts.

           No portrait: there is still none in the files the client has sent
           (§13), and a still life standing in silently for a person is a small
           lie the page would tell every visitor. */}
      <section className="section chapter chapter-founder" data-descent-from="">
        <div className="shell chapter-inner-plain">
          <Reveal as="p" className="label chapter-eyebrow">
            {t.storyPage.founderEyebrow}
          </Reveal>
          <Reveal delay={90} className="chapter-prose">
            {t.storyPage.founder.map((line, i) => (
              <p key={i} className={i === 0 ? "lede" : "prose"}>
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
      </section>

      <ClosingBand locale={locale as Locale} t={t.closing} labels={t.pieceLabel} />
    </>
  );
}
