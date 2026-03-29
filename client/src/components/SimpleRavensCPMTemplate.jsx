import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// Raven's Coloured Progressive Matrices (CPM) Template
const SimpleRavensCPMTemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    // Header
    title: "RAVEN'S COLOURED PROGRESSIVE MATRICES (CPM)",
    
    // Description
    description: "Raven's Coloured Progressive Matrices (CPM) is a non-verbal test of reasoning ability. It is designed for children aged 5 through 11 years, elderly individuals, and those with learning difficulties or speech and language difficulties. The test measures the ability to form perceptual relations and to reason by analogy, independent of language and schooling.",
    
    // Examinee Info
    examineeName: "ABC",
    chronologicalAge: "16 years 2 months",
    
    // Classification Table
    classificationHeader: "CLASSIFICATION",
    classificationData: [
      { percentile: "95 and above", level: "Intellectually Superior" },
      { percentile: "90-94", level: "Definitely Above Average" },
      { percentile: "75-89", level: "Above Average" },
      { percentile: "25-74", level: "Average" },
      { percentile: "10-24", level: "Below Average" },
      { percentile: "5-9", level: "Definitely Below Average" },
      { percentile: "Below 5", level: "Intellectually Impaired" }
    ],
    
    // Score Summary
    scoreSummaryHeader: "SCORE SUMMARY",
    
    // Test Results
    testResults: {
      rawScore: "28",
      percentileRank: "75",
      gradeEquivalent: "A",
      ageEquivalent: "12 years 6 months",
      classification: "Above Average"
    },
    
    // Interpretation
    interpretation: "ABC obtained a raw score of 28 on the Raven's CPM, which corresponds to the 75th percentile. This places ABC in the 'Above Average' range of intellectual functioning. The age equivalent score of 12 years 6 months suggests that ABC's non-verbal reasoning ability is comparable to that of an average 12.5-year-old. The results indicate that ABC has good ability in pattern recognition, perceptual reasoning, and analogical thinking. These skills are important for problem-solving and visual-spatial processing."
  });

  const printRef = useRef();

  const handleTitleChange = (value) => {
    setFormData(prev => ({ ...prev, title: value }));
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handleExamineeNameChange = (value) => {
    setFormData(prev => ({ ...prev, examineeName: value }));
  };

  const handleChronologicalAgeChange = (value) => {
    setFormData(prev => ({ ...prev, chronologicalAge: value }));
  };

  const handleClassificationHeaderChange = (value) => {
    setFormData(prev => ({ ...prev, classificationHeader: value }));
  };

  const handleClassificationChange = (index, field, value) => {
    setFormData(prev => {
      const newData = [...prev.classificationData];
      newData[index] = { ...newData[index], [field]: value };
      return { ...prev, classificationData: newData };
    });
  };

  const handleScoreSummaryHeaderChange = (value) => {
    setFormData(prev => ({ ...prev, scoreSummaryHeader: value }));
  };

  const handleTestResultChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      testResults: { ...prev.testResults, [field]: value }
    }));
  };

  const handleInterpretationChange = (value) => {
    setFormData(prev => ({ ...prev, interpretation: value }));
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
            .report-title {
              font-size: 11pt;
              font-weight: bold;
              text-align: left;
              margin-bottom: 10px;
            }
            .description {
              font-size: 10pt;
              text-align: justify;
              margin-bottom: 10px;
            }
            .examinee-info {
              font-size: 10pt;
              margin-bottom: 15px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
              font-size: 9pt;
            }
            th, td {
              border: 1px solid #000;
              padding: 4px 6px;
              text-align: center;
            }
            th {
              background-color: #e8e8e8;
              font-weight: bold;
            }
            .classification-table th {
              text-align: center;
            }
            .classification-table td:first-child {
              text-align: center;
              font-weight: bold;
            }
            .summary-table {
              width: 80%;
              margin: 15px auto;
            }
            .summary-table td:first-child {
              font-weight: bold;
              text-align: left;
            }
            .summary-table td:nth-child(2) {
              text-align: center;
            }
            .interpretation {
              margin-top: 15px;
              text-align: justify;
            }
            .section-header {
              font-size: 10pt;
              font-weight: bold;
              text-align: center;
              margin: 15px 0 10px 0;
            }
          </style>
        </head>
        <body>
          <div style="font-family: 'Times New Roman', Times, serif;">
            <div style="font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px;">${formData.title}</div>
            <div style="font-size: 10pt; text-align: justify; margin-bottom: 10px;">${formData.description}</div>
            
            <div style="font-size: 10pt; margin-bottom: 15px;">
              <strong>Examinee Name:</strong> ${formData.examineeName} | 
              <strong>Chronological Age:</strong> ${formData.chronologicalAge}
            </div>
            
            <div style="font-size: 10pt; font-weight: bold; text-align: center; margin: 15px 0 10px 0;">${formData.classificationHeader}</div>
            <table class="classification-table" style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt;">
              <tr style="background-color: #e8e8e8;">
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">Percentile</th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">Classification Level</th>
              </tr>
              ${formData.classificationData.map(row => `
                <tr>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">${row.percentile}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: left;">${row.level}</td>
                </tr>
              `).join('')}
            </table>
            
            <div style="font-size: 10pt; font-weight: bold; text-align: center; margin: 15px 0 10px 0;">${formData.scoreSummaryHeader}</div>
            <table class="summary-table" style="width: 80%; margin: 15px auto; border-collapse: collapse;">
              <tr>
                <td style="border: 1px solid #000; padding: 6px 8px; font-weight: bold;">Raw Score</td>
                <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${formData.testResults.rawScore}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 6px 8px; font-weight: bold;">Percentile Rank</td>
                <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${formData.testResults.percentileRank}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 6px 8px; font-weight: bold;">Grade Equivalent</td>
                <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${formData.testResults.gradeEquivalent}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 6px 8px; font-weight: bold;">Age Equivalent</td>
                <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${formData.testResults.ageEquivalent}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 6px 8px; font-weight: bold;">Classification</td>
                <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${formData.testResults.classification}</td>
              </tr>
            </table>
            
            <div style="margin-top: 15px; text-align: justify;">${formData.interpretation}</div>
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
            {/* Title */}
            <div className="mb-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '11pt' }}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <textarea
                value={formData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt', lineHeight: '1.3' }}
                rows={4}
              />
            </div>

            {/* Examinee Info */}
            <div className="mb-4" style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}>
              <span className="font-bold">Examinee Name: </span>
              <input
                type="text"
                value={formData.examineeName}
                onChange={(e) => handleExamineeNameChange(e.target.value)}
                className="bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
              <span className="mx-2">|</span>
              <span className="font-bold">Chronological Age: </span>
              <input
                type="text"
                value={formData.chronologicalAge}
                onChange={(e) => handleChronologicalAgeChange(e.target.value)}
                className="bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
            </div>

            {/* Classification Table */}
            <div className="mb-2 text-center">
              <input
                type="text"
                value={formData.classificationHeader}
                onChange={(e) => handleClassificationHeaderChange(e.target.value)}
                className="w-full text-center font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
            </div>
            <table className="w-full border-collapse border border-black mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black px-3 py-2 text-center font-bold text-xs w-1/3">
                    Percentile
                  </th>
                  <th className="border border-black px-3 py-2 text-center font-bold text-xs">
                    Classification Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.classificationData.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-black px-3 py-2 text-center font-bold text-xs">
                      <input
                        type="text"
                        value={row.percentile}
                        onChange={(e) => handleClassificationChange(index, 'percentile', e.target.value)}
                        className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-3 py-2 text-xs">
                      <input
                        type="text"
                        value={row.level}
                        onChange={(e) => handleClassificationChange(index, 'level', e.target.value)}
                        className="w-full bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Score Summary */}
            <div className="mb-2 text-center">
              <input
                type="text"
                value={formData.scoreSummaryHeader}
                onChange={(e) => handleScoreSummaryHeaderChange(e.target.value)}
                className="w-full text-center font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
            </div>
            <table className="w-4/5 mx-auto border-collapse border border-black mb-4">
              <tbody>
                <tr>
                  <td className="border border-black px-3 py-2 font-bold text-xs w-1/2">
                    Raw Score
                  </td>
                  <td className="border border-black px-3 py-2 text-center text-xs w-1/2">
                    <input
                      type="text"
                      value={formData.testResults.rawScore}
                      onChange={(e) => handleTestResultChange('rawScore', e.target.value)}
                      className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-3 py-2 font-bold text-xs">
                    Percentile Rank
                  </td>
                  <td className="border border-black px-3 py-2 text-center text-xs">
                    <input
                      type="text"
                      value={formData.testResults.percentileRank}
                      onChange={(e) => handleTestResultChange('percentileRank', e.target.value)}
                      className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-3 py-2 font-bold text-xs">
                    Grade Equivalent
                  </td>
                  <td className="border border-black px-3 py-2 text-center text-xs">
                    <input
                      type="text"
                      value={formData.testResults.gradeEquivalent}
                      onChange={(e) => handleTestResultChange('gradeEquivalent', e.target.value)}
                      className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-3 py-2 font-bold text-xs">
                    Age Equivalent
                  </td>
                  <td className="border border-black px-3 py-2 text-center text-xs">
                    <input
                      type="text"
                      value={formData.testResults.ageEquivalent}
                      onChange={(e) => handleTestResultChange('ageEquivalent', e.target.value)}
                      className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-3 py-2 font-bold text-xs">
                    Classification
                  </td>
                  <td className="border border-black px-3 py-2 text-center text-xs">
                    <input
                      type="text"
                      value={formData.testResults.classification}
                      onChange={(e) => handleTestResultChange('classification', e.target.value)}
                      className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Interpretation */}
            <div>
              <textarea
                value={formData.interpretation}
                onChange={(e) => handleInterpretationChange(e.target.value)}
                className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt', lineHeight: '1.3' }}
                rows={5}
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

export default SimpleRavensCPMTemplate;
