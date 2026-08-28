/**
 * Catalogue access.
 *
 * Reads the scrape of the client's live inventory (docs/catalog.json) joined to
 * the downloaded photography (docs/images.json). This is the interim source of
 * truth for layout work; once the Shopify store is populated, this module is the
 * single place that swaps over to the Storefront API — every component consumes
 * `Piece`, not the JSON shape.
 *
 * Nothing here derives, guesses, or fills in a missing field. If the client's
 * copy does not state an origin or an era, neither do we (CLAUDE.md §5).
 */

import rawCatalog from "@/docs/catalog.json";
import rawImages from "@/docs/images.json";

/**
 * `w`/`h` are the photograph's own pixel size, measured by
 * scripts/image-dims.mjs. The piece page shows each image at its own
 * proportion rather than cropped to a house ratio — ratios in this set run
 * 0.56 to 1.50, so any single ratio would cut most of them.
 */
export type PieceImage = { file: string; original: string; w: number; h: number };

export type Piece = {
  slug: string;
  /**
   * Position in the client's own catalogue, 1-based. Shown as an accession
   * number — it is a place in a list, and claims nothing about the object.
   */
  index: number;
  /** Presentational title case. The underlying record is left untouched. */
  name: string;
  price: number | null;
  currency: string;
  category: string;
  images: PieceImage[];
  /**
   * The second view shown on hover. Chosen by scripts/pick-swap.py as the image
   * that differs most from the primary at the same orientation — image[1] is
   * often nearly the same frame, and crossfading to it looks like a glitch
   * rather than a second look.
   */
  swapImage: PieceImage | null;
  dimensions: string | null;
  /**
   * Every piece is one of a kind, so stock is effectively quantity 1 and
   * "sold" is a normal, frequent state rather than an edge case
   * (CLAUDE.md §6). It is carried on the type so no page can forget it.
   */
  available: boolean;
  /**
   * The client's stated delivery window, verbatim. Their product pages and
   * their FAQ contradict each other (CLAUDE.md §9.3), so this is shown as the
   * product record's own words and never restated as a site-wide promise.
   */
  delivery: string | null;
  description: string[];
  details: string[];
  care: string[];
};

type RawCatalogEntry = {
  url: string;
  category: string;
  name?: string;
  price?: string | number | null;
  currency?: string;
  dimensions?: string;
  availability?: string;
  delivery?: string;
  description?: string[];
  details?: string[];
  care?: string[];
};

type RawImageEntry = { images?: PieceImage[]; swap?: number };

/**
 * The client's product names are entered inconsistently — "ANTIQUE MOROCCAN
 * VASE", "antique moroccan pot", "Dogon STOOL". Normalising the case is a
 * presentation decision and changes no fact. Small connecting words stay lower
 * case unless they lead; anything already mixed-case (an acronym, a proper
 * spelling the client chose) is preserved.
 */
const MINOR = new Set([
  "a", "an", "and", "as", "at", "by", "for", "from", "in", "of", "on",
  "or", "the", "to", "with", "de", "du", "des", "et", "la", "le", "les",
]);

