import { motion } from 'framer-motion';
import { FiX, FiSave, FiCalendar, FiFileText, FiUser, FiClock, FiPlus, FiChevronDown } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createAssessment } from '../store/slices/assessmentSlice';
import { useToast } from './Toast';

/* ═══════════════════════════════════════════════════════════
   ASSESSMENT TEMPLATES
═══════════════════════════════════════════════════════════ */

// Available Assessment Templates
const ASSESSMENT_TEMPLATES = [
  {
    id: 'RIPA-Primary',
    name: 'ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY',
    description: 'The RIPA-A quantifies & describes cognitive-linguistic deficits in individuals between the ages of 5-0 and 12-11 who face difficulties in attention, memory, orientation, language and communication, problem solving and abstract reasoning.',
    category: 'Cognitive',
    icon: '🧠'
  },
  {
    id: 'ADHT-BSM',
    name: 'ADHD-DSM5 Checklist',
    description: 'DSM-5 ADHD Checklist with checkbox-based criteria selection for inattention and hyperactivity',
    category: 'ADHD',
    icon: '📋'
  },
  {
    id: 'Aston-Index',
    name: 'Aston Index Assessment',
    description: 'Comprehensive battery of tests for diagnosing language difficulties in children',
    category: 'Language',
    icon: '🗣️'
  },
  {
    id: 'ADHDT2',
    name: 'EACA AUTISM ASSESSMENT',
    description: 'Attention-Deficit/Hyperactivity Disorder Test-Second Edition with comprehensive scoring',
    category: 'ADHD',
    icon: '📝'
  },
  {
    id: 'BKT',
    name: 'Bender Gestalt Test (BKT)',
    description: 'Motor coordination and kinesthetic perception assessment',
    category: 'Motor',
    icon: '✏️'
  },
  {
    id: 'Ravens-CPM',
    name: 'Raven\'s Coloured Progressive Matrices',
    description: 'Non-verbal assessment of eductive ability and problem-solving skills',
    category: 'Cognitive',
    icon: '🧩'
  },
  {
    id: 'GARS-3',
    name: 'Gilliam Autism Rating Scale - 3',
    description: 'Comprehensive assessment tool for identifying autism spectrum disorders',
    category: 'Autism',
    icon: '🧩'
  },
  {
    id: 'Brown-EF-A',
    name: 'Brown Executive Function/Attention Scales',
    description: 'Comprehensive assessment of executive function and attention processes',
    category: 'Executive',
    icon: '🧠'
  },
  {
    id: 'EACA',
    name: 'Early Academic Competency Assessment',
    description: 'Comprehensive screening tool for early academic skills and school readiness',
    category: 'Academic',
    icon: '📚'
  },
  {
    id: 'EACA-Autism',
    name: 'Educational Assessment of Children with Autism (EACA)',
    description: 'Comprehensive assessment of children with autism focusing on the triad of impairments across 7 domains',
    category: 'Autism',
    icon: '🧩'
  },
  {
    id: 'Nelson-Denny',
    name: 'Nelson-Denny Reading Test',
    description: 'Comprehensive assessment of reading comprehension, vocabulary, and reading rate',
    category: 'Reading',
    icon: '📖'
  },
  {
    id: 'TAPS-3',
    name: 'TEST OF AUDITORY PROCESSING SKILLS-TAPS-3',
    description: 'Comprehensive auditory processing assessment for phonological skills, memory abilities, and auditory cohesion',
    category: 'Auditory',
    icon: '👂'
  },
  {
    id: 'TOWL-4',
    name: 'TEST OF WRITTEN LANGUAGE (TOWL-4)',
    description: 'The TOWL-4 is a norm-referenced, reliable, and valid test of written language measuring seven skill areas and three composite scores.',
    category: 'Writing',
    icon: '✍️'
  },
  {
    id: 'VABS-3',
    name: 'VINELAND ADAPTIVE BEHAVIOUR SCALES-VABS-3',
    description: 'Individual assessment of adaptive behaviour measuring day-to-day activities necessary for self-care and social interaction.',
    category: 'Behavior',
    icon: '👥'
  },
  {
    id: 'WISC-4',
    name: 'WECHSLER\'S INTELLIGENCE SCALE FOR CHILDREN -WISC-IV India',
    description: 'Norm-referenced, individually administered test of intelligence for children with verbal and performance subtests.',
    category: 'Intelligence',
    icon: '🧠'
  },
  {
    id: 'WJ-3',
    name: 'WJ-III - TESTS OF ACHIEVEMENT FORM C/ BRIEF BATTERY',
    description: 'Norm-referenced individually administered tests measuring academic achievement across reading, math, and writing.',
    category: 'Achievement',
    icon: '📊'
  },
  {
    id: 'WJ-Cog',
    name: 'WOODCOCK-JOHNSON TESTS OF COGNITIVE ABILITIES IV (WJ-Cog)',
    description: '18 tests measuring different aspects of cognitive ability based on CHC theory, with cluster scores for interpretative purposes.',
    category: 'Cognitive',
    icon: '🧠'
  },
  {
    id: 'WJ-Ach',
    name: 'WOODCOCK JOHNSON IV TESTS OF ACHIEVEMENT (WJ-Ach)',
    description: 'Comprehensive set of individually administered tests to measure educational achievement in reading, mathematics, written language, and academic skills.',
    category: 'Achievement',
    icon: '📚'
  },
  {
    id: 'WRAT5',
    name: 'WIDE RANGE ACHIEVEMENT TEST- WRAT-5 (ENGLISH)',
    description: 'Norm-referenced test measuring basic academic skills of word reading, sentence comprehension, spelling, and math computation.',
    category: 'Achievement',
    icon: '📝'
  },
  {
    id: 'WRMT2',
    name: 'WOODCOCK READING MASTERY TESTS-II (WRMT-II)',
    description: 'Individually administered, timed tests measuring Basic Skills, Reading Comprehension, Oral Reading Fluency and Listening Comprehension.',
    category: 'Reading',
    icon: '📖'
  },
  {
    id: 'DiagnosticReport',
    name: 'DIAGNOSTIC ASSESSMENT REPORT',
    description: 'Comprehensive diagnostic assessment report based on DSM-5 criteria and standardized test results.',
    category: 'Diagnostic',
    icon: '🧠'
  },
  {
    id: 'EvaluationSummary',
    name: 'SUMMARY OF EVALUATION',
    description: 'Comprehensive summary of evaluation results across multiple assessment instruments including WJ-IV COG, WJ-IV ACH, and Brown\'s EF/A Scale.',
    category: 'Summary',
    icon: '📊'
  }
];

