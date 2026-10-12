/**
 * Link-preview cards — what WhatsApp, Instagram DMs, Facebook, iMessage,
 * LinkedIn and X show when someone shares a link to the site.
 *
 *   npx tsx scripts/og-images.mts
 *
 * Runs before every build (package.json cf:build and the deploy workflow),
 * after the Shopify snapshot is pulled, so a new piece or a changed lead
 * photograph gets its own card on the next deploy.
 *
 * A CARD, not a bare photograph (client, 11 Oct): the house's logo, the
 * page's name, one line, and the action — "Découvrir la pièce →". One per
 * language: public/og/fr/** and public/og/en/**, 1200×630 baseline JPEG well
 * under WhatsApp's limit. Two layouts:
 *
 *   OBJECT  pieces, rugs, categories: the photograph CONTAINED on the pale
 *           wall it was shot against (never cropped, §24), the label beside it
 *           on the page's ecru.
 *   SCENE   home, story, rugs, contact…: the photograph fills the left, the
 *           words sit on the footer's dark.
 *
 * Rendered with satori (layout + the site's own fonts, Marcellus and Jost)
 * and resvg, then sharp for the photograph and the JPEG.
 *
 * docs/og.json lists every file with a hash of its bytes; lib/seo.ts serves
 * it as ?v=<hash>, because WhatsApp and iMessage cache a preview by URL for
 * good — a changed card has to arrive at a new address.
 */
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { allPieces, formatPrice, groupBySlug, groupOf, groups, collectionPieces, type Piece } from "../lib/catalog";
import { displayName } from "../lib/specs";
import { allRugSeries, formatEuro, fromPrice, seriesLine, seriesTitle } from "../lib/rugs";
import { CARE_GUIDE, COLLECTION, CONTACT, HOME, STORY } from "../lib/copy-v2";

type Lang = "fr" | "en";
const LANGS: Lang[] = ["fr", "en"];
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/og");
const W = 1200;
const H = 630;

const C = {
  ground: "#F7F5F2",
  wall: "#EEE8E0",
  ink: "#2E2019",
  brown: "#4B3123",
  clay: "#866950",
  night: "#1F1D1B",
  cream: "#F7F5F2",
  creamSoft: "#D0BA9D",
};

const font = (f: string) => readFileSync(join(ROOT, "scripts/fonts", f));
const FONTS = [
  { name: "Marcellus", data: font("Marcellus-400.woff"), weight: 400 as const, style: "normal" as const },
  { name: "Jost", data: font("Jost-300.woff"), weight: 300 as const, style: "normal" as const },
  { name: "Jost", data: font("Jost-400.woff"), weight: 400 as const, style: "normal" as const },
  { name: "Jost", data: font("Jost-500.woff"), weight: 500 as const, style: "normal" as const },
];

/* The client's own lockup (brand/logo.svg), recoloured. Never redrawn (§2). */
const LOGO_SVG = readFileSync(join(ROOT, "brand/logo.svg"), "utf8");
const logo = (colour: string) =>
  `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG.replace(/#6c645d/gi, colour)).toString("base64")}`;
const LOGO_RATIO = 96.57 / 132.1;

/* ---- satori element helpers -------------------------------------------- */
type El = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): El => ({
  type,
  props: { style: { display: "flex", ...style }, children, ...extra },
});
const img = (src: string, style: Record<string, unknown>): El => ({ type: "img", props: { src, style } });

const manifest: Record<string, string> = {};
async function render(card: El, out: string) {
  const svg = await satori(card as never, { width: W, height: H, fonts: FONTS });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
  // Baseline, not progressive: WhatsApp decodes the preview on the phone and is
  // the least forgiving reader. `mozjpeg: true` forces progressive (its
  // optimiseScans) whatever `progressive` says, so it stays off.
  const jpg = await sharp(png).jpeg({ quality: 82, progressive: false }).toBuffer();
  mkdirSync(dirname(join(OUT, out)), { recursive: true });
  writeFileSync(join(OUT, out), jpg);
  manifest[out] = createHash("sha1").update(jpg).digest("hex").slice(0, 8);
}

