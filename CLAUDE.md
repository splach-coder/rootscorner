# The Roots Corner — Project Context

New premium e-commerce site for **The Roots Corner**, a Marrakech-based curator of rare
African, Moroccan and Indonesian artisanal pieces. Custom front-end, **Shopify as the
commerce/payment engine**.

**The one-line test for every decision:** does this feel like a *gallery of rare pieces*,
or like a *decor shop*? Build the gallery.

---

## 1. The brand

| | |
|---|---|
| Name | The Roots Corner |
| Founder | **Dahab** — left Paris for Marrakech; sources pieces personally |
| Base | Marrakech, Morocco |
| Tagline | **Rare pieces. Stories. Materials.** |
| Instagram | [@therootscorner.m](https://www.instagram.com/therootscorner.m/) — primary traffic source |
| Current site | `therootscorner.com` — **Jimdo Dolphin** builder. Reference only. |

**Universe:** African pieces · antique & Mrirt rugs · wood · craft · antique objects ·
natural materials · patina · imperfection · Wabi-Sabi · Marrakech/Morocco · travel and
encounters with artisans.

Authenticity must be *visible*. Nothing may suggest industrial or mass production.

### Positioning ladder — what a visitor should think, in order

1. "This piece is particular."
2. "There is a real story behind this selection."
3. "I want this piece in my home."

Rarity, taste, authenticity, personal selection — **without artificial luxury signalling**.

---

## 2. Brand assets (in [brand/](brand/))

Logo and picto are **single-colour vectors**, fully recolourable.

| Asset | File | Notes |
|---|---|---|
| Wordmark | [logo.svg](brand/logo.svg) | "The **ROOTS** Corner" + crescent, aspect 0.731 |
| Picto | [picto.svg](brand/picto.svg) | Crescent alone, aspect 0.775 — favicon / mobile nav |

**Logo colour: `#6C645D`** (warm taupe-greige) — from the supplied Illustrator SVG exports (authoritative).

The crescent is an **Arabic-inspired "R"** for *Roots* — heritage, identity, connection.
It is the strongest single mark the brand owns. Use it as the favicon, the loading mark,
and the mobile header. Do not redraw or restyle it.

### Palette — sampled from the brand portfolio, exact values

| Role | Hex | Use |
|---|---|---|
| Ground / ecru | `#F7F5F2` | Default page background — the gallery wall |
| Clay brown | `#866950` | Mid accent, dividers, secondary text |
| Sand | `#BEAB93` | Muted fills, hover states, borders |
| Deep brown | `#4B3123` | Primary text, dark sections |
| Brand taupe | `#6C645D` | Logo, marks |

Ecru · beige · sand · brown · soft black. **No pure `#000` and no pure `#FFF`.**
No colour outside this family. Photography supplies all the warmth and contrast.

---

## 3. Design direction

**Épuré — élégant — artistique — naturel — intemporel — chaleureux.**

- **Pieces are the stars.** Generous space around every photo.
- **One large beautiful photo beats six small badly-laid-out ones.** Images must be viewable large.
- Elegant, highly legible typography. Restrained scale range.
- Mobile-first: **iPhone is the priority device**, since Instagram drives the traffic.
  Must be as beautiful on phone as on desktop.

### Hard bans (client's explicit list)

❌ Copying the old site or reusing its blocks ❌ recognisable template ❌ over-commercial design
❌ strong/artificial colours ❌ too much text ❌ too many buttons ❌ excessive animation
❌ fake "luxury" effects ❌ big-retail-chain look ❌ catalogue presentation ❌ visual overload
❌ small photos ❌ cold feeling ❌ **invented information about the pieces**

> **Motion note:** the commercial proposal promises scroll animations, hover effects and
> page transitions; the brief bans "excessive animation." These reconcile as *slow, quiet,
> material* motion — long fades, gentle image reveals, unhurried transitions. Nothing
> springy, parallax-heavy, or attention-seeking. When in doubt, less.

### References

| Reference | Take from it |
|---|---|
| **[benirugs.com](https://www.benirugs.com/)** | Primary structural reference. Generous margins, large imagery, calm sans typography, artisan-forward narrative, minimal all-caps (nav only). |
| **Homura** | Cinematic storytelling — atmosphere, texture, warm light, slow close-ups over product shots. |
| **Azuri** | Disciplined tonal consistency; warm, intentional, instantly recognisable. |
| **Khayni** | Level of finish named in the commercial proposal. |

Note Beni Rugs is a *structural* reference for calm and space — not a look to clone.
The Roots Corner is antique/one-of-a-kind, where Beni is made-to-order production.

---

## 4. Site architecture

### Home — section order from the brief

1. Large image / introduction — **THE ROOTS CORNER** · *Rare pieces. Stories. Materials.*
2. A few strong pieces from the collection
3. Short presentation of The Roots Corner
4. Focus on rugs / African pieces / objects
5. **The Story** section
6. Images of materials, artisans, travels, places
7. Invitation to discover the collection
8. Very simple footer

Not everything needs to appear on the first page.

### Pages

- **Home**
- **Collection** — presented as a *selection*, never a catalogue. Very sparse per category.
- **Piece detail** — the most important page (see §5)
- **Our Story** — personal but elegant; the Paris → Marrakech decision is the hinge
- **Mrirt Rugs** — made-to-measure, **inquiry flow, not add-to-cart** (see §6)
- **Shipping**
- **Contact**
- Legal: terms, privacy, withdrawal, imprint

---

## 5. The piece detail page — highest priority

**Photos:** one large hero · several photos · material detail · patina/imperfection detail ·
one shot that conveys **scale/proportion**.

**Information:** name · price · dimensions · material · origin · era (if known) ·
provenance (if known) · availability.

**Story:** brief, elegant, natural — **only where the information genuinely exists**.

**Mandatory:** an **"Each piece is unique."** mention where relevant.

> ### ⚠️ The non-negotiable content rule
> **Never invent an origin, an era, a provenance, or a story.**
> This applies to me as much as to any copywriter. Where a field is unknown, omit the
> field — do not fill it with plausible text. Placeholder copy in a draft must be
> visibly marked as placeholder, never written as if it were fact.

---

## 6. Commerce

Custom front-end; **Shopify** runs cart, checkout, payments, orders, stock.

- **Payments:** card, PayPal, Apple Pay, Google Pay
- **Journey:** see piece → see details → buy → pay → confirmation. Extremely simple.
- Cart · automatic order confirmation email · stock management · **unavailable pieces clearly marked**
- Since every piece is one-of-a-kind, **stock is effectively quantity 1** — sold-out state
  is a normal, frequent, and design-relevant state, not an edge case.
- Costs (per proposal, indicative): Shopify ~9 EUR/month; transaction ~2.9% + 0.30 EUR

**Mrirt rugs are different.** Handwoven to order by a women's weaving cooperative in Mrirt
(Middle Atlas), fully customisable in size, colour, design and texture. This is a
**lead-generation / inquiry flow** — "tell us what you're dreaming of, we'll contact you
personally" — and must not be forced into the cart.

### Shipping

France · Belgium · Switzerland · Europe · International.
Costs and conditions must be easy to understand. For fragile or bulky pieces, allow a
**specific delivery arrangement or a quote request**.

---

## 7. Technical requirements

SEO per page (titles + meta descriptions) · clean URLs · image optimisation · ALT text ·
fast loading · responsive · Google Analytics · Google Search Console · indexation ·
HTTPS · backups · **client must be able to edit products and prices easily**.

---

## 8. Existing catalogue — [docs/catalog.json](docs/catalog.json)

**38 products scraped from the live site**, prices **€35–€480** (EUR, incl. VAT, plus shipping).

| Current category | Count |
|---|---|
| Stools | 12 |
| African decoration | 8 |
| Decoration | 7 |
| Pots | 5 |
| Ceramics (Tamegroute) | 3 |
| Vases | 2 |
| Lamp | 1 |

Per-product fields captured: name, price, currency, availability, images (Jimdo CDN URLs),
description, dimensions, product details, care instructions, delivery time.

Origins actually named in existing copy: Morocco, Cameroon, Côte d'Ivoire, Ethiopia/West
Africa, Indonesia (Lombok), and tribal attributions (Dogon, Senufo, Baule, Tuareg, Berber).
**These are the only origin claims with a source — do not extend beyond them.**

---

## 9. Open questions / conflicts to resolve with the client

These are real contradictions in the source material. Do not silently pick a side.

1. **Category taxonomy.** The brief proposes *Rugs · Objects · Wood · African Pieces ·
   New Arrivals*; the live catalogue is organised *Stools · Pots · Vases · Ceramics ·
   Decoration · African Decoration · Lamp*. A mapping is needed — and "Rugs" currently has
   **no sellable stock items** (Mrirt is made-to-order).

2. **Returns — legal risk.** Product pages state *"All sales are final"* / no returns, yet
   the site sells to France, Belgium and the EU, where distance selling carries a 14-day
   right of withdrawal, and the site already publishes a `right-of-withdrawal` page. These
   contradict each other. Needs a decision, ideally with legal input.

3. **Delivery times contradict.** Product pages say **1–2 weeks**; the FAQ says **3–8 weeks**
   for Europe and *"may exceed one month"* for Asia/Americas/Australia. One must be correct.

4. **Scope vs. proposal.** The commercial proposal quotes **4,000 DH / 2–3 working days**
   for *Accueil, À propos, Services, Contact, Boutique* with basic SEO. The brief asks for
   materially more: rich piece pages, Our Story, a separate Mrirt inquiry flow, structured
   shipping zones, Analytics + Search Console. Also, a **"Services" page does not fit this
   brand**. Scope and timeline need re-alignment before build.

5. **Language.** The brief is written in French; the current site and all product copy are
   in English. Single language or bilingual (FR/EN)? This affects URL structure and SEO.

6. **Photography.** Photos are declared the priority, but the only available images are
   Jimdo CDN derivatives. **Original high-resolution files are needed from the client** —
   plus the material/artisan/travel imagery for home sections 6 and the Story page, which
   does not exist on the current site at all.

7. **Shopify integration shape.** Storefront API (headless) vs. Buy Button / cart embed.
   Affects hosting, the "edit products easily" requirement, and build time.

---

## 10. Source documents

| File | What it is |
|---|---|
| `Portfolio  The Roots Corner.pdf` | Brand communication & campaign strategy by La Rêveuzze Creates — logo analysis, palette, competitor/inspiration set |
| `proposition_site_web_professionnelle.pdf` | Commercial proposal, 12 June 2026 — scope, pricing, Shopify architecture |
| `therootscorner-logo.pdf` / `-picto.pdf` | Vector brand marks |
| [docs/reference/](docs/reference/) | Extracted text of the above + old-site sitemap |

---

## 11. Decisions taken (2026-08-27)

| Decision | Choice | Consequence |
|---|---|---|
| **Stack** | **Next.js (App Router) + Shopify Storefront API** — headless | Total design/SEO control. Shopify runs cart + checkout only. Client edits products and prices in the Shopify admin. Deploy on Vercel. |
| **Language** | **Bilingual FR + EN**, locale-prefixed URLs (`/fr/…`, `/en/…`) | Fits the FR/BE/CH shipping markets. All 38 product descriptions need French translation; `hreflang` + per-locale metadata required. |
| **Sequence** | **Homepage first**, fully realised, then remaining page types | Design direction gets locked at the cheapest point to change it. |

### Translation rule

Translating the client's existing English product copy into French is **translation, not
authorship**. Do not add, embellish, or infer any fact during translation — §5's rule
still binds. Where the English is silent on origin or era, the French must be silent too.

---

## 12. Build state

**Homepage is built and running.** `npm run dev`, or `npm run build && npx next start -p 3111`.
Routes: `/fr` and `/en` (both statically generated); `/` redirects by `Accept-Language`, falling back to French.

### The design direction

**Signature — "the hour of the room."** The page ground travels through six steps of
light: morning ecru at the hero, then late morning, midday, afternoon, dusk, and night at
the footer. A visit reads as a day passing in a Marrakech room. Each hour blends into the
next across a soft band, so it registers as light moving rather than as stacked colour
blocks. This is what reconciles the brief's ban on excessive animation with the proposal's
promise of motion: the page moves, but only the way a room does.

**Hero thesis — the page is the wall.** The client's photography is almost entirely shot
against one pale plaster wall, so the ecru ground continues that wall rather than framing
it. The piece stands on the page. The photograph hangs below the header rail, as work
hangs below a label rail.

**Typography.**

| Role | Face | Why |
|---|---|---|
| Display | **Marcellus** | Inscriptional roman, low contrast, carved letterforms belonging to the same world as the carved wood in the photography. Deliberately *not* the high-contrast serif (Playfair/Cormorant) this brief attracts. It ships one weight only — hierarchy must come from size and tracking, which keeps every heading quiet. |
| Body / UI | **Jost** | Geometric humanist echoing the circular construction of the ROOTS wordmark. Carries the "wall label" register: 0.7rem, uppercase, 0.22em tracking. |

**Motion.** One gesture, used everywhere, so the page has a single tempo: content settles
in once, slowly (`Reveal`). Deliberately *not* scroll-linked — anything continuously tied
to scroll position reads as a gimmick on a site whose job is to hold still. Fully disabled
under `prefers-reduced-motion`.

### Layout decisions forced by the material

- **All photography is portrait** (201 of 212 images, ratios 0.67–0.85). There is no
  landscape source, which rules out a full-bleed hero crop. The hero is a diptych instead —
  a decision the material made, not an arbitrary one.
- The featured trio is **staggered at three heights**, not gridded: works hung on a wall,
  not a row of cards. Silhouettes alternate dark / pale / dark.
- Category covers **exclude** anything already in the featured hang, so no object appears
  twice on one screen.

### Accessibility floor — verified, not assumed

- Contrast: every text/ground pair clears **4.5:1**. The label register is 0.7rem, which
  WCAG counts as small text, so `--ink-soft` was darkened to `#5F5852` and a deeper
  `--clay-ink` (`#6D5541`) introduced for text. `--clay` remains for non-text accents.
- No horizontal overflow at 390px. Visible focus ring on every stop; skip link first.
- `prefers-reduced-motion` verified: 0 elements left transparent.

### Tooling

- `scripts/shoot.mjs` — screenshots by **scroll-and-stitch**, not Playwright `fullPage`.
  `fullPage` resizes the viewport to the document height, which makes the hero's `100svh`
  expand to the whole page and returns a wrong capture. Do not switch it back.
- `scripts/audit.mjs` — reduced motion, phone overflow, focus ring.
- `scripts/probe.mjs` — per-section layout geometry.

> **Windows note:** `pkill -f "next start"` does **not** kill the dev server. It survives,
> holds port 3111, and then serves a half-overwritten `.next` — which looks exactly like
> "the CSS stopped working". Kill it via PowerShell `Get-NetTCPConnection -LocalPort 3111`.

---

## 13. Content the client still owes

None of this can be invented (§5). Each blocks a specific piece of the build.

| Missing | Blocks |
|---|---|
| **Rug photography** | Still nothing of a rug in the 212 files. The Mrirt section no longer waits on it — it carries the weaving comb instead (§23) — but a real rug would replace the wide plate. |
| **A portrait of Dahab** | "Our Story" currently borrows a still life. The brief wants the reader to want to know the person behind the selection — that needs her face. |
| **Artisans, travels, places, materials** | Home section 6 of the brief. Currently served by close crops of pieces, which is honest but narrower than asked. |
| **Original high-resolution files** | Current images are CDN derivatives at 2000px (originals are ~12MB each; URLs recorded in `docs/images.json`). Fine for layout, not for a hero at 4K. |
| **Product name cleanup** | Names are inconsistently cased in the source data and are normalised for display. Some carry typos — e.g. *"Cote d'Ivoire"* is missing its circumflex. Corrections should come from the client, not from us. |

### Still to build

Collection index and per-category pages · piece detail (§5 — the highest-priority page) ·
Our Story · Mrirt inquiry flow · shipping · contact · legal pages · Shopify Storefront API
wiring (currently `lib/catalog.ts` reads the JSON scrape; it is the single swap point) ·
French translations of all 38 product descriptions.

---

## 14. Refinement pass — the label schema

Three skills drove this pass: **scrollcraft** (project-scoped equivalent of its
gallery/catalog grammar), **web-design-guidelines** (Vercel), and **image-to-code**.

### The single biggest change

Scrollcraft's *gallery / catalog* grammar says: **museum labels, not marketing
copy — and every object gets the same label schema, no exceptions, because the
schema is what makes it a collection instead of a grid.**

The homepage previously captioned pieces with name + price. Now every piece
carries one schema ([components/PieceLabel.tsx](components/PieceLabel.tsx)):

```
Dogon Tribal Staff
ORIGINE       Dogon
DIMENSIONS    61 cm et 55 cm
180 €
```

Fields the client has not supplied are **omitted, never filled**.

### What the schema exposed

Applying a uniform schema surfaced how patchy the source data is. Run
`node scripts/coverage.mjs`:

| | |
|---|---|
| Usable dimensions | **22 / 38** |
| Descriptions | **22 / 38** |
| Jimdo sample text still live as a "dimension" | **7 pieces** |
| "Exact dimensions available very soon" | 8 pieces |
| A lone `"S"` as the dimension | 1 piece |

> An earlier note in §8 said "dimensions: 38/38". That counted non-empty
> strings. The real figure is 22.

Real formats in the field include `Features: 34 cm * 30cm`,
`Dimensions: Height 32 cm × Diameter 33,5 cm`, `39 cm`,
`Length: 61 cm / ≈ 24.0 in`, and `Between 73 et 83 cm` — French inside English copy.

[lib/specs.ts](lib/specs.ts) normalises these: it rejects placeholder text,
unifies separators to `×`, glues each number to its unit with a non-breaking
space, and translates the axis words (`Height → Hauteur`, `and → et`).
`scripts/test-specs.mjs` checks it against all 38 real strings.

> **Word boundaries are load-bearing.** `/et/gi` without `\b` matches inside
> "diam**et**er". The test asserts against exactly that.

### Origin is never inferred

`originOf()` reads only terms the client put in the piece name, and **does not
resolve a cultural attribution into a country**. "Dogon Stool" yields *Dogon*,
not *Mali*. The client never wrote Mali. On antique objects that inference is
frequently wrong, and it is precisely the invented provenance §5 forbids.
Place names are translated (`Morocco → Maroc`); attributions are not.

### Mrirt — a specification plate

Beni Rugs shoot rugs **flat, filling the frame on a warm ground**, with a spec
panel beside them (Colour / Size / Construction). The Mrirt section now mirrors
that shape using the four axes from the client's own sentence — *"customizable
in size, color, design, and texture"* — leading to an inquiry, not a cart.

The rug frame is an **honest empty slot** at the right proportion. There is no
rug photography in the 212 files, and Beni's photographs are a competitor's
copyrighted work.

### Web Interface Guidelines fixes applied

`scroll-margin-top` on sections (the fixed header was occluding `#selection`) ·
`font-variant-numeric: tabular-nums` on prices and dimensions · typographic
apostrophes throughout both dictionaries · `touch-action: manipulation` ·
`-webkit-tap-highlight-color` · `overscroll-behavior: contain` on the menu panel ·
44 px hit targets on the language switch, menu toggle and hero cue ·
`theme-color` + `color-scheme` · `translate="no"` on the wordmark ·
`aria-label` on the language switch · alt text matched to the visible label ·
**focus trap** on the menu panel (it locks scroll, so it must behave modally —
Tab cycles inside, Escape closes, focus returns to the toggle).

Next 16 housekeeping: `themeColor` moved to the `viewport` export, and
`middleware.ts` renamed to `proxy.ts` (the old convention is deprecated).
Build is warning-free.

> **`scripts/audit.mjs` must settle before measuring.** The reveal starts images
> at `scale(1.055)` for 1600 ms; measuring earlier reports the hero as a false
> horizontal overflow. It scrolls the page, then waits 2200 ms.

> **`sed` with leading-whitespace patterns silently no-ops** against these files.
> Two audit fixes appeared to apply and did not. Prefer the edit tools, and for
> regex-bearing content prefer writing the file whole: a heredoc ate the `\b`
> in `AXIS_WORDS` and produced exactly the boundary bug described above.

---

## 15. Second refinement pass — the seams, the hero, the mark

Client review found real defects, not preferences. What each was, and the fix.

### The banding between sections was a bug

Each section painted its own `from → to` blend. But `hour-midday` was used
twice and `hour-afternoon` three times, and every instance re-ramped **from the
previous hour** — while the section above had already ended on the current one.
So the ground jumped backwards and re-ramped at every repeat, cutting a visible
band across the page.

**Sections no longer paint grounds at all.** One `.daylight` gradient sits
behind the whole page. Measured down the left gutter, the light hours now move
by **at most 3 of 255 per 2% of page height** — no step is perceptible.

> Never reintroduce per-section grounds. The seams are structural, not a
> tuning problem.

**Sundown is the one exception, and it earns it.** The drop to night cannot
ride the same percentages — the ramp would land wherever the page happened to
be long, and cream text would end up on golden ground. So the last light
section carries `.sundown` in its own bottom padding: content stays on light,
and `.night` / `.night-deep` below start fully dark. It happens exactly once,
at a real change of state.

### The hero was cropping the piece to an abstract

`object-fit: cover` in a tall full-bleed column showed only the lampshade, and
`justify-content: flex-end` pushed the title below the fold. On a gallery site
the object was unreadable and the name needed scrolling to reach.

The frame ratio now **matches the source** (2000×2666 ≈ 3/4) so nothing is
cropped, its height is capped to the viewport, and the hero is exactly
**one screen** — whole piece, whole headline, no scrolling.

### Everything else in that review

| Complaint | Fix |
|---|---|
| Header "very basic, thin, looks bad" | Wordmark set in **Marcellus at 1.02rem**, not 0.7rem letterspaced sans — at that size a grotesque reads as system chrome, not a brand. Picto up to 2.05rem, taller bar, hairline rule on scroll. |
| Animations "trigger before the time" | The observer used `rootMargin: -12%`, letting elements animate while still below the fold — by the time you scrolled there the movement was over. Now `rootMargin: 0` + `threshold: 0.12`. |
| "image bigger than the screen" | Reveal scale reduced 1.055 → 1.03. |
| "section bigger than the screen" | `--section-y` reduced from `clamp(5.5rem,13vw,12rem)` to `clamp(4.5rem,10vw,9rem)`; page is 8.5k not 9.3k. |
| Mrirt "not creative" | Rebuilt as a **weaving draft**: the piece wide across the page, its four axes ruled beneath in Marcellus like warp lines. Frame widened to 5/2 — at 3/2 an empty slot read as a hole. |
| Footer "AI slop" | Was four columns of link lists with a newsletter voice — the shape of a large retailer, which the brief bans. Now the mark, one line, one row of links. |
| No logo animation | `crescent-swing`: the mark rotates up into place on load, the gesture the shape implies. Wordmark rises behind it. Both once, both honour reduced-motion. |

---

## 16. The sundown — why it looked muddy

The ramp to night read as grey sludge. Two causes, both measurable.

**1. `transparent` is not "no colour" — it is `rgba(0,0,0,0)`.**
The ramp began `transparent → var(--hour-dusk)`, so every intermediate pixel
was interpolating toward *black* and dragging the warm ground grey with it.
Any fade-out in this palette must start from the ground colour at zero alpha —
`rgba(221, 205, 182, 0)` — never from `transparent`.

**2. A direct golden→dusk interpolation loses saturation through the middle.**
Measured as the max-min channel spread ("warmth"):

| | golden | mid | dusk |
|---|---|---|---|
| straight to dusk | 39 | **36** | 33 |
| via sand → clay → umber | 39 | **54** | 33 |

Warmth *sagging* through the middle is what the eye reads as mud. Routing the
ramp through the brand's own `--sand` and `--clay` makes warmth *rise* into the
middle, which is what a room actually does as the sun drops.

Verified on the rendered page: 39 → 42 → 44 → 49 → **54** → 46 → 37 → 33.

**The ramp is also its own element now.** It previously ran through the last
section's bottom padding, which put the rug specification and its link on a
darkening ground. `<div className="sundown" />` sits between the last light
section and the first dark one, so content is guaranteed to stay clear of it.

> Rule for this palette: never interpolate to or from `transparent`, and never
> take the shortest path between two browns. Both roads lead to grey.

---

## 17. The descent — why it could never be "just a longer gradient"

The light hours are imperceptible because they barely move: ecru `#f7f5f2` to
golden `#ddcdb6` is **26 units of red across ~6,600px** — about 1 unit per 250px.

Golden to night is **159 units**. Matching that rate would need roughly
**40,000px of page**. It cannot be done by lengthening a gradient.

### The real constraint

Between about `#a08a6e` and `#6b4c39` **neither ink nor cream is readable**:

| ground | dark ink | cream |
|---|---|---|
| sand `#beab93` | 7.06 | 1.85 |
| `#a08a6e` | 4.75 | 2.74 |
| clay `#866950` | 3.10 | 4.20 |
| `#6b4c39` | 2.03 | 6.41 |
| umber `#4b3123` | 1.32 | 9.89 |

So the descent must be **fast**, and the fast part must happen where there is
**no text at all**.

### The brief already solved it

Section 6 of the brief is *"images de matières, artisans, voyages ou lieux"* —
pure imagery — immediately before the invitation. Restoring the brief's real
section order puts a wall of photographs exactly where the unreadable stretch
has to fall.

`.matter-wall` is full-bleed, edge to edge, **no gaps**, four panes. The ground
runs its entire crossover behind it. The viewer goes into photographs on light
ground and comes out on dark; the change is never seen crossing text, and never
seen as a line.

`.matter-wall::after` fades the panes into the ground at the bottom — the
photographs are shot on a pale wall, so without it their lower edge met the
darkened ground as the one remaining seam.

**Constraints this places on the page — do not break them:**

- No text overlay on the image wall, and no gaps between its panes. Either
  exposes the crossover.
- The wall must stay between the last light section and the first dark one. If
  sections are reordered, the gradient stops (72% → 93%) must move with it.
- Sections were added, not padded: **Instagram** (brief §9, previously only a
  footer link) now sits above the wall while the ground is still light enough
  for ink, and Mrirt moved up to join the categories as the brief's §4 "focus".

### Section order — now the brief's own

hero → a few pieces → who this is → focus (categories + Mrirt) → the story →
Instagram → **the image wall** → invitation → footer

---

## 18. No scrim on the photographs

The image wall briefly carried a gradient overlay to blend its lower edge into
the darkening ground. **Removed.** The pieces are the product; they are shown in
their own light, and nothing is laid over a photograph to make a background
effect work.

The descent moved instead to **open ground below the wall**:

| | |
|---|---|
| Image wall | 78.5% – 84.8% of page — ground stays **golden** behind and below it, close to the pale plaster the pieces are shot on |
| Open runway | 84.8% – 90.5% — **538px of pure background**, no photograph, no text |
| Text returns | 90.5%, on `#5e422d` — cream clears 7:1 |

Measured across the runway, warmth stays high the whole way — 39 → 50 → 61 →
62 → 54 → 51 → 46 → 40 — so it descends through amber and clay rather than
sagging into grey. `.matter` carries a large `padding-bottom` to create that
runway; it is load-bearing, not decorative spacing.

> **Rule: the colour transition lives on the background only.** Never re-add a
> scrim, veil, or gradient overlay on top of a piece photograph to smooth a
> ground change. If a transition needs room, give it empty ground — as here.

---

## 19. The ground is scroll-driven, not a gradient

Three attempts failed before the cause was understood:

1. Per-section blends — banded wherever an hour repeated.
2. One page-length gradient — no bands, but still a **boundary on the page**.
3. A slower, warmer ramp on open ground — still a boundary.

**A vertical gradient always puts an edge somewhere, and scrolling drags that
edge up through the viewport.** However gentle the ramp, you watch the moment
arrive. That is what kept being felt, and no amount of easing removes it.

### The fix

[components/Ground.tsx](components/Ground.tsx) is a fixed, viewport-filling
surface whose colour is interpolated from **scroll progress**. The whole screen
changes tone at once. Nothing travels past; the room gets darker while you are
in it.

Verified at real viewports — each screen is a single flat tone:

| progress | ground |
|---|---|
| 0.80 | `rgb(221,205,182)` |
| 0.86 | `rgb(221,205,182)` |
| 0.90 | `rgb(119,91,69)` |
| 0.94 | `rgb(66,43,31)` |
| 1.00 | `rgb(44,30,22)` |

> **A stitched full-page screenshot can no longer represent this page.** Each
> slice is captured at a different scroll position and therefore a different
> ground colour, so the composite shows edges that do not exist in use. Use
> `scripts/ground-frames.mjs`, which captures whole viewports.

### Why the drop can be fast now

The stops are squeezed between the last ink-on-light text leaving the viewport
(progress 0.867) and the first cream text arriving (0.894). That is tight — and
it no longer matters. With a fixed ground there is no edge to see crossing the
screen, so a fast change reads as the room dimming, not as a band going past.

`scripts/contrast-scroll.mjs` walks the page and checks every visible text
element against the ground colour **at that scroll position**. It currently
passes. Run it after changing `STOPS` or the section order — a stop moved by a
few percent silently makes text unreadable on the way in.

Two ink values were tightened to pass it: `--ink-soft` `#5f5852 → #5d5650`
(golden is the darkest ground ink now meets) and `--ink-inverse-soft`
`#bda98f → #d0ba9d` (cream-soft must hold while the ground is only part-way
down).

### Reveal no longer uses IntersectionObserver

IO reports state at callback time, not for every position passed through, so a
fast flick or programmatic jump can coalesce callbacks and leave an element
permanently invisible. [components/Reveal.tsx](components/Reveal.tsx) now uses
one shared rAF-throttled scroll check that reads actual rects — deterministic,
one listener for the page, and it removes itself when nothing is pending.

> **Test-harness trap, cost an hour:** the site sets
> `html { scroll-behavior: smooth }`, so `window.scrollTo(0, y)` in a test
> **animates**. Stepping faster than the animation left the page far behind —
> it stopped at 7071 of 8510 and reported content below as never revealed.
> All scripts now use `window.scrollTo({ top: y, behavior: "instant" })`.

---

## 20. The second look — hover swaps the piece photograph

Hovering a piece crossfades to another photograph of the same piece, so the
gesture answers *"what else is there to see"* rather than decorating.

### Which image

Not `image[1]` — for several pieces that is nearly the same frame and the
crossfade reads as a glitch. `scripts/pick-swap.py` picks the image that differs
MOST from the primary, restricted to the same orientation so the swap does not
re-crop the subject, and writes a `swap` index per piece into `docs/images.json`.
37 of 38 pieces have one. Re-run it after adding or reordering photography.

The Baule chair goes from the whole chair to a macro of its turned leg; the
Dogon staff from a shadowed crop to the fork in warm light.

### Two bugs worth remembering

**1. Specificity silently killed the transition.**
`.hang-item .frame img` (0,2,1) sets `transition: transform, filter` for the
hover brightness. The swap rule was written `.frame-swap .is-swap` — only
(0,2,0) — so the hang rule won and **dropped the opacity transition entirely**.
The swap jumped with no dissolve, and nothing in the markup looked wrong.

Fixed by writing `.frame-swap img.is-swap` (0,2,1), matching its weight and
winning on order. **Do not simplify that selector.**

**2. Fading both layers washes the midpoint.**
Fading the resting image out while fading the swap in puts both near 50%, so the
frame background shows through and the dissolve goes pale. The resting image now
stays opaque underneath and only the incoming layer animates — the midpoint is a
true blend of two photographs.

Also: `--ease-material` is an ease-out and front-loads, so a 900 ms dissolve was
~72% done at 300 ms and read as a snap. Crossfades use `--ease-dissolve`
(symmetrical). Measured on the page: 0.02 → 0.09 → 0.23 → 0.44 → 0.65 → 0.81 →
0.96 → 1.00, passing 50% at ~430 ms.

### Cost and reach

The swap layer is `display: none` under `@media (hover: none)`, so phones never
fetch a second image. It is `alt=""` and `aria-hidden` — the piece is already
named by the primary image. Keyboard users get it on `:focus-visible`.

> **Testing note:** `card.hover()` in Playwright scrolls the target into view,
> which shifts the page between shots and makes a fixed crop look like the frame
> resized. Use a real `mouse.move` to the element's box instead.
> `scripts/hover-frames.mjs` does this.

---

## 21. The intro — the mark is written, then it morphs

The crescent is an Arabic-inspired "R" (§2), so it arrives the way a letter
arrives: **written**, from the top tip down and around to the tail — right to
left, the direction that letterform is actually written. Then the *same
element* travels and scales into the header's picto slot while the veil lifts.

### Why it needed a derived path, not a dash on the outline

The picto is a **filled outline, not a stroke**. Animating `stroke-dashoffset`
on it traces the crescent's *silhouette* — the shape gets outlined, which is
not writing. The fill has to be revealed through a **mask** whose content is one
thick stroke running down the middle of the glyph.

That middle line does not exist in the source file, so it is derived, not drawn
by eye. The outline is one closed contour running from the thin tail up the
**inner** edge to the top tip and back down the **outer** edge — so the two
halves are natural opposites. `scripts/centerline.mjs` resamples each half by
normalised arc length and averages the pairs.

| | |
|---|---|
| Centreline length | 159.71 units |
| Furthest glyph point from it | **8.45** |
| Mask stroke | **19** wide (needs ≥ 16.9) |
| Measured coverage when written | **101.3 %** — no gap |

`pathLength="1"` on the nib makes the dash normalised, so nothing has to be
measured at runtime.

> **Do not test mask coverage by cloning the SVG into a data URI.** The class
> that animates the nib lives in the document stylesheet, so the clone renders
> with no dash at all and reports perfect coverage *however narrow the stroke
> is*. The first version of this check passed with a stroke that could not
> possibly have worked. `scripts/intro-frames.mjs` drives the real element
> through the Web Animations API instead — which also pauses the sequence,
> since `Intro` waits on `.finished`.

### The morph is one element, not a cross-fade

The written crescent **is** the header picto: at the end of the write it is
FLIPped onto `[data-mark-target]`, measured live. Both are the same `<svg>` at
the same `viewBox`, so matching centre and width lands them exactly —
`scripts/intro-frames.mjs` reports `dx 0, dy 0, scaleErr 0`. There is no
cross-fade because none is needed.

The handover deliberately waits `SETTLE` (90 ms) past the end of the morph.
Scheduling it for the same instant is a race the mark can lose: the veil hides
while it is still a frame short of its slot, and it visibly jumps.

### The veil is the page's own ground

`--hour-morning`, the same colour the page starts on. What the lift reveals is
photography and type arriving — never a change of wall. The page's own `Reveal`
gesture is **held back** until the veil starts lifting (`trc:intro-done`);
otherwise the hero would reveal behind the veil and simply be there when it
went, spending the page's one gesture on nothing.

### Timing — about 1.55 s

`write 720 → hold 70 → morph 760 (veil lifts 120 ms in, over 640) → settle 90`

The write is CSS, so it starts at **first paint**. The rest is JS, which starts
at **hydration** — measured at over 500 ms on a cold production start.
Sequencing the morph with a plain `setTimeout` therefore fired it *before the
nib had finished*. `Intro` awaits the nib's own `animation.finished` instead.

### When it does not run

Decided **before first paint** by the inline gate in the layout, which stamps
`data-intro` on `<html>`. Doing this in an effect would show a frame of the page
first — the exact flash the intro exists to prevent.

| | |
|---|---|
| Once per session | A 1.5 s veil on every reload is the "excessive animation" the brief bans |
| Never under `prefers-reduced-motion` | The header keeps its own `crescent-swing` |
| Never without scripting | `.intro` is `display:none` unless `data-intro="run"` |
| Replay it | append **`?intro`** to any URL |

The gate also arms a 5 s failsafe that clears the lock and fires
`trc:intro-done` on its own. Whatever happens to React afterwards, a broken
bundle can never leave a visitor on a blank veil or a page that will not scroll.

> **The scroll lock breaks the measuring scripts.** Every Playwright page is a
> fresh session, so the intro opens on every run, and a script that scrolls
> shortly after load measures a page that *cannot move* — reporting it as
> layout. All of them now call `skipIntro(page)` from `scripts/lib/no-intro.mjs`,
> which seeds the gate's session key. Add it to any new script that scrolls.

Checks: `scripts/intro-frames.mjs` (coverage, landing, frames) and
`scripts/intro-guards.mjs` (session, reduced motion, phone, no-JS).

---

## 22. Header and hero, after balmoralrunning.com

### Header — what transferred

**Centred wordmark, nav split around it.** Nav left, mark in the middle,
utilities right, in a `1fr auto 1fr` grid so the mark stays optically centred
whatever the two languages measure. The split is meaningful, not decorative:
the ways *into the collection* on the left, *the house* and how to reach it on
the right. Four items on one side against a lone language switch on the other
read as lopsided.

**It retracts while reading downward** and returns on the first upward move —
the pieces are the stars, and a bar pinned across every photograph is chrome
nobody asked for. Never while the menu panel is open.

Two bugs the change surfaced, both phone-only:
- The picto collapsed to nothing. An SVG with `width: auto` has no intrinsic
  width to defend in a flex container. It needs `flex: none`.
- With the inline nav hidden, a three-column grid left an empty `1fr` on the
  left and shoved the mark off centre. Phone uses `auto 1fr`; the three-column
  grid starts at 940px.

### Hero — full bleed, type overlaid

**Only one of the 212 photographs survives a full-bleed crop.** All the
landscape frames are overhead product shots on a pale wall. The room shot —
carved Berber door, plaster, the pedestal bowl — is the only one that reads as
a *scene*; everything else becomes an unreadable fragment at 16:9. It is now the
hero, and the lamp took its place in the Story section.

**The scrim is measured, not styling.** Against this frame:

| | cream | note |
|---|---|---|
| pale plaster | **1.15:1** | fails everywhere |
| header band | **1.32:1** | a transparent header is impossible here |
| carved door | dark | *ink* fails here instead |

It is a mixed-luminance photograph: **no text colour clears 4.5:1 across it
unaided.** Rather than apologise for a scrim, the page uses it — the room falls
into shadow at the hero, then opens into morning light below, which is the arc
the whole page already follows.

The header is **frosted** (`rgba(247,245,242,.86)` + blur) rather than solid: an
opaque bar cut a hard line straight across the photograph, and transparent is
not available at 1.32:1.

The hero intro paragraph was **removed**. Three lines of body copy could not be
made legible there without a scrim heavy enough to kill the image; the
presentation section already says who this is.

### Verified

`scripts/contrast-photo.mjs` — the hero cannot be checked against the page
ground, so this screenshots it **with the text hidden** and reads the pixels
that were behind each box.

> Sampling inside a *visible* text box does not work: the glyphs are in the
> sample, so the darkest "background" pixel found is the text itself and
> everything scores ~1.0:1. That first attempt reported four confident,
> meaningless failures.

Current, both widths: headline 4.00 / 5.24 (needs 3), tagline 5.58 / 4.98,
cue 9.66 / 7.89. `contrast-scroll.mjs` now skips `.hero` so it does not
double-report it against a ground that is not there.

---

## 23. Mrirt — the instrument, because the rug does not exist yet

The section used to hold an **empty slot** at rug proportion, labelled
*"Photography to come"*, because there is no photograph of a rug anywhere in
the 212 files and a competitor's is not an option.

### The reframe

A Mrirt rug is **handwoven to order**. At the moment anyone reads this page,
the rug they would buy does not exist. So the section cannot show one — and
that is the product's defining fact, not a gap to apologise for. It shows the
**instrument** and the **four terms you set** instead.

The photographs are the client's own **antique Berber weaving comb**, which is
itself a piece in the collection (`african-decoration`, €130). It is the only
object in the whole catalogue connected to rug weaving — a grep for
*rug · tapis · carpet · kilim · weav · wool* returns exactly one product.

Two frames, two registers:

| | file | ratio |
|---|---|---|
| **Plate** — the whole tool, flat overhead, the engraving legible | `…comb…-01.jpg` | 3/2, the only landscape frame in the set |
| **Detail** — macro of the worked metal and the wooden handle | `…comb…-07.jpg` | 2/3 |

### The caption is not decoration

`t.rugs.figure.caption` carries the client's own product name verbatim —
*"Peigne ancien utilisé pour le tissage des tapis marocains"*. **Nothing on this
page may let a tool be mistaken for a rug**, and a museum-label caption is what
prevents it. Same rule for the alt text: *"engraved with Berber designs and
featuring a wooden handle"* is the client's description of this piece, not an
embellishment (§5).

`t.rugs.order` — *"Chaque tapis est tissé main sur commande."* — sits directly
above the four axes and says plainly why no finished rug is pictured. It is a
restatement of the client's own sentence, not a new claim.

### 2.25 is arithmetic, not taste

```css
grid-template-columns: minmax(0, 2.25fr) minmax(0, 1fr);
```

2.25 is **(3/2) ÷ (2/3)** — the ratio of the two source frames. Split that way,
a landscape 3/2 and a portrait 2/3 come out at *exactly the same height*, so the
pair sits level with **no crop on either**.

The first attempt used 1.85fr with `align-items: end`, which left the portrait
71px taller and opened a visible void above the plate. Bottom-aligning was an
attempt to style around a proportion problem; deriving the split from the
sources solved it. If either frame is ever swapped, **recompute the split** —
it is not a magic number.

On phones the two stack, with the detail at 66% width offset right, so they read
as a pair of hung works rather than two equal blocks.

### Also restored

`t.rugs.body[1]` — the **women's weaving cooperative in Mrirt, Middle Atlas** —
was in the dictionary and unused. It is the most artisan-forward sentence the
client has written and the section was rendering only `body[0]`.

> Section height is now 1515px, the tallest on the page but in line with
> selection (1442) and categories (1404). Growing it moves every downstream
> section's scroll percentage, and the ground's stops are tuned to those — so
> `scripts/contrast-scroll.mjs` is not optional after a change like this (§19).
> It passes, as does `scripts/contrast-photo.mjs` for the hero.

Captured by `scripts/shoot-rugs.mjs`, which grows the viewport to the section's
height rather than stitching — slices taken at different scroll positions carry
different ground colours and show seams that do not exist (§19).

---

## 24. The rest of the site — collection, room, piece, story, Mrirt, contact

Six routes were added: `/collection`, `/collection/[category]`, `/piece/[slug]`,
`/story`, `/mrirt`, `/contact`, in both locales. 102 pages build.

References the client pointed at for this pass: **balmoralrunning.com** (section
discovery, plainly stated availability), **verostudio.com** (a transformation
read as a sequence; emphasis inside a sentence), **noartmusic.com** (bracketed
counts, an indexical register, a coordinate readout). What each contributed is
noted below — none of them is copied; each turns into something this collection
already wanted to be.

### The plate — one opening for every page

Every page below the homepage opens the same way: eyebrow, title, one line of
fact, one lede. The homepage opens on a photograph because it has one worth a
whole screen; the other pages open on a **label**, because what a visitor wants
there is to know where they are. Holding that shape identical across six pages
is what makes them read as rooms in one building — the same argument as the wall
label on the pieces (§14).

### The register — the strongest new device

`/collection` gives two ways in. The **rooms**: seven doorways, one photograph
each, with a count. Then the **register**: all 38 pieces as one list, numbered,
with the same six fields in the same order — no. / piece / origin / dimensions /
price / state.

A catalogue is a grid of products competing for a click. A register is an
archive you read down. On a pointer device the hovered line shows large in a
panel that **stays put while the list scrolls past it**, so reading the list and
looking at the pieces are one gesture; the contact-sheet thumbnail carries that
job on a phone, where there is no hover.

The uniform schema does the same work it does on the homepage: it makes the gaps
in the client's data **visible** rather than papered over. Sixteen rows have no
dimension. That is the true state of the catalogue and the page says so.

> **Numbers are positions, nothing more,** and the page states that in as many
> words. An accession-looking number beside an antique object will otherwise be
> read as an age, an edition size, or a provenance mark — invented provenance by
> implication, which §5 forbids as firmly as inventing it in prose. The numbers
> earn their place by being quotable: a piece page links to `/contact?piece=…`
> so an enquiry arrives already saying which object it is about.

### The piece page — the photographs move, the label does not

`grid-template-areas` puts the lead photograph and the remaining ones in two
rows of one column, and the label in a single cell spanning both. The label is
`position: sticky` inside it, so it stays beside the work the whole way down —
which is how an object is actually looked at in a gallery.

- **`align-self: stretch`, not `start`.** The grid sets `align-items: start`,
  which shrinks the label column to its own content and leaves sticky no track
  to travel. The label then scrolled away after the first photograph.
- **No cropping, ever.** Every photograph renders at its own ratio, from
  `scripts/image-dims.mjs`, which now writes each file's true pixel size into
  `docs/images.json`. Ratios in this set run **0.56 to 1.50** — any single house
  ratio cuts most of them.
- **Height-capped, left-aligned, no plate colour.** The lead is capped to one
  screen, so the whole object reads at once (the hero's lesson, §15). The rest
  cap at 76svh. Widths therefore vary, and they hang from a common left edge so
  the variation reads as a hang rather than a broken grid. A frame tint showed
  as **grey letterbox bars** beside anything narrower than its column; the
  photograph sits on the page ground, which is the whole thesis of the site.
- **Mobile order is photograph → label → the rest.** Put every photograph in one
  block and the price ends up below as many as nine images.
- **Sold is designed for, not handled.** Stock is one of everything, so it is
  frequent: the label states it, the register strikes the price, and the enquiry
  action is *replaced* rather than left to fail.

### Our Story — built to be beautiful with four sentences

Four sourced sentences exist about Dahab and the house, and §5 forbids writing a
fifth. There is no portrait of her in the 212 files.

So the hinge — Paris to Marrakech — is **drawn as a route** rather than
described as one: two stations on a ruled line, her own sentence set large
between them. That is vero's transformation sequence doing honest work.

And the portrait is **an empty frame that says "Portrait à venir".** A still life
standing in silently for a person is a small lie the page would tell every
visitor, and it would also let the client believe the asset had been covered.

### Mrirt — no cart, and no rug

The one page that sells nothing. The four form fields are the four words in the
client's own sentence — *size, colour, design, texture* — which is what makes
the form honest as well as short. The page shows the **weaving comb** figure the
homepage now uses, captioned as exactly what it is: nothing here may let a tool
be mistaken for a rug.

### Contact — the enquiry is about something you can see

The first version was type on a ground and nothing else: the right half of the
screen was empty, the page carried no photograph until the closing band, and it
gave a visitor no reason to write. **Space only reads as generosity when there is
something for it to be around.** Rebuilt as three moves.

**The desk.** One screen: eyebrow, title, lede, the Instagram handle at full
size, and the coordinate readout on the left — a piece standing at viewport
height on the right. Same construction as the homepage hero, so the page belongs
to the site before it asks anyone for anything.

**The subject.** Arriving from a piece page, *that piece* is the photograph, with
"you are asking about" over its wall label and price, and the message opens
already saying `No. 24 · Dogon Tribal Staff`. Piece pages therefore link as
`?piece=<slug>`, not as a display string: a slug resolves back to the record, so
the page can show the object, the label and the price. This is what the register
numbers exist for — a number is easier to quote than "the tall dark wooden one".
With no piece named, the frame shows the Baule chair (the only frame in the set
that reads architecturally at hero scale, and still available) with `alt=""` and
**no label** — labelling it would put a piece in the reading that the visitor
never asked about.

**What to ask.** Four numbered routes, ruled like the register: a piece, a rug,
delivery, something you saw. Each is a real destination — collection, Mrirt, and
Instagram — except delivery, which names the client's shipping zones and **no
times**, because their product pages say 1–2 weeks and their FAQ says 3–8 (§9.3).
Delivery is deliberately the one row with no link: the shipping page does not
exist yet, and for the same reason.

> **The column gets the height, not the photograph.** Sizing `.desk-frame`
> directly worked until a visitor arrived from a piece page — then the wall
> label under it pushed the price off the bottom of the screen, in the one case
> the layout exists for. `.desk-subject` now carries the height and splits it
> `minmax(0, 1fr) auto`. And no `max-height` on a phone: capping it made
> `object-fit: cover` crop the frame's own ratio and cut the legs off the chair.

Every fact on the page is one we hold: the client's own Instagram, and
Marrakech's coordinates shown as *the city the collection is put together in*.
There is no telephone number and no street, because we have neither.

**The client has not supplied a contact address** — their own proposal still
lists it as outstanding. Contact details are the one kind of invented
information a visitor would *act* on, so:

- `lib/site.ts` holds `CONTACT_EMAIL` (from `NEXT_PUBLIC_CONTACT_EMAIL`), and it
  is the single place that decides.
- With an address, `InquiryForm` composes a `mailto:` — no backend, and nothing
  that can silently drop a message the way an unmonitored endpoint can. **This
  is the swap point for a real endpoint.**
- Without one, it does **not** render inputs that could not be sent anywhere.
  The same fields render as *what to put in a message*, and the action becomes
  Instagram — a real channel, the client's primary one, working today.

> That fallback was wrong twice, the same way. The first version reused the
> form's own ruled underlines and read **exactly like input fields** — a visitor
> would have clicked one and found they could not type. The second stacked the
> terms as a dashed list under its own eyebrow, directly beneath the section's
> eyebrow, so the page showed **two label lines in a row with nothing between
> them**. It is one written line now, carrying its own lead-in word, and field
> hints are dropped: they are instructions for filling in a box, and there is no
> box. Never give a non-field the shape of a field.

### The ground had to stop being homepage-shaped

`components/Ground.tsx` hard-coded its stops as fractions of the homepage. Those
numbers are meaningless on a page of a different length — the sundown landed
mid-paragraph. It is now driven by two rules, both measured:

**1. The light hours advance with distance travelled, not page fraction.**
Ecru to golden is 26 units of red; over `LIGHT_RUN` (6400px) that is about one
unit per 250px, below what the eye reads as change. Scaling to page length
instead would make a short page — contact — dim visibly under the reader,
because the same 26 units would be crossed in a third of the distance. **A long
page is simply a longer afternoon.**

**2. The descent is placed by the DOM.** Each page marks the bottom of its last
light text with `data-descent-from`; the first `[data-tone="dark"]` is the other
edge. The drop is fitted into the gap, which is empty ground and photography by
construction. Pages shorter than a viewport of gap fall back to a brief centred
drop — visible, but bounded, and better than darkening under a paragraph.

`ClosingBand` is what guarantees that gap on every page below the homepage. It
is a last offer of the collection *and* it is load-bearing: full-bleed
photography with nothing written over it, then open ground. **Do not put text
over it, do not open gaps between the panes, and do not trim the runway
padding.** Each one puts the unreadable stretch back under something that has to
be read.

Two smaller findings from the same work:

- The band originally preferred the 11 landscape files and then put them in a
  3/5 portrait pane, which **cropped the object out of its own picture**. Panes
  are 3/4 now, the ratio most of this photography was shot at, and it takes one
  piece per room — in flat catalogue order it came out as four near-identical
  stools, because the first twelve records all are.
- On a phone, `.register-origin` and `.register-dims` shared one grid area.
  **Two elements in one grid area stack in Z, not vertically** — "Maroc" printed
  straight through "Diamètre: 25 cm × 17 cm". They get a line each.

### `--ink-faint` is now `--ink-soft`, and that is the honest answer

`scripts/contrast-scroll.mjs` failed on the category pages: they are long enough
that the ground reaches golden while the label keys are still on screen, and
`--ink-faint` (`#6b635b`) measured **3.79:1** there.

The rule this exposes: **every ink used on light ground must clear 4.5:1 at
golden**, the darkest ground text ever sits on — not merely on morning ecru.
`--ink-soft` was checked against that in §19; `--ink-faint` predates the
scroll-driven ground and never was.

Every value light enough to read as a third step fails at golden. So faint is
now soft, and `--clay-ink` moved `#6d5541 → #6a5240` (it measured 4.49). This
palette has room for **two** ink weights on light ground, not three, and
hierarchy comes from size and tracking — exactly as it already does for the
display face, which ships one weight. The token name is kept so call sites still
say which register they belong to.

### Verified

`contrast-scroll` and `audit` now take a URL: `node scripts/audit.mjs <url>`.

| | |
|---|---|
| Contrast across the whole scroll | PASS on all six new routes, both locales, and the homepage |
| Reduced motion | 0 elements left transparent, every page |
| Horizontal overflow at 390px | clean, every page |
| Focus ring | present on every stop, every page |
| Build | warning-free, 102 static pages (`/contact` is dynamic — it reads `?piece=`) |

### `suppressHydrationWarning` is shallow, and `<body>` needs its own

React reported a hydration mismatch on `<body>`: `cz-shortcut-listen="true"`.
That is ColorZilla — browser extensions write attributes onto `<body>` before
React hydrates (Grammarly adds `data-gr-*`), and the page cannot stop them.

`<html>` already carried `suppressHydrationWarning` for the intro gate, but the
attribute **does not cascade** — it covers the element it is on and not its
descendants. So `<body>` needs its own, and because it is shallow it can only
ever hide attributes written onto `<body>` itself, never a real mismatch inside
the page.

Checked with a clean browser profile across all nine route shapes, both
locales: no hydration warning, no console error, no page error.

### WhatsApp, and a form that actually sends

Two channels beside Instagram on the contact desk, each under its own key —
the same label schema the pieces carry, which is what keeps a functional block
looking like it belongs to a gallery.

**Nothing here is a placeholder.** `NEXT_PUBLIC_WHATSAPP` holds the number as
the client writes it, spacing and all, because that string is what a visitor
reads and only they know how their own number should be grouped;
`whatsappHref()` strips it to digits for wa.me and returns null below eight of
them, so a malformed value renders nothing rather than a link that dead-ends.
Unset, the channel does not appear. A wrong phone number is the single worst
thing this site could publish — it is the one piece of information a visitor
acts on without checking (§5). Arriving from a piece page, the WhatsApp chat
opens on that piece, the same way the form does.

**The form posts to `/api/enquiry`, which hands the message to Resend.** The
mailto is gone: composing a mail in the visitor's own client was the stopgap for
having no backend, and it asked someone who had just typed their message to send
it a second time from somewhere else.

`lib/enquiry.ts` is `import "server-only"` — not decoration. It reads
RESEND_API_KEY, and a key that reaches a client bundle is a key that has been
published; the import turns an accidental import from a client component into a
build error rather than a leak.

Everything that becomes a mail header is decided server-side:

| | |
|---|---|
| **Subject** | From a fixed two-entry map, keyed by `topic`. Never from the request — a caller-supplied subject is a caller-supplied header, which is the classic injection route. |
| **From / To** | Environment only. |
| **Reply-to** | Only if it passes a deliberately conservative pattern that rejects whitespace, newlines, commas and angle brackets. `a@b.com

Bcc: victim@…` is dropped, not forwarded — asserted in the test below. |
| **Body** | Plain text, trimmed, empty fields omitted, capped at 12 fields / 8 000 characters. |

A honeypot field answers **200** when tripped: telling a bot it was caught
teaches whoever wrote it which field to leave alone next time. It is hidden with
the `.sr-only` technique rather than `display: none` — that is the first thing a
form-filling bot checks — and `aria-hidden` keeps screen-reader users out, so
nobody is asked to fill in a field that would discard their message. Verified:
1×1 clipped wrapper, not hit-testable, not reachable by Tab.

The in-memory throttle (5 per 10 minutes) is **a doorstop, not a lock**: it is
per-instance and resets on deploy. It is there because it costs nothing. If this
endpoint is ever actually attacked the answer is a shared store or a WAF rule,
and that should be added when abuse appears rather than assumed to be in place.

### The form always renders, and the failure is the honest part

An earlier version withheld the inputs until the server could actually deliver,
on the reasoning that a form which cannot send is worse than none: the visitor
believes they have written to someone and then hears nothing. **The client's
call was that the page needs its form now and the credentials follow**, and that
is fair — a contact page without one reads as unfinished, and the argument was
never that a form is dangerous, only that a *silent* one is.

So the safety moved from hiding the form to what happens when it fails:

- **Nothing ever claims to have sent.** "Thank you" appears only on a 2xx from
  the route. The 503 it returns while Resend is unconfigured is a real answer,
  and the form treats it as the failure it is.
- **The visitor's text stays on screen.** The fields are untouched by a failed
  submit.
- **The message is handed on.** wa.me takes the body in its query string, so the
  failure panel rebuilds the WhatsApp link carrying the whole of what was just
  typed — name, address, message. What they wrote walks to a channel that works
  instead of being lost.

That last point is why this page is already complete for a house that runs on
WhatsApp, with or without Resend. The fallback is a route, not an apology.

`whatsappDigits()` rather than a finished link is passed to the form for exactly
this reason: the handoff has to build its own link at the moment of failure.

### Send is the one filled element on the site

Everything else is hairlines and space — no fills, no radii, no shadows; a
photograph is hung on a wall, not put in a card. **Send breaks that once, on
purpose.** It is the only commercial action the site actually completes, and as
a text link with a rule under it, it read as one more quiet thing to look at
rather than as the thing to do.

It stays in the palette rather than becoming a generic button: **umber**, the
brand's own dark and the colour the page ground itself arrives at after sundown,
with cream on it at **9.9:1** — the same pair the footer runs on. No radius,
because nothing here has one. The `link` class comes off it, since a hairline
rule under a filled plate is two treatments fighting.

> **This broke the contrast check, and the fix was the check.**
> `scripts/contrast-scroll.mjs` compared every text node against the page
> ground, which is right for a site where nothing paints its own panel — cream
> on umber measured against a light ground reads as a catastrophic failure and
> is in fact 9.9:1. It now walks up for the nearest opaque background and uses
> that.
>
> **The walk stops below `<body>`.** body carries a dark colour as the no-JS
> fallback for the night hours and the fixed `.ground` covers it entirely;
> treating it as "what is painted behind" reported every piece label on the site
> as cream-on-dark and failed all eight pages.

`scripts/test-enquiry.mjs` stands up a stub Resend, points the route at it with
`RESEND_ENDPOINT` (a test seam — never set it in production) and asserts what
actually goes over the wire. 13 checks, all passing. Resend has no sandbox, so
there is no other way to see the payload.

All the variables are documented in `.env.example`.

### The legal pages — transcribed, not written

Six documents plus the FAQ, taken verbatim off the client's live site. Routes:
`/[locale]/legal/{imprint,privacy,cookies,delivery,withdrawal,terms}` and
`/[locale]/faq`, all in both languages. The footer's fine-print row now lists
all six in the client's own order, and the dead `/shipping` link is gone.

**Getting the text required a visible browser.** therootscorner.com is behind
Cloudflare, which answers 403 to curl *and* to headless Chrome. And it was taken
as text rather than through a summariser: this is legal copy, and the whole
point is that it arrives unchanged. Raw captures are kept in
`docs/reference/legal/*.txt` so any line in `lib/legal.ts` can be checked
against the source it came from.

**Nothing was improved in passing.** The source contains a misspelling
("Adress"), a phrase that should read "fair trade", and an unfilled template
bracket in Terms §2 — all reproduced as found. Corrections to a legal notice
come from the client (§13), and a placeholder that is visibly a placeholder is
better than a guess at what belongs in it.

> **Three statements about returns, all published by the client, all
> contradictory.** The Withdrawal Policy says returns are never accepted and all
> sales are final. The Imprint says customers "benefit from the right of
> withdrawal". And the live site publishes a *Withdraw contract* form stating
> contracts may be withdrawn within 14 days. For an EU customer the third is the
> legally operative one. **All three are on the new site exactly as written**,
> because silently harmonising them would be taking a legal position on the
> client's behalf — the one thing §5 forbids most firmly. This is §9 (#2),
> and it is now visible on the pages rather than only in this file.

Delivery times still contradict the same three ways (§9.3), and the delivery
table charges €80 for orders over €200 against €50 for the same worldwide
shipment — ordering more costs more to ship. Both reproduced, both flagged.

**The cookie page describes the old stack.** Jimdo, Stripe, PayPal, Cloudflare,
Google — none of which this build uses. It is transcribed because that is the
client's published policy, but it is the one page here that is *factually wrong
about the site it sits on*, and it has to be rewritten against the real stack
before launch.

### What the imprint gave us

Two things the build had been deliberately leaving switched off because we had
nothing to put there are now sourced, published by the house on its own pages:

- **`therootscornerm@gmail.com`** — the address the Imprint and the Privacy
  Policy both give for code-of-conduct reports and GDPR requests. It is now the
  default for `CONTACT_EMAIL`, so the contact page shows a real address.
- **The registered address** — Rue de la liberté 48, 40000 Marrakech, plus
  ICE 003729558000059 and RC 165659. Exported as `ADDRESS` in `lib/site.ts`.

### Also found while fetching

The live site has pages nobody had mentioned: **`/accueil/`** (a French
homepage), **`/mrirt-rugs/`**, **`/our-airbnb/`** and **`/evenements/`**, plus
the *Withdraw contract* form at `/withdrawal/`. None are in this build. The
Airbnb and the events in particular are parts of the business the brief never
described.

### The pages the brief never described

Fetching the legal text turned up parts of the business nobody had mentioned.
Two are now built, from the client's own text and their own photography, pulled
off the live site the same way (`docs/reference/pages/harvest.json`).

**`/[locale]/stay` — the apartments.** A second business line: two flats near the
medina, let on Airbnb. The two "BOOK YOUR STAY" links are the client's real
listings, taken off their page **with their share tracking intact** — stripping
it would quietly change what their own analytics see. The page says plainly that
booking happens on Airbnb, because a link that hands a visitor to a third party
should say so before it is clicked. Two photographs for two apartments, so
neither is reused to suggest a room that was not photographed.

**`/[locale]/artisans` — the collaboration.** This is the brief's §6, *"images de
matières, artisans, voyages ou lieux"*, which §13 lists as content the client
owes. They had already written it. One paragraph and three place names is all
there is, so the page is short and the photographs carry it.

> **The photographs are not captioned with the places.** The images carry no
> labels on the live site, so pairing a face or a workshop with one of the three
> countries would invent a provenance *for a person*. The places are listed as a
> set; the photographs stand as photographs.

### The client writes French, and it is better than ours

Their `/accueil/` page is written in French by them, not translated. Where they
have written a sentence in a language themselves, their wording wins (§11): the
FR presentation and the apartments now use their words, and "Réserver" is their
button. **The two locales therefore say slightly different things about the
founder, and both are hers** — that is the correct outcome, not a parity bug.

Their `/mrirt-rugs/` page also had three sentences ours did not, now placed:
what the making amounts to, what the wool feels like, and their own invitation
above the form it invites you to fill in.

> **There IS rug photography.** §13 and the whole weaving-comb workaround rest on
> "no rug image anywhere in the 212 files". That was true of the files we had —
> but the client's live Mrirt page carries two, saved to `public/rugs-live/`.
> They are the real thing, from the house's own site. Whoever next touches the
> Mrirt section should decide whether they replace the substitute imagery.

### Still there and still not built

`/accueil/` (their French homepage), `/evenements/`'s "See more", and the
**Withdraw contract** form at `/withdrawal/` — a 14-day withdrawal form, which
is the one piece of the returns contradiction that is legally operative for EU
customers. `/api/enquiry` could serve it.

### The phone header, and the menu as a room

**The bar carries the mark and the way in. Nothing else.** §2 names the crescent
alone as the mobile nav mark, so the wordmark comes off below 940px and the
picto carries it. The language menu and the cart are not dropped — they are
moved into the panel. Four controls in a 390px bar is a toolbar, and this site
should look like a wall before it looks like software.

**The menu is the whole screen.** It was a dropdown under the bar with its own
max-height and scrollbar, which is the shape of a utility panel; a site whose
whole argument is space should answer "where else can I go" with a room.
Links centred in the upper half, the cart and the languages on the floor —
`grid-template-rows: 1fr auto`, because centring the whole block left the links
floating with a screen of nothing under them.

Motion is the page's own gesture rather than a second, louder one for the menu:
the items rise 18px and settle, 55ms apart. The GROUND fades fast (260ms) and
deliberately so — the header keeps its opaque background so Close is legible at
every frame, which means a slow panel fade shows a band where the two meet
until the colours converge. The stagger is the animation anyone actually sees.

> **Two bugs the driving test caught, both invisible to a screenshot.**
>
> **The panel painted over its own Close.** Header and panel share the header's
> stacking context; the panel was positioned with a z-index and the bar was not,
> so the panel won and the menu could not be shut on a phone at all. The bar
> needs `position: relative; z-index: 2` — not a bigger number on the panel.
>
> **`hidden` cannot be transitioned**, so the panel closes with `visibility`
> instead. That is also what takes its links out of the tab order and the
> accessibility tree; `opacity: 0` alone would leave six invisible links in the
> tab order. Verified by tabbing: 0 panel stops reached when closed, 0 stops
> escape the panel when open, Escape closes it and focus returns to the toggle.

Desktop is untouched — nav visible, language and cart in the bar, wordmark
present, toggle hidden, panel never opened.

### The phone hero title is the artwork, not type

Desktop keeps the words. Below 768px the h1 renders the client's own lettering
instead — the footer wordmark with the crescent dropped, via a `crescent` prop
on `Wordmark` rather than a second copy of sixteen paths.

**Dropping the crescent means trimming the viewBox.** Left at `0 0 96.57 132.1`
the lettering would float at the bottom of a box that is 64% empty, and every
layout using it would have to compensate for space that is not there. The
trimmed box is the lettering's own bounds — `0 84.03 96.58 48.08`, almost
exactly 2:1 — measured with `getBBox()` on the rendered paths, not guessed.

The h1 keeps its text and hides it **visually** at that width, so the page still
has a real level-one heading and its accessible name is words rather than a
decorative graphic.

> **No text-contrast script can see a logo.** The title is an SVG now, so
> `contrast-photo.mjs` skips it — it collects text nodes. `scripts/hero-mark-contrast.mjs`
> samples the photograph under the mark's box and measures cream against the
> WORST pixel there, not the average: an average passes happily over a lamp.
>
> At `min(76%, 21rem)` the lettering reached up into the lamp's glow and the
> worst pixel measured **3.15:1** — over the 3:1 large text needs, with nothing
> to spare on a photograph that may be replaced. The plate's ramp is deepest at
> the bottom edge, so a shorter mark sits lower in it: at 68% it measures
> **4.07:1**.

### Still outstanding after this pass

- **`/shipping`, `/terms`, `/privacy`, `/withdrawal` are still 404s** and the
  footer links to them. Deliberately not built: shipping times contradict
  between the product pages and the FAQ (§9.3), and the returns position
  contradicts EU distance-selling law (§9.2). Both need the client's decision,
  and legal copy is the last thing that may be invented.
- **Checkout.** Every buy action is an enquiry link. `PiecePage`'s CTA and
  `InquiryForm` are the two swap points for Shopify.
- **Product names and descriptions are still English on the French pages.** The
  38 translations are the largest remaining content job (§11).
- **`?piece=` makes `/contact` a dynamic route.** Fine on Vercel; if it must be
  static, move the prefill into the client component behind `useSearchParams`.

---

## 22. The hero composition, and two bugs it exposed

The hero now follows balmoralrunning.com's arrangement: full-bleed photograph,
headline bottom-left, caption and its action sharing a line beneath it, the
collection note set opposite bottom-right, header across the top.

### The scrim stays, and the reference is not a counter-example

The reference's own hero **does not pass contrast** — its white paragraph over a
pale garage door is genuinely hard to read. It works as fashion editorial by
spending legibility. That is a real trade, not a technique to copy.

I tried to avoid the scrim honestly: scored all 212 photographs for cream text
in both corners, found six that clear unaided, and rebuilt the hero on the best
of them. **The rendered check then failed it at 1.63:1** — my offline model of
the crop was wrong, and the frame that looked dark in analysis renders as
mid-tone wood.

> Model the crop offline to shortlist candidates. Never trust it as the verdict.
> `scripts/contrast-photo.mjs` against the running page is the only oracle.

### Two bugs, both invisible until measured

**Content just below the fold never revealed.** `Reveal` fires when an element's
top passes `vh × 0.88`. The hero note sat at 795px against a 792px line: three
pixels short, so it needed a scroll to appear — and by then it had left the
screen. It rendered at `opacity: 0` on every load. Before the visitor scrolls,
anything already on screen now reveals regardless of the trigger.

**The contrast checker did not look at the header.** It scoped to `.hero`
descendants, so a transparent header putting ink nav straight onto the dark
carved door passed every test while being plainly unreadable in a screenshot.
It now checks `.site-header` too, because over a full-bleed hero the thing
behind the nav *is* the photograph.

### Why the header is frosted rather than transparent

This frame is dark carved door on the left and pale plaster on the right. No
single nav colour survives it: ink vanishes into the door, cream vanishes into
the plaster (1.32:1). Frosted at `rgba(247,245,242,.82)` the photograph still
reads through, the bar has no hard edge, and ink clears **10.16:1** at worst
across the whole width. It drops to transparent only once scrolled, where what
sits beneath is no longer guaranteed.

All measured, both widths: headline 6.47 / 6.70, tagline 9.07 / 5.74, cue
9.94 / 6.54, note 5.14 / 5.07, nav 10.16–13.15.

---

## 23. Choosing the hero photograph

The room shot was replaced. It was shot wide open — the background is entirely
out of focus — and it ranked **45th of 212** for detail at a full-bleed crop.
Under a scrim heavy enough to carry text it read as brown murk.

### How the replacement was chosen

1. **Rank by detail.** A Laplacian-edge measure over every frame at its actual
   16:9 crop, which also reports how much of the source the crop keeps.
2. **Shortlist by eye.** Twelve crops rendered exactly as the hero would crop
   them. Numbers cannot tell you which object is worth looking at.
3. **Audition against the renderer** — `scripts/hero-audition.mjs` swaps each
   candidate into the live page and measures every hero and header text box
   against the pixels actually behind it.

`hand-carved-tribal-stool-wood-08` won on headroom: **1.86 / 1.64** margin
against the next best 1.33. It is also a landscape original, so the full-bleed
crop keeps **94%** of the frame rather than the ~45% typical of the portraits.

### The point of picking on headroom

More headroom means **less scrim**. The gradient dropped from `.94` to `.76` at
the bottom and from `.68` to `.46` through the middle, so the wood keeps its
grain and warmth instead of flattening to brown. The frame is the argument, not
the shadow over it.

Measured after the change: headline 5.28 / 5.27, tagline 8.16 / 7.29, cue
6.94 / 7.49, note 5.04 / 5.29, nav 12.20–14.07.

> **No frame in the collection carries this text unscrimmed.** All ten
> candidates were auditioned with the scrim off and all ten failed, most at
> ~1.0:1. That is a property of the photography — pale plaster backgrounds,
> shot light — not of any one image. A scrim is required until there is a
> photograph made for this job.

### Why the offline model is not trusted

Modelling the crop in Python predicted 5.98:1 for a candidate the browser
rendered at 1.63:1 — a frame that looked dark in analysis renders as mid-tone
wood. **Shortlist offline, decide in the renderer.** `hero-audition.mjs` exists
for exactly that.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

## 25. The footer — a composition, not a left column

> **Numbering note:** two sessions have been appending to this file, so 22 and
> 23 each appear twice. 25 is the next unused number, not the next in sequence.

The brief asks for a *"very simple"* footer and §15 records why: an early
four-column version with a newsletter voice was rejected as the shape of a large
retailer. So this stays **three bands** — the house, the ways in, the fine
print. What was wrong was never the amount. It was the composition.

### What was actually broken

| | |
|---|---|
| **Half the width was empty** | Mark, name and tagline all stacked into the left column; the full-width rule under them drew attention to the void rather than reading as space. |
| **The crescent floated** | It sat *beside* the name, bottom-aligned to the tagline, so it had no relationship to anything. |
| **No sense of place** | Nothing said where the house is — on a site whose whole proposition is that one person finds these pieces. |
| **Instagram was sixth in the nav row** | The brand's main traffic source (§1), styled as though it were another page of the site. |

### The fixes

**The crescent goes above the name**, which is the order of the brand's own
lockup (§2), and it is now the largest thing in the footer on purpose: the page
travels from morning to night, and the mark is a crescent, so at the end it
reads as the moon over the room. Nothing is redrawn — only scaled.

**Every band now has a left and a right.** Mark bottom-left; tagline and
`Marrakech, Maroc` squared off against the right edge; nav left / Instagram
right; © left / legal right.

> `justify-self: end` is doing real work on the right-hand block. The row sets
> `justify-items: start`, so the block shrinks to its content and lands at the
> **start** of the second column — floating mid-page instead of answering the
> mark across from it. That was the first attempt, and it looked like a bug.

**`t.footer.place` is the base of the house**, from §1 — deliberately *not*
"sourced in Marrakech". The client's own copy says pieces are found "in Morocco
and beyond", and narrowing that would be an invented provenance (§5).

### Tap targets

The links are 0.7rem label type, which gives a **16px** tap target on the
priority device. `padding-block: 0.35rem` takes the hit area to **27.2px**, and
a matching **negative margin** gives the layout its 16px back, so the footer is
pixel-identical and only the touch area changes.

> Compensating with the row gap instead does not work, and both directions
> fail: adding to the gap grew the phone footer 45px, and absorbing the padding
> into it fixed the phone but left the **single-row desktop nav** 12px taller,
> because a single row has no row gap to take it out of. The negative margin is
> the only version that holds at both widths.

Measured by `scripts/shoot-footer.mjs`, which reports height, smallest tap
target, and the worst link/text contrast against the night ground rather than
only taking a picture: **27.2px · 13.36:1 links · 8.58:1 text**.

### The phone footer is centred

Below 860px there is no second column to answer the first, so every band that
reads as a left-and-right composition on a wide screen reads as a ragged left
edge on a phone. `@media (max-width: 859px)` centres the lockup, the tagline,
the place line, both link rows, the channels and the fine print. Desktop is
untouched — the two media queries are mutually exclusive, so nothing in the
phone block can reach the 860px composition.

Three things centring alone does not fix:

- **The lockup is a block-level SVG at its own width.** `justify-items: center`
  centres the grid *item*; the box still needs `margin-inline: auto`.
- **`max-width` without auto margins** pins the tagline's measure to the left
  edge, so centred text sits off-centre inside its own box.
- **The legal separators are rendered leading** — each item is `· LABEL`. On one
  desktop line that is invisible; wrapped over four centred phone lines it puts
  a dot at the START of three of them and reads as a broken bulleted list. They
  are hidden below 860px, where the gap already separates the links, and kept on
  desktop where the row does not wrap.

Measured by `scripts/shoot-footer.mjs`: **27.2px smallest tap · 13.94:1 links ·
8.96:1 text · 0px overflow**.

### Four of its links 404

`shipping`, `terms`, `privacy`, `withdrawal` have no page yet; `collection`,
`mrirt`, `story` and `contact` now resolve. The information architecture is
right and the links should stay — but the legal three cannot be written here.
§9 (#2) records that the returns position contradicts EU distance-selling law
and needs legal input, and inventing that copy is exactly what §5 forbids.


## 26. Selling, not cataloguing — and where the sun goes down now

The client's direction, in their words: *"needs a reshape of the design, we need
to sell there, no need to tell them measures and all that stuff."*

That reverses §9's museum-label decision on the grids, and it is right for the
job. The label schema came out of the scrollcraft gallery grammar and it is
still correct on a piece page — someone deciding whether a stool fits a hallway
genuinely needs the dimensions. On a grid nobody is measuring anything; they are
deciding whether they want the thing. Carrying material / origin / dimensions
into every tile turned each one into a catalogue entry, which is the impression
the brief bans.

So `PieceLabel` gained a third variant, `sell`: name and price, no schema, and
no rule above the price — a rule above a price is a receipt. The homepage hang
and the shop grid both use it. `plate` and `wall` are unchanged and still carry
the full schema on piece pages.

### The shop section

New, and not in the brief. Everything above it curates — three pieces hung at
different heights, a statement, seven doorways — and none of it tells a visitor
they can buy something today. `shopSelection()` in lib/catalog.ts round-robins
the categories so eight tiles never come out as eight variations of one stool,
and priced pieces lead within each category, because a tile with no price cannot
be sold from the grid.

The grid is deliberately plain: four across, every tile the same size and shape.
The composition elsewhere is what says gallery; repeating it here would say
gallery again, when what is needed at that point in the page is *these are for
sale.*

### Seven doorways, two rows

Seven categories into a four-column grid leaves a quarter of the second row
empty. The grid is twelve columns now: the first row takes four cards at three
columns each, the second takes three at four columns each. Those three also go
**square** rather than 3:4 — a card a third wider at the same ratio stands a
third taller, and the two rows would come out uneven. At phone width the last
card takes the full width and goes landscape for the same reason.

The row split keys off `.doorways-{n}`, set from `cats.length`. Any other count
falls back to four across.

### The story is a line between two cities

The overlapping-photographs version was rejected as "slop AI", and fairly: the
overlap is a device borrowed from elsewhere and it reads as one. The section is
one fact — she left Paris and stayed in Marrakech — so the structure states it.
The two place names sit at either end of a rule spanning the full page width,
with a single filled mark at the Marrakech end because that is where she
stopped. One wide interior photograph below it, full bleed.

That mark is the only decoration in the section. Do not add a second.

### Where the sundown happens now — READ BEFORE MOVING ANY SECTION

§19's rule was that the descent must not cross text. The rule is now stronger,
and simpler: **the descent happens where no ground is visible at all.**

The matter wall is full bleed, gapless, and more than one and a half viewports
tall (eight frames, four across, two courses). While it holds the screen the
ground cannot be seen, so the colour change is not merely unreadable-safe — it
is unwatchable.

The window is fitted between two markers:

- `[data-descent-from]` — a zero-height `.matter-mark` div at the **exact top of
  the wall**. Not on the Instagram section: the gap between the two would show
  the first quarter of the descent on open ground.
- `[data-tone="dark"]` — `.matter-said`, the words **below** the wall.

`scripts/descent-cover.mjs` proves the invariant, and should be run after any
change to the section order or to the wall's height:

```
desktop 1440x900   wall 1408px (1.56 viewports)
  descent window 7896 → 8404      wall covers 7896 → 8404      HIDDEN
mobile  390x844    wall 1350px (1.60 viewports)
  descent window 8887 → 9393      wall covers 8887 → 9393      HIDDEN
```

Shorten the wall below about 1.5 viewports, or put a section between the wall
and `.matter-said`, and the sundown comes out from behind it.

Everything after the wall stays at night: matter's own words, the letter, the
footer. The page dims once and stays dimmed, rather than dimming, lifting for a
section, and dimming again.

### Night is flat, and dusk is gone from the ground

The descent used to stop at **dusk `#3e2a1d`** and then creep to night across
whatever page was left, so every section below the wall sat on a mid-brown. The
client read it as maroon and they were right: it is the worst colour in the
ramp — the warmth has drained out of the clay and the depth has not yet
arrived, so it looks like neither.

`DESCENT` now lands on **`#2c1e16`**, the last colour, inside the wall where the
change cannot be seen, and `NIGHT` is a single flat value rather than a ramp.
Measured: golden at the top of the wall, then `rgb(44,30,22)` at matter's words,
the letter, the footer and the foot of the page — one tone, no slide.

`--hour-dusk` survives only as a token. **Nothing paints the ground with it.**

### The letter replaced the invitation

The "Venez regarder vraiment" panel read well and asked for nothing a visitor
could act on. A rare piece is gone once it is gone, so the useful offer at the
foot of the page is a way to hear about the next one first.

The field is a rule, not a box. Nothing else on this site is a boxed control and
adding one here would import a form aesthetic from somewhere else.

`app/api/subscribe/route.ts` is the swap point, in the same spirit as
lib/catalog.ts. With `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ADMIN_TOKEN` set it
creates a marketing-consented customer; without them it appends to
`.data/subscribers.ndjson`. **That file store is real in development and lost on
a serverless host** — the Shopify path must be configured before launch. The
route answers in codes, never in prose, so both locales' copy stays in
lib/dictionaries.ts.

### The channels

`SOCIAL` in lib/site.ts, same rule as `CONTACT_EMAIL`: Instagram is sourced and
present; Facebook, Pinterest and TikTok appear only when
`NEXT_PUBLIC_FACEBOOK` / `_PINTEREST` / `_TIKTOK` are set to real URLs. A
visitor who clicks an icon leading to a page the client does not run is worse
served than one who never sees it.

### The footer lockup is the client's artwork now

The footer used to place the crescent above "The Roots Corner" typeset in
Marcellus. Close, but the wrong letterforms — and a logo reassembled out of a
different typeface every time it is drawn is not a logo. It uses `Wordmark`, the
Illustrator export, whole. Still nothing redrawn (§2); only placed and scaled.

**Open with the client:** they asked to "redesign that logo as well". This
change redesigns the *lockup* — how the mark sits on the page. The mark itself
is their registered artwork and §2 forbids redrawing it, so altering the glyph
needs their explicit instruction, and `components/Intro.tsx` animates that exact
path and would have to be re-derived with `scripts/centerline.mjs`.


## 27. Instagram frames cannot be fetched — a manifest instead

The client asked for the good photographs on their Instagram to be pulled in.
They cannot be. What was tried, so nobody spends the hour again:

| attempt | result |
|---|---|
| `GET instagram.com/therootscorner.m/` with a browser UA | **200, but the login wall** — no `og:image`, no post media, 17 login markers in the HTML |
| `GET /api/v1/users/web_profile_info/?username=…` with `X-IG-App-ID` | **429** |
| `GET /therootscorner.m/?__a=1&__d=dis` | **201, empty body** — the endpoint is dead |
| `cdninstagram.com` URLs in the returned HTML | 683 of them, every one `static.cdninstagram.com/rsrc.php/…` — Instagram's own login-page sprites, not photographs |

Those were all **`curl`**, and that was the mistake: the profile is rendered by
script, so a bare HTTP client has nothing to run. **`scripts/ig-fetch.mjs`** does
it with real Chrome instead — the public grid is in the DOM even when a "log in"
modal is drawn over it, and the page's own JSON responses are captured on the
way past for the larger candidates. Logged out, no credentials, the client's own
public account.

```
node scripts/ig-fetch.mjs therootscorner.m 12
```

It writes `public/instagram/01.jpg…` and fills `docs/instagram.json`. If it finds
nothing it saves `scripts/.ig-debug.png` so the next person can see what the
browser actually got rather than guessing.

Alt text that looks auto-generated — *"Photo by…"*, *"May be an image of…"* — is
dropped rather than shipped. That is Instagram's captioner, not a description of
the piece, and §5 applies.

### So the section reads a manifest

- **`public/instagram/`** holds the files; its README says how to get them.
- **`docs/instagram.json`** lists them: `file`, optional `alt`, optional
  `permalink`.
- **`lib/instagram.ts`** reads it. **An empty manifest is a supported state**,
  not a broken one — the section falls back to the handle set large, which is
  exactly what it was before. Six frames fill the row; more are ignored.

`alt` is optional and must be **omitted rather than guessed** (§5). A tile
without one is decorative, and the heading carries the meaning.

> The client's own **"Download your information"** export returns the
> originals, not the compressed CDN derivatives — the same quality problem §13
> records for the product photography. Prefer it over saving from the app.

### The grid is deliberately not the matter wall

Square, six across, **3px gutter** — the Instagram grid's own gutter, which is
what makes the strip read as a feed rather than as another gallery row. Not
full-bleed and not gapless: the matter wall two sections below is exactly that,
and two edge-to-edge gapless bands that close together start to rhyme.

Verified with six real frames temporarily in place, then removed: 6 across on
desktop, 3 × 2 on phone. `descent-cover.mjs` and `contrast-scroll.mjs` both
still pass with the grid rendered, so the extra section height does not move the
sundown out from behind the wall.

### If it should ever be live

The **Instagram Graph API** (Business or Creator account) returns `media_url`,
`caption` and `permalink` against a long-lived refreshable token. It would
populate the same shape, so `instagramFrames()` is the only thing that changes.
The Basic Display API is not the route — it was retired.

**Do not add a third-party embed widget.** It injects an external script, cannot
be styled to this page, and hands the client's traffic to someone else.


## 28. Grain, and a feed that moves sideways

### Grain

Every piece here is old, worn and hand-made, and the photographs were clean
digital files — the one place the site felt newer than its subject. `.frame::after`
and `.hero-media::after` lay a fine grain over them.

Generated, not an asset: an SVG `feTurbulence` tile as a data URI, so there is
no request and it stays sharp at any pixel density. **Tiled at a fixed size**
(180px in frames, 260px on the hero) rather than stretched — stretching
turbulence blurs it into mush.

`mix-blend-mode: overlay`, which blends both ways, so the grain lifts highlights
as well as dirtying shadows. `multiply`, or a flat veil, would only darken — and
§18 is explicit that nothing may be laid over a piece photograph to make it
darker. This adds texture without changing exposure. Frames carry `--grain:
0.13`; the hero is lighter at 0.09 and coarser, because a tile that reads as
texture on a 300px frame reads as noise at full screen.

Measured cost: about 0.1–0.3 of a contrast point. Not the cause of anything.

### Instagram is a strip now

The centred version — eyebrow, very large handle, caption, stacked down the
middle — was a poster, not a feed, and nothing else on the page is centred, so
for one screen it read as a different site.

Now: handle left at display scale, the line and the follow action squared off
right, and the frames run **off the right edge of the screen and keep going**. A
feed is something you push sideways. The cut edge is honest — there really is
more, one tap away. Square with a 3px gutter, which is the Instagram grid's own
gutter, but horizontal, so it cannot rhyme with the matter wall two sections
below.

The strip is `overflow-x: auto` inside `max-width: 100%`, so it never makes the
*page* scroll sideways — `audit.mjs` confirms `scrollWidth 390 vs 390`.

### The footer is soft black, not brown

Asked for twice, and the second ask was right: `#2c1e16` is `rgb(44,30,22)` —
**22 units of red over blue**, which reads as chocolate at full-screen size
however dark it is. `--hour-night` is now `#1f1d1b`, a spread of **4**: warm
enough not to be a cold grey, neutral enough that nobody calls it brown, and
still nowhere near the pure `#000` the brief bans.

`Ground.tsx` must stay in step — its `DESCENT` last stop and `NIGHT` are both
`[31, 29, 27]`, and the no-script fallback paints `--hour-night`.

### Two real defects the grain work uncovered

**The hero was failing contrast, and had been for a while.** `contrast-photo.mjs`
had not been run since the section rebuild. Four failures, the worst at
**1.26:1**. The cause was `--ink-inverse-soft` on `.hero-note` and
`.hero-tagline`: a legitimate second text weight *on the page ground*, where it
is measured against one known colour, but over a photograph there is no second
weight available — there is only readable. Both are full `--ink-inverse` now,
and the plate's mid-band stops went up a little (0.52 → 0.60 at 46%, 0.28 → 0.36
at 66%).

**`.hero-note` is hidden below 940px.** Stacked, it rides up to where the ramp is
thin and the plaster comes through, and it cannot be fixed with more shadow
without killing the photograph — which §22 established the first time this
paragraph was put on the hero. The presentation section says the same thing a
screen and a half later.

Now: every hero and header string passes at both widths, worst margin 3.16 / 3.

> **The Next dev badge was a false failure, for the second time.**
> `next dev` paints a fixed badge bottom-left. At phone width it lands on the
> hero cue, and because these scripts report the WORST pixel behind a text box
> they read the badge as the background — **1.06:1 for text that is perfectly
> legible**. `contrast-photo.mjs` and `hero-audition.mjs` now remove
> `nextjs-portal` before measuring. Any new script that samples rendered pixels
> must do the same.


## 29. The sundown is gone, and the Instagram photographs arrived

### Only the footer is dark now

The client asked twice for the brown out of the footer, then asked for the two
sections above it — matter's words and the letter — to be light "like the rest
of the website".

Follow that through and the whole descent has nothing left to do. If the footer
is the only dark block, it can simply paint itself, and its top edge is a
**structural** edge you expect to meet rather than a gradient boundary sliding
up the screen — which was §19's entire objection to gradients in the first
place.

So `components/Ground.tsx` now does the light hours and stops: ecru at the top,
golden at the foot, no night. Deleted with it:

- `DESCENT`, `NIGHT`, `descentWindow()` and the `ResizeObserver` that kept the
  DOM markers honest
- every `[data-descent-from]` marker (homepage, `ClosingBand`, `/story`)
- `scripts/descent-cover.mjs`
- `.closing`'s **384px runway** — that padding existed only so the drop had
  somewhere unreadable to happen, and it was on every page below the homepage
- the `@media (scripting: none)` fallback, since the footer's background is now
  unconditional

And with them goes the whole class of bug where reordering a section moved the
drop under a paragraph. `[data-tone="dark"]` stays on the footer because
`Header.tsx` reads it; Ground no longer looks at it.

> Two checkers had to learn this. `contrast-scroll.mjs` and `shoot-footer.mjs`
> both measured footer text against `.ground` and reported **1.2:1** for cream
> that is actually on `#1f1d1b`. The first now skips `.site-footer`; the second
> reads the footer's own computed background. Measured after: **13.94:1** links,
> **8.96:1** text, 27.2px tap targets.

### The Instagram photographs, and what they are worth

`scripts/ig-fetch.mjs` returned **12 frames at 512×640**. Sorted:

| | |
|---|---|
| Interiors — pieces in a real room | 01 (dining room), 07 (lit alcove at night) |
| Pieces on the studio wall | 03, 04, 06, 09, 10 |
| Branded posts with type baked in | 02 (جذور), 05, 08, 11 |

The two interiors are the first photographs this project has ever had of the
collection **standing in a house**, which is what the brief's section 6 asks
for and what §13 lists as owed. They were too good to spend at 200px in a
strip, so `lib/instagram.ts` exports `SCENE_FILES` and `instagramFrames()`
excludes them — one list, no photograph appearing twice on a page.

> **512×640 is the hard limit, and it decided the layout.** The first version ran
> the dining room full bleed at 1440 and it was a 2.8× upscale: the plaster went
> to mush. Both scenes are now held to about their native width — the
> presentation plate at 23rem, the matter room at 28rem. The full-bleed slots go
> to the 1200×1800 catalogue macros, which can take it. If the client ever sends
> originals, these two are the first things to swap.

The strip is 4:5, not square. Square is the profile grid's shape, but these
files are 4:5, so cropping threw away a fifth of every frame — and on the posts
that carry a caption it cut the caption in half, which reads as a bug.

### Matière — the room, and nothing else

Eight frames in a uniform four-by-two grid was a contact sheet: nothing in it
was big enough to look at and nothing led. It had that shape for a structural
reason — it was tall and gapless so the sundown could hide behind it — and that
reason no longer exists.

It went to four, then to one. The band of three macro crops that survived the
first cut was still a strip of fragments: at a third of the width each, hard
cropped, they read as swatches rather than as objects. Cut on the client’s
instruction, and the section is better for it — the words, and one whole room
where these pieces live.

> Worth raising with the client: the heading is *“Les marques font la
> pièce”* and there is now no close-up of a mark in the section. Either the
> copy moves toward the room, or one large high-resolution detail comes back —
> one, at size, not three fragments.

### Less space, bigger pictures, everywhere else

The client's words: *"reduce that more space and big pictures."*

| | before | after |
|---|---|---|
| `--section-y` | `clamp(3.5rem, 7vw, 7rem)` | `clamp(2.8rem, 5vw, 5rem)` |
| `.page-head` top padding | header + `clamp(3.5rem, 11vw, 8rem)` | header + `clamp(1.6rem, 4.5vw, 3.2rem)` |
| `.closing` bottom padding | `clamp(14rem, 26vw, 24rem)` | `clamp(2rem, 4vw, 3.2rem)` |
| Collection rooms | 4 across | **3 across** (one line — `.doorways` is a 12-column grid) |
| Closing band | 4 panes | **3 panes** |
| `.piece-plate img` cap | `76svh` | **`88svh`** |
| `.room-rail` margin-top | `clamp(4rem, 10vw, 8rem)` | `clamp(2.4rem, 5vw, 4rem)` |

The principle behind the section-rhythm change, since it is the one that could
drift back: **space only reads as generosity when there is something for it to
be around.** At 7rem top and bottom, two adjacent sections put 224px of empty
ground between a photograph and the next heading, and that reads as a gap.

Page heights after, desktop: collection 6699 · a room 8873 · a piece 7550 ·
story 7415 · Mrirt 4258 · contact 2997.

### Presentation has a photograph now

It was type on open ground with the right half of the row empty at every width,
and the one thing it could not do was show what any of this is *for*. The lit
alcove sits in column two, spanning the statement and the prose. The grid rows
are explicit — auto-placement put the prose in the plate's column and pushed the
plate onto a fourth row of its own.


## 30. The collection page — cards, and the end of the register

### The register is gone

§24 built `/collection` as two halves: a grid of seven room photographs, then
the **register** — all 38 pieces as one numbered list carrying the same six
fields, read down the page like an archive.

It was the better idea about collections and the wrong one about selling. The
uniform schema did something no grid can: it made the gaps in the client's data
**visible** rather than papered over — sixteen rows with no dimension, stated
plainly. But you cannot see what you are being offered in a list, and this page
has to sell. The client asked for cards. They are right, and this is the same
reversal §26 recorded for the labels.

`components/Register.tsx` is deleted, along with its CSS and the accession
number, origin and dimension columns it carried. Nothing else used it.

> The data gaps did not stop existing. `node scripts/coverage.mjs` still reports
> them, and the piece page still shows the full schema. What went away is the
> page that *displayed* the gaps to a shopper, which was never that page's job.

### The rooms became navigation

Seven large photographs at the top made a visitor choose a room before they had
seen a single piece — a whole screen spent on a menu. The photographs still do
that work on the homepage, where a visitor genuinely does not know what is here.

Here the rooms narrow something already in front of you, so they are set as what
they are: names and counts on one line, with the current one marked
`aria-current="page"` and stated rather than styled into a button.

### The cards

Three across, not four. At four the photograph on a 1440 screen is about 300px,
which is a thumbnail; at three it is 400 and the object is legible. Two on a
phone.

`components/PieceCard.tsx` — photograph (4:5, with the hover swap), room
overline, name, price. **No border, no shadow, no radius**: the site has none of
those anywhere, and a card that announces itself as a card is the big-retail
look the brief bans. It is a photograph with a label under it.

Two details that are load-bearing:

- **`collectionOrder()`** interleaves the rooms. Source order is the scrape's,
  grouped by category, so the grid opened with **twelve consecutive stools** and
  the first screen said "this shop sells stools". Round-robining means the first
  row is a stool, an African piece and an object — and it also makes the room
  overline informative instead of twelve identical lines. Rooms keep their own
  internal order, so this is stable across builds, not a shuffle.
- **`.card-said .wall-label-name` has a `min-height`** — three lines on a phone,
  two above 640px. Without it the prices step up and down across a row and the
  grid stops reading as rows. The phone value is larger because at two columns
  the names wrap further: *"Handmade Pottery Vase Made in Morocco"* takes three.

**Sold is designed for, not handled.** Stock is one of everything, so it is
frequent: `.card.is-gone` strikes the price and the state is stated, while the
photograph keeps its full strength — the piece is still worth looking at. No
piece in the current scrape is unavailable, so this cannot be seen live until
Shopify is wired.

### And the closing band came off this page

The grid shows all 38, so a band of four more was a second sighting of pieces
already on the screen. It was only still there because it used to carry the
sundown (§29), and there is no sundown.

### `next.config.ts` needs `images.qualities` now

Next 16 rejects any `quality` an app uses that is not declared. `[75, 90]` — 75
is the default, 90 is for the two Instagram interiors, which at 512×640 are the
smallest files on the site and can least afford re-compression.


## 31. Four across, one grid, and a shelf

### The cards got smaller, and a room uses the same ones

Three across put the photograph at about 400px on a 1440 screen, which turned
out to be more than the object needs: at 38 pieces the page ran to ten thousand
pixels and you could not get a sense of the collection without a long scroll.
Four is ~300px — still large enough to read the object, and a whole row more on
screen at once. Three at 640–1100, two below.

A room used to be its own layout: two across, staggered, with the full wall
label under each — a hang. That was right when `/collection` was a register and
a room was the only place the pieces could be seen. Both pages are the shop now,
so **a room renders the same `.cards` grid**, and a visitor moving between them
meets the same object at the same size instead of a different layout for the
same job. The room drops the overline, since you are already in the room.

What stays particular to a room is the rail of other rooms below it: walking out
of one should put you in the corridor, not back at the front door.

### The closing band is the hang — the same as "Continue looking"

It has been three things now. Gapless full-bleed panes, which existed only to
hide the sundown (§29). Then a shelf: objects bottom-aligned on one continuous
rule, at three sizes. The client looked at both and asked for the composition
already used on the piece page under *"Continuer à regarder"* — the **hang**:
three works at three different heights, name and price beneath.

That is the right call independent of taste. On a piece page a visitor meets
"here are three more" **twice** — once as "Continue looking", once as the closing
band — and meeting it in two different layouts reads as two different sites.
There is now exactly one way this site says it, and both call sites use it. The
CSS for the closing band is four rules, because `.hang` in sections.css already
*is* the design.

`piece-more` also switched from the full wall label to `sell`. The schema
belongs on a piece page, which is where that visitor already is — repeating
material and dimensions under three thumbnails turns them back into catalogue
entries (§26). `ClosingBand` therefore takes a `labels` prop; all four call
sites pass `t.pieceLabel`.

> **The shelf is worth remembering even though it is gone.** Three abutting
> captions with a `border-top` and **no column gap** join into one continuous
> rule; put the gap between the columns instead and it comes out dashed. If a
> ledger line is ever wanted again, that is how to draw it.

> **Turbopack went stale again during this change** and served the old shelf
> markup against the new stylesheet — unequal widths, no captions, no rule. It
> looked exactly like a CSS bug and cost a screenshot cycle. When a section
> renders as a mixture of two designs, restart `next dev` before debugging
> anything.

### The old shelf

It was three gapless panes of full-bleed photography, hard cropped to a common
3/4. That shape was load-bearing, not chosen — it carried the sundown, so it
could have no gaps and nothing written over it. With the sundown gone (§29),
three identical crops in a row is just a smaller version of the grid the visitor
has already scrolled through.

**Everywhere else on this site, photographs hang** — the homepage trio, the
room, the matter wall. Here the pieces are put **down**: bottom-aligned on one
rule running the width of the page, at three unequal sizes, largest in the
middle so the row has a centre rather than a direction. That is what *"encore
là"* looks like, and it is the one composition the site did not already have.

It works because every photograph in this collection is of an object standing on
a surface near the foot of the frame, so a shared baseline genuinely lines the
objects up rather than aligning three rectangles. The frames carry **no
aspect-ratio and no cover** — each keeps its own proportion, which is what makes
three sizes read as three objects instead of three crops.

> **The shelf has no column gap, and that is the whole trick.** The rule is
> drawn as the top border of each column's caption; three abutting segments join
> into one continuous line. Put the gap between the columns and the shelf comes
> out dashed, which reads as a mistake rather than as a shelf. The columns are
> held apart by padding *inside* them, with the outer edges unpadded so the line
> spans the full content width.

On a phone the third piece stands down and the shelf is two: a shelf with a gap
in it is a broken shelf, and wrapping the third onto its own row would put one
there.

---

## 32. The Mrirt page — and why space is a content problem

The page was built on a premise that no longer holds: *there is no photograph of
a Mrirt rug, so show the instrument instead.* Three frames from the client's own
site have since arrived (`docs/site-images.json`, source `therootscorner.com`).

| | ratio | what it is for |
|---|---|---|
| `mrirt-rug.jpg` 1800×3200 | 9/16 | The rug, with the weaving comb lying on the wool |
| `mrirt-pile-trim.jpg` 784×784 | 1/1 | Macro of the pile — the proof of "generous thickness" |
| `mrirt-room.jpg` 1206×1889 | ~0.638 | The only frame that carries **scale** |

### The rule this page produced

The first rebuild gave each tall photograph its own column beside a short block
of text — four times. Every pairing left **several hundred pixels of empty
ground** beside the text, and the page read as mostly air.

> **A tall photograph cannot be balanced against a short paragraph by adding
> space. Only by adding content.** Load the column until it reaches the bottom
> of the frame, or make the frame shorter. Spacing tweaks just move the hole.

What that produced, in three sections instead of four:

1. **The rug, bleeding off the left edge**, against a *stack*: the wall label →
   the four terms, ruled → a detail of the pile. One label alone left ~500px.
2. **The wool and the weavers** — text only, and short on purpose, so the page
   has one place to breathe that is not an accident of a tall frame.
3. **The room, bleeding off the right edge, against the form.** These were two
   half-empty sections: a photograph whose whole job is scale, and a form whose
   first question is size. Together they fill each other.

Merging (3) took a whole section and ~1000px out of the page: **5543 → 4574px**.
Alternating which edge the photographs escape from is what keeps two full-bleed
frames from reading as a template.

### Three traps, all hit

**`max-height` silently breaks a bleed.** With `aspect-ratio` set, a
`max-height` shrinks the *width* to match — so the frame stops reaching the
viewport edge and the bleed quietly disappears. Shorten a bleeding frame by
changing its **ratio** at the breakpoint, never by capping its height.

**Two short texts and one image cannot be balanced two-across.** Whichever
column lacks the image ends hundreds of pixels short. Both passages now stack in
one column with the comb answering the pair.

**The frames are cropped here, unlike the homepage.** 4/5 for the rug (the
native 9/16 runs past 1100px at this width and reopens the void); 1/1 for the
room at desktop, **bottom-anchored**, because the rug is in the bottom sixth of
that photograph and the height has to come off the top.

### What did not change

The label is the site's own schema (§14) and every value comes from the client's
Mrirt copy. **There is no dimensions row** — a rug that does not exist yet has
no dimensions, and the schema omits a field rather than inventing one (§5). The
comb is demoted, not deleted: it is the weaver's tool beside the passage about
the weavers, and it also appears *inside* the hero photograph.

`mrirt-pile-trim.jpg` exists because the original bakes an **8px border into the
JPEG** — measured, not guessed — which reads as a hard frame against the ecru
ground. The trimmed copy is a separate file: never overwrite a client source in
place.

> The form is short **today** only because no contact address has been supplied,
> so it falls back to the Instagram line. Once there is one the same column
> carries seven fields, which is why section 3 is proportioned for the tall
> version rather than tuned to the short one.

### The shelf of finished rugs

The client wants to sell ready-made rugs alongside the made-to-order ones. That
is a second product line, so it reads from the catalogue like any other room —
`readyRugs()` returns `category: "rugs"`. **It is empty, and that is not a bug:**
there is no rug in the 38-product scrape, and inventing stock is the one form of
invention a shop actually punishes a visitor for. Add entries to
`docs/catalog.json` with `category: "rugs"` and the shelf, the cards, the piece
pages and the collection room all appear on their own.

Until then the shelf shows `WOVEN_RUGS` — the rugs the client has actually
photographed — as **woven work, not priced stock**: no price, no dimensions, no
stock state, no piece page, because none of those is known. Each card leads to
the enquiry, which is how a dealer with unpriced one-offs really sells. The page
lede follows the shelf too: *"nothing here is in stock"* becomes false the day
one is, so it swaps to `ledeStocked`.

`scripts/preview-rugs.mjs inject|restore` proves the real-stock path renders by
injecting throwaway entries and putting the catalogue back **verified by hash** —
a half-restored catalogue is a far worse bug than the one it is checking. Never
leave a tree with `inject` applied.

> **Two cards, not three.** `mrirt-room.jpg` was the obvious third and it is not
> usable: its rug sits in the bottom sixth of the frame, so every card crop of it
> is a photograph of a floor. `rug-fire-card.jpg` exists for the same reason — a
> centred 4/5 crop of `interior-fire.jpg` lands on the fireplace and the rug
> stops being the subject, so it is cropped bottom-anchored.

> **The caramel pile is a different rug from the cream hero.** It used to sit in
> section 1 captioned as a detail *of that rug*, which the composition made
> read as one object. It is now its own card, where being its own rug is the
> point — and section 1's plate went square to keep the column balanced without
> it.

### Checks

`scripts/shoot-page.mjs <locale>/<path> <out> [phone]` captures whole viewports
(never `fullPage`, never stitched — §19) and reports overflow, unrevealed
elements and missing alt text. Both locales, both widths: **0px overflow, 0
unrevealed, 0 missing alt**. `contrast-scroll.mjs` passes on `/fr/mrirt` and
`/en/mrirt` — re-run it after any change here, because section heights move
every downstream scroll percentage and the ground's stops are tuned to those.

> **Git Bash rewrites a bare `/fr/mrirt` argument into a Windows path** before
> node sees it. `shoot-page.mjs` takes `fr/mrirt` and adds the slash itself.


## 33. Our Story, refined — and a 21,211px regression

### The page was broken and nobody had looked

`/story` reused the homepage's `.matter-wall` for its closing section. When
matière was rebuilt (§30) that CSS went with it — and this page still rendered
the markup. With no grid, no height and no aspect-ratio, eight photographs came
out at natural size, stacked full width. **The page was 21,211px.**

Nothing failed. It served 200, contrast passed, the audit passed. A page can be
completely broken and clear every check the project owns, because none of them
measure whether a layout still makes sense — which is the argument for looking
at a page after changing shared CSS, not just after changing the page.

> **Rule: shared section CSS is not free to delete.** `grep` for the class name
> across `app/` before removing a block. `.matter-wall`, `.matter-frame` and
> `.matter-pane` were only ever referenced by two files and one of them was
> missed.

### What the page is now

4,542px desktop, 6,040px mobile.

1. **The plate** — unchanged.
2. **The hinge.** Paris and Marrakech at either end of a rule spanning the page,
   with a filled mark at the Marrakech end because that is where she stopped.
   Her sentence at display scale on the left, a Marrakech interior on the right.
   The homepage states this route in passing; here it opens the page, and the
   photograph beside it is the arrival.
3. **The room** — `interior-fire.jpg` full bleed at 74vh, the only thing on the
   screen.
4. **The founder** — the empty portrait plate and what is known.
5. **What the collection is for** — the client's own mission line, against the
   evening alcove.
6. **The closing hang** — the page had no closing band at all before.

The middle used to be one large product photograph. The interiors replace it:
a story about moving to Marrakech is about rooms, and these are the first
photographs the project has had that can carry it.

### The portrait plate stays empty, and is now the right size

It is still a labelled empty frame — a still life standing in silently for a
person is a small lie the page would tell every visitor, and the client owes a
portrait (§13). Two changes: the hatched fill is gone (at that size the texture
read as a broken image rather than as a reserved space — a hairline and a label
say it better), and it is 22rem rather than a full column.

> **A percentage width inside an `auto` grid track collapses.** The plate was
> `width: min(100%, 18rem)` in a `grid-template-columns: auto …` track, so its
> 100% resolved against a width the track was still deriving *from the plate* —
> and it came out at about 130px, the width of its own caption. The track states
> the width now (`22rem 40rem`), and the plate fills it. That pairing also puts
> the section at ~1070 of the 1264 available at 1440, instead of stopping two
> thirds across and leaving the rest as an accident.


## 34. Our Story as chapters — and what the old site still had on it

### The old site was never fully mined

`therootscorner.com` was scraped for products and for a handful of About lines,
and three sentences on it had been missed. Re-read on the client's prompt:

| where | sentence | now |
|---|---|---|
| `/about-us/` | *"To share a world of meaningful objects and create a lasting appreciation for pieces that carry history, purpose, and character."* | `storyPage.purpose` — the intent chapter |
| `/` | *"Curated artisanal pieces for warm and authentic interiors."* | unused — a tagline, and the brand already has one |
| `/` | *"Our apartments offer a quieter side of Marrakech…"* | **not used — see below** |

The About sentence is the only place the client says **why** any of this exists
rather than what it is. There is exactly one of it, which is what earns it a
whole screen and the largest type on the page.

> The French is a translation, not authorship (§11). `purpose` → *"utilité"*:
> these are objects that were made to be used, which is what the English means
> here. `raison d'être` would have been a different claim.

> ### ⚠️ The client also rents apartments
>
> The old homepage carries: *"Our apartments offer a quieter side of Marrakech.
> Thoughtfully designed and carefully curated, each space combines comfort,
> simplicity and character to create a stay that feels authentic and
> effortless."*
>
> **Nothing in the brief, the portfolio or the commercial proposal mentions
> this.** It is a second business — accommodation — and it may well explain
> where the interior photographs come from. It is deliberately NOT on the new
> site: putting it there would be a scoping decision, not a design one. Raise it
> with the client before the next pass.

The contact page has no address on it, only a form — so `CONTACT_EMAIL` is still
owed (§24). The FAQ confirms both contradictions §9 records, in the client's own
words: **3–8 weeks** for Europe against **1–2 weeks** on the product pages, and
*"All sales are therefore considered final"* against the EU's 14-day withdrawal
right.

### The page is chapters now

The portrait frame is gone at the client's instruction. It was there to keep an
owed asset visible rather than let a still life stand in silently; that debt is
recorded in §13 and in the page's own docblock now, not printed on the page.

Seven movements: the route · a room · the intent · the place · the founder ·
a room · the hands · what it is for · the closing hang. 7,255px desktop.

Every chapter's copy is sourced. **The place chapter has no paragraph on
purpose** — anything written about Marrakech would be invented (§5), so it is a
title card: the city at chapter scale and its coordinates, which are true.

Photographs alternate sides (`.chapter-inner-flip`) because five chapters in one
column reads as a template, and every plate is the same 24rem: a plate that
changed width between chapters would read as an accident.

> **`interior-table.jpg` and Instagram's `01.jpg` are the same dining room.**
> The site's own file is 1036px against 516, so where a scene exists in both
> sets the site's copy wins. The founder chapter then took `04.jpg` — the sepia
> stool detail, the one intimate frame in the set — because a fourth wide
> interior beside a chapter about a person reads as more of the same house.

### The motion, and why it is heavier here

The client asked for cinematic. It is spent on two things only, both one-shot,
neither tied to scroll position:

- **The rule draws itself**, left to right, over 1600ms, and the mark lands at
  the Marrakech end 1620ms in. This is the one animation on the site that
  carries meaning rather than decorating: the thing being drawn is the journey
  the page is about. The quote is delayed 900ms so the sentence is the arrival.
- **`.cine`** — full-bleed rooms settle from `scale(1.08)` over 2800ms against
  the site's standard `1.03` / 1500ms. At full screen the standard settle is
  invisible; this is slow enough to register as a held shot rather than a load.

Both are transitions on the class `Reveal` already adds, so
`prefers-reduced-motion` switches everything off in one block — verified, 0
elements left transparent.


## 35. The header — the letter moves right, the name changes face, the language opens

### The Arabic-inspired letter sits above the name

It sat before the name on one line, then briefly after it, and it is now
**above** it — the order of the client's own artwork (§2) and the same lockup
the footer uses.

Stacking costs height, so both parts pay for it: the picto 2.05rem → **1.5rem**,
the name 0.92rem → **0.72rem** with tracking opened 0.2em → 0.26em, because at
the smaller size the name has to hold its own width under the mark. Measured:
the lockup is **40px** inside an 80px bar, so `--header-h` is untouched.

> `text-indent: 0.26em` on the name is not a nudge. Letter-spacing adds a
> trailing space after the final letter, which shifts a centred line left of the
> mark above it by half the tracking. The indent gives it back.

**The intro needed no change at all.** `Intro.tsx` FLIPs the written crescent
onto `[data-mark-target]` and measures that box **live**, so moving *and
resizing* the mark is a markup change and nothing else. Verified after both:
`dx 0, dy 0, scaleErr 0`, write coverage 101.33%, veil gone, scroll unlocked.

### The name is set in Jost now

§15 moved this to Marcellus because a 0.7rem letterspaced grotesque read as
system chrome. **The diagnosis was right and the cure was wrong: the problem was
the size, not the face.** The client's own logo sets "ROOTS" in a geometric
sans, and Jost was chosen for this project precisely because it echoes the
circular construction of that wordmark (§12). So the header now uses the
letterforms the brand itself uses — 0.92rem, uppercase, 0.2em tracking, which is
how the artwork sets it.

### The language is a menu

A single "EN" link only reads as a control if you already know what it does — it
states the destination and not the choice. The header now shows the **current**
language with a caret, and opens a named list: *Français*, *English*.

Endonyms, not translations: a French speaker scans for "Français", not for
"French". The list is identical in both dictionaries, which is why `LANGS` lives
in `Header.tsx` rather than in `lib/dictionaries.ts`. Closes on outside click,
on Escape (returning focus to the toggle), and on choosing.

> ### ⚠️ `[hidden]` loses to any author `display`
>
> `[hidden] { display: none }` is a **UA** rule, so
> `.site-lang-menu { display: grid }` beats it on specificity. The menu was
> therefore permanently open and its links permanently in the tab order.
>
> `scripts/audit.mjs` is what caught it — a tab stop on "Français" with the menu
> closed. The fix is one rule, `.site-lang-menu[hidden] { display: none }`, and
> **anything in these stylesheets given a `display` and toggled with `hidden`
> needs the same line.** `.site-panel` is safe only because it never declares
> one.

> ### Turbopack served a stale CSS bundle across a full restart
>
> The `[hidden]` fix was in the file and absent from the served chunk **after
> stopping and restarting the server**. Restarting is not always enough: the
> `.next` cache survives it. Stop the server, `rm -rf .next`, then start —
> in that order, because deleting it under a running server produces 500s.


> ### The dev server was being reaped mid-check
>
> Backgrounded `next dev` kept dying part-way through a Playwright run, which
> looked like a crash and was not — the log ends cleanly every time. Starting it
> **inside the same Bash invocation as the check** fixes it:
>
> ```
> (npx next dev -p 3111 > /dev/null 2>&1 &) ; \
>   until curl -s -o /dev/null http://localhost:3111/fr; do sleep 1; done ; \
>   node scripts/intro-frames.mjs
> ```


## 36. The piece page — a gallery, and why the space was there

### The space was a units bug, not a taste one

The photograph column was `58fr`. Everything in this collection is portrait, so
a 500px image sat in a 760px column and the label ended up **~615px** from the
work it describes. The page looked airy because it was mis-measured: a fraction
of the viewport is the wrong unit for a column whose content is a fixed shape.

Both columns are sized in **rems** now — `34rem` stage, `28rem` label. Measured
from the photograph's own edge to the label column: **123px**.

> 34rem, not 38. The stage is 640px tall and a typical 0.67 frame draws 429px
> wide inside it; at 38rem that left ~90px of ground on each side before the gap
> even started — the same complaint one order smaller.

### There was no gallery at all

The other photographs were stacked in a column under the lead. You could not
tell how many existed or move between them; you could only scroll and hope.

`components/PieceGallery.tsx` — a stage with a contact-sheet rail:

- **The stage has a fixed height and every photograph is `contain`ed in it.**
  That is the whole mechanism. Ratios here run **0.56 to 1.50**, so sizing the
  stage to the image would move the label on every click. The stage holds still;
  the photograph sits in it at whatever shape it was shot, so the no-cropping
  rule (§24) survives a gallery.
- **All images render and crossfade** rather than swapping `src`. There are at
  most nine, they are the point of the page, and a dissolve is the gesture this
  site already uses for a second view of a piece (§20). Swapping `src` flashes.
- **The rail is a contact sheet, not a row of chips.** Every thumbnail keeps its
  own proportion at a common height, so the strip is ragged top and bottom the
  way a sheet of contacts is — and it tells you something true about the set
  before you click it.
- Arrow keys move through the set while focus is inside the rail. The counter
  reads `05 / 08`.

> The active thumbnail is marked with an **inset box-shadow, not a border**. A
> border changes the box and shifts every thumbnail after it by a pixel each
> time the selection moves.

### Two duplications the rewrite exposed

The page printed the name twice and the price twice. `PieceLabel variant="plate"`
renders name, schema and price, and the page also renders its own `h1` and its
own price beside the enquiry action. The old CSS hid the label's copies with
overrides on `.piece-label-column` — a rule that works exactly as long as nobody
rewrites that block, which is what happened.

New `variant="specs"`: the schema only. It says in the markup what was being
said in a stylesheet.

> Its container class is **`.wall-label-schema`**, not `.wall-label-specs` —
> that name is already the `<dl>` inside every label, and reusing it handed the
> container the list's own layout.

> ### The dev server was being reaped, and a subshell did not help
>
> `(npx next dev &)` from Bash still died part-way through Playwright runs.
> What works is launching it fully detached from PowerShell:
>
> ```
> Start-Process cmd.exe -ArgumentList "/c npx next dev -p 3111 > log 2>&1" -WindowStyle Hidden
> ```


### The plate is centred, because the photograph cannot get any wider

Left-aligned at 1890 the block put **700px of nothing on the right**, which is
what the client saw. Widening the columns does not fix it: the stage is capped
in `svh` and this collection is portrait, so a typical frame draws about 430px
wide **however wide its column is**. The block has a natural width of ~1090px
and no more — the only question is where the leftover goes.

So `.piece-inner` and `.piece-words` are capped at `68rem` and centred.
Measured: 176px a side at 1440, 401px a side at 1890 — balanced instead of
piled on one edge.

Since width cannot make the picture bigger, height is the only lever a large
screen has: the stage went from `min(72svh, 40rem)` to `min(76svh, 44rem)`.

The words now sit under a hairline rule with real air above it — the plate ends,
the reading begins.


## 37. The shop works — cart, checkout, and one seam for Shopify

Everything a buyer touches is finished. The only thing missing is a payment
processor, and it plugs into exactly one function.

| | |
|---|---|
| `lib/cart.ts` | State, storage, totals |
| `components/CartProvider.tsx` | Shared client state |
| `components/CartButton.tsx` | The handle in the header |
| `components/CartPanel.tsx` | The panel |
| `components/AddToCart.tsx` | The buy action |
| `app/[locale]/checkout/` + `CheckoutOrder.tsx` | The review step |
| **`lib/checkout.ts`** | **The seam** |

### The cart is a set of slugs, and that is a design decision

Stock is **one of everything**. So the cart is a set, not a list of line items
with quantities, and **there is no quantity stepper anywhere in this UI** —
building one would be a control for a state the inventory cannot produce. Adding
a piece twice is a no-op, not an increment. Once a piece is in the cart its
button stops being an action and becomes a statement plus a way back.

Only slugs are stored. Name, price and availability resolve from the catalogue
on every render, so a cart left open overnight cannot show a stale price or
offer something that has sold. `cartLines()` silently drops anything now
unavailable — keeping a dead line would let someone reach payment with an object
nobody can ship.

> `ready` is false until the provider has read `localStorage`. The server cannot
> see storage, so rendering a count before then is a guaranteed hydration
> mismatch. Every consumer shows the empty state until then — one frame, and a
> whole class of bug gone.

### There are no card fields on this site, and there never will be

Shopify's checkout is **hosted**. The correct integration creates a cart through
the Storefront API, gets a `checkoutUrl`, and sends the buyer to Shopify's own
domain, which takes the address, calculates shipping and handles payment under
its own PCI compliance.

So `/checkout` collects **nothing**. It is a review step that shows the order
back, says where the money is taken, and hands over. Building a card form here
would either be a lie (it goes nowhere) or a liability (it doesn't).

Until a processor is connected the page **says so before the button is pressed
as well as after**, and offers the channel that works today — the order composed
as a message. Someone who has chosen a piece should not have to click to
discover the shop cannot take their money yet.

### To switch payment on

1. Set `NEXT_PUBLIC_SHOPIFY_DOMAIN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`.
2. Give every piece its Shopify variant ID — `docs/catalog.json` gains a
   `variantId`, or `lib/catalog.ts` maps slug → variant.
3. Write `createShopifyCheckout()` in `lib/checkout.ts` against `cartCreate`.
   The sketch is in the file.

Nothing else in the app changes. `paymentReady()` flips and the notice
disappears on its own.

### Two details worth keeping

**The filled button is the only one on the site.** Everything else is a rule
that draws itself, which is right for navigation — but this is the moment a
visit becomes a purchase and it has to look like the thing you press. It is the
brand's own umber, not an accent from outside the palette.

**Pieces the client never priced cannot be sold from the site**, so they keep
the enquiry they always had. Nothing invents a price to make a button work (§5).

> ### The overflow audit learned two more exemptions
>
> `position: fixed` elements are out of flow relative to the viewport and cannot
> contribute to the document's `scrollWidth` — the cart panel parks off-screen
> right at `translateX(100%)` and was being reported as a phone overflow bug.
> The scroller exemption also had to stop checking the element against itself.

> ### Two dev servers can race for the port
>
> A restart that fires while the old process is still shutting down leaves the
> **old** server holding 3111 and the new one dead on `EADDRINUSE` — so the site
> serves a build without the files you just wrote, and `/fr/checkout` came back
> as a 500 that looked like a code error. Kill every PID on the port, wait, then
> start one, and check the listener count is exactly one.


## 38. The header is the name alone

The client asked for the crescent out of the bar: the Latin name only, at every
width. One lockup now, one line, Jost at 0.86rem with 0.26em tracking.

> §2 records the crescent as *"the favicon, the loading mark, and the mobile
> header."* Two of those three still hold — it is still the favicon and still
> the mark the intro writes, and it is still in the footer as part of the
> client's own artwork. The third was their call.

**The intro lost its destination.** It used to FLIP the written crescent onto
the header picto — same SVG, same viewBox, so matching centre and width landed
them exactly and no cross-fade was needed. With nothing to land on, the mark
settles and fades as the veil lifts. Still one element; there is never a moment
with two crescents on screen.

`morph()` keeps the FLIP branch: give any header mark `data-mark-target` and it
picks it up again with no other change. It takes the first target with a
non-zero box, so a lockup that only appears at one breakpoint works too.

> A short-lived version put the client's whole `Wordmark` in the phone bar. It
> needed the bar at **6.75rem** to be legible — the artwork is a tall stacked
> block whose name lives in the bottom 45%, and at 80px it came out 30px wide
> with "ROOTS" about four pixels tall. Recorded because it is the constraint
> anyone reaching for that file in a header will hit.

### Two checker bugs, both the same shape

**`visibility: hidden` keeps its geometry.** The nav panel closes with
`visibility` rather than `display` or the `hidden` attribute, because neither of
those can be transitioned — so its links still report a real box while being
invisible and out of the tab order. `contrast-photo.mjs` and
`hero-audition.mjs` measured them against the hero photograph and reported
**four confident failures for text nobody can see**. Both now skip anything at
`visibility: hidden` or `opacity: 0`, which `contrast-scroll.mjs` has always
done.

> I first "fixed" this by adding `.site-panel[hidden] { display: none }` — the
> right rule for the language menu, the wrong diagnosis here, because the panel
> never carries that attribute. Reverted. **Check how a thing is actually hidden
> before adding a rule for how you assume it is.**

**The desktop hero headline drifted to 2.93:1** against a 3.0 floor once the
grain went on — the worst-pixel check catches the grain's bright specks. The
plate's mid-band went 0.60 → 0.66 at 46%, which buys the margin back without
touching the wood's grain lower down. All hero and header text clears again.

## 39. The logo is the client's artwork — the name alone, at every width

§38 replaced the header lockup with "The Roots Corner" set in Jost. Close to the
logo's letterforms, but not them — and **a logo reassembled out of a typeface
every time it is drawn is not a logo.** The bar now carries the client's own
Illustrator export: `Wordmark crescent={false}`, whose viewBox is trimmed to the
lettering's own bounds. Nothing redrawn, only placed and scaled (§2).

**No crescent, at any width.** It went to the desktop bar mid-session and the
client asked for it out again, so the phone rule became the rule. It remains the
favicon, the mark the intro writes, and half the footer lockup.

### Why it is not the stacked artwork

The file stacks the crescent above the name. Rendered that way and sized so the
name is *readable*, it made a **153px header** — a fifth of a laptop screen of
chrome on a site whose argument is that the pieces are the stars. Measured:

| | bar height | "ROOTS" |
|---|---|---|
| Stacked, fitting the 80px bar | 80px | ~8px tall — illegible |
| Stacked, name legible | **153px** | legible |
| Crescent beside the name | 80px | legible |
| **Name alone** (shipped) | **80px** | legible |

The lockup is a tall block whose name lives in its **bottom ~45%**, so height is
the wrong lever — it spends almost all of it on the crescent. §38 hit this same
wall from the other side putting the full `Wordmark` in the phone bar.

> **Size the lockup by WIDTH, not height.** The name spans the full width of the
> box, so width decides legibility and height follows. The first attempt set
> `height: 3.4rem` and got a 40px-wide mark.

`--header-h` stays at **5rem**. A desktop override was tried and reverted — it
is a token precisely because every page's top padding, sticky offset and
`scroll-margin` follow it, so raising it moves eight pages.

### The intro has no FLIP target, by design

With no crescent in the bar, `morph()` finds no `[data-mark-target]` and the
written mark settles and fades as the veil lifts — §38's behaviour, unchanged.
Verified: write coverage 102.37%, mark fades to `opacity 0`, veil gone, scroll
unlocked. The FLIP branch is kept: give a header mark `data-mark-target` and it
resumes with no other change.

> **Renaming a header class means grepping `scripts/` too.** `intro-frames.mjs`
> held a stale `.site-header-name` and then an unconditional
> `[data-mark-target]`, and **crashed on a null element** both times. It now
> queries the target defensively and reports "no target — settle-and-fade"
> rather than dying.

### `scripts/header-mark-contrast.mjs` — because no text checker can see a logo

The header mark is an SVG, and `contrast-photo.mjs` and `contrast-scroll.mjs`
both collect **text nodes** — so the bar's logo passed every existing check by
being invisible to all of them. This is §38's `hero-mark-contrast.mjs` argument
applied to the header.

It hides the mark, photographs what was behind it, and scores the mark's colour
against the **worst** pixel there, not the average — an average passes happily
over a lamp. Floor is 3:1 (WCAG 1.4.11, non-text contrast). Measured:
**desktop 4.93:1 · phone 11.44:1**.

### Verified

`intro-frames` · `contrast-photo` (all hero and header text, both widths) ·
`header-mark-contrast` · `audit` on `/fr`, `/en`, `/fr/collection`, `/fr/story`
— 0 unrevealed under reduced motion, 0px phone overflow, focus ring on every
stop. Build warning-free.

> **Note for macOS:** every script here defaults `CHROME_PATH` to a **Windows**
> Chrome path. On a Mac, export it:
> `CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`.

## 40. The header's colour glitch — three bugs, one symptom

Reported as: the bar goes brown when you click the logo to come back from
another page, the page loads dark then snaps light, and it stays wrong until you
scroll a little. Three separate causes, all measured.

### 1. `body` was still painting night

```css
body { background: var(--hour-night); }   /* rgb(31,29,27) */
```

That was the no-JS fallback from when the ground fell all the way to night. §29
removed the descent — `Ground.tsx` now starts at ecru and stops at golden, and
only the footer is dark — so the dark body stopped being a fallback and became a
**flash**. `.ground` is a client component and paints at hydration, **measured
at ~613ms on a cold start**; until then the whole viewport was night.

Now `--hour-morning` (`#f7f5f2`), which is exactly `Ground`'s first stop
`[247, 245, 242]`. Nothing to snap from, on the slowest connection or with
scripting off. Verified: `body` reads `rgb(247,245,242)` from the first frame.

> **A fallback colour has to track whatever it is a fallback FOR.** This one
> outlived its reason by two sections of this document.

### 2. `scroll-behavior: smooth` was animating navigation

It sat on `html` unconditionally, so it applied to *every* scroll the browser
performs — including the jump to the top on a route change. Clicking the logo
from the foot of a long page did not go to the new page: it **flew** there, a
measured **~1.2s** of animated travel back through the old page, with the header
re-reading every section streaming past and changing tone the whole way.

It is now behind `html[data-anchor]`, which `Header.tsx` stamps for the length
of an in-page anchor click and clears after 1200ms. The three real anchors
(`#main`, `#selection`, `#demander`) still glide — verified, 25 distinct scroll
positions eased 0 → 820 — and navigation is instant.

> `scroll-behavior` must sit on the **scrolling element**. Putting it on
> `:target` does nothing at all; that was the first attempt.

> This is the same rule §19 records biting the measuring scripts, which all
> have to pass `behavior: "instant"`. The site had the identical bug in
> production and nobody had connected the two.

### 3. The bar *travelled* to the new page's tone instead of arriving at it

`.site-header` carries `transition: background-color 700ms`. That is right while
scrolling — the tone should follow the room, not snap — and wrong across a
navigation, where it means the new page **inherits the old page's colour and
spends most of a second fading out of it.** Coming back from a footer that fills
half the screen with brown, that fade *is* the flash.

`Header.tsx` sets `.is-repainting` (which is `transition: none !important`) for
90ms across a route change, then releases it. Ordinary scrolling animates
exactly as before.

### And the measure effect never re-ran

`useEffect(..., [])`. The sections it measures belong to the *page*, and a route
change replaces them wholesale — but nothing re-measured, and no scroll event
fires on a navigation, so the bar kept the last page's state until the visitor
nudged it. That is the "you need to scroll a little to correct it".

It is `[pathname]` now, plus a double-`rAF` and a 250ms re-measure for
late-arriving images that change section heights.

### Measured, before and after

| | before | after |
|---|---|---|
| body on load | `rgb(31,29,27)` for ~613ms | `rgb(247,245,242)` from frame 1 |
| scroll on nav | animated 5649 → 0 over ~1.2s | jumps in one step |
| header on arrival | faded 0.94 → 0 over ~600ms | correct on the first frame |

### `is-dark` is currently unreachable

Worth knowing before anyone debugs it. `[data-tone="dark"]` exists only on the
footer, and on every page the footer's top sits **below the maximum scroll
position** — `/story` ends at 6355 with the footer starting at 6786. So it never
crosses the header's 40px measuring line and `.is-dark` never applies. Measured
0 dark frames on every page. The code is kept because the footer could grow or a
dark section could return, but do not assume it is exercised.

### Two more checkers crashed on stale selectors

`intro-guards.mjs` assumed `.intro` and `[data-mark-target]` were present and
died on a null element — the third instance of this exact failure in two
sessions (§39). Both are queried defensively now.

Its **no-JS branch had never worked**: it called `page.evaluate` with scripting
disabled, which cannot run, and hung until the 30s navigation timeout. It reads
CDP layout metrics instead — the honest question there is whether the page
renders and scrolls, not what the DOM says. Now reports
`PASS — page renders and scrolls`.

### Verified

`audit` on six routes · `contrast-scroll` on `/fr`, `/fr/collection`,
`/fr/story` · `contrast-photo` · `header-mark-contrast` · `intro-frames` ·
`intro-guards` (all five scenarios, exit 0) · build warning-free.

## 41. The doorways on a phone — a directory, not a grid of tiles

The first attempt at this was a spacing fix: stack the name over the count so
the name gets the full column width. It stopped the wrapping and it was still
the wrong answer, because **the grid itself was the problem.**

### Why the grid had to go

Two columns of ~145px cards is the shape of a shop's category tiles — the
catalogue presentation the brief bans — and at that size neither half of a card
can do its job. The photograph is too small to show what a Tamegroute glaze
looks like; the name is too narrow to hold, so four of the seven French labels
broke mid-phrase. *"Tabourets & sièges"* split its own ampersand onto line two.

The count made it worse twice over: sharing the name's row it ate ~30px of the
width that **caused** the wrap, and `align-items: baseline` then pinned it to the
FIRST line, so beside a two-line name it floated halfway up and the two columns
came out at different heights.

**This section is not merchandise. It is an index** — seven ways in, with a
count each — and the strongest form for an index on a narrow screen is a list
you read down.

### The design

Each doorway is a full-width band:

```
┌──────┐
│      │  01   Tabourets & sièges
│ img  │       12 PIÈCES
└──────┘
──────────────────────────────────
```

| | |
|---|---|
| **The plate** | 3.4rem wide at **2:3** — the ratio most of this photography was actually shot at, so the crop takes nothing off the object. Deliberately small: it is a keyed swatch telling you what is behind the door, not the door. |
| **The numeral** | The room's position in the directory, in clay, tabular. |
| **The name** | 1.28rem with the whole width to itself. Six of seven set on one line in French, **all seven** in English. |
| **The count** | Directly under the name, at its left edge. |
| **The rule** | One hairline per band — the same one the register and the rails use. |

The section falls from **1407px to 877px**, and the tap target goes from 104px
where it was a card's whole height to 104px of band — unchanged, but now the
whole width is hittable rather than half of it.

> **The words are centred against the plate, not stretched across it.** The
> first version made name and count rows one and two of a grid as tall as the
> photograph, which stranded the count at the bottom of the band with a hole
> between it and the name it belongs to. `.doorway-said` is a wrapper holding
> them as one block; the plate sets the height and the block sits in the middle
> of it.
>
> On desktop that wrapper is **`display: contents`**, so it vanishes from the
> box tree and name and count remain direct grid items of `.doorway-link` —
> which is what lets the markup change without touching the desktop layout.

### Two decisions worth keeping

**The count says its noun on a phone, and does not on desktop.** In a card the
numeral sits tight against the name and reads unambiguously as a quantity. In
the directory it stands on its own line, where "12" could be a price, a year or
a room number. Both strings are rendered and **CSS picks one** — the server
cannot know the viewport, and a JS swap would flash. The dictionaries already
carried `category.count` / `countOne`, so the singular is right: *Lumière* holds
exactly one piece.

**Numbering categories is safe where numbering objects was not.** §24 refused
accession-style numbers on the register because a number beside an antique
object reads as an age, an edition size or a provenance mark — invented
provenance by implication. These number the seven **categories of the site's own
navigation**. A number beside a category is a list position and nothing else.
It is `aria-hidden`, since the list order carries no meaning for a screen reader.

### Desktop is provably untouched

The phone block is `@media (max-width: 699px)`; the desktop grid starts at
`700px`. Measured after every change: section height **1241px**, twelve-column
track, all seven names on one line at 24px, index `display: none`, counts
rendering as bare numerals — identical to before.

### Verified

| | 390px | 320px |
|---|---|---|
| Names wrapping, FR | 1 of 7 (was 4) | 1 of 7 |
| Names wrapping, EN | **0 of 7** | 1 of 7 |
| Horizontal overflow | 0px | 0px |

`audit` on `/fr` and `/en` · `contrast-scroll` PASS on both · build
warning-free.

## 42. The rooms on a phone — the covers, not the names

Same report as §41, different component: the **collection page**'s rooms rail,
not the homepage's doorways. They share an eyebrow — *"Par où commencer"* —
which is why they read as one thing, but §30 made them deliberately different.

This took two passes, and the first one is the lesson.

### Pass one fixed the symptom

`.rooms-rail` is a wrapping flex row: right at desktop width, where eight short
names and their counts sit on one line. At 390px it wraps onto four, and every
line ends wherever the next name happens not to fit — so the right edge is
ragged and each line trails dead ground. *"Céramiques de Tamegroute"* is wider
than half the screen and takes a line to itself.

Setting it as a vertical list, one room per line with a leader rule to its
count, fixed the raggedness. It was tidy and it was still **eight rows of pure
text, a whole screen deep, before a visitor reaches a single object.**

> **Arranging text better does not stop it being text.** If the complaint is
> "too much text", the answer is usually not a better text layout.

### Pass two: the rooms become their own photographs

`categories()` has always returned a `cover` per room — the homepage uses those
same images — and the rail was the one place that threw it away. This page is
the shop; what someone wants here is to see what is in a room, not to read its
name.

So below 700px the rooms are a band of covers you push sideways: 3:4 frames at
34vw, name and count beneath, bleeding off the right edge. **218px instead of
418.** The cut last cell is honest — there really is more, one push away.

The gesture is the site's own: `.instagram-strip` is the same construction, so
this reads as something the site already does rather than a new component.

| | |
|---|---|
| Rail (≥700px) | unchanged — one line, 59px |
| List (pass one) | 418px, 8 rows of text |
| **Strip (shipped)** | **218px, 8 covers** |

### Three real bugs, all caught by measuring

**The leading gutter has to be a margin on the first cell, not padding on the
scroller.** `padding-inline-start` on a flex scroller is laid out once and then
scrolled past: the strip opened with its first cover flush to the screen edge
instead of aligned to the eyebrow above it — `firstCellLeft: 0` against the
text's `20`. A margin belongs to the cell and travels with it.
`scroll-padding-left` keeps snapping honest about it.

**"Toute la collection" was missing.** The strip rendered only `rooms`, so the
way back to everything vanished on the phone. It leads the strip now, as it
leads the rail — set as words on ground at a cover's exact footprint, because it
has no cover and **borrowing a piece's photograph to stand for "all of it" would
make one object speak for thirty-eight.**

> ### ⚠️ The a11y bug this pattern always has
>
> The strip is `aria-hidden` — every cell duplicates a rail link, and offering
> both would double every room in the tab order for a gesture neither a keyboard
> nor a screen reader can use. Two things then went wrong, and a tab-through
> found both:
>
> **A scroll container is keyboard-focusable by default**, so the browser can
> scroll it with the arrow keys. Correct in general; inside an `aria-hidden`
> subtree it is a tab stop leading into hidden content, which is exactly what
> WCAG forbids. `tabIndex={-1}`.
>
> **The rail was `display: none`,** which removed it from the accessibility tree
> as well as the layout — so a phone visitor on a screen reader had **no way to
> reach the rooms at all.** It is visually hidden (the `.sr-only` technique) and
> still in the tree.
>
> Measured after: **0** tab stops inside the strip, **7** in the rail, 8 links
> in the tree.

### Desktop and the cards are untouched

The client's instruction was that the cards are good as they are. This block
only ever addresses `.rooms-rail` and `.rooms-strip`.

| width | strip | rail visible | cards |
|---|---|---|---|
| 1440 | — | yes | 4 across |
| **700** | — | yes | 3 across |
| **699** | 358px | no (in tree) | 3 across |
| 390 | 218px | no (in tree) | 2 across |
| 320 | 186px | no (in tree) | 2 across |

Desktop downloads **none** of the cover images: they are rendered at every
viewport and hidden in CSS rather than branched in JS — the server cannot know
the width and a post-hydration swap would flash — but `sizes` resolves to
`(min-width: 700px) 0px`, so next/image fetches nothing. Verified: 7 images
loaded at 390px, **0 at 1440**.

### Verified

`audit` on `/fr/collection`, `/en/collection`, `/fr/collection/stools` and
`/en/collection/vases` — 0 unrevealed, 0px overflow at every width tested ·
`contrast-scroll` PASS both locales · build warning-free.

## 43. The strip looks through itself, once — after the words have landed

The strip bleeds off the right edge so its last cell is visibly cut — which is
how it says *there is more, one push away* without an arrow. That reads if you
are looking at it, and it does not if the covers were below the fold when you
arrived. So the first time the strip is seen it drifts sideways on its own,
holds, and eases back: **0 → 281 → hold → 0**, about 3.2s.

At the far point the visible rooms are *Pièces africaines · Objets · Pots &
contenants* — rooms that are not on screen at rest. It shows you the collection
rather than telling you to swipe.

`components/RoomsStrip.tsx`. A client wrapper around the same markup; the cells
are still server-rendered.

### The sequencing bug, and why it was invisible in a screenshot

The strip **was not wrapped in a reveal at all**, so it sat at full opacity from
37ms while everything around it settled. Measured:

| | before |
|---|---|
| eyebrow *begins* fading in | 1557ms |
| **strip starts moving** | **2228ms** |
| eyebrow finally readable | 2379ms |

It moved **151ms before its own heading could be read**, and 671ms after that
heading had merely started to appear. Two animations arguing, not one gesture —
and no still frame can show it.

The strip now carries `.reveal` with the same 120ms stagger the rail beside it
uses, and the drift waits `revealDelay + 1100 + 420` — its own stagger, the
full `--dur-reveal`, and a settle:

| | after |
|---|---|
| eyebrow readable | 2263ms |
| strip settled | 2396ms (133ms behind it — a stagger) |
| **strip moves** | **3247ms**, 851ms after everything is readable |

> **Anything sequenced against `Reveal` must wait for `--dur-reveal`, not for
> the reveal to START.** The trigger fires when the element crosses 88% of the
> viewport; the transition then takes a further 1100ms. Timing off the trigger
> lands you in the middle of the fade.

### Two traps the restructure created

**Reduced motion still has to SHOW the strip.** The early return for
`prefers-reduced-motion` used to be free, because the strip was always visible.
Now `.reveal` starts at `opacity: 0`, so returning before `setVisible(true)`
would leave the covers permanently invisible. Same for the `played` early
return on a return visit. `scripts/audit.mjs` is what guards this — *0 reveal
elements still transparent*.

**The overflow check moved into `play()`.** It ran on mount and bailed out when
`scrollWidth - clientWidth <= 8`, which on desktop is always true because the
strip is `display: none` and measures zero — so it would have skipped the reveal
along with the drift. It belongs where the drift is decided, not where the
component mounts.

### Once per page load — a module-scope flag, not storage

```ts
let played = false;   // module scope
```

The scope is the specification: a module variable survives client-side
navigation (coming back from a piece is quiet) and dies on a real reload (a
refresh plays it again). **Deliberately not `sessionStorage`** — that is the
intro veil's rule (§21), and it would stay quiet across a refresh too.

> **Test this by CLICKING, not with `page.goto`.** A `goto` is a real page load
> and correctly resets the flag; a test that leaves the page that way reports a
> replay and looks like a broken "once" rule. Verified with real in-app
> navigation: return **1** scroll position, hard reload **101**.

### It never fights the visitor

`pointerdown`, `touchstart`, `wheel` and `keydown` abort it instantly, and so
does any scroll whose position is not the one the last frame wrote — `expected`
compared with a 2px tolerance is how a hand is told apart from the animation.

**An abort leaves the strip where the hand put it.** Snapping back to 0 would
throw away the position the visitor just chose. Measured: interrupted at 273,
released at 288, still 288 two and a half seconds later.

> ### ⚠️ Scroll snap quantises programmatic writes
>
> The first version jumped **0 → 144 and stayed there** — two distinct positions
> in 300 frames. `scroll-snap-type` acts on every write to `scrollLeft`, not
> only on a user's gesture, so a per-frame animation is snapped to the nearest
> cell and a 1.5s glide collapses into one jump.
>
> `.rooms-strip.is-looking { scroll-snap-type: none }` for the length of the
> gesture, removed in `cleanup()` so it returns however the gesture ended,
> including an abort. After: **101** distinct positions.

> `scrollLeft` is driven per frame rather than with
> `scrollTo({ behavior: "smooth" })` for two reasons: that property is armed
> only for anchor jumps now (§40), and a native smooth scroll cannot be
> interrupted mid-flight, which would break the abort above.

The on-screen test is the same rAF-throttled rect check `Reveal` uses — not
IntersectionObserver, for the reason components/Reveal.tsx documents.

### Verified

| | |
|---|---|
| Sequence | eyebrow 2263 → strip settled 2396 → moves 3247 |
| Return navigation | 1 position (quiet), opacity 1 |
| Hard reload | 101 positions (plays) |
| Reduced motion | 1 position, **opacity 1** |
| Desktop | strip `display: none`, rail `flex` |

`audit` on `/fr/collection`, `/en/collection`, `/fr/collection/stools` — 0
unrevealed, 0px overflow · `contrast-scroll` PASS both locales · build
warning-free.

## 46. The French pages are French — and the scrape was dirtier than anyone had looked

Three jobs in one pass: clean the product data, translate it, and rewrite the
one legal document that was lying about this site. Checkout and the email/
WhatsApp credentials are deliberately untouched — those are the client's
decisions (§37, §24).

### The old site's footer was printing as care instructions

Nobody had read a product page to the bottom. `care` and `details` are whatever
prose sat in the old site's tab panels, and the scraper took all of it:

| what | pieces |
|---|---|
| The old site's whole FOOTER — ©, nav, the legal menu | **9** |
| Jimdo's shipping-restrictions placeholder | 7 |
| Jimdo's authoring prompts — *"Describe your product in detail…"* | 11 |
| The tab HEADINGS (`Care`, `Details`) swept in as content | several |
| `details` repeating `description` word for word | 1 |
| A description hard-wrapped into 7–9 one-line fragments | 2 |

So `/fr/piece/baule-chair-cote-d-ivoire` told a visitor that the way to care for
a Baule chair is *"Contact · FAQ · Imprint · Privacy Policy · Terms and
Conditions"*. It had been live the whole time.

All of it is filtered in `lib/catalog.ts`, **not** edited out of
`docs/catalog.json` — that file is the client's record as scraped and stays
that way, the same argument `lib/specs.ts` makes for placeholder dimensions
(§14). Patterns are anchored: a loose `/contact/i` would eat a real sentence
telling someone to get in touch.

`reflow()` rejoins the hard-wrapped paragraphs by asking whether a line ends a
sentence and the next begins one, so genuine one-sentence bullets — most of
this data — are untouched.

> **The honest number got worse.** Descriptions were reported as 22 of 38.
> Four of those were Jimdo placeholder text, so it is **18**. Coverage went
> down because the count was wrong, not because anything was lost.

### The translation — 223 lines, keyed by the English

`lib/product-fr.ts`. Translation, never authorship (§11): where the English is
silent on an origin or an era, the French is silent too.

- **Names are NOT translated.** "Dogon Stool" stays. Tribal and regional
  attributions are proper nouns in the trade, and inventing a French name for
  an object whose name is the client's own record is the invention §5 forbids.
  Several names also carry typos (§13) that are the client's to correct.
- **The delivery window is translated literally** — *"1 à 2 semaines"* — while
  the FAQ still says 3–8 weeks (§9.3). Reconciling it would be taking a
  position on the client's behalf.
- Keys are the English sentence, so **an untranslated line falls back to
  English rather than vanishing** — the safe direction to fail, and every entry
  stays independently reviewable by the client.

### ⚠️ The scrape contains non-breaking spaces

One sits between "Traditionally" and "used" in the Senufo description. A key
typed with an ordinary space **silently fails to match**, and the line falls
back to English while looking correct in the diff, in the terminal, and on the
page. `frLine()` normalises U+00A0/U+202F/U+2007 and collapses whitespace before
the lookup.

The tell was one sentence appearing in **both** the "untranslated" and the
"stale" list at once. That can only happen when two strings that must be equal
are not — and it cost three wrong diagnoses (a greedy regex, a wrapped line, a
duplicate key) before I compared the two strings codepoint by codepoint, which
is what I should have done first.

> **Diff the bytes before theorising about the parser.** Both strings printed
> identically at every step.

`scripts/check-fr.mjs` reports untranslated lines, stale keys, and **non-Latin
characters in the French** — the last because I typed a Chinese `变` into a
sentence about temperature and no human review would have caught it. Currently
**223 / 223, 0 stale, 0 foreign**.

### The cookie policy is now ours, and it is the only one that is

Every other legal document here is the client's text transcribed verbatim,
typos included (§24). The cookie policy is not, because **theirs is factually
wrong about this site**: it describes Jimdo, Stripe, PayPal, Cloudflare, Google
Maps and Google Analytics with named cookies and lifetimes, and this build
loads none of them.

Reproducing it would have told every visitor — and every regulator — that
trackers are running which are not. The rule against inventing facts cuts in
this direction too.

Verified against the code, not assumed: **no `document.cookie`, no
`Set-Cookie`, no cookies() — this site sets no cookies at all**; no analytics
and no third-party script tags; exactly two first-party storage keys,
`trc:cart` (localStorage) and `trc:intro` (sessionStorage).

`LegalDoc.source` is now `string | null`, and `null` means *ours, not theirs*.
A transcription without a source is one nobody can check, so the type makes the
distinction impossible to lose.

> ⚠️ **Re-check this document when the stack changes.** Turning on Shopify
> checkout, Analytics or Search Console adds third-party cookies and makes it
> wrong in the other direction. It is accurate for this build and no other.

### The four footer 404s were already fixed

§25 records `/shipping`, `/terms`, `/privacy`, `/withdrawal` as dead links.
They are not: the footer points at `/legal/*` and **all 65 internal links
across six pages return 200.** That was fixed at some point and this file never
caught up — I repeated the stale note as fact before crawling. **Crawl before
reporting a broken link.**

### Verified

`check-fr` 223/223 · `zoom-check` 31/31 · `audit` and `contrast-scroll` PASS on
`/fr/piece/…`, `/en/piece/…`, `/fr/legal/cookies`, `/fr/contact`,
`/fr/collection`, `/fr` · English pages confirmed unchanged, no French leaking
into `/en` · build warning-free, 123 pages.

### Still deliberately not done

**Checkout** and **the contact credentials** (`RESEND_API_KEY`,
`CONTACT_EMAIL`, `NEXT_PUBLIC_WHATSAPP`) — both need the client. And the
returns/delivery contradictions (§9.2, §9.3) still need a decision with legal
input before `/legal/withdrawal` and `/legal/delivery` can be anything but the
client's own contradictory text.
