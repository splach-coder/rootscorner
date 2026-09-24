# SEO, link previews and AI answer engines — what is done, what is left

Verified on https://therootscorner.com, 2026-09-24.

## Done

| | |
|---|---|
| Titles + descriptions | Every page, both locales. Piece pages use the client's first sentence, or — where there is none — the facts the label shows (room · material · origin as named · price). Never generated copy (§5). |
| Canonical + hreflang | Every page: `fr`, `en`, `x-default → fr`. Canonical host is the bare domain; www and http 301 to it. |
| **Link previews** (WhatsApp, Instagram DMs, Facebook, iMessage, LinkedIn, Slack) | `og:*` + `twitter:*` on every page via `lib/seo.ts pageMeta()`. 1200×630 JPEGs in `public/og/` (`scripts/og-images.mjs`): scenes fill the frame, pieces are shown whole on the wall ground. 33–130 KB — under WhatsApp's limits. **Fixed a bug:** every non-piece page used to tell WhatsApp/Facebook its URL was the homepage. |
| Structured data (JSON-LD) | `Organization + OnlineStore` and `WebSite` on every page (name, logo, address, ICE/RC, email, WhatsApp, Instagram, founder). `Product` + `Offer` (price, EUR, InStock/SoldOut, shipping from MA with the house's rates) + `BreadcrumbList` on every piece. `ItemList` + `BreadcrumbList` on collection pages. Nothing unsourced: no ratings, reviews, condition or founding year. |
| Sitemap | `/sitemap.xml` — 118 URLs with hreflang pairs, priorities, and 388 piece photographs for Google Images. |
| robots.txt | Allows all crawlers including AI ones; blocks `/api/` and checkout. |
| **AEO / GEO** | `/llms.txt` — the house, rooms, contact, shipping, and every piece with price and availability, built from the same records as the pages. |
| Icons | SVG favicon, `apple-touch-icon.png` (iOS ignores SVG), 192/512 PNG, `manifest.webmanifest`. |
| Semantics + a11y | One `h1` per page, 0 images without `alt`, `lang` per locale, skip link, focus rings, reduced motion (see CLAUDE.md). |
| Performance | Static pages at the edge (Cloudflare), AVIF/WebP resizing, fonts self-hosted by Next. |

## Left — needs an account or a decision, not code

1. **Google Search Console** — add the domain property, verify with the TXT
   record it gives (Cloudflare DNS), submit `https://therootscorner.com/sitemap.xml`.
   Or set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and redeploy.
2. **Bing Webmaster Tools** — import from Search Console in one click. Bing
   also feeds ChatGPT search and Copilot. (`NEXT_PUBLIC_BING_SITE_VERIFICATION`.)
3. **Google Business Profile** — "The Roots Corner", Marrakech, category
   *antique store / home goods*, website + Instagram. The biggest local and
   AI-answer signal there is; only the owner can claim it.
4. **Google Merchant Center** — free Shopping listings. Connect via the
   Shopify *Google & YouTube* app; the Product markup above already matches.
5. **Analytics** — none runs. Cloudflare Web Analytics is cookieless (no
   consent banner needed) but the Cookie Policy would have to name it first.
   Google Analytics needs the consent banner (built, dormant — §44).
6. **FAQPage markup** — deliberately NOT added: the FAQ says "all sales are
   final", which contradicts the 14-day withdrawal right. Marking it up would
   push the wrong answer into Google and AI answers. Add it once the returns
   policy is decided.
7. **Content** — the richest SEO lever left: descriptions for the 20 pieces
   that have none (from Dahab, not written by us), and alt text / captions
   from her for the Drive photography.
