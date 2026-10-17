/**
 * The homepage hero, chosen in Shopify (17 Oct): an image OR a video.
 *
 *   npx tsx scripts/shopify-hero.mts
 *
 * Creates the metaobject "Accueil, image ou vidéo" (type trc_hero) with one
 * field, "Image ou vidéo" (a file: image or video), readable by the
 * Storefront API, and one entry, handle "accueil", holding the current hero
 * photograph. Idempotent: an existing definition or a filled entry is left
 * alone.
 *
 * The house changes it in Content → Metaobjects → Accueil, image ou vidéo.
 * scripts/shopify-pull.mjs reads it; app/[locale]/page.tsx shows it.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connect, gql, userErrors, ROOT } from "./lib/shopify-admin.mjs";

const TYPE = "trc_hero";
const HANDLE = "accueil";
const SOURCE = "public/place/hanging-cloth.jpg";

await connect();

const def = await gql(`query($t: String!) { metaobjectDefinitionByType(type: $t) { id } }`, { t: TYPE });
if (!def.metaobjectDefinitionByType) {
  console.log("create definition");
  userErrors(
    await gql(
      `mutation($d: MetaobjectDefinitionCreateInput!) { metaobjectDefinitionCreate(definition: $d) { metaobjectDefinition { id } userErrors { field message } } }`,
      {
        d: {
          type: TYPE,
          name: "Accueil, image ou vidéo",
          description: "La grande image en haut de la page d’accueil. Mettez une image ou une vidéo (MP4, 10 à 30 secondes, sans son).",
          access: { storefront: "PUBLIC_READ" },
          fieldDefinitions: [
            {
              key: "media",
              name: "Image ou vidéo",
              type: "file_reference",
              validations: [{ name: "file_type_options", value: JSON.stringify(["Image", "Video"]) }],
            },
          ],
        },
      },
    ),
  );
}

const cur = await gql(
  `query($h: MetaobjectHandleInput!) { metaobjectByHandle(handle: $h) { id field(key: "media") { value } } }`,
  { h: { type: TYPE, handle: HANDLE } },
);
if (cur.metaobjectByHandle?.field?.value) {
  console.log("entry already filled; left alone");
  process.exit(0);
}

/* Upload the current hero photograph into Files. */
const bytes = readFileSync(join(ROOT, SOURCE));
const staged = userErrors(
  await gql(
    `mutation($i: [StagedUploadInput!]!) { stagedUploadsCreate(input: $i) { stagedTargets { url resourceUrl parameters { name value } } userErrors { field message } } }`,
    { i: [{ resource: "IMAGE", filename: "accueil.jpg", mimeType: "image/jpeg", httpMethod: "POST", fileSize: String(bytes.length) }] },
  ),
).stagedUploadsCreate.stagedTargets[0];
const form = new FormData();
for (const p of staged.parameters) form.append(p.name, p.value);
form.append("file", new Blob([bytes], { type: "image/jpeg" }), "accueil.jpg");
const up = await fetch(staged.url, { method: "POST", body: form });
if (!up.ok) throw new Error(`upload ${up.status}`);
const file = userErrors(
  await gql(
    `mutation($f: [FileCreateInput!]!) { fileCreate(files: $f) { files { id } userErrors { field message } } }`,
    { f: [{ originalSource: staged.resourceUrl, contentType: "IMAGE", alt: "" }] },
  ),
).fileCreate.files[0];
for (let i = 0; i < 30; i++) {
  const s = await gql(`query($id: ID!) { node(id: $id) { ... on MediaImage { fileStatus } } }`, { id: file.id });
  if (s.node?.fileStatus === "READY") break;
  if (s.node?.fileStatus === "FAILED") throw new Error("file processing failed");
  await new Promise((r) => setTimeout(r, 1000));
}

userErrors(
  await gql(
    `mutation($h: MetaobjectHandleInput!, $m: MetaobjectUpsertInput!) { metaobjectUpsert(handle: $h, metaobject: $m) { metaobject { id } userErrors { field message } } }`,
    { h: { type: TYPE, handle: HANDLE }, m: { fields: [{ key: "media", value: file.id }] } },
  ),
);
console.log(`entry "${HANDLE}" holds ${SOURCE}`);
