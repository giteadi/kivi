import { has } from "../helpers";

const Footer = ({ tokens, page, total }) => (
  <div className="report-footer">
    <span>{has(tokens.LEARNER_NAME) ? tokens.LEARNER_NAME : "Assessment Report"}</span>
    <span>Confidential — MindSaid Learning Centre</span>
    <span>Page {page} of {total}</span>
  </div>
);

export default Footer;
