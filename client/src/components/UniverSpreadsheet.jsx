import { useEffect, useRef, useState, useCallback } from 'react';
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets';
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import UniverPresetSheetsCoreEnUS from '@univerjs/preset-sheets-core/locales/en-US';
import {
  importFile,
  getWorkbookDataBySheets,
  buildSheetFrom2DArray,
  addConditionalFormatsToWorkbook,
  addFiltersToWorkbook,
  addSortsToWorkbook,
  addChartsToWorkbook,
  addPivotTablesToWorkbook,
  addImagesToWorkbook,
} from 'univer-file-import';
import * as XLSX from 'xlsx';
import '@univerjs/preset-sheets-core/lib/index.css';
import toast from 'react-hot-toast';

let univerInstanceCounter = 0;

export default function UniverSpreadsheet({
  initialData,
  onDataChange,
  readOnly = false,
  height = '600px',
  width = '100%',
  showToolbar = true,
  showFormulaBar = true,
  showSheetTabs = true,
}) {
  const wrapperRef = useRef(null);
  const mountPointRef = useRef(null);
  const univerRef = useRef(null);
  const univerAPIRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    univerInstanceCounter += 1;
    const mountId = `univer-mount-${univerInstanceCounter}-${Date.now()}`;

    // ── Create a separate inner div (NOT React-managed) for Univer ──
    // This avoids React vs Univer DOM conflicts (removeChild errors).
    // React owns only the outer wrapper; Univer owns everything inside the mount div.
    const mountDiv = document.createElement('div');
    mountDiv.id = mountId;
    mountDiv.style.width = '100%';
    mountDiv.style.height = '100%';
    mountDiv.style.minHeight = '400px';
    mountDiv.style.overflow = 'hidden';
    mountDiv.style.position = 'relative';
    wrapper.appendChild(mountDiv);
    mountPointRef.current = mountDiv;

    let cancelled = false;

    const boot = () => {
      try {
        const { univer, univerAPI } = createUniver({
          locale: LocaleType.EN_US,
          locales: {
            [LocaleType.EN_US]: mergeLocales([UniverPresetSheetsCoreEnUS]),
          },
          presets: [
            UniverSheetsCorePreset({
              container: mountDiv,
              layout: {
                header: showToolbar,
                formulaBar: showFormulaBar,
                sheetTabs: showSheetTabs,
              },
            }),
          ],
        });

        if (cancelled) {
          try { univer.dispose(); } catch (_) { /* noop */ }
          return;
        }

        univerRef.current = univer;
        univerAPIRef.current = univerAPI;

        if (initialData && Array.isArray(initialData) && initialData.length > 0) {
          const sheet = buildSheetFrom2DArray('Sheet1', initialData);
          const workbookData = getWorkbookDataBySheets([sheet], 'Workbook');
          univerAPI.createWorkbook(workbookData);
        } else {
          univerAPI.createWorkbook({});
        }

        setIsReady(true);
      } catch (err) {
        console.error('[Univer] Boot error:', err);
        toast.error('Spreadsheet engine failed to start: ' + err.message);
      }
    };

    // Small defer avoids tearing if React is still finalising the outer DOM.
    const raf = requestAnimationFrame(() => boot());

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);

      // ── Cleanup order matters to avoid React removeChild errors ──
      // 1. Tell Univer to dispose first (it removes its own internal nodes cleanly).
      if (univerRef.current) {
        try { univerRef.current.dispose(); } catch (_) { /* noop */ }
        univerRef.current = null;
        univerAPIRef.current = null;
      }

      // 2. Now manually yank the mount div from the wrapper — NEVER let React
      //    reconcile Univer's altered DOM inside here. React only knows wrapper.
      if (mountPointRef.current && wrapper && wrapper.contains(mountPointRef.current)) {
        try { wrapper.removeChild(mountPointRef.current); } catch (_) { /* noop */ }
      }
      mountPointRef.current = null;
      setIsReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = useCallback(() => {
    if (!univerAPIRef.current) return null;
    try {
      const workbook = univerAPIRef.current.getActiveWorkbook();
      if (!workbook) return null;
      return workbook.save();
    } catch (e) {
      console.error('Get data error:', e);
      return null;
    }
  }, []);

  const get2DArray = useCallback((sheetIndex = 0) => {
    if (!univerAPIRef.current) return [];
    try {
      const workbook = univerAPIRef.current.getActiveWorkbook();
      if (!workbook) return [];
      const sheet = workbook.getSheetByIndex(sheetIndex);
      if (!sheet) return [];
      const range = sheet.getRange();
      const values = range.getValue();
      if (Array.isArray(values)) {
        return values.map(row => Array.isArray(row) ? row : [row]);
      }
      return [[values]];
    } catch (e) {
      console.error('Get 2D array error:', e);
      return [];
    }
  }, []);

  const loadData = useCallback((data2D, sheetName = 'Sheet1') => {
    if (!univerAPIRef.current) return;
    try {
      const sheet = buildSheetFrom2DArray(sheetName, data2D);
      const workbookData = getWorkbookDataBySheets([sheet], 'Workbook');
      univerAPIRef.current.createWorkbook(workbookData);
      toast.success('Spreadsheet data loaded');
    } catch (e) {
      console.error('Load data error:', e);
      toast.error('Failed to load spreadsheet data');
    }
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !univerAPIRef.current) return;

    const loadingToast = toast.loading('Importing Excel file...');

    try {
      const result = await importFile(file, { includeImages: true });
      const {
        workbookData,
        images,
        conditionalFormats,
        filters,
        sorts,
        charts,
        pivotTables,
      } = result;

      univerAPIRef.current.createWorkbook(workbookData);

      try {
        if (conditionalFormats && Object.keys(conditionalFormats).length > 0) {
          await addConditionalFormatsToWorkbook(univerAPIRef.current, conditionalFormats);
        }
      } catch (err) { console.warn('Conditional format import skipped:', err.message); }

      try {
        if (filters && Object.keys(filters).length > 0) {
          await addFiltersToWorkbook(univerAPIRef.current, filters);
        }
      } catch (err) { console.warn('Filter import skipped:', err.message); }

      try {
        if (sorts && Object.keys(sorts).length > 0) {
          await addSortsToWorkbook(univerAPIRef.current, sorts);
        }
      } catch (err) { console.warn('Sort import skipped:', err.message); }

      try {
        if (charts && Object.keys(charts).length > 0) {
          await addChartsToWorkbook(univerAPIRef.current, charts);
        }
      } catch (err) { console.warn('Chart import skipped:', err.message); }

      try {
        if (pivotTables && pivotTables.length > 0) {
          await addPivotTablesToWorkbook(univerAPIRef.current, pivotTables);
        }
      } catch (err) { console.warn('Pivot table import skipped:', err.message); }

      try {
        if (images && images.length > 0) {
          await addImagesToWorkbook(univerAPIRef.current, images);
        }
      } catch (err) { console.warn('Image import skipped:', err.message); }

      toast.success(`Successfully imported: ${file.name}`, { id: loadingToast });

      if (onDataChange) {
        const snapshot = getData();
        onDataChange(snapshot, get2DArray());
      }
    } catch (err) {
      console.error('Import error:', err);
      toast.error(`Import failed: ${err.message}`, { id: loadingToast });
    } finally {
      e.target.value = '';
    }
  };

  const handleExportExcel = () => {
    if (!univerAPIRef.current) return;
    const loadingToast = toast.loading('Exporting to Excel...');

    try {
      const workbook = univerAPIRef.current.getActiveWorkbook();
      if (!workbook) throw new Error('No active workbook');

      const sheetCount = workbook.getSheetCount();
      const wb = XLSX.utils.book_new();

      for (let i = 0; i < sheetCount; i++) {
        const sheet = workbook.getSheetByIndex(i);
        if (!sheet) continue;
        const data = sheet.getRange().getValue() || [];
        const sheetData = Array.isArray(data)
          ? data.map(row => Array.isArray(row) ? row : [row])
          : [[data]];
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(wb, ws, sheet.getName() || `Sheet${i + 1}`);
      }

      XLSX.writeFile(wb, `spreadsheet_${Date.now()}.xlsx`);
      toast.success('Exported to Excel', { id: loadingToast });
    } catch (err) {
      console.error('Export error:', err);
      toast.error(`Export failed: ${err.message}`, { id: loadingToast });
    }
  };

  const handleExportCSV = () => {
    if (!univerAPIRef.current) return;
    const loadingToast = toast.loading('Exporting to CSV...');

    try {
      const data = get2DArray();
      const csv = data.map(row =>
        row.map(cell => {
          const val = cell === null || cell === undefined ? '' : String(cell);
          if (val.includes(',') || val.includes('"') || val.includes('\n')) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        }).join(',')
      ).join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `spreadsheet_${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success('Exported to CSV', { id: loadingToast });
    } catch (err) {
      console.error('CSV export error:', err);
      toast.error('CSV export failed', { id: loadingToast });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height, width, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
      <div style={{ display: 'flex', gap: 8, padding: '8px 12px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={handleImportClick}
          disabled={!isReady || readOnly}
          style={{
            padding: '6px 12px',
            fontSize: 13,
            borderRadius: 6,
            border: '1px solid #2563eb',
            background: '#2563eb',
            color: '#fff',
            cursor: readOnly || !isReady ? 'not-allowed' : 'pointer',
            opacity: readOnly || !isReady ? 0.5 : 1,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>📥</span> Import Excel
        </button>
        <button
          onClick={handleExportExcel}
          disabled={!isReady}
          style={{
            padding: '6px 12px',
            fontSize: 13,
            borderRadius: 6,
            border: '1px solid #059669',
            background: '#059669',
            color: '#fff',
            cursor: !isReady ? 'not-allowed' : 'pointer',
            opacity: !isReady ? 0.5 : 1,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>📤</span> Export Excel
        </button>
        <button
          onClick={handleExportCSV}
          disabled={!isReady}
          style={{
            padding: '6px 12px',
            fontSize: 13,
            borderRadius: 6,
            border: '1px solid #d97706',
            background: '#d97706',
            color: '#fff',
            cursor: !isReady ? 'not-allowed' : 'pointer',
            opacity: !isReady ? 0.5 : 1,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>📄</span> Export CSV
        </button>
        <div style={{ flex: 1 }} />
        {readOnly && (
          <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>🔒 Read-only Mode</span>
        )}
        {!isReady && (
          <span style={{ fontSize: 12, color: '#6b7280' }}>Loading spreadsheet engine...</span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileImport}
        style={{ display: 'none' }}
      />

      {/* Outer wrapper — React owns only this div. Inner mount div (Univer-owned) is injected via DOM API. */}
      <div
        ref={wrapperRef}
        style={{
          flex: 1,
          width: '100%',
          overflow: 'hidden',
          minHeight: 400,
          position: 'relative',
        }}
      >
        {!isReady && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f9fafb',
            zIndex: 10,
            pointerEvents: 'none',
          }}>
            <div style={{ textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Loading Spreadsheet Engine...</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Formula Engine + Excel UI (500+ functions)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { UniverSpreadsheet };
