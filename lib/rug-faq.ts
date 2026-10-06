import type { Locale } from "@/lib/dictionaries";

/**
 * The rug questions — one list, shown in three places: the FAQ page (as its
 * own "Tapis Mrirt" group, so it is also FAQPage markup), the foot of /mrirt,
 * and folded under the order panel of every rug page.
 *
 * After benirugs.com, which the house sent as the reference (V1 §7 and §18):
 * Beni answers, beside the rug, how it is made, how long it takes, how far a
 * handwoven size can vary, what can be chosen and how returns work. Every
 * answer here is a fact the site already states elsewhere — the house's Mrirt
 * copy, the FAQ, the delivery table and §4 of the withdrawal policy. Nothing
 * new is claimed (CLAUDE.md §5). The lead time stays "confirmed with the
 * quote" until the house gives a range.
 */
export type RugQuestion = { key: string; q: string; a: string };

const FR: RugQuestion[] = [
  {
    key: "made",
    q: "Comment sont tissés vos tapis ?",
    a: "À la main, en laine, par une coopérative de femmes à Mrirt, dans le Moyen Atlas. Le tapis Mrirt se distingue par la qualité de sa laine, son épaisseur généreuse et la précision de ses finitions à la main.",
  },
  {
    key: "choose",
    q: "Que puis-je choisir ?",
    a: "La collection, la couleur et la taille parmi celles proposées. Pour d’autres dimensions, un autre motif ou une autre texture, le tapis est tissé sur mesure : décrivez-le dans le formulaire « Tapis sur mesure ».",
  },
  {
    key: "lead",
    q: "Quels sont les délais pour un tapis sur mesure ?",
    a: "Ils dépendent de la taille et du tissage. Le délai vous est confirmé avec le devis, avant tout engagement.",
  },
  {
    key: "variations",
    q: "Les dimensions et les couleurs sont-elles exactes ?",
    a: "Un tapis tissé main peut varier légèrement de la taille annoncée, et quelques centimètres d’écart sont possibles. Les couleurs vues à l’écran peuvent aussi différer un peu de la laine. Si une mesure précise compte pour vous, dites-le-nous avant de commander.",
  },
  {
    key: "help",
    q: "Puis-je être accompagnée dans mon choix ?",
    a: "Oui. Cochez « Être accompagnée dans mon choix » dans le formulaire, ou écrivez-nous sur WhatsApp : nous vous répondons personnellement.",
  },
  {
    key: "returns",
    q: "Puis-je retourner un tapis ?",
    a: "Les tapis déjà tissés et les tapis de nos collections dans une taille proposée bénéficient du droit de rétractation de 14 jours, comme toute autre pièce. Un tapis tissé selon vos propres dimensions ou votre propre motif est confectionné selon vos spécifications : le droit de rétractation ne s’y applique pas.",
  },
  {
    key: "delivery",
    q: "Combien coûte la livraison ?",
    a: "Maroc : 25 €. International : 50 €, ou 80 € à partir de 200 €. Hors du Maroc, des droits de douane et la TVA à l’importation peuvent être demandés à la livraison.",
  },
];

const EN: RugQuestion[] = [
  {
    key: "made",
    q: "How are your rugs woven?",
    a: "By hand, in wool, by a women’s cooperative in Mrirt, in the Middle Atlas. A Mrirt rug stands out for the quality of its wool, its generous thickness and the precision of its hand finishing.",
  },
  {
    key: "choose",
    q: "What can I choose?",
    a: "The collection, the colour and the size from those offered. For other dimensions, another design or another texture, the rug is made to measure: describe it in the “Made-to-measure rugs” form.",
  },
  {
    key: "lead",
    q: "How long does a made-to-measure rug take?",
    a: "It depends on the size and the weaving. The time is confirmed with your quote, before you commit to anything.",
  },
  {
    key: "variations",
    q: "Are the dimensions and colours exact?",
    a: "A handwoven rug can vary slightly from its stated size, and a few centimetres of difference are possible. Colours on a screen can also differ a little from the wool. If a precise measurement matters to you, tell us before you order.",
  },
  {
    key: "help",
    q: "Can you help me choose?",
    a: "Yes. Tick “Be guided in my choice” in the form, or write to us on WhatsApp: we reply personally.",
  },
  {
    key: "returns",
    q: "Can I return a rug?",
    a: "Finished rugs and rugs from our collections in a listed size carry the 14-day right of withdrawal, like any other piece. A rug woven to your own dimensions or your own design is made to your specifications, and the right of withdrawal does not apply to it.",
  },
  {
    key: "delivery",
    q: "How much is delivery?",
    a: "Morocco: €25. International: €50, or €80 from €200. Outside Morocco, customs duties and import VAT may be charged on delivery.",
  },
];

export function rugFaq(locale: Locale): RugQuestion[] {
  return locale === "fr" ? FR : EN;
}

export const RUG_FAQ_HEADING = { fr: "Tapis Mrirt", en: "Mrirt rugs" } as const;
export const RUG_FAQ_TITLE = { fr: "Questions fréquentes", en: "Frequently asked" } as const;
