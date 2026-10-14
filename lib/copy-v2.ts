import type { Locale } from "./dictionaries";

/**
 * V2 feedback (10 Oct 2026) — "Feedback - The Roots Corner website V2.pdf".
 *
 * Every French string below is the client's own text, verbatim, except that
 * em dashes are written as commas or colons (house rule, CLAUDE.md §69).
 * The English is a faithful translation of that French, to be approved by the
 * client ("once the French version is finalized and approved, it can be
 * translated into English"); nothing is added to it.
 */

type Both = Record<Locale, string>;
const t = (fr: string, en: string): Both => ({ fr, en });

export const HOME = {
  // V3 (11 Oct): the English line on both versions, at the client's request.
  heroTitle: t("Rooted in every corner", "Rooted in every corner"),
  // V5 (14 Oct): no arrow.
  heroCta: t("Découvrir la collection", "Discover the collection"),
  rugs: {
    // V5 (14 Oct): the section is "Berber Rugs" now; Mrirt is one kind of it.
    label: t("Tapis berbère", "Berber Rugs"),
    body: t(
      "Une collection de tapis noués à la main dans le Moyen Atlas, au Maroc.",
      "A collection of rugs hand-knotted in the Middle Atlas, Morocco.",
    ),
    cta: t("Découvrir les tapis", "Discover the rugs"),
  },
  collection: {
    label: t("La Collection", "The Collection"),
    body: t(
      "Une sélection de pièces venues du Maroc et d’ailleurs, au croisement des cultures et des savoir-faire.",
      "A selection of pieces from Morocco and beyond, where cultures and crafts meet.",
    ),
    cta: t("Découvrez la collection", "Discover the collection"),
  },
  story: {
    label: t("Notre histoire", "Our story"),
    body: t(
      "The Roots Corner s’inspire d’un héritage marocain et d’une curiosité pour les savoir-faire d’ailleurs.",
      "The Roots Corner draws on a Moroccan heritage and a curiosity for the crafts of other places.",
    ),
    cta: t("Découvrir notre histoire", "Discover our story"),
  },
  instagram: {
    heading: t("Suivez The Roots Corner", "Follow The Roots Corner"),
    cta: t("Découvrir notre Instagram", "Discover our Instagram"),
  },
};

export const FOOTER = {
  /** §3 — the one footer statement, everywhere. */
  statement: t(
    "Pièces rares, artisanat d’exception et objets choisis à travers le Maroc, l’Afrique et ailleurs.",
    "Rare pieces, exceptional craftsmanship and objects chosen across Morocco, Africa and beyond.",
  ),
  place: t("Marrakech, Maroc", "Marrakech, Morocco"),
  newsletter: {
    heading: t("Restons en contact.", "Let’s stay in touch."),
    body: t(
      "Recevez des nouvelles de nos collections, de nos découvertes et de l’univers The Roots Corner.",
      "Receive news of our collections, our discoveries and the world of The Roots Corner.",
    ),
    placeholder: t("Votre adresse e-mail", "Your email address"),
    submit: t("S’inscrire", "Subscribe"),
    consent: t(
      "En vous inscrivant, vous acceptez de recevoir nos e-mails. Désinscription possible à tout moment.",
      "By subscribing, you agree to receive our emails. You can unsubscribe at any time.",
    ),
    privacy: t("Confidentialité", "Privacy"),
    done: t("Merci, votre inscription est enregistrée.", "Thank you, you are subscribed."),
    error: t(
      "L’inscription n’a pas abouti. Vérifiez votre adresse et réessayez.",
      "That did not go through. Check your address and try again.",
    ),
  },
  groups: {
    shop: t("Boutique", "Shop"),
    house: t("La maison", "The house"),
    follow: t("Suivre", "Follow"),
  },
};

