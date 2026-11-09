// ReportSheetViewer.jsx — iframe designMode editor + Excel grid mode
// Fixed: script tag pollution in saved HTML
// Fixed: stale closure on notify — doc ref stored in useRef
// NEW: Excel grid mode with formula support

import { useEffect, useRef, useCallback, useMemo, forwardRef, useImperativeHandle, useState } from "react";

// ─── Convert 2D array → HTML ──────────────────────────────────────────────────
function arrayToHtml(data) {
  if (!data || !data.length) return "<p><br></p>";
  let html = "";
  let i = 0;

  while (i < data.length) {
    const row   = data[i];
    const cells = row.map(c => (c == null ? "" : String(c)));
    const ne    = cells.filter(c => c.trim() !== "");

    if (ne.length === 0) { html += "<p><br></p>"; i++; continue; }

    if (ne.length >= 2) {
      const block = [];
      while (i < data.length) {
        const r = data[i].map(c => (c == null ? "" : String(c)));
        if (r.filter(c => c.trim()).length >= 2) { block.push(r); i++; }
        else break;
      }
      const maxC   = Math.max(...block.map(r => r.length));
      const isHead = block[0]?.some(c => c && isNaN(Number(c.replace(/[><%†\s]/g, ""))));
      html += `<table><tbody>`;
      block.forEach((r, ri) => {
        html += "<tr>";
        for (let ci = 0; ci < maxC; ci++) {
          const v = esc(r[ci] ?? "");
          html += (ri === 0 && isHead) ? `<th>${v}</th>` : `<td>${v}</td>`;
        }
        html += "</tr>";
      });
      html += `</tbody></table>`;
      continue;
    }

    const text = cells[0].trim();
    if (text === text.toUpperCase() && text.length > 3 && text.length < 120 && /[A-Z]{4,}/.test(text)) {
      html += `<h2>${esc(text)}</h2>`;
    } else if (/^[A-Z][^:–\-]{0,35}[:–\-]/.test(text) && text.length < 80) {
      const m = text.match(/^([^:–\-]+[:–\-]\s*)([\s\S]*)$/);
      html += m ? `<p><strong>${esc(m[1])}</strong>${esc(m[2])}</p>` : `<p>${esc(text)}</p>`;
    } else {
      html += `<p>${esc(text)}</p>`;
    }
    i++;
  }
  return html || "<p><br></p>";
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/\n/g, "<br>");
}

function htmlToData(html) { return [["__html__", html]]; }

// ══════════════════════════════════════════════════════════════════════════════
// EXCEL GRID MODE HELPERS
// ══════════════════════════════════════════════════════════════════════════════

// Check if data is Excel grid (2D array) vs HTML mode
function isExcelData(data) {
  if (!data || !Array.isArray(data) || data.length === 0) return false;
  const first = data[0];
  // Excel: first row is an array, HTML: first row is ["__html__", ...]
  return Array.isArray(first) && first[0] !== "__html__";
}

// Build formula cache from 2D data
function buildFormulaCache(sheetData) {
  const cache = {};
  sheetData.forEach((row, rIdx) => {
    row.forEach((cell, cIdx) => {
      if (typeof cell === 'string' && cell.startsWith('=')) {
        cache[`${rIdx}_${cIdx}`] = cell;
      }
    });
  });
  return cache;
}

// Multi-pass formula evaluator
function reEvaluateFormulas(sheetData, cache) {
  if (!cache || Object.keys(cache).length === 0) return sheetData;
  console.log('[DEBUG] reEvaluateFormulas called:', { cacheSize: Object.keys(cache).length });
  let nextData = sheetData.map(row => [...(row || [])]);

  // Separate IF-only formulas from SUM/mixed formulas
  // IF formulas (col C, rows 2-108) must be evaluated BEFORE
  // SUM formulas (row 9, cols E-Q) that depend on them
  const allKeys = Object.keys(cache);
  const ifKeys  = allKeys.filter(k => {
    const f = (cache[k] || "").toUpperCase();
    return f.includes("IF(") && !f.includes("SUM(");
  });
  const otherKeys = allKeys.filter(k => {
    const f = (cache[k] || "").toUpperCase();
    return !f.includes("IF(") || f.includes("SUM(");
  });
  // Always: IF formulas first, then everything else
  const orderedKeys = [...ifKeys, ...otherKeys];

  // 5 passes ensures cascaded dependencies resolve
  for (let pass = 0; pass < 5; pass++) {
    for (const key of orderedKeys) {
      const [rStr, cStr] = key.split("_");
      const r = Number(rStr);
      const c = Number(cStr);
      if (!nextData[r]) continue;
      try {
        const result = evalFormula(cache[key], nextData);
        nextData[r][c] = result;
      } catch (err) {
        // Silently preserve formula cell on eval error
      }
    }
  }
  return nextData;
}

