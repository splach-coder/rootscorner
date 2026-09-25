import { allPieces, categorySlugs, formatPrice, piecesByCategory } from "@/lib/catalog";
import { getDictionary } from "@/lib/dictionaries";
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
  const rooms = categorySlugs();

  const lines = [
    "# The Roots Corner",
    "",
    `> ${en.meta.description}`,
    "",
    `The Roots Corner is a curator of rare African and Moroccan artisanal pieces, based in Marrakech, Morocco. Tagline: "Rare pieces. Stories. Materials." / « ${fr.meta.title.split("— ")[1] ?? ""} »`,
    "",
    "- Every piece is one of a kind: there is one of each, and a sold piece is not restocked.",
    "- Prices are in euros (EUR), tax included. Pieces ship from Marrakech; outside Morocco, customs duties and import VAT may be charged on delivery.",
    "- Shipping (the house's published rates): Morocco €25; international €50, or €80 for orders of €200 and more.",
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
    `- [Mrirt rugs](${SITE_URL}/en/mrirt): handwoven to order`,
    `- [Our story](${SITE_URL}/en/story)`,
    `- [The artisans](${SITE_URL}/en/artisans)`,
    `- [Apartments in Marrakech](${SITE_URL}/en/stay): booked by WhatsApp`,
    `- [Contact](${SITE_URL}/en/contact)`,
    `- [FAQ](${SITE_URL}/en/faq)`,
    `- [Delivery policy](${SITE_URL}/en/legal/delivery)`,
    `- French version of every page: replace /en/ with /fr/ — e.g. ${SITE_URL}/fr/collection`,
    "",
    "## Rooms",
    "",
    ...rooms.map(
      (r) => `- [${en.categories.items[r] ?? r}](${SITE_URL}/en/collection/${r}): ${piecesByCategory(r).length} piece(s)`,
    ),
    "",
    "## Pieces",
    "",
    ...allPieces().map((p) => {
      const price = formatPrice(p, "en");
      const state = p.available ? "available" : "sold";
      return `- [${displayName(p)}](${SITE_URL}/en/piece/${p.slug}): ${en.categories.items[p.category] ?? p.category}${price ? ` · ${price}` : ""} · ${state}`;
    }),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
