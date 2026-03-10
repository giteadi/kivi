import { motion } from 'framer-motion';
import { FiPrinter, FiDownload, FiMail, FiEye } from 'react-icons/fi';
import { useState } from 'react';

const PrintEncounter = ({ sessionData, problems, observations, notes }) => {
  const [selectedSections, setSelectedSections] = useState({
    studentInfo: true,
    centerInfo: true,
    sessionDetails: true,
    problems: true,
    observations: true,
    notes: true,
    bodyChart: false,
    medications: true,
    vitals: true
  });

  const [printFormat, setPrintFormat] = useState('pdf');
  const [includeHeader, setIncludeHeader] = useState(true);
  const [includeFooter, setIncludeFooter] = useState(true);

  const encounterData = {
    student: {
      name: sessionData?.student_first_name && sessionData?.student_last_name 
        ? `${sessionData.student_first_name} ${sessionData.student_last_name}` 
        : 'Unknown Student',
      id: sessionData?.student_id || 'N/A',
      age: 'N/A',
      gender: 'N/A',
      phone: 'N/A',
      email: sessionData?.student_email || 'No email'
    },
    center: {
      name: sessionData?.centre_name || 'Unknown Centre',
      therapist: sessionData?.therapist_first_name && sessionData?.therapist_last_name
        ? `${sessionData.therapist_first_name} ${sessionData.therapist_last_name}`
        : 'Unknown Therapist',
      address: 'N/A',
      phone: 'N/A'
    },
    session: {
      date: sessionData?.session_date 
        ? new Date(sessionData.session_date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        : 'Unknown Date',
      time: sessionData?.session_time || 'Unknown Time',
      type: sessionData?.programme_name || 'Unknown Programme',
      status: sessionData?.status || 'Unknown'
    }
  };

  const handleSectionToggle = (section) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePrint = () => {
    // In a real app, this would generate and print the document
    console.log('Printing encounter with sections:', selectedSections);
    alert('Print functionality would be implemented here');
  };

  const handleDownload = () => {
    // In a real app, this would generate and download the document
    console.log('Downloading encounter as:', printFormat);
    alert(`Download as ${printFormat.toUpperCase()} would be implemented here`);
  };

  const handleEmail = () => {
    // In a real app, this would open email dialog
    alert('Email functionality would be implemented here');
  };

  const handlePreview = () => {
    // In a real app, this would show print preview
    alert('Print preview would be implemented here');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Print Options */}
        <div className="lg:col-span-1 space-y-6">
          {/* Format Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Print Format</h3>
            <div className="space-y-3">
              {['pdf', 'doc', 'html'].map((format) => (
                <label key={format} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    checked={printFormat === format}
                    onChange={(e) => setPrintFormat(e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 uppercase">{format}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Print Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Print Options</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHeader}
                  onChange={(e) => setIncludeHeader(e.target.checked)}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">Include Header</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeFooter}
                  onChange={(e) => setIncludeFooter(e.target.checked)}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">Include Footer</span>
              </label>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePreview}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <FiEye className="w-4 h-4" />
                <span>Preview</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrint}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FiPrinter className="w-4 h-4" />
                <span>Print</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                <span>Download</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEmail}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <FiMail className="w-4 h-4" />
                <span>Email</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Section Selection & Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Sections to Include</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedSections).map(([section, isSelected]) => (
                <label key={section} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSectionToggle(section)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {section.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Print Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Print Preview</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 min-h-96 border-2 border-dashed border-gray-300">
              {/* Header */}
              {includeHeader && (
                <div className="text-center mb-6 pb-4 border-b border-gray-300">
                  <h1 className="text-2xl font-bold text-gray-800">Educational Session Report</h1>
                  <p className="text-gray-600">{encounterData.center.name}</p>
                </div>
              )}

              {/* Student Info */}
              {selectedSections.studentInfo && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Student Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span> {encounterData.student.name}
                    </div>
                    <div>
                      <span className="text-gray-600">ID:</span> {encounterData.student.id}
                    </div>
                    <div>
                      <span className="text-gray-600">Age:</span> {encounterData.student.age}
                    </div>
                    <div>
                      <span className="text-gray-600">Gender:</span> {encounterData.student.gender}
                    </div>
                  </div>
                </div>
              )}

              {/* Center Info */}
              {selectedSections.centerInfo && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Center Information</h4>
                  <div className="text-sm">
                    <p><span className="text-gray-600">Center:</span> {encounterData.center.name}</p>
                    <p><span className="text-gray-600">Therapist:</span> {encounterData.center.therapist}</p>
                    <p><span className="text-gray-600">Address:</span> {encounterData.center.address}</p>
                  </div>
                </div>
              )}

              {/* Session Details */}
              {selectedSections.sessionDetails && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Session Details</h4>
                  <div className="text-sm">
                    <p><span className="text-gray-600">Date:</span> {encounterData.session.date}</p>
                    <p><span className="text-gray-600">Time:</span> {encounterData.session.time}</p>
                    <p><span className="text-gray-600">Type:</span> {encounterData.session.type}</p>
                    <p><span className="text-gray-600">Status:</span> {encounterData.session.status}</p>
                  </div>
                </div>
              )}

              {/* Problems */}
              {selectedSections.problems && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Problems</h4>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {problems && problems.length > 0 ? (
                      problems.map((problem, index) => (
                        <li key={problem.id || index}>{problem.text}</li>
                      ))
                    ) : (
                      <li className="text-gray-500">No problems recorded</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Observations */}
              {selectedSections.observations && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Observations</h4>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {observations && observations.length > 0 ? (
                      observations.map((observation, index) => (
                        <li key={observation.id || index}>{observation.text}</li>
                      ))
                    ) : (
                      <li className="text-gray-500">No observations recorded</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Notes */}
              {selectedSections.notes && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
                  {notes && notes.trim() ? (
                    <p className="text-sm text-gray-700">{notes}</p>
                  ) : (
                    <p className="text-sm text-gray-500">No notes recorded</p>
                  )}
                </div>
              )}

              {/* Footer */}
              {includeFooter && (
                <div className="text-center mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500">
                  <p>Generated on {new Date().toLocaleDateString()} | {encounterData.center.name}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrintEncounter;