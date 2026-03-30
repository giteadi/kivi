import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

const SimpleWJIVCogStdTemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "WJ-IV COG – STANDARD BATTERY",
    
    description: "The Woodcock-Johnson IV Tests of Cognitive Abilities (WJ-IV COG) is an individually administered battery of tests that assess cognitive abilities and processes. The Standard Battery provides a comprehensive assessment of general intellectual ability (g), broad and narrow cognitive abilities, and executive functions.",
    
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
    
    // General Intellectual Ability
    gia: { name: "General Intellectual Ability (GIA)", score: "", rpi: "", descriptor: "" },
    
    // Comprehension-Knowledge (Gc)
    gcCluster: { name: "Comprehension-Knowledge (Gc)", score: "", rpi: "", descriptor: "" },
    gcSubtests: [
      { name: "Oral Vocabulary", score: "", rpi: "", descriptor: "" },
      { name: "General Information", score: "", rpi: "", descriptor: "" }
    ],
    
    // Fluid Reasoning (Gf)
    gfCluster: { name: "Fluid Reasoning (Gf)", score: "", rpi: "", descriptor: "" },
    gfSubtests: [
      { name: "Number Series", score: "", rpi: "", descriptor: "" },
      { name: "Concept Formation", score: "", rpi: "", descriptor: "" }
    ],
    
    // Short-Term Working Memory (Gwm)
    gwmCluster: { name: "Short-Term Working Memory (Gwm)", score: "", rpi: "", descriptor: "" },
    gwmSubtests: [
      { name: "Verbal Attention", score: "", rpi: "", descriptor: "" },
      { name: "Numbers Reversed", score: "", rpi: "", descriptor: "" }
    ],
    
    // Cognitive Processing Speed (Gs)
    gsCluster: { name: "Cognitive Processing Speed (Gs)", score: "", rpi: "", descriptor: "" },
    gsSubtests: [
      { name: "Letter-Pattern Matching", score: "", rpi: "", descriptor: "" },
      { name: "Phonological Processing", score: "", rpi: "", descriptor: "" }
    ],
    
    // Auditory Processing (Ga)
    gaCluster: { name: "Auditory Processing (Ga)", score: "", rpi: "", descriptor: "" },
    gaSubtests: [
      { name: "Nonword Repetition", score: "", rpi: "", descriptor: "" },
      { name: "Sound Blending", score: "", rpi: "", descriptor: "" }
    ],
    
    // Long-Term Retrieval (Glr)
    glrCluster: { name: "Long-Term Retrieval (Glr)", score: "", rpi: "", descriptor: "" },
    glrSubtests: [
      { name: "Visual-Auditory Learning", score: "", rpi: "", descriptor: "" },
      { name: "Picture Recognition", score: "", rpi: "", descriptor: "" }
    ],
    
    // Visual Processing (Gv)
    gvCluster: { name: "Visual Processing (Gv)", score: "", rpi: "", descriptor: "" },
    gvSubtests: [
      { name: "Visualization", score: "", rpi: "", descriptor: "" },
      { name: "Spatial Relations", score: "", rpi: "", descriptor: "" }
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
          <title>WJ-IV COG</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 750px; margin: 0 auto; padding: 15px; color: #000; }
            .report-box { border: 1px solid #000; padding: 15px; max-width: 750px; }
            .title { font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px; }
            .desc { font-size: 10pt; text-align: justify; margin-bottom: 15px; }
            .gia-row { background-color: #333; color: white; font-weight: bold; }
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
            
            <!-- Clusters Table -->
            <table>
              <tr>
                <th>Cluster/Subtest</th>
                <th>Standard Score</th>
                <th>RPI</th>
                <th>Descriptor</th>
              </tr>
              
              <!-- GIA -->
              <tr class="gia-row">
                <td>${formData.gia.name}</td>
                <td>${formData.gia.score}</td>
                <td>${formData.gia.rpi}</td>
                <td>${formData.gia.descriptor}</td>
              </tr>
              
              <!-- Gc -->
              <tr class="cluster-row">
                <td>${formData.gcCluster.name}</td>
                <td>${formData.gcCluster.score}</td>
                <td>${formData.gcCluster.rpi}</td>
                <td>${formData.gcCluster.descriptor}</td>
              </tr>
              ${formData.gcSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.score}</td>
                  <td>${s.rpi}</td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Gf -->
              <tr class="cluster-row">
                <td>${formData.gfCluster.name}</td>
                <td>${formData.gfCluster.score}</td>
                <td>${formData.gfCluster.rpi}</td>
                <td>${formData.gfCluster.descriptor}</td>
              </tr>
              ${formData.gfSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.score}</td>
                  <td>${s.rpi}</td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Gwm -->
              <tr class="cluster-row">
                <td>${formData.gwmCluster.name}</td>
                <td>${formData.gwmCluster.score}</td>
                <td>${formData.gwmCluster.rpi}</td>
                <td>${formData.gwmCluster.descriptor}</td>
              </tr>
              ${formData.gwmSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.score}</td>
                  <td>${s.rpi}</td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Gs -->
              <tr class="cluster-row">
                <td>${formData.gsCluster.name}</td>
                <td>${formData.gsCluster.score}</td>
                <td>${formData.gsCluster.rpi}</td>
                <td>${formData.gsCluster.descriptor}</td>
              </tr>
              ${formData.gsSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.score}</td>
                  <td>${s.rpi}</td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Ga -->
              <tr class="cluster-row">
                <td>${formData.gaCluster.name}</td>
                <td>${formData.gaCluster.score}</td>
                <td>${formData.gaCluster.rpi}</td>
                <td>${formData.gaCluster.descriptor}</td>
              </tr>
              ${formData.gaSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.score}</td>
                  <td>${s.rpi}</td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Glr -->
              <tr class="cluster-row">
                <td>${formData.glrCluster.name}</td>
                <td>${formData.glrCluster.score}</td>
                <td>${formData.glrCluster.rpi}</td>
                <td>${formData.glrCluster.descriptor}</td>
              </tr>
              ${formData.glrSubtests.map(s => `
                <tr class="subtest-row">
                  <td>${s.name}</td>
                  <td>${s.score}</td>
                  <td>${s.rpi}</td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
              
              <!-- Gv -->
              <tr class="cluster-row">
                <td>${formData.gvCluster.name}</td>
                <td>${formData.gvCluster.score}</td>
                <td>${formData.gvCluster.rpi}</td>
                <td>${formData.gvCluster.descriptor}</td>
              </tr>
              ${formData.gvSubtests.map(s => `
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

  // Helper function to render cluster section
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
            <h1 className="text-xl font-semibold text-gray-800">WJ-IV COG</h1>
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
                      <input type="text" value="Cluster/Subtest" className="w-full bg-transparent font-bold focus:outline-none" style={{ fontSize: '8pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value="Standard Score" className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '8pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value="RPI" className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '8pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value="Descriptor" className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '8pt' }} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* GIA Row - Special Black Background */}
                  <tr className="bg-gray-800 text-white font-bold">
                    <td className="border border-black px-2 py-1 text-xs">
                      <input type="text" value={formData.gia.name} onChange={(e) => handleClusterChange('gia', 'name', e.target.value)} className="w-full bg-transparent text-white focus:outline-none focus:bg-gray-700 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.gia.score} onChange={(e) => handleClusterChange('gia', 'score', e.target.value)} className="w-full text-center bg-transparent text-white focus:outline-none focus:bg-gray-700 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.gia.rpi} onChange={(e) => handleClusterChange('gia', 'rpi', e.target.value)} className="w-full text-center bg-transparent text-white focus:outline-none focus:bg-gray-700 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs">
                      <input type="text" value={formData.gia.descriptor} onChange={(e) => handleClusterChange('gia', 'descriptor', e.target.value)} className="w-full text-center bg-transparent text-white focus:outline-none focus:bg-gray-700 font-bold" style={{ fontSize: '8pt' }} />
                    </td>
                  </tr>
                  
                  {/* Clusters with subtests */}
                  {renderClusterSection('gcCluster', 'gcSubtests')}
                  {renderClusterSection('gfCluster', 'gfSubtests')}
                  {renderClusterSection('gwmCluster', 'gwmSubtests')}
                  {renderClusterSection('gsCluster', 'gsSubtests')}
                  {renderClusterSection('gaCluster', 'gaSubtests')}
                  {renderClusterSection('glrCluster', 'glrSubtests')}
                  {renderClusterSection('gvCluster', 'gvSubtests')}
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

export default SimpleWJIVCogStdTemplate;
