# Instagram frames

Drop the photographs here, then list them in `docs/instagram.json`.

Instagram blocks unauthenticated access to post media — the profile page serves
a login wall and the JSON endpoints answer 429 — so these cannot be fetched
automatically. Two ways to get them:

1. **Save them by hand.** Fastest for a first pass.
2. **Download your information** (Instagram → Settings → Your activity →
   Download your information → choose JSON/HTML, high quality). This returns the
   ORIGINALS rather than the compressed CDN derivatives, which is the same
   problem CLAUDE.md §13 records for the product photography.

Then, for each one, add an entry to `docs/instagram.json`:

```json
[
  { "file": "01.jpg", "alt": "…", "permalink": "https://www.instagram.com/p/…/" }
]
```

- `file` — the filename in this folder. Required.
- `alt` — what is in the photograph. Optional; omitted means the tile is
  decorative and the section heading carries the meaning. **Do not invent one**
  (CLAUDE.md §5) — if you do not know what the piece is, leave it out.
- `permalink` — the post URL. Optional; without it the tile links to the profile.

Six frames fill the row exactly. More than six are ignored, fewer still work.