function titleCase(input: string): string {
  const cleaned = input.trim().replace(/\s+/g, " ");

  return cleaned
    .toLowerCase()
    .split(" ")
    .map((word, i) => {
      if (i > 0 && MINOR.has(word)) return word;
      return (
        word
          // First letter of the word, wherever it sits: "(s" → "(S".
          .replace(/[a-zà-ÿ]/, (ch) => ch.toUpperCase())
          // And after an internal hyphen or apostrophe: "d'ivoire" → "d'Ivoire".
          .replace(/([-'’])([a-zà-ÿ])/g, (_m, sep, ch) => sep + ch.toUpperCase())
      );
    })
    .join(" ");
}

function toNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

const imagesBySlug = rawImages as Record<string, RawImageEntry>;

function slugOf(url: string): string {
  return url.replace(/\/+$/, "").split("/").pop() ?? "";
}

const pieces: Piece[] = (rawCatalog as RawCatalogEntry[]).map((entry, i) => {
  const slug = slugOf(entry.url);
  return {
    slug,
    index: i + 1,
    name: titleCase(entry.name ?? slug.replace(/-/g, " ")),
    price: toNumber(entry.price),
    currency: entry.currency ?? "EUR",
    category: entry.category,
    images: imagesBySlug[slug]?.images ?? [],
    swapImage: (() => {
      const record = imagesBySlug[slug];
      const index = record?.swap;
      if (record?.images && typeof index === "number") return record.images[index] ?? null;
      return null;
    })(),
    dimensions: entry.dimensions ?? null,
    available: entry.availability !== "OutOfStock",
    delivery: entry.delivery ?? null,
    description: entry.description ?? [],
    details: entry.details ?? [],
    care: entry.care ?? [],
  };
});

export function allPieces(): Piece[] {
  return pieces;
}

/**
 * The whole collection, interleaved by room.
 *
 * Source order is the scrape's order, which is grouped by category — so a grid
 * of all 38 opens with twelve consecutive stools, and the first screen says
 * "this shop sells stools". Round-robining the rooms means the first row is a
 * stool, an African piece, an object, and the eye gets the range immediately.
 *
 * Rooms keep their own order (largest first, as `categories()` sorts them), so
 * this is a re-interleave rather than a shuffle: it is stable across builds and
 * a piece is always in the same place.
 */
export function collectionOrder(): Piece[] {
  const byRoom = new Map<string, Piece[]>();
  for (const piece of pieces) {
    const list = byRoom.get(piece.category) ?? [];
    list.push(piece);
    byRoom.set(piece.category, list);
  }

  const order = categories().map((c) => byRoom.get(c.slug) ?? []);
  const out: Piece[] = [];
  for (let round = 0; out.length < pieces.length; round += 1) {
    for (const room of order) {
      if (room.length > round) out.push(room[round]);
    }
  }
  return out;
}

export function pieceBySlug(slug: string): Piece | undefined {
  return pieces.find((p) => p.slug === slug);
}

export function piecesByCategory(category: string): Piece[] {
  return pieces.filter((p) => p.category === category);
}

/**
 * Categories that actually hold stock, largest first.
 *
 * Covers skip anything already shown in the featured hang above, so the same
 * object never appears twice on one screen.
 */
export function categories(): { slug: string; count: number; cover: Piece | undefined }[] {
  const spokenFor = new Set<string>(FEATURED_SLUGS);
  const counts = new Map<string, Piece[]>();
  for (const p of pieces) {
    const list = counts.get(p.category) ?? [];
    list.push(p);
    counts.set(p.category, list);
  }
  return [...counts.entries()]
    .map(([slug, list]) => {
      const withPhoto = list.filter((p) => p.images.length > 0);
      return {
        slug,
        count: list.length,
        cover: withPhoto.find((p) => !spokenFor.has(p.slug)) ?? withPhoto[0],
      };
    })
    .sort((a, b) => b.count - a.count);
}

export function imagePath(image: PieceImage | undefined): string | null {
  return image ? `/pieces/${image.file}` : null;
}

export function formatPrice(piece: Piece, locale: string): string | null {
  if (piece.price === null) return null;
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: piece.currency || "EUR",
    maximumFractionDigits: 0,
  }).format(piece.price);
}

/**
 * Hand-picked for the homepage.
 *
 * Chosen for silhouette contrast — dark carved wood, then pale ceramic, then
 * dark wood again — so the three read as distinct objects rather than a set.
 * Kept as slugs so the choice is reviewable and easy for the client to change.
 */
export const FEATURED_SLUGS = [
  "dogon-tribal-staff",
  "handmade-pottery-vase-made-in-morocco",
  "baule-chair-cote-d-ivoire",
] as const;

export function featuredPieces(): Piece[] {
  return FEATURED_SLUGS.map((slug) => pieceBySlug(slug)).filter(
    (p): p is Piece => Boolean(p && p.images.length),
  );
}

/**
 * The shop rail.
 *
 * The homepage hang is a curated three; this is the opposite job — it has to
 * read as stock a buyer can take home today, which means priced pieces, one
 * per category before any category repeats, so eight tiles never turn out to be
 * eight variations of the same stool.
 *
 * Priced first, then unpriced, because a tile with no price cannot be sold from
 * the grid. Anything already on the page above is skipped.
 */
export function shopSelection(count = 8, exclude: string[] = []): Piece[] {
  const skip = new Set([...FEATURED_SLUGS, ...exclude]);
  const pool = pieces.filter((p) => p.images.length > 0 && !skip.has(p.slug));

  const byCategory = new Map<string, Piece[]>();
  for (const p of pool) {
    const list = byCategory.get(p.category) ?? [];
    list.push(p);
    byCategory.set(p.category, list);
  }
  // Priced pieces lead within every category.
  for (const list of byCategory.values()) {
    list.sort((a, b) => Number(b.price !== null) - Number(a.price !== null));
  }

  // Round-robin the categories so the rail stays mixed all the way across.
  const queues = [...byCategory.values()];
  const out: Piece[] = [];
  let round = 0;
  while (out.length < count && queues.some((q) => q.length > round)) {
    for (const q of queues) {
      if (out.length >= count) break;
      if (q.length > round) out.push(q[round]);
    }
    round += 1;
  }
  return out.slice(0, count);
}

/**
 * The Mrirt section's photography.
 *
 * There is no photograph of a rug anywhere in the 212 files, and a Mrirt rug is
 * handwoven to order — it does not exist until it is asked for. So the section
 * shows the instrument instead: the client's own antique Berber weaving comb,
 * flat and then close. Both frames are used at their native ratio so nothing is
 * cropped.
 *
 * Nothing here may be captioned or described as a rug. When the client supplies
 * real rug photography (CLAUDE.md §13) it replaces the plate, and the comb can
 * stay on as the detail.
 */
/**
 * Mrirt rug photography, from the client's own live site (therootscorner.com —
 * provenance recorded in docs/site-images.json). These arrived after the
 * homepage's Mrirt section was built, and they retire the premise it was built
 * on: the page no longer has to stand in the instrument for the rug, because
 * there is now a rug to show.
 *
 * `pile` is the trimmed copy. The original carries an 8px border baked into the
 * JPEG, which reads as a hard frame against the ecru ground — every other
 * photograph on this site is frameless. The untrimmed original is kept beside
 * it; never overwrite a client source in place.
 */
export const RUG_SHOTS = {
  /** The pile with the weaving comb resting on it. 1800×3200. */
  rug: "/rugs/mrirt-rug.jpg",
  /** Macro of the wool. 784×784 after trimming an 8px baked-in border. */
  pile: "/rugs/mrirt-pile-trim.jpg",
  /** The rug in a room — the only shot on the page that carries scale. 1206×1889. */
  room: "/rugs/mrirt-room.jpg",
} as const;

/**
 * Rugs that are already woven, and therefore actually for sale.
 *
 * Mrirt rugs are made to order, so the Mrirt page has never sold anything. The
 * client wants to offer finished rugs alongside that, which is a second product
 * line rather than a change to the first — so it reads from the catalogue like
 * any other room, and the page shows whichever of the two is true today.
 *
 * IT IS EMPTY, AND THAT IS NOT A BUG. There is no rug in the 38-product scrape:
 * a search for rug · tapis · carpet · kilim · weav · wool across every field
 * returns exactly one hit, and it is the antique weaving comb. Ready-made rugs
 * would have to be invented — name, price, size, photographs — and inventing
 * stock on a shop is the most damaging form of the thing §5 forbids, because a
 * visitor would try to buy it.
 *
 * To fill it, add entries to docs/catalog.json with `category: "rugs"` (and
 * their photography to docs/images.json). Nothing else needs changing: the
 * section, the cards, the piece pages and the collection room all appear on
 * their own. Once the Shopify Storefront API replaces this module, the same is
 * true of a "rugs" collection there.
 */
/**
 * Finished rugs the client has actually photographed.
 *
 * These are real Mrirt rugs from the client's own site — three different ones,
 * cream by a fire, cream with dark markings on a stone floor, and the caramel
 * pile close up. They are shown as woven work, NOT as priced stock:
 *
 *   - no price. There is none published, and a price is the single most
 *     damaging thing to invent on a shop — a visitor acts on it.
 *   - no dimensions, no stock state, no piece page. Whether any of these is
 *     still available is not something the photographs tell us.
 *
 * So each card leads to the enquiry, which is how a dealer with unpriced
 * one-off stock actually sells. The moment the client supplies names, prices,
 * sizes and availability, put them in docs/catalog.json under
 * `category: "rugs"` and readyRugs() takes over the shelf automatically —
 * with real cards, real prices and real piece pages.
 */
export type WovenRug = { id: string; src: string; width: number; height: number };

export const WOVEN_RUGS: WovenRug[] = [
  /* Cropped from interior-fire.jpg to the bottom of the frame: a centred card
     crop lands on the fireplace and turns the rug into a footnote. */
  { id: "fire", src: "/rugs/rug-fire-card.jpg", width: 1800, height: 2250 },
  { id: "pile", src: "/rugs/mrirt-pile-trim.jpg", width: 784, height: 784 },
];

/* Two, not three. mrirt-room.jpg was the obvious third, but its rug sits in the
   bottom sixth of the frame — every card crop of it is a photograph of a floor.
   Two real rugs beat three where one is not really there. */

export const RUGS_CATEGORY = "rugs";

export function readyRugs(): Piece[] {
  return piecesByCategory(RUGS_CATEGORY).filter((piece) => piece.images.length > 0);
}

export const LOOM_SLUG = "antique-comb-used-for-weaving-moroccan-rugs";

/** 0 is the only landscape frame in the set; 6 is the macro of the engraving. */
export const LOOM_SHOTS = { plate: 0, detail: 6 } as const;

export function loomShots(): { plate: string; detail: string } | null {
  const piece = pieceBySlug(LOOM_SLUG);
  const plate = imagePath(piece?.images[LOOM_SHOTS.plate]);
  const detail = imagePath(piece?.images[LOOM_SHOTS.detail]);
  return plate && detail ? { plate, detail } : null;
}

/**
 * Close crops of surface and edge, used in the "matter" section. These are the
 * client's own detail photographs of real pieces — the patina shown is the
 * patina that piece has.
 */
/**
 * The matter wall.
 *
 * Eight frames, two courses of four, alternating what the surface is made of —
 * wood, iron, raw clay, glaze — so no two neighbours are the same material.
 * The wall crops hard, which is the point: at this width every photograph
 * becomes a surface rather than an object.
 *
 * Eight rather than four because the wall now has to hold the screen for more
 * than a viewport of scrolling — that is what hides the sundown (page.tsx).
 * Four frames could not be made tall enough without slitting them.
 */
export const MATERIAL_SHOTS = [
  { slug: "solid-wood-pedestal-bowl---ethiopian-and-west-african-craftsmanship-1", index: 1 },
  { slug: "tuareg-tent-stakes", index: 4 },
  { slug: "handmade-blackened-clay-pot---morocco", index: 1 },
  { slug: "handmade-ceramic-candlestick-tamgroute", index: 3 },
  { slug: "ancient-african-mortar", index: 2 },
  { slug: "antique-moroccan-vase", index: 5 },
  { slug: "solid-wood-pedestal-bowl---ethiopian-and-west-african-craftsmanship-1", index: 7 },
  { slug: "loom-beater-african-art", index: 4 },
] as const;

export function materialShots(): { piece: Piece; src: string }[] {
  return MATERIAL_SHOTS.flatMap(({ slug, index }) => {
    const piece = pieceBySlug(slug);
    const src = imagePath(piece?.images[index] ?? piece?.images[0]);
    return piece && src ? [{ piece, src }] : [];
  });
}

/* ------------------------------------------------------------------ *
 * Navigating between rooms
 * ------------------------------------------------------------------ */

/**
 * Category slugs in the order the rooms are presented, largest first — the
 * same order the homepage doorways use, so a visitor moving between the two
 * finds them where they left them.
 */
export function categorySlugs(): string[] {
  return categories().map((c) => c.slug);
}

export function hasCategory(slug: string): boolean {
  return pieces.some((p) => p.category === slug);
}

/**
 * Other pieces from the same room, for the foot of a piece page. Falls back to
 * the rest of the catalogue when a room holds only the piece being looked at —
 * "Light" holds exactly one object.
 */
export function relatedPieces(piece: Piece, count = 3): Piece[] {
  const sameRoom = pieces.filter(
    (p) => p.category === piece.category && p.slug !== piece.slug && p.images.length > 0,
  );
  if (sameRoom.length >= count) return sameRoom.slice(0, count);

  const rest = pieces.filter(
    (p) =>
      p.slug !== piece.slug &&
      p.category !== piece.category &&
      p.images.length > 0 &&
      p.available,
  );
  return [...sameRoom, ...rest].slice(0, count);
}

/** Two digits, so the register's numbers stay a column rather than a ragged edge. */
export function accession(piece: Piece): string {
  return String(piece.index).padStart(2, "0");
}

/**
 * Photographs for the band that closes every page below the homepage.
 *
 * The lead photograph of each piece, whole — this band is a last offer of the
 * collection, so it shows objects rather than the surface crops the homepage's
 * matter wall uses. Only pieces that are actually still available, so the offer
 * is honest as well as decorative.
 *
 * Portrait frames are preferred and the panes are cut at 3/4, the ratio most of
 * this photography was shot at. An earlier version preferred the 11 landscape
 * files and then put them in a 3/5 portrait pane, which cropped the object out
 * of its own picture — the one thing this site cannot do.
 */
export function closingBand(exclude: string[] = [], count = 4): { piece: Piece; image: PieceImage }[] {
  const seen = new Set(exclude);
  const band: { piece: Piece; image: PieceImage }[] = [];

  // One per room before a second from any of them. Taken in flat catalogue
  // order the band came out as four near-identical stools, because the first
  // twelve records all are — which reads as a shelf of stock, not a collection.
  const rooms = categorySlugs();

  for (let round = 0; band.length < count && round < 4; round += 1) {
    for (const room of rooms) {
      if (band.length >= count) break;
      const piece = pieces.find(
        (p) =>
          p.category === room &&
          p.available &&
          p.images.length > 0 &&
          !seen.has(p.slug),
      );
      if (!piece) continue;
      const image = piece.images.find((i) => i.h >= i.w) ?? piece.images[0];
      if (!image) continue;
      seen.add(piece.slug);
      band.push({ piece, image });
    }
  }

  return band;
}
