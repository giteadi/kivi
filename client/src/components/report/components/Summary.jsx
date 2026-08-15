import { Paragraph, Section } from "../primitives";
import { has } from "../helpers";

// The PDF template says "{{AGE}}-year-old child", but AGE is stored as the full
// age string (e.g. "5 years 9 months"). We use just the year part for the
// summary sentence so the grammar stays correct.
const yearsOnly = (age) => {
  if (!has(age)) return "";
  const match = String(age).match(/(\d+)/);
  return match ? match[1] : "";
};

const Summary = ({ tokens }) => {
  const name = has(tokens.LEARNER_NAME) ? tokens.LEARNER_NAME : "";
  const years = yearsOnly(tokens.AGE);

  const opening = has(name)
    ? [
      name,
      has(years) ? `is a ${years}-year-old child` : "is a child",
      has(tokens.DIAGNOSIS) ? `diagnosed with ${tokens.DIAGNOSIS},` : "",
      "presenting with a complex but coherent profile of strengths and needs confirmed across multiple assessment instruments.",
    ].filter(Boolean).join(" ")
    : "";

  const paragraphs = [opening, tokens.SUMMARY_STRENGTHS_AND_BARRIERS, tokens.SUMMARY_INTERVENTION_PROGNOSIS];

  return (
    <Section number="11." title="Summary" when={paragraphs.some(has)}>
      {paragraphs.map((text, index) => <Paragraph key={index}>{text}</Paragraph>)}
    </Section>
  );
};

export default Summary;
