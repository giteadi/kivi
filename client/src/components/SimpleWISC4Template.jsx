import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

const SimpleWISC4Template = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "WECHSLER'S INTELLIGENCE SCALE FOR CHILDREN - WISC-IV India",
    
    description: "The WISC-IV is a norm-referenced, individually administered test of intelligence. Ability levels were assessed using the WISC-IV as a basis for intellectual evaluation along with the administration of additional assessments to evaluate specific areas in greater depth. It provides a measure of general intelligence as well as more specific measures of verbal comprehension, perceptual reasoning, working memory, and processing speed. It consists of 10 sub-tests each measuring different aspects of the child's intellectual functioning. The sub-tests are divided into two groups: Verbal (those that assess the child's ability to understand reason and express himself through language) and Performance (those that assess the child's ability to perceive, organize and reason with visual and spatial stimuli).",
    
    testScoresHeader: "TEST SCORES",
    
    // Main Index Table Headers
    compositeScoresHeader: "Composite & Factor Index Scores",
    sumOfScaledScoresHeader: "Sum of\nScaled\nScores",
    compositeScoreHeader: "Composite\nScore",
    percentileRankHeader: "Percentile\nRank",
    confidenceIntervalHeader: "95% Confidence\nInterval",
    
    // Main Index Scores
    indexes: [
      { 
        name: "Verbal Comprehension Index (VCI)", 
        sumScaled: "49", 
        composite: "138", 
        percentile: "99", 
        confidence: "129-142 %" 
      },
      { 
        name: "Perceptual Reasoning Index (PRI)", 
        sumScaled: "36", 
        composite: "111", 
        percentile: "73", 
        confidence: "102-118 %" 
      },
      { 
        name: "Working Memory Index (WMI)", 
        sumScaled: "21", 
        composite: "103", 
        percentile: "58", 
        confidence: "95-110 %" 
      },
      { 
        name: "Processing Speed Index (PSI)", 
        sumScaled: "15", 
        composite: "86", 
        percentile: "18", 
        confidence: "79-97%" 
      }
    ],
    
    // Subtest Profile Header
    subtestProfileHeader: "SUB-TEST SCALED SCORE PROFILE",
    
    // VCI Subtests
    vciSubtests: [
      { name: "Similarities", score: "17" },
      { name: "Vocabulary", score: "15" },
      { name: "Comprehension", score: "17" }
    ],
    
    // PRI Subtests
    priSubtests: [
      { name: "Block Design", score: "14" },
      { name: "Picture Completion", score: "11" },
      { name: "Matrix Reasoning", score: "11" }
    ],
    
    // WMI Subtests
    wmiSubtests: [
      { name: "Digit Span", score: "11" },
      { name: "Letter-Number Seq", score: "10" }
    ],
    
    // PSI Subtests
    psiSubtests: [
      { name: "Coding", score: "8" },
      { name: "Symbol Search", score: "7" }
    ],
    
    // Discrepancy Comparison Table
    discrepancyHeader: "DISCREPANCY COMPARISON TABLE",
    discrepancyColumns: {
      comparison: "Comparison",
      score1: "Composite\nScore 1",
      score2: "Composite\nScore 2",
      difference: "Difference",
      criticalValue: "Critical Value",
      significant: "Significant\nDifference"
    },
    
    discrepancies: [
      { comparison: "VCI-PRI", score1: "138", score2: "111", difference: "27", critical: "10.18", significant: "Yes" },
      { comparison: "VCI-WMI", score1: "138", score2: "103", difference: "35", critical: "10.99", significant: "Yes" },
      { comparison: "VCI-PSI", score1: "138", score2: "86", difference: "52", critical: "13.15", significant: "Yes" },
      { comparison: "PRI-WMI", score1: "111", score2: "103", difference: "12", critical: "9.29", significant: "Yes" },
      { comparison: "PRI-PSI", score1: "111", score2: "86", difference: "10", critical: "11.77", significant: "Yes" },
      { comparison: "WMI-PSI", score1: "103", score2: "86", difference: "17", critical: "13.48", significant: "Yes" }
    ],
    
    interpretation: ""
  });

  const printRef = useRef();

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleIndexChange = (index, field, value) => {
    const newIndexes = [...formData.indexes];
    newIndexes[index] = { ...newIndexes[index], [field]: value };
    setFormData(prev => ({ ...prev, indexes: newIndexes }));
  };
  
  const handleSubtestChange = (section, index, field, value) => {
    const newSection = [...formData[section]];
    newSection[index] = { ...newSection[index], [field]: value };
    setFormData(prev => ({ ...prev, [section]: newSection }));
  };
  
  const handleDiscrepancyChange = (index, field, value) => {
    const newDiscrepancies = [...formData.discrepancies];
    newDiscrepancies[index] = { ...newDiscrepancies[index], [field]: value };
    setFormData(prev => ({ ...prev, discrepancies: newDiscrepancies }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>WISC-IV</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 750px; margin: 0 auto; padding: 15px; color: #000; }
            .report-box { border: 1px solid #000; padding: 15px; max-width: 750px; }
            .title { font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px; }
            .desc { font-size: 10pt; text-align: justify; margin-bottom: 15px; }
            .section-header { font-size: 10pt; font-weight: bold; text-align: left; margin: 15px 0 5px 0; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 8pt; }
            th, td { border: 1px solid #000; padding: 3px 5px; text-align: center; }
            th { font-weight: bold; background-color: #e8e8e8; }
            td:first-child { text-align: left; font-weight: bold; }
            .subtest-table td:first-child { font-weight: normal; font-size: 8pt; }
            .subtest-header { background-color: #333; color: white; font-weight: bold; font-size: 8pt; }
            .index-name { font-weight: bold; }
            .discrepancy-table th { background-color: #333; color: white; }
            .discrepancy-table td { font-size: 8pt; }
            .interpretation { margin-top: 15px; text-align: justify; font-size: 10pt; }
          </style>
        </head>
        <body>
          <div class="report-box">
            <div class="title">${formData.title}</div>
            <div class="desc">${formData.description}</div>
            
            <div class="section-header">${formData.testScoresHeader}</div>
            
            <!-- Main Index Scores Table -->
            <table>
              <tr>
                <th>${formData.compositeScoresHeader}</th>
                <th>${formData.sumOfScaledScoresHeader.replace(/\n/g, '<br/>')}</th>
                <th>${formData.compositeScoreHeader.replace(/\n/g, '<br/>')}</th>
                <th>${formData.percentileRankHeader.replace(/\n/g, '<br/>')}</th>
                <th>${formData.confidenceIntervalHeader.replace(/\n/g, '<br/>')}</th>
              </tr>
              ${formData.indexes.map(idx => `
                <tr>
                  <td class="index-name">${idx.name}</td>
                  <td>${idx.sumScaled}</td>
                  <td>${idx.composite}</td>
                  <td>${idx.percentile}</td>
                  <td>${idx.confidence}</td>
                </tr>
              `).join('')}
            </table>
            
            <!-- Sub-test Scaled Score Profile -->
            <div class="section-header">${formData.subtestProfileHeader}</div>
            <table class="subtest-table">
              <tr>
                <th class="subtest-header">VCI Subtests</th>
                <th class="subtest-header">Scaled Score</th>
                <th class="subtest-header">PRI Subtests</th>
                <th class="subtest-header">Scaled Score</th>
                <th class="subtest-header">WMI Subtests</th>
                <th class="subtest-header">Scaled Score</th>
                <th class="subtest-header">PSI Subtests</th>
                <th class="subtest-header">Scaled Score</th>
              </tr>
              ${[0, 1, 2].map(row => `
                <tr>
                  <td>${formData.vciSubtests[row]?.name || ''}</td>
                  <td>${formData.vciSubtests[row]?.score || ''}</td>
                  <td>${formData.priSubtests[row]?.name || ''}</td>
                  <td>${formData.priSubtests[row]?.score || ''}</td>
                  <td>${formData.wmiSubtests[row]?.name || ''}</td>
                  <td>${formData.wmiSubtests[row]?.score || ''}</td>
                  <td>${formData.psiSubtests[row]?.name || ''}</td>
                  <td>${formData.psiSubtests[row]?.score || ''}</td>
                </tr>
              `).join('')}
            </table>
            
            <!-- Discrepancy Comparison Table -->
            <div class="section-header">${formData.discrepancyHeader}</div>
            <table class="discrepancy-table">
              <tr>
                <th>${formData.discrepancyColumns.comparison}</th>
                <th>${formData.discrepancyColumns.score1.replace(/\n/g, '<br/>')}</th>
                <th>${formData.discrepancyColumns.score2.replace(/\n/g, '<br/>')}</th>
                <th>${formData.discrepancyColumns.difference}</th>
                <th>${formData.discrepancyColumns.criticalValue}</th>
                <th>${formData.discrepancyColumns.significant.replace(/\n/g, '<br/>')}</th>
              </tr>
              ${formData.discrepancies.map(d => `
                <tr>
                  <td>${d.comparison}</td>
                  <td>${d.score1}</td>
                  <td>${d.score2}</td>
                  <td>${d.difference}</td>
                  <td>${d.critical}</td>
                  <td>${d.significant}</td>
                </tr>
              `).join('')}
            </table>
            
            ${formData.interpretation ? `<div class="interpretation"><strong>Interpretation:</strong> ${formData.interpretation}</div>` : ''}
          </div>
          <div style="margin-top: 30px; font-size: 8pt; color: #666; text-align: right;">Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"><FiArrowLeft className="w-5 h-5" /><span>Back</span></button>}
            <h1 className="text-xl font-semibold text-gray-800">WISC-IV</h1>
          </div>
          <button onClick={handlePrint} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FiPrinter className="w-4 h-4" /><span>Print / PDF</span></button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div ref={printRef} className="p-8" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
            {/* Outer Box Border */}
            <div style={{ border: '1px solid #000', padding: '20px', maxWidth: '750px' }}>
              {/* Title */}
              <div className="mb-4">
                <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '11pt' }} />
              </div>
              
              {/* Description */}
              <div className="mb-4">
                <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={8} />
              </div>
              
              {/* Test Scores Header */}
              <div className="mb-2">
                <input type="text" value={formData.testScoresHeader} onChange={(e) => handleChange('testScoresHeader', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '10pt' }} />
              </div>
              
              {/* Main Index Scores Table */}
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-black px-2 py-1 text-left font-bold text-xs" style={{ width: '35%' }}>
                      <input type="text" value={formData.compositeScoresHeader} onChange={(e) => handleChange('compositeScoresHeader', e.target.value)} className="w-full bg-transparent font-bold focus:outline-none" style={{ fontSize: '8pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.sumOfScaledScoresHeader} onChange={(e) => handleChange('sumOfScaledScoresHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '7pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.compositeScoreHeader} onChange={(e) => handleChange('compositeScoreHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '7pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.percentileRankHeader} onChange={(e) => handleChange('percentileRankHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '7pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.confidenceIntervalHeader} onChange={(e) => handleChange('confidenceIntervalHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '7pt' }} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.indexes.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-black px-2 py-1 text-xs font-bold">
                        <input type="text" value={item.name} onChange={(e) => handleIndexChange(index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.sumScaled} onChange={(e) => handleIndexChange(index, 'sumScaled', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.composite} onChange={(e) => handleIndexChange(index, 'composite', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.percentile} onChange={(e) => handleIndexChange(index, 'percentile', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.confidence} onChange={(e) => handleIndexChange(index, 'confidence', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Sub-test Scaled Score Profile */}
              <div className="mb-2">
                <input type="text" value={formData.subtestProfileHeader} onChange={(e) => handleChange('subtestProfileHeader', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '10pt' }} />
              </div>
              
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="border border-black px-1 py-1 text-center font-bold text-xs" style={{ fontSize: '7pt' }}>VCI Subtests</th>
                    <th className="border border-black px-1 py-1 text-center font-bold text-xs" style={{ fontSize: '7pt' }}>Scaled Score</th>
                    <th className="border border-black px-1 py-1 text-center font-bold text-xs" style={{ fontSize: '7pt' }}>PRI Subtests</th>
                    <th className="border border-black px-1 py-1 text-center font-bold text-xs" style={{ fontSize: '7pt' }}>Scaled Score</th>
                    <th className="border border-black px-1 py-1 text-center font-bold text-xs" style={{ fontSize: '7pt' }}>WMI Subtests</th>
                    <th className="border border-black px-1 py-1 text-center font-bold text-xs" style={{ fontSize: '7pt' }}>Scaled Score</th>
                    <th className="border border-black px-1 py-1 text-center font-bold text-xs" style={{ fontSize: '7pt' }}>PSI Subtests</th>
                    <th className="border border-black px-1 py-1 text-center font-bold text-xs" style={{ fontSize: '7pt' }}>Scaled Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2].map(row => (
                    <tr key={row}>
                      <td className="border border-black px-1 py-1 text-xs">
                        <input type="text" value={formData.vciSubtests[row]?.name || ''} onChange={(e) => handleSubtestChange('vciSubtests', row, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-1 py-1 text-center text-xs">
                        <input type="text" value={formData.vciSubtests[row]?.score || ''} onChange={(e) => handleSubtestChange('vciSubtests', row, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-1 py-1 text-xs">
                        <input type="text" value={formData.priSubtests[row]?.name || ''} onChange={(e) => handleSubtestChange('priSubtests', row, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-1 py-1 text-center text-xs">
                        <input type="text" value={formData.priSubtests[row]?.score || ''} onChange={(e) => handleSubtestChange('priSubtests', row, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-1 py-1 text-xs">
                        <input type="text" value={formData.wmiSubtests[row]?.name || ''} onChange={(e) => handleSubtestChange('wmiSubtests', row, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-1 py-1 text-center text-xs">
                        <input type="text" value={formData.wmiSubtests[row]?.score || ''} onChange={(e) => handleSubtestChange('wmiSubtests', row, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-1 py-1 text-xs">
                        <input type="text" value={formData.psiSubtests[row]?.name || ''} onChange={(e) => handleSubtestChange('psiSubtests', row, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-1 py-1 text-center text-xs">
                        <input type="text" value={formData.psiSubtests[row]?.score || ''} onChange={(e) => handleSubtestChange('psiSubtests', row, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Discrepancy Comparison Table */}
              <div className="mb-2">
                <input type="text" value={formData.discrepancyHeader} onChange={(e) => handleChange('discrepancyHeader', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '10pt' }} />
              </div>
              
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.discrepancyColumns.comparison} onChange={(e) => setFormData(prev => ({ ...prev, discrepancyColumns: { ...prev.discrepancyColumns, comparison: e.target.value } }))} className="w-full bg-transparent text-white font-bold focus:outline-none text-center" style={{ fontSize: '7pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.discrepancyColumns.score1} onChange={(e) => setFormData(prev => ({ ...prev, discrepancyColumns: { ...prev.discrepancyColumns, score1: e.target.value } }))} className="w-full bg-transparent text-white font-bold focus:outline-none text-center" style={{ fontSize: '7pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.discrepancyColumns.score2} onChange={(e) => setFormData(prev => ({ ...prev, discrepancyColumns: { ...prev.discrepancyColumns, score2: e.target.value } }))} className="w-full bg-transparent text-white font-bold focus:outline-none text-center" style={{ fontSize: '7pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.discrepancyColumns.difference} onChange={(e) => setFormData(prev => ({ ...prev, discrepancyColumns: { ...prev.discrepancyColumns, difference: e.target.value } }))} className="w-full bg-transparent text-white font-bold focus:outline-none text-center" style={{ fontSize: '7pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.discrepancyColumns.criticalValue} onChange={(e) => setFormData(prev => ({ ...prev, discrepancyColumns: { ...prev.discrepancyColumns, criticalValue: e.target.value } }))} className="w-full bg-transparent text-white font-bold focus:outline-none text-center" style={{ fontSize: '7pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.discrepancyColumns.significant} onChange={(e) => setFormData(prev => ({ ...prev, discrepancyColumns: { ...prev.discrepancyColumns, significant: e.target.value } }))} className="w-full bg-transparent text-white font-bold focus:outline-none text-center" style={{ fontSize: '7pt' }} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.discrepancies.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-black px-2 py-1 text-xs">
                        <input type="text" value={item.comparison} onChange={(e) => handleDiscrepancyChange(index, 'comparison', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.score1} onChange={(e) => handleDiscrepancyChange(index, 'score1', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.score2} onChange={(e) => handleDiscrepancyChange(index, 'score2', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.difference} onChange={(e) => handleDiscrepancyChange(index, 'difference', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.critical} onChange={(e) => handleDiscrepancyChange(index, 'critical', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.significant} onChange={(e) => handleDiscrepancyChange(index, 'significant', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Interpretation */}
              <div className="mb-4">
                <span className="font-bold" style={{ fontSize: '10pt' }}>Interpretation:</span>
                <textarea value={formData.interpretation} onChange={(e) => handleChange('interpretation', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={4} />
              </div>
              
            </div> {/* End of outer box border */}
          </div>
          <div className="bg-blue-50 border-t border-blue-100 px-8 py-4"><p className="text-sm text-blue-800"><strong>Instructions:</strong> All fields are editable. Click on any text to edit. Click "Print / PDF" to generate a printable report.</p></div>
        </div>
      </div>
    </div>
  );
};

export default SimpleWISC4Template;
