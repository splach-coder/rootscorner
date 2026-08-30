/**
 * French for the client's product copy.
 *
 * ## This is translation, not authorship
 *
 * CLAUDE.md §11 and §5 both bind here. Every entry below renders one English
 * sentence the client wrote into French. Nothing is added, sharpened, or
 * inferred: where the English is vague about an origin or an era, the French
 * is vague in the same way, and where the English is silent the French is
 * silent. A translation that improves on its source is a new claim about
 * somebody's antique furniture.
 *
 * Two consequences worth stating, because they look like mistakes:
 *
 * - **Product NAMES are not translated.** "Dogon Stool" stays "Dogon Stool" on
 *   /fr. Tribal and regional attributions work as proper nouns in the trade —
 *   a dealer says Dogon, Senufo, Baule in any language — and inventing a
 *   French name for an object whose name is the client's own record is exactly
 *   the invention §5 forbids. Several names also carry typos in the source
 *   (§13), and correcting those is the client's call, not ours.
 *
 * - **The delivery window is translated literally.** Every product says
 *   "1 - 2 Weeks" while the FAQ says 3–8 weeks for Europe (§9.3). The French
 *   reproduces the claim on the product record and does not reconcile it.
 *   Picking a number would be taking a position on the client's behalf.
 *
 * ## Keyed by the English string
 *
 * The source is a scrape with no stable per-field identity, so the English
 * sentence itself is the key. That makes every entry independently reviewable
 * by the client — and it means an untranslated line falls back to English
 * rather than disappearing, which is the safe direction to fail.
 *
 * `scripts/check-fr.mjs` reports coverage and flags any key that no longer
 * appears in the catalogue.
 */

