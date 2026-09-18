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
| **Store** | ✅ Exists — `cru1uj-cf`, client registered in **France**. |
| **Plan** | Basic (€1/mo promo, then €36/mo). |
| **The 38 products in Shopify** | ❌ **The blocker.** Everything else waits on this. |
| **Storefront token** | ❌ Not created yet. |
| **Payment live** | ❌ `/checkout` says so, before the button. |

Nothing is broken while this is unfinished. Every buy action falls back to an
enquiry, and the checkout page states plainly that payment is not active yet.

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

**Shopify admin → Products → Import → upload the file.**

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

**€36/month** (Basic, monthly) — about **€432/year**, or ~€324 on annual
billing — plus **2.9% + €0.30** per sale.

> The commercial proposal said "~9 EUR/month". That was the **Lite** plan,
> discontinued in June 2022. Its replacement (Starter, $5) has no online store
> and no Storefront API and cannot run this build at any price. The real floor
> is €36/mo. See `CLAUDE.md` §57.
