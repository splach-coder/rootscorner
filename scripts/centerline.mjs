/**
 * Derives the crescent's centreline — the path a pen would take to write it.
 *
 * The picto is a filled outline, not a stroke, so it cannot be "drawn" with
 * stroke-dashoffset directly: that would trace its silhouette rather than
 * write it. Instead the fill is revealed through a mask whose content is a
 * thick stroke travelling down the middle of the glyph.
 *
 * The outline is a closed contour that runs from the thin bottom-left tail up
 * the INNER edge to the top tip, then back down the OUTER edge to the tail. So
 * the two halves are natural opposites: resample each by normalised arc length
 * and average the pairs, and you get the medial line.
 *
 * Output is a Catmull-Rom fit, printed as a cubic path ready to paste.
 */

const D =
  "M2.33,98.85c.58,0,2.23.34,4.95,1.02,2.72.68,4.85,1.02,6.41,1.02,15.54,0,30.11-6.25,43.71-18.75,13.6-12.5,20.4-23.02,20.4-31.55,0-3.49-.98-6.98-2.91-10.47l-5.54-12.21c-.78-1.75-1.56-3.54-2.33-5.38-.78-1.84-1.16-3.83-1.16-5.96,0-.97.29-2.03.87-3.2.58-1.17.97-2.04,1.17-2.62l5.83-10.76c3.5,5.43,6.31,11.78,8.45,19.05,2.14,7.27,3.21,14.2,3.21,20.79,0,15.51-5.01,31.11-15.01,46.82-10.01,15.7-22.97,23.55-38.9,23.55-4.28,0-7.97-.39-11.07-1.16-3.11-.78-9.91-3.3-20.4-7.58l2.33-2.62Z";

/* ---- parse: only M/c/l/Z appear in this file ---- */
function tokenize(d) {
  const out = [];
  const re = /([MmCcLlZzHhVvSsQqTtAa])|(-?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?)/gi;
  let m;
  while ((m = re.exec(d))) out.push(m[1] ?? parseFloat(m[2]));
  return out;
}

function segments(d) {
  const t = tokenize(d);
  const segs = [];
  let i = 0;
  let cmd = null;
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;

  const num = () => t[i++];

  while (i < t.length) {
    if (typeof t[i] === "string") cmd = t[i++];
    if (cmd === "M" || cmd === "m") {
      const nx = cmd === "M" ? num() : x + num();
      const ny = cmd === "M" ? num() : y + num();
      x = sx = nx;
      y = sy = ny;
      cmd = cmd === "M" ? "L" : "l";
    } else if (cmd === "c" || cmd === "C") {
      const rel = cmd === "c";
      const x1 = (rel ? x : 0) + num();
      const y1 = (rel ? y : 0) + num();
      const x2 = (rel ? x : 0) + num();
      const y2 = (rel ? y : 0) + num();
      const nx = (rel ? x : 0) + num();
      const ny = (rel ? y : 0) + num();
      segs.push({ k: "c", p: [x, y, x1, y1, x2, y2, nx, ny] });
      x = nx;
      y = ny;
    } else if (cmd === "l" || cmd === "L") {
      const nx = (cmd === "l" ? x : 0) + num();
      const ny = (cmd === "l" ? y : 0) + num();
      segs.push({ k: "l", p: [x, y, nx, ny] });
      x = nx;
      y = ny;
    } else if (cmd === "z" || cmd === "Z") {
      segs.push({ k: "l", p: [x, y, sx, sy] });
      x = sx;
      y = sy;
    } else {
      throw new Error(`unhandled command ${cmd}`);
    }
  }
  return segs;
}

const cubic = (p, t) => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p[0] + b * p[2] + c * p[4] + d * p[6],
    a * p[1] + b * p[3] + c * p[5] + d * p[7],
  ];
};

/** Flatten to a dense polyline. */
function flatten(segs, per = 120) {
  const pts = [];
  for (const s of segs) {
    for (let j = 0; j <= per; j++) {
      const t = j / per;
      const pt =
        s.k === "c"
          ? cubic(s.p, t)
          : [s.p[0] + (s.p[2] - s.p[0]) * t, s.p[1] + (s.p[3] - s.p[1]) * t];
      const last = pts[pts.length - 1];
      if (!last || Math.hypot(pt[0] - last[0], pt[1] - last[1]) > 1e-9) pts.push(pt);
    }
  }
  return pts;
}

