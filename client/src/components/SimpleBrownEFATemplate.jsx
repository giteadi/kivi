import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// Brown Executive Function/Attention Scales (Brown EF/A) Template
const SimpleBrownEFATemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    // Header
    title: "3. BROWN EXECUTIVE FUNCTION / ATTENTION SCALES",
    
    // Description
    description: "Brown Executive Function / Attention Scales helps screen and assess a wider range of impairments of executive functioning. Brown EF/A Scales measures DSM-5 symptoms of ADHD along with less apparent impairments of executive functioning. It provides an easily understandable, standardized tool to collect information about the problems an individual demonstrates or reports with executive functions, the self-management functions that support attention in multiple tasks of daily life.",
    
    // Raters
    ratersHeader: "Raters included in this report are listed below:",
    raters: [
      "Parent Form",
      "Self Report",
      "Suggested ranges for clinical interpretation of all of the T Scores are as follows:"
    ],
    
    // T-Score Classification Table
    classificationHeader: "T-Score Range",
    classificationData: [
      { range: "70 and above", classification: "Markedly atypical (very significant problem)" },
      { range: "60-69", classification: "Moderately atypical (significant problem)" },
      { range: "55-59", classification: "Somewhat atypical (possibly significant problem)" },
      { range: "54 and below", classification: "Typical (unlikely significant problem)" }
    ],
    
    // T-Score Profile
    profileHeader: "BROWN EF/A SCALES T-SCORE PROFILE",
    
    // Clusters
    clusters: [
      { name: "Activation", score: "65" },
      { name: "Focus", score: "62" },
      { name: "Effort", score: "58" },
      { name: "Emotion", score: "55" },
      { name: "Memory", score: "60" },
      { name: "Action", score: "63" }
    ],
    
    // Composite Score
    compositeScore: "56/52",
    
    // Interpretation
    interpretationIntro: "Interpretation: This reports includes cluster T Scores for the Parent rater form selected. Difficulties reflected by each of the clusters T scores are described below:",
    
    interpretationText1: "The scores of the Brown Executive Function/Attention Scales fall in the significant problem range. The total composite score of 56/52 as per the Parent-Student - report indicate somewhat atypical (unlikely significant problem) in one or more of the many domains that make up executive functions.",
    
    interpretationText2: "However, the reports indicate ABC as having difficulty in the clusters of Activation, Focus and Effort.",
    
    note: "It must be noted that this screening tool cannot be fully endorsed by the tester. There are two set of scores reported above; those reported by his parents and a self-report after being given insight by the tester. They can be used as a rough guide to consider conducting a full ADHD diagnostic assessment if an individual's Total Composite Score meets or exceeds a T score of 60."
  });

  const printRef = useRef();

  const handleTitleChange = (value) => {
    setFormData(prev => ({ ...prev, title: value }));
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handleRatersHeaderChange = (value) => {
    setFormData(prev => ({ ...prev, ratersHeader: value }));
  };

  const handleRaterChange = (index, value) => {
    setFormData(prev => {
      const newRaters = [...prev.raters];
      newRaters[index] = value;
      return { ...prev, raters: newRaters };
    });
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

  const handleProfileHeaderChange = (value) => {
    setFormData(prev => ({ ...prev, profileHeader: value }));
  };

  const handleClusterChange = (index, field, value) => {
    setFormData(prev => {
      const newClusters = [...prev.clusters];
      newClusters[index] = { ...newClusters[index], [field]: value };
      return { ...prev, clusters: newClusters };
    });
  };

  const handleCompositeScoreChange = (value) => {
    setFormData(prev => ({ ...prev, compositeScore: value }));
  };

  const handleInterpretationIntroChange = (value) => {
    setFormData(prev => ({ ...prev, interpretationIntro: value }));
  };

  const handleInterpretationText1Change = (value) => {
    setFormData(prev => ({ ...prev, interpretationText1: value }));
  };

  const handleInterpretationText2Change = (value) => {
    setFormData(prev => ({ ...prev, interpretationText2: value }));
  };

  const handleNoteChange = (value) => {
    setFormData(prev => ({ ...prev, note: value }));
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Brown Executive Function/Attention Scales</title>
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
            .raters-list {
              margin: 10px 0;
              padding-left: 20px;
            }
            .raters-list li {
              margin-bottom: 3px;
            }
            .profile-header {
              font-size: 10pt;
              font-weight: bold;
              text-align: center;
              margin: 15px 0 10px 0;
            }
            .clusters-table {
              width: 80%;
              margin: 10px auto;
            }
            .clusters-table th, .clusters-table td {
              text-align: center;
            }
            .interpretation {
              margin-top: 15px;
              text-align: justify;
            }
            .note {
              margin-top: 15px;
              font-style: italic;
              text-align: justify;
            }
            input[type="text"], textarea {
              display: none;
            }
          </style>
        </head>
        <body>
          <div style="font-family: 'Times New Roman', Times, serif;">
            <div style="font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px;">${formData.title}</div>
            <div style="font-size: 10pt; text-align: justify; margin-bottom: 15px;">${formData.description}</div>
            
            <div style="font-size: 10pt; margin-bottom: 5px;">${formData.ratersHeader}</div>
            <ul style="margin: 10px 0; padding-left: 20px;">
              ${formData.raters.map(rater => `<li style="margin-bottom: 3px;">${rater}</li>`).join('')}
            </ul>
            
            <table class="classification-table" style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt;">
              <tr style="background-color: #e8e8e8;">
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">T-Score Range</th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">CLASSIFICATION</th>
              </tr>
              ${formData.classificationData.map(row => `
                <tr>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">${row.range}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: left;">${row.classification}</td>
                </tr>
              `).join('')}
            </table>
            
            <div style="font-size: 10pt; font-weight: bold; text-align: center; margin: 15px 0 10px 0;">${formData.profileHeader}</div>
            
            <table class="clusters-table" style="width: 80%; margin: 10px auto; border-collapse: collapse;">
              <tr style="background-color: #e8e8e8;">
                ${formData.clusters.map(c => `<th style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${c.name}</th>`).join('')}
              </tr>
              <tr>
                ${formData.clusters.map(c => `<td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${c.score}</td>`).join('')}
              </tr>
            </table>
            
            <div style="font-size: 10pt; margin-top: 10px; text-align: center;">Total Composite Score: ${formData.compositeScore}</div>
            
            <div style="margin-top: 15px; text-align: justify;">
              <strong>${formData.interpretationIntro}</strong>
            </div>
            
            <div style="margin-top: 10px; text-align: justify;">${formData.interpretationText1}</div>
            <div style="margin-top: 10px; text-align: justify;">${formData.interpretationText2}</div>
            
            <div style="margin-top: 15px; font-style: italic; text-align: justify;">${formData.note}</div>
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
            <h1 className="text-xl font-semibold text-gray-800">Brown EF/A Scale</h1>
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

            {/* Raters */}
            <div className="mb-4">
              <input
                type="text"
                value={formData.ratersHeader}
                onChange={(e) => handleRatersHeaderChange(e.target.value)}
                className="w-full bg-transparent focus:outline-none focus:bg-blue-50 mb-2"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
              <ul className="list-disc pl-5 space-y-1">
                {formData.raters.map((rater, index) => (
                  <li key={index}>
                    <input
                      type="text"
                      value={rater}
                      onChange={(e) => handleRaterChange(index, e.target.value)}
                      className="w-full bg-transparent focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* T-Score Classification Table */}
            <table className="w-full border-collapse border border-black mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black px-3 py-2 text-center font-bold text-xs w-1/3">
                    <input
                      type="text"
                      value="T-Score Range"
                      onChange={(e) => handleClassificationHeaderChange(e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </th>
                  <th className="border border-black px-3 py-2 text-center font-bold text-xs">
                    CLASSIFICATION
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.classificationData.map((row, index) => (
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
                        value={row.classification}
                        onChange={(e) => handleClassificationChange(index, 'classification', e.target.value)}
                        className="w-full bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* T-Score Profile Header */}
            <div className="mb-4 text-center">
              <input
                type="text"
                value={formData.profileHeader}
                onChange={(e) => handleProfileHeaderChange(e.target.value)}
                className="w-full text-center font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
            </div>

            {/* Clusters Table */}
            <table className="w-4/5 mx-auto border-collapse border border-black mb-4">
              <thead>
                <tr className="bg-gray-200">
                  {formData.clusters.map((cluster, index) => (
                    <th key={index} className="border border-black px-2 py-2 text-center font-bold text-xs">
                      <input
                        type="text"
                        value={cluster.name}
                        onChange={(e) => handleClusterChange(index, 'name', e.target.value)}
                        className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {formData.clusters.map((cluster, index) => (
                    <td key={index} className="border border-black px-2 py-2 text-center text-xs">
                      <input
                        type="text"
                        value={cluster.score}
                        onChange={(e) => handleClusterChange(index, 'score', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            {/* Composite Score */}
            <div className="mb-4 text-center">
              <span style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}>Total Composite Score: </span>
              <input
                type="text"
                value={formData.compositeScore}
                onChange={(e) => handleCompositeScoreChange(e.target.value)}
                className="bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
            </div>

            {/* Interpretation */}
            <div className="mb-4">
              <textarea
                value={formData.interpretationIntro}
                onChange={(e) => handleInterpretationIntroChange(e.target.value)}
                className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt', lineHeight: '1.3' }}
                rows={2}
              />
            </div>

            <div className="mb-4">
              <textarea
                value={formData.interpretationText1}
                onChange={(e) => handleInterpretationText1Change(e.target.value)}
                className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt', lineHeight: '1.3' }}
                rows={3}
              />
            </div>

            <div className="mb-4">
              <textarea
                value={formData.interpretationText2}
                onChange={(e) => handleInterpretationText2Change(e.target.value)}
                className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt', lineHeight: '1.3' }}
                rows={2}
              />
            </div>

            {/* Note */}
            <div>
              <textarea
                value={formData.note}
                onChange={(e) => handleNoteChange(e.target.value)}
                className="w-full bg-transparent italic focus:outline-none focus:bg-blue-50 resize-none text-justify"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt', lineHeight: '1.3' }}
                rows={4}
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

export default SimpleBrownEFATemplate;
