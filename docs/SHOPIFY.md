# Shopify — the runbook

Everything needed to take this site from "no shop" to "taking money", on any
machine. Self-contained: you should not need to read `CLAUDE.md` to follow it.

The background reasoning lives in `CLAUDE.md` §37 (the seam), §56 (the wiring),
§57 (the plan and its cost) and §58 (customer accounts).

---

## 0. Where this stands

| | |
|---|---|
| **Code** | ✅ Done. Cart, checkout review, `cartCreate`, the account link — all written. |
| **Store** | ✅ `cru1uj-cf` — verified live: **EUR, Europe/Paris, billing country FR**, so Shopify Payments is available. |
| **Plan** | ✅ Basic (€1/mo promo, then €36/mo). |
| **Custom app** | ✅ Created in the Dev Dashboard, released, installed. |
| **Storefront token** | ✅ Minted by `scripts/shopify-token.mjs`, in `.env.local`. Verified against the live Storefront API. |
| **The 38 products in Shopify** | ❌ **The blocker.** Store reports 0 products. |
| **Payment live** | ❌ `/checkout` says so, before the button. |

### The scope list — decided once, so there is one release cycle and not five

Every name below is from Shopify's own access-scopes reference, not written from
memory: a wrong scope string is worse than a missing one, because the release
accepts it and the grant silently lacks it.

**Put this in Portées, as one comma-separated line:**

```
read_products,write_products,read_locations,read_inventory,write_inventory,read_publications,write_publications,read_customers,write_customers,read_files,write_files,read_shipping,write_shipping,unauthenticated_read_product_listings,unauthenticated_read_checkouts,unauthenticated_write_checkouts
```

| scope | what needs it |
|---|---|
| `read_products` `write_products` | Creating the 38 pieces. **Proven live.** Also covers collections. |
| `read_locations` | Finding where stock lives. `productSet` cannot set a quantity without a location id. |
| `read_inventory` `write_inventory` | Stock of 1, tracked, `DENY`. |
| `read_publications` `write_publications` | **The blocker.** A product can be ACTIVE and still invisible to the Storefront API until it is published to a sales channel. |
| `read_customers` `write_customers` | `app/api/subscribe/route.ts` already creates a marketing-consented customer from the newsletter (§26). Written, waiting on this. |
| `read_files` `write_files` | The product images point at the **dying Jimdo CDN** (§59) and the client's Drive holds the originals (§51). Moving them onto Shopify needs file staging. |
| `read_shipping` `write_shipping` | Shipping zones — still an open decision, and doing it by API rather than by hand is the difference between a repeatable setup and a clicked one. |
| `unauthenticated_*` | The site itself: read published products, create a cart. |

> **`write_` implies `read_`.** Measured: the first install granted
> `write_products` and `write_inventory` without their read counterparts, and
> both reads worked. The reads are listed anyway so the intent is legible on the
> app's own page.

### Deliberately NOT requested

This matters more than the list above. The client secret has already travelled
through a chat, and every scope widens what a leak would reach.

| not asked for | why |
|---|---|
| **`read_orders` `write_orders`** | The single most sensitive category — names, addresses, what people bought. The site never displays an order: Shopify hosts customer accounts (§58). The client can read orders in the admin. Add it the day something actually needs it, not before. |
| `read_discounts` `write_discounts` | Speculative. No discount exists or is planned. |
| `read_translations` `write_translations` | Product names are deliberately untranslated (§46), and Shopify localises its own checkout. |
| `read_markets` `write_markets` | Nothing configures markets by API. |
| `read_content` `write_content` | The site owns every word. Shopify holds no page here. |
| `write_locations` | We only ever read where stock is. |
| `unauthenticated_read_product_inventory` | `availableForSale` comes with `unauthenticated_read_product_listings`, and "sold" is all the site shows — it never prints a quantity. |

> The rule, and it is the same one the two-token warning states: **ask for what a
> job needs, when it needs it.** A scope list that covers every future idea is a
> blast radius, and this one is attached to a secret that has been pasted into a
> conversation.