/** §Collection — five categories, N° numbering kept (§20). */
export const COLLECTION = {
  title: t("La Collection", "The Collection"),
  count: t("{n} pièces", "{n} pieces"),
  countOne: t("{n} pièce", "{n} piece"),
  all: t("Toute la collection", "The whole collection"),
  others: t("Les autres catégories", "The other categories"),
};

/** V3: every piece of the collection on one page, "Toute la collection". */
export const ALL_SLUG = "toute-la-collection";

export type GroupSlug =
  | "sieges-tabourets"
  | "objets-sculptures"
  | "poteries-ceramiques"
  | "objets-anciens-artisanat"
  | "mobilier-luminaires";

export const GROUPS: { slug: GroupSlug; no: string; name: Both }[] = [
  { slug: "sieges-tabourets", no: "01", name: t("Sièges et Tabourets", "Seating and Stools") },
  { slug: "objets-sculptures", no: "02", name: t("Objets et Sculptures", "Objects and Sculptures") },
  { slug: "poteries-ceramiques", no: "03", name: t("Poteries et Céramiques", "Pottery and Ceramics") },
  {
    slug: "objets-anciens-artisanat",
    no: "04",
    name: t("Objets Anciens et Artisanat", "Antique Objects and Craft"),
  },
  { slug: "mobilier-luminaires", no: "05", name: t("Mobilier et Luminaires", "Furniture and Lighting") },
];

/** §19 / Collection §5 — the product page, one template. */
export const PRODUCT = {
  pieceNo: t("Pièce N° {n}", "Piece N° {n}"),
  short: t("Description courte", "Short description"),
  info: t("Informations", "Details"),
  about: t("À propos de cette pièce", "About this piece"),
  care: t("Entretien", "Care"),
  shipping: t("Livraison et retours", "Shipping and returns"),
  fields: {
    origin: t("Origine", "Origin"),
    region: t("Région", "Region"),
    period: t("Époque", "Period"),
    material: t("Matière", "Material"),
    dimensions: t("Dimensions", "Dimensions"),
    nature: t("Nature", "Nature"),
    condition: t("État", "Condition"),
  },
  shippingBody: t(
    "Pour les pièces disponibles, les délais estimés sont de 1 à 2 semaines au Maroc et de 2 à 8 semaines à l’international. Les frais de livraison varient selon la destination, les dimensions et la nature de la pièce.",
    "For available pieces, estimated delivery is 1 to 2 weeks in Morocco and 2 to 8 weeks internationally. Shipping costs vary with the destination, the dimensions and the nature of the piece.",
  ),
  returnsBody: t(
    "Les pièces éligibles peuvent être retournées dans un délai de 14 jours suivant leur réception, conformément à notre politique de rétractation.",
    "Eligible pieces can be returned within 14 days of receipt, in line with our withdrawal policy.",
  ),
  policyLink: t("Politique de rétractation", "Withdrawal policy"),
  deliveryLink: t("Politique de livraison", "Delivery policy"),
  /** V2 §7: a buyer can ask for an accurate shipping quote before ordering. */
  quote: t("Demander une estimation de livraison", "Ask for a shipping quote"),
  size: t("Taille", "Size"),
};

/** §Contact — redesign. */
export const CONTACT = {
  // V3 (11 Oct).
  title: t("Contactez-nous", "Contact us"),
  // Two lines, as the client set them out.
  intro: t(
    "Une question sur une pièce, une commande ou un projet sur mesure ?",
    "A question about a piece, an order or a made-to-measure project?",
  ),
  intro2: t("Nous serons ravis d’échanger avec vous.", "We would be delighted to talk with you."),
  name: t("Nom complet", "Full name"),
  email: t("Adresse e-mail", "Email address"),
  message: t("Message", "Message"),
  send: t("Envoyer le message", "Send the message"),
  sending: t("Envoi…", "Sending…"),
  collectionCta: t("Découvrir la collection", "Discover the collection"),
};

