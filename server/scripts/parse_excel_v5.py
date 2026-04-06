#!/usr/bin/env python3
"""
Universal Excel Parser v6 - Structure-preserving DOCX parser
Properly handles paragraphs + tables with correct column structure
"""

import sys, os, csv, json, zipfile, re, signal
import xml.etree.ElementTree as ET
from io import BytesIO

MAX_PARSE_TIME = 60
MAX_FILE_SIZE_MB = 50
MAX_ROWS_PER_SHEET = 10000
MAX_CELL_LENGTH = 5000

class TimeoutException(Exception):
    pass

def timeout_handler(signum, frame):
    raise TimeoutException("Timeout")

def log(msg):
    print(f"[PARSER] {msg}", file=sys.stderr, flush=True)

def safe_xml_parse(xml_bytes):
    try:
        return ET.fromstring(xml_bytes)
    except Exception as e:
        log(f"XML error: {e}")
        return None

# ─── WORD DOCX PARSER ────────────────────────────────────────────────────────
def parse_docx_bytes(docx_bytes):
    """
    Extract text from .docx preserving table structure.
    Returns list of rows where each row is a list of cell strings.
    Paragraphs outside tables become single-cell rows.
    Table rows become multi-cell rows.
    """
    rows = []
    
    try:
        with zipfile.ZipFile(BytesIO(docx_bytes)) as dz:
            if 'word/document.xml' not in dz.namelist():
                return [['']]
            
            doc_xml = dz.read('word/document.xml')
            root = safe_xml_parse(doc_xml)
            if root is None:
                return [['']]

            W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

            def get_para_text(para_el):
                """Get full text of a paragraph element"""
                parts = []
                for run in para_el.findall(f'.//{{{W}}}r'):
                    # Tab → space separator
                    if run.find(f'{{{W}}}tab') is not None:
                        parts.append(' | ')
                    for t in run.findall(f'{{{W}}}t'):
                        if t.text:
                            parts.append(t.text)
                return ''.join(parts).strip()

            def get_cell_text(tc_el):
                """Get all text from a table cell, joining paragraphs with newline"""
                lines = []
                for para in tc_el.findall(f'{{{W}}}p'):
                    txt = get_para_text(para)
                    if txt:
                        lines.append(txt)
                return '\n'.join(lines)

            # Collect all top-level body children in order
            # This preserves the document flow (paragraphs interspersed with tables)
            body = root.find(f'{{{W}}}body')
            if body is None:
                # Fallback: find all paragraphs
                body = root

            # Track which paragraphs are inside tables (to avoid double-processing)
            table_para_ids = set()

            for child in body:
                tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag

                if tag == 'tbl':
                    # ── TABLE ──────────────────────────────────────────
                    for tr in child.findall(f'.//{{{W}}}tr'):
                        row_cells = []
                        for tc in tr.findall(f'{{{W}}}tc'):
                            cell_text = get_cell_text(tc)
                            row_cells.append(cell_text[:MAX_CELL_LENGTH])
                            # Mark these paras as processed
                            for para in tc.findall(f'.//{{{W}}}p'):
                                table_para_ids.add(id(para))
                        
                        # Only add row if at least one cell has content
                        if any(c.strip() for c in row_cells):
                            rows.append(row_cells)

                elif tag == 'p':
                    # ── PARAGRAPH ─────────────────────────────────────
                    txt = get_para_text(child)
                    if txt:
                        rows.append([txt[:MAX_CELL_LENGTH]])

                elif tag == 'sdt':
                    # Structured document tag - extract paragraphs inside
                    for para in child.findall(f'.//{{{W}}}p'):
                        if id(para) not in table_para_ids:
                            txt = get_para_text(para)
                            if txt:
                                rows.append([txt[:MAX_CELL_LENGTH]])

            # Remove consecutive duplicate rows (Word sometimes duplicates)
            deduped = []
            prev = None
            for row in rows:
                if row != prev:
                    deduped.append(row)
                prev = row

            # Remove trailing empty rows
            while deduped and all(c.strip() == '' for c in deduped[-1]):
                deduped.pop()

            log(f"  DOCX: {len(deduped)} rows extracted")
            return deduped if deduped else [['']]

    except zipfile.BadZipFile:
        log("Invalid DOCX")
        return [['']]
    except Exception as e:
        import traceback
        log(f"DOCX error: {e}\n{traceback.format_exc()}")
        return [['']]

# ─── SHARED STRINGS ──────────────────────────────────────────────────────────
def load_shared_strings(zf):
    try:
        root = safe_xml_parse(zf.read('xl/sharedStrings.xml'))
        if root is None:
            return []
        ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
        return [''.join(t.text or '' for t in si.findall(f'.//{{{ns}}}t'))
                for si in root.findall(f'.//{{{ns}}}si')]
    except:
        return []

def load_styles(zf):
    try:
        root = safe_xml_parse(zf.read('xl/styles.xml'))
        if root is None:
            return [], {}
        ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
        num_fmts = {int(nf.attrib.get('numFmtId', 0)): nf.attrib.get('formatCode', '')
                    for nf in root.findall(f'.//{{{ns}}}numFmt')}
        fmt_ids = [int(xf.attrib.get('numFmtId', 0))
                   for xf in root.findall(f'.//{{{ns}}}cellXfs/{{{ns}}}xf')]
        return fmt_ids, num_fmts
    except:
        return [], {}

