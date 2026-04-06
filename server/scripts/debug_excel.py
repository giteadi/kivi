#!/usr/bin/env python3
"""Debug script to check Excel structure"""

import sys, zipfile, os, json
from io import BytesIO
import xml.etree.ElementTree as ET

if len(sys.argv) < 2:
    print("Usage: python3 debug_excel.py <xlsx_file>")
    sys.exit(1)

fp = sys.argv[1]
print(f"\n=== Analyzing: {fp} ===\n")

with zipfile.ZipFile(fp, 'r') as zf:
    files = zf.namelist()
    
    # Find all embedded DOCX files
    docx_files = [f for f in files if f.endswith('.docx')]
    print(f"Embedded DOCX files: {len(docx_files)}")
    for d in docx_files:
        print(f"  - {d}")
    
    # Check each sheet
    ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
    nr = 'http://schemas.openxmlformats.org/package/2006/relationships'
    
    wr = ET.fromstring(zf.read('xl/workbook.xml'))
    wrl = ET.fromstring(zf.read('xl/_rels/workbook.xml.rels'))
    
    rp = {}
    for r in wrl.findall(f'{{{nr}}}Relationship'):
        rp[r.attrib.get('Id')] = r.attrib.get('Target', '').replace('worksheets/', 'xl/worksheets/')
    
    for sh in wr.findall(f'.//{{{ns}}}sheet'):
        name = sh.attrib.get('name')
        rid = sh.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
        ws_path = rp.get(rid, '')
        
        print(f"\n--- Sheet: {name} ---")
        
        # Check for embedded docs
        rels_path = ws_path.replace('xl/worksheets/', 'xl/worksheets/_rels/') + '.rels'
        if rels_path in files:
            try:
                rels = ET.fromstring(zf.read(rels_path))
                embeds = []
                for r in rels.findall(f'{{{nr}}}Relationship'):
                    tgt = r.attrib.get('Target', '')
                    if tgt and 'docx' in tgt.lower():
                        full_path = tgt.replace('../', 'xl/')
                        embeds.append(full_path)
                print(f"  Embeds: {embeds}")
                
                # Analyze DOCX structure
                for emb in embeds:
                    if emb in files:
                        docx_bytes = zf.read(emb)
                        with zipfile.ZipFile(BytesIO(docx_bytes)) as dz:
                            doc_xml = dz.read('word/document.xml')
                            root = ET.fromstring(doc_xml)
                            W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
                            body = root.find(f'{{{W}}}body')
                            
                            tbl_count = 0
                            p_count = 0
                            for child in body:
                                tag = child.tag.split('}')[-1]
                                if tag == 'tbl':
                                    tbl_count += 1
                                    # Count rows and cells
                                    rows = child.findall(f'{{{W}}}tr')
                                    print(f"    Table: {len(rows)} rows")
                                    for i, tr in enumerate(rows[:3]):  # Show first 3 rows
                                        cells = tr.findall(f'{{{W}}}tc')
                                        cell_texts = []
                                        for tc in cells:
                                            texts = [t.text for p in tc.findall(f'{{{W}}}p') for t in p.findall(f'.//{{{W}}}t') if t.text]
                                            cell_texts.append(''.join(texts)[:30])
                                        print(f"      Row {i+1}: {len(cells)} cells - {cell_texts}")
                                elif tag == 'p':
                                    p_count += 1
                            
                            print(f"    Tables: {tbl_count}, Paragraphs: {p_count}")
            except Exception as e:
                print(f"  Error: {e}")
        else:
            print(f"  No embedded docs")
