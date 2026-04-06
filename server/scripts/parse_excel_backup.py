#!/usr/bin/env python3
"""
Universal Excel Parser v4
Special handling: Embedded Word Documents (OLE objects) in Excel sheets
Each sheet has an embedded .docx file in xl/embeddings/
"""

import sys, os, csv, json, zipfile, re
import xml.etree.ElementTree as ET

def log(msg):
    print(f"[PARSER] {msg}", file=sys.stderr)

# ─── WORD DOCX PARSER ────────────────────────────────────────────────────────
def parse_docx_bytes(docx_bytes):
    """Extract text from a .docx file given as bytes. Returns list of rows."""
    rows = []
    try:
        with zipfile.ZipFile(__import__('io').BytesIO(docx_bytes)) as dz:
            # Read word/document.xml
            doc_xml = dz.read('word/document.xml')
            root = ET.fromstring(doc_xml)

            # Word namespace
            W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

            # Extract paragraphs
            for para in root.findall(f'.//{{{W}}}p'):
                # Collect all runs in paragraph
                parts = []
                for run in para.findall(f'.//{{{W}}}r'):
                    for t in run.findall(f'{{{W}}}t'):
                        if t.text:
                            parts.append(t.text)
                    # Tab character
                    if run.find(f'{{{W}}}tab') is not None:
                        parts.append('\t')
                
                line = ''.join(parts).strip()
                if line:
                    rows.append([line])

            # Also extract table cells if any
            for tbl in root.findall(f'.//{{{W}}}tbl'):
                for tr in tbl.findall(f'.//{{{W}}}tr'):
                    row_cells = []
                    for tc in tr.findall(f'.//{{{W}}}tc'):
                        cell_text = []
                        for para in tc.findall(f'.//{{{W}}}p'):
                            parts = []
                            for run in para.findall(f'.//{{{W}}}r'):
                                for t in run.findall(f'{{{W}}}t'):
                                    if t.text:
                                        parts.append(t.text)
                            line = ''.join(parts).strip()
                            if line:
                                cell_text.append(line)
                        row_cells.append('\n'.join(cell_text))
                    if any(c.strip() for c in row_cells):
                        rows.append(row_cells)

    except Exception as e:
        log(f"  DOCX parse error: {e}")
    
    return rows if rows else [['']]

# ─── GET EMBEDDING PATH FOR EACH SHEET ───────────────────────────────────────
def get_sheet_embeddings(zf):
    """
    Returns dict: sheet_xml_path → list of embedded docx paths
    Reads xl/worksheets/_rels/sheetN.xml.rels to find oleObject relationships
    """
    result = {}
    ns_rels = 'http://schemas.openxmlformats.org/package/2006/relationships'
    ns_main = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
    ns_r    = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
    all_files = set(zf.namelist())

    try:
        wb_root = ET.fromstring(zf.read('xl/workbook.xml'))
        wb_rels  = ET.fromstring(zf.read('xl/_rels/workbook.xml.rels'))

        rid_to_path = {}
        for rel in wb_rels.findall(f'{{{ns_rels}}}Relationship'):
            rid    = rel.attrib.get('Id', '')
            target = rel.attrib.get('Target', '')
            if rid and target:
                p = os.path.normpath('xl/' + target.lstrip('/')).replace('\\', '/')
                rid_to_path[rid] = p

        for sh in wb_root.findall(f'.//{{{ns_main}}}sheet'):
            rid     = sh.attrib.get(f'{{{ns_r}}}id', '')
            ws_path = rid_to_path.get(rid, '')
            if not ws_path:
                continue

            rels_path = ws_path.replace('xl/worksheets/', 'xl/worksheets/_rels/') + '.rels'
            embeddings = []

            if rels_path in all_files:
                try:
                    ws_rels = ET.fromstring(zf.read(rels_path))
                    for rel in ws_rels.findall(f'{{{ns_rels}}}Relationship'):
                        target = rel.attrib.get('Target', '')
                        rtype  = rel.attrib.get('Type', '')
                        if not target:
                            continue
                        # Resolve path relative to xl/worksheets/
                        full = os.path.normpath('xl/worksheets/' + target).replace('\\', '/')
                        # Fix ../embeddings/ pattern
                        full = re.sub(r'xl/worksheets/\.\./(.+)', r'xl/\1', full)
                        full = full.replace('\\', '/')
                        if full in all_files and full.endswith('.docx'):
                            embeddings.append(full)
                            log(f"  Found embedding: {full}")
                except Exception as e:
                    log(f"  Rels error {ws_path}: {e}")

            result[ws_path] = embeddings
    except Exception as e:
        log(f"  SheetEmbedding map error: {e}")

    return result

