import type { Locale } from "@/lib/dictionaries";

/** Copy for the rug collection and series pages, both locales. */
export function rugLabels(locale: Locale) {
  const fr = locale === "fr";
  return {
    collectionEyebrow: fr ? "Tapis Mrirt" : "Mrirt rugs",
    collectionHeading: fr ? "Les séries" : "The series",
    collectionNote: fr
      ? "Tissés main sur commande, dans la couleur et la taille que vous choisissez."
      : "Handwoven to order, in the colour and size you choose.",
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
    shipping: fr ? "Livraison" : "Shipping",
    shippingBody: fr
      ? "Maroc : 25 €. International : 50 €, ou 80 € à partir de 200 €. Hors du Maroc, des droits de douane et la TVA à l’importation peuvent être demandés à la livraison."
      : "Morocco: €25. International: €50, or €80 from €200. Outside Morocco, customs duties and import VAT may be charged on delivery.",
    custom: fr ? "Une autre taille, une autre couleur ?" : "Another size, another colour?",
    customBody: fr
      ? "Chaque tapis est tissé sur commande : décrivez-nous le vôtre."
      : "Every rug is woven to order: describe yours to us.",
    customCta: fr ? "Tapis sur mesure" : "Made to measure",
  };
}
