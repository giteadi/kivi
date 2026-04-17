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
                """Get full text of a paragraph element - handles nested formatting"""
                parts = []
                for node in para_el.iter():
                    tag = node.tag.split('}')[-1] if '}' in node.tag else node.tag
                    if tag == 't' and node.text:
                        parts.append(node.text)
                    elif tag == 'tab':
                        parts.append(' | ')
                    elif tag == 'br':
                        parts.append('\n')
                return ''.join(parts).strip()

            def get_cell_text(tc_el):
                """Get all text from a table cell, joining paragraphs with newline"""
                lines = []
                for para in tc_el.findall(f'{{{W}}}p'):
                    txt = get_para_text(para)
                    lines.append(txt)  # Keep empty lines for spacing
                # Remove trailing empty lines only
                while lines and not lines[-1].strip():
                    lines.pop()
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
                    # Split on tab characters to create multi-column rows
                    if '|' in txt:
                        cells = [cell.strip() for cell in txt.split('|')]
                        rows.append(cells[:MAX_CELL_LENGTH])
                    else:
                        rows.append([txt[:MAX_CELL_LENGTH] if txt else ''])

                elif tag == 'sdt':
                    # Structured document tag - extract paragraphs inside
                    for para in child.findall(f'.//{{{W}}}p'):
                        if id(para) not in table_para_ids:
                            txt = get_para_text(para)
                            if txt:
                                if '|' in txt:
                                    cells = [cell.strip() for cell in txt.split('|')]
                                    rows.append(cells[:MAX_CELL_LENGTH])
                                else:
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
        return {}, 0, 0, {}  # ← {} add kiya row_heights ke liye
    
    # ── Parse merged cells first ─────────────────────────
    merge_map = {}  # (r, c) → (top_r, top_c) for every non-top-left cell in a merge
    for mc in root.findall(f'.//{{{ns}}}mergeCell'):
        ref = mc.attrib.get('ref', '')
        if ':' not in ref:
            continue
        start_ref, end_ref = ref.split(':')
        sr, sc = ref_to_rc(start_ref)
        er, ec = ref_to_rc(end_ref)
        for r in range(sr, er + 1):
            for c in range(sc, ec + 1):
                if r == sr and c == sc:
                    continue  # top-left keeps its own value
                merge_map[(r, c)] = (sr, sc)
    
    grid = {}
    max_r = max_c = 0
    row_heights = {}  # ← NEW: {row_index: height_in_points}

    for row_el in root.findall(f'.//{{{ns}}}row'):
        # ── NEW: Read row height ──
        r_attr = row_el.attrib.get('r')
        ht = row_el.attrib.get('ht')
        if r_attr and ht:
            try:
                row_idx = int(r_attr) - 1  # 0-based
                row_heights[row_idx] = float(ht)
            except:
                pass
        # ─────────────────────────

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

    # ── Fill merged child cells with top-left value ──────
    for (r, c), (tr, tc) in merge_map.items():
        max_r = max(max_r, r)
        max_c = max(max_c, c)
        if (tr, tc) in grid:
            grid[(r, c)] = grid[(tr, tc)]

    return grid, max_r, max_c, row_heights  # ← row_heights bhi return karo

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
    sheets, sheet_names, sheet_row_heights = {}, [], {}  # ← NEW: sheet_row_heights dict
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
                cell_grid, max_r, max_c, row_heights = {}, 0, 0, {}  # ← NEW: row_heights
                if ws_path in all_files:
                    try:
                        ws_bytes = zf.read(ws_path)
                        cell_grid, max_r, max_c, row_heights = parse_ws_xml(ws_bytes, shared, fmt_ids, num_fmts)  # ← row_heights unpack
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

                # Calculate max columns from BOTH cell grid and embed rows
                embed_max_c = max((len(row) for row in embed_rows), default=0)
                final_max_c = max(max_c, embed_max_c)

                # Build final
                if non_empty > 0:
                    rows = [[cell_grid.get((r, c), '') for c in range(final_max_c + 1)]
                            for r in range(max_r + 1)]
                    while len(rows) > 1 and all(v == '' for v in rows[-1]):
                        rows.pop()
                    if embed_rows:
                        # Pad embed rows to match column count
                        for er in embed_rows:
                            while len(er) < final_max_c + 1:
                                er.append('')
                        rows.extend(embed_rows)
                elif embed_rows:
                    # Pad all embed rows to same column count
                    rows = []
                    for er in embed_rows:
                        padded = list(er)
                        while len(padded) < final_max_c:
                            padded.append('')
                        rows.append(padded)
                else:
                    rows = [['']]

                sheets[name] = rows
                sheet_row_heights[name] = row_heights  # ← NEW: save row heights
                total = sum(1 for row in rows for v in row if str(v).strip())
                log(f"  → {len(rows)} rows, {total} cells")

    except Exception as e:
        import traceback
        log(f"FATAL: {e}\n{traceback.format_exc()}")
        return {'ok': False, 'error': str(e)}

    total = sum(1 for s in sheets.values() for row in s for v in row if str(v).strip())
    log(f"DONE: {len(sheets)} sheets, {total} cells")
    return {
        'ok': True,
        'sheets': sheets,
        'names': sheet_names,
        'row_heights': sheet_row_heights,  # ← NEW: return row heights
        'meta': {'total_cells': total}
    }

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

