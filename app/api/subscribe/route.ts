import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * Email capture.
 *
 * This is the swap point for Shopify, in the same spirit as lib/catalog.ts: the
 * form talks to this route and nothing else.
 *
 * A signup becomes a Shopify customer with marketing consent. Credentials, in
 * order of preference:
 *
 *   SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET — the Dev Dashboard app (§61).
 *     Exchanged here for a 24-hour Admin token via the client credentials
 *     grant, cached in the isolate until shortly before it expires. Since
 *     1 January 2026 this is the only way a custom app gets an Admin token.
 *   SHOPIFY_ADMIN_TOKEN — a static token, if one ever exists.
 *
 * All of these are server-only secrets. None may ever take a NEXT_PUBLIC_
 * prefix: that inlines the value into every bundle the site serves.
 *
 * Without credentials, development appends to a local file. PRODUCTION DOES
 * NOT: on Workers the filesystem is an in-memory stub, so the append would
 * "succeed", the visitor would be thanked, and the address would be gone when
 * the isolate recycled. A signup that silently vanishes is worse than one that
 * fails, so production without credentials answers store_failed.
 */

// NEXT_PUBLIC_ values are inlined at build time, so the store is safe to read
// at module scope. The secrets are not: on Workers they arrive as bindings per
// request, so they are read at call time rather than frozen on first import.
const STORE =
  process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const LOCAL_FILE = path.join(process.cwd(), ".data", "subscribers.ndjson");

/** Deliberately permissive: rejecting valid-but-unusual addresses loses a sale. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/;

let cached: { token: string; until: number } | null = null;

async function adminToken(): Promise<string | null> {
  const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
  const STATIC_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
  if (STATIC_TOKEN) return STATIC_TOKEN;
  if (!STORE || !CLIENT_ID || !CLIENT_SECRET) return null;
  if (cached && Date.now() < cached.until) return cached.token;

  const res = await fetch(`https://${STORE}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`shopify auth ${res.status}`);
  const { access_token, expires_in } = (await res.json()) as {
    access_token: string;
    expires_in?: number;
  };
  // Renew ten minutes early rather than race the expiry.
  cached = {
    token: access_token,
    until: Date.now() + Math.max(60, (expires_in ?? 3600) - 600) * 1000,
  };
  return access_token;
}

async function saveToShopify(email: string, token: string) {
  const res = await fetch(`https://${STORE}/admin/api/2025-01/customers.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({
      customer: {
        email,
        email_marketing_consent: { state: "subscribed", opt_in_level: "single_opt_in" },
      },
    }),
  });
  // 422 is Shopify's "already a customer" — that is a success from the
  // visitor's side, and telling them otherwise would be a lie.
  if (!res.ok && res.status !== 422) {
    throw new Error(`shopify ${res.status}`);
  }
}

async function saveLocally(email: string) {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.appendFile(LOCAL_FILE, `${JSON.stringify({ email, at: new Date().toISOString() })}\n`, "utf8");
}

export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
  }

  if (!LOOKS_LIKE_EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, code: "invalid_email" }, { status: 400 });
  }

  try {
    const token = await adminToken();
    if (token) {
      await saveToShopify(email, token);
    } else if (process.env.NODE_ENV !== "production") {
      await saveLocally(email);
    } else {
      throw new Error("no Shopify credentials in production");
    }
  } catch (error) {
    console.error("subscribe failed", error);
    return NextResponse.json({ ok: false, code: "store_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
