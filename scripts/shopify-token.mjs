/**
 * Turn Dev Dashboard app credentials into the token this site actually needs.
 *
 *   node scripts/shopify-token.mjs
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS: SHOPIFY CHANGED THE RULES ON 1 JANUARY 2026
 *
 * Custom apps can no longer be created in the Shopify admin. They are created
 * in the Dev Dashboard, and — the part that breaks every older set of
 * instructions — **the admin no longer shows you an access token at all**.
 * Shopify's own words: "you can't copy and send an access token directly from
 * your Shopify admin. Your developer must use the client credentials grant."
 *
 * So the merchant hands over a **Client ID and Client secret**, not a token,
 * and this script does the rest:
 *
 *   1. Exchange the credentials for an Admin token
 *      (POST /admin/oauth/access_token, grant_type=client_credentials).
 *      That token lasts **24 hours** — it is a key to the store, not a
 *      configuration value, and it is never written to disk here.
 *
 *   2. Use it once to mint a **Storefront** access token
 *      (`storefrontAccessTokenCreate`). That one does NOT expire, and it is
 *      the one the site ships: public by design, able to read published
 *      products and create a cart, and nothing else.
 *
 * The 24-hour Admin token is deliberately not persisted. Anything needing it
 * re-runs this; a long-lived Admin token sitting in a file is the failure this
 * whole design exists to avoid.
 * ---------------------------------------------------------------------------
 *
 * ⚠️ The client credentials grant only works when the app and the store are in
 * the SAME Shopify organization. An app made under a different account cannot
 * reach this store, and the error will look like a bad secret rather than what
 * it is.
 */
import { readFileSync, existsSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const API_VERSION = "2025-01";

for (const file of [".env.local", ".env"]) {
  const path = join(ROOT, file);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    if (!process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const SHOP = (process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "").replace(/^https?:\/\//, "");
const ID = process.env.SHOPIFY_CLIENT_ID;
const SECRET = process.env.SHOPIFY_CLIENT_SECRET;

if (!SHOP || !ID || !SECRET) {
  console.error(
    "Missing credentials. Put these in .env.local (it is gitignored):\n\n" +
      "  NEXT_PUBLIC_SHOPIFY_DOMAIN=cru1uj-cf.myshopify.com\n" +
      "  SHOPIFY_CLIENT_ID=...\n" +
      "  SHOPIFY_CLIENT_SECRET=...\n\n" +
      "Both come from the Dev Dashboard: your app -> Overview -> API credentials.\n" +
      "NEITHER may ever get a NEXT_PUBLIC_ prefix — that inlines a value into\n" +
      "every bundle the site serves, and the secret is a key to the whole store.",
  );
  process.exit(1);
}

/* ---- 1. credentials -> a 24-hour Admin token ---------------------------- */

const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "client_credentials",
    client_id: ID,
    client_secret: SECRET,
  }),
});

if (!res.ok) {
  const body = await res.text();
  console.error(
    `Token exchange failed — HTTP ${res.status}\n${body.slice(0, 400)}\n\n` +
      "The usual causes, in order of likelihood:\n" +
      "  · the app has no RELEASED version (configure it, then Release)\n" +
      "  · the app is not INSTALLED on this store\n" +
      "  · the app and the store are in different Shopify organizations\n" +
      "  · the client secret was rotated",
  );
  process.exit(1);
}

const { access_token: admin, scope, expires_in } = await res.json();
console.log(`Admin token obtained — expires in ${Math.round((expires_in ?? 0) / 3600)}h`);
console.log(`Scopes granted: ${scope || "(none reported)"}\n`);

const granted = String(scope || "").split(",").map((x) => x.trim());
const needed = [
  "unauthenticated_read_product_listings",
  "unauthenticated_write_checkouts",
];
const missing = needed.filter((x) => !granted.includes(x));
if (missing.length) {
  console.log(
    `⚠️  Not granted: ${missing.join(", ")}\n` +
      "   Add them to the app's Access scopes, Release a new version, and re-run.\n" +
      "   Without them the storefront token will exist but the cart will fail.\n",
  );
}

/* ---- 2. Admin token -> a permanent Storefront token --------------------- */

const gql = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": admin,
  },
  body: JSON.stringify({
    query: `mutation($input: StorefrontAccessTokenInput!) {
      storefrontAccessTokenCreate(input: $input) {
        storefrontAccessToken { accessToken title }
        userErrors { field message }
      }
    }`,
    variables: { input: { title: "The Roots Corner site" } },
  }),
});

const json = await gql.json();
const errs = json?.errors ?? json?.data?.storefrontAccessTokenCreate?.userErrors;
if (errs?.length) {
  console.error("Could not mint a storefront token:");
  for (const e of errs) console.error(`  · ${e.message}`);
  console.error(
    "\nIf this says the scope is missing, the app needs an unauthenticated_*\n" +
      "scope declared and a new version released.",
  );
  process.exit(1);
}

const token = json?.data?.storefrontAccessTokenCreate?.storefrontAccessToken?.accessToken;
if (!token) {
  console.error("No token came back and no error was reported. Raw response:");
  console.error(JSON.stringify(json, null, 1).slice(0, 800));
  process.exit(1);
}

console.log("Storefront access token (does NOT expire):\n");
console.log(`  ${token}\n`);

const envPath = join(ROOT, ".env.local");
const already = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
if (already.includes("NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=" + token)) {
  console.log(".env.local already holds this token.");
} else {
  appendFileSync(
    envPath,
    `\n# Minted by scripts/shopify-token.mjs on ${new Date().toISOString().slice(0, 10)}\n` +
      `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=${token}\n`,
  );
  console.log("Appended to .env.local.");
  console.log(
    "\n⚠️  If an older NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN line is above it,\n" +
      "    delete the old one — the last assignment wins and a stale token\n" +
      "    fails in a way that looks like a broken cart.",
  );
}

console.log("\nNext: node scripts/shopify-link.mjs   (once the products are imported)");
