import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import HeroMedia from "@/components/HeroMedia";
import DragScroll from "@/components/DragScroll";
import RugSlider, { type RugSlide } from "@/components/RugSlider";
import { allRugSeries, formatEuro, fromPrice, seriesLine, seriesTitle } from "@/lib/rugs";
import { rugLabels } from "@/lib/rug-labels";
import { getDictionary, isLocale, type Locale } from "@/lib/dictionaries";
import { featuredPieces, formatPrice, imagePath, pieceBySlug, RUG_DEMO, WOVEN_RUGS } from "@/lib/catalog";
import { displayName } from "@/lib/specs";
import { INSTAGRAM } from "@/lib/site";
import { instagramFrames } from "@/lib/instagram";
import { HOME } from "@/lib/copy-v2";

/* Out of search while placeholder rug photographs are on the page (RUG_DEMO). */
export function generateMetadata(): Metadata {
  return RUG_DEMO ? { robots: { index: false, follow: true } } : {};
}

/**
 * Homepage — V2 (10 Oct 2026).
 *
 * The client's order, one purpose per section and no story told twice:
 * HERO → MRIRT → COLLECTION → NOTRE HISTOIRE → INSTAGRAM → FOOTER.
 * ("Séjourner à Marrakech" is removed with the apartments page; the
 * newsletter moved into the footer.) Each section is a small heading, one
 * sentence, one action, and photography doing the rest.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale as Locale;
  const t = getDictionary(lang);
  const rl = rugLabels(lang);
  const feed = instagramFrames();

  // The rugs: every collection, then the rugs already woven (with their price).
  const rugSlides: RugSlide[] = [
    ...allRugSeries().flatMap((series) => {
      const img = series.images[0];
      if (!img) return [];
      const from = fromPrice(series);
      const title = seriesTitle(series, locale);
      return [
        {
          key: series.handle,
          href: `/${locale}/tapis/${series.handle}`,
          src: img.src,
          swap: series.images[1]?.src ?? null,
          w: img.w,
          h: img.h,
          alt: `${rl.rugName} ${title}`,
          kind: rl.collectionWord,
          name: title,
          line: seriesLine(series, locale),
          price: from !== null ? `${rl.from} ${formatEuro(from, locale)}` : rl.onRequest,
        },
      ];
    }),
    ...WOVEN_RUGS.map((woven) => {
      const key = woven.id as keyof typeof t.mrirtPage.woven.items;
      const piece = woven.slug ? pieceBySlug(woven.slug) : undefined;
      const price = piece ? formatPrice(piece, locale) : null;
      return {
        key: `woven-${woven.id}`,
        href: woven.slug ? `/${locale}/piece/${woven.slug}` : `/${locale}/mrirt#disponibles`,
        src: woven.src,
        w: woven.width,
        h: woven.height,
        alt: woven.name?.[lang] ?? t.mrirtPage.woven.alts[key],
        kind: rl.availableWord,
        name: woven.name?.[lang] ?? t.mrirtPage.woven.items[key],
        line: null,
        price: price ?? rl.onRequest,
      };
    }),
  ];

  // The collection: two large photographs, placed as a spread.
  const [lead, second] = featuredPieces();
  const leadSrc = imagePath(lead?.images[0]);
  const secondSrc = imagePath(second?.images[0]);

  return (
    <>
      {/* ---- 1. Hero: the photograph and one line, centred. */}
      <section className="hero hero-v2">
        <div className="hero-media">
          <HeroMedia src="/place/hanging-cloth.jpg" width={2000} height={3000} />
        </div>
        <div className="hero-plate">
          <div className="hero-inner shell">
            <div>
              <h1 className="display hero-title hero-v2-title">{HOME.heroTitle[lang]}</h1>
              {/* V3: no sentence under the line; one quiet way in, after
                  HOMURA's hero, a hairline frame around the words. */}
              <Link href={`/${locale}/collection`} className="label hero-v2-cta">
                {HOME.heroCta[lang]}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 2. Tapis Mrirt: the first world after the hero. */}
      <section className="section home-block home-rugs" aria-labelledby="home-rugs-title">
        <div className="shell home-block-head">
          <Reveal>
            <h2 id="home-rugs-title" className="label home-block-label">
              {HOME.rugs.label[lang]}
            </h2>
            <p className="display home-block-line">{HOME.rugs.body[lang]}</p>
          </Reveal>
          <Reveal delay={80}>
            <Link href={`/${locale}/mrirt`} className="link label home-block-cta">
              {HOME.rugs.cta[lang]}
            </Link>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <RugSlider slides={rugSlides} labels={{ prev: rl.prev, next: rl.next, region: t.nav.rugs }} />
        </Reveal>
      </section>

      {/* ---- 3. La Collection: one cohesive section, a spread of two large
           photographs with the words between them. */}
      <section className="section home-block home-collection" aria-labelledby="home-collection-title">
        <div className="shell home-spread">
          {lead && leadSrc && (
            <Link href={`/${locale}/piece/${lead.slug}`} className="home-spread-lead">
              <Reveal variant="frame" className="frame home-spread-frame home-spread-frame-lead">
                <Image
                  src={leadSrc}
                  alt={displayName(lead, lang)}
                  width={lead.images[0].w}
                  height={lead.images[0].h}
                  sizes="(max-width: 699px) 100vw, 56vw"
                />
              </Reveal>
            </Link>
          )}
          <div className="home-spread-side">
            <Reveal className="home-spread-said">
              <h2 id="home-collection-title" className="label home-block-label">
                {HOME.collection.label[lang]}
              </h2>
              <p className="display home-block-line">{HOME.collection.body[lang]}</p>
              <Link href={`/${locale}/collection`} className="link label home-block-cta">
                {HOME.collection.cta[lang]}
              </Link>
            </Reveal>
            {second && secondSrc && (
              <Link href={`/${locale}/piece/${second.slug}`} className="home-spread-second">
                <Reveal variant="frame" delay={120} className="frame home-spread-frame">
                  <Image
                    src={secondSrc}
                    alt={displayName(second, lang)}
                    width={second.images[0].w}
                    height={second.images[0].h}
                    sizes="(max-width: 699px) 100vw, 38vw"
                  />
                </Reveal>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ---- 4. Notre histoire: the origins, with a photograph of Morocco. */}
      <section className="section home-block home-story" aria-labelledby="home-story-title">
        <div className="shell home-story-inner">
          <Reveal className="home-story-said">
            <h2 id="home-story-title" className="label home-block-label">
              {HOME.story.label[lang]}
            </h2>
            <p className="display home-block-line">{HOME.story.body[lang]}</p>
            <Link href={`/${locale}/story`} className="link label home-block-cta">
              {HOME.story.cta[lang]}
            </Link>
          </Reveal>
          <Reveal variant="frame" delay={100} className="frame home-story-frame">
            <Image
              src="/place/city-dusk.jpg"
              alt={lang === "fr" ? "Marrakech au crépuscule, un minaret sur le ciel" : "Marrakech at dusk, a minaret against the sky"}
              width={1333}
              height={2000}
              sizes="(max-width: 699px) 100vw, 44vw"
            />
          </Reveal>
        </div>
      </section>

      {/* ---- 5. Instagram: small and simple. */}
      <section className="section home-block home-instagram" aria-labelledby="home-instagram-title">
        <div className="shell home-block-head">
          <Reveal>
            <h2 id="home-instagram-title" className="display home-instagram-title">
              {HOME.instagram.heading[lang]}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <a href={INSTAGRAM} className="link label home-block-cta" target="_blank" rel="noreferrer noopener">
              {HOME.instagram.cta[lang]}
            </a>
          </Reveal>
        </div>
        {feed.length > 0 && (
          <DragScroll className="instagram-strip">
            {feed.map((frame, i) => (
              <li key={frame.file} className="instagram-cell">
                <a href={frame.href} className="instagram-tile" target="_blank" rel="noreferrer noopener">
                  <Reveal variant="frame" delay={i * 60} className="frame frame-square">
                    <Image src={frame.src} alt={frame.alt ?? ""} width={1080} height={1080} sizes="(max-width: 700px) 62vw, 22vw" />
                  </Reveal>
                </a>
              </li>
            ))}
          </DragScroll>
        )}
      </section>
    </>
  );
}
