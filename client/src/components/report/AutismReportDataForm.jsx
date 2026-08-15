import { useState } from "react";
import { getInitialData } from "./autismReportData";

const listToText = (arr) => (arr || []).filter(Boolean).join("\n");
const textToList = (text) => text.split("\n").map((s) => s.trim()).filter(Boolean);

export default function AutismReportDataForm({ initialData, onChange, onSave, saving }) {
  const [data, setData] = useState(() => getInitialData(initialData));
  const [showJson, setShowJson] = useState(false);

  const update = (path, value) => {
    const next = JSON.parse(JSON.stringify(data));
    const keys = path.split(".");
    let node = next;
    for (let i = 0; i < keys.length - 1; i++) node = node[keys[i]];
    node[keys[keys.length - 1]] = value;
    setData(next);
    onChange(next);
  };

  const setList = (path, text) => update(path, textToList(text));

  const { metadata, scores } = data;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Autism Report Data</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowJson((s) => !s)}
            className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            {showJson ? "Form View" : "JSON View"}
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {showJson ? (
        <JsonView data={data} onChange={setData} onApply={onChange} />
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          <Field label="VB-MAPP Level" value={metadata.vbmappLevel} onChange={(v) => update("metadata.vbmappLevel", v)} />
          <Field label="Presentation" value={metadata.presentation} onChange={(v) => update("metadata.presentation", v)} />
          <Field label="ISAA Score" value={scores.isaa.score} onChange={(v) => update("scores.isaa.score", v)} />
          <Field label="ISAA Interpretation" value={scores.isaa.interpretation} onChange={(v) => update("scores.isaa.interpretation", v)} />
          <Field label="GARS-3 Autism Index" value={scores.garsIndex.autismIndex} onChange={(v) => update("scores.garsIndex.autismIndex", v)} />
          <Field label="GARS-3 Probability" value={scores.garsIndex.probability} onChange={(v) => update("scores.garsIndex.probability", v)} />
          <Field label="GARS-3 Support Level" value={scores.garsIndex.supportLevel} onChange={(v) => update("scores.garsIndex.supportLevel", v)} />
          <Field label="GARS-3 Clinical Note" value={metadata.garsClinicalNote} onChange={(v) => update("metadata.garsClinicalNote", v)} />
          <Field label="DSM-5 Summary" value={scores.dsmSummary} onChange={(v) => update("scores.dsmSummary", v)} />
          <Field label="Milestones Score" value={metadata.milestonesScore} onChange={(v) => update("metadata.milestonesScore", v)} />
          <Field label="Barriers Total" value={metadata.barriersTotal} onChange={(v) => update("metadata.barriersTotal", v)} />
          <Field label="Diagnostic Code" value={metadata.diagnosticCode} onChange={(v) => update("metadata.diagnosticCode", v)} />
          <Field label="Diagnostic Qualifiers" value={metadata.diagnosticQualifiers} onChange={(v) => update("metadata.diagnosticQualifiers", v)} />
          <Select label="DSM-5 Meets Criteria" value={metadata.dsmMeets} options={["meets", "does not meet"]} onChange={(v) => update("metadata.dsmMeets", v)} />
          <Text label="Cross-Assessment Coherence" value={metadata.crossAssessmentCoherence} onChange={(v) => update("metadata.crossAssessmentCoherence", v)} />
          <Text label="Summary — Strengths & Barriers" value={metadata.summaryStrengthsAndBarriers} onChange={(v) => update("metadata.summaryStrengthsAndBarriers", v)} />
          <Text label="Summary — Intervention & Prognosis" value={metadata.summaryInterventionPrognosis} onChange={(v) => update("metadata.summaryInterventionPrognosis", v)} />

          <div className="border-t pt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Recommendations (one per line)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <List label="Immediate" value={listToText(metadata.recommendations.immediate)} onChange={(t) => setList("metadata.recommendations.immediate", t)} />
              <List label="Medium" value={listToText(metadata.recommendations.medium)} onChange={(t) => setList("metadata.recommendations.medium", t)} />
              <List label="Monitoring" value={listToText(metadata.recommendations.monitoring)} onChange={(t) => setList("metadata.recommendations.monitoring", t)} />
            </div>
          </div>

          <List label="Concessions (one per line)" value={listToText(metadata.concessions)} onChange={(t) => setList("metadata.concessions", t)} />

          <p className="text-xs text-gray-500 pt-2">
            For full score tables (GARS-3 subscales, DSM-5 criteria, VABS-3, EACA, VB-MAPP barriers), use the JSON View.
          </p>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
      >
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function Text({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <textarea
        rows={2}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </div>
  );
}

function List({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </div>
  );
}

function JsonView({ data, onChange, onApply }) {
  const [text, setText] = useState(() => JSON.stringify(data, null, 2));

  const apply = () => {
    try {
      const parsed = JSON.parse(text);
      onChange(getInitialData(parsed));
      onApply(parsed);
    } catch (e) {
      alert("Invalid JSON: " + e.message);
    }
  };

  return (
    <div>
      <textarea
        rows={12}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
      <div className="flex justify-end mt-2">
        <button
          onClick={apply}
          className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          Apply to Report
        </button>
      </div>
    </div>
  );
}
