import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiSearch, FiFileText, FiArrowRight, FiClock, FiUsers } from 'react-icons/fi';

const TemplateSelector = ({ onSelectTemplate, onCancel, patientData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock templates - in real app this would come from API
  const templates = [
    {
      id: 1,
      name: 'General Consultation Template',
      description: 'Standard template for general medical consultations',
      category: 'General',
      usageCount: 45,
      estimatedTime: '15-20 min',
      sections: [
        { id: 1, name: 'Chief Complaint', type: 'text', required: true },
        { id: 2, name: 'Medical History', type: 'text', required: true },
        { id: 3, name: 'Physical Examination', type: 'text', required: true },
        { id: 4, name: 'Assessment', type: 'text', required: true },
        { id: 5, name: 'Treatment Plan', type: 'text', required: true }
      ]
    },
    {
      id: 2,
      name: 'Emergency Visit Template',
      description: 'Template for emergency department visits',
      category: 'Emergency',
      usageCount: 23,
      estimatedTime: '10-15 min',
      sections: [
        { id: 1, name: 'Chief Complaint', type: 'text', required: true },
        { id: 2, name: 'Vital Signs', type: 'text', required: true },
        { id: 3, name: 'Triage Level', type: 'dropdown', required: true, options: [
          { id: 1, label: 'Level 1 - Resuscitation', value: 'level1' },
          { id: 2, label: 'Level 2 - Emergent', value: 'level2' },
          { id: 3, label: 'Level 3 - Urgent', value: 'level3' }
        ]},
        { id: 4, name: 'Assessment', type: 'text', required: true },
        { id: 5, name: 'Immediate Care', type: 'text', required: true }
      ]
    },
    {
      id: 3,
      name: 'Follow-up Visit Template',
      description: 'Template for patient follow-up appointments',
      category: 'Follow-up',
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
    }
  ];

  const categories = ['all', 'General', 'Emergency', 'Follow-up', 'Pediatric', 'Specialist'];

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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Select Encounter Template</h1>
          <p className="text-gray-600">
            Choose a template to create encounter report for <strong>{patientData.name}</strong>
          </p>
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
              onClick={() => onSelectTemplate(template)}
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

        {/* Cancel Button */}
        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;