/** English → French. Keys are matched trimmed and exactly. */
export const PRODUCT_FR: Record<string, string> = {
  // ---- Delivery ---------------------------------------------------------
  "1 - 2 Weeks": "1 à 2 semaines",

  // ---- Returns ----------------------------------------------------------
  // The client's own heading, spelled four ways in the source ("Return &
  // refunf" among them). All four map to the correct French; the typos are
  // not reproduced because they are misspellings of a heading, not content.
  "Return & Refund": "Retours et remboursements",
  "Return & refund": "Retours et remboursements",
  "Return & refunds": "Retours et remboursements",
  "Return & refunf": "Retours et remboursements",
  "Due to the fragile nature of our products, returns and refunds are not accepted once an order has been shipped. All sales are final after order confirmation.":
    "En raison de la fragilité de nos produits, les retours et remboursements ne sont pas acceptés une fois la commande expédiée. Toute vente est définitive après confirmation de la commande.",

  // ---- Care -------------------------------------------------------------
  "Clean only with a soft, dry cloth": "Nettoyer uniquement avec un chiffon doux et sec",
  "Clean only with a soft, dry cloth.": "Nettoyer uniquement avec un chiffon doux et sec.",
  "Clean with a soft, dry cloth": "Nettoyer avec un chiffon doux et sec",
  "Clean with a soft, dry cloth.": "Nettoyer avec un chiffon doux et sec.",
  "Clean only with a dry cloth": "Nettoyer uniquement avec un chiffon sec",
  "Clean only with a dry, soft cloth.": "Nettoyer uniquement avec un chiffon doux et sec.",
  "Clean only with a dry, soft cloth, without chemicals.":
    "Nettoyer uniquement avec un chiffon doux et sec, sans produits chimiques.",
  "All you need is a soft cloth; avoid moisture and harsh cleaning products to keep the wood looking beautiful for years to come.":
    "Un chiffon doux suffit ; évitez l’humidité et les produits d’entretien agressifs pour conserver la beauté du bois durant des années.",
  "Do not use abrasive products": "Ne pas utiliser de produits abrasifs",
  "Do not use chemical or abrasive products": "Ne pas utiliser de produits chimiques ou abrasifs",
  "Do not use chemicals or abrasive products": "Ne pas utiliser de produits chimiques ou abrasifs",
  "Do not use chemical or abrasive products for cleaning":
    "Ne pas utiliser de produits chimiques ou abrasifs pour le nettoyage",
  "Do not use harsh chemical products.": "Ne pas utiliser de produits chimiques agressifs.",
  "Do not use harsh chemicals or abrasive cleaning products":
    "Ne pas utiliser de produits chimiques agressifs ou de nettoyants abrasifs",
  "Do not clean with chemical or abrasive products.":
    "Ne pas nettoyer avec des produits chimiques ou abrasifs.",
  "Avoid abrasive products to preserve the enamel":
    "Éviter les produits abrasifs afin de préserver l’émail",
  "Avoid chemicals or abrasives that could damage the varnish":
    "Éviter les produits chimiques ou abrasifs susceptibles d’endommager le vernis",
  "Avoid harsh chemicals when cleaning":
    "Éviter les produits chimiques agressifs lors du nettoyage",
  "Gentle hand washing recommended": "Lavage à la main en douceur recommandé",
  "Dry carefully after washing": "Sécher soigneusement après lavage",
  "Do not put the teapot in the dishwasher": "Ne pas mettre la théière au lave-vaisselle",

  // ---- Humidity, light, temperature -------------------------------------
  "Avoid prolonged exposure to humidity": "Éviter une exposition prolongée à l’humidité",
  "Avoid prolonged exposure to humidity.": "Éviter une exposition prolongée à l’humidité.",
  "Avoid prolonged exposure to moisture": "Éviter une exposition prolongée à l’humidité",
  "Avoid prolonged exposure to humidity and water.":
    "Éviter une exposition prolongée à l’humidité et à l’eau.",
  "Avoid prolonged exposure to humidity to preserve both wood and metal":
    "Éviter une exposition prolongée à l’humidité afin de préserver le bois comme le métal",
  "Avoid prolonged exposure to moisture, even with the varnish finish":
    "Éviter une exposition prolongée à l’humidité, même avec la finition vernie",
  "Avoid prolonged contact with water or moisture.":
    "Éviter un contact prolongé avec l’eau ou l’humidité.",
  "Avoid water, moisture, and chemicals.":
    "Éviter l’eau, l’humidité et les produits chimiques.",
  "Avoid moisture and impacts": "Éviter l’humidité et les chocs",
  "Keep away from humidity and outdoor exposure":
    "Tenir à l’écart de l’humidité et de l’exposition extérieure",
  "Do not expose to sudden temperature changes":
    "Ne pas exposer à des changements brusques de température",
  "Do not expose directly to a heat source or intense sunlight to preserve the natural patina.":
    "Ne pas exposer directement à une source de chaleur ou à un fort ensoleillement afin de préserver la patine naturelle.",
  "Do not expose to direct sunlight for long periods to preserve the wood’s patina.":
    "Ne pas exposer longuement à la lumière directe du soleil afin de préserver la patine du bois.",
  "Do not expose to prolonged moisture or direct heat sources (radiators, intense sunlight).":
    "Ne pas exposer à une humidité prolongée ni à des sources de chaleur directes (radiateurs, fort ensoleillement).",

  // ---- Handling ---------------------------------------------------------
  "Handle with care to avoid impact": "Manipuler avec précaution pour éviter les chocs",
  "Handle with care to avoid impacts": "Manipuler avec précaution pour éviter les chocs",
  "Handle with care (fragile ceramic)": "Manipuler avec précaution (céramique fragile)",
  "Handle with care (the wood may be sensitive to impact)":
    "Manipuler avec précaution (le bois peut être sensible aux chocs)",
  "Handle with care, as the wood may be sensitive to wear or impact.":
    "Manipuler avec précaution, le bois pouvant être sensible à l’usure ou aux chocs.",
  "Handle with care to avoid bending or damaging the metal":
    "Manipuler avec précaution pour éviter de plier ou d’abîmer le métal",
  "Handle with care to preserve structure and finish":
    "Manipuler avec précaution afin de préserver la structure et la finition",
  "Handle with care to preserve the carvings and golden finishes":
    "Manipuler avec précaution afin de préserver les sculptures et les finitions dorées",
  "Handle with care to preserve the moldings and carved details":
    "Manipuler avec précaution afin de préserver les moulures et les détails sculptés",
  "Avoid impacts and drops": "Éviter les chocs et les chutes",
  "Avoid heavy loads or excessive pressure on fragile areas":
    "Éviter les charges lourdes ou une pression excessive sur les parties fragiles",
  "Ancient and fragile object: handle with care.":
    "Objet ancien et fragile : manipuler avec précaution.",
  "Antique and fragile item: handle with care":
    "Objet ancien et fragile : manipuler avec précaution",
  "Antique and collectible item: handle with extreme care":
    "Objet ancien et de collection : manipuler avec la plus grande précaution",
  "Fragile item": "Objet fragile",
  "To be placed on a stable, flat surface": "À poser sur une surface plane et stable",

  // ---- Indoor / outdoor use ---------------------------------------------
  "Do not place outdoors.": "Ne pas placer à l’extérieur.",
  "Do not place outdoors in an unprotected area":
    "Ne pas placer à l’extérieur dans un endroit non protégé",
  "Do not use outdoors without protection": "Ne pas utiliser à l’extérieur sans protection",
  "For indoor use or in a sheltered area.": "Pour un usage intérieur ou en zone abritée.",
  "Recommended for indoor use.": "Usage intérieur recommandé.",
  "Indoor use recommended to maintain its condition":
    "Usage intérieur recommandé pour préserver son état",
  "Recommended for indoor use to preserve the quality of the wood and engravings.":
    "Usage intérieur recommandé afin de préserver la qualité du bois et des gravures.",
  "For indoor use only. Avoid prolonged exposure to direct sunlight, moisture and extreme temperature changes. Clean with a soft, dry cloth. Do not use abrasive or chemical cleaning products.":
    "Usage intérieur uniquement. Éviter une exposition prolongée à la lumière directe du soleil, à l’humidité et aux changements extrêmes de température. Nettoyer avec un chiffon doux et sec. Ne pas utiliser de nettoyants abrasifs ou chimiques.",

  // ---- Decorative use ---------------------------------------------------
  "Decorative use recommended only": "Usage décoratif recommandé uniquement",
  "Recommended for decorative use to preserve the piece":
    "Usage décoratif recommandé afin de préserver la pièce",
  "Recommended decorative object for indoor use":
    "Objet décoratif recommandé pour un usage intérieur",
  "Recommended for decorative use (use with water only if specified for the item)":
    "Usage décoratif recommandé (utilisation avec de l’eau uniquement si cela est précisé pour l’objet)",
  "Recommended for decorative use only (do not use for food preparation).":
    "Usage décoratif recommandé uniquement (ne pas utiliser pour la préparation alimentaire).",
  "Decorative item only, not intended for functional use.":
    "Objet décoratif uniquement, non destiné à un usage fonctionnel.",
  "For decorative use only (not intended to be used as a toy)":
    "Usage décoratif uniquement (non destiné à être utilisé comme jouet)",
  "For decorative use only; not intended for regular functional seating":
    "Usage décoratif uniquement ; non destiné à une assise fonctionnelle régulière",
  "For decorative purposes only; not intended for structural or tent use.":
    "À des fins décoratives uniquement ; non destiné à un usage structurel ou de tente.",
  "Do not use as a modern functional tool":
    "Ne pas utiliser comme outil fonctionnel moderne",
  "Avoid sitting on it excessively or using it as a step stool unless it is designed to support heavy weight.":
    "Éviter de s’y asseoir de façon excessive ou de l’utiliser comme marchepied, sauf s’il est conçu pour supporter une charge importante.",

  // ---- Object type ------------------------------------------------------
  "Decorative indoor object": "Objet décoratif d’intérieur",
  "Decorative interior object": "Objet décoratif d’intérieur",
  "Decorative indoor stool": "Tabouret décoratif d’intérieur",
  "Decorative stool for indoor use": "Tabouret décoratif pour usage intérieur",
  "Decorative vase for indoor use": "Vase décoratif pour usage intérieur",
  "Decorative object for kitchen or living room":
    "Objet décoratif pour la cuisine ou le salon",
  "Decorative object with high artistic value":
    "Objet décoratif à forte valeur artistique",
  "Decorative wall hanging or freestanding piece.":
    "Pièce décorative à suspendre au mur ou à poser.",
  "Teapot for preparing and serving tea": "Théière pour préparer et servir le thé",
  "Handcrafted African wooden mortar": "Mortier africain en bois, fait main",
  "Handcrafted pottery vase": "Vase en poterie, fait main",
  "Handcrafted vase": "Vase fait main",
  "Handcrafted black wooden stool": "Tabouret en bois noir, fait main",
  "Hand-carved artisanal stool": "Tabouret artisanal sculpté à la main",
  "Vintage black stool in dark varnished wood":
    "Tabouret vintage noir en bois vernis foncé",
  "Antique Bamileke royal wooden stool.":
    "Tabouret royal Bamileke ancien en bois",
  "Authentic antique wooden shelf.": "Étagère ancienne authentique en bois",
  "Traditional Moroccan ceramic pot": "Pot marocain traditionnel en céramique",
  "Traditional ancestral spinning top mounted on a metal rod":
    "Toupie ancestrale traditionnelle montée sur une tige métallique",
  "Metal hook comb, engraved with Berber designs and featuring a wooden handle.":
    "Peigne à crochet en métal, gravé de motifs berbères et doté d’un manche en bois.",
  "Handcrafted collector’s piece": "Pièce de collection faite main",
  "Handcrafted artisanal piece": "Pièce artisanale faite main",

  // ---- Material and finish ----------------------------------------------
  "Natural solid wood": "Bois massif naturel",
  "Solid carved wood": "Bois massif sculpté",
  "Solid wood construction": "Construction en bois massif",
  "Solid wood with a natural deep brown patina.":
    "Bois massif à la patine naturelle brun profond.",
  "Antique solid wood, weathered by time.":
    "Bois massif ancien, patiné par le temps.",
  "Entirely hand-carved.": "Entièrement sculpté à la main.",
  "Natural patina": "Patine naturelle",
  "Natural finish with a raw, authentic look":
    "Finition naturelle à l’aspect brut et authentique",
  "Natural finish, without excessive restoration.":
    "Finition naturelle, sans restauration excessive.",
  "Natural, clean finishes": "Finitions naturelles et nettes",
  "Handcrafted finish": "Finition faite main",
  "Handcrafted natural materials": "Matériaux naturels travaillés à la main",
  "Elegant deep varnish finish": "Élégante finition vernie profonde",
  "Varnished finish to protect and enhance the wood":
    "Finition vernie pour protéger et mettre en valeur le bois",
  "Engraved traditional motifs": "Motifs traditionnels gravés",
  "African-inspired decorative moldings":
    "Moulures décoratives d’inspiration africaine",
  "Combination of terracotta and white ceramic":
    "Association de terre cuite et de céramique blanche",
  "Material: terracotta / handmade ceramic":
    "Matière : terre cuite / céramique faite main",
  "Made using ancient pottery techniques":
    "Réalisé selon des techniques de poterie anciennes",
  "Surface intentionally darkened through traditional firing methods":
    "Surface volontairement noircie par des méthodes de cuisson traditionnelles",
  "Handcrafted structure with traditional design":
    "Structure faite main au design traditionnel",
  "Slightly cracked bars, natural result of aging":
    "Barreaux légèrement fendillés, résultat naturel du vieillissement",
  "Visible traces of Arabic writing.": "Traces visibles d’écriture arabe.",

  // ---- Style ------------------------------------------------------------
  "Minimalist and sculptural design": "Design minimaliste et sculptural",
  "Contemporary, ethnic, and minimalist style":
    "Style contemporain, ethnique et minimaliste",
  "Ethnic and authentic style": "Style ethnique et authentique",
  "Traditional and cultural style.": "Style traditionnel et culturel.",
  "Decorative style: ethnic, contemporary, and sculptural":
    "Style décoratif : ethnique, contemporain et sculptural",
  "Inspired by Moroccan craftsmanship": "Inspiré de l’artisanat marocain",
  "Inspired by traditional Moroccan craftsmanship":
    "Inspiré de l’artisanat marocain traditionnel",
  "Traditional African craftsmanship": "Artisanat africain traditionnel",
  "Traditional handcrafted, not mass-produced":
    "Fait main de façon traditionnelle, non produit en série",

  // ---- Placement and pairing --------------------------------------------
  "Ideal for a living room, entryway, or shelf":
    "Idéal pour un salon, une entrée ou une étagère",
  "Ideal for enhancing a living room, hallway, or bedroom":
    "Idéal pour mettre en valeur un salon, un couloir ou une chambre",
  "Ideal as a decorative element (living room, bedroom, entryway)":
    "Idéal comme élément décoratif (salon, chambre, entrée)",
  "Ideal for shelves, sideboards, or consoles":
    "Idéal pour les étagères, buffets ou consoles",
  "Ideal for dried flowers or decorative branches":
    "Idéal pour des fleurs séchées ou des branches décoratives",
  "Ideal for ethnic or vintage-style decor":
    "Idéal pour une décoration de style ethnique ou vintage",
  "Ideal for ethnic, bohemian, or contemporary decor":
    "Idéal pour une décoration ethnique, bohème ou contemporaine",
  "Ideal for ethnic, raw, contemporary, or art gallery-style settings":
    "Idéal pour des intérieurs ethniques, bruts, contemporains ou de type galerie d’art",
  "Ideal for an oriental, traditional, or ethnic ambiance":
    "Idéal pour une ambiance orientale, traditionnelle ou ethnique",
  "Ideal for a collection, ethnic decor, or private museum.":
    "Idéal pour une collection, une décoration ethnique ou un musée privé.",
  "Perfect for ethnic, vintage, or bohemian interior decor":
    "Parfait pour une décoration intérieure ethnique, vintage ou bohème",
  "Suitable for bohemian, ethnic, or contemporary interiors":
    "Convient aux intérieurs bohèmes, ethniques ou contemporains",
  "Suitable for ethnic, bohemian, or vintage interior styles":
    "Convient aux styles d’intérieur ethniques, bohèmes ou vintage",
  "Suitable for modern, bohemian, or minimalist interiors":
    "Convient aux intérieurs modernes, bohèmes ou minimalistes",
  "Suitable for modern, ethnic, or classic interior styles":
    "Convient aux styles d’intérieur modernes, ethniques ou classiques",
  "Suitable for living rooms, entryways, or decorative spaces":
    "Convient aux salons, entrées ou espaces décoratifs",
  "Can be incorporated into a bohemian, vintage, or cultural interior.":
    "Peut s’intégrer à un intérieur bohème, vintage ou culturel.",
  "Can be placed on the floor, on a stand, or mounted on the wall, depending on your desired decor.":
    "Peut être posé au sol, sur un support ou fixé au mur, selon la décoration souhaitée.",
  "Can be used as a centerpiece in interior decoration":
    "Peut servir de pièce maîtresse dans une décoration intérieure",
  "Can be used as a centerpiece on a table, shelf, or sideboard":
    "Peut servir de pièce maîtresse sur une table, une étagère ou un buffet",
  "Can be used as a decorative accent (living room, entryway, bedroom)":
    "Peut servir d’accent décoratif (salon, entrée, chambre)",
  "Can be used as a decorative piece (living room, entryway, bedroom)":
    "Peut servir de pièce décorative (salon, entrée, chambre)",
  "Can be used as an occasional chair": "Peut servir de chaise d’appoint",
  "Can be used as an occasional seat": "Peut servir d’assise d’appoint",
  "Can be used as an occasional stool or decorative stand":
    "Peut servir de tabouret d’appoint ou de support décoratif",
  "Can be used as a collector’s piece": "Peut être conservé comme pièce de collection",
  "Can be displayed as a collector’s piece": "Peut être exposé comme pièce de collection",
  "Can be displayed as a handcrafted decorative piece":
    "Peut être exposé comme pièce décorative artisanale",
  "Can be displayed in a showcase or on a shelf":
    "Peut être exposé en vitrine ou sur une étagère",

  // ---- Uniqueness, patina, age ------------------------------------------
  "Each piece is unique": "Chaque pièce est unique",
  "Each stool tells a unique story": "Chaque tabouret raconte une histoire unique",
  "One-of-a-kind piece": "Pièce unique",
  "One-of-a-kind piece (each vase may vary slightly)":
    "Pièce unique (chaque vase peut légèrement varier)",
  "One-of-a-kind piece (shapes, inscriptions, and wear may vary).":
    "Pièce unique (les formes, les inscriptions et l’usure peuvent varier).",
  "One-of-a-kind decorative piece (slight variations may occur)":
    "Pièce décorative unique (de légères variations sont possibles)",
  "A one-of-a-kind handmade item: irregularities and variations are part of its charm":
    "Objet unique fait main : les irrégularités et les variations font partie de son charme",
  "Handcrafted item: each piece may present slight variations":
    "Objet fait main : chaque pièce peut présenter de légères variations",
  "Handcrafted item: each piece may present variations in shape, color, and finish":
    "Objet fait main : chaque pièce peut présenter des variations de forme, de couleur et de finition",
  "Handcrafted product: Each piece is unique and may vary slightly in shape, color, or engraving.":
    "Produit fait main : chaque pièce est unique et peut varier légèrement de forme, de couleur ou de gravure.",
  "Antique handcrafted item: each piece may present natural irregularities":
    "Objet ancien fait main : chaque pièce peut présenter des irrégularités naturelles",
  "Antique handcrafted item: irregularities and variations are part of its authenticity":
    "Objet ancien fait main : les irrégularités et les variations font partie de son authenticité",
  "Antique handcrafted item: irregularities, slight cracks, or surface variations are normal and are part of its authenticity":
    "Objet ancien fait main : les irrégularités, légères fissures ou variations de surface sont normales et font partie de son authenticité",
  "Antique or handcrafted item: slight signs of wear are normal and part of its authenticity":
    "Objet ancien ou fait main : de légers signes d’usure sont normaux et font partie de son authenticité",
  "Antique, handcrafted item: Each mortar is unique and may have cracks, irregularities, or signs of wear related to its history.":
    "Objet ancien fait main : chaque mortier est unique et peut présenter des fissures, des irrégularités ou des signes d’usure liés à son histoire.",
  "Vintage and handmade item: imperfections and cracks are part of its authenticity":
    "Objet vintage fait main : les imperfections et les fissures font partie de son authenticité",
  "As each piece is made from natural wood, colors, textures, and shapes may slightly vary.":
    "Chaque pièce étant réalisée en bois naturel, les couleurs, les textures et les formes peuvent légèrement varier.",
  "Possible presence of cracks, wear, or irregularities due to age":
    "Présence possible de fissures, d’usure ou d’irrégularités dues à l’âge",
  "Normal presence of wear marks, scratches, or patina related to its past use":
    "Présence normale de marques d’usure, de rayures ou de patine liées à son usage passé",
  "Authentic piece showing signs of use and age":
    "Pièce authentique présentant des signes d’usage et d’âge",
  "Authentic piece with signs of use and a patina of age":
    "Pièce authentique présentant des signes d’usage et une patine du temps",
  "Inscriptions and signs of aging are intentionally preserved and are part of the object’s authenticity.":
    "Les inscriptions et les signes de vieillissement sont volontairement conservés et font partie de l’authenticité de l’objet.",
  "This vintage piece has been naturally aged, and its signs of use are an integral part of its authenticity and appeal. Within this “perfectly imperfect” aesthetic, these marks are not considered flaws but rather part of its story and identity.":
    "Cette pièce vintage a vieilli naturellement, et ses signes d’usage font partie intégrante de son authenticité et de son attrait. Dans cette esthétique « parfaitement imparfaite », ces marques ne sont pas considérées comme des défauts mais comme une part de son histoire et de son identité.",

  // ---- Provenance the client states -------------------------------------
  "Originating from Cameroon.": "Originaire du Cameroun.",
  "Origin: Bandama Valley (Ivory Coast), 20th century":
    "Origine : vallée du Bandama (Côte d’Ivoire), XXᵉ siècle",
  "Dating from the first half of the 20th century.":
    "Datant de la première moitié du XXᵉ siècle.",
  "Antique object once used as a traditional toy":
    "Objet ancien autrefois utilisé comme jouet traditionnel",

  // ---- Character lines --------------------------------------------------
  "A piece that is both decorative and historic":
    "Une pièce à la fois décorative et historique",
  "A piece with a unique, historic character":
    "Une pièce au caractère unique et historique",
  "A rare and authentic decorative piece.":
    "Une pièce décorative rare et authentique.",
  "A statement piece to add character to a space.":
    "Une pièce forte pour donner du caractère à un espace.",
  "A true traditional chief’s throne.":
    "Un véritable trône de chef traditionnel.",
  "An everyday object transformed into a decorative piece":
    "Un objet du quotidien transformé en pièce décorative",
  "An object steeped in history and memory.":
    "Un objet chargé d’histoire et de mémoire.",
  "A beautiful blend of tradition and wabi-sabi aesthetics, this pot is a must-have for lovers of raw, artisanal decor.":
    "Beau mélange de tradition et d’esthétique wabi-sabi, ce pot est incontournable pour les amateurs de décoration brute et artisanale.",
  "Authentic Moroccan Craftsmanship : A piece of history, shaped by hand and fire.":
    "Artisanat marocain authentique : un morceau d’histoire, façonné à la main et par le feu.",
  "Organic Texture & Rich Patina : The natural variations in the clay add depth and warmth to any decor.":
    "Texture organique et patine riche : les variations naturelles de l’argile apportent profondeur et chaleur à toute décoration.",
  "Timeless & Unique : Each pot carries its own imperfections, making it one-of-a-kind.":
    "Intemporel et unique : chaque pot porte ses propres imperfections, ce qui le rend unique.",
  "Versatile Styling : Perfect as a statement accent, a unique planter, or a shelf display.":
    "Mise en scène polyvalente : parfait comme accent fort, cache-pot original ou objet d’étagère.",
  "Its aged charm and unique ethnic motifs make it a distinctive decorative object, perfect for adding a warm and authentic touch to your interior. Placed on a shelf, piece of furniture, or console, it draws the eye and enhances any space with elegance.":
    "Son charme patiné et ses motifs ethniques singuliers en font un objet décoratif distinctif, parfait pour apporter une touche chaleureuse et authentique à votre intérieur. Posé sur une étagère, un meuble ou une console, il attire le regard et met en valeur l’espace avec élégance.",
  "Today, this memory-filled object finds new life as a decorative piece. Bring a touch of authenticity and character to your interior with this beautiful ancestral toy.":
    "Aujourd’hui, cet objet chargé de mémoire trouve une nouvelle vie comme pièce décorative. Apportez une touche d’authenticité et de caractère à votre intérieur avec ce beau jouet ancestral.",

  // ---- Full descriptions -------------------------------------------------
  "The Baoulé chair is a traditional wooden chair from Côte d’Ivoire. It is hand-carved and known for its low seat, vertical backrest and simple, structured design. Each piece is unique due to the natural variations in the wood and the handcrafting process.":
    "La chaise Baoulé est une chaise traditionnelle en bois de Côte d’Ivoire. Sculptée à la main, elle est connue pour son assise basse, son dossier vertical et son design simple et structuré. Chaque pièce est unique en raison des variations naturelles du bois et du travail artisanal.",
  "This Dogon stool is distinguished by its simple form and timeless character. A versatile piece that can be used as a stool, side table, or sculptural accent within the home.":
    "Ce tabouret Dogon se distingue par sa forme simple et son caractère intemporel. Une pièce polyvalente, qui peut servir de tabouret, de table d’appoint ou d’accent sculptural dans la maison.",
  "Hand-carved from a single piece of wood, the Senufo stool is a timeless object originating from West Africa. Traditionally used as a seat, it now serves equally well as a side table, pedestal, or decorative accent. Each piece is unique, marked by the natural variations of the wood and the hand of the artisan.":
    "Sculpté à la main dans une seule pièce de bois, le tabouret Senufo est un objet intemporel originaire d’Afrique de l’Ouest. Traditionnellement utilisé comme assise, il sert aujourd’hui tout aussi bien de table d’appoint, de sellette ou d’accent décoratif. Chaque pièce est unique, marquée par les variations naturelles du bois et la main de l’artisan.",
  "This black stool in dark varnished wood features an elegant, deep finish. Its slightly cracked bars bear witness to the passage of time, enhancing its unique character while preserving its decorative charm and structural solidity.":
    "Ce tabouret noir en bois vernis foncé présente une finition élégante et profonde. Ses barreaux légèrement fendillés témoignent du passage du temps, renforçant son caractère unique tout en préservant son charme décoratif et sa solidité structurelle.",
  "Entirely hand-carved, this stool showcases the richness and refinement of traditional African craftsmanship. Its deep aged brown patina, shaped by time and marks of use, gives it a rare authenticity and a unique character.":
    "Entièrement sculpté à la main, ce tabouret met en valeur la richesse et le raffinement de l’artisanat africain traditionnel. Sa patine brune profonde, façonnée par le temps et les marques d’usage, lui confère une authenticité rare et un caractère unique.",
  "This candle is handcrafted in Tamegroute, Morocco. Each ceramic vessel is shaped and glazed by hand, resulting in subtle variations that make every piece unique. Scented with Moroccan orange blossom, it offers a fresh, floral scent. Once the candle has burned, the ceramic vessel can be reused as a decorative object.":
    "Cette bougie est fabriquée à la main à Tamegroute, au Maroc. Chaque contenant en céramique est façonné et émaillé à la main, ce qui donne des variations subtiles rendant chaque pièce unique. Parfumée à la fleur d’oranger marocaine, elle offre une senteur fraîche et florale. Une fois la bougie consumée, le contenant en céramique peut être réutilisé comme objet décoratif.",
  "This is an ancestral spinning top mounted on a metal rod. Once used as a traditional toy, it bears the marks of its use, reflecting its history and authenticity.":
    "Il s’agit d’une toupie ancestrale montée sur une tige métallique. Autrefois utilisée comme jouet traditionnel, elle porte les marques de son usage, reflet de son histoire et de son authenticité.",
  "Antique wooden tent stake, finely hand-carved with traditional ethnic motifs. Its slender silhouette and engraved details make it an elegant and authentic decorative piece.":
    "Piquet de tente ancien en bois, finement sculpté à la main de motifs ethniques traditionnels. Sa silhouette élancée et ses détails gravés en font une pièce décorative élégante et authentique.",
  "Discover an authentic antique hook comb, once used to brush and maintain carpets with precision. A true piece steeped in history, this antique object captivates with its artisanal charm, unique character, and authenticity. Ideal as a vintage decorative piece or collector’s item, it adds a rustic and timeless touch to your home.":
    "Découvrez un authentique peigne à crochet ancien, autrefois utilisé pour brosser et entretenir les tapis avec précision. Véritable pièce chargée d’histoire, cet objet ancien séduit par son charme artisanal, son caractère unique et son authenticité. Idéal comme pièce décorative vintage ou objet de collection, il apporte une touche rustique et intemporelle à votre intérieur.",
  "Discover this handcrafted stool made entirely of wood, crafted with authentic expertise and unique details. Its legs are adorned with finely carved faces, adding character and an artistic touch to this decorative piece. Both sturdy and elegant, this wooden stool combines traditional charm with authenticity, making it the perfect choice to enhance a warm and original interior design.":
    "Découvrez ce tabouret artisanal entièrement en bois, réalisé avec un savoir-faire authentique et des détails singuliers. Ses pieds sont ornés de visages finement sculptés, apportant du caractère et une touche artistique à cette pièce décorative. À la fois robuste et élégant, ce tabouret en bois allie charme traditionnel et authenticité, ce qui en fait le choix idéal pour sublimer une décoration intérieure chaleureuse et originale.",
  "Give a touch of authenticity and originality to your interior décor with this antique glazed Berber vase. A genuine handcrafted piece with timeless charm, it captivates with its unique details, historical character, and distinctive finish. Perfect for creating a warm and elegant atmosphere, this antique vase brings an ethnic flair and a unique charm to your living space.":
    "Donnez une touche d’authenticité et d’originalité à votre décoration intérieure avec ce vase berbère ancien émaillé. Véritable pièce artisanale au charme intemporel, il séduit par ses détails singuliers, son caractère historique et sa finition distinctive. Parfait pour créer une atmosphère chaleureuse et élégante, ce vase ancien apporte une note ethnique et un charme unique à votre espace de vie.",
  "Handcrafted in Morocco, this ceramic candlestick reflects the distinctive character of traditional Tamegroute pottery. Defined by its organic form and natural finish, it brings texture, warmth, and a timeless presence to any interior.":
    "Fabriqué à la main au Maroc, ce bougeoir en céramique reflète le caractère distinctif de la poterie traditionnelle de Tamegroute. Défini par sa forme organique et sa finition naturelle, il apporte texture, chaleur et une présence intemporelle à tout intérieur.",
  "Handcrafted in Morocco, this sculptural vase is composed of interconnected tubular forms that create a striking architectural silhouette. Its balance of traditional craftsmanship and contemporary design makes it a distinctive decorative piece for any space.":
    "Fabriqué à la main au Maroc, ce vase sculptural se compose de formes tubulaires reliées entre elles qui créent une silhouette architecturale saisissante. Son équilibre entre artisanat traditionnel et design contemporain en fait une pièce décorative distinctive pour tout espace.",
  "This traditional Moroccan clay pot, handcrafted using ancestral pottery techniques, embodies both functionality and raw beauty. Its distinctive blackened surface results from a unique firing process, giving it an earthy, timeworn patina. Once used for cooking or storage, it now serves as a sculptural piece, bringing an authentic, rustic touch to any space.":
    "Ce pot marocain traditionnel en argile, façonné à la main selon des techniques de poterie ancestrales, incarne à la fois la fonctionnalité et la beauté brute. Sa surface noircie caractéristique résulte d’un procédé de cuisson unique, qui lui donne une patine terreuse et patinée par le temps. Autrefois utilisé pour la cuisson ou le stockage, il sert aujourd’hui de pièce sculpturale, apportant une touche authentique et rustique à tout espace.",
  "A handcrafted black wooden stool with a historic feel, featuring openwork details and finely carved motifs throughout the structure. This one-of-a-kind piece combines authenticity with traditional craftsmanship, adding a bold and timeless decorative touch to any interior.":
    "Un tabouret artisanal en bois noir au caractère historique, orné de détails ajourés et de motifs finement sculptés sur toute la structure. Cette pièce unique allie authenticité et savoir-faire traditionnel, apportant une touche décorative affirmée et intemporelle à tout intérieur.",
  "A handcrafted black wooden stool with a historic feel, meticulously crafted with openwork details and finely carved motifs throughout the structure. Its varnished finish highlights the depth of the wood as well as the decorative details. Adorned with African-inspired moldings, this unique piece combines authenticity, traditional craftsmanship, and elegance, adding a bold and timeless decorative touch to any interior.":
    "Un tabouret artisanal en bois noir au caractère historique, minutieusement travaillé avec des détails ajourés et des motifs finement sculptés sur toute la structure. Sa finition vernie met en valeur la profondeur du bois ainsi que les détails décoratifs. Orné de moulures d’inspiration africaine, cette pièce unique allie authenticité, savoir-faire traditionnel et élégance, apportant une touche décorative affirmée et intemporelle à tout intérieur.",
  "A traditional African wooden mortar, entirely handmade, previously used, and bearing the authentic marks of its history. This one-of-a-kind piece is a testament to true traditional craftsmanship and brings character, authenticity, and soul to your home":
    "Un mortier africain traditionnel en bois, entièrement fait main, ayant déjà servi et portant les marques authentiques de son histoire. Cette pièce unique témoigne d’un véritable savoir-faire traditionnel et apporte du caractère, de l’authenticité et de l’âme à votre intérieur",
  "An antique wooden tablet bearing traces of Arabic writing, a true testament to the past and its unique history. This authentic piece, crafted from fine wood and weathered by time, captivates with its rarity and charm steeped in history. Both a decorative object and a fragment of history, it adds a cultural and timeless touch to any interior.":
    "Une tablette ancienne en bois portant des traces d’écriture arabe, véritable témoignage du passé et de son histoire singulière. Cette pièce authentique, façonnée dans un bois de qualité et patinée par le temps, séduit par sa rareté et son charme chargé d’histoire. À la fois objet décoratif et fragment d’histoire, elle apporte une touche culturelle et intemporelle à tout intérieur.",
  "Antique Bamileke royal wooden stool from Cameroon, dating back to the first half of the 20th century. A true chief’s throne, this exceptional piece is adorned with a frieze of stylized spiders, a traditional symbol of cohesion, wisdom, and unity within the Bamileke clan.":
    "Tabouret royal Bamileke ancien en bois, du Cameroun, datant de la première moitié du XXᵉ siècle. Véritable trône de chef, cette pièce exceptionnelle est ornée d’une frise d’araignées stylisées, symbole traditionnel de cohésion, de sagesse et d’unité au sein du clan Bamileke.",
  "Antique Moroccan terracotta vase adorned with hand-painted traditional Berber designs. This authentic piece reflects the rich craftsmanship and cultural heritage of Morocco.":
    "Vase marocain ancien en terre cuite, orné de motifs berbères traditionnels peints à la main. Cette pièce authentique reflète la richesse de l’artisanat et du patrimoine culturel du Maroc.",
  "Brought back from Cameroon, this collector’s piece blends history, symbolism, and timeless elegance, making it a remarkable decorative object full of soul.":
    "Rapportée du Cameroun, cette pièce de collection mêle histoire, symbolisme et élégance intemporelle, ce qui en fait un objet décoratif remarquable et plein d’âme.",
  "Brown wooden stool with an elegant, deep finish, enhanced by a golden top edge that adds a refined and sophisticated touch. Fine triangular carvings run along the wood, highlighting its artisanal craftsmanship and unique design. This decorative piece combines authenticity, elegance, and originality, making it perfect for enhancing any interior space.":
    "Tabouret en bois brun à la finition élégante et profonde, rehaussé d’un liseré doré sur le dessus qui apporte une touche raffinée et sophistiquée. De fines gravures triangulaires parcourent le bois, mettant en valeur son travail artisanal et son design singulier. Cette pièce décorative allie authenticité, élégance et originalité, ce qui la rend parfaite pour sublimer tout espace intérieur.",
  "A one-of-a-kind handcrafted lamp that embodies the beauty of imperfection. This unique piece is created using an antique Moroccan vase, carefully repurposed to bring warmth and authenticity to any space. The aged patina of the ceramic base tells a story of time, while the natural woven linen shade adds an organic, earthy touch. Perfect for those who appreciate wabi-sabi aesthetics and the charm of artisanal craftsmanship.":
    "Une lampe artisanale unique qui incarne la beauté de l’imperfection. Cette pièce singulière est créée à partir d’un vase marocain ancien, soigneusement réemployé pour apporter chaleur et authenticité à tout espace. La patine du pied en céramique raconte une histoire du temps, tandis que l’abat-jour en lin tissé naturel ajoute une touche organique et terreuse. Parfaite pour celles et ceux qui apprécient l’esthétique wabi-sabi et le charme du travail artisanal.",
};

/**
 * Normalise before matching.
 *
 * The scrape carries **non-breaking spaces** (U+00A0) inside otherwise ordinary
 * sentences — one sits between "Traditionally" and "used" in the Senufo
 * description. They are invisible in a diff, in a screenshot and in a terminal,
 * so a key typed with an ordinary space silently fails to match and the line
 * falls back to English while looking, to every eye and every review, correct.
 *
 * Keys here are written with ordinary spaces; the lookup folds NBSP and
 * collapses runs of whitespace so both sides meet in the middle.
 */
const normalise = (text: string): string =>
  text.replace(/[   ]/g, " ").replace(/\s+/g, " ").trim();

/** Built once, so per-line lookup stays a hash hit. */
const BY_NORMALISED: Record<string, string> = Object.fromEntries(
  Object.entries(PRODUCT_FR).map(([english, french]) => [normalise(english), french]),
);

/** Translate one line, falling back to the client's English. */
export function frLine(line: string): string {
  return BY_NORMALISED[normalise(line)] ?? line;
}

/** Translate a block, preserving order and paragraph breaks. */
export function frLines(lines: string[]): string[] {
  return lines.map(frLine);
}
