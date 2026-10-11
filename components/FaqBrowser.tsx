"use client";

import { useEffect, useState } from "react";

type Group = { id: string; title: string; items: { q: string; a: string[] }[] };

/**
 * The FAQ, categories first (V3, 11 Oct, after benirugs.com's FAQ).
 *
 * A visitor picks a category and only its questions appear. Every group is in
 * the HTML from the start (hidden, not absent), so search engines and the
 * FAQPage markup still see all of it, and a link to #category opens that
 * category directly.
 */
export default function FaqBrowser({
  groups,
  label,
}: {
  groups: Group[];
  label: string;
}) {
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (groups.some((g) => g.id === id)) setOpen(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [groups]);

  const choose = (id: string) => {
    setOpen(id);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      <nav className="faq-v2-nav" aria-label={label}>
        <ul>
          {groups.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                className="faq-v2-anchor"
                aria-pressed={open === g.id}
                aria-controls={g.id}
                onClick={() => choose(g.id)}
              >
                {g.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {groups.map((g) => (
        <section
          key={g.id}
          id={g.id}
          className="faq-v2-group"
          aria-labelledby={`${g.id}-title`}
          hidden={open !== g.id}
        >
          <h2 id={`${g.id}-title`} className="display faq-v2-group-title">
            {g.title}
          </h2>
          <div className="faq-v2-list">
            {g.items.map((item, i) => (
              <details key={i} className="faq-v2-item">
                <summary>{item.q}</summary>
                <div className="faq-v2-answer">
                  {item.a.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
