import React from 'react';
import { FiUser, FiClock, FiUsers, FiArrowRight } from 'react-icons/fi';

const TAPS3StaticCard = ({ onSelect }) => {
  const template = {
    id: 'taps-3-static',
    name: 'TEST OF AUDITORY PROCESSING SKILLS-TAPS-3',
    description: 'Comprehensive auditory processing assessment for phonological skills, memory abilities, and auditory cohesion',
    category: 'Auditory Processing',
    usageCount: 28,
    estimatedTime: '45-60 min',
    icon: FiUser,
    color: 'teal',
    type: 'TAPS-3',
    sections: [
      'Word Discrimination', 'Phonological Segmentation', 'Phonological Blending',
      'Number Memory Forward', 'Number Memory Reversed', 'Word Memory', 'Sentence Memory',
      'Auditory Comprehension', 'Auditory Reasoning'
    ]
  };

  const getColorClasses = (color) => {
    const colorClasses = {
      teal: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
      emerald: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
      indigo: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      pink: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      red: 'bg-red-50 border-red-200 hover:bg-red-100',
      yellow: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      green: 'bg-green-50 border-green-200 hover:bg-green-100',
      cyan: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100'
    };
    return colorClasses[color] || 'bg-gray-50 border-gray-200 hover:bg-gray-100';
  };

  const getIconColor = (color) => {
    const iconColors = {
      teal: 'text-teal-600',
      emerald: 'text-emerald-600',
      indigo: 'text-indigo-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      pink: 'text-pink-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      green: 'text-green-600',
      cyan: 'text-cyan-600'
    };
    return iconColors[color] || 'text-gray-600';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Auditory Processing': 'bg-teal-100 text-teal-800',
      'Cognitive Processing': 'bg-emerald-100 text-emerald-800',
      'Cognitive Assessment': 'bg-indigo-100 text-indigo-800',
      'Reading Assessment': 'bg-blue-100 text-blue-800',
      'Attention Assessment': 'bg-purple-100 text-purple-800',
      'Autism Assessment': 'bg-pink-100 text-pink-800',
      'Executive Function': 'bg-orange-100 text-orange-800',
      'Learning Assessment': 'bg-yellow-100 text-yellow-800',
      'Motor Assessment': 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleSelect = () => {
    // Direct template selection without dynamic import
    const templateWrapper = {
      ...template,
      isAssessmentTemplate: true
    };
    onSelect(templateWrapper);
  };

  return (
    <div
      onClick={handleSelect}
      className={`border rounded-xl p-6 cursor-pointer transition-all duration-300 ${getColorClasses(template.color)}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconColor(template.color)}`}>
          <template.icon className="w-6 h-6" />
        </div>
        <FiArrowRight className="w-5 h-5 text-gray-400" />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
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
            {template.sections.length} sections
          </p>
          <div className="flex flex-wrap gap-1">
            {template.sections.slice(0, 3).map((section, idx) => (
              <span key={idx} className="text-xs bg-white bg-opacity-60 px-2 py-1 rounded">
                {section}
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
    </div>
  );
};

export default TAPS3StaticCard;
