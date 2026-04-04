import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import api from '../services/api';
import {
  FiUpload, FiDownload, FiCopy, FiClipboard, FiLayers, FiEdit2,
  FiTrash2, FiPlus, FiSearch, FiGrid, FiList, FiX, FiCheck,
  FiFileText, FiSave, FiFolder, FiColumns, FiFilePlus, FiEye
} from 'react-icons/fi';

// ========== OPTIMIZED DATA STRUCTURES ==========

class SheetData {
  constructor(data = {}) {
    this.sheets = data;
    this.cache = new Map();
  }

  getSheet(name) {
    if (!this.sheets[name]) {
      this.sheets[name] = [['']];
    }
    return this.sheets[name];
  }

  setCell(sheetName, row, col, value) {
    const sheet = this.getSheet(sheetName);
    if (!sheet[row]) sheet[row] = [];
    sheet[row][col] = value;
    this.cache.clear();
  }

  getCell(sheetName, row, col) {
    const sheet = this.getSheet(sheetName);
    return sheet[row]?.[col] ?? '';
  }

  addRow(sheetName, rowIndex = null) {
    const sheet = this.getSheet(sheetName);
    const colCount = sheet[0]?.length || 5;
    const newRow = Array(colCount).fill('');
    if (rowIndex === null || rowIndex >= sheet.length) {
      sheet.push(newRow);
    } else {
      sheet.splice(rowIndex + 1, 0, newRow);
    }
    this.cache.clear();
    return sheet;
  }

  addColumn(sheetName, colIndex = null) {
    const sheet = this.getSheet(sheetName);
    sheet.forEach(row => {
      if (colIndex === null || colIndex >= row.length) {
        row.push('');
      } else {
        row.splice(colIndex + 1, 0, '');
      }
    });
    this.cache.clear();
    return sheet;
  }

  deleteRow(sheetName, rowIndex) {
    const sheet = this.getSheet(sheetName);
    sheet.splice(rowIndex, 1);
    if (sheet.length === 0) sheet.push(['']);
    this.cache.clear();
    return sheet;
  }

  deleteColumn(sheetName, colIndex) {
    const sheet = this.getSheet(sheetName);
    sheet.forEach(row => row.splice(colIndex, 1));
    this.cache.clear();
    return sheet;
  }

  getDimensions(sheetName) {
    const sheet = this.getSheet(sheetName);
    const rows = sheet.length;
    const cols = sheet.reduce((max, row) => Math.max(max, row?.length || 0), 0);
    return { rows, cols };
  }

  toJSON() {
    return { ...this.sheets };
  }
}

// ========== EXCEL UTILITIES ==========

const getColumnLabel = (index) => {
  let label = '';
  let i = index;
  do {
    label = String.fromCharCode(65 + (i % 26)) + label;
    i = Math.floor(i / 26) - 1;
  } while (i >= 0);
  return label;
};

// ========== ADVANCED EXCEL PARSER ==========

const parseExcelFile = (arrayBuffer) => {
  try {
    const workbook = XLSX.read(arrayBuffer, { 
      type: 'array', 
      cellDates: true,
      cellNF: true,
      cellStyles: true
    });

    const sheets = {};
    
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
      
      // Strategy 1: Standard parsing
      let jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: '',
        blankrows: true,
        raw: false
      });

      // Strategy 2: Manual extraction if empty
      if (jsonData.length === 0 || jsonData.every(row => row.length === 0 || row.every(cell => !cell))) {
        jsonData = [];
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const row = [];
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = worksheet[cellAddress];
            
            if (cell) {
              let value = '';
              if (cell.t === 's' || cell.t === 'str') value = cell.v;
              else if (cell.t === 'n') value = cell.w || cell.v?.toString() || '';
              else if (cell.t === 'b') value = cell.v ? 'TRUE' : 'FALSE';
              else if (cell.t === 'd') value = cell.v?.toISOString()?.split('T')[0] || '';
              else if (cell.t === 'f') value = cell.f;
              else value = cell.w || cell.v || '';
              
              row[C - range.s.c] = value;
            } else {
              row[C - range.s.c] = '';
            }
          }
          jsonData.push(row);
        }
      }

      // Trim empty trailing rows
      let lastNonEmptyRow = jsonData.length - 1;
      while (lastNonEmptyRow >= 0) {
        const row = jsonData[lastNonEmptyRow];
        if (row.some(cell => cell !== '' && cell !== null && cell !== undefined)) break;
        lastNonEmptyRow--;
      }
      
      if (lastNonEmptyRow < jsonData.length - 1) {
        jsonData = jsonData.slice(0, lastNonEmptyRow + 1);
      }

      if (jsonData.length === 0) jsonData = [['']];

      sheets[sheetName] = jsonData;
      console.log(`✓ Sheet "${sheetName}": ${jsonData.length} rows x ${jsonData[0]?.length || 0} cols`);
    });

    return { success: true, sheets, sheetNames: workbook.SheetNames };
  } catch (error) {
    console.error('Excel parse error:', error);
    return { success: false, error: error.message };
  }
};

