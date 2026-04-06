import { useState, useRef, useCallback, useEffect, useMemo } from "react";

const colLabel = (i) => {
  let label = "", idx = i;
  do {
    label = String.fromCharCode(65 + (idx % 26)) + label;
    idx = Math.floor(idx / 26) - 1;
  } while (idx >= 0);
  return label;
};

// ─── MEASURE TEXT WIDTH ───────────────────────────────────────────────────────
const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
function measureText(text, font = "13px ui-monospace, monospace") {
  if (!canvas) return 90;
  const ctx = canvas.getContext("2d");
  ctx.font = font;
  return Math.ceil(ctx.measureText(String(text || "")).width) + 20; // +20 for padding
}

// ─── AUTO-FIT COLUMN WIDTHS ───────────────────────────────────────────────────
function computeColWidths(data, minW = 60, maxW = 400) {
  if (!data || !data.length) return [];
  const cols = Math.max(...data.map((r) => r?.length || 0), 1);
  const widths = Array(cols).fill(minW);

  // Header row (A, B, C...)
  for (let c = 0; c < cols; c++) {
    widths[c] = Math.max(widths[c], measureText(colLabel(c)));
  }

  // Data rows (sample first 200 rows for performance)
  const sampleRows = data.slice(0, 200);
  for (let r = 0; r < sampleRows.length; r++) {
    const row = sampleRows[r] || [];
    for (let c = 0; c < row.length; c++) {
      const val = row[c];
      if (val !== "" && val !== null && val !== undefined) {
        const w = measureText(val);
        widths[c] = Math.max(widths[c], Math.min(w, maxW));
      }
    }
  }

  return widths;
}

// ─── CELL COMPONENT ───────────────────────────────────────────────────────────
const Cell = ({ value, width, rowIdx, colIdx, isSelected, isEditing, onSelect, onEdit, onCommit, onChange, readOnly }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
      const len = ref.current.value.length;
      ref.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const baseStyle = {
    display: "block",
    width: width,
    height: 26,
    fontSize: 13,
    fontFamily: "ui-monospace, 'Cascadia Code', Consolas, monospace",
    padding: "0 6px",
    borderRight: "1px solid #D0D0D0",
    borderBottom: "1px solid #D0D0D0",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    cursor: readOnly ? "default" : "cell",
    userSelect: "none",
    background: isSelected ? "#E8F0FE" : rowIdx % 2 === 0 ? "#fff" : "#FAFAFA",
    color: "#1a1a1a",
    outline: isSelected ? "2px solid #4285F4" : "none",
    outlineOffset: -2,
    textAlign: "left",
    lineHeight: "26px",
    flexShrink: 0,
  };

  if (isEditing && !readOnly) {
    return (
      <td style={{ padding: 0, width, minWidth: width, maxWidth: width }}>
        <input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => onCommit()}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); onCommit(); }
            if (e.key === "Tab") { e.preventDefault(); onCommit(); }
            if (e.key === "Escape") onCommit(true);
          }}
          style={{
            ...baseStyle,
            cursor: "text",
            outline: "2px solid #4285F4",
            outlineOffset: -2,
            background: "#fff",
            userSelect: "text",
          }}
        />
      </td>
    );
  }

  return (
    <td
      style={{ padding: 0, width, minWidth: width, maxWidth: width, overflow: "hidden" }}
      title={value !== null && value !== undefined && String(value).length > 20 ? String(value) : undefined}
      onClick={() => !readOnly && onSelect(rowIdx, colIdx)}
      onDoubleClick={() => !readOnly && onEdit(rowIdx, colIdx)}
    >
      <div style={baseStyle}>
        {value === null || value === undefined ? "" : String(value)}
      </div>
    </td>
  );
};