---

## 1. Set the project up on a new machine

```bash
git clone https://github.com/splach-coder/rootscorner.git
cd rootscorner
npm install
```

Node 20+ (developed on 22). Then create **`.env.local`** — it is gitignored and
never committed:

```ini
NEXT_PUBLIC_SHOPIFY_DOMAIN=cru1uj-cf.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL=
```

`.env.example` documents every variable the project uses, Shopify's included.

Run it:

```bash
npm run build && npx next start -p 3111
```

> **Windows:** `pkill` does not kill the dev server. Use
> `Get-NetTCPConnection -LocalPort 3111` in PowerShell, or the port stays held
> and you end up serving a half-written `.next`.

---

## 2. In Shopify, in this order

### 2.1 Plan → **Basic**

The Storefront API — the only thing this site uses — is on **every** plan.
Grow and Advanced buy a lower card rate, nothing more. Don't take annual billing
until the shop has actually sold something.

### 2.2 Store details

**Country: France.** Currency: **EUR**.

This is not cosmetic. Shopify Payments is **not available in Morocco**; in
France it is. A Morocco-registered store would need a CMI gateway contract with
a Moroccan bank **plus** Shopify's own 2% third-party fee on Basic — roughly
€7–9 on a €150 piece against **€4.65** in France.

> Shopify locks the country field once Shopify Payments is active. Set it right
> **before** activating payments; changing it afterwards means deactivating
> payments first.

### 2.3 Payments → activate **Shopify Payments**

2.9% + €0.30 per transaction, no extra Shopify fee.

### 2.4 Products → import the CSV ← **the blocker**

`docs/shopify-import.csv` is generated from the client's own catalogue and is
already in the repo. Regenerate it any time with:

```bash
node scripts/shopify-csv.mjs --check   # report only
node scripts/shopify-csv.mjs           # writes docs/shopify-import.csv
```

**Before you import, get the header row your store actually expects.** It takes
thirty seconds and needs no products:

> Shopify admin → **Products → Export → export all products, as CSV**

An empty store still exports its **header row**. Open it, read the first line:

| the first column reads | run |
|---|---|
| `Handle` | `node scripts/shopify-csv.mjs` (default) |
| `URL handle` | `node scripts/shopify-csv.mjs --modern` |

Shopify's current help pages document the friendly names (`URL handle`,
`Description`, `Price`); its own exporter has emitted the classic ones for years
and the importer accepts them. Matching the export removes the guess.

> ⚠️ One column does not merely rename, it **inverts**. Classic
> `Variant Inventory Policy` is `deny` / `continue`; modern
> `Continue selling when out of stock` is a boolean, where the same intent is
> **FALSE**. The script handles it; a hand-edit would not, and would turn "never
> oversell a one-of-a-kind" into "always oversell it".

**Then: Shopify admin → Products → Import → upload the file.**

38 products, 212 image rows, 36 in stock, 2 at qty 0.

What it sets, and why:

| | |
|---|---|
| **Handle** | The same slug this site uses — from the client's own product URL. **This is the whole point:** it is what lets the link script match all 38 without anyone reading a `gid://`. |
| Title | Title-cased by the same function the site displays, so Shopify and the site say the same name in the order email. |
| Body (HTML) | **Empty on purpose.** The site owns the product copy; Shopify owns price, stock and fulfilment. The raw scrape contains the old site's footer as "care instructions" and exporting it would republish that junk. |
| Inventory | qty 1, policy **`deny`** — stock is one of everything and a one-of-a-kind must never oversell. |
| Weight | **Not set.** Nothing in the client's data records one, and a guessed weight is a wrong shipping price. Set shipping rates by price/zone, or add real weights in Shopify. |

> ⚠️ **Images are fetched from the client's LIVE OLD SITE at import time.** The
> CSV points at `storage.e.jimdo.com` URLs, so **therootscorner.com must still
> be up when you press import**. Shopify copies each image onto its own CDN, so
> the link is only needed during the import — but if the old site is taken down
> first, the products import with no photographs.

