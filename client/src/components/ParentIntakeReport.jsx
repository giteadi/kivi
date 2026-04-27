import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFileText, FiPrinter, FiCopy, FiCheck } from 'react-icons/fi';

const ParentIntakeReport = ({ 
  formData, 
  evaluationData, 
  diagnosisData, 
  historyData,
  languageSampleReportData,
  educationSampleReportData,
  healthSampleReportData,
  employmentSampleReportData,
  isEditable = false,
  onUpdateField = null
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Calculate age from birthDate
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years} years ${months} months`;
  };

  // Handle field update
  const handleFieldChange = (section, field, value) => {
    if (onUpdateField) {
      onUpdateField(section, field, value);
    }
  };

  // Export to Word
  const exportToWord = () => {
    const content = document.getElementById('parent-intake-form');
    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Parent Intake Form</title></head>
      <body>${content.innerHTML}</body>
      </html>
    `;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Parent_Intake_Form_${formData.firstName}_${formData.lastName}.doc`;
    link.click();
  };

  // Export to PDF (print)
  const exportToPDF = () => {
    window.print();
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    const content = document.getElementById('parent-intake-form');
    const text = content.innerText;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Helper to get checked items from evaluation data
  const getCheckedItems = (category) => {
    const items = [];
    const data = evaluationData[category] || {};
    Object.entries(data).forEach(([key, value]) => {
      if (value === true && key !== 'other' && key !== 'otherText') {
        items.push(key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
      }
    });
    if (data.other && data.otherText) {
      items.push(data.otherText);
    }
    return items;
  };

  // Editable field component
  const EditableField = ({ value, onChange, placeholder = '', multiline = false }) => {
    if (!editMode || !isEditable) {
      return <span className="text-gray-900">{value || '-'}</span>;
    }
    
    if (multiline) {
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
        />
      );
    }
    
    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6 print:hidden">
        {isEditable && (
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              editMode 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <FiFileText className="w-4 h-4" />
            {editMode ? 'Done Editing' : 'Edit Form'}
          </button>
        )}
        
        <button
          onClick={exportToWord}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <FiDownload className="w-4 h-4" />
          Export to Word
        </button>
        
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <FiPrinter className="w-4 h-4" />
          Print / PDF
        </button>
        
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isCopied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
          {isCopied ? 'Copied!' : 'Copy Text'}
        </button>
      </div>

      {/* Form Content */}
      <div id="parent-intake-form" className="bg-white border rounded-lg overflow-hidden print:shadow-none">
        {/* Header */}
        <div className="bg-gray-100 border-b p-4 print:bg-white">
          <h1 className="text-xl font-bold text-center text-gray-900">PARENT INTAKE FORM</h1>
          <p className="text-center text-sm text-gray-600 mt-1">MindSaid Learning Centre</p>
        </div>

        {/* Section I: Identifying Information */}
        <div className="border-b">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h2 className="font-semibold text-gray-900">Section I: IDENTIFYING INFORMATION</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Child's Name:</label>
                <div className="mt-1">
                  <EditableField 
                    value={`${formData.firstName || ''} ${formData.middleName || ''} ${formData.lastName || ''}`}
                    onChange={(val) => handleFieldChange('formData', 'firstName', val)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Birth Date:</label>
                <div className="mt-1">
                  <EditableField 
                    value={formData.birthDate}
                    onChange={(val) => handleFieldChange('formData', 'birthDate', val)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Age:</label>
                <div className="mt-1 text-gray-900">{calculateAge(formData.birthDate)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Gender:</label>
                <div className="mt-1">
                  <EditableField 
                    value={formData.gender}
                    onChange={(val) => handleFieldChange('formData', 'gender', val)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Name of School:</label>
                <div className="mt-1">
                  <EditableField 
                    value={formData.schoolName}
                    onChange={(val) => handleFieldChange('formData', 'schoolName', val)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Grade:</label>
                <div className="mt-1">
                  <EditableField 
                    value={formData.grade}
                    onChange={(val) => handleFieldChange('formData', 'grade', val)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Language of Testing:</label>
                <div className="mt-1">
                  <EditableField 
                    value={formData.languageOfTesting === 'other' ? formData.customLanguage : formData.languageOfTesting}
                    onChange={(val) => handleFieldChange('formData', 'languageOfTesting', val)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Contact Information:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <span className="text-sm text-gray-600">Phone:</span>
                  <EditableField 
                    value={formData.phone}
                    onChange={(val) => handleFieldChange('formData', 'phone', val)}
                  />
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <EditableField 
                    value={formData.email}
                    onChange={(val) => handleFieldChange('formData', 'email', val)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Address:</label>
              <div className="mt-1">
                <EditableField 
                  value={`${formData.address || ''}, ${formData.city || ''}, ${formData.state || ''} ${formData.zipCode || ''}`}
                  onChange={(val) => handleFieldChange('formData', 'address', val)}
                  multiline
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section II: Present Academic Concerns */}
        <div className="border-b">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h2 className="font-semibold text-gray-900">Section II: PRESENT ACADEMIC CONCERNS</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {/* Academic Concerns */}
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Academic Concerns:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getCheckedItems('academicConcerns').map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-sm">☑ {item}</span>
                    </div>
                  ))}
                  {getCheckedItems('academicConcerns').length === 0 && (
                    <span className="text-gray-500 text-sm">No academic concerns specified</span>
                  )}
                </div>
              </div>

              {/* Cognitive Evaluation */}
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Cognitive Evaluation:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getCheckedItems('cognitiveEvaluation').map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-sm">☑ {item}</span>
                    </div>
                  ))}
                  {getCheckedItems('cognitiveEvaluation').length === 0 && (
                    <span className="text-gray-500 text-sm">No cognitive evaluation specified</span>
                  )}
                </div>
              </div>

              {/* Behaviour Concerns */}
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Behaviour Concerns:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getCheckedItems('behaviourConcerns').map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-sm">☑ {item}</span>
                    </div>
                  ))}
                  {getCheckedItems('behaviourConcerns').length === 0 && (
                    <span className="text-gray-500 text-sm">No behaviour concerns specified</span>
                  )}
                </div>
              </div>

              {/* Language Concerns */}
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Language Concerns:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getCheckedItems('languageConcerns').map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-sm">☑ {item}</span>
                    </div>
                  ))}
                  {getCheckedItems('languageConcerns').length === 0 && (
                    <span className="text-gray-500 text-sm">No language concerns specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section III: Family History */}
        <div className="border-b">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h2 className="font-semibold text-gray-900">Section III: PRESENT FAMILY STATUS / HISTORY</h2>
          </div>
          <div className="p-4">
            {/* Father's Details */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-800 mb-2">Father's Details:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Education:</label>
                  <div className="mt-1">
                    <EditableField 
                      value={educationSampleReportData.fatherEducation === 'other' 
                        ? educationSampleReportData.fatherEducationOther 
                        : educationSampleReportData.fatherEducation}
                      onChange={(val) => handleFieldChange('education', 'fatherEducation', val)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Profession:</label>
                  <div className="mt-1">
                    <EditableField 
                      value={employmentSampleReportData.employmentStatus === 'other'
                        ? employmentSampleReportData.employmentStatusOther
                        : employmentSampleReportData.employmentStatus}
                      onChange={(val) => handleFieldChange('employment', 'employmentStatus', val)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mother's Details */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-800 mb-2">Mother's Details:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Education:</label>
                  <div className="mt-1">
                    <EditableField 
                      value={educationSampleReportData.motherEducation === 'other'
                        ? educationSampleReportData.motherEducationOther
                        : educationSampleReportData.motherEducation}
                      onChange={(val) => handleFieldChange('education', 'motherEducation', val)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Profession:</label>
                  <div className="mt-1">
                    <EditableField 
                      value={employmentSampleReportData.employmentStatus === 'other'
                        ? employmentSampleReportData.employmentStatusOther
                        : employmentSampleReportData.employmentStatus}
                      onChange={(val) => handleFieldChange('employment', 'employmentStatus', val)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Information */}
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Referral Information:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Referred By:</label>
                  <div className="mt-1">
                    <EditableField 
                      value={historyData.referralSourceName}
                      onChange={(val) => handleFieldChange('history', 'referralSourceName', val)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Role:</label>
                  <div className="mt-1">
                    <EditableField 
                      value={historyData.referralSourceRole}
                      onChange={(val) => handleFieldChange('history', 'referralSourceRole', val)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section IV: Medical History */}
        <div className="border-b">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h2 className="font-semibold text-gray-900">Section IV: MEDICAL HISTORY</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {/* Health History Source */}
              <div>
                <label className="text-sm font-medium text-gray-700">Health History According to:</label>
                <div className="mt-1">
                  <EditableField 
                    value={healthSampleReportData.healthHistorySource === 'other'
                      ? healthSampleReportData.healthHistorySourceOther
                      : healthSampleReportData.healthHistorySource}
                    onChange={(val) => handleFieldChange('health', 'healthHistorySource', val)}
                  />
                </div>
              </div>

              {/* Vision Screening */}
              <div>
                <label className="text-sm font-medium text-gray-700">Vision Screening Results:</label>
                <div className="mt-1">
                  <EditableField 
                    value={healthSampleReportData.visionResult === 'other'
                      ? healthSampleReportData.visionResultOther
                      : healthSampleReportData.visionResult}
                    onChange={(val) => handleFieldChange('health', 'visionResult', val)}
                  />
                </div>
              </div>

              {/* Hearing Screening */}
              <div>
                <label className="text-sm font-medium text-gray-700">Hearing Screening Results:</label>
                <div className="mt-1">
                  <EditableField 
                    value={healthSampleReportData.hearingResult === 'other'
                      ? healthSampleReportData.hearingResultOther
                      : healthSampleReportData.hearingResult}
                    onChange={(val) => handleFieldChange('health', 'hearingResult', val)}
                  />
                </div>
              </div>

              {/* Developmental Milestones from Language/Development section */}
              <div>
                <label className="text-sm font-medium text-gray-700">Developmental Milestones:</label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['crawling', 'walking', 'talking', 'toiletTraining'].map((milestone) => (
                    <div key={milestone} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 capitalize">{milestone.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-sm">{languageSampleReportData[`milestone${milestone.charAt(0).toUpperCase() + milestone.slice(1)}`] || '-'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section V: Educational History */}
        <div className="border-b">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h2 className="font-semibold text-gray-900">Section V: EDUCATIONAL HISTORY</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Current School/Grade:</label>
                <div className="mt-1">
                  <EditableField 
                    value={`${formData.schoolName || ''} - Grade ${formData.grade || ''}`}
                    onChange={(val) => handleFieldChange('formData', 'schoolName', val)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Sample Report Sentence:</label>
                <div className="mt-1 p-3 bg-gray-50 rounded text-sm italic">
                  {languageSampleReportData.additionalInfo || 'No additional information provided.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section VI: Additional Information */}
        <div>
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h2 className="font-semibold text-gray-900">Section VI: ADDITIONAL INFORMATION</h2>
          </div>
          <div className="p-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Any other relevant information:</label>
              <div className="mt-1">
                <EditableField 
                  value={historyData.personalNotes || languageSampleReportData.additionalInfo || ''}
                  onChange={(val) => handleFieldChange('history', 'personalNotes', val)}
                  multiline
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-gray-600">
                I hereby confirm that all the facts given above are true and correct to the best of my knowledge.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name of parent filling the form:</label>
                  <div className="mt-1 border-b border-gray-400 pb-1">
                    <EditableField 
                      value={historyData.referralSourceName}
                      onChange={(val) => handleFieldChange('history', 'referralSourceName', val)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date:</label>
                  <div className="mt-1 border-b border-gray-400 pb-1">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default ParentIntakeReport;
