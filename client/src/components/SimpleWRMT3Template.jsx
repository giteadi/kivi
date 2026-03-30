import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

const SimpleWRMT3Template = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "6. WOODCOCK READING MASTERY TESTS-III (WRMT-III)",
    
    intro1: "The Woodcock Reading Mastery Tests-III are individually administered, timed tests measuring Basic Skills, Reading Comprehension, Oral Reading Fluency and Listening Comprehension.",
    
    areaTestsHeader: "Area tests of the Woodcock Reading Mastery Tests-III include:",
    
    basicSkillsDesc: "Basic Skills: Measures the ability to read words and includes the sub tests: Word Identification and Word Attack.",
    
    readingCompDesc: "Reading Comprehension: Measures understanding of words and the ability to read and understand and includes the sub tests: Word Comprehension-Antonyms, Synonyms, Analogies and Passage Comprehension.",
    
    oralFluencyDesc: "Oral Reading Fluency: Measures the ability to read fluently and integrate reading abilities such as decoding, expression, and phrasing.",
    
    totalTestNote: "The above sub tests are used to calculate the students' Total Test Performance.",
    
    listeningCompDesc: "Listening Comprehension: (not included in the Total Test Performance score*) Measures the ability to listen to short passages and verbally respond to questions about their content.",
    
    testResultsHeader: "Test Results: Standard Scores, Age Equivalents and Relative Proficiency Index*",
    
    // Main scores table with Age Equivalent and RPI
    scores: [
      { 
        name: "Word Identification:", 
        desc: "Read words in isolation.",
        standard: "", 
        ageEquiv: "", 
        rpi: "" 
      },
      { 
        name: "Word Attack:", 
        desc: "The ability to decode nonsense words.",
        standard: "", 
        ageEquiv: "", 
        rpi: "" 
      },
      { 
        name: "BASIC SKILLS", 
        desc: "",
        standard: "", 
        ageEquiv: "", 
        rpi: "",
        isComposite: true
      },
      { 
        name: "Word Comprehension:", 
        desc: "",
        standard: "", 
        ageEquiv: "", 
        rpi: "" 
      },
      { 
        name: "Antonyms", 
        desc: "provide an opposite word.",
        standard: "", 
        ageEquiv: "", 
        rpi: "",
        isSubtest: true
      },
      { 
        name: "Synonyms", 
        desc: "provide a word with a similar meaning.",
        standard: "", 
        ageEquiv: "", 
        rpi: "",
        isSubtest: true
      },
      { 
        name: "Analogies", 
        desc: "compare a pair of words and use the same relationship to create another pair.",
        standard: "", 
        ageEquiv: "", 
        rpi: "",
        isSubtest: true
      },
      { 
        name: "Passage Comprehension:", 
        desc: "Read a short passage and provide the missing word.",
        standard: "", 
        ageEquiv: "", 
        rpi: "" 
      },
      { 
        name: "READING COMPREHENSION", 
        desc: "",
        standard: "", 
        ageEquiv: "", 
        rpi: "",
        isComposite: true
      },
      { 
        name: "Listening Comprehension:", 
        desc: "Listen to short passages and verbally respond to questions about their content.",
        standard: "", 
        ageEquiv: "", 
        rpi: "" 
      }
    ],
    
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
          <title>WRMT-III</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 750px; margin: 0 auto; padding: 15px; color: #000; }
            .report-box { border: 1px solid #000; padding: 15px; max-width: 750px; }
            .title { font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px; text-decoration: underline; }
            .intro { font-size: 10pt; text-align: justify; margin-bottom: 8px; }
            .area-header { font-size: 10pt; font-weight: bold; margin: 10px 0 5px 0; }
            .area-desc { font-size: 10pt; text-align: justify; margin-bottom: 5px; margin-left: 0; }
            .test-results-header { font-size: 10pt; font-weight: bold; margin: 15px 0 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt; }
            th, td { border: 1px solid #000; padding: 4px 6px; text-align: center; vertical-align: top; }
            th { font-weight: bold; background-color: #333; color: white; }
            .col-header { background-color: #e8e8e8; color: black; font-weight: bold; }
            td:first-child { text-align: left; }
            .test-name { font-weight: bold; }
            .test-desc { font-weight: normal; font-size: 8pt; display: block; margin-top: 2px; }
            .composite-row { background-color: #cce5ff; font-weight: bold; }
            .composite-row td { font-weight: bold; }
            .subtest-row { font-weight: normal; }
            .subtest-row td:first-child { padding-left: 20px; font-weight: normal; }
            .subtest-name { font-weight: bold; }
            .subtest-desc { font-size: 8pt; display: block; margin-top: 2px; }
            .interpretation { margin-top: 15px; text-align: justify; font-size: 10pt; }
          </style>
        </head>
        <body>
          <div class="report-box">
            <div class="title">${formData.title}</div>
            <div class="intro">${formData.intro1}</div>
            <div class="area-header">${formData.areaTestsHeader}</div>
            
            <div class="area-desc">
              <strong>Basic Skills:</strong> ${formData.basicSkillsDesc.replace('Basic Skills: ', '')}
            </div>
            
            <div class="area-desc">
              <strong>Reading Comprehension:</strong> ${formData.readingCompDesc.replace('Reading Comprehension: ', '')}
            </div>
            
            <div class="area-desc">
              <strong>Oral Reading Fluency:</strong> ${formData.oralFluencyDesc.replace('Oral Reading Fluency: ', '')}
            </div>
            
            <div class="area-desc">${formData.totalTestNote}</div>
            
            <div class="area-desc">
              <strong>Listening Comprehension:</strong> ${formData.listeningCompDesc.replace('Listening Comprehension: ', '')}
            </div>
            
            <div class="test-results-header">${formData.testResultsHeader}</div>
            
            <table>
              <tr>
                <th class="col-header">&nbsp;</th>
                <th class="col-header">Standard Scores</th>
                <th class="col-header">Age Equivalent</th>
                <th class="col-header">RPI</th>
              </tr>
              ${formData.scores.map(s => {
                let rowClass = '';
                if (s.isComposite) rowClass = 'composite-row';
                else if (s.isSubtest) rowClass = 'subtest-row';
                
                let nameCell = '';
                if (s.isSubtest) {
                  nameCell = '<span class="subtest-name">' + s.name + '</span><span class="subtest-desc">' + s.desc + '</span>';
                } else if (s.desc) {
                  nameCell = '<span class="test-name">' + s.name + '</span><span class="test-desc">' + s.desc + '</span>';
                } else {
                  nameCell = '<span class="test-name">' + s.name + '</span>';
                }
                
                return `
                <tr class="${rowClass}">
                  <td>${nameCell}</td>
                  <td>${s.standard}</td>
                  <td>${s.ageEquiv}</td>
                  <td>${s.rpi}</td>
                </tr>
                `;
              }).join('')}
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
            <h1 className="text-xl font-semibold text-gray-800">WRMT-III</h1>
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
                <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '11pt', textDecoration: 'underline' }} />
              </div>
              
              {/* Intro 1 */}
              <div className="mb-3">
                <textarea value={formData.intro1} onChange={(e) => handleChange('intro1', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
              
              {/* Area Tests Header */}
              <div className="mb-2 font-bold" style={{ fontSize: '10pt' }}>
                <input type="text" value={formData.areaTestsHeader} onChange={(e) => handleChange('areaTestsHeader', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '10pt' }} />
              </div>
              
              {/* Basic Skills Description */}
              <div className="mb-2">
                <span style={{ fontWeight: 'bold', fontSize: '10pt' }}>Basic Skills: </span>
                <textarea value={formData.basicSkillsDesc.replace('Basic Skills: ', '')} onChange={(e) => handleChange('basicSkillsDesc', 'Basic Skills: ' + e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
              
              {/* Reading Comprehension Description */}
              <div className="mb-2">
                <span style={{ fontWeight: 'bold', fontSize: '10pt' }}>Reading Comprehension: </span>
                <textarea value={formData.readingCompDesc.replace('Reading Comprehension: ', '')} onChange={(e) => handleChange('readingCompDesc', 'Reading Comprehension: ' + e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
              
              {/* Oral Fluency Description */}
              <div className="mb-2">
                <span style={{ fontWeight: 'bold', fontSize: '10pt' }}>Oral Reading Fluency: </span>
                <textarea value={formData.oralFluencyDesc.replace('Oral Reading Fluency: ', '')} onChange={(e) => handleChange('oralFluencyDesc', 'Oral Reading Fluency: ' + e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
              
              {/* Total Test Note */}
              <div className="mb-2">
                <textarea value={formData.totalTestNote} onChange={(e) => handleChange('totalTestNote', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
              
              {/* Listening Comprehension */}
              <div className="mb-4">
                <span style={{ fontWeight: 'bold', fontSize: '10pt' }}>Listening Comprehension: </span>
                <textarea value={formData.listeningCompDesc.replace('Listening Comprehension: ', '')} onChange={(e) => handleChange('listeningCompDesc', 'Listening Comprehension: ' + e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
              
              {/* Test Results Header */}
              <div className="mb-2 font-bold" style={{ fontSize: '10pt' }}>
                <input type="text" value={formData.testResultsHeader} onChange={(e) => handleChange('testResultsHeader', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '10pt' }} />
              </div>
              
              {/* Main Scores Table */}
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs bg-gray-800 text-white">&nbsp;</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs bg-gray-200">Standard Scores</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs bg-gray-200">Age Equivalent</th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs bg-gray-200">RPI</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.scores.map((item, index) => (
                    <tr key={index} className={item.isComposite ? 'bg-blue-100 font-bold' : item.isSubtest ? '' : 'font-bold'}>
                      <td className="border border-black px-2 py-1 text-xs" style={{ paddingLeft: item.isSubtest ? '20px' : '4px' }}>
                        <div>
                          <span className={item.isSubtest ? 'font-normal' : 'font-bold'} style={{ fontSize: '9pt' }}>
                            <input type="text" value={item.name} onChange={(e) => handleScoreChange(index, 'name', e.target.value)} className="bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt', fontWeight: item.isSubtest ? 'normal' : 'bold' }} />
                          </span>
                          {item.desc && (
                            <span style={{ fontSize: '8pt', display: 'block', marginTop: '2px' }}>
                              <input type="text" value={item.desc} onChange={(e) => handleScoreChange(index, 'desc', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-normal" style={{ fontSize: '8pt' }} />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.standard} onChange={(e) => handleScoreChange(index, 'standard', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.ageEquiv} onChange={(e) => handleScoreChange(index, 'ageEquiv', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rpi} onChange={(e) => handleScoreChange(index, 'rpi', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
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

export default SimpleWRMT3Template;
