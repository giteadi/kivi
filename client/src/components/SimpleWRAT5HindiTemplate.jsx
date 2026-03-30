import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

const SimpleWRAT5HindiTemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "WRAT-5 – WIDE RANGE ACHIEVEMENT TEST (HINDI)",
    
    description: "The WRAT-5 Hindi is a norm-referenced test that measures Hindi reading, spelling, and math skills. It provides a quick and psychometrically sound assessment of fundamental academic skills in Hindi language.",
    
    // Standard Score Table
    scoreRanges: [
      { range: ">130", descriptor: "Very Superior", percentile: ">98" },
      { range: "120-129", descriptor: "Superior", percentile: "91-98" },
      { range: "110-119", descriptor: "High Average", percentile: "75-90" },
      { range: "90-109", descriptor: "Average", percentile: "25-74" },
      { range: "80-89", descriptor: "Low Average", percentile: "9-24" },
      { range: "70-79", descriptor: "Poor", percentile: "3-8" },
      { range: "<70", descriptor: "Very Poor", percentile: "<3" }
    ],
    
    // Word Reading Hindi
    wordReading: { name: "Word Reading (Hindi)", score: "", raw: "", percentile: "", descriptor: "" },
    wordReadingSubtests: [
      { name: "Letter Reading (हिंदी वर्ण)", raw: "", score: "", descriptor: "" },
      { name: "Word Reading (शब्द पढ़ना)", raw: "", score: "", descriptor: "" }
    ],
    
    // Sentence Comprehension Hindi
    sentenceComp: { name: "Sentence Comprehension (Hindi)", score: "", raw: "", percentile: "", descriptor: "" },
    sentenceCompSubtests: [
      { name: "Sentence Comprehension (वाक्य समझ)", raw: "", score: "", descriptor: "" }
    ],
    
    // Reading Composite Hindi
    readingComposite: { name: "Reading Composite (Hindi)", score: "", percentile: "", descriptor: "" },
    
    // Spelling Hindi
    spelling: { name: "Spelling (Hindi)", score: "", raw: "", percentile: "", descriptor: "" },
    spellingSubtests: [
      { name: "Spelling (हिंदी वर्तनी)", raw: "", score: "", descriptor: "" }
    ],
    
    // Math Computation Hindi
    mathComp: { name: "Math Computation (Hindi)", score: "", raw: "", percentile: "", descriptor: "" },
    mathCompSubtests: [
      { name: "Math Computation (गणित)", raw: "", score: "", descriptor: "" }
    ],
    
    // Math Composite Hindi
    mathComposite: { name: "Math Composite (Hindi)", score: "", percentile: "", descriptor: "" },
    
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
          <title>WRAT-5 Hindi</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 750px; margin: 0 auto; padding: 15px; color: #000; }
            .report-box { border: 1px solid #000; padding: 15px; max-width: 750px; }
            .title { font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px; }
            .desc { font-size: 10pt; text-align: justify; margin-bottom: 15px; }
            .composite-row { background-color: #333; color: white; font-weight: bold; }
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
                <th>Percentile</th>
              </tr>
              ${formData.scoreRanges.map(r => `
                <tr>
                  <td>${r.range}</td>
                  <td>${r.descriptor}</td>
                  <td>${r.percentile}</td>
                </tr>
              `).join('')}
            </table>
            
            <!-- Main Scores Table -->
            <table>
              <tr>
                <th>Subtest/Composite</th>
                <th>Raw Score</th>
                <th>Standard Score</th>
                <th>Percentile</th>
                <th>Descriptor</th>
              </tr>
              
              <!-- Word Reading Hindi -->
              <tr class="cluster-row">
                <td>${formData.wordReading.name}</td>
                <td>${formData.wordReading.raw}</td>
                <td>${formData.wordReading.score}</td>
                <td>${formData.wordReading.percentile}</td>
                <td>${formData.wordReading.descriptor}</td>
              </tr>
              ${formData.wordReadingSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.raw}</td>
                  <td>${s.score}</td>
                  <td></td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Sentence Comprehension Hindi -->
              <tr class="cluster-row">
                <td>${formData.sentenceComp.name}</td>
                <td>${formData.sentenceComp.raw}</td>
                <td>${formData.sentenceComp.score}</td>
                <td>${formData.sentenceComp.percentile}</td>
                <td>${formData.sentenceComp.descriptor}</td>
              </tr>
              ${formData.sentenceCompSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.raw}</td>
                  <td>${s.score}</td>
                  <td></td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Reading Composite Hindi -->
              <tr class="composite-row">
                <td>${formData.readingComposite.name}</td>
                <td></td>
                <td>${formData.readingComposite.score}</td>
                <td>${formData.readingComposite.percentile}</td>
                <td>${formData.readingComposite.descriptor}</td>
              </tr>
              
              <!-- Spelling Hindi -->
              <tr class="cluster-row">
                <td>${formData.spelling.name}</td>
                <td>${formData.spelling.raw}</td>
                <td>${formData.spelling.score}</td>
                <td>${formData.spelling.percentile}</td>
                <td>${formData.spelling.descriptor}</td>
              </tr>
              ${formData.spellingSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.raw}</td>
                  <td>${s.score}</td>
                  <td></td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Math Computation Hindi -->
              <tr class="cluster-row">
                <td>${formData.mathComp.name}</td>
                <td>${formData.mathComp.raw}</td>
                <td>${formData.mathComp.score}</td>
                <td>${formData.mathComp.percentile}</td>
                <td>${formData.mathComp.descriptor}</td>
              </tr>
              ${formData.mathCompSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.raw}</td>
                  <td>${s.score}</td>
                  <td></td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Math Composite Hindi -->
              <tr class="composite-row">
                <td>${formData.mathComposite.name}</td>
                <td></td>
                <td>${formData.mathComposite.score}</td>
                <td>${formData.mathComposite.percentile}</td>
                <td>${formData.mathComposite.descriptor}</td>
              </tr>
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
            <h1 className="text-xl font-semibold text-gray-800">WRAT-5 Hindi</h1>
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
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Percentile</th>
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
              
              {/* Main Scores Table */}
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="border border-black px-2 py-1 text-left font-bold text-xs" style={{ width: '35%' }}>Subtest/Composite</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Raw Score</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Standard Score</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Percentile</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Descriptor</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Word Reading Hindi */}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.wordReading.name} onChange={(e) => handleClusterChange('wordReading', 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.wordReading.raw} onChange={(e) => handleClusterChange('wordReading', 'raw', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.wordReading.score} onChange={(e) => handleClusterChange('wordReading', 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.wordReading.percentile} onChange={(e) => handleClusterChange('wordReading', 'percentile', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.wordReading.descriptor} onChange={(e) => handleClusterChange('wordReading', 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
                  {formData.wordReadingSubtests.map((item, index) => (
                    <tr key={`wr-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs" style={{ paddingLeft: '20px' }}>
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('wordReadingSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.raw} onChange={(e) => handleSubtestChange('wordReadingSubtests', index, 'raw', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.score} onChange={(e) => handleSubtestChange('wordReadingSubtests', index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs"></td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.descriptor} onChange={(e) => handleSubtestChange('wordReadingSubtests', index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                  
                  {/* Sentence Comprehension Hindi */}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.sentenceComp.name} onChange={(e) => handleClusterChange('sentenceComp', 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.sentenceComp.raw} onChange={(e) => handleClusterChange('sentenceComp', 'raw', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.sentenceComp.score} onChange={(e) => handleClusterChange('sentenceComp', 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.sentenceComp.percentile} onChange={(e) => handleClusterChange('sentenceComp', 'percentile', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.sentenceComp.descriptor} onChange={(e) => handleClusterChange('sentenceComp', 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
                  {formData.sentenceCompSubtests.map((item, index) => (
                    <tr key={`sc-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs" style={{ paddingLeft: '20px' }}>
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('sentenceCompSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.raw} onChange={(e) => handleSubtestChange('sentenceCompSubtests', index, 'raw', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.score} onChange={(e) => handleSubtestChange('sentenceCompSubtests', index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs"></td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.descriptor} onChange={(e) => handleSubtestChange('sentenceCompSubtests', index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                  
                  {/* Reading Composite Hindi */}
                  <tr className="bg-gray-800 text-white font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.readingComposite.name} onChange={(e) => handleClusterChange('readingComposite', 'name', e.target.value)} className="w-full bg-transparent text-white focus:outline-none focus:bg-gray-700 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs"></td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.readingComposite.score} onChange={(e) => handleClusterChange('readingComposite', 'score', e.target.value)} className="w-full text-center bg-transparent text-white focus:outline-none focus:bg-gray-700 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.readingComposite.percentile} onChange={(e) => handleClusterChange('readingComposite', 'percentile', e.target.value)} className="w-full text-center bg-transparent text-white focus:outline-none focus:bg-gray-700 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.readingComposite.descriptor} onChange={(e) => handleClusterChange('readingComposite', 'descriptor', e.target.value)} className="w-full text-center bg-transparent text-white focus:outline-none focus:bg-gray-700 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
                  
                  {/* Spelling Hindi */}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.spelling.name} onChange={(e) => handleClusterChange('spelling', 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.spelling.raw} onChange={(e) => handleClusterChange('spelling', 'raw', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.spelling.score} onChange={(e) => handleClusterChange('spelling', 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.spelling.percentile} onChange={(e) => handleClusterChange('spelling', 'percentile', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.spelling.descriptor} onChange={(e) => handleClusterChange('spelling', 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
                  {formData.spellingSubtests.map((item, index) => (
                    <tr key={`sp-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs" style={{ paddingLeft: '20px' }}>
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('spellingSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.raw} onChange={(e) => handleSubtestChange('spellingSubtests', index, 'raw', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.score} onChange={(e) => handleSubtestChange('spellingSubtests', index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs"></td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.descriptor} onChange={(e) => handleSubtestChange('spellingSubtests', index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                  
                  {/* Math Computation Hindi */}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.mathComp.name} onChange={(e) => handleClusterChange('mathComp', 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.mathComp.raw} onChange={(e) => handleClusterChange('mathComp', 'raw', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.mathComp.score} onChange={(e) => handleClusterChange('mathComp', 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.mathComp.percentile} onChange={(e) => handleClusterChange('mathComp', 'percentile', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.mathComp.descriptor} onChange={(e) => handleClusterChange('mathComp', 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
                  {formData.mathCompSubtests.map((item, index) => (
                    <tr key={`mc-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs" style={{ paddingLeft: '20px' }}>
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('mathCompSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.raw} onChange={(e) => handleSubtestChange('mathCompSubtests', index, 'raw', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.score} onChange={(e) => handleSubtestChange('mathCompSubtests', index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs"></td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.descriptor} onChange={(e) => handleSubtestChange('mathCompSubtests', index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
                      </td>
                    </tr>
                  ))}
                  
                  {/* Math Composite Hindi */}
                  <tr className="bg-gray-800 text-white font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.mathComposite.name} onChange={(e) => handleClusterChange('mathComposite', 'name', e.target.value)} className="w-full bg-transparent text-white focus:outline-none focus:bg-gray-700 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs"></td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.mathComposite.score} onChange={(e) => handleClusterChange('mathComposite', 'score', e.target.value)} className="w-full text-center bg-transparent text-white focus:outline-none focus:bg-gray-700 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.mathComposite.percentile} onChange={(e) => handleClusterChange('mathComposite', 'percentile', e.target.value)} className="w-full text-center bg-transparent text-white focus:outline-none focus:bg-gray-700 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.mathComposite.descriptor} onChange={(e) => handleClusterChange('mathComposite', 'descriptor', e.target.value)} className="w-full text-center bg-transparent text-white focus:outline-none focus:bg-gray-700 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
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

export default SimpleWRAT5HindiTemplate;
