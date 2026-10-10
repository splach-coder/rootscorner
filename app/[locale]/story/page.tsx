import Image from "next/image";
import { pageMeta, og } from "@/lib/seo";
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
    title: `${STORY.eyebrow[lang]} | The Roots Corner`,
    description: `${STORY.chapters[0].body[0][lang]} ${STORY.chapters[0].body[1][lang]}`.slice(0, 155),
    image: og("story.jpg"),
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
export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale as Locale;
  const f = STORY.founder;

  return (
    <>
      <section className="story-v2-head">
        <div className="shell">
          <Reveal>
            <p className="label story-v2-eyebrow">The Roots Corner</p>
            <h1 className="display d-1 story-v2-title">{STORY.eyebrow[lang]}</h1>
          </Reveal>
        </div>
      </section>

      <section className="story-v2-chapters">
        <div className="shell">
          {STORY.chapters.map((chapter, i) => (
            <Reveal key={i} as="article" className="story-v2-chapter">
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
          ))}
        </div>
      </section>

      <section className="section story-v2-founder" aria-label={f.role[lang]}>
        <div className="shell story-v2-founder-inner">
          <Reveal variant="frame" className="frame story-v2-portrait">
            <Image
              src="/story/dahab.jpg"
              alt={f.alt[lang]}
              width={1387}
              height={2080}
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
