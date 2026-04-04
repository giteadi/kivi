#!/usr/bin/env python3
"""
Excel Parser - Supports .xlsx, .xls, .csv formats
"""

import openpyxl
import sys
import os
import csv
import json

def parse_excel(file_path):
    """Parse Excel/CSV file and return sheets data as JSON"""
    try:
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext == '.csv':
            return parse_csv(file_path)
        elif file_ext == '.xls':
            return parse_xls(file_path)
        else:
            # .xlsx, .xlsm, .xltx, .xltm
            return parse_xlsx(file_path)
    
    except Exception as e:
        return {"ok": False, "error": str(e)}

def parse_csv(file_path):
    """Parse CSV file"""
    try:
        sheets = {}
        rows = []
        
        # Try different encodings
        encodings = ['utf-8', 'latin-1', 'cp1252']
        
        for encoding in encodings:
            try:
                with open(file_path, 'r', encoding=encoding, newline='') as f:
                    reader = csv.reader(f)
                    for row in reader:
                        rows.append(row)
                break
            except UnicodeDecodeError:
                continue
        
        if not rows:
            rows = [[""]]
        
        sheets["Sheet1"] = rows
        
        return {"ok": True, "sheets": sheets, "names": ["Sheet1"]}
    except Exception as e:
        return {"ok": False, "error": f"CSV parse error: {str(e)}"}

def parse_xls(file_path):
    """Parse .xls files using xlrd"""
    try:
        import xlrd
        
        wb = xlrd.open_workbook(file_path)
        sheets = {}
        sheet_names = wb.sheet_names()
        
        for sheet_name in sheet_names:
            ws = wb.sheet_by_name(sheet_name)
            rows = []
            
            for row_idx in range(ws.nrows):
                row_data = []
                for col_idx in range(ws.ncols):
                    cell = ws.cell(row_idx, col_idx)
                    value = cell.value
                    
                    if value:
                        if isinstance(value, (int, float)):
                            value = str(int(value)) if value == int(value) else str(value)
                    else:
                        value = ""
                    
                    row_data.append(value)
                
                rows.append(row_data)
            
            sheets[sheet_name] = rows if rows else [[""]]
        
        wb.release_resources()
        
        return {"ok": True, "sheets": sheets, "names": sheet_names}
    except ImportError:
        return {"ok": False, "error": "xlrd not installed. Run: pip3 install xlrd"}
    except Exception as e:
        return {"ok": False, "error": f"XLS parse error: {str(e)}"}

def parse_xlsx(file_path):
    """Parse .xlsx files using openpyxl"""
    try:
        wb = openpyxl.load_workbook(file_path, data_only=True)
        
        sheets = {}
        sheet_names = []
        
        for sheet_name in wb.sheetnames:
            ws = wb[sheet_name]
            sheet_names.append(sheet_name)
            
            rows = []
            
            for row in ws.iter_rows(min_row=1, max_row=ws.max_row):
                row_data = []
                has_data = False
                
                for cell in row:
                    value = cell.value
                    
                    if value is not None:
                        if isinstance(value, (int, float)):
                            value = str(int(value)) if value == int(value) else str(value)
                        has_data = True
                    else:
                        value = ""
                    
                    row_data.append(value)
                
                rows.append(row_data)
            
            # Remove trailing empty rows
            while rows and all(cell == "" for cell in rows[-1]):
                rows.pop()
            
            sheets[sheet_name] = rows if rows else [[""]]
        
        wb.close()
        
        return {"ok": True, "sheets": sheets, "names": sheet_names}
        
    except Exception as e:
        return {"ok": False, "error": f"XLSX parse error: {str(e)}"}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"ok": False, "error": "No file path provided"}))
        sys.exit(1)
    
    file_path = sys.argv[1]
    
    if not os.path.exists(file_path):
        print(json.dumps({"ok": False, "error": f"File not found: {file_path}"}))
        sys.exit(1)
    
    result = parse_excel(file_path)
    print(json.dumps(result))
