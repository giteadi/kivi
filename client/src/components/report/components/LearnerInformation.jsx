import { FieldTable, Section } from "../primitives";
import { has } from "../helpers";

const LearnerInformation = ({ tokens }) => {
  const rows = [
    { label: "Full Name", value: tokens.LEARNER_NAME },
    { label: "Date of Birth", value: tokens.DATE_OF_BIRTH, extra: has(tokens.AGE) ? `Age: ${tokens.AGE}` : "" },
    { label: "Gender", value: tokens.GENDER, extra: has(tokens.NATIONALITY) ? `Nationality: ${tokens.NATIONALITY}` : "" },
    { label: "Primary Diagnosis", value: tokens.DIAGNOSIS },
    { label: "Learner Code", value: tokens.LEARNER_CODE },
    { label: "School", value: tokens.SCHOOL_NAME, extra: has(tokens.GRADE) ? `Grade: ${tokens.GRADE}` : "" },
    { label: "Language at Home", value: tokens.HOME_LANGUAGE, extra: has(tokens.HANDEDNESS) ? `Handedness: ${tokens.HANDEDNESS}` : "" },
    { label: "Assessment Dates", value: tokens.ASSESSMENT_DATES },
    { label: "Assessor", value: "Ms. Krutika Jaggi", extra: "Psychologist & Special Educator" },
    { label: "RCI Registration", value: "A40425", extra: "MindSaid Learning Centre" },
    { label: "VB-MAPP Level", value: tokens.VBMAPP_LEVEL },
    { label: "Parent Contact", value: tokens.PARENT_PHONE, extra: tokens.PARENT_EMAIL },
  ];

  return (
    <Section number="1." title="Learner Information" when={rows.some((r) => has(r.value))}>
      <FieldTable rows={rows} />
    </Section>
  );
};

export default LearnerInformation;
