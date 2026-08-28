import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import Newsletter from "@/components/Newsletter";
import PieceLabel from "@/components/PieceLabel";
import PieceFrame from "@/components/PieceFrame";
import { getDictionary, isLocale, type Locale } from "@/lib/dictionaries";
import {
  categories,
  featuredPieces,
  imagePath,
  loomShots,
  pieceBySlug,
  shopSelection,
} from "@/lib/catalog";
import { INSTAGRAM } from "@/lib/site";
import { instagramFrames, scene } from "@/lib/instagram";

/**
 * Homepage — the brief's sections, laid out along one day of light.
 *
 * The order is the brief's, with one addition the brief did not ask for and the
 * business needs: a shop grid after Mrirt. Everything above it curates — three
 * pieces hung apart, a statement, seven doorways — and none of it tells a
 * visitor they can buy something today.
 *
 * The order also solves the hardest problem on the page. The ground has to
 * travel from ecru to night, and between roughly #a08a6e and #6b4c39 NEITHER
 * dark ink nor cream is readable. So the descent is hidden behind the matter
 * wall, which is full-bleed and more than a viewport tall: while it holds the
 * screen, no ground is visible at all, and the sun goes down where it cannot be
 * watched. Everything after it — matter's own words, the letter, the footer —
 * stays at night. The page dims once and stays dimmed.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);

  /**
   * A whole object, not a fragment: a landscape original, so the full-bleed crop
   * keeps the entire comb rather than cutting into it the way every portrait
   * frame does.
   *
   * It is also the only frame that lets the header float. Its top band is bare
   * plaster and carries ink at 5.83:1, so the header needs no ground of its own
   * until the page scrolls. The lower half takes a light scrim for the hero
   * type — the blade's tip reaches into the headline corner, which is the one
   * place the plaster does not do the work for us.
   */
  const hero = pieceBySlug("antique-comb-used-for-weaving-moroccan-rugs");
  const heroSrc = imagePath(hero?.images[0]);

  /**
   * The hero is art-directed: a different photograph on a phone.
   *
   * The desktop frame is landscape, and a tall phone viewport has to crop it to
   * roughly a third of its width — the composition does not survive that. This
   * one is portrait (512×640) and was shot for the shape a phone actually is.
   * It is instagram/07.jpg, which the Instagram row does not use: only the
   * first six frames fill that row, so nothing appears twice on the page.
   *
   * Delivered through <picture> rather than two <Image>s hidden by CSS, so the
   * browser fetches ONE of them. This is the LCP element; a hidden second hero
   * is a real cost on the device this site is built for first.
   */
  const HERO_PHONE = { src: "/instagram/07.jpg", width: 512, height: 640 };

  /**
   * Empty alt, deliberately. <picture> carries one alt across both sources, and
   * the two photographs are of different things — any single sentence is wrong
   * on one of the two viewports. The photograph is a backdrop: the name, the
   * tagline and the intro sit in text on their own plate directly beneath it,
   * so nothing is lost by marking it decorative, whereas a mismatched
   * description would actively mislead.
   */
  const heroCommon = { alt: "", sizes: "100vw" as const, priority: true };
  const heroPhone = getImageProps({ ...heroCommon, ...HERO_PHONE }).props;
  const heroDesktop = heroSrc
    ? getImageProps({ ...heroCommon, src: heroSrc, width: 2000, height: 1333 }).props
    : null;
  const featured = featuredPieces();
  const cats = categories();
  const loom = loomShots();
  const shop = shopSelection(8, cats.map((c) => c.cover?.slug ?? ""));
  const feed = instagramFrames();

  const axes = [
    ["size", t.rugs.axes.size],
    ["colour", t.rugs.axes.colour],
    ["design", t.rugs.axes.design],
    ["texture", t.rugs.axes.texture],
  ] as const;

  return (
    <>
      {/* ---- 1. The work, and its plate.

           The photograph fills the screen; the type sits on a solid plate
           beneath it, the way a caption plate sits under a work on a wall.
           Scrimming type onto the photograph was tried three times and failed
           three times — each scrim was tuned to one image and collapsed the
           moment the image changed. The plate is independent of what is above
           it, so the hero photograph can be swapped freely. */}
      <section className="hero">
        <div className="hero-media">
          {heroDesktop && (
            <picture>
              <source media="(max-width: 767px)" srcSet={heroPhone.srcSet} />
              <source media="(min-width: 768px)" srcSet={heroDesktop.srcSet} />
              {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is on heroCommon */}
              <img {...heroDesktop} />
            </picture>
          )}
        </div>

        <div className="hero-plate">
          <Reveal as="div" className="hero-inner shell">
            <div>
              <h1 className="display d-hero hero-title">
                The Roots
                <br />
                Corner
              </h1>

              {/* Caption and action share a line, the way a wall label carries
                  its own instruction rather than stacking one beneath it. */}
              <div className="hero-line">
                <p className="hero-tagline label">{t.hero.tagline}</p>
                <a href="#selection" className="hero-cue label">
                  {t.hero.scrollCue}
                </a>
              </div>
            </div>

            <p className="hero-note">{t.hero.intro}</p>
          </Reveal>
        </div>
      </section>

      {/* ---- 2. A few pieces, hung at different heights. */}
      <section id="selection" className="section">
        <div className="shell">
          <Reveal>
            <p className="label">{t.selection.eyebrow}</p>
            <h2 className="display d-1 section-heading">{t.selection.heading}</h2>
          </Reveal>

          <ul className="hang">
            {featured.map((piece, i) => (
              <li key={piece.slug} className={`hang-item hang-${i + 1}`}>
                <Link
                  href={`/${locale}/piece/${piece.slug}`}
                  className="hang-link swap-host"
                >
                  <PieceFrame
                    piece={piece}
                    delay={i * 100}
                    width={1400}
                    height={2100}
                    sizes="(max-width: 700px) 84vw, (max-width: 1100px) 42vw, 30vw"
                  />
                  <Reveal delay={i * 100 + 80} className="hang-caption">
                    <PieceLabel
                      piece={piece}
                      locale={locale}
                      labels={t.pieceLabel}
                      variant="sell"
                    />
                  </Reveal>
                </Link>
              </li>
            ))}
          </ul>

          <Reveal className="hang-foot">
            <p className="hang-unique display d-3">{t.selection.unique}</p>
            <Link href={`/${locale}/collection`} className="link label">
              {t.selection.viewAll}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---- 3. Who this is.

           The founder's sentence is set at display size rather than as body
           copy — it is the only first-person claim on the page and the reason
           the collection exists, so it carries the section instead of floating
           in it. The supporting prose sits against it as a column, which also
           stops a short block of text stranding itself in a very wide field. */}
      {/* ---- 3. Who this is.

           Now with a room. This section was type on open ground, and the one
           thing it could not do was show what any of this is FOR. The evening
           alcove — pot, books, stool, lamp — is a piece of the collection in a
           house at night, which is the argument the words are making. */}
      <section className="section presentation-section">
        <div className="shell presentation">
          <Reveal as="p" className="label presentation-eyebrow">
            {t.presentation.eyebrow}
          </Reveal>

          <Reveal as="p" delay={70} className="display presentation-lead">
            {t.presentation.body[0]}
          </Reveal>

          <Reveal as="div" delay={130} className="presentation-body">
            {t.presentation.body.slice(1).map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </Reveal>

          {/* Instagram's files are 512x640. Held to roughly that width — a
              full-bleed band out of this source is a 2.8x upscale and looks
              exactly like one. See lib/instagram.ts. */}
          <Reveal variant="frame" delay={80} className="frame presentation-plate">
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
              sizes="(max-width: 939px) 88vw, 34vw"
            />
          </Reveal>
        </div>
      </section>

      {/* ---- 4a. Doorways into the collection, by what a thing actually is. */}
      <section className="section categories">
        <div className="shell">
          <Reveal>
            <p className="label">{t.categories.eyebrow}</p>
            <h2 className="display d-1 section-heading">{t.categories.heading}</h2>
          </Reveal>

          {/* The row split is data-driven: with seven categories the second row
              holds three, and each of those three is widened to fill the width
              rather than leaving a quarter of the row empty. */}
          <ul className={`doorways doorways-${cats.length}`}>
            {cats.map((cat, i) => {
              const src = imagePath(cat.cover?.images[0]);
              const label = t.categories.items[cat.slug] ?? cat.slug;
              return (
                <li key={cat.slug} className="doorway">
                  <Link href={`/${locale}/collection/${cat.slug}`} className="doorway-link">
                    <Reveal variant="frame" delay={(i % 4) * 80} className="frame frame-portrait">
                      {src && (
                        <Image
                          src={src}
                          alt=""
                          width={1200}
                          height={1600}
                          sizes="(max-width: 700px) 46vw, 22vw"
                        />
                      )}
                    </Reveal>
                    <span className="doorway-name display d-3">{label}</span>
                    <span className="doorway-count label">{cat.count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---- 4b. Mrirt — the rug, its specification, and its pile.

           Real photography at last, found on the client's own Mrirt page rather
           than in the product scrape: the woven piece with a weaving comb laid
           on it, and a macro of the pile.

           The pile macro is deliberately NOT used as a full-bleed band beneath
           this: at that width it read as carpet swatch, not as a piece. */}
      <section className="section rugs">
        <div className="shell rugs-inner">
          <Reveal className="rugs-head">
            <p className="label">{t.rugs.eyebrow}</p>
            <h2 className="display d-1 section-heading">{t.rugs.heading}</h2>
            <p className="lede rugs-lede">{t.rugs.body[0]}</p>
          </Reveal>

          <Reveal variant="frame" delay={80} className="frame rugs-frame">
            <Image
              src="/rugs/mrirt-rug.jpg"
              alt={
                locale === "fr"
                  ? "Tapis Mrirt en laine, plié, avec un peigne de tisserand posé dessus"
                  : "A folded Mrirt wool rug with a weaver’s comb laid on it"
              }
              width={1800}
              height={3200}
              sizes="(max-width: 940px) 100vw, 40vw"
            />
          </Reveal>

          <Reveal delay={140} className="rugs-plate">
            <dl className="rugs-axes">
              {axes.map(([key, name]) => (
                <div key={key} className="rugs-axis">
                  <dt className="label rugs-axis-key">{name}</dt>
                  <dd className="rugs-axis-value">
                    {locale === "fr" ? "Au choix" : "Yours to set"}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="prose rugs-axes-note">{t.rugs.axesNote}</p>
            <Link href={`/${locale}/mrirt`} className="link label rugs-cta">
              {t.rugs.cta}
            </Link>
          </Reveal>
        </div>

      </section>

      {/* ---- 4c. The shop.

           Everything above this point is curation: three pieces hung apart, a
           statement, seven doorways. None of it says you can buy today. This
           does — a plain grid of stock, one piece per category before any
           category repeats, priced.

           The label here is the `sell` variant: name and price, nothing else.
           Material and dimensions are real and they matter, but they answer a
           question asked on the piece page, and carrying them into a grid
           turned every tile into a catalogue entry. */}
      <section id="shop" className="section shop">
        <div className="shell">
          <Reveal className="shop-head">
            <div>
              <p className="label">{t.shop.eyebrow}</p>
              <h2 className="display d-1 section-heading">{t.shop.heading}</h2>
            </div>
            <Link href={`/${locale}/collection`} className="link label shop-all">
              {t.shop.cta}
            </Link>
          </Reveal>

          <ul className="shop-grid">
            {shop.map((piece, i) => (
              <li key={piece.slug} className="shop-item">
                <Link
                  href={`/${locale}/piece/${piece.slug}`}
                  className="shop-link swap-host"
                >
                  <PieceFrame
                    piece={piece}
                    delay={(i % 4) * 70}
                    width={1200}
                    height={1500}
                    sizes="(max-width: 640px) 46vw, (max-width: 1100px) 31vw, 23vw"
                  />
                  <Reveal delay={(i % 4) * 70 + 60} className="shop-caption">
                    <PieceLabel
                      piece={piece}
                      locale={locale}
                      labels={t.pieceLabel}
                      variant="sell"
                    />
                  </Reveal>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- 5. The Story.

           The section is one fact: she left Paris and stayed in Marrakech. So
           the structure states it — the two cities at either end of a rule that
           spans the full width of the page, with a filled mark at the Marrakech
           end because that is where she stopped. The rule is the distance,
           drawn at the width of the room.

           This replaces two overlapping photographs. The overlap was a device
           borrowed from elsewhere; a line between two place names is the
           content itself, and it belongs to no other brand.

           Her sentence is the only first person on the site and there is still
           no portrait of her, so it is set as a quotation at the scale a face
           would have had. */}
      <section className="section story">
        <div className="shell">
          <Reveal as="p" className="label story-eyebrow">
            {t.story.eyebrow}
          </Reveal>

          <Reveal delay={60} className="story-journey">
            <span className="story-place display d-3">Paris</span>
            <span className="story-rule" aria-hidden="true" />
            <span className="story-place story-place-here display d-3">Marrakech</span>
          </Reveal>

          <Reveal as="blockquote" delay={120} className="story-quote display">
            {t.story.body[0]}
          </Reveal>
        </div>

        <Reveal variant="frame" delay={80} className="frame story-band">
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

        {/* Two children, not one wrapper: a Reveal renders a single element, so
            a two-column rule on the parent would see one child and leave half
            the row empty. */}
        <div className="shell story-foot">
          <Reveal as="p" delay={60} className="prose story-after">
            {t.story.body[1]}
          </Reveal>
          <Reveal delay={140} className="story-cta">
            <Link href={`/${locale}/story`} className="link label">
              {t.story.cta}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---- 5b. Instagram — a feed, and it moves sideways.

           Rebuilt. The centred version stacked an eyebrow, a very large handle
           and a caption down the middle of the page, which is a poster, not a
           feed — and the page has no other centred block, so it read as a
           different site for one screen.

           This is the gesture instead. Instagram is a thing you push sideways,
           so the frames run off the right edge of the screen and keep going.
           The cut is honest: there IS more, and it is one tap away. It also
           means the section cannot rhyme with the matter wall below, which is
           full bleed, gapless and vertical.

           The frames come from docs/instagram.json (scripts/ig-fetch.mjs fills
           it). An empty manifest is a supported state — the section is then the
           header alone. */}
      <section className="section instagram">
        <div className="shell instagram-head">
          <Reveal className="instagram-said">
            <p className="label instagram-eyebrow">{t.instagram.eyebrow}</p>
            <a
              href={INSTAGRAM}
              className="instagram-handle display"
              target="_blank"
              rel="noreferrer noopener"
            >
              {t.instagram.handle}
            </a>
          </Reveal>

          <Reveal delay={90} className="instagram-aside">
            <p className="instagram-note">{t.instagram.heading}</p>
            <a
              href={INSTAGRAM}
              className="link label instagram-cta"
              target="_blank"
              rel="noreferrer noopener"
            >
              {t.instagram.cta}
            </a>
          </Reveal>
        </div>

        {feed.length > 0 && (
          <ul className="instagram-strip">
            {feed.map((frame, i) => (
              <li key={frame.file} className="instagram-cell">
                <a
                  href={frame.href}
                  className="instagram-tile"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Reveal variant="frame" delay={i * 60} className="frame frame-square">
                    <Image
                      src={frame.src}
                      alt={frame.alt ?? ""}
                      width={1080}
                      height={1080}
                      sizes="(max-width: 700px) 62vw, 22vw"
                    />
                  </Reveal>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---- 6. Matière — the room.

           This began as eight frames in a four-by-two grid, which is a contact
           sheet: nothing in it was big enough to look at and nothing led. It
           had that shape for a structural reason — it was tall and gapless so
           the sundown could hide behind it — and that reason is gone
           (components/Ground.tsx).

           It went to four, then to one. The band of three macro crops that
           survived the first cut was still a strip of fragments: at a third of
           the width each, hard-cropped, they read as swatches rather than as
           objects. Cut on the client's instruction, and the section is better
           for it.

           What is left is the argument itself: the words, and one whole room
           where these pieces actually live. */}
      <section className="section matter">
        <div className="shell matter-said">
          {/* Held to the source's own width, like the presentation plate. */}
          <Reveal variant="frame" delay={60} className="frame matter-room">
            <Image
              src={scene("room")}
              alt={
                locale === "fr"
                  ? "Une salle à manger : pièces posées sur des étagères de plâtre, table ronde, chaise noire"
                  : "A dining room: pieces set on plaster shelves, a round table, a black chair"
              }
              width={516}
              height={640}
              quality={90}
              sizes="(max-width: 759px) 92vw, 42vw"
            />
          </Reveal>

          <div className="matter-words">
            <Reveal className="matter-head">
              <p className="label">{t.materials.eyebrow}</p>
              <h2 className="display d-1 matter-heading">{t.materials.heading}</h2>
            </Reveal>
            <Reveal as="p" delay={90} className="matter-body">
              {t.materials.body}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- 7. Night. The letter.

           This replaces the "come and look properly" panel, which asked for
           nothing a visitor could act on. A rare piece is gone once it is gone;
           the only useful thing to offer at the end of the page is a way to
           hear about the next one first. */}
      <section className="section keep">
        <Newsletter t={t.newsletter} />
      </section>
    </>
  );
}
