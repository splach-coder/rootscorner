import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, pageMeta, og } from "@/lib/seo";
import { fill, getDictionary, isLocale, type Locale } from "@/lib/dictionaries";
import { groups, imagePath } from "@/lib/catalog";
import { COLLECTION } from "@/lib/copy-v2";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMeta({
    locale,
    path: "/collection",
    title: `${COLLECTION.title[locale]} | The Roots Corner`,
    description: t.meta.description,
    image: og("collection.jpg"),
  });
}

/**
 * La Collection — V2 (10 Oct).
 *
 * The client: "when visitors click on Collection, they should first discover a
 * selection of clearly defined categories", "no introductory paragraph", "the
 * page should immediately present the five categories through large editorial
 * photographs, their numbers and their titles". The N° numbering is kept (§20).
 * Mrirt rugs are not here: they have their own page.
 */
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);
  const list = groups();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "The Roots Corner", path: `/${locale}` },
          { name: COLLECTION.title[locale], path: `/${locale}/collection` },
        ])}
      />
      <section className="collection-head shell">
        <Reveal as="h1" className="display d-1 collection-title">
          {COLLECTION.title[locale]}
        </Reveal>
      </section>

      <section className="section collection-groups-section">
        <ul className="shell collection-groups">
          {list.map((g, i) => {
            const src = imagePath(g.cover?.images[0]);
            return (
              <li key={g.slug} className={`collection-group collection-group-${i + 1}`}>
                <Link href={`/${locale}/collection/${g.slug}`} className="collection-group-link">
                  <Reveal variant="frame" delay={(i % 3) * 90} className="frame collection-group-frame">
                    {src && (
                      <Image
                        src={src}
                        alt={g.name[locale]}
                        width={1400}
                        height={1750}
                        sizes={i < 2 ? "(max-width: 699px) 100vw, 50vw" : "(max-width: 699px) 100vw, 33vw"}
                      />
                    )}
                  </Reveal>
                  <span className="collection-group-said">
                    <span className="label collection-group-no">N° {g.no}</span>
                    <span className="display collection-group-name">{g.name[locale]}</span>
                    <span className="label collection-group-count">
                      {fill(g.count === 1 ? COLLECTION.countOne[locale] : COLLECTION.count[locale], { n: g.count })}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
