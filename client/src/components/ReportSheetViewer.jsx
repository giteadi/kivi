// ReportSheetViewer.jsx
// Renders assessment report sheets exactly like Excel:
// - Title row (bold, underlined)
// - Body paragraphs (full width, wrapped)
// - Tables with borders (multi-column)
// - All cells individually editable (click to edit)
// - "Use as Template" → creates an editable copy

import { useState, useRef, useCallback, useEffect, useMemo } from "react";

// ─── CLASSIFY each row ────────────────────────────────────────────────────────
function classifyRows(data) {
  if (!data || !data.length) return [];
  return data.map((row, i) => {
    const cells = row.map(c => (c === null || c === undefined ? "" : String(c)));
    const nonEmpty = cells.filter(c => c.trim() !== "");
    
    if (nonEmpty.length === 0) return { type: "empty", cells };
    
    // Multi-column = table row (2+ non-empty cells)
    if (nonEmpty.length >= 2) return { type: "table", cells };
    
    const text = cells[0].trim();
    
    // Very short ALL CAPS = heading
    if (text === text.toUpperCase() && text.length < 120 && /[A-Z]{4,}/.test(text))
      return { type: "heading", cells };
    
    return { type: "para", cells };
  });
}

// ─── GROUP consecutive table rows into table blocks ──────────────────────────
function buildBlocks(classified) {
  const blocks = [];
  let i = 0;
  while (i < classified.length) {
    const row = classified[i];
    if (row.type === "table") {
      const tableRows = [];
      while (i < classified.length && classified[i].type === "table") {
        tableRows.push({ rowIdx: i, cells: classified[i].cells });
        i++;
      }
      blocks.push({ type: "table", rows: tableRows });
    } else {
      blocks.push({ type: row.type, rowIdx: i, cells: row.cells });
      i++;
    }
  }
  return blocks;
}

// ─── INLINE EDITABLE CELL ────────────────────────────────────────────────────
function EditableCell({ value, onChange, style, multiline = true }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const ref = useRef(null);

  useEffect(() => { setVal(value); }, [value]);
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      const len = String(ref.current.value || "").length;
      ref.current.setSelectionRange(len, len);
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (val !== value) onChange(val);
  };

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={ref}
          value={val}
          onChange={e => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === "Escape") { setVal(value); setEditing(false); } }}
          style={{
            ...style,
            resize: "none",
            border: "2px solid #2563EB",
            outline: "none",
            background: "#EFF6FF",
            padding: "4px 8px",
            width: "100%",
            minHeight: 40,
            boxSizing: "border-box",
            fontFamily: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
          }}
          rows={Math.max(2, (val || "").split("\n").length)}
        />
      );
    }
    return (
      <input
        ref={ref}
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") { setVal(value); setEditing(false); }
        }}
        style={{
          ...style,
          border: "2px solid #2563EB",
          outline: "none",
          background: "#EFF6FF",
          padding: "4px 8px",
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "inherit",
          fontSize: "inherit",
        }}
      />
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      title="Click to edit"
      style={{
        ...style,
        cursor: "text",
        minHeight: 24,
        padding: "4px 8px",
        borderRadius: 2,
        transition: "background 0.15s",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(37,99,235,0.06)"; e.currentTarget.style.outline = "1px dashed #93C5FD"; }}
      onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.outline = ""; }}
    >
      {val || <span style={{ color: "#CBD5E1", fontStyle: "italic", fontSize: "0.9em" }}>empty</span>}
    </div>
  );
}

