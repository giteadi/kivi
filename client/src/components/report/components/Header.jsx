import { has } from "../helpers";

const CENTRE = "MindSaid Learning";

/** Full masthead — page 1 only. */
export const Masthead = ({ tokens }) => (
  <header className="report-masthead">
    <h1 className="report-masthead__title">Assessment Report</h1>
    <p className="report-masthead__subtitle">
      Psycho-Educational Evaluation&nbsp; | &nbsp;VB-MAPP Assessment&nbsp; | &nbsp;Behaviour Intervention Plan
    </p>
    <p className="report-masthead__meta">
      Prepared by {CENTRE}
      {has(tokens.REPORT_DATE) ? `\u00a0 | \u00a0${tokens.REPORT_DATE}` : ""}
    </p>
  </header>
);

/** Compact running head — pages 2 onward. */
export const RunningHead = ({ tokens }) => (
  <div className="report-runhead">
    <span>Assessment Report</span>
    <span>{[tokens.LEARNER_NAME, tokens.LEARNER_CODE].filter(has).join(" \u00b7 ")}</span>
  </div>
);

export const ConfidentialBanner = () => (
  <div className="report-confidential">
    CONFIDENTIAL — Intended solely for the named learner&rsquo;s educational and therapeutic
    team and caregivers.
  </div>
);

export default Masthead;