def is_date_fmt(fmt_id, num_fmts):
    builtin = set(range(14, 18)) | {22} | set(range(27, 37)) | set(range(45, 48)) | set(range(50, 59))
    return fmt_id in builtin or any(c in num_fmts.get(fmt_id, '') for c in 'yYdDhHsS')

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
    except:
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
    root = safe_xml_parse(ws_bytes)
    if root is None:
        return {}, 0, 0
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
                except:
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

def get_sheet_embeddings(zf):
    result = {}
    ns_rels = 'http://schemas.openxmlformats.org/package/2006/relationships'
    ns_main = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
    ns_r    = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
    try:
        all_files = set(zf.namelist())
        wb_root = safe_xml_parse(zf.read('xl/workbook.xml'))
        wb_rels  = safe_xml_parse(zf.read('xl/_rels/workbook.xml.rels'))
        if not wb_root or not wb_rels:
            return {}

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
                    ws_rels = safe_xml_parse(zf.read(rels_path))
                    if ws_rels:
                        for rel in ws_rels.findall(f'{{{ns_rels}}}Relationship'):
                            target = rel.attrib.get('Target', '')
                            if target:
                                full = os.path.normpath('xl/worksheets/' + target).replace('\\', '/')
                                full = re.sub(r'xl/worksheets/\.\./(.+)', r'xl/\1', full)
                                if full in all_files and full.endswith('.docx'):
                                    embeddings.append(full)
                except Exception as e:
                    log(f"Rels error: {e}")
            result[ws_path] = embeddings
    except Exception as e:
        log(f"Embedding map error: {e}")
    return result

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

            wb_root = safe_xml_parse(zf.read('xl/workbook.xml'))
            wb_rels  = safe_xml_parse(zf.read('xl/_rels/workbook.xml.rels'))
            if not wb_root or not wb_rels:
                return {'ok': False, 'error': 'Cannot parse workbook'}

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
                log(f"Sheet '{name}'")

                # Regular cells
                cell_grid, max_r, max_c = {}, 0, 0
                if ws_path in all_files:
                    try:
                        ws_bytes = zf.read(ws_path)
                        cell_grid, max_r, max_c = parse_ws_xml(ws_bytes, shared, fmt_ids, num_fmts)
                    except Exception as e:
                        log(f"  Cell error: {e}")

                non_empty = sum(1 for v in cell_grid.values() if str(v).strip())

                # Embedded docs
                embed_rows = []
                for embed_path in sheet_embed_map.get(ws_path, []):
                    try:
                        doc_rows = parse_docx_bytes(zf.read(embed_path))
                        embed_rows.extend(doc_rows)
                        log(f"  DOCX {embed_path}: {len(doc_rows)} rows")
                    except Exception as e:
                        log(f"  DOCX error: {e}")

                # Build final
                if non_empty > 0:
                    rows = [[cell_grid.get((r, c), '') for c in range(max_c + 1)]
                            for r in range(max_r + 1)]
                    while len(rows) > 1 and all(v == '' for v in rows[-1]):
                        rows.pop()
                    if embed_rows:
                        rows.extend(embed_rows)
                elif embed_rows:
                    rows = embed_rows
                else:
                    rows = [['']]

                sheets[name] = rows
                total = sum(1 for row in rows for v in row if str(v).strip())
                log(f"  → {len(rows)} rows, {total} cells")

    except Exception as e:
        import traceback
        log(f"FATAL: {e}\n{traceback.format_exc()}")
        return {'ok': False, 'error': str(e)}

    total = sum(1 for s in sheets.values() for row in s for v in row if str(v).strip())
    log(f"DONE: {len(sheets)} sheets, {total} cells")
    return {'ok': True, 'sheets': sheets, 'names': sheet_names, 'meta': {'total_cells': total}}

def parse_xls(file_path):
    try:
        import xlrd
        wb = xlrd.open_workbook(file_path)
        sheets, names = {}, wb.sheet_names()
        for name in names:
            ws = wb.sheet_by_name(name)
            rows = []
            for r in range(min(ws.nrows, MAX_ROWS_PER_SHEET)):
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

def parse_csv(file_path):
    rows = []
    for enc in ('utf-8', 'latin-1', 'cp1252'):
        try:
            with open(file_path, 'r', encoding=enc, newline='') as f:
                for i, row in enumerate(csv.reader(f)):
                    if i >= MAX_ROWS_PER_SHEET:
                        break
                    rows.append([str(c).strip() for c in row])
            break
        except UnicodeDecodeError:
            continue
    return {'ok': True, 'sheets': {'Sheet1': rows or [['']]}, 'names': ['Sheet1']}

def parse_excel(file_path):
    signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(MAX_PARSE_TIME)
    try:
        ext = os.path.splitext(file_path)[1].lower()
        if ext == '.csv':
            result = parse_csv(file_path)
        elif ext == '.xls':
            result = parse_xls(file_path)
        else:
            result = parse_xlsx(file_path)
        signal.alarm(0)
        return result
    except TimeoutException:
        return {'ok': False, 'error': 'Parsing timeout'}
    except Exception as e:
        return {'ok': False, 'error': str(e)}

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'ok': False, 'error': 'No file path'}))
        sys.exit(1)
    fp = sys.argv[1]
    if not os.path.exists(fp):
        print(json.dumps({'ok': False, 'error': f'Not found: {fp}'}))
        sys.exit(1)
    print(json.dumps(parse_excel(fp), ensure_ascii=False))