function colToLetters(idx) {
  let letters = "";
  idx += 1;
  while (idx > 0) {
    const rem = (idx - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    idx = Math.floor((idx - 1) / 26);
  }
  return letters;
}

function lettersToCol(letters) {
  let idx = 0;
  for (const ch of letters.toUpperCase()) idx = idx * 26 + (ch.charCodeAt(0) - 64);
  return idx - 1;
}

const SHEET_FN = {
  SUM: (...a) => SHEET_FN._nums(a).reduce((s, n) => s + n, 0),
  AVERAGE: (...a) => {
    const n = SHEET_FN._nums(a);
    return n.length ? n.reduce((s, v) => s + v, 0) / n.length : 0;
  },
  MIN: (...a) => { const n = SHEET_FN._nums(a); return n.length ? Math.min(...n) : 0; },
  MAX: (...a) => { const n = SHEET_FN._nums(a); return n.length ? Math.max(...n) : 0; },
  COUNT: (...a) => SHEET_FN._nums(a).length,
  COUNTA: (...a) => a.flat(Infinity).filter((v) => v !== "" && v != null).length,
  ROUND: (v, d = 0) => Number(Math.round(Number(v) + "e" + d) + "e-" + d) || 0,
  ROUNDUP: (v, d = 0) => Math.ceil(Number(v) * 10 ** d) / 10 ** d,
  ROUNDDOWN: (v, d = 0) => Math.floor(Number(v) * 10 ** d) / 10 ** d,
  ABS: (v) => Math.abs(Number(v)),
  INT: (v) => Math.floor(Number(v)),
  SQRT: (v) => Math.sqrt(Number(v)),
  POWER: (v, p) => Number(v) ** Number(p),
  AND: (...a) => a.flat(Infinity).every(Boolean),
  OR: (...a) => a.flat(Infinity).some(Boolean),
  NOT: (v) => !v,
  CONCATENATE: (...a) => a.flat(Infinity).join(""),
  TRIM: (v) => String(v ?? "").trim(),
  UPPER: (v) => String(v ?? "").toUpperCase(),
  LOWER: (v) => String(v ?? "").toLowerCase(),
  LEN: (v) => String(v ?? "").length,
  IFERROR: (v, fallback) => (v === null || v === undefined || Number.isNaN(v) ? fallback : v),
  _nums: (args) =>
    args.flat(Infinity)
      .map((v) => (typeof v === "number" ? v : parseFloat(v)))
      .filter((v) => typeof v === "number" && !Number.isNaN(v)),
};

const FN_NAMES = Object.keys(SHEET_FN).filter((k) => !k.startsWith("_"));
const SAFE_EXPR = /^[\s\d.+\-*/%^()<>=!,:&|?[\]\uE000A-Za-z_]*$/;

// Formula evaluator
function evalFormula(formula, grid) {
  if (!formula) return "";
  let e = formula.toString().trim();
  if (e.startsWith("=")) e = e.slice(1);

  const LIT_DELIM = "\uE000";
  const literals = [];
  const mask = (text) => `${LIT_DELIM}${literals.push(text) - 1}${LIT_DELIM}`;
  e = e.replace(/"([^"]*)"/g, (_, text) => mask(text));
  e = e.toUpperCase();

  const cellValue = (ref) => {
    const m = ref.match(/^\$?([A-Z]+)\$?(\d+)$/);
    if (!m) return 0;
    const cell = grid[parseInt(m[2], 10) - 1]?.[lettersToCol(m[1])];
    const raw = cell && typeof cell === "object" ? (cell.raw ?? cell.value ?? "") : cell;
    if (raw === "" || raw === null || raw === undefined) return 0;
    const str = String(raw).trim();
    const num = Number(str);
    return !Number.isNaN(num) && str !== "" ? num : str;
  };

  const emit = (value) => (typeof value === "number" ? String(value) : mask(value));

  // Range resolution A1:B5 -> [val1, val2, ...]
  e = e.replace(/\$?([A-Z]+)\$?(\d+):\$?([A-Z]+)\$?(\d+)/g, (_, c1, r1, c2, r2) => {
    const [ca, cb] = [lettersToCol(c1), lettersToCol(c2)].sort((x, y) => x - y);
    const [ra, rb] = [+r1 - 1, +r2 - 1].sort((x, y) => x - y);
    const cells = [];
    for (let r = ra; r <= rb; r++) {
      for (let c = ca; c <= cb; c++) cells.push(emit(cellValue(colToLetters(c) + (r + 1))));
    }
    return `[${cells.join(",")}]`;
  });

  // Function calls
  e = e.replace(/\b([A-Z][A-Z0-9.]*)\s*\(/g, (match, name) =>
    FN_NAMES.includes(name) ? `__fn.${name}(` : match
  );

  // Single cell references
  e = e.replace(/(?<!\.)\$?\b([A-Z]{1,3})\$?(\d+)\b/g, (match) => emit(cellValue(match)));

  // Convert IFs
  function convertIFs(s) {
    let out = "", i = 0;
    while (i < s.length) {
      if (s.slice(i, i + 3) === "IF(" && !/[A-Z0-9_.]/.test(s[i - 1] || "")) {
        i += 3;
        let depth = 0, args = [], cur = "";
        while (i < s.length) {
          const ch = s[i];
          if (ch === "(") { depth++; cur += ch; }
          else if (ch === ")") {
            if (depth === 0) { args.push(cur.trim()); i++; break; }
            depth--; cur += ch;
          } else if (ch === "," && depth === 0) { args.push(cur.trim()); cur = ""; }
          else { cur += ch; }
          i++;
        }
        if (args.length >= 3)
          out += `((${convertIFs(args[0])})?(${convertIFs(args[1])}):(${convertIFs(args[2])}))`;
        else if (args.length === 2)
          out += `((${convertIFs(args[0])})?(${convertIFs(args[1])}):(${mask("")}))`;
        else out += "0";
      } else { out += s[i++]; }
    }
    return out;
  }
  e = convertIFs(e);

  e = e.replace(/<>/g, "!==");
  e = e.replace(/(?<![<>=!])=(?![>=])/g, "===");
  e = e.replace(/&/g, "+");
  e = e.replace(/(\d)\s*\^\s*/g, "$1**");
  e = e.replace(/,\s*\)/g, ")");

  if (!SAFE_EXPR.test(e)) return 0;

  e = e.replace(new RegExp(`${LIT_DELIM}\\d+${LIT_DELIM}`, "g"), (m) => {
    const i = m.replace(new RegExp(LIT_DELIM, "g"), "");
    return JSON.stringify(literals[+i]);
  });

  try {
    const result = new Function("__fn", `return (${e})`)(SHEET_FN);
    if (result === null || result === undefined) return "";
    if (typeof result === "boolean") return result ? 1 : 0;
    if (typeof result === "string") return result;
    if (!isFinite(result) || Number.isNaN(result)) return 0;
    return Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
  } catch { return 0; }
}

