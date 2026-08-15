import { DataTable, Section } from "../primitives";
import { has } from "../helpers";

const COLUMNS = [
  { key: "label", header: "Skill Domain", width: "52%" },
  { key: "percent", header: "Score (%)", width: "18%", align: "center", bold: true },
  { key: "level", header: "Performance Level", width: "30%", bold: true },
];

const EACATable = ({ rows }) => {
  if (!rows.length) return null;
  const display = rows.map((row) => ({
    ...row,
    percent: has(row.percent) ? `${String(row.percent).replace(/%$/, "")}%` : "",
  }));

  return (
    <Section number="6.5" title="Educational Assessment (EACA) — Domain Score Summary" level={2} when>
      <DataTable columns={COLUMNS} rows={display} />
      <p className="report-note">
        Legend: Strength (≥70%)&nbsp; | &nbsp;Relative Strength (60–69%)&nbsp; | &nbsp;Emerging
        (30–59%)&nbsp; | &nbsp;Significant Delay (&lt;30%)
      </p>
    </Section>
  );
};

export default EACATable;
