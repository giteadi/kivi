import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// Test of Written Language - Fourth Edition (TOWL-4) Template
const SimpleTOWL4Template = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "TEST OF WRITTEN LANGUAGE - FOURTH EDITION (TOWL-4)",
    description: "The TOWL-4 is a comprehensive assessment of written language skills for individuals aged 9 to 17 years. It evaluates both conventional skills (spelling, punctuation, capitalization) and spontaneous skills (vocabulary, syntax, grammar).",
    examineeName: "ABC",
    chronologicalAge: "16 years 2 months",
    
    conventionalSubtests: [
      { name: "Vocabulary in Context", score: "8", percentile: "25", level: "Average" },
      { name: "Spelling", score: "7", percentile: "16", level: "Low Average" },
      { name: "Punctuation and Capitalization", score: "9", percentile: "37", level: "Average" },
      { name: "Sentence Combining", score: "6", percentile: "9", level: "Below Average" }
    ],
    
    spontaneousSubtests: [
      { name: "Logical Sentences", score: "8", percentile: "25", level: "Average" },
      { name: "Sentence Combining", score: "7", percentile: "16", level: "Low Average" },
      { name: "Contextual Conventions", score: "9", percentile: "37", level: "Average" },
      { name: "Story Construction", score: "6", percentile: "9", level: "Below Average" }
    ],
    
    compositeScores: {
      overallWriting: { score: "85", percentile: "16", level: "Low Average" },
      conventional: { score: "82", percentile: "12", level: "Low Average" },
      spontaneous: { score: "88", percentile: "21", level: "Average" }
    },
    
    interpretation: "The TOWL-4 results indicate that ABC's overall written language ability falls in the low average range. Conventional writing skills (spelling, punctuation) are weaker than spontaneous skills. Sentence construction and story writing show particular difficulty. These findings suggest that ABC would benefit from explicit instruction in writing conventions and structured writing strategies."
  });

  const printRef = useRef();

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleConvSubtestChange = (index, field, value) => {
    const newSubtests = [...formData.conventionalSubtests];
    newSubtests[index] = { ...newSubtests[index], [field]: value };
    setFormData(prev => ({ ...prev, conventionalSubtests: newSubtests }));
  };
  
  const handleSponSubtestChange = (index, field, value) => {
    const newSubtests = [...formData.spontaneousSubtests];
    newSubtests[index] = { ...newSubtests[index], [field]: value };
    setFormData(prev => ({ ...prev, spontaneousSubtests: newSubtests }));
  };
  
  const handleCompositeChange = (comp, field, value) => {
    setFormData(prev => ({ ...prev, compositeScores: { ...prev.compositeScores, [comp]: { ...prev.compositeScores[comp], [field]: value } } }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>TOWL-4</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 700px; margin: 0 auto; padding: 20px; color: #000; }
            .title { font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px; }
            .desc { font-size: 10pt; text-align: justify; margin-bottom: 10px; }
            .info { font-size: 10pt; margin-bottom: 15px; }
            .section-header { font-size: 10pt; font-weight: bold; text-align: left; margin: 15px 0 10px 0; background-color: #e8e8e8; padding: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt; }
            th, td { border: 1px solid #000; padding: 4px 6px; text-align: center; }
            th { background-color: #e8e8e8; font-weight: bold; }
            td:first-child { text-align: left; font-weight: bold; }
            .composite-row { background-color: #f5f5f5; }
            .interpretation { margin-top: 15px; text-align: justify; }
          </style>
        </head>
        <body>
          <div class="title">${formData.title}</div>
          <div class="desc">${formData.description}</div>
          <div class="info"><strong>Examinee Name:</strong> ${formData.examineeName} | <strong>Chronological Age:</strong> ${formData.chronologicalAge}</div>
          
          <div class="section-header">Conventional Writing Subtests</div>
          <table>
            <tr><th>Subtest</th><th>Score</th><th>Percentile</th><th>Level</th></tr>
            ${formData.conventionalSubtests.map(s => `<tr><td>${s.name}</td><td>${s.score}</td><td>${s.percentile}</td><td>${s.level}</td></tr>`).join('')}
          </table>
          
          <div class="section-header">Spontaneous Writing Subtests</div>
          <table>
            <tr><th>Subtest</th><th>Score</th><th>Percentile</th><th>Level</th></tr>
            ${formData.spontaneousSubtests.map(s => `<tr><td>${s.name}</td><td>${s.score}</td><td>${s.percentile}</td><td>${s.level}</td></tr>`).join('')}
          </table>
          
          <div class="section-header">Composite Scores</div>
          <table>
            <tr class="composite-row"><td><strong>Overall Writing Index</strong></td><td><strong>${formData.compositeScores.overallWriting.score}</strong></td><td><strong>${formData.compositeScores.overallWriting.percentile}</strong></td><td><strong>${formData.compositeScores.overallWriting.level}</strong></td></tr>
            <tr class="composite-row"><td><strong>Conventional Writing Index</strong></td><td><strong>${formData.compositeScores.conventional.score}</strong></td><td><strong>${formData.compositeScores.conventional.percentile}</strong></td><td><strong>${formData.compositeScores.conventional.level}</strong></td></tr>
            <tr class="composite-row"><td><strong>Spontaneous Writing Index</strong></td><td><strong>${formData.compositeScores.spontaneous.score}</strong></td><td><strong>${formData.compositeScores.spontaneous.percentile}</strong></td><td><strong>${formData.compositeScores.spontaneous.level}</strong></td></tr>
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
            <h1 className="text-xl font-semibold text-gray-800">TOWL-4</h1>
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
            
            <div className="mb-2"><input type="text" value="Conventional Writing Subtests" className="w-full font-bold bg-gray-200 px-2 py-1 bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt' }} /></div>
            <table className="w-full border-collapse border border-black mb-4"><thead><tr className="bg-gray-200"><th className="border border-black px-2 py-1 text-left font-bold text-xs">Subtest</th><th className="border border-black px-2 py-1 text-center font-bold text-xs">Score</th><th className="border border-black px-2 py-1 text-center font-bold text-xs">Percentile</th><th className="border border-black px-2 py-1 text-center font-bold text-xs">Level</th></tr></thead><tbody>{formData.conventionalSubtests.map((item, index) => (<tr key={index}><td className="border border-black px-2 py-1 text-xs font-bold"><input type="text" value={item.name} onChange={(e) => handleConvSubtestChange(index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs"><input type="text" value={item.score} onChange={(e) => handleConvSubtestChange(index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs"><input type="text" value={item.percentile} onChange={(e) => handleConvSubtestChange(index, 'percentile', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs"><input type="text" value={item.level} onChange={(e) => handleConvSubtestChange(index, 'level', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td></tr>))}</tbody></table>
            
            <div className="mb-2"><input type="text" value="Spontaneous Writing Subtests" className="w-full font-bold bg-gray-200 px-2 py-1 bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt' }} /></div>
            <table className="w-full border-collapse border border-black mb-4"><thead><tr className="bg-gray-200"><th className="border border-black px-2 py-1 text-left font-bold text-xs">Subtest</th><th className="border border-black px-2 py-1 text-center font-bold text-xs">Score</th><th className="border border-black px-2 py-1 text-center font-bold text-xs">Percentile</th><th className="border border-black px-2 py-1 text-center font-bold text-xs">Level</th></tr></thead><tbody>{formData.spontaneousSubtests.map((item, index) => (<tr key={index}><td className="border border-black px-2 py-1 text-xs font-bold"><input type="text" value={item.name} onChange={(e) => handleSponSubtestChange(index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs"><input type="text" value={item.score} onChange={(e) => handleSponSubtestChange(index, 'score', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs"><input type="text" value={item.percentile} onChange={(e) => handleSponSubtestChange(index, 'percentile', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs"><input type="text" value={item.level} onChange={(e) => handleSponSubtestChange(index, 'level', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td></tr>))}</tbody></table>
            
            <div className="mb-2"><input type="text" value="Composite Scores" className="w-full font-bold bg-gray-200 px-2 py-1 bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt' }} /></div>
            <table className="w-full border-collapse border border-black mb-4"><tbody><tr className="bg-gray-100"><td className="border border-black px-2 py-1 text-xs font-bold"><strong>Overall Writing Index</strong></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.compositeScores.overallWriting.score} onChange={(e) => handleCompositeChange('overallWriting', 'score', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.compositeScores.overallWriting.percentile} onChange={(e) => handleCompositeChange('overallWriting', 'percentile', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.compositeScores.overallWriting.level} onChange={(e) => handleCompositeChange('overallWriting', 'level', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td></tr>
            <tr className="bg-gray-100"><td className="border border-black px-2 py-1 text-xs font-bold"><strong>Conventional Writing Index</strong></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.compositeScores.conventional.score} onChange={(e) => handleCompositeChange('conventional', 'score', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.compositeScores.conventional.percentile} onChange={(e) => handleCompositeChange('conventional', 'percentile', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.compositeScores.conventional.level} onChange={(e) => handleCompositeChange('conventional', 'level', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td></tr>
            <tr className="bg-gray-100"><td className="border border-black px-2 py-1 text-xs font-bold"><strong>Spontaneous Writing Index</strong></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.compositeScores.spontaneous.score} onChange={(e) => handleCompositeChange('spontaneous', 'score', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.compositeScores.spontaneous.percentile} onChange={(e) => handleCompositeChange('spontaneous', 'percentile', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.compositeScores.spontaneous.level} onChange={(e) => handleCompositeChange('spontaneous', 'level', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td></tr>
            </tbody></table>
            
            <div><textarea value={formData.interpretation} onChange={(e) => handleChange('interpretation', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={4} /></div>
          </div>
          <div className="bg-blue-50 border-t border-blue-100 px-8 py-4"><p className="text-sm text-blue-800"><strong>Instructions:</strong> All fields are editable. Click on any text to edit. Click "Print / PDF" to generate a printable report.</p></div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTOWL4Template;
