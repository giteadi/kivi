#!/usr/bin/env python3
"""
Universal Excel Parser v3 - VML + DrawingML + Merged Cells + Regular Cells
"""

import sys, os, csv, json, zipfile, re
import xml.etree.ElementTree as ET

def log(msg):
    print(f"[PARSER] {msg}", file=sys.stderr)

def load_shared_strings(zf):
    shared = []
    try:
        root = ET.fromstring(zf.read('xl/sharedStrings.xml'))
        ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
        for si in root.findall(f'.//{{{ns}}}si'):
            parts = [t.text for t in si.findall(f'.//{{{ns}}}t') if t.text]
            shared.append(''.join(parts))
    except Exception as e:
        log(f"SharedStrings: {e}")
    return shared

def load_styles(zf):
    fmt_ids, num_fmts = [], {}
    try:
        root = ET.fromstring(zf.read('xl/styles.xml'))
        ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
        for nf in root.findall(f'.//{{{ns}}}numFmt'):
            num_fmts[int(nf.attrib.get('numFmtId', 0))] = nf.attrib.get('formatCode', '')
        for xf in root.findall(f'.//{{{ns}}}cellXfs/{{{ns}}}xf'):
            fmt_ids.append(int(xf.attrib.get('numFmtId', 0)))
    except Exception as e:
        log(f"Styles: {e}")
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
    except Exception as e:
        log(f"MergeMap: {e}")
    return merge_map

def extract_ole_object_text(zf, ole_rid):
    """Extract text from OLE objects (Word documents, etc.)"""
    try:
        # Find the OLE object file path from relationships
        ns_rels = 'http://schemas.openxmlformats.org/package/2006/relationships'
        
        # Read worksheet relationships to find OLE target
        ws_rels_path = 'xl/worksheets/_rels/sheet1.xml.rels'
        if ws_rels_path not in zf.namelist():
            return []
            
        ws_rels = ET.fromstring(zf.read(ws_rels_path))
        for rel in ws_rels.findall(f'{{{ns_rels}}}Relationship'):
            if rel.attrib.get('Id', '') == ole_rid:
                target = rel.attrib.get('Target', '')
                if target:
                    # Check for embedded Word documents
                    if 'embeddings/' in target:
                        # Extract text from embedded Word .docx file
                        return extract_word_docx_text(zf, target)
                    else:
                        # OLE objects are usually in xl/ole/ directory
                        ole_path = f'xl/ole/{target.split("/")[-1]}'
                        if ole_path in zf.namelist():
                            ole_data = zf.read(ole_path)
                            log(f"  Found OLE object: {ole_path} ({len(ole_data)} bytes)")
                            return [f"[OLE Object: {target}]"]
        return []
    except Exception as e:
        log(f"OLE extraction error: {e}")
        return []

def extract_word_docx_text(zf, docx_path):
    """Extract text from embedded Word .docx files"""
    try:
        # Get the embedded .docx file
        if docx_path not in zf.namelist():
            return []
            
        docx_data = zf.read(docx_path)
        log(f"  Found Word doc: {docx_path} ({len(docx_data)} bytes)")
        
        # Create a temporary zip-like object from the docx data
        import io
        docx_zip = zipfile.ZipFile(io.BytesIO(docx_data))
        
        # Extract text from document.xml
        try:
            doc_xml = docx_zip.read('word/document.xml')
            root = ET.fromstring(doc_xml)
            
            # Extract all text from paragraphs
            ns_word = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
            texts = []
            
            for para in root.findall(f'.//{{{ns_word}}}p'):
                para_text = []
                for t in para.findall(f'.//{{{ns_word}}}t'):
                    if t.text:
                        para_text.append(t.text)
                if para_text:
                    texts.append(''.join(para_text))
            
            log(f"  Extracted {len(texts)} paragraphs from Word doc")
            return texts
            
        except Exception as e:
            log(f"  Word doc text extraction error: {e}")
            return [f"[Word Document: {docx_path}]"]
            
    except Exception as e:
        log(f"Word doc processing error: {e}")
        return []

