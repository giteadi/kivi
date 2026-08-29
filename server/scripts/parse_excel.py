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

# ─── EMBEDDED DOCX → HTML CONVERTER ──────────────────────────────────────────
def parse_docx_bytes_to_html(docx_bytes):
    """Convert embedded .docx bytes to HTML string.
    Preserves bold, italic, tables, headings.
    Returns HTML string or None on failure."""
    import base64
    try:
        with zipfile.ZipFile(BytesIO(docx_bytes)) as dz:
            all_files = set(dz.namelist())
            if 'word/document.xml' not in all_files:
                return None
            
            doc_xml = dz.read('word/document.xml')
            root = safe_xml_parse(doc_xml)
            if root is None:
                return None
            
            W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
            R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
            REL = 'http://schemas.openxmlformats.org/package/2006/relationships'
            
            # Load rels
            rels = {}
            doc_rels_file = 'word/_rels/document.xml.rels'
            if doc_rels_file in all_files:
                try:
                    rels_root = safe_xml_parse(dz.read(doc_rels_file))
                    if rels_root:
                        for rel in rels_root.findall(f'{{{REL}}}Relationship'):
                            rid = rel.attrib.get('Id', '')
                            target = rel.attrib.get('Target', '')
                            if rid and target:
                                rels[rid] = target
                except Exception as e:
                    log(f"  Embedded rels error: {e}")
            
            # Load media as base64
            media_cache = {}
            MIME_MAP = {
                '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
                '.gif': 'image/gif', '.bmp': 'image/bmp', '.webp': 'image/webp',
            }
            for fname in all_files:
                if not fname.startswith('word/media/'):
                    continue
                ext = os.path.splitext(fname)[1].lower()
                if ext not in MIME_MAP:
                    continue
                try:
                    data = dz.read(fname)
                    if len(data) > 5 * 1024 * 1024:  # Skip large images
                        continue
                    b64 = base64.b64encode(data).decode('ascii')
                    data_url = f'data:{MIME_MAP[ext]};base64,{b64}'
                    media_cache[fname] = data_url
                    media_cache[os.path.basename(fname)] = data_url
                except Exception:
                    pass
            
            def esc(s):
                return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            
            def img_tag_for_rid(rid):
                target = rels.get(rid, '')
                if not target:
                    return ''
                candidates = [
                    target,
                    'word/' + target.lstrip('./'),
                    os.path.basename(target),
                    os.path.normpath('word/' + target).replace('\\', '/'),
                ]
                for p in candidates:
                    p = re.sub(r'word/\.\./(.+)', r'\1', p)
                    if p in media_cache:
                        return f'<img src="{media_cache[p]}" style="max-width:100%;height:auto;" />'
                return ''
            
            def find_image_in_el(el):
                for node in el.iter():
                    tag = node.tag.split('}')[-1] if '}' in node.tag else node.tag
                    if tag == 'blip':
                        embed = node.attrib.get(f'{{{R}}}embed', '')
                        if not embed:
                            for k, v in node.attrib.items():
                                if 'embed' in k.lower():
                                    embed = v
                                    break
                        if embed:
                            img = img_tag_for_rid(embed)
                            if img:
                                return img
                    if tag == 'imagedata':
                        rid = node.attrib.get(f'{{{R}}}id', '')
                        if rid:
                            img = img_tag_for_rid(rid)
                            if img:
                                return img
                return ''
            
            def run_to_html(run_el):
                parts = []
                # Check for drawing/image
                for drawing in run_el.findall(f'{{{W}}}drawing'):
                    img = find_image_in_el(drawing)
                    if img:
                        parts.append(img)
                for pict in run_el.findall(f'{{{W}}}pict'):
                    img = find_image_in_el(pict)
                    if img:
                        parts.append(img)
                
                rpr = run_el.find(f'{{{W}}}rPr')
                bold = rpr is not None and rpr.find(f'{{{W}}}b') is not None
                italic = rpr is not None and rpr.find(f'{{{W}}}i') is not None
                underline = rpr is not None and rpr.find(f'{{{W}}}u') is not None
                strike = rpr is not None and rpr.find(f'{{{W}}}strike') is not None
                
                texts = [t.text for t in run_el.findall(f'.//{{{W}}}t') if t.text]
                text = ''.join(texts)
                if text:
                    text = esc(text)
                    if bold: text = f'<strong>{text}</strong>'
                    if italic: text = f'<em>{text}</em>'
                    if underline: text = f'<u>{text}</u>'
                    if strike: text = f'<s>{text}</s>'
                    parts.append(text)
                return ''.join(parts)
            
            def para_to_html(para_el):
                runs_html = []
                for run in para_el.findall(f'{{{W}}}r'):
                    h = run_to_html(run)
                    if h:
                        runs_html.append(h)
                content = ''.join(runs_html)
                if not content.strip():
                    return '<p><br></p>'
                
                # Detect heading
                ppr = para_el.find(f'{{{W}}}pPr')
                if ppr is not None:
                    style_el = ppr.find(f'{{{W}}}pStyle')
                    if style_el is not None:
                        val = style_el.attrib.get(f'{{{W}}}val', '')
                        m = re.match(r'[Hh]eading\s*(\d)', val)
                        if m:
                            lvl = m.group(1)
                            return f'<h{lvl}>{content}</h{lvl}>'
                
                return f'<p>{content}</p>'
            
            def table_to_html(tbl_el):
                html = ['<table style="border-collapse:collapse;width:100%;margin:8px 0;">']
                for tr in tbl_el.findall(f'.//{{{W}}}tr'):
                    html.append('<tr>')
                    for tc in tr.findall(f'{{{W}}}tc'):
                        cell_parts = []
                        for para in tc.findall(f'.//{{{W}}}p'):
                            ph = para_to_html(para)
                            inner = re.sub(r'^<p>(.*?)</p>$', r'\1', ph, flags=re.DOTALL)
                            if inner.strip() and inner.strip() != '<br>':
                                cell_parts.append(inner)
                        
                        tcpr = tc.find(f'{{{W}}}tcPr')
                        colspan_attr = ''
                        if tcpr is not None:
                            gs = tcpr.find(f'{{{W}}}gridSpan')
                            if gs is not None:
                                cs_val = gs.attrib.get(f'{{{W}}}val', '')
                                if cs_val and cs_val != '1':
                                    colspan_attr = f' colspan="{cs_val}"'
                        
                        cell_content = '<br>'.join(cell_parts) if cell_parts else '&nbsp;'
                        html.append(f'<td style="border:1px solid #555;padding:6px 10px;vertical-align:top;"{colspan_attr}>{cell_content}</td>')
                    html.append('</tr>')
                html.append('</table>')
                return '\n'.join(html)
            
            # Process body
            body = root.find(f'{{{W}}}body')
            if body is None:
                body = root
            
            html_parts = []
            for child in body:
                tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
                if tag == 'tbl':
                    html_parts.append(table_to_html(child))
                elif tag == 'p':
                    ph = para_to_html(child)
                    html_parts.append(ph)
                elif tag == 'sdt':
                    for para in child.findall(f'.//{{{W}}}p'):
                        html_parts.append(para_to_html(para))
            
            html = '\n'.join(html_parts)
            return html if html.strip() else None
    
    except Exception as e:
        import traceback
        log(f"Embedded DOCX→HTML error: {e}\n{traceback.format_exc()}")
        return None


