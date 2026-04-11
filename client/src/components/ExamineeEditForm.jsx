import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiUpload, FiTrash2, FiFile, FiImage } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { useToast } from './Toast';
import api from '../services/api';

const StudentEditForm = ({ studentId, onSave, onCancel }) => {
  const toast = useToast();
  const hasFetched = useRef(false);
  const hasSaved = useRef(false);
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    languageOfTesting: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    centreId: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    learningNeeds: '',
    supportRequirements: '',
    status: 'Active',
    documents: [] // Array to store uploaded documents
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const centres = [
    { id: 1, name: 'Centrix Centre' },
    { id: 5, name: 'Test' }
  ];

  useEffect(() => {
    const fetchStudent = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      
      try {
        // Remove # prefix from studentId if present
        const cleanStudentId = studentId.toString().replace('#', '');
        console.log('Fetching student with ID:', cleanStudentId);
        const result = await api.getPatient(cleanStudentId);
        console.log('API Response:', result);
        
        if (result.success) {
          const student = result.data;
          console.log('Student data:', student);
          setFormData({
            id: student.id,
            firstName: student.first_name || '',
            lastName: student.last_name || '',
            email: student.email || '',
            phone: student.phone || '',
            dateOfBirth: student.date_of_birth ? student.date_of_birth.split('T')[0] : '',
            gender: student.gender || '',
            address: student.address || '',
            city: student.city || '',
            state: student.state || '',
            zipCode: student.zip_code || '',
            centreId: student.centre_id || '',
            emergencyContactName: student.emergency_contact_name || '',
            emergencyContactPhone: student.emergency_contact_phone || '',
            emergencyContactRelation: student.emergency_contact_relation || '',
            learningNeeds: student.learning_needs || '',
            supportRequirements: student.support_requirements || '',
            status: student.status || 'Active',
            documents: student.documents ? (Array.isArray(student.documents) ? student.documents : []) : []
          });
        } else {
          toast.error('Failed to fetch student data');
        }
      } catch (error) {
        console.error('Error fetching student:', error);
        toast.error('Error loading student data');
      } finally {
        setLoading(false);
      }
    };

    if (studentId && !hasFetched.current) {
      fetchStudent();
    }
    
    // Reset fetch flag when studentId changes
    return () => {
      hasFetched.current = false;
    };
  }, [studentId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (hasSaved.current) return;
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    hasSaved.current = true;
    
    try {
      // Remove # prefix from studentId if present
      const cleanStudentId = studentId.toString().replace('#', '');
      
      // Debug logging - what data are we sending?
      console.log('🚀 UPDATING STUDENT - Client Side Debug:');
      console.log('📤 Student ID:', cleanStudentId);
      console.log('📤 Form Data:', JSON.stringify(formData, null, 2));
      console.log('📤 Form Data Keys:', Object.keys(formData));
      console.log('📤 Form Data Values:', Object.values(formData));
      
      const result = await api.updatePatient(cleanStudentId, formData);
      
      if (result.success) {
        toast.success('Student updated successfully');
        onSave(result.data);
      } else {
        toast.error(result.message || 'Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Error updating student');
    } finally {
      setIsSubmitting(false);
      hasSaved.current = false;
    }
  };

  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading student data...</div>
      </div>
    );
  }

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
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Update Examinee'}</span>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Examinees</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Edit Examinee</span>
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
                <h2 className="text-xl font-semibold text-gray-800">Edit Student</h2>
                <p className="text-gray-600">Update student information</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language of Testing
                  </label>
                  <select
                    value={formData.languageOfTesting}
                    onChange={(e) => handleInputChange('languageOfTesting', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.languageOfTesting ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select language</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Demographics">Demographics</option>
                    <option value="Bilingual">Bilingual</option>
                    <option value="Other">Other</option>
                  </select>
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

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter full address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter state"
                  />
                </div>
              </div>
            </div>

            {/* Centre & Emergency Contact */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Centre & Emergency Contact</h3>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter emergency contact name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter emergency contact phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Relation
                  </label>
                  <select
                    value={formData.emergencyContactRelation}
                    onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select relation</option>
                    <option value="Parent">Parent</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Learning Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Learning Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Needs
                  </label>
                  <textarea
                    value={formData.learningNeeds}
                    onChange={(e) => handleInputChange('learningNeeds', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe specific learning needs..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Requirements
                  </label>
                  <textarea
                    value={formData.supportRequirements}
                    onChange={(e) => handleInputChange('supportRequirements', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe support requirements..."
                  />
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Documents</h3>
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

                {/* Existing Documents */}
                {formData.documents && formData.documents.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Documents ({formData.documents.length})
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
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentEditForm;