// ─── MAIN REPORT SHEET VIEWER ────────────────────────────────────────────────
export default function ReportSheetViewer({
  data,           // 2D array of cell values
  readOnly = false,
  onDataChange,   // (newData) => void
  onCreateReport, // () => void — called when "Use as Template" clicked
  reportMode = false, // true = this is an editable patient report
}) {
  const [localData, setLocalData] = useState(() => data?.map(r => [...r]) || []);

  useEffect(() => {
    setLocalData(data?.map(r => [...r]) || []);
  }, [data]);

  const updateCell = useCallback((rowIdx, colIdx, newVal) => {
    setLocalData(prev => {
      const next = prev.map(r => [...r]);
      if (!next[rowIdx]) next[rowIdx] = [];
      while (next[rowIdx].length <= colIdx) next[rowIdx].push("");
      next[rowIdx][colIdx] = newVal;
      if (onDataChange) onDataChange(next);
      return next;
    });
  }, [onDataChange]);

  const blocks = useMemo(() => buildBlocks(classifyRows(localData)), [localData]);

  // Determine max cols for table width consistency
  const maxTableCols = useMemo(() => {
    let max = 1;
    for (const block of blocks) {
      if (block.type === "table") {
        for (const row of block.rows) {
          max = Math.max(max, row.cells.length);
        }
      }
    }
    return max;
  }, [blocks]);

  const isEditable = !readOnly;

  return (
    <div style={{
      flex: 1,
      overflow: "auto",
      background: "#E8E8E4",
      padding: "28px 20px",
    }}>
      {/* Page */}
      <div style={{
        maxWidth: 800,
        margin: "0 auto",
        background: "#FFFFFF",
        boxShadow: "0 4px 24px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1)",
        borderRadius: 2,
        overflow: "hidden",
      }}>
        {/* Page header bar */}
        {(reportMode || isEditable) && (
          <div style={{
            background: reportMode ? "#059669" : "#2563EB",
            color: "#fff",
            padding: "8px 20px",
            fontSize: 12,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            {reportMode ? "✏️ Editing Patient Report — changes saved automatically" : "📄 Template Preview — click any cell to edit"}
            {!reportMode && onCreateReport && (
              <button
                onClick={onCreateReport}
                style={{
                  marginLeft: "auto",
                  background: "#fff",
                  color: "#2563EB",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📋 Use as Template → New Report
              </button>
            )}
          </div>
        )}

        {/* Document content */}
        <div style={{
          padding: "40px 52px 52px",
          fontFamily: "'Times New Roman', Georgia, serif",
          fontSize: 13,
          color: "#111",
          lineHeight: 1.6,
        }}>
          {blocks.map((block, bi) => {
            if (block.type === "empty") {
              return <div key={bi} style={{ height: 10 }} />;
            }

            if (block.type === "heading") {
              const text = block.cells[0] || "";
              return isEditable ? (
                <EditableCell
                  key={bi}
                  value={text}
                  multiline={false}
                  onChange={v => updateCell(block.rowIdx, 0, v)}
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    textDecoration: "underline",
                    marginBottom: 12,
                    marginTop: 8,
                    letterSpacing: "0.02em",
                    display: "block",
                  }}
                />
              ) : (
                <p key={bi} style={{
                  fontSize: 14, fontWeight: "bold", textDecoration: "underline",
                  marginBottom: 12, marginTop: 8,
                }}>
                  {text}
                </p>
              );
            }

            if (block.type === "para") {
              const text = block.cells[0] || "";
              // Detect bold prefix (e.g. "Remark: ...", "Immediate Memory- ...")
              const boldMatch = text.match(/^([A-Z][^:–\-]{0,35}[:–\-]\s*)([\s\S]*)$/);

              if (isEditable) {
                return (
                  <EditableCell
                    key={bi}
                    value={text}
                    onChange={v => updateCell(block.rowIdx, 0, v)}
                    style={{
                      display: "block",
                      marginBottom: 8,
                      marginTop: 4,
                      fontSize: 13,
                      lineHeight: 1.65,
                    }}
                  />
                );
              }

              if (boldMatch && boldMatch[1].length < 40) {
                return (
                  <p key={bi} style={{ marginBottom: 8, marginTop: 4 }}>
                    <strong>{boldMatch[1]}</strong>{boldMatch[2]}
                  </p>
                );
              }
              // Italic if it looks like a disclaimer
              const isItalic = text.length > 100 && (text.includes("cannot be") || text.includes("rough guide") || text.includes("endorsed"));
              return (
                <p key={bi} style={{
                  marginBottom: 8, marginTop: 4,
                  fontStyle: isItalic ? "italic" : "normal",
                }}>
                  {text}
                </p>
              );
            }

            if (block.type === "table") {
              const tableRows = block.rows;
              if (!tableRows.length) return null;

              // Detect header row: first row all non-numeric, second row has numbers
              const firstCells = tableRows[0]?.cells || [];
              const secondCells = tableRows[1]?.cells || [];
              const firstIsHeader = firstCells.some(c => c && isNaN(Number(String(c).replace(/[><%†\s]/g, ""))));
              const numCols = Math.max(...tableRows.map(r => r.cells.length), 1);

              // Column widths: first col wider, rest equal
              const firstColW = "42%";
              const otherColW = `${Math.floor(58 / Math.max(numCols - 1, 1))}%`;

              return (
                <table key={bi} style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: 10,
                  marginBottom: 12,
                  fontSize: 13,
                  tableLayout: "fixed",
                }}>
                  <tbody>
                    {tableRows.map((trow, ri) => {
                      const isHeaderRow = firstIsHeader && ri === 0;
                      return (
                        <tr key={ri}>
                          {Array.from({ length: numCols }, (_, ci) => {
                            const cellVal = trow.cells[ci] || "";
                            const isFirstCol = ci === 0;
                            const colW = isFirstCol ? firstColW : otherColW;
                            const isNum = !isFirstCol && !isNaN(Number(String(cellVal).replace(/[><%†\s]/g, ""))) && cellVal !== "";
                            const cellStyle = {
                              border: "1px solid #555",
                              padding: "5px 10px",
                              textAlign: isNum ? "center" : "left",
                              fontWeight: isHeaderRow || (isFirstCol && ri > 0 && !isNum) ? "bold" : "normal",
                              background: isHeaderRow ? "#f0f0f0" : "transparent",
                              width: colW,
                              verticalAlign: "top",
                              fontSize: 13,
                            };
                            if (isEditable) {
                              return (
                                <td key={ci} style={{ ...cellStyle, padding: 0 }}>
                                  <EditableCell
                                    value={cellVal}
                                    multiline={isFirstCol && !isHeaderRow}
                                    onChange={v => updateCell(trow.rowIdx, ci, v)}
                                    style={{
                                      fontWeight: cellStyle.fontWeight,
                                      background: cellStyle.background,
                                      textAlign: cellStyle.textAlign,
                                      fontSize: 13,
                                    }}
                                  />
                                </td>
                              );
                            }
                            return <td key={ci} style={cellStyle}>{cellVal}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}
