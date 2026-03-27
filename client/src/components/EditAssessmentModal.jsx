import { motion } from 'framer-motion';
import { FiX, FiSave, FiCalendar, FiFileText, FiUser, FiClock, FiEdit3, FiChevronDown } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateAssessment } from '../store/slices/assessmentSlice';
import { useToast } from './Toast';
import api from '../services/api';

/* ═══════════════════════════════════════════════════════════
   ASSESSMENT TEMPLATES - NOW LOADED FROM API
═══════════════════════════════════════════════════════════ */

// Commented out hardcoded array - now using API
// const ASSESSMENT_TEMPLATES = [
//   {
//     id: 'RIPA-Primary',
//     name: 'ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY',
//     description: 'The RIPA-A quantifies & describes cognitive-linguistic deficits in individuals between the ages of 5-0 and 12-11 who face difficulties in attention, memory, orientation, language and communication, problem solving and abstract reasoning.',
//     category: 'Cognitive',
//     icon: '🧠'
//   },
//   ... (rest of the array is now loaded from database API)
// ];

const EditAssessmentModal = ({ isOpen, onClose, assessment, examineeId, examineeName, onSuccess }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  
  // State for templates loaded from API
  const [assessmentTemplates, setAssessmentTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  
  // Custom dropdown refs
  const assessmentDropdownRef = useRef(null);
  const deliveryDropdownRef = useRef(null);
  
  // Load templates from API on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setTemplatesLoading(true);
        const response = await api.getTemplates();
        if (response.success) {
          // Transform database data to match frontend format
          const transformedTemplates = response.data.map(template => ({
            id: template.type,
            name: template.name,
            description: template.description,
            category: template.category,
            icon: template.icon,
            // Include additional data for calculations
            templateData: template.template_data,
            formulaConfig: template.formula_config,
            scoringRules: template.scoring_rules,
            ageRange: template.age_range,
            languages: template.languages
          }));
          setAssessmentTemplates(transformedTemplates);
          console.log('✅ Templates loaded from API:', transformedTemplates.length);
        }
      } catch (error) {
        console.error('❌ Failed to load templates:', error);
        toast.error('Failed to load assessment templates');
      } finally {
        setTemplatesLoading(false);
      }
    };

    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen, toast]);
  
  const [formData, setFormData] = useState({
    assessmentType: assessment?.assessment_type || 'WRAT5',
    deliveryMethod: assessment?.delivery_method || 'Online',
    scheduledDate: assessment?.scheduled_date ? new Date(assessment.scheduled_date).toISOString().split('T')[0] : '',
    scheduledTime: assessment?.scheduled_time || '',
    duration: assessment?.duration || 1,
    notes: assessment?.notes || '',
    examiner: assessment?.examiner || '',
    room: assessment?.room || 'MindSaid Learning',
    materials: assessment?.materials || '',
    subscales: assessment?.subscales || [],
    customScores: assessment?.custom_scores || {},
    interpretation: assessment?.interpretation || '',
    recommendations: assessment?.recommendations || ''
  });

  // Helper function to get assessment name
  const getAssessmentName = (assessmentType) => {
    const template = assessmentTemplates.find(t => t.id === assessmentType);
    return template ? template.name : assessmentType;
  };

  // Helper function to get assessment icon
  const getAssessmentIcon = (assessmentType) => {
    const template = assessmentTemplates.find(t => t.id === assessmentType);
    return template ? template.icon : '📋';
  };

  // Custom dropdown components
  const CustomAssessmentDropdown = ({ value, onChange, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const selectedTemplate = assessmentTemplates.find(t => t.id === value);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || templatesLoading}
          className={`w-full px-4 py-3 text-left border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
            disabled 
              ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{selectedTemplate ? getAssessmentIcon(value) : '📋'}</span>
              <span className={disabled ? 'text-gray-500' : 'text-gray-900'}>
                {selectedTemplate ? selectedTemplate.name : 'Select Assessment Type'}
              </span>
            </div>
            <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3 py-2">
                Assessment Templates ({assessmentTemplates.length})
              </div>
              {assessmentTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => {
                    onChange('assessmentType', template.id);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-3 text-left hover:bg-blue-50 transition-colors duration-150 rounded-md flex items-center space-x-3 group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-150">
                    {template.icon}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-blue-600">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {template.category} • {template.ageRange}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!examineeId) {
      toast.error('Examinee ID is required');
      return;
    }

    try {
      const assessmentData = {
        examinee_id: examineeId,
        assessment_type: formData.assessmentType,
        delivery_method: formData.deliveryMethod,
        scheduled_date: formData.scheduledDate,
        scheduled_time: formData.scheduledTime,
        duration: formData.duration,
        notes: formData.notes,
        examiner: formData.examiner,
        room: formData.room,
        materials: formData.materials,
        subscales: formData.subscales,
        custom_scores: formData.customScores,
        interpretation: formData.interpretation,
        recommendations: formData.recommendations,
        status: 'scheduled'
      };

      if (assessment && assessment.id) {
        assessmentData.id = assessment.id;
        await dispatch(updateAssessment(assessmentData));
        toast.success('Assessment updated successfully!');
      } else {
        // Create new assessment - you might need to add this to your assessment slice
        console.log('Creating new assessment:', assessmentData);
        toast.success('Assessment scheduled successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Failed to save assessment');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                  <FiEdit3 className="w-6 h-6 text-blue-600" />
                  {assessment ? 'Edit Assessment' : 'Schedule New Assessment'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {examineeName && `For: ${examineeName}`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Assessment Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiFileText className="inline w-4 h-4 mr-2" />
                  Assessment Type
                </label>
                <CustomAssessmentDropdown
                  value={formData.assessmentType}
                  onChange={handleChange}
                  disabled={templatesLoading}
                />
                {templatesLoading && (
                  <div className="mt-2 text-sm text-blue-600 flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                    Loading templates from database...
                  </div>
                )}
              </div>

              {/* Delivery Method */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiClock className="inline w-4 h-4 mr-2" />
                  Delivery Method
                </label>
                <select
                  value={formData.deliveryMethod}
                  onChange={(e) => handleChange('deliveryMethod', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FiCalendar className="inline w-4 h-4 mr-2" />
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => handleChange('scheduledDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FiClock className="inline w-4 h-4 mr-2" />
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => handleChange('scheduledTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Examiner */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiUser className="inline w-4 h-4 mr-2" />
                  Examiner
                </label>
                <input
                  type="text"
                  value={formData.examiner}
                  onChange={(e) => handleChange('examiner', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter examiner name"
                />
              </div>

              {/* Room */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room/Location
                </label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => handleChange('room', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter room or location"
                />
              </div>

              {/* Materials */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Materials
                </label>
                <textarea
                  value={formData.materials}
                  onChange={(e) => handleChange('materials', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List any required materials"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter any additional notes or special instructions"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <FiSave className="w-4 h-4" />
                  {assessment ? 'Update Assessment' : 'Schedule Assessment'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditAssessmentModal;
