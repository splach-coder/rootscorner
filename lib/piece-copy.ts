/**
 * V2 feedback (10 Oct 2026), "THE ROOTS CORNER — REVISED PRODUCT DESCRIPTIONS".
 *
 * Each piece has two texts, as the client asked: a short description and
 * "À propos de cette pièce". The French is the client's copy, verbatim. The
 * English is a faithful translation for approval; nothing is added.
 *
 * Keyed by slug (the original product reference). A piece added later in
 * Shopify has no entry and shows what the house wrote there.
 */
type Copy = { short: { fr: string; en: string }; about: { fr: string; en: string } };

const c = (shortFr: string, aboutFr: string, shortEn: string, aboutEn: string): Copy => ({
  short: { fr: shortFr, en: shortEn },
  about: { fr: aboutFr, en: aboutEn },
});

export const PIECE_COPY: Record<string, Copy> = {
  // ---- N° 01 · Sièges & Tabourets ---------------------------------------
  "handcrafted-wood-stool---cote-d-ivoire": c(
    "Tabouret en bois sculpté à la main, originaire de Côte d’Ivoire.",
    "Ce tabouret présente une structure en bois dont les différentes parties ont été sculptées et travaillées pour former l’assise et son support. Les détails de la sculpture sont visibles sur l’ensemble de la pièce.",
    "Hand-carved wooden stool from Côte d’Ivoire.",
    "This stool has a wooden structure whose parts have been carved and worked to form the seat and its base. The details of the carving can be seen across the whole piece.",
  ),
  "hand-carved-tribal-stool-wood": c(
    "Tabouret en bois présentant des reliefs sculptés sur sa structure.",
    "Ce tabouret se compose d’une assise et d’un support en bois sculpté. Les reliefs et les variations de surface permettent d’observer le travail réalisé sur la matière.",
    "Wooden stool with carved relief on its structure.",
    "This stool is made of a seat and a carved wooden base. The relief and the variations of the surface show the work done on the material.",
  ),
  "handmade-wooden-stool": c(
    "Tabouret camerounais de style bamileke, caractérisé par une structure en bois sculpté.",
    "Ce modèle reprend les formes et les motifs associés aux tabourets bamileke du Cameroun. Sa structure sculptée constitue à la fois le support de l’assise et son principal élément décoratif. Son ancienneté et son usage d’origine restent à confirmer.",
    "Cameroonian stool in the Bamileke style, with a carved wooden structure.",
    "This model takes up the forms and motifs associated with Bamileke stools from Cameroon. Its carved structure is both the support of the seat and its main decorative element. Its age and original use remain to be confirmed.",
  ),
  "decorative-wooden-stool": c(
    "Tabouret en bois composé d’une assise et d’une structure de soutien.",
    "Ce tabouret présente une construction simple, centrée sur sa fonction d’assise. Les nuances et les variations visibles du bois font partie de son aspect naturel.",
    "Wooden stool made of a seat and a supporting structure.",
    "This stool has a simple construction, centred on its use as a seat. The shades and visible variations of the wood are part of its natural look.",
  ),
  "wooden-carved-stool": c(
    "Tabouret en bois sculpté, recouvert d’une finition noire vernie.",
    "Originaire de Côte d’Ivoire, ce tabouret présente une structure sculptée et une surface noire brillante. Le vernis recouvre le bois et met en évidence les volumes ainsi que les détails de la sculpture.",
    "Carved wooden stool with a black varnished finish.",
    "From Côte d’Ivoire, this stool has a carved structure and a glossy black surface. The varnish covers the wood and brings out the volumes and the details of the carving.",
  ),
  "handcrafted-stool": c(
    "Tabouret en bois brun orné de détails gravés et d’un liseré doré.",
    "Ce tabouret associe une finition brune à des éléments décoratifs dorés. Des motifs gravés sont présents sur sa surface. Le contraste entre le bois et les détails dorés souligne les différentes parties de sa structure.",
    "Brown wooden stool with engraved details and a gilded rim.",
    "This stool pairs a brown finish with gilded decorative elements. Engraved motifs run over its surface. The contrast between the wood and the gilded details outlines the different parts of its structure.",
  ),
  "handcrafted-varnished-wooden-stool": c(
    "Tabouret en bois verni présentant une structure sculptée et ajourée.",
    "Ce tabouret se distingue par les ouvertures pratiquées dans son support. Ces découpes font partie de sa construction et créent des espaces vides entre les éléments en bois. La surface présente une finition vernie.",
    "Varnished wooden stool with a carved, openwork structure.",
    "This stool stands out for the openings cut into its base. These cut-outs are part of its construction and leave spaces between the wooden elements. The surface has a varnished finish.",
  ),
  "handcrafted-wooden-stool": c(
    "Tabouret en bois noir, doté d’une structure ajourée.",
    "Le support de ce tabouret présente plusieurs ouvertures sculptées dans le bois. Ces découpes sont réparties sous l’assise et constituent les principaux détails de sa construction.",
    "Black wooden stool with an openwork structure.",
    "The base of this stool has several openings carved into the wood. These cut-outs sit under the seat and are the main details of its construction.",
  ),
  "handcrafted-stool-from-cameroon": c(
    "Tabouret traditionnel en bois, originaire du Cameroun.",
    "Ce tabouret présente une assise reposant sur une structure en bois travaillé. Sa forme correspond à un type de mobilier traditionnel utilisé comme siège. Les détails de fabrication et les dimensions sont à préciser dans la fiche technique.",
    "Traditional wooden stool from Cameroon.",
    "This stool has a seat resting on a worked wooden structure. Its form corresponds to a type of traditional furniture used as a seat. The making details and dimensions are to be specified in the technical sheet.",
  ),
  "dogon-stool": c(
    "Tabouret en bois de style dogon, présentant une structure sculptée.",
    "Ce tabouret est associé au mobilier traditionnel dogon d’Afrique de l’Ouest. Sa construction réunit une assise et un support en bois. L’attribution culturelle et l’époque de fabrication doivent être confirmées.",
    "Wooden stool in the Dogon style, with a carved structure.",
    "This stool is associated with the traditional Dogon furniture of West Africa. Its construction brings together a seat and a wooden base. The cultural attribution and the period of making must be confirmed.",
  ),
  "senufo-stool": c(
    "Tabouret en bois de style sénoufo, aux lignes épurées.",
    "Ce tabouret reprend une forme d’assise associée au mobilier sénoufo d’Afrique de l’Ouest. Sa structure en bois présente des lignes simples, avec peu d’éléments décoratifs. Son origine précise reste à vérifier.",
    "Wooden stool in the Senufo style, with clean lines.",
    "This stool takes up a seat form associated with the Senufo furniture of West Africa. Its wooden structure has simple lines, with few decorative elements. Its precise origin remains to be checked.",
  ),
  "baule-chair-cote-d-ivoire": c(
    "Chaise en bois de style baoulé, associée à la Côte d’Ivoire.",
    "Cette chaise présente une structure comprenant une assise et un dossier. Ses formes et ses détails sont associés au mobilier baoulé. La provenance exacte et la période de fabrication doivent être documentées.",
    "Wooden chair in the Baule style, associated with Côte d’Ivoire.",
    "This chair has a structure made of a seat and a back. Its forms and details are associated with Baule furniture. The exact provenance and the period of making must be documented.",
  ),

  // ---- N° 02 · Objets & Sculptures --------------------------------------
  "turtle-shaped-indonesia": c(
    "Objet décoratif indonésien représentant une tortue.",
    "Cet objet reprend la forme d’une tortue, avec une carapace et des éléments figurant la tête et les membres. Sa silhouette animale constitue le principal élément de sa conception. Le matériau et la technique de fabrication sont à préciser.",
    "Indonesian decorative object in the shape of a turtle.",
    "This object takes the shape of a turtle, with a shell and elements representing the head and limbs. Its animal silhouette is the main element of its design. The material and the making technique are to be specified.",
  ),
  "vintage-moroccan-teapot": c(
    "Théière marocaine vintage, initialement destinée à la préparation et au service du thé.",
    "Cette théière reprend la forme traditionnelle des théières marocaines, avec un bec verseur, une anse et un couvercle. Elle est présentée dans la collection comme un objet ancien à usage domestique. Son état doit être vérifié avant toute utilisation alimentaire.",
    "Vintage Moroccan teapot, originally made for preparing and serving tea.",
    "This teapot has the traditional form of Moroccan teapots, with a spout, a handle and a lid. It is presented in the collection as an old household object. Its condition must be checked before any use with food.",
  ),
  "antique-lombok-spinning-top": c(
    "Ancienne toupie originaire de Lombok, en Indonésie.",
    "Cet objet appartient à la famille des toupies traditionnelles utilisées dans les jeux d’adresse. Sa forme est conçue autour d’un axe de rotation. Les éventuelles marques d’usage et les variations de surface doivent être décrites selon l’état réel de la pièce.",
    "Antique spinning top from Lombok, Indonesia.",
    "This object belongs to the family of traditional spinning tops used in games of skill. Its form is built around an axis of rotation. Any marks of use and surface variations must be described according to the actual condition of the piece.",
  ),
  "spinning-top-gasing-indonesia": c(
    "Toupie traditionnelle indonésienne, connue sous le nom de gasing.",
    "Le gasing est un objet utilisé dans les jeux traditionnels de toupie en Indonésie. Sa forme est conçue pour permettre un mouvement de rotation. Cet exemplaire est présenté comme objet de collection.",
    "Traditional Indonesian spinning top, known as a gasing.",
    "The gasing is an object used in traditional spinning-top games in Indonesia. Its form is designed to allow a spinning movement. This example is presented as a collector’s object.",
  ),
  "spice-rack-morocco": c(
    "Petite étagère marocaine conçue pour le rangement des épices.",
    "Cette étagère est associée au rangement d’épices et de petits contenants dans un espace domestique. Sa structure permet de disposer plusieurs objets sur un support commun. Le matériau et les dimensions sont à préciser.",
    "Small Moroccan shelf made for storing spices.",
    "This shelf is associated with storing spices and small containers at home. Its structure lets several objects sit on one support. The material and dimensions are to be specified.",
  ),
  "decorative-iron-disc-indonesian": c(
    "Disque décoratif en fer, originaire d’Indonésie.",
    "Cet objet présente une forme circulaire réalisée en fer. Sa surface et sa finition constituent les principaux éléments à observer. Son usage d’origine n’est pas documenté dans les informations disponibles.",
    "Decorative iron disc from Indonesia.",
    "This object has a circular form made of iron. Its surface and finish are the main elements to look at. Its original use is not documented in the information available.",
  ),
  "lombok-weel-indonesian": c(
    "Objet circulaire traditionnel provenant de Lombok, en Indonésie.",
    "Cette pièce présente une structure en forme de roue. Elle est proposée comme objet décoratif dans la collection. Sa fonction initiale, son matériau et sa période de fabrication restent à confirmer.",
    "Traditional circular object from Lombok, Indonesia.",
    "This piece has a wheel-shaped structure. It is offered as a decorative object in the collection. Its original function, its material and its period of making remain to be confirmed.",
  ),

  // ---- N° 03 · Poteries & Céramiques ------------------------------------
  "handmade-blackened-clay-pot---morocco": c(
    "Pot marocain en argile, caractérisé par une surface noircie.",
    "Ce pot présente une structure en terre cuite et une finition sombre. Les variations de couleur visibles à sa surface font partie de son aspect. Sa méthode de cuisson et son usage d’origine doivent être confirmés.",
    "Moroccan clay pot with a blackened surface.",
    "This pot has a terracotta body and a dark finish. The colour variations visible on its surface are part of its look. Its firing method and original use must be confirmed.",
  ),
  "decorative-ceramic-pot": c(
    "Pot traditionnel marocain en céramique.",
    "Ce pot est réalisé en matière céramique et présente une forme destinée à contenir ou à conserver des éléments. Les variations de surface et de finition dépendent de sa fabrication. Son usage alimentaire éventuel doit être vérifié.",
    "Traditional Moroccan ceramic pot.",
    "This pot is made of ceramic and has a form meant to hold or keep things. The variations of surface and finish come from its making. Any use with food must be checked.",
  ),
  "timeless-hand-carved-wooden-bowl-1": c(
    "Bol en bois sculpté à la main, présentant une forme creuse.",
    "Ce bol est constitué d’une structure en bois travaillée pour former un récipient. L’intérieur est évidé, tandis que les parois et les bords conservent les traces du travail de sculpture. Son usage alimentaire n’est pas confirmé.",
    "Hand-carved wooden bowl with a hollow form.",
    "This bowl is a wooden structure worked into a vessel. The inside is hollowed out, while the walls and rim keep the traces of the carving. Its use with food is not confirmed.",
  ),
  "ancient-african-mortar": c(
    "Ancien mortier en bois, initialement conçu pour le broyage ou la préparation de matières.",
    "Ce mortier présente une cavité creusée dans le bois, destinée à recevoir les matières à travailler. Sa forme est liée à sa fonction utilitaire. L’origine géographique précise et la période de fabrication restent à documenter.",
    "Antique wooden mortar, originally made for grinding or preparing materials.",
    "This mortar has a cavity hollowed out of the wood to hold the materials being worked. Its form follows its practical function. The precise geographical origin and the period of making remain to be documented.",
  ),
  "antique-moroccan-pot": c(
    "Pot ancien marocain présentant une forme traditionnelle.",
    "Ce pot appartient à une catégorie d’objets domestiques utilisés pour contenir ou conserver différentes matières. Son état de surface doit être examiné pour distinguer les traces d’usage des caractéristiques de fabrication.",
    "Antique Moroccan pot with a traditional form.",
    "This pot belongs to a category of household objects used to hold or keep different materials. Its surface must be examined to tell the traces of use from the features of its making.",
  ),
  "antique-moroccan-vase": c(
    "Vase ancien marocain en terre cuite, décoré de motifs peints.",
    "Ce vase présente une structure en terre cuite et des motifs appliqués sur sa surface. Sa forme comprend un corps destiné à contenir des éléments et une ouverture supérieure. Son étanchéité n’est pas garantie.",
    "Antique Moroccan terracotta vase, decorated with painted motifs.",
    "This vase has a terracotta body with motifs applied to its surface. Its form has a body meant to hold things and an opening at the top. It is not guaranteed to be watertight.",
  ),
  "antique-berber-vase": c(
    "Vase ancien en céramique émaillée, associé à l’artisanat berbère.",
    "Ce vase présente une surface recouverte d’émail. La finition peut comporter des variations de couleur et de texture. Son attribution culturelle, son ancienneté et sa provenance précise sont à confirmer.",
    "Antique glazed ceramic vase, associated with Berber craft.",
    "This vase has a glazed surface. The finish may show variations of colour and texture. Its cultural attribution, age and precise provenance are to be confirmed.",
  ),
  "handmade-pottery-vase-made-in-morocco": c(
    "Vase marocain en céramique composé de plusieurs formes tubulaires.",
    "Ce vase présente une construction associant différents volumes cylindriques. Les ouvertures et les éléments tubulaires font partie de sa forme. Il peut être présenté comme objet décoratif indépendamment de son utilisation comme vase.",
    "Moroccan ceramic vase made of several tubular forms.",
    "This vase is built from several cylindrical volumes. The openings and tubular elements are part of its form. It can be shown as a decorative object, apart from its use as a vase.",
  ),
  "tamegroute-candle-s-and-m": c(
    "Bougies parfumées à la fleur d’oranger, présentées dans des contenants en céramique de Tamegroute.",
    "Ces bougies sont proposées en deux tailles, S et M. Leur contenant est réalisé en céramique de Tamegroute, reconnaissable à ses variations d’émail. Le récipient peut être conservé après utilisation, sous réserve d’un nettoyage adapté.",
    "Orange-blossom scented candles in Tamegroute ceramic containers.",
    "These candles come in two sizes, S and M. Their container is made of Tamegroute ceramic, recognisable by the variations of its glaze. The vessel can be kept after use, provided it is cleaned appropriately.",
  ),
  "handmade-ceramic-candlestick-tamgroute": c(
    "Bougeoir en céramique de Tamegroute, destiné à accueillir une bougie.",
    "Ce bougeoir présente une structure en céramique émaillée. Sa forme comprend un emplacement destiné à maintenir une bougie. Les variations de couleur et de finition sont caractéristiques de ce type de production artisanale.",
    "Tamegroute ceramic candlestick, made to hold a candle.",
    "This candlestick has a glazed ceramic structure. Its form includes a place to hold a candle. The variations of colour and finish are typical of this kind of handmade production.",
  ),

  // ---- N° 04 · Objets Anciens & Artisanat -------------------------------
  "dogon-tribal-staff": c(
    "Bâton sculpté en bois, attribué à la tradition dogon.",
    "Cet objet présente une forme allongée avec des éléments sculptés. Il est associé à la tradition dogon d’Afrique de l’Ouest. Sa fonction d’origine, son attribution et son ancienneté nécessitent une vérification.",
    "Carved wooden staff, attributed to the Dogon tradition.",
    "This object has an elongated form with carved elements. It is associated with the Dogon tradition of West Africa. Its original function, its attribution and its age need to be checked.",
  ),
  "tuareg-tent-stakes": c(
    "Piquets de tente en bois associés aux traditions nomades touarègues.",
    "Ces piquets sont des éléments traditionnellement utilisés pour maintenir ou fixer certaines parties d’une tente. Leur forme allongée est liée à cette fonction. Les détails sculptés et les éventuelles traces d’usage varient selon les exemplaires.",
    "Wooden tent stakes associated with Tuareg nomadic traditions.",
    "These stakes are traditionally used to hold or fix parts of a tent. Their elongated form follows that function. The carved details and any traces of use vary from one stake to another.",
  ),
  "authentic-wooden-tent-peg": c(
    "Piquet de tente en bois, de forme allongée.",
    "Cet objet appartient à la catégorie des éléments utilitaires servant à fixer ou à maintenir une structure de tente. Sa forme et ses proportions correspondent à cette fonction. Son origine précise reste à confirmer.",
    "Wooden tent peg with an elongated form.",
    "This object belongs to the practical elements used to fix or hold a tent structure. Its form and proportions follow that function. Its precise origin remains to be confirmed.",
  ),
  "decorative-wooden-tray": c(
    "Tablette ancienne en bois portant des inscriptions en caractères arabes.",
    "Cette tablette présente une surface en bois sur laquelle figurent des inscriptions. La nature du texte, la fonction d’origine de la tablette et son ancienneté doivent être identifiées avant toute attribution historique ou religieuse.",
    "Antique wooden tablet bearing inscriptions in Arabic script.",
    "This tablet has a wooden surface bearing inscriptions. The nature of the text, the tablet’s original function and its age must be identified before any historical or religious attribution.",
  ),
  "solid-wood-pedestal-bowl---ethiopian-and-west-african-craftsmanship-1": c(
    "Coupe en bois massif reposant sur un pied.",
    "Cet objet est composé d’une partie supérieure creuse et d’un support surélevé. Sa structure est réalisée en bois massif. La forme de la coupe permet de la présenter comme objet décoratif, sans présumer de son usage alimentaire.",
    "Solid wood bowl standing on a foot.",
    "This object is made of a hollow upper part and a raised base. Its structure is solid wood. The form of the bowl lets it be shown as a decorative object, without presuming any use with food.",
  ),
  "antique-comb-used-for-weaving-moroccan-rugs": c(
    "Ancien peigne en bois utilisé dans le travail du tissage.",
    "Ce type d’outil intervient dans certaines étapes du travail textile. Sa structure comprend des éléments destinés à accompagner la manipulation des fils. Cet exemplaire est présenté comme un outil artisanal ancien.",
    "Antique wooden comb used in weaving.",
    "This kind of tool is used at certain stages of textile work. Its structure includes elements that help handle the threads. This example is presented as an old craft tool.",
  ),
  "loom-beater-african-art": c(
    "Ancien élément de métier à tisser, associé à l’artisanat textile africain.",
    "Le battant est un élément utilisé dans le fonctionnement de certains métiers à tisser. Il intervient dans la mise en place et le serrage des fils pendant le tissage. La provenance et la période de fabrication de cet exemplaire restent à confirmer.",
    "Antique loom part, associated with African textile craft.",
    "The beater is a part used in the working of certain looms. It places and packs the threads during weaving. The provenance and period of making of this example remain to be confirmed.",
  ),

  // ---- N° 05 · Mobilier & Luminaires ------------------------------------
  "vintage-moroccan-shelf-berbere": c(
    "Étagère marocaine vintage en bois, associée à l’artisanat berbère.",
    "Cette étagère présente une structure conçue pour ranger ou exposer de petits objets. Ses éléments en bois forment un support de rangement. Son origine exacte, son ancienneté et sa capacité de charge doivent être confirmées.",
    "Vintage Moroccan wooden shelf, associated with Berber craft.",
    "This shelf has a structure made to store or display small objects. Its wooden elements form a storage support. Its exact origin, its age and its load capacity must be confirmed.",
  ),
  "wabi-sabi-moroccan-vase-lamp": c(
    "Lampe réalisée à partir d’un ancien vase marocain, associée à un abat-jour en lin naturel.",
    "Cette lampe réutilise un vase ancien en céramique comme pied de luminaire. Un abat-jour en lin naturel complète l’ensemble. Le vase a été adapté pour recevoir un système d’éclairage électrique, dont les caractéristiques techniques doivent figurer dans la fiche produit.",
    "Lamp made from an antique Moroccan vase, with a natural linen shade.",
    "This lamp reuses an antique ceramic vase as its base. A natural linen shade completes it. The vase has been adapted to take an electric fitting, whose technical characteristics must appear in the product sheet.",
  ),

  // ---- Tapis Mrirt (their dedicated page) -------------------------------
  "tapis-laine-sable-carreaux-ocre": c(
    "Tapis Mrirt en laine, dans des tons sable, avec un motif géométrique ocre.",
    "Ce tapis présente un fond de couleur sable, traversé par un motif à carreaux dans des nuances ocre. Le contraste entre les deux couleurs définit sa composition. Les dimensions, la hauteur du velours et les conditions de fabrication doivent être précisées dans la fiche technique.",
    "Mrirt wool rug in sand tones, with an ochre geometric pattern.",
    "This rug has a sand-coloured ground crossed by a check pattern in ochre shades. The contrast between the two colours defines its composition. The dimensions, pile height and making conditions must be given in the technical sheet.",
  ),
  "tapis-laine-prune-frise": c(
    "Tapis Mrirt en laine, de couleur prune, orné d’un motif en frise.",
    "Ce tapis présente une couleur prune dominante, accompagnée d’un motif décoratif en frise. Le dessin est intégré à la composition du tapis. Les dimensions, la hauteur du velours et les éventuelles options de personnalisation doivent être indiquées séparément.",
    "Mrirt wool rug in plum, with a frieze pattern.",
    "This rug is mainly plum, with a decorative frieze pattern. The design is part of the rug’s composition. The dimensions, pile height and any customisation options must be stated separately.",
  ),
};

/** The five categories of the collection (V2): which pieces go where. */
export const GROUP_OF: Record<string, string> = {
  stools: "sieges-tabourets",
  decoration: "objets-sculptures",
  pots: "poteries-ceramiques",
  vases: "poteries-ceramiques",
  "ceramics-tamegroute": "poteries-ceramiques",
  "african-decoration": "objets-anciens-artisanat",
  lamp: "mobilier-luminaires",
};

/** Pieces whose old room does not decide their V2 category. */
export const GROUP_OVERRIDE: Record<string, string> = {
  // Listed under N° 05 · Mobilier & Luminaires in the client's V2 structure.
  "vintage-moroccan-shelf-berbere": "mobilier-luminaires",
};
