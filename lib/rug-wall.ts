import type { RugTile } from "@/components/RugBrowser";
import { RUG_SHOTS, WOVEN_RUGS, allPieces, formatPrice, isIllustration, pieceBySlug } from "@/lib/catalog";
import { getDictionary, type Locale } from "@/lib/dictionaries";
import { rugLabels } from "@/lib/rug-labels";
import { allRugSeries, colourName, formatEuro, isIllustrativeSeries, seriesLine, seriesRugType, seriesTitle } from "@/lib/rugs";

/**
 * The rug wall's contents: one tile per colourway of every collection woven
 * to order, then the rugs already woven. Shared by /mrirt (every rug) and the
 * pages of each kind (V5), which pass `rugType` to keep only theirs.
 *
 * A colourway without its own photograph takes the collection's photographs in
 * turn, so the wall does not repeat one frame.
 */
export function rugWall(locale: Locale, rugType?: string) {
  const t = getDictionary(locale);
  const rl = rugLabels(locale);
  const series = allRugSeries().filter((sr) => !rugType || seriesRugType(sr) === rugType);

  const tiles: RugTile[] = [
    ...WOVEN_RUGS.filter((woven) => !rugType || woven.rugType === rugType).map((woven) => {
      const key = woven.id as keyof typeof t.mrirtPage.woven.items;
      const name = woven.name?.[locale] ?? t.mrirtPage.woven.items[key];
      const piece = woven.slug ? pieceBySlug(woven.slug) : undefined;
      return {
        key: `woven-${woven.id}`,
        href: woven.slug ? `/${locale}/piece/${woven.slug}` : `/${locale}/mrirt#sur-mesure`,
        src: woven.src,
        w: woven.width,
        h: woven.height,
        alt: name,
        kind: "ready" as const,
        collection: "",
        name,
        detail: null,
        price: (piece && formatPrice(piece, locale)) || rl.onRequest,
      };
    }),
    ...series.flatMap((sr) => {
      const title = seriesTitle(sr, locale);
      return sr.colours.map((c, i) => {
        const img = c.image
          ? { src: c.image, w: sr.images[0]?.w ?? 1600, h: sr.images[0]?.h ?? 2000 }
          : sr.images[i % Math.max(1, sr.images.length)];
        const from = isIllustrativeSeries(sr)
          ? []
          : sr.variants.filter((v) => v.colour === c.name && v.price > 0).map((v) => v.price);
        const colour = colourName(c.name, locale);
        return {
          key: `${sr.handle}-${c.name}`,
          href: `/${locale}/tapis/${sr.handle}?couleur=${encodeURIComponent(c.name)}`,
          src: img?.src ?? "",
          w: img?.w ?? 1600,
          h: img?.h ?? 2000,
          alt: `${rl.rugName} ${title}, ${colour}`,
          kind: "order" as const,
          collection: sr.handle,
          name: title,
          detail: colour,
          price: from.length ? `${rl.from} ${formatEuro(Math.min(...from), locale)}` : rl.onRequest,
        };
      });
    }),
  ].filter((tile) => tile.src);

  return {
    tiles,
    series,
    collections: series.map((sr) => ({ handle: sr.handle, name: seriesTitle(sr, locale) })),
    collectionNotes: Object.fromEntries(series.map((sr) => [sr.handle, seriesLine(sr, locale) ?? ""])),
  };
}

/** The rugs page's own opening photograph: the house's, a rug by a fire. */
export const RUGS_COVER = { src: "/rugs/series/floor-fire.jpg", w: 1600, h: 2400 };

/**
 * A photograph for one kind in the header's menu: the first of its rugs that is
 * the house's own (never a placeholder marked "Photo d'illustration"). Mrirt
 * falls back to the house's own Mrirt rug (RUG_SHOTS.rug); a kind with no rug
 * has none, rather than another kind's rug standing in for it.
 */
export function rugTypeCover(slug: string): { src: string; w: number; h: number } | null {
  const own = (images: { src: string; w: number; h: number; alt?: string | null }[]) =>
    images.find((i) => !isIllustration(i.alt));
  for (const sr of allRugSeries().filter((s) => seriesRugType(s) === slug)) {
    const img = own(sr.images);
    if (img) return { src: img.src, w: img.w, h: img.h };
  }
  for (const piece of allPieces().filter((p) => p.category === "rugs" && p.rugType === slug && !p.illustrative)) {
    const img = piece.images[0];
    if (img?.src) return { src: img.src, w: img.w, h: img.h };
  }
  return slug === "mrirt" ? { src: RUG_SHOTS.rug, w: 1800, h: 3200 } : null;
}