def rows_to_html(rows):
    """Plain rows list ko basic HTML mein convert karo (fallback)"""
    parts = []
    i = 0
    while i < len(rows):
        row = rows[i]
        if len(row) >= 2 and any(c.strip() for c in row):
            # Multi-column: table
            block = []
            while i < len(rows) and len(rows[i]) >= 2 and any(c.strip() for c in rows[i]):
                block.append(rows[i])
                i += 1
            parts.append('<table style="border-collapse:collapse;width:100%;margin:8px 0;">')
            for ri, r in enumerate(block):
                parts.append('<tr>')
                for cell in r:
                    tag = 'th' if ri == 0 else 'td'
                    style = 'border:1px solid #555;padding:6px 10px;'
                    if ri == 0:
                        style += 'background:#f0f0f0;font-weight:bold;'
                    parts.append(f'<{tag} style="{style}">{cell or "&nbsp;"}</{tag}>')
                parts.append('</tr>')
            parts.append('</table>')
        else:
            text = row[0].strip() if row else ''
            if text:
                # Detect heading
                if text == text.upper() and len(text) > 3 and re.search(r'[A-Z]{4,}', text):
                    parts.append(f'<h2>{text}</h2>')
                else:
                    parts.append(f'<p>{text}</p>')
            else:
                parts.append('<p><br></p>')
            i += 1
    return '\n'.join(parts) or '<p><br></p>'

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

