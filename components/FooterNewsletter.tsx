"use client";

import { useState } from "react";
import Link from "next/link";

type Labels = {
  heading: string;
  body: string;
  placeholder: string;
  submit: string;
  consent: string;
  privacy: string;
  done: string;
  error: string;
};

/**
 * "Restons en contact." — the footer's sign-up (V2, 10 Oct).
 *
 * Posts to /api/subscribe, which records the address in Shopify with email
 * marketing consent (no newsletter is sent yet; the list is kept for later).
 * The consent line sits under the field, next to the privacy policy, so what a
 * visitor agrees to is stated where they agree to it.
 */
export default function FooterNewsletter({ labels, privacyHref }: { labels: Labels; privacyHref: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true }),
      });
      const data = (await res.json()) as { ok?: boolean };
      setState(res.ok && data.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="foot-news">
      <h2 className="display foot-news-heading">{labels.heading}</h2>
      <p className="foot-news-body">{labels.body}</p>
      {state === "done" ? (
        <p className="foot-news-done" role="status">
          {labels.done}
        </p>
      ) : (
        <form className="foot-news-form" onSubmit={onSubmit}>
          <label className="foot-news-field">
            <span className="sr-only">{labels.placeholder}</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder={labels.placeholder}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "error") setState("idle");
              }}
              aria-invalid={state === "error"}
              aria-describedby="foot-news-note"
            />
          </label>
          <button type="submit" className="label foot-news-submit" disabled={state === "sending"}>
            {labels.submit}
          </button>
        </form>
      )}
      <p id="foot-news-note" className="foot-news-note" role={state === "error" ? "alert" : undefined}>
        {state === "error" ? (
          labels.error
        ) : (
          <>
            {labels.consent}{" "}
            <Link prefetch={false} href={privacyHref} className="link">
              {labels.privacy}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
