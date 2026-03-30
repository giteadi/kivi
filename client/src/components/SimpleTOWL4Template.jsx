import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// Test of Written Language - Fourth Edition (TOWL-4) Template
const SimpleTOWL4Template = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "TEST OF WRITTEN LANGUAGE (TOWL-4)",
    
    intro: "The TOWL-4 is a norm-referenced, reliable, and valid test of written language.",
    
    description: "The Test of Written Language-TOWL-4 is an inclusive assessment measuring seven skill areas, and several components of written language which are later combined to form three composite scores Contrived Writing, Spontaneous Writing and Overall Writing. The composites are reported as quotients, with average scores ranging from 90-110 with a standard deviation of 15 points. The subtests have an average range of 8-12 with a standard deviation of 3 points. The Contrived Writing measures the smallest units of written discourse that includes vocabulary, spelling, punctuation, logical sentences and sentence combining. The Spontaneous Writing composite measures functional writing ability as related to an actual passage. It includes contextual conventions and Story Composition. The Overall Writing combines all the subtests and provides an overall quotient related to writing achievement.",
    
    subtestsSectionTitle: "The TOWL-4 Subtests",
    subtestsIntro: "The TOWL-4 consists of 7 subtests. Evaluation of subtest performance is useful in generating hypotheses or speculations about why an examinee did either well or poorly on a composite. Decisions about diagnosis and placement should rest on the interpretation of the composite values. The subtests and their particular format and contents are listed below.",
    
    subtestsHeader: "THE SUBTESTS",
    subtestsNote: "Subtests 1 through 5 use contrived, traditional formats. Subtests 6 and 7 use a spontaneous written story to assess important aspects of language.",
    
    subtests: [
      { number: "1", code: "VO", name: "Vocabulary", description: "The student writes a sentence that incorporates a stimulus word." },
      { number: "2", code: "SP", name: "Spelling", description: "The student writes sentences from dictation, taking particular care to make proper use of spelling rules." },
      { number: "3", code: "PU", name: "Punctuation", description: "The student writes sentences from dictation, taking particular care to make proper use of punctuation and capitalization rules." },
      { number: "4", code: "LS", name: "Logical Sentences", description: "The student edits an illogical sentence so that it makes better sense." },
      { number: "5", code: "SC", name: "Sentence Combining", description: "The student integrates the meaning of several short sentences into one grammatically correct written sentence." },
      { number: "6", code: "CC", name: "Contextual Conventions", description: "The student writes a story in response to a stimulus picture. Points are earned for satisfying specific arbitrary requirements relative to orthographic and grammatic conventions." },
      { number: "7", code: "ST", name: "Story Composition", description: "The student writes a story in response to a stimulus picture. Points are earned for satisfying specific arbitrary requirements relative to plot, character development, and other story elements." }
    ],
    
    scoresHeader: "SUBTEST SCORES",
    rawScoresHeader: "Raw\nScores",
    scaledScoresHeader: "Scaled\nScores",
    percentileRanksHeader: "Percentile\nRanks",
    
    contrivedSubtests: [
      { name: "Vocabulary", rawScore: "", scaledScore: "", percentileRank: "" },
      { name: "Spelling", rawScore: "", scaledScore: "", percentileRank: "" },
      { name: "Punctuation", rawScore: "", scaledScore: "", percentileRank: "" },
      { name: "Logical Sentences", rawScore: "", scaledScore: "", percentileRank: "" },
      { name: "Sentence Combining", rawScore: "", scaledScore: "", percentileRank: "" }
    ],
    
    contrivedIndex: { score: "", label: "Contrived Writing Index" },
    
    spontaneousSubtests: [
      { name: "Contextual Conventions", rawScore: "", scaledScore: "", percentileRank: "" },
      { name: "Story Composition", rawScore: "", scaledScore: "", percentileRank: "" }
    ],
    
    spontaneousIndex: { score: "", label: "Spontaneous Writing Index" },
    overallIndex: { score: "", label: "Overall Writing Index" },
    
    interpretation: ""
  });

  const printRef = useRef();

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleSubtestChange = (section, index, field, value) => {
    const newSection = [...formData[section]];
    newSection[index] = { ...newSection[index], [field]: value };
    setFormData(prev => ({ ...prev, [section]: newSection }));
  };
  
  const handleIndexChange = (indexName, field, value) => {
    setFormData(prev => ({ ...prev, [indexName]: { ...prev[indexName], [field]: value } }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>TOWL-4</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 750px; margin: 0 auto; padding: 15px; color: #000; }
            .report-box { border: 1px solid #000; padding: 15px; max-width: 750px; }
            .title { font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px; }
            .intro { font-size: 10pt; margin-bottom: 15px; font-style: italic; }
            .desc { font-size: 10pt; text-align: justify; margin-bottom: 15px; }
            .section-title { font-size: 10pt; font-weight: bold; text-align: left; margin: 15px 0 5px 0; }
            .section-header { font-size: 10pt; font-weight: bold; text-align: left; margin: 10px 0 5px 0; }
            .subtests-intro { font-size: 10pt; text-align: justify; margin-bottom: 10px; }
            .subtest-item { font-size: 10pt; margin: 8px 0; text-align: justify; }
            .subtest-item strong { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt; }
            th, td { border: 1px solid #000; padding: 4px 6px; text-align: center; }
            th { font-weight: bold; }
            td:first-child { text-align: left; font-weight: bold; }
            .index-row { font-weight: bold; }
            .interpretation { margin-top: 15px; text-align: justify; font-size: 10pt; }
          </style>
        </head>
        <body>
          <div class="report-box">
            <div class="title">${formData.title}</div>
            <div class="intro">${formData.intro}</div>
            <div class="desc">${formData.description}</div>
            
            <div class="section-title">${formData.subtestsSectionTitle}</div>
            <div class="subtests-intro">${formData.subtestsIntro}</div>
            
            <div class="section-header">${formData.subtestsHeader}</div>
            <div class="subtests-intro">${formData.subtestsNote}</div>
            
            ${formData.subtests.map(s => `
              <div class="subtest-item">
                <strong>Subtest ${s.number}: ${s.name} (${s.code})</strong><br/>
                ${s.description}
              </div>
            `).join('')}
            
            <div class="section-header" style="margin-top: 20px;">${formData.scoresHeader}</div>
            <table>
              <tr>
                <th>Subtest</th>
                <th>${formData.rawScoresHeader.replace(/\n/g, '<br/>')}</th>
                <th>${formData.scaledScoresHeader.replace(/\n/g, '<br/>')}</th>
                <th>${formData.percentileRanksHeader.replace(/\n/g, '<br/>')}</th>
              </tr>
              
              ${formData.contrivedSubtests.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.rawScore}</td>
                  <td>${s.scaledScore}</td>
                  <td>${s.percentileRank}</td>
                </tr>
              `).join('')}
              <tr class="index-row">
                <td colspan="2">${formData.contrivedIndex.label} = ${formData.contrivedIndex.score}</td>
                <td colspan="2"></td>
              </tr>
              
              ${formData.spontaneousSubtests.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.rawScore}</td>
                  <td>${s.scaledScore}</td>
                  <td>${s.percentileRank}</td>
                </tr>
              `).join('')}
              <tr class="index-row">
                <td colspan="2">${formData.spontaneousIndex.label} = ${formData.spontaneousIndex.score}</td>
                <td colspan="2"></td>
              </tr>
              
              <tr class="index-row">
                <td colspan="4">${formData.overallIndex.label} = ${formData.overallIndex.score}</td>
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
            <h1 className="text-xl font-semibold text-gray-800">TOWL-4</h1>
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
              
              {/* Intro */}
              <div className="mb-4">
                <input type="text" value={formData.intro} onChange={(e) => handleChange('intro', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 italic" style={{ fontSize: '10pt' }} />
              </div>
              
              {/* Description */}
              <div className="mb-4">
                <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={8} />
              </div>
              
              {/* Subtests Section Title */}
              <div className="mb-2">
                <input type="text" value={formData.subtestsSectionTitle} onChange={(e) => handleChange('subtestsSectionTitle', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '10pt' }} />
              </div>
              
              {/* Subtests Intro */}
              <div className="mb-2">
                <textarea value={formData.subtestsIntro} onChange={(e) => handleChange('subtestsIntro', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={3} />
              </div>
              
              {/* Subtests Header */}
              <div className="mb-2">
                <input type="text" value={formData.subtestsHeader} onChange={(e) => handleChange('subtestsHeader', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '10pt' }} />
              </div>
              
              {/* Subtests Note */}
              <div className="mb-2">
                <textarea value={formData.subtestsNote} onChange={(e) => handleChange('subtestsNote', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
              </div>
              
              {/* Subtests List */}
              {formData.subtests.map((item, index) => (
                <div className="mb-3" key={index}>
                  <div className="font-bold" style={{ fontSize: '10pt' }}>
                    <input type="text" value={`Subtest ${item.number}: ${item.name} (${item.code})`} onChange={(e) => {
                      const parts = e.target.value.match(/Subtest (\d+): (.+) \((.+)\)/);
                      if (parts) {
                        const newSubtests = [...formData.subtests];
                        newSubtests[index] = { ...newSubtests[index], number: parts[1], name: parts[2], code: parts[3] };
                        setFormData(prev => ({ ...prev, subtests: newSubtests }));
                      }
                    }} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '10pt' }} />
                  </div>
                  <div style={{ fontSize: '10pt' }}>
                    <input type="text" value={item.description} onChange={(e) => {
                      const newSubtests = [...formData.subtests];
                      newSubtests[index] = { ...newSubtests[index], description: e.target.value };
                      setFormData(prev => ({ ...prev, subtests: newSubtests }));
                    }} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt' }} />
                  </div>
                </div>
              ))}
              
              {/* Scores Section */}
              <div className="mt-6 mb-2">
                <input type="text" value={formData.scoresHeader} onChange={(e) => handleChange('scoresHeader', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '10pt' }} />
              </div>
              
              {/* Table */}
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr>
                    <th className="border border-black px-2 py-1 text-left font-bold text-xs" style={{ width: '40%' }}>
                      <input type="text" value="Subtest" className="w-full bg-transparent font-bold focus:outline-none" style={{ fontSize: '9pt' }} />
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
                  {/* Contrived Subtests */}
                  {formData.contrivedSubtests.map((item, index) => (
                    <tr key={`conv-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs font-bold">
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('contrivedSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rawScore} onChange={(e) => handleSubtestChange('contrivedSubtests', index, 'rawScore', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.scaledScore} onChange={(e) => handleSubtestChange('contrivedSubtests', index, 'scaledScore', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.percentileRank} onChange={(e) => handleSubtestChange('contrivedSubtests', index, 'percentileRank', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                    </tr>
                  ))}
                  {/* Contrived Index Row */}
                  <tr className="font-bold">
                    <td className="border border-black px-2 py-1 text-xs" colSpan="2">
                      <input type="text" value={formData.contrivedIndex.label} onChange={(e) => handleIndexChange('contrivedIndex', 'label', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      <span> = </span>
                      <input type="text" value={formData.contrivedIndex.score} onChange={(e) => handleIndexChange('contrivedIndex', 'score', e.target.value)} className="w-16 bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs font-bold" colSpan="2"></td>
                  </tr>
                  
                  {/* Spontaneous Subtests */}
                  {formData.spontaneousSubtests.map((item, index) => (
                    <tr key={`spon-${index}`}>
                      <td className="border border-black px-2 py-1 text-xs font-bold">
                        <input type="text" value={item.name} onChange={(e) => handleSubtestChange('spontaneousSubtests', index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.rawScore} onChange={(e) => handleSubtestChange('spontaneousSubtests', index, 'rawScore', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.scaledScore} onChange={(e) => handleSubtestChange('spontaneousSubtests', index, 'scaledScore', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.percentileRank} onChange={(e) => handleSubtestChange('spontaneousSubtests', index, 'percentileRank', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                    </tr>
                  ))}
                  {/* Spontaneous Index Row */}
                  <tr className="font-bold">
                    <td className="border border-black px-2 py-1 text-xs" colSpan="2">
                      <input type="text" value={formData.spontaneousIndex.label} onChange={(e) => handleIndexChange('spontaneousIndex', 'label', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      <span> = </span>
                      <input type="text" value={formData.spontaneousIndex.score} onChange={(e) => handleIndexChange('spontaneousIndex', 'score', e.target.value)} className="w-16 bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                    </td>
                    <td className="border border-black px-2 py-1 text-center text-xs font-bold" colSpan="2"></td>
                  </tr>
                  
                  {/* Overall Index Row */}
                  <tr className="font-bold">
                    <td className="border border-black px-2 py-1 text-xs" colSpan="4" style={{ textAlign: 'center' }}>
                      <input type="text" value={formData.overallIndex.label} onChange={(e) => handleIndexChange('overallIndex', 'label', e.target.value)} className="bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      <span> = </span>
                      <input type="text" value={formData.overallIndex.score} onChange={(e) => handleIndexChange('overallIndex', 'score', e.target.value)} className="w-16 bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
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

export default SimpleTOWL4Template;
