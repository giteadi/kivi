import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// Aston Index Template - Matches the Excel screenshot exactly
const SimpleAstonIndexTemplate = ({ onBack }) => {
  const [formData, setFormData] = useState({
    // Header
    title: "ASTON INDEX",
    
    // Description
    description: "The Aston Index is a comprehensive battery of testing and diagnosing language difficulties. The Index identifies children with special educational needs, language difficulties, auditory and visual perception difficulties, reading and spelling difficulties. The Aston Index contains 16 tests which help to measure the child's general underlying ability and attainment with reference to the child's mental age. It also examines the pupil's strengths and weaknesses in visual and auditory discrimination, motor co-ordination, written language, reading and spelling. The Aston Index identifies children with special educational needs, with language difficulties, and with auditory and visual perception difficulties.",
    
    // Section 1: General Underlying Ability and Attainment
    section1: {
      header: "Test Results(4 Level-1)",
      title: "I. GENERAL UNDERLYING ABILITY AND ATTAINMENT",
      items: [
        { id: 1, name: "Picture Recognition", score: "9" },
        { id: 2, name: "Vocabulary", score: "5/6 years" },
        { id: 3, name: "Good-enough draw-a-man", score: "4 years(MA)" },
        { id: 4, name: "Copying geometric designs", score: "Could identify the uppercase and lower case letter, but could not say the individual specific sounds" },
        { id: 5, name: "Grapheme-Phoneme correspondence", score: "" },
        { id: 6, name: "Schuell's reading test", score: "" },
        { id: 7, name: "Schuell's spelling test", score: "NA" },
        { id: 8, name: "Visual discrimination test", score: "9" },
      ]
    },
    
    // Section 2: Performance Items
    section2: {
      title: "II. PERFORMANCE ITEMS",
      items: [
        { id: 1, name: "Child's laterality", score: "Left" },
        { id: 2, name: "Tapping game", score: "8" },
        { id: 3, name: "Free writing", score: "NA" },
        { id: 4, name: "Visual sequential memory (pictorial)", score: "3" },
        { id: 5, name: "Auditory sequential memory", score: "6 (4 forward) (4 reverse)" },
        { id: 6, name: "Sound Blending", score: "4" },
        { id: 7, name: "Visual Sequential memory (symbolic)", score: "7" },
        { id: 8, name: "Sound discrimination", score: "9" },
        { id: 9, name: "Grapho-motor test", score: "NA" },
      ]
    },
    
    // Interpretation
    interpretation: {
      header: "Interpretation",
      subheader: "General Underlying Ability and Attainment",
      items: [
        {
          id: 1,
          title: "Picture Recognition",
          text: "On this subtest, 'ABC' was able to recognize and give names of 9 pictures present in the environment."
        },
        {
          id: 2,
          title: "Vocabulary",
          text: "On this subtest ABC's vocabulary was equivalent to that of a 5 year old child. She showed little difficulty with verbal expression of meaning of words presented to her, and she was searching and defining words adequately, which was suggestive of good amount of understanding of verbal concepts for ABC."
        },
        {
          id: 3,
          title: "Good-enough draw-a-man test",
          text: "On this subtest, ABC's mental age was found to be 4 years which is lower than her chronological age."
        },
        {
          id: 4,
          title: "Copying Geometric designs",
          text: "ABC was able to copy geometric designs and her basic shapes were adequately defined except for her diamond shape. However, she showed difficulty with motor control."
        }
      ]
    }
  });

  const printRef = useRef();

  const handleTitleChange = (value) => {
    setFormData(prev => ({ ...prev, title: value }));
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handleSection1HeaderChange = (value) => {
    setFormData(prev => ({ ...prev, section1: { ...prev.section1, header: value } }));
  };

  const handleSection1TitleChange = (value) => {
    setFormData(prev => ({ ...prev, section1: { ...prev.section1, title: value } }));
  };

  const handleSection1ItemNameChange = (index, value) => {
    setFormData(prev => {
      const newItems = [...prev.section1.items];
      newItems[index] = { ...newItems[index], name: value };
      return { ...prev, section1: { ...prev.section1, items: newItems } };
    });
  };

  const handleSection1ItemScoreChange = (index, value) => {
    setFormData(prev => {
      const newItems = [...prev.section1.items];
      newItems[index] = { ...newItems[index], score: value };
      return { ...prev, section1: { ...prev.section1, items: newItems } };
    });
  };

  const handleSection2TitleChange = (value) => {
    setFormData(prev => ({ ...prev, section2: { ...prev.section2, title: value } }));
  };

  const handleSection2ItemNameChange = (index, value) => {
    setFormData(prev => {
      const newItems = [...prev.section2.items];
      newItems[index] = { ...newItems[index], name: value };
      return { ...prev, section2: { ...prev.section2, items: newItems } };
    });
  };

  const handleSection2ItemScoreChange = (index, value) => {
    setFormData(prev => {
      const newItems = [...prev.section2.items];
      newItems[index] = { ...newItems[index], score: value };
      return { ...prev, section2: { ...prev.section2, items: newItems } };
    });
  };

  const handleInterpretationHeaderChange = (value) => {
    setFormData(prev => ({ ...prev, interpretation: { ...prev.interpretation, header: value } }));
  };

  const handleInterpretationSubheaderChange = (value) => {
    setFormData(prev => ({ ...prev, interpretation: { ...prev.interpretation, subheader: value } }));
  };

  const handleInterpretationItemTitleChange = (index, value) => {
    setFormData(prev => {
      const newItems = [...prev.interpretation.items];
      newItems[index] = { ...newItems[index], title: value };
      return { ...prev, interpretation: { ...prev.interpretation, items: newItems } };
    });
  };

  const handleInterpretationItemTextChange = (index, value) => {
    setFormData(prev => {
      const newItems = [...prev.interpretation.items];
      newItems[index] = { ...newItems[index], text: value };
      return { ...prev, interpretation: { ...prev.interpretation, items: newItems } };
    });
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Aston Index</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { 
              font-family: 'Times New Roman', Times, serif; 
              font-size: 9pt; 
              line-height: 1.3;
              max-width: 750px;
              margin: 0 auto;
              padding: 15px;
              color: #000;
            }
            .report-title {
              font-size: 14pt;
              font-weight: bold;
              text-align: left;
              margin-bottom: 10px;
            }
            .description {
              font-size: 9pt;
              text-align: justify;
              margin-bottom: 15px;
            }
            .section-header {
              font-size: 10pt;
              font-weight: bold;
              margin-top: 15px;
              margin-bottom: 5px;
            }
            .section-title {
              font-size: 9pt;
              font-weight: bold;
              margin-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 0 0 15px 0;
              font-size: 9pt;
            }
            th, td {
              border: 1px solid #000;
              padding: 4px 6px;
              text-align: left;
              vertical-align: top;
            }
            .item-num {
              width: 20px;
              text-align: center;
            }
            .item-name {
              width: 50%;
            }
            .item-score {
              width: 50%;
            }
            .interpretation-header {
              font-weight: bold;
              margin-top: 15px;
              margin-bottom: 5px;
            }
            .interpretation-subheader {
              font-weight: bold;
              font-style: italic;
              margin-bottom: 10px;
            }
            .interpretation-item {
              margin-bottom: 10px;
              text-align: justify;
            }
            .interpretation-title {
              font-weight: bold;
            }
            input[type="text"], textarea {
              display: none;
            }
          </style>
        </head>
        <body>
          <div style="font-family: 'Times New Roman', Times, serif;">
            <div style="font-size: 14pt; font-weight: bold; text-align: left; margin-bottom: 10px;">${formData.title}</div>
            <div style="font-size: 9pt; text-align: justify; margin-bottom: 15px;">${formData.description}</div>
            
            <div style="font-size: 10pt; font-weight: bold; margin-top: 15px; margin-bottom: 5px;">${formData.section1.header}</div>
            
            <div style="font-size: 9pt; font-weight: bold; margin-bottom: 5px;">${formData.section1.title}</div>
            <table>
              <tr>
                <th style="border: 1px solid #000; padding: 4px 6px; width: 30px;"></th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center;">SCORE</th>
              </tr>
              ${formData.section1.items.map(item => `
                <tr>
                  <td style="border: 1px solid #000; padding: 4px 6px;">${item.id}. ${item.name}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px;">${item.score}</td>
                </tr>
              `).join('')}
            </table>
            
            <div style="font-size: 9pt; font-weight: bold; margin-bottom: 5px; margin-top: 15px;">${formData.section2.title}</div>
            <table>
              <tr>
                <th style="border: 1px solid #000; padding: 4px 6px; width: 30px;"></th>
                <th style="border: 1px solid #000; padding: 4px 6px; text-align: center;">SCORE</th>
              </tr>
              ${formData.section2.items.map(item => `
                <tr>
                  <td style="border: 1px solid #000; padding: 4px 6px;">${item.id}. ${item.name}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px;">${item.score}</td>
                </tr>
              `).join('')}
            </table>
            
            <div style="font-weight: bold; margin-top: 15px; margin-bottom: 5px;">${formData.interpretation.header}</div>
            <div style="font-weight: bold; font-style: italic; margin-bottom: 10px;">${formData.interpretation.subheader}</div>
            
            ${formData.interpretation.items.map((item, index) => `
              <div style="margin-bottom: 10px; text-align: justify;">
                <span style="font-weight: bold;">${index + 1}. ${item.title}-</span> ${item.text}
              </div>
            `).join('')}
          </div>
          <div style="margin-top: 20px; font-size: 8pt; color: #666; text-align: right;">
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
            <h1 className="text-xl font-semibold text-gray-800">Aston Index</h1>
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
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '14pt' }}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <textarea
                value={formData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt', lineHeight: '1.4' }}
                rows={4}
              />
            </div>

            {/* Test Results Header */}
            <div className="mb-2">
              <input
                type="text"
                value={formData.section1.header}
                onChange={(e) => handleSection1HeaderChange(e.target.value)}
                className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
            </div>

            {/* Section 1: General Underlying Ability and Attainment */}
            <div className="mb-4">
              <input
                type="text"
                value={formData.section1.title}
                onChange={(e) => handleSection1TitleChange(e.target.value)}
                className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50 mb-2"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
              />
              <table className="w-full border-collapse border border-black">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs" style={{ width: '60%' }}></th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs" style={{ width: '40%' }}>SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.section1.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border border-black px-2 py-1 text-xs">
                        <span className="font-bold">{item.id}.</span>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleSection1ItemNameChange(index, e.target.value)}
                          className="ml-2 bg-transparent focus:outline-none focus:bg-blue-50 w-3/4"
                          style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                        />
                      </td>
                      <td className="border border-black px-2 py-1 text-xs">
                        <input
                          type="text"
                          value={item.score}
                          onChange={(e) => handleSection1ItemScoreChange(index, e.target.value)}
                          className="w-full bg-transparent focus:outline-none focus:bg-blue-50"
                          style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 2: Performance Items */}
            <div className="mb-6">
              <input
                type="text"
                value={formData.section2.title}
                onChange={(e) => handleSection2TitleChange(e.target.value)}
                className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50 mb-2"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
              />
              <table className="w-full border-collapse border border-black">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs" style={{ width: '60%' }}></th>
                    <th className="border border-black px-2 py-1 text-center font-bold text-xs" style={{ width: '40%' }}>SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.section2.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border border-black px-2 py-1 text-xs">
                        <span className="font-bold">{item.id}.</span>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleSection2ItemNameChange(index, e.target.value)}
                          className="ml-2 bg-transparent focus:outline-none focus:bg-blue-50 w-3/4"
                          style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                        />
                      </td>
                      <td className="border border-black px-2 py-1 text-xs">
                        <input
                          type="text"
                          value={item.score}
                          onChange={(e) => handleSection2ItemScoreChange(index, e.target.value)}
                          className="w-full bg-transparent focus:outline-none focus:bg-blue-50"
                          style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Interpretation */}
            <div className="mb-4">
              <input
                type="text"
                value={formData.interpretation.header}
                onChange={(e) => handleInterpretationHeaderChange(e.target.value)}
                className="w-full font-bold bg-transparent focus:outline-none focus:bg-blue-50 mb-1"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
              <input
                type="text"
                value={formData.interpretation.subheader}
                onChange={(e) => handleInterpretationSubheaderChange(e.target.value)}
                className="w-full font-bold italic bg-transparent focus:outline-none focus:bg-blue-50 mb-4"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
              />
              
              <div className="space-y-4">
                {formData.interpretation.items.map((item, index) => (
                  <div key={item.id} className="text-xs text-justify">
                    <span className="font-bold">{index + 1}. </span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleInterpretationItemTitleChange(index, e.target.value)}
                      className="font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                    <span className="font-bold">-</span>
                    <textarea
                      value={item.text}
                      onChange={(e) => handleInterpretationItemTextChange(index, e.target.value)}
                      className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify mt-1"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt', lineHeight: '1.4' }}
                      rows={3}
                    />
                  </div>
                ))}
              </div>
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

export default SimpleAstonIndexTemplate;
