#!/usr/bin/env python3
"""
Non-destructive .xlsx writer.

The rest of the stack regenerates workbooks from a 2D array of values, which
throws away formulas, charts, styles, merges and column widths. This script
does the opposite: it copies the original .xlsx zip entry-for-entry and edits
only the individual <c> elements the user actually changed.

Anything not listed in the edits is never parsed and never re-serialised, so
it cannot be corrupted — charts, drawings, conditional formatting, printer
settings and styles all survive untouched.

Dependent formulas are not recomputed here. Instead the workbook is flagged
with fullCalcOnLoad, so Excel recalculates the whole book when it opens. That
keeps Excel itself as the source of truth for formula results.

Usage:
    patch_excel.py <original.xlsx> <edits.json> <output.xlsx>

edits.json:
    {
      "sheets": {
        "WISC4-Scoring ": { "1_2": 105, "1_4": "High Average" }
      }
    }

Cell keys are "<row>_<col>", both 0-based, matching the client's grid keys.
Values may be numbers, strings, booleans or null (null clears the cell).
"""

import json
import os
import re
import shutil
import sys
import xml.etree.ElementTree as ET
import zipfile
from xml.sax.saxutils import escape

MAIN_NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
REL_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
PKG_REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships'

ET.register_namespace('', MAIN_NS)


def log(msg):
    print(f"[PATCH] {msg}", file=sys.stderr, flush=True)


def col_to_letters(idx):
    """0-based column index -> A, B, ... Z, AA, AB ..."""
    letters = ''
    idx += 1
    while idx > 0:
        idx, rem = divmod(idx - 1, 26)
        letters = chr(65 + rem) + letters
    return letters


def letters_to_col(letters):
    idx = 0
    for ch in letters.upper():
        idx = idx * 26 + (ord(ch) - 64)
    return idx - 1


# ─── Workbook structure ──────────────────────────────────────────────────────

def sheet_name_to_path(zf):
    """Map each sheet's display name to its xl/worksheets/*.xml path."""
    wb = zf.read('xl/workbook.xml').decode('utf-8', 'replace')
    rels = zf.read('xl/_rels/workbook.xml.rels').decode('utf-8', 'replace')

    rid_to_target = {}
    for m in re.finditer(r'<Relationship\b[^>]*>', rels):
        tag = m.group(0)
        rid = re.search(r'\bId="([^"]+)"', tag)
        target = re.search(r'\bTarget="([^"]+)"', tag)
        if rid and target:
            path = target.group(1).lstrip('/')
            if not path.startswith('xl/'):
                path = os.path.normpath('xl/' + path).replace('\\', '/')
            rid_to_target[rid.group(1)] = path

    mapping = {}
    for m in re.finditer(r'<sheet\b[^>]*/?>', wb):
        tag = m.group(0)
        name = re.search(r'\bname="([^"]*)"', tag)
        rid = re.search(r'\br:id="([^"]+)"', tag)
        if name and rid and rid.group(1) in rid_to_target:
            mapping[unescape_attr(name.group(1))] = rid_to_target[rid.group(1)]
    return mapping


def unescape_attr(value):
    return (value.replace('&lt;', '<').replace('&gt;', '>')
                 .replace('&quot;', '"').replace('&apos;', "'")
                 .replace('&amp;', '&'))


def merge_redirects(sheet_xml):
    """
    Map every non-top-left cell of a merged range to its top-left cell.

    The parser flattens merges by copying the top-left value into each child
    cell, so the grid the user edits has no idea a merge exists. Writing to a
    child cell would be invisible in Excel — only the top-left carries the
    value — so those edits are redirected here.
    """
    redirect = {}
    for m in re.finditer(r'<mergeCell\b[^>]*\bref="([A-Z]+\d+):([A-Z]+\d+)"', sheet_xml):
        start, end = m.group(1), m.group(2)
        sc, sr = split_ref(start)
        ec, er = split_ref(end)
        for r in range(sr, er + 1):
            for c in range(sc, ec + 1):
                if (r, c) != (sr, sc):
                    redirect[(r, c)] = (sr, sc)
    return redirect


def split_ref(ref):
    """'AB12' -> (col_idx, row_idx), both 0-based."""
    m = re.match(r'^([A-Z]+)(\d+)$', ref)
    return (letters_to_col(m.group(1)), int(m.group(2)) - 1) if m else (0, 0)


# Cell references, skipping anything inside a quoted string literal.
_REF_RE = re.compile(r'"[^"]*"|(\$?)([A-Z]{1,3})(\$?)(\d+)')


def shift_refs(formula, d_row, d_col):
    """Offset the relative references in a formula. $-anchored parts stay put."""
    if not d_row and not d_col:
        return formula

    def move(m):
        if m.group(0).startswith('"'):
            return m.group(0)
        col_abs, col, row_abs, row = m.group(1), m.group(2), m.group(3), m.group(4)
        new_col = col if col_abs else col_to_letters(max(0, letters_to_col(col) + d_col))
        new_row = row if row_abs else str(max(1, int(row) + d_row))
        return f'{col_abs}{new_col}{row_abs}{new_row}'

    return _REF_RE.sub(move, formula)


def _qn(tag):
    return '{%s}%s' % (MAIN_NS, tag)


def _xml_decl(sheet_xml):
    m = re.match(r'<\?xml[^?]*\?>', sheet_xml)
    return m.group(0) if m else '<?xml version="1.0" encoding="UTF-8"?>'


def expand_shared_formulas(sheet_xml, targets):
    """
    Expand shared-formula groups whose master cell is going to be overwritten.

    Excel stores one master formula per group; every other cell just points at
    it with <f t="shared" si="N"/>. Overwriting the master would leave those
    members dangling and Excel reports the file as corrupt, so before touching
    a master we give each member its own explicit, reference-shifted copy.
    """
    root = ET.fromstring(sheet_xml)
    cells = {c.get('r'): c for c in root.iter(_qn('c')) if c.get('r')}

    masters = {}
    members = {}
    for ref, cell in cells.items():
        f = cell.find(_qn('f'))
        if f is None or f.get('t') != 'shared':
            continue
        si = f.get('si')
        if si is None:
            continue
        text = (f.text or '').strip()
        if text and f.get('ref'):
            masters[si] = (ref, text)
        else:
            members.setdefault(si, []).append(ref)

    affected = set()
    for si, (mref, text) in masters.items():
        mcol, mrow = split_ref(mref)
        if (mrow, mcol) in targets:
            affected.add(si)

    if not affected:
        return sheet_xml

    for si in affected:
        mref, formula = masters[si]
        mcol, mrow = split_ref(mref)
        for member in members.get(si, []):
            cell = cells[member]
            f = cell.find(_qn('f'))
            ccol, crow = split_ref(member)
            f.text = shift_refs(formula, crow - mrow, ccol - mcol)
            f.attrib.pop('t', None)
            f.attrib.pop('si', None)

        master = cells[mref]
        f = master.find(_qn('f'))
        f.attrib.pop('t', None)
        f.attrib.pop('si', None)
        f.attrib.pop('ref', None)

    return f'{_xml_decl(sheet_xml)}\n{ET.tostring(root, encoding="unicode")}'


def force_recalc_on_load(workbook_xml):
    """Make Excel recompute every formula the next time the file is opened."""
    if 'fullCalcOnLoad="1"' in workbook_xml:
        return workbook_xml
    if '<calcPr' in workbook_xml:
        return re.sub(r'<calcPr\b([^>]*?)/>',
                      r'<calcPr\1 fullCalcOnLoad="1"/>',
                      workbook_xml, count=1)
    return workbook_xml.replace('</workbook>', '<calcPr fullCalcOnLoad="1"/></workbook>')


# ─── Cell rendering ──────────────────────────────────────────────────────────

