import type { Locale } from "@/lib/dictionaries";

/** Copy for the rug collection and series pages, both locales. */
export function rugLabels(locale: Locale) {
  const fr = locale === "fr";
  return {
    collectionEyebrow: fr ? "Tapis sur commande" : "Rugs to order",
    rugName: fr ? "Tapis Mrirt" : "Mrirt rug",
    homeLine: fr
      ? "Tissés main à Mrirt, dans le Moyen Atlas. Déjà tissés ou à votre mesure."
      : "Handwoven in Mrirt, in the Middle Atlas. Already woven, or made to your measure.",
    homeCta: fr ? "Voir les tapis" : "See the rugs",
    illustration: fr ? "Photos d’illustration." : "Illustrative photographs.",
    demoAsk: fr ? "Demander ce tapis" : "Ask about this rug",
    collectionWord: fr ? "Collection" : "Collection",
    // /mrirt, after Beni's collection page (client, 5 Oct).
    shopIntro: fr
      ? "Tissés main par une coopérative de femmes à Mrirt, dans le Moyen Atlas. Déjà tissés, ou à votre mesure."
      : "Handwoven by a women’s cooperative in Mrirt, in the Middle Atlas. Already woven, or made to your measure.",
    browser: {
      type: fr ? "Tapis" : "Rugs",
      all: fr ? "Tous" : "All",
      ready: fr ? "Disponibles" : "Available",
      order: fr ? "Sur commande" : "To order",
      collection: fr ? "Collection" : "Collection",
      allCollections: fr ? "Toutes" : "All",
      view: fr ? "Vue" : "View",
      grid: fr ? "Mur" : "Wall",
      column: fr ? "Colonne" : "Column",
      count: fr ? "{n} tapis" : "{n} rugs",
      countOne: fr ? "{n} tapis" : "{n} rug",
      empty: fr ? "Aucun tapis ici pour le moment." : "No rug here for now.",
    },
    availableWord: fr ? "Disponible" : "Available",
    prev: fr ? "Tapis précédent" : "Previous rug",
    next: fr ? "Tapis suivant" : "Next rug",
    // V1 §7–8: the rugs woven to order, as named collections.
    collectionHeading: fr ? "Nos collections" : "Our collections",
    collectionNote: fr
      ? "Tissés selon vos dimensions et vos choix."
      : "Woven to your dimensions and your choices.",
    colour: fr ? "Couleur" : "Colour",
    size: fr ? "Taille" : "Size",
    from: fr ? "À partir de" : "From",
    onRequest: fr ? "Prix sur demande" : "Price on request",
    onRequestNote: fr
      ? "Écrivez-nous pour cette couleur et cette taille : nous vous répondons avec le prix."
      : "Ask us about this colour and size and we will reply with the price.",
    ask: fr ? "Demander le prix" : "Ask for the price",
    madeToOrder: fr ? "Tissé main sur commande." : "Handwoven to order.",
    colourways: fr ? "couleurs" : "colourways",
    colourwaysOne: fr ? "couleur" : "colourway",
    craft: fr ? "Le tissage" : "The weaving",
    material: fr ? "La matière" : "The material",
    materialBody: fr
      ? "Laine, tissée à la main à Mrirt, dans le Moyen Atlas, par une coopérative de femmes."
      : "Wool, handwoven in Mrirt, in the Middle Atlas, by a women’s cooperative.",
    shipping: fr ? "Livraison" : "Shipping",
    shippingBody: fr
      ? "Maroc : 25 €. International : 50 €, ou 80 € à partir de 200 €. Hors du Maroc, des droits de douane et la TVA à l’importation peuvent être demandés à la livraison."
      : "Morocco: €25. International: €50, or €80 from €200. Outside Morocco, customs duties and import VAT may be charged on delivery.",
    custom: fr ? "Une autre taille, une autre couleur ?" : "Another size, another colour?",
    customBody: fr
      ? "Chaque tapis est tissé sur commande : décrivez-nous le vôtre."
      : "Every rug is woven to order: describe yours to us.",
    customCta: fr ? "Tapis sur mesure" : "Made-to-measure rugs",
    // The order panel, after benirugs.com (V1 §7; client, 6 Oct). Every line
    // restates a fact from lib/rug-faq.ts — nothing new is claimed.
    askBar: fr ? "Demander ce tapis" : "Ask about this rug",
    craftLink: fr ? "Le tissage" : "The weaving",
    leadKey: fr ? "Délai" : "Lead time",
    leadBody: fr
      ? "Chaque tapis Mrirt est tissé entièrement à la main, sur commande, par une coopérative de femmes du Moyen Atlas. Le délai dépend de la taille et du tissage : il vous est confirmé avec le devis, avant tout engagement."
      : "Every Mrirt rug is woven entirely by hand, to order, by a women’s cooperative in the Middle Atlas. The time depends on the size and the weaving: it is confirmed with your quote, before you commit to anything.",
    leadNote: fr ? "Délai confirmé avec le devis, selon la taille." : "Lead time confirmed with the quote, by size.",
    variationsKey: fr ? "Variations naturelles" : "Natural variations",
    helpKey: fr ? "Besoin d’aide ? Parlez-nous de votre tapis" : "Need help? Talk to us about your rug",
    helpBody: fr
      ? "Nous vous accompagnons dans le choix de la collection, de la couleur et de la taille, et nous répondons personnellement."
      : "We guide you through the collection, the colour and the size, and we reply personally.",
    helpWhatsapp: fr ? "Écrire sur WhatsApp" : "Write on WhatsApp",
    helpForm: fr ? "Le formulaire sur mesure" : "The made-to-measure form",
    returnsKey: fr ? "Retours et livraison" : "Returns and delivery",
    faqTitle: fr ? "Questions fréquentes" : "Frequently asked",
    faqAll: fr ? "Toutes les questions" : "All questions",
  };
}
