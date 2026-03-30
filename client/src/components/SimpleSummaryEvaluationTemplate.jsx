import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

const SimpleSummaryEvaluationTemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "SUMMARY OF EVALUATION",
    
    patientName: "ABC",
    
    summaryPoints: [
      "ABC has obtained a score of 106 'Average' in General Intellectual Ability, and has obtained a score of 105 'Average' in the Gf-Gc Composite, (Fluid Intelligence) and (Crystallized Intelligence).",
      "Among the WJ-IV cognitive measures, ABC's standard scores are within the 'Superior' range in Fluid Reasoning (Gf) and Short-Term Working Memory (GWM). He has scored in the 'Average' range in Cognitive Efficiency. He has scored in the 'Low Average' range in 'Comprehension Knowledge'.",
      "Performance on The Woodcock-Johnson IV Tests of Cognitive Abilities (WJ IV COG) shows difficulty in Comp Knowledge (GC) and Letter- Pattern Matching. ABC's level of proficiency in Letter- Pattern Matching was limited (RPI 28/90).",
      "ABC has obtained a score of 118, within the 'High Average' range in Brief Achievement and a score of 106, within the 'Average' range in Broad Achievement.",
      "Among the WJ-IV achievement measures, ABC has scored in the 'High Average' range in Basic Reading Skills, Mathematics, Broad Mathematics and Academic Skills. ABC has scored in the 'Average' range in Reading, Broad Reading, Reading Fluency, Math Calculation Skills, Written Language, Broad Written Language, Written Expression Academic Fluency and Academic Applications.",
      "Performance on The Woodcock-Johnson IV Tests of Achievement (WJ IV ACH) does not show any difficulty in any of the clusters of Achievement.",
      "The Brown's EF/A Scale is indicative of indicate somewhat atypical (unlikely significant problem). The reports indicate ABC as having difficulty in the clusters of Activation, Focus and Effort."
    ],
    
    interpretation: ""
  });

  const printRef = useRef();

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handlePointChange = (index, value) => {
    const newPoints = [...formData.summaryPoints];
    newPoints[index] = value;
    setFormData(prev => ({ ...prev, summaryPoints: newPoints }));
  };
  
  const addPoint = () => {
    setFormData(prev => ({ ...prev, summaryPoints: [...prev.summaryPoints, ""] }));
  };
  
  const removePoint = (index) => {
    const newPoints = formData.summaryPoints.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, summaryPoints: newPoints }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Summary of Evaluation</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 750px; margin: 0 auto; padding: 15px; color: #000; }
            .report-box { border: 1px solid #000; padding: 15px; max-width: 750px; }
            .title { font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 15px; text-decoration: underline; }
            .bullet-list { margin: 0; padding-left: 20px; list-style: none; }
            .bullet-list li { font-size: 10pt; margin-bottom: 10px; text-align: justify; position: relative; padding-left: 15px; }
            .bullet-list li::before { content: "➢"; position: absolute; left: -15px; }
            .patient-name { font-weight: bold; }
            .interpretation { margin-top: 15px; text-align: justify; font-size: 10pt; }
          </style>
        </head>
        <body>
          <div class="report-box">
            <div class="title">${formData.title}</div>
            <ul class="bullet-list">
              ${formData.summaryPoints.map(point => `<li>${point.replace(/ABC/g, '<span class="patient-name">ABC</span>')}</li>`).join('')}
            </ul>
            
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
            <h1 className="text-xl font-semibold text-gray-800">Summary of Evaluation</h1>
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
              <div className="mb-6">
                <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '11pt', textDecoration: 'underline' }} />
              </div>
              
              {/* Summary Points */}
              <ul className="space-y-4" style={{ paddingLeft: '20px', listStyle: 'none' }}>
                {formData.summaryPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span style={{ fontSize: '10pt', flexShrink: 0 }}>➢</span>
                    <textarea value={point} onChange={(e) => handlePointChange(index, e.target.value)} className="flex-1 bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.4' }} rows={3} />
                    <button onClick={() => removePoint(index)} className="text-red-500 hover:text-red-700 text-xs px-2 flex-shrink-0">✕</button>
                  </li>
                ))}
              </ul>
              <button onClick={addPoint} className="mt-4 px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200">+ Add Summary Point</button>
              
              {/* Interpretation */}
              <div className="mt-6 mb-4">
                <span className="font-bold" style={{ fontSize: '10pt' }}>Interpretation:</span>
                <textarea value={formData.interpretation} onChange={(e) => handleChange('interpretation', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={4} />
              </div>
              
            </div> {/* End of outer box border */}
          </div>
          <div className="bg-blue-50 border-t border-blue-100 px-8 py-4"><p className="text-sm text-blue-800"><strong>Instructions:</strong> All fields are editable. Click on any text to edit. Use + and ✕ buttons to add/remove bullet points. Click "Print / PDF" to generate a printable report.</p></div>
        </div>
      </div>
    </div>
  );
};

export default SimpleSummaryEvaluationTemplate;
