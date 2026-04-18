// TemplateManager.jsx — FIXED VERSION
// Fixes:
//  ✅ FIX 1: Header export to Word — robust HTML extraction (no fragile regex)
//  ✅ FIX 2: Patient name shows correctly on saved report card
//  ✅ FIX 3: Rename function added (pencil icon on each card + modal)

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, LevelFormat, ImageRun,
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
  rename:   "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
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

// ─── FIX 1: Robust header extraction — uses DOM parser instead of fragile regex ──
function extractHeaderHtml(fullHtml) {
  if (!fullHtml) return "";
  const div = document.createElement("div");
  div.innerHTML = fullHtml;

  // Strategy 1: Find first child element that contains an <img> tag (logo)
  for (const child of div.children) {
    if (child.querySelector("img")) {
      return child.outerHTML;
    }
  }

  // Strategy 2: Find element that contains "MindSaid" or centre name text
  for (const child of div.children) {
    const text = (child.innerText || child.textContent || "").toLowerCase();
    if (text.includes("mindsaid") || text.includes("learning centre") || text.includes("centre")) {
      return child.outerHTML;
    }
  }

  // Strategy 3: Find first <table> that looks like a header (has image OR contact info)
  const tables = div.querySelectorAll("table");
  for (const table of tables) {
    const text = (table.innerText || table.textContent || "").toLowerCase();
    const hasImg = table.querySelector("img");
    if (hasImg || text.includes("tel") || text.includes("@") || text.includes("www")) {
      return table.outerHTML;
    }
  }

  // Strategy 4: Return first block-level element as fallback header
  if (div.firstElementChild) {
    return div.firstElementChild.outerHTML;
  }

  return "";
}

// ─── HTML → docx elements ────────────────────────────────────────────────────
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
  if (tag === "br") { runs.push(new TextRun({ text: "", break: 1 })); return runs; }
  for (const child of node.childNodes) runs.push(...nodeToRuns(child, style));
  return runs;
}

function estimateColWidths(trList, totalWidth) {
  let colCount = 0;
  trList.forEach(tr => {
    let c = 0;
    tr.querySelectorAll("td,th").forEach(cell => { c += parseInt(cell.getAttribute("colspan") || "1"); });
    colCount = Math.max(colCount, c);
  });
  if (colCount <= 1) return [totalWidth];
  const colLengths = Array(colCount).fill(0);
  trList.slice(0, 5).forEach(tr => {
    [...tr.querySelectorAll("td,th")].forEach((cell, i) => {
      if (i < colCount) colLengths[i] = Math.max(colLengths[i], (cell.textContent || "").trim().length);
    });
  });
  const MIN_FRAC = 0.08;
  const remaining = Math.max(0, 1 - MIN_FRAC * colCount);
  const totalLen = colLengths.reduce((a, b) => a + b, 0) || 1;
  const fracs = colLengths.map(len => MIN_FRAC + (len / totalLen) * remaining);
  const fracSum = fracs.reduce((a, b) => a + b, 0);
  return fracs.map(f => Math.max(400, Math.floor((f / fracSum) * totalWidth)));
}

