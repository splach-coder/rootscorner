/**
 * Client feedback V6 (17 Oct), applied in Shopify, where the house edits.
 *
 *   npx tsx scripts/shopify-v6.mts --dry
 *   npx tsx scripts/shopify-v6.mts
 *
 * 1. New French title and text for the pieces the client rewrote (their words,
 *    verbatim; " — " in their titles written as ", ", house rule §69), with an
 *    English translation registered for each (Translate & Adapt keeps it).
 *    The stools without a text of their own take the client's shared stool
 *    text; their NAMES stay, because "du Cameroun" is not true of a Dogon or
 *    Senufo stool (§5). Only the stool already recorded as Cameroonian takes
 *    the title "Tabouret sculpté du Cameroun".
 * 2. Five pieces marked sold: stock 0.
 * 3. One photograph taken off two pieces. Detached, not deleted: the file stays
 *    in Content → Files, so it can be put back.
 *
 * The site picks all of it up at the next sync.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connect, gql, userErrors, ROOT } from "./lib/shopify-admin.mjs";

const DRY = process.argv.includes("--dry");

type Text = { fr: { title?: string; body: string[] }; en: { title?: string; body: string[] } };

const STOOL: Text = {
  fr: {
    body: [
      "Sculpté dans le bois, ce tabouret séduit par ses lignes singulières, sa patine naturelle et son caractère brut.",
      "Ses irrégularités, ses marques du temps et ses petites imperfections font toute son authenticité. Chaque pièce est unique, façonnée par la main de l’artisan et le temps qui passe.",
      "Une pièce sculpturale où la beauté réside aussi dans l’imperfection.",
    ],
  },
  en: {
    body: [
      "Carved from wood, this stool draws you in with its singular lines, its natural patina and its raw character.",
      "Its irregularities, the marks of time and its small imperfections are what make it authentic. Each piece is unique, shaped by the artisan’s hand and by the passing of time.",
      "A sculptural piece where beauty also lies in imperfection.",
    ],
  },
};

const TEXTS: Record<string, Text> = {
  "handmade-wooden-stool": {
    fr: {
      title: "Tabouret sculpté bamiléké, Cameroun",
      body: [
        "Inspiré de la tradition sculpturale bamiléké de l’ouest du Cameroun, ce tabouret se distingue par sa structure ajourée, ses motifs géométriques et son travail du bois en relief. Sa silhouette sculpturale et sa patine profonde en font une pièce de caractère, entre artisanat traditionnel et art décoratif.",
        "Les traces d’usure, les irrégularités du bois et les variations de teinte font partie de son charme et soulignent son caractère unique. Chaque marque raconte la vie de la matière et participe à l’authenticité de cette pièce singulière.",
        "Entretien : nettoyer délicatement avec un chiffon doux et sec. Éviter les produits abrasifs et l’exposition prolongée à l’humidité.",
      ],
    },
    en: {
      title: "Carved Bamileke stool, Cameroon",
      body: [
        "Inspired by the Bamileke sculptural tradition of western Cameroon, this stool stands out for its openwork structure, its geometric motifs and its wood carved in relief. Its sculptural silhouette and deep patina make it a piece of character, between traditional craft and decorative art.",
        "The signs of wear, the irregularities of the wood and the variations in tone are part of its charm and underline its unique character. Every mark tells the life of the material and adds to the authenticity of this singular piece.",
        "Care: clean gently with a soft, dry cloth. Avoid abrasive products and prolonged exposure to damp.",
      ],
    },
  },
  "timeless-hand-carved-wooden-bowl-1": {
    fr: {
      title: "Ancien bol en bois sculpté, Art africain",
      body: [
        "Taillé dans une pièce de bois, ce bol se distingue par sa silhouette évasée, ses lignes géométriques et sa patine profonde aux nuances brunes et noires. La bande supérieure, ornée de motifs gravés, contraste subtilement avec la surface plus lisse de la partie inférieure.",
        "Dans de nombreuses traditions africaines, les récipients en bois occupent une place importante dans les gestes du quotidien. Sculptés à la main, ces objets utilitaires témoignent d’un savoir-faire transmis entre artisans, où la forme, la matière et la décoration se conjuguent avec simplicité.",
      ],
    },
    en: {
      title: "Antique carved wooden bowl, African art",
      body: [
        "Cut from a single piece of wood, this bowl stands out for its flared silhouette, its geometric lines and its deep patina in shades of brown and black. The upper band, decorated with engraved motifs, contrasts subtly with the smoother surface of the lower part.",
        "In many African traditions, wooden vessels hold an important place in everyday life. Carved by hand, these utilitarian objects bear witness to a skill passed between artisans, where form, material and decoration come together simply.",
      ],
    },
  },
  "tuareg-tent-stakes": {
    fr: {
      title: "Piquets de tente touaregs, Sahara",
      body: [
        "Sculptés dans le bois et ornés de motifs géométriques gravés à la main, ces piquets témoignent du savoir-faire artisanal des peuples nomades du Sahara. Associés à l’univers de la tente traditionnelle, éléments essentiels de la vie nomade, ils allient fonction et esthétique.",
        "Leur patine ancienne et leurs formes singulières en font aujourd’hui des objets de caractère, chargés de mémoire et d’authenticité.",
      ],
    },
    en: {
      title: "Tuareg tent stakes, Sahara",
      body: [
        "Carved from wood and decorated with geometric motifs engraved by hand, these stakes bear witness to the craft of the nomadic peoples of the Sahara. Part of the world of the traditional tent, essential to nomadic life, they combine function and beauty.",
        "Their old patina and singular forms make them objects of character today, full of memory and authenticity.",
      ],
    },
  },
  "decorative-wooden-tray": {
    fr: {
      title: "Ancienne tablette coranique, Maroc",
      body: [
        "Témoins d’une tradition séculaire, les tablettes coraniques en bois étaient utilisées dans les écoles traditionnelles pour l’apprentissage de l’écriture arabe et la mémorisation des versets du Coran.",
        "Les élèves y inscrivaient leurs leçons à l’encre, avant de les effacer pour recommencer. Ce geste, répété au fil des apprentissages, a progressivement marqué le bois, lui donnant cette patine singulière, empreinte du temps et de son usage.",
        "Avec sa surface usée et ses attaches anciennes, cette tablette évoque un patrimoine où le savoir se transmettait de génération en génération. Aujourd’hui, elle trouve une nouvelle place comme objet de collection, chargée d’histoire et de mémoire.",
      ],
    },
    en: {
      title: "Antique Quranic tablet, Morocco",
      body: [
        "Witnesses to a centuries-old tradition, wooden Quranic tablets were used in traditional schools to learn Arabic writing and to memorise verses of the Quran.",
        "Pupils wrote their lessons on them in ink, then washed them off to begin again. Repeated lesson after lesson, this gesture gradually marked the wood and gave it its singular patina, the imprint of time and use.",
        "With its worn surface and old fastenings, this tablet recalls a heritage in which knowledge passed from generation to generation. Today it finds a new place as a collector’s piece, full of history and memory.",
      ],
    },
  },
  "loom-beater-african-art": {
    fr: {
      title: "Battant ancien de métier à tisser, Art africain",
      body: [
        "Utilisé dans le tissage traditionnel, le battant permettait de resserrer les fils de trame afin de former un tissu régulier et dense. En Afrique de l’Ouest, ces outils accompagnaient la fabrication de bandes textiles destinées à être assemblées pour créer vêtements et étoffes.",
        "Composé d’une structure en bois et de fils tendus, cet ancien élément de métier à tisser témoigne de la précision du geste artisanal et de l’ingéniosité des techniques textiles traditionnelles. Sa patine sombre et sa construction singulière lui confèrent aujourd’hui une présence sculpturale, entre mémoire du geste et objet de collection.",
      ],
    },
    en: {
      title: "Antique loom beater, African art",
      body: [
        "Used in traditional weaving, the beater pressed the weft threads together to form an even, dense cloth. In West Africa, these tools accompanied the making of textile strips that were sewn together into garments and fabrics.",
        "Made of a wooden frame and taut threads, this old loom part bears witness to the precision of the craft and the ingenuity of traditional textile techniques. Its dark patina and singular construction give it a sculptural presence today, between the memory of a gesture and a collector’s piece.",
      ],
    },
  },
  "handmade-blackened-clay-pot---morocco": {
    fr: {
      title: "Pot ancien en terre cuite, Maroc",
      body: [
        "Façonné dans la terre cuite, ce pot se distingue par sa forme arrondie, ses poignées latérales sculpturales et sa patine sombre aux nuances brunes et cuivrées.",
        "La poterie traditionnelle marocaine, façonnée à la main puis transformée par la cuisson, accompagne depuis des générations les gestes du quotidien. Chaque pièce porte les traces de sa fabrication, avec des irrégularités et des variations de teinte qui lui donnent un caractère singulier.",
        "Entre objet utilitaire et pièce décorative, ce pot séduit par sa présence brute, sa matière vivante et son authenticité.",
      ],
    },
    en: {
      title: "Antique terracotta pot, Morocco",
      body: [
        "Shaped in terracotta, this pot stands out for its rounded form, its sculptural side handles and its dark patina in shades of brown and copper.",
        "Traditional Moroccan pottery, shaped by hand and then transformed by firing, has accompanied everyday life for generations. Each piece carries the traces of its making, with irregularities and variations in tone that give it a singular character.",
        "Between a useful object and a decorative piece, this pot appeals through its raw presence, its living material and its authenticity.",
      ],
    },
  },
  "decorative-ceramic-pot": {
    fr: {
      title: "Pot ancien en terre cuite à patine noire, Maroc",
      body: [
        "Avec sa silhouette généreuse, sa panse arrondie et son ouverture soulignée d’un rebord épais, ce pot ancien séduit par la sobriété de ses lignes et la profondeur de sa patine sombre.",
        "Façonnée dans la terre puis transformée par le feu, la poterie traditionnelle marocaine témoigne d’un savoir-faire ancestral, où la matière et la cuisson donnent à chaque pièce son caractère singulier. Les nuances, les irrégularités et les traces visibles à sa surface racontent cette relation directe entre la main, la terre et le feu.",
        "Brut et sculptural, ce pot trouve aujourd’hui naturellement sa place dans un intérieur contemporain, posé au sol ou sur un meuble comme une pièce de collection. Une présence discrète, où la beauté réside dans la matière, la simplicité de la forme et les marques du temps.",
      ],
    },
    en: {
      title: "Antique black-patina terracotta pot, Morocco",
      body: [
        "With its generous silhouette, rounded body and opening marked by a thick rim, this antique pot appeals through the restraint of its lines and the depth of its dark patina.",
        "Shaped in earth and then transformed by fire, traditional Moroccan pottery bears witness to an ancestral craft, in which material and firing give each piece its singular character. The shades, irregularities and visible traces on its surface tell of the direct relationship between hand, earth and fire.",
        "Raw and sculptural, this pot finds its place naturally in a contemporary interior today, set on the floor or on a piece of furniture like a collector’s piece. A quiet presence, where beauty lies in the material, the simplicity of the form and the marks of time.",
      ],
    },
  },
  "dogon-tribal-staff": {
    fr: {
      title: "Petits poteaux sculptés, inspiration Toguna Dogon",
      body: [
        "Inspirés des formes fourchues des poteaux de soutien des abris Toguna du peuple Dogon, au Mali, ces objets en bois sculpté se distinguent par leurs lignes brutes, leurs gravures géométriques et leur patine naturelle.",
        "Leur format compact met en valeur leur silhouette singulière et leur caractère sculptural. Les irrégularités du bois et les traces du temps font de chaque pièce un objet unique, à exposer seul ou en paire.",
      ],
    },
    en: {
      title: "Small carved posts, inspired by the Dogon Toguna",
      body: [
        "Inspired by the forked shapes of the posts that hold up the Toguna shelters of the Dogon people of Mali, these carved wooden objects stand out for their raw lines, their geometric engravings and their natural patina.",
        "Their compact size brings out their singular silhouette and sculptural character. The irregularities of the wood and the traces of time make each one a unique object, to display alone or as a pair.",
      ],
    },
  },
  "solid-wood-pedestal-bowl---ethiopian-and-west-african-craftsmanship-1": {
    fr: {
      title: "Coupe ancienne sur piédouche, Art africain",
      body: [
        "Taillée dans une seule pièce de bois, cette coupe se distingue par son large plateau évasé, son pied sculpté et sa patine sombre, façonnée par le temps.",
        "Dans différentes traditions africaines, les récipients en bois occupaient une place importante dans la vie quotidienne, les cérémonies et les pratiques rituelles. Certaines coupes étaient également des objets de prestige, destinés à recevoir des offrandes ou à accueillir les invités.",
        "Avec sa silhouette épurée et ses irrégularités naturelles, cette pièce révèle toute la beauté du bois sculpté et apporte une présence sculpturale à un intérieur.",
      ],
    },
    en: {
      title: "Antique pedestal bowl, African art",
      body: [
        "Cut from a single piece of wood, this bowl stands out for its wide flared top, its carved foot and its dark patina, shaped by time.",
        "In various African traditions, wooden vessels held an important place in daily life, ceremonies and rituals. Some bowls were also objects of prestige, made to receive offerings or to welcome guests.",
        "With its clean silhouette and natural irregularities, this piece reveals all the beauty of carved wood and brings a sculptural presence to an interior.",
      ],
    },
  },
  "antique-comb-used-for-weaving-moroccan-rugs": {
    fr: {
      title: "Peigne ancien de tisserand, Maroc",
      body: [
        "Témoin des traditions textiles marocaines, ce peigne en bois était utilisé dans le travail du tissage pour resserrer les fils et maintenir la régularité de la trame. Dans les ateliers artisanaux, ces outils accompagnaient le geste patient des tisserands et la création de textiles transmis de génération en génération.",
        "Sa structure sculptée, ses dents alignées et sa patine ancienne témoignent d’un savoir-faire où chaque outil était conçu pour répondre aux exigences du travail manuel. Aujourd’hui, il révèle une autre facette de l’artisanat marocain : celle des objets utilitaires dont la beauté réside dans la simplicité de leur forme et les traces laissées par leur usage.",
      ],
    },
    en: {
      title: "Antique weaver’s comb, Morocco",
      body: [
        "A witness to Moroccan textile traditions, this wooden comb was used in weaving to press the threads together and keep the weft even. In craft workshops, such tools accompanied the patient work of weavers and the making of textiles handed down from generation to generation.",
        "Its carved structure, aligned teeth and old patina bear witness to a craft in which every tool was made to meet the demands of handwork. Today it shows another side of Moroccan craftsmanship: useful objects whose beauty lies in the simplicity of their form and the traces left by their use.",
      ],
    },
  },
  // The client's shared stool text. Only this one is recorded as Cameroonian.
  "handcrafted-stool-from-cameroon": {
    fr: { title: "Tabouret sculpté du Cameroun", body: STOOL.fr.body },
    en: { title: "Carved stool from Cameroon", body: STOOL.en.body },
  },
};
// The other stools of "Sièges et Tabourets": the shared text, their own names.
for (const s of [
  "handcrafted-wood-stool---cote-d-ivoire",
  "hand-carved-tribal-stool-wood",
  "decorative-wooden-stool",
  "wooden-carved-stool",
  "handcrafted-stool",
  "handcrafted-varnished-wooden-stool",
  "handcrafted-wooden-stool",
  "dogon-stool",
  "senufo-stool",
]) TEXTS[s] = STOOL;

const SOLD = [
  "handmade-blackened-clay-pot---morocco",
  "decorative-ceramic-pot",
  "handmade-ceramic-candlestick-tamgroute",
  "handcrafted-wooden-stool",
  "handcrafted-varnished-wooden-stool",
];
/** Pieces whose SECOND photograph the client asked to remove. */
const DROP_SECOND_PHOTO = ["handmade-blackened-clay-pot---morocco", "handcrafted-wooden-stool"];

