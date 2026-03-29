import { useState, useRef } from 'react';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';

// ADHD DSM-5 Checklist Template - Matches the Excel screenshot exactly
const SimpleADHDDSM5Template = ({ onBack }) => {
  const [formData, setFormData] = useState({
    // Header
    title: "ATTENTION-DEFICIT/HYPERACTIVITY DISORDER - DSM 5 CHECKLIST",
    subtitle: "ADHD DSM-5 Criteria - Parent Completion (American Psychiatric Association, 2013)",
    
    // Inattention Criteria (A1-A9)
    inattention: {
      header: "IN ATTENTION",
      note: "(Only behaviours occurring for 6 months or more are ticked)",
      criteria: [
        { 
          code: "A1", 
          description: "Often fails to give close attention to details or makes careless mistakes in schoolwork, at work, or during other activities (e.g., overlooks or misses details, work is inaccurate).",
          checked: true
        },
        { 
          code: "A2", 
          description: "Often has difficulty sustaining attention in tasks or play activities (e.g., has difficulty remaining focused during lectures, conversations, or lengthy reading).",
          checked: true
        },
        { 
          code: "A3", 
          description: "Often does not seem to listen when spoken to directly (e.g., mind seems elsewhere, even in the absence of any obvious distraction).",
          checked: false
        },
        { 
          code: "A4", 
          description: "Often does not follow through on instructions and fails to finish schoolwork, chores, or duties in the workplace (e.g., starts tasks but quickly loses focus and is easily side-tracked).",
          checked: true
        },
        { 
          code: "A5", 
          description: "Often has difficulty organizing tasks and activities (e.g., difficulty managing sequential tasks; difficulty keeping materials and belongings in order; messy, disorganized work; has poor time management; fails to meet deadlines).",
          checked: true
        },
        { 
          code: "A6", 
          description: "Often avoids, dislikes, or is reluctant to engage in tasks that require sustained mental effort (e.g., schoolwork or homework; for older adolescents and adults, preparing reports, completing forms, reviewing lengthy papers).",
          checked: false
        },
        { 
          code: "A7", 
          description: "Often loses things necessary for tasks or activities (e.g., school materials, pencils, books, tools, wallets, keys, paperwork, eyeglasses, mobile telephones).",
          checked: false
        },
        { 
          code: "A8", 
          description: "Is often easily distracted by extraneous stimuli (for older adolescents and adults, may include unrelated thoughts).",
          checked: false
        },
        { 
          code: "A9", 
          description: "Is often forgetful in daily activities (e.g., doing chores, running errands; for older adolescents and adults, returning calls, paying bills, keeping appointments).",
          checked: false
        }
      ],
      total: 4
    },
    
    // Hyperactivity and Impulsivity Criteria (A10-A18)
    hyperactivity: {
      header: "HYPERACTIVITY AND IMPULSIVITY",
      note: "(Only behaviours occurring for 6 months or more are ticked)",
      criteria: [
        { 
          code: "A10", 
          description: "Often fidgets with or taps hands or feet or squirms in seat.",
          checked: false
        },
        { 
          code: "A11", 
          description: "Often leaves seat in situations when remaining seated is expected (e.g., leaves his or her place in the classroom, in the office or other workplace, or in other situations that require remaining in place).",
          checked: false
        },
        { 
          code: "A12", 
          description: "Often runs about or climbs in situations where it is inappropriate. (Note: In adolescents or adults, may be limited to feeling restless).",
          checked: false
        },
        { 
          code: "A13", 
          description: "Often unable to play or engage in leisure activities quietly.",
          checked: false
        },
        { 
          code: "A14", 
          description: "Is often 'on the go,' acting as if 'driven by a motor' (e.g., is unable to be or is uncomfortable being still for extended time, as in restaurants, meetings; may be experienced by others as being restless or difficult to keep up with).",
          checked: false
        },
        { 
          code: "A15", 
          description: "Often talks excessively.",
          checked: false
        },
        { 
          code: "A16", 
          description: "Often blurts out an answer before a question has been completed (e.g., completes people's sentences; cannot wait for turn in conversation).",
          checked: false
        },
        { 
          code: "A17", 
          description: "Often has difficulty waiting his or her turn (e.g., while waiting in line).",
          checked: false
        },
        { 
          code: "A18", 
          description: "Often interrupts or intrudes on others (e.g., butts into conversations, games, or activities; may start using other people's things without asking or receiving permission; for adolescents and adults, may intrude into or take over what others are doing).",
          checked: false
        }
      ],
      total: 0
    }
  });

  const printRef = useRef();

  const handleInattentionCheck = (index, checked) => {
    setFormData(prev => {
      const newCriteria = [...prev.inattention.criteria];
      newCriteria[index] = { ...newCriteria[index], checked };
      const newTotal = newCriteria.filter(c => c.checked).length;
      return {
        ...prev,
        inattention: { ...prev.inattention, criteria: newCriteria, total: newTotal }
      };
    });
  };

  const handleHyperactivityCheck = (index, checked) => {
    setFormData(prev => {
      const newCriteria = [...prev.hyperactivity.criteria];
      newCriteria[index] = { ...newCriteria[index], checked };
      const newTotal = newCriteria.filter(c => c.checked).length;
      return {
        ...prev,
        hyperactivity: { ...prev.hyperactivity, criteria: newCriteria, total: newTotal }
      };
    });
  };

  const handleInattentionDescriptionChange = (index, value) => {
    setFormData(prev => {
      const newCriteria = [...prev.inattention.criteria];
      newCriteria[index] = { ...newCriteria[index], description: value };
      return {
        ...prev,
        inattention: { ...prev.inattention, criteria: newCriteria }
      };
    });
  };

  const handleHyperactivityDescriptionChange = (index, value) => {
    setFormData(prev => {
      const newCriteria = [...prev.hyperactivity.criteria];
      newCriteria[index] = { ...newCriteria[index], description: value };
      return {
        ...prev,
        hyperactivity: { ...prev.hyperactivity, criteria: newCriteria }
      };
    });
  };

  const handleTitleChange = (value) => {
    setFormData(prev => ({ ...prev, title: value }));
  };

  const handleSubtitleChange = (value) => {
    setFormData(prev => ({ ...prev, subtitle: value }));
  };

  const handleInattentionHeaderChange = (value) => {
    setFormData(prev => ({
      ...prev,
      inattention: { ...prev.inattention, header: value }
    }));
  };

  const handleInattentionNoteChange = (value) => {
    setFormData(prev => ({
      ...prev,
      inattention: { ...prev.inattention, note: value }
    }));
  };

  const handleHyperactivityHeaderChange = (value) => {
    setFormData(prev => ({
      ...prev,
      hyperactivity: { ...prev.hyperactivity, header: value }
    }));
  };

  const handleHyperactivityNoteChange = (value) => {
    setFormData(prev => ({
      ...prev,
      hyperactivity: { ...prev.hyperactivity, note: value }
    }));
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>ADHD DSM-5 Checklist</title>
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
              font-size: 11pt;
              font-weight: bold;
              text-align: center;
              margin-bottom: 5px;
            }
            .report-subtitle {
              font-size: 9pt;
              text-align: center;
              font-style: italic;
              margin-bottom: 15px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 0;
              font-size: 8pt;
            }
            th, td {
              border: 1px solid #000;
              padding: 4px 6px;
              text-align: left;
              vertical-align: top;
            }
            .section-header {
              background-color: #e8e8e8;
              font-weight: bold;
              text-align: left;
            }
            .criteria-code {
              font-weight: bold;
              text-align: center;
              width: 30px;
            }
            .criteria-desc {
              text-align: justify;
            }
            .yes-col {
              text-align: center;
              width: 40px;
              font-weight: bold;
            }
            .total-row {
              font-weight: bold;
              background-color: #f5f5f5;
            }
            .checkbox {
              display: inline-block;
              width: 12px;
              height: 12px;
              border: 1px solid #000;
              text-align: center;
              line-height: 12px;
              font-size: 10px;
            }
            .checkbox.checked:after {
              content: '✓';
            }
            .print-date {
              margin-top: 20px;
              font-size: 8pt;
              color: #666;
              text-align: right;
            }
            input[type="text"], input[type="checkbox"] {
              display: none;
            }
            .print-checkbox {
              display: inline-block;
              width: 14px;
              height: 14px;
              border: 1px solid #000;
              text-align: center;
              line-height: 14px;
            }
          </style>
        </head>
        <body>
          <div style="font-family: 'Times New Roman', Times, serif;">
            <div style="font-size: 11pt; font-weight: bold; text-align: center; margin-bottom: 5px;">${formData.title}</div>
            <div style="font-size: 9pt; text-align: center; font-style: italic; margin-bottom: 15px;">${formData.subtitle}</div>
            
            <table>
              <tr style="background-color: #e8e8e8;">
                <td colspan="3" style="font-weight: bold; border: 1px solid #000; padding: 4px 6px;">
                  ${formData.inattention.header} <span style="font-weight: normal;">- ${formData.inattention.note}</span>
                </td>
              </tr>
              ${formData.inattention.criteria.map(c => `
                <tr>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold; width: 30px;">${c.code}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: justify;">${c.description}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center; width: 40px;">
                    <span style="display: inline-block; width: 14px; height: 14px; border: 1px solid #000; text-align: center; line-height: 14px;">${c.checked ? '✓' : ''}</span>
                  </td>
                </tr>
              `).join('')}
              <tr style="font-weight: bold; background-color: #f5f5f5;">
                <td colspan="2" style="border: 1px solid #000; padding: 4px 6px; text-align: right;">TOTAL</td>
                <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${formData.inattention.total}</td>
              </tr>
            </table>
            
            <div style="height: 15px;"></div>
            
            <table>
              <tr style="background-color: #e8e8e8;">
                <td colspan="3" style="font-weight: bold; border: 1px solid #000; padding: 4px 6px;">
                  ${formData.hyperactivity.header} <span style="font-weight: normal;">- ${formData.hyperactivity.note}</span>
                </td>
              </tr>
              ${formData.hyperactivity.criteria.map(c => `
                <tr>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold; width: 30px;">${c.code}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: justify;">${c.description}</td>
                  <td style="border: 1px solid #000; padding: 4px 6px; text-align: center; width: 40px;">
                    <span style="display: inline-block; width: 14px; height: 14px; border: 1px solid #000; text-align: center; line-height: 14px;">${c.checked ? '✓' : ''}</span>
                  </td>
                </tr>
              `).join('')}
              <tr style="font-weight: bold; background-color: #f5f5f5;">
                <td colspan="2" style="border: 1px solid #000; padding: 4px 6px; text-align: right;">TOTAL</td>
                <td style="border: 1px solid #000; padding: 4px 6px; text-align: center;">${formData.hyperactivity.total}</td>
              </tr>
            </table>
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
            <h1 className="text-xl font-semibold text-gray-800">ADHD DSM-5 Checklist</h1>
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
            <div className="text-center mb-1">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-center font-bold bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '12pt' }}
              />
            </div>
            
            {/* Subtitle */}
            <div className="text-center mb-6">
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleSubtitleChange(e.target.value)}
                className="w-full text-center italic bg-transparent focus:outline-none focus:bg-blue-50"
                style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
              />
            </div>

            {/* Inattention Table */}
            <table className="w-full border-collapse border border-black mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th colSpan="3" className="border border-black px-3 py-2 text-left font-bold text-xs">
                    <input
                      type="text"
                      value={formData.inattention.header}
                      onChange={(e) => handleInattentionHeaderChange(e.target.value)}
                      className="bg-transparent font-bold focus:outline-none focus:bg-blue-50 w-full"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                    />
                    <input
                      type="text"
                      value={formData.inattention.note}
                      onChange={(e) => handleInattentionNoteChange(e.target.value)}
                      className="bg-transparent font-normal focus:outline-none focus:bg-blue-50 w-full mt-1"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </th>
                </tr>
                <tr>
                  <th className="border border-black px-2 py-1 text-center font-bold text-xs w-10">Code</th>
                  <th className="border border-black px-2 py-1 text-left font-bold text-xs">Description</th>
                  <th className="border border-black px-2 py-1 text-center font-bold text-xs w-12">YES</th>
                </tr>
              </thead>
              <tbody>
                {formData.inattention.criteria.map((criteria, index) => (
                  <tr key={criteria.code}>
                    <td className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input
                        type="text"
                        value={criteria.code}
                        onChange={(e) => {
                          const newCriteria = [...formData.inattention.criteria];
                          newCriteria[index] = { ...newCriteria[index], code: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            inattention: { ...prev.inattention, criteria: newCriteria }
                          }));
                        }}
                        className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-1 text-xs">
                      <textarea
                        value={criteria.description}
                        onChange={(e) => handleInattentionDescriptionChange(index, e.target.value)}
                        className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt', lineHeight: '1.4', minHeight: '40px' }}
                        rows={2}
                      />
                    </td>
                    <td className="border border-black px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        checked={criteria.checked}
                        onChange={(e) => handleInattentionCheck(index, e.target.checked)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-bold">
                  <td colSpan="2" className="border border-black px-2 py-1 text-right text-xs">
                    <input
                      type="text"
                      value="TOTAL"
                      className="bg-transparent font-bold text-right w-full focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                    />
                  </td>
                  <td className="border border-black px-2 py-1 text-center text-xs">
                    <input
                      type="text"
                      value={formData.inattention.total}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          inattention: { ...prev.inattention, total: value }
                        }));
                      }}
                      className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Hyperactivity Table */}
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr className="bg-gray-100">
                  <th colSpan="3" className="border border-black px-3 py-2 text-left font-bold text-xs">
                    <input
                      type="text"
                      value={formData.hyperactivity.header}
                      onChange={(e) => handleHyperactivityHeaderChange(e.target.value)}
                      className="bg-transparent font-bold focus:outline-none focus:bg-blue-50 w-full"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                    />
                    <input
                      type="text"
                      value={formData.hyperactivity.note}
                      onChange={(e) => handleHyperactivityNoteChange(e.target.value)}
                      className="bg-transparent font-normal focus:outline-none focus:bg-blue-50 w-full mt-1"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt' }}
                    />
                  </th>
                </tr>
                <tr>
                  <th className="border border-black px-2 py-1 text-center font-bold text-xs w-10">Code</th>
                  <th className="border border-black px-2 py-1 text-left font-bold text-xs">Description</th>
                  <th className="border border-black px-2 py-1 text-center font-bold text-xs w-12">YES</th>
                </tr>
              </thead>
              <tbody>
                {formData.hyperactivity.criteria.map((criteria, index) => (
                  <tr key={criteria.code}>
                    <td className="border border-black px-2 py-1 text-center font-bold text-xs">
                      <input
                        type="text"
                        value={criteria.code}
                        onChange={(e) => {
                          const newCriteria = [...formData.hyperactivity.criteria];
                          newCriteria[index] = { ...newCriteria[index], code: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            hyperactivity: { ...prev.hyperactivity, criteria: newCriteria }
                          }));
                        }}
                        className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                      />
                    </td>
                    <td className="border border-black px-2 py-1 text-xs">
                      <textarea
                        value={criteria.description}
                        onChange={(e) => handleHyperactivityDescriptionChange(index, e.target.value)}
                        className="w-full bg-transparent focus:outline-none focus:bg-blue-50 resize-none text-justify"
                        style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '9pt', lineHeight: '1.4', minHeight: '40px' }}
                        rows={2}
                      />
                    </td>
                    <td className="border border-black px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        checked={criteria.checked}
                        onChange={(e) => handleHyperactivityCheck(index, e.target.checked)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-bold">
                  <td colSpan="2" className="border border-black px-2 py-1 text-right text-xs">
                    <input
                      type="text"
                      value="TOTAL"
                      className="bg-transparent font-bold text-right w-full focus:outline-none"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                    />
                  </td>
                  <td className="border border-black px-2 py-1 text-center text-xs">
                    <input
                      type="text"
                      value={formData.hyperactivity.total}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          hyperactivity: { ...prev.hyperactivity, total: value }
                        }));
                      }}
                      className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-blue-50"
                      style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '10pt' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-t border-blue-100 px-8 py-4">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Check the boxes for criteria that apply. 
              The totals are calculated automatically. Click "Print / PDF" to generate a printable report.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleADHDDSM5Template;
