import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// Ross Information Processing Assessment (RIPA) Template
const SimpleRIPATemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)",
    description: "The Ross Information Processing Assessment (RIPA) is a comprehensive assessment of cognitive-linguistic processing. It is designed to identify, describe, and quantify cognitive-linguistic deficits in individuals with acquired brain injury.",
    examineeName: "ABC",
    chronologicalAge: "16 years 2 months",
    
    subtests: [
      { name: "Immediate Memory", score: "8", percentile: "25", level: "Mild Deficit" },
      { name: "Recent Memory", score: "7", percentile: "16", level: "Mild-Moderate Deficit" },
      { name: "Temporal Orientation", score: "9", percentile: "37", level: "Mild Deficit" },
      { name: "Spatial Orientation", score: "11", percentile: "63", level: "Average" },
      { name: "Orientation to Environment", score: "10", percentile: "50", level: "Average" },
      { name: "Recall of General Information", score: "8", percentile: "25", level: "Mild Deficit" },
      { name: "Problem Solving & Abstract Reasoning", score: "6", percentile: "9", level: "Moderate Deficit" },
      { name: "Organization", score: "7", percentile: "16", level: "Mild-Moderate Deficit" },
      { name: "Auditory Processing & Retention", score: "9", percentile: "37", level: "Mild Deficit" }
    ],
    
    cognitiveIndex: { score: "75", percentile: "25", level: "Mild Deficit" },
    
    interpretation: "The RIPA results indicate that ABC demonstrates mild to moderate deficits in several cognitive-linguistic areas. Immediate memory, recent memory, and problem solving abilities show particular weakness. Spatial and environmental orientation are relatively preserved. These findings suggest difficulties in new learning and higher-level reasoning while basic orientation remains intact."
  });

  const printRef = useRef();

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubtestChange = (index, field, value) => {
    const newSubtests = [...formData.subtests];
    newSubtests[index] = { ...newSubtests[index], [field]: value };
    setFormData(prev => ({ ...prev, subtests: newSubtests }));
  };
  const handleIndexChange = (field, value) => setFormData(prev => ({ ...prev, cognitiveIndex: { ...prev.cognitiveIndex, [field]: value } }));

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>RIPA</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 700px; margin: 0 auto; padding: 20px; color: #000; }
            .title { font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px; }
            .desc { font-size: 10pt; text-align: justify; margin-bottom: 10px; }
            .info { font-size: 10pt; margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt; }
            th, td { border: 1px solid #000; padding: 4px 6px; text-align: center; }
            th { background-color: #e8e8e8; font-weight: bold; }
            td:first-child { text-align: left; font-weight: bold; }
            .index-row { background-color: #f5f5f5; }
            .interpretation { margin-top: 15px; text-align: justify; }
          </style>
        </head>
        <body>
          <div class="title">${formData.title}</div>
          <div class="desc">${formData.description}</div>
          <div class="info"><strong>Examinee Name:</strong> ${formData.examineeName} | <strong>Chronological Age:</strong> ${formData.chronologicalAge}</div>
          <table>
            <tr><th>Subtest</th><th>Score</th><th>Percentile</th><th>Level</th></tr>
            ${formData.subtests.map(s => `<tr><td>${s.name}</td><td>${s.score}</td><td>${s.percentile}</td><td>${s.level}</td></tr>`).join('')}
            <tr class="index-row"><td><strong>Cognitive Linguistic Index</strong></td><td><strong>${formData.cognitiveIndex.score}</strong></td><td><strong>${formData.cognitiveIndex.percentile}</strong></td><td><strong>${formData.cognitiveIndex.level}</strong></td></tr>
          </table>
          <div class="interpretation">${formData.interpretation}</div>
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
            <div className="mb-4"><input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '11pt' }} /></div>
            <div className="mb-4"><textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={3} /></div>
            <div className="mb-4" style={{ fontSize: '10pt' }}><span className="font-bold">Examinee Name: </span><input type="text" value={formData.examineeName} onChange={(e) => handleChange('examineeName', e.target.value)} className="bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt' }} /><span className="mx-2">|</span><span className="font-bold">Chronological Age: </span><input type="text" value={formData.chronologicalAge} onChange={(e) => handleChange('chronologicalAge', e.target.value)} className="bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt' }} /></div>
            <table className="w-full border-collapse border border-black mb-4">
              <thead><tr className="bg-gray-200"><th className="border border-black px-2 py-1 text-left font-bold text-xs">Subtest</th><th className="border border-black px-2 py-1 text-center font-bold text-xs">Score</th><th className="border border-black px-2 py-1 text-center font-bold text-xs">Percentile</th><th className="border border-black px-2 py-1 text-center font-bold text-xs">Level</th></tr></thead>
              <tbody>{formData.subtests.map((item, index) => (<tr key={index}><td className="border border-black px-2 py-1 text-xs font-bold"><input type="text" value={item.name} onChange={(e) => handleSubtestChange(index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs"><input type="text" value={item.score} onChange={(e) => handleSubtestChange(index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs"><input type="text" value={item.percentile} onChange={(e) => handleSubtestChange(index, 'percentile', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs"><input type="text" value={item.level} onChange={(e) => handleSubtestChange(index, 'level', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td></tr>))}<tr className="bg-gray-100"><td className="border border-black px-2 py-1 text-xs font-bold"><strong>Cognitive Linguistic Index</strong></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.cognitiveIndex.score} onChange={(e) => handleIndexChange('score', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.cognitiveIndex.percentile} onChange={(e) => handleIndexChange('percentile', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.cognitiveIndex.level} onChange={(e) => handleIndexChange('level', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td></tr></tbody>
            </table>
            <div><textarea value={formData.interpretation} onChange={(e) => handleChange('interpretation', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={4} /></div>
          </div>
          <div className="bg-blue-50 border-t border-blue-100 px-8 py-4"><p className="text-sm text-blue-800"><strong>Instructions:</strong> All fields are editable. Click on any text to edit. Click "Print / PDF" to generate a printable report.</p></div>
        </div>
      </div>
    </div>
  );
};

export default SimpleRIPATemplate;
