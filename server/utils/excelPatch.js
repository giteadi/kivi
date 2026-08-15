/**
 * Non-destructive .xlsx editing.
 *
 * Downloads used to hand back either the pristine original (losing the user's
 * edits) or a workbook regenerated from a 2D value array (losing formulas,
 * charts, styles and merges). This module gives the third option: the original
 * file with only the edited cells rewritten, everything else byte-identical.
 *
 * The heavy lifting is in scripts/patch_excel.py; this is the Node wrapper.
 */

const { spawn } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PATCH_SCRIPT = path.join(__dirname, '../scripts/patch_excel.py');
const PATCHABLE = new Set(['.xlsx', '.xlsm']);

/** True when this file can be patched in place rather than regenerated. */
const isPatchable = (filePath) => PATCHABLE.has(path.extname(filePath).toLowerCase());

/**
 * Pull the user's cell edits out of a form's stored template_data.
 * Returns null when there is nothing to apply.
 */
function readCellEdits(templateData) {
  if (!templateData) return null;

  let parsed = templateData;
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return null;
    }
  }

  const edits = parsed?.cellEdits;
  if (!edits || typeof edits !== 'object') return null;

  // Drop sheets whose edit map is empty so we can skip the spawn entirely.
  const sheets = Object.fromEntries(
    Object.entries(edits).filter(([, cells]) => cells && Object.keys(cells).length > 0)
  );
  return Object.keys(sheets).length ? { sheets } : null;
}

/**
 * Write `edits` into `sourcePath` and resolve with a temp file path.
 * Resolves with null if patching is not possible, so callers can fall back to
 * streaming the original.
 */
function patchWorkbook(sourcePath, edits, pythonPath = process.env.PYTHON_PATH || 'python3') {
  return new Promise((resolve) => {
    const id = crypto.randomBytes(8).toString('hex');
    const editsPath = path.join(os.tmpdir(), `kivi-edits-${id}.json`);
    const outPath = path.join(os.tmpdir(), `kivi-patched-${id}${path.extname(sourcePath)}`);

    const cleanup = () => fs.unlink(editsPath, () => {});

    try {
      fs.writeFileSync(editsPath, JSON.stringify(edits));
    } catch (err) {
      console.warn('[excelPatch] could not stage edits:', err.message);
      return resolve(null);
    }

    const python = spawn(pythonPath, [PATCH_SCRIPT, sourcePath, editsPath, outPath]);
    let stdout = '';
    let stderr = '';
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const killTimer = setTimeout(() => {
      console.warn('[excelPatch] patch timed out, killing python');
      python.kill('SIGKILL');
    }, 120000);

    python.stdout.on('data', (d) => { stdout += d.toString(); });
    python.stderr.on('data', (d) => { stderr += d.toString(); });

    python.on('error', (err) => {
      console.warn('[excelPatch] python unavailable:', err.message);
      cleanup();
      clearTimeout(killTimer);
      fs.unlink(outPath, () => {});
      finish(null);
    });

    python.on('close', (code) => {
      cleanup();
      clearTimeout(killTimer);
      if (code !== 0) {
        console.warn('[excelPatch] patch failed:', stderr.trim());
        fs.unlink(outPath, () => {});
        return finish(null);
      }
      try {
        const result = JSON.parse(stdout);
        if (!result.ok) {
          console.warn('[excelPatch] patch reported failure:', result.error);
          fs.unlink(outPath, () => {});
          return finish(null);
        }
        console.log(`[excelPatch] patched ${result.cells_patched} cell(s) across ${result.sheets_patched} sheet(s)`);
        finish(outPath);
      } catch {
        console.warn('[excelPatch] unreadable patch output:', stdout.slice(0, 200));
        fs.unlink(outPath, () => {});
        finish(null);
      }
    });
  });
}

module.exports = { isPatchable, readCellEdits, patchWorkbook };
