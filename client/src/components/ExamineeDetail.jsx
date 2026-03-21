import { motion } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiTrash2, FiFileText, FiUser, FiPhone, FiMail, FiCalendar, FiMapPin, FiEdit3 } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useToast } from './Toast';
import api from '../services/api';

const ExamineeDetail = ({ examineeId, onBack, onEditExaminee }) => {
  const toast = useToast();
  const [examineeData, setExamineeData] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssessments, setSelectedAssessments] = useState([]);

  useEffect(() => {
    const fetchExamineeData = async () => {
      if (!examineeId) {
        setError('No examinee ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch examinee basic information
        const examineeResponse = await api.getPatient(examineeId);
        
        if (examineeResponse.success) {
          const examinee = examineeResponse.data;
          
          // Transform examinee data
          const transformedExaminee = {
            systemId: `SYS${examinee.id.toString().padStart(6, '0')}`,
            name: `${examinee.first_name || 'Unknown'} ${examinee.last_name || 'Unknown'}`,
            birthDate: examinee.date_of_birth ? new Date(examinee.date_of_birth).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }) : 'Not provided',
            age: examinee.date_of_birth ? calculateAge(examinee.date_of_birth) : 'Not available',
            examineeId: examinee.student_id || `STU${examinee.id}`,
            gender: examinee.gender || 'Not specified',
            customField1: examinee.custom_field_1 || '',
            customField2: examinee.custom_field_2 || '',
            customField3: examinee.custom_field_3 || '',
            customField4: examinee.custom_field_4 || '',
            groups: examinee.groups || '',
            legacyId: examinee.legacy_id || '',
            email: examinee.email || 'Not provided',
            phone: examinee.phone || 'Not provided',
            centre: examinee.clinic_name || 'MindSaid Learning Centre'
          };

          setExamineeData(transformedExaminee);

          // Fetch assessments for this examinee
          // Note: This would need to be implemented in your backend API
          const mockAssessments = [
            {
              id: '58415507',
              name: 'WRAT5-India Blue Form',
              adminDate: '18/03/2026',
              delivery: 'Manual Entry',
              status: 'Report Generated'
            }
          ];
          
          setAssessments(mockAssessments);
        } else {
          setError(examineeResponse.message || 'Failed to load examinee data');
        }
      } catch (error) {
        console.error('Error fetching examinee data:', error);
        setError('Error loading examinee data');
      } finally {
        setLoading(false);
      }
    };

    fetchExamineeData();
  }, [examineeId]);

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

  const handleAssignNewAssessment = () => {
    toast.success('Assign new assessment functionality would be implemented here');
    // This would open a modal to assign a new assessment
  };

  const handleDeleteAssessments = () => {
    if (selectedAssessments.length === 0) {
      toast.error('Please select assessments to delete');
      return;
    }
    
    toast.success(`Deleting ${selectedAssessments.length} assessment(s)`);
    // This would delete the selected assessments
    setSelectedAssessments([]);
  };

  const handleGenerateReport = () => {
    if (selectedAssessments.length === 0) {
      toast.error('Please select assessments to generate report');
      return;
    }
    
    toast.success(`Generating report for ${selectedAssessments.length} assessment(s)`);
    // This would generate reports for selected assessments
  };

  const handleAssessmentSelection = (assessmentId) => {
    setSelectedAssessments(prev => 
      prev.includes(assessmentId) 
        ? prev.filter(id => id !== assessmentId)
        : [...prev, assessmentId]
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'report generated':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
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
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAssessments(assessments.map(a => a.id));
                        } else {
                          setSelectedAssessments([]);
                        }
                      }}
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
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedAssessments.includes(assessment.id)}
                        onChange={() => handleAssessmentSelection(assessment.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {assessment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assessment.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assessment.adminDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assessment.delivery}
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
    </div>
  );
};

export default ExamineeDetail;
