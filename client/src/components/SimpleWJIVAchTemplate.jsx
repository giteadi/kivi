import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

const SimpleWJIVAchTemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "WJ-IV ACH – STANDARD & EXTENDED BATTERY",
    
    description: "The Woodcock-Johnson IV Tests of Achievement (WJ-IV ACH) is a comprehensive measure of academic achievement. It assesses reading, writing, mathematics, and academic skills in individuals ages 2 to 90+.",
    
    // Standard Score Table
    scoreRanges: [
      { range: ">130", descriptor: "Very Superior", percentile: ">97th" },
      { range: "121-130", descriptor: "Superior", percentile: "91st-97th" },
      { range: "111-120", descriptor: "High Average", percentile: "75th-91st" },
      { range: "90-110", descriptor: "Average", percentile: "25th-75th" },
      { range: "80-89", descriptor: "Low Average", percentile: "9th-23rd" },
      { range: "70-79", descriptor: "Poor", percentile: "2nd-8th" },
      { range: "<69", descriptor: "Very Poor", percentile: "<2nd" }
    ],
    
    // Reading Clusters
    broadReading: { name: "Broad Reading", score: "", rpi: "", descriptor: "" },
    broadReadingSubtests: [
      { name: "Letter-Word Identification", score: "", rpi: "", descriptor: "" },
      { name: "Passage Comprehension", score: "", rpi: "", descriptor: "" },
      { name: "Sentence Reading Fluency", score: "", rpi: "", descriptor: "" }
    ],
    
    basicReading: { name: "Basic Reading Skills", score: "", rpi: "", descriptor: "" },
    basicReadingSubtests: [
      { name: "Letter-Word Identification", score: "", rpi: "", descriptor: "" },
      { name: "Word Attack", score: "", rpi: "", descriptor: "" }
    ],
    
    readingComp: { name: "Reading Comprehension (Extended)", score: "", rpi: "", descriptor: "" },
    readingCompSubtests: [
      { name: "Passage Comprehension", score: "", rpi: "", descriptor: "" },
      { name: "Reading Recall (Ext)", score: "", rpi: "", descriptor: "" },
      { name: "Reading Vocabulary (Ext)", score: "", rpi: "", descriptor: "" }
    ],
    
    readingFluency: { name: "Reading Fluency", score: "", rpi: "", descriptor: "" },
    readingFluencySubtests: [
      { name: "Sentence Reading Fluency", score: "", rpi: "", descriptor: "" },
      { name: "Oral Reading (Ext)", score: "", rpi: "", descriptor: "" },
      { name: "Word Reading Fluency (Ext)", score: "", rpi: "", descriptor: "" }
    ],
    
    // Mathematics Clusters
    broadMath: { name: "Broad Mathematics", score: "", rpi: "", descriptor: "" },
    broadMathSubtests: [
      { name: "Applied Problems", score: "", rpi: "", descriptor: "" },
      { name: "Calculation", score: "", rpi: "", descriptor: "" },
      { name: "Math Facts Fluency", score: "", rpi: "", descriptor: "" }
    ],
    
    mathCalc: { name: "Math Calculation Skills", score: "", rpi: "", descriptor: "" },
    mathCalcSubtests: [
      { name: "Calculation", score: "", rpi: "", descriptor: "" },
      { name: "Math Facts Fluency", score: "", rpi: "", descriptor: "" }
    ],
    
    mathProbSolv: { name: "Math Problem Solving (Extended)", score: "", rpi: "", descriptor: "" },
    mathProbSolvSubtests: [
      { name: "Applied Problems", score: "", rpi: "", descriptor: "" },
      { name: "Number Matrices (Ext)", score: "", rpi: "", descriptor: "" },
      { name: "Analysis-Synthesis (Ext)", score: "", rpi: "", descriptor: "" }
    ],
    
    // Written Language Clusters
    broadWritten: { name: "Broad Written Language", score: "", rpi: "", descriptor: "" },
    broadWrittenSubtests: [
      { name: "Spelling", score: "", rpi: "", descriptor: "" },
      { name: "Writing Samples", score: "", rpi: "", descriptor: "" },
      { name: "Sentence Writing Fluency", score: "", rpi: "", descriptor: "" }
    ],
    
    basicWriting: { name: "Basic Writing Skills", score: "", rpi: "", descriptor: "" },
    basicWritingSubtests: [
      { name: "Spelling", score: "", rpi: "", descriptor: "" },
      { name: "Editing (Ext)", score: "", rpi: "", descriptor: "" }
    ],
    
    writtenExpr: { name: "Written Expression (Extended)", score: "", rpi: "", descriptor: "" },
    writtenExprSubtests: [
      { name: "Writing Samples", score: "", rpi: "", descriptor: "" },
      { name: "Sentence Writing Fluency", score: "", rpi: "", descriptor: "" },
      { name: "Handwriting (Ext)", score: "", rpi: "", descriptor: "" }
    ],
    
    // Academic Skills, Fluency, Applications
    academicSkills: { name: "Academic Skills", score: "", rpi: "", descriptor: "" },
    academicSkillsSubtests: [
      { name: "Letter-Word ID", score: "", rpi: "", descriptor: "" },
      { name: "Spelling", score: "", rpi: "", descriptor: "" },
      { name: "Calculation", score: "", rpi: "", descriptor: "" }
    ],
    
    academicFluency: { name: "Academic Fluency", score: "", rpi: "", descriptor: "" },
    academicFluencySubtests: [
      { name: "Sentence Reading Fluency", score: "", rpi: "", descriptor: "" },
      { name: "Math Facts Fluency", score: "", rpi: "", descriptor: "" },
      { name: "Sentence Writing Fluency", score: "", rpi: "", descriptor: "" }
    ],
    
    academicApps: { name: "Academic Applications (Extended)", score: "", rpi: "", descriptor: "" },
    academicAppsSubtests: [
      { name: "Passage Comprehension", score: "", rpi: "", descriptor: "" },
      { name: "Applied Problems", score: "", rpi: "", descriptor: "" },
      { name: "Writing Samples", score: "", rpi: "", descriptor: "" }
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
          <title>WJ-IV ACH</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 750px; margin: 0 auto; padding: 15px; color: #000; }
            .report-box { border: 1px solid #000; padding: 15px; max-width: 750px; }
            .title { font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px; }
            .desc { font-size: 10pt; text-align: justify; margin-bottom: 15px; }
            .section-header { font-size: 10pt; font-weight: bold; text-align: left; margin: 15px 0 5px 0; background-color: #e8e8e8; padding: 3px; }
            .reading-header { background-color: #e6f3ff; }
            .math-header { background-color: #fff2e6; }
            .writing-header { background-color: #f0e6ff; }
            .fluency-header { background-color: #e6ffe6; }
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
            
            <!-- READING -->
            <div class="section-header reading-header">READING CLUSTERS</div>
            
            <table>
              <tr>
                <th>Cluster/Subtest</th>
                <th>Standard Score</th>
                <th>RPI</th>
                <th>Descriptor</th>
              </tr>
              
              ${renderPrintCluster(formData.broadReading, formData.broadReadingSubtests)}
              ${renderPrintCluster(formData.basicReading, formData.basicReadingSubtests)}
              ${renderPrintCluster(formData.readingComp, formData.readingCompSubtests)}
              ${renderPrintCluster(formData.readingFluency, formData.readingFluencySubtests)}
            </table>
            
            <!-- MATHEMATICS -->
            <div class="section-header math-header">MATHEMATICS CLUSTERS</div>
            
            <table>
              <tr>
                <th>Cluster/Subtest</th>
                <th>Standard Score</th>
                <th>RPI</th>
                <th>Descriptor</th>
              </tr>
              
              ${renderPrintCluster(formData.broadMath, formData.broadMathSubtests)}
              ${renderPrintCluster(formData.mathCalc, formData.mathCalcSubtests)}
              ${renderPrintCluster(formData.mathProbSolv, formData.mathProbSolvSubtests)}
            </table>
            
            <!-- WRITTEN LANGUAGE -->
            <div class="section-header writing-header">WRITTEN LANGUAGE CLUSTERS</div>
            
            <table>
              <tr>
                <th>Cluster/Subtest</th>
                <th>Standard Score</th>
                <th>RPI</th>
                <th>Descriptor</th>
              </tr>
              
              ${renderPrintCluster(formData.broadWritten, formData.broadWrittenSubtests)}
              ${renderPrintCluster(formData.basicWriting, formData.basicWritingSubtests)}
              ${renderPrintCluster(formData.writtenExpr, formData.writtenExprSubtests)}
            </table>
            
            <!-- ACADEMIC SKILLS, FLUENCY, APPLICATIONS -->
            <div class="section-header fluency-header">ACADEMIC SKILLS, FLUENCY & APPLICATIONS</div>
            
            <table>
              <tr>
                <th>Cluster/Subtest</th>
                <th>Standard Score</th>
                <th>RPI</th>
                <th>Descriptor</th>
              </tr>
              
              ${renderPrintCluster(formData.academicSkills, formData.academicSkillsSubtests)}
              ${renderPrintCluster(formData.academicFluency, formData.academicFluencySubtests)}
              ${renderPrintCluster(formData.academicApps, formData.academicAppsSubtests)}
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

  const renderPrintCluster = (cluster, subtests) => `
    <tr class="cluster-row">
      <td>${cluster.name}</td>
      <td>${cluster.score}</td>
      <td>${cluster.rpi}</td>
      <td>${cluster.descriptor}</td>
    </tr>
    ${subtests.map(s => `
      <tr class="subtest-row">
        <td>${s.name}</td>
        <td>${s.score}</td>
        <td>${s.rpi}</td>
        <td>${s.descriptor}</td>
      </tr>
    `).join('')}
  `;

  const renderClusterSection = (clusterName, subtestsName) => (
    <>
      <tr className="bg-gray-200 font-bold">
        <td className="border border-black px-2 py-1 text-xs">
          <input type="text" value={formData[clusterName].name} onChange={(e) => handleClusterChange(clusterName, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
        </td>
        <td className="border border-black px-2 py-1 text-center text-xs">
          <input type="text" value={formData[clusterName].score} onChange={(e) => handleClusterChange(clusterName, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
        </td>
        <td className="border border-black px-2 py-1 text-center text-xs">
          <input type="text" value={formData[clusterName].rpi} onChange={(e) => handleClusterChange(clusterName, 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
        </td>
        <td className="border border-black px-2 py-1 text-center text-xs">
          <input type="text" value={formData[clusterName].descriptor} onChange={(e) => handleClusterChange(clusterName, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '8pt' }} />
        </td>
      </tr>
      {formData[subtestsName].map((item, index) => (
        <tr key={`${subtestsName}-${index}`}>
          <td className="border border-black px-2 py-1 text-xs" style={{ paddingLeft: '20px' }}>
            <input type="text" value={item.name} onChange={(e) => handleSubtestChange(subtestsName, index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
          </td>
          <td className="border border-black px-2 py-1 text-center text-xs">
            <input type="text" value={item.score} onChange={(e) => handleSubtestChange(subtestsName, index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
          </td>
          <td className="border border-black px-2 py-1 text-center text-xs">
            <input type="text" value={item.rpi} onChange={(e) => handleSubtestChange(subtestsName, index, 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
          </td>
          <td className="border border-black px-2 py-1 text-center text-xs">
            <input type="text" value={item.descriptor} onChange={(e) => handleSubtestChange(subtestsName, index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '8pt' }} />
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"><FiArrowLeft className="w-5 h-5" /><span>Back</span></button>}
            <h1 className="text-xl font-semibold text-gray-800">WJ-IV ACH</h1>
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
              
              {/* READING SECTION */}
              <div className="mb-2 px-2 py-1 font-bold" style={{ fontSize: '10pt', backgroundColor: '#e6f3ff' }}>READING CLUSTERS</div>
              
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="border border-black px-2 py-1 text-left font-bold text-xs" style={{ width: '40%' }}>Cluster/Subtest</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Standard Score</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">RPI</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Descriptor</th>
                  </tr>
                </thead>
                <tbody>
                  {renderClusterSection('broadReading', 'broadReadingSubtests')}
                  {renderClusterSection('basicReading', 'basicReadingSubtests')}
                  {renderClusterSection('readingComp', 'readingCompSubtests')}
                  {renderClusterSection('readingFluency', 'readingFluencySubtests')}
                </tbody>
              </table>
              
              {/* MATHEMATICS SECTION */}
              <div className="mb-2 px-2 py-1 font-bold" style={{ fontSize: '10pt', backgroundColor: '#fff2e6' }}>MATHEMATICS CLUSTERS</div>
              
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="border border-black px-2 py-1 text-left font-bold text-xs" style={{ width: '40%' }}>Cluster/Subtest</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Standard Score</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">RPI</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Descriptor</th>
                  </tr>
                </thead>
                <tbody>
                  {renderClusterSection('broadMath', 'broadMathSubtests')}
                  {renderClusterSection('mathCalc', 'mathCalcSubtests')}
                  {renderClusterSection('mathProbSolv', 'mathProbSolvSubtests')}
                </tbody>
              </table>
              
              {/* WRITTEN LANGUAGE SECTION */}
              <div className="mb-2 px-2 py-1 font-bold" style={{ fontSize: '10pt', backgroundColor: '#f0e6ff' }}>WRITTEN LANGUAGE CLUSTERS</div>
              
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="border border-black px-2 py-1 text-left font-bold text-xs" style={{ width: '40%' }}>Cluster/Subtest</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Standard Score</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">RPI</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Descriptor</th>
                  </tr>
                </thead>
                <tbody>
                  {renderClusterSection('broadWritten', 'broadWrittenSubtests')}
                  {renderClusterSection('basicWriting', 'basicWritingSubtests')}
                  {renderClusterSection('writtenExpr', 'writtenExprSubtests')}
                </tbody>
              </table>
              
              {/* ACADEMIC SKILLS, FLUENCY, APPLICATIONS */}
              <div className="mb-2 px-2 py-1 font-bold" style={{ fontSize: '10pt', backgroundColor: '#e6ffe6' }}>ACADEMIC SKILLS, FLUENCY & APPLICATIONS</div>
              
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="border border-black px-2 py-1 text-left font-bold text-xs" style={{ width: '40%' }}>Cluster/Subtest</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Standard Score</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">RPI</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Descriptor</th>
                  </tr>
                </thead>
                <tbody>
                  {renderClusterSection('academicSkills', 'academicSkillsSubtests')}
                  {renderClusterSection('academicFluency', 'academicFluencySubtests')}
                  {renderClusterSection('academicApps', 'academicAppsSubtests')}
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

export default SimpleWJIVAchTemplate;
