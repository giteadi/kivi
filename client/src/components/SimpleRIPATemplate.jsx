import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';

// Ross Information Processing Assessment (RIPA) Template - Matches Excel
const SimpleRIPATemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY",
    description: "The RIPA-P quantifies & describes cognitive-linguistic deficits in individuals between the ages of 5-0 and 12-11 who face difficulties in attention, memory, orientation, language and communication, problem solving and abstract reasoning. It can be used to develop and guide rehabilitation goals and objectives based on individual strengths and weaknesses.",
    
    subtestResultsHeader: "SUBTEST RESULTS",
    rawScoresHeader: "Raw\nScores",
    standardScoresHeader: "Standard\nScores",
    percentileRanksHeader: "Percentile\nRanks",
    
    subtests: [
      { name: "Immediate Memory", rawScore: "55", standardScore: "15", percentileRank: "95" },
      { name: "Recent Memory", rawScore: "64", standardScore: "14", percentileRank: "91" },
      { name: "Recall of General Information", rawScore: "68", standardScore: "18", percentileRank: ">99" },
      { name: "Spatial Orientation", rawScore: "42", standardScore: "12", percentileRank: "75" }
    ],
    
    memoryQuotientHeader: "Memory Quotient Composite Score",
    memoryQuotientValue: "+ = 136",
    memoryQuotientPercentile: ">99",
    
    interpretationHeader: "Interpretation:",
    interpretation: "ABC's RIPA-P scores imply 'no' deficits in the areas of information processing skills (memory).",
    
    subtestDescriptionHeader: "Subtest description",
    immediateMemoryDesc: "Immediate Memory— In this subtest, the child is required to repeat numbers, words and sentences of increasing length and complexity.",
    recentMemoryDesc: "Recent Memory— In this subtest, the child is required to recall specific newly acquired information about recent events and daily activity. Each question requires a verbal response which provides information age and appropriateness.",
    recallGeneralInfoDesc: "Recall of General Information— This subtest assesses the child's ability to recall general information in remote memory.",
    spatialOrientationDesc: "Spatial Orientation— In this subtest, the child answers questions related to spatial concepts and localization. Elicitation of accurate responses requires recall from both recent and remote memory. Spatial concepts require organization skills, including categorization and sequencing."
  });

  const printRef = useRef();
  const chartRef = useRef();

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleSubtestChange = (index, field, value) => {
    const newSubtests = [...formData.subtests];
    newSubtests[index] = { ...newSubtests[index], [field]: value };
    setFormData(prev => ({ ...prev, subtests: newSubtests }));
  };

  const handlePrint = async () => {
    // Capture chart SVG directly
    let chartImage = '';
    
    if (chartRef.current) {
      try {
        // Find the SVG element inside the chart container
        const svgElement = chartRef.current.querySelector('svg');
        
        if (svgElement) {
          // Clone the SVG to modify it for capture
          const clonedSvg = svgElement.cloneNode(true);
          
          // Add width and height attributes if missing
          clonedSvg.setAttribute('width', '700');
          clonedSvg.setAttribute('height', '300');
          clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          
          // Serialize SVG to string
          const svgString = new XMLSerializer().serializeToString(clonedSvg);
          
          // Create canvas and draw SVG
          const canvas = document.createElement('canvas');
          canvas.width = 1400; // 2x scale for quality
          canvas.height = 600;
          const ctx = canvas.getContext('2d');
          
          // Fill white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Create image from SVG
          const img = new Image();
          const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
          const url = URL.createObjectURL(svgBlob);
          
          await new Promise((resolve, reject) => {
            img.onload = () => {
              ctx.drawImage(img, 0, 0, 1400, 600);
              URL.revokeObjectURL(url);
              resolve();
            };
            img.onerror = reject;
            img.src = url;
          });
          
          chartImage = canvas.toDataURL('image/png');
          console.log('Chart captured successfully');
        }
      } catch (err) {
        console.error('Failed to capture chart:', err);
      }
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>RIPA</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 700px; margin: 0 auto; padding: 20px; color: #000; }
            .report-box { border: 1px solid #000; padding: 20px; max-width: 700px; }
            .title { font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px; }
            .desc { font-size: 10pt; text-align: justify; margin-bottom: 10px; }
            .section-header { font-size: 10pt; font-weight: bold; text-align: left; margin: 15px 0 5px 0; }
            .subtest-header { font-size: 10pt; font-weight: bold; text-align: center; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt; }
            th, td { border: 1px solid #000; padding: 4px 6px; text-align: center; }
            th { font-weight: bold; }
            td:first-child { text-align: left; font-weight: bold; }
            .memory-quotient { font-weight: bold; }
            .interpretation { margin: 15px 0; text-align: justify; font-size: 10pt; }
            .interpretation strong { font-weight: bold; text-decoration: underline; }
            .subtest-desc { margin: 8px 0; text-align: justify; font-size: 10pt; line-height: 1.4; }
            .subtest-desc strong { font-weight: bold; }
            .chart-container { text-align: center; margin: 15px 0; }
            .chart-container img { max-width: 100%; height: auto; }
            .chart-title { font-size: 10pt; font-weight: bold; text-align: center; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="report-box">
            <div class="title">${formData.title}</div>
            <div class="desc">${formData.description}</div>
            
            <div class="section-header">Subtest and standard score results are as follows:</div>
            
            <div class="subtest-header">${formData.subtestResultsHeader}</div>
            <table>
              <tr>
                <th>Subtest</th>
                <th>${formData.rawScoresHeader.replace(/\n/g, '<br/>')}</th>
                <th>${formData.standardScoresHeader.replace(/\n/g, '<br/>')}</th>
                <th>${formData.percentileRanksHeader.replace(/\n/g, '<br/>')}</th>
              </tr>
              ${formData.subtests.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.rawScore}</td>
                  <td>${s.standardScore}</td>
                  <td>${s.percentileRank}</td>
                </tr>
              `).join('')}
              <tr class="memory-quotient">
                <td colspan="2">${formData.memoryQuotientHeader} ${formData.memoryQuotientValue}</td>
                <td>${formData.memoryQuotientPercentile}</td>
              </tr>
            </table>
            
            ${chartImage ? `
            <div class="chart-container">
              <div class="chart-title">RIPA</div>
              <img src="${chartImage}" alt="RIPA Chart" />
            </div>
            ` : ''}
            
            <div class="interpretation"><strong>${formData.interpretationHeader}</strong> ${formData.interpretation}</div>
            
            <div class="section-header">${formData.subtestDescriptionHeader}</div>
            <div class="subtest-desc"><strong>Immediate Memory—</strong>${formData.immediateMemoryDesc.replace('Immediate Memory—', '')}</div>
            <div class="subtest-desc"><strong>Recent Memory—</strong>${formData.recentMemoryDesc.replace('Recent Memory—', '')}</div>
            <div class="subtest-desc"><strong>Recall of General Information—</strong>${formData.recallGeneralInfoDesc.replace('Recall of General Information—', '')}</div>
            <div class="subtest-desc"><strong>Spatial Orientation—</strong>${formData.spatialOrientationDesc.replace('Spatial Orientation—', '')}</div>
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
            <h1 className="text-xl font-semibold text-gray-800">RIPA</h1>
          </div>
          <button onClick={handlePrint} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FiPrinter className="w-4 h-4" /><span>Print / PDF</span></button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div ref={printRef} className="p-8" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
            {/* Outer Box Border */}
            <div style={{ border: '1px solid #000', padding: '20px', maxWidth: '700px' }}>
              {/* Title */}
              <div className="mb-4">
                <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '11pt' }} />
              </div>
              
              {/* Description */}
              <div className="mb-4">
                <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={4} />
              </div>
              
              {/* Section Header */}
              <div className="mb-2">
                <span className="font-bold" style={{ fontSize: '10pt' }}>Subtest and standard score results are as follows:</span>
              </div>
              
              {/* Subtest Results Header */}
              <div className="mb-2 text-center">
                <input type="text" value={formData.subtestResultsHeader} onChange={(e) => handleChange('subtestResultsHeader', e.target.value)} className="w-full text-center font-bold bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt' }} />
              </div>
              
              {/* Table */}
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr>
                    <th className="border border-black px-2 py-1 text-left font-bold text-xs" style={{ width: '40%' }}>Subtest</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.rawScoresHeader} onChange={(e) => handleChange('rawScoresHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '8pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.standardScoresHeader} onChange={(e) => handleChange('standardScoresHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '8pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.percentileRanksHeader} onChange={(e) => handleChange('percentileRanksHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '8pt' }} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.subtests.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-black px-2 py-1 text-xs font-bold">
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange(index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rawScore} onChange={(e) => handleSubtestChange(index, 'rawScore', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.standardScore} onChange={(e) => handleSubtestChange(index, 'standardScore', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.percentileRank} onChange={(e) => handleSubtestChange(index, 'percentileRank', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                    </tr>
                  ))}
                  {/* Memory Quotient Row */}
                  <tr className="font-bold">
                    <td className="border border-black px-2 py-1 text-xs" colSpan="2">
                      <input type="text" value={formData.memoryQuotientHeader} onChange={(e) => handleChange('memoryQuotientHeader', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      <input type="text" value={formData.memoryQuotientValue} onChange={(e) => handleChange('memoryQuotientValue', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs font-bold">
                      <input type="text" value={formData.memoryQuotientPercentile} onChange={(e) => handleChange('memoryQuotientPercentile', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Chart */}
              <div className="mb-6 mt-4" ref={chartRef} style={{ background: 'white', padding: '10px' }}>
                <div className="text-center font-bold mb-2" style={{ fontSize: '10pt', fontFamily: 'Times New Roman, Times, serif' }}>RIPA</div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={[
                      { name: 'Immediate\nMemory', standardScore: parseInt(formData.subtests[0].standardScore) || 0, percentileRank: parseInt(formData.subtests[0].percentileRank) || 0 },
                      { name: 'Recent\nMemory', standardScore: parseInt(formData.subtests[1].standardScore) || 0, percentileRank: parseInt(formData.subtests[1].percentileRank) || 0 },
                      { name: 'Recall of General\nInformation', standardScore: parseInt(formData.subtests[2].standardScore) || 0, percentileRank: parseInt(formData.subtests[2].percentileRank.replace('>', '')) || 0 },
                      { name: 'Spatial\nOrientation', standardScore: parseInt(formData.subtests[3].standardScore) || 0, percentileRank: parseInt(formData.subtests[3].percentileRank) || 0 }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 8, fontFamily: 'Times New Roman, Times, serif' }} 
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 8, fontFamily: 'Times New Roman, Times, serif' }}
                      domain={[0, 120]}
                    />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '8pt' }} />
                    <Bar dataKey="standardScore" name="Standard Scores" fill="#4472C4" />
                    <Bar dataKey="percentileRank" name="Percentile Ranks" fill="#ED7D31" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Interpretation */}
              <div className="mb-4">
                <span className="font-bold" style={{ fontSize: '10pt', textDecoration: 'underline' }}>
                  <input type="text" value={formData.interpretationHeader} onChange={(e) => handleChange('interpretationHeader', e.target.value)} className="bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '10pt', textDecoration: 'underline' }} />
                </span>
                <input type="text" value={formData.interpretation} onChange={(e) => handleChange('interpretation', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt' }} />
              </div>
              
              {/* Subtest Description Header */}
              <div className="mb-2">
                <input type="text" value={formData.subtestDescriptionHeader} onChange={(e) => handleChange('subtestDescriptionHeader', e.target.value)} className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt' }} />
              </div>
              
              {/* Subtest Descriptions */}
              <div className="mb-2">
                <span className="font-bold" style={{ fontSize: '10pt' }}>Immediate Memory—</span>
                <textarea value={formData.immediateMemoryDesc.replace('Immediate Memory—', '')} onChange={(e) => handleChange('immediateMemoryDesc', 'Immediate Memory—' + e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify inline" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
              <div className="mb-2">
                <span className="font-bold" style={{ fontSize: '10pt' }}>Recent Memory—</span>
                <textarea value={formData.recentMemoryDesc.replace('Recent Memory—', '')} onChange={(e) => handleChange('recentMemoryDesc', 'Recent Memory—' + e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify inline" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
              <div className="mb-2">
                <span className="font-bold" style={{ fontSize: '10pt' }}>Recall of General Information—</span>
                <textarea value={formData.recallGeneralInfoDesc.replace('Recall of General Information—', '')} onChange={(e) => handleChange('recallGeneralInfoDesc', 'Recall of General Information—' + e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify inline" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
              <div className="mb-2">
                <span className="font-bold" style={{ fontSize: '10pt' }}>Spatial Orientation—</span>
                <textarea value={formData.spatialOrientationDesc.replace('Spatial Orientation—', '')} onChange={(e) => handleChange('spatialOrientationDesc', 'Spatial Orientation—' + e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify inline" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
            </div> {/* End of outer box border */}
          </div>
          <div className="bg-blue-50 border-t border-blue-100 px-8 py-4"><p className="text-sm text-blue-800"><strong>Instructions:</strong> All fields are editable. Click on any text to edit. Click "Print / PDF" to generate a printable report.</p></div>
        </div>
      </div>
    </div>
  );
};

export default SimpleRIPATemplate;
