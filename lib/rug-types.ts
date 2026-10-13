import type { Locale } from "./dictionaries";

/**
 * The kinds of Berber rug (V5 feedback, 14 Oct).
 *
 * The client renamed "Tapis Mrirt" to "Berber Rugs" and asked for the rugs to
 * be grouped by kind, each with its own name, after HOMURA's menu (All
 * Products · Azilal · Beni Ourain · Boucherouite · Boujaad · Kilim · Mrirt).
 * The six names are the ones from their reference; nothing is said about any
 * kind beyond its name (§5).
 *
 * A rug's kind is chosen in Shopify, in the product field "Type de tapis"
 * (namespace trc, key type_tapis, created by scripts/shopify-rug-types.mts),
 * whose choices are the `value`s below. A Mrirt series (product type "Tapis
 * Mrirt") is Mrirt when the field is empty: that is what its type says.
 *
 * To add or remove a kind: change this list AND the field's choices in Shopify
 * (Settings → Custom data → Products → Type de tapis).
 */
export type RugType = { slug: string; value: string; name: Record<Locale, string> };

export const RUG_TYPES: RugType[] = [
  { slug: "azilal", value: "Azilal", name: { fr: "Tapis Azilal", en: "Azilal Rugs" } },
  { slug: "beni-ourain", value: "Beni Ourain", name: { fr: "Tapis Beni Ourain", en: "Beni Ourain Rugs" } },
  { slug: "boucherouite", value: "Boucherouite", name: { fr: "Tapis Boucherouite", en: "Boucherouite Rugs" } },
  { slug: "boujaad", value: "Boujaad", name: { fr: "Tapis Boujaad", en: "Boujaad Rugs" } },
  { slug: "kilim", value: "Kilim", name: { fr: "Kilims", en: "Kilim Rugs" } },
  { slug: "mrirt", value: "Mrirt", name: { fr: "Tapis Mrirt", en: "Mrirt Rugs" } },
];

/** The whole rug section, and "every kind" in its menu. */
export const RUGS_NAME: Record<Locale, string> = { fr: "Tapis berbères", en: "Berber Rugs" };
export const ALL_RUGS: Record<Locale, string> = { fr: "Tous les tapis", en: "All Rugs" };

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The value typed or chosen in Shopify → the kind's slug, or null. */
export function rugTypeSlug(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const n = norm(value);
  return RUG_TYPES.find((t) => t.slug === n || norm(t.value) === n)?.slug ?? null;
}

export function rugTypeBySlug(slug: string): RugType | undefined {
  return RUG_TYPES.find((t) => t.slug === slug);
}
