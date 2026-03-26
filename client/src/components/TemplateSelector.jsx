import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiSearch, FiFileText, FiArrowRight, FiClock, FiUsers, FiArrowLeft, FiX } from 'react-icons/fi';

const TemplateSelector = ({ onSelectTemplate, onCancel, patientData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleTemplateSelect = (template) => {
    // Special handling for assessment templates
    if (template.name === 'TEST OF AUDITORY PROCESSING SKILLS-TAPS-3') {
      // Import and render TAPS3Template directly
      import('./TAPS3Template').then((module) => {
        const TAPS3Template = module.default;
        // Create a wrapper that handles the template
        const templateWrapper = {
          ...template,
          component: TAPS3Template,
          isAssessmentTemplate: true
        };
        onSelectTemplate(templateWrapper);
      });
    } else {
      onSelectTemplate(template);
    }
  };

  // Educational assessment templates
  const templates = [
    {
      id: 1,
      name: 'Learning Support Session Template',
      description: 'Standard template for individual learning support sessions',
      category: 'Learning Support',
      usageCount: 45,
      estimatedTime: '30-45 min',
      sections: [
        { id: 1, name: 'Learning Goals', type: 'text', required: true },
        { id: 2, name: 'Current Challenges', type: 'text', required: true },
        { id: 3, name: 'Activities Conducted', type: 'text', required: true },
        { id: 4, name: 'Student Response', type: 'dropdown', required: true, options: [
          { id: 1, label: 'Excellent - Engaged and responsive', value: 'excellent' },
          { id: 2, label: 'Good - Participated well', value: 'good' },
          { id: 3, label: 'Fair - Some engagement', value: 'fair' },
          { id: 4, label: 'Needs Improvement - Limited engagement', value: 'needs_improvement' }
        ]},
        { id: 5, name: 'Progress Notes', type: 'text', required: true },
        { id: 6, name: 'Next Session Plan', type: 'text', required: true }
      ]
    },
    {
      id: 2,
      name: 'Behavioral Assessment Template',
      description: 'Template for behavioral assessments and observations',
      category: 'Assessment',
      usageCount: 23,
      estimatedTime: '45-60 min',
      sections: [
        { id: 1, name: 'Behavioral Observations', type: 'text', required: true },
        { id: 2, name: 'Attention Level', type: 'dropdown', required: true, options: [
          { id: 1, label: 'High - Sustained attention throughout', value: 'high' },
          { id: 2, label: 'Moderate - Good attention with breaks', value: 'moderate' },
          { id: 3, label: 'Low - Difficulty maintaining attention', value: 'low' }
        ]},
        { id: 3, name: 'Social Interaction', type: 'text', required: true },
        { id: 4, name: 'Interventions Used', type: 'checkbox', required: false, options: [
          { id: 1, label: 'Positive Reinforcement', value: 'positive_reinforcement' },
          { id: 2, label: 'Token System', value: 'token_system' },
          { id: 3, label: 'Break Cards', value: 'break_cards' },
          { id: 4, label: 'Visual Schedules', value: 'visual_schedules' }
        ]},
        { id: 5, name: 'Behavioral Goals', type: 'text', required: true },
        { id: 6, name: 'Recommendations', type: 'text', required: true }
      ]
    },
    {
      id: 3,
      name: 'Speech Therapy Session Template',
      description: 'Template for speech and language therapy sessions',
      category: 'Speech Therapy',
      usageCount: 67,
      estimatedTime: '10-12 min',
      sections: [
        { id: 1, name: 'Previous Treatment Review', type: 'text', required: true },
        { id: 2, name: 'Current Symptoms', type: 'checkbox', required: false, options: [
          { id: 1, label: 'Pain', value: 'pain' },
          { id: 2, label: 'Nausea', value: 'nausea' },
          { id: 3, label: 'Fatigue', value: 'fatigue' }
        ]},
        { id: 3, name: 'Current Status', type: 'radio', required: true, options: [
          { id: 1, label: 'Improved', value: 'improved' },
          { id: 2, label: 'Same', value: 'same' },
          { id: 3, label: 'Worse', value: 'worse' }
        ]},
        { id: 4, name: 'Next Steps', type: 'text', required: true }
      ]
    },
    {
      id: 4,
      name: 'Pediatric Consultation',
      description: 'Specialized template for children\'s medical visits',
      category: 'Pediatric',
      usageCount: 31,
      estimatedTime: '20-25 min',
      sections: [
        { id: 1, name: 'Growth Measurements', type: 'text', required: true },
        { id: 2, name: 'Developmental Milestones', type: 'checkbox', required: true },
        { id: 3, name: 'Vaccination Status', type: 'text', required: true },
        { id: 4, name: 'Parent Concerns', type: 'text', required: false }
      ]
    },
    {
      id: 5,
      name: 'TEST OF AUDITORY PROCESSING SKILLS-TAPS-3',
      description: 'Comprehensive auditory processing assessment for phonological skills, memory abilities, and auditory cohesion',
      category: 'Assessment',
      usageCount: 28,
      estimatedTime: '45-60 min',
      sections: [
        { id: 1, name: 'Word Discrimination', type: 'text', required: true },
        { id: 2, name: 'Phonological Segmentation', type: 'text', required: true },
        { id: 3, name: 'Phonological Blending', type: 'text', required: true },
        { id: 4, name: 'Number Memory Forward', type: 'text', required: true },
        { id: 5, name: 'Number Memory Reversed', type: 'text', required: true },
        { id: 6, name: 'Word Memory', type: 'text', required: true },
        { id: 7, name: 'Sentence Memory', type: 'text', required: true },
        { id: 8, name: 'Auditory Comprehension', type: 'text', required: true },
        { id: 9, name: 'Auditory Reasoning', type: 'text', required: true },
        { id: 10, name: 'Interpretation', type: 'text', required: true }
      ]
    }
  ];

  const categories = ['all', 'General', 'Emergency', 'Follow-up', 'Pediatric', 'Specialist', 'Assessment'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'general':
        return 'bg-blue-100 text-blue-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'follow-up':
        return 'bg-green-100 text-green-800';
      case 'pediatric':
        return 'bg-yellow-100 text-yellow-800';
      case 'specialist':
        return 'bg-purple-100 text-purple-800';
      case 'assessment':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </motion.button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Select Encounter Template</h1>
              <p className="text-gray-600">
                Choose a template to create encounter report for <strong>{patientData.name}</strong>
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiX className="w-4 h-4" />
            <span>Cancel</span>
          </motion.button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Encounters</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Select Template</span>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer group"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <FiFileText className="w-6 h-6 text-blue-600" />
                </div>
                <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(template.category)}`}>
                  {template.category}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <FiClock className="w-4 h-4" />
                    <span>{template.estimatedTime}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <FiUsers className="w-4 h-4" />
                    <span>{template.usageCount} uses</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    {template.sections.length} sections • {template.sections.filter(s => s.required).length} required
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.sections.slice(0, 3).map((section, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {section.name}
                      </span>
                    ))}
                    {template.sections.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{template.sections.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelector;