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
 * Booking stays on Airbnb. The two listing links are the client's own, taken
 * off their page with their share tracking intact, and the page says plainly
 * that the button leaves the site — a link that hands a visitor to a third
 * party should say so before it is clicked, not after.
 *
 * The photography is theirs, pulled from the same page. There are two images
 * for two apartments, so each apartment gets its own and nothing is reused to
 * suggest a room that was not photographed.
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

  return (
    <>
      <PageHead
        eyebrow={t.stay.eyebrow}
        heading={t.stay.heading}
        meta={`${PLACE.city}, ${PLACE.country[locale]}`}
        lede={t.stay.body[0]}
      />

      <section className="section stay">
        {/* The last text on light ground — the sundown is fitted below it. */}
        <div className="shell" data-descent-from="">
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
                    priority={i === 0}
                  />
                </Reveal>

                <Reveal delay={i * 100 + 80} className="stay-body">
                  <h2 className="display d-2 stay-name">{room.name}</h2>
                  <p className="prose stay-blurb">{room.blurb}</p>
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
    </>
  );
}
