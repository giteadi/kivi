import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import api from "../services/api";
import SpreadsheetGrid from "./SpreadsheetGrid";
import DocViewer, { isDocumentSheet } from "./DocViewer";

// ─── helpers ────────────────────────────────────────────────────────────────
const colLabel = (i) => {
  let label = "";
  let idx = i;
  do {
    label = String.fromCharCode(65 + (idx % 26)) + label;
    idx = Math.floor(idx / 26) - 1;
  } while (idx >= 0);
  return label;
};

const parseExcel = (buf) => {
  try {
    console.log('📊 PARSE: Starting Excel parse, buffer size:', buf.byteLength);
    const wb = XLSX.read(buf, {
      type: "array",
      cellStyles: true,
      cellNF: true,
      cellText: true
    });
    const sheets = {};

    const deepParseSheet = (ws) => {
      const data = [];
      if (!ws || !ws["!ref"]) return [[""]];

      const range = XLSX.utils.decode_range(ws["!ref"]);

      for (let R = 0; R <= range.e.r; R++) {
        const row = [];
        let hasData = false;

        for (let C = 0; C <= range.e.c; C++) {
          const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
          let val = "";

          if (cell) {
            val = cell.v ?? cell.w ?? cell.f ?? "";
            if (val !== "" && val !== null && val !== undefined) hasData = true;
          }

          row.push(val ? String(val) : "");
        }

        if (hasData) data.push(row);
      }

      return data.length ? data : [[""]];
    };

    wb.SheetNames.forEach((name) => {
      const ws = wb.Sheets[name];
      console.log(`📊 PARSE: Processing sheet "${name}"`);

      // Try normal parse first
      let rows = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        defval: "",
      });

      // If empty or all blank, use deep parse
      if (!rows.length || rows.every(r => r.every(c => c === ""))) {
        console.log("⚠️ Empty sheet detected, using deep parse:", name);
        rows = deepParseSheet(ws);
      }

      console.log(`📊 PARSE: Sheet "${name}" rows:`, rows.length);
      if (rows.length > 0) {
        console.log(`📊 PARSE: First row:`, rows[0]);
      }

      sheets[name] = rows.length ? rows : [[""]];
    });

    console.log('✅ PARSE: Complete, sheets:', Object.keys(sheets));
    return { ok: true, sheets, names: wb.SheetNames };
  } catch (e) {
    console.error("❌ PARSE ERROR:", e);
    return { ok: false, error: e.message };
  }
};

const emptySheet = () => Array.from({ length: 20 }, () => Array(10).fill(""));