# ─── SHARED STRINGS ──────────────────────────────────────────────────────────
def load_shared_strings(zf):
    shared = []
    try:
        root = ET.fromstring(zf.read('xl/sharedStrings.xml'))
        ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
        for si in root.findall(f'.//{{{ns}}}si'):
            parts = [t.text for t in si.findall(f'.//{{{ns}}}t') if t.text]
            shared.append(''.join(parts))
    except Exception:
        pass
    return shared

# ─── STYLES ──────────────────────────────────────────────────────────────────
def load_styles(zf):
    fmt_ids, num_fmts = [], {}
    try:
        root = ET.fromstring(zf.read('xl/styles.xml'))
        ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
        for nf in root.findall(f'.//{{{ns}}}numFmt'):
            num_fmts[int(nf.attrib.get('numFmtId', 0))] = nf.attrib.get('formatCode', '')
        for xf in root.findall(f'.//{{{ns}}}cellXfs/{{{ns}}}xf'):
            fmt_ids.append(int(xf.attrib.get('numFmtId', 0)))
    except Exception:
        pass
    return fmt_ids, num_fmts

def is_date_fmt(fmt_id, num_fmts):
    builtin = set(range(14, 18)) | {22} | set(range(27, 37)) | set(range(45, 48)) | set(range(50, 59))
    if fmt_id in builtin:
        return True
    return any(c in num_fmts.get(fmt_id, '') for c in 'yYdDhHsS')

def format_value(raw, fmt_id, num_fmts, ctype):
    if raw is None:
        return ''
    try:
        if ctype == 'b':
            return 'TRUE' if str(raw) in ('1', 'true') else 'FALSE'
        if ctype == 'e':
            return str(raw)
        try:
            fval = float(raw)
            if fmt_id and is_date_fmt(fmt_id, num_fmts):
                import datetime
                dt = datetime.datetime(1899, 12, 30) + datetime.timedelta(days=fval)
                return dt.strftime('%d/%m/%Y')
            return str(int(fval)) if fval == int(fval) else str(fval)
        except (ValueError, TypeError):
            return str(raw).strip()
    except Exception:
        return str(raw) if raw else ''

def col_to_idx(col):
    idx = 0
    for ch in col.upper():
        idx = idx * 26 + (ord(ch) - 64)
    return idx - 1

def ref_to_rc(ref):
    m = re.match(r'([A-Za-z]+)(\d+)', ref)
    return (int(m.group(2)) - 1, col_to_idx(m.group(1))) if m else (0, 0)

def parse_ws_xml(ws_bytes, shared, fmt_ids, num_fmts):
    ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
    root = ET.fromstring(ws_bytes)
    grid = {}
    max_r = max_c = 0
    for row_el in root.findall(f'.//{{{ns}}}row'):
        for c_el in row_el.findall(f'{{{ns}}}c'):
            ref = c_el.attrib.get('r', '')
            if not ref:
                continue
            r, c = ref_to_rc(ref)
            max_r, max_c = max(max_r, r), max(max_c, c)
            ctype = c_el.attrib.get('t', '')
            sidx  = int(c_el.attrib.get('s', 0))
            fmt   = fmt_ids[sidx] if sidx < len(fmt_ids) else 0
            v_el  = c_el.find(f'{{{ns}}}v')
            raw   = None
            if ctype == 's' and v_el is not None:
                try:
                    raw = shared[int(v_el.text)]
                    ctype = 'str'
                except Exception:
                    raw = v_el.text or ''
            elif ctype == 'inlineStr':
                parts = [t.text for t in c_el.findall(f'.//{{{ns}}}t') if t.text]
                raw = ''.join(parts)
                ctype = 'str'
            elif v_el is not None and v_el.text:
                raw = v_el.text
            val = format_value(raw, fmt, num_fmts, ctype)
            if val:
                grid[(r, c)] = val
    return grid, max_r, max_c

