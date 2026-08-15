// Value helpers shared by every report component. The report is "hide when
// empty": anything without a value is dropped rather than printed blank.

/** True when a value is worth printing. */
export const has = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

/** First non-empty value, or "" — handy for token fallbacks. */
export const pick = (...values) => values.find(has) ?? "";

/** Drop empty entries from a list of strings. */
export const compact = (items) => (items || []).filter(has).map((i) => String(i).trim());
