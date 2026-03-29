import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// Nelson Denny Reading Test (Form I & J) Template
const SimpleNelsonDennyTemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    // Header
    title: "NELSON DENNY READING TEST (FORM I & J)",
    
    // Description
    description: "The Nelson-Denny Reading Test Form I and J is a valid and reliable measure of silent reading vocabulary, comprehension, and rate.",
    
    // Core Subtests Header
    coreSubtestsHeader: "Core Subtests and Composite",
    
    // Vocabulary bullet
    vocabularyBullet: "Vocabulary—Students are presented with an opening statement and five answer choices; for example, \"A chef works with A. bricks B. music C. clothes D. food E. statues.\" Students select the option that best completes the opening statement.",
    
    // Comprehension bullet
    comprehensionBullet: "Comprehension—The Comprehension subtest consists of seven reading passages and 36 comprehension questions, each with five answer choices. Students are instructed to read as many passages and answer as many comprehension questions as they can.",
    
    // General Reading Ability bullet
    generalReadingBullet: "General Reading Ability—This composite is derived by combining index scores from the Vocabulary and Comprehension subtests to achieve a stronger and more reliable index of overall reading ability.",
    
    // First Table - Subtests
    subtestsTableHeader: "SUBTEST",
    rawScoreHeader: "RAW SCORE",
    percentileRankHeader: "PERCENTILE RANK",
    standardScoreHeader: "STANDARD SCORE",
    descriptiveTermHeader: "DESCRIPTIVE TERM",
    
    subtests: [
      { name: "Vocabulary", rawScore: "28", percentileRank: "47", standardScore: "99", descriptiveTerm: "Average" },
      { name: "Comprehension", rawScore: "22", percentileRank: "64", standardScore: "115", descriptiveTerm: "Above Average" },
      { name: "Reading Rate", rawScore: "151", percentileRank: "14", standardScore: "85", descriptiveTerm: "" }
    ],
    
    // Second Table - Summary
    sumCoreIndexHeader: "SUM OF CORE INDEX SCORES",
    summaryPercentileHeader: "PERCENTILE RANK",
    generalReadingAbilityHeader: "GENERAL READING ABILITY",
    confidenceIntervalHeader: "95% CONFIDENCE INTERVAL",
    summaryDescriptiveTermHeader: "DESCRIPTIVE TERM",
    
    summaryRow: {
      sumCoreIndex: "214",
      percentileRank: "70",
      generalReadingAbility: "108",
      confidenceInterval: "101 to 114",
      descriptiveTerm: "Average"
    },
    
    // Annexure note
    annexureNote: "Note: Attach this report as Annexure."
  });

  const printRef = useRef();

  const handleTitleChange = (value) => {
    setFormData(prev => ({ ...prev, title: value }));
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handleCoreSubtestsHeaderChange = (value) => {
    setFormData(prev => ({ ...prev, coreSubtestsHeader: value }));
  };

  const handleVocabularyBulletChange = (value) => {
    setFormData(prev => ({ ...prev, vocabularyBullet: value }));
  };

  const handleComprehensionBulletChange = (value) => {
    setFormData(prev => ({ ...prev, comprehensionBullet: value }));
  };

  const handleGeneralReadingBulletChange = (value) => {
    setFormData(prev => ({ ...prev, generalReadingBullet: value }));
  };

  const handleTableHeaderChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubtestChange = (index, field, value) => {
    setFormData(prev => {
      const newSubtests = [...prev.subtests];
      newSubtests[index] = { ...newSubtests[index], [field]: value };
      return { ...prev, subtests: newSubtests };
    });
  };

  const handleSummaryRowChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      summaryRow: { ...prev.summaryRow, [field]: value }
    }));
  };

  const handleAnnexureNoteChange = (value) => {
    setFormData(prev => ({ ...prev, annexureNote: value }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Nelson Denny Reading Test (Form I & J)</title>
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
            .section-header {
              font-size: 10pt;
              font-weight: bold;
              text-align: left;
              margin: 15px 0 10px 0;
            }
            ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            li {
              margin-bottom: 8px;
              text-align: justify;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              font-size: 9pt;
            }
            th, td {
              border: 1px solid #000;
              padding: 6px 8px;
              text-align: center;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
              font-size: 8pt;
            }
            td:first-child {
              text-align: left;
              font-weight: bold;
            }
            .summary-table td:first-child {
              font-weight: bold;
            }
            .note {
              margin-top: 20px;
              font-style: italic;
              font-size: 9pt;
            }
          </style>
        </head>
        <body>
          <div style="font-family: 'Times New Roman', Times, serif;">
            <div style="font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px;">${formData.title}</div>
            <div style="font-size: 10pt; text-align: justify; margin-bottom: 10px;">${formData.description}</div>
            
            <div style="font-size: 10pt; font-weight: bold; text-align: left; margin: 15px 0 10px 0;">${formData.coreSubtestsHeader}</div>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li style="margin-bottom: 8px; text-align: justify;"><strong>Vocabulary—</strong>${formData.vocabularyBullet.replace('Vocabulary—', '')}</li>
              <li style="margin-bottom: 8px; text-align: justify;"><strong>Comprehension—</strong>${formData.comprehensionBullet.replace('Comprehension—', '')}</li>
              <li style="margin-bottom: 8px; text-align: justify;"><strong>General Reading Ability—</strong>${formData.generalReadingBullet.replace('General Reading Ability—', '')}</li>
            </ul>
            
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 9pt;">
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #000; padding: 6px 8px; text-align: left; font-weight: bold; font-size: 8pt;">SUBTEST</th>
                <th style="border: 1px solid #000; padding: 6px 8px; text-align: center; font-weight: bold; font-size: 8pt;">RAW SCORE</th>
                <th style="border: 1px solid #000; padding: 6px 8px; text-align: center; font-weight: bold; font-size: 8pt;">PERCENTILE RANK</th>
                <th style="border: 1px solid #000; padding: 6px 8px; text-align: center; font-weight: bold; font-size: 8pt;">STANDARD SCORE</th>
                <th style="border: 1px solid #000; padding: 6px 8px; text-align: center; font-weight: bold; font-size: 8pt;">DESCRIPTIVE TERM</th>
              </tr>
              ${formData.subtests.map(item => `
                <tr>
                  <td style="border: 1px solid #000; padding: 6px 8px; text-align: left; font-weight: bold;">${item.name}</td>
                  <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${item.rawScore}</td>
                  <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${item.percentileRank}</td>
                  <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${item.standardScore}</td>
                  <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${item.descriptiveTerm}</td>
                </tr>
              `).join('')}
            </table>
            
            <table class="summary-table" style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 9pt;">
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #000; padding: 6px 8px; text-align: center; font-weight: bold; font-size: 8pt;">SUM OF CORE<br/>INDEX SCORES</th>
                <th style="border: 1px solid #000; padding: 6px 8px; text-align: center; font-weight: bold; font-size: 8pt;">PERCENTILE<br/>RANK</th>
                <th style="border: 1px solid #000; padding: 6px 8px; text-align: center; font-weight: bold; font-size: 8pt;">GENERAL READING<br/>ABILITY</th>
                <th style="border: 1px solid #000; padding: 6px 8px; text-align: center; font-weight: bold; font-size: 8pt;">95%<br/>CONFIDENCE<br/>INTERVAL</th>
                <th style="border: 1px solid #000; padding: 6px 8px; text-align: center; font-weight: bold; font-size: 8pt;">DESCRIPTIVE<br/>TERM</th>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 6px 8px; text-align: center; font-weight: bold;">${formData.summaryRow.sumCoreIndex}</td>
                <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${formData.summaryRow.percentileRank}</td>
                <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${formData.summaryRow.generalReadingAbility}</td>
                <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${formData.summaryRow.confidenceInterval}</td>
                <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${formData.summaryRow.descriptiveTerm}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px; font-style: italic; font-size: 9pt;">${formData.annexureNote}</div>
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
            <h1 className="text-xl font-semibold text-gray-800">Nelson Denny Reading Test</h1>
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
                rows={2}
              />
            </div>

            {/* Core Subtests Section */}
            <div className="mb-2">
              <input
                type="text"
                value={formData.coreSubtestsHeader}
                onChange={(e) => handleCoreSubtestsHeaderChange(e.target.value)}
                className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
            </div>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}>
                <strong>Vocabulary—</strong>
                <textarea
                  value={formData.vocabularyBullet.replace('Vocabulary—', '')}
                  onChange={(e) => handleVocabularyBulletChange('Vocabulary—' + e.target.value)}
                  className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify inline"
                  style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt', lineHeight: '1.3' }}
                  rows={3}
                />
              </li>
              <li style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}>
                <strong>Comprehension—</strong>
                <textarea
                  value={formData.comprehensionBullet.replace('Comprehension—', '')}
                  onChange={(e) => handleComprehensionBulletChange('Comprehension—' + e.target.value)}
                  className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify inline"
                  style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt', lineHeight: '1.3' }}
                  rows={3}
                />
              </li>
              <li style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}>
                <strong>General Reading Ability—</strong>
                <textarea
                  value={formData.generalReadingBullet.replace('General Reading Ability—', '')}
                  onChange={(e) => handleGeneralReadingBulletChange('General Reading Ability—' + e.target.value)}
                  className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify inline"
                  style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt', lineHeight: '1.3' }}
                  rows={2}
                />
              </li>
            </ul>

            {/* First Table - Subtests */}
            <table className="w-full border-collapse border border-black mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-2 py-2 text-left font-bold text-xs">
                    <input
                      type="text"
                      value={formData.subtestsTableHeader}
                      onChange={(e) => handleTableHeaderChange('subtestsTableHeader', e.target.value)}
                      className="w-full bg-transparent font-bold focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '8pt' }}
                    />
                  </th>
                  <th className="border border-black px-2 py-2 text-center font-bold text-xs">
                    <input
                      type="text"
                      value={formData.rawScoreHeader}
                      onChange={(e) => handleTableHeaderChange('rawScoreHeader', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '8pt' }}
                    />
                  </th>
                  <th className="border border-black px-2 py-2 text-center font-bold text-xs">
                    <input
                      type="text"
                      value={formData.percentileRankHeader}
                      onChange={(e) => handleTableHeaderChange('percentileRankHeader', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '8pt' }}
                    />
                  </th>
                  <th className="border border-black px-2 py-2 text-center font-bold text-xs">
                    <input
                      type="text"
                      value={formData.standardScoreHeader}
                      onChange={(e) => handleTableHeaderChange('standardScoreHeader', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '8pt' }}
                    />
                  </th>
                  <th className="border border-black px-2 py-2 text-center font-bold text-xs">
                    <input
                      type="text"
                      value={formData.descriptiveTermHeader}
                      onChange={(e) => handleTableHeaderChange('descriptiveTermHeader', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '8pt' }}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.subtests.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-black px-2 py-2 text-xs font-bold">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleSubtestChange(index, 'name', e.target.value)}
                        className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-2 text-center text-xs">
                      <input
                        type="text"
                        value={item.rawScore}
                        onChange={(e) => handleSubtestChange(index, 'rawScore', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-2 text-center text-xs">
                      <input
                        type="text"
                        value={item.percentileRank}
                        onChange={(e) => handleSubtestChange(index, 'percentileRank', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-2 text-center text-xs">
                      <input
                        type="text"
                        value={item.standardScore}
                        onChange={(e) => handleSubtestChange(index, 'standardScore', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-2 text-center text-xs">
                      <input
                        type="text"
                        value={item.descriptiveTerm}
                        onChange={(e) => handleSubtestChange(index, 'descriptiveTerm', e.target.value)}
                        className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Second Table - Summary */}
            <table className="w-full border-collapse border border-black mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-2 py-2 text-center font-bold text-xs">
                    <input
                      type="text"
                      value={formData.sumCoreIndexHeader}
                      onChange={(e) => handleTableHeaderChange('sumCoreIndexHeader', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '8pt' }}
                    />
                  </th>
                  <th className="border border-black px-2 py-2 text-center font-bold text-xs">
                    <input
                      type="text"
                      value={formData.summaryPercentileHeader}
                      onChange={(e) => handleTableHeaderChange('summaryPercentileHeader', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '8pt' }}
                    />
                  </th>
                  <th className="border border-black px-2 py-2 text-center font-bold text-xs">
                    <input
                      type="text"
                      value={formData.generalReadingAbilityHeader}
                      onChange={(e) => handleTableHeaderChange('generalReadingAbilityHeader', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '8pt' }}
                    />
                  </th>
                  <th className="border border-black px-2 py-2 text-center font-bold text-xs">
                    <input
                      type="text"
                      value={formData.confidenceIntervalHeader}
                      onChange={(e) => handleTableHeaderChange('confidenceIntervalHeader', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '8pt' }}
                    />
                  </th>
                  <th className="border border-black px-2 py-2 text-center font-bold text-xs">
                    <input
                      type="text"
                      value={formData.summaryDescriptiveTermHeader}
                      onChange={(e) => handleTableHeaderChange('summaryDescriptiveTermHeader', e.target.value)}
                      className="w-full text-center bg-transparent font-bold focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '8pt' }}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-2 py-2 text-center text-xs font-bold">
                    <input
                      type="text"
                      value={formData.summaryRow.sumCoreIndex}
                      onChange={(e) => handleSummaryRowChange('sumCoreIndex', e.target.value)}
                      className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                  <td className="border border-black px-2 py-2 text-center text-xs">
                    <input
                      type="text"
                      value={formData.summaryRow.percentileRank}
                      onChange={(e) => handleSummaryRowChange('percentileRank', e.target.value)}
                      className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                  <td className="border border-black px-2 py-2 text-center text-xs">
                    <input
                      type="text"
                      value={formData.summaryRow.generalReadingAbility}
                      onChange={(e) => handleSummaryRowChange('generalReadingAbility', e.target.value)}
                      className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                  <td className="border border-black px-2 py-2 text-center text-xs">
                    <input
                      type="text"
                      value={formData.summaryRow.confidenceInterval}
                      onChange={(e) => handleSummaryRowChange('confidenceInterval', e.target.value)}
                      className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                  <td className="border border-black px-2 py-2 text-center text-xs">
                    <input
                      type="text"
                      value={formData.summaryRow.descriptiveTerm}
                      onChange={(e) => handleSummaryRowChange('descriptiveTerm', e.target.value)}
                      className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Annexure Note */}
            <div className="mt-4">
              <input
                type="text"
                value={formData.annexureNote}
                onChange={(e) => handleAnnexureNoteChange(e.target.value)}
                className="w-full bg-transparent italic focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
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

export default SimpleNelsonDennyTemplate;