# ─── STANDALONE DOCX → HTML PARSER (with images) ─────────────────────────────
def parse_docx_to_html(file_path):
    import base64

    try:
        # First check if file is a valid ZIP archive
        if not zipfile.is_zipfile(file_path):
            return {'ok': False, 'error': 'Invalid DOCX: file is not a valid ZIP archive. File may be corrupted.'}
            
        with zipfile.ZipFile(file_path, 'r') as dz:
            all_files = set(dz.namelist())
            if 'word/document.xml' not in all_files:
                # Log what files ARE present for debugging
                log(f"  DOCX validation failed. Files in archive: {sorted(list(all_files)[:20])}")
                return {'ok': False, 'error': 'Invalid DOCX: no document.xml. File may be corrupted or not a valid Word document.'}

            doc_xml = dz.read('word/document.xml')
            root = safe_xml_parse(doc_xml)
            if root is None:
                return {'ok': False, 'error': 'Cannot parse document.xml'}

            W   = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
            R   = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
            REL = 'http://schemas.openxmlformats.org/package/2006/relationships'
            A   = 'http://schemas.openxmlformats.org/drawingml/2006/main'
            PIC = 'http://schemas.openxmlformats.org/drawingml/2006/picture'

            # ── Load ALL relationship files (document + headers + footers) ──
            all_rels = {}  # rId → target path, merged from all .rels files
            rels_files = [f for f in all_files if f.startswith('word/_rels/') and f.endswith('.rels')]
            for rels_file in rels_files:
                try:
                    rels_root = safe_xml_parse(dz.read(rels_file))
                    if rels_root:
                        for rel in rels_root.findall(f'{{{REL}}}Relationship'):
                            rid    = rel.attrib.get('Id', '')
                            target = rel.attrib.get('Target', '')
                            if rid and target:
                                all_rels[rid] = target
                except Exception as e:
                    log(f"  Rels load error {rels_file}: {e}")

            # Keep document.xml.rels separately for document-scoped lookups
            rels = {}
            doc_rels_file = 'word/_rels/document.xml.rels'
            if doc_rels_file in all_files:
                try:
                    rels_root = safe_xml_parse(dz.read(doc_rels_file))
                    if rels_root:
                        for rel in rels_root.findall(f'{{{REL}}}Relationship'):
                            rid    = rel.attrib.get('Id', '')
                            target = rel.attrib.get('Target', '')
                            if rid and target:
                                rels[rid] = target
                except Exception as e:
                    log(f"  Doc rels error: {e}")

            # ── Load media files as base64 data URLs ──
            media_cache = {}
            MIME_MAP = {
                '.png':  'image/png',  '.jpg':  'image/jpeg', '.jpeg': 'image/jpeg',
                '.gif':  'image/gif',  '.bmp':  'image/bmp',  '.webp': 'image/webp',
                '.tiff': 'image/tiff', '.tif':  'image/tiff', '.svg':  'image/svg+xml',
                '.emf':  'image/x-emf', '.wmf': 'image/x-wmf',
            }
            MAX_IMAGE_SIZE = 5 * 1024 * 1024
            for fname in all_files:
                if not fname.startswith('word/media/'):
                    continue
                ext = os.path.splitext(fname)[1].lower()
                if ext not in MIME_MAP:
                    log(f"  Skip unsupported image format: {fname}")
                    continue
                data = dz.read(fname)
                if len(data) > MAX_IMAGE_SIZE:
                    log(f"  Skip large image ({len(data)} bytes): {fname}")
                    continue
                mime = MIME_MAP[ext]
                b64  = base64.b64encode(data).decode('ascii')
                data_url = f'data:{mime};base64,{b64}'
                # Cache under multiple path variations
                media_cache[fname] = data_url
                media_cache[fname.replace('word/', '')] = data_url
                norm = os.path.normpath(fname).replace('\\', '/')
                media_cache[norm] = data_url
                # Also store by just the filename (e.g. "image1.png")
                media_cache[os.path.basename(fname)] = data_url

            log(f"  DOCX→HTML: {len(media_cache)} media entries, {len(all_rels)} total rels")

            # ── Helper: resolve rId to <img> tag (tries all_rels first, then rels) ──
            def img_tag_for_rid(rid, source_rels=None):
                # Try source-specific rels first, then global all_rels
                target = (source_rels or {}).get(rid) or rels.get(rid) or all_rels.get(rid, '')
                if not target:
                    return ''
                # Normalize path
                candidates = []
                for prefix in ['', 'word/', 'word/media/']:
                    raw = prefix + target.lstrip('./')
                    p = os.path.normpath(raw).replace('\\', '/')
                    p = re.sub(r'word/\.\./(.+)', r'\1', p)
                    candidates.append(p)
                # Also try just the basename
                candidates.append(os.path.basename(target))
                candidates.append(target)
                
                for p in candidates:
                    if p in media_cache:
                        return f'<img src="{media_cache[p]}" style="max-width:100%;height:auto;" />'
                
                log(f"  Image not found for rId={rid}, target={target}, tried: {candidates}")
                return ''

            # ── Helper: find image in any element (drawing/pict/inline/anchor) ──
            def find_image_html(el, source_rels=None):
                # Method 1: Direct blip with embed attribute (DrawingML)
                for node in el.iter():
                    tag = node.tag.split('}')[-1] if '}' in node.tag else node.tag
                    ns_uri = node.tag.split('}')[0].lstrip('{') if '}' in node.tag else ''
                    
                    if tag == 'blip':
                        # Try both R namespace and a: namespace embed attributes
                        embed = (node.attrib.get(f'{{{R}}}embed') or 
                                 node.attrib.get(f'{{{R}}}link') or
                                 node.attrib.get('r:embed') or '')
                        if not embed:
                            # Try all attributes for r:embed
                            for attr_key, attr_val in node.attrib.items():
                                if 'embed' in attr_key.lower():
                                    embed = attr_val
                                    break
                        if embed:
                            img = img_tag_for_rid(embed, source_rels)
                            if img:
                                return img
                    
                    # VML/pict image path: v:imagedata
                    if tag == 'imagedata':
                        rid = (node.attrib.get(f'{{{R}}}id') or
                               node.attrib.get('r:id') or '')
                        if not rid:
                            for attr_key, attr_val in node.attrib.items():
                                if attr_key.endswith('}id') or attr_key == 'r:id':
                                    rid = attr_val
                                    break
                        if rid:
                            img = img_tag_for_rid(rid, source_rels)
                            if img:
                                return img
                return ''

            def esc_html(s):
                return str(s).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;')

            def run_to_html(run_el, source_rels=None):
                parts = []
                drawing = run_el.find(f'{{{W}}}drawing')
                if drawing is not None:
                    img = find_image_html(drawing, source_rels)
                    if img:
                        parts.append(img)
                pict = run_el.find(f'{{{W}}}pict')
                if pict is not None:
                    img = find_image_html(pict, source_rels)
                    if img:
                        parts.append(img)
                rpr = run_el.find(f'{{{W}}}rPr')
                bold      = rpr is not None and rpr.find(f'{{{W}}}b') is not None
                italic    = rpr is not None and rpr.find(f'{{{W}}}i') is not None
                underline = rpr is not None and rpr.find(f'{{{W}}}u') is not None
                strike    = rpr is not None and rpr.find(f'{{{W}}}strike') is not None
                texts = [t.text for t in run_el.findall(f'.//{{{W}}}t') if t.text]
                text = ''.join(texts)
                if not text:
                    for child in run_el:
                        ctag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
                        if ctag == 'tab':
                            parts.append('&nbsp;&nbsp;&nbsp;&nbsp;')
                        elif ctag == 'br':
                            parts.append('<br>')
                    if not parts:
                        return ''
                    return ''.join(parts)
                text = esc_html(text)
                if bold:      text = f'<strong>{text}</strong>'
                if italic:    text = f'<em>{text}</em>'
                if underline: text = f'<u>{text}</u>'
                if strike:    text = f'<s>{text}</s>'
                parts.append(text)
                return ''.join(parts)

            def para_to_html(para_el, source_rels=None):
                runs_html = []
                for run in para_el.findall(f'{{{W}}}r'):
                    h = run_to_html(run, source_rels)
                    if h:
                        runs_html.append(h)
                for child in para_el:
                    ctag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
                    if ctag == 'drawing':
                        img = find_image_html(child, source_rels)
                        if img:
                            runs_html.append(img)
                content = ''.join(runs_html)
                if not content.strip():
                    return '<p><br></p>'
                return f'<p>{content}</p>'

            def get_heading_level(para_el):
                ppr = para_el.find(f'{{{W}}}pPr')
                if ppr is None:
                    return 0
                style_el = ppr.find(f'{{{W}}}pStyle')
                if style_el is None:
                    return 0
                val = style_el.attrib.get(f'{{{W}}}val', '')
                m = re.match(r'[Hh]eading\s*(\d)', val)
                if m:
                    return int(m.group(1))
                if val.lower() == 'title':
                    return 1
                return 0

            def get_list_info(para_el):
                ppr = para_el.find(f'{{{W}}}pPr')
                if ppr is None:
                    return None
                numpr = ppr.find(f'{{{W}}}numPr')
                if numpr is None:
                    return None
                ilvl_el = numpr.find(f'{{{W}}}ilvl')
                lvl = int(ilvl_el.attrib.get(f'{{{W}}}val', '0')) if ilvl_el is not None else 0
                numid_el = numpr.find(f'{{{W}}}numId')
                num_id = numid_el.attrib.get(f'{{{W}}}val', '0') if numid_el is not None else '0'
                if num_id == '0':
                    return None
                return {'level': lvl, 'numId': num_id}

            # ── BUG FIX: extract_xml_to_html now handles BOTH paragraphs AND tables ──
            def extract_element_to_html(el, source_rels=None):
                """Recursively convert any element (para or table) to HTML."""
                html_parts = []
                tag = el.tag.split('}')[-1] if '}' in el.tag else el.tag
                
                if tag == 'p':
                    ph = para_to_html(el, source_rels)
                    if ph and ph != '<p><br></p>':
                        html_parts.append(ph)
                
                elif tag == 'tbl':
                    html_parts.append('<table style="border-collapse:collapse;width:100%;">')
                    for tr in el.findall(f'{{{W}}}tr'):
                        html_parts.append('<tr>')
                        for tc in tr.findall(f'{{{W}}}tc'):
                            cell_paras = []
                            # Check for images in runs inside this cell
                            for para in tc.findall(f'.//{{{W}}}p'):
                                ph = para_to_html(para, source_rels)
                                ph_inner = re.sub(r'^<p>(.*?)</p>$', r'\1', ph)
                                if ph_inner.strip() and ph_inner.strip() != '<br>':
                                    cell_paras.append(ph_inner)
                            cell_content = '<br>'.join(cell_paras) if cell_paras else '&nbsp;'
                            tcpr = tc.find(f'{{{W}}}tcPr')
                            colspan_attr = ''
                            if tcpr is not None:
                                gs = tcpr.find(f'{{{W}}}gridSpan')
                                if gs is not None:
                                    cs_val = gs.attrib.get(f'{{{W}}}val', '')
                                    if cs_val and cs_val != '1':
                                        colspan_attr = f' colspan="{cs_val}"'
                            html_parts.append(
                                f'<td style="border:1px solid #ccc;padding:6px 10px;vertical-align:top;"{colspan_attr}>{cell_content}</td>'
                            )
                        html_parts.append('</tr>')
                    html_parts.append('</table>')
                
                return html_parts

            # ── Load headers — now with per-header rels ──
            header_html_parts = []
            for fname in sorted(all_files):
                if not (fname.startswith('word/header') and fname.endswith('.xml')):
                    continue
                # Load this header's specific rels
                hrels_path = fname.replace('word/', 'word/_rels/') + '.rels'
                h_rels = {}
                if hrels_path in all_files:
                    try:
                        hr = safe_xml_parse(dz.read(hrels_path))
                        if hr:
                            for rel in hr.findall(f'{{{REL}}}Relationship'):
                                rid = rel.attrib.get('Id', '')
                                tgt = rel.attrib.get('Target', '')
                                if rid and tgt:
                                    h_rels[rid] = tgt
                    except Exception as e:
                        log(f"  Header rels error {hrels_path}: {e}")
                
                try:
                    h_root = safe_xml_parse(dz.read(fname))
                    if h_root is None:
                        continue
                    h_body = h_root  # headers don't have a <body>, just iterate direct children
                    count = 0
                    for child in h_body:
                        parts = extract_element_to_html(child, h_rels)
                        header_html_parts.extend(parts)
                        count += len(parts)
                    log(f"  Header {fname}: {count} elements (h_rels: {len(h_rels)})")
                except Exception as e:
                    log(f"  Header error {fname}: {e}")

            # ── Process body ──
            body = root.find(f'{{{W}}}body')
            if body is None:
                body = root

            html_parts = []

            if header_html_parts:
                html_parts.append('<div style="margin-bottom:20px;padding:15px;background:#f8f9fa;border:1px solid #dee2e6;border-radius:8px;">')
                html_parts.extend(header_html_parts)
                html_parts.append('</div>')
                log(f"  Added {len(header_html_parts)} header elements")

            current_list_type = None
            current_list_items = []
            prev_num_id = None

            def flush_list():
                nonlocal current_list_type, current_list_items, prev_num_id
                if current_list_type and current_list_items:
                    tag = current_list_type
                    html_parts.append(f'<{tag}>')
                    for item in current_list_items:
                        html_parts.append(item)
                    html_parts.append(f'</{tag}>')
                current_list_type = None
                current_list_items = []
                prev_num_id = None

            for child in body:
                tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag

                if tag == 'tbl':
                    flush_list()
                    parts = extract_element_to_html(child, rels)
                    html_parts.extend(parts)

                elif tag == 'p':
                    list_info = get_list_info(child)
                    heading = get_heading_level(child)
                    para_html = para_to_html(child, rels)

                    if list_info:
                        list_type = 'ol' if int(list_info['numId']) % 2 == 1 else 'ul'
                        level = list_info['level']
                        if prev_num_id != list_info['numId'] or current_list_type != list_type:
                            flush_list()
                            current_list_type = list_type
                        indent = '  ' * level
                        content = re.sub(r'^<p>(.*?)</p>$', r'\1', para_html)
                        current_list_items.append(f'{indent}<li>{content}</li>')
                        prev_num_id = list_info['numId']
                    else:
                        flush_list()
                        if heading and heading <= 6:
                            html_parts.append(f'<h{heading}>{re.sub(r"^<p>(.*?)</p>$", r"\\1", para_html)}</h{heading}>')
                        else:
                            html_parts.append(para_html)

                elif tag == 'sdt':
                    flush_list()
                    for para in child.findall(f'.//{{{W}}}p'):
                        ph = para_to_html(para, rels)
                        html_parts.append(ph)

            flush_list()

            html = '\n'.join(html_parts)
            if not html.strip():
                html = '<p><br></p>'

            sheet_name = os.path.splitext(os.path.basename(file_path))[0]
            log(f"  DOCX→HTML: generated {len(html)} chars, sheet='{sheet_name}'")

            return {
                'ok': True,
                'sheets': {sheet_name: [['__html__', html]]},
                'names': [sheet_name],
                'row_heights': {},
                'meta': {'format': 'docx', 'has_images': bool(media_cache)}
            }

    except zipfile.BadZipFile:
        return {'ok': False, 'error': 'Invalid DOCX file (bad zip)'}
    except Exception as e:
        import traceback
        log(f"DOCX→HTML error: {e}\n{traceback.format_exc()}")
        return {'ok': False, 'error': str(e)}

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
        elif ext == '.docx':
            result = parse_docx_to_html(file_path)
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