# ─── STYLE / THEME / COLOR HELPERS ───────────────────────────────────────────
# Default Excel 2003 palette (first 64 indexed colours).
_DEFAULT_INDEXED = [
    '000000', 'FFFFFF', 'FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF',
    '000000', 'FFFFFF', 'FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF',
    '800000', '008000', '000080', '808000', '800080', '008080', 'C0C0C0', '808080',
    '9999FF', '993366', 'FFFFCC', 'CCFFFF', '660066', 'FF8080', '0066CC', 'CCCCFF',
    '000080', 'FF00FF', 'FFFF00', '00FFFF', '800080', '800000', '008080', '0000FF',
    '00CCFF', 'CCFFFF', 'CCFFCC', 'FFFF99', '99CCFF', 'FF99CC', 'CC99FF', 'FFCC99',
    '3366FF', '33CCCC', '99CC00', 'FFCC00', 'FF9900', 'FF6600', '666699', '969696',
    '003366', '339966', '003300', '333300', '993300', '993366', '333399', '333333',
    'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF',
    'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF',
]

def _hex_rgb(color_str):
    if not color_str:
        return None
    s = color_str.strip('#')
    if len(s) >= 6:
        return '#' + s[-6:].upper()
    if len(s) == 3:
        return '#' + ''.join(c * 2 for c in s).upper()
    return None

def _load_theme_colors(zf):
    theme = {}
    try:
        all_files = set(zf.namelist())
        for fn in all_files:
            if not re.match(r'xl/theme/theme\d+\.xml$', fn):
                continue
            root = safe_xml_parse(zf.read(fn))
            if root is None:
                continue
            ns_a = 'http://schemas.openxmlformats.org/drawingml/2006/main'
            scheme = root.find(f'.//{{{ns_a}}}clrScheme')
            if scheme is None:
                continue
            raw = {}  # document order: dk1, lt1, dk2, lt2, accent1-6, hlink, folHlink
            idx = 0
            for clr in scheme:
                val = None
                for child in clr:
                    child_tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
                    if child_tag == 'srgbClr':
                        val = child.attrib.get('val')
                    elif child_tag == 'sysClr':
                        val = child.attrib.get('lastClr') or child.attrib.get('val')
                if val:
                    raw[idx] = _hex_rgb(val)
                idx += 1

            # Excel's cell-level theme="N" indices are NOT the raw scheme
            # document order — dk1/lt1 and dk2/lt2 are swapped by convention.
            # theme="0"→lt1, theme="1"→dk1, theme="2"→lt2, theme="3"→dk2,
            # theme="4..9"→accent1-6, theme="10"→hlink, theme="11"→folHlink.
            theme[0] = raw.get(1)   # lt1
            theme[1] = raw.get(0)   # dk1
            theme[2] = raw.get(3)   # lt2
            theme[3] = raw.get(2)   # dk2
            for i in range(4, 12):
                theme[i] = raw.get(i)
    except Exception as e:
        log(f"Theme load error: {e}")
    return theme

def _resolve_color(color_el, theme_colors, indexed_colors):
    if color_el is None:
        return None
    rgb = color_el.attrib.get('rgb')
    if rgb:
        return _hex_rgb(rgb)
    indexed = color_el.attrib.get('indexed')
    if indexed:
        try:
            return '#' + (indexed_colors.get(int(indexed), _DEFAULT_INDEXED[int(indexed) % 64])).upper()
        except Exception:
            pass
    theme = color_el.attrib.get('theme')
    if theme:
        try:
            return theme_colors.get(int(theme))
        except Exception:
            pass
    return None

def _parse_fonts(root, ns, theme_colors, indexed_colors):
    fonts = []
    for fnt in root.findall(f'.//{{{ns}}}fonts/{{{ns}}}font'):
        out = {}
        sz = fnt.find(f'{{{ns}}}sz')
        if sz is not None:
            out['size'] = float(sz.attrib.get('val', 11))
        name = fnt.find(f'{{{ns}}}name')
        if name is not None:
            out['name'] = name.attrib.get('val', 'Calibri')
        out['bold'] = fnt.find(f'{{{ns}}}b') is not None
        out['italic'] = fnt.find(f'{{{ns}}}i') is not None
        out['strikethrough'] = fnt.find(f'{{{ns}}}strike') is not None
        u = fnt.find(f'{{{ns}}}u')
        out['underline'] = u is not None and u.attrib.get('val') != 'none'
        color = fnt.find(f'{{{ns}}}color')
        if color is not None:
            out['color'] = _resolve_color(color, theme_colors, indexed_colors)
        fonts.append(out)
    return fonts

def _parse_fills(root, ns, theme_colors, indexed_colors):
    fills = []
    for fl in root.findall(f'.//{{{ns}}}fills/{{{ns}}}fill'):
        pattern = fl.find(f'{{{ns}}}patternFill')
        out = {}
        if pattern is not None:
            out['pattern'] = pattern.attrib.get('patternType', 'none')
            fg = pattern.find(f'{{{ns}}}fgColor')
            if fg is not None:
                out['color'] = _resolve_color(fg, theme_colors, indexed_colors)
        fills.append(out)
    return fills

def _parse_borders(root, ns, theme_colors, indexed_colors):
    borders = []
    for br in root.findall(f'.//{{{ns}}}borders/{{{ns}}}border'):
        out = {}
        for side in ['left', 'right', 'top', 'bottom']:
            el = br.find(f'{{{ns}}}{side}')
            if el is not None:
                style = el.attrib.get('style', 'none')
                color = None
                color_el = el.find(f'{{{ns}}}color')
                if color_el is not None:
                    color = _resolve_color(color_el, theme_colors, indexed_colors)
                out[side] = {'style': style, 'color': color}
        borders.append(out)
    return borders

def _style_to_css(font, fill, border, alignment, num_fmt_id):
    css = {}
    if font:
        if font.get('name'):
            css['fontFamily'] = font['name']
        if 'size' in font:
            css['fontSize'] = f"{font['size']}pt"
        if font.get('bold'):
            css['fontWeight'] = 'bold'
        if font.get('italic'):
            css['fontStyle'] = 'italic'
        dec = []
        if font.get('underline'):
            dec.append('underline')
        if font.get('strikethrough'):
            dec.append('line-through')
        if dec:
            css['textDecoration'] = ' '.join(dec)
        if font.get('color'):
            css['color'] = font['color']
    if fill and fill.get('color') and fill.get('pattern', 'none') in ('solid', 'gray125'):
        css['backgroundColor'] = fill['color']
    if border:
        width_map = {'thin': '1px', 'medium': '2px', 'thick': '3px',
                     'dashed': '1px', 'dotted': '1px', 'double': '3px',
                     'hair': '0.5px', 'mediumDashed': '2px', 'dashDot': '1px',
                     'mediumDashDot': '2px', 'dashDotDot': '1px', 'mediumDashDotDot': '2px',
                     'slantDashDot': '1px'}
        for side in ['top', 'right', 'bottom', 'left']:
            side_info = border.get(side)
            if not side_info or side_info.get('style') == 'none':
                continue
            w = width_map.get(side_info['style'], '1px')
            c = side_info.get('color') or '#000000'
            css[f'border{side.capitalize()}'] = f'{w} solid {c}'
    if alignment is not None:
        h = alignment.attrib.get('horizontal')
        if h in ('left', 'right', 'center', 'justify'):
            css['textAlign'] = h
        v = alignment.attrib.get('vertical')
        if v in ('top', 'center', 'bottom'):
            # CSS vertical-align names differ slightly for 'center' → 'middle'
            css['verticalAlign'] = 'middle' if v == 'center' else v
        if alignment.attrib.get('wrapText') == '1':
            css['whiteSpace'] = 'pre-wrap'
            css['wordBreak'] = 'break-word'
        else:
            css['whiteSpace'] = 'nowrap'
    return css

def load_styles(zf):
    try:
        root = safe_xml_parse(zf.read('xl/styles.xml'))
        if root is None:
            return [], {}, []
        ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
        theme_colors = _load_theme_colors(zf)
        indexed_colors = {}
        # Some documents also store a custom indexedColors list.
        for ic in root.findall(f'.//{{{ns}}}indexedColors/{{{ns}}}rgbColor'):
            idx = len(indexed_colors)
            val = ic.attrib.get('rgb')
            if val:
                indexed_colors[idx] = _hex_rgb(val).lstrip('#')

        num_fmts = {int(nf.attrib.get('numFmtId', 0)): nf.attrib.get('formatCode', '')
                    for nf in root.findall(f'.//{{{ns}}}numFmt')}

        fonts = _parse_fonts(root, ns, theme_colors, indexed_colors)
        fills = _parse_fills(root, ns, theme_colors, indexed_colors)
        borders = _parse_borders(root, ns, theme_colors, indexed_colors)

        styles = []
        for xf in root.findall(f'.//{{{ns}}}cellXfs/{{{ns}}}xf'):
            num_fmt_id = int(xf.attrib.get('numFmtId', 0))
            font_id = int(xf.attrib.get('fontId', 0))
            fill_id = int(xf.attrib.get('fillId', 0))
            border_id = int(xf.attrib.get('borderId', 0))
            apply_font = xf.attrib.get('applyFont') == '1'
            apply_fill = xf.attrib.get('applyFill') == '1'
            apply_border = xf.attrib.get('applyBorder') == '1'
            apply_alignment = xf.attrib.get('applyAlignment') == '1'

            font = fonts[font_id] if apply_font and font_id < len(fonts) else None
            fill = fills[fill_id] if apply_fill and fill_id < len(fills) else None
            border = borders[border_id] if apply_border and border_id < len(borders) else None
            alignment = xf.find(f'{{{ns}}}alignment') if apply_alignment else None

            css = _style_to_css(font, fill, border, alignment, num_fmt_id)
            styles.append({'numFmtId': num_fmt_id, 'css': css})

        fmt_ids = [s['numFmtId'] for s in styles]
        return fmt_ids, num_fmts, styles
    except Exception as e:
        log(f"Styles error: {e}")
        return [], {}, []

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

def idx_to_col(idx):
    """0-based column index → A, B, ... Z, AA, AB ..."""
    letters = ''
    idx += 1
    while idx > 0:
        idx, rem = divmod(idx - 1, 26)
        letters = chr(65 + rem) + letters
    return letters

# Cell references, ignoring anything inside a quoted string literal.
_REF_RE = re.compile(r'"[^"]*"|(\$?)([A-Z]{1,3})(\$?)(\d+)')

def shift_refs(formula, d_row, d_col):
    """
    Offset the relative references in a shared formula.

    Excel stores one master formula per shared group; each member re-uses it
    shifted by its distance from the master. $-anchored parts stay put.
    """
    if not d_row and not d_col:
        return formula

    def move(m):
        if m.group(0).startswith('"'):
            return m.group(0)  # string literal — leave alone
        col_abs, col, row_abs, row = m.group(1), m.group(2), m.group(3), m.group(4)
        new_col = col if col_abs else idx_to_col(max(0, col_to_idx(col) + d_col))
        new_row = row if row_abs else str(max(1, int(row) + d_row))
        return f'{col_abs}{new_col}{row_abs}{new_row}'

    return _REF_RE.sub(move, formula)

