import { useState } from 'react';
import UniverSpreadsheet from './UniverSpreadsheet';

const SAMPLE_DATA = [
  ['Name', 'Maths', 'English', 'Science', 'Total', 'Percentage'],
  ['Rahul', 85, 78, 92, '=SUM(B2:D2)', '=E2/300*100'],
  ['Priya', 90, 88, 85, '=SUM(B3:D3)', '=E3/300*100'],
  ['Amit', 75, 82, 79, '=SUM(B4:D4)', '=E4/300*100'],
  ['Sneha', 95, 91, 98, '=SUM(B5:D5)', '=E5/300*100'],
  ['Vikram', 68, 75, 71, '=SUM(B6:D6)', '=E6/300*100'],
  ['', '', '', '', '', ''],
  ['Class Average', '=AVERAGE(B2:B6)', '=AVERAGE(C2:C6)', '=AVERAGE(D2:D6)', '=AVERAGE(E2:E6)', '=AVERAGE(F2:F6)'],
  ['Highest', '=MAX(B2:B6)', '=MAX(C2:C6)', '=MAX(D2:D6)', '', ''],
  ['Lowest', '=MIN(B2:B6)', '=MIN(C2:C6)', '=MIN(D2:D6)', '', ''],
];

export default function UniverSpreadsheetDemo() {
  const [useUniver, setUseUniver] = useState(true);

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111827' }}>
              📊 Univer Spreadsheet - Excel-like Component
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: '#6b7280' }}>
              Built-in Formula Engine (500+ functions: SUM, AVERAGE, VLOOKUP, etc.) • xlsx Import/Export • Multi-sheet
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setUseUniver(true)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: useUniver ? '2px solid #2563eb' : '1px solid #d1d5db',
                background: useUniver ? '#2563eb' : '#fff',
                color: useUniver ? '#fff' : '#374151',
              }}
            >
              Univer (Recommended)
            </button>
            <button
              onClick={() => setUseUniver(false)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: !useUniver ? '2px solid #2563eb' : '1px solid #d1d5db',
                background: !useUniver ? '#2563eb' : '#fff',
                color: !useUniver ? '#fff' : '#374151',
              }}
            >
              Old SpreadsheetGrid
            </button>
          </div>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 15, color: '#111827' }}>💡 How to test formulas:</h3>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#4b5563', lineHeight: 1.8 }}>
            <li>Sample data mein <strong>=SUM(B2:D2)</strong>, <strong>=AVERAGE(B2:B6)</strong> etc. formulas already hain — auto calculate honge!</li>
            <li>Kisi cell mein click karke <strong>=10+20</strong> ya <strong>=VLOOKUP(...)</strong> type karo, Enter dabao — result aa jayega</li>
            <li>Upar "Import Excel" button se apna .xlsx file upload karo — formulas, styles, merged cells sab preserve honge</li>
            <li>Formula bar (toolbar ke neeche) se directly formulas edit kar sakte ho</li>
            <li>Multi-sheet support: bottom mein tabs se sheet switch/add kar sakte ho</li>
          </ul>
        </div>

        {useUniver ? (
          <UniverSpreadsheet
            initialData={SAMPLE_DATA}
            height="70vh"
            onDataChange={(snapshot, data2D) => {
              console.log('Data changed! 2D array:', data2D);
            }}
          />
        ) : (
          <div style={{
            padding: 40,
            background: '#fff',
            borderRadius: 12,
            border: '1px dashed #d1d5db',
            textAlign: 'center',
            color: '#6b7280',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>
              Old SpreadsheetGrid component does NOT support:
            </div>
            <div style={{ fontSize: 13, lineHeight: 2 }}>
              ❌ Formula calculation (=SUM, =VLOOKUP etc show as raw text)<br/>
              ❌ Excel-like toolbar / formula bar<br/>
              ❌ xlsx import with styles & formatting<br/>
              ❌ Multi-sheet tabs<br/>
              ❌ Auto-calc on cell changes
            </div>
            <div style={{ marginTop: 16, fontSize: 12, color: '#9ca3af' }}>
              → Switch to "Univer" tab to see the difference!
            </div>
          </div>
        )}

        <div style={{
          marginTop: 20,
          padding: 16,
          background: '#eff6ff',
          borderRadius: 12,
          border: '1px solid #bfdbfe',
        }}>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#1e40af', fontWeight: 600 }}>📋 Component props (for developers):</h4>
          <pre style={{
            margin: 0,
            padding: 12,
            background: '#fff',
            borderRadius: 8,
            fontSize: 12,
            color: '#1f2937',
            overflowX: 'auto',
            border: '1px solid #dbeafe',
          }}>{`import UniverSpreadsheet from './UniverSpreadsheet';

// Basic usage (blank sheet)
<UniverSpreadsheet />

// With pre-loaded 2D data + callbacks
<UniverSpreadsheet
  initialData={[['Name', 'Score'], ['Rahul', 95]]}
  height="600px"
  readOnly={false}
  showToolbar={true}
  showFormulaBar={true}
  showSheetTabs={true}
  onDataChange={(snapshot, data2D) => {
    // snapshot = Univer full data (with formulas, styles, etc.)
    // data2D  = plain 2D array (computed values)
    saveToBackend(data2D);
  }}
/>`}</pre>
        </div>
      </div>
    </div>
  );
}