/** §Notre histoire — the client's text, in its order. */
export const STORY = {
  eyebrow: t("Histoire", "Story"),
  chapters: [
    {
      heading: t("Tout commence par des racines", "Everything begins with roots"),
      body: [
        t(
          "Certaines histoires commencent par un lieu. La nôtre prend racine au Maroc.",
          "Some stories begin with a place. Ours takes root in Morocco.",
        ),
        t(
          "Un pays auquel nous sommes profondément attachés, où l’amour des matières, des objets et du travail artisanal s’est transmis au fil des générations. C’est dans cet héritage familial, dans cette attention portée aux détails et aux mains qui façonnent, que The Roots Corner trouve son origine.",
          "A country we are deeply attached to, where a love of materials, of objects and of handwork has been passed down through the generations. It is in this family heritage, in this attention to detail and to the hands that shape things, that The Roots Corner finds its origin.",
        ),
      ],
    },
    {
      heading: t("Un regard ouvert sur le monde", "A gaze open to the world"),
      body: [
        t(
          "Si nos racines sont marocaines, notre curiosité nous porte bien au-delà.",
          "Our roots are Moroccan, but our curiosity carries us much further.",
        ),
        t(
          "Au fil des voyages et des rencontres, nous découvrons d’autres cultures, d’autres traditions, d’autres façons de travailler la matière. Des objets façonnés pour le quotidien, des pièces anciennes, des créations artisanales dont les formes et les usages reflètent les lieux d’où elles viennent.",
          "Through travel and encounters, we discover other cultures, other traditions, other ways of working materials. Objects shaped for everyday life, antique pieces, handmade creations whose forms and uses reflect the places they come from.",
        ),
        t(
          "C’est cette diversité de regards et de savoir-faire qui nourrit notre collection.",
          "It is this diversity of perspectives and skills that nourishes our collection.",
        ),
      ],
    },
    {
      heading: t("The Roots Corner, une histoire à partager", "The Roots Corner, a story to share"),
      body: [
        t(
          "The Roots Corner est née de l’envie de réunir ces découvertes et de les partager.",
          "The Roots Corner was born of the wish to bring these discoveries together and to share them.",
        ),
        t(
          "Depuis Marrakech, nous sélectionnons du mobilier, des objets anciens, des céramiques et des pièces artisanales venus du Maroc et d’autres horizons.",
          "From Marrakech, we select furniture, antique objects, ceramics and handmade pieces from Morocco and other horizons.",
        ),
        t(
          "Derrière cette démarche, il y a le souhait de faire découvrir les artisans, les traditions et les savoir-faire qui nous inspirent, et de donner à ces objets une place dans de nouveaux intérieurs, sans effacer ce qui fait leur identité.",
          "Behind this approach is the wish to bring to light the artisans, traditions and skills that inspire us, and to give these objects a place in new interiors without erasing what makes them who they are.",
        ),
      ],
    },
  ],
  founder: {
    name: "Dahab",
    role: t("Fondatrice de The Roots Corner", "Founder of The Roots Corner"),
    quote: t(
      "Le Maroc m’a transmis bien plus qu’un attachement à un pays : une façon de regarder les choses, de reconnaître la beauté d’un geste et de m’intéresser aux histoires qui se cachent derrière les objets. Avec The Roots Corner, j’ai voulu partager ce regard et les découvertes qui continuent de le nourrir.",
      "Morocco gave me much more than an attachment to a country: a way of looking at things, of recognising the beauty of a gesture and of taking an interest in the stories hidden behind objects. With The Roots Corner, I wanted to share that way of seeing and the discoveries that keep nourishing it.",
    ),
    alt: t(
      "Dahab portant un tapis dans la campagne marocaine",
      "Dahab carrying a rug in the Moroccan countryside",
    ),
  },
};

