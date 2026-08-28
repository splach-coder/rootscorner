"use client";

import { useState } from "react";

type NewsletterProps = {
  t: {
    eyebrow: string;
    heading: string;
    body: string;
    placeholder: string;
    submit: string;
    note: string;
    done: string;
    error: string;
  };
};

type State = "idle" | "sending" | "done" | "error";

/**
 * The last thing asked of a visitor.
 *
 * A rare piece is gone once it is gone, so the offer here is not "our
 * newsletter" — it is the only way to hear about a piece before someone else
 * does. That is the whole argument, and it is why the heading states the
 * problem rather than naming the mechanism.
 *
 * The field is a single rule, not a boxed input: the page has no other boxed
 * controls, and adding one here would import a form aesthetic from somewhere
 * else. Typing on a line is the same gesture as signing one.
 */
export default function Newsletter({ t }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    setState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (!res.ok || !data.ok) throw new Error("rejected");
      setState("done");
      setMessage(t.done);
    } catch {
      // The copy is the dictionary's, not the server's — the route answers in
      // codes so both locales stay in one place.
      setState("error");
      setMessage(t.error);
    }
  }

  return (
    <div className="keep-inner shell">
      <div className="keep-said">
        <p className="label keep-eyebrow">{t.eyebrow}</p>
        <h2 className="display d-1 keep-heading">{t.heading}</h2>
        <p className="prose keep-body">{t.body}</p>
      </div>

      <div className="keep-act">
        {/* The confirmation carries no d-3: .keep-done sets its own scale, and
            d-3 lives in globals.css at the same specificity, so which one wins
            would depend on import order rather than on intent. */}
        {state === "done" ? (
          <p className="keep-done display" role="status">
            {message}
          </p>
        ) : (
          <form className="keep-form" onSubmit={onSubmit} noValidate={false}>
            <label className="keep-field">
              <span className="sr-only">{t.placeholder}</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder={t.placeholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                className="keep-input"
                aria-describedby="keep-note"
                aria-invalid={state === "error"}
              />
            </label>
            <button type="submit" className="keep-submit label" disabled={state === "sending"}>
              {t.submit}
            </button>
          </form>
        )}

        <p id="keep-note" className="label keep-note" role={state === "error" ? "alert" : undefined}>
          {state === "error" ? message : t.note}
        </p>
      </div>
    </div>
  );
}
