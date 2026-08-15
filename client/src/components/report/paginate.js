// Greedy A4 page packer. Blocks keep their order; a page is filled until the
// next block (plus anything glued to it) no longer fits.

const PX_PER_MM = 96 / 25.4; // CSS defines 1mm at 96dpi, so this matches report.css

const PAGE_HEIGHT_MM = 297;
const PAD_TOP_MM = 14;
const PAD_BOTTOM_MM = 18; // padding already reserves room for the absolute footer
const RUNHEAD_MM = 7; // running head + its rule and margin, pages 2 onward

const mm = (value) => value * PX_PER_MM;

const FIRST_PAGE_HEIGHT = mm(PAGE_HEIGHT_MM - PAD_TOP_MM - PAD_BOTTOM_MM);
const NEXT_PAGE_HEIGHT = FIRST_PAGE_HEIGHT - mm(RUNHEAD_MM);

/**
 * @param blocks  [{ id, node, glueNext }] in reading order
 * @param heights measured pixel height of each block, same order
 * @returns array of pages, each an array of blocks
 */
export function packIntoPages(blocks, heights) {
  const pages = [];
  let current = [];
  let remaining = FIRST_PAGE_HEIGHT;

  const startNewPage = () => {
    pages.push(current);
    current = [];
    remaining = NEXT_PAGE_HEIGHT;
  };

  for (let i = 0; i < blocks.length; i++) {
    // Collect the block plus everything glued to it — a lead-in heading must
    // never be stranded at the foot of a page.
    const group = [blocks[i]];
    let height = heights[i] || 0;
    while (blocks[i].glueNext && i + 1 < blocks.length) {
      i++;
      group.push(blocks[i]);
      height += heights[i] || 0;
    }

    if (height === 0) continue; // section rendered nothing
    if (height > remaining && current.length) startNewPage();

    current.push(...group);
    remaining -= height;
  }

  if (current.length) pages.push(current);
  return pages.length ? pages : [[]];
}

export default packIntoPages;