/** A photograph as a JPEG data URI at a sane size (Shopify or public/). */
const photoCache = new Map<string, string>();
async function photo(src: string, box: { w: number; h: number }, fit: "cover" | "inside"): Promise<string> {
  const key = `${src}|${box.w}x${box.h}|${fit}`;
  if (photoCache.has(key)) return photoCache.get(key)!;
  let input: Buffer;
  if (src.startsWith("http")) {
    const u = new URL(src);
    u.searchParams.set("width", "1400");
    const res = await fetch(u, { headers: { Accept: "image/jpeg,image/png;q=0.9" } });
    if (!res.ok) throw new Error(`${res.status} ${src}`);
    input = Buffer.from(await res.arrayBuffer());
  } else {
    input = readFileSync(join(ROOT, "public", src.replace(/^\//, "")));
  }
  const buf = await sharp(input)
    .rotate()
    .resize(box.w, box.h, { fit, position: "attention", withoutEnlargement: false })
    // A transparent PNG would turn black as a JPEG: lay it on the wall colour.
    .flatten({ background: C.wall })
    .jpeg({ quality: 86 })
    .toBuffer();
  const uri = `data:image/jpeg;base64,${buf.toString("base64")}`;
  photoCache.set(key, uri);
  return uri;
}

/* ---- the two layouts ---------------------------------------------------- */
const titleSize = (t: string, base: number) => (t.length > 40 ? base * 0.72 : t.length > 22 ? base * 0.84 : base);

/* The fonts' Latin subset has no "→", so the arrow is drawn. */
const arrow = (colour: string) =>
  `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="14" viewBox="0 0 30 14"><path d="M1 7h27M22 1l6 6-6 6" fill="none" stroke="${colour}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  ).toString("base64")}`;

function cta(text: string, colour: string) {
  return el(
    "div",
    { alignItems: "center", paddingBottom: 10, borderBottom: `1.5px solid ${colour}` },
    [
      el("div", { fontFamily: "Jost", fontWeight: 500, fontSize: 19, letterSpacing: 3, textTransform: "uppercase", color: colour, marginRight: 14 }, text.replace(/\s*→\s*$/, "")),
      img(arrow(colour), { width: 30, height: 14 }),
    ],
  );
}

/** The top row: the logo, and the address opposite. */
const top = (logoColour: string, textColour: string) =>
  el("div", { alignItems: "flex-start", justifyContent: "space-between" }, [
    img(logo(logoColour), { width: 64, height: 64 / LOGO_RATIO }),
    el("div", { fontFamily: "Jost", fontWeight: 400, fontSize: 17, letterSpacing: 1, color: textColour, marginTop: 6 }, "therootscorner.com"),
  ]);

async function objectCard(o: { photo: string; eyebrow: string; title: string; line?: string | null; action: string }) {
  const pic = await photo(o.photo, { w: 560, h: 560 }, "inside");
  return el("div", { width: W, height: H, backgroundColor: C.ground }, [
    el("div", { width: 630, height: H, backgroundColor: C.wall, alignItems: "center", justifyContent: "center" }, [
      img(pic, { maxWidth: 560, maxHeight: 560, objectFit: "contain" }),
    ]),
    el("div", { flexDirection: "column", justifyContent: "space-between", width: 570 - 112, height: H - 104, margin: "50px 56px 54px" }, [
      top(C.brown, C.clay),
      el("div", { flexDirection: "column" }, [
        el("div", { fontFamily: "Jost", fontWeight: 500, fontSize: 17, letterSpacing: 3, textTransform: "uppercase", color: C.clay, marginBottom: 18 }, o.eyebrow),
        el("div", { fontFamily: "Marcellus", fontSize: titleSize(o.title, 50), lineHeight: 1.12, color: C.ink }, o.title),
        o.line
          ? el("div", { fontFamily: "Jost", fontWeight: 300, fontSize: 27, color: C.brown, marginTop: 18 }, o.line)
          : el("div", {}, ""),
      ]),
      el("div", {}, [cta(o.action, C.brown)]),
    ]),
  ]);
}

async function sceneCard(o: { photo: string; eyebrow?: string; title: string; line?: string; action: string }) {
  const pic = await photo(o.photo, { w: 700, h: H }, "cover");
  return el("div", { width: W, height: H, backgroundColor: C.night }, [
    img(pic, { width: 700, height: H, objectFit: "cover" }),
    el("div", { flexDirection: "column", justifyContent: "space-between", width: 500 - 104, height: H - 104, margin: "50px 52px 54px" }, [
      top(C.cream, C.creamSoft),
      el("div", { flexDirection: "column" }, [
        o.eyebrow
          ? el("div", { fontFamily: "Jost", fontWeight: 500, fontSize: 17, letterSpacing: 3, textTransform: "uppercase", color: C.creamSoft, marginBottom: 18 }, o.eyebrow)
          : el("div", {}, ""),
        el("div", { fontFamily: "Marcellus", fontSize: titleSize(o.title, 52), lineHeight: 1.1, color: C.cream }, o.title),
        o.line
          ? el("div", { fontFamily: "Jost", fontWeight: 300, fontSize: 25, lineHeight: 1.35, color: C.creamSoft, marginTop: 20 }, o.line)
          : el("div", {}, ""),
      ]),
      el("div", {}, [cta(o.action, C.cream)]),
    ]),
  ]);
}

/* ---- what each page says ----------------------------------------------- */
const T = {
  discover: { fr: "Découvrir la collection →", en: "Discover the collection →" },
  piece: { fr: "Découvrir la pièce →", en: "Discover the piece →" },
  rug: { fr: "Découvrir le tapis →", en: "Discover the rug →" },
  rugs: { fr: "Découvrir les tapis →", en: "Discover the rugs →" },
  see: { fr: "Voir les pièces →", en: "See the pieces →" },
  story: { fr: "Lire notre histoire →", en: "Read our story →" },
  write: { fr: "Nous écrire →", en: "Write to us →" },
  guide: { fr: "Lire le guide →", en: "Read the guide →" },
  faq: { fr: "Voir les réponses →", en: "See the answers →" },
  sold: { fr: "Vendu", en: "Sold" },
  onRequest: { fr: "Prix sur demande", en: "Price on request" },
  from: { fr: "À partir de", en: "From" },
};
const count = (n: number, l: Lang) => `${n} ${l === "fr" ? (n === 1 ? "pièce" : "pièces") : n === 1 ? "piece" : "pieces"}`;

const leadSrc = (p: Piece) => {
  const i = p.images[0];
  return i ? (i.src ?? `/pieces/${i.file}`) : null;
};
const priceLine = (p: Piece, l: Lang) => (!p.available ? T.sold[l] : (formatPrice(p, l) ?? T.onRequest[l]));

let n = 0;
async function safe(label: string, fn: () => Promise<void>) {
  try {
    await fn();
    n++;
  } catch (e) {
    console.warn(`og: ${label}: ${(e as Error).message}`);
  }
}

for (const l of LANGS) {
  /* Scenes */
  const scenes: [string, Parameters<typeof sceneCard>[0]][] = [
    ["default.jpg", { photo: "/place/hanging-cloth.jpg", title: HOME.heroTitle[l], line: l === "fr" ? "Objets anciens, pièces artisanales et tapis, depuis Marrakech" : "Antique objects, handmade pieces and rugs, from Marrakech", action: T.discover[l] }],
    ["story.jpg", { photo: "/story/atlas-valley.jpg", eyebrow: l === "fr" ? "Notre histoire" : "Our story", title: STORY.chapters[0].heading[l], line: STORY.chapters[0].body[0][l], action: T.story[l] }],
    ["mrirt.jpg", { photo: "/rugs/series/floor-fire.jpg", title: l === "fr" ? "Tapis Mrirt" : "Mrirt rugs", line: HOME.rugs.body[l], action: T.rugs[l] }],
    ["collection.jpg", { photo: "/rugs/interior-table.jpg", title: COLLECTION.title[l], line: l === "fr" ? "Sièges, objets, poteries, objets anciens, mobilier et luminaires" : "Seating, objects, pottery, antique objects, furniture and lighting", action: T.discover[l] }],
    ["all.jpg", { photo: "/rugs/interior-table.jpg", eyebrow: COLLECTION.title[l], title: COLLECTION.all[l], line: count(collectionPieces().length, l), action: T.see[l] }],
    ["contact.jpg", { photo: "/story/ochre-wall.jpg", title: CONTACT.title[l], line: CONTACT.intro2[l], action: T.write[l] }],
    ["guide.jpg", { photo: "/place/dyed-yarn.jpg", title: CARE_GUIDE.title[l], line: l === "fr" ? "Tapis en laine et pièces en bois" : "Wool rugs and wooden pieces", action: T.guide[l] }],
    ["faq.jpg", { photo: "/place/shadow-rail.jpg", title: l === "fr" ? "Questions fréquentes" : "Frequently asked questions", line: l === "fr" ? "Livraison, paiement, retours et tapis Mrirt" : "Delivery, payment, returns and Mrirt rugs", action: T.faq[l] }],
  ];
  for (const [file, o] of scenes) await safe(`${l}/${file}`, async () => render(await sceneCard(o), `${l}/${file}`));

  /* Categories */
  for (const g of groups()) {
    const src = g.cover && leadSrc(g.cover);
    if (!src) continue;
    await safe(`${l}/groups/${g.slug}`, async () =>
      render(await objectCard({ photo: src, eyebrow: `${COLLECTION.title[l]} · N° ${g.no}`, title: g.name[l], line: count(g.count, l), action: T.see[l] }), `${l}/groups/${g.slug}.jpg`),
    );
  }

  /* Pieces (the original collection, pieces added in Shopify, finished rugs) */
  for (const p of allPieces()) {
    const src = leadSrc(p);
    if (!src) continue;
    const g = groupOf(p);
    const eyebrow = g ? (groupBySlug(g)?.name[l] ?? "") : l === "fr" ? "Tapis Mrirt · disponible" : "Mrirt rug · available";
    await safe(`${l}/pieces/${p.slug}`, async () =>
      render(
        await objectCard({ photo: src, eyebrow, title: displayName(p, l), line: priceLine(p, l), action: g ? T.piece[l] : T.rug[l] }),
        `${l}/pieces/${p.slug}.jpg`,
      ),
    );
  }

  /* Mrirt collections */
  for (const s of allRugSeries()) {
    const src = s.images[0]?.src;
    if (!src) continue;
    const from = fromPrice(s);
    await safe(`${l}/tapis/${s.handle}`, async () =>
      render(
        await objectCard({
          photo: src,
          eyebrow: l === "fr" ? "Tapis Mrirt · sur commande" : "Mrirt rug · made to order",
          title: seriesTitle(s, l),
          line: from !== null ? `${T.from[l]} ${formatEuro(from, l)}` : (seriesLine(s, l) ?? T.onRequest[l]),
          action: T.rug[l],
        }),
        `${l}/tapis/${s.handle}.jpg`,
      ),
    );
  }
}

writeFileSync(join(ROOT, "docs/og.json"), JSON.stringify(manifest, null, 1) + "\n");
console.log(`og: ${n} cards (fr + en) → public/og/ (docs/og.json)`);
