"use client";

import { useState, type FormEvent } from "react";

export type InquiryField = {
  name: string;
  label: string;
  hint?: string;
  kind?: "text" | "email" | "textarea";
  required?: boolean;
  defaultValue?: string;
};

type InquiryFormProps = {
  fields: InquiryField[];
  /** Which of the server's fixed subjects this enquiry is sent under. */
  topic: "message" | "rug";
  instagram: string;
  /**
   * The WhatsApp number as digits, or null until the client supplies one. Held
   * as digits rather than a finished link because the handoff below has to
   * build a fresh one carrying whatever the visitor just typed.
   */
  whatsappDigits?: string | null;
  labels: {
    send: string;
    sending: string;
    sent: string;
    error: string;
    optional: string;
    viaInstagram: string;
    viaWhatsapp: string;
  };
};

type State = "idle" | "sending" | "sent" | "error";

/**
 * The enquiry form, for pieces and for Mrirt rugs.
 *
 * It posts to /api/enquiry, which hands the message to Resend. There is no
 * mailto: composing a mail in the visitor's own client asked someone who had
 * just typed their message to send it a second time from somewhere else.
 *
 * THE FORM ALWAYS RENDERS. An earlier version withheld the inputs until the
 * server could actually deliver, on the reasoning that a form which cannot send
 * is worse than none — the visitor believes they have written to someone and
 * then hears nothing. The client's call was that the page needs its form now
 * and the credentials follow, which is fair: a contact page without one reads
 * as unfinished.
 *
 * What makes that safe is the failure path. Nothing here ever claims to have
 * sent: "thank you" appears only on a 2xx from the route, and any failure —
 * including the 503 the route returns while Resend is unconfigured — keeps the
 * visitor's text on screen and HANDS IT ON. The WhatsApp link is rebuilt at that
 * moment carrying the whole message, so what they typed is not wasted; it walks
 * to a channel that works. That turns the fallback from an apology into a route,
 * and it means this page is already complete for a house that runs on WhatsApp,
 * with or without Resend.
 */
export default function InquiryForm({
  fields,
  topic,
  instagram,
  whatsappDigits,
  labels,
}: InquiryFormProps) {
  const [state, setState] = useState<State>("idle");
  /** What the visitor typed, kept so a failed send can carry it onward. */
  const [written, setWritten] = useState("");

  if (state === "sent") {
    return (
      <p className="lede inquiry-sent" role="status">
        {labels.sent}
      </p>
    );
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Answered fields only, in the order they were asked. An empty field is
    // left out rather than sent as a blank line.
    const answered = fields
      .map((field) => ({
        label: field.label,
        value: String(data.get(field.name) ?? "").trim(),
      }))
      .filter((field) => field.value.length > 0);

    setWritten(answered.map((f) => `${f.label}: ${f.value}`).join("\n"));
    setState("sending");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          fields: answered,
          replyTo: String(data.get("email") ?? ""),
          // The honeypot travels with the rest; the server decides.
          company: String(data.get("company") ?? ""),
        }),
      });

      // "Sent" is only ever said on the server's word. A 503 — the route with
      // no Resend key behind it — lands here as a failure, which is the point.
      setState(response.ok ? "sent" : "error");
    } catch {
      // Offline, or the request never left. Either way the visitor needs the
      // other channels rather than a spinner.
      setState("error");
    }
  };

  /**
   * The handoff. wa.me takes the message in the query, so a send that failed
   * becomes a WhatsApp message already written rather than a dead end.
   */
  const handoff =
    whatsappDigits && written
      ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(written)}`
      : whatsappDigits
        ? `https://wa.me/${whatsappDigits}`
        : null;

  return (
    <form className="inquiry" onSubmit={onSubmit}>
      {fields.map((field) => {
        const id = `inquiry-${field.name}`;
        const hintId = field.hint ? `${id}-hint` : undefined;

        return (
          <div key={field.name} className="inquiry-field">
            <label className="label inquiry-label" htmlFor={id}>
              {field.label}
              {!field.required && (
                <span className="inquiry-optional"> ({labels.optional})</span>
              )}
            </label>

            {field.kind === "textarea" ? (
              <textarea
                id={id}
                name={field.name}
                rows={5}
                required={field.required}
                defaultValue={field.defaultValue}
                aria-describedby={hintId}
                className="inquiry-input"
              />
            ) : (
              <input
                id={id}
                name={field.name}
                type={field.kind === "email" ? "email" : "text"}
                required={field.required}
                defaultValue={field.defaultValue}
                // Real autofill hints: an enquiry form that will not fill in
                // from the keyboard is one people abandon on a phone.
                autoComplete={
                  field.kind === "email"
                    ? "email"
                    : field.name === "name"
                      ? "name"
                      : "off"
                }
                aria-describedby={hintId}
                className="inquiry-input"
              />
            )}

            {field.hint && (
              <p id={hintId} className="inquiry-hint">
                {field.hint}
              </p>
            )}
          </div>
        );
      })}

      {/*
        The honeypot. Hidden from people, skipped by the keyboard, and left
        alone by autofill — but a bot that fills every input completes it, and
        the server drops the request.

        Hidden from sighted visitors ALONE would not do: a screen-reader user
        would be left filling in a field that silently discards their message.
        Hence aria-hidden and tabIndex -1 together, and CSS that moves it out of
        view rather than `display: none`, which is the first thing a bot checks.
      */}
      <div className="inquiry-trap" aria-hidden="true">
        <label htmlFor="inquiry-company">Company</label>
        <input
          id="inquiry-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="inquiry-actions">
        <button
          type="submit"
          // No `link` class: that draws the hairline rule this site uses for
          // text actions, and a rule under a filled plate is two treatments
          // fighting.
          className="label inquiry-send"
          disabled={state === "sending"}
        >
          {state === "sending" ? labels.sending : labels.send}
        </button>
      </div>

      {/* role="alert" so the failure is announced, not only drawn. The fields
          above are untouched, so nothing the visitor wrote is lost. */}
      {state === "error" && (
        <div className="inquiry-error" role="alert">
          <p className="prose">{labels.error}</p>
          <div className="inquiry-actions">
            {handoff && (
              <a
                href={handoff}
                className="link label"
                target="_blank"
                rel="noreferrer noopener"
              >
                {labels.viaWhatsapp}
              </a>
            )}
            <a
              href={instagram}
              className="link label"
              target="_blank"
              rel="noreferrer noopener"
            >
              {labels.viaInstagram}
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
