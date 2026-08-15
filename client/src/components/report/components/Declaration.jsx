import { Section } from "../primitives";
import { has } from "../helpers";

const ADDRESS = [
  "MindSaid Learning Centre",
  "401, Royal Sands Building",
  "Behind Infinity Mall, Shastri Nagar",
  "NewLink Road, Andheri West, Mumbai",
];

export const Declaration = ({ tokens }) => (
  <Section number="12." title="Assessor Declaration" when>
    <table className="report-table">
      <colgroup>
        <col style={{ width: "50%" }} />
        <col style={{ width: "50%" }} />
      </colgroup>
      <tbody>
        <tr>
          <td>
            <p className="report-p"><strong>Ms. Krutika Jaggi</strong></p>
            <p className="report-p">Psychologist &amp; Special Educator</p>
            <p className="report-p">M.A. Clinical Psychology&nbsp; | &nbsp;M.Ed (Special Education)</p>
            <p className="report-p">RCI Reg. No. A40425</p>
            <p className="report-p"><strong>MindSaid Learning Centre</strong></p>
          </td>
          <td>
            {has(tokens.REPORT_DATE) && (
              <p className="report-p"><strong>Report Date: {tokens.REPORT_DATE}</strong></p>
            )}
            {has(tokens.ASSESSMENT_DATES) && (
              <p className="report-p">Assessment Dates: {tokens.ASSESSMENT_DATES}</p>
            )}
            {ADDRESS.map((line) => <p className="report-p" key={line}>{line}</p>)}
          </td>
        </tr>
      </tbody>
    </table>

    <h3 className="report-h2">Authorised Signature</h3>
    <table className="report-table report-signature">
      <colgroup>
        <col style={{ width: "34%" }} />
        <col style={{ width: "36%" }} />
        <col style={{ width: "30%" }} />
      </colgroup>
      <thead>
        <tr>
          <th>Signature</th>
          <th>Name &amp; Designation</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="report-signature__cell" />
          <td className="report-signature__cell">Ms. Krutika Jaggi, Psychologist &amp; Special Educator</td>
          <td className="report-signature__cell">{has(tokens.REPORT_DATE) ? tokens.REPORT_DATE : ""}</td>
        </tr>
      </tbody>
    </table>

  </Section>
);

/** Kept separate so the paginator can move it to the next sheet on its own. */
export const Disclaimer = () => (
  <div className="report-disclaimer">
    <p className="report-disclaimer__title">Disclaimer</p>
    The content of this report provides helpful information about the child&rsquo;s current
    academic and/or intellectual functioning and should be considered as a professional
    opinion, not a diagnosis. Results may vary based on external factors. This report is
    intended for educational and therapeutic planning purposes only, and cannot be used for
    legal purposes. The assessor(s) cannot be held liable for any consequences arising from
    the use of this report. This report contains information derived from the VB-MAPP® by
    Mark L. Sundberg, Ph.D.
  </div>
);

export default Declaration;
