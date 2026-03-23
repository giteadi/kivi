import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiPlus, FiTrash2, FiUpload, FiFile, FiImage } from 'react-icons/fi';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';

const ExamineeCreateForm = ({ onSave, onCancel }) => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    centreId: '',
    status: 'active',
    student_id: '', // User can enter their own student ID
    account_email: user?.email || '',
    account_phone: user?.phone || '',
    customFields: {}, // Dynamic custom fields object
    documents: [] // Array to store uploaded documents
  });

  const [errors, setErrors] = useState({});
  const [customFieldCount, setCustomFieldCount] = useState(2); // Fixed to 2 custom fields only

  const centres = [
    { id: 1, name: 'MindSaid Learning Centre' },
    { id: 5, name: 'Test' }
  ];

  // Handle custom field changes
  const handleCustomFieldChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [`customField_${index}`]: value
      }
    }));
  };

  // Add new custom field
  const addCustomField = () => {
    setCustomFieldCount(prev => prev + 1);
  };

  // Remove custom field
  const removeCustomField = (index) => {
    const newCustomFields = { ...formData.customFields };
    delete newCustomFields[`customField_${index}`];
    
    setFormData(prev => ({
      ...prev,
      customFields: newCustomFields
    }));
    
    setCustomFieldCount(prev => Math.max(1, prev - 1)); // Minimum 1 field
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }
    });

    const filePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target.result, // Base64 string
            uploadDate: new Date().toISOString()
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(newDocuments => {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newDocuments]
      }));
    });
  };

  // Remove uploaded document
  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <FiImage className="w-4 h-4" />;
    return <FiFile className="w-4 h-4" />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.centreId) {
      newErrors.centreId = 'Centre is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Map frontend field names to database column names
        const dbData = {
          student_id: formData.student_id || `STU${Date.now()}`, // Use user ID or auto-generate
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          centre_id: formData.centreId,
          status: formData.status,
          account_email: formData.account_email,
          account_phone: formData.account_phone,
          ...formData.customFields, // Spread all dynamic custom fields
          documents: formData.documents // Include uploaded documents
        };
        
        const result = await api.createPatient(dbData);
        
        if (result.success) {
          onSave(result.data);
        } else {
          console.error('Error creating examinee:', result.message);
          // Show user-friendly error message
          if (result.message && result.message.includes('already exists')) {
            alert('This Student ID is already taken. Please use a different Student ID or leave it empty for auto-generation.');
          } else {
            alert('Error creating examinee: ' + result.message);
          }
        }
      } catch (error) {
        console.error('Error creating examinee:', error);
      }
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back to Examinees</span>
            </motion.button>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiX className="w-4 h-4" />
              <span>Cancel</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiSave className="w-4 h-4" />
              <span>Create Examinee</span>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Examinees</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Create New Examinee</span>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Create New Examinee</h2>
                <p className="text-gray-600">Add a new examinee to the learning centre</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Examinee ID
                  </label>
                  <input
                    type="text"
                    value={formData.student_id}
                    onChange={(e) => handleInputChange('student_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter examinee ID (leave empty for auto-generate)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Email
                  </label>
                  <input
                    type="text"
                    value={formData.account_email}
                    onChange={(e) => handleInputChange('account_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Account holder email (auto-filled)"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Phone
                  </label>
                  <input
                    type="text"
                    value={formData.account_phone}
                    onChange={(e) => handleInputChange('account_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Account holder phone (auto-filled)"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Custom Fields</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addCustomField}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Custom Field</span>
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {Array.from({ length: customFieldCount }, (_, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Field {index + 1}
                      </label>
                      {index >= 1 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeCustomField(index)}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                    
                    <input
                      type="text"
                      value={formData.customFields[`customField_${index}`] || ''}
                      onChange={(e) => handleCustomFieldChange(index, 'customField', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter field name"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Documents Upload</h3>
              <div className="space-y-4">
                {/* Upload Button */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Documents (DOCX, Excel, Images, PDF, etc.)
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
                      <FiUpload className="w-4 h-4" />
                      <span>Choose Files</span>
                      <input
                        type="file"
                        multiple
                        accept=".docx,.xlsx,.xls,.doc,.pdf,.jpg,.jpeg,.png,.gif,.bmp,.tiff"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      Maximum file size: 10MB per file
                    </span>
                  </div>
                </div>

                {/* Uploaded Documents List */}
                {formData.documents.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Uploaded Documents ({formData.documents.length})
                    </h4>
                    <div className="space-y-2">
                      {formData.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-blue-600">
                              {getFileIcon(doc.type)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {doc.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(doc.size)} • {doc.type || 'Unknown type'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove document"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Centre & Status */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Centre & Status</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Centre *
                  </label>
                  <select
                    value={formData.centreId}
                    onChange={(e) => handleInputChange('centreId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.centreId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select centre</option>
                    {centres.map((centre) => (
                      <option key={centre.id} value={centre.id}>
                        {centre.name}
                      </option>
                    ))}
                  </select>
                  {errors.centreId && (
                    <p className="mt-1 text-sm text-red-600">{errors.centreId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                    <option value="graduated">Graduated</option>
                    <option value="transferred">Transferred</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ExamineeCreateForm;