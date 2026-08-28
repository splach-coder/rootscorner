/**
 * Prove what /api/enquiry actually puts on the wire.
 *
 * The security-relevant part of lib/enquiry.ts is what ends up in mail headers:
 * the subject must come from the server's fixed set, and reply-to must never
 * carry anything a caller invented. Asserting that needs somewhere to catch the
 * request, and Resend has no sandbox — so this stands up a stub, points the
 * route at it with RESEND_ENDPOINT, and reads what arrived.
 *
 * Usage: node scripts/test-enquiry.mjs
 * Starts its own Next server on 3112 against the existing build.
 */
import { createServer } from "node:http";
import { spawn } from "node:child_process";

const STUB_PORT = 3199;
const APP_PORT = 3112;

const received = [];
const stub = createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    received.push({ auth: req.headers.authorization, body: JSON.parse(body) });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ id: "stub" }));
  });
});
await new Promise((r) => stub.listen(STUB_PORT, r));

const app = spawn(
  "npx",
  ["next", "start", "-p", String(APP_PORT)],
  {
    // Windows resolves npx to a .cmd, which Node refuses to spawn directly
    // since 20 — it needs a shell to do it.
    shell: process.platform === "win32",
    env: {
      ...process.env,
      RESEND_API_KEY: "re_stub",
      RESEND_ENDPOINT: `http://127.0.0.1:${STUB_PORT}/emails`,
      ENQUIRY_FROM: "site@example.com",
      ENQUIRY_TO: "dest@example.com",
    },
    stdio: "ignore",
  },
);

const url = `http://127.0.0.1:${APP_PORT}/api/enquiry`;
const post = (payload) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

// Wait for the server rather than sleeping a fixed amount.
for (let i = 0; i < 60; i += 1) {
  try {
    await fetch(`http://127.0.0.1:${APP_PORT}/api/enquiry`, { method: "POST" });
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 500));
  }
}

const checks = [];
const check = (name, pass, detail = "") =>
  checks.push({ name, pass, detail });

/* --- a normal enquiry --------------------------------------------------- */
received.length = 0;
let res = await post({
  topic: "message",
  fields: [
    { label: "Name", value: "  Dahab  " },
    { label: "Email", value: "a@b.com" },
    { label: "Message", value: "" }, // unanswered: must not be sent
  ],
  replyTo: "a@b.com",
});
check("accepted", res.status === 200, `status ${res.status}`);
const sent = received[0]?.body ?? {};
check("subject is the server's, not the caller's", sent.subject === "The Roots Corner — enquiry", sent.subject);
check("from is the configured sender", sent.from === "site@example.com", sent.from);
check("to is the configured recipient", JSON.stringify(sent.to) === '["dest@example.com"]', JSON.stringify(sent.to));
check("reply_to accepted for a clean address", sent.reply_to === "a@b.com", String(sent.reply_to));
check("values are trimmed", sent.text?.includes("Name\nDahab"), JSON.stringify(sent.text));
check("empty field omitted", !sent.text?.includes("Message"), JSON.stringify(sent.text));
check("api key sent as bearer", received[0]?.auth === "Bearer re_stub", String(received[0]?.auth));

/* --- a hostile reply-to -------------------------------------------------- */
received.length = 0;
res = await post({
  topic: "rug",
  fields: [{ label: "Size", value: "200 x 300" }],
  replyTo: "a@b.com\r\nBcc: victim@example.com",
});
check("hostile reply-to still accepted", res.status === 200, `status ${res.status}`);
check("hostile reply-to dropped, not forwarded", received[0]?.body.reply_to === undefined, JSON.stringify(received[0]?.body.reply_to));
check("rug topic gets the rug subject", received[0]?.body.subject === "The Roots Corner — Mrirt rug", received[0]?.body.subject);

/* --- the honeypot -------------------------------------------------------- */
received.length = 0;
res = await post({
  topic: "message",
  fields: [{ label: "Name", value: "bot" }],
  company: "Acme",
});
check("honeypot answers 200", res.status === 200, `status ${res.status}`);
check("honeypot sends nothing", received.length === 0, `${received.length} sent`);

app.kill();
stub.close();

let failed = 0;
for (const c of checks) {
  if (!c.pass) failed += 1;
  console.log(`${c.pass ? "ok  " : "FAIL"}  ${c.name}${c.pass ? "" : `  — ${c.detail}`}`);
}
console.log(failed ? `\n${failed} failed` : "\nenquiry endpoint: PASS");
process.exit(failed ? 1 : 0);