const html = (ps: string[]) => ps.map((p) => `<p>${p.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>`).join("");

await connect();
const variants: Record<string, string> = JSON.parse(readFileSync(join(ROOT, "docs/shopify.json"), "utf8"));
const productOf = async (slug: string) => {
  const d = await gql(
    `query($id: ID!) { productVariant(id: $id) { inventoryItem { id } product { id title media(first: 20) { nodes { id ... on MediaImage { image { url } } } } } } }`,
    { id: variants[slug] },
  );
  return d.productVariant as {
    inventoryItem: { id: string };
    product: { id: string; title: string; media: { nodes: { id: string; image?: { url: string } }[] } };
  };
};

/* ---- 1. titles and texts, French then English ----------------------------- */
for (const [slug, t] of Object.entries(TEXTS)) {
  const v = await productOf(slug);
  const input: Record<string, string> = { id: v.product.id, descriptionHtml: html(t.fr.body) };
  if (t.fr.title) input.title = t.fr.title;
  console.log(`${DRY ? "would update" : "update"} ${slug}${t.fr.title ? ` → ${t.fr.title}` : " (text)"}`);
  if (DRY) continue;
  userErrors(
    await gql(`mutation($p: ProductInput!) { productUpdate(input: $p) { product { id } userErrors { field message } } }`, {
      p: input,
    }),
  );
  const res = await gql(
    `query($id: ID!) { translatableResource(resourceId: $id) { translatableContent { key digest } } }`,
    { id: v.product.id },
  );
  const digest = (k: string) =>
    res.translatableResource.translatableContent.find((c: { key: string }) => c.key === k)?.digest;
  const tr = [{ locale: "en", key: "body_html", value: html(t.en.body), translatableContentDigest: digest("body_html") }];
  if (t.en.title) tr.push({ locale: "en", key: "title", value: t.en.title, translatableContentDigest: digest("title") });
  userErrors(
    await gql(
      `mutation($id: ID!, $t: [TranslationInput!]!) { translationsRegister(resourceId: $id, translations: $t) { userErrors { field message } } }`,
      { id: v.product.id, t: tr },
    ),
  );
}

