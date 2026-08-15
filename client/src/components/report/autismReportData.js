// Initial schema for the missing autism report fields. Kept separate from the
// form component so Fast Refresh remains enabled.

export const DEFAULT_SCORES = {
  isaa: { score: "", interpretation: "", note: "" },
  gars: [
    { raw: "", scaled: "", percentile: "" },
    { raw: "", scaled: "", percentile: "" },
    { raw: "", scaled: "", percentile: "" },
    { raw: "", scaled: "", percentile: "" },
    { raw: "", scaled: "", percentile: "" },
    { raw: "", scaled: "", percentile: "" },
  ],
  garsIndex: { autismIndex: "", probability: "", supportLevel: "" },
  dsm: [
    { met: "", evidence: "" }, { met: "", evidence: "" },
    { met: "", evidence: "" }, { met: "", evidence: "" },
    { met: "", evidence: "" }, { met: "", evidence: "" },
    { met: "", evidence: "" }, { met: "", evidence: "" },
    { met: "", evidence: "" }, { met: "", evidence: "" },
  ],
  dsmSummary: "",
  vabs: [
    { standard: "", ci: "", percentile: "", descriptor: "" },
    { standard: "", ci: "", percentile: "", descriptor: "" },
    { standard: "", ci: "", percentile: "", descriptor: "" },
    { standard: "", ci: "", percentile: "", descriptor: "" },
    { standard: "", ci: "", percentile: "", descriptor: "" },
  ],
  maladaptive: { internalising: "", externalising: "" },
  eaca: [
    { percent: "", level: "" }, { percent: "", level: "" },
    { percent: "", level: "" }, { percent: "", level: "" },
    { percent: "", level: "" }, { percent: "", level: "" },
    { percent: "", level: "" }, { percent: "", level: "" },
    { percent: "", level: "" },
  ],
  vbmapp: [
    { score: "", severity: "" }, { score: "", severity: "" },
    { score: "", severity: "" }, { score: "", severity: "" },
    { score: "", severity: "" }, { score: "", severity: "" },
    { score: "", severity: "" }, { score: "", severity: "" },
    { score: "", severity: "" }, { score: "", severity: "" },
  ],
};

export const DEFAULT_METADATA = {
  vbmappLevel: "",
  presentation: "",
  garsClinicalNote: "",
  milestonesScore: "",
  barriersTotal: "",
  diagnosticCode: "",
  diagnosticQualifiers: "",
  crossAssessmentCoherence: "",
  dsmMeets: "meets",
  summaryStrengthsAndBarriers: "",
  summaryInterventionPrognosis: "",
  recommendations: { immediate: ["", "", ""], medium: ["", "", ""], monitoring: ["", "", ""] },
  concessions: ["", "", "", ""],
};

export const getInitialData = (existing = {}) => ({
  scores: { ...DEFAULT_SCORES, ...existing.scores },
  metadata: { ...DEFAULT_METADATA, ...existing.metadata },
});
