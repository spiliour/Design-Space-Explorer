import path from "node:path";
import xlsx from "xlsx";
import * as fs from "node:fs"; // or "fs"

const XLSX = xlsx?.default ?? xlsx;

const INPUT = process.argv[2] ?? "data/design_space.xlsx";
const OUTPUT = process.argv[3] ?? "src/data/designspace.json";

// If your repo name is different, update this (used only to strip accidental absolute paths)
const REPO_BASE_PREFIX = "/Design-Space-Explorer/";

function die(msg) {
  console.error("❌ " + msg);
  process.exit(1);
}

function readSheet(workbook, name) {
  const ws = workbook.Sheets[name];
  if (!ws) die(`Missing sheet "${name}". Found: ${workbook.SheetNames.join(", ")}`);
  return XLSX.utils.sheet_to_json(ws, { defval: "" }); // objects keyed by header row
}

function cleanStr(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function toInt(v) {
  const s = cleanStr(v);
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function normalizePath(p) {
  const s = cleanStr(p);
  if (!s) return null;

  // strip any quotes
  let out = s.replace(/^["']|["']$/g, "");
  if (!out) return null;

  out = out.replace(/\\/g, "/");

  // strip accidental full base like "/Design-Space-Explorer/..."
  if (out.startsWith(REPO_BASE_PREFIX)) out = out.slice(REPO_BASE_PREFIX.length);

  // strip leading slash(es)
  out = out.replace(/^\/+/, "");

  return out.length ? out : null;
}

function parseDetails(v) {
  const s = cleanStr(v);
  if (!s) return [];

  // If the cell contains JSON list like ["a","b"]
  try {
    const parsed = JSON.parse(s);
    if (Array.isArray(parsed)) {
      return parsed.map(x => String(x).trim()).filter(Boolean);
    }
  } catch (_) {
    // ignore
  }

  // Otherwise split by semicolon
  if (s.includes(";")) {
    return s.split(";").map(x => x.trim()).filter(Boolean);
  }

  // single bullet
  return [s];
}

function omitNull(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    out[k] = v;
  }
  return out;
}

function main() {
  if (!fs.existsSync(INPUT)) die(`Input file not found: ${INPUT}`);

  const buf = fs.readFileSync(INPUT);
  const wb = XLSX.read(buf, { type: "buffer" });

  const dimensionsRows = readSheet(wb, "dimensions");
  const cardsRows = readSheet(wb, "cards");

  // ---- Dimensions ----
  const dimensions = [];
  for (const r of dimensionsRows) {
    const id = cleanStr(r.dimension_id);
    if (!id) continue;

    dimensions.push({
      id,
      label: cleanStr(r.label) ?? id,
      description: cleanStr(r.description) ?? null,
      category: cleanStr(r.category) ?? "Uncategorized",
      color: cleanStr(r.color_hex) ?? null,
      icon: normalizePath(r.category_icon) ?? null,
      category_order: toInt(r.category_order) ?? 999,
      order: toInt(r.order) ?? 999,
    });
  }

  const dimById = new Map(dimensions.map(d => [d.id, d]));

  // ---- Cards grouped by dimension_id ----
  const cardsByDim = new Map(); // dim_id -> cards[]
  for (const r of cardsRows) {
    const dimId = cleanStr(r.dimension_id);
    const cardId = cleanStr(r.card_id);
    if (!dimId || !cardId) continue;

    if (!dimById.has(dimId)) {
      // Not fatal, but useful warning
      console.warn(`⚠️ Card "${cardId}" references unknown dimension_id "${dimId}"`);
    }

    const card = omitNull({
      id: cardId,
      title: cleanStr(r.title) ?? cardId,
      description: cleanStr(r.description) ?? null,
      details: parseDetails(r.details),
      image: normalizePath(r.image) ?? null,
      video: normalizePath(r.video) ?? null,
      example: cleanStr(r.example) ?? null, // Treat as corpus ID, not a path
      order: toInt(r.order) ?? 999,
    });

    // keep details even if empty
    if (!("details" in card)) card.details = [];

    if (!cardsByDim.has(dimId)) cardsByDim.set(dimId, []);
    cardsByDim.get(dimId).push(card);
  }

  // sort cards within each dimension
  for (const [dimId, list] of cardsByDim.entries()) {
    list.sort((a, b) => {
      const ao = a.order ?? 999;
      const bo = b.order ?? 999;
      if (ao !== bo) return ao - bo;
      return String(a.title ?? "").localeCompare(String(b.title ?? ""));
    });
  }

  // ---- Group dimensions into categories ----
  const categoriesMap = new Map(); // category -> dimensions[]
  for (const d of dimensions) {
    if (!categoriesMap.has(d.category)) categoriesMap.set(d.category, []);
    categoriesMap.get(d.category).push(d);
  }

  const categories = [];
  for (const [categoryName, dimList] of categoriesMap.entries()) {
    dimList.sort((a, b) => {
      const ao = a.order ?? 999;
      const bo = b.order ?? 999;
      if (ao !== bo) return ao - bo;
      return String(a.label ?? "").localeCompare(String(b.label ?? ""));
    });

    const dimsOut = dimList.map(d => ({
      id: d.id,
      label: d.label,
      description: d.description ?? undefined,
      color: d.color ?? undefined,
      icon: d.icon ?? undefined,
      order: d.order ?? 999,
      cards: cardsByDim.get(d.id) ?? [],
    }));

    categories.push({
      category: categoryName,
      order: Math.min(...dimList.map(d => d.category_order ?? 999)),
      dimensions: dimsOut,
    });
  }

  categories.sort((a, b) => {
    const ao = a.order ?? 999;
    const bo = b.order ?? 999;
    if (ao !== bo) return ao - bo;
    return String(a.category).localeCompare(String(b.category));
  });

  const out = {
    schema_version: 1,
    categories,
  };

  // ensure output dir exists
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(out, null, 2) + "\n", "utf8");

  const numDims = dimensions.length;
  let numCards = 0;
  for (const arr of cardsByDim.values()) numCards += arr.length;

  console.log(`✅ Wrote ${OUTPUT}`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Dimensions:  ${numDims}`);
  console.log(`   Cards:       ${numCards}`);
}

main();
