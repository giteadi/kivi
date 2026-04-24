import { useState, useRef, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, LevelFormat, ImageRun,
} from "docx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "../services/api";
import Sidebar from "./Sidebar";
import ReportSheetViewer from "./ReportSheetViewer";

// Folder icons
const folderIcons = {
  folder: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
  folderOpen: "M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h9a2 2 0 0 1 2 2v1",
  chevronRight: "M9 18l6-6-6-6",
  chevronDown: "M6 9l6 6 6-6",
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  addFolder: "M12 5v14M5 12h14",
  more: "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z",
};

const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// Default MindSaid Learning Centre header HTML for new documents
const DEFAULT_REPORT_HEADER = `<div style="margin-bottom:20px;padding:20px;background:#f8f9fa;border:1px solid #dee2e6;border-radius:8px;">
  <div style="display:flex;align-items:center;gap:20px;">
    <div style="flex-shrink:0;">
      <img src="https://mindsaidlearning.com/logo.png" alt="MindSaid Learning Centre" style="max-width:200px;height:auto;" onerror="this.style.display='none'" />
    </div>
    <div style="flex:1;">
      <h1 style="margin:0 0 5px 0;color:#333;font-size:24px;">MindSaid Learning Centre</h1>
      <p style="margin:0;color:#666;font-size:14px;">Learning This Ability</p>
      <p style="margin:5px 0 0 0;color:#666;font-size:12px;">Psycho-educational Assessment & Intervention Centre</p>
      <p style="margin:5px 0 0 0;color:#666;font-size:12px;">
        Tel: +918928186952 | <a href="mailto:contact@mindsaidlearning.com" style="color:#4A90E2;">contact@mindsaidlearning.com</a><br/>
        <a href="https://www.mindsaidlearning.com" style="color:#4A90E2;">www.mindsaidlearning.com</a>
      </p>
    </div>
  </div>
</div>`;

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
  rename:   "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
};

const css = {
  root:     { fontFamily: "system-ui,-apple-system,sans-serif", minHeight: "100vh", display: "flex" },
  main:     { flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "auto", marginLeft: "256px", paddingLeft: "24px" },
  header:   { padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, position: "sticky", top: 0, zIndex: 20 },
  h1:       { margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: "-0.3px" },
  subtitle: { margin: 0, fontSize: 12 },
  btn: (v = "default") => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
    border: "1px solid", cursor: "pointer", transition: "all 0.15s",
    ...(v === "primary" ? { background: "#2563EB", color: "#fff", borderColor: "#2563EB" } :
        v === "green"   ? { background: "#059669", color: "#fff", borderColor: "#059669" } :
        v === "red"     ? { background: "#DC2626", color: "#fff",    borderColor: "#DC2626" } :
        v === "ghost"   ? { background: "transparent", borderColor: "#D1D5DB" } :
                          { background: "transparent", borderColor: "#D1D5DB" }),
  }),
  iconBtn:   { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 6, border: "1px solid", background: "transparent", cursor: "pointer" },
  toolbar:   { padding: "10px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", background: "#fff", zIndex: 5, position: "relative", borderBottom: "1px solid #E5E7EB" },
  content:   { padding: 24, display: "flex", gap: 24 },
  folderTree: { width: 280, minWidth: 280, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" },
  folderTreeHeader: { padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  folderTreeTitle: { margin: 0, fontSize: 14, fontWeight: 600 },
  folderTreeContent: { padding: "8px 0", overflow: "auto", flex: 1 },
  folderItem: (level, selected) => ({
    padding: "8px 16px 8px " + (16 + level * 20) + "px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: selected ? 500 : 400,
    transition: "all 0.15s"
  }),
  folderIcon: { flexShrink: 0 },
  folderName: { flex: 1, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  folderToggle: { flexShrink: 0, transition: "transform 0.15s" },
  mainContent: { flex: 1, display: "flex", flexDirection: "column" },
  breadcrumb: { display: "flex", alignItems: "center", gap: 8, padding: "0 0 16px 0", fontSize: 13 },
  breadcrumbItem: { cursor: "pointer" },
  breadcrumbSeparator: {},
  card: (sel) => ({ borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.15s" }),
  cardIcon:  { width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  panel:     { position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column" },
  panelHeader: { padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, background: "#fff", zIndex: 10, position: "relative" },
  sheetTabs: { borderBottom: "1px solid", padding: "6px 14px", display: "flex", alignItems: "center", gap: 6, overflowX: "auto", flexShrink: 0, background: "#fff", zIndex: 5, position: "relative" },
  tab: (a) => ({ padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid", whiteSpace: "nowrap", flexShrink: 0 }),
  modal:     { borderRadius: 14, padding: 28, maxWidth: 500, width: "90%", margin: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  overlay:   { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center" },
  input:     { width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" },
  badge: (c) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 500 }),
};

// ─── HTML → plain text ─────────────────────────────────────────────────────────
function htmlToPlainText(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText || div.textContent || "";
}

// ─── Clean display name (remove dash and everything after) ────────────────────
function getDisplayName(fullName) {
  if (!fullName) return "";
  // Split by " — " (em dash) and take first part
  const parts = fullName.split(" — ");
  return parts[0].trim();
}

// ─── HTML → docx elements (from TemplateManager) ─────────────────────────────
const CELL_BORDER = { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" };
const CELL_BORDERS = { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER };
const PAGE_CONTENT_WIDTH = 8640;

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
    bold:    inherited.bold    || ["b", "strong", "th"].includes(tag),
    italics: inherited.italics || ["i", "em"].includes(tag),
    strike:  inherited.strike  || ["s", "del", "strike"].includes(tag),
    ...(tag === "u" ? { underline: {} } : {}),
  };

  if (tag === "br") {
    runs.push(new TextRun({ text: "", break: 1 }));
    return runs;
  }

  for (const child of node.childNodes) runs.push(...nodeToRuns(child, style));
  return runs;
}

function estimateColWidths(trList, totalWidth) {
  let colCount = 0;
  trList.forEach(tr => {
    let c = 0;
    tr.querySelectorAll("td,th").forEach(cell => {
      c += parseInt(cell.getAttribute("colspan") || "1");
    });
    colCount = Math.max(colCount, c);
  });
  if (colCount <= 1) return [totalWidth];

  const colLengths = Array(colCount).fill(0);
  trList.slice(0, 5).forEach(tr => {
    [...tr.querySelectorAll("td,th")].forEach((cell, i) => {
      if (i < colCount) {
        colLengths[i] = Math.max(colLengths[i], (cell.textContent||"").trim().length);
      }
    });
  });

  const MIN_FRAC = 0.08;
  const remaining = Math.max(0, 1 - MIN_FRAC * colCount);
  const totalLen = colLengths.reduce((a,b) => a+b, 0) || 1;
  const fracs = colLengths.map(len => MIN_FRAC + (len/totalLen) * remaining);
  const fracSum = fracs.reduce((a,b) => a+b, 0);
  return fracs.map(f => Math.max(400, Math.floor((f/fracSum) * totalWidth)));
}

function cellToParagraphs(tdNode) {
  const paragraphs = [];
  const isTh = tdNode.tagName?.toLowerCase() === "th";

  function processNode(node, inherited = {}) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent;
      if (t && t.trim()) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: t, ...inherited })],
          spacing: { after: 0 },
        }));
      }
      return;
    }
    const tag = node.tagName?.toLowerCase();
    if (!tag) return;
    if (tag === "br") {
      paragraphs.push(new Paragraph({ children: [], spacing: { after: 0 } }));
      return;
    }
    if (["p","div","span"].includes(tag)) {
      const runs = nodeToRuns(node, inherited);
      if (runs.length) {
        paragraphs.push(new Paragraph({ children: runs, spacing: { after: 60 } }));
      } else {
        for (const child of node.childNodes) processNode(child, inherited);
      }
      return;
    }
    if (/^h[1-6]$/.test(tag)) {
      const hmap = { h1: HeadingLevel.HEADING_1, h2: HeadingLevel.HEADING_2,
                     h3: HeadingLevel.HEADING_3, h4: HeadingLevel.HEADING_4 };
      paragraphs.push(new Paragraph({
        heading: hmap[tag] || HeadingLevel.HEADING_3,
        children: nodeToRuns(node),
        spacing: { after: 60 },
      }));
      return;
    }
    const newInherited = {
      ...inherited,
      bold: inherited.bold || ["b","strong","th"].includes(tag),
      italics: inherited.italics || ["i","em"].includes(tag),
    };
    for (const child of node.childNodes) processNode(child, newInherited);
  }

  for (const child of tdNode.childNodes) processNode(child, { bold: isTh });
  if (!paragraphs.length) paragraphs.push(new Paragraph({ children: [], spacing: { after: 0 } }));
  return paragraphs;
}

