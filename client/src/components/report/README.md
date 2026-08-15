# Autism Assessment Report

A4 (210mm × 297mm) print-accurate rendering of the MindSaid Comprehensive Autism
Assessment Report. Replaces the old `public/templates/mindsaid_autism_report.html`
string-substitution viewer used by `ExamineeReportTab`.

## Structure

```
report/
  Report.jsx          orchestrator: builds the model, measures blocks, renders sheets
  blocks.jsx          the report as a flat, ordered list of blocks
  paginate.js         greedy A4 page packer
  report.css          A4 metrics, table borders, page breaks, print rules
  helpers.js          has() / pick() / compact()
  primitives.jsx      Section, Paragraph, BulletList, DataTable, FieldTable, Callout, RecoBlock
  components/         Header, LearnerInformation, Referral, DevelopmentHistory,
                      AssessmentInstrumentTable, BehaviourObservation, ISAATable,
                      GARSTable, DSMTable, VABSTable, EACATable, VBMAPPTable,
                      IntegratedAnalysis, Recommendations, Summary, Declaration, Footer
```

## Pagination

Pages are not fixed. `blocks.jsx` lists the report top to bottom; `Report`
renders that list once into an off-screen sheet of identical width, reads each
block's height from its offset in the flow (so collapsed margins are counted),
and `paginate.js` packs the blocks into A4 sheets. A sheet is filled before the
next one starts, so there is no white space between sections beyond what the
last block on a sheet leaves.

A block with no data renders `null`, measures 0px and drops out of the flow —
which is also why there are no per-page emptiness predicates. `glueNext` keeps a
lead-in heading (the masthead, "6. Assessment Results") attached to the block
below it so it can never be stranded at the foot of a sheet.

To move or add a section, edit the array in `blocks.jsx`; pagination follows.

## Usage

```jsx
<Report student={currentPatient} />        // builds the model internally
<Report model={model} ref={printRef} />    // pre-built model (see below)
```

`ref` is forwarded to the root `.report` element so `html2canvas` / `jsPDF` /
`react-to-print` can capture it. `ExamineeReportTab` rasterises each
`.report-page` separately so PDF page breaks match the on-screen ones.

## Data

`buildExamineeReport(student)` in `src/utils/reportTemplate.js` returns the model.
It wraps the existing `buildExamineeTokens` token pipeline — that stays the single
source of truth for learner-level fields — and adds the repeating lists
(`concerns`, `observations`, `strengths`, `recommendations`, `concessions`) plus
the score tables.

Score tables are read from a `report_scores` JSON column on the student record.
Until that column holds data the corresponding sections are hidden, along with
their headings. Expected shape:

```json
{
  "isaa": { "score": 112, "interpretation": "Moderate Autism", "note": "" },
  "gars": [{ "label": "Social Interaction", "raw": 14, "scaled": 8, "percentile": 25 }],
  "garsIndex": { "autismIndex": 96, "probability": "Very Likely", "supportLevel": "Level 2" },
  "dsm": [{ "met": "Yes", "evidence": "Limited joint attention" }],
  "dsmSummary": "Ayaan Dube meets diagnostic criteria for Autism Spectrum Disorder (299.00 / F84.0)",
  "vabs": [{ "label": "Communication Skills", "standard": 62, "ci": "58–66", "percentile": 1, "descriptor": "Low" }],
  "maladaptive": { "internalising": 18, "externalising": 21 },
  "eaca": [{ "label": "Attending Skills", "percent": 45, "level": "Emerging" }],
  "vbmapp": [{ "label": "Prompt Dependency", "score": 3, "severity": "Moderate" }]
}
```

`gars`, `dsm`, `vabs`, `eaca` and `vbmapp` are positional — entry *n* maps to the
*n*th label in the `GARS_SUBSCALES` / `DSM_CRITERIA` / `VABS_DOMAINS` /
`EACA_DOMAINS` / `VBMAPP_BARRIERS` constants exported from `reportTemplate.js`,
unless the entry supplies its own `label`.

## Empty handling

Every section, table row and bullet is dropped when it has no value. Because
pagination is driven by measured heights, dropped content costs nothing — the
report simply gets shorter rather than leaving gaps or blank sheets.

## Printing

`report.css` sets `@page { size: A4 portrait; margin: 0 }` and gives every
`.report-page` a `page-break-after`. Tables, rows and callouts use
`break-inside: avoid`. The "print everything except the report" rules are scoped
to `body.printing-report`, a class `ExamineeReportTab` adds immediately before
`window.print()` and removes on `afterprint`, so they never affect other screens.