const AssignAssessmentModal = ({ isOpen, onClose, examineeId, examineeName }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  
  // Custom dropdown refs
  const assessmentDropdownRef = useRef(null);
  const deliveryDropdownRef = useRef(null);
  
  const [formData, setFormData] = useState({
    assessmentType: 'WRAT5',
    deliveryMethod: 'Online',
    scheduledDate: '',
    scheduledTime: '',
    duration: 1,
    notes: '',
    examiner: '',
    room: 'MindSaid Learning',
    materials: ''
  });

  const [showAddAssessmentType, setShowAddAssessmentType] = useState(false);
  const [newAssessmentType, setNewAssessmentType] = useState('');

  const [errors, setErrors] = useState({});
  
  // Custom dropdown states
  const [isAssessmentDropdownOpen, setIsAssessmentDropdownOpen] = useState(false);
  const [isDeliveryDropdownOpen, setIsDeliveryDropdownOpen] = useState(false);

  const [assessmentTypes, setAssessmentTypes] = useState(ASSESSMENT_TEMPLATES);

  const deliveryMethods = [
    'Online',
    'Offline'
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (assessmentDropdownRef.current && !assessmentDropdownRef.current.contains(event.target)) {
        setIsAssessmentDropdownOpen(false);
      }
      if (deliveryDropdownRef.current && !deliveryDropdownRef.current.contains(event.target)) {
        setIsDeliveryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleAddAssessmentType = () => {
    if (newAssessmentType.trim()) {
      const newType = {
        id: newAssessmentType.trim().replace(/\s+/g, '_').toUpperCase(),
        name: newAssessmentType.trim()
      };
      setAssessmentTypes(prev => [...prev, newType]);
      setFormData(prev => ({ ...prev, assessmentType: newType.id }));
      setNewAssessmentType('');
      setShowAddAssessmentType(false);
      toast.success('Assessment type added successfully!');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
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
      assessmentType: 'WRAT5',
      deliveryMethod: 'Online',
      scheduledDate: '',
      scheduledTime: '',
      duration: 1,
      notes: '',
      examiner: '',
      room: 'MindSaid Learning',
      materials: ''
    });
    setErrors({});
    setShowAddAssessmentType(false);
    setNewAssessmentType('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-visible"
        style={{ zIndex: 71 }}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Assessment Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Assessment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Type
                </label>
                <div className="flex space-x-2">
                  {/* Custom Assessment Type Dropdown */}
                  <div ref={assessmentDropdownRef} className="relative w-48">
                    <button
                      type="button"
                      onClick={() => setIsAssessmentDropdownOpen(!isAssessmentDropdownOpen)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
                    >
                      <span className="truncate">
                        {assessmentTypes.find(type => type.id === formData.assessmentType)?.name || 'Select Assessment Type'}
                      </span>
                      <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isAssessmentDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isAssessmentDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div className="py-1">
                          {assessmentTypes.map(type => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => {
                                handleInputChange('assessmentType', type.id);
                                setIsAssessmentDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                                formData.assessmentType === type.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                              }`}
                            >
                              <span className="flex-shrink-0">{type.icon}</span>
                              <span className="truncate">{type.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddAssessmentType(!showAddAssessmentType)}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    title="Add new assessment type"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                {showAddAssessmentType && (
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      value={newAssessmentType}
                      onChange={(e) => setNewAssessmentType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter new assessment type"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddAssessmentType()}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleAddAssessmentType}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddAssessmentType(false);
                          setNewAssessmentType('');
                        }}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Method
                </label>
                {/* Custom Delivery Method Dropdown */}
                <div ref={deliveryDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDeliveryDropdownOpen(!isDeliveryDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
                  >
                    <span>{formData.deliveryMethod}</span>
                    <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDeliveryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDeliveryDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="py-1">
                        {deliveryMethods.map(method => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => {
                              handleInputChange('deliveryMethod', method);
                              setIsDeliveryDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                              formData.deliveryMethod === method ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="30"
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
                  Location
                </label>
                <input
                  type="text"
                  value={formData.room}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="MindSaid Learning"
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
