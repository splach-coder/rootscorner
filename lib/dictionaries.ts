/**
 * Bilingual copy for The Roots Corner.
 *
 * PROVENANCE RULE (CLAUDE.md §5 and §11): every factual statement here is taken
 * from the client's own material — the brief, the live site, or the brand
 * portfolio. French is a translation of that copy, never an embellishment of
 * it. Section headings and connective phrasing are editorial and make no claim
 * about any piece's origin, era, or provenance.
 *
 * Sourced strings are marked with their origin so a reviewer can check them.
 */

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

type Dictionary = {
  meta: { title: string; description: string };
  nav: {
    collection: string;
    story: string;
    rugs: string;
    contact: string;
    menu: string;
    close: string;
    switchTo: string;
    switchLabel: string;
  };
  hero: { tagline: string; intro: string; scrollCue: string };
  selection: { eyebrow: string; heading: string; unique: string; viewAll: string };
  presentation: { eyebrow: string; body: string[] };
  categories: { eyebrow: string; heading: string; items: Record<string, string> };
  story: { eyebrow: string; heading: string; body: string[]; cta: string };
  rugs: {
    eyebrow: string;
    heading: string;
    body: string[];
    cta: string;
    axes: { size: string; colour: string; design: string; texture: string };
    axesNote: string;
    /** Names what the photographs actually are. They are not of a rug. */
    figure: { caption: string; plateAlt: string; detailAlt: string };
    /** Why no finished rug is pictured: there isn't one until you order it. */
    order: string;
    /** Sourced sentences from their own /mrirt-rugs/ page, which ours lacked. */
    craft: string;
    wool: string;
    invite: string;
  };
  pieceLabel: { material: string; origin: string; dimensions: string };
  shop: { eyebrow: string; heading: string; cta: string; sold: string };
  newsletter: {
    eyebrow: string;
    heading: string;
    body: string;
    placeholder: string;
    submit: string;
    note: string;
    done: string;
    error: string;
  };
  social: { follow: string };
  collection: {
    eyebrow: string;
    heading: string;
    lede: string;
    count: string;
    roomsEyebrow: string;
    roomsHeading: string;
    registerEyebrow: string;
    registerHeading: string;
    registerNote: string;
    registerHint: string;
    columns: {
      no: string;
      piece: string;
      origin: string;
      dimensions: string;
      price: string;
      state: string;
    };
  };
  category: { eyebrow: string; all: string; others: string; count: string; countOne: string };
  piece: {
    accession: string;
    about: string;
    details: string;
    care: string;
    delivery: string;
    deliveryNote: string;
    enquire: string;
    enquireNote: string;
    soldNote: string;
    photographs: string;
    photographsOne: string;
    photographsRail: string;
    more: string;
    room: string;
  };
  storyPage: {
    lede: string;
    from: string;
    to: string;
    founderEyebrow: string;
    placeEyebrow: string;
    artisansEyebrow: string;
    purposeEyebrow: string;
    purpose: string;
    missionEyebrow: string;
    missionHeading: string;
  };
  mrirtPage: {
    lede: string;
    place: string;
    coopEyebrow: string;
    coopHeading: string;
    formEyebrow: string;
    formHeading: string;
    hint: string;
    sizeHint: string;
    /**
     * The rug's wall label. Every value is drawn from the client's own Mrirt
     * copy — wool, hand-finishing, woven to order, Mrirt in the Middle Atlas.
     * No dimension: a made-to-order rug has none until it is asked for, and
     * §14's schema omits a field rather than filling it.
     */
    rug: {
      name: string;
      madeKey: string;
      origin: string;
      material: string;
      made: string;
      alt: string;
    };
    matterEyebrow: string;
    matterHeading: string;
    pileAlt: string;
    combAlt: string;
    roomEyebrow: string;
    roomHeading: string;
    roomNote: string;
    roomAlt: string;
    /** The finished-rug shelf. Empty until the client stocks it. */
    readyEyebrow: string;
    readyHeading: string;
    readyNote: string;
    readyEmpty: string;
    /** Names and alts for the photographed rugs. Descriptive only — nothing
        here claims an origin, an age or a price the client has not given. */
    woven: {
      note: string;
      ask: string;
      items: { fire: string; pile: string };
      alts: { fire: string; pile: string };
    };
    /** Replaces `lede` on the day a finished rug is actually in stock. */
    ledeStocked: string;
  };
  contactPage: {
    heading: string;
    lede: string;
    channelsEyebrow: string;
    placeEyebrow: string;
    placeNote: string;
    instagramNote: string;
    formEyebrow: string;
    pieceRef: string;
    subjectEyebrow: string;
    waysEyebrow: string;
    whatsappNote: string;
    emailKey: string;
    /** The four real routes an enquiry takes. Order is the order shown. */
    ways: { piece: string; rug: string; delivery: string; seen: string };
    wayNotes: { piece: string; rug: string; delivery: string; seen: string };
  };
  form: {
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    sent: string;
    error: string;
    optional: string;
    viaInstagram: string;
    viaWhatsapp: string;
    subject: string;
  };
  closing: { eyebrow: string; heading: string; cta: string };
  /**
   * Names for the legal pages. The documents themselves live in lib/legal.ts,
   * transcribed from the client's own site; these are only the labels the
   * footer and the rail use to point at them.
   */
  legal: {
    eyebrow: string;
    alsoHere: string;
    faq: string;
    items: Record<string, string>;
  };
  /** The apartments. A second business line the brief never described. */
  stay: {
    nav: string;
    eyebrow: string;
    heading: string;
    body: string[];
    book: string;
    note: string;
  };
  /** The artisans page — the client's own tribute to the people who make. */
  artisans: {
    nav: string;
    eyebrow: string;
    heading: string;
    body: string;
    placesEyebrow: string;
  };
  instagram: { eyebrow: string; heading: string; handle: string; cta: string };
  materials: { eyebrow: string; heading: string; body: string };
  invitation: { heading: string; body: string; cta: string };
  footer: {
    tagline: string;
    /** Where the house is. CLAUDE.md §1 — not a claim about where pieces come from. */
    place: string;
    /** Accessible name for the footer's link row. */
    navLabel: string;
    shop: string;
    house: string;
    legal: string;
    instagram: string;
    instagramNote: string;
    rights: string;
    collection: string;
    story: string;
    rugs: string;
    contact: string;
    artisans: string;
    stay: string;
    faq: string;
    terms: string;
    privacy: string;
    withdrawal: string;
  };
  common: { from: string; sold: string; available: string };
  cart: {
    name: string;
    title: string;
    empty: string;
    emptyCta: string;
    remove: string;
    subtotal: string;
    shippingNote: string;
    checkout: string;
    close: string;
    unique: string;
    add: string;
    added: string;
    view: string;
  };
  checkout: {
    eyebrow: string;
    heading: string;
    lede: string;
    order: string;
    subtotal: string;
    shippingNote: string;
    pay: string;
    back: string;
    empty: string;
    emptyCta: string;
    notConnected: string;
    notConnectedNote: string;
    enquire: string;
    failed: string;
  };
};

