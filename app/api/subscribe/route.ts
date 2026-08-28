import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * Email capture.
 *
 * This is the swap point for Shopify, in the same spirit as lib/catalog.ts: the
 * form talks to this route and nothing else, so moving to Shopify's customer
 * API is a change here alone.
 *
 * Until SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_TOKEN are set, addresses are
 * appended to a local file. That is a real store in development and an honest
 * one — it is NOT durable on a serverless host, where the filesystem is
 * ephemeral, so the Shopify path has to be configured before launch or
 * signups will be lost. It fails loudly rather than pretending to succeed.
 */

const STORE = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const LOCAL_FILE = path.join(process.cwd(), ".data", "subscribers.ndjson");

/** Deliberately permissive: rejecting valid-but-unusual addresses loses a sale. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/;

async function saveToShopify(email: string) {
  const res = await fetch(`https://${STORE}/admin/api/2025-01/customers.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN as string,
    },
    body: JSON.stringify({
      customer: { email, email_marketing_consent: { state: "subscribed", opt_in_level: "single_opt_in" } },
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
    if (STORE && TOKEN) {
      await saveToShopify(email);
    } else {
      await saveLocally(email);
    }
  } catch (error) {
    console.error("subscribe failed", error);
    return NextResponse.json({ ok: false, code: "store_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