def load_merge_map(ws_bytes):
    ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
    merge_map = {}
    try:
        root = ET.fromstring(ws_bytes)
        for mc in root.findall(f'.//{{{ns}}}mergeCell'):
            ref = mc.attrib.get('ref', '')
            if ':' not in ref:
                continue
            s, e = ref.split(':')
            sr, sc = ref_to_rc(s)
            er, ec = ref_to_rc(e)
            for r in range(sr, er + 1):
                for c in range(sc, ec + 1):
                    merge_map[(r, c)] = (sr, sc)
    except Exception:
        pass
    return merge_map

# ─── MAIN XLSX PARSER ────────────────────────────────────────────────────────
def parse_xlsx(file_path):
    sheets, sheet_names = {}, []

    try:
        with zipfile.ZipFile(file_path, 'r') as zf:
            all_files = set(zf.namelist())
            shared    = load_shared_strings(zf)
            fmt_ids, num_fmts = load_styles(zf)
            sheet_embed_map   = get_sheet_embeddings(zf)

            ns_main = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
            ns_r    = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
            ns_rels = 'http://schemas.openxmlformats.org/package/2006/relationships'

            wb_root = ET.fromstring(zf.read('xl/workbook.xml'))
            wb_rels  = ET.fromstring(zf.read('xl/_rels/workbook.xml.rels'))

            rid_to_path = {}
            for rel in wb_rels.findall(f'{{{ns_rels}}}Relationship'):
                rid    = rel.attrib.get('Id', '')
                target = rel.attrib.get('Target', '')
                if rid and target:
                    p = os.path.normpath('xl/' + target.lstrip('/')).replace('\\', '/')
                    rid_to_path[rid] = p

            for sh in wb_root.findall(f'.//{{{ns_main}}}sheet'):
                name    = sh.attrib.get('name', '')
                rid     = sh.attrib.get(f'{{{ns_r}}}id', '')
                ws_path = rid_to_path.get(rid, '')
                if not name or not ws_path:
                    continue

                sheet_names.append(name)
                log(f"Sheet '{name}' → {ws_path}")

                # ── 1. Regular cells ─────────────────────────────────────
                cell_grid, max_r, max_c, merge_map = {}, 0, 0, {}
                if ws_path in all_files:
                    try:
                        ws_bytes  = zf.read(ws_path)
                        cell_grid, max_r, max_c = parse_ws_xml(ws_bytes, shared, fmt_ids, num_fmts)
                        merge_map = load_merge_map(ws_bytes)
                    except Exception as e:
                        log(f"  Cell error: {e}")

                # Fill merged cells
                for (r, c), (sr, sc) in merge_map.items():
                    if (r, c) != (sr, sc) and (sr, sc) in cell_grid and (r, c) not in cell_grid:
                        cell_grid[(r, c)] = cell_grid[(sr, sc)]
                        max_r, max_c = max(max_r, r), max(max_c, c)

                non_empty_cells = sum(1 for v in cell_grid.values() if str(v).strip())
                log(f"  Regular cells: {non_empty_cells}")

                # ── 2. Embedded Word documents ───────────────────────────
                embed_rows = []
                embeddings = sheet_embed_map.get(ws_path, [])
                log(f"  Embeddings: {embeddings}")

                for embed_path in embeddings:
                    try:
                        docx_bytes = zf.read(embed_path)
                        doc_rows   = parse_docx_bytes(docx_bytes)
                        embed_rows.extend(doc_rows)
                        log(f"  DOCX '{embed_path}': {len(doc_rows)} rows")
                        if doc_rows:
                            log(f"  DOCX first 3 rows: {doc_rows[:3]}")
                    except Exception as e:
                        log(f"  DOCX error {embed_path}: {e}")

                # ── 3. Build final rows ───────────────────────────────────
                if non_empty_cells > 0:
                    # Use cell data
                    rows = []
                    for r in range(max_r + 1):
                        row = [cell_grid.get((r, c), '') for c in range(max_c + 1)]
                        rows.append(row)
                    while len(rows) > 1 and all(v == '' for v in rows[-1]):
                        rows.pop()
                    if rows:
                        max_c2 = max((c for row in rows for c, v in enumerate(row) if v), default=0)
                        rows = [row[:max_c2 + 1] for row in rows]
                    # Append embedded doc rows if any
                    if embed_rows:
                        rows.extend(embed_rows)
                elif embed_rows:
                    # Use embedded doc data
                    rows = embed_rows
                else:
                    rows = [['']]

                sheets[name] = rows
                total = sum(1 for row in rows for v in row if str(v).strip())
                log(f"  FINAL: {len(rows)} rows, {total} non-empty cells")

    except Exception as e:
        import traceback
        log(f"FATAL: {e}\n{traceback.format_exc()}")
        return {'ok': False, 'error': str(e)}

    total = sum(1 for s in sheets.values() for row in s for v in row if str(v).strip())
    log(f"DONE: {len(sheets)} sheets, {total} total cells")
    return {'ok': True, 'sheets': sheets, 'names': sheet_names,
            'meta': {'total_cells': total}}