/** §Tapis Mrirt — the page. */
export const MRIRT = {
  /** Replaces "Photos d'illustration" above the rug collection. */
  variationsNote: t(
    "Les tapis sur commande peuvent présenter de légères variations, propres au travail artisanal.",
    "Rugs made to order may show slight variations, inherent to handwork.",
  ),
  /** §5 — on a rug that is already woven. */
  availableNote: t("Tapis disponible.", "Rug available."),
  /** §5 — on a rug made to order. */
  orderNote: t(
    "Pour les tapis sur commande, les photographies présentent le modèle de référence. De légères variations peuvent apparaître d’une pièce à l’autre en raison du travail artisanal.",
    "For rugs made to order, the photographs show the reference model. Slight variations may appear from one piece to another because of the handwork.",
  ),
  hands: {
    eyebrow: t("Les mains derrière nos tapis", "The hands behind our rugs"),
    heading: t("Là où les fils prennent vie", "Where the threads come to life"),
    body: [
      t(
        "Dans les montagnes du Moyen Atlas, à Mrirt, le tissage fait partie d’un savoir-faire transmis au fil des générations.",
        "In the mountains of the Middle Atlas, in Mrirt, weaving is part of a craft passed down through the generations.",
      ),
      t(
        "C’est ici que nous collaborons avec une coopérative de femmes qui perpétuent cet artisanat. Devant leurs métiers à tisser, elles travaillent la laine, nouent les fils et donnent progressivement forme à chaque tapis.",
        "This is where we work with a cooperative of women who carry this craft forward. At their looms, they work the wool, knot the threads and gradually give shape to each rug.",
      ),
      t(
        "Un travail qui demande du temps, de la patience et une connaissance des matières acquise au fil des années.",
        "Work that asks for time, patience and a knowledge of materials gained over the years.",
      ),
      t(
        "Pour The Roots Corner, ces rencontres sont au cœur de notre démarche. Derrière chaque tapis, il y a des mains, un savoir-faire et des femmes dont nous souhaitons faire découvrir le travail au-delà des frontières du Maroc.",
        "For The Roots Corner, these encounters are at the heart of what we do. Behind every rug there are hands, a craft and women whose work we want to make known beyond the borders of Morocco.",
      ),
    ],
  },
  /** Replaces "Chaque terme se choisit, aucun n'est obligatoire…". */
  customTerms: t(
    "Chaque détail est personnalisable, selon vos envies. Si vous hésitez, nous sommes là pour vous conseiller et vous accompagner dans vos choix.",
    "Every detail can be customised to your wishes. If you are unsure, we are here to advise you and help you choose.",
  ),
  faqHeading: t("Questions fréquentes", "Frequently asked questions"),
  faq: [
    {
      q: t("Comment sont confectionnés nos tapis ?", "How are our rugs made?"),
      a: t(
        "Chaque tapis est tissé à la main par une coopérative de femmes à Mrirt, dans le Moyen Atlas marocain, selon un savoir-faire artisanal.",
        "Each rug is woven by hand by a women’s cooperative in Mrirt, in Morocco’s Middle Atlas, following an artisanal craft.",
      ),
    },
    {
      q: t("Puis-je personnaliser mon tapis ?", "Can I customise my rug?"),
      a: t(
        "Oui. Dimensions, couleurs et motifs peuvent être adaptés à vos envies. Il vous suffit de nous faire part de votre projet.",
        "Yes. Dimensions, colours and patterns can be adapted to your wishes. Simply tell us about your project.",
      ),
    },
    {
      q: t("Quels sont les délais de confection ?", "How long does a rug take to make?"),
      a: t(
        "Les délais varient selon les dimensions et le modèle choisi. Une estimation vous sera communiquée avant toute confirmation de commande.",
        "It depends on the dimensions and the model chosen. You will receive an estimate before any order is confirmed.",
      ),
    },
    {
      q: t("Comment entretenir mon tapis ?", "How do I care for my rug?"),
      a: t(
        "Un entretien régulier et délicat permet de préserver la laine. Retrouvez nos conseils dans notre guide d’entretien.",
        "Regular, gentle care keeps the wool at its best. You will find our advice in our care guide.",
      ),
    },
  ],
};

