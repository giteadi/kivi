import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Report from "./report/Report";
import AutismReportDataForm from "./report/AutismReportDataForm";
import { getInitialData } from "./report/autismReportData";
import { buildExamineeReport } from "../utils/reportTemplate";
import { examineeApi } from "../services/examineeApi";

const STORAGE_KEY = (id) => `autismReportData:${id}`;

const parseJson = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); } catch { return fallback; }
};

const getSavedAutismReport = (patient) => {
  const fromDb =
    patient?.autism_report_data ||
    patient?.autismReport ||
    parseJson(patient?.report_form_data)?.autismReport;
  const fromStorage = (() => {
    try { return parseJson(localStorage.getItem(STORAGE_KEY(patient?.id))); } catch { return {}; }
  })();
  return getInitialData({ ...fromDb, ...fromStorage });
};

const ExamineeReportTab = ({ currentPatient }) => {
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [draftData, setDraftData] = useState(() => getSavedAutismReport(currentPatient));
  const viewerRef = useRef(null);

  // Keep the draft in sync if the examinee changes.
  useEffect(() => {
    setDraftData(getSavedAutismReport(currentPatient));
  }, [currentPatient]);

  const patientWithReport = useMemo(() => {
    const base = currentPatient || {};
    return { ...base, autism_report_data: JSON.stringify(draftData) };
  }, [currentPatient, draftData]);

  const model = useMemo(() => buildExamineeReport(patientWithReport), [patientWithReport]);

  const exportPdf = async () => {
    const root = viewerRef.current;
    if (!root || exporting) return;

    setExporting(true);
    try {
      const pages = [...root.querySelectorAll(".report-page")];
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      let first = true;
      for (const page of pages) {
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const image = canvas.toDataURL("image/jpeg", 0.95);
        const imageHeight = (canvas.height * pageWidth) / canvas.width;
        const sheets = Math.max(1, Math.ceil((imageHeight - 1) / pageHeight));

        for (let sheet = 0; sheet < sheets; sheet++) {
          if (!first) pdf.addPage();
          first = false;
          pdf.addImage(image, "JPEG", 0, -sheet * pageHeight, pageWidth, imageHeight);
        }
      }

      const name = [currentPatient?.first_name, currentPatient?.last_name]
        .filter(Boolean).join("_") || "Examinee";
      pdf.save(`${name}_Autism_Report.pdf`);
    } finally {
      setExporting(false);
    }
  };

  const printReport = () => {
    const done = () => {
      document.body.classList.remove("printing-report");
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    document.body.classList.add("printing-report");
    window.print();
  };

  const saveData = async () => {
    if (!currentPatient?.id) return;
    setSaving(true);
    try {
      // Preserve any existing report-form data by fetching it first.
      const existing = await examineeApi.getReportForm(currentPatient.id);
      const reportForm = parseJson(existing?.data, {});
      const next = {
        ...reportForm,
        autismReport: draftData,
      };
      await examineeApi.saveReportForm(currentPatient.id, next);
      localStorage.setItem(STORAGE_KEY(currentPatient.id), JSON.stringify(draftData));
      alert("Report data saved.");
    } catch (err) {
      console.error("Failed to save report data:", err);
      // Still keep the draft locally so the preview is not lost.
      localStorage.setItem(STORAGE_KEY(currentPatient.id), JSON.stringify(draftData));
      alert("Could not save to server, but data is kept in this browser.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 report-no-print">
        <button
          onClick={() => setShowEditor((s) => !s)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          {showEditor ? "Hide Data" : "Add Report Data"}
        </button>
        <button
          onClick={printReport}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Print
        </button>
        <button
          onClick={exportPdf}
          disabled={exporting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-60"
        >
          {exporting ? "Exporting…" : "Export PDF"}
        </button>
      </div>

      {showEditor && (
        <AutismReportDataForm
          initialData={draftData}
          onChange={setDraftData}
          onSave={saveData}
          saving={saving}
        />
      )}

      <div className="overflow-x-auto">
        <Report ref={viewerRef} model={model} />
      </div>
    </div>
  );
};

export default ExamineeReportTab;