// ========== MAIN COMPONENT ==========

const TemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [clipboard, setClipboard] = useState(null);
  
  // Modals
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Sheet Data (using SheetData class)
  const [sheetData, setSheetData] = useState(new SheetData());
  const [viewSheetData, setViewSheetData] = useState(new SheetData());
  
  // Templates
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [viewingTemplate, setViewingTemplate] = useState(null);
  const [mergeTarget, setMergeTarget] = useState(null);
  
  // Navigation
  const [activeSheet, setActiveSheet] = useState(0);
  const [viewActiveSheet, setViewActiveSheet] = useState(0);
  
  // Report
  const [reportName, setReportName] = useState('');
  const [reportData, setReportData] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => { fetchTemplates(); }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.request('/templates');
      if (response.success) setTemplates(response.data || []);
    } catch (error) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  // ========== FILE UPLOAD ==========
  const handleExcelUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = parseExcelFile(e.target.result);
      
      if (result.success) {
        const newSheetData = new SheetData(result.sheets);
        setSheetData(newSheetData);
        createTemplateFromExcel(file.name, result.sheets);
        toast.success(`Parsed ${Object.keys(result.sheets).length} sheet(s) with ${Object.values(result.sheets).reduce((acc, s) => acc + s.length, 0)} total rows`);
      } else {
        toast.error('Failed to parse Excel: ' + result.error);
      }
    };
    reader.onerror = () => toast.error('Failed to read file');
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  }, []);

  const createTemplateFromExcel = async (filename, sheets) => {
    try {
      const totalRows = Object.values(sheets).reduce((acc, s) => acc + s.length, 0);
      const templateData = {
        name: filename.replace(/\.xlsx?$/i, '').replace(/\.csv$/i, ''),
        type: 'excel_import',
        description: `Imported from ${filename} • ${Object.keys(sheets).length} sheet(s) • ${totalRows} rows`,
        template_data: JSON.stringify({ sheets, sheetNames: Object.keys(sheets), importedAt: new Date().toISOString() }),
        excel_filename: filename,
        status: 'active'
      };

      const response = await api.request('/templates', {
        method: 'POST',
        body: JSON.stringify(templateData)
      });

      if (response.success) {
        toast.success('Excel imported successfully!');
        fetchTemplates();
      }
    } catch (error) {
      toast.error('Failed to save template');
    }
  };

  // ========== EXPORT & COPY ==========
  const exportToExcel = useCallback((template) => {
    try {
      let data = typeof template.template_data === 'string' ? JSON.parse(template.template_data) : template.template_data;
      const wb = XLSX.utils.book_new();
      
      if (data?.sheets) {
        Object.entries(data.sheets).forEach(([sheetName, sheetData]) => {
          const ws = XLSX.utils.aoa_to_sheet(sheetData);
          XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
        });
      } else {
        const ws = XLSX.utils.aoa_to_sheet([['Template Data'], [JSON.stringify(data, null, 2)]]);
        XLSX.utils.book_append_sheet(wb, ws, 'Data');
      }

      XLSX.writeFile(wb, `${template.name}.xlsx`);
      toast.success('Exported to Excel!');
    } catch (error) {
      toast.error('Export failed');
    }
  }, []);

  const copyTemplate = useCallback((template) => {
    setClipboard({ type: 'template', data: template, copiedAt: new Date().toISOString() });
    toast.success(`Copied "${template.name}"`);
  }, []);

  const pasteTemplate = useCallback(async () => {
    if (!clipboard) return toast.error('Clipboard empty!');

    try {
      const newTemplate = {
        name: `${clipboard.data.name} (Copy)`,
        type: clipboard.data.type,
        description: clipboard.data.description,
        template_data: clipboard.data.template_data,
        source_template_id: clipboard.data.id,
        status: 'active'
      };

      const response = await api.request('/templates', { method: 'POST', body: JSON.stringify(newTemplate) });

      if (response.success) {
        toast.success('Template pasted!');
        fetchTemplates();
      }
    } catch (error) {
      toast.error('Paste failed');
    }
  }, [clipboard]);

  // ========== MERGE & REPORT ==========
  const mergeTemplates = useCallback(() => {
    if (selectedTemplates.length < 2) return toast.error('Select 2+ templates');
    setShowMergeModal(true);
  }, [selectedTemplates]);

  const executeMerge = useCallback(async () => {
    if (!mergeTarget) return toast.error('Select target template');

    try {
      const sources = selectedTemplates.filter(t => t.id !== mergeTarget.id);
      let targetData = typeof mergeTarget.template_data === 'string' ? JSON.parse(mergeTarget.template_data) : mergeTarget.template_data;

      const mergedSheets = { ...(targetData?.sheets || {}) };
      sources.forEach(t => {
        let sData = typeof t.template_data === 'string' ? JSON.parse(t.template_data) : t.template_data;
        if (sData?.sheets) {
          Object.entries(sData.sheets).forEach(([name, data]) => {
            mergedSheets[`${t.name}_${name}`] = data;
          });
        }
      });

      const response = await api.request(`/templates/${mergeTarget.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: `${mergeTarget.name} (Merged)`,
          template_data: JSON.stringify({
            ...targetData,
            sheets: mergedSheets,
            mergedFrom: sources.map(t => ({ id: t.id, name: t.name })),
            mergedAt: new Date().toISOString()
          }),
          is_merged: 1,
          merged_from: JSON.stringify(sources.map(t => t.id))
        })
      });

      if (response.success) {
        toast.success('Merged successfully!');
        setShowMergeModal(false);
        setSelectedTemplates([]);
        setMergeTarget(null);
        fetchTemplates();
      }
    } catch (error) {
      toast.error('Merge failed');
    }
  }, [mergeTarget, selectedTemplates]);

  const generateReport = useCallback(() => {
    if (selectedTemplates.length === 0) return toast.error('Select templates first');
    
    setReportName(`Report_${new Date().toISOString().split('T')[0]}`);
    
    const sheets = {};
    selectedTemplates.forEach(template => {
      let data = typeof template.template_data === 'string' ? JSON.parse(template.template_data) : template.template_data;
      if (data?.sheets) {
        Object.entries(data.sheets).forEach(([name, sheetData]) => {
          sheets[`${template.name}_${name}`] = sheetData;
        });
      }
    });

    setReportData({
      generatedAt: new Date().toISOString(),
      templates: selectedTemplates.map(t => ({ id: t.id, name: t.name, type: t.type })),
      sheets
    });
    setShowReportModal(true);
  }, [selectedTemplates]);

  const saveReport = useCallback(async () => {
    try {
      const response = await api.request('/templates', {
        method: 'POST',
        body: JSON.stringify({
          name: reportName,
          type: 'generated_report',
          description: `Report from ${reportData.templates.length} template(s)`,
          template_data: JSON.stringify(reportData),
          status: 'active'
        })
      });

      if (response.success) {
        toast.success('Report saved!');
        setShowReportModal(false);
        setSelectedTemplates([]);
        fetchTemplates();
      }
    } catch (error) {
      toast.error('Save failed');
    }
  }, [reportName, reportData]);

  // ========== MODALS ==========
  const openEditModal = useCallback((template) => {
    let data = typeof template.template_data === 'string' ? JSON.parse(template.template_data) : template.template_data;
    setEditingTemplate({ ...template, parsedData: data });
    setSheetData(new SheetData(data?.sheets || { 'Sheet1': [['']] }));
    setActiveSheet(0);
    setShowEditModal(true);
  }, []);

  const openViewModal = useCallback((template) => {
    let data = typeof template.template_data === 'string' ? JSON.parse(template.template_data) : template.template_data;
    setViewingTemplate(template);
    setViewSheetData(new SheetData(data?.sheets || { 'Sheet1': [['No data']] }));
    setViewActiveSheet(0);
    setShowViewModal(true);
  }, []);

  const saveTemplateEdit = useCallback(async () => {
    try {
      const response = await api.request(`/templates/${editingTemplate.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editingTemplate.name,
          description: editingTemplate.description,
          template_data: JSON.stringify({
            ...editingTemplate.parsedData,
            sheets: sheetData.toJSON(),
            updatedAt: new Date().toISOString()
          })
        })
      });

      if (response.success) {
        toast.success('Saved!');
        setShowEditModal(false);
        fetchTemplates();
      }
    } catch (error) {
      toast.error('Save failed');
    }
  }, [editingTemplate, sheetData]);

  const deleteTemplate = useCallback(async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      const response = await api.request(`/templates/${id}`, { method: 'DELETE' });
      if (response.success) {
        toast.success('Deleted!');
        fetchTemplates();
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  }, []);

  const bulkDeleteTemplates = useCallback(async () => {
    if (selectedTemplates.length === 0) return;
    
    try {
      const ids = selectedTemplates.map(t => t.id);
      const response = await api.request('/templates/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids })
      });

      if (response.success) {
        toast.success(`Deleted ${response.deletedCount || selectedTemplates.length} template(s)!`);
        setSelectedTemplates([]);
        fetchTemplates();
      } else {
        toast.error(response.message || 'Bulk delete failed');
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Bulk delete failed');
    }
  }, [selectedTemplates]);

  const toggleTemplateSelection = useCallback((template) => {
    setSelectedTemplates(prev => {
      const exists = prev.find(t => t.id === template.id);
      return exists ? prev.filter(t => t.id !== template.id) : [...prev, template];
    });
  }, []);

  // ========== COMPUTED VALUES ==========
  const filteredTemplates = useMemo(() => 
    templates.filter(t => 
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [templates, searchTerm]);

  const currentSheetNames = useMemo(() => Object.keys(sheetData.sheets), [sheetData]);
  const currentSheetName = currentSheetNames[activeSheet] || 'Sheet1';
  const currentSheet = sheetData.getSheet(currentSheetName);
  const { rows: currentRowCount, cols: currentColCount } = useMemo(() => 
    sheetData.getDimensions(currentSheetName), [sheetData, currentSheetName]);

  const viewSheetNames = useMemo(() => Object.keys(viewSheetData.sheets), [viewSheetData]);
  const viewCurrentSheetName = viewSheetNames[viewActiveSheet] || 'Sheet1';
  const viewCurrentSheet = viewSheetData.getSheet(viewCurrentSheetName);

  // ========== RENDER ==========
  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Template Manager</h1>
              <p className="text-gray-600 mt-1">Upload Excel, edit, merge, create reports</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {clipboard && (
                <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  onClick={pasteTemplate} className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <FiClipboard className="w-4 h-4 mr-2" /> Paste
                </motion.button>
              )}
              {selectedTemplates.length >= 1 && (
                <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  onClick={generateReport} className="inline-flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  <FiFilePlus className="w-4 h-4 mr-2" /> Report ({selectedTemplates.length})
                </motion.button>
              )}
              {selectedTemplates.length >= 2 && (
                <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  onClick={mergeTemplates} className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <FiLayers className="w-4 h-4 mr-2" /> Merge
                </motion.button>
              )}
              <input type="file" ref={fileInputRef} onChange={handleExcelUpload} accept=".xlsx,.xls,.csv" className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <FiUpload className="w-4 h-4 mr-2" /> Upload Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search templates..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              <FiGrid className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>
        {selectedTemplates.length > 0 && (
          <div className="mt-3 flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
            <span className="text-sm text-blue-700 font-medium">{selectedTemplates.length} template(s) selected</span>
            <div className="flex items-center gap-2">
              {selectedTemplates.length > 0 && (
                <button 
                  onClick={() => {
                    if (window.confirm(`Delete ${selectedTemplates.length} template(s)? This cannot be undone.`)) {
                      bulkDeleteTemplates();
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800 hover:bg-red-100 px-3 py-1 rounded transition-colors flex items-center gap-1"
                >
                  <FiTrash2 className="w-4 h-4" /> Delete Selected
                </button>
              )}
              <button onClick={() => setSelectedTemplates([])} className="text-sm text-blue-600 hover:text-blue-800">Clear</button>
            </div>
          </div>
        )}
      </div>

      {/* Templates Grid/List */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FiFolder className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates</h3>
            <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
              <FiUpload className="w-4 h-4 mr-2" /> Upload Excel
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTemplates.map((template) => (
              <motion.div key={template.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer ${
                  selectedTemplates.find(t => t.id === template.id) ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                }`} onClick={() => toggleTemplateSelection(template)}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                        <FiFileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{template.name}</h3>
                        <p className="text-xs text-gray-500">{template.type}</p>
                      </div>
                    </div>
                    <input type="checkbox" checked={!!selectedTemplates.find(t => t.id === template.id)} onChange={() => {}} className="w-4 h-4 text-blue-600 rounded" />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{template.description || 'No description'}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); openViewModal(template); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" title="View"><FiEye className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); copyTemplate(template); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" title="Copy"><FiCopy className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); openEditModal(template); }} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded" title="Edit"><FiEdit2 className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); exportToExcel(template); }} className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded" title="Export"><FiDownload className="w-4 h-4" /></button>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteTemplate(template.id); }} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedTemplates.length === filteredTemplates.length && filteredTemplates.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTemplates([...filteredTemplates]);
                        } else {
                          setSelectedTemplates([]);
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className={`hover:bg-gray-50 cursor-pointer ${selectedTemplates.find(t => t.id === template.id) ? 'bg-blue-50' : ''}`}
                    onClick={() => toggleTemplateSelection(template)}>
                    <td className="px-4 py-3"><input type="checkbox" checked={!!selectedTemplates.find(t => t.id === template.id)} onChange={() => {}} className="w-4 h-4 text-blue-600 rounded" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center"><FiFileText className="w-4 h-4 text-gray-400 mr-2" /><span className="font-medium text-gray-900">{template.name}</span></div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{template.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(template.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); openViewModal(template); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"><FiEye className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); copyTemplate(template); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"><FiCopy className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); openEditModal(template); }} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"><FiEdit2 className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); exportToExcel(template); }} className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded"><FiDownload className="w-4 h-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); deleteTemplate(template.id); }} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========== MODALS ========== */}
      <AnimatePresence>
        {/* View Modal */}
        {showViewModal && viewingTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <FiEye className="w-6 h-6 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{viewingTemplate.name}</h2>
                    <p className="text-sm text-gray-500">{viewCurrentSheetName} • {viewCurrentSheet.length} rows</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {viewSheetNames.length > 1 && (
                    <div className="flex items-center gap-1 mr-4">
                      {viewSheetNames.map((name, idx) => (
                        <button key={name} onClick={() => setViewActiveSheet(idx)} className={`px-3 py-1.5 text-sm rounded-lg ${viewActiveSheet === idx ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{name}</button>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setShowViewModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"><FiX className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-gray-50">
                <div className="inline-block min-w-full bg-white rounded-lg shadow">
                  <table className="border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="w-10 h-8 border border-gray-300"></th>
                        {viewCurrentSheet[0]?.map((_, colIdx) => (
                          <th key={colIdx} className="w-24 h-8 border border-gray-300 text-xs font-semibold text-gray-600">{getColumnLabel(colIdx)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {viewCurrentSheet.map((row, rowIdx) => (
                        <tr key={rowIdx} className={rowIdx === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                          <td className="w-10 h-8 bg-gray-100 border border-gray-300 text-center text-xs text-gray-500 font-medium">{rowIdx + 1}</td>
                          {row.map((cell, colIdx) => (
                            <td key={colIdx} className="w-24 h-8 border border-gray-200 px-2 py-1 text-sm text-gray-700 truncate">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-white">
                <button onClick={() => setShowViewModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Close</button>
                <button onClick={() => exportToExcel(viewingTemplate)} className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"><FiDownload className="w-4 h-4 mr-2" /> Export</button>
                <button onClick={() => { setShowViewModal(false); openEditModal(viewingTemplate); }} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FiEdit2 className="w-4 h-4 mr-2" /> Edit</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <input type="text" value={editingTemplate.name} onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                    className="text-xl font-bold text-gray-900 border-none focus:ring-0 p-0 bg-transparent flex-1" />
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{editingTemplate.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  {currentSheetNames.length > 1 && (
                    <div className="flex items-center gap-1 mr-4">
                      {currentSheetNames.map((name, idx) => (
                        <button key={name} onClick={() => setActiveSheet(idx)} className={`px-3 py-1.5 text-sm rounded-lg ${activeSheet === idx ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{name}</button>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setShowEditModal(false)} className="p-2 text-gray-400 hover:text-gray-600"><FiX className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                <span className="text-sm text-gray-600 mr-2">{currentSheetName} • {currentRowCount} rows × {currentColCount} cols</span>
                <div className="h-4 w-px bg-gray-300 mx-2"></div>
                <button onClick={() => { sheetData.addRow(currentSheetName); setSheetData(new SheetData(sheetData.sheets)); }} className="flex items-center px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"><FiPlus className="w-3 h-3 mr-1" /> Row</button>
                <button onClick={() => { sheetData.addColumn(currentSheetName); setSheetData(new SheetData(sheetData.sheets)); }} className="flex items-center px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"><FiColumns className="w-3 h-3 mr-1" /> Col</button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="inline-block min-w-full">
                  <table className="border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="w-10 h-8 border border-gray-300"></th>
                        {Array.from({ length: currentColCount }, (_, i) => (
                          <th key={i} className="w-32 h-8 border border-gray-300 text-xs font-semibold text-gray-600 bg-gray-50">{getColumnLabel(i)}</th>
                        ))}
                        <th className="w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentSheet.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          <td className="w-10 h-8 bg-gray-100 border border-gray-300 text-center text-xs text-gray-500 font-medium">{rowIdx + 1}</td>
                          {Array.from({ length: currentColCount }, (_, colIdx) => (
                            <td key={colIdx} className="p-0">
                              <input type="text" value={row[colIdx] || ''}
                                onChange={(e) => { sheetData.setCell(currentSheetName, rowIdx, colIdx, e.target.value); setSheetData(new SheetData(sheetData.sheets)); }}
                                className="w-32 h-8 px-2 border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </td>
                          ))}
                          <td className="w-8">
                            <button onClick={() => { sheetData.deleteRow(currentSheetName, rowIdx); setSheetData(new SheetData(sheetData.sheets)); }} className="p-1 text-red-500 hover:bg-red-50 rounded"><FiTrash2 className="w-3 h-3" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={saveTemplateEdit} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FiSave className="w-4 h-4 mr-2" /> Save</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && reportData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Create Report</h2>
                  <button onClick={() => setShowReportModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded"><FiX className="w-5 h-5" /></button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                  <input type="text" value={reportName} onChange={(e) => setReportName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Templates ({reportData.templates.length}):</h3>
                  <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                    {reportData.templates.map((t, i) => (<div key={i} className="flex items-center text-sm text-gray-600 py-1"><FiFileText className="w-4 h-4 mr-2" />{t.name}</div>))}
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Sheets ({Object.keys(reportData.sheets).length}):</h3>
                  <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                    {Object.keys(reportData.sheets).map((name, i) => (<div key={i} className="text-sm text-gray-600 py-1">• {name}</div>))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowReportModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button onClick={() => { const wb = XLSX.utils.book_new(); Object.entries(reportData.sheets).forEach(([name, data]) => { XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data), name.substring(0, 31)); }); XLSX.writeFile(wb, `${reportName}.xlsx`); toast.success('Exported!'); }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><FiDownload className="w-4 h-4 inline mr-2" /> Export</button>
                  <button onClick={saveReport} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"><FiFilePlus className="w-4 h-4 inline mr-2" /> Save</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Merge Modal */}
        {showMergeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Merge Templates</h2>
                <p className="text-gray-600 mb-4">Select target template:</p>
                <div className="space-y-2 mb-6">
                  {selectedTemplates.map((t) => (
                    <div key={t.id} onClick={() => setMergeTarget(t)} className={`p-4 rounded-lg border-2 cursor-pointer ${mergeTarget?.id === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-center"><FiFileText className="w-5 h-5 text-gray-400 mr-3" /><span className="font-medium">{t.name}</span>{mergeTarget?.id === t.id && <FiCheck className="w-5 h-5 text-blue-600 ml-auto" />}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => { setShowMergeModal(false); setMergeTarget(null); }} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button onClick={executeMerge} disabled={!mergeTarget} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">Merge</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateManager;
