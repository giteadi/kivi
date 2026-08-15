import { BulletList, Paragraph, Section } from "../primitives";
import { compact, has } from "../helpers";

const BehaviourObservation = ({ tokens, observations }) => {
  const list = compact(observations);
  const name = has(tokens.LEARNER_NAME) ? tokens.LEARNER_NAME : "The learner";
  const intro = has(tokens.PRESENTATION)
    ? `${name} presented as ${tokens.PRESENTATION}.`
    : "";

  return (
    <Section
      number="5."
      title="Behavioural Observations During Assessment"
      when={list.length > 0 || has(intro)}
    >
      <Paragraph>
        {[intro, list.length ? "Key observations across assessment sessions:" : ""]
          .filter(Boolean).join(" ")}
      </Paragraph>
      <BulletList items={list} />
      <Paragraph>
        {`Overall, the results of this evaluation are considered a true reflection of ${name}\u2019s current level of functioning.`}
      </Paragraph>
    </Section>
  );
};

export default BehaviourObservation;