function cellToParagraphs(tdNode) {
  const paragraphs = [];
  const isTh = tdNode.tagName?.toLowerCase() === "th";
  function processNode(node, inherited = {}) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent;
      if (t && t.trim()) paragraphs.push(new Paragraph({ children: [new TextRun({ text: t, ...inherited })], spacing: { after: 0 } }));
      return;
    }
    const tag = node.tagName?.toLowerCase();
    if (!tag) return;
    if (tag === "br") { paragraphs.push(new Paragraph({ children: [], spacing: { after: 0 } })); return; }
    if (["p", "div", "span"].includes(tag)) {
      const runs = nodeToRuns(node, inherited);
      if (runs.length) { paragraphs.push(new Paragraph({ children: runs, spacing: { after: 60 } })); }
      else { for (const child of node.childNodes) processNode(child, inherited); }
      return;
    }
    if (/^h[1-6]$/.test(tag)) {
      const hmap = { h1: HeadingLevel.HEADING_1, h2: HeadingLevel.HEADING_2, h3: HeadingLevel.HEADING_3, h4: HeadingLevel.HEADING_4 };
      paragraphs.push(new Paragraph({ heading: hmap[tag] || HeadingLevel.HEADING_3, children: nodeToRuns(node), spacing: { after: 60 } }));
      return;
    }
    const newInherited = { ...inherited, bold: inherited.bold || ["b", "strong", "th"].includes(tag), italics: inherited.italics || ["i", "em"].includes(tag) };
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
  const headingMap = { h1: HeadingLevel.HEADING_1, h2: HeadingLevel.HEADING_2, h3: HeadingLevel.HEADING_3, h4: HeadingLevel.HEADING_4 };
  if (headingMap[tag]) { els.push(new Paragraph({ heading: headingMap[tag], children: nodeToRuns(node) })); return els; }
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
  
  if (tag === "hr") { els.push(new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "AAAAAA", space: 1 } }, children: [] })); return els; }
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
    trList.forEach(tr => { let count = 0; tr.querySelectorAll("td,th").forEach(cell => { count += parseInt(cell.getAttribute("colspan") || "1"); }); colCount = Math.max(colCount, count); });
    if (colCount === 0) return els;
    const colWidths = estimateColWidths(trList, PAGE_CONTENT_WIDTH);
    const finalColCount = colWidths.length;
    const rows = trList.map((tr, rowIdx) => {
      const tdList = Array.from(tr.querySelectorAll("td,th"));
      const cells = tdList.map((td, colIdx) => {
        const isHeader = td.tagName.toLowerCase() === "th" || rowIdx === 0;
        const colspan = parseInt(td.getAttribute("colspan") || "1");
        const cellWidth = colspan > 1 ? colWidths.slice(colIdx, colIdx + colspan).reduce((a, b) => a + b, 0) : (colWidths[colIdx] || Math.floor(PAGE_CONTENT_WIDTH / finalColCount));
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
    els.push(new Table({ width: { size: PAGE_CONTENT_WIDTH, type: WidthType.DXA }, columnWidths: colWidths, rows }));
    els.push(new Paragraph({ children: [], spacing: { after: 120 } }));
    return els;
  }
  if (tag === "blockquote") { els.push(new Paragraph({ indent: { left: 720 }, children: nodeToRuns(node) })); return els; }
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

// ─── DOCX export ─────────────────────────────────────────────────────────────
async function buildAndDownloadDocx(allData, sheetList, patientName, templateName) {
  console.log("[DOCX Export] Starting export...", { allData, sheetList, patientName, templateName });
  try {
    if (!sheetList || sheetList.length === 0) throw new Error("No sheets to export");
    const sections = [];
    for (const name of sheetList) {
      const sheetData = allData[name] || [];
      console.log("[DOCX Export] Processing sheet:", name, "Data:", sheetData);
      const html = getSheetHtml(sheetData);
      console.log("[DOCX Export] Extracted HTML:", html?.substring(0, 200));
      const isEmpty = !html || html === "" || html === "<p><br></p>" || html.replace(/<[^>]+>/g, "").trim() === "";
      if (isEmpty) {
        console.log("[DOCX Export] Sheet is empty, skipping");
        continue;
      }
      console.log("[DOCX Export] Converting HTML to DOCX elements...");
      const children = await htmlToDocxElements(html);
      console.log("[DOCX Export] Generated", children.length, "DOCX elements");
      sections.push({
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
        children,
      });
    }
    console.log("[DOCX Export] Creating document with", sections.length, "sections");
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
          { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 32, bold: true, font: "Arial", color: "1D4ED8" }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
          { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 28, bold: true, font: "Arial" }, paragraph: { spacing: { before: 180, after: 90 }, outlineLevel: 1 } },
        ],
      },
      sections,
    });
    console.log("[DOCX Export] Packing document to blob...");
    const blob = await Packer.toBlob(doc);
    console.log("[DOCX Export] Blob created, size:", blob.size, "bytes");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${patientName || "Report"}_${templateName || "export"}.docx`;
    a.click();
    console.log("[DOCX Export] Download triggered successfully!");
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("[DOCX Export] FAILED:", err);
    console.error("[DOCX Export] Error stack:", err.stack);
    throw err;
  }
}

// ─── XLSX export ──────────────────────────────────────────────────────────────
function buildAndDownloadXlsx(allData, sheetList, patientName, templateName) {
  const wb = XLSX.utils.book_new();
  sheetList.forEach(name => {
    const d = allData[name] || [];
    let rows;
    if (d[0]?.[0] === "__html__") {
      const html = d[0][1] || "";
      const div = document.createElement("div");
      div.innerHTML = html;
      rows = [];
      function extractRows(node) {
        if (node.nodeType === Node.TEXT_NODE) { const t = node.textContent.trim(); if (t) rows.push([t]); return; }
        const tag = node.tagName?.toLowerCase();
        if (!tag) return;
        if (/^h[1-6]$/.test(tag)) { rows.push([node.innerText.trim().toUpperCase()]); return; }
        if (tag === "p" || tag === "div") { const t = node.innerText?.trim(); if (t) rows.push([t]); else node.childNodes.forEach(extractRows); return; }
        if (tag === "br") { rows.push([""]); return; }
        if (tag === "hr") { rows.push(["---"]); return; }
        if (tag === "li") { rows.push(["  • " + node.innerText?.trim()]); return; }
        if (tag === "table") { node.querySelectorAll("tr").forEach(tr => { rows.push([...tr.querySelectorAll("td,th")].map(c => c.innerText?.trim() || "")); }); rows.push([""]); return; }
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
// RENAME MODAL COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
function RenameModal({ template, onClose, onRename }) {
  const [newName, setNewName] = useState(template.name || "");
  const [saving, setSaving] = useState(false);

  const handleRename = async () => {
    const trimmed = newName.trim();
    if (!trimmed) { alert("Name cannot be empty"); return; }
    if (trimmed === template.name) { onClose(); return; }
    setSaving(true);
    try {
      await api.updateTemplate(template.id, {
        name: trimmed,
        type: template.type || "import",
        description: template.desc,
        template_data: { sheets: template.sheets, sheetNames: template.sheetNames, row_heights: template.rowHeights || {} },
      });
      onRename(template.id, trimmed);
      onClose();
    } catch (err) {
      alert("Rename failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={css.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ ...css.modal, maxWidth: 420 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>✏️ Rename Template</h3>
          <button style={css.iconBtn} onClick={onClose}><Icon d={icons.x} size={16} /></button>
        </div>
        <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6 }}>New Name</label>
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

  return (
    <div style={css.panel}>
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
          <ExportDropdown
            ghost={true}
            onExportDocx={() => buildAndDownloadDocx(reportData, [activeSheet], reportPatient, activeSheet)}
            onExportXlsx={() => {
              const wb = XLSX.utils.book_new();
              const d = reportData[activeSheet] || [];
              let rows;
              if (d[0]?.[0] === "__html__") {
                const div = document.createElement("div");
                div.innerHTML = d[0][1] || "";
                rows = [[div.innerText || ""]];
              } else { rows = d; }
              XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), activeSheet.substring(0, 31));
              XLSX.writeFile(wb, `${reportPatient || "Report"}_${activeSheet}.xlsx`);
            }}
          />

          <button style={css.btn("green")} onClick={() => {
            const flushed = viewerRef.current?.getCurrentData?.({ allowEmpty: true });
            const dataToSave = flushed ? { ...reportData, [activeSheet]: flushed } : reportData;
            // FIX 2: Pass patient name explicitly so card shows correct name
            onSave(dataToSave, sheetList, reportPatient);
          }}>
            <Icon d={icons.save} size={14} /> Save Report
          </button>
        </div>
      </div>

      <div style={{ ...css.sheetTabs, background: "#F0FDF4", borderColor: "#BBF7D0" }}>
        {sheetList.map(name => (
          <button
            key={name}
            style={{ ...css.tab(name === activeSheet), ...(name === activeSheet ? { background: "#059669", borderColor: "#059669" } : {}) }}
            onClick={() => setActiveSheet(name)}
          >
            {name}
          </button>
        ))}
        <button
          onClick={() => setShowNewSheetModal(true)}
          title="Add new sheet"
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, border: "1px dashed #6EE7B7", background: "rgba(255,255,255,0.3)", color: "#065F46", cursor: "pointer", fontSize: 18, fontWeight: 300, flexShrink: 0 }}
        >+</button>
      </div>

      {/* Conditional rendering based on format */}
      {reportData[activeSheet]?.[0]?.[0] === "__html__" ? (
        <ReportSheetViewer
          ref={viewerRef}
          key={activeSheet}
          data={reportData[activeSheet] || [["__html__", "<p><br></p>"]]}
          readOnly={false}
          reportMode={true}
          onDataChange={newData => setReportData(prev => ({ ...prev, [activeSheet]: newData }))}
        />
      ) : (
        // ✅ Excel grid render karo
        <div style={{ flex: 1, overflow: "auto", padding: 16, background: "#F9FAFB" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <tbody>
              {(reportData[activeSheet] || []).map((row, rIdx) => (
                <tr key={rIdx}>
                  {(row || []).map((cell, cIdx) => (
                    <td key={cIdx} style={{ border: "1px solid #E5E7EB", padding: 0 }}>
                      <input
                        value={cell ?? ""}
                        onChange={e => {
                          const newData = reportData[activeSheet].map((r, ri) =>
                            ri === rIdx ? r.map((c, ci) => ci === cIdx ? e.target.value : c) : r
                          );
                          setReportData(prev => ({ ...prev, [activeSheet]: newData }));
                        }}
                        style={{
                          width: "100%", padding: "6px 10px",
                          border: "none", outline: "none", fontSize: 13,
                          background: rIdx === 0 ? "#F0F9FF" : "transparent",
                          fontWeight: rIdx === 0 ? 600 : 400,
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showNewSheetModal && (
        <div style={css.overlay}>
          <div style={{ ...css.modal, maxWidth: 380 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>➕ Add New Sheet</h3>
              <button style={css.iconBtn} onClick={() => setShowNewSheetModal(false)}><Icon d={icons.x} size={16} /></button>
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
              <button style={css.btn("primary")} onClick={addNewSheet}><Icon d={icons.plus} size={14} /> Create Sheet</button>
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
function ViewPanel({ template, onBack, onCreateReport, onTemplateUpdated }) {
  const [activeSheetIdx, setActiveSheetIdx] = useState(0);
  const sheetNames = template.sheetNames || [];
  const currentSheet = sheetNames[activeSheetIdx] || sheetNames[0];

  const cloneSheets = useCallback((s) => {
    if (!s) return {};
    try { return structuredClone(s); } catch { return JSON.parse(JSON.stringify(s)); }
  }, []);

  const [localSheets, setLocalSheets] = useState(() => cloneSheets(template.sheets));

  useEffect(() => {
    setActiveSheetIdx(0);
    setLocalSheets(cloneSheets(template.sheets));
  }, [template.id, cloneSheets, template.sheets]);

  return (
    <div style={css.panel}>
      <div style={css.panelHeader}>
        <button style={css.btn("ghost")} onClick={onBack}><Icon d={icons.back} size={15} /> Back</button>
        <span style={{ width: 1, height: 24, background: "#E5E7EB" }} />
        <span style={{ fontWeight: 600, fontSize: 15 }}>{template.name}</span>
        <span style={{ ...css.badge("blue"), marginLeft: 4 }}>{template.type}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <button
            style={css.btn("primary")}
            onClick={async () => {
              try {
                await api.updateTemplate(template.id, {
                  name: template.name, type: template.type || "import", description: template.desc,
                  template_data: { sheets: localSheets, sheetNames: template.sheetNames, row_heights: template.rowHeights || {} }
                });
                onTemplateUpdated?.(template.id, localSheets);
                alert("Template saved successfully!");
              } catch (err) { alert("Save failed: " + err.message); }
            }}
          >
            <Icon d={icons.save} size={14} /> Save Changes
          </button>
          <span style={{ width: 1, height: 24, background: "#E5E7EB" }} />
          <ExportDropdown
            onExportDocx={() => buildAndDownloadDocx(localSheets, [currentSheet], template.name, currentSheet)}
            onExportXlsx={() => {
              const wb = XLSX.utils.book_new();
              const d = localSheets[currentSheet] || [];
              let rows;
              if (d[0]?.[0] === "__html__") {
                const div = document.createElement("div");
                div.innerHTML = d[0][1] || "";
                rows = [[div.innerText || ""]];
              } else { rows = d; }
              XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), currentSheet.substring(0, 31));
              XLSX.writeFile(wb, `${template.name}_${currentSheet}.xlsx`);
            }}
          />
          <button style={css.btn("green")} onClick={() => onCreateReport(template)}>
            <Icon d={icons.patient} size={14} /> New Report
          </button>
        </div>
      </div>

      <div style={css.sheetTabs}>
        {sheetNames.map((name, i) => (
          <button key={name} style={css.tab(i === activeSheetIdx)} onClick={() => setActiveSheetIdx(i)}>{name}</button>
        ))}
      </div>

      <ReportSheetViewer
        key={currentSheet}
        data={localSheets[currentSheet] || [["__html__", "<p><br></p>"]]}
        readOnly={false}
        onDataChange={(newData) => setLocalSheets(prev => ({ ...prev, [currentSheet]: newData }))}
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

  // FIX 3: Rename modal state
  const [renameTarget, setRenameTarget] = useState(null);

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

  // FIX 2: Display name helper — shows patient name for reports, template name for others
  const getDisplayName = (t) => {
    if (!t.name) return "Untitled";
    // Reports: "PatientName — TemplateName — Date" → show "PatientName — TemplateName"
    const parts = t.name.split("—").map(s => s.trim());
    if (t.type === "report" && parts.length >= 3) {
      // First part = patient name, second = template name
      return `${parts[0]} — ${parts[1]}`;
    }
    if (parts.length >= 2) return parts[1] || parts[0];
    return t.name;
  };

  // Short name for card subtitle (just template base name)
  const getShortName = (fullName) => {
    if (!fullName) return "Untitled";
    const parts = fullName.split("—").map(s => s.trim());
    if (parts.length >= 2) return parts[1] || parts[0];
    return fullName;
  };

  // FIX 1: openCreateReport — use robust DOM-based header extraction
  const openCreateReport = (tpl) => {
    const reportSheets = {};
    const reportSheetNames = [];

    // ✅ Detect format from template
    const isExcel = tpl.sheetNames?.some(name => {
      const d = tpl.sheets[name];
      return d && d[0]?.[0] !== "__html__";
    });

    tpl.sheetNames.forEach(sheetName => {
      const sheetData = tpl.sheets[sheetName];
      if (!sheetData) return;

      let clonedData;
      try { clonedData = structuredClone(sheetData); }
      catch { clonedData = JSON.parse(JSON.stringify(sheetData)); }

      if (clonedData[0]?.[0] === "__html__") {
        // Word/HTML template → header extract karo
        const html = clonedData[0][1] || "";
        const headerHtml = extractHeaderHtml(html);
        clonedData = [["__html__", headerHtml + "<p><br></p>"]];
      } else {
        // ✅ Excel template → rows clear karo but structure rakho
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

    if (reportSheetNames.length === 0) {
      const fallbackName = "Report";
      reportSheets[fallbackName] = [["__html__", "<p><br></p>"]];
      reportSheetNames.push(fallbackName);
    }

    setReportPanel({
      templateName: tpl.name,
      allSheets: reportSheetNames,
      allData: reportSheets,
      patientName: "",
      isExcel, // ✅ Format track karo
    });
    setPanel("report");
  };

  // FIX 2: saveReport — name now correctly includes patient name
  const saveReport = async (allData, sheetList, activePatientName) => {
    try {
      const patientPart = (activePatientName || "Patient").trim();
      const templatePart = getShortName(reportPanel.templateName);
      const datePart = new Date().toLocaleDateString("en-IN");
      // Format: "PatientName — TemplateName — Date"
      const name = `${patientPart} — ${templatePart} — ${datePart}`;

      if (reportPanel.isExcel) {
        // ✅ Excel format → .xlsx blob banao aur upload karo
        const wb = XLSX.utils.book_new();
        sheetList.forEach(sheetName => {
          const rows = allData[sheetName] || [];
          XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), sheetName.substring(0, 31));
        });
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        
        const formData = new FormData();
        formData.append("file", blob, `${name}.xlsx`);
        // template_data bhi bhejo taaki reopen ho sake
        formData.append("template_data", JSON.stringify({
          sheets: allData,
          sheetNames: sheetList,
          isExcel: true,
        }));
        
        // ✅ Upload endpoint use karo
        await fetch(
          `${import.meta.env.VITE_API_URL || "https://dashboard.iplanbymsl.in/api"}/templates/upload`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
            body: formData,
          }
        );
      } else {
        // Word/HTML format → existing logic
        await api.createTemplate({
          name,
          type: "report",
          description: `Patient report for ${patientPart}`,
          template_data: { 
            sheets: allData, 
            sheetNames: sheetList,
            isExcel: false,
          },
        });
      }

      await fetchTemplates();
      setPanel(null);
      setReportPanel(null);
      alert(`✅ Report "${name}" saved successfully!`);
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  // FIX 3: handleRename — update template name in state after successful API call
  const handleRename = (id, newName) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, name: newName } : t));
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
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv,.docx" onChange={handleUpload} style={{ display: "none" }} />
            <button style={css.btn("primary")} onClick={() => fileRef.current?.click()}>
              <Icon d={icons.upload} size={14} /> Upload File
            </button>
          </div>
        </div>

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

        <div style={css.content}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
              <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>No templates yet</p>
              <p style={{ fontSize: 13, marginBottom: 20 }}>Upload an Excel or Word document template to get started</p>
              <button style={css.btn("primary")} onClick={() => fileRef.current?.click()}>
                <Icon d={icons.upload} size={14} /> Upload File
              </button>
            </div>
          ) : view === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 16 }}>
              {filtered.map(t => {
                const isSel = !!selected.find(s => s.id === t.id);
                return (
                  <div key={t.id} style={css.card(isSel)} onClick={() => openView(t)}>
                    <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={css.cardIcon}><Icon d={icons.file} size={20} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* FIX 2: Show patient name + template name for reports */}
                        <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 2px", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={t.name}>
                          {getDisplayName(t)}
                        </p>
                        {/* Show date as subtitle for reports */}
                        {t.type === "report" && (() => {
                          const parts = t.name.split("—").map(s => s.trim());
                          return parts.length >= 3 ? <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 4px" }}>{parts[parts.length - 1]}</p> : null;
                        })()}
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          <span style={css.badge(t.type === "report" ? "green" : "blue")}>{t.type}</span>
                          <span style={css.badge("default")}>{(t.sheetNames || []).length} sheets</span>
                        </div>
                      </div>
                      <input type="checkbox" checked={isSel} onChange={() => {}} style={{ accentColor: "#2563EB", width: 15, height: 15 }} />
                    </div>
                    <div style={{ borderTop: "1px solid #F3F4F6", padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openView(t); }}
                          style={{ fontSize: 11, padding: "4px 8px", background: "#2563EB", color: "#fff", border: "1px solid #2563EB", borderRadius: 6, cursor: "pointer" }}
                          title="View/Edit"
                        >
                          View
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openCreateReport(t); }}
                          style={{ fontSize: 11, padding: "4px 8px", background: "#059669", color: "#fff", border: "1px solid #059669", borderRadius: 6, cursor: "pointer" }}
                          title="New Report"
                        >
                          New Report
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setRenameTarget(t); }}
                          style={{ fontSize: 11, padding: "4px 8px", background: "#D97706", color: "#fff", border: "1px solid #D97706", borderRadius: 6, cursor: "pointer" }}
                          title="Rename"
                        >
                          Rename
                        </button>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteTpl(t.id); }}
                        style={{ fontSize: 11, padding: "4px 8px", background: "#DC2626", color: "#fff", border: "1px solid #DC2626", borderRadius: 6, cursor: "pointer" }}
                        title="Delete"
                      >
                        Delete
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
                      <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={e => setSelected(e.target.checked ? [...filtered] : [])} style={{ accentColor: "#2563EB" }} />
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
                            {/* FIX 2: List view also shows correct display name */}
                            <span style={{ fontWeight: 500 }}>{getDisplayName(t)}</span>
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
                          <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap" }}>
                            <button 
                              onClick={(e) => { e.stopPropagation(); openView(t); }}
                              style={{ fontSize: 11, padding: "4px 8px", background: "#2563EB", color: "#fff", border: "1px solid #2563EB", borderRadius: 6, cursor: "pointer" }}
                              title="View"
                            >
                              View
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); openCreateReport(t); }}
                              style={{ fontSize: 11, padding: "4px 8px", background: "#059669", color: "#fff", border: "1px solid #059669", borderRadius: 6, cursor: "pointer" }}
                              title="New Report"
                            >
                              New Report
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setRenameTarget(t); }}
                              style={{ fontSize: 11, padding: "4px 8px", background: "#D97706", color: "#fff", border: "1px solid #D97706", borderRadius: 6, cursor: "pointer" }}
                              title="Rename"
                            >
                              Rename
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteTpl(t.id); }}
                              style={{ fontSize: 11, padding: "4px 8px", background: "#DC2626", color: "#fff", border: "1px solid #DC2626", borderRadius: 6, cursor: "pointer" }}
                              title="Delete"
                            >
                              Delete
                            </button>
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
          key={`${activeTemplate.id}_${activeTemplate.name}`}
          template={activeTemplate}
          onBack={() => setPanel(null)}
          onCreateReport={openCreateReport}
          onTemplateUpdated={(id, sheets) => {
            setTemplates(prev => prev.map(t => (t.id === id ? { ...t, sheets } : t)));
            setActiveTemplate(prev => (prev && prev.id === id ? { ...prev, sheets } : prev));
          }}
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

      {/* ── FIX 3: RENAME MODAL ── */}
      {renameTarget && (
        <RenameModal
          template={renameTarget}
          onClose={() => setRenameTarget(null)}
          onRename={handleRename}
        />
      )}
    </div>
  );
}