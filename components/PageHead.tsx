import Reveal from "./Reveal";

type PageHeadProps = {
  eyebrow: string;
  heading: string;
  /** One factual line under the title — a count, a coordinate, a room name. */
  meta?: string;
  lede?: string;
  /**
   * Keep the title for search engines and screen readers but not on screen.
   * The client asked for the visible titles off /collection and /contact
   * (feedback, 25 Sept). A page still needs one real h1: it is what Google
   * reads as the page's subject and what a screen reader announces first, so
   * the heading is hidden visually rather than deleted.
   */
  hideHeading?: boolean;
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
export default function PageHead({ eyebrow, heading, meta, lede, hideHeading, children }: PageHeadProps) {
  return (
    <section className="page-head">
      <div className="shell">
        <Reveal className="page-head-inner">
          <p className="label page-head-eyebrow">{eyebrow}</p>
          <h1 className={hideHeading ? "sr-only" : "display d-1 page-head-title"}>{heading}</h1>
          {meta && <p className="label page-head-meta">{meta}</p>}
          {lede && <p className="lede page-head-lede">{lede}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