def parse_ws_xml(ws_bytes, shared, fmt_ids, num_fmts, styles=None):
    ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
    root = safe_xml_parse(ws_bytes)
    if root is None:
        return {}, 0, 0, {}, {}, [], {}, {}, set(), None, None
    styles = styles or []

    # ── Default sheet dimensions ─────────────────────────
    default_row_height = None
    default_col_width = None
    for fmt in root.findall(f'.//{{{ns}}}sheetFormatPr'):
        try:
            default_row_height = float(fmt.attrib.get('defaultRowHeight', 0)) or None
            default_col_width = float(fmt.attrib.get('defaultColWidth', 0)) or None
        except (TypeError, ValueError):
            pass

    # ── Column widths ────────────────────────────────────
    # Excel stores width in "characters"; ~7px per character is the standard
    # approximation Excel itself uses for the default Calibri 11 font.
    col_widths = {}
    for col_el in root.findall(f'.//{{{ns}}}col'):
        try:
            cmin = int(col_el.attrib.get('min', 0)) - 1
            cmax = int(col_el.attrib.get('max', 0)) - 1
            width = float(col_el.attrib.get('width', 0))
            hidden = col_el.attrib.get('hidden') in ('1', 'true')
        except (TypeError, ValueError):
            continue
        if cmin < 0 or width <= 0:
            continue
        px = 0 if hidden else max(24, min(600, round(width * 7)))
        # Guard against files that declare a span over the whole sheet.
        for c in range(cmin, min(cmax, cmin + 1024) + 1):
            col_widths[c] = px

    # ── Parse merged cells first ─────────────────────────
    merge_map = {}  # (r, c) → (top_r, top_c) for every non-top-left cell in a merge
    merges = []     # [top_r, top_c, bottom_r, bottom_c] kept so the UI can re-merge
    for mc in root.findall(f'.//{{{ns}}}mergeCell'):
        ref = mc.attrib.get('ref', '')
        if ':' not in ref:
            continue
        start_ref, end_ref = ref.split(':')
        sr, sc = ref_to_rc(start_ref)
        er, ec = ref_to_rc(end_ref)
        merges.append([sr, sc, er, ec])
        for r in range(sr, er + 1):
            for c in range(sc, ec + 1):
                if r == sr and c == sc:
                    continue  # top-left keeps its own value
                merge_map[(r, c)] = (sr, sc)

    grid = {}
    cell_styles = {}  # (r, c) → css dict
    formulas = {}  # 'r_c' → '=FORMULA' so edits never overwrite a live formula
    shared_masters = {}  # si → (formula_text, row, col) for shared-formula groups
    max_r = max_c = 0
    row_heights = {}  # ← NEW: {row_index: height_in_points}
    wrap_rows = set()  # ← NEW: row indexes that contain wrapText cells

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

            # Capture the cell's visual style for the frontend grid.
            if sidx < len(styles) and (styles[sidx] or {}).get('css'):
                cell_styles[f'{r}_{c}'] = styles[sidx]['css']
                if styles[sidx]['css'].get('whiteSpace') == 'pre-wrap':
                    wrap_rows.add(r)

            # Record the formula but still display Excel's cached <v> result,
            # so the grid shows exactly what Excel last computed.
            f_el = c_el.find(f'{{{ns}}}f')
            if f_el is not None:
                if f_el.text:
                    formulas[f'{r}_{c}'] = '=' + f_el.text
                    if f_el.attrib.get('t') == 'shared':
                        # Master of a shared group — remember it so the members
                        # below, which carry only an si reference, can be filled in.
                        si = f_el.attrib.get('si')
                        if si is not None:
                            shared_masters[si] = (f_el.text, r, c)
                elif f_el.attrib.get('t') == 'shared':
                    si = f_el.attrib.get('si')
                    if si in shared_masters:
                        src, sr, sc = shared_masters[si]
                        formulas[f'{r}_{c}'] = '=' + shift_refs(src, r - sr, c - sc)

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

    # ── Merged cells: keep the original data, do NOT flatten child values.
    # The UI (Univer/ReportSheetViewer) decides how to render merges itself.
    for (r, c) in merge_map:
        max_r = max(max_r, r)
        max_c = max(max_c, c)

    return grid, max_r, max_c, row_heights, formulas, merges, col_widths, cell_styles, wrap_rows, default_row_height, default_col_width

