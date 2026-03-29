import { useState, useRef } from 'react';
import { FiPrinter, FiDownload, FiArrowLeft } from 'react-icons/fi';

// Simple ADHT-2 Template - Matches the Excel screenshot exactly
const SimpleADHT2Template = ({ onBack }) => {
  const [formData, setFormData] = useState({
    // Header
    title: "ATTENTION-DEFICIT / HYPERACTIVITY DISORDER TEST-ADHDT-2",
    description: "The Attention-Deficit/Hyperactivity Disorder Test-Second Edition (ADHDT-2) is a norm-referenced screening test used to identify persons who have attention-deficit/hyperactivity disorder (ADHDT). It is designed to identify individuals who present severe behavioral problems that may be indicative of ADHD. It's content is based on the definition of ADHD from the DSM-5.",
    
    // Test Results Table
    subscales: [
      { name: "Inattention", rawScore: "26", percentileRank: "25", scaledScore: "8" },
      { name: "Hyperactivity/Impulsivity", rawScore: "21", percentileRank: "6", scaledScore: "9" },
    ],
    adhdIndex: "92",
    
    // Remarks
    remark: "The scores imply it is 'very likely' that ABC has symptoms of ADHD.",
    
    // Additional Notes
    notes: "It must be noted that this checklist cannot be fully endorsed by the tester, as she is in a one-to-one situation, and many of these behaviors cannot be evaluated in that situation. The scores above are those reported by his mother after being given insight by the tester. They can be used as a rough guide for indicators."
  });

  const printRef = useRef();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubscaleChange = (index, field, value) => {
    setFormData(prev => {
      const newSubscales = [...prev.subscales];
      newSubscales[index] = { ...newSubscales[index], [field]: value };
      return { ...prev, subscales: newSubscales };
    });
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>ADHDT-2 Assessment Report</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { 
              font-family: 'Times New Roman', Times, serif; 
              font-size: 11pt; 
              line-height: 1.4;
              max-width: 750px;
              margin: 0 auto;
              padding: 20px;
              color: #000;
            }
            /* Fix input and textarea styling for print */
            input, textarea {
              border: none !important;
              background: transparent !important;
              outline: none !important;
              font-family: 'Times New Roman', Times, serif !important;
              font-size: inherit !important;
              color: #000 !important;
              width: 100% !important;
              resize: none !important;
              overflow: visible !important;
              white-space: pre-wrap !important;
              word-wrap: break-word !important;
              text-align: inherit !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            textarea {
              display: block !important;
              width: 100% !important;
              min-height: auto !important;
            }
            .report-title {
              font-size: 12pt;
              font-weight: bold;
              text-align: center;
              text-decoration: underline;
              margin-bottom: 15px;
              text-transform: uppercase;
            }
            .report-title input {
              text-align: center !important;
              font-weight: bold !important;
              text-transform: uppercase !important;
              font-size: 12pt !important;
              border-bottom: 1px solid #000 !important;
              padding-bottom: 8px !important;
            }
            .description {
              text-align: justify;
              margin-bottom: 20px;
              font-size: 10pt;
              line-height: 1.5;
            }
            .section-title {
              font-size: 11pt;
              font-weight: bold;
              margin-top: 15px;
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
              font-size: 10pt;
            }
            th, td {
              border: 1px solid #000;
              padding: 6px 10px;
              text-align: left;
              vertical-align: top;
            }
            th {
              font-weight: bold;
              background-color: #fff;
            }
            td input {
              text-align: center !important;
            }
            .adhd-index {
              font-weight: bold;
              margin: 10px 0;
              font-size: 10pt;
              border: 1px solid #000;
              padding: 6px 10px;
              display: inline-block;
            }
            .adhd-index input {
              width: 50px !important;
              text-align: left !important;
              display: inline !important;
            }
            .remark {
              margin: 15px 0;
              font-size: 10pt;
            }
            .remark strong {
              font-weight: bold;
            }
            .remark em {
              font-style: italic;
            }
            .notes {
              font-style: italic;
              text-align: justify;
              margin-top: 15px;
              font-size: 10pt;
              line-height: 1.5;
            }
            .print-date {
              margin-top: 30px;
              font-size: 9pt;
              color: #666;
            }
          </style>
        </head>
        <body>
          ${printContent}
          <div class="print-date">Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadPDF = () => {
    handlePrint();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-800">Assessment Template</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPrinter className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Report Preview */}
          <div ref={printRef} className="p-8" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
            {/* Title - Underlined and Centered */}
            <div className="text-center mb-6">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full text-center font-bold text-sm uppercase border-b-2 border-black pb-2 bg-transparent focus:outline-none focus:border-blue-500"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '12pt' }}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full text-justify text-xs bg-transparent border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500 resize-none"
                style={{ fontFamily: 'Times New Roman, Times, serif', lineHeight: '1.5' }}
                rows={4}
              />
            </div>

            {/* Test Results Section */}
            <div className="mb-4">
              <p className="font-bold text-sm mb-3" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                Test Results
              </p>

              {/* Table */}
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr>
                    <th className="border border-black px-3 py-2 text-left font-bold text-xs bg-gray-50">
                      Subscales
                    </th>
                    <th className="border border-black px-3 py-2 text-left font-bold text-xs bg-gray-50">
                      Raw Scores
                    </th>
                    <th className="border border-black px-3 py-2 text-left font-bold text-xs bg-gray-50">
                      Percentile Ranks
                    </th>
                    <th className="border border-black px-3 py-2 text-left font-bold text-xs bg-gray-50">
                      Scaled Scores
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.subscales.map((subscale, index) => (
                    <tr key={index}>
                      <td className="border border-black px-2 py-1">
                        <input
                          type="text"
                          value={subscale.name}
                          onChange={(e) => handleSubscaleChange(index, 'name', e.target.value)}
                          className="w-full text-xs bg-transparent focus:outline-none focus:bg-blue-50 p-1"
                          style={{ fontFamily: 'Times New Roman, Times, serif' }}
                        />
                      </td>
                      <td className="border border-black px-2 py-1">
                        <input
                          type="text"
                          value={subscale.rawScore}
                          onChange={(e) => handleSubscaleChange(index, 'rawScore', e.target.value)}
                          className="w-full text-xs text-center bg-transparent focus:outline-none focus:bg-blue-50 p-1"
                          style={{ fontFamily: 'Times New Roman, Times, serif' }}
                        />
                      </td>
                      <td className="border border-black px-2 py-1">
                        <input
                          type="text"
                          value={subscale.percentileRank}
                          onChange={(e) => handleSubscaleChange(index, 'percentileRank', e.target.value)}
                          className="w-full text-xs text-center bg-transparent focus:outline-none focus:bg-blue-50 p-1"
                          style={{ fontFamily: 'Times New Roman, Times, serif' }}
                        />
                      </td>
                      <td className="border border-black px-2 py-1">
                        <input
                          type="text"
                          value={subscale.scaledScore}
                          onChange={(e) => handleSubscaleChange(index, 'scaledScore', e.target.value)}
                          className="w-full text-xs text-center bg-transparent focus:outline-none focus:bg-blue-50 p-1"
                          style={{ fontFamily: 'Times New Roman, Times, serif' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ADHD Index */}
              <div className="border border-black inline-block px-3 py-1 mb-4">
                <span className="font-bold text-xs">ADHD Index - </span>
                <input
                  type="text"
                  value={formData.adhdIndex}
                  onChange={(e) => handleChange('adhdIndex', e.target.value)}
                  className="w-16 text-xs bg-transparent focus:outline-none focus:bg-blue-50 text-center"
                  style={{ fontFamily: 'Times New Roman, Times, serif' }}
                />
              </div>
            </div>

            {/* Remark */}
            <div className="mb-4">
              <p className="font-bold text-xs mb-1" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                Remark:
              </p>
              <textarea
                value={formData.remark}
                onChange={(e) => handleChange('remark', e.target.value)}
                className="w-full text-xs bg-transparent border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500 resize-none"
                style={{ fontFamily: 'Times New Roman, Times, serif' }}
                rows={2}
              />
            </div>

            {/* Notes */}
            <div>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full text-xs italic text-justify bg-transparent border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500 resize-none"
                style={{ fontFamily: 'Times New Roman, Times, serif' }}
                rows={4}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-t border-blue-100 px-8 py-4">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Edit the fields above directly. The template matches the ADHDT-2 format. 
              Click "Print / PDF" to generate a printable report.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleADHT2Template;
