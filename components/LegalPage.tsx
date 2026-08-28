import Link from "next/link";
import PageHead from "./PageHead";
import Reveal from "./Reveal";
import { LEGAL_SLUGS, type LegalDoc } from "@/lib/legal";
import type { Locale } from "@/lib/dictionaries";

type LegalPageProps = {
  doc: LegalDoc;
  locale: Locale;
  eyebrow: string;
  /** Names of the other documents, for the rail at the foot. */
  index: Record<string, string>;
  indexLabel: string;
  faqLabel: string;
};

/**
 * The one layout every legal and information page uses.
 *
 * These pages are read, not looked at, so they get the plainest thing on the
 * site: one column at reading measure, numbered headings in the label register,
 * hairline rules. No photography — a picture beside a returns policy is a
 * decoration on a document somebody may be relying on.
 *
 * They are also the only pages here whose text may not be improved in passing.
 * Everything rendered comes from lib/legal.ts, transcribed from the client's own
 * live site, contradictions and all.
 *
 * The bottom padding is load-bearing, as it is on the closing band: the ground
 * descends into night before the footer, and that has to happen on empty ground
 * rather than under a paragraph (CLAUDE.md §17).
 */
export default function LegalPage({
  doc,
  locale,
  eyebrow,
  index,
  indexLabel,
  faqLabel,
}: LegalPageProps) {
  const others = [
    ...LEGAL_SLUGS.map((slug) => ({
      slug,
      href: `/${locale}/legal/${slug}`,
      label: index[slug] ?? slug,
    })),
    { slug: "faq", href: `/${locale}/faq`, label: faqLabel },
  ].filter((item) => item.slug !== doc.slug);

  return (
    <>
      <PageHead eyebrow={eyebrow} heading={doc.title} />

      <section className="section legal">
        {/* The last text on light ground: the sundown is fitted between this
            and the footer, and the padding below is the room it needs. */}
        <div className="shell legal-inner" data-descent-from="">
          <Reveal className="legal-body">
            {doc.blocks.map((block, i) => {
              switch (block.kind) {
                case "h":
                  return (
                    <h2 key={i} className="display d-3 legal-h">
                      {block.text}
                    </h2>
                  );

                case "p":
                  return (
                    <p key={i} className="legal-p">
                      {block.text}
                    </p>
                  );

                case "ul":
                  return (
                    <ul key={i} className="legal-list">
                      {block.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  );

                case "dl":
                  return (
                    <dl key={i} className="legal-dl">
                      {block.items.map(([term, detail], j) => (
                        <div key={j} className="legal-dl-row">
                          <dt className="legal-dt">{term}</dt>
                          <dd className="legal-dd">{detail}</dd>
                        </div>
                      ))}
                    </dl>
                  );

                case "table":
                  return (
                    // Wrapped so a wide table scrolls inside itself rather than
                    // pushing the page sideways on a phone.
                    <div key={i} className="legal-table-wrap">
                      <table className="legal-table">
                        <thead>
                          <tr>
                            {block.head.map((cell, j) => (
                              <th key={j} className="label">
                                {cell}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.rows.map((row, j) => (
                            <tr key={j}>
                              {row.map((cell, k) => (
                                <td key={k}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
              }
            })}
          </Reveal>

          <Reveal delay={80} className="legal-rail">
            <p className="label legal-rail-key">{indexLabel}</p>
            <ul className="legal-rail-list">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link href={item.href} className="link legal-rail-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