def get_sheet_embeddings(zf):
    result = {}
    ns_rels = 'http://schemas.openxmlformats.org/package/2006/relationships'
    ns_main = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
    ns_r    = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
    try:
        all_files = set(zf.namelist())
        wb_root = safe_xml_parse(zf.read('xl/workbook.xml'))
        wb_rels  = safe_xml_parse(zf.read('xl/_rels/workbook.xml.rels'))
        if wb_root is None or wb_rels is None:
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
    sheet_formulas, sheet_merges, sheet_col_widths, sheet_cell_styles = {}, {}, {}, {}
    sheet_wrap_rows, sheet_default_row_heights, sheet_default_col_widths = {}, {}, {}
    try:
        with zipfile.ZipFile(file_path, 'r') as zf:
            all_files = set(zf.namelist())
            shared    = load_shared_strings(zf)
            fmt_ids, num_fmts, styles = load_styles(zf)
            sheet_embed_map   = get_sheet_embeddings(zf)

            ns_main = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
            ns_r    = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
            ns_rels = 'http://schemas.openxmlformats.org/package/2006/relationships'

            wb_root = safe_xml_parse(zf.read('xl/workbook.xml'))
            wb_rels  = safe_xml_parse(zf.read('xl/_rels/workbook.xml.rels'))
            if wb_root is None or wb_rels is None:
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
                formulas, merges, col_widths, cell_styles = {}, [], {}, {}
                wrap_rows, default_row_height, default_col_width = set(), None, None
                if ws_path in all_files:
                    try:
                        ws_bytes = zf.read(ws_path)
                        cell_grid, max_r, max_c, row_heights, formulas, merges, col_widths, cell_styles, wrap_rows, default_row_height, default_col_width = parse_ws_xml(ws_bytes, shared, fmt_ids, num_fmts, styles)
                    except Exception as e:
                        log(f"  Cell error: {e}")

                sheet_formulas[name] = formulas
                sheet_merges[name] = merges
                sheet_col_widths[name] = col_widths
                sheet_cell_styles[name] = cell_styles
                sheet_wrap_rows[name] = sorted(wrap_rows)
                sheet_default_row_heights[name] = default_row_height
                sheet_default_col_widths[name] = default_col_width

                non_empty = sum(1 for v in cell_grid.values() if str(v).strip())

                # ── KEY FIX: Check for embedded DOCX first ──────────────────
                embed_paths = sheet_embed_map.get(ws_path, [])
                has_embeddings = len(embed_paths) > 0

                if has_embeddings:
                    # ── DOCX embedded hai → HTML mode mein render karo ──────
                    log(f"  Sheet '{name}' has {len(embed_paths)} embedded DOCX(s) → HTML mode")
                    all_html_parts = []
                    for embed_path in embed_paths:
                        try:
                            docx_bytes = zf.read(embed_path)
                            html = parse_docx_bytes_to_html(docx_bytes)
                            if html:
                                all_html_parts.append(html)
                                log(f"  DOCX→HTML {embed_path}: {len(html)} chars")
                            else:
                                # Fallback: plain text extraction
                                plain_rows = parse_docx_bytes(docx_bytes)
                                fallback_html = rows_to_html(plain_rows)
                                all_html_parts.append(fallback_html)
                                log(f"  DOCX→HTML fallback {embed_path}: {len(fallback_html)} chars")
                        except Exception as e:
                            log(f"  DOCX embed error {embed_path}: {e}")
                    
                    if all_html_parts:
                        combined_html = '\n'.join(all_html_parts)
                        sheets[name] = [['__html__', combined_html]]
                        sheet_row_heights[name] = {}  # HTML mode mein row heights nahi chahiye
                        sheet_merges[name] = []
                        sheet_col_widths[name] = {}
                        sheet_cell_styles[name] = {}
                        log(f"  → HTML mode: {len(combined_html)} chars total")
                        continue  # Next sheet pe jao, cell grid ignore karo

                # ── No embeddings OR embed failed → Normal Excel grid mode ──
                embed_rows = []
                for embed_path in embed_paths:
                    try:
                        doc_rows = parse_docx_bytes(zf.read(embed_path))
                        embed_rows.extend(doc_rows)
                        log(f"  DOCX fallback {embed_path}: {len(doc_rows)} rows")
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
                sheet_row_heights[name] = row_heights
                sheet_cell_styles[name] = cell_styles
                total = sum(1 for row in rows for v in row if str(v).strip())
                log(f"  → Grid mode: {len(rows)} rows, {total} cells")

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
        'formulas': sheet_formulas,        # per sheet: 'r_c' → '=FORMULA'
        'merges': sheet_merges,            # per sheet: [[r1, c1, r2, c2], ...]
        'col_widths': sheet_col_widths,    # per sheet: {col_index: width_px}
        'cell_styles': sheet_cell_styles,  # per sheet: {'r_c': css_dict}
        'wrap_rows': sheet_wrap_rows,      # per sheet: row indexes with wrapText
        'default_row_heights': sheet_default_row_heights,  # per sheet: float or None
        'default_col_widths': sheet_default_col_widths,    # per sheet: float or None
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
        return {
            'ok': True,
            'sheets': sheets,
            'names': names,
            'row_heights': {},
            'formulas': {},
            'merges': {},
            'col_widths': {},
            'cell_styles': {},
            'wrap_rows': {},
            'default_row_heights': {},
            'default_col_widths': {},
            'meta': {}
        }
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
                'formulas': {},
                'merges': {},
                'col_widths': {},
                'cell_styles': {},
                'wrap_rows': {},
                'default_row_heights': {},
                'default_col_widths': {},
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
    return {
        'ok': True,
        'sheets': {'Sheet1': rows or [['']]},
        'names': ['Sheet1'],
        'row_heights': {},
        'formulas': {},
        'merges': {},
        'col_widths': {},
        'cell_styles': {},
        'wrap_rows': {},
        'default_row_heights': {},
        'default_col_widths': {},
        'meta': {}
    }

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
