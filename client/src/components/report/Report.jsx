import { forwardRef, useLayoutEffect, useMemo, useRef, useState } from "react";
import { buildExamineeReport } from "../../utils/reportTemplate";
import buildBlocks from "./blocks";
import Footer from "./components/Footer";
import { RunningHead } from "./components/Header";
import { NumberingProvider } from "./NumberingProvider";
import { packIntoPages } from "./paginate";
import "./report.css";

/**
 * Six-page-style A4 autism assessment report with real pagination.
 *
 * Blocks are rendered once into an off-screen sheet of identical width, their
 * heights are measured, and only then are they packed into A4 pages. That way a
 * sheet is filled before the next one starts, instead of every section getting
 * a page of its own with white space underneath.
 *
 * Feed it either an examinee record (`student`) or a pre-built model (`model`).
 */
const Report = forwardRef(({ student, model: providedModel, className = "" }, ref) => {
  const model = useMemo(
    () => providedModel || buildExamineeReport(student || {}),
    [providedModel, student]
  );

  const blocks = useMemo(() => buildBlocks(model), [model]);
  const measureRef = useRef(null);
  const [heights, setHeights] = useState(null);

  // Measure by reading each child's offset inside one continuous column, which
  // captures collapsed margins the way the real page will lay them out.
  useLayoutEffect(() => {
    const container = measureRef.current;
    if (!container) return;

    const children = [...container.children];
    const tops = children.map((child) => child.offsetTop);
    const measured = children.map((child, index) =>
      index === children.length - 1
        ? child.offsetHeight
        : tops[index + 1] - tops[index]
    );

    setHeights((previous) =>
      previous && previous.length === measured.length &&
      previous.every((value, index) => value === measured[index])
        ? previous
        : measured
    );
  }, [blocks]);

  const pages = useMemo(
    () => (heights ? packIntoPages(blocks, heights) : null),
    [blocks, heights]
  );

  return (
    <div ref={ref} className={`report report--preview ${className}`.trim()}>
      {/* Measuring pass — laid out exactly like a page body, but never shown. */}
      {!pages && (
        <div className="report-page report-measure" aria-hidden="true">
          <div className="report-page__body" ref={measureRef}>
            {blocks.map((block) => (
              <div className="report-block" key={block.id}>{block.node}</div>
            ))}
          </div>
        </div>
      )}

      {pages && (
        <NumberingProvider>
          {pages.map((page, index) => (
            <article className="report-page" key={index} data-page={index + 1}>
              {index > 0 && <RunningHead tokens={model.tokens} />}
              <div className="report-page__body">
                {page.map((block) => (
                  <div className="report-block" key={block.id}>{block.node}</div>
                ))}
              </div>
              <Footer tokens={model.tokens} page={index + 1} total={pages.length} />
            </article>
          ))}
        </NumberingProvider>
      )}
    </div>
  );
});

Report.displayName = "Report";

export default Report;