def parse_vml(vml_bytes):
    texts = []
    try:
        content = vml_bytes.decode('utf-8', errors='replace')

        # Find all textbox content blocks
        # VML format: <v:textbox>...</v:textbox>
        for pattern in [
            r'<[vV]:textbox[^>]*>(.*?)</[vV]:textbox>',
            r'<textbox[^>]*>(.*?)</textbox>',
        ]:
            blocks = re.findall(pattern, content, re.DOTALL | re.IGNORECASE)
            if blocks:
                for block in blocks:
                    # Strip HTML/XML tags
                    text = re.sub(r'<[^>]+>', ' ', block)
                    # Decode entities
                    for ent, ch in [('&amp;','&'),('&lt;','<'),('&gt;','>'),('&nbsp;',' '),('&#13;','\n'),('&#10;','\n'),('&quot;','"')]:
                        text = text.replace(ent, ch)
                    # Split into lines
                    for line in re.split(r'[\n\r]+', text):
                        line = re.sub(r'\s+', ' ', line).strip()
                        if line and len(line) > 1:
                            texts.append(line)
                break  # found blocks, stop trying patterns

        # If still empty, try extracting ALL text from VML
        if not texts:
            clean = re.sub(r'<[^>]+>', ' ', content)
            for ent, ch in [('&amp;','&'),('&lt;','<'),('&gt;','>'),('&nbsp;',' ')]:
                clean = clean.replace(ent, ch)
            for line in re.split(r'[\n\r]+', clean):
                line = re.sub(r'\s+', ' ', line).strip()
                if line and len(line) > 2 and not line.startswith('<?'):
                    texts.append(line)

    except Exception as e:
        log(f"VML error: {e}")
    log(f"  VML: {len(texts)} texts extracted")
    return texts

def parse_drawingml(xml_bytes):
    positioned, plain = [], []
    try:
        root = ET.fromstring(xml_bytes)
        xdr = 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing'
        a   = 'http://schemas.openxmlformats.org/drawingml/2006/main'

        def get_text(txbody):
            if txbody is None:
                return ''
            lines = []
            for p in txbody.findall(f'.//{{{a}}}p'):
                parts = [t.text for t in p.findall(f'.//{{{a}}}t') if t.text]
                line = ''.join(parts).strip()
                if line:
                    lines.append(line)
            return '\n'.join(lines)

        for anchor_tag in (f'{{{xdr}}}twoCellAnchor', f'{{{xdr}}}oneCellAnchor'):
            for anchor in root.findall(anchor_tag):
                from_el = anchor.find(f'{{{xdr}}}from')
                row_el  = from_el.find(f'{{{xdr}}}row') if from_el is not None else None
                col_el  = from_el.find(f'{{{xdr}}}col') if from_el is not None else None
                for sp in anchor.findall(f'.//{{{xdr}}}sp'):
                    text = get_text(sp.find(f'.//{{{a}}}txBody'))
                    if not text:
                        continue
                    plain.append(text)
                    if row_el is not None and col_el is not None:
                        try:
                            positioned.append((int(row_el.text), int(col_el.text), text))
                        except Exception:
                            pass
    except Exception as e:
        log(f"DrawingML error: {e}")
    return positioned, plain

def build_sheet_drawing_map(zf):
    result = {}
    try:
        ns_main = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
        ns_r    = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
        ns_rels = 'http://schemas.openxmlformats.org/package/2006/relationships'

        wb_root = ET.fromstring(zf.read('xl/workbook.xml'))
        wb_rels  = ET.fromstring(zf.read('xl/_rels/workbook.xml.rels'))
        all_files = set(zf.namelist())

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

            drawings = []
            rels_path = ws_path.replace('xl/worksheets/', 'xl/worksheets/_rels/') + '.rels'
            if rels_path in all_files:
                try:
                    ws_rels = ET.fromstring(zf.read(rels_path))
                    for rel in ws_rels.findall(f'{{{ns_rels}}}Relationship'):
                        target = rel.attrib.get('Target', '')
                        if not target:
                            continue
                        # Resolve: target is relative to xl/worksheets/
                        full = os.path.normpath('xl/worksheets/' + target).replace('\\', '/')
                        # Fix double-xl paths like xl/worksheets/../drawings/...
                        full = re.sub(r'xl/worksheets/\.\./(.+)', r'xl/\1', full)
                        full = full.replace('\\', '/')
                        if full in all_files:
                            drawings.append(full)
                            log(f"  Found drawing: {full}")
                except Exception as e:
                    log(f"WS rels error {ws_path}: {e}")

            result[ws_path] = drawings
    except Exception as e:
        log(f"DrawingMap error: {e}")
    return result

