import { motion } from 'framer-motion';
import { FiX, FiSave, FiCalendar, FiFileText, FiUser, FiClock } from 'react-icons/fi';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAssessment } from '../store/slices/assessmentSlice';
import { useToast } from './Toast';

const AssignAssessmentModal = ({ isOpen, onClose, examineeId, examineeName }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    assessmentName: '',
    assessmentType: 'WRAT5',
    deliveryMethod: 'Manual Entry',
    scheduledDate: '',
    scheduledTime: '',
    duration: 30,
    notes: '',
    examiner: '',
    room: '',
    materials: ''
  });

  const [errors, setErrors] = useState({});

  const assessmentTypes = [
    { id: 'WRAT5', name: 'WRAT5 - Wide Range Achievement Test' },
    { id: 'WIAT', name: 'WIAT - Wechsler Individual Achievement Test' },
    { id: 'WISC', name: 'WISC - Wechsler Intelligence Scale for Children' },
    { id: 'BASC', name: 'BASC - Behavior Assessment System for Children' },
    { id: 'Conners', name: 'Conners Rating Scales' },
    { id: 'Vineland', name: 'Vineland Adaptive Behavior Scales' },
    { id: 'Custom', name: 'Custom Assessment' }
  ];

  const deliveryMethods = [
    'Manual Entry',
    'Digital',
    'Paper-Based',
    'Oral',
    'Observation',
    'Interview'
  ];

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
    
    if (!formData.assessmentName.trim()) {
      newErrors.assessmentName = 'Assessment name is required';
    }
    
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }
    
    if (!formData.scheduledTime) {
      newErrors.scheduledTime = 'Scheduled time is required';
    }
    
    if (!formData.examiner.trim()) {
      newErrors.examiner = 'Examiner name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const assessmentData = {
          examineeId,
          examineeName,
          ...formData,
          status: 'Scheduled',
          createdAt: new Date().toISOString()
        };
        
        const result = await dispatch(createAssessment(assessmentData)).unwrap();
        
        if (result.success) {
          toast.success('Assessment assigned successfully!');
          onClose();
        } else {
          toast.error('Failed to assign assessment');
        }
      } catch (error) {
        toast.error('Error assigning assessment: ' + error.message);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      assessmentName: '',
      assessmentType: 'WRAT5',
      deliveryMethod: 'Manual Entry',
      scheduledDate: '',
      scheduledTime: '',
      duration: 30,
      notes: '',
      examiner: '',
      room: '',
      materials: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiFileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Assign New Assessment</h2>
              <p className="text-sm text-gray-600">For: {examineeName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Assessment Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Assessment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Name *
                </label>
                <input
                  type="text"
                  value={formData.assessmentName}
                  onChange={(e) => handleInputChange('assessmentName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.assessmentName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter assessment name"
                />
                {errors.assessmentName && (
                  <p className="mt-1 text-sm text-red-600">{errors.assessmentName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Type
                </label>
                <select
                  value={formData.assessmentType}
                  onChange={(e) => handleInputChange('assessmentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {assessmentTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Method
                </label>
                <select
                  value={formData.deliveryMethod}
                  onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {deliveryMethods.map(method => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="15"
                  max="240"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.scheduledDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.scheduledDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.scheduledTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.scheduledTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.scheduledTime}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room
                </label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => handleInputChange('room', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Room number"
                />
              </div>
            </div>
          </div>

          {/* Examiner */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Examiner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Examiner Name *
                </label>
                <input
                  type="text"
                  value={formData.examiner}
                  onChange={(e) => handleInputChange('examiner', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.examiner ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter examiner name"
                />
                {errors.examiner && (
                  <p className="mt-1 text-sm text-red-600">{errors.examiner}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materials Required
                </label>
                <input
                  type="text"
                  value={formData.materials}
                  onChange={(e) => handleInputChange('materials', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List materials needed"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional notes or instructions"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiSave className="w-4 h-4" />
              <span>Assign Assessment</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AssignAssessmentModal;