/** §7 — the general FAQ, the client's final copy, in its four categories. */
export const FAQ: { id: string; title: Both; items: { q: Both; a: Both[] }[] }[] = [
  {
    id: "commandes-livraisons",
    title: t("Commandes et livraisons", "Orders and delivery"),
    items: [
      {
        q: t("Dans quels pays livrez-vous ?", "Which countries do you deliver to?"),
        a: [
          t(
            "Toutes nos pièces sont expédiées avec soin depuis Marrakech, au Maroc. Nous assurons des livraisons au Maroc et à l’international, notamment en Europe, aux États-Unis et dans d’autres destinations.",
            "All our pieces are carefully shipped from Marrakech, Morocco. We deliver within Morocco and internationally, including Europe, the United States and other destinations.",
          ),
        ],
      },
      {
        q: t("Quels sont les délais de livraison ?", "How long does delivery take?"),
        a: [
          t(
            "Les délais de livraison varient selon la destination, la disponibilité et la nature de chaque pièce.",
            "Delivery times vary with the destination, availability and nature of each piece.",
          ),
          t(
            "Pour les pièces disponibles, les délais estimés sont de 1 à 2 semaines au Maroc et de 2 à 8 semaines à l’international, selon la destination et les caractéristiques de l’objet.",
            "For available pieces, estimated delivery is 1 to 2 weeks in Morocco and 2 to 8 weeks internationally, depending on the destination and the object.",
          ),
          t(
            "Pour les tapis réalisés sur mesure, les délais de fabrication et de livraison dépendent des dimensions, du modèle et du travail de tissage. Une estimation vous sera communiquée avant la confirmation de votre commande.",
            "For made-to-measure rugs, making and delivery times depend on the dimensions, the model and the weaving. You will receive an estimate before your order is confirmed.",
          ),
        ],
      },
      {
        q: t("Quels sont les frais de livraison ?", "How much is delivery?"),
        a: [
          t(
            "Les frais de livraison varient selon la destination, les dimensions et la nature de la pièce.",
            "Shipping costs vary with the destination, the dimensions and the nature of the piece.",
          ),
          t(
            "Pour obtenir une estimation précise, nous vous invitons à contacter notre équipe avant de passer commande.",
            "For an accurate estimate, please contact our team before placing your order.",
          ),
        ],
      },
      {
        q: t("Comment suivre ma commande ?", "How do I track my order?"),
        a: [
          t(
            "Dès l’expédition de votre commande, vous recevrez un e-mail contenant les informations nécessaires à son suivi.",
            "As soon as your order ships, you will receive an email with everything you need to track it.",
          ),
          t(
            "Vous pourrez également suivre son acheminement depuis la rubrique « Mes commandes » de notre site.",
            "You can also follow its progress from the “My orders” section of our site.",
          ),
        ],
      },
      {
        q: t("Les droits de douane et les taxes sont-ils inclus ?", "Are customs duties and taxes included?"),
        a: [
          t(
            "Pour les commandes internationales, des droits de douane et des taxes à l’importation peuvent s’appliquer selon la réglementation du pays de destination.",
            "For international orders, customs duties and import taxes may apply under the rules of the destination country.",
          ),
          t(
            "Ces frais ne sont inclus ni dans le prix d’achat ni dans les frais de livraison et restent à la charge du client.",
            "These costs are included neither in the purchase price nor in the shipping cost, and are paid by the customer.",
          ),
          t(
            "Pour toute question relative à une livraison internationale, notre équipe se tient à votre disposition avant votre commande.",
            "For any question about an international delivery, our team is available before you order.",
          ),
        ],
      },
    ],
  },
  {
    id: "collection",
    title: t("Notre collection", "Our collection"),
    items: [
      {
        q: t("Les dimensions indiquées sont-elles exactes ?", "Are the dimensions exact?"),
        a: [
          t(
            "Les dimensions sont indiquées avec le plus grand soin. La nature artisanale de certaines pièces peut toutefois entraîner de légères variations.",
            "Dimensions are given with the greatest care. The handmade nature of some pieces may, however, lead to slight variations.",
          ),
          t(
            "Si des mesures précises sont essentielles à votre projet, nous vous invitons à nous contacter avant votre achat.",
            "If precise measurements matter for your project, please contact us before buying.",
          ),
        ],
      },
      {
        q: t(
          "Les imperfections font-elles partie du caractère des pièces ?",
          "Are imperfections part of the pieces’ character?",
        ),
        a: [
          t(
            "Les marques du temps, les irrégularités naturelles et les traces du travail artisanal participent au caractère singulier de chaque pièce.",
            "The marks of time, natural irregularities and traces of handwork are part of each piece’s character.",
          ),
          t(
            "Elles témoignent de son histoire, de ses matières et du savoir-faire qui lui a donné vie.",
            "They bear witness to its history, its materials and the skill that brought it to life.",
          ),
          t(
            "Toute imperfection notable est précisée dans la description du produit ou visible sur les photographies.",
            "Any notable imperfection is stated in the product description or visible in the photographs.",
          ),
        ],
      },
      {
        q: t(
          "Puis-je obtenir des informations sur une pièce avant de passer commande ?",
          "Can I get information about a piece before ordering?",
        ),
        a: [
          t(
            "Notre équipe se tient à votre disposition par e-mail ou via notre formulaire de contact pour répondre à vos questions et vous apporter toute précision complémentaire.",
            "Our team is available by email or through our contact form to answer your questions and give you any further detail.",
          ),
        ],
      },
    ],
  },
  {
    id: "paiements-retours",
    title: t("Paiements et retours", "Payments and returns"),
    items: [
      {
        q: t("Quels moyens de paiement acceptez-vous ?", "Which payment methods do you accept?"),
        a: [
          t(
            "Nous acceptons les paiements sécurisés via PayPal, y compris par carte bancaire, sans qu’il soit nécessaire de posséder un compte PayPal.",
            "We accept secure payments through PayPal, including by bank card, without needing a PayPal account.",
          ),
          t(
            "Le paiement par virement bancaire SEPA est également possible. Les informations nécessaires vous seront communiquées lors de la confirmation de votre commande.",
            "Payment by SEPA bank transfer is also possible. The details will be sent to you when your order is confirmed.",
          ),
          t(
            "La pièce sélectionnée vous est alors réservée pendant trois jours, dans l’attente de la réception de votre paiement.",
            "The piece you chose is then reserved for you for three days while we wait for your payment.",
          ),
        ],
      },
      {
        q: t("Puis-je retourner un article ?", "Can I return an item?"),
        a: [
          t(
            "Les pièces éligibles peuvent être retournées dans un délai de 14 jours suivant leur réception, conformément à notre politique de rétractation.",
            "Eligible pieces can be returned within 14 days of receipt, in line with our withdrawal policy.",
          ),
          t(
            "Les tapis réalisés sur mesure selon vos spécifications personnelles ne bénéficient pas du droit de rétractation habituel.",
            "Rugs made to measure to your own specifications do not carry the usual right of withdrawal.",
          ),
          t(
            "Pour connaître l’ensemble des conditions applicables, nous vous invitons à consulter notre Politique de rétractation.",
            "For all the conditions that apply, please see our Withdrawal Policy.",
          ),
        ],
      },
      {
        q: t("Que faire si ma commande arrive endommagée ?", "What if my order arrives damaged?"),
        a: [
          t(
            "Si votre commande vous parvient endommagée, nous vous invitons à contacter notre équipe dans les meilleurs délais.",
            "If your order reaches you damaged, please contact our team as soon as possible.",
          ),
          t(
            "Nous examinerons votre demande avec attention afin de vous proposer une solution adaptée.",
            "We will look at your request carefully and offer you a suitable solution.",
          ),
        ],
      },
    ],
  },
  {
    id: "accompagnement",
    title: t("Accompagnement personnalisé", "Personal assistance"),
    items: [
      {
        q: t("Comment contacter The Roots Corner ?", "How do I contact The Roots Corner?"),
        a: [
          t(
            "Pour toute question concernant notre collection, une pièce en particulier, un tapis sur mesure ou une commande en cours, notre équipe se tient à votre disposition par e-mail ou via notre formulaire de contact.",
            "For any question about our collection, a particular piece, a made-to-measure rug or an order in progress, our team is available by email or through our contact form.",
          ),
        ],
      },
    ],
  },
];