async function nodeToDocxElements(node) {
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
    // ✅ CHECK: Agar p/div ke andar img hai toh runs nahi, children process karo
    const hasImg = node.querySelector?.("img");
    if (hasImg) {
      for (const c of node.childNodes) els.push(...await nodeToDocxElements(c));
      return els;
    }
    
    const runs = nodeToRuns(node);
    if (runs.length) { els.push(new Paragraph({ children: runs })); return els; }
    for (const c of node.childNodes) els.push(...await nodeToDocxElements(c));
    return els;
  }

  if (tag === "br") { els.push(new Paragraph({ children: [] })); return els; }

  // Handle images
  if (tag === "img") {
    const src = node.getAttribute("src");
    if (!src) return els;
    
    try {
      let imageBuffer;
      let imageType = "png";
      
      if (src.startsWith("data:image")) {
        const [meta, base64Data] = src.split(",");
        const mimeMatch = meta.match(/data:image\/(\w+);/);
        imageType = mimeMatch?.[1]?.toLowerCase() || "png";
        // jpeg → jpg (docx library "jpg" expect karta hai)
        if (imageType === "jpeg") imageType = "jpg";
        
        // ✅ KEY FIX: ArrayBuffer pass karo directly
        const binaryStr = atob(base64Data);
        const len = binaryStr.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < len; i++) {
          view[i] = binaryStr.charCodeAt(i);
        }
        imageBuffer = buffer; // ArrayBuffer, not Uint8Array
      } else {
        try {
          const dataUrl = await new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.naturalWidth || 250;
              canvas.height = img.naturalHeight || 100;
              canvas.getContext("2d").drawImage(img, 0, 0);
              resolve(canvas.toDataURL("image/png"));
            };
            img.onerror = reject;
            img.src = src;
          });
          const base64Data = dataUrl.split(",")[1];
          const binaryStr = atob(base64Data);
          const len = binaryStr.length;
          const buffer = new ArrayBuffer(len);
          const view = new Uint8Array(buffer);
          for (let i = 0; i < len; i++) {
            view[i] = binaryStr.charCodeAt(i);
          }
          imageBuffer = buffer;
          imageType = "png";
        } catch {
          const response = await fetch(src);
          imageBuffer = await response.arrayBuffer(); // ✅ ArrayBuffer directly
          const ext = src.split(".").pop()?.toLowerCase() || "png";
          const typeMap = { jpg: "jpg", jpeg: "jpg", png: "png", gif: "gif", webp: "png" };
          imageType = typeMap[ext] || "png";
        }
      }
      
      // ✅ Image dimensions bhi console mein log karo debug ke liye
      console.log("[IMG] type:", imageType, "buffer size:", imageBuffer.byteLength);
      
      els.push(new Paragraph({
        alignment: AlignmentType.CENTER,  // ✅ Center alignment
        children: [new ImageRun({
          data: imageBuffer,
          transformation: { width: 250, height: 100 },
          type: imageType,
        })],
        spacing: { after: 120 },
      }));
    } catch (err) {
      console.warn("[IMG] Failed, skipping:", err.message);
    }
    return els;
  }

  if (tag === "hr") {
    els.push(new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "AAAAAA", space: 1 } },
      children: [],
    }));
    return els;
  }

  if (tag === "ul") {
    const liElements = node.querySelectorAll(":scope > li");
    for (const li of liElements) {
      els.push(new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: nodeToRuns(li) }));
    }
    return els;
  }

  if (tag === "ol") {
    const liElements = node.querySelectorAll(":scope > li");
    for (const li of liElements) {
      els.push(new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: nodeToRuns(li) }));
    }
    return els;
  }

  if (tag === "table") {
    const trList = Array.from(node.querySelectorAll("tr"));
    if (!trList.length) return els;

    let colCount = 0;
    trList.forEach(tr => {
      let count = 0;
      tr.querySelectorAll("td,th").forEach(cell => {
        count += parseInt(cell.getAttribute("colspan") || "1");
      });
      colCount = Math.max(colCount, count);
    });
    if (colCount === 0) return els;

    const colWidths = estimateColWidths(trList, PAGE_CONTENT_WIDTH);
    const finalColCount = colWidths.length;

    const rows = trList.map((tr, rowIdx) => {
      const tdList = Array.from(tr.querySelectorAll("td,th"));
      const cells = tdList.map((td, colIdx) => {
        const isHeader = td.tagName.toLowerCase() === "th" || rowIdx === 0;
        const colspan = parseInt(td.getAttribute("colspan") || "1");
        const cellWidth = colspan > 1
          ? colWidths.slice(colIdx, colIdx + colspan).reduce((a,b) => a+b, 0)
          : (colWidths[colIdx] || Math.floor(PAGE_CONTENT_WIDTH / finalColCount));

        return new TableCell({
          borders: CELL_BORDERS,
          columnSpan: colspan > 1 ? colspan : undefined,
          width: { size: cellWidth, type: WidthType.DXA },
          shading: isHeader ? { fill: "D5E8F0", type: ShadingType.CLEAR } : undefined,
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: cellToParagraphs(td),
        });
      });

      return new TableRow({ children: cells, tableHeader: rowIdx === 0 });
    });

    els.push(new Table({
      width: { size: PAGE_CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: colWidths,
      rows,
    }));
    els.push(new Paragraph({ children: [], spacing: { after: 120 } }));
    return els;
  }

  if (tag === "blockquote") {
    els.push(new Paragraph({ indent: { left: 720 }, children: nodeToRuns(node) }));
    return els;
  }

  for (const c of node.childNodes) els.push(...await nodeToDocxElements(c));
  return els;
}

async function htmlToDocxElements(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  const els = [];
  for (const c of div.childNodes) els.push(...await nodeToDocxElements(c));
  if (!els.length) els.push(new Paragraph({ children: [] }));
  return els;
}

// ─── Get sheet HTML ────────────────────────────────────────────────────────────
function getSheetHtml(sheetData) {
  if (!sheetData || !sheetData.length) return "";
  if (sheetData[0]?.[0] === "__html__") return sheetData[0][1] || "";
  
  const rows = sheetData.filter(row => row && row.length > 0);
  if (!rows.length) return "";
  
  const tableRows = rows.map((row, rowIdx) => {
    const tag = rowIdx === 0 ? "th" : "td";
    const cells = row.map(cell => 
      `<${tag} style="border:1px solid #ccc;padding:6px 10px;">${cell ?? ""}</${tag}>` 
    ).join("");
    return `<tr>${cells}</tr>`;
  }).join("");
  
  return `<table style="border-collapse:collapse;width:100%;">${tableRows}</table>`;
}

// ─── Sheet data → .docx ─────────────────────────────────────────────────────────
async function exportSheetToDocx(sheetData, fileName) {
  const blob = await createDocxBlob(sheetData);
  if (!blob) return;
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.replace(/\.[^/.]+$/, "") + ".docx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Helper: Create DOCX blob without downloading (for upload)
async function createDocxBlob(sheetData) {
  console.log("[DOCX Blob] Creating blob from sheet data:", sheetData);
  if (!sheetData?.length) {
    console.log("[DOCX Blob] No data, returning null");
    return null;
  }
  
  let children;
  if (sheetData[0]?.[0] === "__html__") {
    // Use htmlToDocxElements for structure preservation
    const html = sheetData[0][1] || "";
    console.log("[DOCX Blob] HTML mode, converting HTML:", html?.substring(0, 200));
    children = await htmlToDocxElements(html);
    console.log("[DOCX Blob] Generated", children.length, "DOCX elements");
  } else {
    // Fallback for table data
    console.log("[DOCX Blob] Table mode, creating table");
    const rows = sheetData.map((row) => 
      new TableRow({
        children: row.map(cell => new TableCell({
          children: [new Paragraph({ children: [new TextRun(String(cell ?? ""))] })],
          borders: CELL_BORDERS,
          width: { size: 100 / row.length, type: WidthType.PERCENTAGE },
        })),
      })
    );
    children = [new Table({ rows })];
  }

  console.log("[DOCX Blob] Creating document...");
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
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children,
    }],
  });

  console.log("[DOCX Blob] Packing to blob...");
  const blob = await Packer.toBlob(doc);
  console.log("[DOCX Blob] Blob created, size:", blob.size, "bytes");
  return blob;
}

// ─── Sheet data → .xlsx ─────────────────────────────────────────────────────────
function exportSheetToXlsx(sheetData, fileName) {
  if (!sheetData?.length) return;
  const plainRows = sheetData[0]?.[0] === "__html__" 
    ? [[htmlToPlainText(sheetData[0][1])]] 
    : sheetData;
  
  const ws = XLSX.utils.aoa_to_sheet(plainRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, fileName.replace(/\.[^/.]+$/, "") + ".xlsx");
}

// ─── Sheet data → .pdf ─────────────────────────────────────────────────────────
async function exportSheetToPdf(sheetData, fileName, viewerRef) {
  try {
    // Get HTML content from viewer
    let htmlContent = "";
    
    if (sheetData[0]?.[0] === "__html__") {
      // Word/HTML format
      htmlContent = sheetData[0][1] || "";
    } else {
      // Excel format - convert to HTML table
      htmlContent = "<table style='width:100%;border-collapse:collapse;'>";
      sheetData.forEach((row, rIdx) => {
        htmlContent += "<tr>";
        row.forEach(cell => {
          const tag = rIdx === 0 ? "th" : "td";
          htmlContent += `<${tag} style='border:1px solid #555;padding:8px;text-align:left;'>${cell || ""}</${tag}>`;
        });
        htmlContent += "</tr>";
      });
      htmlContent += "</table>";
    }

    // Create temporary container
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "210mm"; // A4 width
    container.style.padding = "20mm";
    container.style.background = "#fff";
    container.style.fontFamily = "'Times New Roman', Georgia, serif";
    container.style.fontSize = "13px";
    container.style.lineHeight = "1.7";
    container.style.color = "#111";
    container.innerHTML = htmlContent;
    
    // Add table styles
    const tables = container.querySelectorAll("table");
    tables.forEach(table => {
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.style.marginBottom = "16px";
    });
    
    const cells = container.querySelectorAll("td, th");
    cells.forEach(cell => {
      cell.style.border = "1px solid #555";
      cell.style.padding = "8px";
      cell.style.textAlign = "left";
    });
    
    const headers = container.querySelectorAll("th");
    headers.forEach(th => {
      th.style.background = "#f0f0f0";
      th.style.fontWeight = "bold";
    });

    document.body.appendChild(container);

    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    document.body.removeChild(container);

    // Create PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    pdf.save(fileName.replace(/\.[^/.]+$/, "") + ".pdf");
  } catch (err) {
    console.error("[PDF Export Error]", err);
    alert("PDF export failed: " + err.message);
  }
}