// ─── icon set (inline SVG) ───────────────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  copy: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-4H8zM14 2v6h6",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  merge: "M8 6H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3M16 6h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3M12 2v20M9 9l3-3 3 3M9 15l3 3 3-3",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  x: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  report: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 17h.01M11 17l2-4 2 4M12 13v4",
  back: "M19 12H5M12 19l-7-7 7-7",
  addrow: "M3 12h18M3 6h18M3 18h18",
  addcol: "M12 3v18M6 3v18M18 3v18",
  folder: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  chart: "M18 20V10M12 20V4M6 20v-6",
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function TemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid"); // grid | list
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [clipboard, setClipboard] = useState(null);

  // panels
  const [panel, setPanel] = useState(null); // null | "view" | "edit" | "merge" | "report"
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [activeSheetIdx, setActiveSheetIdx] = useState(0);
  const [editSheets, setEditSheets] = useState({});
  const [editName, setEditName] = useState("");

  // report
  const [reportName, setReportName] = useState("");
  const [mergeTarget, setMergeTarget] = useState(null);
  const [docEditRaw, setDocEditRaw] = useState(false);

  const fileRef = useRef(null);

  // ── load from backend API ──
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    console.log('🔄 FETCH: Starting template fetch...');
    setLoading(true);
    setError(null);
    try {
      const response = await api.getTemplates();
      console.log('🔄 FETCH: API response:', { success: response.success, count: response.data?.length });
      
      if (response.success && response.data && response.data.length > 0) {
        // DEBUG: Log raw response
        const rawTemplateData = response.data[0]?.template_data;
        console.log('🔍 RAW template_data exists:', !!rawTemplateData);
        console.log('🔍 RAW template_data type:', typeof rawTemplateData);
        if (rawTemplateData) {
          console.log('🔍 RAW template_data preview:', JSON.stringify(rawTemplateData).substring(0, 500));
        }
        
        console.log('✅ FETCH: Found', response.data.length, 'templates');
        
        // Transform backend data to frontend format
        const transformed = response.data.map(t => {
          // Parse template_data if it's a string
          let parsedData = t.template_data;
          if (typeof t.template_data === 'string') {
            try {
              parsedData = JSON.parse(t.template_data);
            } catch (e) {
              console.error('❌ Failed to parse template_data string:', e);
              parsedData = {};
            }
          }
          
          // DEBUG: Check row_heights
          console.log('🔑 KEYS in template_data:', Object.keys(parsedData || {}));
          console.log('📏 row_heights:', parsedData?.row_heights);
          
          const sheets = parsedData?.sheets || {};
          const sheetNames = parsedData?.sheetNames || Object.keys(sheets);
          
          console.log(`📊 FETCH: Template ${t.id} (${t.name}):`, { sheetCount: sheetNames.length, sheetNames });
          
          // DEBUG: Check if sheets have data
          const firstSheet = Object.values(sheets)[0];
          if (firstSheet) {
            console.log(`📊 FETCH: Template ${t.id} first sheet rows:`, firstSheet.length);
            console.log(`📊 FETCH: Template ${t.id} first sheet sample (first 2 rows):`, firstSheet.slice(0, 2));
          } else {
            console.warn(`⚠️ FETCH: Template ${t.id} has NO sheet data!`);
          }
          
          return {
            id: t.id,
            name: t.name,
            type: t.type || 'import',
            desc: t.description || `${t.name} template`,
            sheets: sheets,
            sheetNames: sheetNames,
            rowHeights: parsedData?.row_heights || {},  // ← ADD
            createdAt: t.created_at || new Date().toISOString(),
          };
        });
        console.log('✅ FETCH: Transformed', transformed.length, 'templates');
        setTemplates(transformed);
      } else {
        console.log('ℹ️ FETCH: No templates found');
        setTemplates([]);
      }
    } catch (err) {
      console.error('❌ FETCH ERROR:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const persist = async (list) => {
    setTemplates(list);
  };

  // ── upload ──
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log('📤 UPLOAD: Starting file upload:', file.name);
    setLoading(true);
    
    try {
      // Use FormData to send file to backend Python parser
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('� UPLOAD: Sending to backend Python parser...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://dashboard.iplanbymsl.in/api'}/templates/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      });
      
      const result = await response.json();
      console.log('📤 UPLOAD: API response:', result);
      
      if (result.success) {
        console.log('✅ UPLOAD: Success, refreshing templates...');
        await fetchTemplates();
      } else {
        console.error('❌ UPLOAD: Failed:', result.message);
        alert("Failed to upload: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error('❌ UPLOAD ERROR:', err);
      alert("Error uploading template: " + err.message);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  // ── export ──
  const doExport = (tpl) => {
    const wb = XLSX.utils.book_new();
    (tpl.sheetNames || Object.keys(tpl.sheets)).forEach((n) => {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tpl.sheets[n] || [[""]]), n.substring(0, 31));
    });
    XLSX.writeFile(wb, `${tpl.name}.xlsx`);
  };

  // ── delete ──
  const deleteTpl = async (id) => {
    try {
      await api.deleteTemplate(id);
      await fetchTemplates();
    } catch (err) {
      console.error('Delete error:', err);
      alert("Failed to delete template");
    }
  };
  const bulkDelete = async () => {
    try {
      const ids = selected.map(s => s.id);
      await api.request('/templates/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids })
      });
      setSelected([]);
      await fetchTemplates();
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert("Failed to delete templates");
    }
  };

  // ── copy/paste ──
  const copyTpl = (t) => setClipboard(t);
  const pasteTpl = async () => {
    if (!clipboard) return;
    try {
      const templateData = {
        name: clipboard.name + " (Copy)",
        type: clipboard.type || 'import',
        description: clipboard.desc || 'Copied template',
        template_data: {
          sheets: clipboard.sheets,
          sheetNames: clipboard.sheetNames || Object.keys(clipboard.sheets)
        }
      };
      
      await api.createTemplate(templateData);
      await fetchTemplates();
    } catch (err) {
      console.error('Paste error:', err);
      alert("Failed to copy template");
    }
  };

  // ── open edit ──
  const openEdit = (tpl) => {
    console.log('✏️ EDIT: Opening template:', { id: tpl.id, name: tpl.name, sheets: Object.keys(tpl.sheets) });
    console.log('✏️ EDIT: Sheet data sample:', Object.values(tpl.sheets)[0]?.slice(0, 2));
    setActiveTemplate(tpl);
    setEditSheets(JSON.parse(JSON.stringify(tpl.sheets)));
    setEditName(tpl.name);
    setActiveSheetIdx(0);
    setPanel("edit");
  };

  // ── save edit ──
  const saveEdit = async () => {
    try {
      const updatedTemplate = {
        name: editName,
        type: activeTemplate.type,
        description: activeTemplate.desc,
        template_data: {
          sheets: editSheets,
          sheetNames: Object.keys(editSheets)
        }
      };
      
      await api.updateTemplate(activeTemplate.id, updatedTemplate);
      await fetchTemplates();
      setPanel(null);
    } catch (err) {
      console.error('Save error:', err);
      alert("Failed to save template changes");
    }
  };

  // ── open view ──
  const openView = (tpl) => {
    console.log('👁️ VIEW: Opening template:', { id: tpl.id, name: tpl.name, sheets: Object.keys(tpl.sheets) });
    console.log('👁️ VIEW: Sheet data sample:', Object.values(tpl.sheets)[0]?.slice(0, 2));
    setActiveTemplate(tpl);
    setActiveSheetIdx(0);
    setPanel("view");
  };

  // ── add sheet ──
  const addSheet = () => {
    const name = `Sheet${Object.keys(editSheets).length + 1}`;
    setEditSheets((s) => ({ ...s, [name]: emptySheet() }));
  };

  // ── add row/col ──
  const addRow = (sheetName) => setEditSheets((s) => ({ ...s, [sheetName]: [...s[sheetName], Array(Math.max(...s[sheetName].map(r => r?.length || 0), 1)).fill("")] }));
  const addCol = (sheetName) => setEditSheets((s) => ({ ...s, [sheetName]: s[sheetName].map((r) => [...r, ""]) }));
  const delRow = (sheetName) => setEditSheets((s) => {
    const rows = s[sheetName];
    return { ...s, [sheetName]: rows.length > 1 ? rows.slice(0, -1) : rows };
  });
  const delCol = (sheetName) => setEditSheets((s) => {
    const rows = s[sheetName];
    return { ...s, [sheetName]: rows.map((r) => r.length > 1 ? r.slice(0, -1) : r) };
  });

  // ── merge ──
  const openMerge = () => { setMergeTarget(null); setPanel("merge"); };
  const doMerge = async () => {
    if (!mergeTarget) return;
    try {
      const sources = selected.filter((t) => t.id !== mergeTarget.id);
      const merged = { ...mergeTarget.sheets };
      
      sources.forEach((t) => {
        Object.entries(t.sheets).forEach(([n, d]) => {
          if (merged[n]) {
            // Same sheet name exists - append with separator
            merged[n] = [
              ...merged[n],
              ["--- " + t.name + " ---"],
              ...d
            ];
          } else {
            // New sheet name
            merged[n] = d;
          }
        });
      });
      
      const templateData = {
        name: mergeTarget.name + " (Merged)",
        type: "import",
        description: `Merged from ${selected.length} templates`,
        template_data: { sheets: merged, sheetNames: Object.keys(merged) }
      };
      
      await api.createTemplate(templateData);
      setSelected([]);
      setPanel(null);
      await fetchTemplates();
    } catch (err) {
      console.error('Merge error:', err);
      alert("Failed to merge templates");
    }
  };

  // ── report ──
  const openReport = () => { setReportName(`Report_${new Date().toISOString().slice(0,10)}`); setPanel("report"); };
  const saveReport = async () => {
    try {
      const sheets = {};
      selected.forEach((t) => Object.entries(t.sheets).forEach(([n, d]) => { sheets[`${t.name}__${n}`] = d; }));
      const templateData = {
        name: reportName,
        type: "report",
        description: `From ${selected.length} template(s)`,
        template_data: { sheets, sheetNames: Object.keys(sheets) }
      };
      await api.createTemplate(templateData);
      setSelected([]);
      setPanel(null);
      await fetchTemplates();
    } catch (err) {
      console.error('Save report error:', err);
      alert("Failed to save report");
    }
  };
  const exportReport = () => {
    const sheets = {};
    selected.forEach((t) => Object.entries(t.sheets).forEach(([n, d]) => { sheets[`${t.name}__${n}`] = d; }));
    const wb = XLSX.utils.book_new();
    Object.entries(sheets).forEach(([n, d]) => XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(d), n.substring(0,31)));
    XLSX.writeFile(wb, `${reportName}.xlsx`);
  };

  const filtered = useMemo(() =>
    templates.filter((t) =>
      !search || t.name?.toLowerCase().includes(search.toLowerCase()) || t.type?.toLowerCase().includes(search.toLowerCase())
    ), [templates, search]);

  const toggleSel = (t) => setSelected((s) => s.find((x) => x.id === t.id) ? s.filter((x) => x.id !== t.id) : [...s, t]);

  // ── active sheet helpers ──
  const getSheetNames = (tpl, sheets) => (tpl?.sheetNames || Object.keys(sheets || {}));
  const editSheetNames = activeTemplate ? getSheetNames(activeTemplate, editSheets) : [];
  const viewSheetNames = activeTemplate ? getSheetNames(activeTemplate, activeTemplate.sheets) : [];
  const currentEditSheet = editSheetNames[activeSheetIdx] || editSheetNames[0];
  const currentViewSheet = viewSheetNames[activeSheetIdx] || viewSheetNames[0];

  // ─── STYLES ──────────────────────────────────────────────────────────────
  const css = {
    root: { fontFamily: "system-ui,-apple-system,sans-serif", minHeight: "100vh", background: "#F8F9FA", color: "#1a1a1a", display: "flex" },
    sidebar: { width: 240, background: "#fff", borderRight: "1px solid #E5E7EB", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 30 },
    sidebarHeader: { padding: "16px 20px", borderBottom: "1px solid #E5E7EB" },
    sidebarTitle: { fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: 8 },
    sidebarMenu: { flex: 1, padding: "12px 16px", overflowY: "auto" },
    sidebarItem: (active) => ({ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, cursor: "pointer", transition: "all 0.15s", background: active ? "#EFF6FF" : "transparent", color: active ? "#2563EB" : "#6B7280", fontWeight: active ? 600 : 500, fontSize: 14, marginBottom: 4 }),
    sidebarFooter: { padding: "16px 20px", borderTop: "1px solid #E5E7EB", fontSize: 12, color: "#9CA3AF" },
    main: { marginLeft: 240, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" },
    header: { background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, position: "sticky", top: 0, zIndex: 20 },
    headerLeft: { display: "flex", flexDirection: "column", gap: 2 },
    h1: { margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px" },
    subtitle: { margin: 0, fontSize: 13, color: "#6B7280" },
    headerRight: { display: "flex", alignItems: "center", gap: 8 },
    btn: (variant = "default") => ({
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
      border: "1px solid",
      cursor: "pointer", transition: "all 0.15s",
      ...(variant === "primary" ? { background: "#2563EB", color: "#fff", borderColor: "#2563EB" } :
          variant === "green"   ? { background: "#059669", color: "#fff", borderColor: "#059669" } :
          variant === "purple"  ? { background: "#7C3AED", color: "#fff", borderColor: "#7C3AED" } :
          variant === "orange"  ? { background: "#EA580C", color: "#fff", borderColor: "#EA580C" } :
          variant === "red"     ? { background: "#DC2626", color: "#fff", borderColor: "#DC2626" } :
          variant === "ghost"   ? { background: "transparent", color: "#374151", borderColor: "#D1D5DB" } :
                                  { background: "#fff", color: "#374151", borderColor: "#D1D5DB" }),
    }),
    iconBtn: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 6, border: "1px solid #E5E7EB", background: "transparent", cursor: "pointer", color: "#6B7280", transition: "all 0.15s" },
    toolbar: { background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
    searchWrap: { position: "relative", flex: 1, maxWidth: 320 },
    searchInput: { width: "100%", padding: "7px 12px 7px 36px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
    searchIcon: { position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" },
    selBar: { background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", margin: "8px 24px 0" },
    content: { padding: 24 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 },
    card: (selected) => ({
      background: "#fff", borderRadius: 12, border: selected ? "2px solid #3B82F6" : "1px solid #E5E7EB",
      boxShadow: selected ? "0 0 0 3px rgba(59,130,246,0.1)" : "0 1px 3px rgba(0,0,0,0.06)",
      overflow: "hidden", cursor: "pointer", transition: "all 0.15s",
    }),
    cardHeader: { padding: "14px 16px 10px", display: "flex", alignItems: "flex-start", gap: 12 },
    cardIcon: { width: 38, height: 38, background: "#EFF6FF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#2563EB" },
    cardTitle: { fontSize: 14, fontWeight: 600, margin: "0 0 2px", lineHeight: 1.3 },
    cardType: { fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px" },
    cardDesc: { fontSize: 12, color: "#6B7280", padding: "0 16px 10px", lineHeight: 1.5 },
    cardActions: { borderTop: "1px solid #F3F4F6", padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th: { padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" },
    td: { padding: "11px 14px", borderBottom: "1px solid #F3F4F6", verticalAlign: "middle" },
    empty: { textAlign: "center", padding: "60px 20px", color: "#9CA3AF" },
    // Panel overlay
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40, display: "flex", alignItems: "stretch", justifyContent: "stretch" },
    panel: { position: "fixed", inset: 0, background: "#fff", zIndex: 50, display: "flex", flexDirection: "column" },
    panelHeader: { background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 },
    sheetTabs: { background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", padding: "6px 16px", display: "flex", alignItems: "center", gap: 6, overflowX: "auto", flexShrink: 0 },
    tab: (active) => ({ padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid", background: active ? "#2563EB" : "#fff", color: active ? "#fff" : "#374151", borderColor: active ? "#2563EB" : "#D1D5DB", whiteSpace: "nowrap", flexShrink: 0 }),
    gridToolbar: { background: "#F8F9FA", borderBottom: "1px solid #E5E7EB", padding: "6px 16px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 },
    modal: { background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 28, maxWidth: 520, width: "90%", margin: "auto", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
    input: { width: "100%", padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
    badge: (color) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 500, background: color === "green" ? "#D1FAE5" : color === "blue" ? "#DBEAFE" : "#F3F4F6", color: color === "green" ? "#065F46" : color === "blue" ? "#1D4ED8" : "#6B7280" }),
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={css.root}>
      {/* SIDEBAR */}
      <div style={css.sidebar}>
        <div style={css.sidebarHeader}>
          <h2 style={css.sidebarTitle}>
            <Icon d={icons.folder} size={24} stroke="#2563EB" /> Templates
          </h2>
        </div>
        <div style={css.sidebarMenu}>
          <div style={css.sidebarItem(true)}>
            <Icon d={icons.home} size={18} /> All Templates
          </div>
          <div style={css.sidebarItem(false)}>
            <Icon d={icons.file} size={18} /> Imported
          </div>
          <div style={css.sidebarItem(false)}>
            <Icon d={icons.report} size={18} /> Reports
          </div>
          <div style={css.sidebarItem(false)}>
            <Icon d={icons.tag} size={18} /> Tags
          </div>
          <div style={{ marginTop: 20, marginBottom: 12, fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px", paddingLeft: 12 }}>
            Quick Stats
          </div>
          <div style={{ padding: "0 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B7280", marginBottom: 8 }}>
              <span>Total</span>
              <span style={{ fontWeight: 600, color: "#111" }}>{templates.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B7280", marginBottom: 8 }}>
              <span>Imported</span>
              <span style={{ fontWeight: 600, color: "#111" }}>{templates.filter(t => t.type === "import").length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B7280" }}>
              <span>Reports</span>
              <span style={{ fontWeight: 600, color: "#111" }}>{templates.filter(t => t.type === "report").length}</span>
            </div>
          </div>
        </div>
        <div style={css.sidebarFooter}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon d={icons.chart} size={16} /> Excel Manager v2.0
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={css.main}>
        {/* HEADER */}
        <div style={css.header}>
        <div style={css.headerLeft}>
          <h1 style={css.h1}>📊 Template Manager</h1>
          <p style={css.subtitle}>
            {loading ? "Loading..." : `${templates.length} template${templates.length !== 1 ? "s" : ""} • Excel-like editing`}
            {error && <span style={{ color: "#DC2626", marginLeft: 8 }}>⚠️ {error}</span>}
          </p>
        </div>
        <div style={css.headerRight}>
          {loading && <span style={{ color: "#6B7280", fontSize: 13 }}>⏳ Loading...</span>}
          {clipboard && (
            <button style={css.btn("green")} onClick={pasteTpl}>
              <Icon d={icons.copy} size={14} /> Paste Copy
            </button>
          )}
          {selected.length >= 1 && (
            <button style={css.btn("orange")} onClick={openReport}>
              <Icon d={icons.report} size={14} /> Report ({selected.length})
            </button>
          )}
          {selected.length >= 2 && (
            <button style={css.btn("purple")} onClick={openMerge}>
              <Icon d={icons.merge} size={14} /> Merge
            </button>
          )}
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleUpload} style={{ display: "none" }} />
          <button style={css.btn("primary")} onClick={() => fileRef.current?.click()}>
            <Icon d={icons.upload} size={14} /> Upload Excel
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div style={css.toolbar}>
        <div style={css.searchWrap}>
          <span style={css.searchIcon}><Icon d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={15} /></span>
          <input style={css.searchInput} placeholder="Search templates…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <button style={{ ...css.iconBtn, background: view === "grid" ? "#EFF6FF" : "transparent", color: view === "grid" ? "#2563EB" : "#6B7280", borderColor: view === "grid" ? "#BFDBFE" : "#E5E7EB" }} onClick={() => setView("grid")}>
            <Icon d={icons.grid} size={16} />
          </button>
          <button style={{ ...css.iconBtn, background: view === "list" ? "#EFF6FF" : "transparent", color: view === "list" ? "#2563EB" : "#6B7280", borderColor: view === "list" ? "#BFDBFE" : "#E5E7EB" }} onClick={() => setView("list")}>
            <Icon d={icons.list} size={16} />
          </button>
        </div>
      </div>

      {/* SELECTION BAR */}
      {selected.length > 0 && (
        <div style={css.selBar}>
          <span style={{ fontSize: 13, color: "#1D4ED8", fontWeight: 500 }}>{selected.length} selected</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...css.btn("red"), padding: "5px 12px", fontSize: 12 }} onClick={bulkDelete}>
              <Icon d={icons.trash} size={12} /> Delete
            </button>
            <button style={{ ...css.btn("ghost"), padding: "5px 12px", fontSize: 12 }} onClick={() => setSelected([])}>Clear</button>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div style={css.content}>
        {filtered.length === 0 ? (
          <div style={css.empty}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
            <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>No templates yet</p>
            <p style={{ fontSize: 13, marginBottom: 20 }}>Upload an Excel file to get started</p>
            <button style={css.btn("primary")} onClick={() => fileRef.current?.click()}>
              <Icon d={icons.upload} size={14} /> Upload Excel
            </button>
          </div>
        ) : view === "grid" ? (
          <div style={css.grid}>
            {filtered.map((t) => {
              const isSel = !!selected.find((s) => s.id === t.id);
              return (
                <div key={t.id} style={css.card(isSel)} onClick={() => toggleSel(t)}>
                  <div style={css.cardHeader}>
                    <div style={css.cardIcon}><Icon d={icons.file} size={20} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={css.cardTitle}>{t.name}</p>
                      <span style={css.badge(t.type === "report" ? "green" : "blue")}>{t.type}</span>
                    </div>
                    <input type="checkbox" checked={isSel} onChange={() => {}} style={{ width: 16, height: 16, accentColor: "#2563EB" }} />
                  </div>
                  <p style={css.cardDesc}>{t.desc || "No description"}</p>
                  <div style={css.cardActions}>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[
                        { icon: icons.eye, title: "View", action: (e) => { e.stopPropagation(); openView(t); }, color: "#2563EB" },
                        { icon: icons.edit, title: "Edit", action: (e) => { e.stopPropagation(); openEdit(t); }, color: "#059669" },
                        { icon: icons.copy, title: "Copy", action: (e) => { e.stopPropagation(); copyTpl(t); }, color: "#7C3AED" },
                        { icon: icons.download, title: "Export", action: (e) => { e.stopPropagation(); doExport(t); }, color: "#EA580C" },
                      ].map(({ icon, title, action, color }) => (
                        <button key={title} title={title} onClick={action} style={{ ...css.iconBtn, width: 28, height: 28 }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = color; e.currentTarget.style.background = "#F9FAFB"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "#6B7280"; e.currentTarget.style.background = "transparent"; }}>
                          <Icon d={icon} size={14} />
                        </button>
                      ))}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteTpl(t.id); }} style={{ ...css.iconBtn, width: 28, height: 28 }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#DC2626"; e.currentTarget.style.background = "#FEF2F2"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#6B7280"; e.currentTarget.style.background = "transparent"; }}>
                      <Icon d={icons.trash} size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
            <table style={css.table}>
              <thead>
                <tr>
                  <th style={{ ...css.th, width: 40 }}>
                    <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0}
                      onChange={(e) => setSelected(e.target.checked ? [...filtered] : [])}
                      style={{ accentColor: "#2563EB" }} />
                  </th>
                  <th style={css.th}>Name</th>
                  <th style={css.th}>Type</th>
                  <th style={css.th}>Sheets</th>
                  <th style={css.th}>Created</th>
                  <th style={{ ...css.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const isSel = !!selected.find((s) => s.id === t.id);
                  return (
                    <tr key={t.id} style={{ background: isSel ? "#EFF6FF" : "transparent", cursor: "pointer" }} onClick={() => toggleSel(t)}>
                      <td style={css.td}><input type="checkbox" checked={isSel} onChange={() => {}} style={{ accentColor: "#2563EB" }} /></td>
                      <td style={css.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ ...css.cardIcon, width: 30, height: 30 }}><Icon d={icons.file} size={15} /></div>
                          <span style={{ fontWeight: 500 }}>{t.name}</span>
                        </div>
                      </td>
                      <td style={css.td}><span style={css.badge(t.type === "report" ? "green" : "blue")}>{t.type}</span></td>
                      <td style={{ ...css.td, color: "#6B7280", fontSize: 12 }}>{(t.sheetNames || Object.keys(t.sheets)).length} sheet(s)</td>
                      <td style={{ ...css.td, color: "#6B7280", fontSize: 12 }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td style={css.td}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                          {[
                            { icon: icons.eye, title: "View", fn: (e) => { e.stopPropagation(); openView(t); } },
                            { icon: icons.edit, title: "Edit", fn: (e) => { e.stopPropagation(); openEdit(t); } },
                            { icon: icons.copy, title: "Copy", fn: (e) => { e.stopPropagation(); copyTpl(t); } },
                            { icon: icons.download, title: "Export", fn: (e) => { e.stopPropagation(); doExport(t); } },
                            { icon: icons.trash, title: "Delete", fn: (e) => { e.stopPropagation(); deleteTpl(t.id); } },
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

      {/* ═══════════════════════════════════════════════════════════
          VIEW PANEL — full screen read-only spreadsheet
      ═══════════════════════════════════════════════════════════ */}
      {panel === "view" && activeTemplate && (
        <div style={css.panel}>
          <div style={css.panelHeader}>
            <button style={{ ...css.btn("ghost"), gap: 6 }} onClick={() => setPanel(null)}>
              <Icon d={icons.back} size={15} /> Back
            </button>
            <span style={{ width: 1, height: 24, background: "#E5E7EB" }} />
            <Icon d={icons.file} size={18} style={{ color: "#2563EB" }} />
            <span style={{ fontWeight: 600, fontSize: 16 }}>{activeTemplate.name}</span>
            <span style={{ ...css.badge("blue"), marginLeft: 4 }}>{activeTemplate.type}</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button style={css.btn("ghost")} onClick={() => doExport(activeTemplate)}>
                <Icon d={icons.download} size={14} /> Export
              </button>
              <button style={css.btn("primary")} onClick={() => { setPanel(null); openEdit(activeTemplate); }}>
                <Icon d={icons.edit} size={14} /> Edit
              </button>
            </div>
          </div>
          <div style={css.sheetTabs}>
            {viewSheetNames.map((name, i) => (
              <button key={name} style={css.tab(i === activeSheetIdx)} onClick={() => setActiveSheetIdx(i)}>{name}</button>
            ))}
          </div>
          <div style={{ padding: "6px 16px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", fontSize: 12, color: "#6B7280", flexShrink: 0, display: "flex", alignItems: "center", gap: 12 }}>
            <span>
              <strong style={{ color: "#111" }}>{currentViewSheet}</strong>
              {" • "}
              {activeTemplate.sheets[currentViewSheet]?.length || 0} rows
              {" × "}
              {Math.max(...(activeTemplate.sheets[currentViewSheet] || [[""]]).map(r => r?.length || 0), 1)} cols
            </span>
            {/* Show mode badge */}
            {isDocumentSheet(activeTemplate.sheets[currentViewSheet]) ? (
              <span style={{
                background: "#EFF6FF", color: "#2563EB",
                fontSize: 11, fontWeight: 600, padding: "2px 8px",
                borderRadius: 10, border: "1px solid #BFDBFE"
              }}>
                📄 Document View
              </span>
            ) : (
              <span style={{
                background: "#F0FDF4", color: "#059669",
                fontSize: 11, fontWeight: 600, padding: "2px 8px",
                borderRadius: 10, border: "1px solid #BBF7D0"
              }}>
                📊 Spreadsheet View
              </span>
            )}
          </div>
          {/* Content: DocViewer for document sheets, SpreadsheetGrid for data sheets */}
          {isDocumentSheet(activeTemplate.sheets[currentViewSheet])
            ? (
              <DocViewer data={activeTemplate.sheets[currentViewSheet] || [[]]} />
            )
            : (
              <SpreadsheetGrid
                data={activeTemplate.sheets[currentViewSheet] || [[""]]}
                rowHeights={activeTemplate.rowHeights?.[currentViewSheet] || {}}
                readOnly
              />
            )
          }
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          EDIT PANEL — full screen editable spreadsheet
      ═══════════════════════════════════════════════════════════ */}
      {panel === "edit" && activeTemplate && (
        <div style={css.panel}>
          <div style={css.panelHeader}>
            <button style={{ ...css.btn("ghost"), gap: 6 }} onClick={() => setPanel(null)}>
              <Icon d={icons.back} size={15} /> Back
            </button>
            <span style={{ width: 1, height: 24, background: "#E5E7EB" }} />
            <input value={editName} onChange={(e) => setEditName(e.target.value)}
              style={{ border: "none", outline: "none", fontWeight: 600, fontSize: 16, background: "transparent", fontFamily: "inherit", color: "#111" }} />
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button style={css.btn("ghost")} onClick={() => setPanel(null)}>Cancel</button>
              <button style={css.btn("primary")} onClick={saveEdit}>
                <Icon d={icons.save} size={14} /> Save
              </button>
            </div>
          </div>

          {/* Sheet tabs */}
          <div style={css.sheetTabs}>
            {editSheetNames.map((name, i) => (
              <button key={name} style={css.tab(i === activeSheetIdx)} onClick={() => setActiveSheetIdx(i)}>{name}</button>
            ))}
            <button style={{ ...css.tab(false), borderStyle: "dashed" }} onClick={addSheet}>
              <Icon d={icons.plus} size={12} /> Sheet
            </button>
          </div>

          {/* Grid toolbar */}
          <div style={css.gridToolbar}>
            <span style={{ fontSize: 12, color: "#6B7280", marginRight: 8 }}>
              <b style={{ color: "#111" }}>{currentEditSheet}</b> • {editSheets[currentEditSheet]?.length || 0}R × {Math.max(...(editSheets[currentEditSheet] || [[""]]).map(r => r?.length || 0), 1)}C
            </span>
            <span style={{ width: 1, height: 18, background: "#E5E7EB", margin: "0 4px" }} />
            {[
              { label: "+ Row", fn: () => addRow(currentEditSheet) },
              { label: "- Row", fn: () => delRow(currentEditSheet) },
              { label: "+ Col", fn: () => addCol(currentEditSheet) },
              { label: "- Col", fn: () => delCol(currentEditSheet) },
            ].map(({ label, fn }) => (
              <button key={label} style={{ ...css.btn("ghost"), padding: "4px 10px", fontSize: 12, gap: 4 }} onClick={fn}>{label}</button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#9CA3AF" }}>Double-click cell to edit • Arrow keys to navigate • Enter/F2 to edit</span>
          </div>

          {isDocumentSheet(editSheets[currentEditSheet])
            ? (
              // Document sheets: show DocViewer (editing embedded DOCX content is complex,
              // show a message + raw grid toggle)
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{
                  background: "#FFFBEB",
                  borderBottom: "1px solid #FDE68A",
                  padding: "8px 16px",
                  fontSize: 12,
                  color: "#92400E",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}>
                  ⚠️ This sheet contains a formatted document (embedded Word content).
                  Preview below — use the raw grid to edit individual cells.
                  <button
                    onClick={() => setDocEditRaw(v => !v)}
                    style={{ marginLeft: "auto", fontSize: 11, padding: "3px 10px",
                      borderRadius: 6, border: "1px solid #D97706", background: "#FEF3C7",
                      color: "#92400E", cursor: "pointer" }}
                  >
                    {docEditRaw ? "📄 Document View" : "📊 Raw Grid"}
                  </button>
                </div>
                {docEditRaw
                  ? (
                    <SpreadsheetGrid
                      data={editSheets[currentEditSheet] || [[""]]}
                      rowHeights={activeTemplate.rowHeights?.[currentEditSheet] || {}}
                      onDataChange={(next) => setEditSheets((s) => ({ ...s, [currentEditSheet]: next }))}
                    />
                  )
                  : (
                    <DocViewer data={editSheets[currentEditSheet] || [[]]} />
                  )
                }
              </div>
            )
            : (
              <SpreadsheetGrid
                data={editSheets[currentEditSheet] || [[""]]}
                rowHeights={activeTemplate.rowHeights?.[currentEditSheet] || {}}
                onDataChange={(next) => setEditSheets((s) => ({ ...s, [currentEditSheet]: next }))}
              />
            )
          }
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MERGE MODAL
      ═══════════════════════════════════════════════════════════ */}
      {panel === "merge" && (
        <div style={{ ...css.overlay, alignItems: "center", justifyContent: "center" }}>
          <div style={css.modal}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Merge Templates</h2>
              <button style={css.iconBtn} onClick={() => setPanel(null)}><Icon d={icons.x} size={16} /></button>
            </div>
            <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>Select the target template to merge all others into:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {selected.map((t) => (
                <div key={t.id} onClick={() => setMergeTarget(t)}
                  style={{ padding: "12px 16px", borderRadius: 10, border: `2px solid ${mergeTarget?.id === t.id ? "#3B82F6" : "#E5E7EB"}`, background: mergeTarget?.id === t.id ? "#EFF6FF" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon d={icons.file} size={18} style={{ color: "#6B7280" }} />
                  <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{t.name}</span>
                  {mergeTarget?.id === t.id && <Icon d={icons.check} size={16} stroke="#2563EB" />}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button style={css.btn("ghost")} onClick={() => setPanel(null)}>Cancel</button>
              <button style={{ ...css.btn("purple"), opacity: mergeTarget ? 1 : 0.5 }} disabled={!mergeTarget} onClick={doMerge}>
                <Icon d={icons.merge} size={14} /> Merge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          REPORT MODAL
      ═══════════════════════════════════════════════════════════ */}
      {panel === "report" && (
        <div style={{ ...css.overlay, alignItems: "center", justifyContent: "center" }}>
          <div style={css.modal}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Create Report</h2>
              <button style={css.iconBtn} onClick={() => setPanel(null)}><Icon d={icons.x} size={16} /></button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Report Name</label>
              <input style={css.input} value={reportName} onChange={(e) => setReportName(e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Templates included ({selected.length}):</p>
              <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 14px", maxHeight: 140, overflowY: "auto" }}>
                {selected.map((t) => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13 }}>
                    <Icon d={icons.file} size={14} stroke="#9CA3AF" /> {t.name}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Sheets ({selected.reduce((n, t) => n + Object.keys(t.sheets).length, 0)}):</p>
              <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 14px", maxHeight: 120, overflowY: "auto" }}>
                {selected.flatMap((t) => Object.keys(t.sheets).map((n) => `${t.name} → ${n}`)).map((name) => (
                  <div key={name} style={{ fontSize: 12, color: "#6B7280", padding: "2px 0" }}>• {name}</div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button style={css.btn("ghost")} onClick={() => setPanel(null)}>Cancel</button>
              <button style={css.btn("green")} onClick={exportReport}>
                <Icon d={icons.download} size={14} /> Export XLSX
              </button>
              <button style={css.btn("orange")} onClick={saveReport}>
                <Icon d={icons.save} size={14} /> Save Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}