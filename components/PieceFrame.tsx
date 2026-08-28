import Image from "next/image";
import Reveal from "./Reveal";
import { imagePath, type Piece } from "@/lib/catalog";
import { displayName } from "@/lib/specs";

type PieceFrameProps = {
  piece: Piece;
  /** Frame shape, e.g. "frame-tall". */
  shape?: string;
  sizes: string;
  width: number;
  height: number;
  /** Stagger within a group, in ms. */
  delay?: number;
};

/**
 * A piece in its frame, with a second view underneath.
 *
 * Hovering crossfades to another photograph of the same piece — usually a
 * detail or a turn of the object, so the gesture answers "what else is there
 * to see" rather than just decorating. Which image is chosen is decided by
 * scripts/pick-swap.py, not by taking image[1] on faith.
 *
 * Pure CSS: the hover state lives on the enclosing `.swap-host`, so no client
 * component and no JavaScript. The swap layer is not rendered at all where
 * there is no hover (see sections.css), so touch devices never fetch it.
 */
export default function PieceFrame({
  piece,
  shape = "frame-tall",
  sizes,
  width,
  height,
  delay = 0,
}: PieceFrameProps) {
  const primary = imagePath(piece.images[0]);
  const swap = imagePath(piece.swapImage ?? undefined);
  if (!primary) return null;

  const name = displayName(piece);

  return (
    <Reveal
      variant="frame"
      delay={delay}
      className={`frame ${shape}${swap ? " frame-swap" : ""}`}
    >
      <Image src={primary} alt={name} width={width} height={height} sizes={sizes} />
      {swap && (
        <Image
          src={swap}
          // The swap is a second view of the piece already named by the first
          // image, so announcing it again would just repeat the name.
          alt=""
          aria-hidden="true"
          width={width}
          height={height}
          sizes={sizes}
          className="is-swap"
        />
      )}
    </Reveal>
  );
}
