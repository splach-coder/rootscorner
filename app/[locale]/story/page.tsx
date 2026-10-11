import Image from "next/image";
import { pageMeta, og, clip, breadcrumbLd, pageLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { isLocale, type Locale } from "@/lib/dictionaries";
import { STORY } from "@/lib/copy-v2";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const lang = locale as Locale;

  return pageMeta({
    locale,
    path: "/story",
    title: `${lang === "fr" ? "Notre histoire" : "Our story"} | The Roots Corner`,
    // The house's own sentence of what it does and from where (chapter 03).
    description: clip(`${STORY.chapters[2].body[1][lang]} ${STORY.chapters[0].body[0][lang]}`),
    image: og(`${locale}/story.jpg`),
  });
}

/**
 * Histoire — V2 (10 Oct).
 *
 * The client's text, verbatim, in its three chapters, read as one narrative
 * down a single column (after benirugs.com's story page), then the founder's
 * own words beside her photograph. The earlier movements, their street
 * photographs and the closing line are gone at the client's instruction.
 */
/** One photograph per chapter, in the client's order (V3). Alt text says
 *  only what is in the frame. */
const CHAPTER_PHOTOS = [
  {
    src: "/story/atlas-valley.jpg",
    w: 1482,
    h: 2000,
    alt: { fr: "Une vallée de montagne, des falaises et des arbres", en: "A mountain valley with cliffs and trees" },
  },
  {
    src: "/story/ochre-wall.jpg",
    w: 1333,
    h: 2000,
    alt: {
      fr: "Un mur de terre ocre avec une fenêtre verte, un tissage posé devant",
      en: "An ochre earth wall with a green window, a woven textile laid in front",
    },
  },
  {
    src: "/story/rug-room.jpg",
    w: 1333,
    h: 2000,
    alt: { fr: "Une pièce aux murs blanchis, un tapis posé au sol", en: "A whitewashed room with a rug laid on the floor" },
  },
];

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale as Locale;
  const f = STORY.founder;

  const storyName = lang === "fr" ? "Notre histoire" : "Our story";
  return (
    <>
      <JsonLd data={pageLd("AboutPage", lang, "/story", storyName)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "The Roots Corner", path: `/${locale}` },
          { name: storyName, path: `/${locale}/story` },
        ])}
      />
      <section className="story-v2-head">
        <div className="shell">
          <Reveal>
            <p className="label story-v2-eyebrow">The Roots Corner</p>
            <h1 className="display d-1 story-v2-title">{STORY.eyebrow[lang]}</h1>
          </Reveal>
        </div>
      </section>

      {/* V3 (11 Oct): a photograph with every chapter, the house's own, in the
          places the client marked. They alternate sides so the page reads as
          a sequence of spreads rather than a column of text. */}
      <section className="story-v2-chapters">
        <div className="shell">
          {STORY.chapters.map((chapter, i) => {
            const photo = CHAPTER_PHOTOS[i];
            return (
              <article
                key={i}
                className={`story-v2-chapter${photo ? " has-photo" : ""}${i % 2 === 1 ? " is-flipped" : ""}`}
              >
                <Reveal className="story-v2-said">
                  <p className="label story-v2-no" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="display story-v2-heading">{chapter.heading[lang]}</h2>
                  <div className="story-v2-body">
                    {chapter.body.map((line, j) => (
                      <p key={j}>{line[lang]}</p>
                    ))}
                  </div>
                </Reveal>
                {photo && (
                  <Reveal variant="frame" delay={120} className="frame story-v2-photo">
                    <Image
                      src={photo.src}
                      alt={photo.alt[lang]}
                      width={photo.w}
                      height={photo.h}
                      sizes="(max-width: 899px) 100vw, 34rem"
                    />
                  </Reveal>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section story-v2-founder" aria-label={f.role[lang]}>
        <div className="shell story-v2-founder-inner">
          <Reveal variant="frame" className="frame story-v2-portrait">
            <Image
              src="/story/dahab.jpg"
              alt={f.alt[lang]}
              width={1442}
              height={2000}
              sizes="(max-width: 899px) 100vw, 30rem"
            />
          </Reveal>
          <Reveal delay={120} as="figure" className="story-v2-quote">
            <blockquote className="display">
              <p>{lang === "fr" ? `« ${f.quote.fr} »` : `“${f.quote.en}”`}</p>
            </blockquote>
            <figcaption>
              <span className="story-v2-name">{f.name}</span>
              <span className="label story-v2-role">{f.role[lang]}</span>
            </figcaption>
          </Reveal>
        </div>
      </section>
    </>
  );
}
