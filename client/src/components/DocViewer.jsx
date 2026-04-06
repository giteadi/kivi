// DocViewer.jsx
// Renders embedded DOCX-style content (paragraphs + tables) with proper formatting
// Drop this file next to SpreadsheetGrid.jsx and import it in TemplateManager.jsx

import { useMemo } from "react";

// ─── DETECT if sheet data came from an embedded DOCX ─────────────────────────
// Heuristic: if first column has very long text and other cols are mostly empty
// → it's a document, not a spreadsheet
export function isDocumentSheet(data) {
  if (!data || data.length === 0) return false;
  const sample = data.slice(0, Math.min(data.length, 30));
  let longTextRows = 0;
  let multiColRows = 0;
  for (const row of sample) {
    const nonEmpty = row.filter(c => c && String(c).trim());
    if (nonEmpty.length === 0) continue;
    const firstCell = String(row[0] || "");
    if (firstCell.length > 60) longTextRows++;
    if (nonEmpty.length >= 3) multiColRows++;
  }
  // If most rows have long text in col A and few have multiple cols → document
  const total = sample.filter(r => r.some(c => c && String(c).trim())).length || 1;
  return (longTextRows / total) > 0.4 && (multiColRows / total) < 0.4;
}

// ─── PARSE flat rows back into document blocks ────────────────────────────────
// The Python parser outputs:
//   - Paragraphs → single-cell rows (row[0] = text, rest empty)
//   - Tables     → multi-cell rows  (row[0..n] = cell values)
function parseDocBlocks(data) {
  const blocks = [];
  let i = 0;

  while (i < data.length) {
    const row = data[i];
    const nonEmpty = row.filter(c => c && String(c).trim() !== "");

    if (nonEmpty.length === 0) {
      // blank separator
      blocks.push({ type: "spacer" });
      i++;
      continue;
    }

    if (nonEmpty.length >= 2) {
      // Could be start of a table — collect consecutive multi-col rows
      const tableRows = [];
      while (i < data.length) {
        const r = data[i];
        const ne = r.filter(c => c && String(c).trim() !== "");
        if (ne.length >= 2 || (tableRows.length > 0 && ne.length === 1 && String(r[0]).length < 60)) {
          tableRows.push(r);
          i++;
        } else {
          break;
        }
      }
      if (tableRows.length === 1) {
        // Single multi-col row → treat as paragraph (could be sub-heading with value)
        blocks.push({ type: "para", text: tableRows[0].filter(Boolean).join("  ") });
      } else {
        blocks.push({ type: "table", rows: tableRows });
      }
    } else {
      // Single-cell paragraph
      const text = String(row[0] || "").trim();
      blocks.push({ type: "para", text });
      i++;
    }
  }

  return blocks;
}

// ─── DETECT text style from content ──────────────────────────────────────────
function getParaStyle(text) {
  if (!text) return "body";
  const t = text.trim();
  // ALL CAPS short text → heading
  if (t === t.toUpperCase() && t.length < 120 && /[A-Z]{3,}/.test(t)) return "heading";
  // Starts with number+dot → numbered heading
  if (/^\d+\./.test(t) && t.length < 100) return "subheading";
  // Bold-like markers (text wrapped in asterisks or all caps words)
  if (t.startsWith("Remark:") || t.startsWith("Interpretation:") || t.startsWith("Note:")) return "remark";
  if (t.startsWith("Subtest description") || t.startsWith("Test Results")) return "section";
  // italic-ish (starts lowercase after sentence or contains parenthetical)
  if (t.match(/^[A-Z][a-z].*[-–]\s/) || t.match(/^[A-Z][a-z].{10,}[-–]/)) return "label";
  return "body";
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  wrapper: {
    flex: 1,
    overflow: "auto",
    background: "#f5f5f0",
    padding: "32px 24px",
    fontFamily: "'Times New Roman', Georgia, serif",
  },
  page: {
    maxWidth: 760,
    margin: "0 auto",
    background: "#fff",
    boxShadow: "0 2px 20px rgba(0,0,0,0.12)",
    padding: "48px 64px",
    minHeight: 600,
    borderRadius: 2,
  },
  heading: {
    fontSize: 15,
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: 10,
    marginTop: 16,
    color: "#111",
    lineHeight: 1.4,
    letterSpacing: "0.02em",
  },
  subheading: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 14,
    color: "#111",
    lineHeight: 1.4,
  },
  section: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 14,
    color: "#222",
  },
  remark: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 10,
    color: "#111",
    lineHeight: 1.6,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 8,
    color: "#111",
    lineHeight: 1.5,
  },
  body: {
    fontSize: 13,
    color: "#222",
    lineHeight: 1.65,
    marginBottom: 6,
    marginTop: 2,
  },
  italic: {
    fontSize: 13,
    color: "#333",
    lineHeight: 1.65,
    fontStyle: "italic",
    marginBottom: 6,
  },
  spacer: { height: 8 },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 13,
  },
  th: {
    border: "1px solid #555",
    padding: "6px 10px",
    fontWeight: "bold",
    background: "#f9f9f9",
    textAlign: "left",
    fontSize: 13,
    color: "#111",
  },
  td: {
    border: "1px solid #888",
    padding: "5px 10px",
    textAlign: "left",
    fontSize: 13,
    color: "#222",
    verticalAlign: "top",
  },
  tdNum: {
    border: "1px solid #888",
    padding: "5px 10px",
    textAlign: "center",
    fontSize: 13,
    color: "#222",
  },
};