/** Resample a polyline to n points evenly spaced by arc length. */
function resample(pts, n) {
  const acc = [0];
  for (let i = 1; i < pts.length; i++)
    acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = acc[acc.length - 1];
  const out = [];
  let k = 0;
  for (let i = 0; i < n; i++) {
    const target = (total * i) / (n - 1);
    while (k < acc.length - 2 && acc[k + 1] < target) k++;
    const span = acc[k + 1] - acc[k];
    const t = span <= 0 ? 0 : (target - acc[k]) / span;
    out.push([
      pts[k][0] + (pts[k + 1][0] - pts[k][0]) * t,
      pts[k][1] + (pts[k + 1][1] - pts[k][1]) * t,
    ]);
  }
  return { pts: out, length: total };
}

const segs = segments(D);
const poly = flatten(segs);

/* The top tip: the contour's highest point. It divides inner edge from outer. */
let tip = 0;
for (let i = 1; i < poly.length; i++) if (poly[i][1] < poly[tip][1]) tip = i;

const inner = poly.slice(0, tip + 1); // bottom tail -> top tip
const outer = poly.slice(tip); // top tip -> bottom tail

const N = 220;
const a = resample(inner, N).pts.reverse(); // now top tip -> tail
const b = resample(outer, N).pts; // top tip -> tail

/* Average the pairs. Both now run tip -> tail, so index i on one matches i on
   the other by normalised arc length. */
const mid = a.map((p, i) => [(p[0] + b[i][0]) / 2, (p[1] + b[i][1]) / 2]);

/* Band width at each station — tells us how fat the mask stroke must be. */
const widths = a.map((p, i) => Math.hypot(p[0] - b[i][0], p[1] - b[i][1]));
const maxW = Math.max(...widths);

const fit = resample(mid, 15).pts;

/** Catmull-Rom -> cubic Bezier, so the emitted path is smooth and short. */
function toPath(p) {
  const f = (v) => Number(v.toFixed(2));
  let d = `M${f(p[0][0])},${f(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p[i + 1];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(
      p2[0] - (p3[0] - p1[0]) / 6,
    )},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}

console.log("contour points :", poly.length);
console.log("top tip        :", poly[tip].map((v) => v.toFixed(2)).join(", "));
console.log("tail           :", mid[mid.length - 1].map((v) => v.toFixed(2)).join(", "));
console.log("band width     : min", Math.min(...widths).toFixed(2), "max", maxW.toFixed(2));
console.log("centreline len :", resample(mid, N).length.toFixed(2));
console.log("\nstations (x, y, band width):");
for (let i = 0; i < N; i += 20)
  console.log(
    `  ${String(i).padStart(3)}  ${mid[i][0].toFixed(1).padStart(6)} ${mid[i][1]
      .toFixed(1)
      .padStart(6)}   ${widths[i].toFixed(1)}`,
  );
console.log("\npath:\n" + toPath(fit));

/* ---- verification: does the centreline stay inside the glyph, and does a
   stroke of the chosen width cover every part of it? ---- */

function inside(pt, poly) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi)
      hit = !hit;
  }
  return hit;
}

const fitPoly = flatten(segments(toPath(fit)), 60);
const strayed = fitPoly.filter((p) => !inside(p, poly)).length;

/* Every point of the glyph must fall within STROKE/2 of the fitted centreline,
   or the write-on would leave a sliver of the mark permanently unrevealed. */
const STROKE = 26;
const worst = poly.reduce((acc, p) => {
  let best = Infinity;
  for (const q of fitPoly) best = Math.min(best, Math.hypot(p[0] - q[0], p[1] - q[1]));
  return Math.max(acc, best);
}, 0);

console.log("\ncentreline points outside the glyph :", strayed, "/", fitPoly.length);
console.log("furthest glyph point from the line  :", worst.toFixed(2));
console.log(`stroke ${STROKE} covers everything    :`, worst <= STROKE / 2 ? "yes" : "NO");
