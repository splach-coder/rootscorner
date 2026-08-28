import {
  cleanFields,
  isTopic,
  safeReplyTo,
  sendEnquiry,
} from "@/lib/enquiry";

/**
 * The one endpoint on the site.
 *
 * Takes what the enquiry form collected and hands it to Resend. Everything that
 * decides a mail header — the subject, the sender, the recipient — is decided
 * on this side; the request only supplies the body and, if it validates, an
 * address to reply to.
 *
 * Node runtime rather than edge: the throttle below keeps state in module
 * scope, which the edge runtime does not preserve in any useful way.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A request body larger than this is not an enquiry. */
const MAX_BODY_BYTES = 16_000;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/**
 * A doorstop, not a lock.
 *
 * This lives in the memory of one server instance, so on any platform that runs
 * more than one it throttles per instance rather than per site, and it resets on
 * every deploy. It is here because it costs nothing and stops a naive script;
 * it is NOT the answer if this endpoint is ever actually attacked. That answer
 * is a shared store or a WAF rule, and it should be added the first time abuse
 * shows up rather than assumed to be in place now.
 */
const hits = new Map<string, number[]>();

function throttled(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (forwarded?.split(",")[0] ?? "").trim() || "unknown";
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return Response.json({ ok: false }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;

  /**
   * The honeypot. A field the form renders but hides from people; a bot that
   * fills every input trips it.
   *
   * It answers 200 on purpose. Telling a bot it was caught teaches whoever
   * wrote it which field to leave alone next time, and nothing is lost by
   * letting it believe it succeeded.
   */
  if (typeof payload.company === "string" && payload.company.trim().length > 0) {
    return Response.json({ ok: true });
  }

  if (!isTopic(payload.topic)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const fields = cleanFields(payload.fields);
  if (!fields) {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (throttled(clientKey(request))) {
    return Response.json({ ok: false }, { status: 429 });
  }

  const result = await sendEnquiry(
    payload.topic,
    fields,
    safeReplyTo(payload.replyTo),
  );

  if (!result.ok) {
    // Logged without the message body: an enquiry carries a name and an
    // address, and neither belongs in a platform log.
    console.error(`enquiry failed: ${result.detail}`);
    return Response.json({ ok: false }, { status: result.status });
  }

  return Response.json({ ok: true });
}