/* ---- 2. sold --------------------------------------------------------------- */
const loc = (await gql(`{ locations(first: 5) { nodes { id isActive } } }`)).locations.nodes.find(
  (l: { isActive: boolean }) => l.isActive,
);
for (const slug of SOLD) {
  const v = await productOf(slug);
  console.log(`${DRY ? "would mark" : "mark"} sold: ${slug}`);
  if (DRY) continue;
  userErrors(
    await gql(
      `mutation($i: InventorySetQuantitiesInput!) { inventorySetQuantities(input: $i) { userErrors { field message } } }`,
      {
        i: {
          name: "available",
          reason: "correction",
          ignoreCompareQuantity: true,
          quantities: [{ inventoryItemId: v.inventoryItem.id, locationId: loc.id, quantity: 0 }],
        },
      },
    ),
  );
}

/* ---- 3. one photograph off two pieces (detached, kept in Files) ------------ */
for (const slug of DROP_SECOND_PHOTO) {
  const v = await productOf(slug);
  const media = v.product.media.nodes[1];
  if (!media) continue;
  console.log(`${DRY ? "would detach" : "detach"} photo 2 of ${slug}: ${media.image?.url.split("?")[0].split("/").pop()}`);
  if (DRY) continue;
  userErrors(
    await gql(
      `mutation($f: [FileUpdateInput!]!) { fileUpdate(files: $f) { files { id } userErrors { field message } } }`,
      { f: [{ id: media.id, referencesToRemove: [v.product.id] }] },
    ),
  );
}
console.log("done");
