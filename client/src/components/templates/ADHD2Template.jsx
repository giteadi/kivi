import { useState } from 'react';

// ADHD-2 Template Component - Simple Form + PDF Generation
const ADHD2Template = ({ examinee, onGeneratePDF }) => {
  // Editable form state - matches the screenshot exactly
  const [formData, setFormData] = useState({
    // Header
    title: "ATTENTION-DEFICIT / HYPERACTIVITY DISORDER TEST-ADHDT-2",
    description: "The Attention-Deficit/Hyperactivity Disorder Test-Second Edition (ADHDT-2) is a norm-referenced screening test used to identify persons who have attention-deficit/hyperactivity disorder (ADHDT). It is designed to identify individuals who present severe behavioral problems that may be indicative of ADHD. It's content is based on the definition of ADHD from the DSM-5.",
    
    // Test Results Table
    subscales: [
      { name: "Inattention", rawScore: "26", percentileRank: "25", scaledScore: "8" },
      { name: "Hyperactivity/Impulsivity", rawScore: "21", percentileRank: "6", scaledScore: "9" },
    ],
    adhdIndex: "92",
    
    // Remarks
    remark: "The scores imply it is 'very likely' that ABC has symptoms of ADHD.",
    
    // Additional Notes
    notes: "It must be noted that this checklist cannot be fully endorsed by the tester, as she is in a one-to-one situation, and many of these behaviors cannot be evaluated in that situation. The scores above are those reported by his mother after being given insight by the tester. They can be used as a rough guide for indicators."
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubscaleChange = (index, field, value) => {
    setFormData(prev => {
      const newSubscales = [...prev.subscales];
      newSubscales[index] = { ...newSubscales[index], [field]: value };
      return { ...prev, subscales: newSubscales };
    });
  };

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${formData.title}</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { 
              font-family: 'Times New Roman', Times, serif; 
              font-size: 12pt; 
              line-height: 1.5;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              font-size: 14pt;
              font-weight: bold;
              text-align: center;
              text-decoration: underline;
              margin-bottom: 20px;
              text-transform: uppercase;
            }
            .description {
              text-align: justify;
              margin-bottom: 20px;
            }
            h2 {
              font-size: 12pt;
              font-weight: bold;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px 12px;
              text-align: left;
            }
            th {
              font-weight: bold;
              background-color: #f5f5f5;
            }
            .adhd-index {
              font-weight: bold;
              margin: 10px 0;
            }
            .remark {
              margin: 20px 0;
              font-weight: normal;
            }
            .remark strong {
              font-weight: bold;
            }
            .remark em {
              font-style: italic;
            }
            .notes {
              font-style: italic;
              text-align: justify;
              margin-top: 20px;
            }
            .footer {
              margin-top: 30px;
              border-top: 1px solid #ccc;
              padding-top: 10px;
              font-size: 10pt;
            }
          </style>
        </head>
        <body>
          <h1>${formData.title}</h1>
          
          <div class="description">
            ${formData.description}
          </div>
          
          <h2>Test Results</h2>
          
          <table>
            <thead>
              <tr>
                <th>Subscales</th>
                <th>Raw Scores</th>
                <th>Percentile Ranks</th>
                <th>Scaled Scores</th>
              </tr>
            </thead>
            <tbody>
              ${formData.subscales.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.rawScore}</td>
                  <td>${s.percentileRank}</td>
                  <td>${s.scaledScore}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="adhd-index">ADHD Index - ${formData.adhdIndex}</div>
          
          <div class="remark">
            <strong>Remark:</strong> ${formData.remark.replace(/'very likely'/g, "<em>'very likely'</em>")}
          </div>
          
          <div class="notes">
            ${formData.notes}
          </div>
          
          <div class="footer">
            <p><strong>Examinee:</strong> ${examinee?.firstName || ''} ${examinee?.lastName || ''}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{padding: '20px', maxWidth: '900px', margin: '0 auto'}}>
      <h2 style={{fontSize: '20px', marginBottom: '20px', color: '#1f2937'}}>
        ADHD-2 Assessment Template
      </h2>
      
      {/* Title */}
      <div style={{marginBottom: '15px'}}>
        <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>Title:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          style={{width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px'}}
        />
      </div>

      {/* Description */}
      <div style={{marginBottom: '15px'}}>
        <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>Description:</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          style={{width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px'}}
        />
      </div>

      {/* Test Results Table */}
      <div style={{marginBottom: '20px'}}>
        <label style={{display: 'block', fontWeight: 'bold', marginBottom: '10px'}}>Test Results:</label>
        <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '10px'}}>
          <thead>
            <tr style={{backgroundColor: '#f3f4f6'}}>
              <th style={{border: '1px solid #ccc', padding: '8px', textAlign: 'left'}}>Subscales</th>
              <th style={{border: '1px solid #ccc', padding: '8px', textAlign: 'left'}}>Raw Scores</th>
              <th style={{border: '1px solid #ccc', padding: '8px', textAlign: 'left'}}>Percentile Ranks</th>
              <th style={{border: '1px solid #ccc', padding: '8px', textAlign: 'left'}}>Scaled Scores</th>
            </tr>
          </thead>
          <tbody>
            {formData.subscales.map((subscale, index) => (
              <tr key={index}>
                <td style={{border: '1px solid #ccc', padding: '8px'}}>
                  <input
                    type="text"
                    value={subscale.name}
                    onChange={(e) => handleSubscaleChange(index, 'name', e.target.value)}
                    style={{width: '100%', padding: '4px', border: '1px solid #ddd'}}
                  />
                </td>
                <td style={{border: '1px solid #ccc', padding: '8px'}}>
                  <input
                    type="text"
                    value={subscale.rawScore}
                    onChange={(e) => handleSubscaleChange(index, 'rawScore', e.target.value)}
                    style={{width: '100%', padding: '4px', border: '1px solid #ddd'}}
                  />
                </td>
                <td style={{border: '1px solid #ccc', padding: '8px'}}>
                  <input
                    type="text"
                    value={subscale.percentileRank}
                    onChange={(e) => handleSubscaleChange(index, 'percentileRank', e.target.value)}
                    style={{width: '100%', padding: '4px', border: '1px solid #ddd'}}
                  />
                </td>
                <td style={{border: '1px solid #ccc', padding: '8px'}}>
                  <input
                    type="text"
                    value={subscale.scaledScore}
                    onChange={(e) => handleSubscaleChange(index, 'scaledScore', e.target.value)}
                    style={{width: '100%', padding: '4px', border: '1px solid #ddd'}}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* ADHD Index */}
        <div style={{marginBottom: '15px'}}>
          <label style={{fontWeight: 'bold', marginRight: '10px'}}>ADHD Index:</label>
          <input
            type="text"
            value={formData.adhdIndex}
            onChange={(e) => handleChange('adhdIndex', e.target.value)}
            style={{padding: '4px 8px', width: '80px', border: '1px solid #ccc', borderRadius: '4px'}}
          />
        </div>
      </div>

      {/* Remark */}
      <div style={{marginBottom: '15px'}}>
        <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>Remark:</label>
        <textarea
          value={formData.remark}
          onChange={(e) => handleChange('remark', e.target.value)}
          rows={2}
          style={{width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px'}}
        />
      </div>

      {/* Additional Notes */}
      <div style={{marginBottom: '20px'}}>
        <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>Additional Notes:</label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={4}
          style={{width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px'}}
        />
      </div>

      {/* Generate PDF Button */}
      <button
        onClick={generatePDF}
        style={{
          backgroundColor: '#10b981',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Generate PDF Report
      </button>
    </div>
  );
};

export default ADHD2Template;
