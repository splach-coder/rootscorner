import Link from "next/link";
import PieceFrame from "./PieceFrame";
import Reveal from "./Reveal";
import PieceLabel from "./PieceLabel";
import type { Piece } from "@/lib/catalog";
import type { Locale } from "@/lib/dictionaries";

type PieceCardProps = {
  piece: Piece;
  locale: Locale;
  labels: { material: string; origin: string; dimensions: string };
  /** The room this piece is in, already translated. Absent inside a room. */
  room?: string;
  /** "Sold" in the current language. */
  sold: string;
  /** Stagger within a row, in ms. */
  delay?: number;
  sizes?: string;
};

/**
 * A piece, as a card.
 *
 * The collection used to be a register: 38 numbered lines with the same six
 * fields, read down the page like an archive. That was a defensible reading of
 * the brief's ban on catalogue presentation, and the client reversed it — this
 * page has to sell, and nobody buys from a list.
 *
 * So: photograph first and large, then the name, then the price. No border, no
 * shadow, no radius — the site has none of those anywhere, and a card that
 * announces itself as a card is the "big-retail-chain look" the brief bans. It
 * is a photograph with a label under it, which is what a card should be here.
 *
 * Sold is designed for rather than handled. Stock is one of everything, so a
 * sold piece is normal and frequent: the price is struck, the state is stated,
 * and the photograph stays at full strength — the piece is still worth seeing.
 */
export default function PieceCard({
  piece,
  locale,
  labels,
  room,
  sold,
  delay = 0,
  sizes = "(max-width: 640px) 46vw, (max-width: 1100px) 31vw, 30vw",
}: PieceCardProps) {
  const gone = !piece.available;

  return (
    <li className={gone ? "card is-gone" : "card"}>
      <Link href={`/${locale}/piece/${piece.slug}`} className="card-link swap-host">
        <PieceFrame
          piece={piece}
          shape="card-frame"
          delay={delay}
          width={1200}
          height={1500}
          sizes={sizes}
        />

        <Reveal delay={delay + 60} className="card-said">
          {room && <p className="label card-room">{room}</p>}
          <PieceLabel piece={piece} locale={locale} labels={labels} variant="sell" />
          {gone && <p className="label card-state">{sold}</p>}
        </Reveal>
      </Link>
    </li>
  );
}
