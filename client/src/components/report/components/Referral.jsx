import { BulletList, Paragraph, Section } from "../primitives";
import { compact, has } from "../helpers";

const Referral = ({ tokens, concerns }) => {
  const list = compact(concerns);
  return (
    <Section
      number="2."
      title="Reason for Referral"
      when={has(tokens.REFERRAL_REASON) || list.length > 0}
    >
      <Paragraph>{tokens.REFERRAL_REASON}</Paragraph>
      {list.length > 0 && <Paragraph>Presenting concerns reported by parents included:</Paragraph>}
      <BulletList items={list} />
    </Section>
  );
};

export default Referral;
