import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

const SimpleWRAT5EngTemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "WIDE RANGE ACHIEVEMENT TEST- WRAT-5 (ENGLISH)",
    
    intro1: "The WRAT-5 is a norm-referenced test that measures the basic academic skills of word reading, sentence comprehension, spelling, and math computation.",
    
    intro2: "The WRAT-5 includes the following four subtests:",
    
    wordReadingDesc: "Word Reading measures letter and word decoding through letter identification and word recognition.",
    
    sentenceCompDesc: "Sentence Comprehension measures an individual's ability to gain meaning from words and to comprehend ideas and information contained in sentences through the use of a modified cloze technique.",
    
    spellingDesc: "Spelling measures an individual's ability to encode sounds into written form through the use of a dictated spelling format containing both letters and words.",
    
    mathCompDesc: "Math Computation measures an individual's ability to perform basic mathematics computations through counting, identifying numbers, solving simple oral problems, and calculating written mathematics problems.",
    
    testScoresHeader: "TEST SCORES",
    
    // Main scores table with Age Equivalent
    scores: [
      { name: "Math Computation", raw: "", standard: "", ageEquiv: "", descriptor: "" },
      { name: "Spelling", raw: "", standard: "", ageEquiv: "", descriptor: "" },
      { name: "Word Reading", raw: "", standard: "", ageEquiv: "", descriptor: "" },
      { name: "Sentence Comprehension", raw: "", standard: "", ageEquiv: "", descriptor: "" },
      { name: "Reading Composite", raw: "", standard: "", ageEquiv: "", descriptor: "" }
    ],
    
    footerNote: "Enclosed to this report as Annexure.",
    
    interpretation: ""
  });

  const printRef = useRef();

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleScoreChange = (index, field, value) => {
    const newScores = [...formData.scores];
    newScores[index] = { ...newScores[index], [field]: value };
    setFormData(prev => ({ ...prev, scores: newScores }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>WRAT-5 English</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 750px; margin: 0 auto; padding: 15px; color: #000; }
            .report-box { border: 1px solid #000; padding: 15px; max-width: 750px; }
            .title { font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px; }
            .intro { font-size: 10pt; text-align: justify; margin-bottom: 8px; }
            .intro-list { font-size: 10pt; margin-left: 0; margin-bottom: 8px; }
            .subtest-name { font-weight: bold; text-decoration: underline; }
            .test-scores-header { font-size: 10pt; font-weight: bold; margin: 15px 0 5px 0; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt; }
            th, td { border: 1px solid #000; padding: 4px 6px; text-align: center; }
            th { font-weight: bold; background-color: #e8e8e8; }
            td:first-child { text-align: left; font-weight: bold; }
            .table-title { background-color: #333; color: white; font-weight: bold; text-align: center; }
            .table-subtitle { background-color: #e8e8e8; font-weight: bold; text-align: center; }
            .footer-note { font-size: 9pt; margin-top: 10px; font-style: italic; }
            .interpretation { margin-top: 15px; text-align: justify; font-size: 10pt; }
          </style>
        </head>
        <body>
          <div class="report-box">
            <div class="title">${formData.title}</div>
            <div class="intro">${formData.intro1}</div>
            <div class="intro">${formData.intro2}</div>
            
            <div class="intro-list">
              <span class="subtest-name">Word Reading</span> ${formData.wordReadingDesc}
            </div>
            
            <div class="intro-list">
              <span class="subtest-name">Sentence Comprehension</span> ${formData.sentenceCompDesc}
            </div>
            
            <div class="intro-list">
              <span class="subtest-name">Spelling</span> ${formData.spellingDesc}
            </div>
            
            <div class="intro-list">
              <span class="subtest-name">Math Computation</span> ${formData.mathCompDesc}
            </div>
            
            <div class="test-scores-header">${formData.testScoresHeader}</div>
            
            <table>
              <tr>
                <td colspan="5" class="table-title">WIDE RANGE ACHIEVEMENT TEST: FIFTH (INDIAN EDITION)<br/>(ENGLISH)</td>
              </tr>
              <tr>
                <th>Subtest/ Composite</th>
                <th>Raw Score</th>
                <th>Standard Score</th>
                <th>Age Equivalent</th>
                <th>Descriptive Category</th>
              </tr>
              ${formData.scores.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.raw}</td>
                  <td>${s.standard}</td>
                  <td>${s.ageEquiv}</td>
                  <td>${s.descriptor}</td>
                </tr>
              `).join('')}
            </table>
            
            <div class="footer-note">${formData.footerNote}</div>
            
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
            <h1 className="text-xl font-semibold text-gray-800">WRAT-5 English</h1>
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
              
              {/* Intro 1 */}
              <div className="mb-3">
                <textarea value={formData.intro1} onChange={(e) => handleChange('intro1', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
              
              {/* Intro 2 */}
              <div className="mb-3">
                <textarea value={formData.intro2} onChange={(e) => handleChange('intro2', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={1} />
              </div>
              
              {/* Word Reading Description */}
              <div className="mb-2">
                <span style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '10pt' }}>Word Reading</span>
                <textarea value={formData.wordReadingDesc} onChange={(e) => handleChange('wordReadingDesc', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
              
              {/* Sentence Comprehension Description */}
              <div className="mb-2">
                <span style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '10pt' }}>Sentence Comprehension</span>
                <textarea value={formData.sentenceCompDesc} onChange={(e) => handleChange('sentenceCompDesc', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={3} />
              </div>
              
              {/* Spelling Description */}
              <div className="mb-2">
                <span style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '10pt' }}>Spelling</span>
                <textarea value={formData.spellingDesc} onChange={(e) => handleChange('spellingDesc', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
              
              {/* Math Computation Description */}
              <div className="mb-4">
                <span style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '10pt' }}>Math Computation</span>
                <textarea value={formData.mathCompDesc} onChange={(e) => handleChange('mathCompDesc', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
              
              {/* Test Scores Header */}
              <div className="mb-2">
                <input type="text" value={formData.testScoresHeader} onChange={(e) => handleChange('testScoresHeader', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '10pt', fontWeight: 'bold' }} />
              </div>
              
              {/* Main Scores Table */}
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr>
                    <th colSpan="5" className="border border-black px-2 py-1 text-center font-bold text-xs bg-gray-800 text-white">
                      <div>WIDE RANGE ACHIEVEMENT TEST: FIFTH (INDIAN EDITION)</div>
                      <div>(ENGLISH)</div>
                    </th>
                  </tr>
                  <tr className="bg-gray-200">
                    <th className="border border-black px-2 py-1 text-left font-bold text-xs">Subtest/ Composite</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Raw Score</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Standard Score</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Age Equivalent</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">Descriptive Category</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.scores.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-black px-2 py-1 text-xs font-bold">
                        <input type="text" value={item.name} onChange={(e) => handleScoreChange(index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.raw} onChange={(e) => handleScoreChange(index, 'raw', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.standard} onChange={(e) => handleScoreChange(index, 'standard', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.ageEquiv} onChange={(e) => handleScoreChange(index, 'ageEquiv', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.descriptor} onChange={(e) => handleScoreChange(index, 'descriptor', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Footer Note */}
              <div className="mb-4">
                <input type="text" value={formData.footerNote} onChange={(e) => handleChange('footerNote', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 italic" style={{ fontSize: '9pt' }} />
              </div>
              
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

export default SimpleWRAT5EngTemplate;
