// TemplateManager.jsx — COMPLETE UPDATED VERSION
// Key changes vs previous:
//  1. Uses ReportSheetViewer instead of SpreadsheetGrid for all sheets
//  2. "Create Report" workflow: copy sheet → edit patient data → save
//  3. Row heights auto-size to content (no fixed-height cells)
//  4. Report panel: full editable session with patient name input

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import api from "../services/api";
import ReportSheetViewer from "./ReportSheetViewer";
import Sidebar from "./Sidebar";

// ─── helpers ──────────────────────────────────────────────────────────────────
const emptySheet = () => Array.from({ length: 20 }, () => Array(10).fill(""));

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
  copy:     "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-4H8zM14 2v6h6",
  edit:     "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  save:     "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  x:        "M18 6L6 18M6 6l12 12",
  check:    "M20 6L9 17l-5-5",
  file:     "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  report:   "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 17h.01M11 17l2-4 2 4M12 13v4",
  back:     "M19 12H5M12 19l-7-7 7-7",
  grid:     "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  list:     "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  folder:   "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
  newrep:   "M12 5v14M5 12h14",  // plus icon for new report
  merge:    "M8 6H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3M16 6h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3M12 2v20M9 9l3-3 3 3M9 15l3 3 3-3",
  tag:      "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  home:     "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  chart:    "M18 20V10M12 20V4M6 20v-6",
  patient:  "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = {
  root:         { fontFamily: "system-ui,-apple-system,sans-serif", minHeight: "100vh", background: "#F3F4F6", color: "#1a1a1a", display: "flex" },
  main:         { flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "auto", marginLeft: 256 },
  header:       { background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, position: "sticky", top: 0, zIndex: 20 },
  h1:           { margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: "-0.3px" },
  subtitle:     { margin: 0, fontSize: 12, color: "#6B7280" },
  btn:          (v = "default") => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
    border: "1px solid", cursor: "pointer", transition: "all 0.15s",
    ...(v === "primary"  ? { background: "#2563EB", color: "#fff",    borderColor: "#2563EB" }   :
        v === "green"    ? { background: "#059669", color: "#fff",    borderColor: "#059669" }   :
        v === "purple"   ? { background: "#7C3AED", color: "#fff",    borderColor: "#7C3AED" }   :
        v === "orange"   ? { background: "#EA580C", color: "#fff",    borderColor: "#EA580C" }   :
        v === "red"      ? { background: "#DC2626", color: "#fff",    borderColor: "#DC2626" }   :
        v === "ghost"    ? { background: "transparent", color: "#374151", borderColor: "#D1D5DB" } :
                           { background: "#fff", color: "#374151", borderColor: "#D1D5DB" }),
  }),
  iconBtn: { display:"inline-flex", alignItems:"center", justifyContent:"center", width:30, height:30, borderRadius:6, border:"1px solid #E5E7EB", background:"transparent", cursor:"pointer", color:"#6B7280" },
  toolbar: { background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  searchInput: { width: "100%", padding: "7px 12px 7px 36px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" },
  content: { padding: 24 },
  card: (sel) => ({ background:"#fff", borderRadius:12, border: sel ? "2px solid #3B82F6":"1px solid #E5E7EB", boxShadow: sel?"0 0 0 3px rgba(59,130,246,0.1)":"0 1px 3px rgba(0,0,0,0.06)", overflow:"hidden", cursor:"pointer", transition:"all 0.15s" }),
  cardIcon: { width:36, height:36, background:"#EFF6FF", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"#2563EB" },
  panel: { position:"fixed", inset:0, background:"#fff", zIndex:50, display:"flex", flexDirection:"column" },
  panelHeader: { background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"10px 16px", display:"flex", alignItems:"center", gap:10, flexShrink:0 },
  sheetTabs: { background:"#F1F5F9", borderBottom:"1px solid #E5E7EB", padding:"6px 14px", display:"flex", alignItems:"center", gap:6, overflowX:"auto", flexShrink:0 },
  tab: (a) => ({ padding:"5px 14px", borderRadius:6, fontSize:12, fontWeight:500, cursor:"pointer", border:"1px solid", background: a?"#2563EB":"#fff", color: a?"#fff":"#374151", borderColor: a?"#2563EB":"#D1D5DB", whiteSpace:"nowrap", flexShrink:0 }),
  modal: { background:"#fff", borderRadius:14, border:"1px solid #E5E7EB", padding:28, maxWidth:500, width:"90%", margin:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" },
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:40, display:"flex", alignItems:"center", justifyContent:"center" },
  input: { width:"100%", padding:"9px 12px", border:"1px solid #D1D5DB", borderRadius:8, fontSize:14, outline:"none", boxSizing:"border-box" },
  badge: (c) => ({ display:"inline-block", padding:"2px 8px", borderRadius:12, fontSize:11, fontWeight:500, background: c==="green"?"#D1FAE5":c==="blue"?"#DBEAFE":c==="orange"?"#FEF3C7":"#F3F4F6", color: c==="green"?"#065F46":c==="blue"?"#1D4ED8":c==="orange"?"#92400E":"#6B7280" }),
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function TemplateManager() {
  // ── state ──
  const [templates, setTemplates]     = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [view, setView]               = useState("grid");
  const [search, setSearch]           = useState("");
  const [selected, setSelected]       = useState([]);

  // panels
  const [panel, setPanel]             = useState(null); // null | "view" | "createReport" | "editReport"
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [activeSheetIdx, setActiveSheetIdx] = useState(0);

  // report creation state
  const [reportPanel, setReportPanel] = useState(null); // null | { template, sheetIdx, patientName, data, sheetName }
  const [patientName, setPatientName] = useState("");
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newReportTemplate, setNewReportTemplate] = useState(null);
  const [newReportSheetIdx, setNewReportSheetIdx] = useState(0);

  const fileRef = useRef(null);

  // ── fetch templates ──
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
            sheets,
            sheetNames,
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

  // ── upload ──
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

  // ── export ──
  const doExport = (tpl) => {
    const wb = XLSX.utils.book_new();
    (tpl.sheetNames || Object.keys(tpl.sheets)).forEach(n => {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tpl.sheets[n] || [[""]]), n.substring(0, 31));
    });
    XLSX.writeFile(wb, `${tpl.name}.xlsx`);
  };

  // ── delete ──
  const deleteTpl = async (id) => {
    if (!confirm("Delete this template?")) return;
    try { await api.deleteTemplate(id); await fetchTemplates(); }
    catch { alert("Failed to delete"); }
  };

  // ── open view ──
  const openView = (tpl) => {
    setActiveTemplate(tpl);
    setActiveSheetIdx(0);
    setPanel("view");
  };

  // ── open create report modal ──
  const openCreateReport = (tpl, sheetIdx = 0) => {
    setNewReportTemplate(tpl);
    setNewReportSheetIdx(sheetIdx);
    setPatientName("");
    setShowNewReportModal(true);
  };

  // ── start report editing ──
  const startReportEdit = () => {
    if (!newReportTemplate) return;
    const sheetName = newReportTemplate.sheetNames[newReportSheetIdx];
    const sourceData = newReportTemplate.sheets[sheetName];
    // Deep copy data
    const dataCopy = sourceData.map(r => [...r]);

    setReportPanel({
      templateName: newReportTemplate.name,
      sheetName,
      allSheets:    newReportTemplate.sheetNames,
      allData:      Object.fromEntries(
        newReportTemplate.sheetNames.map(n => [n, newReportTemplate.sheets[n].map(r => [...r])])
      ),
      activeSheet:  sheetName,
      patientName:  patientName,
    });
    setShowNewReportModal(false);
    setPanel("report");
  };

  // ── save report ──
  const saveReport = async (allData, activePatientName) => {
    try {
      const name = `${activePatientName || "Patient"} — ${reportPanel.templateName} — ${new Date().toLocaleDateString("en-IN")}`;
      const templateData = {
        name,
        type: "report",
        description: `Patient report for ${activePatientName}`,
        template_data: {
          sheets:     allData,
          sheetNames: Object.keys(allData),
        }
      };
      await api.createTemplate(templateData);
      await fetchTemplates();
      setPanel(null);
      setReportPanel(null);
      alert(`✅ Report "${name}" saved successfully!`);
    } catch (err) { alert("Save failed: " + err.message); }
  };

  const filtered = useMemo(() =>
    templates.filter(t => !search || t.name?.toLowerCase().includes(search.toLowerCase())),
    [templates, search]
  );

  const toggleSel = (t) => setSelected(s => s.find(x => x.id === t.id) ? s.filter(x => x.id !== t.id) : [...s, t]);

  // ── active sheet helpers ──
  const viewSheetNames  = activeTemplate ? activeTemplate.sheetNames : [];
  const currentViewSheet = viewSheetNames[activeSheetIdx] || viewSheetNames[0];

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={css.root}>
      {/* ══ WHITE SIDEBAR ══ */}
      <Sidebar 
        activeItem="template-manager" 
        setActiveItem={() => {}}
        sidebarCollapsed={false}
        setSidebarCollapsed={() => {}}
      />

      {/* ══ MAIN ══ */}
      <div style={css.main}>
        {/* Header */}
        <div style={css.header}>
          <div>
            <h1 style={css.h1}>📊 Template Manager</h1>
            <p style={css.subtitle}>
              {loading ? "Loading…" : `${templates.length} templates`}
              {error && <span style={{ color:"#DC2626", marginLeft:8 }}>⚠️ {error}</span>}
            </p>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {loading && <span style={{ fontSize:12, color:"#6B7280" }}>⏳</span>}
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleUpload} style={{ display:"none" }} />
            <button style={css.btn("primary")} onClick={() => fileRef.current?.click()}>
              <Icon d={icons.upload} size={14} /> Upload Excel
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={css.toolbar}>
          <div style={{ position:"relative", flex:1, maxWidth:320 }}>
            <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#9CA3AF" }}>
              <Icon d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={15} />
            </span>
            <input style={css.searchInput} placeholder="Search templates…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:4 }}>
            {[{ v:"grid", d:icons.grid }, { v:"list", d:icons.list }].map(({ v, d }) => (
              <button key={v} onClick={() => setView(v)} style={{ ...css.iconBtn, background: view===v?"#EFF6FF":"transparent", color: view===v?"#2563EB":"#6B7280", borderColor: view===v?"#BFDBFE":"#E5E7EB" }}>
                <Icon d={d} size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={css.content}>
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px", color:"#9CA3AF" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📂</div>
              <p style={{ fontSize:16, fontWeight:500, marginBottom:4 }}>No templates yet</p>
              <p style={{ fontSize:13, marginBottom:20 }}>Upload an Excel assessment template to get started</p>
              <button style={css.btn("primary")} onClick={() => fileRef.current?.click()}>
                <Icon d={icons.upload} size={14} /> Upload Excel
              </button>
            </div>
          ) : view === "grid" ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:16 }}>
              {filtered.map(t => {
                const isSel = !!selected.find(s => s.id === t.id);
                return (
                  <div key={t.id} style={css.card(isSel)} onClick={() => toggleSel(t)}>
                    <div style={{ padding:"14px 16px 10px", display:"flex", alignItems:"flex-start", gap:12 }}>
                      <div style={css.cardIcon}><Icon d={icons.file} size={20} /></div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:14, fontWeight:600, margin:"0 0 4px", lineHeight:1.3 }}>{t.name}</p>
                        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                          <span style={css.badge(t.type==="report"?"green":"blue")}>{t.type}</span>
                          <span style={css.badge("default")}>{(t.sheetNames||[]).length} sheets</span>
                        </div>
                      </div>
                      <input type="checkbox" checked={isSel} onChange={() => {}} style={{ accentColor:"#2563EB", width:15, height:15 }} />
                    </div>

                    {/* Action buttons */}
                    <div style={{ borderTop:"1px solid #F3F4F6", padding:"8px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", gap:4 }}>
                        {[
                          { icon:icons.eye,      title:"View",       fn:(e) => { e.stopPropagation(); openView(t); }, color:"#2563EB" },
                          { icon:icons.patient,  title:"New Report",  fn:(e) => { e.stopPropagation(); openCreateReport(t, 0); }, color:"#059669" },
                          { icon:icons.download, title:"Export XLSX", fn:(e) => { e.stopPropagation(); doExport(t); }, color:"#EA580C" },
                        ].map(({ icon, title, fn, color }) => (
                          <button key={title} title={title} onClick={fn}
                            style={{ ...css.iconBtn, width:28, height:28 }}
                            onMouseEnter={e => { e.currentTarget.style.color=color; e.currentTarget.style.background="#F9FAFB"; }}
                            onMouseLeave={e => { e.currentTarget.style.color="#6B7280"; e.currentTarget.style.background="transparent"; }}>
                            <Icon d={icon} size={14} />
                          </button>
                        ))}
                      </div>
                      <button onClick={e => { e.stopPropagation(); deleteTpl(t.id); }}
                        style={{ ...css.iconBtn, width:28, height:28 }}
                        onMouseEnter={e => { e.currentTarget.style.color="#DC2626"; e.currentTarget.style.background="#FEF2F2"; }}
                        onMouseLeave={e => { e.currentTarget.style.color="#6B7280"; e.currentTarget.style.background="transparent"; }}>
                        <Icon d={icons.trash} size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List view */
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #E5E7EB", overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr>
                    <th style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:"#6B7280", textTransform:"uppercase", background:"#F9FAFB", borderBottom:"1px solid #E5E7EB", width:40 }}>
                      <input type="checkbox" checked={selected.length===filtered.length&&filtered.length>0}
                        onChange={e => setSelected(e.target.checked ? [...filtered] : [])} style={{ accentColor:"#2563EB" }} />
                    </th>
                    {["Name","Type","Sheets","Created","Actions"].map(h => (
                      <th key={h} style={{ padding:"10px 14px", textAlign: h==="Actions"?"right":"left", fontSize:11, fontWeight:600, color:"#6B7280", textTransform:"uppercase", background:"#F9FAFB", borderBottom:"1px solid #E5E7EB" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => {
                    const isSel = !!selected.find(s => s.id === t.id);
                    return (
                      <tr key={t.id} style={{ background:isSel?"#EFF6FF":"transparent", cursor:"pointer" }} onClick={() => toggleSel(t)}>
                        <td style={{ padding:"11px 14px", borderBottom:"1px solid #F3F4F6" }}>
                          <input type="checkbox" checked={isSel} onChange={() => {}} style={{ accentColor:"#2563EB" }} />
                        </td>
                        <td style={{ padding:"11px 14px", borderBottom:"1px solid #F3F4F6" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{ ...css.cardIcon, width:28, height:28 }}><Icon d={icons.file} size={14} /></div>
                            <span style={{ fontWeight:500 }}>{t.name}</span>
                          </div>
                        </td>
                        <td style={{ padding:"11px 14px", borderBottom:"1px solid #F3F4F6" }}>
                          <span style={css.badge(t.type==="report"?"green":"blue")}>{t.type}</span>
                        </td>
                        <td style={{ padding:"11px 14px", borderBottom:"1px solid #F3F4F6", color:"#6B7280", fontSize:12 }}>
                          {(t.sheetNames||[]).length}
                        </td>
                        <td style={{ padding:"11px 14px", borderBottom:"1px solid #F3F4F6", color:"#6B7280", fontSize:12 }}>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding:"11px 14px", borderBottom:"1px solid #F3F4F6" }}>
                          <div style={{ display:"flex", gap:4, justifyContent:"flex-end" }}>
                            {[
                              { icon:icons.eye,      title:"View",       fn:(e)=>{e.stopPropagation();openView(t);} },
                              { icon:icons.patient,  title:"New Report",  fn:(e)=>{e.stopPropagation();openCreateReport(t,0);} },
                              { icon:icons.download, title:"Export",      fn:(e)=>{e.stopPropagation();doExport(t);} },
                              { icon:icons.trash,    title:"Delete",      fn:(e)=>{e.stopPropagation();deleteTpl(t.id);} },
                            ].map(({ icon, title, fn }) => (
                              <button key={title} title={title} onClick={fn} style={{ ...css.iconBtn, width:28, height:28 }}>
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

      {/* ════════════════════════════════════════════════
          VIEW PANEL — read-only document view
      ════════════════════════════════════════════════ */}
      {panel === "view" && activeTemplate && (
        <div style={css.panel}>
          <div style={css.panelHeader}>
            <button style={css.btn("ghost")} onClick={() => setPanel(null)}>
              <Icon d={icons.back} size={15} /> Back
            </button>
            <span style={{ width:1, height:24, background:"#E5E7EB" }} />
            <span style={{ fontWeight:600, fontSize:15 }}>{activeTemplate.name}</span>
            <span style={{ ...css.badge("blue"), marginLeft:4 }}>{activeTemplate.type}</span>
            <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
              <button style={css.btn("ghost")} onClick={() => doExport(activeTemplate)}>
                <Icon d={icons.download} size={14} /> Export
              </button>
              <button style={css.btn("green")} onClick={() => openCreateReport(activeTemplate, activeSheetIdx)}>
                <Icon d={icons.patient} size={14} /> New Report from this sheet
              </button>
            </div>
          </div>

          {/* Sheet tabs */}
          <div style={css.sheetTabs}>
            {viewSheetNames.map((name, i) => (
              <button key={name} style={css.tab(i === activeSheetIdx)} onClick={() => setActiveSheetIdx(i)}>
                {name}
              </button>
            ))}
          </div>

          <ReportSheetViewer
            key={currentViewSheet}
            data={activeTemplate.sheets[currentViewSheet] || [[]]}
            readOnly={true}
            onCreateReport={() => openCreateReport(activeTemplate, activeSheetIdx)}
          />
        </div>
      )}

      {/* ════════════════════════════════════════════════
          REPORT PANEL — editable patient report
      ════════════════════════════════════════════════ */}
      {panel === "report" && reportPanel && (() => {
        const { templateName, allSheets, allData, patientName: pName } = reportPanel;
        const [activeReportSheet, setActiveReportSheet] = useState(allSheets[0]);
        const [reportData, setReportData] = useState(allData);
        const [reportPatient, setReportPatient] = useState(pName);

        return (
          <div style={css.panel}>
            <div style={{ ...css.panelHeader, background:"#064E3B", borderColor:"#065F46" }}>
              <button style={{ ...css.btn("ghost"), color:"#D1FAE5", borderColor:"#065F46" }} onClick={() => { if(confirm("Discard changes?")) { setPanel(null); setReportPanel(null); } }}>
                <Icon d={icons.back} size={15} /> Back
              </button>
              <span style={{ width:1, height:24, background:"#065F46" }} />
              <Icon d={icons.patient} size={18} stroke="#6EE7B7" />
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ color:"#D1FAE5", fontWeight:600, fontSize:14 }}>Patient Report:</span>
                <input
                  value={reportPatient}
                  onChange={e => setReportPatient(e.target.value)}
                  placeholder="Enter patient name…"
                  style={{ background:"#065F46", border:"1px solid #059669", color:"#fff", borderRadius:6, padding:"4px 10px", fontSize:13, outline:"none", fontFamily:"inherit", width:200 }}
                />
              </div>
              <span style={{ color:"#6EE7B7", fontSize:12, marginLeft:4 }}>— {templateName}</span>
              <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
                <button style={{ ...css.btn("ghost"), color:"#D1FAE5", borderColor:"#065F46" }}
                  onClick={() => {
                    const wb = XLSX.utils.book_new();
                    Object.entries(reportData).forEach(([n, d]) => {
                      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(d), n.substring(0,31));
                    });
                    XLSX.writeFile(wb, `${reportPatient || "Patient"}_Report.xlsx`);
                  }}>
                  <Icon d={icons.download} size={14} /> Export XLSX
                </button>
                <button style={css.btn("green")} onClick={() => saveReport(reportData, reportPatient)}>
                  <Icon d={icons.save} size={14} /> Save Report
                </button>
              </div>
            </div>

            {/* Sheet tabs */}
            <div style={{ ...css.sheetTabs, background:"#F0FDF4", borderColor:"#BBF7D0" }}>
              {allSheets.map((name, i) => (
                <button key={name}
                  style={{ ...css.tab(name === activeReportSheet), ...(name === activeReportSheet ? { background:"#059669", borderColor:"#059669" } : {}) }}
                  onClick={() => setActiveReportSheet(name)}>
                  {name}
                </button>
              ))}
            </div>

            <ReportSheetViewer
              key={activeReportSheet}
              data={reportData[activeReportSheet] || [[]]}
              readOnly={false}
              reportMode={true}
              onDataChange={newData => setReportData(prev => ({ ...prev, [activeReportSheet]: newData }))}
            />
          </div>
        );
      })()}

      {/* ════════════════════════════════════════════════
          NEW REPORT MODAL
      ════════════════════════════════════════════════ */}
      {showNewReportModal && newReportTemplate && (
        <div style={css.overlay}>
          <div style={css.modal}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <h2 style={{ margin:0, fontSize:18, fontWeight:700 }}>📋 Create New Patient Report</h2>
              <button style={css.iconBtn} onClick={() => setShowNewReportModal(false)}>
                <Icon d={icons.x} size={16} />
              </button>
            </div>

            <p style={{ fontSize:13, color:"#6B7280", marginBottom:16 }}>
              Creating report from: <strong>{newReportTemplate.name}</strong>
            </p>

            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:6 }}>
                Patient Name *
              </label>
              <input
                style={css.input}
                placeholder="e.g. ABC Kumar"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                autoFocus
                onKeyDown={e => { if(e.key==="Enter" && patientName.trim()) startReportEdit(); }}
              />
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:8 }}>
                Select Sheet to Start With
              </label>
              <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:200, overflowY:"auto" }}>
                {newReportTemplate.sheetNames.map((name, i) => (
                  <div key={name} onClick={() => setNewReportSheetIdx(i)}
                    style={{ padding:"10px 14px", borderRadius:8, border:`2px solid ${newReportSheetIdx===i?"#3B82F6":"#E5E7EB"}`, background: newReportSheetIdx===i?"#EFF6FF":"#F9FAFB", cursor:"pointer", display:"flex", alignItems:"center", gap:10, fontSize:13 }}>
                    <Icon d={icons.file} size={16} stroke="#6B7280" />
                    <span style={{ flex:1, fontWeight: newReportSheetIdx===i?600:400 }}>{name}</span>
                    {newReportSheetIdx===i && <Icon d={icons.check} size={15} stroke="#2563EB" />}
                  </div>
                ))}
              </div>
              <p style={{ fontSize:11, color:"#9CA3AF", marginTop:6 }}>
                All sheets will be included in the report. You can switch between them while editing.
              </p>
            </div>

            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button style={css.btn("ghost")} onClick={() => setShowNewReportModal(false)}>Cancel</button>
              <button
                style={{ ...css.btn("green"), opacity: patientName.trim() ? 1 : 0.5 }}
                disabled={!patientName.trim()}
                onClick={startReportEdit}>
                <Icon d={icons.patient} size={14} /> Start Editing Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
