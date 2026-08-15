import { DataTable, Section } from "../primitives";
import { has } from "../helpers";

const COLUMNS = [
  { key: "code", header: "Code", width: "9%", align: "center" },
  { key: "criterion", header: "Criterion", width: "41%" },
  { key: "met", header: "Met?", width: "10%", align: "center", bold: true },
  { key: "evidence", header: "Clinical Evidence", width: "40%" },
];

const DSMTable = ({ rows, summary }) => {
  if (!rows.length) return null;
  return (
    <Section number="6.3" title="DSM-5 Diagnostic Criteria Mapping" level={2} when>
      <DataTable columns={COLUMNS} rows={rows} required={["met", "evidence"]} />
      {has(summary) && (
        <div className="report-callout report-callout--center">
          <p className="report-callout__title">DSM-5 Summary</p>
          <p className="report-callout__statement">{summary}</p>
        </div>
      )}
    </Section>
  );
};

export default DSMTable;
