// The report as a flat, ordered list of blocks. `Report` measures these and
// packs them into A4 sheets, so a sheet is only as empty as the last block
// forces it to be — no more fixed pages with half a page of white space.
//
// A block that has no data renders `null` and measures 0px, so it simply
// disappears from the flow. `glueNext` keeps a lead-in heading attached to the
// block underneath it.

import AssessmentInstrumentTable from "./components/AssessmentInstrumentTable";
import BehaviourObservation from "./components/BehaviourObservation";
import Declaration, { Disclaimer } from "./components/Declaration";
import DevelopmentHistory from "./components/DevelopmentHistory";
import DSMTable from "./components/DSMTable";
import EACATable from "./components/EACATable";
import GARSTable from "./components/GARSTable";
import { ConfidentialBanner, Masthead } from "./components/Header";
import Analysis, { DiagnosticImpression } from "./components/IntegratedAnalysis";
import ISAATable from "./components/ISAATable";
import LearnerInformation from "./components/LearnerInformation";
import { Concessions, Recommendations } from "./components/Recommendations";
import Referral from "./components/Referral";
import Summary from "./components/Summary";
import VABSTable from "./components/VABSTable";
import VBMAPPTable from "./components/VBMAPPTable";
import { Section } from "./primitives";
import { has } from "./helpers";

/** True when section 6 has at least one result worth a heading. */
const hasResults = (model) =>
  has(model.isaa.score) || has(model.isaa.interpretation) ||
  model.gars.length > 0 || has(model.garsIndex.autismIndex) ||
  model.dsm.length > 0 || model.vabs.length > 0 ||
  has(model.maladaptive.internalising) || has(model.maladaptive.externalising) ||
  model.eaca.length > 0 || model.vbmapp.length > 0 ||
  has(model.tokens.MILESTONES_SCORE) || has(model.tokens.BARRIERS_TOTAL);

export const buildBlocks = (model) => {
  const { tokens } = model;

  return [
    {
      id: "masthead",
      glueNext: true,
      node: (
        <>
          <Masthead tokens={tokens} />
          <ConfidentialBanner />
        </>
      ),
    },
    { id: "learner", node: <LearnerInformation tokens={tokens} /> },
    { id: "referral", node: <Referral tokens={tokens} concerns={model.concerns} /> },
    { id: "history", node: <DevelopmentHistory tokens={tokens} /> },
    { id: "instruments", node: <AssessmentInstrumentTable /> },
    {
      id: "observations",
      node: <BehaviourObservation tokens={tokens} observations={model.observations} />,
    },
    {
      id: "results-heading",
      glueNext: true,
      node: <Section level={1} title="Assessment Results" when={hasResults(model)} />,
    },
    { id: "isaa", node: <ISAATable isaa={model.isaa} /> },
    {
      id: "gars",
      node: (
        <GARSTable
          rows={model.gars}
          index={model.garsIndex}
          note={tokens.GARS_CLINICAL_NOTE}
        />
      ),
    },
    { id: "dsm", node: <DSMTable rows={model.dsm} summary={model.dsmSummary} /> },
    { id: "vabs", node: <VABSTable rows={model.vabs} maladaptive={model.maladaptive} /> },
    { id: "eaca", node: <EACATable rows={model.eaca} /> },
    { id: "vbmapp", node: <VBMAPPTable tokens={tokens} rows={model.vbmapp} /> },
    {
      id: "analysis",
      node: <Analysis tokens={tokens} strengths={model.strengths} concerns={model.concerns} />,
    },
    { id: "impression", node: <DiagnosticImpression tokens={tokens} /> },
    { id: "recommendations", node: <Recommendations recommendations={model.recommendations} /> },
    { id: "concessions", node: <Concessions concessions={model.concessions} /> },
    { id: "summary", node: <Summary tokens={tokens} /> },
    { id: "declaration", node: <Declaration tokens={tokens} /> },
    { id: "disclaimer", node: <Disclaimer /> },
  ];
};

export default buildBlocks;
