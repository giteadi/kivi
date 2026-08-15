import { DataTable, Paragraph, Section } from "../primitives";
import { has } from "../helpers";

const COLUMNS = [
  { key: "label", header: "Subscale", width: "46%" },
  { key: "raw", header: "Raw Score", width: "18%", align: "center" },
  { key: "scaled", header: "Scaled Score", width: "18%", align: "center" },
  { key: "percentile", header: "Percentile", width: "18%", align: "center" },
];

const GARSTable = ({ rows, index, note }) => {
  const summary = [
    has(index.autismIndex) ? index.autismIndex : "",
    has(index.probability) ? `Probability: ${index.probability}` : "",
    has(index.supportLevel) ? `Support Level: ${index.supportLevel}` : "",
  ].filter(has).join("\u00a0 | \u00a0");

  if (!rows.length && !has(summary)) return null;

  return (
    <Section
      number="6.2"
      title="Gilliam Autism Rating Scale – Third Edition (GARS-3)"
      level={2}
      when
    >
      <Paragraph>
        Parent-rated assessment across six subscales evaluating autism-associated behaviours:
      </Paragraph>
      <DataTable
        columns={COLUMNS}
        rows={rows}
        footer={{ label: "Autism Index (6 scores)", value: summary }}
      />
      <Paragraph>{note}</Paragraph>
    </Section>
  );
};

export default GARSTable;
