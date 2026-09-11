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
    title: `${t.story.eyebrow} — The Roots Corner`,
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
 * The words are §7 and §8 of the client's report, verbatim, and they do not
 * change here. What changed is that the page now shows something.
 *
 * REBUILT, on the client's instruction that it was not good. Two faults:
 *
 * 1. THE PAGE SAID ITS OWN NAME TWICE. The plate was built with
 *    `heading={t.story.eyebrow}`, so the eyebrow and the title were the same
 *    three words — "Notre histoire" over "Notre histoire".
 *
 * 2. EVERY MOVEMENT WAS TEXT IN A LEFT COLUMN with the right half of the
 *    screen empty, four times over, broken only by two full-bleed rooms that
 *    began flush against the last line of the paragraph above them. On a site
 *    whose brief bans "too much text" and asks for large photography, the one
 *    page about the house had almost none.
 *
 * The fix is not a new device. `.chapter-inner`, `.chapter-plate` and
 * `.chapter-inner-flip` have been in the stylesheet since §34 and were left
 * unused when the page was simplified in §48 — a movement, its photograph, and
 * the side they sit on alternating so four in a row do not read as a template.
 *
 * §48 removed the ruled Paris→Marrakech route, the timeline and the city title
 * card at the client's instruction, and none of them comes back. Those were
 * graphic devices drawn around a shortage of pictures. This is pictures.
 *
 * WHAT THE PHOTOGRAPHS ARE, AND ARE NOT. Five frames from the client's own
 * Drive (§51) and one of their own rooms. They are Marrakech — a shopfront, a
 * shadow on plaster, an alley, a minaret at dusk. Their alt text says only what
 * is in the frame. In particular the third movement names Morocco and Cameroon,
 * and nothing beside it claims to be either: a photograph placed next to a
 * sentence borrows that sentence's provenance unless it is described plainly,
 * which is the same reasoning §24 records for the artisans page.
 *
 * There is still no portrait of Dahab (§13). The founder's movement is her
 * paragraph and the city she works in, not a stand-in for her face.
 */

/** One photograph per movement, in the order the movements are written. */
const FRAMES = [
  { src: "/place/rug-shop.jpg", w: 1334, h: 2000, alt: "soul" },
  { src: "/place/shadow-rail.jpg", w: 1333, h: 2000, alt: "heritage" },
  { src: "/place/medina-street.jpg", w: 1333, h: 2000, alt: "hands" },
  { src: "/rugs/interior-table.jpg", w: 1036, h: 1499, alt: "time" },
] as const;

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
      {/* The house above, the section below.

          It used to be "Notre histoire" over "Notre histoire", which is what a
          plate looks like when it is given the same string twice. The name is
          the one label that belongs above this title and is not a claim. */}
      <PageHead eyebrow="The Roots Corner" heading={t.story.eyebrow} />

      {/* ---- The house, in four movements.

           §7 of the client's report, verbatim, each against one photograph.
           The photograph changes sides every movement — four identical rows
           read as a template, and §34 built `.chapter-inner-flip` for exactly
           this. Every plate is the same width, because a plate that changed
           between movements would read as an accident rather than a rhythm. */}
      {t.storyPage.heritage.map((part, i) => {
        const frame = FRAMES[i];
        return (
          <section key={part.eyebrow} className="section chapter">
            <div
              className={`shell chapter-inner${i % 2 === 1 ? " chapter-inner-flip" : ""}`}
            >
              <div className="chapter-said">
                <Reveal as="p" className="label chapter-eyebrow">
                  {part.eyebrow}
                </Reveal>
                <Reveal delay={90} className="chapter-body chapter-prose">
                  {part.body.map((line, j) => (
                    <p key={j} className={j === 0 ? "lede" : "prose"}>
                      {line}
                    </p>
                  ))}
                </Reveal>
              </div>

              <Reveal variant="frame" delay={140} className="frame chapter-plate">
                <Image
                  src={frame.src}
                  alt={t.storyPage.frames[frame.alt]}
                  width={frame.w}
                  height={frame.h}
                  sizes="(max-width: 939px) 100vw, 30rem"
                />
              </Reveal>
            </div>
          </section>
        );
      })}

      {/* ---- The line that closes them, at scale.

           Their own sentence, and the only place on this page where a line is
           given the whole width. It is also the page's one invitation. */}
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
           lie the page would tell every visitor. The photograph beside her
           paragraph is the city she works in, described as exactly that. */}
      <section className="section chapter chapter-founder">
        <div className="shell chapter-inner">
          <div className="chapter-said">
            <Reveal as="p" className="label chapter-eyebrow">
              {t.storyPage.founderEyebrow}
            </Reveal>
            <Reveal delay={90} className="founder-prose">
              {t.storyPage.founder.map((line, i) => (
                <p key={i} className={i === 0 ? "founder-lead" : "prose"}>
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

          <Reveal variant="frame" delay={140} className="frame chapter-plate">
            <Image
              src="/place/city-dusk.jpg"
              alt={t.storyPage.frames.founder}
              width={1333}
              height={2000}
              sizes="(max-width: 939px) 100vw, 30rem"
            />
          </Reveal>
        </div>
      </section>

      <ClosingBand locale={locale as Locale} t={t.closing} labels={t.pieceLabel} />
    </>
  );
}