// Helper: Convert sheet data to xlsx Blob (for upload)
function sheetDataToXlsxBlob(sheetData) {
  if (!sheetData?.length) return null;
  const plainRows = sheetData[0]?.[0] === "__html__" 
    ? [[htmlToPlainText(sheetData[0][1])]] 
    : sheetData;
  
  const ws = XLSX.utils.aoa_to_sheet(plainRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

// ══════════════════════════════════════════════════════════════════════════════
// RENAME MODAL COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
function RenameModal({ form, onClose, onRename }) {
  const [newName, setNewName] = useState(form.name || "");
  const [saving, setSaving] = useState(false);

  const handleRename = async () => {
    const trimmed = newName.trim();
    if (!trimmed) { alert("Name cannot be empty"); return; }
    if (trimmed === form.name) { onClose(); return; }
    
    setSaving(true);
    try {
      await api.put(`/forms/${form.id}`, {
        name: trimmed,
        type: form.type,
        template_data: form.template_data,
      });
      onRename(form.id, trimmed);
      onClose();
    } catch (err) {
      alert("Rename failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={css.overlay} onClick={onClose}>
      <div style={{ ...css.modal, maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>✏️ Rename Form</h3>
          <button style={css.iconBtn} onClick={onClose}><Icon d={icons.x} size={16} /></button>
        </div>
        <input
          style={css.input}
          value={newName}
          onChange={e => setNewName(e.target.value)}
          autoFocus
          onKeyDown={e => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") onClose(); }}
        />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 18 }}>
          <button style={css.btn("ghost")} onClick={onClose}>Cancel</button>
          <button style={css.btn("primary")} onClick={handleRename} disabled={saving}>
            <Icon d={icons.save} size={14} /> {saving ? "Saving…" : "Rename"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────────
export default function FormsManagement() {
  const [forms, setForms] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [sheetData, setSheetData] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [sheets, setSheets] = useState([]);
  const fileInputRef = useRef(null);
  const viewerRef = useRef(null); // ✅ Add viewerRef for PDF export

  const [showNewDocModal, setShowNewDocModal] = useState(false);

  // Report panel state (like TemplateManager)
  const [reportPanel, setReportPanel] = useState(null);

  // Rename modal state
  const [renameTarget, setRenameTarget] = useState(null);

  // Folder state
  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameFolderName, setRenameFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  // Load forms
  const loadForms = useCallback(async () => {
    try {
      let url = currentFolderId ? `/forms/folder/${currentFolderId}` : "/forms";
      const res = await api.get(url);
      console.log("📄 Forms RAW response:", res);

      let formList = [];
      if (Array.isArray(res)) {
        // Root: direct array
        formList = res;
      } else if (res?.success && res?.data) {
        // Folder response: { success, data: { folder, forms, folders } }
        if (Array.isArray(res.data.forms)) {
          formList = res.data.forms;
        } else if (Array.isArray(res.data)) {
          formList = res.data;
        }
      }

      // Parse template_data JSON strings to objects
      formList = formList.map(form => {
        if (form.template_data && typeof form.template_data === 'string') {
          try {
            form.template_data = JSON.parse(form.template_data);
          } catch (e) {
            console.warn('Failed to parse template_data for form:', form.id, e);
          }
        }
        return form;
      });

      setForms(formList);
    } catch (e) {
      console.error("Load forms error:", e);
      setForms([]);
    }
  }, [currentFolderId]);

  // Load folders
  const loadFolders = useCallback(async () => {
    try {
      const res = await api.get("/forms/folders");
      console.log("📁 Folders RAW response:", res);
      
      // api.js directly response body return karta hai
      // Backend sends: { success: true, data: [...] }
      let folderList = [];
      if (Array.isArray(res)) {
        folderList = res;
      } else if (Array.isArray(res?.data)) {
        folderList = res.data;
      } else if (Array.isArray(res?.data?.data)) {
        folderList = res.data.data;
      }
      
      console.log("📁 Parsed folders:", folderList);
      setFolders(folderList);
    } catch (e) {
      console.error("Load folders error:", e);
    }
  }, []);

  useEffect(() => { loadForms(); }, [loadForms]);
  useEffect(() => { loadFolders(); }, [loadFolders]);

  // Create folder
  const handleCreateFolder = async () => {
    console.log("🔵 [DEBUG] Create folder called:", { newFolderName, currentFolderId });
    if (!newFolderName.trim()) return;
    setCreatingFolder(true);
    try {
      console.log("🔵 [DEBUG] Sending API request to /forms/folders");
      const response = await api.post("/forms/folders", {
        name: newFolderName,
        parent_id: currentFolderId
      });
      console.log("🔵 [DEBUG] Folder creation response:", response);
      setNewFolderName("");
      setShowCreateFolder(false);
      await loadFolders();
    } catch (e) {
      console.error("❌ [DEBUG] Create folder error:", e);
      console.error("❌ [DEBUG] Error status:", e.status);
      console.error("❌ [DEBUG] Error message:", e.message);
      alert("Failed to create folder: " + (e.message || "Unknown error"));
    } finally {
      setCreatingFolder(false);
    }
  };

  // Rename folder
  const handleRenameFolder = async () => {
    if (!renameFolderName.trim() || !selectedFolderId) return;
    try {
      await api.put(`/forms/folders/${selectedFolderId}`, {
        name: renameFolderName
      });
      setShowRenameModal(false);
      setRenameFolderName("");
      setSelectedFolderId(null);
      await loadFolders();
    } catch (e) {
      alert("Failed to rename folder: " + (e.message || "Unknown error"));
    }
  };

  // Delete folder
  const handleDeleteFolder = async (folderId) => {
    if (!confirm("Delete this folder and all its contents?")) return;
    try {
      await api.delete(`/forms/folders/${folderId}`);
      if (currentFolderId === folderId) {
        setCurrentFolderId(null);
      }
      await loadFolders();
      await loadForms();
    } catch (e) {
      alert("Failed to delete folder: " + (e.message || "Unknown error"));
    }
  };

  // Open rename modal
  const openRenameModal = (folder) => {
    setSelectedFolderId(folder.id);
    setRenameFolderName(folder.name);
    setShowRenameModal(true);
  };

  // Toggle folder expand
  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Get breadcrumb path
  const getBreadcrumb = () => {
    const path = [];
    let current = folders.find(f => f.id === currentFolderId);
    while (current) {
      path.unshift(current);
      current = folders.find(f => f.id === current.parent_id);
    }
    return path;
  };

  // Build folder tree
  const buildFolderTree = (parentId = null, level = 0) => {
    const children = folders.filter(f => 
      (f.parent_id === parentId || (parentId === null && !f.parent_id)) 
      && !f.deleted_at  // handle string "null" as well
    );
    return children.map(folder => ({
      ...folder,
      level,
      children: buildFolderTree(folder.id, level + 1),
      hasChildren: folders.some(f => f.parent_id === folder.id)
    }));
  };

  // Filter forms
  const filteredForms = forms.filter(f => 
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so same file can be re-uploaded
    e.target.value = "";

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    if (currentFolderId) {
      formData.append("folder_id", String(currentFolderId));
    }

    try {
      await api.post("/forms/upload", formData);
      // ← headers bilkul mat do, FormData ke saath browser khud set karta hai
      setShowUpload(false);
      loadForms();
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Formula cache for re-evaluation
  const formulaCacheRef = useRef({});

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

  function reEvaluateFormulas(sheetData) {
    return sheetData.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        const key = `${rIdx}_${cIdx}`;
        const formula = formulaCacheRef.current[key];
        if (formula) {
          try {
            return evalFormula(formula, sheetData);
          } catch {
            return cell;
          }
        }
        return cell;
      })
    );
  }

  // Evaluate IF formulas in Excel data
  function evaluateIfFormulas(sheetData) {
    return sheetData.map((row, rIdx) => 
      row.map((cell, cIdx) => {
        if (typeof cell === 'string' && cell.startsWith('=')) {
          try {
            return evalSimpleIF(cell, sheetData);
          } catch {
            return cell;
          }
        }
        return cell;
      })
    );
  }

  function evalFormula(formula, grid) {
    const resolveRef = (ref) => {
      ref = ref.trim();
      const rangeMatch = ref.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
      if (rangeMatch) {
        const c1 = rangeMatch[1].charCodeAt(0) - 65;
        const r1 = parseInt(rangeMatch[2]) - 1;
        const c2 = rangeMatch[3].charCodeAt(0) - 65;
        const r2 = parseInt(rangeMatch[4]) - 1;
        const vals = [];
        for (let r = r1; r <= r2; r++) {
          for (let c = c1; c <= c2; c++) {
            vals.push(parseFloat(grid[r]?.[c]) || 0);
          }
        }
        return vals;
      }
      const cellMatch = ref.match(/^([A-Z]+)(\d+)$/);
      if (cellMatch) {
        const col = cellMatch[1].charCodeAt(0) - 65;
        const row = parseInt(cellMatch[2]) - 1;
        return parseFloat(grid[row]?.[col]) || 0;
      }
      return parseFloat(ref) || 0;
    };

    const evalSUM = (inner) => {
      const parts = inner.split(/[+,]/);
      let total = 0;
      parts.forEach(part => {
        const val = resolveRef(part.trim());
        if (Array.isArray(val)) {
          total += val.reduce((a, b) => a + b, 0);
        } else {
          total += val;
        }
      });
      return total;
    };

    const evalExpr = (expr) => {
      expr = expr.trim();
      
      if (expr.toUpperCase().startsWith('IF(')) {
        const inner = expr.slice(3, -1);
        let depth = 0, commas = [];
        for (let i = 0; i < inner.length; i++) {
          if (inner[i] === '(') depth++;
          else if (inner[i] === ')') depth--;
          else if (inner[i] === ',' && depth === 0) commas.push(i);
        }
        if (commas.length < 2) return '';
        const condStr = inner.slice(0, commas[0]).trim();
        const trueVal = inner.slice(commas[0]+1, commas[1]).trim().replace(/"/g, '');
        const falseExpr = inner.slice(commas[1]+1).trim();
        const condMatch = condStr.match(/^(.+?)\s*([<>!=]+)\s*(.+)$/);
        if (!condMatch) return '';
        const leftRaw = resolveRef(condMatch[1]);
        const left = Array.isArray(leftRaw) ? leftRaw[0] : leftRaw;
        const op = condMatch[2];
        const right = parseFloat(condMatch[3]);
        let result = false;
        if (op === '<')  result = left < right;
        if (op === '>')  result = left > right;
        if (op === '<=') result = left <= right;
        if (op === '>=') result = left >= right;
        if (op === '=')  result = left === right;
        if (op === '<>') result = left !== right;
        if (result) return trueVal;
        if (falseExpr.toUpperCase().startsWith('IF(')) return evalExpr(falseExpr);
        return falseExpr.replace(/"/g, '') || '';
      }

      if (expr.toUpperCase().startsWith('SUM(')) {
        const inner = expr.slice(4, -1);
        return evalSUM(inner);
      }

      const val = resolveRef(expr);
      return Array.isArray(val) ? val[0] : val;
    };

    const formulaBody = formula.startsWith('=') ? formula.slice(1) : formula;
    return evalExpr(formulaBody);
  }

  // Extract header from HTML content (like TemplateManager)
  const extractHeaderFromHtml = (html) => {
    if (!html) return "";
    
    // Try to find header div with specific styling
    const headerMatch = html.match(/<div[^>]*style="[^"]*margin-bottom[^"]*background[^"]*"[^>]*>.*?<\/div>/is);
    if (headerMatch) return headerMatch[0];
    
    // Fallback: find first div with background/padding/margin
    const divMatch = html.match(/<div[^>]*style="[^"]*(?:background|padding|margin)[^"]*"[^>]*>.*?<\/div>/is);
    if (divMatch) return divMatch[0];
    
    // Try to find table with logo or MindSaid text
    const tableMatch = html.match(/<table[^>]*>.*?MindSaid.*?<\/table>/is);
    if (tableMatch) return tableMatch[0];
    
    return "";
  };

  // Open Create Report panel (like TemplateManager's New Report)
  const openCreateReport = async (form) => {
    console.log('[DEBUG] openCreateReport called for form:', form.name, 'type:', form.type);
    
    // Check if form has template_data (parsed sheets)
    if (form.template_data?.sheets) {
      console.log('[DEBUG] Using stored template_data from form');
      const reportSheets = {};
      const reportSheetNames = [];
      
      const sheetNames = form.template_data.sheetNames || Object.keys(form.template_data.sheets);
      
      sheetNames.forEach(sheetName => {
        const sheetData = form.template_data.sheets[sheetName];
        if (!sheetData) return;

        // Deep clone to avoid mutating the form data
        let clonedData;
        try {
          clonedData = structuredClone(sheetData);
        } catch {
          clonedData = JSON.parse(JSON.stringify(sheetData));
        }

        // Extract header only, rest content should be empty for new report
        if (clonedData[0]?.[0] === "__html__") {
          const html = clonedData[0][1] || "";
          
          // Extract header div (the one with specific styling that contains logo)
          const headerMatch = html.match(/<div[^>]*style="[^"]*margin-bottom[^"]*background[^"]*"[^>]*>.*?<\/div>/is);
          
          let headerHtml = "";
          
          if (headerMatch) {
            headerHtml = headerMatch[0];
          } else {
            // Fallback: try to find first div that looks like a header
            const divMatch = html.match(/<div[^>]*style="[^"]*(?:background|padding|margin)[^"]*"[^>]*>.*?<\/div>/is);
            if (divMatch) {
              headerHtml = divMatch[0];
            }
          }
          
          // If still no header found, try to find table with logo or MindSaid text
          if (!headerHtml) {
            const tableMatch = html.match(/<table[^>]*>.*?MindSaid.*?<\/table>/is);
            if (tableMatch) {
              headerHtml = tableMatch[0];
            }
          }
          
          // Use extracted header or default
          const finalHeader = headerHtml || DEFAULT_REPORT_HEADER;
          clonedData = [["__html__", finalHeader + "<p><br></p>"]];
        } else {
          // ✅ Excel data → keep structure, clear data rows
          const rowCount = clonedData.length;
          const colCount = Math.max(...clonedData.map(r => r?.length || 0));
          // Header row rakho (row 0), baaki clear karo
          clonedData = clonedData.map((row, idx) => {
            if (idx === 0) return [...row]; // header row as-is
            return Array(colCount).fill(""); // data rows blank
          });
        }

        reportSheets[sheetName] = clonedData;
        reportSheetNames.push(sheetName);
      });

      // Fallback if form has no sheets
      if (reportSheetNames.length === 0) {
        const fallbackName = "Report";
        reportSheets[fallbackName] = [["__html__", DEFAULT_REPORT_HEADER + "<p><br></p>"]];
        reportSheetNames.push(fallbackName);
      }

      // 🔥 Detect original format from template name
      const detectFormat = (fileName) => {
        const ext = fileName?.split('.').pop()?.toLowerCase();
        if (['xlsx', 'xls', 'csv'].includes(ext)) return 'excel';
        if (['doc', 'docx'].includes(ext)) return 'word';
        return 'html';
      };

      setReportPanel({
        templateName: form.name,
        allSheets: reportSheetNames,
        allData: reportSheets,
        patientName: "",
        format: detectFormat(form.name), // 🔥 Track original format
      });
      return;
    }
    
    // If no template_data, try to parse the file first (for Excel/Word files)
    console.log('[DEBUG] No template_data found, attempting to parse file...');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://dashboard.iplanbymsl.in/api/forms/${form.id}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!response.ok) throw new Error(`Download failed: ${response.status}`);
      
      const blob = await response.blob();
      const ext = form.name.match(/\.([^.]+)$/)?.[1]?.toLowerCase();
      
      // For Excel files or Excel disguised as DOCX
      if (['xlsx', 'xls', 'csv'].includes(ext) || ext === 'docx') {
        const arrayBuf = await blob.arrayBuffer();
        
        try {
          const workbook = XLSX.read(arrayBuf, { type: "array" });
          if (workbook.SheetNames && workbook.SheetNames.length > 0) {
            // Successfully parsed as Excel - use default header
            console.log('[DEBUG] Parsed as Excel, using default header');
            const reportSheets = {};
            const reportSheetNames = [];
            
            workbook.SheetNames.forEach(sheetName => {
              reportSheets[sheetName] = [["__html__", DEFAULT_REPORT_HEADER + "<p><br></p>"]];
              reportSheetNames.push(sheetName);
            });
            
            setReportPanel({
              templateName: form.name,
              allSheets: reportSheetNames,
              allData: reportSheets,
              patientName: "",
            });
            return;
          }
        } catch (excelErr) {
          console.log('[DEBUG] Not Excel, trying Word parsing...');
        }
      }
      
      // For Word files, parse via backend
      if (['doc', 'docx'].includes(ext)) {
        const parseFormData = new FormData();
        parseFormData.append('file', blob, form.name);
        parseFormData.append('parse_only', 'true');
        
        const parseResponse = await fetch(
          `${import.meta.env.VITE_API_URL || "https://dashboard.iplanbymsl.in/api"}/templates/upload`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: parseFormData
          }
        );
        
        if (parseResponse.ok) {
          const parseResult = await parseResponse.json();
          if (parseResult.data?.template_data?.sheets) {
            // Extract header from parsed Word document
            const sheets = parseResult.data.template_data.sheets;
            const sheetNames = Object.keys(sheets);
            const reportSheets = {};
            const reportSheetNames = [];
            
            sheetNames.forEach(sheetName => {
              const sheetData = sheets[sheetName];
              if (sheetData && sheetData[0]?.[0] === "__html__") {
                const html = sheetData[0][1] || "";
                const headerMatch = html.match(/<div[^>]*style="[^"]*margin-bottom[^"]*background[^"]*"[^>]*>.*?<\/div>/is);
                const headerHtml = headerMatch ? headerMatch[0] : DEFAULT_REPORT_HEADER;
                reportSheets[sheetName] = [["__html__", headerHtml + "<p><br></p>"]];
              } else {
                reportSheets[sheetName] = [["__html__", DEFAULT_REPORT_HEADER + "<p><br></p>"]];
              }
              reportSheetNames.push(sheetName);
            });
            
            setReportPanel({
              templateName: form.name,
              allSheets: reportSheetNames,
              allData: reportSheets,
              patientName: "",
            });
            return;
          }
        }
      }
      
      // Fallback: use default header
      console.log('[DEBUG] Using fallback default header');
      setReportPanel({
        templateName: form.name,
        allSheets: ["Report"],
        allData: { "Report": [["__html__", DEFAULT_REPORT_HEADER + "<p><br></p>"]] },
        patientName: "",
      });
      
    } catch (err) {
      console.error('[DEBUG] Error parsing file for new report:', err);
      alert('Failed to create new report: ' + err.message);
    }
  };

  // Save report (like TemplateManager) - FIXED: Preserve original format
  const saveReport = async (allData, sheetList, activePatientName) => {
    try {
      // Clean template name by removing file extension
      const cleanTemplateName = reportPanel.templateName.replace(/\.[^/.]+$/, "");
      const baseName = `${activePatientName || "Patient"} — ${cleanTemplateName} — ${new Date().toLocaleDateString("en-IN")}`;

      const firstSheet = sheetList[0];
      const sheetData = allData[firstSheet];
      let blob;
      let fileName;

      // 🔥 FORMAT BASED SAVE - preserve original template format
      if (reportPanel.format === 'excel') {
        // Excel template → save as .xlsx
        blob = sheetDataToXlsxBlob(sheetData);
        fileName = baseName + '.xlsx';
        console.log('[DEBUG] Saving as Excel (.xlsx) - original format preserved');
      } else {
        // Word/HTML template → save as .docx
        blob = await createDocxBlob(sheetData);
        fileName = baseName + '.docx';
        console.log('[DEBUG] Saving as Word (.docx)');
      }

      if (!blob) {
        throw new Error("Failed to create file blob");
      }

      const formData = new FormData();
      formData.append('file', blob, fileName);
      formData.append('name', baseName);
      if (currentFolderId) {
        formData.append('folder_id', String(currentFolderId));
      }
      
      // ✅ CRITICAL FIX: Send template_data for proper reopen
      const templateData = {
        sheets: allData,
        sheetNames: sheetList
      };
      formData.append('template_data', JSON.stringify(templateData));

      console.log('[DEBUG] Uploading report with template_data...');
      await api.post('/forms/upload', formData);
      await loadForms();
      setReportPanel(null);
      alert(`✅ Report "${baseName}" saved successfully!`);
    } catch (err) {
      console.error('[DEBUG] Save report failed:', err);
      alert("Save failed: " + err.message);
    }
  };

  // Parse file and open viewer - FIXED: Use template_data directly
  const handleViewForm = async (form) => {
    console.log("[DEBUG] handleViewForm called for form:", form.name, "type:", form.type);
    setSelectedForm(form);
    setLoading(true);

    try {
      // ✅ CRITICAL FIX: If template_data exists → use directly (NO FILE DOWNLOAD)
      if (form.template_data?.sheets) {
        console.log("[DEBUG] ✅ Using template_data directly - no file download needed");

        const sheets = form.template_data.sheets;
        const sheetNames = form.template_data.sheetNames || Object.keys(sheets);

        console.log("[DEBUG] Sheet names:", sheetNames);
        console.log("[DEBUG] First sheet data:", sheets[sheetNames[0]]);

        // Convert to sheet objects
        const loadedSheets = sheetNames.map((name) => ({
          name,
          data: sheets[name] || [],
          formulaCache: {},
        }));

        setSheets(loadedSheets);
        setSheetData(sheets[sheetNames[0]] || []);
        setActiveSheet(0);
        setShowViewer(true);
        setLoading(false);

        console.log("[DEBUG] ✅ Direct render complete");
        return;
      }

      // ❌ FALLBACK: Only download if no template_data (old files)
      console.warn("[DEBUG] ⚠️ No template_data found, falling back to file download");

      const token = localStorage.getItem("token");
      console.log("[DEBUG] Downloading file for viewing...");

      const response = await fetch(
        `https://dashboard.iplanbymsl.in/api/forms/${form.id}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) {
        console.error("[DEBUG] Download failed:", response.status);
        throw new Error(`Server error: ${response.status}`);
      }
      console.log(
        "[DEBUG] File downloaded, size:",
        (await response.clone().blob()).size
      );

      const blob = await response.blob();
      const ext = form.name.match(/\.([^.]+)$/)?.[1]?.toLowerCase();
      console.log('[DEBUG] File extension:', ext);

      if (['xlsx', 'xls', 'csv'].includes(ext)) {
        console.log('[DEBUG] Processing Excel file for viewing...');
        const data = await blob.arrayBuffer();
        const workbook = XLSX.read(data, { 
          type: "array",
          cellFormula: true,
          cellNF: true,
          cellStyles: true,
          cellDates: true,
          WTF: false,
        });
        
        const loadedSheets = workbook.SheetNames.map(sheetName => {
          const ws = workbook.Sheets[sheetName];
          
          // Step 1: Raw values lo (display ke liye)
          const data2d = XLSX.utils.sheet_to_json(ws, { 
            header: 1,
            raw: true,
            defval: "",
            blankrows: true,
          });

          // Step 2: Formulas alag se extract karo directly cell objects se
          const formulaCache = {};
          const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
          for (let r = range.s.r; r <= range.e.r; r++) {
            for (let c = range.s.c; c <= range.e.c; c++) {
              const cellAddr = XLSX.utils.encode_cell({ r, c });
              const cell = ws[cellAddr];
              if (cell && cell.f) {
                formulaCache[`${r}_${c}`] = '=' + cell.f;
              }
            }
          }

          return { name: sheetName, data: data2d, formulaCache };
        });

        // Pehli sheet ka formula cache set karo
        formulaCacheRef.current = loadedSheets[0]?.formulaCache || {};

        // Evaluate karo
        const evaluatedSheets = loadedSheets.map(s => ({
          ...s,
          data: reEvaluateFormulas(s.data)
        }));

        setSheets(evaluatedSheets);
        setSheetData(evaluatedSheets[0]?.data || []);
        setActiveSheet(0);
      } else if (['doc', 'docx'].includes(ext)) {
        console.log('[DEBUG] Processing Word document for viewing...');
        
        // First, check if this is actually an Excel file disguised as .docx
        const arrayBuf = await blob.arrayBuffer();
        let isExcelInDisguise = false;
        
        try {
          const workbook = XLSX.read(arrayBuf, { type: "array" });
          // If it successfully reads as Excel and has sheets, it's Excel
          if (workbook.SheetNames && workbook.SheetNames.length > 0) {
            console.log('[DEBUG] Detected Excel file disguised as .docx!');
            isExcelInDisguise = true;
            
            // Parse as Excel
            const loadedSheets = workbook.SheetNames.map(sheetName => {
              const ws = workbook.Sheets[sheetName];
              const data2d = XLSX.utils.sheet_to_json(ws, { 
                header: 1, raw: true, defval: "", blankrows: true,
              });
              
              const formulaCache = {};
              const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
              for (let r = range.s.r; r <= range.e.r; r++) {
                for (let c = range.s.c; c <= range.e.c; c++) {
                  const cellAddr = XLSX.utils.encode_cell({ r, c });
                  const cell = ws[cellAddr];
                  if (cell && cell.f) {
                    formulaCache[`${r}_${c}`] = '=' + cell.f;
                  }
                }
              }
              return { name: sheetName, data: data2d, formulaCache };
            });
            
            formulaCacheRef.current = loadedSheets[0]?.formulaCache || {};
            const evaluatedSheets = loadedSheets.map(s => ({
              ...s, data: reEvaluateFormulas(s.data)
            }));
            
            setSheets(evaluatedSheets);
            setSheetData(evaluatedSheets[0]?.data || []);
            setActiveSheet(0);
          }
        } catch (excelErr) {
          console.log('[DEBUG] Not an Excel file, proceeding with Word parsing');
        }
        
        if (!isExcelInDisguise) {
          console.log('[DEBUG] Calling /api/templates/upload for Word parsing...');
          
          // Backend API se parse karo taaki base64 images aa sake (mammoth removed)
          const parseFormData = new FormData();
          parseFormData.append('file', blob, form.name);
          parseFormData.append('parse_only', 'true');
          
          const apiUrl = `${import.meta.env.VITE_API_URL || "https://dashboard.iplanbymsl.in/api"}/templates/upload`;
          console.log('[DEBUG] API URL:', apiUrl);
        
        const parseResponse = await fetch(apiUrl, {
          method: "POST", 
          headers: { Authorization: `Bearer ${token}` }, 
          body: parseFormData 
        });
        
        console.log('[DEBUG] View - Parse response status:', parseResponse.status);
        console.log('[DEBUG] View - Parse response ok:', parseResponse.ok);
        
        if (parseResponse.ok) {
          const parseResult = await parseResponse.json();
          console.log('[DEBUG] View - Parse result success:', parseResult.success);
          console.log('[DEBUG] View - Has sheets:', !!parseResult.data?.template_data?.sheets);
          
          if (parseResult.data?.template_data?.sheets) {
            const sheets = parseResult.data.template_data.sheets;
            const sheetNames = Object.keys(sheets);
            console.log('[DEBUG] View - Sheet names:', sheetNames);
            
            const firstSheet = sheets[sheetNames[0]];
            
            if (firstSheet && firstSheet[0]?.[0] === "__html__") {
              const htmlContent = firstSheet[0][1] || "";
              console.log('[DEBUG] View - HTML content length:', htmlContent.length);
              setSheetData([["__html__", htmlContent]]);
            } else {
              console.log('[DEBUG] View - No __html__ format, using raw data');
              setSheetData(firstSheet || [["__html__", "<p><br></p>"]]);
            }
          } else {
            console.warn('[DEBUG] View - No sheets in parse result');
            setSheetData([["__html__", "<p>Document parse nahi hua.</p>"]]);
          }
        } else {
          const errorText = await parseResponse.text();
          console.error('[DEBUG] View - Parse FAILED! Status:', parseResponse.status);
          console.error('[DEBUG] View - Error response body:', errorText);
          
          // Parse error message from response
          let errorMsg = "Unknown error";
          try {
            const errorJson = JSON.parse(errorText);
            errorMsg = errorJson.message || errorJson.error || errorMsg;
          } catch {
            errorMsg = errorText || errorMsg;
          }
          
          // Create error message with delete button
          const errorHtml = `
            <div style="padding: 20px; color: #d32f2f; font-family: Arial, sans-serif;">
              <h3 style="margin-top: 0;">⚠️ Document Load Failed</h3>
              <p><strong>Error:</strong> ${errorMsg}</p>
              <p>This file may be corrupted or not a valid Word document. Please try:</p>
              <ul style="margin-bottom: 20px;">
                <li>Re-saving the file in Microsoft Word</li>
                <li>Opening and re-exporting as .docx</li>
                <li>Uploading a different file</li>
              </ul>
              <button 
                onclick="if(confirm('Delete this corrupted file?')) { window.deleteCorruptedFile(${form.id}); }"
                style="
                  background: #d32f2f;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                  font-weight: 500;
                "
                onmouseover="this.style.background='#b71c1c'"
                onmouseout="this.style.background='#d32f2f'"
              >
                🗑️ Delete This Corrupted File
              </button>
            </div>
          `;
          
          // Add global function to handle delete from error message
          window.deleteCorruptedFile = async (fileId) => {
            try {
              await api.delete(`/forms/${fileId}`);
              setShowViewer(false);
              loadForms();
              alert('Corrupted file deleted successfully');
            } catch (err) {
              alert('Delete failed: ' + err.message);
            }
          };
          
          setSheetData([["__html__", errorHtml]]);
        }
        setSheets([{ name: "Document", data: [] }]);
        console.log('[DEBUG] Word document processing complete');
        }
      } else {
        setSheetData([["__html__", "<p>Preview not available. Download to view.</p>"]]);
        setSheets([{ name: "Preview", data: [] }]);
      }

      setShowViewer(true);
    } catch (err) {
      alert("Failed to load form: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete form
  const handleDeleteForm = async (id) => {
    if (!confirm("Delete this form?")) return;
    try {
      await api.delete(`/forms/${id}`);
      loadForms();
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  };

  // Rename form - update form name in state after successful API call
  const handleRename = (id, newName) => {
    setForms(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  // Duplicate form - upload as new file to server
  const handleDuplicateForm = async (form, e) => {
    e.stopPropagation();
    const ext = form.name.match(/\.([^.]+)$/)?.[1]?.toLowerCase();
    const suggested = ext ? `Copy of ${form.name}` : `Copy of ${form.name}`;
    const newNameRaw = prompt(`Enter name for duplicate:`, suggested);
    if (!newNameRaw?.trim()) return;
    const newName = (ext && !newNameRaw.toLowerCase().endsWith(`.${ext}`))
      ? `${newNameRaw.trim()}.${ext}`
      : newNameRaw.trim();

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://dashboard.iplanbymsl.in/api/forms/${form.id}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', blob, newName);
      formData.append('name', newName);
      if (currentFolderId) {
        formData.append('folder_id', String(currentFolderId));
      }

      await api.post('/forms/upload', formData);
      loadForms();
    } catch (err) {
      alert("Duplicate failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // New from template - blank form in viewer
  const handleNewFromTemplate = async (form, e) => {
    e.stopPropagation();
    const studentName = prompt(`New blank form\nStudent ka naam:`);
    if (!studentName?.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://dashboard.iplanbymsl.in/api/forms/${form.id}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const blob = await response.blob();
      const data = await blob.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array", cellFormula: true });

      // Rename first sheet to student name
      if (workbook.SheetNames.length > 0) {
        XLSX.utils.book_append_sheet(workbook, workbook.Sheets[workbook.SheetNames[0]], studentName);
        XLSX.utils.book_set_sheet_name(workbook, 0, studentName);
      }

      const clearedSheets = workbook.SheetNames.map(sheetName => {
        const ws = workbook.Sheets[sheetName];
        if (!ws['!ref']) return { name: sheetName, data: [], formulaCache: {} };
        
        const range = XLSX.utils.decode_range(ws['!ref']);
        
        const formulaCache = {};
        for (let r = range.s.r; r <= range.e.r; r++) {
          for (let c = range.s.c; c <= range.e.c; c++) {
            const cellAddr = XLSX.utils.encode_cell({ r, c });
            const cell = ws[cellAddr];
            if (cell?.f) formulaCache[`${r}_${c}`] = '=' + cell.f;
          }
        }

        for (let r = range.s.r + 1; r <= range.e.r; r++) {
          const cellAddr = XLSX.utils.encode_cell({ r, c: 1 });
          const cell = ws[cellAddr];
          if (cell && !cell.f) {
            ws[cellAddr] = { t: 'n', v: 0 };
          }
        }

        const data2d = XLSX.utils.sheet_to_json(ws, {
          header: 1, raw: true, defval: "", blankrows: true,
        });

        return { name: sheetName, data: data2d, formulaCache };
      });

      formulaCacheRef.current = clearedSheets[0]?.formulaCache || {};

      const evaluatedSheets = clearedSheets.map(s => ({
        ...s,
        data: reEvaluateFormulas(s.data)
      }));

      setSelectedForm({ 
        ...form, 
        name: `${studentName} - ${form.name}`,
        id: form.id,
        isNew: true
      });
      setSheets(evaluatedSheets);
      setSheetData(evaluatedSheets[0]?.data || []);
      setActiveSheet(0);
      setShowViewer(true);

    } catch (err) {
      alert("New form failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update cell
  const handleCellChange = (rowIdx, colIdx, value) => {
    setSheetData(prev => {
      const next = prev.map(r => [...r]);
      if (!next[rowIdx]) next[rowIdx] = [];
      next[rowIdx][colIdx] = value;
      // Answer badalne ke baad formulas re-evaluate karo
      return reEvaluateFormulas(next);
    });
  };

  // Add row
  const handleAddRow = () => {
    setSheetData(prev => [...prev, Array(prev[0]?.length || 1).fill("")]);
  };

  // Add column
  const handleAddCol = () => {
    setSheetData(prev => prev.map(row => [...row, ""]));
  };

  // Delete row
  const handleDeleteRow = (idx) => {
    setSheetData(prev => prev.filter((_, i) => i !== idx));
  };

  // Delete column
  const handleDeleteCol = (idx) => {
    setSheetData(prev => prev.map(row => row.filter((_, i) => i !== idx)));
  };

  // Helper: clear grid but keep formulas
  function makeClearedGridKeepFormulas(grid, formulaCache) {
    const rowCount = grid?.length || 0;
    const colCount = Math.max(0, ...(grid || []).map(r => r?.length || 0));
    const cleared = Array.from({ length: rowCount }, () => Array.from({ length: colCount }, () => ""));

    Object.keys(formulaCache || {}).forEach((key) => {
      const [rStr, cStr] = key.split('_');
      const r = Number(rStr);
      const c = Number(cStr);
      if (!Number.isNaN(r) && !Number.isNaN(c) && cleared[r]) {
        cleared[r][c] = formulaCache[key];
      }
    });
    return cleared;
  }

  // Helper: build XLSX blob from sheets
  function buildXlsxBlobFromSheets(sheetDefs) {
    const wb = XLSX.utils.book_new();
    sheetDefs.forEach((s) => {
      const ws = XLSX.utils.aoa_to_sheet(s.data || []);
      const formulaCache = s.formulaCache || {};
      Object.keys(formulaCache).forEach((key) => {
        const [rStr, cStr] = key.split('_');
        const r = Number(rStr);
        const c = Number(cStr);
        if (Number.isNaN(r) || Number.isNaN(c)) return;
        const addr = XLSX.utils.encode_cell({ r, c });
        const rawFormula = String(formulaCache[key] || "");
        const f = rawFormula.startsWith('=') ? rawFormula.slice(1) : rawFormula;
        ws[addr] = ws[addr] || { t: 'n', v: 0 };
        ws[addr].f = f;
      });
      XLSX.utils.book_append_sheet(wb, ws, s.name || 'Sheet1');
    });
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob;
  }

  // Handler: create new document from current
  const handleCreateNewDocumentFromCurrent = async (mode) => {
    if (!selectedForm || !sheets?.length) return;

    const ext = selectedForm.name.match(/\.([^.]+)$/)?.[1]?.toLowerCase();
    const defaultName = ext
      ? `New - ${selectedForm.name.replace(new RegExp(`\\.${ext}$`, 'i'), '')}`
      : `New - ${selectedForm.name}`;
    const nameRaw = prompt('Enter patient name:', defaultName);
    if (!nameRaw?.trim()) return;
    
    // Always use .docx extension to preserve HTML header
    const fileName = `${nameRaw.trim()}.docx`;

    setLoading(true);
    try {
      // Create DOCX with header instead of Excel to preserve MindSaid header
      // Use the entered name as sheet name in template_data
      const sheetName = nameRaw.trim();
      const sheetData = [["__html__", DEFAULT_REPORT_HEADER + "<p><br></p>"]];
      
      const blob = await createDocxBlob(sheetData);
      if (!blob) {
        throw new Error("Failed to create DOCX blob");
      }
      
      const formData = new FormData();
      formData.append('file', blob, fileName);
      formData.append('name', fileName);
      if (currentFolderId) {
        formData.append('folder_id', String(currentFolderId));
      }
      // Add template_data with sheet name for proper display
      const templateData = {
        sheetNames: [sheetName],
        sheets: { [sheetName]: sheetData }
      };
      formData.append('template_data', JSON.stringify(templateData));

      await api.post('/forms/upload', formData);
      await loadForms();
      setShowNewDocModal(false);
      alert(`New document "${nameRaw.trim()}" created successfully!`);
    } catch (err) {
      alert('New document failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Save changes
  const handleSaveChanges = async () => {
    if (!selectedForm) return;
    
    try {
      // Build updated sheets object
      const updatedSheets = {};
      sheets.forEach((sheet, idx) => {
        if (idx === activeSheet) {
          // Use current sheetData for active sheet
          updatedSheets[sheet.name] = sheetData;
        } else {
          // Keep other sheets as-is
          updatedSheets[sheet.name] = sheet.data;
        }
      });
      
      const sheetNames = sheets.map(s => s.name);
      
      // Build template_data object
      const templateData = {
        sheets: updatedSheets,
        sheetNames: sheetNames
      };
      
      // Update form with new template_data
      await api.put(`/forms/${selectedForm.id}`, {
        name: selectedForm.name,
        type: selectedForm.type,
        template_data: templateData,
        folder_id: selectedForm.folder_id
      });
      
      // Update local state
      setSelectedForm(prev => ({
        ...prev,
        template_data: templateData
      }));
      
      // Refresh forms list
      await loadForms();
      
      alert("✅ Changes saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Save failed: " + err.message);
    }
  };

  // Export
  const handleExport = async (type) => {
    if (type === "docx") {
      await exportSheetToDocx(sheetData, selectedForm?.name || "form.docx");
    } else if (type === "pdf") {
      await exportSheetToPdf(sheetData, selectedForm?.name || "form.pdf", viewerRef);
    } else {
      exportSheetToXlsx(sheetData, selectedForm?.name || "form.xlsx");
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  if (showViewer) {
    return (
      <div style={css.root}>
        <Sidebar />
        <div style={css.panel}>
          {/* Header */}
          <div style={css.panelHeader}>
            <button style={css.btn("ghost")} onClick={() => setShowViewer(false)}>
              <Icon d={icons.back} /> Back
            </button>
            <h2 style={{ margin: 0, fontSize: 16 }}>{selectedForm?.name}</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={css.btn("green")} onClick={handleSaveChanges}>
                <Icon d={icons.save} /> Save
              </button>
              <button style={css.btn("ghost")} onClick={() => setShowNewDocModal(true)}>
                New Document
              </button>
              <select 
                style={css.btn("ghost")} 
                onChange={(e) => e.target.value && handleExport(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Export...</option>
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="docx">Word (.docx)</option>
                <option value="pdf">PDF (.pdf)</option>
              </select>
            </div>
          </div>

          {showNewDocModal && (
            <div style={css.overlay} onClick={() => setShowNewDocModal(false)}>
              <div style={css.modal} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ margin: "0 0 12px", fontSize: 18 }}>Create New Document</h3>
                {selectedForm?.type === 'excel' || selectedForm?.name?.match(/\.(xlsx|xls|csv)$/i) ? (
                  <>
                    <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6B7280" }}>
                      Choose how to create the new sheet.
                    </p>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                      <button style={css.btn("ghost")} onClick={() => setShowNewDocModal(false)}>
                        Cancel
                      </button>
                      <button style={css.btn("ghost")} onClick={() => handleCreateNewDocumentFromCurrent('blank')}>
                        New Sheet
                      </button>
                      <button style={css.btn("primary")} onClick={() => handleCreateNewDocumentFromCurrent('with_formulas')}>
                        New Sheet with Formula
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6B7280" }}>
                      Create a new blank report with header?
                    </p>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                      <button style={css.btn("ghost")} onClick={() => setShowNewDocModal(false)}>
                        Cancel
                      </button>
                      <button style={css.btn("primary")} onClick={async () => { 
                        console.log('[DEBUG] Creating new report from viewer');
                        
                        setShowNewDocModal(false);
                        setShowViewer(false); // Close viewer first
                        
                        // Open report editor with default name
                        await openCreateReport(selectedForm);
                        
                        // Patient name will be entered in the report editor itself
                      }}>
                        New Report
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Sheet Tabs */}
          {sheets.length > 1 && (
            <div style={css.sheetTabs}>
              {sheets.map((s, i) => (
                <div 
                  key={i} 
                  style={css.tab(activeSheet === i)} 
                  onClick={() => { 
                    setActiveSheet(i); 
                    formulaCacheRef.current = sheets[i]?.formulaCache || buildFormulaCache(s.data);
                    setSheetData(reEvaluateFormulas(s.data)); 
                  }}
                >
                  {s.name}
                </div>
              ))}
            </div>
          )}

          {/* Toolbar */}
          <div style={css.toolbar}>
            <button style={css.btn("ghost")} onClick={handleAddRow}>
              <Icon d={icons.plus} /> Add Row
            </button>
            <button style={css.btn("ghost")} onClick={handleAddCol}>
              <Icon d={icons.plus} /> Add Column
            </button>
            <button style={css.iconBtn} onClick={() => handleDeleteRow(sheetData.length - 1)} title="Delete last row">
              <Icon d={icons.trash} />
            </button>
          </div>

          {/* Sheet Editor */}
          <div style={{ flex: 1, overflow: "auto", padding: 0, background: "#F9FAFB" }}>
            {sheetData[0]?.[0] === "__html__" ? (
              <ReportSheetViewer
                ref={viewerRef}
                data={sheetData}
                readOnly={false}
                onDataChange={(newData) => setSheetData(newData)}
              />
            ) : (
              <div style={{ overflow: "auto", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff" }}>
                <table style={{ borderCollapse: "collapse", width: "max-content", minWidth: "100%" }}>
                  <thead>
                    <tr style={{ background: "#F3F4F6", position: "sticky", top: 0, zIndex: 2 }}>
                      {/* Row number header */}
                      <th style={{ 
                        border: "1px solid #E5E7EB", padding: "8px 6px", 
                        fontSize: 12, color: "#9CA3AF", width: 40, minWidth: 40,
                        textAlign: "center", fontWeight: 500
                      }}>#</th>
                      {(sheetData[0] || []).map((cell, cIdx) => (
                        <th key={cIdx} style={{ 
                          border: "1px solid #E5E7EB", padding: 0,
                          minWidth: 120, maxWidth: 240,
                          position: "relative"
                        }}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                              value={cell ?? ""}
                              onChange={(e) => handleCellChange(0, cIdx, e.target.value)}
                              style={{ 
                                flex: 1,
                                padding: "8px 10px", 
                                border: "none", 
                                outline: "none",
                                fontSize: 13,
                                background: "transparent",
                                fontWeight: 700,
                                color: "#1F2937",
                                width: "100%",
                                minWidth: 100,
                              }}
                            />
                            <button 
                              style={{ 
                                flexShrink: 0, padding: "4px 6px",
                                background: "transparent", border: "none",
                                cursor: "pointer", color: "#DC2626", fontSize: 14,
                                opacity: 0.5,
                              }}
                              onClick={() => handleDeleteCol(cIdx)}
                              title="Delete column"
                            >×</button>
                          </div>
                        </th>
                      ))}
                      {/* Add column placeholder */}
                      <th style={{ border: "1px solid #E5E7EB", width: 40, minWidth: 40 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {sheetData.slice(1).map((row, rIdx) => (
                      <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? "#fff" : "#F9FAFB" }}>
                        {/* Row number */}
                        <td style={{ 
                          border: "1px solid #E5E7EB", padding: "4px 6px",
                          fontSize: 12, color: "#9CA3AF", textAlign: "center",
                          background: "#F9FAFB", userSelect: "none"
                        }}>{rIdx + 1}</td>
                        {/* Pad row to match header column count */}
                        {Array.from({ length: sheetData[0]?.length || 0 }).map((_, cIdx) => (
                          <td key={cIdx} style={{ border: "1px solid #E5E7EB", padding: 0 }}>
                            <input
                              value={row[cIdx] ?? ""}
                              onChange={(e) => handleCellChange(rIdx + 1, cIdx, e.target.value)}
                              style={{ 
                                width: "100%", 
                                padding: "7px 10px", 
                                border: "none", 
                                outline: "none",
                                fontSize: 13,
                                background: "transparent",
                                color: "#374151",
                              }}
                            />
                          </td>
                        ))}
                        {/* Delete row button */}
                        <td style={{ border: "1px solid #E5E7EB", padding: "0 4px", textAlign: "center" }}>
                          <button 
                            style={{ 
                              background: "transparent", border: "none",
                              cursor: "pointer", color: "#DC2626", fontSize: 16,
                              opacity: 0.4, padding: "2px 4px"
                            }}
                            onClick={() => handleDeleteRow(rIdx + 1)}
                            title="Delete row"
                          >×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={css.root} className="bg-gray-100 dark:bg-[#0f0f10] text-gray-900 dark:text-white transition-colors duration-300">
      <Sidebar />
      <main style={css.main} className="bg-gray-100 dark:bg-[#0f0f10] transition-colors duration-300">
        {/* Header */}
        <div style={css.header} className="bg-white dark:bg-[#1c1c1e] border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div>
            <h1 style={css.h1} className="text-gray-900 dark:text-white">Forms</h1>
            <p style={css.subtitle} className="text-gray-500 dark:text-gray-400">Upload, edit and export forms (Excel, Word, PDF)</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => {
              if (selectedForm || forms.length > 0) {
                handleNewFromTemplate(selectedForm || forms[0], { stopPropagation: () => {} });
              } else {
                alert("Pehle ek template form select/upload karo");
              }
            }}>
              ✨ New from Template
            </button>
            <button style={css.btn("primary")} onClick={() => fileInputRef.current?.click()}>
              <Icon d={icons.upload} /> Upload Form
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.doc,.docx,.pdf"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Search */}
        <div style={css.toolbar} className="bg-white dark:bg-[#1c1c1e] border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <input
            placeholder="Search forms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#2c2c2e] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' /%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "10px center", backgroundSize: "16px" }}
          />
        </div>

        {/* Content with Folder Tree */}
        <div style={css.content}>
          {/* Folder Tree Sidebar */}
          <div style={css.folderTree} className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
            <div style={css.folderTreeHeader} className="border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 style={css.folderTreeTitle} className="text-gray-900 dark:text-white">Folders</h3>
              <button
                className="w-7 h-7 rounded-md border border-gray-200 dark:border-gray-700 bg-transparent cursor-pointer text-gray-500 dark:text-gray-400 flex items-center justify-center"
                onClick={() => setShowCreateFolder(true)}
                title="Create Folder"
              >
                <Icon d={folderIcons.addFolder} size={16} />
              </button>
            </div>
            <div style={css.folderTreeContent}>
              {/* All Forms - Root */}
              <div
                style={css.folderItem(0, currentFolderId === null)}
                onClick={() => setCurrentFolderId(null)}
                className={`flex items-center gap-2 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-[#252528] ${currentFolderId === null ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-[3px] border-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
              >
                <Icon d={folderIcons.home} size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span style={css.folderName} className="text-gray-700 dark:text-gray-300">All Forms</span>
              </div>

              {/* Folder Tree */}
              {buildFolderTree(null, 0).map(folder => (
                <div key={folder.id}>
                  <div
                    style={css.folderItem(folder.level, currentFolderId === folder.id)}
                    onClick={() => setCurrentFolderId(folder.id)}
                    className={`flex items-center gap-2 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-[#252528] ${currentFolderId === folder.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-[3px] border-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {folder.hasChildren && (
                      <span
                        style={css.folderToggle}
                        onClick={(e) => { e.stopPropagation(); toggleFolder(folder.id); }}
                        className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                      >
                        <Icon d={expandedFolders.has(folder.id) ? folderIcons.chevronDown : folderIcons.chevronRight} size={14} />
                      </span>
                    )}
                    {!folder.hasChildren && <span className="w-[18px] flex-shrink-0" />}
                    <Icon d={expandedFolders.has(folder.id) ? folderIcons.folderOpen : folderIcons.folder} size={16} className="text-amber-500 flex-shrink-0" />
                    <span style={css.folderName} className="text-gray-700 dark:text-gray-300">{folder.name}</span>
                    <div className="ml-auto flex gap-1">
                      <button
                        className="w-6 h-6 p-0 rounded border border-gray-200 dark:border-gray-700 bg-transparent cursor-pointer text-gray-500 dark:text-gray-400 flex items-center justify-center"
                        onClick={(e) => { e.stopPropagation(); openRenameModal(folder); }}
                        title="Rename"
                      >
                        ✏️
                      </button>
                      <button
                        className="w-6 h-6 p-0 rounded border border-gray-200 dark:border-gray-700 bg-transparent cursor-pointer text-gray-500 dark:text-gray-400 flex items-center justify-center"
                        onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  {expandedFolders.has(folder.id) && folder.children.length > 0 && (
                    folder.children.map(child => (
                      <div
                        key={child.id}
                        style={css.folderItem(child.level, currentFolderId === child.id)}
                        onClick={() => setCurrentFolderId(child.id)}
                        className={`flex items-center gap-2 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-[#252528] ${currentFolderId === child.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-[3px] border-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        <span className="w-[18px] flex-shrink-0" />
                        <Icon d={folderIcons.folder} size={16} className="text-amber-500 flex-shrink-0" />
                        <span style={css.folderName} className="text-gray-700 dark:text-gray-300">{child.name}</span>
                        <div className="ml-auto flex gap-1">
                          <button
                            className="w-6 h-6 p-0 rounded border border-gray-200 dark:border-gray-700 bg-transparent cursor-pointer text-gray-500 dark:text-gray-400 flex items-center justify-center"
                            onClick={(e) => { e.stopPropagation(); openRenameModal(child); }}
                            title="Rename"
                          >
                            ✏️
                          </button>
                          <button
                            className="w-6 h-6 p-0 rounded border border-gray-200 dark:border-gray-700 bg-transparent cursor-pointer text-gray-500 dark:text-gray-400 flex items-center justify-center"
                            onClick={(e) => { e.stopPropagation(); handleDeleteFolder(child.id); }}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div style={css.mainContent}>
            {/* Breadcrumb */}
            <div style={css.breadcrumb} className="text-gray-500 dark:text-gray-400">
              <span className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={() => setCurrentFolderId(null)}>All Forms</span>
              {getBreadcrumb().map((folder, idx) => (
                <span key={folder.id} className="flex items-center gap-2">
                  <span className="text-gray-300 dark:text-gray-600">/</span>
                  <span className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={() => setCurrentFolderId(folder.id)}>{folder.name}</span>
                </span>
              ))}
            </div>

            {/* Forms Grid */}
            {loading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            ) : filteredForms.length === 0 ? (
              <div className="text-center py-16 px-5 text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1c1c1e] rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <Icon d={icons.file} size={48} />
                <p className="mt-4">No forms found. Upload your first form!</p>
                {currentFolderId && <p className="text-xs mt-2">in this folder</p>}
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16
            }}>
              {filteredForms.map(form => (
                <div
                  key={form.id}
                  onClick={() => handleViewForm(form)}
                  className="bg-white dark:bg-[#1c1c1e] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer transition-all hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-colors duration-300"
                >
                  <div className="p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      <Icon d={icons.file} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="m-0 text-sm font-semibold truncate text-gray-900 dark:text-white">
                        {getDisplayName(form.name)}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {form.type?.toUpperCase() || "FILE"}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                        {new Date(form.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        className="text-xs px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                        onClick={async (e) => {
                          e.stopPropagation();
                          console.log('[DEBUG] Opening report editor');

                          // Open report editor - patient name will be entered in the editor
                          await openCreateReport(form);
                        }}
                        title="New Report"
                      >
                        New Report
                      </button>
                      <button
                        className="text-xs px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
                        onClick={(e) => { e.stopPropagation(); setRenameTarget(form); }}
                        title="Rename"
                      >
                        Rename
                      </button>
                      <button
                        className="text-xs px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                        onClick={(e) => handleDuplicateForm(form, e)}
                        title="Duplicate"
                      >
                        Copy
                      </button>
                      <button
                        className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleDeleteForm(form.id); }}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </main>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div style={css.overlay} onClick={() => setShowCreateFolder(false)}>
          <div className="bg-white dark:bg-[#1c1c1e] rounded-xl border border-gray-200 dark:border-gray-700 p-7 max-w-md w-[90%] mx-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="m-0 mb-5 text-lg font-semibold text-gray-900 dark:text-white">Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#2c2c2e] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-5"
              onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
            />
            <div className="flex gap-2.5 justify-end">
              <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setShowCreateFolder(false)}>
                Cancel
              </button>
              <button
                style={css.btn("primary")}
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim() || creatingFolder}
              >
                {creatingFolder ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Folder Modal */}
      {showRenameModal && (
        <div style={css.overlay} onClick={() => setShowRenameModal(false)}>
          <div style={css.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18 }}>Rename Folder</h3>
            <input
              type="text"
              placeholder="Folder name"
              value={renameFolderName}
              onChange={(e) => setRenameFolderName(e.target.value)}
              style={{ ...css.input, marginBottom: 20 }}
              onKeyPress={(e) => e.key === "Enter" && handleRenameFolder()}
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button style={css.btn("ghost")} onClick={() => setShowRenameModal(false)}>
                Cancel
              </button>
              <button 
                style={css.btn("primary")} 
                onClick={handleRenameFolder}
                disabled={!renameFolderName.trim()}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Edit Panel (like TemplateManager) */}
      {reportPanel && (
        <ReportEditPanel
          reportPanel={reportPanel}
          onBack={() => setReportPanel(null)}
          onSave={saveReport}
        />
      )}

      {/* Rename Modal */}
      {renameTarget && (
        <RenameModal
          form={renameTarget}
          onClose={() => setRenameTarget(null)}
          onRename={handleRename}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REPORT EDIT PANEL (like TemplateManager's ReportEditPanel)
// ══════════════════════════════════════════════════════════════════════════════
function ReportEditPanel({ reportPanel, onBack, onSave }) {
  const { templateName, allSheets, allData, patientName: initPatient } = reportPanel;

  const [activeSheet, setActiveSheet] = useState(allSheets[0]);
  const [reportData, setReportData] = useState(allData);
  const [reportPatient, setReportPatient] = useState(initPatient || "");
  const [sheetList, setSheetList] = useState(allSheets);
  const [showNewSheetModal, setShowNewSheetModal] = useState(false);
  const [newSheetName, setNewSheetName] = useState("");

  const viewerRef = useRef(null);

  const addNewSheet = () => {
    const name = newSheetName.trim() || `Sheet ${sheetList.length + 1}`;
    if (sheetList.includes(name)) { alert("Sheet name already exists!"); return; }
    setReportData(prev => ({ ...prev, [name]: [["__html__", "<p><br></p>"]] }));
    setSheetList(prev => [...prev, name]);
    setActiveSheet(name);
    setShowNewSheetModal(false);
    setNewSheetName("");
  };

  const patientIcon = "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z";

  return (
    <div style={css.panel}>
      {/* Header - Green like TemplateManager */}
      <div style={{ ...css.panelHeader, background: "#064E3B", borderColor: "#065F46" }}>
        <button
          style={{ ...css.btn("ghost"), color: "#D1FAE5", borderColor: "#065F46" }}
          onClick={() => { if (confirm("Discard changes and go back?")) onBack(); }}
        >
          <Icon d={icons.back} size={15} /> Back
        </button>
        <span style={{ width: 1, height: 24, background: "#065F46" }} />
        <Icon d={patientIcon} size={18} stroke="#6EE7B7" />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#D1FAE5", fontWeight: 600, fontSize: 14 }}>Patient Report:</span>
          <input
            value={reportPatient}
            onChange={e => setReportPatient(e.target.value)}
            placeholder="Enter patient name..."
            style={{
              background: "#065F46", border: "1px solid #059669", color: "#fff",
              borderRadius: 6, padding: "4px 10px", fontSize: 13, outline: "none",
              fontFamily: "inherit", width: 200,
            }}
          />
        </div>
        <span style={{ color: "#6EE7B7", fontSize: 12, marginLeft: 4 }}>— {templateName.replace(/\.[^/.]+$/, "")}</span>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <select
            style={{ ...css.btn("ghost"), color: "#D1FAE5", borderColor: "#065F46" }}
            onChange={async (e) => {
              if (!e.target.value) return;
              const type = e.target.value;
              e.target.value = ""; // Reset dropdown
              
              const flushed = viewerRef.current?.getCurrentData?.({ allowEmpty: true });
              const dataToExport = flushed
                ? { ...reportData, [activeSheet]: flushed }
                : reportData;
              
              // Export to local file
              const cleanTemplate = templateName.replace(/\.[^/.]+$/, "");
              const name = `${reportPatient || "Patient"} — ${cleanTemplate} — ${new Date().toLocaleDateString("en-IN")}`;
              const firstSheet = sheetList[0];
              const sheetData = dataToExport[firstSheet];
              
              if (type === "pdf") {
                await exportSheetToPdf(sheetData, name + ".pdf", viewerRef);
              } else if (sheetData[0]?.[0] === "__html__") {
                await exportSheetToDocx(sheetData, name + ".docx");
              } else {
                exportSheetToXlsx(sheetData, name + ".xlsx");
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>Export...</option>
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="docx">Word (.docx)</option>
            <option value="pdf">PDF (.pdf)</option>
          </select>
          <button style={css.btn("green")} onClick={() => {
            const flushed = viewerRef.current?.getCurrentData?.({ allowEmpty: true });
            const dataToSave = flushed
              ? { ...reportData, [activeSheet]: flushed }
              : reportData;
            onSave(dataToSave, sheetList, reportPatient);
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
        ref={viewerRef}
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
