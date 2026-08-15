import { DataTable, Section } from "../primitives";
import { has } from "../helpers";

const COLUMNS = [
  { key: "label", header: "ISAA Total Score", width: "40%" },
  { key: "value", header: "\u00a0", width: "60%" },
];

const ISAATable = ({ isaa }) => {
  const value = [isaa.score, isaa.interpretation].filter(has).join(" — ");
  if (!has(value)) return null;

  return (
    <Section
      number="6.1"
      title="Indian Scale for Assessment of Autism (ISAA)"
      level={2}
      when
    >
      <DataTable columns={COLUMNS} rows={[{ label: "ISAA Total Score", value }]} required={["value"]} />
      {has(isaa.note) && <p className="report-note">{isaa.note}</p>}
    </Section>
  );
};

export default ISAATable;
