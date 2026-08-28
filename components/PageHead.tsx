import Reveal from "./Reveal";

type PageHeadProps = {
  eyebrow: string;
  heading: string;
  /** One factual line under the title — a count, a coordinate, a room name. */
  meta?: string;
  lede?: string;
  children?: React.ReactNode;
};

/**
 * The plate every page below the homepage opens on.
 *
 * The homepage opens on a photograph because it has one worth a whole screen.
 * The other pages open on a label instead: eyebrow, title, and one line of
 * fact. Keeping that shape identical across six pages is what makes them read
 * as rooms in one building rather than as six separate designs — the same
 * argument as the wall label on the pieces (CLAUDE.md §14).
 *
 * It is deliberately not a hero. There is no background image, no overlay and
 * no full-screen height: the visitor has already been sold the atmosphere on
 * the homepage, and what they want here is to know where they are.
 */
export default function PageHead({ eyebrow, heading, meta, lede, children }: PageHeadProps) {
  return (
    <section className="page-head">
      <div className="shell">
        <Reveal className="page-head-inner">
          <p className="label page-head-eyebrow">{eyebrow}</p>
          <h1 className="display d-1 page-head-title">{heading}</h1>
          {meta && <p className="label page-head-meta">{meta}</p>}
          {lede && <p className="lede page-head-lede">{lede}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
