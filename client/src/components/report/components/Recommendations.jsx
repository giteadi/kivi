import { BulletList, RecoBlock, Section } from "../primitives";
import { compact } from "../helpers";

export const Recommendations = ({ recommendations }) => {
  const immediate = compact(recommendations.immediate);
  const medium = compact(recommendations.medium);
  const monitoring = compact(recommendations.monitoring);

  return (
    <Section
      number="9."
      title="Recommendations"
      when={immediate.length + medium.length + monitoring.length > 0}
    >
      <RecoBlock title="Immediate Priorities — Weeks 1–8" items={immediate} />
      <RecoBlock title="Medium-Term Goals — Weeks 8–16" items={medium} />
      <RecoBlock title="Ongoing Monitoring" items={monitoring} />
    </Section>
  );
};

export const Concessions = ({ concessions }) => {
  const list = compact(concessions);
  return (
    <Section number="10." title="School Concessions / Accommodations" when={list.length > 0}>
      <BulletList items={list} />
    </Section>
  );
};

export default Recommendations;