def parse_xlsx(file_path):
    sheets, sheet_names = {}, []
    try:
        with zipfile.ZipFile(file_path, 'r') as zf:
            all_files = set(zf.namelist())
            log(f"ZIP entries: {sorted(all_files)[:30]}")  # Show first 30 files

            shared   = load_shared_strings(zf)
            fmt_ids, num_fmts = load_styles(zf)
            sheet_drawing_map = build_sheet_drawing_map(zf)

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

                cell_grid, max_r, max_c, merge_map = {}, 0, 0, {}
                if ws_path in all_files:
                    try:
                        ws_bytes  = zf.read(ws_path)
                        cell_grid, max_r, max_c = parse_ws_xml(ws_bytes, shared, fmt_ids, num_fmts)
                        merge_map = load_merge_map(ws_bytes)
                        log(f"  Cells: {len(cell_grid)}, Merges: {len(merge_map)}")
                    except Exception as e:
                        log(f"  Cell error: {e}")

                # Fill merged cells
                for (r, c), (sr, sc) in merge_map.items():
                    if (r, c) != (sr, sc) and (sr, sc) in cell_grid and (r, c) not in cell_grid:
                        cell_grid[(r, c)] = cell_grid[(sr, sc)]
                        max_r, max_c = max(max_r, r), max(max_c, c)

                # Drawing texts
                all_drawing_texts  = []
                positioned_drawing = []
                drawing_paths = sheet_drawing_map.get(ws_path, [])
                log(f"  Drawings: {drawing_paths}")

                for dp in drawing_paths:
                    dp_bytes = zf.read(dp)
                    if dp.endswith('.vml'):
                        vml_texts = parse_vml(dp_bytes)
                        all_drawing_texts.extend(vml_texts)
                    elif 'drawing' in dp and dp.endswith('.xml'):
                        pos, plain = parse_drawingml(dp_bytes)
                        positioned_drawing.extend(pos)
                        all_drawing_texts.extend(plain)

                # OLE Objects extraction - process ALL embedded Word docs
                try:
                    ws_root = ET.fromstring(zf.read(ws_path))
                    ole_objects = ws_root.findall('.//{{{ns_main}}}oleObject')
                    for ole in ole_objects:
                        ole_rid = ole.attrib.get(f'{{{ns_r}}}id', '')
                        if ole_rid:
                            ole_texts = extract_ole_object_text(zf, ole_rid)
                            all_drawing_texts.extend(ole_texts)
                            log(f"  OLE object {ole_rid}: {len(ole_texts)} texts")
                except Exception as e:
                    log(f"  OLE parse error: {e}")
                
                # Also process ALL embedded Word documents directly
                all_word_texts = []
                for file_name in zf.namelist():
                    if file_name.startswith('xl/embeddings/Microsoft_Word_Document') and file_name.endswith('.docx'):
                        try:
                            word_texts = extract_word_docx_text(zf, file_name)
                            all_word_texts.extend(word_texts)
                            log(f"  Direct Word doc {file_name}: {len(word_texts)} texts")
                        except Exception as e:
                            log(f"  Direct Word doc error {file_name}: {e}")
                
                all_drawing_texts.extend(all_word_texts)
                log(f"  Total Word texts: {len(all_word_texts)}")

                for (dr, dc, text) in positioned_drawing:
                    if (dr, dc) not in cell_grid:
                        cell_grid[(dr, dc)] = text
                        max_r, max_c = max(max_r, dr), max(max_c, dc)

                non_empty = sum(1 for v in cell_grid.values() if str(v).strip())
                log(f"  Non-empty cells: {non_empty}, Drawing texts: {len(all_drawing_texts)}")

                if non_empty == 0 and all_drawing_texts:
                    unique_texts = list(dict.fromkeys(t for t in all_drawing_texts if str(t).strip()))
                    rows = [[t] for t in unique_texts]
                elif non_empty == 0:
                    rows = [['']]
                else:
                    rows = []
                    for r in range(max_r + 1):
                        row = [cell_grid.get((r, c), '') for c in range(max_c + 1)]
                        rows.append(row)
                    while len(rows) > 1 and all(v == '' for v in rows[-1]):
                        rows.pop()
                    if rows:
                        max_c2 = max((c for row in rows for c, v in enumerate(row) if v), default=0)
                        rows = [row[:max_c2 + 1] for row in rows]

                sheets[name] = rows if rows else [['']]
                total = sum(1 for row in sheets[name] for v in row if v)
                log(f"  FINAL: {len(sheets[name])} rows, {total} non-empty")

    except Exception as e:
        import traceback
        log(f"FATAL: {e}\n{traceback.format_exc()}")
        return {'ok': False, 'error': str(e)}

    total = sum(1 for s in sheets.values() for row in s for v in row if v)
    log(f"DONE: {len(sheets)} sheets, {total} total cells")
    return {'ok': True, 'sheets': sheets, 'names': sheet_names, 'meta': {'total_cells': total}}

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