def is_number(value):
    if isinstance(value, bool):
        return False
    if isinstance(value, (int, float)):
        return True
    if isinstance(value, str):
        try:
            float(value.strip())
            return value.strip() != ''
        except ValueError:
            return False
    return False


def build_cell(ref, value, style_attr=''):
    """
    Render a single <c> element.

    Text is written as an inline string so xl/sharedStrings.xml never has to be
    rewritten — one less shared part that could drift out of sync.
    """
    if value is None or value == '':
        return f'<c r="{ref}"{style_attr}/>'
    if isinstance(value, bool):
        return f'<c r="{ref}"{style_attr} t="b"><v>{1 if value else 0}</v></c>'
    if is_number(value):
        num = float(value)
        text = str(int(num)) if num.is_integer() else repr(num)
        return f'<c r="{ref}"{style_attr}><v>{text}</v></c>'
    return (f'<c r="{ref}"{style_attr} t="inlineStr">'
            f'<is><t xml:space="preserve">{escape(str(value))}</t></is></c>')


CELL_RE = re.compile(r'<c\b[^>]*\br="([A-Z]+)(\d+)"[^>]*?(?:/>|>.*?</c>)', re.S)
ROW_RE = re.compile(r'<row\b[^>]*\br="(\d+)"[^>]*?(?:/>|>.*?</row>)', re.S)


def patch_cell_in_row(row_xml, col_idx, ref, value):
    """Replace, insert or append a <c> inside one <row> element."""
    existing = None
    for m in CELL_RE.finditer(row_xml):
        if letters_to_col(m.group(1)) == col_idx:
            existing = m
            break

    if existing:
        # Keep the original style index so fonts/borders/number formats survive.
        style = re.search(r'\bs="(\d+)"', existing.group(0))
        style_attr = f' s="{style.group(1)}"' if style else ''
        return row_xml[:existing.start()] + build_cell(ref, value, style_attr) + row_xml[existing.end():]

    new_cell = build_cell(ref, value)

    if row_xml.endswith('/>'):  # empty row element — give it a body
        return row_xml[:-2] + '>' + new_cell + '</row>'

    # Insert in column order so Excel does not complain about unsorted cells.
    insert_at = row_xml.rfind('</row>')
    for m in CELL_RE.finditer(row_xml):
        if letters_to_col(m.group(1)) > col_idx:
            insert_at = m.start()
            break
    return row_xml[:insert_at] + new_cell + row_xml[insert_at:]


def patch_sheet(sheet_xml, edits):
    """
    Apply {(row, col): value} to one worksheet XML document.

    Only the matched <row>/<c> substrings are rewritten; the surrounding XML
    (mergeCells, conditionalFormatting, drawing refs, printer settings) is
    carried through as-is.
    """
    redirect = merge_redirects(sheet_xml)

    by_row = {}
    for (r, c), value in edits.items():
        r, c = redirect.get((r, c), (r, c))
        by_row.setdefault(r, {})[c] = value

    # Overwriting a shared-formula master would orphan its members, so expand
    # any affected group before editing individual cells.
    targets = {(r, c) for r, cols in by_row.items() for c in cols}
    sheet_xml = expand_shared_formulas(sheet_xml, targets)

    for row_idx in sorted(by_row, reverse=True):  # bottom-up keeps offsets valid
        cols = by_row[row_idx]
        row_no = row_idx + 1

        match = None
        for m in ROW_RE.finditer(sheet_xml):
            if int(m.group(1)) == row_no:
                match = m
                break

        if match:
            row_xml = match.group(0)
            for col_idx in sorted(cols, reverse=True):
                ref = f'{col_to_letters(col_idx)}{row_no}'
                row_xml = patch_cell_in_row(row_xml, col_idx, ref, cols[col_idx])
            sheet_xml = sheet_xml[:match.start()] + row_xml + sheet_xml[match.end():]
            continue

        cells = ''.join(
            build_cell(f'{col_to_letters(c)}{row_no}', cols[c])
            for c in sorted(cols)
        )
        new_row = f'<row r="{row_no}">{cells}</row>'
        sheet_xml = insert_row(sheet_xml, row_no, new_row)

    return sheet_xml


def insert_row(sheet_xml, row_no, new_row):
    """Put a brand new <row> in the right place inside <sheetData>."""
    insert_at = None
    for m in ROW_RE.finditer(sheet_xml):
        if int(m.group(1)) > row_no:
            insert_at = m.start()
            break

    if insert_at is not None:
        return sheet_xml[:insert_at] + new_row + sheet_xml[insert_at:]
    if '</sheetData>' in sheet_xml:
        return sheet_xml.replace('</sheetData>', new_row + '</sheetData>', 1)
    return sheet_xml.replace('<sheetData/>', f'<sheetData>{new_row}</sheetData>', 1)


# ─── Entry point ─────────────────────────────────────────────────────────────

def parse_edits(raw):
    """{"sheets": {name: {"r_c": value}}} -> {name: {(r, c): value}}"""
    result = {}
    for sheet_name, cells in (raw.get('sheets') or {}).items():
        parsed = {}
        for key, value in (cells or {}).items():
            m = re.match(r'^(\d+)_(\d+)$', str(key))
            if m:
                parsed[(int(m.group(1)), int(m.group(2)))] = value
        if parsed:
            result[sheet_name] = parsed
    return result


def patch_workbook(src, edits_by_sheet, dest):
    with zipfile.ZipFile(src, 'r') as zin:
        name_to_path = sheet_name_to_path(zin)

        targets = {}
        for sheet_name, cells in edits_by_sheet.items():
            path = name_to_path.get(sheet_name)
            if path is None:  # tolerate trailing-space / case differences
                path = next((p for n, p in name_to_path.items()
                             if n.strip().lower() == sheet_name.strip().lower()), None)
            if path is None:
                log(f'sheet not found, skipping: {sheet_name!r}')
                continue
            targets[path] = cells

        touched = 0
        with zipfile.ZipFile(dest, 'w', zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                data = zin.read(item.filename)

                if item.filename in targets:
                    xml = data.decode('utf-8', 'replace')
                    data = patch_sheet(xml, targets[item.filename]).encode('utf-8')
                    touched += 1
                elif item.filename == 'xl/workbook.xml' and targets:
                    xml = data.decode('utf-8', 'replace')
                    data = force_recalc_on_load(xml).encode('utf-8')

                info = zipfile.ZipInfo(item.filename, date_time=item.date_time)
                info.compress_type = item.compress_type
                info.external_attr = item.external_attr
                zout.writestr(info, data)

    return touched


def main():
    if len(sys.argv) < 4:
        print(json.dumps({'ok': False, 'error': 'usage: patch_excel.py <src> <edits.json> <dest>'}))
        return 1

    src, edits_path, dest = sys.argv[1], sys.argv[2], sys.argv[3]

    if not os.path.exists(src):
        print(json.dumps({'ok': False, 'error': f'not found: {src}'}))
        return 1

    try:
        with open(edits_path, 'r', encoding='utf-8') as f:
            edits_by_sheet = parse_edits(json.load(f))
    except Exception as e:
        print(json.dumps({'ok': False, 'error': f'bad edits file: {e}'}))
        return 1

    if not edits_by_sheet:
        shutil.copyfile(src, dest)  # nothing changed — hand back the original
        print(json.dumps({'ok': True, 'sheets_patched': 0, 'cells_patched': 0}))
        return 0

    try:
        touched = patch_workbook(src, edits_by_sheet, dest)
    except Exception as e:
        print(json.dumps({'ok': False, 'error': str(e)}))
        return 1

    print(json.dumps({
        'ok': True,
        'sheets_patched': touched,
        'cells_patched': sum(len(v) for v in edits_by_sheet.values()),
    }))
    return 0


if __name__ == '__main__':
    sys.exit(main())
