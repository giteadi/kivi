// sheetFormulas.js
// Single source of truth for reading formulas out of a 2D sheet grid and for
// cloning a sheet's formula skeleton into a fresh, empty sheet.
//
// A "grid" here is the same shape used everywhere in this app: an array of rows,
// each row an array of cell values. A Word/DOCX sheet is the special case
// [["__html__", "<html>"]] and has no formulas at all.
//
// Naming guide (used consistently across Forms, Conners and Report Templates):
//   isExcelGrid                → is this a spreadsheet grid, not a Word sheet?
//   extractSheetFormulas       → grid  → { "row_col": "=FORMULA" }
//   createSheetFromFormulas    → grid  → new grid, values blank, formulas kept
//   HTML_SHEET_MARKER          → the first-cell marker for Word/HTML sheets

export const HTML_SHEET_MARKER = "__html__";

/** True for spreadsheet grids; false for Word/HTML sheets and empty input. */
export function isExcelGrid(grid) {
  if (!Array.isArray(grid) || grid.length === 0) return false;
  const firstRow = grid[0];
  return Array.isArray(firstRow) && firstRow[0] !== HTML_SHEET_MARKER;
}

/**
 * Collect every formula in the grid, keyed by "rowIndex_colIndex".
 *
 * Only strings beginning with "=" count, which is how formulas are stored in
 * template_data after an upload. Cells holding an already-evaluated number are
 * values, not formulas, so they are intentionally skipped.
 */
export function extractSheetFormulas(grid) {
  const formulas = {};
  if (!isExcelGrid(grid)) return formulas;

  grid.forEach((row, rowIdx) => {
    (row || []).forEach((cell, colIdx) => {
      if (typeof cell === "string" && cell.startsWith("=")) {
        formulas[`${rowIdx}_${colIdx}`] = cell;
      }
    });
  });
  return formulas;
}

/** Widest row in the grid — a new sheet must be rectangular to stay editable. */
function countColumns(grid) {
  return (grid || []).reduce((widest, row) => Math.max(widest, row?.length || 0), 0);
}

/**
 * Build a fresh sheet that mirrors `sourceGrid`'s dimensions and formulas but
 * carries none of its data, so a user starting a new sheet does not have to
 * retype the formulas.
 *
 * `formulas` may be passed in when the caller already holds a parsed cache
 * (the Python upload parser records shared-formula members the browser-side
 * scan cannot see); otherwise the formulas are read straight off the grid.
 *
 * Returns null when the source is not a spreadsheet, letting the caller fall
 * back to its own blank-sheet behaviour for Word/HTML documents.
 */
export function createSheetFromFormulas(sourceGrid, formulas) {
  if (!isExcelGrid(sourceGrid)) return null;

  const rowCount = sourceGrid.length;
  const colCount = countColumns(sourceGrid);
  if (rowCount === 0 || colCount === 0) return null;

  const sheet = Array.from({ length: rowCount }, () =>
    Array.from({ length: colCount }, () => "")
  );

  const source = formulas && Object.keys(formulas).length > 0
    ? formulas
    : extractSheetFormulas(sourceGrid);

  for (const [key, formula] of Object.entries(source)) {
    const [rowIdx, colIdx] = key.split("_").map(Number);
    if (Number.isNaN(rowIdx) || Number.isNaN(colIdx)) continue;
    if (sheet[rowIdx] && colIdx < colCount) sheet[rowIdx][colIdx] = formula;
  }

  return sheet;
}

/** How many formulas a grid carries — handy for user-facing messages. */
export function countSheetFormulas(grid) {
  return Object.keys(extractSheetFormulas(grid)).length;
}
