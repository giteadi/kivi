import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// Raven's Coloured Progressive Matrices (CPM) Template - Matches Excel
const SimpleRavensCPMTemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    // Header
    title: "RAVEN'S COLOURED PROGRESSIVE MATRICES",
    
    // Description
    description: "Raven's CPM measures clear-thinking ability and is designed for young children ages 5:0-11:0 years. The test consists of 36 items in 3 sets (A, Ab, B), with 12 items per set. It has no time limit. The three sets of 12 items are arranged to assess the chief cognitive processes of which children under 11 years of age are usually capable. The CPM items are arranged to assess cognitive development up to the stage when a person is sufficiently able to reason by analogy and adopt this way of thinking as a consistent method of inference.\n\nA child's total score provides an index of his intellectual capacity, whatever his nationality or education.",
    
    // Test Results Header
    testResultsHeader: "Test Results",
    
    // Test Results Table
    testResults: {
      totalScore: "11",
      grade: "III-",
      classification: "Intellectually average"
    },
    
    // Interpretation
    interpretation: "Interpretation: 'Intellectually Average.'",
    
    // Table Headers
    totalScoreHeader: "Total Score",
    gradeHeader: "Grade",
    classificationHeader: "Classification"
  });

  const printRef = useRef();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestResultChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      testResults: { ...prev.testResults, [field]: value }
    }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Raven's Coloured Progressive Matrices (CPM)</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { 
              font-family: 'Times New Roman', Times, serif; 
              font-size: 10pt; 
              line-height: 1.3;
              max-width: 700px;
              margin: 0 auto;
              padding: 20px;
              color: #000;
            }
            .report-box {
              border: 1px solid #000;
              padding: 20px;
              max-width: 700px;
            }
            .report-title {
              font-size: 11pt;
              font-weight: bold;
              text-align: left;
              margin-bottom: 10px;
              text-decoration: underline;
            }
            .description {
              font-size: 10pt;
              text-align: justify;
              margin-bottom: 20px;
              line-height: 1.4;
            }
            .section-header {
              font-size: 10pt;
              font-weight: bold;
              text-align: left;
              margin: 20px 0 10px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0 20px 0;
              font-size: 10pt;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px 10px;
              text-align: center;
            }
            th {
              font-weight: bold;
              background-color: #fff;
            }
            td:first-child {
              font-weight: bold;
            }
            .interpretation {
              margin-top: 15px;
              font-size: 10pt;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <div class="report-box" style="font-family: 'Times New Roman', Times, serif;">
            <div class="report-title">${formData.title}</div>
            <div class="description">${formData.description.replace(/\n/g, '<br/>')}</div>
            
            <div class="section-header">${formData.testResultsHeader}</div>
            <table>
              <tr>
                <th>${formData.totalScoreHeader}</th>
                <th>${formData.gradeHeader}</th>
                <th>${formData.classificationHeader}</th>
              </tr>
              <tr>
                <td>${formData.testResults.totalScore}</td>
                <td>${formData.testResults.grade}</td>
                <td>${formData.testResults.classification}</td>
              </tr>
            </table>
            
            <div class="interpretation">${formData.interpretation}</div>
          </div>
          <div style="margin-top: 30px; font-size: 8pt; color: #666; text-align: right;">
            Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-100">
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
            <h1 className="text-xl font-semibold text-gray-800">Raven's CPM</h1>
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
            {/* Outer Box Border */}
            <div style={{ 
              border: '1px solid #000', 
              padding: '20px',
              maxWidth: '700px'
            }}>
              {/* Title - Underlined */}
              <div className="mb-4">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                  style={{ 
                    fontFamily: 'Times New Roman, Times, serif', 
                    fontSize: '11pt',
                    textDecoration: 'underline'
                  }}
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify"
                  style={{ 
                    fontFamily: 'Times New Roman, Times, serif', 
                    fontSize: '10pt', 
                    lineHeight: '1.4' 
                  }}
                  rows={8}
                />
              </div>

              {/* Test Results Header */}
              <div className="mb-2">
                <input
                  type="text"
                  value={formData.testResultsHeader}
                  onChange={(e) => handleChange('testResultsHeader', e.target.value)}
                  className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                  style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                />
              </div>

              {/* Test Results Table */}
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr>
                    <th className="border border-black px-3 py-2 text-center font-bold text-xs w-1/3">
                      <input
                        type="text"
                        value={formData.totalScoreHeader}
                        onChange={(e) => handleChange('totalScoreHeader', e.target.value)}
                        className="w-full text-center bg-transparent font-bold focus:outline-none"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                      />
                    </th>
                    <th className="border border-black px-3 py-2 text-center font-bold text-xs w-1/3">
                      <input
                        type="text"
                        value={formData.gradeHeader}
                        onChange={(e) => handleChange('gradeHeader', e.target.value)}
                        className="w-full text-center bg-transparent font-bold focus:outline-none"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                      />
                    </th>
                    <th className="border border-black px-3 py-2 text-center font-bold text-xs w-1/3">
                      <input
                        type="text"
                        value={formData.classificationHeader}
                        onChange={(e) => handleChange('classificationHeader', e.target.value)}
                        className="w-full text-center bg-transparent font-bold focus:outline-none"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-3 py-2 text-center text-xs font-bold">
                      <input
                        type="text"
                        value={formData.testResults.totalScore}
                        onChange={(e) => handleTestResultChange('totalScore', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                      />
                    </td>
                    <td className="border border-black px-3 py-2 text-center text-xs font-bold">
                      <input
                        type="text"
                        value={formData.testResults.grade}
                        onChange={(e) => handleTestResultChange('grade', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                      />
                    </td>
                    <td className="border border-black px-3 py-2 text-center text-xs font-bold">
                      <input
                        type="text"
                        value={formData.testResults.classification}
                        onChange={(e) => handleTestResultChange('classification', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Interpretation */}
              <div>
                <input
                  type="text"
                  value={formData.interpretation}
                  onChange={(e) => handleChange('interpretation', e.target.value)}
                  className="w-full bg-transparent focus:outline-none focus:bg-blue-50"
                  style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                />
              </div>
            </div> {/* End of outer box border */}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-t border-blue-100 px-8 py-4">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> All fields are editable. Click on any text to edit. 
              Click "Print / PDF" to generate a printable report.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleRavensCPMTemplate;
