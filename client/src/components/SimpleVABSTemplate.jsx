import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// Vineland Adaptive Behavior Scales (VABS) Template
const SimpleVABSTemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "VINELAND ADAPTIVE BEHAVIOR SCALES (VABS)",
    description: "The Vineland Adaptive Behavior Scales assesses adaptive functioning in individuals from birth to adulthood. It measures four major domains: Communication, Daily Living Skills, Socialization, and Motor Skills.",
    examineeName: "ABC",
    chronologicalAge: "16 years 2 months",
    
    domains: [
      { name: "Communication", subdomain: "Receptive, Expressive, Written", vScore: "85", percentile: "16", level: "Low Average" },
      { name: "Daily Living Skills", subdomain: "Personal, Domestic, Community", vScore: "78", percentile: "7", level: "Low" },
      { name: "Socialization", subdomain: "Interpersonal, Play & Leisure, Coping", vScore: "82", percentile: "12", level: "Low Average" },
      { name: "Motor Skills", subdomain: "Fine, Gross", vScore: "95", percentile: "37", level: "Average" }
    ],
    
    adaptiveBehaviorComposite: { vScore: "80", percentile: "9", level: "Low Average", confidenceInterval: "77-83" },
    
    interpretation: "The VABS results indicate that ABC demonstrates low average adaptive functioning overall. Daily living skills represent a particular area of concern, showing significant deficits in personal, domestic, and community functioning. Communication skills are also in the low average range, with particular difficulties in expressive communication. Motor skills are relatively preserved. These findings suggest that ABC requires substantial support in daily living activities and would benefit from targeted intervention in independent living skills."
  });

  const printRef = useRef();

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleDomainChange = (index, field, value) => {
    const newDomains = [...formData.domains];
    newDomains[index] = { ...newDomains[index], [field]: value };
    setFormData(prev => ({ ...prev, domains: newDomains }));
  };
  
  const handleCompositeChange = (field, value) => {
    setFormData(prev => ({ ...prev, adaptiveBehaviorComposite: { ...prev.adaptiveBehaviorComposite, [field]: value } }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>VABS</title>
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
            .subdomain { font-size: 8pt; font-style: italic; font-weight: normal; }
            .composite-row { background-color: #f5f5f5; }
            .interpretation { margin-top: 15px; text-align: justify; }
          </style>
        </head>
        <body>
          <div class="title">${formData.title}</div>
          <div class="desc">${formData.description}</div>
          <div class="info"><strong>Examinee Name:</strong> ${formData.examineeName} | <strong>Chronological Age:</strong> ${formData.chronologicalAge}</div>
          <table>
            <tr><th>Domain</th><th>Subdomains</th><th>V-Score</th><th>Percentile</th><th>Level</th></tr>
            ${formData.domains.map(d => `<tr><td>${d.name}</td><td class="subdomain">${d.subdomain}</td><td>${d.vScore}</td><td>${d.percentile}</td><td>${d.level}</td></tr>`).join('')}
            <tr class="composite-row"><td><strong>Adaptive Behavior Composite</strong></td><td></td><td><strong>${formData.adaptiveBehaviorComposite.vScore}</strong></td><td><strong>${formData.adaptiveBehaviorComposite.percentile}</strong></td><td><strong>${formData.adaptiveBehaviorComposite.level}</strong></td></tr>
          </table>
          <div style="margin-top: 10px; font-size: 9pt;"><strong>95% Confidence Interval:</strong> ${formData.adaptiveBehaviorComposite.confidenceInterval}</div>
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
            <h1 className="text-xl font-semibold text-gray-800">VABS</h1>
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
              <thead><tr className="bg-gray-200"><th className="border border-black px-2 py-1 text-left font-bold text-xs">Domain</th><th className="border border-black px-2 py-1 text-left font-bold text-xs">Subdomains</th><th className="border border-black px-2 py-1 text-center font-bold text-xs">V-Score</th><th className="border border-black px-2 py-1 text-center font-bold text-xs">Percentile</th><th className="border border-black px-2 py-1 text-center font-bold text-xs">Level</th></tr></thead>
              <tbody>{formData.domains.map((item, index) => (<tr key={index}><td className="border border-black px-2 py-1 text-xs font-bold"><input type="text" value={item.name} onChange={(e) => handleDomainChange(index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-xs italic"><input type="text" value={item.subdomain} onChange={(e) => handleDomainChange(index, 'subdomain', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 italic" style={{ fontSize: '8pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs"><input type="text" value={item.vScore} onChange={(e) => handleDomainChange(index, 'vScore', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs"><input type="text" value={item.percentile} onChange={(e) => handleDomainChange(index, 'percentile', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs"><input type="text" value={item.level} onChange={(e) => handleDomainChange(index, 'level', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td></tr>))}<tr className="bg-gray-100"><td className="border border-black px-2 py-1 text-xs font-bold"><strong>Adaptive Behavior Composite</strong></td><td className="border border-black px-2 py-1"></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.adaptiveBehaviorComposite.vScore} onChange={(e) => handleCompositeChange('vScore', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.adaptiveBehaviorComposite.percentile} onChange={(e) => handleCompositeChange('percentile', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td><td className="border border-black px-2 py-1 text-center text-xs font-bold"><input type="text" value={formData.adaptiveBehaviorComposite.level} onChange={(e) => handleCompositeChange('level', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></td></tr></tbody>
            </table>
            <div className="mb-4" style={{ fontSize: '9pt' }}><span className="font-bold">95% Confidence Interval: </span><input type="text" value={formData.adaptiveBehaviorComposite.confidenceInterval} onChange={(e) => handleCompositeChange('confidenceInterval', e.target.value)} className="bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} /></div>
            <div><textarea value={formData.interpretation} onChange={(e) => handleChange('interpretation', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={4} /></div>
          </div>
          <div className="bg-blue-50 border-t border-blue-100 px-8 py-4"><p className="text-sm text-blue-800"><strong>Instructions:</strong> All fields are editable. Click on any text to edit. Click "Print / PDF" to generate a printable report.</p></div>
        </div>
      </div>
    </div>
  );
};

export default SimpleVABSTemplate;
