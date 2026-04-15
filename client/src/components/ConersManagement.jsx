import { useState, useRef, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType,
} from "docx";
import api from "../services/api";
import Sidebar from "./Sidebar";

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
};

const css = {
  root:     { fontFamily: "system-ui,-apple-system,sans-serif", minHeight: "100vh", background: "#F3F4F6", color: "#1a1a1a", display: "flex" },
  main:     { flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "auto", marginLeft: "256px", paddingLeft: "24px" },
  header:   { background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, position: "sticky", top: 0, zIndex: 20 },
  h1:       { margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: "-0.3px" },
  subtitle: { margin: 0, fontSize: 12, color: "#6B7280" },
  btn: (v = "default") => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
    border: "1px solid", cursor: "pointer", transition: "all 0.15s",
    ...(v === "primary" ? { background: "#2563EB", color: "#fff", borderColor: "#2563EB" } :
        v === "green"   ? { background: "#059669", color: "#fff", borderColor: "#059669" } :
        v === "red"     ? { background: "#DC2626", color: "#fff", borderColor: "#DC2626" } :
        v === "ghost"   ? { background: "transparent", color: "#374151", borderColor: "#D1D5DB" } :
                          { background: "#fff", color: "#374151", borderColor: "#D1D5DB" }),
  }),
  iconBtn:   { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 6, border: "1px solid #E5E7EB", background: "transparent", cursor: "pointer", color: "#6B7280" },
  toolbar:   { background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  searchInput: { width: "100%", padding: "7px 12px 7px 36px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" },
  content:   { padding: 24, display: "flex", gap: 24 },
  folderTree: { width: 280, minWidth: 280, background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden", display: "flex", flexDirection: "column" },
  folderTreeHeader: { padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" },
  folderTreeTitle: { margin: 0, fontSize: 14, fontWeight: 600, color: "#1F2937" },
  folderTreeContent: { padding: "8px 0", overflow: "auto", flex: 1 },
  folderItem: (level, selected) => ({ 
    padding: "8px 16px 8px " + (16 + level * 20) + "px", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    gap: 8, 
    background: selected ? "#EFF6FF" : "transparent",
    color: selected ? "#2563EB" : "#374151",
    fontWeight: selected ? 500 : 400,
    borderRight: selected ? "3px solid #2563EB" : "3px solid transparent",
    transition: "all 0.15s",
    ":hover": { background: selected ? "#EFF6FF" : "#F9FAFB" }
  }),
  folderIcon: { color: "#F59E0B", flexShrink: 0 },
  folderName: { flex: 1, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  folderToggle: { flexShrink: 0, color: "#9CA3AF", transition: "transform 0.15s" },
  mainContent: { flex: 1, display: "flex", flexDirection: "column" },
  breadcrumb: { display: "flex", alignItems: "center", gap: 8, padding: "0 0 16px 0", fontSize: 13, color: "#6B7280" },
  breadcrumbItem: { cursor: "pointer", ":hover": { color: "#2563EB" } },
  breadcrumbSeparator: { color: "#D1D5DB" },
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

// ─── HTML → plain text ─────────────────────────────────────────────────────────
function htmlToPlainText(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText || div.textContent || "";
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
  if (!sheetData?.length) return;
  const plainRows = sheetData[0]?.[0] === "__html__" 
    ? [[htmlToPlainText(sheetData[0][1])]] 
    : sheetData;

  const rows = plainRows.map((row) => 
    new TableRow({
      children: row.map(cell => new TableCell({
        children: [new Paragraph({ children: [new TextRun(String(cell ?? ""))] })],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
        },
        width: { size: 100 / row.length, type: WidthType.PERCENTAGE },
      })),
    })
  );

  const doc = new Document({
    sections: [{ children: [new Table({ rows })] }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.replace(/\.[^/.]+$/, "") + ".docx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
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

// ─── Main Component ──────────────────────────────────────────────────────────────
export default function ConersManagement() {
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
      let url = currentFolderId ? `/coners/folder/${currentFolderId}` : "/coners";
      const res = await api.get(url);
      console.log("📄 Coners RAW response:", res);

      let formList = [];
      if (Array.isArray(res)) {
        formList = res;
      } else if (res?.success && res?.data) {
        if (Array.isArray(res.data.coners)) {
          formList = res.data.coners;
        } else if (Array.isArray(res.data)) {
          formList = res.data;
        }
      }

      setForms(formList);
    } catch (e) {
      console.error("Load coners error:", e);
      setForms([]);
    }
  }, [currentFolderId]);

  // Load folders
  const loadFolders = useCallback(async () => {
    try {
      const res = await api.get("/coners/folders");
      console.log("📁 Coner folders RAW response:", res);
      
      let folderList = [];
      if (Array.isArray(res)) {
        folderList = res;
      } else if (Array.isArray(res?.data)) {
        folderList = res.data;
      } else if (Array.isArray(res?.data?.data)) {
        folderList = res.data.data;
      }
      
      console.log("📁 Parsed coner folders:", folderList);
      setFolders(folderList);
    } catch (e) {
      console.error("Load coner folders error:", e);
    }
  }, []);

  useEffect(() => { loadForms(); }, [loadForms]);
  useEffect(() => { loadFolders(); }, [loadFolders]);

  // Create folder
  const handleCreateFolder = async () => {
    console.log("🔵 [DEBUG] Create coner folder called:", { newFolderName, currentFolderId });
    if (!newFolderName.trim()) return;
    setCreatingFolder(true);
    try {
      console.log("🔵 [DEBUG] Sending API request to /coners/folders");
      const response = await api.post("/coners/folders", {
        name: newFolderName,
        parent_id: currentFolderId
      });
      console.log("🔵 [DEBUG] Coner folder creation response:", response);
      setNewFolderName("");
      setShowCreateFolder(false);
      await loadFolders();
    } catch (e) {
      console.error("❌ [DEBUG] Create coner folder error:", e);
      console.error("❌ [DEBUG] Error status:", e.status);
      console.error("❌ [DEBUG] Error message:", e.message);
      alert("Failed to create coner folder: " + (e.message || "Unknown error"));
    } finally {
      setCreatingFolder(false);
    }
  };

  // Rename folder
  const handleRenameFolder = async () => {
    if (!renameFolderName.trim() || !selectedFolderId) return;
    try {
      await api.put(`/coners/folders/${selectedFolderId}`, {
        name: renameFolderName
      });
      setShowRenameModal(false);
      setRenameFolderName("");
      setSelectedFolderId(null);
      await loadFolders();
    } catch (e) {
      alert("Failed to rename coner folder: " + (e.message || "Unknown error"));
    }
  };

  // Delete folder
  const handleDeleteFolder = async (folderId) => {
    if (!confirm("Delete this folder and all its contents?")) return;
    try {
      await api.delete(`/coners/folders/${folderId}`);
      if (currentFolderId === folderId) {
        setCurrentFolderId(null);
      }
      await loadFolders();
      await loadForms();
    } catch (e) {
      alert("Failed to delete coner folder: " + (e.message || "Unknown error"));
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
    e.target.value = "";

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    if (currentFolderId) {
      formData.append("folder_id", String(currentFolderId));
    }

    try {
      await api.post("/coners/upload", formData);
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

  // Parse file and open viewer
  const handleViewForm = async (form) => {
    setSelectedForm(form);
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://dashboard.iplanbymsl.in/api/coners/${form.id}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const blob = await response.blob();
      const ext = form.name.match(/\.([^.]+)$/)?.[1]?.toLowerCase();

      if (['xlsx', 'xls', 'csv'].includes(ext)) {
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
        setSheetData([["__html__", "<p>Word documents can be downloaded and edited locally.</p>"]]);
        setSheets([{ name: "Document", data: [] }]);
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
    if (!confirm("Delete this coner?")) return;
    try {
      await api.delete(`/coners/${id}`);
      loadForms();
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  };

  // Duplicate form - exact copy download
  const handleDuplicateForm = async (form, e) => {
    e.stopPropagation();
    const newName = prompt(`Duplicate ka naam:`, `Copy of ${form.name}`);
    if (!newName?.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://dashboard.iplanbymsl.in/api/coners/${form.id}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const blob = await response.blob();
      const ext = form.name.match(/\.([^.]+)$/)?.[1]?.toLowerCase();
      const fileName = newName.endsWith('.' + ext) ? newName : `${newName}.${ext}`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
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
        `https://dashboard.iplanbymsl.in/api/coners/${form.id}/download`,
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

  // Save changes
  const handleSaveChanges = async () => {
    if (!selectedForm) return;
    
    try {
      await api.put(`/coners/${selectedForm.id}/data`, {
        sheetData: sheetData
      });
      alert("Changes saved!");
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  // Export
  const handleExport = (type) => {
    if (type === "docx") {
      exportSheetToDocx(sheetData, selectedForm?.name || "form.docx");
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
              <select 
                style={css.btn("ghost")} 
                onChange={(e) => e.target.value && handleExport(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Export...</option>
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="docx">Word (.docx)</option>
              </select>
            </div>
          </div>

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
          <div style={{ flex: 1, overflow: "auto", padding: 20, background: "#F9FAFB" }}>
            {sheetData[0]?.[0] === "__html__" ? (
              <div 
                style={{ background: "#fff", padding: 20, borderRadius: 8 }}
                dangerouslySetInnerHTML={{ __html: sheetData[0][1] }}
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
    <div style={css.root}>
      <Sidebar />
      <main style={css.main}>
        {/* Header */}
        <div style={css.header}>
          <div>
            <h1 style={css.h1}>Conors</h1>
            <p style={css.subtitle}>Upload, edit and export conors (Excel, Word, PDF)</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={css.btn("ghost")} onClick={() => {
              if (selectedForm || forms.length > 0) {
                handleNewFromTemplate(selectedForm || forms[0], { stopPropagation: () => {} });
              } else {
                alert("Pehle ek template form select/upload karo");
              }
            }}>
              ✨ New Conor from Template
            </button>
            <button style={css.btn("primary")} onClick={() => fileInputRef.current?.click()}>
              <Icon d={icons.upload} /> Upload Conor
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
        <div style={css.toolbar}>
          <input
            placeholder="Search conors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...css.searchInput, maxWidth: 300 }}
          />
        </div>

        {/* Content with Folder Tree */}
        <div style={css.content}>
          {/* Folder Tree Sidebar */}
          <div style={css.folderTree}>
            <div style={css.folderTreeHeader}>
              <h3 style={css.folderTreeTitle}>Folders</h3>
              <button 
                style={{ ...css.iconBtn, width: 28, height: 28 }}
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
              >
                <Icon d={folderIcons.home} size={16} style={{ color: "#2563EB" }} />
                <span style={css.folderName}>All Forms</span>
              </div>

              {/* Folder Tree */}
              {buildFolderTree(null, 0).map(folder => (
                <div key={folder.id}>
                  <div 
                    style={css.folderItem(folder.level, currentFolderId === folder.id)}
                    onClick={() => setCurrentFolderId(folder.id)}
                  >
                    {folder.hasChildren && (
                      <span 
                        style={css.folderToggle}
                        onClick={(e) => { e.stopPropagation(); toggleFolder(folder.id); }}
                      >
                        <Icon d={expandedFolders.has(folder.id) ? folderIcons.chevronDown : folderIcons.chevronRight} size={14} />
                      </span>
                    )}
                    {!folder.hasChildren && <span style={{ width: 18 }} />}
                    <Icon d={expandedFolders.has(folder.id) ? folderIcons.folderOpen : folderIcons.folder} size={16} style={css.folderIcon} />
                    <span style={css.folderName}>{folder.name}</span>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                      <button
                        style={{ ...css.iconBtn, width: 24, height: 24, padding: 0 }}
                        onClick={(e) => { e.stopPropagation(); openRenameModal(folder); }}
                        title="Rename"
                      >
                        ✏️
                      </button>
                      <button
                        style={{ ...css.iconBtn, width: 24, height: 24, padding: 0 }}
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
                      >
                        <span style={{ width: 18 }} />
                        <Icon d={folderIcons.folder} size={16} style={css.folderIcon} />
                        <span style={css.folderName}>{child.name}</span>
                        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                          <button
                            style={{ ...css.iconBtn, width: 24, height: 24, padding: 0 }}
                            onClick={(e) => { e.stopPropagation(); openRenameModal(child); }}
                            title="Rename"
                          >
                            ✏️
                          </button>
                          <button
                            style={{ ...css.iconBtn, width: 24, height: 24, padding: 0 }}
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
            <div style={css.breadcrumb}>
              <span style={css.breadcrumbItem} onClick={() => setCurrentFolderId(null)}>All Forms</span>
              {getBreadcrumb().map((folder, idx) => (
                <span key={folder.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={css.breadcrumbSeparator}>/</span>
                  <span style={css.breadcrumbItem} onClick={() => setCurrentFolderId(folder.id)}>{folder.name}</span>
                </span>
              ))}
            </div>

            {/* Forms Grid */}
            {loading ? (
              <p>Loading...</p>
            ) : filteredForms.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#6B7280", background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB" }}>
                <Icon d={icons.file} size={48} />
                <p>No forms found. Upload your first form!</p>
                {currentFolderId && <p style={{ fontSize: 12 }}>in this folder</p>}
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
                  style={css.card(false)}
                  onClick={() => handleViewForm(form)}
                >
                  <div style={{ padding: 16, display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={css.cardIcon}>
                      <Icon d={icons.file} size={20} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {form.name}
                      </h3>
                      <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6B7280" }}>
                        {form.type?.toUpperCase() || "FILE"}
                      </p>
                      <p style={{ margin: "4px 0 0", fontSize: 11, color: "#9CA3AF" }}>
                        {new Date(form.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                      <button 
                        style={{ ...css.iconBtn, flexShrink: 0, border: "none", background: "transparent" }}
                        onClick={(e) => handleDuplicateForm(form, e)}
                        title="Duplicate (exact copy download)"
                      >
                        copy
                      </button>
                      <button 
                        style={{ ...css.iconBtn, flexShrink: 0 }}
                        onClick={(e) => { e.stopPropagation(); handleDeleteForm(form.id); }}
                        title="Delete"
                      >
                        <Icon d={icons.trash} size={16} />
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
          <div style={css.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18 }}>Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              style={{ ...css.input, marginBottom: 20 }}
              onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button style={css.btn("ghost")} onClick={() => setShowCreateFolder(false)}>
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
    </div>
  );
}