const en: Dictionary = {
  meta: {
    // Brief §4: the homepage must immediately convey the name and the tagline.
    title: "The Roots Corner — Rare pieces. Stories. Materials.",
    description:
      "A selection of rare African and Moroccan pieces, sourced in Morocco by Dahab. Antique objects, wood, ceramics and handwoven Mrirt rugs. Each piece is unique.",
  },
  nav: {
    collection: "Collection",
    story: "Our Story",
    rugs: "Mrirt Rugs",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    switchTo: "FR",
    switchLabel: "Voir ce site en français",
  },
  hero: {
    tagline: "Rare pieces. Stories. Materials.", // Brief §4, verbatim.
    intro:
      "Pieces chosen one at a time, in Morocco and beyond, for the material they are made of and the life they have already had.",
    scrollCue: "The collection",
  },
  selection: {
    eyebrow: "A few pieces",
    heading: "Nothing here was made twice",
    unique: "Each piece is unique.", // Brief §6: required mention.
    viewAll: "See the whole collection",
  },
  presentation: {
    eyebrow: "The Roots Corner",
    body: [
      // Live site, About us — verbatim.
      "Founded by Dahab, The Roots Corner reflects a world she grew up with and continues to draw inspiration from today.",
      "Through a carefully curated collection, she shares objects that have a natural place in the home and a story that extends beyond decoration. Each piece is selected with intention and valued for its lasting presence.",
    ],
  },
  categories: {
    eyebrow: "Where to begin",
    heading: "By what it is",
    items: {
      stools: "Stools & seats",
      "african-decoration": "African pieces",
      pots: "Pots & vessels",
      "ceramics-tamegroute": "Tamegroute ceramics",
      vases: "Vases",
      decoration: "Objects",
      lamp: "Light",
    },
  },
  story: {
    eyebrow: "Our Story",
    heading: "Paris, then Marrakech",
    body: [
      // Brief §7: the client's own sentence, translated to English.
      "One day I decided to leave the noise of Paris for the calm of Marrakech.",
      // Live site, About us — Mission and Vision, verbatim.
      "Through a carefully curated collection, The Roots Corner brings together unique pieces that are meant to be lived with, appreciated and passed on.",
    ],
    cta: "Read the whole story",
  },
  rugs: {
    eyebrow: "Made to measure",
    heading: "Mrirt",
    body: [
      // Live site, Mrirt Rugs page — verbatim.
      "The Mrirt rug is one of the most refined in Morocco. It stands out for its high-quality wool, generous thickness, and precise hand-finishing.",
      "At The Roots Corner, we proudly collaborate with a women’s weaving cooperative in Mrirt, a region nestled in Morocco’s Middle Atlas and renowned for producing some of the country’s finest rugs.",
      "Each piece is handwoven to order, fully customizable in size, color, design, and texture.",
    ],
    cta: "Start a rug",
    // The four axes are the client's own words: "customizable in size, color,
    // design, and texture". They are the real form fields, not invented ones.
    axes: { size: "Size", colour: "Colour", design: "Design", texture: "Texture" },
    axesNote: "Woven to your measurements. Tell us the four and we will come back to you.",
    figure: {
      // The client's own product name, verbatim. The object in these frames is
      // the weaving comb, and the caption has to say so — nothing on this page
      // may let a tool be mistaken for a rug.
      caption: "Antique comb used for weaving Moroccan rugs",
      plateAlt: "Antique weaving comb seen from above, on a plaster wall",
      // "engraved with Berber designs and featuring a wooden handle" — the
      // client's own description of this piece.
      detailAlt: "The metal engraved with Berber designs, and the wooden handle",
    },
    order: "Each rug is handwoven to order.",
    // All three verbatim from therootscorner.com/mrirt-rugs/.
    craft:
      "Entirely handmade, it reflects a deep-rooted heritage while embracing modern aesthetics, turning each rug into a unique and lasting work of art.",
    wool:
      "Silky wool, dense weave, and exceptional softness — a true invitation to comfort and timeless beauty.",
    invite:
      "Tell us what you’re dreaming of — size, colors, inspiration — and we’ll be in touch to bring your vision to life with our artisans.",
  },
  pieceLabel: { material: "Material", origin: "Origin", dimensions: "Dimensions" },
  shop: {
    eyebrow: "In the shop",
    heading: "Available now",
    cta: "See everything",
    sold: "Sold",
  },
  newsletter: {
    eyebrow: "Stay close",
    heading: "Pieces go quickly",
    body: "One letter when something rare arrives. Nothing else.",
    placeholder: "Your email",
    submit: "Join",
    note: "Unsubscribe whenever you like.",
    done: "You’re on the list.",
    error: "That address didn’t go through. Try again, or write to us on Instagram.",
  },
  social: { follow: "Follow" },
  collection: {
    eyebrow: "Collection",
    heading: "What is here now",
    lede:
      "Every piece was chosen on its own, and there is only ever one of it. What is here today is not what will be here.",
    count: "{pieces} pieces · {rooms} rooms",
    roomsEyebrow: "Where to begin",
    roomsHeading: "The rooms",
    registerEyebrow: "The register",
    registerHeading: "Everything, in one list",
    // Says plainly what the numbers are, so a number is never mistaken for an
    // age, an edition size, or a mark of provenance.
    registerNote: "Numbers are positions in the collection. They say nothing about a piece.",
    registerHint: "Hover a line to see the piece.",
    columns: {
      no: "No.",
      piece: "Piece",
      origin: "Origin",
      dimensions: "Dimensions",
      price: "Price",
      state: "State",
    },
  },
  category: {
    eyebrow: "Room",
    all: "All the collection",
    others: "Other rooms",
    count: "{n} pieces",
    countOne: "{n} piece",
  },
  piece: {
    accession: "No.",
    about: "About this piece",
    details: "Details",
    care: "Care",
    delivery: "Delivery",
    // The client's product pages and their FAQ give different windows
    // (CLAUDE.md §9.3), so this is shown as the record's own words and never
    // restated as a promise the site makes.
    deliveryNote: "As stated on this piece’s record.",
    enquire: "Ask about this piece",
    enquireNote: "Tell us which piece and we will come back to you.",
    soldNote: "This one has gone. There is no second.",
    photographs: "{n} photographs",
    photographsOne: "{n} photograph",
    photographsRail: "Photographs of this piece",
    more: "Continue looking",
    room: "Room",
  },
  storyPage: {
    lede: "A collection put together by one person, in one place.",
    from: "Paris",
    to: "Marrakech",
    founderEyebrow: "The founder",
    placeEyebrow: "The place",
    artisansEyebrow: "The hands",
    purposeEyebrow: "The intent",
    // Verbatim from the client's own About page, therootscorner.com/about-us.
    purpose:
      "To share a world of meaningful objects and create a lasting appreciation for pieces that carry history, purpose, and character.",
    missionEyebrow: "What the collection is for",
    missionHeading: "Lived with, appreciated, passed on",
  },
  mrirtPage: {
    lede: "Nothing here is in stock. A Mrirt rug begins as four decisions.",
    // The client's own sentence places Mrirt "in Morocco's Middle Atlas".
    place: "Middle Atlas, Morocco",
    coopEyebrow: "Who weaves it",
    coopHeading: "A cooperative in the Middle Atlas",
    formEyebrow: "The draft",
    formHeading: "Tell us the four",
    hint: "What you have in mind.",
    sizeHint: "Length × width, in centimetres.",
    rug: {
      name: "Mrirt rug",
      madeKey: "Making",
      origin: "Mrirt, Middle Atlas",
      material: "Wool",
      made: "Handwoven, to order",
      alt: "The cream wool of a Mrirt rug, an antique weaving comb resting on it",
    },
    matterEyebrow: "The wool",
    matterHeading: "Thickness you can put a hand into",
    pileAlt: "Close view of the pile: the depth of the wool and the woven lines through it",
    combAlt: "The metal of the weaving comb, engraved with Berber designs",
    roomEyebrow: "In a room",
    roomHeading: "How big is yours",
    // Size is the first of the four terms, and the only one a photograph can
    // actually help with.
    roomNote: "Size is the first thing we will ask you.",
    roomAlt: "A Mrirt rug on the floor of a room with plaster walls",
    readyEyebrow: "Already woven",
    readyHeading: "Ready to go",
    readyNote: "One of a kind, like everything else here.",
    // Shown while the shelf is empty. It states the fact and hands the reader
    // straight to the thing that is available — the four decisions below.
    readyEmpty: "No finished rug is here at the moment. Every rug below is woven to order.",
    woven: {
      note: "Woven already. Sizes and prices on asking — each one is the only one of itself.",
      ask: "Ask about this rug",
      // Descriptions of what is visible in the photograph, nothing more. No
      // age, no provenance, no price (§5).
      items: {
        fire: "Cream wool, deep pile",
        pile: "Caramel wool, ruled",
      },
      alts: {
        fire: "A cream Mrirt rug covering the floor beside a lit fireplace",
        pile: "Close view of caramel wool, ruled by darker woven lines",
      },
    },
    ledeStocked: "A few are already woven. The rest begin as four decisions.",
  },
  contactPage: {
    heading: "Write to us",
    lede:
      "About a piece, about a rug, about getting something delivered — or to ask what an object actually is.",
    channelsEyebrow: "How to reach us",
    placeEyebrow: "The place",
    placeNote: "Sourced in Morocco, put together in Marrakech.",
    instagramNote: "Pieces appear here before they are listed.",
    formEyebrow: "A message",
    pieceRef: "If it is about a piece, its number helps.",
    subjectEyebrow: "You are asking about",
    waysEyebrow: "What to ask",
    whatsappNote: "Message us directly.",
    emailKey: "Email",
    ways: {
      piece: "A piece",
      rug: "A rug",
      delivery: "Delivery",
      seen: "Something you saw",
    },
    wayNotes: {
      piece: "Anything in the collection, sold or not. Its number is enough.",
      rug: "Woven to order, in four decisions.",
      // Brief §6, the client's own shipping zones — no times, because their
      // product pages and their FAQ give different ones (CLAUDE.md §9.3).
      delivery: "France, Belgium, Switzerland, Europe, worldwide.",
      seen: "Pieces appear on Instagram before they are listed.",
    },
  },
  form: {
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send",
    sending: "Sending…",
    sent: "Thank you. We will come back to you.",
    // Says the message is still there, because it is — the fields are untouched
    // and the WhatsApp link beside this carries the whole of it.
    error: "That did not send. Your message is still here — reach us here instead:",
    optional: "optional",
    viaInstagram: "Write on Instagram",
    viaWhatsapp: "Take it to WhatsApp",
    subject: "The Roots Corner",
  },
  closing: {
    eyebrow: "The collection",
    heading: "Other pieces, still here",
    cta: "See everything",
  },
  stay: {
    nav: "Stay",
    eyebrow: "Marrakech",
    // The client's own page title.
    heading: "Our Airbnb",
    body: [
      "More than a place to stay, The Roots Corner offers a unique way to experience Marrakech. Set in a peaceful location near the medina, our apartments bring together Moroccan craftsmanship, natural materials and timeless design.",
      "Each space has been thoughtfully curated to feel warm, welcoming and authentic. Inspired by Moroccan heritage and shaped by contemporary living, every apartment reflects a deep appreciation for craftsmanship, simplicity and detail.",
    ],
    book: "Book your stay",
    // Says where the button goes. A link that leaves the site should say so
    // before it is clicked, not after.
    note: "Booking is handled on Airbnb.",
  },
  artisans: {
    nav: "Artisans",
    eyebrow: "The people who make",
    heading: "Discover our collaboration",
    body: "We place particular importance on highlighting the artisans who bring to life unique pieces deeply rooted in their culture and heritage. Their work is at the heart of our approach, and it is inconceivable for us not to pay tribute to them.",
    placesEyebrow: "Where we work",
  },
  legal: {
    eyebrow: "The house",
    alsoHere: "Also here",
    faq: "FAQ",
    // The client's own footer wording, so a visitor who knows the old site
    // finds the same names in the same order.
    items: {
      imprint: "Imprint",
      privacy: "Privacy Policy",
      cookies: "Cookie Settings",
      delivery: "Delivery Policy",
      withdrawal: "Withdrawal Policy",
      terms: "Terms and Conditions",
    },
  },
  instagram: {
    eyebrow: "Instagram",
    heading: "Pieces are found before they are listed",
    handle: "@therootscorner.m",
    cta: "Follow the finds",
  },
  materials: {
    eyebrow: "Matter",
    heading: "The marks are the point",
    body: "Wear, patina, a repair someone made a long time ago. These are not flaws to be corrected before a piece is photographed — they are the reason it is worth having.",
  },
  invitation: {
    heading: "Come and look properly",
    body: "The collection is small on purpose. It changes as pieces are found, and as they leave.",
    cta: "Enter the collection",
  },
  footer: {
    // Live site footer — verbatim.
    tagline: "Authentic craftsmanship & ethnic-inspired decor sourced in Morocco.",
    // The base of the house (CLAUDE.md §1). Deliberately not "sourced in
    // Marrakech" — the client's own copy says pieces are found "in Morocco and
    // beyond", and narrowing that would be an invented provenance (§5).
    place: "Marrakech, Morocco",
    navLabel: "Site links",
    shop: "Shop",
    house: "The house",
    legal: "Legal",
    instagram: "Instagram",
    instagramNote: "@therootscorner.m",
    rights: "The Roots Corner",
    collection: "Collection",
    story: "Our Story",
    rugs: "Mrirt Rugs",
    contact: "Contact",
    artisans: "Artisans",
    stay: "Stay",
    faq: "FAQ",
    terms: "Terms & conditions",
    privacy: "Privacy",
    withdrawal: "Right of withdrawal",
  },
  cart: {
    name: "Cart",
    title: "Your cart",
    empty: "Nothing in it yet.",
    emptyCta: "See the collection",
    remove: "Remove",
    subtotal: "Subtotal",
    shippingNote: "Shipping is calculated at payment.",
    checkout: "Go to payment",
    close: "Close",
    unique: "There is one of each. Yours until you leave.",
    add: "Add to cart",
    added: "In your cart",
    view: "See the cart",
  },
  checkout: {
    eyebrow: "Checkout",
    heading: "Your order",
    lede: "Address and payment are taken on the next step, on a secure page.",
    order: "The pieces",
    subtotal: "Subtotal",
    shippingNote: "Shipping is calculated at payment, once we know where it is going.",
    pay: "Continue to payment",
    back: "Keep looking",
    empty: "There is nothing to pay for yet.",
    emptyCta: "See the collection",
    notConnected: "Payment is not switched on yet.",
    notConnectedNote:
      "The shop is finished and this order is ready to go — the card processor is the last thing to connect. Send it as a message and we will confirm it by hand.",
    enquire: "Send this order as a message",
    failed: "That did not go through. Try once more, or send it as a message.",
  },
  common: { from: "From", sold: "Sold", available: "Available" },
};

