import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// Educational Assessment of Children with Autism (EACA) Template
const SimpleEACATemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    // Header
    title: "3. EDUCATIONAL ASSESSMENT OF CHILDREN WITH AUTISM (EACA)",
    
    // Description
    description: "The educational assessment of children with autism consists of a checklist of skill behaviours that are functionally relevant for such children. With the focus on the triad of impairments (impairment in social interaction, delay in language and communication, and limited interests and activities) in autism, EACA views how the impairments may impact acquisition of learning skills. The test contains 48 items and have been categorized within 7 domains namely: Attention Skills, Imitation Skills, Language and Communication Skills, Cognitive Skills, Play Skills, Self-help Skills, and Behaviour Skills.",
    
    // Chart Title
    chartTitle: "Educational Assessment of Children with Autism (EACA)",
    
    // Domain Scores for Bar Chart
    domains: [
      { name: "Attending Skills", percentage: "75" },
      { name: "Imitation Skills", percentage: "80" },
      { name: "Language & Communication", percentage: "80" },
      { name: "Cognitive Skills", percentage: "45" },
      { name: "Play and Social Skills", percentage: "40" },
      { name: "Self Care", percentage: "65" },
      { name: "Behaviour Skills", percentage: "65" }
    ],
    
    // Detailed Interpretation
    interpretation: "Based on the EACA assessment, ABC demonstrates strengths in Attending Skills, Imitation Skills, and Language & Communication Skills, all scoring above 75%. However, there are notable challenges in Cognitive Skills (45%) and Play and Social Skills (40%), which fall below the 50% threshold. Self Care and Behaviour Skills are at moderate levels (65%). These results suggest that while ABC has developed foundational attention and communication abilities, there is significant need for targeted intervention in cognitive development and social play skills to support overall educational progress."
  });

  const printRef = useRef();

  const handleTitleChange = (value) => {
    setFormData(prev => ({ ...prev, title: value }));
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handleChartTitleChange = (value) => {
    setFormData(prev => ({ ...prev, chartTitle: value }));
  };

  const handleDomainChange = (index, field, value) => {
    setFormData(prev => {
      const newDomains = [...prev.domains];
      newDomains[index] = { ...newDomains[index], [field]: value };
      return { ...prev, domains: newDomains };
    });
  };

  const handleInterpretationChange = (value) => {
    setFormData(prev => ({ ...prev, interpretation: value }));
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Educational Assessment of Children with Autism (EACA)</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { 
              font-family: 'Times New Roman', Times, serif; 
              font-size: 10pt; 
              line-height: 1.3;
              max-width: 700px;
              margin: 0 auto;
              padding: 20px;
              color: #000;
            }
            .report-title {
              font-size: 11pt;
              font-weight: bold;
              text-align: left;
              margin-bottom: 10px;
            }
            .description {
              font-size: 10pt;
              text-align: justify;
              margin-bottom: 15px;
            }
            .chart-container {
              margin: 20px 0;
              padding: 15px;
              border: 1px solid #ccc;
            }
            .chart-title {
              font-size: 11pt;
              font-weight: bold;
              text-align: center;
              margin-bottom: 15px;
              color: #666;
            }
            .chart {
              display: flex;
              align-items: flex-end;
              justify-content: space-around;
              height: 200px;
              padding: 10px;
              border-left: 1px solid #000;
              border-bottom: 1px solid #000;
              position: relative;
            }
            .y-axis {
              position: absolute;
              left: -35px;
              top: 0;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              font-size: 8pt;
            }
            .bar-wrapper {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 12%;
            }
            .bar {
              width: 100%;
              background-color: #4285f4;
              min-height: 5px;
            }
            .bar-label {
              font-size: 7pt;
              text-align: center;
              margin-top: 5px;
              transform: rotate(-45deg);
              transform-origin: top left;
              white-space: nowrap;
              height: 40px;
            }
            .bar-value {
              font-size: 8pt;
              font-weight: bold;
              margin-bottom: 3px;
            }
            .interpretation {
              margin-top: 20px;
              text-align: justify;
            }
            input[type="text"], textarea {
              display: none;
            }
          </style>
        </head>
        <body>
          <div style="font-family: 'Times New Roman', Times, serif;">
            <div style="font-size: 11pt; font-weight: bold; text-align: left; margin-bottom: 10px;">${formData.title}</div>
            <div style="font-size: 10pt; text-align: justify; margin-bottom: 15px;">${formData.description}</div>
            
            <div style="margin: 20px 0; padding: 15px; border: 1px solid #ccc;">
              <div style="font-size: 11pt; font-weight: bold; text-align: center; margin-bottom: 15px; color: #666;">${formData.chartTitle}</div>
              <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 200px; padding: 10px; border-left: 1px solid #000; border-bottom: 1px solid #000; position: relative;">
                <div style="position: absolute; left: -35px; top: 0; height: 100%; display: flex; flex-direction: column; justify-content: space-between; font-size: 8pt;">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
                ${formData.domains.map(d => `
                  <div style="display: flex; flex-direction: column; align-items: center; width: 12%;">
                    <div style="font-size: 8pt; font-weight: bold; margin-bottom: 3px;">${d.percentage}%</div>
                    <div style="width: 100%; background-color: #4285f4; min-height: 5px; height: ${d.percentage * 1.8}px;"></div>
                    <div style="font-size: 7pt; text-align: center; margin-top: 5px; transform: rotate(-45deg); transform-origin: top left; white-space: nowrap; height: 40px;">${d.name}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div style="margin-top: 20px; text-align: justify;">${formData.interpretation}</div>
          </div>
          <div style="margin-top: 30px; font-size: 8pt; color: #666; text-align: right;">
            Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-800">EACA</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPrinter className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Report Preview */}
          <div ref={printRef} className="p-8" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
            {/* Title */}
            <div className="mb-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '11pt' }}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <textarea
                value={formData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt', lineHeight: '1.3' }}
                rows={5}
              />
            </div>

            {/* Chart Container */}
            <div className="border border-gray-300 p-4 mb-6">
              <div className="mb-4 text-center">
                <input
                  type="text"
                  value={formData.chartTitle}
                  onChange={(e) => handleChartTitleChange(e.target.value)}
                  className="w-full text-center font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                  style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '11pt', color: '#666' }}
                />
              </div>
              
              {/* Bar Chart */}
              <div className="relative h-48 px-2 pt-4 pb-12 border-l border-b border-black">
                {/* Y-axis labels */}
                <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-xs">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
                
                {/* Bars */}
                <div className="flex justify-around items-end h-full">
                  {formData.domains.map((domain, index) => (
                    <div key={index} className="flex flex-col items-center w-1/12">
                      <input
                        type="text"
                        value={domain.percentage}
                        onChange={(e) => handleDomainChange(index, 'percentage', e.target.value)}
                        className="w-full text-center text-xs font-bold mb-1 bg-transparent focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '8pt' }}
                      />
                      <div 
                        className="w-full bg-blue-500"
                        style={{ height: `${parseInt(domain.percentage) * 1.6}px`, minHeight: '5px' }}
                      />
                      <div className="mt-4 transform -rotate-45 origin-top-left text-xs whitespace-nowrap h-10">
                        <input
                          type="text"
                          value={domain.name}
                          onChange={(e) => handleDomainChange(index, 'name', e.target.value)}
                          className="bg-transparent focus:outline-none focus:bg-blue-50"
                          style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '7pt' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interpretation */}
            <div>
              <textarea
                value={formData.interpretation}
                onChange={(e) => handleInterpretationChange(e.target.value)}
                className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt', lineHeight: '1.3' }}
                rows={5}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-t border-blue-100 px-8 py-4">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> All fields are editable. Click on any text to edit. 
              Click "Print / PDF" to generate a printable report.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleEACATemplate;