function getHtml(data) {
  if (!data) return null;
  if (Array.isArray(data) && data.length > 0) {
    const first = data[0];
    if (Array.isArray(first) && first[0] === "__html__") {
      return first[1] || "<p><br></p>";
    }
  }
  if (typeof data === "object" && !Array.isArray(data)) {
    const first = data[0];
    if (first && first[0] === "__html__") return first[1] || "<p><br></p>";
  }
  if (typeof data === "string" && data.trim().startsWith("<")) return data;
  return null;
}

function buildDoc(bodyHtml) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; background: #fff;
    font-family: 'Times New Roman', Georgia, serif;
    font-size: 13px; color: #111; line-height: 1.6;
  }
  body { padding: 48px 56px 80px; min-height: 900px; outline: none; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0 12px; }
  td, th { border: 1px solid #000; padding: 5px 10px; vertical-align: top; text-align: left; }
  th { background: #f0f0f0; font-weight: bold; }
  tr:nth-child(even) td { background: #fafafa; }
  h1 { font-size: 15px; font-weight: bold; text-align: center; margin: 14px 0 6px; }
  h2 { font-size: 13px; font-weight: bold; margin: 12px 0 5px; }
  h3 { font-size: 13px; font-weight: bold; margin: 10px 0 4px; }
  p  { margin: 0 0 5px; }
  ul { list-style: disc; padding-left: 28px; margin: 4px 0 8px; }
  ol { list-style: decimal; padding-left: 28px; margin: 4px 0 8px; }
  li { margin-bottom: 3px; }
  a  { color: #0563C1; text-decoration: underline; }
  img { max-width: 100%; height: auto; display: block; margin: 8px 0; cursor: pointer; }
  img.selected, img:focus { outline: 2px solid #3B82F6; outline-offset: 2px; }
  strong, b { font-weight: bold; }
  em, i { font-style: italic; }
  u { text-decoration: underline; }
  s, strike { text-decoration: line-through; }
  sub { font-size: 10px; vertical-align: sub; }
  sup { font-size: 10px; vertical-align: super; }
  ::selection, *::selection { background: #3B82F6 !important; color: #fff !important; }
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// EXCEL GRID COMPONENT (formulas + merges + column widths + resizing)
// ══════════════════════════════════════════════════════════════════════════════
const DEFAULT_COL_W = 110;
const DEFAULT_ROW_H = 28;
const ROW_HEADER_W = 46;

// 0-based column index → A, B, … Z, AA, AB …
function colLabel(idx) {
  let out = "";
  let n = idx + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}

// Props that belong on the <td> vs the inner display element.
const TD_PROPS = new Set(["backgroundColor", "borderTop", "borderRight", "borderBottom", "borderLeft", "verticalAlign"]);
function splitCellStyle(raw = {}) {
  const td = {};
  const inner = {};
  for (const [k, v] of Object.entries(raw)) {
    if (TD_PROPS.has(k)) td[k] = v;
    else inner[k] = v;
  }
  return [td, inner];
}

// Editable cell that grows to fit its content, the way Excel auto-fits a
// wrapped row instead of hiding the overflow.
function AutoCell({ value, style, onChange }) {
  const ref = useRef(null);

  const fit = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(fit, [value, style?.fontSize, style?.minHeight]);

  return (
    <textarea
      ref={ref}
      value={value}
      title={value}
      onChange={(e) => { onChange(e.target.value); fit(); }}
      onInput={fit}
      style={{
        display: "block",
        width: "100%",
        border: "none",
        outline: "none",
        background: "transparent",
        resize: "none",
        overflow: "hidden",
        fontFamily: "inherit",
        ...style,
      }}
    />
  );
}

function ExcelGrid({
  data,
  formulaCache: externalFormulaCache,
  rowHeights,
  colWidths,
  merges,
  cellStyles,
  readOnly,
  onDataChange,
}) {
  const [sheetData, setSheetData] = useState(data || []);
  const formulaCacheRef = useRef({});

  const colCount = useMemo(
    () => Math.max(1, ...(sheetData || []).map(r => (r || []).length)),
    [sheetData]
  );

  // Excel stores row height in points and column width in characters; the
  // parser already converts widths to px, heights stay in points.
  const [colW, setColW] = useState({});
  const [rowH, setRowH] = useState({});
  const resizeRef = useRef(null);

  useEffect(() => {
    setColW(colWidths && typeof colWidths === "object" ? { ...colWidths } : {});
  }, [colWidths]);

  useEffect(() => {
    if (!rowHeights || typeof rowHeights !== "object") { setRowH({}); return; }
    const px = {};
    for (const [k, pts] of Object.entries(rowHeights)) {
      const v = Number(pts);
      if (v > 0) px[k] = Math.round(v * 1.33);
    }
    setRowH(px);
  }, [rowHeights]);

  const getColW = (c) => colW[c] ?? colW[String(c)] ?? DEFAULT_COL_W;
  const getRowH = (r) => rowH[r] ?? rowH[String(r)] ?? null;

  // Merges live in state so inserting/deleting rows and columns can shift them
  // the way Excel does, instead of leaving the spans pointing at stale indices.
  const [mergeList, setMergeList] = useState([]);
  useEffect(() => {
    setMergeList(Array.isArray(merges) ? merges.map(m => [...m]) : []);
  }, [merges]);

  const [styleMap, setStyleMap] = useState({});
  useEffect(() => {
    setStyleMap(cellStyles && typeof cellStyles === "object" ? { ...cellStyles } : {});
  }, [cellStyles]);

  // ── Merge lookup ───────────────────────────────────────────────────────────
  // anchors: "r_c" → { rowSpan, colSpan }; covered: cells swallowed by a merge
  // and therefore skipped entirely while rendering.
  const { anchors, covered } = useMemo(() => {
    const a = {};
    const cov = new Set();
    for (const m of mergeList) {
      if (!Array.isArray(m) || m.length < 4) continue;
      const [r1, c1, r2, c2] = m.map(Number);
      if ([r1, c1, r2, c2].some(Number.isNaN)) continue;
      const rowSpan = r2 - r1 + 1;
      const colSpan = c2 - c1 + 1;
      if (rowSpan < 1 || colSpan < 1 || (rowSpan === 1 && colSpan === 1)) continue;
      a[`${r1}_${c1}`] = { rowSpan, colSpan };
      for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
          if (r !== r1 || c !== c1) cov.add(`${r}_${c}`);
        }
      }
    }
    return { anchors: a, covered: cov };
  }, [mergeList]);

  // Build formula cache on mount (use external cache if provided)
  useEffect(() => {
    formulaCacheRef.current = externalFormulaCache || buildFormulaCache(data || []);
    setSheetData(reEvaluateFormulas(data || [], formulaCacheRef.current));
  }, []);

  // Accept data pushed down from the parent (the Add Row / Add Column toolbar),
  // but ignore the echo of what this grid itself just emitted so typing is not
  // clobbered mid-edit.
  const emittedRef = useRef(null);
  useEffect(() => {
    if (!data || data === emittedRef.current) return;
    setSheetData(prev => (data === prev ? prev : reEvaluateFormulas(data, formulaCacheRef.current)));
  }, [data]);

  const emit = (next) => {
    emittedRef.current = next;
    if (onDataChange) setTimeout(() => onDataChange(next), 0);
  };

  // Only sync cache when it changes externally (not data)
  useEffect(() => {
    if (externalFormulaCache && Object.keys(externalFormulaCache).length > 0) {
      formulaCacheRef.current = externalFormulaCache;
    }
  }, [externalFormulaCache]);

  const handleCellChange = (rowIdx, colIdx, value) => {
    if (readOnly) return;
    if (formulaCacheRef.current[`${rowIdx}_${colIdx}`]) return; // formula cell

    setSheetData(prev => {
      const next = prev.map(r => [...(r || [])]);
      while (next.length <= rowIdx) next.push([]);
      next[rowIdx][colIdx] = value === "" ? "" : isNaN(value) ? value : Number(value);

      const recalculated = reEvaluateFormulas(next, formulaCacheRef.current);
      emit(recalculated);
      return recalculated;
    });
  };

  // ── Drag-to-resize ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      const st = resizeRef.current;
      if (!st) return;
      if (st.kind === "col") {
        const w = Math.max(40, st.start + (e.clientX - st.origin));
        setColW(prev => ({ ...prev, [st.index]: w }));
      } else {
        const h = Math.max(20, st.start + (e.clientY - st.origin));
        setRowH(prev => ({ ...prev, [st.index]: h }));
      }
    };
    const onUp = () => {
      if (!resizeRef.current) return;
      resizeRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const startResize = (kind, index, e) => {
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = {
      kind,
      index,
      origin: kind === "col" ? e.clientX : e.clientY,
      start: kind === "col" ? getColW(index) : (getRowH(index) ?? DEFAULT_ROW_H),
    };
    document.body.style.cursor = kind === "col" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
  };

  // ── Row / column structure operations ──────────────────────────────────────
  const [ctxMenu, setCtxMenu] = useState(null); // { kind, index, x, y }

  useEffect(() => {
    if (!ctxMenu) return;
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [ctxMenu]);

  // Re-key an "r_c" map after rows/columns move, dropping anything deleted.
  const shiftKeyedMap = (map, kind, at, delta) => {
    const out = {};
    for (const [k, v] of Object.entries(map || {})) {
      const [rs, cs] = k.split("_");
      let r = Number(rs);
      let c = Number(cs);
      if (Number.isNaN(r) || Number.isNaN(c)) continue;
      const pos = kind === "row" ? r : c;
      if (delta < 0 && pos === at) continue; // lived on the deleted line
      if (pos >= at) {
        if (kind === "row") r += delta;
        else c += delta;
      }
      out[`${r}_${c}`] = v;
    }
    return out;
  };

  const shiftSizeMap = (map, at, delta) => {
    const out = {};
    for (const [k, v] of Object.entries(map || {})) {
      let i = Number(k);
      if (Number.isNaN(i)) continue;
      if (delta < 0 && i === at) continue;
      if (i >= at) i += delta;
      out[i] = v;
    }
    return out;
  };

  const shiftMerges = (list, kind, at, delta) => {
    const out = [];
    for (const m of list) {
      let [r1, c1, r2, c2] = m.map(Number);
      if (kind === "row") {
        if (delta < 0 && r1 === at && r2 === at) continue; // merge vanished
        if (r1 >= at) r1 += delta;
        if (r2 >= at) r2 += delta;
      } else {
        if (delta < 0 && c1 === at && c2 === at) continue;
        if (c1 >= at) c1 += delta;
        if (c2 >= at) c2 += delta;
      }
      if (r2 >= r1 && c2 >= c1) out.push([r1, c1, r2, c2]);
    }
    return out;
  };

  const applyStructureChange = (kind, at, delta) => {
    setSheetData(prev => {
      let next = prev.map(r => [...(r || [])]);
      if (kind === "row") {
        if (delta > 0) next.splice(at, 0, Array.from({ length: colCount }, () => ""));
        else next.splice(at, 1);
        if (next.length === 0) next = [Array.from({ length: colCount }, () => "")];
      } else {
        next = next.map(r => {
          const row = [...r];
          while (row.length < colCount) row.push("");
          if (delta > 0) row.splice(at, 0, "");
          else row.splice(at, 1);
          return row;
        });
      }
      formulaCacheRef.current = shiftKeyedMap(formulaCacheRef.current, kind, at, delta);
      const recalculated = reEvaluateFormulas(next, formulaCacheRef.current);
      emit(recalculated);
      return recalculated;
    });

    setStyleMap(prev => shiftKeyedMap(prev, kind, at, delta));
    setMergeList(prev => shiftMerges(prev, kind, at, delta));
    if (kind === "row") setRowH(prev => shiftSizeMap(prev, at, delta));
    else setColW(prev => shiftSizeMap(prev, at, delta));
    setCtxMenu(null);
  };

  const openCtx = (kind, index, e) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();
    setCtxMenu({ kind, index, x: e.clientX, y: e.clientY });
  };

  if (!sheetData || sheetData.length === 0) {
    return <div style={{ padding: 40, textAlign: "center", color: "#666" }}>Empty sheet</div>;
  }

  const totalWidth = ROW_HEADER_W + Array.from({ length: colCount }, (_, c) => getColW(c)).reduce((a, b) => a + b, 0);

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#F9FAFB", padding: 16, position: "relative" }}>
      {ctxMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed", left: ctxMenu.x, top: ctxMenu.y, zIndex: 50,
            minWidth: 190, background: "#fff", borderRadius: 8,
            border: "1px solid #E5E7EB", boxShadow: "0 6px 20px rgba(0,0,0,0.16)",
            padding: 4, fontSize: 12,
          }}
        >
          {(ctxMenu.kind === "row"
            ? [
                ["Insert row above", () => applyStructureChange("row", ctxMenu.index, 1)],
                ["Insert row below", () => applyStructureChange("row", ctxMenu.index + 1, 1)],
                ["Delete row", () => applyStructureChange("row", ctxMenu.index, -1)],
              ]
            : [
                ["Insert column left", () => applyStructureChange("col", ctxMenu.index, 1)],
                ["Insert column right", () => applyStructureChange("col", ctxMenu.index + 1, 1)],
                ["Delete column", () => applyStructureChange("col", ctxMenu.index, -1)],
              ]
          ).map(([label, fn]) => (
            <button
              key={label}
              onClick={fn}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "7px 10px", border: "none", background: "transparent",
                cursor: "pointer", borderRadius: 5,
                color: label.startsWith("Delete") ? "#DC2626" : "#374151",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F3F4F6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <table
        style={{
          borderCollapse: "collapse",
          tableLayout: "fixed",
          width: totalWidth,
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <colgroup>
          <col style={{ width: ROW_HEADER_W }} />
          {Array.from({ length: colCount }, (_, c) => (
            <col key={c} style={{ width: getColW(c) }} />
          ))}
        </colgroup>

        {/* Column letters — matches Excel so users can orient themselves */}
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #E5E7EB", background: "#F3F4F6",
                position: "sticky", top: 0, zIndex: 3, height: 26,
              }}
            />
            {Array.from({ length: colCount }, (_, c) => (
              <th
                key={c}
                onContextMenu={(e) => openCtx("col", c, e)}
                title={readOnly ? "" : "Right-click to insert or delete a column"}
                style={{
                  border: "1px solid #E5E7EB", background: "#F3F4F6",
                  fontSize: 11, fontWeight: 600, color: "#6B7280",
                  position: "sticky", top: 0, zIndex: 3, height: 26,
                  padding: 0, textAlign: "center", overflow: "hidden",
                }}
              >
                <div style={{ position: "relative", padding: "4px 0" }}>
                  {colLabel(c)}
                  <span
                    onMouseDown={(e) => startResize("col", c, e)}
                    title="Drag to resize column"
                    style={{
                      position: "absolute", top: -4, right: -3, width: 6, height: 26,
                      cursor: "col-resize", zIndex: 4,
                    }}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sheetData.map((row, rIdx) => {
            const h = getRowH(rIdx);
            return (
              <tr key={rIdx}>
                <td
                  onContextMenu={(e) => openCtx("row", rIdx, e)}
                  title={readOnly ? "" : "Right-click to insert or delete a row"}
                  style={{
                    border: "1px solid #E5E7EB", background: "#F3F4F6",
                    fontSize: 11, color: "#9CA3AF", textAlign: "center",
                    position: "sticky", left: 0, zIndex: 2, padding: 0,
                    overflow: "hidden", verticalAlign: "top",
                  }}
                >
                  <div style={{ position: "relative", padding: "4px 0" }}>
                    {rIdx + 1}
                    <span
                      onMouseDown={(e) => startResize("row", rIdx, e)}
                      title="Drag to resize row"
                      style={{
                        position: "absolute", left: 0, right: 0, bottom: -4, height: 6,
                        cursor: "row-resize", zIndex: 4,
                      }}
                    />
                  </div>
                </td>

                {Array.from({ length: colCount }, (_, cIdx) => {
                  const key = `${rIdx}_${cIdx}`;
                  if (covered.has(key)) return null; // swallowed by a merge

                  const span = anchors[key];
                  const isFormula = !!formulaCacheRef.current[key];
                  const raw = row?.[cIdx];
                  const safeValue =
                    raw === null || raw === undefined || Number.isNaN(raw) ||
                    raw === Infinity || raw === -Infinity
                      ? ""
                      : String(raw);

                  const [tdCss, innerCss] = splitCellStyle(styleMap[key] || {});
                  const tdStyle = {
                    borderTop: "1px solid #E5E7EB",
                    borderRight: "1px solid #E5E7EB",
                    borderBottom: "1px solid #E5E7EB",
                    borderLeft: "1px solid #E5E7EB",
                    padding: 0,
                    background: isFormula
                      ? "#FFF9C4"
                      : (tdCss.backgroundColor || (span ? "#FAFAFA" : "transparent")),
                    verticalAlign: "top",
                    ...tdCss,
                  };

                  // Row height is a floor, never a ceiling: Excel auto-fits
                  // wrapped text and clipping it is what made cells unreadable.
                  const innerStyle = {
                    padding: "5px 8px",
                    fontSize: 12,
                    lineHeight: 1.45,
                    color: isFormula ? "#856404" : "#374151",
                    fontWeight: isFormula ? 600 : 400,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    ...innerCss,
                    minHeight: span ? undefined : (h ?? DEFAULT_ROW_H),
                    boxSizing: "border-box",
                  };

                  return (
                    <td
                      key={cIdx}
                      rowSpan={span?.rowSpan}
                      colSpan={span?.colSpan}
                      style={tdStyle}
                    >
                      {readOnly || isFormula ? (
                        <div
                          title={isFormula ? `Formula: ${formulaCacheRef.current[key]}` : safeValue}
                          style={innerStyle}
                        >
                          {safeValue}
                        </div>
                      ) : (
                        <AutoCell
                          value={safeValue}
                          style={innerStyle}
                          onChange={(val) =>
                            handleCellChange(rIdx, cIdx, val === "" ? "" : isNaN(val) ? val : Number(val))
                          }
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
const ReportSheetViewer = forwardRef(function ReportSheetViewer({
  data,
  formulaCache,
  rowHeights,
  colWidths,
  merges,
  cellStyles,
  readOnly = false,
  onDataChange,
  onCreateReport,
  reportMode = false,
}, ref) {
  const iframeRef  = useRef(null);
  const onChgRef   = useRef(onDataChange);
  onChgRef.current = onDataChange;
  const timerRef   = useRef(null);

  // KEY FIX: Store live doc reference so notify() always reads current doc, never stale
  const docRef     = useRef(null);
  const mountedRef = useRef(false); // track if iframe already initialized

  // notify reads from docRef.current — always fresh, never a stale closure
  const notify = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const doc = docRef.current;
      if (!doc || !onChgRef.current) return;
      const clone = doc.body.cloneNode(true);
      clone.querySelectorAll("script").forEach(s => s.remove());
      const html = clone.innerHTML;
      if (!html || html === "<p><br></p>" || html.trim() === "") return;
      onChgRef.current(htmlToData(html));
    }, 300);
  }, []);

  useImperativeHandle(ref, () => ({
    getCurrentData: (opts = {}) => {
      const allowEmpty = !!opts.allowEmpty;
      const doc = docRef.current;
      if (!doc) return null;
      const clone = doc.body.cloneNode(true);
      clone.querySelectorAll("script").forEach(s => s.remove());
      const html = clone.innerHTML;
      if (!allowEmpty && (!html || html === "<p><br></p>" || html.trim() === "")) return null;
      return htmlToData(html || "<p><br></p>");
    },
  }), []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // FIX: Sirf first mount pe doc.write() karo
    // Har data change pe rewrite karne se undo stack wipe hota tha
    if (mountedRef.current) return;
    mountedRef.current = true;

    const stored = getHtml(data);
    const html   = stored !== null ? stored : arrayToHtml(data);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(buildDoc(html));
    doc.close();

    // Store fresh doc reference AFTER write
    docRef.current = doc;

    if (!readOnly) {
      doc.designMode = "on";

      const script = doc.createElement("script");
      script.textContent = `(function() {
        var RE_BODY  = /<body[^>]*>([\\s\\S]*?)<\\/body>/i;
        var RE_CMT   = /<!--[\\s\\S]*?-->/g;
        var RE_NS    = /<\\/?(?:o|w|m|v):[^>]*>/gi;
        var RE_MSO   = /\\s*style="[^"]*mso-[^"]*"/gi;
        var RE_CLASS = / class="[^"]*"/gi;
        var RE_SPAN  = /<span[^>]*>(?:<span[^>]*>)*([^<]*?)<\\/span>/gi;

        window.__savedRange = null;
        var restoring = false;

        document.addEventListener('mousedown', function(e) {
          if (e.button === 0) window.__savedRange = null;
        });

        document.addEventListener('mouseup', function() {
          requestAnimationFrame(function() {
            var sel = window.getSelection();
            if (sel && !sel.isCollapsed && sel.rangeCount) {
              window.__savedRange = sel.getRangeAt(0).cloneRange();
            } else if (window.__savedRange && !restoring) {
              restoring = true;
              sel.removeAllRanges();
              sel.addRange(window.__savedRange);
              restoring = false;
            }
          });
        });

        document.addEventListener('keydown', function(e) {
          if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            var range = document.createRange();
            range.selectNodeContents(document.body);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            window.__savedRange = range.cloneRange();
            return;
          }
          if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
            window.__savedRange = null;
          }
        });

        document.addEventListener('copy', function(e) {
          var sel = window.getSelection();
          var useRange = (sel && !sel.isCollapsed && sel.rangeCount)
            ? sel.getRangeAt(0) : window.__savedRange;
          if (!useRange) return;
          var div = document.createElement('div');
          div.appendChild(useRange.cloneContents());
          try {
            e.preventDefault();
            e.clipboardData.setData('text/html',  div.innerHTML);
            e.clipboardData.setData('text/plain', useRange.toString());
          } catch(err) {}
        });

        document.addEventListener('cut', function(e) {
          var sel = window.getSelection();
          if (!sel || sel.isCollapsed) return;
          var range = sel.getRangeAt(0);
          var div = document.createElement('div');
          div.appendChild(range.cloneContents());
          try {
            e.preventDefault();
            e.clipboardData.setData('text/html',  div.innerHTML);
            e.clipboardData.setData('text/plain', sel.toString());
            document.execCommand('delete');
            window.__savedRange = null;
            document.dispatchEvent(new Event('input', { bubbles: true }));
          } catch(_) {}
        });

        document.addEventListener('paste', function(e) {
          e.preventDefault();
          window.__savedRange = null;
          var html = e.clipboardData.getData('text/html');
          var text = e.clipboardData.getData('text/plain');

          if (html) {
            var bm = RE_BODY.exec(html);
            if (bm) html = bm[1];
            html = html
              .replace(RE_CMT,'').replace(RE_NS,'')
              .replace(RE_MSO,'').replace(RE_CLASS,'')
              .replace(RE_SPAN,'$1');
            try {
              document.execCommand('insertHTML', false, html);
            } catch(_) {
              var s = window.getSelection();
              if (s && s.rangeCount) {
                var r = s.getRangeAt(0); r.deleteContents();
                var tmp = document.createElement('div'); tmp.innerHTML = html;
                var frag = document.createDocumentFragment(), c;
                while ((c = tmp.firstChild)) frag.appendChild(c);
                r.insertNode(frag); r.collapse(false);
                s.removeAllRanges(); s.addRange(r);
              }
            }
          } else if (text) {
            try {
              document.execCommand('insertText', false, text);
            } catch(_) {
              var s = window.getSelection();
              if (s && s.rangeCount) {
                var r = s.getRangeAt(0); r.deleteContents();
                var lines = text.split('\\n');
                var frag = document.createDocumentFragment();
                lines.forEach(function(l, i) {
                  if (i > 0) frag.appendChild(document.createElement('br'));
                  frag.appendChild(document.createTextNode(l));
                });
                r.insertNode(frag); r.collapse(false);
                s.removeAllRanges(); s.advcvdRange(r);
              }
            }
          }
          document.dispatchEvent(new Event('input', { bubbles: true }));
        });
      })();`;
      doc.body.appendChild(script);

      // Attach notify to this doc — notify reads docRef so always current
      // mouseup intentionally removed — triggers re-render which clears selection
      doc.addEventListener("input", notify);
      doc.addEventListener("keyup", notify);

      iframe.addEventListener("mousedown", () => {
        setTimeout(() => iframe.contentWindow?.focus(), 0);
      });
    }

    return () => clearTimeout(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly, notify]);
  // data intentionally NOT in deps — sirf mount pe doc.write() hona chahiye
  // sheet switch ke liye parent mein key={activeSheet} already hai, jo remount karta hai

  // ═══════════════════════════════════════════════════════════════════════════
  // EXCEL MODE: Check if data is 2D array (Excel grid)
  // ═══════════════════════════════════════════════════════════════════════════
  const isExcel = isExcelData(data);

  const topColor = reportMode ? "#064E3B" : "#1E40AF";

  // Undo/Redo handlers for HTML mode
  const handleUndo = useCallback(() => {
    const doc = docRef.current;
    if (!doc) return;
    try {
      doc.execCommand('undo', false, null);
    } catch (err) {
      console.warn('[Undo] Failed:', err);
    }
  }, []);

  const handleRedo = useCallback(() => {
    const doc = docRef.current;
    if (!doc) return;
    try {
      doc.execCommand('redo', false, null);
    } catch (err) {
      console.warn('[Redo] Failed:', err);
    }
  }, []);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{
        background: topColor, color: "#fff",
        padding: "7px 16px", fontSize: 12, fontWeight: 500,
        display: "flex", alignItems: "center", gap: 12,
        flexShrink: 0, flexWrap: "wrap",
      }}>
        <span>{reportMode ? "✏️ Patient Report Editor" : "📄 Template Editor"}</span>
        <span style={{ opacity: 0.65, fontSize: 11 }}>
          {isExcel 
            ? (readOnly ? "Excel Grid (Read-only)" : "Excel Grid · Editable cells with formulas")
            : (readOnly ? "Read-only preview" : "Click anywhere to edit · Ctrl+Z undo · Ctrl+Y redo · Ctrl+C/V copy/paste")
          }
        </span>
        
        {/* Undo/Redo buttons for HTML mode */}
        {!isExcel && !readOnly && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <button
              onClick={handleUndo}
              title="Undo (Ctrl+Z)"
              style={{
                background: "rgba(255,255,255,0.2)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6,
                padding: "4px 10px", fontSize: 11, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
              </svg>
              Undo
            </button>
            <button
              onClick={handleRedo}
              title="Redo (Ctrl+Y)"
              style={{
                background: "rgba(255,255,255,0.2)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6,
                padding: "4px 10px", fontSize: 11, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 7v6h-6M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
              </svg>
              Redo
            </button>
          </div>
        )}
        
        {!reportMode && onCreateReport && (
          <button
            onClick={onCreateReport}
            style={{
              marginLeft: isExcel || readOnly ? "auto" : 0,
              background: "#fff", color: "#1E40AF",
              border: "none", borderRadius: 6, padding: "4px 14px",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >📋 Use as Template → New Report</button>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          EXCEL MODE: Render grid with formulas + row heights
          ═══════════════════════════════════════════════════════════════════════ */}
      {isExcel ? (
        <ExcelGrid 
          data={data} 
          formulaCache={formulaCache}
          rowHeights={rowHeights}
          colWidths={colWidths}
          merges={merges}
          cellStyles={cellStyles}
          readOnly={readOnly} 
          onDataChange={onDataChange}
        />
      ) : (
        /* ════════════════════════════════════════════════════════════════════════
           HTML/WORD MODE: Render iframe editor
           ═══════════════════════════════════════════════════════════════════════ */
        <div style={{ flex: 1, overflow: "auto", background: "#E8E8E4", padding: "28px 20px" }}>
          <div style={{
            maxWidth: 860, margin: "0 auto",
            boxShadow: "0 4px 24px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.08)",
            borderRadius: 2, background: "#fff",
          }}>
            <iframe
              ref={iframeRef}
              style={{ width: "100%", minHeight: 1000, border: "none", display: "block", borderRadius: 2 }}
              title="editor"
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default ReportSheetViewer;