# ─── XLS ─────────────────────────────────────────────────────────────────────
def parse_xls(file_path):
    try:
        import xlrd
        wb = xlrd.open_workbook(file_path)
        sheets, names = {}, wb.sheet_names()
        for name in names:
            ws   = wb.sheet_by_name(name)
            rows = []
            for r in range(ws.nrows):
                row = []
                for c in range(ws.ncols):
                    v = ws.cell(r, c).value
                    if v is None or v == '':
                        row.append('')
                    elif isinstance(v, float):
                        row.append(str(int(v)) if v == int(v) else str(v))
                    else:
                        row.append(str(v).strip())
                rows.append(row)
            while len(rows) > 1 and all(c == '' for c in rows[-1]):
                rows.pop()
            sheets[name] = rows or [['']]
        wb.release_resources()
        return {'ok': True, 'sheets': sheets, 'names': names}
    except ImportError:
        return {'ok': False, 'error': 'xlrd not installed'}
    except Exception as e:
        return {'ok': False, 'error': f'XLS: {e}'}

# ─── CSV ─────────────────────────────────────────────────────────────────────
def parse_csv(file_path):
    rows = []
    for enc in ('utf-8', 'latin-1', 'cp1252'):
        try:
            with open(file_path, 'r', encoding=enc, newline='') as f:
                rows = [[str(c).strip() for c in row] for row in csv.reader(f)]
            break
        except UnicodeDecodeError:
            continue
    return {'ok': True, 'sheets': {'Sheet1': rows or [['']]}, 'names': ['Sheet1']}

# ─── ENTRY ───────────────────────────────────────────────────────────────────
def parse_excel(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.csv':
        return parse_csv(file_path)
    if ext == '.xls':
        return parse_xls(file_path)
    return parse_xlsx(file_path)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'ok': False, 'error': 'No file path'}))
        sys.exit(1)
    fp = sys.argv[1]
    if not os.path.exists(fp):
        print(json.dumps({'ok': False, 'error': f'Not found: {fp}'}))
        sys.exit(1)
    print(json.dumps(parse_excel(fp), ensure_ascii=False))
