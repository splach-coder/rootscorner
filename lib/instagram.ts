import raw from "@/docs/instagram.json";
import { INSTAGRAM } from "./site";

/**
 * The frames pulled from the client's own Instagram (scripts/ig-fetch.mjs).
 *
 * Instagram serves a login wall to unauthenticated HTTP clients and answers 429
 * on its JSON endpoints, so this is a manifest rather than a live feed. The
 * files live in public/instagram/ and docs/instagram.json lists them.
 *
 * Empty is a supported state: the strip disappears and the section is the
 * handle alone.
 */
export type InstagramFrame = {
  /** Filename inside public/instagram/. */
  file: string;
  /** What is in the photograph. Absent means decorative — never invented. */
  alt?: string;
  /** The post. Absent means the tile links to the profile instead. */
  permalink?: string;
};

/**
 * The two frames that are not going in the feed strip.
 *
 * These are the first interiors the project has ever had — pieces standing in a
 * real room rather than against the studio wall — and they answer the brief's
 * section 6 ("images de matières, artisans, voyages ou lieux") directly. Shown
 * at 200px in a strip they are wasted, so they are promoted to full-bleed bands
 * and taken OUT of the strip: a photograph that appears twice on one page reads
 * as a shortage of photographs.
 *
 * Change these and the strip changes with them — there is one list.
 */
export const SCENE_FILES = {
  /** A dining room: pieces on plaster shelves, black chair, round table. */
  room: "01.jpg",
  /** A lit alcove at night — pot, books, stool, lamp. */
  evening: "07.jpg",
  /** A stool detail on a rug, close and sepia — the only intimate frame. */
  detail: "04.jpg",
} as const;

export function scene(key: keyof typeof SCENE_FILES): string {
  return `/instagram/${SCENE_FILES[key]}`;
}

const PROMOTED = new Set<string>(Object.values(SCENE_FILES));

function frames(): InstagramFrame[] {
  return (raw as InstagramFrame[]).filter(
    (frame) => typeof frame?.file === "string" && frame.file.length > 0,
  );
}

/** Everything the strip shows: the feed minus whatever the page already uses large. */
export function instagramFrames(): (InstagramFrame & { src: string; href: string })[] {
  return frames()
    .filter((frame) => !PROMOTED.has(frame.file))
    .map((frame) => ({
      ...frame,
      src: `/instagram/${frame.file}`,
      href: frame.permalink || INSTAGRAM,
    }));
}
