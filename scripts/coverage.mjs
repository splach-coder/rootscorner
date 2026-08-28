/** Report how complete the catalogue data actually is. */
import catalog from "../docs/catalog.json" with { type: "json" };

const NOT_A_DIMENSION = [
  /here you can describe the exact dimensions/i,
  /exact dimensions (will be )?available very soon/i,
  /^\s*[sml]\s*$/i,
];
const LABEL_PREFIX = /^\s*(features?|dimensions?|taille|size)\s*[:\-]?\s*/i;

function normalise(raw) {
  if (!raw) return null;
  const t = raw.replace(/\u00a0/g, " ").trim();
  if (!t || NOT_A_DIMENSION.some((re) => re.test(t))) return null;
  const v = t.replace(LABEL_PREFIX, "");
  return /\d/.test(v) ? v : null;
}

const rows = catalog.map((p) => ({
  name: p.name,
  dims: normalise(p.dimensions),
  raw: p.dimensions,
  desc: (p.description || []).length > 0,
}));

const good = rows.filter((r) => r.dims);
const bad = rows.filter((r) => !r.dims);
console.log(`dimensions usable: ${good.length}/${rows.length}`);
console.log(
  `descriptions present: ${rows.filter((r) => r.desc).length}/${rows.length}`,
);
console.log(`\npieces with NO usable dimension (${bad.length}):`);
for (const r of bad)
  console.log(`  ${r.name}\n      -> ${JSON.stringify(r.raw)}`);
