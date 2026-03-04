import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload, FiDownload, FiInfo, FiMail, FiMessageSquare, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

const ImportModal = ({ isOpen, onClose, importType = 'patients' }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileFormat, setFileFormat] = useState('');
  const [notifications, setNotifications] = useState({
    email: false,
    sms: false
  });
  const [isUploading, setIsUploading] = useState(false);

  const importTypes = {
    patients: {
      title: 'Import Student Data',
      requiredFields: [
        'first_name',
        'last_name', 
        'email',
        'country_calling_code',
        'country_code',
        'contact',
        'gender'
      ],
      sampleFileName: 'students_sample.csv'
    },
    students: {
      title: 'Import Student Data',
      requiredFields: [
        'first_name',
        'last_name', 
        'email',
        'country_calling_code',
        'country_code',
        'contact',
        'gender'
      ],
      sampleFileName: 'students_sample.csv'
    },
    doctors: {
      title: 'Import Therapist Data',
      requiredFields: [
        'first_name',
        'last_name',
        'email',
        'contact',
        'specialty',
        'qualification',
        'license_number'
      ],
      sampleFileName: 'therapists_sample.csv'
    },
    therapists: {
      title: 'Import Therapist Data',
      requiredFields: [
        'first_name',
        'last_name',
        'email',
        'contact',
        'specialty',
        'qualification',
        'license_number'
      ],
      sampleFileName: 'therapists_sample.csv'
    },
    receptionists: {
      title: 'Import Staff Data',
      requiredFields: [
        'first_name',
        'last_name',
        'email',
        'contact',
        'department',
        'shift',
        'employee_id'
      ],
      sampleFileName: 'staff_sample.csv'
    },
    clinics: {
      title: 'Import Centre Data',
      requiredFields: [
        'name',
        'address',
        'city',
        'state',
        'zip_code',
        'phone',
        'email',
        'specialties'
      ],
      sampleFileName: 'centres_sample.csv'
    },
    appointments: {
      title: 'Import Session Data',
      requiredFields: [
        'student_name',
        'therapist_name',
        'session_date',
        'session_time',
        'centre',
        'service_type'
      ],
      sampleFileName: 'sessions_sample.csv'
    },
    sessions: {
      title: 'Import Session Data',
      requiredFields: [
        'student_name',
        'therapist_name',
        'session_date',
        'session_time',
        'centre',
        'service_type'
      ],
      sampleFileName: 'sessions_sample.csv'
    },
    services: {
      title: 'Import Programme Data',
      requiredFields: [
        'service_name',
        'category',
        'price',
        'duration',
        'centre',
        'description'
      ],
      sampleFileName: 'programmes_sample.csv'
    }
  };

  const currentImport = importTypes[importType] || importTypes['patients'];
  const fileFormats = ['Choose file format...', 'CSV', 'Excel (.xlsx)', 'JSON'];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleDownloadSample = () => {
    // In a real app, this would download the actual sample file
    alert(`Downloading ${currentImport.sampleFileName} sample file...`);
  };

  const handleImport = async () => {
    if (!selectedFile || !fileFormat || fileFormat === 'Choose file format...') {
      alert('Please select a file and format before importing.');
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`${currentImport.title} completed successfully! ${Math.floor(Math.random() * 50) + 10} records imported.`);
      
      // Reset form
      setSelectedFile(null);
      setFileFormat('');
      setNotifications({ email: false, sms: false });
      
      onClose();
    } catch (error) {
      alert('Import failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setFileFormat('');
    setNotifications({ email: false, sms: false });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentImport.title}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* File Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Upload File</h3>
                
                {/* File Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Format *
                  </label>
                  <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {fileFormats.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept=".csv,.xlsx,.json"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <FiUpload className="text-gray-400" size={32} />
                      <div className="text-sm text-gray-600">
                        {selectedFile ? (
                          <span className="text-green-600 font-medium">
                            {selectedFile.name}
                          </span>
                        ) : (
                          <>
                            <span className="text-blue-600 font-medium">Click to upload</span>
                            <span> or drag and drop</span>
                          </>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        CSV, Excel or JSON files only
                      </div>
                    </label>
                  </div>
                </div>

                {/* Download Sample */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FiInfo className="text-blue-600" size={20} />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Need a sample file?
                      </p>
                      <p className="text-xs text-blue-700">
                        Download our template to see the required format
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadSample}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FiDownload size={16} />
                    <span>Download Sample</span>
                  </button>
                </div>
              </div>

              {/* Required Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Required Fields</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Your file must contain the following columns:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {currentImport.requiredFields.map((field) => (
                      <div key={field} className="flex items-center space-x-2">
                        <FiCheck className="text-green-600" size={16} />
                        <span className="text-sm font-mono text-gray-800">
                          {field}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notification Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Notification Options</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        email: e.target.checked
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <FiMail className="text-gray-500" size={16} />
                      <span className="text-sm text-gray-700">
                        Send email notification when import is complete
                      </span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        sms: e.target.checked
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <FiMessageSquare className="text-gray-500" size={16} />
                      <span className="text-sm text-gray-700">
                        Send SMS notification when import is complete
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCancel}
                disabled={isUploading}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={isUploading || !selectedFile || !fileFormat || fileFormat === 'Choose file format...'}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <FiUpload size={16} />
                    <span>Import {importType}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImportModal;