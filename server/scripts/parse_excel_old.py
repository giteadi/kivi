#!/usr/bin/env python3
"""
Universal Excel Parser - Handles ALL formats:
- Regular cells
- Merged cells (unmerges and fills)
- Text boxes / Shapes / DrawingML
- Formulas (evaluated values)
- .xlsx, .xls, .csv
"""

import sys
import os
import csv
import json
import zipfile
import re
import xml.etree.ElementTree as ET
from copy import copy

# ─── SHARED NAMESPACES ────────────────────────────────────────────────────────
NS = {
    'main':  'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
    'r':     'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'rels':  'http://schemas.openxmlformats.org/package/2006/relationships',
    'xdr':   'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing',
    'a':     'http://schemas.openxmlformats.org/drawingml/2006/main',
    'mc':    'http://schemas.openxmlformats.org/markup-compatibility/2006',
    'x14ac': 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac',
}

def log(msg):
    print(f"[PARSER] {msg}", file=sys.stderr)

# ─── SHARED STRING TABLE ──────────────────────────────────────────────────────
def load_shared_strings(zf):
    """Load shared strings table from XLSX zip"""
    shared = []
    try:
        xml = zf.read('xl/sharedStrings.xml')
        root = ET.fromstring(xml)
        for si in root.findall('.//{%s}si' % NS['main']):
            # Collect all <t> text inside <si>, handles <r><t> runs too
            parts = []
            for t in si.findall('.//{%s}t' % NS['main']):
                if t.text:
                    parts.append(t.text)
            shared.append(''.join(parts))
    except KeyError:
        pass  # No shared strings
    except Exception as e:
        log(f"SharedStrings error: {e}")
    return shared

# ─── STYLE / NUMBER FORMAT ───────────────────────────────────────────────────
def load_styles(zf):
    """Load number format IDs per cell xf index"""
    fmt_ids = []
    num_fmts = {}
    try:
        xml = zf.read('xl/styles.xml')
        root = ET.fromstring(xml)

        # Custom numFmts
        for nf in root.findall('.//{%s}numFmt' % NS['main']):
            fid = int(nf.attrib.get('numFmtId', 0))
            fc  = nf.attrib.get('formatCode', '')
            num_fmts[fid] = fc

        # xf list (cellXfs)
        for xf in root.findall('.//{%s}cellXfs/{%s}xf' % (NS['main'], NS['main'])):
            fmt_ids.append(int(xf.attrib.get('numFmtId', 0)))
    except Exception as e:
        log(f"Styles error: {e}")
    return fmt_ids, num_fmts

def is_date_fmt(fmt_id, num_fmts):
    """Heuristic: is this numFmtId a date/time format?"""
    # Built-in date formats: 14-17, 22, 27-36, 45-47, 50-58
    builtin_date = set(range(14, 18)) | {22} | set(range(27, 37)) | set(range(45, 48)) | set(range(50, 59))
    if fmt_id in builtin_date:
        return True
    code = num_fmts.get(fmt_id, '')
    date_chars = set('yYmMdDhHsS')
    return bool(code and any(c in code for c in date_chars))

def format_cell_value(raw, fmt_id, num_fmts, cell_type):
    """Convert raw cell value to display string"""
    if raw is None:
        return ''
    try:
        if cell_type == 's':
            # Shared string index — already resolved by caller
            return str(raw)
        if cell_type == 'b':
            return 'TRUE' if str(raw) in ('1', 'true', 'True') else 'FALSE'
        if cell_type == 'e':
            return str(raw)  # Error value
        if cell_type in ('str', 'inlineStr', None, ''):
            # Numeric?
            try:
                fval = float(raw)
                if fmt_id and is_date_fmt(fmt_id, num_fmts):
                    # Convert Excel serial date
                    try:
                        import datetime
                        base = datetime.datetime(1899, 12, 30)
                        dt = base + datetime.timedelta(days=fval)
                        return dt.strftime('%d/%m/%Y')
                    except Exception:
                        pass
                # Integer?
                if fval == int(fval):
                    return str(int(fval))
                return str(fval)
            except (ValueError, TypeError):
                return str(raw)
        # Numeric cell
        try:
            fval = float(raw)
            if fmt_id and is_date_fmt(fmt_id, num_fmts):
                try:
                    import datetime
                    base = datetime.datetime(1899, 12, 30)
                    dt = base + datetime.timedelta(days=fval)
                    return dt.strftime('%d/%m/%Y')
                except Exception:
                    pass
            if fval == int(fval):
                return str(int(fval))
            return str(fval)
        except (ValueError, TypeError):
            return str(raw)
    except Exception:
        return str(raw) if raw is not None else ''

# ─── COL LETTER → INDEX ──────────────────────────────────────────────────────
def col_to_idx(col_str):
    idx = 0
    for ch in col_str.upper():
        idx = idx * 26 + (ord(ch) - ord('A') + 1)
    return idx - 1

def cell_ref_to_rc(ref):
    """'B3' → (2, 1)  (0-based row, col)"""
    m = re.match(r'([A-Za-z]+)(\d+)', ref)
    if not m:
        return 0, 0
    return int(m.group(2)) - 1, col_to_idx(m.group(1))

# ─── MERGED CELL RANGES ──────────────────────────────────────────────────────
def load_merge_map(ws_root):
    """Return dict: (r,c) → (r,c) of top-left cell for every merged cell"""
    merge_map = {}
    for mc_el in ws_root.findall('.//{%s}mergeCell' % NS['main']):
        ref = mc_el.attrib.get('ref', '')
        if ':' not in ref:
            continue
        start, end = ref.split(':')
        sr, sc = cell_ref_to_rc(start)
        er, ec = cell_ref_to_rc(end)
        for r in range(sr, er + 1):
            for c in range(sc, ec + 1):
                merge_map[(r, c)] = (sr, sc)
    return merge_map

# ─── RAW CELL GRID FROM WORKSHEET XML ────────────────────────────────────────
def parse_worksheet_xml(ws_xml, shared_strings, fmt_ids, num_fmts):
    """
    Parse worksheet XML directly.
    Returns: grid dict {(r,c): value_str}, max_row, max_col
    """
    root = ET.fromstring(ws_xml)
    grid = {}
    max_r = max_c = 0

    for row_el in root.findall('.//{%s}row' % NS['main']):
        for c_el in row_el.findall('{%s}c' % NS['main']):
            ref = c_el.attrib.get('r', '')
            if not ref:
                continue
            r, c = cell_ref_to_rc(ref)
            max_r = max(max_r, r)
            max_c = max(max_c, c)

            cell_type = c_el.attrib.get('t', '')
            style_idx = int(c_el.attrib.get('s', 0))
            fmt_id = fmt_ids[style_idx] if style_idx < len(fmt_ids) else 0

            # Value / formula result
            v_el = c_el.find('{%s}v' % NS['main'])
            f_el = c_el.find('{%s}f' % NS['main'])
            is_el = c_el.find('.//{%s}t' % NS['main'])  # inlineStr

            raw = None
            if cell_type == 's' and v_el is not None:
                # Shared string
                try:
                    raw = shared_strings[int(v_el.text)]
                except Exception:
                    raw = v_el.text or ''
            elif cell_type == 'inlineStr' and is_el is not None:
                parts = []
                for t in c_el.findall('.//{%s}t' % NS['main']):
                    if t.text:
                        parts.append(t.text)
                raw = ''.join(parts)
            elif v_el is not None and v_el.text:
                raw = v_el.text
            elif f_el is not None and f_el.text:
                # Formula string result — treat as string
                raw = f_el.text
                cell_type = 'str'

            val = format_cell_value(raw, fmt_id, num_fmts, cell_type)
            if val:
                grid[(r, c)] = val

    return grid, max_r, max_c

# ─── DRAWING TEXT EXTRACTION ─────────────────────────────────────────────────
def extract_drawing_texts(zf, drawing_path):
    """
    Extract all text from a drawing XML.
    Returns list of (row, col, text) — best-effort positioning.
    Also returns list of plain texts without position (for fallback).
    """
    try:
        xml_bytes = zf.read(drawing_path)
    except KeyError:
        return [], []

    root = ET.fromstring(xml_bytes)
    positioned = []
    all_texts  = []

    def collect_txbody_text(txbody):
        if txbody is None:
            return ''
        lines = []
        for p in txbody.findall('.//{%s}p' % NS['a']):
            parts = []
            for t in p.findall('.//{%s}t' % NS['a']):
                if t.text:
                    parts.append(t.text)
            line = ''.join(parts).strip()
            if line:
                lines.append(line)
        return '\n'.join(lines)

    # twoCellAnchor & oneCellAnchor
    for anchor_tag in ('{%s}twoCellAnchor' % NS['xdr'], '{%s}oneCellAnchor' % NS['xdr']):
        for anchor in root.findall(anchor_tag):
            from_el = anchor.find('{%s}from' % NS['xdr'])
            row_el  = from_el.find('{%s}row' % NS['xdr'])  if from_el is not None else None
            col_el  = from_el.find('{%s}col' % NS['xdr'])  if from_el is not None else None

            # All shape types
            for shape_path in (
                './/{%s}sp' % NS['xdr'],
                './/{%s}cxnSp' % NS['xdr'],
            ):
                for sp in anchor.findall(shape_path):
                    txbody = sp.find('.//{%s}txBody' % NS['a'])
                    text   = collect_txbody_text(txbody)
                    if not text:
                        continue
                    all_texts.append(text)
                    if row_el is not None and col_el is not None:
                        try:
                            positioned.append((int(row_el.text), int(col_el.text), text))
                        except Exception:
                            pass

    # Absolute anchors (no position info — just grab text)
    for sp in root.findall('.//{%s}sp' % NS['xdr']):
        txbody = sp.find('.//{%s}txBody' % NS['a'])
        text   = collect_txbody_text(txbody)
        if text and text not in all_texts:
            all_texts.append(text)

    return positioned, all_texts

