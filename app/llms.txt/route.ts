import { allPieces, formatPrice, groupBySlug, groupOf, groups } from "@/lib/catalog";
import { getDictionary } from "@/lib/dictionaries";
import { ALL_SLUG } from "@/lib/copy-v2";
import { allRugSeries, seriesLine, seriesTitle } from "@/lib/rugs";
import { displayName } from "@/lib/specs";
import { ADDRESS, CONTACT_EMAIL, INSTAGRAM, SITE_URL, WHATSAPP } from "@/lib/site";

/**
 * /llms.txt — the site described for AI answer engines (ChatGPT, Perplexity,
 * Claude, Gemini, Google AI Overviews), following the llms.txt convention:
 * a plain Markdown summary with links, so a model quoting the house quotes
 * facts rather than guessing from rendered HTML.
 *
 * Built from the same records as the pages, at build time. It states only
 * what the site states: the house's own description, the rooms, each piece's
 * name, room, price and availability. No origin or era is added for any piece
 * (§5) — the piece page is linked for whatever the client wrote.
 */
export const dynamic = "force-static";

export function GET() {
  const en = getDictionary("en");
  const fr = getDictionary("fr");

  const lines = [
    "# The Roots Corner",
    "",
    `> ${en.meta.description}`,
    "",
    `The Roots Corner selects antique objects, artisanal pieces and Moroccan rugs for their material, their history and their character, chosen across Morocco, Africa and beyond, and gathered in Marrakech, Morocco. Signature line: "Rooted in every corner".`,
    "",
    "- Most pieces exist once; a sold piece stays on the site, marked as sold. Some listings are sold in sizes (e.g. Tamegroute candles, S and M).",
    "- Payment: PayPal (including by card, without a PayPal account) or SEPA bank transfer; returns within 14 days of receipt under the withdrawal policy, except made-to-measure rugs.",
    "- Prices are in euros (EUR), tax included. Pieces ship from Marrakech; outside Morocco, customs duties and import VAT may be charged on delivery.",
    "- Delivery: about 1 to 2 weeks in Morocco and 2 to 8 weeks internationally for available pieces; shipping costs vary with the destination, the dimensions and the nature of the piece.",
    "- Mrirt rugs are handwoven to order by a women's weaving cooperative in Mrirt (Middle Atlas); made-to-measure rugs are ordered by enquiry, not added to a cart.",
    "- The site is bilingual: French at /fr, English at /en.",
    "",
    "## Contact",
    "",
    `- Email: ${CONTACT_EMAIL}`,
    ...(WHATSAPP ? [`- WhatsApp: ${WHATSAPP}`] : []),
    `- Instagram: ${INSTAGRAM}`,
    `- Registered address: ${ADDRESS.street}, ${ADDRESS.city}, Morocco`,
    "",
    "## Pages",
    "",
    `- [Collection](${SITE_URL}/en/collection): every piece currently in the collection`,
    `- [Berber rugs](${SITE_URL}/en/mrirt): Mrirt rugs handwoven to order, and rugs already woven`,
    `- [Our story](${SITE_URL}/en/story)`,
    `- [Contact](${SITE_URL}/en/contact)`,
    `- [FAQ](${SITE_URL}/en/faq): delivery, payment, returns, order tracking and Mrirt rugs`,
    `- [Care guide](${SITE_URL}/en/guide-entretien): looking after wool rugs and wooden pieces`,
    `- [Delivery policy](${SITE_URL}/en/legal/delivery)`,
    `- French version of every page: replace /en/ with /fr/, e.g. ${SITE_URL}/fr/collection`,
    "",
    "## Collection",
    "",
    ...groups().map((g) => `- [${g.name.en}](${SITE_URL}/en/collection/${g.slug}): ${g.count} ${g.count === 1 ? "piece" : "pieces"}`),
    `- [The whole collection](${SITE_URL}/en/collection/${ALL_SLUG})`,
    "",
    "## Mrirt rug collections (handwoven to order)",
    "",
    ...allRugSeries().map((r) => `- [${seriesTitle(r, "en")}](${SITE_URL}/en/tapis/${r.handle})${seriesLine(r, "en") ? `: ${seriesLine(r, "en")}` : ""}`),
    "",
    "## Pieces",
    "",
    ...allPieces().map((p) => {
      const price = formatPrice(p, "en");
      const state = p.available ? "available" : "sold";
      const g = groupOf(p);
      const where = g ? groupBySlug(g)?.name.en : "Mrirt rugs";
      return `- [${displayName(p)}](${SITE_URL}/en/piece/${p.slug}): ${where}${price ? ` · ${price}` : ""} · ${state}`;
    }),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
