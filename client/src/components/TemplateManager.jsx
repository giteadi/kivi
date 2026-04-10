// TemplateManager.jsx — RICH TEXT EDITOR VERSION
// Changes vs previous:
//  ✅ Export button replaced with ExportDropdown (Word / Excel choice)
//  ✅ exportToDocx helper added (HTML → .docx with structure preserved)
//  ✅ exportToXlsx retains same logic as before
//  ✅ No extra buttons added anywhere

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, LevelFormat,
} from "docx";
import api from "../services/api";
import ReportSheetViewer from "./ReportSheetViewer";
import Sidebar from "./Sidebar";
import ExportDropdown from "./ExportDropdown";

// ─── helpers ──────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  upload:   "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  plus:     "M12 5v14M5 12h14",
  trash:    "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  edit:     "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  save:     "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  x:        "M18 6L6 18M6 6l12 12",
  file:     "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  back:     "M19 12H5M12 19l-7-7 7-7",
  grid:     "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  list:     "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  patient:  "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

const css = {
  root:     { fontFamily: "system-ui,-apple-system,sans-serif", minHeight: "100vh", background: "#F3F4F6", color: "#1a1a1a", display: "flex" },
  main:     { flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "auto", marginLeft: 256 },
  header:   { background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, position: "sticky", top: 0, zIndex: 20 },
  h1:       { margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: "-0.3px" },
  subtitle: { margin: 0, fontSize: 12, color: "#6B7280" },
  btn: (v = "default") => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
    border: "1px solid", cursor: "pointer", transition: "all 0.15s",
    ...(v === "primary" ? { background: "#2563EB", color: "#fff",    borderColor: "#2563EB" } :
        v === "green"   ? { background: "#059669", color: "#fff",    borderColor: "#059669" } :
        v === "red"     ? { background: "#DC2626", color: "#fff",    borderColor: "#DC2626" } :
        v === "ghost"   ? { background: "transparent", color: "#374151", borderColor: "#D1D5DB" } :
                          { background: "#fff", color: "#374151", borderColor: "#D1D5DB" }),
  }),
  iconBtn:   { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 6, border: "1px solid #E5E7EB", background: "transparent", cursor: "pointer", color: "#6B7280" },
  toolbar:   { background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  searchInput: { width: "100%", padding: "7px 12px 7px 36px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" },
  content:   { padding: 24 },
  card: (sel) => ({ background: "#fff", borderRadius: 12, border: sel ? "2px solid #3B82F6" : "1px solid #E5E7EB", boxShadow: sel ? "0 0 0 3px rgba(59,130,246,0.1)" : "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden", cursor: "pointer", transition: "all 0.15s" }),
  cardIcon:  { width: 36, height: 36, background: "#EFF6FF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#2563EB" },
  panel:     { position: "fixed", inset: 0, background: "#fff", zIndex: 50, display: "flex", flexDirection: "column" },
  panelHeader: { background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  sheetTabs: { background: "#F1F5F9", borderBottom: "1px solid #E5E7EB", padding: "6px 14px", display: "flex", alignItems: "center", gap: 6, overflowX: "auto", flexShrink: 0 },
  tab: (a) => ({ padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid", background: a ? "#2563EB" : "#fff", color: a ? "#fff" : "#374151", borderColor: a ? "#2563EB" : "#D1D5DB", whiteSpace: "nowrap", flexShrink: 0 }),
  modal:     { background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: 28, maxWidth: 500, width: "90%", margin: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  overlay:   { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center" },
  input:     { width: "100%", padding: "9px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" },
  badge: (c) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 500, background: c === "green" ? "#D1FAE5" : c === "blue" ? "#DBEAFE" : "#F3F4F6", color: c === "green" ? "#065F46" : c === "blue" ? "#1D4ED8" : "#6B7280" }),
};

// ─── HTML → plain text (fallback) ────────────────────────────────────────────
function htmlToPlainText(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText || div.textContent || "";
}

// ─── Get HTML from sheet data ─────────────────────────────────────────────────
function getSheetHtml(sheetData) {
  if (!sheetData || !sheetData.length) return "";
  if (sheetData[0]?.[0] === "__html__") return sheetData[0][1] || "";
  // Raw array → join as text
  return sheetData.map(row => row.join("\t")).join("\n");
}

// ─── HTML → docx elements ────────────────────────────────────────────────────
const CELL_BORDER = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const CELL_BORDERS = { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER };

function nodeToRuns(node, inherited = {}) {
  const runs = [];
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent;
    if (text) runs.push(new TextRun({ text, ...inherited }));
    return runs;
  }
  const tag = node.tagName?.toLowerCase();
  const style = {
    ...inherited,
    bold:    inherited.bold    || ["b", "strong"].includes(tag),
    italics: inherited.italics || ["i", "em"].includes(tag),
    strike:  inherited.strike  || ["s", "del", "strike"].includes(tag),
    ...(tag === "u" ? { underline: {} } : {}),
  };
  for (const child of node.childNodes) runs.push(...nodeToRuns(child, style));
  return runs;
}

function nodeToDocxElements(node) {
  const els = [];
  if (node.nodeType === Node.TEXT_NODE) {
    const t = node.textContent.trim();
    if (t) els.push(new Paragraph({ children: [new TextRun(t)] }));
    return els;
  }
  const tag = node.tagName?.toLowerCase();
  if (!tag) return els;

  const headingMap = { h1: HeadingLevel.HEADING_1, h2: HeadingLevel.HEADING_2,
    h3: HeadingLevel.HEADING_3, h4: HeadingLevel.HEADING_4 };
  if (headingMap[tag]) {
    els.push(new Paragraph({ heading: headingMap[tag], children: nodeToRuns(node) }));
    return els;
  }

  if (["p", "div", "section"].includes(tag)) {
    const runs = nodeToRuns(node);
    if (runs.length) { els.push(new Paragraph({ children: runs })); return els; }
    for (const c of node.childNodes) els.push(...nodeToDocxElements(c));
    return els;
  }

  if (tag === "br") { els.push(new Paragraph({ children: [] })); return els; }

  if (tag === "hr") {
    els.push(new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "AAAAAA", space: 1 } },
      children: [],
    }));
    return els;
  }

  if (tag === "ul") {
    node.querySelectorAll(":scope > li").forEach(li =>
      els.push(new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: nodeToRuns(li) }))
    );
    return els;
  }

  if (tag === "ol") {
    node.querySelectorAll(":scope > li").forEach(li =>
      els.push(new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: nodeToRuns(li) }))
    );
    return els;
  }

  if (tag === "table") {
    const trList = node.querySelectorAll("tr");
    let colCount = 0;
    trList.forEach(tr => { colCount = Math.max(colCount, tr.querySelectorAll("td,th").length); });
    const tableWidth = 9360;
    const colWidth = colCount > 0 ? Math.floor(tableWidth / colCount) : tableWidth;
    const rows = [];
    trList.forEach((tr, ri) => {
      const cells = [];
      tr.querySelectorAll("td,th").forEach(td => {
        const isHeader = td.tagName.toLowerCase() === "th" || ri === 0;
        cells.push(new TableCell({
          borders: CELL_BORDERS,
          width: { size: colWidth, type: WidthType.DXA },
          shading: isHeader ? { fill: "D5E8F0", type: ShadingType.CLEAR } : undefined,
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: nodeToRuns(td) })],
        }));
      });
      rows.push(new TableRow({ children: cells }));
    });
    if (rows.length) {
      els.push(new Table({ width: { size: tableWidth, type: WidthType.DXA }, columnWidths: Array(colCount).fill(colWidth), rows }));
      els.push(new Paragraph({ children: [] }));
    }
    return els;
  }

  if (tag === "blockquote") {
    els.push(new Paragraph({ indent: { left: 720 }, children: nodeToRuns(node) }));
    return els;
  }

  // Fallback
  for (const c of node.childNodes) els.push(...nodeToDocxElements(c));
  return els;
}