export function pick(locale: Locale, s: Both): string {
  return s[locale];
}

/**
 * V4 (11 Oct): the care guides the house wrote — one for the wool rugs, one
 * for the wooden pieces. French verbatim; the English is our translation.
 * Shown on /guide-entretien, which the rug FAQ points to.
 */
export const CARE_GUIDE = {
  title: t("Guide d’entretien", "Care guide"),
  sections: [
    {
      id: "tapis",
      heading: t("Les tapis en laine", "Wool rugs"),
      body: [
        t(
          "Pour préserver la douceur et la beauté de votre tapis en laine, aspirez régulièrement à faible puissance, sans brosse rotative.",
          "To keep your wool rug soft and beautiful, vacuum it regularly on low power, without a rotating brush.",
        ),
        t(
          "En cas de tache, tamponnez délicatement avec un chiffon propre et de l’eau froide, sans frotter.",
          "If there is a stain, dab it gently with a clean cloth and cold water, without rubbing.",
        ),
        t(
          "Pour un lavage complet, privilégiez un savon doux, un rinçage minutieux et un séchage intégral à l’air libre. Compte tenu de la densité de la laine Mrirt, un lavage professionnel est recommandé afin de préserver les fibres et les couleurs naturelles.",
          "For a full wash, use a mild soap, rinse thoroughly and let it dry completely in the open air. Given how dense Mrirt wool is, professional cleaning is recommended to preserve the fibres and the natural colours.",
        ),
      ],
    },
    {
      id: "bois",
      heading: t("Les pièces en bois", "Wooden pieces"),
      subheading: t("Entretien et détachage", "Care and stain removal"),
      body: [
        t(
          "Dépoussiérez régulièrement votre tabouret à l’aide d’un chiffon doux et sec, en prenant soin des reliefs sculptés.",
          "Dust your stool regularly with a soft, dry cloth, taking care of the carved reliefs.",
        ),
        t(
          "Évitez l’eau en abondance, les produits ménagers et les nettoyants abrasifs afin de préserver la patine naturelle du bois.",
          "Avoid large amounts of water, household products and abrasive cleaners, to preserve the natural patina of the wood.",
        ),
        t(
          "En cas de tache d’huile, absorbez délicatement l’excédent avec du papier absorbant, sans frotter. Saupoudrez ensuite de terre de Sommières, laissez agir plusieurs heures, puis retirez doucement la poudre. Faites d’abord un essai sur une zone discrète.",
          "For an oil stain, gently blot the excess with paper towel, without rubbing. Then sprinkle with fuller’s earth (terre de Sommières), leave it for several hours, and gently remove the powder. Test on a discreet area first.",
        ),
        t(
          "Préservez votre pièce de l’humidité, de la chaleur excessive et du soleil direct pour conserver toute la beauté de son bois et de sa patine.",
          "Keep your piece away from damp, excessive heat and direct sunlight, to preserve all the beauty of its wood and its patina.",
        ),
      ],
    },
  ],
  link: t("Voir le guide d’entretien", "See the care guide"),
};
