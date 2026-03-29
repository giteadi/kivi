import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// Gilliam Autism Rating Scale - Third Edition (GARS-3) Template
const SimpleGARS3Template = ({ onBack }) => {
  const [formData, setFormData] = useState({
    // Header
    title: "6. GILLIAM AUTISM RATING SCALE - THIRD EDITION (GARS-3)",
    
    // Description
    description: "The Gilliam Autism Rating Scale - Third Edition (GARS-3) is a tool that assists teachers, parents, and clinicians in identifying and diagnosing autism in individuals ages 3 through 22. It also helps estimate the severity of the child's disorder in terms of standard scores and percentile ranks.",
    
    // Examinee Info
    examineeName: "ABC",
    chronologicalAge: "16 years 2 months",
    
    // Classification Table
    classificationHeader: "CLASSIFICATION",
    classifications: [
      { range: "90 and above", level: "Very Likely indicates presence of Autism." },
      { range: "85-89", level: "Possibly indicates presence of Autism." },
      { range: "79 and below", level: "Unlikely indicates presence of Autism." }
    ],
    
    // Score Summary
    scoreSummaryHeader: "GARS-3 SCORE SUMMARY",
    scoreSummarySubheader: "Parent form was selected",
    
    // Subscales
    subscales: {
      header: "Subscales",
      items: [
        { name: "Restricted, Repetitive Behaviour", rawScore: "53", scaledScore: "18", percentileRank: "99", severity: "Very High" },
        { name: "Social Interaction", rawScore: "26", scaledScore: "7", percentileRank: "16", severity: "Below Average" },
        { name: "Social Communication", rawScore: "42", scaledScore: "13", percentileRank: "84", severity: "Above Average" },
        { name: "Emotional Responses", rawScore: "8", scaledScore: "4", percentileRank: "2", severity: "Well Below Average" },
        { name: "Cognitive Style", rawScore: "14", scaledScore: "6", percentileRank: "9", severity: "Below Average" },
        { name: "Maladaptive Speech", rawScore: "2", scaledScore: "1", percentileRank: "<0.1", severity: "Well Below Average" }
      ]
    },
    
    // Index Score
    indexScore: {
      header: "GARS-3 Autism Index Score",
      items: [
        { type: "Standard Score", value: "90" },
        { type: "95% Confidence Interval", value: "87-93" },
        { type: "Percentile Rank", value: "99" },
        { type: "Classification Level", value: "Very Likely" }
      ]
    },
    
    // Interpretation
    interpretation: "This report indicates that ABC is having significant difficulties in Social Interaction, Emotional Responses, Cognitive Style and Maladaptive Speech subscales. ABC scored in the Well Below Average range on Social Interaction, Emotional Responses, Cognitive Style and Maladaptive Speech which indicates significant concerns in these areas. However, ABC's score in the Social Communication subscale suggests Above Average performance. The GARS-3 Autism Index Score of 90 (99th percentile) suggests that autism is Very Likely present. Further comprehensive diagnostic assessment is recommended to confirm these findings."
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
      const newClassifications = [...prev.classifications];
      newClassifications[index] = { ...newClassifications[index], [field]: value };
      return { ...prev, classifications: newClassifications };
    });
  };

  const handleScoreSummaryHeaderChange = (value) => {
    setFormData(prev => ({ ...prev, scoreSummaryHeader: value }));
  };

  const handleScoreSummarySubheaderChange = (value) => {
    setFormData(prev => ({ ...prev, scoreSummarySubheader: value }));
  };

  const handleSubscalesHeaderChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      subscales: { ...prev.subscales, header: value }
    }));
  };

  const handleSubscaleChange = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.subscales.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { 
        ...prev, 
        subscales: { ...prev.subscales, items: newItems }
      };
    });
  };

  const handleIndexScoreHeaderChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      indexScore: { ...prev.indexScore, header: value }
    }));
  };

  const handleIndexScoreItemChange = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.indexScore.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { 
        ...prev, 
        indexScore: { ...prev.indexScore, items: newItems }
      };
    });
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
          <title>Gilliam Autism Rating Scale - Third Edition (GARS-3)</title>
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
              text-align: left;
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
            .subscales-table th {
              text-align: center;
              font-size: 8pt;
            }
            .subscales-table td {
              text-align: center;
            }
            .subscales-table td:first-child {
              text-align: left;
            }
            .index-score-table {
              width: 60%;
              margin: 10px auto;
            }
            .index-score-table td:first-child {
              font-weight: bold;
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
            .subheader {
              font-size: 9pt;
              font-style: italic;
              text-align: center;
              margin-bottom: 10px;
            }
            input[type="text"], textarea {
              display: none;
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
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">T-Score Range</th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">Classification Level</th>
              </tr>
              ${formData.classifications.map(row => `
                <tr>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">${row.range}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: left;">${row.level}</td>
                </tr>
              `).join('')}
            </table>
            
            <div style="font-size: 10pt; font-weight: bold; text-align: center; margin: 15px 0 5px 0;">${formData.scoreSummaryHeader}</div>
            <div style="font-size: 9pt; font-style: italic; text-align: center; margin-bottom: 10px;">${formData.scoreSummarySubheader}</div>
            
            <div style="font-size: 10pt; font-weight: bold; text-align: center; margin: 10px 0;">${formData.subscales.header}</div>
            <table class="subscales-table" style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt;">
              <tr style="background-color: #e8e8e8;">
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: left; font-weight: bold;">Subscale</th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">Raw Score</th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">Scaled Score</th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">Percentile Rank</th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">Severity Level</th>
              </tr>
              ${formData.subscales.items.map(item => `
                <tr>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: left;">${item.name}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${item.rawScore}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${item.scaledScore}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${item.percentileRank}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${item.severity}</td>
                </tr>
              `).join('')}
            </table>
            
            <div style="font-size: 10pt; font-weight: bold; text-align: center; margin: 15px 0 10px 0;">${formData.indexScore.header}</div>
            <table class="index-score-table" style="width: 60%; margin: 10px auto; border-collapse: collapse;">
              ${formData.indexScore.items.map(item => `
                <tr>
                  <td style="border: 1px solid #000; padding: 4px 6px; font-weight: bold;">${item.type}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${item.value}</td>
                </tr>
              `).join('')}
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
            <h1 className="text-xl font-semibold text-gray-800">GARS-3</h1>
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
                rows={3}
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
                    T-Score Range
                  </th>
                  <th className="border border-black px-3 py-2 text-center font-bold text-xs">
                    Classification Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.classifications.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-black px-3 py-2 text-center font-bold text-xs">
                      <input
                        type="text"
                        value={row.range}
                        onChange={(e) => handleClassificationChange(index, 'range', e.target.value)}
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
            <div className="mb-1 text-center">
              <input
                type="text"
                value={formData.scoreSummaryHeader}
                onChange={(e) => handleScoreSummaryHeaderChange(e.target.value)}
                className="w-full text-center font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
            </div>
            <div className="mb-2 text-center">
              <input
                type="text"
                value={formData.scoreSummarySubheader}
                onChange={(e) => handleScoreSummarySubheaderChange(e.target.value)}
                className="w-full text-center italic bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
              />
            </div>

            {/* Subscales Table */}
            <div className="mb-2 text-center">
              <input
                type="text"
                value={formData.subscales.header}
                onChange={(e) => handleSubscalesHeaderChange(e.target.value)}
                className="w-full text-center font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
            </div>
            <table className="w-full border-collapse border border-black mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black px-2 py-1 text-left font-bold text-xs">Subscale</th>
                  <th className="border border-black px-2 py-1 text-center font-bold text-xs">Raw Score</th>
                  <th className="border border-black px-2 py-1 text-center font-bold text-xs">Scaled Score</th>
                  <th className="border border-black px-2 py-1 text-center font-bold text-xs">Percentile Rank</th>
                  <th className="border border-black px-2 py-1 text-center font-bold text-xs">Severity Level</th>
                </tr>
              </thead>
              <tbody>
                {formData.subscales.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-black px-2 py-1 text-xs">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleSubscaleChange(index, 'name', e.target.value)}
                        className="w-full bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input
                        type="text"
                        value={item.rawScore}
                        onChange={(e) => handleSubscaleChange(index, 'rawScore', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input
                        type="text"
                        value={item.scaledScore}
                        onChange={(e) => handleSubscaleChange(index, 'scaledScore', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input
                        type="text"
                        value={item.percentileRank}
                        onChange={(e) => handleSubscaleChange(index, 'percentileRank', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input
                        type="text"
                        value={item.severity}
                        onChange={(e) => handleSubscaleChange(index, 'severity', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Index Score */}
            <div className="mb-2 text-center">
              <input
                type="text"
                value={formData.indexScore.header}
                onChange={(e) => handleIndexScoreHeaderChange(e.target.value)}
                className="w-full text-center font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
            </div>
            <table className="w-3/5 mx-auto border-collapse border border-black mb-4">
              <tbody>
                {formData.indexScore.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-black px-3 py-2 font-bold text-xs w-1/2">
                      <input
                        type="text"
                        value={item.type}
                        onChange={(e) => handleIndexScoreItemChange(index, 'type', e.target.value)}
                        className="w-full bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-3 py-2 text-center text-xs w-1/2">
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => handleIndexScoreItemChange(index, 'value', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Interpretation */}
            <div>
              <textarea
                value={formData.interpretation}
                onChange={(e) => handleInterpretationChange(e.target.value)}
                className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt', lineHeight: '1.3' }}
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

export default SimpleGARS3Template;