function htmlToDocxElements(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  const els = [];
  for (const c of div.childNodes) els.push(...nodeToDocxElements(c));
  if (!els.length) els.push(new Paragraph({ children: [] }));
  return els;
}

// ─── DOCX export ─────────────────────────────────────────────────────────────
async function buildAndDownloadDocx(allData, sheetList, patientName, templateName) {
  try {
    console.log('[DEBUG] buildAndDownloadDocx called with:', { patientName, templateName, sheetCount: sheetList?.length });
    
    if (!sheetList || sheetList.length === 0) {
      throw new Error('No sheets to export');
    }

    const sections = [];

    sheetList.forEach((name, idx) => {
      const sheetData = allData[name] || [];
      const html = getSheetHtml(sheetData);
      
      // Skip empty sheets (no content or just <p><br></p>)
      const isEmpty = !html || html === "" || html === "<p><br></p>" || html.replace(/<[^>]+>/g, "").trim() === "";
      if (isEmpty) {
        console.log(`[DEBUG] Skipping empty sheet: ${name}`);
        return;
      }
      
      console.log(`[DEBUG] Processing sheet ${name}:`, html?.substring(0, 100));
      
      // Only export content, not sheet names (to avoid duplicate titles)
      const children = htmlToDocxElements(html);

      sections.push({
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      });
    });

    console.log('[DEBUG] Creating Document with sections:', sections.length);
    
    const doc = new Document({
      numbering: {
        config: [
          { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
          { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
        ],
      },
      styles: {
        default: { document: { run: { font: "Arial", size: 24 } } },
        paragraphStyles: [
          { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
            run: { size: 32, bold: true, font: "Arial", color: "1D4ED8" },
            paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
          { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
            run: { size: 28, bold: true, font: "Arial" },
            paragraph: { spacing: { before: 180, after: 90 }, outlineLevel: 1 } },
        ],
      },
      sections,
    });

    console.log('[DEBUG] Generating blob...');
    // Use toBlob() for browser compatibility (toBuffer() is Node.js only)
    const blob = await Packer.toBlob(doc);
    console.log('[DEBUG] Blob generated:', blob?.size, 'bytes');
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${patientName || "Report"}_${templateName || "export"}.docx`;
    console.log('[DEBUG] Triggering download:', a.download);
    a.click();
    URL.revokeObjectURL(url);
    console.log('[DEBUG] Export complete!');
  } catch (err) {
    console.error('[DEBUG] DOCX export failed:', err);
    throw err;
  }
}

// ─── XLSX export (structured — preserves HTML as readable text with sheet names) ──
function buildAndDownloadXlsx(allData, sheetList, patientName, templateName) {
  const wb = XLSX.utils.book_new();
  sheetList.forEach(name => {
    const d = allData[name] || [];
    let rows;
    if (d[0]?.[0] === "__html__") {
      const html = d[0][1] || "";
      // Parse HTML into structured rows: headings, paragraphs, table rows
      const div = document.createElement("div");
      div.innerHTML = html;
      rows = [];

      function extractRows(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const t = node.textContent.trim();
          if (t) rows.push([t]);
          return;
        }
        const tag = node.tagName?.toLowerCase();
        if (!tag) return;

        if (/^h[1-6]$/.test(tag)) {
          rows.push([node.innerText.trim().toUpperCase()]);
          return;
        }
        if (tag === "p" || tag === "div") {
          const t = node.innerText?.trim();
          if (t) rows.push([t]);
          else node.childNodes.forEach(extractRows);
          return;
        }
        if (tag === "br") { rows.push([""]); return; }
        if (tag === "hr") { rows.push(["---"]); return; }
        if (tag === "li") { rows.push(["  • " + node.innerText?.trim()]); return; }
        if (tag === "table") {
          node.querySelectorAll("tr").forEach(tr => {
            rows.push([...tr.querySelectorAll("td,th")].map(c => c.innerText?.trim() || ""));
          });
          rows.push([""]);
          return;
        }
        node.childNodes.forEach(extractRows);
      }

      div.childNodes.forEach(extractRows);
      if (!rows.length) rows = [[""]];
    } else {
      rows = d;
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), name.substring(0, 31));
  });
  XLSX.writeFile(wb, `${patientName || "Report"}_${templateName || "export"}.xlsx`);
}

// ══════════════════════════════════════════════════════════════════════════════
// REPORT EDIT PANEL
// ══════════════════════════════════════════════════════════════════════════════
function ReportEditPanel({ reportPanel, onBack, onSave }) {
  const { templateName, allSheets, allData, patientName: initPatient } = reportPanel;

  const [activeSheet, setActiveSheet]     = useState(allSheets[0]);
  const [reportData, setReportData]       = useState(allData);
  const [reportPatient, setReportPatient] = useState(initPatient || "");
  const [sheetList, setSheetList]         = useState(allSheets);
  const [showNewSheetModal, setShowNewSheetModal] = useState(false);
  const [newSheetName, setNewSheetName]   = useState("");

  const addNewSheet = () => {
    const name = newSheetName.trim() || `Sheet ${sheetList.length + 1}`;
    if (sheetList.includes(name)) { alert("Sheet name already exists!"); return; }
    setReportData(prev => ({ ...prev, [name]: [["__html__", "<p><br></p>"]] }));
    setSheetList(prev => [...prev, name]);
    setActiveSheet(name);
    setShowNewSheetModal(false);
    setNewSheetName("");
  };

  return (
    <div style={css.panel}>
      {/* Header */}
      <div style={{ ...css.panelHeader, background: "#064E3B", borderColor: "#065F46" }}>
        <button
          style={{ ...css.btn("ghost"), color: "#D1FAE5", borderColor: "#065F46" }}
          onClick={() => { if (confirm("Discard changes and go back?")) onBack(); }}
        >
          <Icon d={icons.back} size={15} /> Back
        </button>
        <span style={{ width: 1, height: 24, background: "#065F46" }} />
        <Icon d={icons.patient} size={18} stroke="#6EE7B7" />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#D1FAE5", fontWeight: 600, fontSize: 14 }}>Patient Report:</span>
          <input
            value={reportPatient}
            onChange={e => setReportPatient(e.target.value)}
            placeholder="Enter patient name…"
            style={{
              background: "#065F46", border: "1px solid #059669", color: "#fff",
              borderRadius: 6, padding: "4px 10px", fontSize: 13, outline: "none",
              fontFamily: "inherit", width: 200,
            }}
          />
        </div>
        <span style={{ color: "#6EE7B7", fontSize: 12, marginLeft: 4 }}>— {templateName}</span>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          {/* ── Single Export button → dropdown (Word / Excel) ── */}
          <ExportDropdown
            ghost={true}
            onExportDocx={() => buildAndDownloadDocx(reportData, sheetList, reportPatient, templateName)}
            onExportXlsx={() => buildAndDownloadXlsx(reportData, sheetList, reportPatient, templateName)}
          />

          <button style={css.btn("green")} onClick={() => {
            console.log("[DEBUG] Save Report button clicked!");
            onSave(reportData, sheetList, reportPatient);
          }}>
            <Icon d={icons.save} size={14} /> Save Report
          </button>
        </div>
      </div>

      {/* Sheet tabs */}
      <div style={{ ...css.sheetTabs, background: "#F0FDF4", borderColor: "#BBF7D0" }}>
        {sheetList.map(name => (
          <button
            key={name}
            style={{
              ...css.tab(name === activeSheet),
              ...(name === activeSheet ? { background: "#059669", borderColor: "#059669" } : {}),
            }}
            onClick={() => setActiveSheet(name)}
          >
            {name}
          </button>
        ))}
        <button
          onClick={() => setShowNewSheetModal(true)}
          title="Add new sheet"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 28, height: 28, borderRadius: 6,
            border: "1px dashed #6EE7B7", background: "rgba(255,255,255,0.3)",
            color: "#065F46", cursor: "pointer", fontSize: 18, fontWeight: 300, flexShrink: 0,
          }}
        >+</button>
      </div>

      <ReportSheetViewer
        key={activeSheet}
        data={reportData[activeSheet] || [["__html__", "<p><br></p>"]]}
        readOnly={false}
        reportMode={true}
        onDataChange={newData => setReportData(prev => ({ ...prev, [activeSheet]: newData }))}
      />

      {/* New Sheet Modal */}
      {showNewSheetModal && (
        <div style={css.overlay}>
          <div style={{ ...css.modal, maxWidth: 380 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>➕ Add New Sheet</h3>
              <button style={css.iconBtn} onClick={() => setShowNewSheetModal(false)}>
                <Icon d={icons.x} size={16} />
              </button>
            </div>
            <input
              style={css.input}
              placeholder={`Sheet ${sheetList.length + 1}`}
              value={newSheetName}
              onChange={e => setNewSheetName(e.target.value)}
              autoFocus
              onKeyDown={e => { if (e.key === "Enter") addNewSheet(); if (e.key === "Escape") setShowNewSheetModal(false); }}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
              <button style={css.btn("ghost")} onClick={() => setShowNewSheetModal(false)}>Cancel</button>
              <button style={css.btn("primary")} onClick={addNewSheet}>
                <Icon d={icons.plus} size={14} /> Create Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VIEW PANEL
// ══════════════════════════════════════════════════════════════════════════════
function ViewPanel({ template, onBack, onCreateReport }) {
  const [activeSheetIdx, setActiveSheetIdx] = useState(0);
  const sheetNames = template.sheetNames || [];
  const currentSheet = sheetNames[activeSheetIdx] || sheetNames[0];
  const [localSheets, setLocalSheets] = useState(template.sheets);

  useEffect(() => {
    setLocalSheets(template.sheets);
    setActiveSheetIdx(0);
  }, [template.id, template.sheets]);

  return (
    <div style={css.panel}>
      <div style={css.panelHeader}>
        <button style={css.btn("ghost")} onClick={onBack}>
          <Icon d={icons.back} size={15} /> Back
        </button>
        <span style={{ width: 1, height: 24, background: "#E5E7EB" }} />
        <span style={{ fontWeight: 600, fontSize: 15 }}>{template.name}</span>
        <span style={{ ...css.badge("blue"), marginLeft: 4 }}>{template.type}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <button
            style={css.btn("primary")}
            onClick={async () => {
              try {
                await api.updateTemplate(template.id, {
                  name: template.name,
                  type: template.type || "import",
                  description: template.desc,
                  template_data: {
                    sheets: localSheets,
                    sheetNames: template.sheetNames,
                    row_heights: template.rowHeights || {}
                  }
                });
                alert("Template saved successfully!");
              } catch (err) {
                alert("Save failed: " + err.message);
              }
            }}
          >
            <Icon d={icons.save} size={14} /> Save Changes
          </button>
          <span style={{ width: 1, height: 24, background: "#E5E7EB" }} />

          {/* ── Single Export button → dropdown (Word / Excel) ── */}
          <ExportDropdown
            onExportDocx={() => buildAndDownloadDocx(localSheets, template.sheetNames, template.name, template.name)}
            onExportXlsx={() => doExport({ ...template, sheets: localSheets })}
          />

          <button style={css.btn("green")} onClick={() => onCreateReport(template)}>
            <Icon d={icons.patient} size={14} /> New Report
          </button>
        </div>
      </div>

      <div style={css.sheetTabs}>
        {sheetNames.map((name, i) => (
          <button key={name} style={css.tab(i === activeSheetIdx)} onClick={() => setActiveSheetIdx(i)}>
            {name}
          </button>
        ))}
      </div>

      <ReportSheetViewer
        data={localSheets[currentSheet] || [["__html__", "<p><br></p>"]]}
        readOnly={false}
        onDataChange={(newData) => {
          setLocalSheets(prev => ({ ...prev, [currentSheet]: newData }));
        }}
        onCreateReport={() => onCreateReport(template)}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function TemplateManager() {
  const [templates, setTemplates]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [view, setView]             = useState("grid");
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState([]);

  const [panel, setPanel]           = useState(null);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [reportPanel, setReportPanel]   = useState(null);

  const fileRef = useRef(null);

  useEffect(() => { fetchTemplates(); }, []);

  const fetchTemplates = async () => {
    setLoading(true); setError(null);
    try {
      const response = await api.getTemplates();
      if (response.success && response.data?.length > 0) {
        const transformed = response.data.map(t => {
          let parsedData = t.template_data;
          if (typeof parsedData === "string") {
            try { parsedData = JSON.parse(parsedData); } catch { parsedData = {}; }
          }
          const sheets     = parsedData?.sheets     || {};
          const sheetNames = parsedData?.sheetNames || Object.keys(sheets);
          return {
            id:         t.id,
            name:       t.name,
            type:       t.type || "import",
            desc:       t.description || `${t.name} template`,
            sheets, sheetNames,
            rowHeights: parsedData?.row_heights || {},
            createdAt:  t.created_at || new Date().toISOString(),
          };
        });
        setTemplates(transformed);
      } else {
        setTemplates([]);
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "https://dashboard.iplanbymsl.in/api"}/templates/upload`,
        { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }, body: formData }
      );
      const result = await response.json();
      if (result.success) await fetchTemplates();
      else alert("Upload failed: " + (result.message || "Unknown error"));
    } catch (err) { alert("Error: " + err.message); }
    finally { setLoading(false); e.target.value = ""; }
  };

  const deleteTpl = async (id) => {
    if (!confirm("Delete this template?")) return;
    try { await api.deleteTemplate(id); await fetchTemplates(); }
    catch { alert("Failed to delete"); }
  };

  const openView = (tpl) => { setActiveTemplate(tpl); setPanel("view"); };

  const openCreateReport = (tpl) => {
    const allData = Object.fromEntries(
      tpl.sheetNames.map(n => [n, [["__html__", "<p><br></p>"]]])
    );
    setReportPanel({ templateName: tpl.name, allSheets: tpl.sheetNames, allData, patientName: "" });
    setPanel("report");
  };

  const saveReport = async (allData, sheetList, activePatientName) => {
    try {
      const name = `${activePatientName || "Patient"} — ${reportPanel.templateName} — ${new Date().toLocaleDateString("en-IN")}`;
      const result = await api.createTemplate({
        name,
        type: "report",
        description: `Patient report for ${activePatientName}`,
        template_data: { sheets: allData, sheetNames: sheetList },
      });
      await fetchTemplates();
      setPanel(null);
      setReportPanel(null);
      alert(`✅ Report "${name}" saved successfully!`);
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  const filtered = useMemo(() =>
    templates.filter(t => !search || t.name?.toLowerCase().includes(search.toLowerCase())),
    [templates, search]
  );

  const toggleSel = (t) => setSelected(s => s.find(x => x.id === t.id) ? s.filter(x => x.id !== t.id) : [...s, t]);

  return (
    <div style={css.root}>
      <Sidebar activeItem="template-manager" setActiveItem={() => {}} sidebarCollapsed={false} setSidebarCollapsed={() => {}} />

      <div style={css.main}>
        {/* Header */}
        <div style={css.header}>
          <div>
            <h1 style={css.h1}>📊 Template Manager</h1>
            <p style={css.subtitle}>
              {loading ? "Loading…" : `${templates.length} templates`}
              {error && <span style={{ color: "#DC2626", marginLeft: 8 }}>⚠️ {error}</span>}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {loading && <span style={{ fontSize: 12, color: "#6B7280" }}>⏳</span>}
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleUpload} style={{ display: "none" }} />
            <button style={css.btn("primary")} onClick={() => fileRef.current?.click()}>
              <Icon d={icons.upload} size={14} /> Upload Excel
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={css.toolbar}>
          <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>
              <Icon d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={15} />
            </span>
            <input style={css.searchInput} placeholder="Search templates…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {[{ v: "grid", d: icons.grid }, { v: "list", d: icons.list }].map(({ v, d }) => (
              <button key={v} onClick={() => setView(v)} style={{ ...css.iconBtn, background: view === v ? "#EFF6FF" : "transparent", color: view === v ? "#2563EB" : "#6B7280", borderColor: view === v ? "#BFDBFE" : "#E5E7EB" }}>
                <Icon d={d} size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={css.content}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
              <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>No templates yet</p>
              <p style={{ fontSize: 13, marginBottom: 20 }}>Upload an Excel assessment template to get started</p>
              <button style={css.btn("primary")} onClick={() => fileRef.current?.click()}>
                <Icon d={icons.upload} size={14} /> Upload Excel
              </button>
            </div>
          ) : view === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 16 }}>
              {filtered.map(t => {
                const isSel = !!selected.find(s => s.id === t.id);
                return (
                  <div key={t.id} style={css.card(isSel)} onClick={() => toggleSel(t)}>
                    <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={css.cardIcon}><Icon d={icons.file} size={20} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px", lineHeight: 1.3 }}>{t.name}</p>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          <span style={css.badge(t.type === "report" ? "green" : "blue")}>{t.type}</span>
                          <span style={css.badge("default")}>{(t.sheetNames || []).length} sheets</span>
                        </div>
                      </div>
                      <input type="checkbox" checked={isSel} onChange={() => {}} style={{ accentColor: "#2563EB", width: 15, height: 15 }} />
                    </div>
                    <div style={{ borderTop: "1px solid #F3F4F6", padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[
                          { icon: icons.eye,     title: "View/Edit",  fn: (e) => { e.stopPropagation(); openView(t); },        color: "#2563EB" },
                          { icon: icons.patient, title: "New Report", fn: (e) => { e.stopPropagation(); openCreateReport(t); },    color: "#059669" },
                        ].map(({ icon, title, fn, color }) => (
                          <button key={title} title={title} onClick={fn}
                            style={{ ...css.iconBtn, width: 28, height: 28 }}
                            onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.background = "#F9FAFB"; }}
                            onMouseLeave={e => { e.currentTarget.style.color = "#6B7280"; e.currentTarget.style.background = "transparent"; }}>
                            <Icon d={icon} size={14} />
                          </button>
                        ))}
                      </div>
                      <button onClick={e => { e.stopPropagation(); deleteTpl(t.id); }}
                        style={{ ...css.iconBtn, width: 28, height: 28 }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#DC2626"; e.currentTarget.style.background = "#FEF2F2"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#6B7280"; e.currentTarget.style.background = "transparent"; }}>
                        <Icon d={icons.trash} size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", width: 40 }}>
                      <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0}
                        onChange={e => setSelected(e.target.checked ? [...filtered] : [])} style={{ accentColor: "#2563EB" }} />
                    </th>
                    {["Name", "Type", "Sheets", "Created", "Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: h === "Actions" ? "right" : "left", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => {
                    const isSel = !!selected.find(s => s.id === t.id);
                    return (
                      <tr key={t.id} style={{ background: isSel ? "#EFF6FF" : "transparent", cursor: "pointer" }} onClick={() => toggleSel(t)}>
                        <td style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6" }}>
                          <input type="checkbox" checked={isSel} onChange={() => {}} style={{ accentColor: "#2563EB" }} />
                        </td>
                        <td style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ ...css.cardIcon, width: 28, height: 28 }}><Icon d={icons.file} size={14} /></div>
                            <span style={{ fontWeight: 500 }}>{t.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6" }}>
                          <span style={css.badge(t.type === "report" ? "green" : "blue")}>{t.type}</span>
                        </td>
                        <td style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6", color: "#6B7280", fontSize: 12 }}>
                          {(t.sheetNames || []).length}
                        </td>
                        <td style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6", color: "#6B7280", fontSize: 12 }}>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6" }}>
                          <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", alignItems: "center" }}>
                            {[
                              { icon: icons.eye,      title: "View",       fn: (e) => { e.stopPropagation(); openView(t); } },
                              { icon: icons.patient,  title: "New Report", fn: (e) => { e.stopPropagation(); openCreateReport(t); } },
                              { icon: icons.trash,   title: "Delete",     fn: (e) => { e.stopPropagation(); deleteTpl(t.id); } },
                            ].map(({ icon, title, fn }) => (
                              <button key={title} title={title} onClick={fn} style={{ ...css.iconBtn, width: 28, height: 28 }}>
                                <Icon d={icon} size={14} />
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── VIEW PANEL ── */}
      {panel === "view" && activeTemplate && (
        <ViewPanel
          key={activeTemplate.id}
          template={activeTemplate}
          onBack={() => setPanel(null)}
          onCreateReport={openCreateReport}
        />
      )}

      {/* ── REPORT EDIT PANEL ── */}
      {panel === "report" && reportPanel && (
        <ReportEditPanel
          reportPanel={reportPanel}
          onBack={() => { setPanel(null); setReportPanel(null); }}
          onSave={saveReport}
        />
      )}
    </div>

  );
}