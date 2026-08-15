import { Paragraph, Section } from "../primitives";
import { has } from "../helpers";

const SUBSECTIONS = [
  ["3.1", "Family Background", "FAMILY_BACKGROUND"],
  ["3.2", "Pregnancy & Birth History", "BIRTH_HISTORY"],
  ["3.3", "Developmental Milestones", "DEVELOPMENTAL_MILESTONES"],
  ["3.4", "Educational History", "EDUCATIONAL_HISTORY"],
  ["3.5", "Current Therapies", "CURRENT_THERAPIES"],
];

const DevelopmentHistory = ({ tokens }) => (
  <Section
    number="3."
    title="Background & Developmental History"
    when={SUBSECTIONS.some(([, , token]) => has(tokens[token]))}
  >
    {SUBSECTIONS.map(([number, title, token]) => (
      <Section key={number} number={number} title={title} level={2} when={has(tokens[token])}>
        <Paragraph>{tokens[token]}</Paragraph>
      </Section>
    ))}
  </Section>
);

export default DevelopmentHistory;
