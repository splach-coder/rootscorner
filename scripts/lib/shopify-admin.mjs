/**
 * Admin API access for the maintenance scripts.
 *
 * Exchanges the Dev Dashboard app's Client ID / Client secret (in .env.local,
 * never NEXT_PUBLIC_) for a 24-hour Admin token via the client credentials
 * grant (see scripts/shopify-token.mjs for why). The token is kept in memory
 * only.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const API = "2025-01";

if (existsSync(join(ROOT, ".env.local"))) {
  for (const l of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const SHOP = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
let TOKEN = null;

export async function connect() {
  if (!SHOP || !process.env.SHOPIFY_CLIENT_ID || !process.env.SHOPIFY_CLIENT_SECRET) {
    throw new Error("Set NEXT_PUBLIC_SHOPIFY_DOMAIN, SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET in .env.local");
  }
  const auth = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
    }),
  });
  if (!auth.ok) throw new Error(`Auth failed: ${auth.status} ${await auth.text()}`);
  const body = await auth.json();
  TOKEN = body.access_token;
  return { shop: SHOP, scope: body.scope ?? "" };
}

export async function gql(query, variables = {}) {
  const r = await fetch(`https://${SHOP}/admin/api/${API}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors?.length) throw new Error(j.errors.map((e) => e.message).join("; "));
  return j.data;
}

export function userErrors(data) {
  const e = Object.values(data)[0]?.userErrors;
  if (e?.length) throw new Error(e.map((u) => `${u.field ?? ""} ${u.message}`).join("; "));
  return data;
}