# ─── BUILD SHEET DRAWING MAP ─────────────────────────────────────────────────
def build_sheet_drawing_map(zf):
    """Return {sheet_xml_path: drawing_xml_path}"""
    result = {}
    try:
        wb_root = ET.fromstring(zf.read('xl/workbook.xml'))
        wb_rels  = ET.fromstring(zf.read('xl/_rels/workbook.xml.rels'))
    except Exception:
        return result

    rid_to_target = {}
    for rel in wb_rels.findall('{%s}Relationship' % NS['rels']):
        rid    = rel.attrib.get('Id', '')
        target = rel.attrib.get('Target', '')
        if rid and target:
            # Make absolute within xl/
            rid_to_target[rid] = os.path.normpath('xl/' + target.lstrip('/')).replace('\\', '/')

    for sh in wb_root.findall('.//{%s}sheet' % NS['main']):
        rid = sh.attrib.get('{%s}id' % NS['r'], '')
        sheet_part = rid_to_target.get(rid, '')
        if not sheet_part:
            continue

        rels_path = sheet_part.replace('xl/worksheets/', 'xl/worksheets/_rels/') + '.rels'
        try:
            ws_rels = ET.fromstring(zf.read(rels_path))
        except KeyError:
            continue

        for rel in ws_rels.findall('{%s}Relationship' % NS['rels']):
            typ = rel.attrib.get('Type', '')
            if 'drawing' in typ.lower():
                target = rel.attrib.get('Target', '')
                drawing_part = os.path.normpath('xl/worksheets/' + target).replace('\\', '/')
                # Fix double xl/
                drawing_part = re.sub(r'^xl/worksheets/.*?xl/', 'xl/', drawing_part)
                result[sheet_part] = drawing_part
                break

    return result

# ─── MAIN XLSX PARSER ────────────────────────────────────────────────────────
def parse_xlsx(file_path):
    sheets     = {}
    sheet_names = []

    try:
        with zipfile.ZipFile(file_path, 'r') as zf:
            all_files = zf.namelist()

            # Load support tables
            shared_strings = load_shared_strings(zf)
            fmt_ids, num_fmts = load_styles(zf)
            sheet_drawing_map = build_sheet_drawing_map(zf)

            log(f"Shared strings: {len(shared_strings)}, Styles: {len(fmt_ids)}")
            log(f"Sheet→Drawing map: {sheet_drawing_map}")

            # Get ordered sheet list from workbook.xml
            wb_root = ET.fromstring(zf.read('xl/workbook.xml'))
            wb_rels  = ET.fromstring(zf.read('xl/_rels/workbook.xml.rels'))

            rid_to_path = {}
            for rel in wb_rels.findall('{%s}Relationship' % NS['rels']):
                rid    = rel.attrib.get('Id', '')
                target = rel.attrib.get('Target', '')
                if rid and target:
                    rid_to_path[rid] = os.path.normpath('xl/' + target.lstrip('/')).replace('\\', '/')

            for sh in wb_root.findall('.//{%s}sheet' % NS['main']):
                name = sh.attrib.get('name', '')
                rid  = sh.attrib.get('{%s}id' % NS['r'], '')
                ws_path = rid_to_path.get(rid, '')
                if not name or not ws_path:
                    continue

                sheet_names.append(name)
                log(f"Processing sheet '{name}' → {ws_path}")

                # ── 1. Parse cell data ──────────────────────────────────────
                cell_grid = {}
                max_r = max_c = 0
                merge_map = {}

                try:
                    ws_xml = zf.read(ws_path)
                    ws_root = ET.fromstring(ws_xml)

                    # Merged cells
                    merge_map = load_merge_map(ws_root)

                    # Cell values
                    cell_grid, max_r, max_c = parse_worksheet_xml(ws_xml, shared_strings, fmt_ids, num_fmts)
                    log(f"  Cell grid: {len(cell_grid)} non-empty, max ({max_r},{max_c})")
                except Exception as e:
                    log(f"  Cell parse error: {e}")

                # ── 2. Apply merged cell fill ───────────────────────────────
                # Cells that are merged but not top-left get top-left's value
                for (r, c), (sr, sc) in merge_map.items():
                    if (r, c) != (sr, sc) and (sr, sc) in cell_grid and (r, c) not in cell_grid:
                        cell_grid[(r, c)] = cell_grid[(sr, sc)]
                        max_r = max(max_r, r)
                        max_c = max(max_c, c)

                # ── 3. Drawing / textbox extraction ────────────────────────
                drawing_positioned = []
                drawing_texts      = []
                drawing_path = sheet_drawing_map.get(ws_path)
                if drawing_path:
                    log(f"  Drawing: {drawing_path}")
                    drawing_positioned, drawing_texts = extract_drawing_texts(zf, drawing_path)
                    log(f"  Drawing positioned: {len(drawing_positioned)}, plain: {len(drawing_texts)}")

                # ── 4. Merge drawing text into grid ────────────────────────
                for (dr, dc, text) in drawing_positioned:
                    if (dr, dc) not in cell_grid:
                        cell_grid[(dr, dc)] = text
                        max_r = max(max_r, dr)
                        max_c = max(max_c, dc)

                # ── 5. Build 2-D array ─────────────────────────────────────
                non_empty = len([v for v in cell_grid.values() if v.strip()])
                log(f"  Total non-empty after merge: {non_empty}")

                if non_empty == 0 and drawing_texts:
                    # Last resort: stack drawing texts vertically
                    log(f"  Using {len(drawing_texts)} plain drawing texts as rows")
                    rows = [[t] for t in drawing_texts if t.strip()]
                elif non_empty == 0:
                    rows = [['']]
                else:
                    rows = []
                    for r in range(max_r + 1):
                        row = []
                        for c in range(max_c + 1):
                            row.append(cell_grid.get((r, c), ''))
                        rows.append(row)

                    # Remove fully-empty trailing rows
                    while len(rows) > 1 and all(v == '' for v in rows[-1]):
                        rows.pop()

                    # Remove fully-empty trailing columns
                    if rows:
                        max_used_col = max(
                            (c for row in rows for c, v in enumerate(row) if v != ''),
                            default=0
                        )
                        rows = [row[:max_used_col + 1] for row in rows]

                sheets[name] = rows if rows else [['']]
                total = sum(1 for row in sheets[name] for v in row if v)
                log(f"  Final rows={len(sheets[name])}, non-empty cells={total}")

    except Exception as e:
        import traceback
        log(f"XLSX parse fatal: {e}\n{traceback.format_exc()}")
        return {'ok': False, 'error': str(e)}

    total_cells = sum(1 for s in sheets.values() for row in s for v in row if v)
    log(f"Done. {len(sheets)} sheets, {total_cells} total non-empty cells")
    return {'ok': True, 'sheets': sheets, 'names': sheet_names,
            'meta': {'total_cells': total_cells}}

