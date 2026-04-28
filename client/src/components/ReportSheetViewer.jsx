// ReportSheetViewer.jsx — iframe designMode editor + Excel grid mode
// Fixed: script tag pollution in saved HTML
// Fixed: stale closure on notify — doc ref stored in useRef
// NEW: Excel grid mode with formula support

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle, useState } from "react";

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
        console.log('[DEBUG] Formula evaluated:', { key, formula: cache[key], result, pass });
        nextData[r][c] = result;
      } catch (err) {
        console.error('[DEBUG] Formula error:', { key, formula: cache[key], error: err.message });
      }
    }
  }
  return nextData;
}

// Formula evaluator
function evalFormula(formula, grid) {
  if (!formula) return "";
  let expr = formula.toString().trim();
  if (expr.startsWith("=")) expr = expr.slice(1);
  let e = expr.toUpperCase();

  const getCellValue = (ref) => {
    const m = ref.match(/^([A-Z]+)(\d+)$/i);
    if (!m) return 0;
    const c = m[1].toUpperCase().charCodeAt(0) - 65;
    const r = parseInt(m[2]) - 1;
    const cell = grid[r]?.[c];
    const raw = (cell && typeof cell === "object") ? (cell.raw ?? cell.value ?? "") : cell;
    if (raw === "" || raw === null || raw === undefined) return 0;
    const val = parseFloat(String(raw));
    return isNaN(val) ? 0 : val;
  };

  // Step 1: Resolve SUM() — compute actual numeric total inline
  e = e.replace(/SUM\(([^)]+)\)/g, (_, inner) => {
    let total = 0;
    inner.split(",").forEach(part => {
      part = part.trim();
      const range = part.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
      if (range) {
        const c1 = range[1].charCodeAt(0) - 65, r1 = parseInt(range[2]) - 1;
        const c2 = range[3].charCodeAt(0) - 65, r2 = parseInt(range[4]) - 1;
        for (let r = Math.min(r1,r2); r <= Math.max(r1,r2); r++)
          for (let c = Math.min(c1,c2); c <= Math.max(c1,c2); c++)
            total += getCellValue(String.fromCharCode(c+65) + (r+1));
      } else {
        total += getCellValue(part);
      }
    });
    return String(total);
  });

  // Step 2: Replace all cell refs with their numeric values
  // Use a function-based replace so each ref gets its own lookup
  e = e.replace(/([A-Z]+)(\d+)/g, (match) => String(getCellValue(match)));

  // Step 3: Strip quoted number strings "3" → 3
  e = e.replace(/"(\d+(?:\.\d+)?)"/g, "$1");

  // Step 4: Remove trailing commas before ) 
  e = e.replace(/,\s*\)/g, ")");

  // Step 5: Convert nested IF(cond,t,f) → JS ternary char-by-char
  function convertIFs(s) {
    let out = "", i = 0;
    while (i < s.length) {
      if (s.slice(i, i+3) === "IF(") {
        i += 3;
        let depth = 0, args = [], cur = "";
        while (i < s.length) {
          const ch = s[i];
          if (ch === "(") { depth++; cur += ch; }
          else if (ch === ")") {
            if (depth === 0) { args.push(cur.trim()); i++; break; }
            depth--; cur += ch;
          } else if (ch === "," && depth === 0) {
            args.push(cur.trim()); cur = "";
          } else { cur += ch; }
          i++;
        }
        if (args.length >= 3)
          out += `((${convertIFs(args[0])})?(${convertIFs(args[1])}):(${convertIFs(args[2])}))`;
        else if (args.length === 2)
          out += `((${convertIFs(args[0])})?(${convertIFs(args[1])}):(0))`;
        else out += "0";
      } else { out += s[i++]; }
    }
    return out;
  }
  e = convertIFs(e);

  // Step 6: Excel <> → JS !==, bare = → ===
  e = e.replace(/<>/g, "!==");
  e = e.replace(/(?<![<>=!])=(?![>=])/g, "===");

  // Step 7: Evaluate
  try {
    const result = new Function(`return (${e})`)();
    if (result === null || result === undefined) return 0;
    if (typeof result === "boolean") return result ? 1 : 0;
    if (typeof result === "string") { const n = parseFloat(result); return isNaN(n) ? result : n; }
    if (!isFinite(result) || isNaN(result)) return 0;
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
    margin: 0; padding: 0;
    background: #fff;
    font-family: 'Times New Roman', Georgia, serif;
    font-size: 13px;
    color: #111;
    line-height: 1.7;
  }
  body { padding: 48px 56px 80px; min-height: 900px; outline: none; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0 16px; font-size: 13px; }
  td, th { border: 1px solid #555; padding: 5px 10px; min-width: 60px; vertical-align: top; text-align: left; }
  th { background: #f0f0f0; font-weight: bold; }
  tr:nth-child(even) td { background: #fafafa; }
  h1 { font-size: 17px; font-weight: bold; text-decoration: underline; margin: 16px 0 8px; }
  h2 { font-size: 14px; font-weight: bold; text-decoration: underline; margin: 14px 0 6px; }
  h3 { font-size: 13px; font-weight: bold; margin: 12px 0 4px; }
  p  { margin: 0 0 8px; }
  ul, ol { padding-left: 24px; margin: 6px 0 10px; }
  ::selection, *::selection, td::selection, th::selection {
    background: #3B82F6 !important; color: #fff !important;
  }
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 8px 0;
    cursor: pointer;
  }
  img.selected, img:focus {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
  }
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// EXCEL GRID COMPONENT (with formulas + row heights)
// ══════════════════════════════════════════════════════════════════════════════
function ExcelGrid({ data, formulaCache: externalFormulaCache, rowHeights, readOnly, onDataChange }) {
  const [sheetData, setSheetData] = useState(data || []);
  const formulaCacheRef = useRef({});

  // Build formula cache on mount (use external cache if provided)
  useEffect(() => {
    formulaCacheRef.current = externalFormulaCache || buildFormulaCache(data || []);
    console.log('[DEBUG] ExcelGrid mount - formulaCache:', formulaCacheRef.current);
    console.log('[DEBUG] ExcelGrid mount - rowHeights:', rowHeights);
    // Initial formula evaluation
    const evaluated = reEvaluateFormulas(data || [], formulaCacheRef.current);
    setSheetData(evaluated);
  }, []);

  // Update data when prop changes
  // Only sync cache when it changes externally (not data)
  useEffect(() => {
    if (externalFormulaCache && Object.keys(externalFormulaCache).length > 0) {
      formulaCacheRef.current = externalFormulaCache;
    }
  }, [externalFormulaCache]);

  const handleCellChange = (rowIdx, colIdx, value) => {
    console.log('[DEBUG] ExcelGrid handleCellChange:', { rowIdx, colIdx, value, type: typeof value });
    if (readOnly) return;
    
    // Formula cells are readonly
    const key = `${rowIdx}_${colIdx}`;
    if (formulaCacheRef.current[key]) {
      console.log('[DEBUG] Cell is formula cell, readonly:', key);
      return;
    }

    setSheetData(prev => {
      const next = prev.map(r => [...r]);
      if (!next[rowIdx]) next[rowIdx] = [];
      // Safe numeric input handling
      next[rowIdx][colIdx] = value === "" ? "" : isNaN(value) ? value : Number(value);
      console.log('[DEBUG] Updated cell:', { rowIdx, colIdx, newValue: next[rowIdx][colIdx], type: typeof next[rowIdx][colIdx] });
      
      // Re-evaluate formulas
      const recalculated = reEvaluateFormulas(next, formulaCacheRef.current);
      console.log('[DEBUG] Recalculated data sample:', recalculated.slice(0, 5));
      
      // Notify parent with delay to avoid React lifecycle error
      if (onDataChange) {
        setTimeout(() => onDataChange(recalculated), 0);
      }
      
      return recalculated;
    });
  };

  if (!sheetData || sheetData.length === 0) {
    return <div style={{ padding: 40, textAlign: "center", color: "#666" }}>Empty sheet</div>;
  }

  const headerRow = sheetData[0] || [];
  const dataRows = sheetData.slice(1);

  // ✅ Helper: Get row height in pixels (Excel stores in points, 1 point ≈ 1.33px)
  const getRowHeight = (rowIdx) => {
    if (!rowHeights || typeof rowHeights !== 'object') return null;
    const heightInPoints = rowHeights[rowIdx];
    if (!heightInPoints || isNaN(heightInPoints)) return null;
    // Convert points to pixels (1 point = 1.33 pixels approximately)
    return Math.round(heightInPoints * 1.33);
  };

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#F9FAFB", padding: 16 }}>
      <table style={{ borderCollapse: "collapse", width: "100%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <thead>
          <tr style={{ height: getRowHeight(0) || 'auto' }}>
            <th style={{ border: "1px solid #E5E7EB", padding: "8px", background: "#F3F4F6", width: 40 }}>#</th>
            {headerRow.map((cell, cIdx) => (
              <th key={cIdx} style={{ 
                border: "1px solid #E5E7EB", 
                padding: "8px 10px", 
                background: "#F3F4F6",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                minWidth: 100
              }}>
                {readOnly ? (
                  <span>{cell ?? ""}</span>
                ) : (
                  <input
                    value={cell ?? ""}
                    onChange={(e) => handleCellChange(0, cIdx, e.target.value)}
                    style={{ 
                      width: "100%", 
                      border: "none", 
                      background: "transparent",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      outline: "none"
                    }}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, rIdx) => {
            const actualRowIdx = rIdx + 1; // Excel row index (0-based in data, but header is row 0)
            const rowHeight = getRowHeight(actualRowIdx);
            
            return (
              <tr 
                key={rIdx} 
                style={{ 
                  background: rIdx % 2 === 0 ? "#fff" : "#F9FAFB",
                  height: rowHeight || 'auto'
                }}
              >
                <td style={{ 
                  border: "1px solid #E5E7EB", 
                  padding: "6px 8px", 
                  textAlign: "center",
                  fontSize: 12,
                  color: "#9CA3AF",
                  background: "#F3F4F6"
                }}>{actualRowIdx}</td>
                {Array.from({ length: headerRow.length }).map((_, cIdx) => {
                  const key = `${actualRowIdx}_${cIdx}`;
                  const isFormula = !!formulaCacheRef.current[key];
                  const rawValue = row?.[cIdx];
                  // Handle NaN, Infinity, null, undefined - convert to safe string
                  const safeValue = (rawValue === null || rawValue === undefined || Number.isNaN(rawValue) || rawValue === Infinity || rawValue === -Infinity) ? "" : String(rawValue);
                  
                  return (
                    <td key={cIdx} style={{ 
                      border: "1px solid #E5E7EB", 
                      padding: 0,
                      background: isFormula ? "#FFF9C4" : "transparent",
                      verticalAlign: "top"
                    }}>
                      {readOnly || isFormula ? (
                        <div style={{ 
                          padding: "7px 10px", 
                          fontSize: 13,
                          color: isFormula ? "#856404" : "#374151",
                          fontWeight: isFormula ? 600 : 400,
                          minHeight: 20,
                          height: "100%",
                          display: "flex",
                          alignItems: "flex-start"
                        }} title={isFormula ? `Formula: ${formulaCacheRef.current[key]}` : ""}>
                          {safeValue}
                        </div>
                      ) : (
                        <textarea
                          value={safeValue}
                          onChange={(e) => {
                            const val = e.target.value;
                            // Safe numeric input handling
                            const parsed = val === "" ? "" : isNaN(val) ? val : Number(val);
                            handleCellChange(actualRowIdx, cIdx, parsed);
                          }}
                          style={{ 
                            width: "100%", 
                            padding: "7px 10px", 
                            border: "none", 
                            outline: "none",
                            fontSize: 13,
                            background: "transparent",
                            color: "#374151",
                            resize: "none",
                            height: rowHeight ? `${rowHeight}px` : "auto",
                            minHeight: 20,
                            fontFamily: "inherit",
                            lineHeight: "1.5"
                          }}
                          rows={1}
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