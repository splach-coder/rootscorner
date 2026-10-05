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
  };
}
