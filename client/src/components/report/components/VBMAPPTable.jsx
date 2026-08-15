import { DataTable, Paragraph, Section } from "../primitives";
import { has } from "../helpers";

const COLUMNS = [
  { key: "label", header: "Barrier Domain", width: "58%" },
  { key: "score", header: "Score", width: "14%", align: "center", bold: true },
  { key: "severity", header: "Severity", width: "28%", bold: true },
];

const VBMAPPTable = ({ tokens, rows }) => {
  const intro = [
    has(tokens.MILESTONES_SCORE) ? `Milestones Score: ${tokens.MILESTONES_SCORE}.` : "",
    has(tokens.BARRIERS_TOTAL) ? `Total Barriers Score: ${tokens.BARRIERS_TOTAL}.` : "",
  ].filter(Boolean).join(" ");

  if (!rows.length && !has(intro)) return null;

  return (
    <Section number="6.6" title="VB-MAPP Assessment Results" level={2} when>
      <Paragraph>{intro}</Paragraph>
      <DataTable columns={COLUMNS} rows={rows} />
    </Section>
  );
};

export default VBMAPPTable;
