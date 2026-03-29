import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// Wide Range Assessment of Memory and Learning - Second Edition (WRAML-2) Template
const SimpleWRAML2Template = ({ onBack }) => {
  const [formData, setFormData] = useState({
    // Header
    title: "4. WIDE RANGE ASSESSMENT OF MEMORY AND LEARNING - SECOND EDITION (WRAML-2)",
    
    // Description
    description: "The Wide Range Assessment of Memory and Learning - Second Edition (WRAML-2) is a comprehensive battery of memory and learning tasks. It is designed to assess memory and learning abilities in individuals aged 5 to 90 years. The WRAML-2 provides a reliable and valid assessment of memory functions, including verbal and visual memory, as well as working memory and attention/concentration.",
    
    // Examinee Info
    examineeName: "ABC",
    chronologicalAge: "16 years 2 months",
    
    // Verbal Memory Section
    verbalMemory: {
      header: "VERBAL MEMORY",
      subtests: [
        { name: "Story Memory", rawScore: "12", scaledScore: "8", percentile: "25" },
        { name: "Verbal Learning", rawScore: "15", scaledScore: "9", percentile: "37" },
        { name: "Sentence Memory", rawScore: "18", scaledScore: "10", percentile: "50" },
        { name: "Sound Symbol", rawScore: "10", scaledScore: "7", percentile: "16" }
      ],
      index: {
        rawScore: "55",
        scaledScore: "34",
        percentile: "95",
        classification: "Average"
      }
    },
    
    // Visual Memory Section
    visualMemory: {
      header: "VISUAL MEMORY",
      subtests: [
        { name: "Design Memory", rawScore: "14", scaledScore: "9", percentile: "37" },
        { name: "Picture Memory", rawScore: "16", scaledScore: "10", percentile: "50" },
        { name: "Visual Learning", rawScore: "13", scaledScore: "8", percentile: "25" },
        { name: "Finger Windows", rawScore: "11", scaledScore: "7", percentile: "16" }
      ],
      index: {
        rawScore: "54",
        scaledScore: "34",
        percentile: "95",
        classification: "Average"
      }
    },
    
    // General Interpretation
    interpretation: "ABC's performance on the WRAML-2 indicates average memory functioning overall. The Verbal Memory Index and Visual Memory Index both fall within the Average range. However, there is some variability in performance across subtests. Story Memory and Visual Learning subtests were relatively weaker, while Sentence Memory and Picture Memory were relative strengths. These results suggest that ABC has generally intact memory abilities but may have some difficulty with complex verbal narratives and visual-spatial learning tasks."
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

  const handleVerbalMemoryHeaderChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      verbalMemory: { ...prev.verbalMemory, header: value }
    }));
  };

  const handleVerbalSubtestChange = (index, field, value) => {
    setFormData(prev => {
      const newSubtests = [...prev.verbalMemory.subtests];
      newSubtests[index] = { ...newSubtests[index], [field]: value };
      return { 
        ...prev, 
        verbalMemory: { ...prev.verbalMemory, subtests: newSubtests }
      };
    });
  };

  const handleVerbalIndexChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      verbalMemory: {
        ...prev.verbalMemory,
        index: { ...prev.verbalMemory.index, [field]: value }
      }
    }));
  };

  const handleVisualMemoryHeaderChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      visualMemory: { ...prev.visualMemory, header: value }
    }));
  };

  const handleVisualSubtestChange = (index, field, value) => {
    setFormData(prev => {
      const newSubtests = [...prev.visualMemory.subtests];
      newSubtests[index] = { ...newSubtests[index], [field]: value };
      return { 
        ...prev, 
        visualMemory: { ...prev.visualMemory, subtests: newSubtests }
      };
    });
  };

  const handleVisualIndexChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      visualMemory: {
        ...prev.visualMemory,
        index: { ...prev.visualMemory.index, [field]: value }
      }
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
          <title>WRAML-2</title>
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
            .section-header {
              font-size: 10pt;
              font-weight: bold;
              text-align: left;
              margin: 15px 0 10px 0;
              background-color: #e8e8e8;
              padding: 5px;
            }
            .subtests-table th {
              text-align: center;
              font-size: 8pt;
            }
            .subtests-table td:first-child {
              text-align: left;
              font-weight: bold;
            }
            .index-row {
              font-weight: bold;
              background-color: #f5f5f5;
            }
            .interpretation {
              margin-top: 15px;
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
            <div style="font-size: 10pt; text-align: justify; margin-bottom: 10px;">${formData.description}</div>
            
            <div style="font-size: 10pt; margin-bottom: 15px;">
              <strong>Examinee Name:</strong> ${formData.examineeName} | 
              <strong>Chronological Age:</strong> ${formData.chronologicalAge}
            </div>
            
            <div style="font-size: 10pt; font-weight: bold; text-align: left; margin: 15px 0 10px 0; background-color: #e8e8e8; padding: 5px;">${formData.verbalMemory.header}</div>
            <table class="subtests-table" style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt;">
              <tr style="background-color: #e8e8e8;">
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: left; font-weight: bold;">Subtest</th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">Raw Score</th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">Scaled Score</th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">Percentile Rank</th>
              </tr>
              ${formData.verbalMemory.subtests.map(item => `
                <tr>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: left; font-weight: bold;">${item.name}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${item.rawScore}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${item.scaledScore}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${item.percentile}</td>
                </tr>
              `).join('')}
              <tr style="font-weight: bold; background-color: #f5f5f5;">
                <td style="border: 1px solid #000; padding: 4px 6px; text-align: left; font-weight: bold;">Verbal Memory Index</td>
                <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${formData.verbalMemory.index.rawScore}</td>
                <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${formData.verbalMemory.index.scaledScore}</td>
                <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${formData.verbalMemory.index.percentile}</td>
              </tr>
            </table>
            <div style="font-size: 9pt; text-align: center; margin-bottom: 15px;">
              <strong>Classification:</strong> ${formData.verbalMemory.index.classification}
            </div>
            
            <div style="font-size: 10pt; font-weight: bold; text-align: left; margin: 15px 0 10px 0; background-color: #e8e8e8; padding: 5px;">${formData.visualMemory.header}</div>
            <table class="subtests-table" style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt;">
              <tr style="background-color: #e8e8e8;">
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: left; font-weight: bold;">Subtest</th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">Raw Score</th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">Scaled Score</th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold;">Percentile Rank</th>
              </tr>
              ${formData.visualMemory.subtests.map(item => `
                <tr>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: left; font-weight: bold;">${item.name}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${item.rawScore}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${item.scaledScore}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${item.percentile}</td>
                </tr>
              `).join('')}
              <tr style="font-weight: bold; background-color: #f5f5f5;">
                <td style="border: 1px solid #000; padding: 4px 6px; text-align: left; font-weight: bold;">Visual Memory Index</td>
                <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${formData.visualMemory.index.rawScore}</td>
                <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${formData.visualMemory.index.scaledScore}</td>
                <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${formData.visualMemory.index.percentile}</td>
              </tr>
            </table>
            <div style="font-size: 9pt; text-align: center; margin-bottom: 15px;">
              <strong>Classification:</strong> ${formData.visualMemory.index.classification}
            </div>
            
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
            <h1 className="text-xl font-semibold text-gray-800">WRAML-2</h1>
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

            {/* Verbal Memory Section */}
            <div className="mb-2">
              <input
                type="text"
                value={formData.verbalMemory.header}
                onChange={(e) => handleVerbalMemoryHeaderChange(e.target.value)}
                className="w-full font-bold bg-gray-200 px-2 py-1 bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
            </div>
            <table className="w-full border-collapse border border-black mb-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black px-2 py-1 text-left font-bold text-xs">Subtest</th>
                  <th className="border border-black px-2 py-1 text-center font-bold text-xs">Raw Score</th>
                  <th className="border border-black px-2 py-1 text-center font-bold text-xs">Scaled Score</th>
                  <th className="border border-black px-2 py-1 text-center font-bold text-xs">Percentile Rank</th>
                </tr>
              </thead>
              <tbody>
                {formData.verbalMemory.subtests.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-black px-2 py-1 text-xs font-bold">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleVerbalSubtestChange(index, 'name', e.target.value)}
                        className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input
                        type="text"
                        value={item.rawScore}
                        onChange={(e) => handleVerbalSubtestChange(index, 'rawScore', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input
                        type="text"
                        value={item.scaledScore}
                        onChange={(e) => handleVerbalSubtestChange(index, 'scaledScore', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input
                        type="text"
                        value={item.percentile}
                        onChange={(e) => handleVerbalSubtestChange(index, 'percentile', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-black px-2 py-1 text-xs font-bold">
                    <input
                      type="text"
                      value="Verbal Memory Index"
                      className="w-full bg-transparent font-bold focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                  <td className="border border-black px-2 py-1 text-center text-xs">
                    <input
                      type="text"
                      value={formData.verbalMemory.index.rawScore}
                      onChange={(e) => handleVerbalIndexChange('rawScore', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                  <td className="border border-black px-2 py-1 text-center text-xs">
                    <input
                      type="text"
                      value={formData.verbalMemory.index.scaledScore}
                      onChange={(e) => handleVerbalIndexChange('scaledScore', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                  <td className="border border-black px-2 py-1 text-center text-xs">
                    <input
                      type="text"
                      value={formData.verbalMemory.index.percentile}
                      onChange={(e) => handleVerbalIndexChange('percentile', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mb-4 text-center text-xs">
              <span className="font-bold">Classification: </span>
              <input
                type="text"
                value={formData.verbalMemory.index.classification}
                onChange={(e) => handleVerbalIndexChange('classification', e.target.value)}
                className="bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
              />
            </div>

            {/* Visual Memory Section */}
            <div className="mb-2">
              <input
                type="text"
                value={formData.visualMemory.header}
                onChange={(e) => handleVisualMemoryHeaderChange(e.target.value)}
                className="w-full font-bold bg-gray-200 px-2 py-1 bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
            </div>
            <table className="w-full border-collapse border border-black mb-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black px-2 py-1 text-left font-bold text-xs">Subtest</th>
                  <th className="border border-black px-2 py-1 text-center font-bold text-xs">Raw Score</th>
                  <th className="border border-black px-2 py-1 text-center font-bold text-xs">Scaled Score</th>
                  <th className="border border-black px-2 py-1 text-center font-bold text-xs">Percentile Rank</th>
                </tr>
              </thead>
              <tbody>
                {formData.visualMemory.subtests.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-black px-2 py-1 text-xs font-bold">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleVisualSubtestChange(index, 'name', e.target.value)}
                        className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input
                        type="text"
                        value={item.rawScore}
                        onChange={(e) => handleVisualSubtestChange(index, 'rawScore', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input
                        type="text"
                        value={item.scaledScore}
                        onChange={(e) => handleVisualSubtestChange(index, 'scaledScore', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input
                        type="text"
                        value={item.percentile}
                        onChange={(e) => handleVisualSubtestChange(index, 'percentile', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-black px-2 py-1 text-xs font-bold">
                    <input
                      type="text"
                      value="Visual Memory Index"
                      className="w-full bg-transparent font-bold focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                  <td className="border border-black px-2 py-1 text-center text-xs">
                    <input
                      type="text"
                      value={formData.visualMemory.index.rawScore}
                      onChange={(e) => handleVisualIndexChange('rawScore', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                  <td className="border border-black px-2 py-1 text-center text-xs">
                    <input
                      type="text"
                      value={formData.visualMemory.index.scaledScore}
                      onChange={(e) => handleVisualIndexChange('scaledScore', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                  <td className="border border-black px-2 py-1 text-center text-xs">
                    <input
                      type="text"
                      value={formData.visualMemory.index.percentile}
                      onChange={(e) => handleVisualIndexChange('percentile', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mb-4 text-center text-xs">
              <span className="font-bold">Classification: </span>
              <input
                type="text"
                value={formData.visualMemory.index.classification}
                onChange={(e) => handleVisualIndexChange('classification', e.target.value)}
                className="bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
              />
            </div>

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

export default SimpleWRAML2Template;
