import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from './Sidebar';

const SimpleTAPS3Template = ({ onBack, activeItem, setActiveItem }) => {
  const [formData, setFormData] = useState({
    title: "TEST OF AUDITORY PROCESSING SKILLS-TAPS-3",
    description: "The Test of Auditory Processing Skills (Third Edition; TAPS-3) is a measure of auditory skill important to the development, use, and understanding of the language used in academic instruction. It includes subtests designed to assess basic phonological skills (which are important to learning to read memory abilities (essential to processing information), and auditory cohesion (which requires not onl understanding, but also the ability to use inference, deduction and abstraction to comprehend th meaning of verbally presented information). The scores below serve to show ABC's performance o these auditory tasks in comparison to a normative sample of his same age peers, as well as to compar his performance on different subtests.",
    
    sectionHeader: "Subtest and Index results are as follows:",
    
    // Table Headers
    subtestResultsHeader: "SUBTEST RESULTS",
    rawScoresHeader: "Raw\nScores",
    scaledScoresHeader: "Scaled\nScores", 
    percentileRanksHeader: "Percentile\nRanks",
    
    // Phonologic Index Subtests
    phonologicSubtests: [
      { name: "Word Discrimination", rawScore: "30", scaledScore: "9", percentileRank: "37" },
      { name: "Phonological Segmentation", rawScore: "27", scaledScore: "7", percentileRank: "16" },
      { name: "Phonological Blending", rawScore: "26", scaledScore: "10", percentileRank: "50" }
    ],
    phonologicIndex: { score: "94", label: "Phonologic Index Standard Score" },
    
    // Memory Index Subtests
    memorySubtests: [
      { name: "Number Memory Forward", rawScore: "27", scaledScore: "15", percentileRank: "95" },
      { name: "Number Memory Reversed", rawScore: "8", scaledScore: "6", percentileRank: "9" },
      { name: "Word Memory", rawScore: "21", scaledScore: "11", percentileRank: "63" },
      { name: "Sentence Memory", rawScore: "23", scaledScore: "8", percentileRank: "25" }
    ],
    memoryIndex: { score: "100", label: "Memory Index Standard Score" },
    
    // Cohesion Index Subtests
    cohesionSubtests: [
      { name: "Auditory Comprehension", rawScore: "26", scaledScore: "10", percentileRank: "50" },
      { name: "Auditory Reasoning", rawScore: "14", scaledScore: "9", percentileRank: "37" }
    ],
    cohesionIndex: { score: "98", label: "Cohesion Index Standard Score" },
    
    overallIndex:  { score: "97", label: "Overall Index Score" },
    
    // Remark
    remark: "ABC's Overall TAPS-3 Index Standard Score is 97, is in the average range (85-115 average) for his chronological age."
  });

  const printRef = useRef();
  const chartRef = useRef();

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleSubtestChange = (section, index, field, value) => {
    const newSection = [...formData[section]];
    newSection[index] = { ...newSection[index], [field]: value };
    setFormData(prev => ({ ...prev, [section]: newSection }));
  };
  
  const handleIndexChange = (indexName, field, value) => {
    setFormData(prev => ({ ...prev, [indexName]: { ...prev[indexName], [field]: value } }));
  };

  const handlePrint = async () => {
    // Capture chart as image
    let chartImage = '';
    if (chartRef.current) {
      try {
        const svgElement = chartRef.current.querySelector('svg');
        if (svgElement) {
          const clonedSvg = svgElement.cloneNode(true);
          clonedSvg.setAttribute('width', '700');
          clonedSvg.setAttribute('height', '350');
          clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          
          const svgString = new XMLSerializer().serializeToString(clonedSvg);
          const canvas = document.createElement('canvas');
          canvas.width = 1400;
          canvas.height = 700;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const img = new Image();
          const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
          const url = URL.createObjectURL(svgBlob);
          
          await new Promise((resolve, reject) => {
            img.onload = () => {
              ctx.drawImage(img, 0, 0, 1400, 700);
              URL.revokeObjectURL(url);
              resolve();
            };
            img.onerror = reject;
            img.src = url;
          });
          
          chartImage = canvas.toDataURL('image/png'); 
        }
      } catch (err) {
        console.error('Failed to capture chart:', err);
      }
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>TAPS-3</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 750px; margin: 0 auto; padding: 15px; color: #000; }
            .report-box { border: 1px solid #000; padding: 15px; max-width: 750px; }
            .title { font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px; }
            .desc { font-size: 10pt; text-align: justify; margin-bottom: 15px; }
            .section-header { font-size: 10pt; font-weight: bold; text-align: left; margin: 15px 0 5px 0; }
            .subtest-header { font-size: 10pt; font-weight: bold; text-align: center; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt; }
            th, td { border: 1px solid #000; padding: 4px 6px; text-align: center; }
            th { font-weight: bold; }
            td:first-child { text-align: left; font-weight: bold; }
            .index-row { font-weight: bold; }
            .chart-container { text-align: center; margin: 15px 0; }
            .chart-container img { max-width: 100%; height: auto; }
            .chart-title { font-size: 10pt; font-weight: bold; text-align: center; margin-bottom: 10px; }
            .remark { margin-top: 15px; text-align: justify; font-size: 10pt; }
            .remark strong { font-weight: bold; text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="report-box">
            <div class="title">${formData.title}</div>
            <div class="desc">${formData.description}</div>
            
            <div class="section-header">${formData.sectionHeader}</div>
            
            <div class="subtest-header">${formData.subtestResultsHeader}</div>
            <table>
              <tr>
                <th>${formData.subtestResultsHeader}</th>
                <th>${formData.rawScoresHeader.replace(/\\n/g, '<br/>')}</th>
                <th>${formData.scaledScoresHeader.replace(/\\n/g, '<br/>')}</th>
                <th>${formData.percentileRanksHeader.replace(/\\n/g, '<br/>')}</th>
              </tr>
              
              ${formData.phonologicSubtests.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.rawScore}</td>
                  <td>${s.scaledScore}</td>
                  <td>${s.percentileRank}</td>
                </tr>
              `).join('')}
              <tr class="index-row">
                <td colspan="2">${formData.phonologicIndex.label} † = ${formData.phonologicIndex.score}</td>
                <td colspan="2"></td>
              </tr>
              
              ${formData.memorySubtests.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.rawScore}</td>
                  <td>${s.scaledScore}</td>
                  <td>${s.percentileRank}</td>
                </tr>
              `).join('')}
              <tr class="index-row">
                <td colspan="2">${formData.memoryIndex.label} † = ${formData.memoryIndex.score}</td>
                <td colspan="2"></td>
              </tr>
              
              ${formData.cohesionSubtests.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.rawScore}</td>
                  <td>${s.scaledScore}</td>
                  <td>${s.percentileRank}</td>
                </tr>
              `).join('')}
              <tr class="index-row">
                <td colspan="2">${formData.cohesionIndex.label} † = ${formData.cohesionIndex.score}</td>
                <td colspan="2"></td>
              </tr>
              
              <tr class="index-row">
                <td colspan="4">${formData.overallIndex.label} † = ${formData.overallIndex.score}</td>
              </tr>
            </table>
            
            ${chartImage ? `
            <div class="chart-container">
              <div class="chart-title">TAPS-3</div>
              <img src="${chartImage}" alt="TAPS-3 Chart" />
            </div>
            ` : ''}
            
            <div class="remark"><strong>Remark:</strong> ${formData.remark}</div>
          </div>
          <div style="margin-top: 30px; font-size: 8pt; color: #666; text-align: right;">Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Prepare chart data - horizontal bar chart
  const chartData = [
    { name: 'Word Discrimination', percentile: 37, scaled: 9, raw: 30 },
    { name: 'Phonological Segmentation', percentile: 16, scaled: 7, raw: 27 },
    { name: 'Phonological Blending', percentile: 50, scaled: 10, raw: 26 },
    { name: 'Number Memory Forward', percentile: 95, scaled: 15, raw: 27 },
    { name: 'Number Memory Reversed', percentile: 9, scaled: 6, raw: 8 },
    { name: 'Word Memory', percentile: 63, scaled: 11, raw: 21 },
    { name: 'Sentence Memory', percentile: 25, scaled: 8, raw: 23 },
    { name: 'Auditory Comprehension', percentile: 50, scaled: 10, raw: 26 },
    { name: 'Auditory Reasoning', percentile: 37, scaled: 9, raw: 14 }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar 
        activeItem={activeItem || 'patients'} 
        setActiveItem={setActiveItem || (() => {})}
        sidebarCollapsed={false}
        setSidebarCollapsed={() => {}}
      />
      
      <div className="flex-1 lg:ml-64">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"><FiArrowLeft className="w-5 h-5" /><span>Back</span></button>}
            <h1 className="text-xl font-semibold text-gray-800">TAPS-3</h1>
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
                <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={6} />
              </div>
              
              {/* Section Header */}
              <div className="mb-2">
                <span className="font-bold" style={{ fontSize: '10pt' }}>
                  <input type="text" value={formData.sectionHeader} onChange={(e) => handleChange('sectionHeader', e.target.value)} className="bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '10pt' }} />
                </span>
              </div>
              
              {/* Subtest Results Header */}
              <div className="mb-2 text-center">
                <input type="text" value={formData.subtestResultsHeader} onChange={(e) => handleChange('subtestResultsHeader', e.target.value)} className="w-full text-center font-bold bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt' }} />
              </div>
              
              {/* Table */}
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr>
                    <th className="border border-black px-2 py-1 text-left font-bold text-xs" style={{ width: '40%' }}>
                      <input type="text" value={formData.subtestResultsHeader} onChange={(e) => handleChange('subtestResultsHeader', e.target.value)} className="w-full bg-transparent font-bold focus:outline-none" style={{ fontSize: '9pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.rawScoresHeader} onChange={(e) => handleChange('rawScoresHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '8pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.scaledScoresHeader} onChange={(e) => handleChange('scaledScoresHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '8pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.percentileRanksHeader} onChange={(e) => handleChange('percentileRanksHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '8pt' }} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Phonologic Index Subtests */}
                  {formData.phonologicSubtests.map((item, index) => (
                    <tr key={`phon-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs font-bold">
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('phonologicSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rawScore} onChange={(e) => handleSubtestChange('phonologicSubtests', index, 'rawScore', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.scaledScore} onChange={(e) => handleSubtestChange('phonologicSubtests', index, 'scaledScore', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.percentileRank} onChange={(e) => handleSubtestChange('phonologicSubtests', index, 'percentileRank', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                    </tr>
                  ))}
                  {/* Phonologic Index Row */}
                  <tr className="font-bold">
                    <td className="border border-black px-2 py-1 text-xs" colSpan="2">
                      <input type="text" value={formData.phonologicIndex.label} onChange={(e) => handleIndexChange('phonologicIndex', 'label', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      <span> † = </span>
                      <input type="text" value={formData.phonologicIndex.score} onChange={(e) => handleIndexChange('phonologicIndex', 'score', e.target.value)} className="w-16 bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs font-bold" colSpan="2"></td>
                  </tr>
                  
                  {/* Memory Index Subtests */}
                  {formData.memorySubtests.map((item, index) => (
                    <tr key={`mem-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs font-bold">
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('memorySubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rawScore} onChange={(e) => handleSubtestChange('memorySubtests', index, 'rawScore', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.scaledScore} onChange={(e) => handleSubtestChange('memorySubtests', index, 'scaledScore', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.percentileRank} onChange={(e) => handleSubtestChange('memorySubtests', index, 'percentileRank', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                    </tr>
                  ))}
                  {/* Memory Index Row */}
                  <tr className="font-bold">
                    <td className="border border-black px-2 py-1 text-xs" colSpan="2">
                      <input type="text" value={formData.memoryIndex.label} onChange={(e) => handleIndexChange('memoryIndex', 'label', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      <span> † = </span>
                      <input type="text" value={formData.memoryIndex.score} onChange={(e) => handleIndexChange('memoryIndex', 'score', e.target.value)} className="w-16 bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs font-bold" colSpan="2"></td>
                  </tr>
                  
                  {/* Cohesion Index Subtests */}
                  {formData.cohesionSubtests.map((item, index) => (
                    <tr key={`coh-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs font-bold">
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('cohesionSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rawScore} onChange={(e) => handleSubtestChange('cohesionSubtests', index, 'rawScore', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.scaledScore} onChange={(e) => handleSubtestChange('cohesionSubtests', index, 'scaledScore', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.percentileRank} onChange={(e) => handleSubtestChange('cohesionSubtests', index, 'percentileRank', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                    </tr>
                  ))}
                  {/* Cohesion Index Row */}
                  <tr className="font-bold">
                    <td className="border border-black px-2 py-1 text-xs" colSpan="2">
                      <input type="text" value={formData.cohesionIndex.label} onChange={(e) => handleIndexChange('cohesionIndex', 'label', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      <span> † = </span>
                      <input type="text" value={formData.cohesionIndex.score} onChange={(e) => handleIndexChange('cohesionIndex', 'score', e.target.value)} className="w-16 bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs font-bold" colSpan="2"></td>
                  </tr>
                  
                  {/* Overall Index Row */}
                  <tr className="font-bold">
                    <td className="border border-black px-2 py-1 text-xs" colSpan="4" style={{ textAlign: 'center' }}>
                      <input type="text" value={formData.overallIndex.label} onChange={(e) => handleIndexChange('overallIndex', 'label', e.target.value)} className="bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      <span> † = </span>
                      <input type="text" value={formData.overallIndex.score} onChange={(e) => handleIndexChange('overallIndex', 'score', e.target.value)} className="w-16 bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Horizontal Bar Chart */}
              <div className="mb-6 mt-4" ref={chartRef} style={{ background: 'white', padding: '10px' }}>
                <div className="text-center font-bold mb-2" style={{ fontSize: '10pt', fontFamily: 'Times New Roman, Times, serif' }}>TAPS-3</div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 150, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 8, fontFamily: 'Times New Roman, Times, serif' }} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fontSize: 8, fontFamily: 'Times New Roman, Times, serif' }} 
                      width={140}
                    />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '8pt' }} />
                    <Bar dataKey="percentile" name="Percentile Ranks" fill="#4472C4" barSize={8} />
                    <Bar dataKey="scaled" name="Scaled Scores" fill="#ED7D31" barSize={8} />
                    <Bar dataKey="raw" name="Raw Scores" fill="#70AD47" barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Remark */}
              <div className="mb-4">
                <span className="font-bold" style={{ fontSize: '10pt', textDecoration: 'underline' }}>Remark:</span>
                <input type="text" value={formData.remark} onChange={(e) => handleChange('remark', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt' }} />
              </div>
              
            </div> {/* End of outer box border */}
          </div>
          <div className="bg-blue-50 border-t border-blue-100 px-8 py-4"><p className="text-sm text-blue-800"><strong>Instructions:</strong> All fields are editable. Click on any text to edit. Click "Print / PDF" to generate a printable report.</p></div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SimpleTAPS3Template;
