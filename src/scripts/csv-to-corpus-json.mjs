import fs from "node:fs";
import path from "node:path";

const INPUT = process.argv[2] ?? "data/corpus.csv";
const OUTPUT = process.argv[3] ?? "src/data/corpus.json";

// --- Minimal CSV parser that handles quoted fields + commas inside quotes ---
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c === "\r") {
      // ignore
    } else {
      field += c;
    }
  }

  // last field
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function trimOrUndefined(v) {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

function normalizeImagePath(p) {
  const s = trimOrUndefined(p);
  if (!s) return undefined;
  // remove leading slashes so GitHub Pages + BASE_URL works
  return s.replace(/^\/+/, "");
}

function parseTags(tagsStr) {
  const s = trimOrUndefined(tagsStr);
  if (!s) return [];
  return s
    .split(";")
    .map(t => t.trim())
    .filter(Boolean);
}

const csvText = fs.readFileSync(INPUT, "utf8");
const rows = parseCSV(csvText);

if (rows.length < 2) {
  throw new Error("CSV seems empty. Ensure it has a header row + data rows.");
}

const header = rows[0].map(h => h.trim());
const required = ["id","title","description","image","method_of_making","animation","perceptual_realism","encodings","contextual","mechanisms","link"];
for (const key of required) {
  if (!header.includes(key)) {
    throw new Error(`Missing column "${key}". Found columns: ${header.join(", ")}`);
  }
}

const idx = Object.fromEntries(header.map((h, i) => [h, i]));

const items = rows.slice(1)
  .filter(r => r.some(cell => String(cell ?? "").trim().length > 0)) // skip empty lines
  .map((r, rowIndex) => {
    const id = trimOrUndefined(r[idx.id]);
    const title = trimOrUndefined(r[idx.title]);

    if (!id || !title) {
      throw new Error(`Row ${rowIndex + 2} missing required fields: id/title`);
    }

    const description = trimOrUndefined(r[idx.description]);
    const image = normalizeImagePath(r[idx.image]);
    const method_of_making = trimOrUndefined(r[idx.method_of_making]);
    const animation = trimOrUndefined(r[idx.animation]);
    const perceptual_realism = trimOrUndefined(r[idx.perceptual_realism]);
    const link = trimOrUndefined(r[idx.link]);

    const encodings = parseTags(r[idx.encodings]);
    const contextual = parseTags(r[idx.contextual]);
    const mechanisms = parseTags(r[idx.mechanisms]);


    return {
      id,
      title,
      ...(description ? { description } : {}),
      ...(image ? { image } : {}),
      ...(method_of_making ? { method_of_making } : {}),
      ...(animation ? { animation } : {}),
      ...(perceptual_realism ? { perceptual_realism } : {}),
      encodings,
      contextual,
      mechanisms,
      ...(link ? { link } : {}),
    };
  });

// Ensure output folder exists
fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(items, null, 2) + "\n", "utf8");

console.log(`✅ Wrote ${items.length} items to ${OUTPUT}`);