const fr: Dictionary = {
  meta: {
    title: "The Roots Corner — Pièces rares. Histoires. Matières.",
    description:
      "Une sélection de pièces rares africaines et marocaines, chinées au Maroc par Dahab. Objets anciens, bois, céramiques et tapis Mrirt tissés main. Chaque pièce est unique.",
  },
  nav: {
    collection: "Collection",
    story: "Notre histoire",
    rugs: "Tapis Mrirt",
    contact: "Contact",
    menu: "Menu",
    close: "Fermer",
    switchTo: "EN",
    switchLabel: "View this site in English",
  },
  hero: {
    tagline: "Pièces rares. Histoires. Matières.",
    intro:
      "Des pièces choisies une à une, au Maroc et ailleurs, pour la matière dont elles sont faites et la vie qu’elles ont déjà eue.",
    scrollCue: "La collection",
  },
  selection: {
    eyebrow: "Quelques pièces",
    heading: "Rien ici n’a été fait deux fois",
    unique: "Chaque pièce est unique.",
    viewAll: "Voir toute la collection",
  },
  presentation: {
    eyebrow: "The Roots Corner",
    body: [
      // THE CLIENT'S OWN FRENCH, from their /accueil/ page — not a translation
      // of the English About text that sits here in the other locale. Where
      // they have written a sentence in a language themselves, their wording
      // beats ours (CLAUDE.md §11). The two locales therefore say slightly
      // different things about the founder, and both are hers.
      "The Roots Corner est né de la vision de Dahab, animée par une profonde passion pour l’artisanat et le design intemporel. À travers ce projet, elle souhaite partager son amour pour les objets anciens riches en histoire et en authenticité, en particulier ceux issus des cultures marocaine et africaine.",
      "À travers une collection soigneusement choisie, elle partage des objets qui trouvent naturellement leur place dans la maison et dont l’histoire dépasse la décoration. Chaque pièce est sélectionnée avec intention, pour ce qu’elle gardera de présence.",
    ],
  },
  categories: {
    eyebrow: "Par où commencer",
    heading: "Par ce que c’est",
    items: {
      stools: "Tabourets & sièges",
      "african-decoration": "Pièces africaines",
      pots: "Pots & contenants",
      "ceramics-tamegroute": "Céramiques de Tamegroute",
      vases: "Vases",
      decoration: "Objets",
      lamp: "Lumière",
    },
  },
  story: {
    eyebrow: "Notre histoire",
    heading: "Paris, puis Marrakech",
    body: [
      "Un jour, j’ai décidé de quitter le tumulte parisien pour la sérénité de Marrakech.",
      "À travers une collection soigneusement choisie, The Roots Corner réunit des pièces uniques, faites pour être vécues, appréciées et transmises.",
    ],
    cta: "Lire toute l’histoire",
  },
  rugs: {
    eyebrow: "Sur mesure",
    heading: "Mrirt",
    body: [
      "Le tapis Mrirt est l’un des plus raffinés du Maroc. Il se distingue par la qualité de sa laine, son épaisseur généreuse et la précision de ses finitions à la main.",
      "Chez The Roots Corner, nous collaborons avec une coopérative féminine de tissage à Mrirt, une région du Moyen Atlas marocain réputée pour produire certains des plus beaux tapis du pays.",
      "Chaque pièce est tissée main sur commande, entièrement personnalisable en taille, couleur, motif et texture.",
    ],
    cta: "Commencer un tapis",
    axes: { size: "Taille", colour: "Couleur", design: "Motif", texture: "Texture" },
    axesNote: "Tissé à vos mesures. Dites-nous les quatre et nous revenons vers vous.",
    figure: {
      caption: "Peigne ancien utilisé pour le tissage des tapis marocains",
      plateAlt: "Peigne à tisser ancien vu de dessus, sur un mur de plâtre",
      detailAlt: "Le métal gravé de motifs berbères, et le manche en bois",
    },
    order: "Chaque tapis est tissé main sur commande.",
    craft:
      "Entièrement fait main, il porte un héritage profondément enraciné tout en épousant une esthétique contemporaine, faisant de chaque tapis une œuvre unique et durable.",
    wool:
      "Une laine soyeuse, un tissage dense et une douceur exceptionnelle — une véritable invitation au confort et à la beauté intemporelle.",
    invite:
      "Dites-nous ce dont vous rêvez — taille, couleurs, inspiration — et nous reviendrons vers vous pour donner vie à votre projet avec nos artisans.",
  },
  pieceLabel: { material: "Matière", origin: "Origine", dimensions: "Dimensions" },
  shop: {
    eyebrow: "À la boutique",
    heading: "Disponible maintenant",
    cta: "Voir toute la collection",
    sold: "Vendue",
  },
  newsletter: {
    eyebrow: "Rester proche",
    heading: "Les pièces partent vite",
    body: "Une lettre quand une pièce rare arrive. Rien d’autre.",
    placeholder: "Votre e-mail",
    submit: "Rejoindre",
    note: "Désinscription quand vous voulez.",
    done: "Vous êtes sur la liste.",
    error: "Cette adresse n’est pas passée. Réessayez, ou écrivez-nous sur Instagram.",
  },
  social: { follow: "Suivre" },
  collection: {
    eyebrow: "Collection",
    heading: "Ce qui est ici en ce moment",
    lede:
      "Chaque pièce a été choisie seule, et il n’en existe qu’une. Ce qui est là aujourd’hui ne sera pas là demain.",
    count: "{pieces} pièces · {rooms} salles",
    roomsEyebrow: "Par où commencer",
    roomsHeading: "Les salles",
    registerEyebrow: "Le registre",
    registerHeading: "Tout, en une liste",
    registerNote:
      "Les numéros sont des positions dans la collection. Ils ne disent rien de la pièce.",
    registerHint: "Survolez une ligne pour voir la pièce.",
    columns: {
      no: "N°",
      piece: "Pièce",
      origin: "Origine",
      dimensions: "Dimensions",
      price: "Prix",
      state: "État",
    },
  },
  category: {
    eyebrow: "Salle",
    all: "Toute la collection",
    others: "Autres salles",
    count: "{n} pièces",
    countOne: "{n} pièce",
  },
  piece: {
    accession: "N°",
    about: "À propos de cette pièce",
    details: "Le détail",
    care: "Entretien",
    delivery: "Livraison",
    deliveryNote: "Tel qu’indiqué sur la fiche de cette pièce.",
    enquire: "Demander cette pièce",
    enquireNote: "Dites-nous laquelle et nous revenons vers vous.",
    soldNote: "Celle-ci est partie. Il n’y en a pas de seconde.",
    photographs: "{n} photographies",
    photographsOne: "{n} photographie",
    photographsRail: "Photographies de cette pièce",
    more: "Continuer à regarder",
    room: "Salle",
  },
  storyPage: {
    lede: "Une collection réunie par une personne, dans un lieu.",
    from: "Paris",
    to: "Marrakech",
    founderEyebrow: "La fondatrice",
    placeEyebrow: "Le lieu",
    artisansEyebrow: "Les mains",
    purposeEyebrow: "L’intention",
    // Translation of the client's own About sentence, not authorship (§11).
    // "purpose" is rendered "utilité" — these are objects that were made to be
    // used, which is what the English means here.
    purpose:
      "Partager un monde d’objets qui ont du sens, et faire naître un attachement durable pour des pièces qui portent une histoire, une utilité et un caractère.",
    missionEyebrow: "Ce à quoi sert la collection",
    missionHeading: "Vécues, appréciées, transmises",
  },
  mrirtPage: {
    lede: "Rien ici n’est en stock. Un tapis Mrirt commence par quatre décisions.",
    place: "Moyen Atlas, Maroc",
    coopEyebrow: "Qui le tisse",
    coopHeading: "Une coopérative du Moyen Atlas",
    formEyebrow: "Le patron",
    formHeading: "Dites-nous les quatre",
    hint: "Ce que vous avez en tête.",
    sizeHint: "Longueur × largeur, en centimètres.",
    rug: {
      name: "Tapis Mrirt",
      madeKey: "Façon",
      origin: "Mrirt, Moyen Atlas",
      material: "Laine",
      made: "Tissé main, sur commande",
      alt: "La laine crème d’un tapis Mrirt, un peigne à tisser ancien posé dessus",
    },
    matterEyebrow: "La laine",
    matterHeading: "Une épaisseur où la main entre",
    pileAlt: "Gros plan du velours : l’épaisseur de la laine et les lignes du tissage",
    combAlt: "Le métal du peigne à tisser, gravé de motifs berbères",
    roomEyebrow: "Dans une pièce",
    roomHeading: "Quelle taille pour le vôtre",
    roomNote: "La taille est la première chose que nous vous demanderons.",
    roomAlt: "Un tapis Mrirt au sol dans une pièce aux murs de plâtre",
    readyEyebrow: "Déjà tissés",
    readyHeading: "Prêts à partir",
    readyNote: "Uniques, comme tout le reste ici.",
    readyEmpty: "Aucun tapis fini n’est ici pour le moment. Chaque tapis ci-dessous est tissé sur commande.",
    woven: {
      note: "Déjà tissés. Tailles et prix sur demande — chacun est le seul de son espèce.",
      ask: "Demander ce tapis",
      items: {
        fire: "Laine crème, velours profond",
        pile: "Laine caramel, réglée",
      },
      alts: {
        fire: "Un tapis Mrirt crème couvrant le sol près d’une cheminée allumée",
        pile: "Gros plan d’une laine caramel, réglée de lignes tissées plus sombres",
      },
    },
    ledeStocked: "Quelques-uns sont déjà tissés. Les autres commencent par quatre décisions.",
  },
  contactPage: {
    heading: "Écrivez-nous",
    lede:
      "Pour une pièce, pour un tapis, pour faire livrer quelque chose — ou simplement pour demander ce qu’est un objet.",
    channelsEyebrow: "Comment nous joindre",
    placeEyebrow: "Le lieu",
    placeNote: "Chinée au Maroc, réunie à Marrakech.",
    instagramNote: "Les pièces paraissent ici avant d’être mises en ligne.",
    formEyebrow: "Un message",
    pieceRef: "S’il s’agit d’une pièce, son numéro nous aide.",
    subjectEyebrow: "Vous nous écrivez au sujet de",
    waysEyebrow: "Ce qu’on peut demander",
    whatsappNote: "Écrivez-nous directement.",
    emailKey: "E-mail",
    ways: {
      piece: "Une pièce",
      rug: "Un tapis",
      delivery: "Livraison",
      seen: "Quelque chose que vous avez vu",
    },
    wayNotes: {
      piece: "N’importe quelle pièce, vendue ou non. Son numéro suffit.",
      rug: "Tissé sur commande, en quatre décisions.",
      delivery: "France, Belgique, Suisse, Europe, international.",
      seen: "Les pièces paraissent sur Instagram avant d’être mises en ligne.",
    },
  },
  form: {
    name: "Nom",
    email: "E-mail",
    message: "Message",
    send: "Envoyer",
    sending: "Envoi…",
    sent: "Merci. Nous revenons vers vous.",
    error: "L’envoi a échoué. Votre message est toujours là — joignez-nous ici :",
    optional: "facultatif",
    viaInstagram: "Écrire sur Instagram",
    viaWhatsapp: "Reprendre sur WhatsApp",
    subject: "The Roots Corner",
  },
  closing: {
    eyebrow: "La collection",
    heading: "D’autres pièces, encore là",
    cta: "Tout voir",
  },
  stay: {
    nav: "Séjour",
    eyebrow: "Marrakech",
    heading: "Notre Airbnb",
    body: [
      "Plus qu’un lieu où dormir, The Roots Corner propose une façon singulière de vivre Marrakech. Situés dans un endroit paisible près de la médina, nos appartements réunissent artisanat marocain, matières naturelles et design intemporel.",
      // Their own French for the apartments, from /accueil/.
      "Au-delà des objets décoratifs qui embellissent votre intérieur, nous vous invitons à découvrir nos appartements à louer. Il s’agit d’espaces uniques, conçus avec soin, où chaque détail reflète notre vision et notre sens du raffinement.",
    ],
    // Their word, from the button on /accueil/.
    book: "Réserver",
    note: "La réservation se fait sur Airbnb.",
  },
  artisans: {
    nav: "Artisans",
    eyebrow: "Celles et ceux qui font",
    heading: "Découvrez notre collaboration",
    body: "Nous accordons une importance particulière à mettre en lumière les artisans qui donnent vie à des pièces uniques, profondément ancrées dans leur culture et leur héritage. Leur travail est au cœur de notre démarche, et il nous est inconcevable de ne pas leur rendre hommage.",
    placesEyebrow: "Où nous travaillons",
  },
  legal: {
    eyebrow: "La maison",
    alsoHere: "Également ici",
    faq: "FAQ",
    items: {
      imprint: "Mentions légales",
      privacy: "Confidentialité",
      cookies: "Cookies",
      delivery: "Livraison",
      withdrawal: "Droit de rétractation",
      terms: "Conditions générales",
    },
  },
  instagram: {
    eyebrow: "Instagram",
    heading: "Les pièces sont trouvées avant d’être mises en ligne",
    handle: "@therootscorner.m",
    cta: "Suivre les trouvailles",
  },
  materials: {
    eyebrow: "Matière",
    heading: "Les marques font la pièce",
    body: "L’usure, la patine, une réparation faite il y a longtemps. Ce ne sont pas des défauts à corriger avant la photo — c’est ce qui donne à la pièce sa valeur.",
  },
  invitation: {
    heading: "Venez regarder vraiment",
    body: "La collection est volontairement petite. Elle change au fil des pièces trouvées, et de celles qui partent.",
    cta: "Entrer dans la collection",
  },
  footer: {
    tagline: "Artisanat authentique & décoration d’inspiration ethnique, chinés au Maroc.",
    place: "Marrakech, Maroc",
    navLabel: "Liens du site",
    shop: "Boutique",
    house: "La maison",
    legal: "Mentions",
    instagram: "Instagram",
    instagramNote: "@therootscorner.m",
    rights: "The Roots Corner",
    collection: "Collection",
    story: "Notre histoire",
    rugs: "Tapis Mrirt",
    contact: "Contact",
    artisans: "Artisans",
    stay: "Séjour",
    faq: "FAQ",
    terms: "Conditions générales",
    privacy: "Confidentialité",
    withdrawal: "Droit de rétractation",
  },
  cart: {
    name: "Panier",
    title: "Votre panier",
    empty: "Rien dedans pour l’instant.",
    emptyCta: "Voir la collection",
    remove: "Retirer",
    subtotal: "Sous-total",
    shippingNote: "La livraison est calculée au paiement.",
    checkout: "Passer au paiement",
    close: "Fermer",
    unique: "Il n’y en a qu’une de chaque. À vous jusqu’à votre départ.",
    add: "Ajouter au panier",
    added: "Dans votre panier",
    view: "Voir le panier",
  },
  checkout: {
    eyebrow: "Paiement",
    heading: "Votre commande",
    lede: "L’adresse et le paiement se font à l’étape suivante, sur une page sécurisée.",
    order: "Les pièces",
    subtotal: "Sous-total",
    shippingNote:
      "La livraison est calculée au paiement, une fois la destination connue.",
    pay: "Continuer vers le paiement",
    back: "Continuer à regarder",
    empty: "Il n’y a rien à régler pour l’instant.",
    emptyCta: "Voir la collection",
    notConnected: "Le paiement n’est pas encore activé.",
    notConnectedNote:
      "La boutique est terminée et cette commande est prête — il ne reste qu’à brancher le processeur de paiement. Envoyez-la en message et nous la confirmerons à la main.",
    enquire: "Envoyer cette commande en message",
    failed: "Cela n’a pas abouti. Réessayez, ou envoyez la commande en message.",
  },
  common: { from: "À partir de", sold: "Vendue", available: "Disponible" },
};

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/**
 * Fill {placeholders} in a dictionary string.
 *
 * Counts belong inside the copy rather than glued on beside it: "38 pièces ·
 * 7 salles" has to be one translatable sentence, because the two languages do
 * not put the number, the plural and the separator in the same places.
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key) => String(values[key] ?? ""));
}
