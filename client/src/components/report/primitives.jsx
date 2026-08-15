// Shared building blocks for the A4 report. A section, row or bullet that has
// no value simply does not render, so exports never contain blank cells or
// orphaned headings.

import { useContext } from "react";
import { compact, has } from "./helpers";
import { NumberingContext } from "./NumberingContext.js";

/**
 * A numbered section. Pass `when={false}` to suppress it — child components
 * that render `null` cannot be detected from here, so callers decide. This is
 * what keeps headings such as "6.3 DSM-5 Diagnostic Criteria Mapping" from
 * appearing above an empty body.
 */
export const Section = ({ number, title, level = 1, when, children }) => {
  const ctx = useContext(NumberingContext);

  const body = Array.isArray(children) ? children.filter(Boolean) : children;
  if (when === false) return null;
  if (when === undefined && (!body || (Array.isArray(body) && body.length === 0))) return null;

  const displayNumber = ctx ? ctx.getNumber(level) : number;
  const Heading = level === 1 ? "h2" : "h3";
  return (
    <section className="report-section">
      <Heading className={level === 1 ? "report-h1" : "report-h2"}>
        {displayNumber ? `${displayNumber} ` : ""}{title}
      </Heading>
      {body}
    </section>
  );
};

/** Paragraph that disappears when its text is empty. */
export const Paragraph = ({ children }) =>
  has(children) ? <p className="report-p">{children}</p> : null;

/** Bulleted list that disappears when every item is empty. */
export const BulletList = ({ items }) => {
  const list = compact(items);
  if (!list.length) return null;
  return (
    <ul className="report-list">
      {list.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  );
};

/**
 * A bordered data table.
 *
 * @param columns  array of { key, header, width, align, bold }
 * @param rows     array of objects keyed by `columns[].key`
 * @param required keys that must hold a value for the row to render
 *                 (defaults to every column after the first)
 */
export const DataTable = ({ columns, rows, required, footer }) => {
  const valueKeys = required || columns.slice(1).map((c) => c.key);
  const visible = (rows || []).filter((row) => valueKeys.some((key) => has(row[key])));
  if (!visible.length) return null;

  return (
    <table className="report-table">
      <colgroup>
        {columns.map((col) => <col key={col.key} style={col.width ? { width: col.width } : undefined} />)}
      </colgroup>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className={col.align === "center" ? "is-center" : undefined}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {visible.map((row, index) => (
          <tr key={row.key ?? index}>
            {columns.map((col, colIndex) => {
              const className = [
                colIndex === 0 || col.bold ? "is-label" : "",
                col.align === "center" ? "is-center" : "",
              ].filter(Boolean).join(" ");
              return <td key={col.key} className={className || undefined}>{row[col.key]}</td>;
            })}
          </tr>
        ))}
        {footer && has(footer.value) && (
          <tr className="is-total">
            <td>{footer.label}</td>
            <td colSpan={columns.length - 1}>{footer.value}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

/**
 * Two/three-column label–value table used by the learner information block.
 * Rows arrive as { label, value, extra } and drop out when `value` is empty.
 */
export const FieldTable = ({ rows }) => {
  const visible = (rows || []).filter((row) => has(row.value) || has(row.extra));
  if (!visible.length) return null;

  return (
    <table className="report-table">
      <colgroup>
        <col style={{ width: "27%" }} />
        <col style={{ width: "36%" }} />
        <col style={{ width: "37%" }} />
      </colgroup>
      <tbody>
        {visible.map((row, index) => (
          <tr key={index}>
            <td className="is-label">{row.label}</td>
            {has(row.extra)
              ? <><td>{row.value}</td><td>{row.extra}</td></>
              : <td colSpan={2}>{row.value}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/** Boxed statement, e.g. the ISAA total or the provisional diagnosis. */
export const Callout = ({ title, value, note, center = true }) => {
  if (!has(value)) return null;
  return (
    <div className={`report-callout${center ? " report-callout--center" : ""}`}>
      {has(title) && <p className="report-callout__title">{title}</p>}
      <p className="report-callout__value">{value}</p>
      {has(note) && <p className="report-note">{note}</p>}
    </div>
  );
};

/** Banner-headed recommendation block. */
export const RecoBlock = ({ title, items }) => {
  const list = compact(items);
  if (!list.length) return null;
  return (
    <div className="report-reco">
      <div className="report-reco__head">{title}</div>
      <ul className="report-reco__body">
        {list.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </div>
  );
};
