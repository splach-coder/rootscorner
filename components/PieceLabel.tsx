import { formatPrice, type Piece } from "@/lib/catalog";
import { displayName, labelFor } from "@/lib/specs";
import type { Locale } from "@/lib/dictionaries";

type PieceLabelProps = {
  piece: Piece;
  locale: Locale;
  labels: { material: string; origin: string; dimensions: string };
  /**
   * `wall` sits under a photograph, `plate` is the standalone detail label, and
   * `sell` is the shop tile: name and price, nothing else.
   */
  variant?: "wall" | "plate" | "sell" | "specs";
};

/**
 * The wall label.
 *
 * Every piece on the site carries this, with the same fields in the same order:
 * name, then material / origin / dimensions, then price. The uniformity is the
 * point — a shared schema is what turns a grid of products into a collection.
 *
 * Fields the client has not supplied are omitted rather than filled, and the
 * schema is built to survive being read half-cropped, since that is how labels
 * are seen for most of their life on a scrolling page.
 *
 * The `specs` variant is the inverse of `sell`: the schema only, no name and no
 * price. The piece page renders both of those itself — the name as the page's
 * h1 at display scale, the price beside the enquiry action — so a label that
 * repeated them printed the name twice and the price twice. The old CSS hid
 * them with overrides on `.piece-label-column`, which is a rule that only works
 * as long as nobody rewrites that block. This says it in the markup instead.
 *
 * The `sell` variant drops the specs entirely. On a shop grid the buyer is
 * deciding whether they want the thing, not measuring it for a shelf — material
 * and dimensions belong on the piece page, where that question actually gets
 * asked. Carrying them into the grid made every tile read as a catalogue entry.
 */
export default function PieceLabel({
  piece,
  locale,
  labels,
  variant = "wall",
}: PieceLabelProps) {
  const fields = variant === "sell" ? [] : labelFor(piece, locale);
  const price = variant === "specs" ? null : formatPrice(piece, locale);
  const names: Record<string, string> = labels;

  const cls =
    variant === "plate"
      ? "wall-label wall-label-plate"
      : variant === "sell"
        ? "wall-label wall-label-sell"
        : variant === "specs"
          ? "wall-label wall-label-schema"
          : "wall-label";

  return (
    <div className={cls}>
      {variant !== "specs" && (
        <h3 className="display d-3 wall-label-name">{displayName(piece)}</h3>
      )}

      {fields.length > 0 && (
        <dl className="wall-label-specs">
          {fields.map((field) => (
            <div key={field.key} className="wall-label-row">
              <dt className="label wall-label-key">{names[field.key] ?? field.key}</dt>
              <dd className="wall-label-value">{field.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {price && <p className="wall-label-price">{price}</p>}
    </div>
  );
}
