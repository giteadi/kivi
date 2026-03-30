import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

const SimpleDiagnosticReportTemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "7. DIAGNOSTIC IMPRESSION",
    
    diagnosticIntro: "According to the Diagnostic and Statistical Manual of Mental Disorders 5th Edition (DSM 5),",
    
    patientName: "ABC",
    
    diagnosis: "Autism Spectrum Disorder",
    
    diagnosticDesc: `meets the criteria for '${'Autism Spectrum Disorder'}', with substantial support for both deficits in social social communication, as well as restricted and repetitive patterns of behaviour.`,
    
    recommendationsHeader: "8. RECOMMENDATIONS",
    
    recommendationsIntro: "will benefit from the following recommendations:",
    
    recommendations: [
      "Provide ABC with a daily schedule that is easily accessible and give him 5-minute prompts before a transition to ease his anxiety around this area of difficulty for him.",
      "Continue to provide ABC with Occupational Therapy sessions.",
      "Provide him with Speech and language therapy to help him build his communication skills.",
      "Use visual strategies to help student focus, understand a change in routine, and help with repetitive behaviour.",
      "Use the 'power card' strategy to teach target behaviour.",
      "Use 'circumscribed interests' (CI's) to increase desirable behaviour and academic engagement.",
      "He needs to undergo Remedial sessions for him to cope with his academics.",
      "ABC can attend a Regular school, if accompanied by a shadow teacher",
      "Use a multisensory approach to instructions",
      "Use differentiated instructions",
      "Use strategies like role-play, and video-modelling to help him develop social skills.",
      "Reinforce positive behaviour and celebrate strengths.",
      "ABC should start with Occupational Therapy at the earliest."
    ],
    
    concessionsHeader: "9. CONCESSIONS/ACCOMMODATIONS",
    
    concessions: [
      "Extended time of 50% in all in-class assessments to complete the tasks, as well as during examinations.",
      "Modified question papers",
      "Oral examination can be considered in place of written examination",
      "Provide a writer and reader",
      "Provide a shadow teacher",
      "Supervised rest breaks",
      "Separate room for examinations",
      "Use of calculator",
      "Exemption from the Second and Third Languages",
      "Exempted from having to write answers in detail during exams"
    ],
    
    footerNote: "The above recommended accommodations are based on the standard scores obtained during the assessment. However, the school will remain the best judge of all accommodations that this student needs.",
    
    interpretation: ""
  });

  const printRef = useRef();

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleRecommendationChange = (index, value) => {
    const newRecs = [...formData.recommendations];
    newRecs[index] = value;
    setFormData(prev => ({ ...prev, recommendations: newRecs }));
  };
  
  const handleConcessionChange = (index, value) => {
    const newConcs = [...formData.concessions];
    newConcs[index] = value;
    setFormData(prev => ({ ...prev, concessions: newConcs }));
  };
  
  const addRecommendation = () => {
    setFormData(prev => ({ ...prev, recommendations: [...prev.recommendations, ""] }));
  };
  
  const addConcession = () => {
    setFormData(prev => ({ ...prev, concessions: [...prev.concessions, ""] }));
  };
  
  const removeRecommendation = (index) => {
    const newRecs = formData.recommendations.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, recommendations: newRecs }));
  };
  
  const removeConcession = (index) => {
    const newConcs = formData.concessions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, concessions: newConcs }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Diagnostic Report</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 750px; margin: 0 auto; padding: 15px; color: #000; }
            .report-box { border: 1px solid #000; padding: 15px; max-width: 750px; }
            .section-header { font-size: 10pt; font-weight: bold; text-align: left; margin: 15px 0 8px 0; }
            .section-header:first-of-type { margin-top: 0; }
            .intro { font-size: 10pt; text-align: justify; margin-bottom: 8px; }
            .bullet-list { margin: 0; padding-left: 20px; }
            .bullet-list li { font-size: 10pt; margin-bottom: 4px; text-align: justify; }
            .patient-name { font-weight: bold; }
            .diagnosis { font-weight: bold; text-decoration: underline; font-style: italic; }
            .footer-note { font-size: 9pt; margin-top: 15px; font-style: italic; text-align: justify; }
            .interpretation { margin-top: 15px; text-align: justify; font-size: 10pt; }
          </style>
        </head>
        <body>
          <div class="report-box">
            <div class="section-header">${formData.title}</div>
            <div class="intro">
              ${formData.diagnosticIntro} <span class="patient-name">${formData.patientName}</span> 
              <span class="diagnosis">${formData.diagnosis}</span>, ${formData.diagnosticDesc.replace(`${formData.patientName} meets the criteria for '${formData.diagnosis}', `, '')}
            </div>
            
            <div class="section-header">${formData.recommendationsHeader}</div>
            <div class="intro">
              <span class="patient-name">${formData.patientName}</span> ${formData.recommendationsIntro.replace('will benefit', 'will benefit')}
            </div>
            <ul class="bullet-list">
              ${formData.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ul>
            
            <div class="section-header">${formData.concessionsHeader}</div>
            <ul class="bullet-list">
              ${formData.concessions.map(c => `<li>${c}</li>`).join('')}
            </ul>
            
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
            <h1 className="text-xl font-semibold text-gray-800">Diagnostic Report</h1>
          </div>
          <button onClick={handlePrint} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FiPrinter className="w-4 h-4" /><span>Print / PDF</span></button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div ref={printRef} className="p-8" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
            {/* Outer Box Border */}
            <div style={{ border: '1px solid #000', padding: '20px', maxWidth: '750px' }}>
              
              {/* Section 7: Diagnostic Impression */}
              <div className="mb-6">
                <div className="mb-3">
                  <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '11pt' }} />
                </div>
                
                <div className="mb-2 text-justify" style={{ fontSize: '10pt' }}>
                  <textarea value={formData.diagnosticIntro} onChange={(e) => handleChange('diagnosticIntro', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
                  <span style={{ fontWeight: 'bold' }}>
                    <input type="text" value={formData.patientName} onChange={(e) => handleChange('patientName', e.target.value)} className="font-bold bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt', width: '60px' }} />
                  </span>
                  <span style={{ fontWeight: 'bold', textDecoration: 'underline', fontStyle: 'italic' }}>
                    <input type="text" value={formData.diagnosis} onChange={(e) => handleChange('diagnosis', e.target.value)} className="font-bold bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt', textDecoration: 'underline', fontStyle: 'italic', width: '200px' }} />
                  </span>
                  <textarea value={formData.diagnosticDesc} onChange={(e) => handleChange('diagnosticDesc', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
                </div>
              </div>
              
              {/* Section 8: Recommendations */}
              <div className="mb-6">
                <div className="mb-2">
                  <input type="text" value={formData.recommendationsHeader} onChange={(e) => handleChange('recommendationsHeader', e.target.value)} className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '11pt' }} />
                </div>
                
                <div className="mb-3" style={{ fontSize: '10pt' }}>
                  <span style={{ fontWeight: 'bold' }}>
                    <input type="text" value={formData.patientName} onChange={(e) => handleChange('patientName', e.target.value)} className="font-bold bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt', width: '60px' }} />
                  </span>
                  <textarea value={formData.recommendationsIntro} onChange={(e) => handleChange('recommendationsIntro', e.target.value)} className="bg-transparent focus:outline-none focus:bg-blue-50 resize-none" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={1} />
                </div>
                
                <ul className="space-y-2" style={{ paddingLeft: '20px' }}>
                  {formData.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span style={{ fontSize: '10pt' }}>➢</span>
                      <textarea value={rec} onChange={(e) => handleRecommendationChange(index, e.target.value)} className="flex-1 bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={2} />
                      <button onClick={() => removeRecommendation(index)} className="text-red-500 hover:text-red-700 text-xs px-2">✕</button>
                    </li>
                  ))}
                </ul>
                <button onClick={addRecommendation} className="mt-3 px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200">+ Add Recommendation</button>
              </div>
              
              {/* Section 9: Concessions/Accommodations */}
              <div className="mb-6">
                <div className="mb-3">
                  <input type="text" value={formData.concessionsHeader} onChange={(e) => handleChange('concessionsHeader', e.target.value)} className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '11pt' }} />
                </div>
                
                <ul className="space-y-2" style={{ paddingLeft: '20px' }}>
                  {formData.concessions.map((conc, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span style={{ fontSize: '10pt' }}>➢</span>
                      <textarea value={conc} onChange={(e) => handleConcessionChange(index, e.target.value)} className="flex-1 bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={1} />
                      <button onClick={() => removeConcession(index)} className="text-red-500 hover:text-red-700 text-xs px-2">✕</button>
                    </li>
                  ))}
                </ul>
                <button onClick={addConcession} className="mt-3 px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200">+ Add Concession</button>
              </div>
              
              {/* Footer Note */}
              <div className="mb-4">
                <textarea value={formData.footerNote} onChange={(e) => handleChange('footerNote', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none italic text-justify" style={{ fontSize: '9pt', lineHeight: '1.3' }} rows={3} />
              </div>
              
              {/* Interpretation */}
              <div className="mb-4">
                <span className="font-bold" style={{ fontSize: '10pt' }}>Interpretation:</span>
                <textarea value={formData.interpretation} onChange={(e) => handleChange('interpretation', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={4} />
              </div>
              
            </div> {/* End of outer box border */}
          </div>
          <div className="bg-blue-50 border-t border-blue-100 px-8 py-4"><p className="text-sm text-blue-800"><strong>Instructions:</strong> All fields are editable. Click on any text to edit. Use + and ✕ buttons to add/remove bullets. Click "Print / PDF" to generate a printable report.</p></div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDiagnosticReportTemplate;