// ─── MAIN SPREADSHEET GRID ────────────────────────────────────────────────────
export default function SpreadsheetGrid({ data, onDataChange, readOnly = false }) {
  const [sel, setSel] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [colWidths, setColWidths] = useState([]);
  const containerRef = useRef(null);
  const resizingRef = useRef(null); // { colIdx, startX, startW }

  const rows = data?.length || 0;
  const cols = useMemo(() => Math.max(...(data || []).map((r) => r?.length || 0), 1), [data]);

  // Auto-compute col widths when data changes
  useEffect(() => {
    setColWidths(computeColWidths(data));
  }, [data]);

  const getColWidth = (c) => colWidths[c] ?? 90;

  // ── Commit edit ────────────────────────────────────────────────────────────
  const commitEdit = useCallback((cancel = false) => {
    if (!editing) return;
    if (!cancel && onDataChange) {
      const next = data.map((r) => [...r]);
      if (!next[editing.r]) next[editing.r] = [];
      next[editing.r][editing.c] = editVal;
      onDataChange(next);
    }
    setEditing(null);
    setEditVal("");
  }, [editing, editVal, data, onDataChange]);

  // ── Keyboard navigation ────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (!sel || editing) return;
    if (e.key === "Enter" || e.key === "F2") {
      setEditing(sel);
      setEditVal(data[sel.r]?.[sel.c] ?? "");
      e.preventDefault();
      return;
    }
    if ((e.key === "Delete" || e.key === "Backspace") && !readOnly) {
      const next = data.map((r) => [...r]);
      if (next[sel.r]) next[sel.r][sel.c] = "";
      if (onDataChange) onDataChange(next);
      return;
    }
    const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], Tab: [0, 1] };
    if (moves[e.key]) {
      const [dr, dc] = moves[e.key];
      setSel((s) => ({
        r: Math.max(0, Math.min(rows - 1, s.r + dr)),
        c: Math.max(0, Math.min(cols - 1, s.c + dc)),
      }));
      e.preventDefault();
    }
  }, [sel, editing, data, rows, cols, onDataChange, readOnly]);

  // ── Column resize mouse handlers ───────────────────────────────────────────
  const onResizeMouseDown = useCallback((e, colIdx) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = {
      colIdx,
      startX: e.clientX,
      startW: getColWidth(colIdx),
    };

    const onMouseMove = (moveEvent) => {
      if (!resizingRef.current) return;
      const { colIdx: ci, startX, startW } = resizingRef.current;
      const delta = moveEvent.clientX - startX;
      const newW = Math.max(40, startW + delta);
      setColWidths((prev) => {
        const next = [...prev];
        while (next.length <= ci) next.push(90);
        next[ci] = newW;
        return next;
      });
    };

    const onMouseUp = () => {
      resizingRef.current = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [colWidths]);

  // ── Copy selection ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleCopy = (e) => {
      if (!sel) return;
      const val = data?.[sel.r]?.[sel.c] ?? "";
      e.clipboardData?.setData("text/plain", String(val));
      e.preventDefault();
    };
    const handlePaste = (e) => {
      if (!sel || readOnly) return;
      const text = e.clipboardData?.getData("text/plain") ?? "";
      const next = data.map((r) => [...r]);
      if (!next[sel.r]) next[sel.r] = [];
      next[sel.r][sel.c] = text;
      if (onDataChange) onDataChange(next);
      e.preventDefault();
    };
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, [sel, data, onDataChange, readOnly]);

  const ROW_NUM_W = 48;
  const HEADER_H = 28;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        outline: "none",
        overflow: "auto",
        flex: 1,
        background: "#fff",
        position: "relative",
        fontFamily: "ui-monospace, monospace",
      }}
    >
      <table
        style={{
          borderCollapse: "collapse",
          tableLayout: "fixed",
          // Total width = row num col + sum of col widths
          width: ROW_NUM_W + colWidths.slice(0, cols).reduce((a, b) => a + (b ?? 90), 0),
        }}
      >
        {/* Column width definitions */}
        <colgroup>
          <col style={{ width: ROW_NUM_W }} />
          {Array.from({ length: cols }, (_, c) => (
            <col key={c} style={{ width: getColWidth(c) }} />
          ))}
        </colgroup>

        <thead>
          <tr style={{ height: HEADER_H }}>
            {/* Corner cell */}
            <th
              style={{
                width: ROW_NUM_W,
                background: "#F0F0F0",
                borderRight: "1px solid #B0B0B0",
                borderBottom: "2px solid #B0B0B0",
                position: "sticky",
                top: 0,
                left: 0,
                zIndex: 4,
                boxSizing: "border-box",
              }}
            />
            {Array.from({ length: cols }, (_, c) => (
              <th
                key={c}
                style={{
                  width: getColWidth(c),
                  height: HEADER_H,
                  background: "#F0F0F0",
                  borderRight: "1px solid #D0D0D0",
                  borderBottom: "2px solid #B0B0B0",
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#555",
                  fontFamily: "system-ui, sans-serif",
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  boxSizing: "border-box",
                  padding: 0,
                  userSelect: "none",
                  // Relative for resize handle
                  overflow: "visible",
                }}
              >
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  {colLabel(c)}
                  {/* ── Resize handle ── */}
                  <div
                    onMouseDown={(e) => onResizeMouseDown(e, c)}
                    style={{
                      position: "absolute",
                      right: -3,
                      top: 0,
                      width: 6,
                      height: "100%",
                      cursor: "col-resize",
                      zIndex: 5,
                      background: "transparent",
                    }}
                    title="Drag to resize column"
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }, (_, r) => (
            <tr key={r} style={{ height: 26 }}>
              {/* Row number */}
              <td
                style={{
                  width: ROW_NUM_W,
                  textAlign: "center",
                  background: "#F0F0F0",
                  borderRight: "1px solid #D0D0D0",
                  borderBottom: "1px solid #D0D0D0",
                  fontSize: 11,
                  color: "#888",
                  fontFamily: "system-ui, sans-serif",
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  userSelect: "none",
                  boxSizing: "border-box",
                }}
              >
                {r + 1}
              </td>

              {Array.from({ length: cols }, (_, c) => {
                const isEdit = editing?.r === r && editing?.c === c;
                const isSel  = sel?.r === r && sel?.c === c;
                return (
                  <Cell
                    key={c}
                    value={isEdit ? editVal : (data[r]?.[c] ?? "")}
                    width={getColWidth(c)}
                    rowIdx={r}
                    colIdx={c}
                    isSelected={isSel}
                    isEditing={isEdit}
                    readOnly={readOnly}
                    onSelect={(r, c) => { setSel({ r, c }); containerRef.current?.focus(); }}
                    onEdit={(r, c) => {
                      if (readOnly) return;
                      setSel({ r, c });
                      setEditing({ r, c });
                      setEditVal(data[r]?.[c] ?? "");
                    }}
                    onCommit={commitEdit}
                    onChange={setEditVal}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
