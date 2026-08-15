// reportTemplate.js
// Fills {{TOKEN}} placeholders in an imported report template with examinee data,
// then prunes anything that stayed empty so exports contain no blank rows/sections.

const MISSING = "\u0000__MISSING__\u0000";

const has = (value) => value !== undefined && value !== null && String(value).trim() !== "";

// ─── small helpers ────────────────────────────────────────────────────────────
const parseJson = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); } catch { return fallback; }
};

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const calcAge = (dob) => {
  if (!dob) return "";
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return "";
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  if (today.getDate() < birth.getDate()) months--;
  if (months < 0) { years--; months += 12; }
  if (years < 0) return "";
  return months ? `${years} years ${months} months` : `${years} years`;
};

// "attentionHyperactivity" → "Attention Hyperactivity"
const humanise = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();

// Collect the checked labels out of an { key: bool, other: bool, otherText: "" } group
const checkedLabels = (group) => {
  if (!group || typeof group !== "object") return [];
  return Object.entries(group).flatMap(([key, val]) => {
    if (key === "otherText") return [];
    if (key === "other") return val && group.otherText ? [group.otherText] : [];
    return val === true ? [humanise(key)] : [];
  });
};

const joinSentence = (items) => {
  const list = items.filter(Boolean);
  if (!list.length) return "";
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}`;
};

// ─── token map ────────────────────────────────────────────────────────────────
/**
 * Build the {{TOKEN}} → value map from a student record as returned by the API
 * (snake_case columns + JSON blobs saved by the Add/Edit Examinee forms).
 */
export function buildExamineeTokens(student = {}) {
  const evaluation = parseJson(student.evaluation_data);
  const diagnosis = parseJson(student.diagnosis_data);
  const history = parseJson(student.history_data);

  const language = history.languageSampleReportData || {};
  const education = history.educationSampleReportData || {};
  const health = history.healthSampleReportData || {};

  const fullName = [student.first_name, student.middle_name, student.last_name]
    .filter(Boolean).join(" ").trim();
  const firstName = student.first_name || fullName;

  // Every diagnosis group the user ticked, flattened into one readable list
  const diagnoses = Object.values(diagnosis).flatMap(checkedLabels);

  // Reasons for testing, used both as referral reason and presenting concerns
  const concerns = Object.entries(evaluation).flatMap(([group, values]) =>
    checkedLabels(values).map((label) => `${humanise(group)}: ${label}`)
  );

  const referralReasons = joinSentence(
    [
      history.schoolRelatedConcerns && "school-related concerns",
      history.speechConcerns && "speech concerns",
      history.languageConcerns && "language concerns",
      history.socialEmotionalConcerns && "social-emotional concerns",
      history.cognitiveConcerns && "cognitive concerns",
      history.physicalConcerns && "physical concerns",
      history.vocationalRehabilitationLegal && "vocational / rehabilitation concerns",
      history.otherReason && history.otherReasonText,
    ].filter(Boolean)
  );

  const referralSource = [history.referralSourceName,
    history.referralSourceRole === "other" ? history.referralSourceRoleOther : history.referralSourceRole]
    .filter(Boolean).join(", ");

  const referralReason = [
    referralSource && `${firstName} was referred by ${referralSource}.`,
    referralReasons && `Assessment was requested due to ${referralReasons}.`,
    student.comment,
  ].filter(Boolean).join(" ");

  const therapies = [
    student.requires_therapy && "Therapy services",
    student.requires_assessment && "Assessment services",
  ].filter(Boolean).join(", ");

  const tokens = {
    REPORT_DATE: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
    LEARNER_NAME: fullName,
    DATE_OF_BIRTH: formatDate(student.date_of_birth),
    AGE: calcAge(student.date_of_birth),
    GENDER: student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : "",
    DIAGNOSIS: diagnoses.join(", "),
    LEARNER_CODE: student.student_id || "",
    SCHOOL_NAME: student.school_name || education.schoolName || "",
    GRADE: student.grade || education.currentYear || "",
    HOME_LANGUAGE: language.primaryLanguage || student.language_of_testing || "",
    PARENT_PHONE: student.emergency_contact_phone || student.phone || "",
    PARENT_EMAIL: student.email || "",
    ASSESSMENT_DATES: formatDate(student.registration_date),
    REFERRAL_REASON: referralReason,
    FAMILY_BACKGROUND: history.personalSampleReportSentence || history.personalNotes || "",
    BIRTH_HISTORY: history.languageSampleReportSentence || "",
    DEVELOPMENTAL_MILESTONES: history.developmentalMilestonesOther ? history.developmentalMilestonesOtherText : "",
    EDUCATIONAL_HISTORY: history.educationSampleReportSentence || "",
    CURRENT_THERAPIES: therapies,
    PRESENTATION: "",
    SUMMARY_STRENGTHS_AND_BARRIERS: (education.personalStrengths || []).join(", "),
    SUMMARY_INTERVENTION_PROGNOSIS: history.employmentSampleReportSentence || "",
    DIAGNOSIS_NAME: diagnoses[0] || "",
    NATIONALITY: student.nationality || "",
    HANDEDNESS: student.handedness || "",
    VBMAPP_LEVEL: student.vbmapp_level || "",
  };

  // Numbered bullet lists — CONCERN_1…n, STRENGTH_1…n, OBSERVATION_1…n
  concerns.forEach((c, i) => { tokens[`CONCERN_${i + 1}`] = c; });
  (education.personalStrengths || []).forEach((s, i) => { tokens[`STRENGTH_${i + 1}`] = s; });
  (health.sensoryHistory || []).forEach((s, i) => { tokens[`OBSERVATION_${i + 1}`] = s; });

  return tokens;
}

// ─── structured report model ──────────────────────────────────────────────────
// Pull "CONCERN_1", "CONCERN_2", … out of a token map, in order, stopping at the
// first gap so a missing middle entry never swallows the rest of the list.
const numberedList = (tokens, prefix) => {
  const items = [];
  for (let i = 1; ; i++) {
    const value = tokens[`${prefix}_${i}`];
    if (value === undefined) break;
    if (String(value).trim()) items.push(String(value).trim());
  }
  return items;
};

/**
 * Score tables (GARS-3, DSM-5, VABS-3, EACA, VB-MAPP) are not part of the
 * examinee record yet. They are read from `student.report_scores` — a JSON blob
 * with the same shape — so the tables light up the moment that data exists and
 * stay hidden until then.
 */
const scoreRows = (source, labels, keys) =>
  (Array.isArray(source) ? source : [])
    .map((entry, index) => {
      const row = { label: entry.label || labels[index] || "" };
      keys.forEach((key) => { row[key] = entry[key] ?? ""; });
      return row;
    })
    .filter((row) => keys.some((key) => String(row[key]).trim() !== ""));

export const GARS_SUBSCALES = [
  "Restricted / Repetitive Behaviours", "Social Interaction", "Social Communication",
  "Emotional Responses", "Cognitive Style", "Maladaptive Speech",
];

export const DSM_CRITERIA = [
  ["A1", "Deficits in social-emotional reciprocity"],
  ["A2", "Deficits in nonverbal communicative behaviours"],
  ["A3", "Deficits in developing/maintaining relationships"],
  ["B1", "Stereotyped/repetitive motor, object, or speech"],
  ["B2", "Insistence on sameness / inflexible routines"],
  ["B3", "Highly restricted, fixated interests"],
  ["B4", "Hyper/hypo reactivity to sensory input"],
  ["C", "Symptoms present in early developmental period"],
  ["D", "Symptoms cause significant functional impairment"],
  ["E", "Not better explained by intellectual disability alone"],
];

export const VABS_DOMAINS = [
  "Communication Skills", "Daily Living Skills", "Socialization",
  "Motor Skills", "Adaptive Behaviour Composite",
];

export const EACA_DOMAINS = [
  "Attending Skills", "Imitation Skills", "Fine Motor Skills", "Receptive Language",
  "Expressive Language", "Cognitive Skills", "Daily Living Skills", "Behaviour Skills",
  "Academic Skills",
];

export const VBMAPP_BARRIERS = [
  "Weak / Atypical Motivating Operations", "Prompt Dependency",
  "Response Requirement Weakens MO", "Impaired Mand Skills", "Impaired Tact Skills",
  "Impaired Listener Responding", "Impaired Intraverbal Skills", "Impaired Social Skills",
  "Self-Stimulation", "Sensory Defensiveness",
];

export const ASSESSMENT_INSTRUMENTS = [
  ["Indian Scale for Assessment of Autism (ISAA)", "Autism severity rating using Indian normative data"],
  ["Gilliam Autism Rating Scale – 3rd Edition (GARS-3)", "Multi-domain autism characterisation across 6 subscales"],
  ["DSM-5 Diagnostic Checklist – Autism", "Criterion-by-criterion diagnostic mapping"],
  ["Vineland Adaptive Behaviour Scales – 3rd Edition (VABS-3)", "Adaptive functioning: communication, DLS, socialisation, motor"],
  ["Educational Assessment for Children with Autism (EACA)", "Domain-based functional skill profile across 9 domains"],
  ["VB-MAPP (Verbal Behaviour Milestones & Placement Programme)", "Verbal operant milestones and barriers to learning"],
  ["ADHD Test – 2nd Edition (AD/HDT-2)", "Attention deficit and hyperactivity screening"],
];

/**
 * Build the structured model the React report renders from. Wraps
 * `buildExamineeTokens` so the token pipeline stays the single source of truth
 * for learner-level fields, and adds the repeating lists and score tables.
 */
export function buildExamineeReport(student = {}) {
  const tokens = buildExamineeTokens(student);

  // Some report data may live in a dedicated JSON field, or nested inside the
  // generic report form backup. We merge both in here without touching the
  // intake/report-form sections.
  const reportForm = parseJson(student.report_form_data);
  const rawAutism =
    student.autism_report_data ||
    student.autismReport ||
    reportForm?.autismReport ||
    {};
  const autismReport = parseJson(rawAutism);

  const scores = { ...parseJson(student.report_scores), ...(autismReport.scores || {}) };

  // Overlay any autism-report metadata (VB-MAPP level, scores, recommendations,
  // diagnostic qualifiers, etc.) on top of the base tokens.
  const md = autismReport.metadata || {};
  const metadataTokens = {
    VBMAPP_LEVEL: md.vbmappLevel,
    PRESENTATION: md.presentation,
    GARS_CLINICAL_NOTE: md.garsClinicalNote,
    MILESTONES_SCORE: md.milestonesScore,
    BARRIERS_TOTAL: md.barriersTotal,
    DSM_CODE: md.diagnosticCode,
    DIAGNOSTIC_QUALIFIERS: md.diagnosticQualifiers,
    CROSS_ASSESSMENT_COHERENCE_NARRATIVE: md.crossAssessmentCoherence,
    SUMMARY_STRENGTHS_AND_BARRIERS: md.summaryStrengthsAndBarriers,
    SUMMARY_INTERVENTION_PROGNOSIS: md.summaryInterventionPrognosis,
  };
  Object.entries(metadataTokens).forEach(([key, value]) => {
    if (has(value)) tokens[key] = String(value);
  });

  // If a DSM-5 "meets / does not meet" flag is supplied, build the summary
  // sentence the template expects when the user did not type the full one.
  const dsmMeets = has(md.dsmMeets) ? String(md.dsmMeets).trim().toLowerCase() : "";
  if (dsmMeets && (!has(scores.dsmSummary) || scores.dsmSummary?.toLowerCase() === "{{dsm_summary}}")) {
    const meetsText = dsmMeets === "yes" || dsmMeets === "true" || dsmMeets === "meets"
      ? "meets"
      : "does not meet";
    tokens.DSM_SUMMARY = `${tokens.LEARNER_NAME || "The learner"} ${meetsText} diagnostic criteria for Autism Spectrum Disorder (299.00 / F84.0).`;
    if (!tokens.DSM_CODE) tokens.DSM_CODE = "299.00 / F84.0";
  }

  const fillList = (arr, prefix) =>
    (arr || []).filter(has).forEach((item, index) => { tokens[`${prefix}_${index + 1}`] = item; });

  fillList(md.recommendations?.immediate, "IMMEDIATE_REC");
  fillList(md.recommendations?.medium, "MEDIUM_REC");
  fillList(md.recommendations?.monitoring, "MONITORING");
  fillList(md.concessions, "CONCESSION");

  return {
    tokens,
    concerns: numberedList(tokens, "CONCERN"),
    observations: numberedList(tokens, "OBSERVATION"),
    strengths: numberedList(tokens, "STRENGTH"),
    isaa: scores.isaa || {},
    gars: scoreRows(scores.gars, GARS_SUBSCALES, ["raw", "scaled", "percentile"]),
    garsIndex: scores.garsIndex || {},
    dsm: DSM_CRITERIA.map(([code, criterion], index) => ({
      code, criterion,
      met: scores.dsm?.[index]?.met || "",
      evidence: scores.dsm?.[index]?.evidence || "",
    })).filter((row) => row.met || row.evidence),
    dsmSummary: has(scores.dsmSummary) ? scores.dsmSummary : tokens.DSM_SUMMARY || "",
    vabs: scoreRows(scores.vabs, VABS_DOMAINS, ["standard", "ci", "percentile", "descriptor"]),
    maladaptive: scores.maladaptive || {},
    eaca: scoreRows(scores.eaca, EACA_DOMAINS, ["percent", "level"]),
    vbmapp: scoreRows(scores.vbmapp, VBMAPP_BARRIERS, ["score", "severity"]),
    recommendations: {
      immediate: numberedList(tokens, "IMMEDIATE_REC"),
      medium: numberedList(tokens, "MEDIUM_REC"),
      monitoring: numberedList(tokens, "MONITORING"),
    },
    concessions: numberedList(tokens, "CONCESSION"),
  };
}

// ─── template filling + pruning ───────────────────────────────────────────────
const TOKEN_RE = /\{\{\s*([^{}]+?)\s*\}\}/g;

const clean = (text) => text.split(MISSING).join("").trim();

// A cell is throwaway once its value is gone: empty, or nothing but a stray
// label / separator such as "Age:" or "— Probability: | Support Level:"
const isFillerCell = (cell) => {
  const text = clean(cell.textContent);
  if (!text) return true;
  const stripped = text
    .replace(/[A-Za-z][A-Za-z /()&%-]{0,30}:/g, "")
    .replace(/[•\-–—|:,;.%\s]/g, "");
  return stripped === "";
};

const headingDepth = (text) => {
  const match = text.trim().match(/^(\d+(?:\.\d+)*)[.)]?\s+\S/);
  return match ? match[1].split(".").length : 0;
};

function substitute(root, tokens) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    if (!node.textContent.includes("{{")) return;
    node.textContent = node.textContent.replace(TOKEN_RE, (_, rawKey) => {
      const key = rawKey.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");
      const value = tokens[key];
      return value !== undefined && String(value).trim() !== "" ? String(value) : MISSING;
    });
  });
}

function pruneEmpty(root) {
  const originalRows = new Map(
    [...root.querySelectorAll("table")].map((t) => [t, t.querySelectorAll("tr").length])
  );

  // 1. Sentences that lost their value, and the bullets/paragraphs left blank
  root.querySelectorAll("li, p, h1, h2, h3, h4, h5, h6").forEach((el) => {
    if (!el.textContent.includes(MISSING)) return;
    if (el.closest("td, th") === null) {
      const kept = el.textContent
        .split(/(?<=[.!?])\s+/)
        .filter((sentence) => !sentence.includes(MISSING))
        .join(" ");
      el.textContent = kept;
    }
    if (clean(el.textContent) === "") el.remove();
  });

  // 2. Table rows: drop the row once every value cell lost its content
  root.querySelectorAll("tr").forEach((tr) => {
    if (!tr.textContent.includes(MISSING)) return;
    const cells = [...tr.children];
    cells.forEach((cell) => {
      if (cell.textContent.includes(MISSING) && isFillerCell(cell)) cell.textContent = "";
    });
    const hasValue = cells.slice(1).some((cell) => clean(cell.textContent) !== "");
    if (!hasValue) tr.remove();
  });

  // 3. Tables left with nothing but their header row
  originalRows.forEach((count, table) => {
    const left = table.querySelectorAll("tr").length;
    if (left === 0 || (count > 1 && left <= 1)) table.remove();
  });

  // 4. Lead-in lines ("Presenting concerns included:") whose list vanished
  root.querySelectorAll("p, h1, h2, h3, h4, h5, h6").forEach((el) => {
    if (!/[:：]\s*$/.test(el.textContent.trim())) return;
    const next = el.nextElementSibling;
    if (!next || !["UL", "OL", "TABLE"].includes(next.tagName)) {
      if (!next) el.remove();
      return;
    }
    if (!next.querySelector("li, tr")) { next.remove(); el.remove(); }
  });

  // 5. Numbered sections ("6.2 Gilliam…") whose whole body is gone
  const children = [...root.children];
  children.forEach((el, index) => {
    if (!el.isConnected) return;
    const depth = headingDepth(el.textContent || "");
    if (!depth) return;
    let hasBody = false;
    for (let i = index + 1; i < children.length; i++) {
      const sibling = children[i];
      if (!sibling.isConnected) continue;
      const siblingDepth = headingDepth(sibling.textContent || "");
      if (siblingDepth && siblingDepth <= depth) break;
      if (sibling.querySelector("img") || clean(sibling.textContent) !== "") { hasBody = true; break; }
    }
    if (!hasBody) el.remove();
  });

  // 6. Strip any leftover markers and the blank paragraphs they left behind
  root.querySelectorAll("*").forEach((el) => {
    if (el.children.length === 0 && el.textContent.includes(MISSING)) {
      el.textContent = clean(el.textContent);
    }
  });
  root.innerHTML = root.innerHTML.split(MISSING).join("");
}

/**
 * Replace every {{TOKEN}} in `html` using `tokens`, dropping the rows, bullets,
 * tables and sections whose values were never filled in.
 */
export function fillTemplateHtml(html, tokens) {
  if (!html) return html;
  const root = document.createElement("div");
  root.innerHTML = html;
  substitute(root, tokens);
  pruneEmpty(root);
  return root.innerHTML;
}

/**
 * Last pass before an export: clear every placeholder that is still unfilled so
 * the document never ships with `{{TOKEN}}` text or the blank rows behind it.
 */
export function pruneUnfilledSheets(sheets) {
  return fillTemplateSheets(sheets, {});
}

/** Apply `fillTemplateHtml` across a TemplateManager sheets map. */
export function fillTemplateSheets(sheets, tokens) {
  const filled = {};
  Object.entries(sheets || {}).forEach(([name, rows]) => {
    if (rows?.[0]?.[0] === "__html__") {
      filled[name] = [["__html__", fillTemplateHtml(rows[0][1] || "", tokens)]];
      return;
    }
    filled[name] = (rows || []).map((row) =>
      (row || []).map((cell) =>
        typeof cell === "string"
          ? cell.replace(TOKEN_RE, (_, key) => {
              const value = tokens[key.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_")];
              return value !== undefined && String(value).trim() !== "" ? String(value) : "";
            })
          : cell
      )
    );
  });
  return filled;
}