> ⚠️ **Do not open and re-save the CSV in Excel.** It mangles the accents
> (`Côte D'Ivoire`). Upload the file as generated.

### 2.5 Storefront API token

Shopify admin → **Settings → Apps and sales channels → Develop apps → Create an
app** → Configure **Storefront API** scopes → **Install** → copy the
**Storefront API access token**.

Scopes needed: read products, and cart write (`unauthenticated_read_product_listings`,
`unauthenticated_write_checkouts` / cart).

Put it in `.env.local` as `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`.

> **Two tokens, and only one may ever be public.** The *Storefront* token is
> designed to ship to a browser — it reads published products and creates a
> cart, nothing else. The **Admin** token can read customers and orders and edit
> the store, and must **never** be given a `NEXT_PUBLIC_` prefix: that prefix is
> exactly what inlines a value into every bundle the site serves.

### 2.6 Link the catalogue to the store

```bash
node scripts/shopify-link.mjs           # dry run — what would be linked
node scripts/shopify-link.mjs --write   # writes docs/shopify.json
```

It reads the store's own products and writes `slug → variant ID`. It **links a
piece only when exactly one product matches**, by handle or exact normalised
title; anything ambiguous is reported and left out. It also lists products in
the store that are not in the catalogue, which is how drift gets noticed.

Expect **38 / 38** if the CSV was imported unchanged.

Commit `docs/shopify.json` — it is part of the build.

### 2.7 Customer accounts (optional, one variable)

Shopify hosts these: order history, fulfilment status, tracking, self-serve
returns. Sign-in is passwordless — a 6-digit code by e-mail — so this site never
touches a credential.

Shopify admin → **Settings → Customer accounts**, then **Settings → Domains** to
put them on `account.therootscorner.com` rather than
`shopify.com/<shop_id>/account`. Set:

```ini
NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL=https://account.therootscorner.com
```

A *"Mes commandes" / "My orders"* link then appears in the header (and in the
menu panel on a phone). Unset, nothing renders anywhere.

### 2.8 ⚠️ The cookie policy — NOT optional, and NOT separable

The moment Shopify checkout is live it sets **third-party cookies**. That makes
`cookies` in `lib/legal.ts` — a document currently stating this site sets
**none** — wrong in the permissive direction, which is worse than having no
policy at all.

Two things, in the same change as switching payment on:

1. Rewrite the `cookies` document in `lib/legal.ts` against the real stack.
2. Check the consent banner arms (`lib/consent.ts`, `consentNeeded()`).

`scripts/shopify-link.mjs` prints this reminder after a successful `--write`.

---

## 3. Deploy

The two `NEXT_PUBLIC_*` values are **inlined at build time**, not read at
runtime. Setting them in the hosting dashboard is not enough on its own —
**the site must be rebuilt** after they change, or the old build keeps the old
(absent) values and payment silently stays off.

---

## 4. Verify

```bash
npm run build                                   # must be warning-free
node scripts/shopify-link.mjs                   # 38 / 38
node scripts/audit.mjs http://localhost:3111/fr/checkout
node scripts/contrast-scroll.mjs http://localhost:3111/fr/checkout
```

Then by hand, on the running site:

- Add a piece → cart count rises → `/checkout` lists it with the right price.
- **Before payment is linked:** the page says *"Le paiement n'est pas encore
  activé"* **above** the button, not after pressing it.
- **After:** pressing the button lands on Shopify's own domain with the right
  piece and price in the cart.

> **The live path has never run.** `cartCreate`, the checkout URL and the
> handover have not been exercised against a real store. **Make the first order
> a real test order somebody watches**, and refund it.

---

## 5. Traps already hit, so nobody hits them twice

**The handle is `slugOf(url)`, never a slug built from the name.** The client's
URLs contain runs like `stool---cote-d-ivoire` — three hyphens — that no
name-based slugify produces. An earlier version of the link script derived the
slug from the name and would have matched **0 of 38** while looking entirely
reasonable. Both scripts now take the last segment of the URL, the same as
`lib/catalog.ts`.

