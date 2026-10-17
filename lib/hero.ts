import live from "@/docs/shopify-live.json";

/**
 * The homepage hero (17 Oct): an image OR a video, chosen in Shopify
 * (Content → Metaobjects → "Accueil, image ou vidéo"), read by
 * scripts/shopify-pull.mjs. Until something is set there, the house's own
 * photograph.
 *
 * A video always comes with an image: Shopify's still of it, else the
 * house's photograph. The image is what shows first and what phones set to
 * save data or reduce motion keep (components/HeroMedia.tsx).
 */
type Snapshot = {
  hero?:
    | { kind: "image"; src: string; w: number; h: number }
    | { kind: "video"; src: string; poster: { src: string; w: number; h: number } | null }
    | null;
};

const FALLBACK = { src: "/place/hanging-cloth.jpg", width: 2000, height: 3000 };

export function homeHero(): { src: string; width: number; height: number; video?: string } {
  const hero = (live as Snapshot).hero;
  if (hero?.kind === "image") return { src: hero.src, width: hero.w, height: hero.h };
  if (hero?.kind === "video") {
    const still = hero.poster ? { src: hero.poster.src, width: hero.poster.w, height: hero.poster.h } : FALLBACK;
    return { ...still, video: hero.src };
  }
  return FALLBACK;
}
