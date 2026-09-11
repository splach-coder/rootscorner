import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import Reveal from "@/components/Reveal";
import { getDictionary, isLocale, type Locale } from "@/lib/dictionaries";
import { apartments } from "@/lib/house";
import { PLACE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);

  return {
    title: `${t.stay.heading} — The Roots Corner`,
    description: t.stay.body[0],
    alternates: {
      canonical: `/${locale}/stay`,
      languages: { fr: "/fr/stay", en: "/en/stay", "x-default": "/fr/stay" },
    },
  };
}

/**
 * The apartments.
 *
 * A second business line the brief never mentioned and the commercial proposal
 * never priced — found on the client's live site. It is built here because the
 * house runs it, and a visitor who reads the whole site should not discover it
 * only on the old one.
 *
 * BOOKING IS A MESSAGE, NOT A PLATFORM. The two buttons were the client's own
 * listing links on a letting platform. They asked for the platform off the
 * site: a stay is arranged directly now, on the same WhatsApp number the rest
 * of the site uses, and the chat opens already naming the apartment. See
 * bookHref() in lib/house.ts — including what happens when no number is set.
 *
 * THE PHOTOGRAPHY. Each apartment keeps the one photograph it had on the
 * client's own page, because that pairing is sourced: those two frames sat with
 * those two listings and nothing here reassigns them. Everything else on this
 * page is a shoot of 29 frames from the client's Drive (§51) — 4000×6000, the
 * best interior photography the project has. It is shown as what it is, the
 * inside of the apartments, and NOT split between the two: nothing in the
 * folder says which flat any frame is in, and captioning one "Appartement II"
 * would invent it (§5).
 */
export default async function StayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);
  const rooms = apartments(locale as Locale);
  const inside = t.stay.inside;

  return (
    <>
      <PageHead
        eyebrow={t.stay.eyebrow}
        heading={t.stay.heading}
        meta={`${PLACE.city}, ${PLACE.country[locale]}`}
        lede={t.stay.body[0]}
      />

      {/* --- One room, the width of the page.

           The page opened on a paragraph. It has 29 frames of its own subject
           now, and the first thing a page about somewhere to stay should do is
           show the place. --- */}
      <section className="stay-opening">
        <Reveal variant="frame" className="frame stay-opening-frame">
          <Image
            src="/rooms/stay-living.jpg"
            alt={inside.living}
            width={1600}
            height={2400}
            priority
            sizes="100vw"
          />
        </Reveal>
      </section>

      <section className="section stay">
        <div className="shell">
          <Reveal className="stay-intro">
            <p className="prose">{t.stay.body[1]}</p>
          </Reveal>

          <ul className="stay-rooms">
            {rooms.map((room, i) => (
              <li key={room.key} className="stay-room">
                <Reveal variant="frame" delay={i * 100} className="frame stay-frame">
                  <Image
                    src={room.image.src}
                    alt={room.image.alt}
                    width={room.image.w}
                    height={room.image.h}
                    sizes="(max-width: 860px) 100vw, 46vw"
                  />
                </Reveal>

                <Reveal delay={i * 100 + 80} className="stay-body">
                  <h2 className="display d-2 stay-name">{room.name}</h2>
                  <p className="prose stay-blurb">{room.blurb}</p>
                  {/* Opens the chat with the apartment already named. External,
                      so it says where it goes before it is clicked. */}
                  <a
                    href={room.href}
                    className="label stay-book"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {t.stay.book}
                  </a>
                  <p className="label stay-note">{t.stay.note}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --- Inside.

           Three frames at three different sizes, hung rather than gridded —
           the composition this site uses everywhere it shows several things at
           once (§31). They are of the apartments and are captioned as nothing
           more specific than that: the folder does not say which flat any of
           them is in, and a label that guessed would be an invented fact about
           a room someone is about to book. --- */}
      <section className="section stay-inside">
        <div className="shell">
          <Reveal as="p" className="label stay-inside-key">
            {inside.eyebrow}
          </Reveal>

          <ul className="stay-sheet">
            <li className="stay-plate stay-plate-1">
              <Reveal variant="frame" delay={0} className="frame">
                <Image
                  src="/rooms/stay-kitchen.jpg"
                  alt={inside.kitchen}
                  width={1600}
                  height={2400}
                  sizes="(max-width: 800px) 90vw, 34vw"
                />
              </Reveal>
            </li>
            <li className="stay-plate stay-plate-2">
              <Reveal variant="frame" delay={110} className="frame">
                <Image
                  src="/rooms/stay-shower.jpg"
                  alt={inside.shower}
                  width={1600}
                  height={2400}
                  sizes="(max-width: 800px) 60vw, 24vw"
                />
              </Reveal>
            </li>
            <li className="stay-plate stay-plate-3">
              <Reveal variant="frame" delay={220} className="frame">
                <Image
                  src="/rooms/stay-candle.jpg"
                  alt={inside.candle}
                  width={1600}
                  height={2400}
                  sizes="(max-width: 800px) 90vw, 30vw"
                />
              </Reveal>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
