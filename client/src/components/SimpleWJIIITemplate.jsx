import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

const SimpleWJIIITemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "WJ-III – TESTS OF ACHIEVEMENT FORM C/ BRIEF BATTERY",
    
    description: "The Woodcock-Johnson III Tests of Achievement (WJ-III, ACH) contains a set of norm-referenced tests that are administered individually. It is used to measure academic achievement. It is made up of 13 clusters, to help identify performance levels, determines educational progress, and identifies individual strengths and weaknesses.",
    
    // Standard Score Table
    scoreTableHeader: "Standard Score Descriptor Percentile Rank",
    scoreRanges: [
      { range: ">130", descriptor: "Very Superior", percentile: ">97th" },
      { range: "121-130", descriptor: "Superior", percentile: "91st-97th" },
      { range: "111-120", descriptor: "High Average", percentile: "75th-91st" },
      { range: "90-110", descriptor: "Average", percentile: "25th-75th" },
      { range: "80-89", descriptor: "Low Average", percentile: "9th-23rd" },
      { range: "70-79", descriptor: "Poor", percentile: "2nd-8th" },
      { range: "<69", descriptor: "Very Poor", percentile: "<2nd" }
    ],
    
    // Main Table Headers
    clusterHeader: "Cluster/Subtest",
    standardScoreHeader: "Standard\nScore",
    rpiHeader: "Relative\nProficiency\nIndex",
    descriptorHeader: "Descriptor",
    
    // Brief Reading
    briefReading: { name: "Brief Reading", score: "99", rpi: "88", descriptor: "Average" },
    briefReadingSubtests: [
      { name: "Letter-Word Identification", score: "102", rpi: "94", descriptor: "Average" },
      { name: "Passage Comprehension", score: "94", rpi: "77", descriptor: "Average" }
    ],
    
    // Broad Reading
    broadReading: { name: "Broad Reading", score: "100", rpi: "89", descriptor: "Average" },
    broadReadingSubtests: [
      { name: "Letter-Word Identification", score: "102", rpi: "94", descriptor: "Average" },
      { name: "Passage Comprehension", score: "94", rpi: "77", descriptor: "Average" },
      { name: "Reading Fluency", score: "103", rpi: "92", descriptor: "Average" }
    ],
    
    // Brief Mathematics
    briefMath: { name: "Brief Mathematics", score: "119", rpi: "98", descriptor: "High Average" },
    briefMathSubtests: [
      { name: "Applied Problems", score: "116", rpi: "97", descriptor: "High Average" },
      { name: "Calculation", score: "114", rpi: "97", descriptor: "High Average" }
    ],
    
    // Broad Mathematics
    broadMath: { name: "Broad Mathematics", score: "117", rpi: "97", descriptor: "High Average" },
    broadMathSubtests: [
      { name: "Applied Problems", score: "116", rpi: "97", descriptor: "High Average" },
      { name: "Calculation", score: "114", rpi: "97", descriptor: "High Average" },
      { name: "Math Fluency", score: "103", rpi: "91", descriptor: "Average" }
    ],
    
    // Math Calculation Skills
    mathCalcSkills: { name: "Math Calculation Skills", score: "112", rpi: "95", descriptor: "High Average" },
    mathCalcSubtests: [
      { name: "Calculation", score: "114", rpi: "97", descriptor: "High Average" },
      { name: "Math Fluency", score: "103", rpi: "91", descriptor: "Average" }
    ],
    
    // Brief Writing
    briefWriting: { name: "Brief Writing", score: "89", rpi: "60", descriptor: "Low Average" },
    briefWritingSubtests: [
      { name: "Spelling", score: "84", rpi: "31", descriptor: "Low Average" },
      { name: "Writing Samples", score: "97", rpi: "84", descriptor: "Average" }
    ],
    
    // Broad Written Language
    broadWriting: { name: "Broad Written Language", score: "97", rpi: "88", descriptor: "Average" },
    broadWritingSubtests: [
      { name: "Spelling", score: "84", rpi: "31", descriptor: "Low Average" },
      { name: "Writing Samples", score: "97", rpi: "84", descriptor: "Average" },
      { name: "Writing Fluency", score: "98", rpi: "88", descriptor: "Average" }
    ],
    
    // Written Expression
    writtenExpression: { name: "Written Expression", score: "97", rpi: "86", descriptor: "Average" },
    writtenExprSubtests: [
      { name: "Writing Samples", score: "97", rpi: "84", descriptor: "Average" },
      { name: "Writing Fluency", score: "98", rpi: "88", descriptor: "Average" }
    ],
    
    interpretation: ""
  });

  const printRef = useRef();

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleClusterChange = (cluster, field, value) => {
    setFormData(prev => ({ ...prev, [cluster]: { ...prev[cluster], [field]: value } }));
  };
  
  const handleSubtestChange = (section, index, field, value) => {
    const newSection = [...formData[section]];
    newSection[index] = { ...newSection[index], [field]: value };
    setFormData(prev => ({ ...prev, [section]: newSection }));
  };
  
  const handleScoreRangeChange = (index, field, value) => {
    const newRanges = [...formData.scoreRanges];
    newRanges[index] = { ...newRanges[index], [field]: value };
    setFormData(prev => ({ ...prev, scoreRanges: newRanges }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>WJ-III</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 750px; margin: 0 auto; padding: 15px; color: #000; }
            .report-box { border: 1px solid #000; padding: 15px; max-width: 750px; }
            .title { font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px; }
            .desc { font-size: 10pt; text-align: justify; margin-bottom: 15px; }
            .section-header { font-size: 10pt; font-weight: bold; text-align: left; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 8pt; }
            th, td { border: 1px solid #000; padding: 3px 5px; text-align: center; }
            th { font-weight: bold; background-color: #e8e8e8; }
            td:first-child { text-align: left; }
            .cluster-row { background-color: #d3d3d3; font-weight: bold; }
            .subtest-row { font-weight: normal; }
            .subtest-row td:first-child { padding-left: 15px; }
            .score-table th { background-color: #e8e8e8; }
            .interpretation { margin-top: 15px; text-align: justify; font-size: 10pt; }
          </style>
        </head>
        <body>
          <div class="report-box">
            <div class="title">${formData.title}</div>
            <div class="desc">${formData.description}</div>
            
            <!-- Standard Score Table -->
            <table class="score-table">
              <tr>
                <th>Standard Score</th>
                <th>Descriptor</th>
                <th>Percentile Rank</th>
              </tr>
              ${formData.scoreRanges.map(r => `
                <tr>
                  <td>${r.range}</td>
                  <td>${r.descriptor}</td>
                  <td>${r.percentile}</td>
                </tr>
              `).join('')}
            </table>
            
            <!-- Main Clusters Table -->
            <table>
              <tr>
                <th>${formData.clusterHeader}</th>
                <th>${formData.standardScoreHeader.replace(/\n/g, '<br/>')}</th>
                <th>${formData.rpiHeader.replace(/\n/g, '<br/>')}</th>
                <th>${formData.descriptorHeader}</th>
              </tr>
              
              <!-- Brief Reading -->
              <tr class="cluster-row">
                <td>${formData.briefReading.name}</td>
                <td>${formData.briefReading.score}</td>
                <td>${formData.briefReading.rpi}</td>
                <td>${formData.briefReading.descriptor}</td>
              </tr>
              ${formData.briefReadingSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.score}</td>
                  <td>${s.rpi}</td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Broad Reading -->
              <tr class="cluster-row">
                <td>${formData.broadReading.name}</td>
                <td>${formData.broadReading.score}</td>
                <td>${formData.broadReading.rpi}</td>
                <td>${formData.broadReading.descriptor}</td>
              </tr>
              ${formData.broadReadingSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.score}</td>
                  <td>${s.rpi}</td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Brief Mathematics -->
              <tr class="cluster-row">
                <td>${formData.briefMath.name}</td>
                <td>${formData.briefMath.score}</td>
                <td>${formData.briefMath.rpi}</td>
                <td>${formData.briefMath.descriptor}</td>
              </tr>
              ${formData.briefMathSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.score}</td>
                  <td>${s.rpi}</td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Broad Mathematics -->
              <tr class="cluster-row">
                <td>${formData.broadMath.name}</td>
                <td>${formData.broadMath.score}</td>
                <td>${formData.broadMath.rpi}</td>
                <td>${formData.broadMath.descriptor}</td>
              </tr>
              ${formData.broadMathSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.score}</td>
                  <td>${s.rpi}</td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Math Calculation Skills -->
              <tr class="cluster-row">
                <td>${formData.mathCalcSkills.name}</td>
                <td>${formData.mathCalcSkills.score}</td>
                <td>${formData.mathCalcSkills.rpi}</td>
                <td>${formData.mathCalcSkills.descriptor}</td>
              </tr>
              ${formData.mathCalcSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.score}</td>
                  <td>${s.rpi}</td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Brief Writing -->
              <tr class="cluster-row">
                <td>${formData.briefWriting.name}</td>
                <td>${formData.briefWriting.score}</td>
                <td>${formData.briefWriting.rpi}</td>
                <td>${formData.briefWriting.descriptor}</td>
              </tr>
              ${formData.briefWritingSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.score}</td>
                  <td>${s.rpi}</td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Broad Written Language -->
              <tr class="cluster-row">
                <td>${formData.broadWriting.name}</td>
                <td>${formData.broadWriting.score}</td>
                <td>${formData.broadWriting.rpi}</td>
                <td>${formData.broadWriting.descriptor}</td>
              </tr>
              ${formData.broadWritingSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.score}</td>
                  <td>${s.rpi}</td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Written Expression -->
              <tr class="cluster-row">
                <td>${formData.writtenExpression.name}</td>
                <td>${formData.writtenExpression.score}</td>
                <td>${formData.writtenExpression.rpi}</td>
                <td>${formData.writtenExpression.descriptor}</td>
              </tr>
              ${formData.writtenExprSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.score}</td>
                  <td>${s.rpi}</td>
                  <td>${s.descriptor}</td>
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
            <h1 className="text-xl font-semibold text-gray-800">WJ-III</h1>
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
                <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={4} />
              </div>
              
              {/* Standard Score Table */}
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Standard Score</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Descriptor</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Percentile Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.scoreRanges.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.range} onChange={(e) => handleScoreRangeChange(index, 'range', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.descriptor} onChange={(e) => handleScoreRangeChange(index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.percentile} onChange={(e) => handleScoreRangeChange(index, 'percentile', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Main Clusters Table */}
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="border border-black px-2 py-1 text-left font-bold text-xs" style={{ width: '40%' }}>
                      <input type="text" value={formData.clusterHeader} onChange={(e) => handleChange('clusterHeader', e.target.value)} className="w-full bg-transparent font-bold focus:outline-none" style={{ fontSize: '8pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.standardScoreHeader} onChange={(e) => handleChange('standardScoreHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '7pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.rpiHeader} onChange={(e) => handleChange('rpiHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '7pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.descriptorHeader} onChange={(e) => handleChange('descriptorHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '8pt' }} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Brief Reading */}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.briefReading.name} onChange={(e) => handleClusterChange('briefReading', 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.briefReading.score} onChange={(e) => handleClusterChange('briefReading', 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.briefReading.rpi} onChange={(e) => handleClusterChange('briefReading', 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.briefReading.descriptor} onChange={(e) => handleClusterChange('briefReading', 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
                  {formData.briefReadingSubtests.map((item, index) => (
                    <tr key={`br-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs" style={{ paddingLeft: '20px' }}>
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('briefReadingSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.score} onChange={(e) => handleSubtestChange('briefReadingSubtests', index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rpi} onChange={(e) => handleSubtestChange('briefReadingSubtests', index, 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.descriptor} onChange={(e) => handleSubtestChange('briefReadingSubtests', index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                  
                  {/* Broad Reading */}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.broadReading.name} onChange={(e) => handleClusterChange('broadReading', 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.broadReading.score} onChange={(e) => handleClusterChange('broadReading', 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.broadReading.rpi} onChange={(e) => handleClusterChange('broadReading', 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.broadReading.descriptor} onChange={(e) => handleClusterChange('broadReading', 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
                  {formData.broadReadingSubtests.map((item, index) => (
                    <tr key={`brd-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs" style={{ paddingLeft: '20px' }}>
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('broadReadingSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.score} onChange={(e) => handleSubtestChange('broadReadingSubtests', index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rpi} onChange={(e) => handleSubtestChange('broadReadingSubtests', index, 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.descriptor} onChange={(e) => handleSubtestChange('broadReadingSubtests', index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                  
                  {/* Brief Mathematics */}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.briefMath.name} onChange={(e) => handleClusterChange('briefMath', 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.briefMath.score} onChange={(e) => handleClusterChange('briefMath', 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.briefMath.rpi} onChange={(e) => handleClusterChange('briefMath', 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.briefMath.descriptor} onChange={(e) => handleClusterChange('briefMath', 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
                  {formData.briefMathSubtests.map((item, index) => (
                    <tr key={`bm-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs" style={{ paddingLeft: '20px' }}>
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('briefMathSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.score} onChange={(e) => handleSubtestChange('briefMathSubtests', index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rpi} onChange={(e) => handleSubtestChange('briefMathSubtests', index, 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.descriptor} onChange={(e) => handleSubtestChange('briefMathSubtests', index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                  
                  {/* Broad Mathematics */}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.broadMath.name} onChange={(e) => handleClusterChange('broadMath', 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.broadMath.score} onChange={(e) => handleClusterChange('broadMath', 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.broadMath.rpi} onChange={(e) => handleClusterChange('broadMath', 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.broadMath.descriptor} onChange={(e) => handleClusterChange('broadMath', 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
                  {formData.broadMathSubtests.map((item, index) => (
                    <tr key={`bmd-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs" style={{ paddingLeft: '20px' }}>
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('broadMathSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.score} onChange={(e) => handleSubtestChange('broadMathSubtests', index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rpi} onChange={(e) => handleSubtestChange('broadMathSubtests', index, 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.descriptor} onChange={(e) => handleSubtestChange('broadMathSubtests', index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                  
                  {/* Math Calculation Skills */}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.mathCalcSkills.name} onChange={(e) => handleClusterChange('mathCalcSkills', 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.mathCalcSkills.score} onChange={(e) => handleClusterChange('mathCalcSkills', 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.mathCalcSkills.rpi} onChange={(e) => handleClusterChange('mathCalcSkills', 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.mathCalcSkills.descriptor} onChange={(e) => handleClusterChange('mathCalcSkills', 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
                  {formData.mathCalcSubtests.map((item, index) => (
                    <tr key={`mcs-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs" style={{ paddingLeft: '20px' }}>
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('mathCalcSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.score} onChange={(e) => handleSubtestChange('mathCalcSubtests', index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rpi} onChange={(e) => handleSubtestChange('mathCalcSubtests', index, 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.descriptor} onChange={(e) => handleSubtestChange('mathCalcSubtests', index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                  
                  {/* Brief Writing */}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.briefWriting.name} onChange={(e) => handleClusterChange('briefWriting', 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.briefWriting.score} onChange={(e) => handleClusterChange('briefWriting', 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.briefWriting.rpi} onChange={(e) => handleClusterChange('briefWriting', 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.briefWriting.descriptor} onChange={(e) => handleClusterChange('briefWriting', 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
                  {formData.briefWritingSubtests.map((item, index) => (
                    <tr key={`bw-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs" style={{ paddingLeft: '20px' }}>
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('briefWritingSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.score} onChange={(e) => handleSubtestChange('briefWritingSubtests', index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rpi} onChange={(e) => handleSubtestChange('briefWritingSubtests', index, 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.descriptor} onChange={(e) => handleSubtestChange('briefWritingSubtests', index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                  
                  {/* Broad Written Language */}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.broadWriting.name} onChange={(e) => handleClusterChange('broadWriting', 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.broadWriting.score} onChange={(e) => handleClusterChange('broadWriting', 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.broadWriting.rpi} onChange={(e) => handleClusterChange('broadWriting', 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.broadWriting.descriptor} onChange={(e) => handleClusterChange('broadWriting', 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
                  {formData.broadWritingSubtests.map((item, index) => (
                    <tr key={`bwl-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs" style={{ paddingLeft: '20px' }}>
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('broadWritingSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.score} onChange={(e) => handleSubtestChange('broadWritingSubtests', index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rpi} onChange={(e) => handleSubtestChange('broadWritingSubtests', index, 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.descriptor} onChange={(e) => handleSubtestChange('broadWritingSubtests', index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                  
                  {/* Written Expression */}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.writtenExpression.name} onChange={(e) => handleClusterChange('writtenExpression', 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.writtenExpression.score} onChange={(e) => handleClusterChange('writtenExpression', 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.writtenExpression.rpi} onChange={(e) => handleClusterChange('writtenExpression', 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.writtenExpression.descriptor} onChange={(e) => handleClusterChange('writtenExpression', 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
                  {formData.writtenExprSubtests.map((item, index) => (
                    <tr key={`we-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs" style={{ paddingLeft: '20px' }}>
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('writtenExprSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.score} onChange={(e) => handleSubtestChange('writtenExprSubtests', index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rpi} onChange={(e) => handleSubtestChange('writtenExprSubtests', index, 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.descriptor} onChange={(e) => handleSubtestChange('writtenExprSubtests', index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
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

export default SimpleWJIIITemplate;
