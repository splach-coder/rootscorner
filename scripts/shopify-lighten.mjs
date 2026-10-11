/**
 * Make the product photographs in Shopify lighter, in place.
 *
 *   node scripts/shopify-lighten.mjs --dry         # list what would change
 *   node scripts/shopify-lighten.mjs --limit 1     # try one
 *   node scripts/shopify-lighten.mjs               # all
 *
 * The originals came in at up to 6000 px and 14 MB (camera files, and the
 * placeholder rug photos as 4 MB PNGs). Nothing on the site shows more than
 * 2000 px, so every photo larger than 2400 px on its long edge, or heavier than
 * 900 KB, is re-encoded as a 2400 px progressive JPEG and REPLACED IN PLACE
 * (fileUpdate): same media id, same position, same alt text — so the
 * "Photo d'illustration" marker, the order she set and any colourway that
 * points at the photo all stay exactly as they were. The file keeps its name,
 * so the site still serves its own copy where it has one.
 *
 * Idempotent: a photo already within both limits is left alone.
 */
import sharp from "sharp";
import { connect, gql, userErrors } from "./lib/shopify-admin.mjs";

const DRY = process.argv.includes("--dry");
const limitArg = process.argv.indexOf("--limit");
const LIMIT = limitArg > -1 ? Number(process.argv[limitArg + 1]) : Infinity;
const MAX_EDGE = 2400;
const MAX_BYTES = 900 * 1024;

await connect();

/* Every product photo. */
const media = [];
let after = null;
do {
  const d = await gql(
    `query($a: String) { products(first: 50, after: $a) { pageInfo { hasNextPage endCursor } nodes { handle
       media(first: 50) { nodes { ... on MediaImage { id alt originalSource { url fileSize } image { width height url } } } } } } }`,
    { a: after },
  );
  for (const p of d.products.nodes)
    for (const m of p.media.nodes)
      if (m.id && m.image) media.push({ handle: p.handle, ...m });
  after = d.products.pageInfo.hasNextPage ? d.products.pageInfo.endCursor : null;
} while (after);

const heavy = media.filter(
  (m) => Math.max(m.image.width, m.image.height) > MAX_EDGE || (m.originalSource?.fileSize ?? 0) > MAX_BYTES,
);
const mb = (b) => (b / 1048576).toFixed(2);
console.log(`${media.length} photos, ${heavy.length} to lighten (${mb(heavy.reduce((a, m) => a + (m.originalSource?.fileSize ?? 0), 0))} MB)`);
if (DRY) process.exit(0);

let done = 0;
let before = 0;
let afterBytes = 0;
for (const m of heavy.slice(0, LIMIT)) {
  // The original's link is signed for five minutes only, so it is asked for
  // again right before each download rather than taken from the listing.
  const fresh = await gql(
    `query($id: ID!) { node(id: $id) { ... on MediaImage { originalSource { url } image { url } } } }`,
    { id: m.id },
  );
  const src = fresh.node?.originalSource?.url ?? fresh.node?.image?.url ?? m.image.url;
  const res = await fetch(src);
  if (!res.ok) {
    console.warn(`skip ${m.handle}: download ${res.status}`);
    continue;
  }
  const input = Buffer.from(await res.arrayBuffer());
  const out = await sharp(input)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#f7f5f2" })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toBuffer();
  if (out.length >= input.length) {
    console.log(`keep ${m.handle}: already as light as it gets`);
    continue;
  }

  // Same file name, .jpg — the site matches its own copies by name.
  const base = decodeURIComponent(src.split("?")[0].split("/").pop()).replace(/\.[a-z0-9]+$/i, "");
  const filename = `${base}.jpg`;

  const staged = userErrors(
    await gql(
      `mutation($i: [StagedUploadInput!]!) { stagedUploadsCreate(input: $i) { stagedTargets { url resourceUrl parameters { name value } } userErrors { field message } } }`,
      { i: [{ filename, mimeType: "image/jpeg", resource: "IMAGE", httpMethod: "POST", fileSize: String(out.length) }] },
    ),
  ).stagedUploadsCreate.stagedTargets[0];
  const form = new FormData();
  for (const p of staged.parameters) form.append(p.name, p.value);
  form.append("file", new Blob([out], { type: "image/jpeg" }), filename);
  const up = await fetch(staged.url, { method: "POST", body: form });
  if (!up.ok && up.status !== 201) {
    console.warn(`skip ${m.handle}: upload ${up.status}`);
    continue;
  }

  userErrors(
    await gql(
      `mutation($f: [FileUpdateInput!]!) { fileUpdate(files: $f) { files { id } userErrors { field message } } }`,
      { f: [{ id: m.id, originalSource: staged.resourceUrl, alt: m.alt ?? "" }] },
    ),
  );

  // Wait until Shopify has processed it, so a failure is seen here.
  // fileStatus still reads READY for the OLD file for a moment, so wait for
  // the new one: an image again, at the new size.
  let status = "PROCESSING";
  for (let i = 0; i < 40 && status === "PROCESSING"; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const s = await gql(
      `query($id: ID!) { node(id: $id) { ... on MediaImage { fileStatus image { url } originalSource { fileSize } } } }`,
      { id: m.id },
    );
    const n = s.node;
    if (!n || n.fileStatus === "FAILED") status = "FAILED";
    else if (n.image && n.originalSource?.fileSize === out.length) status = "READY";
  }
  before += m.originalSource?.fileSize ?? input.length;
  afterBytes += out.length;
  done++;
  console.log(`${status === "READY" ? "ok  " : status}  ${m.handle}  ${mb(input.length)} MB → ${mb(out.length)} MB`);
}
console.log(`lightened ${done} photo(s): ${mb(before)} MB → ${mb(afterBytes)} MB`);
