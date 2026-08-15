import { BulletList, Callout, Paragraph, Section } from "../primitives";
import { compact, has } from "../helpers";

export const Analysis = ({ tokens, strengths, concerns }) => {
  const strengthList = compact(strengths);
  const concernList = compact(concerns);
  const narrative = tokens.CROSS_ASSESSMENT_COHERENCE_NARRATIVE;

  return (
    <Section
      number="7."
      title="Integrated Analysis — Correlation of Findings"
      when={strengthList.length > 0 || concernList.length > 0 || has(narrative)}
    >
      <Section number="7.1" title="Strengths" level={2} when={strengthList.length > 0}>
        <BulletList items={strengthList} />
      </Section>
      <Section number="7.2" title="Areas of Significant Concern" level={2} when={concernList.length > 0}>
        <BulletList items={concernList} />
      </Section>
      <Section number="7.3" title="Cross-Assessment Coherence" level={2} when={has(narrative)}>
        <Paragraph>{narrative}</Paragraph>
      </Section>
    </Section>
  );
};

export const DiagnosticImpression = ({ tokens }) => {
  const value = [tokens.DSM_CODE, tokens.DIAGNOSIS_NAME].filter(has).join(" — ");
  return (
    <Section number="8." title="Diagnostic Impression" when={has(value)}>
      <Callout title="Provisional Diagnosis" value={value} note={tokens.DIAGNOSTIC_QUALIFIERS} />
    </Section>
  );
};

export default Analysis;
