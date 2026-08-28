"""
Choose the hover image for every piece.

On hover a piece shows a second view of itself. Picking image[1] is unreliable:
for several pieces it is nearly the same frame, so the crossfade looks like a
glitch rather than a second look.

This picks the image that differs MOST from the primary, restricted to the same
orientation so the swap does not re-crop the subject. Result is written back to
docs/images.json as a `swap` index per piece.

Run after adding or reordering photography:
    python scripts/pick-swap.py
"""

import json
import os
from PIL import Image, ImageChops, ImageStat

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PIECES = os.path.join(ROOT, "public", "pieces")
MANIFEST = os.path.join(ROOT, "docs", "images.json")

SIZE = (48, 48)


def fingerprint(path):
    """Small grayscale thumbnail — enough to compare composition, cheap to do."""
    with Image.open(path) as im:
        return im.convert("L").resize(SIZE, Image.LANCZOS)


def orientation(path):
    with Image.open(path) as im:
        w, h = im.size
    return "landscape" if w > h else "portrait"


def difference(a, b):
    """Mean absolute difference, 0 (identical) to 255."""
    return ImageStat.Stat(ImageChops.difference(a, b)).mean[0]


manifest = json.load(open(MANIFEST, encoding="utf-8"))
changed = 0

for slug, entry in manifest.items():
    images = entry.get("images", [])
    if len(images) < 2:
        entry.pop("swap", None)
        continue

    primary = os.path.join(PIECES, images[0]["file"])
    base = fingerprint(primary)
    base_orientation = orientation(primary)

    # Prefer candidates that frame the piece the same way; fall back to all.
    candidates = [
        i
        for i in range(1, len(images))
        if orientation(os.path.join(PIECES, images[i]["file"])) == base_orientation
    ] or list(range(1, len(images)))

    scored = [
        (difference(base, fingerprint(os.path.join(PIECES, images[i]["file"]))), i)
        for i in candidates
    ]
    score, best = max(scored)

    entry["swap"] = best
    changed += 1
    print(f"{slug:52s} -> image {best}  (difference {score:.1f} of 255)")

json.dump(manifest, open(MANIFEST, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print(f"\nwrote swap index for {changed} pieces")
