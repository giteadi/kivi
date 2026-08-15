import { ASSESSMENT_INSTRUMENTS } from "../../../utils/reportTemplate";
import { DataTable, Section } from "../primitives";

const COLUMNS = [
  { key: "instrument", header: "Assessment Instrument", width: "46%" },
  { key: "purpose", header: "Purpose / Rationale", width: "54%" },
];

const AssessmentInstrumentTable = () => (
  <Section number="4." title="Assessment Instruments Administered">
    <DataTable
      columns={COLUMNS}
      rows={ASSESSMENT_INSTRUMENTS.map(([instrument, purpose]) => ({ instrument, purpose }))}
    />
  </Section>
);

export default AssessmentInstrumentTable;