# ─── XLS PARSER ──────────────────────────────────────────────────────────────
def parse_xls(file_path):
    try:
        import xlrd
        wb = xlrd.open_workbook(file_path)
        sheets = {}
        sheet_names = wb.sheet_names()

        for name in sheet_names:
            ws   = wb.sheet_by_name(name)
            rows = []
            for r in range(ws.nrows):
                row = []
                for c in range(ws.ncols):
                    cell = ws.cell(r, c)
                    v    = cell.value
                    if v is None or v == '':
                        row.append('')
                    elif isinstance(v, float):
                        row.append(str(int(v)) if v == int(v) else str(v))
                    else:
                        row.append(str(v).strip())
                rows.append(row)

            while len(rows) > 1 and all(c == '' for c in rows[-1]):
                rows.pop()
            sheets[name] = rows if rows else [['']]

        wb.release_resources()
        return {'ok': True, 'sheets': sheets, 'names': sheet_names}
    except ImportError:
        return {'ok': False, 'error': 'xlrd not installed. Run: pip3 install xlrd'}
    except Exception as e:
        return {'ok': False, 'error': f'XLS error: {e}'}

# ─── CSV PARSER ──────────────────────────────────────────────────────────────
def parse_csv(file_path):
    rows = []
    for enc in ('utf-8', 'latin-1', 'cp1252'):
        try:
            with open(file_path, 'r', encoding=enc, newline='') as f:
                for row in csv.reader(f):
                    rows.append([str(c).strip() if c else '' for c in row])
            break
        except UnicodeDecodeError:
            continue
    if not rows:
        rows = [['']]
    return {'ok': True, 'sheets': {'Sheet1': rows}, 'names': ['Sheet1']}

# ─── ENTRY POINT ─────────────────────────────────────────────────────────────
def parse_excel(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.csv':
        return parse_csv(file_path)
    elif ext == '.xls':
        return parse_xls(file_path)
    else:
        return parse_xlsx(file_path)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'ok': False, 'error': 'No file path provided'}))
        sys.exit(1)

    fp = sys.argv[1]
    if not os.path.exists(fp):
        print(json.dumps({'ok': False, 'error': f'File not found: {fp}'}))
        sys.exit(1)

    result = parse_excel(fp)
    print(json.dumps(result, ensure_ascii=False))
