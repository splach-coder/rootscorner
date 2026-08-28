import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import Reveal from "@/components/Reveal";
import { getDictionary, isLocale, type Locale } from "@/lib/dictionaries";
import { ARTISAN_SHOTS, artisanPlaces } from "@/lib/house";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);

  return {
    title: `${t.artisans.heading} — The Roots Corner`,
    description: t.artisans.body,
    alternates: {
      canonical: `/${locale}/artisans`,
      languages: {
        fr: "/fr/artisans",
        en: "/en/artisans",
        "x-default": "/fr/artisans",
      },
    },
  };
}

/**
 * The artisans.
 *
 * This is the brief's §6 — "images de matières, artisans, voyages ou lieux" —
 * which CLAUDE.md §13 lists as content the client owes. It turns out they had
 * already written it, on a page nobody mentioned.
 *
 * The client gives one paragraph and three place names, and that is what the
 * page says. It is deliberately short: there is nothing else sourced, and a
 * page about paying tribute to artisans is the last place to start inventing
 * their story (CLAUDE.md §5).
 *
 * THE PHOTOGRAPHS ARE NOT CAPTIONED WITH THE PLACES. The images carry no labels
 * on the live site, so pairing a face or a workshop with one of the three
 * countries would be inventing a provenance for a person. The places are listed
 * as a set; the photographs stand as photographs.
 */
export default async function ArtisansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);
  const places = artisanPlaces(locale as Locale);

  return (
    <>
      <PageHead
        eyebrow={t.artisans.eyebrow}
        heading={t.artisans.heading}
        lede={t.artisans.body}
      />

      <section className="section artisans">
        <div className="shell" data-descent-from="">
          <Reveal className="artisans-places">
            <p className="label artisans-key">{t.artisans.placesEyebrow}</p>
            <ul className="artisans-list">
              {places.map((place) => (
                <li key={place.key} className="display d-2 artisans-place">
                  {place.name}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Full bleed, no gaps, nothing written over them — the same rule the
            homepage's matter wall follows, and for the same reason: the ground
            runs its descent behind these. */}
        <ul className="artisans-wall">
          {ARTISAN_SHOTS.map((shot, i) => (
            <li key={shot.src} className="artisans-pane">
              <Reveal variant="frame" delay={i * 90} className="frame artisans-frame">
                <Image
                  src={shot.src}
                  alt=""
                  width={shot.w}
                  height={shot.h}
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
