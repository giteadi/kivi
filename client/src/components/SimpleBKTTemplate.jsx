import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// Binet Kamath Test of Intelligence (BKT) Template
const SimpleBKTTemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    // Header
    title: "1. BINET KAMATH TEST OF INTELLIGENCE",
    
    // Description
    description: "Is used to assess the Mental Age and Intelligence Quotient (I.Q.) of a child. It consists of various verbal and performance items, beginning at the three-year level.",
    
    // Results
    results: {
      studentName: "ABC",
      basalAge: "4 years",
      ceilingAge: "22 years",
      chronologicalAge: "16 years 2 months",
      mentalAge: "112 months",
      iq: "58"
    },
    
    // Detailed Interpretation
    interpretation: "ABC was able to recognize different objects as well as indicate similarities between them. She was enjoying the tasks where she was given objects. She could accurately identify different shapes. She could accurately recognize emotions. She could accurately identify the missing figures from the card. ABC could not perform tasks such as repeating numbers backwards above 6 digits. She could not perform tasks where problem solving was given to her."
  });

  const printRef = useRef();

  const handleTitleChange = (value) => {
    setFormData(prev => ({ ...prev, title: value }));
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handleResultsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      results: { ...prev.results, [field]: value }
    }));
  };

  const handleInterpretationChange = (value) => {
    setFormData(prev => ({ ...prev, interpretation: value }));
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Binet Kamath Test of Intelligence</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { 
              font-family: 'Times New Roman', Times, serif; 
              font-size: 11pt; 
              line-height: 1.4;
              max-width: 700px;
              margin: 0 auto;
              padding: 20px;
              color: #000;
            }
            .report-title {
              font-size: 12pt;
              font-weight: bold;
              text-align: left;
              margin-bottom: 10px;
              text-decoration: underline;
            }
            .description {
              font-size: 11pt;
              text-align: justify;
              margin-bottom: 20px;
            }
            .results {
              font-size: 11pt;
              text-align: justify;
              margin-bottom: 20px;
              line-height: 1.5;
            }
            .interpretation {
              font-size: 11pt;
              text-align: justify;
              line-height: 1.5;
            }
            .student-name {
              font-weight: bold;
            }
            input[type="text"], textarea {
              display: none;
            }
          </style>
        </head>
        <body>
          <div style="font-family: 'Times New Roman', Times, serif;">
            <div style="font-size: 12pt; font-weight: bold; text-align: left; margin-bottom: 10px; text-decoration: underline;">${formData.title}</div>
            <div style="font-size: 11pt; text-align: justify; margin-bottom: 20px;">${formData.description}</div>
            
            <div style="font-size: 11pt; text-align: justify; margin-bottom: 20px; line-height: 1.5;">
              <span style="font-weight: bold;">${formData.results.studentName}</span> has obtained a Basal Age of ${formData.results.basalAge} (i.e. the level at which all test items are passed by her) and a Ceiling Age of ${formData.results.ceilingAge}. Her chronological age is ${formData.results.chronologicalAge} and the test reveals a Mental Age of ${formData.results.mentalAge}. This corresponds to an I.Q. of ${formData.results.iq}.
            </div>
            
            <div style="font-size: 11pt; text-align: justify; line-height: 1.5;">${formData.interpretation}</div>
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
            <h1 className="text-xl font-semibold text-gray-800">Binet Kamath Test (BKT)</h1>
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
            {/* Title */}
            <div className="mb-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50 underline"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '12pt' }}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <textarea
                value={formData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '11pt', lineHeight: '1.4' }}
                rows={2}
              />
            </div>

            {/* Results Section */}
            <div className="mb-6 text-justify" style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '11pt', lineHeight: '1.5' }}>
              <input
                type="text"
                value={formData.results.studentName}
                onChange={(e) => handleResultsChange('studentName', e.target.value)}
                className="font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '11pt' }}
              />
              <span> has obtained a Basal Age of </span>
              <input
                type="text"
                value={formData.results.basalAge}
                onChange={(e) => handleResultsChange('basalAge', e.target.value)}
                className="bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '11pt' }}
              />
              <span> (i.e. the level at which all test items are passed by her) and a Ceiling Age of </span>
              <input
                type="text"
                value={formData.results.ceilingAge}
                onChange={(e) => handleResultsChange('ceilingAge', e.target.value)}
                className="bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '11pt' }}
              />
              <span>. Her chronological age is </span>
              <input
                type="text"
                value={formData.results.chronologicalAge}
                onChange={(e) => handleResultsChange('chronologicalAge', e.target.value)}
                className="bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '11pt' }}
              />
              <span> and the test reveals a Mental Age of </span>
              <input
                type="text"
                value={formData.results.mentalAge}
                onChange={(e) => handleResultsChange('mentalAge', e.target.value)}
                className="bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '11pt' }}
              />
              <span>. This corresponds to an I.Q. of </span>
              <input
                type="text"
                value={formData.results.iq}
                onChange={(e) => handleResultsChange('iq', e.target.value)}
                className="bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '11pt' }}
              />
              <span>.</span>
            </div>

            {/* Interpretation */}
            <div>
              <textarea
                value={formData.interpretation}
                onChange={(e) => handleInterpretationChange(e.target.value)}
                className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '11pt', lineHeight: '1.5' }}
                rows={6}
              />
            </div>
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

export default SimpleBKTTemplate;
