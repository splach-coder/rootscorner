import "server-only";

/**
 * Delivering an enquiry.
 *
 * SERVER ONLY. The import above is not decoration: this module reads
 * RESEND_API_KEY, and a key that reaches a client bundle is a key that has been
 * published. `server-only` turns an accidental import from a client component
 * into a build error rather than a leak.
 *
 * Resend is called over its REST API with plain fetch. The `resend` package
 * would add a dependency to do the same POST, and this way the whole contract —
 * what is sent, and what is not — is visible in one file.
 *
 * Nothing here is configured by default. With no key the route answers 503, and
 * that is a real answer rather than a silent drop: the form treats it as a
 * failure, keeps what the visitor wrote on screen and hands it to WhatsApp.
 * Nothing on this site ever tells someone their message was sent unless this
 * module says it was.
 */

/**
 * Resend's send endpoint.
 *
 * Overridable ONLY so scripts/test-enquiry.mjs can point it at a local stub and
 * assert what actually goes over the wire — the subject, the sender and the
 * reply-to are the security-relevant part of this file, and asserting them
 * needs somewhere to catch the request. Resend has no sandbox mode. Do not set
 * RESEND_ENDPOINT in production.
 */
const RESEND_ENDPOINT = process.env.RESEND_ENDPOINT || "https://api.resend.com/emails";

/** Where enquiries are delivered. Falls back to the address shown on the page. */
export function enquiryTo(): string | null {
  return process.env.ENQUIRY_TO || process.env.NEXT_PUBLIC_CONTACT_EMAIL || null;
}

/**
 * The sender. Must be on a domain verified in the Resend dashboard — Resend
 * rejects anything else, so there is no point defaulting it to a guess.
 */
export function enquiryFrom(): string | null {
  return process.env.ENQUIRY_FROM || null;
}

export type EnquiryField = { label: string; value: string };

/**
 * Subjects are chosen HERE, from a fixed set, and never taken from the request.
 *
 * The subject becomes a mail header. Letting a caller supply it hands them a
 * header to write, which is the classic injection route into an SMTP message —
 * and there is no reason to: the page only ever sends one of two kinds.
 */
const SUBJECTS = {
  message: "The Roots Corner — enquiry",
  rug: "The Roots Corner — Mrirt rug",
} as const;

export type EnquiryTopic = keyof typeof SUBJECTS;

export function isTopic(value: unknown): value is EnquiryTopic {
  return typeof value === "string" && value in SUBJECTS;
}

/**
 * Conservative, and deliberately not RFC-complete. It only has to decide
 * whether a string is safe to hand to a mail header, so it rejects whitespace,
 * newlines and commas outright rather than trying to accept every legal
 * address. A visitor with an exotic address still gets through — their address
 * is in the body either way, it just does not become the reply-to.
 */
const SAFE_EMAIL = /^[^\s@,<>;:"'\\]{1,64}@[^\s@,<>;:"'\\]{1,190}\.[a-z]{2,24}$/i;

export function safeReplyTo(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return SAFE_EMAIL.test(trimmed) ? trimmed : null;
}

const MAX_FIELDS = 12;
const MAX_LABEL = 80;
const MAX_VALUE = 4000;
const MAX_TOTAL = 8000;

/**
 * Accept only what the form is supposed to send, and truncate rather than
 * reject: a visitor who pastes an essay should not lose it to a 400.
 */
export function cleanFields(input: unknown): EnquiryField[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;

  const fields: EnquiryField[] = [];
  let total = 0;

  for (const raw of input.slice(0, MAX_FIELDS)) {
    if (!raw || typeof raw !== "object") continue;
    const { label, value } = raw as Record<string, unknown>;
    if (typeof label !== "string" || typeof value !== "string") continue;

    const cleanValue = value.trim().slice(0, MAX_VALUE);
    if (!cleanValue) continue; // an unanswered field is left out, not sent blank

    total += cleanValue.length;
    if (total > MAX_TOTAL) break;

    fields.push({ label: label.trim().slice(0, MAX_LABEL), value: cleanValue });
  }

  return fields.length > 0 ? fields : null;
}

/**
 * Send. Plain text: this is a message from one person to another, and an HTML
 * template would only give a copywriter somewhere else to invent things.
 */
export async function sendEnquiry(
  topic: EnquiryTopic,
  fields: EnquiryField[],
  replyTo: string | null,
): Promise<{ ok: true } | { ok: false; status: number; detail: string }> {
  const key = process.env.RESEND_API_KEY;
  const to = enquiryTo();
  const from = enquiryFrom();

  if (!key || !to || !from) {
    return { ok: false, status: 503, detail: "unconfigured" };
  }

  const text = fields.map((f) => `${f.label}\n${f.value}`).join("\n\n");

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: SUBJECTS[topic],
      text,
      // Present only when the address passed validation, so replying to an
      // enquiry can never be made to address someone the visitor chose.
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!response.ok) {
    // The body may carry the client's address; keep it out of the logs.
    return { ok: false, status: 502, detail: `resend ${response.status}` };
  }

  return { ok: true };
}
