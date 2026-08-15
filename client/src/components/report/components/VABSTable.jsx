import { DataTable, Paragraph, Section } from "../primitives";
import { has } from "../helpers";

const COLUMNS = [
  { key: "label", header: "Domain", width: "34%" },
  { key: "standard", header: "Std Score", width: "14%", align: "center", bold: true },
  { key: "ci", header: "90% CI", width: "16%", align: "center" },
  { key: "percentile", header: "Percentile", width: "14%", align: "center" },
  { key: "descriptor", header: "Descriptor", width: "22%" },
];

const VABSTable = ({ rows, maladaptive }) => {
  const note = [
    has(maladaptive.internalising) ? `Internalising v-scale = ${maladaptive.internalising}` : "",
    has(maladaptive.externalising) ? `Externalising v-scale = ${maladaptive.externalising}` : "",
  ].filter(has).join("\u00a0 | \u00a0");

  if (!rows.length && !has(note)) return null;

  return (
    <Section
      number="6.4"
      title="Vineland Adaptive Behaviour Scales – Third Edition (VABS-3)"
      level={2}
      when
    >
      <DataTable columns={COLUMNS} rows={rows} />
      <Paragraph>{has(note) ? `Maladaptive Behaviour: ${note}.` : ""}</Paragraph>
    </Section>
  );
};

export default VABSTable;
