import { useState, useRef, useEffect } from 'react';

const ExportDropdown = ({ onExportDocx, onExportXlsx, ghost = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (type) => {
    if (type === 'docx' && onExportDocx) {
      onExportDocx();
    } else if (type === 'xlsx' && onExportXlsx) {
      onExportXlsx();
    }
    setIsOpen(false);
  };

  const btnStyle = ghost
    ? {
        background: 'transparent',
        border: '1px solid #065F46',
        color: '#D1FAE5',
        padding: '6px 12px',
        borderRadius: 6,
        cursor: 'pointer',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }
    : {
        background: '#fff',
        border: '1px solid #E5E7EB',
        color: '#374151',
        padding: '6px 12px',
        borderRadius: 6,
        cursor: 'pointer',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
    background: '#fff',
    border: '1px solid #E5E7EB',
    borderRadius: 6,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    zIndex: 50,
    minWidth: 140,
  };

  const itemStyle = {
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: 13,
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    borderBottom: '1px solid #F3F4F6',
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button style={btnStyle} onClick={() => setIsOpen(!isOpen)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          <div
            style={{ ...itemStyle, borderRadius: '6px 6px 0 0' }}
            onClick={() => handleExport('docx')}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Word (.docx)
          </div>
          <div
            style={{ ...itemStyle, borderRadius: '0 0 6px 6px', borderBottom: 'none' }}
            onClick={() => handleExport('xlsx')}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            Excel (.xlsx)
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
