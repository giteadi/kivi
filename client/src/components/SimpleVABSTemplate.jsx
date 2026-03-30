import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// Vineland Adaptive Behavior Scales (VABS) Template
const SimpleVABSTemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: "VINELAND ADAPTIVE BEHAVIOUR SCALES-VABS-3",
    
    intro: "ABC's parents participated in the assessment process by completing the Vineland Adaptive Behaviour Scales. The Vineland Adaptive Behaviour Scales are an individual assessment of adaptive behaviour. Adaptive behaviour is defined as performance of the day-to-day activities necessary to take care of oneself and get along with others. Adaptive behaviour is age-based and is defined by the expectations and standards of others. Adaptive behaviour represents the typical performance rather than the ability of the individual – what a person does as opposed to what a person is capable of doing. The scale covers four adaptive behaviour domains that include Communication, Daily Living Skills, Socialization, and Motor Skills.",
    
    ratersHeader: "The Raters included in this report are:",
    raters: [
      "Parent Form",
      "Teacher Form"
    ],
    
    labelsNote: "The labels below describe ABC's standing in the three broad areas described above, plus an overall summary score:",
    adaptiveAreasNote: "Adaptive Behaviour Areas Level compared to others of his Age",
    
    // Table with Parent/Teacher ratings
    tableHeader: "Adaptive Behaviour",
    parentHeader: "Parent",
    teacherHeader: "Teacher",
    
    behaviours: [
      { name: "Communication Skills", parent: "Moderately Low", teacher: "Moderately Low" },
      { name: "Daily Living Skills", parent: "Moderately Low", teacher: "Moderately Low" },
      { name: "Social skills and relationships", parent: "Moderately Low", teacher: "Moderately Low" },
      { name: "Overall Summary Score", parent: "Moderately Low", teacher: "Moderately Low" }
    ],
    
    // Charts section
    chartsTitle: "SCORE SUMMARY PROFILE",
    parentChartTitle: "Parent Form",
    teacherChartTitle: "Teacher Form",
    
    // Interpretation
    interpretationLabel: "Interpretation",
    interpretation: "ABC's overall level of adaptive functioning is described by his score on the Adaptive Behaviour Composite (ABC). His ABC - Parent score/percentile rank is 77/6, and Teacher score/percentile is 73/5, which are well below the normative mean of 100 (the normative standard deviation is 15)."
  });

  const printRef = useRef();

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleBehaviourChange = (index, field, value) => {
    const newBehaviours = [...formData.behaviours];
    newBehaviours[index] = { ...newBehaviours[index], [field]: value };
    setFormData(prev => ({ ...prev, behaviours: newBehaviours }));
  };
  
  const handleRaterChange = (index, value) => {
    const newRaters = [...formData.raters];
    newRaters[index] = value;
    setFormData(prev => ({ ...prev, raters: newRaters }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>VABS-3</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.3; max-width: 750px; margin: 0 auto; padding: 15px; color: #000; }
            .report-box { border: 1px solid #000; padding: 15px; max-width: 750px; }
            .title { font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px; }
            .intro { font-size: 10pt; text-align: justify; margin-bottom: 15px; }
            .raters-header { font-size: 10pt; margin: 10px 0 5px 0; }
            .raters-list { font-size: 10pt; margin-left: 20px; margin-bottom: 10px; }
            .raters-list li { margin: 2px 0; }
            .labels-note { font-size: 10pt; margin: 10px 0; }
            .adaptive-areas { font-size: 10pt; font-style: italic; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt; }
            th, td { border: 1px solid #000; padding: 4px 6px; text-align: center; }
            th { font-weight: bold; background-color: #f5f5f5; }
            td:first-child { text-align: left; font-weight: bold; }
            .charts-container { display: flex; justify-content: space-between; margin: 15px 0; }
            .chart-box { width: 48%; text-align: center; border: 1px solid #ccc; padding: 10px; }
            .chart-title { font-size: 9pt; font-weight: bold; margin-bottom: 5px; }
            .chart-subtitle { font-size: 8pt; margin-bottom: 10px; }
            .interpretation-header { font-size: 10pt; font-weight: bold; margin-top: 15px; }
            .interpretation { font-size: 10pt; text-align: justify; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="report-box">
            <div class="title">${formData.title}</div>
            <div class="intro">${formData.intro}</div>
            
            <div class="raters-header">${formData.ratersHeader}</div>
            <ul class="raters-list">
              ${formData.raters.map(r => `<li>${r}</li>`).join('')}
            </ul>
            
            <div class="labels-note">${formData.labelsNote}</div>
            <div class="adaptive-areas">${formData.adaptiveAreasNote}</div>
            
            <table>
              <tr>
                <th>${formData.tableHeader}</th>
                <th>${formData.parentHeader}</th>
                <th>${formData.teacherHeader}</th>
              </tr>
              ${formData.behaviours.map(b => `
                <tr>
                  <td>${b.name}</td>
                  <td>${b.parent}</td>
                  <td>${b.teacher}</td>
                </tr>
              `).join('')}
            </table>
            
            <div class="charts-container">
              <div class="chart-box">
                <div class="chart-title">${formData.parentChartTitle}</div>
                <div class="chart-subtitle">${formData.chartsTitle}</div>
                <div style="font-size: 8pt; color: #666;">[Chart Placeholder]</div>
              </div>
              <div class="chart-box">
                <div class="chart-title">${formData.teacherChartTitle}</div>
                <div class="chart-subtitle">${formData.chartsTitle}</div>
                <div style="font-size: 8pt; color: #666;">[Chart Placeholder]</div>
              </div>
            </div>
            
            <div class="interpretation-header">${formData.interpretationLabel}</div>
            <div class="interpretation">${formData.interpretation}</div>
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
            <h1 className="text-xl font-semibold text-gray-800">VABS</h1>
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
                <textarea value={formData.intro} onChange={(e) => handleChange('intro', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify" style={{ fontSize: '10pt', lineHeight: '1.3' }} rows={8} />
              </div>
              
              {/* Raters Section */}
              <div className="mb-4">
                <input type="text" value={formData.ratersHeader} onChange={(e) => handleChange('ratersHeader', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '10pt' }} />
              </div>
              <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                {formData.raters.map((rater, index) => (
                  <li key={index} style={{ fontSize: '10pt', margin: '2px 0' }}>
                    <input type="text" value={rater} onChange={(e) => handleRaterChange(index, e.target.value)} className="bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt' }} />
                  </li>
                ))}
              </ul>
              
              {/* Labels Note */}
              <div className="mb-2">
                <input type="text" value={formData.labelsNote} onChange={(e) => handleChange('labelsNote', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '10pt' }} />
              </div>
              
              {/* Adaptive Areas Note */}
              <div className="mb-4">
                <input type="text" value={formData.adaptiveAreasNote} onChange={(e) => handleChange('adaptiveAreasNote', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 italic" style={{ fontSize: '10pt' }} />
              </div>
              
              {/* Table */}
              <table className="w-full border-collapse border border-black mb-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-black px-2 py-1 text-left font-bold text-xs">
                      <input type="text" value={formData.tableHeader} onChange={(e) => handleChange('tableHeader', e.target.value)} className="w-full bg-transparent font-bold focus:outline-none" style={{ fontSize: '9pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.parentHeader} onChange={(e) => handleChange('parentHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '9pt' }} />
                    </th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input type="text" value={formData.teacherHeader} onChange={(e) => handleChange('teacherHeader', e.target.value)} className="w-full text-center bg-transparent font-bold focus:outline-none" style={{ fontSize: '9pt' }} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.behaviours.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-black px-2 py-1 text-xs font-bold">
                        <input type="text" value={item.name} onChange={(e) => handleBehaviourChange(index, 'name', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.parent} onChange={(e) => handleBehaviourChange(index, 'parent', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                      <td className="border border-black px-2 py-1 text-center text-xs">
                        <input type="text" value={item.teacher} onChange={(e) => handleBehaviourChange(index, 'teacher', e.target.value)} className="w-full text-center bg-transparent focus:outline-none focus:bg-blue-50" style={{ fontSize: '9pt' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Charts Section */}
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
                {/* Parent Chart */}
                <div style={{ width: '48%', border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                  <input type="text" value={formData.parentChartTitle} onChange={(e) => handleChange('parentChartTitle', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold text-center" style={{ fontSize: '9pt' }} />
                  <input type="text" value={formData.chartsTitle} onChange={(e) => handleChange('chartsTitle', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 text-center" style={{ fontSize: '8pt' }} />
                  <div style={{ height: '150px', background: '#f9f9f9', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '8pt' }}>
                    [Score Summary Profile Chart]
                  </div>
                </div>
                {/* Teacher Chart */}
                <div style={{ width: '48%', border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                  <input type="text" value={formData.teacherChartTitle} onChange={(e) => handleChange('teacherChartTitle', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 font-bold text-center" style={{ fontSize: '9pt' }} />
                  <input type="text" value={formData.chartsTitle} onChange={(e) => handleChange('chartsTitle', e.target.value)} className="w-full bg-transparent focus:outline-none focus:bg-blue-50 text-center" style={{ fontSize: '8pt' }} />
                  <div style={{ height: '150px', background: '#f9f9f9', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '8pt' }}>
                    [Score Summary Profile Chart]
                  </div>
                </div>
              </div>
              
              {/* Interpretation */}
              <div className="mt-4">
                <span className="font-bold" style={{ fontSize: '10pt' }}>
                  <input type="text" value={formData.interpretationLabel} onChange={(e) => handleChange('interpretationLabel', e.target.value)} className="bg-transparent focus:outline-none focus:bg-blue-50 font-bold" style={{ fontSize: '10pt' }} />:
                </span>
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

export default SimpleVABSTemplate;