// ─── RENDER a paragraph with bold/italic detection ────────────────────────────
function RenderPara({ text }) {
  const style_key = getParaStyle(text);
  const style = S[style_key] || S.body;

  // Detect if the paragraph has a bold label prefix like "Immediate Memory- ..."
  const labelMatch = text.match(/^([A-Z][^–\-:]+[-–:])(.+)$/s);
  if (labelMatch && style_key === "body" && labelMatch[1].length < 40) {
    return (
      <p style={style}>
        <strong>{labelMatch[1]}</strong>
        {labelMatch[2]}
      </p>
    );
  }

  // Italic detection: if it looks like a disclaimer/note paragraph
  const looksItalic = text.length > 80 && text[0] === text[0].toLowerCase() === false
    && !text.match(/^[A-Z]{3,}/) && style_key === "body"
    && (text.includes("cannot") || text.includes("reported") || text.includes("guide"));

  return <p style={looksItalic ? S.italic : style}>{text}</p>;
}

// ─── RENDER a table block ─────────────────────────────────────────────────────
function RenderTable({ rows }) {
  // Find max columns
  const maxCols = Math.max(...rows.map(r => r.length), 1);

  // Detect if first row looks like a header
  // (short text cells, not numbers, and subsequent rows have numbers)
  const firstRow = rows[0] || [];
  const secondRow = rows[1] || [];
  const firstRowIsHeader =
    firstRow.every(c => !c || isNaN(Number(c)) || String(c).length < 2) &&
    secondRow.some(c => c && !isNaN(Number(String(c).replace(/[><%]/g, ""))));

  const headerRow = firstRowIsHeader ? firstRow : null;
  const dataRows  = firstRowIsHeader ? rows.slice(1) : rows;

  // Detect numeric columns (for center alignment)
  const numericCols = Array.from({ length: maxCols }, (_, c) =>
    dataRows.every(r => !r[c] || !isNaN(Number(String(r[c]).replace(/[><%†]/g, ""))))
  );

  return (
    <table style={S.table}>
      {headerRow && (
        <thead>
          <tr>
            {headerRow.map((cell, c) => (
              <th key={c} style={{ ...S.th, textAlign: c > 0 ? "center" : "left" }}>
                {cell || ""}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {dataRows.map((row, r) => (
          <tr key={r}>
            {Array.from({ length: maxCols }, (_, c) => {
              const val = row[c] || "";
              const isNum = numericCols[c] && c > 0;
              return (
                <td key={c} style={isNum ? S.tdNum : S.td}>
                  {/* Bold first column if it looks like a label */}
                  {c === 0 && !firstRowIsHeader && r === 0
                    ? <strong>{val}</strong>
                    : val}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── MAIN DOC VIEWER ──────────────────────────────────────────────────────────
export default function DocViewer({ data }) {
  const blocks = useMemo(() => parseDocBlocks(data || []), [data]);

  return (
    <div style={S.wrapper}>
      <div style={S.page}>
        {blocks.map((block, i) => {
          if (block.type === "spacer") return <div key={i} style={S.spacer} />;
          if (block.type === "table") return <RenderTable key={i} rows={block.rows} />;
          if (block.type === "para")  return <RenderPara  key={i} text={block.text} />;
          return null;
        })}
      </div>
    </div>
  );
}
