import { motion } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiTrash2, FiFileText, FiUser, FiPhone, FiMail, FiMapPin, FiCalendar, FiEdit3, FiDownload, FiFile, FiImage, FiX, FiEye } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPatient } from '../store/slices/patientSlice';
import { fetchAssessments, toggleAssessmentSelection, clearSelection, selectAllAssessments, createAssessment, deleteAssessment, generateAssessmentReport, updateAssessment } from '../store/slices/assessmentSlice';
import { useToast } from './Toast';
import AssignAssessmentModal from './AssignAssessmentModal';
import GenerateReportModal from './GenerateReportModal';
import EditAssessmentModal from './EditAssessmentModal';
import api from '../services/api';

const ExamineeDetail = ({ examineeId, onBack, onEditExaminee }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { currentPatient, isLoading: patientLoading, error: patientError } = useSelector((state) => state.patients);
  const { assessments, isLoading: assessmentLoading, error: assessmentError, selectedAssessments } = useSelector((state) => state.assessments);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDocumentManageOpen, setIsDocumentManageOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [selectedAssessmentToEdit, setSelectedAssessmentToEdit] = useState(null);
  const [isEditAssessmentModalOpen, setIsEditAssessmentModalOpen] = useState(false);

  useEffect(() => {
    if (examineeId) {
      dispatch(fetchPatient(examineeId));
      dispatch(fetchAssessments(examineeId));
    }
  }, [dispatch, examineeId]);

  const isLoading = patientLoading || assessmentLoading;
  const error = patientError || assessmentError;

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      
      if (isNaN(birthDate.getTime())) {
        return 'Invalid date';
      }
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age;
    } catch (error) {
      return 'Not available';
    }
  };

  // Transform patient data to match component expectations
  const transformPatientData = (patient) => {
    if (!patient) return null;
    
    return {
      id: patient.id,
      systemId: `SYS${patient.id.toString().padStart(6, '0')}`,
      name: `${patient.first_name || 'Unknown'} ${patient.last_name || 'Unknown'}`,
      birthDate: patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) : 'Not provided',
      age: patient.date_of_birth ? calculateAge(patient.date_of_birth) : 'Not available',
      examineeId: patient.student_id || `STU${patient.id}`,
      gender: patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'Not specified',
      customField1: patient.custom_field_1 || patient.customField1 || '',
      customField2: patient.custom_field_2 || patient.customField2 || '',
      customField3: patient.custom_field_3 || patient.customField3 || '',
      customField4: patient.custom_field_4 || patient.customField4 || '',
      groups: patient.groups || '',
      legacyId: patient.legacy_id || '',
      email: patient.email || 'Not provided',
      phone: patient.phone || 'Not provided',
      centre: patient.centre_name || 'MindSaid Learning Centre',
      documents: patient.documents ? (Array.isArray(patient.documents) ? patient.documents : []) : []
    };
  };

  const examineeData = transformPatientData(currentPatient);

  const handleAssignNewAssessment = () => {
    setIsAssignModalOpen(true);
  };

  const handleAssessmentAssigned = () => {
    setIsAssignModalOpen(false);
    // Refresh assessments after assignment
    dispatch(fetchAssessments(examineeId));
  };

  const handleDeleteAssessments = () => {
    if (selectedAssessments.length === 0) {
      toast.error('Please select assessments to delete');
      return;
    }
    
    // Delete each selected assessment
    Promise.all(selectedAssessments.map(id => dispatch(deleteAssessment(id)).unwrap()))
      .then(() => {
        toast.success(`${selectedAssessments.length} assessment(s) deleted successfully!`);
        dispatch(clearSelection());
        // Refresh assessments after deletion
        dispatch(fetchAssessments(examineeId));
      })
      .catch(() => {
        toast.error('Failed to delete assessments');
      });
  };

  const handleEditAssessment = (assessment) => {
    setSelectedAssessmentToEdit(assessment);
    setIsEditAssessmentModalOpen(true);
  };

  const handleAssessmentUpdated = () => {
    setIsEditAssessmentModalOpen(false);
    setSelectedAssessmentToEdit(null);
    // Refresh assessments after update
    dispatch(fetchAssessments(examineeId));
    toast.success('Assessment updated successfully!');
  };

  const handleGenerateReport = () => {
    if (selectedAssessments.length === 0) {
      toast.error('Please select assessments to generate report');
      return;
    }
    
    setIsReportModalOpen(true);
  };

  const handleAssessmentSelection = (assessmentId) => {
    dispatch(toggleAssessmentSelection(assessmentId));
  };

  const handleSelectAllAssessments = () => {
    if (selectedAssessments.length === assessments.length) {
      dispatch(clearSelection());
    } else {
      dispatch(selectAllAssessments());
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <FiImage className="w-4 h-4 text-green-600" />;
    return <FiFile className="w-4 h-4 text-blue-600" />;
  };

  // Download document
  const downloadDocument = (doc) => {
    try {
      // Create a link element and trigger download
      const link = window.document.createElement('a');
      link.href = doc.data;
      link.download = doc.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      toast.success(`Downloading ${doc.name}`);
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  // View document
  const viewDocument = (doc) => {
    setViewingDocument(doc);
  };

  // Delete document
  const handleDeleteDocument = (index) => {
    if (!window.confirm(`Delete "${examineeData.documents[index].name}"?`)) {
      return;
    }

    setIsSaving(true);
    const updatedDocuments = examineeData.documents.filter((_, i) => i !== index);
    
    // Call API directly to save
    api.updatePatient(currentPatient.id, {
      ...currentPatient,
      documents: updatedDocuments
    }).then((response) => {
      toast.success('Document deleted successfully');
      // Refresh the patient data
      dispatch(fetchPatient(examineeId));
      setIsSaving(false);
    }).catch((error) => {
      toast.error('Failed to delete document: ' + error.message);
      setIsSaving(false);
    });
  };

  // Replace document
  const handleReplaceDocument = (index) => {
    // Open file picker
    const fileInput = window.document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.docx,.xlsx,.png,.jpg,.jpeg,.gif';
    
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setIsSaving(true);
      try {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const updatedDocuments = [...examineeData.documents];
        updatedDocuments[index] = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64,
          uploadDate: new Date().toISOString()
        };

        // Call API directly to save
        await api.updatePatient(currentPatient.id, {
          ...currentPatient,
          documents: updatedDocuments
        });

        toast.success('Document replaced successfully');
        // Refresh the patient data
        dispatch(fetchPatient(examineeId));
        setIsSaving(false);
      } catch (error) {
        toast.error('Failed to replace document: ' + error.message);
        setIsSaving(false);
      }
    };

    fileInput.click();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'report generated':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading examinee data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="text-red-800 text-center">
            <p className="text-lg font-medium mb-2">Error Loading Data</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!examineeData) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
          <div className="text-yellow-800 text-center">
            <p className="text-lg font-medium mb-2">No Data Available</p>
            <p className="text-sm">Examinee information not found.</p>
            <button 
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
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
              onClick={onBack}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-blue-600" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Examinee: {examineeData.name}</h1>
              <p className="text-gray-600">View and manage examinee information and assessments</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEditExaminee && onEditExaminee(examineeId)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FiEdit3 className="w-4 h-4" />
            <span>Edit Examinee</span>
          </motion.button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Examinees</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Examinee Detail</span>
        </div>

        {/* Demographic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border mb-6"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Demographic Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">System ID</label>
                <p className="text-sm text-gray-800 font-medium">{examineeData.systemId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-sm text-gray-800 font-medium">{examineeData.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Birth Date</label>
                <p className="text-sm text-gray-800">{examineeData.birthDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Age</label>
                <p className="text-sm text-gray-800">{examineeData.age}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Examinee ID</label>
                <p className="text-sm text-gray-800">{examineeData.examineeId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-sm text-gray-800">{examineeData.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <div className="flex items-center text-sm text-gray-800">
                  <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                  {examineeData.email}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <div className="flex items-center text-sm text-gray-800">
                  <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                  {examineeData.phone}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Centre</label>
                <p className="text-sm text-gray-800">{examineeData.centre}</p>
              </div>
            </div>

            {/* Custom Fields */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Custom Fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Custom Field 1</label>
                  <p className="text-sm text-gray-800">{examineeData.customField1 || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Custom Field 2</label>
                  <p className="text-sm text-gray-800">{examineeData.customField2 || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Custom Field 3</label>
                  <p className="text-sm text-gray-800">{examineeData.customField3 || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Custom Field 4</label>
                  <p className="text-sm text-gray-800">{examineeData.customField4 || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Additional Fields */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Groups</label>
                  <p className="text-sm text-gray-800">{examineeData.groups || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Legacy ID</label>
                  <p className="text-sm text-gray-800">{examineeData.legacyId || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Documents Section */}
        {(examineeData.documents && examineeData.documents.length > 0 || true) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl shadow-sm border mb-6"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Documents</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {examineeData.documents?.length || 0} file(s)
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Open file picker to add new document
                      const fileInput = window.document.createElement('input');
                      fileInput.type = 'file';
                      fileInput.accept = '.pdf,.docx,.xlsx,.png,.jpg,.jpeg,.gif';
                      
                      fileInput.onchange = async (event) => {
                        const file = event.target.files[0];
                        if (!file) return;

                        if (file.size > 10 * 1024 * 1024) {
                          toast.error('File size must be less than 10MB');
                          return;
                        }

                        setIsSaving(true);
                        try {
                          const base64 = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                          });

                          const newDoc = {
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            data: base64,
                            uploadDate: new Date().toISOString()
                          };

                          const updatedDocuments = [...(examineeData.documents || []), newDoc];

                          // Call API directly to save
                          await api.updatePatient(currentPatient.id, {
                            ...currentPatient,
                            documents: updatedDocuments
                          });

                          toast.success('Document added successfully');
                          // Refresh the patient data
                          dispatch(fetchPatient(examineeId));
                          setIsSaving(false);
                        } catch (error) {
                          toast.error('Failed to add document: ' + (error.message || error));
                          setIsSaving(false);
                        }
                      };

                      fileInput.click();
                    }}
                    disabled={isSaving}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
                    title="Add new document"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Add</span>
                  </motion.button>
                </div>
              </div>
            </div>
            
            {examineeData.documents && examineeData.documents.length > 0 ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {examineeData.documents.map((doc, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div 
                        className="flex items-start space-x-3 cursor-pointer mb-3"
                        onClick={() => downloadDocument(doc)}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getFileIcon(doc.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate" title={doc.name}>
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatFileSize(doc.size)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {doc.type || 'Unknown type'}
                          </p>
                          {doc.uploadDate && (
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(doc.uploadDate).toLocaleDateString('en-GB')}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <FiDownload className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            viewDocument(doc);
                          }}
                          className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
                          title="View document"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReplaceDocument(index);
                          }}
                          disabled={isSaving}
                          className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 rounded transition-colors disabled:opacity-50"
                          title="Replace document"
                        >
                          <FiEdit3 className="w-3.5 h-3.5" />
                          <span>Replace</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(index);
                          }}
                          disabled={isSaving}
                          className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded transition-colors disabled:opacity-50"
                          title="Delete document"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <FiFile className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No documents uploaded yet</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAssignNewAssessment}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Assign New Assessment</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDeleteAssessments}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Delete Assessment(s)</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateReport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <FiFileText className="w-4 h-4" />
            <span>Generate Report</span>
          </motion.button>
        </div>

        {/* Revision History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Revision History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedAssessments.length === assessments.length && assessments.length > 0}
                      onChange={handleSelectAllAssessments}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assessment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assessment Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assessments.map((assessment, index) => (
                  <motion.tr
                    key={assessment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleEditAssessment(assessment)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedAssessments.includes(assessment.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleAssessmentSelection(assessment.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{assessment.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{assessment.assessment_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assessment.scheduled_date ? new Date(assessment.scheduled_date).toLocaleDateString('en-GB') : 'Not scheduled'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{assessment.delivery_method}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assessment.status)}`}>
                        {assessment.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {assessments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <FiFileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No assessments found</p>
                <p className="text-sm">This examinee hasn't been assigned any assessments yet</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Assign Assessment Modal */}
      <AssignAssessmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        examineeId={examineeId}
        examineeName={examineeData?.name || 'Unknown Examinee'}
      />

      {/* Generate Report Modal */}
      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        selectedAssessments={selectedAssessments}
        examineeData={examineeData}
      />

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{viewingDocument.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {formatFileSize(viewingDocument.size)} • {viewingDocument.type || 'Unknown type'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewingDocument(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>

            {/* Content - Based on File Type */}
            <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center">
              {/* Images */}
              {viewingDocument.type.startsWith('image/') ? (
                <img
                  src={viewingDocument.data}
                  alt={viewingDocument.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : /* PDFs */ viewingDocument.type === 'application/pdf' ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <FiFileText className="w-16 h-16 text-red-400 mb-4" />
                  <p className="text-gray-600 font-medium mb-4">PDF Preview</p>
                  <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
                    PDF preview is not available. Click the download button to view the file in your PDF reader.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      downloadDocument(viewingDocument);
                      setViewingDocument(null);
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Download PDF</span>
                  </motion.button>
                </div>
              ) : /* Excel/Word */ viewingDocument.type.includes('spreadsheet') ||
                viewingDocument.type.includes('document') ||
                viewingDocument.type.includes('word') ||
                viewingDocument.type.includes('excel') ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <FiFile className="w-16 h-16 text-blue-400 mb-4" />
                  <p className="text-gray-600 font-medium mb-4">Document Preview</p>
                  <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
                    {viewingDocument.type.includes('spreadsheet')
                      ? 'Excel files cannot be previewed here.'
                      : 'Office documents cannot be previewed here.'}
                    <br />
                    Download the file to view in the appropriate application.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      downloadDocument(viewingDocument);
                      setViewingDocument(null);
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Download</span>
                  </motion.button>
                </div>
              ) : (
                /* Unknown file type */
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <FiFile className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium mb-4">Cannot Preview File</p>
                  <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
                    This file type is not supported for preview. Download the file to open it with your system's default application.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      downloadDocument(viewingDocument);
                      setViewingDocument(null);
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Download</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  downloadDocument(viewingDocument);
                  setViewingDocument(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <FiDownload className="w-4 h-4" />
                <span>Download</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewingDocument(null)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Assessment Modal */}
      <EditAssessmentModal
        isOpen={isEditAssessmentModalOpen}
        onClose={() => setIsEditAssessmentModalOpen(false)}
        assessment={selectedAssessmentToEdit}
        examineeId={examineeId}
        examineeName={examineeData?.name || 'Unknown Examinee'}
        onSuccess={handleAssessmentUpdated}
      />
    </div>
  );
};

export default ExamineeDetail;