**`paymentReady()` needs a linked piece, not just credentials.** Setting the two
variables before importing products would hide the "payment not active" notice
and send buyers to an **empty** Shopify cart.

**One missing variant refuses the whole checkout.** A partially linked store is
normal while products are added. Dropping unresolved lines would land a buyer on
Shopify with a *smaller order than the one they reviewed* — so it refuses, and
reports `not-connected` rather than `failed`, because retrying cannot help.

**Never edit `docs/catalog.json`.** It is the client's record exactly as
scraped. The Shopify mapping lives in `docs/shopify.json`; the copy filtering
lives in `lib/catalog.ts`.

---

## 6. The files

| | |
|---|---|
| `lib/shopify.ts` | Storefront client, the variant map, `ACCOUNT_URL` |
| `lib/checkout.ts` | `startCheckout` / `cartCreate` — the only commerce seam |
| `docs/shopify.json` | slug → variant ID. **Empty is a supported state.** |
| `docs/shopify-import.csv` | The product import, generated |
| `scripts/shopify-csv.mjs` | Builds that CSV from the catalogue |
| `scripts/shopify-link.mjs` | Reads the store, writes the variant map |
| `components/CheckoutOrder.tsx` | The review step that hands over |
| `.env.example` | Every variable, documented |

---

## 7. What it costs the client

Every figure below is checked against the provider's own pricing page, not
remembered. Dates: the Shopify promo runs to **17 Dec 2026**.

### Fixed — what is paid whether or not anything sells

| | now | from 17 Dec 2026 | per year |
|---|---|---|---|
| **Shopify Basic** | €1/mo (promo) | **€36/mo** | **€432** |
| **Vercel Pro** | $20/mo | $20/mo | **$240** (~€220) |
| **Resend** (the contact form) | €0 | €0 | **€0** |
| **Domain** | already owned | renewal only | ~€15 |

**First 12 months ≈ €550.** (3 months of Shopify at €1 = €3, then 9 × €36 =
€324, plus a year of Vercel.)
**Steady state ≈ €670/year.**

> ### ⚠️ Vercel Pro is not optional, and it was not in anyone's budget
> Vercel's **Hobby plan forbids commercial use** — their terms define it as any
> deployment used for financial gain by anyone involved in producing it, which
> a shop plainly is. A revenue-taking site on Hobby is a terms breach, and the
> account can be suspended. Pro is **$20/mo**.
>
> If that $240/year matters, the site can be hosted elsewhere: **Cloudflare
> Workers** (via OpenNext) permits commercial use on its free tier. It is a real
> migration, not a setting, so it is a decision to take deliberately — but it is
> the one line here that can go to zero.

> **Resend stays free.** Its free tier is 3,000 e-mails/month capped at 100/day,
> with one verified domain. A contact form on a shop this size will not come
> near that. It needs DNS access to verify the sending domain — nothing more.

> **And one line disappears:** whatever the client pays Jimdo for the old site
> stops the day the domain points here. That is a saving against all of the
> above, and only she knows the figure.

### Per sale — the only cost that scales

**Shopify Payments, France: 2.9% + €0.30.** No third-party gateway fee, because
Shopify Payments is available in France (§2.2).

Measured against the real catalogue — 38 pieces, €9,020 of stock, €35–€480,
average €237, median €180:

| order | fee | effective |
|---|---|---|
| €35 (cheapest piece) | **€1.32** | 3.8% |
| €180 (median) | **€5.52** | 3.1% |
| €237 (average) | **€7.18** | 3.0% |
| €480 (dearest piece) | **€14.22** | 3.0% |

**If the entire catalogue sold once, one piece per order: €272.99 on €9,020 —
3.03%.**

The €0.30 is what makes cheap pieces cost proportionally more. It is only
material below about €50, where it doubles the effective rate.

### The number that matters

Fixed cost ≈ **€670/year**. At the average order of €237, that is **three pieces
a year** to cover the entire platform. Everything after that is margin against
a 3% card fee.

---

## 8. The domain — where it actually lives

Checked at the registry (RDAP) and in DNS, not assumed:

| | |
|---|---|
| Registrar | **InterNetX GmbH** (IANA 151) — Jimdo's domain partner, so it was registered *through* Jimdo |
| Nameservers | `ns13.jimdo.com` · `ns14.jimdo.com` — **Jimdo controls DNS** |
| A record | `162.159.128.70` / `.129.70` — Cloudflare IPs, Jimdo's own front |
| Status | **`clientTransferProhibited`** — locked, as registrars lock by default |
| Registered | 2025-02-07 · **expires 2027-02-07** |
| **MX** | **none** |
| TXT / CNAME | none |

> **No MX means no e-mail runs on this domain**, so moving it breaks no
> mailbox. The house uses `therootscornerm@gmail.com`, which is Gmail and
> entirely independent. That is what makes this safe — the usual disaster in a
> domain move is silently killing the client's e-mail.

### Transfer, don't just repoint

Repointing DNS would be quicker, but the domain is registered **through Jimdo**.
Cancelling Jimdo — which is the plan, since that subscription is the saving that
offsets Shopify (§7) — could take the domain with it.

**So the registration has to move first, and Jimdo must not be cancelled until
it has.**

1. **Jimdo → domain settings → unlock** (clears `clientTransferProhibited`)
2. Request the **auth / EPP code**. Jimdo usually e-mails it.
3. At the new registrar, start the transfer and paste that code.
4. Approve the confirmation e-mail. It takes about **5 days**.
5. Only then cancel Jimdo.

A transfer also **adds a year**, so it would run to 2028-02-07.

> Two traps: a domain cannot be transferred within **60 days** of registration or
> of a previous transfer (this one is long past both), and the **admin contact
> e-mail must be reachable** — the approval goes there, and a transfer stalls
> silently if nobody clicks it.

### The chosen shape

| | |
|---|---|
| **Registrar** | **Namecheap** — the client already has an account |
| **DNS** | **Cloudflare** — nameservers pointed there *from* Namecheap |
| **Hosting** | **Cloudflare Workers** |

Shopify could hold the domain, and the Basic plan came with a domain offer — but
this storefront is **headless**, so the domain points at our host, not at
Shopify. Parking it there adds a dependency without buying anything.

> **Cloudflare Workers needs the domain on Cloudflare DNS.** A custom domain on
> Workers requires the zone to live in the Cloudflare account. Registrar and DNS
> are separate things: Namecheap keeps the registration and takes the renewal,
> Cloudflare answers the queries.

### The order, and why it is this order

The blocking step is **getting the auth code out of Jimdo**. Everything else
waits on it.

1. **Jimdo → domain → unlock**, and request the **auth / EPP code**.
2. **Namecheap → Transfer** → enter the domain → paste the code → pay. The fee
   is about one year of a .com and **adds a year** to the expiry.
3. **Approve the confirmation e-mail.** It goes to the domain's admin contact.
   Nothing errors if nobody clicks — the transfer simply stalls.
4. Wait. **Roughly 5 days.**
5. **Namecheap → Nameservers → Custom** → Cloudflare's two.
6. **Only now cancel Jimdo.**

> **Nothing goes dark during any of this.** DNS keeps answering from Jimdo's
> nameservers for the whole transfer, so the old site stays up until step 5. The
> switch happens exactly once, when we choose it.

> **A transferred domain is locked for 60 days** by ICANN rule. If the plan were
> ever to end up at Cloudflare Registrar for at-cost renewal, going via Namecheap
> costs a two-month wait. Namecheap is a perfectly good registrar; this is only
> worth knowing before, not after.

### The DNS records that will be needed

Once the zone is on Cloudflare:

| record | for |
|---|---|
| The Workers custom-domain records | Cloudflare writes these itself when the Worker is bound to `therootscorner.com` |
| `www` → apex | so both spellings reach the site |
| **SPF / DKIM / DMARC** | Resend, to send the contact form from this domain. It refuses to send until the domain is verified. |
| `account` CNAME | only if Shopify customer accounts get the branded subdomain (§2.7) |

**There are no records to preserve.** Verified at the time of the move: no MX,
no TXT, no CNAME on the apex. The zone starts empty, which is the easiest
possible migration.

## 9. Hosting — deployed on Cloudflare Workers (2026-09-23)

| | |
|---|---|
| Registrar | **Namecheap** — transfer paid 2026-09-23, adds a year: expiry **7 Feb 2028** |
| DNS | Cloudflare zone `therootscorner.com`, **pending** until the nameservers change |
| Nameservers to set at Namecheap | **`alfred.ns.cloudflare.com`** · **`sneh.ns.cloudflare.com`** |
| Worker | `therootscorner` — live now at `https://therootscorner.wereact.workers.dev` |
| Custom domains | `therootscorner.com` and `www.therootscorner.com`, bound to the Worker |
| www | 301 → apex (zone Redirect Rule), so there is one canonical address |
| TLS | Full (strict), Always HTTPS, min TLS 1.2 |

### Deploy

```
npm run cf:deploy        # opennextjs-cloudflare build && deploy
```

Wrangler needs Cloudflare credentials in the shell (`CLOUDFLARE_API_TOKEN`, or
`CLOUDFLARE_EMAIL` + `CLOUDFLARE_API_KEY`) plus `CLOUDFLARE_ACCOUNT_ID`
`c46e92eba2f987d52c1975c4d92e30c2`. **Never commit them.**

`NEXT_PUBLIC_*` values are read from `.env.local` **at build time** and inlined,
so a machine without that file builds a site with payment switched off. Copy
`.env.local` across before deploying from a new PC.

Server-only secrets live on the Worker, not in the build:

```
npx wrangler secret put SHOPIFY_CLIENT_ID      # set
npx wrangler secret put SHOPIFY_CLIENT_SECRET  # set — re-put after rotating it
npx wrangler secret put RESEND_API_KEY         # not yet — contact form fails honestly to WhatsApp until then
```

### Why these choices

- **`@opennextjs/cloudflare`** is the adapter; `open-next.config.ts` uses the
  **static-assets incremental cache**. Every page is prerendered and nothing
  revalidates, so the R2 cache the template reaches for would be a bucket (and a
  billing profile) holding copies of files the assets directory already has.
- **next/image** resizes through the Cloudflare **Images** binding. Verified: a
  1080w request returns AVIF.
- **The newsletter no longer writes a local file in production.** On Workers
  the filesystem is an in-memory stub: the append "succeeds", the visitor is
  thanked, and the address is gone. It now creates a Shopify customer with
  marketing consent, using the client-credentials grant and the two secrets
  above, and fails loudly without them.
- `proxy.ts` runs as Node middleware, which OpenNext marks experimental.
  Verified working: `/` redirects by `Accept-Language`.
- OpenNext warns that Windows builds are "not fully compatible". The build and
  every route passed on Windows; if a runtime oddity ever appears, rebuild under
  WSL before debugging the code.

### Verified on the live Worker

Every route shape 200 · no console or page errors in a real browser · 0 broken
images · `/fr/contact?piece=…` renders the piece · the Cookie Policy names
Shopify · `robots.txt` and a 118-URL `sitemap.xml` with hreflang pairs ·
canonical `https://therootscorner.com/fr` · **checkout creates a Shopify cart
and hands the buyer over** — where Shopify currently stops them at its
**password page** (below).

### Still to do in the Shopify admin (not code)

1. **Online Store → Preferences → Password protection → off.** Until then
   every buyer who presses "Passer au paiement" lands on a password page.
2. **Settings → General → Store name**: it is still "Ma boutique", which is the
   title a buyer sees on checkout and in the confirmation email.
3. **Shipping rates** per zone (§6 of this file's parent brief) — without them
   checkout offers no delivery option.
4. **Rotate the client secret** (Dev Dashboard → Renouveler), then
   `wrangler secret put SHOPIFY_CLIENT_SECRET` and update `.env.local`.

### After the transfer completes (~5 days)

Namecheap → Domain List → Manage → Nameservers → **Custom DNS** → the two
nameservers above. Within minutes to hours the zone goes **active**, the
custom domains get certificates, and `therootscorner.com` serves this build.
Only then cancel Jimdo.

## 10. Customer accounts — live (2026-09-23)

`NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL=https://shopify.com/105437954396/account`
(shop id from the Storefront API `shop { id }`). The header shows **Mes
commandes / My orders**; on a phone it sits in the menu panel beside the cart.
The link carries `?locale=fr|en` so the sign-in opens in the visitor's language.

Verified: it lands on Shopify's passwordless sign-in ("Se connecter ou créer un
compte") — an email, then a six-digit code. No password exists anywhere.

**How a customer gets an account:** there is no separate sign-up. Anyone who
orders, or who enters their email on that page, has one; the code proves they
own the address. Inside: every order, its status (unfulfilled → shipped →
delivered), the tracking link once the house marks it shipped, addresses.

**What makes the tracking real is the fulfilment step in the admin:** Orders →
the order → **Fulfil item** → paste the carrier's tracking number. That sends
the "your order has shipped" email and fills in the status in the account.
Nothing on this site can do that for her.

To brand it later: Settings → Domains → connect `account.therootscorner.com`
(a CNAME on the Cloudflare zone), then change the variable and redeploy.

## 11. Shopify is now the source of truth for price, stock and new pieces

| | |
|---|---|
| `scripts/shopify-pull.mjs` | Runs before every build (`npm run cf:build`). Storefront API only — public token, nothing secret. Writes `docs/shopify-live.json`. |
| Price + availability | For the 38 original pieces, Shopify's values override the scrape. Matched by **variant ID**, never handle (§61 of CLAUDE.md). |
| Unpublished / deleted in Shopify | Becomes unavailable on the site. |
| New piece added in Shopify | Appears on the site whole — title, description, photos (from `cdn.shopify.com`), room from its **Type**. No Type that matches a room → skipped, with a warning in the build log. Verified with a fake entry: page generated, image from the CDN, listed in its room. |
| Live stock | `AddToCart` asks Shopify in the browser before offering the button. Sold since the build → "Vendue", and the piece is taken out of the cart. Verified by simulating a sale. |
| Store unreachable at build | Previous snapshot kept, build continues, loud warning. |
| Scheduled rebuild | `.github/workflows/deploy.yml`: every push, every 3 h, and on demand. Build secrets set on GitHub; **`CLOUDFLARE_API_TOKEN` still to add** — until then it builds and skips the deploy with a warning. |

The site's own copy (names, French translations, photography, dimensions) of
the original 38 stays in this repo. Shopify holds none of it.

## 12. `scripts/shopify-setup.mjs` — written, dry-run verified, NOT yet applied

Makes the admin readable for the house: every product's **Type** becomes its
French room, one automatic collection per room (rule: Type equals the room,
plus an empty **Tapis**), and the example shipping rates Shopify ships with
(France 7.99 €, EU 22 €, …) are replaced by the house's own published table —
Maroc 25 €, International 50 € under 200 € / 80 € from 200 €.

```
node scripts/shopify-setup.mjs --dry   # verified
node scripts/shopify-setup.mjs         # apply — needs a yes, it changes the live store
```

Until it runs, a NEW piece is only picked up if its Type is typed exactly as a
room name (see `docs/GUIDE-BOUTIQUE.md`), and checkout charges Shopify's example
rates.

## 13. Guide for the house

`docs/GUIDE-BOUTIQUE.md` — in French: add a piece, change a price, mark sold,
fulfil with tracking, shipping rates.
