import React, { useState } from 'react';
import { FiSearch, FiFileText, FiArrowRight, FiClock, FiUsers, FiArrowLeft, FiX } from 'react-icons/fi';
import GenerateReportModal from './GenerateReportModal';

// Simple Template List - Hardcoded templates
const SIMPLE_TEMPLATES = [
  {
    id: 'ADHD-2',
    name: 'ADHDT-2: Attention-Deficit/Hyperactivity Disorder Test',
    description: 'Norm-referenced screening test to identify persons with ADHD based on DSM-5 definition.',
    category: 'ADHD',
    icon: '🧠',
    color: 'orange',
    usageCount: 0,
    estimatedTime: '20-30 min',
    sections: ['Inattention', 'Hyperactivity', 'Impulsivity']
  },
  {
    id: 'ADHD-DSM5',
    name: 'ADHD - DSM 5 Checklist',
    description: 'Diagnostic checklist based on DSM-5 criteria for ADHD diagnosis.',
    category: 'ADHD',
    icon: '📋',
    color: 'orange',
    usageCount: 0,
    estimatedTime: '15-20 min',
    sections: ['Inattention Symptoms', 'Hyperactivity Symptoms', 'Impulsivity Symptoms']
  },
  {
    id: 'Aston-Index',
    name: 'Aston Index',
    description: 'Comprehensive battery of tests for diagnosing language difficulties in children.',
    category: 'Language',
    icon: '📊',
    color: 'yellow',
    usageCount: 0,
    estimatedTime: '30-60 min',
    sections: ['Visual Perception', 'Auditory Perception', 'Motor Skills']
  },
  {
    id: 'BKT',
    name: 'BKT - Battery of Kaufman Tests',
    description: 'Comprehensive cognitive and achievement testing battery.',
    category: 'Cognitive',
    icon: '📝',
    color: 'blue',
    usageCount: 0,
    estimatedTime: '45-90 min',
    sections: ['Cognitive Assessment', 'Achievement Testing']
  },
  {
    id: 'Brown-EF-A',
    name: 'Brown EF-A Scale',
    description: 'Assessment of executive functions and attention in children and adults.',
    category: 'Executive',
    icon: '🎯',
    color: 'red',
    usageCount: 0,
    estimatedTime: '20-30 min',
    sections: ['Executive Functions', 'Attention', 'Working Memory']
  },
  {
    id: 'EACA',
    name: 'EACA - Executive Abilities Composite Assessment',
    description: 'Comprehensive assessment of executive functioning abilities.',
    category: 'Executive',
    icon: '🔍',
    color: 'indigo',
    usageCount: 0,
    estimatedTime: '40-60 min',
    sections: ['Planning', 'Organization', 'Self-Monitoring']
  },
  {
    id: 'GARS-3',
    name: 'GARS-3: Gilliam Autism Rating Scale',
    description: 'Standardized assessment for identifying autism in individuals aged 3-22.',
    category: 'Autism',
    icon: '🧩',
    color: 'pink',
    usageCount: 0,
    estimatedTime: '30-45 min',
    sections: ['Stereotyped Behaviors', 'Communication', 'Social Interaction']
  },
  {
    id: 'Nelson-Denny',
    name: 'Nelson Denny Reading Test',
    description: 'Individually administered, timed tests measuring reading skills and comprehension.',
    category: 'Reading Assessment',
    icon: '📚',
    color: 'green',
    usageCount: 0,
    estimatedTime: '30-60 min',
    sections: ['Vocabulary', 'Reading Comprehension', 'Reading Rate']
  },
  {
    id: 'Ravens-CPM',
    name: "Raven's CPM: Coloured Progressive Matrices",
    description: 'Non-verbal assessment of general cognitive ability for children.',
    category: 'Cognitive Assessment',
    icon: '🎨',
    color: 'cyan',
    usageCount: 0,
    estimatedTime: '20-30 min',
    sections: ['Pattern Recognition', 'Visual Reasoning']
  },
  {
    id: 'RIPA',
    name: 'RIPA: Ross Information Processing Assessment',
    description: 'Quantifies cognitive-linguistic deficits in individuals aged 5-12.',
    category: 'Cognitive Processing',
    icon: '💭',
    color: 'emerald',
    usageCount: 0,
    estimatedTime: '45-60 min',
    sections: ['Immediate Memory', 'Recent Memory', 'Temporal Orientation']
  },
  {
    id: 'TAPS-3',
    name: 'TAPS-3: Test of Auditory Perceptual Skills',
    description: 'Comprehensive auditory processing assessment for phonological skills.',
    category: 'Cognitive Processing',
    icon: '👂',
    color: 'teal',
    usageCount: 0,
    estimatedTime: '45-60 min',
    sections: ['Word Discrimination', 'Phonological Segmentation', 'Phonological Blending']
  },
  {
    id: 'TOWL-4',
    name: 'TOWL-4: Test of Written Language',
    description: 'Comprehensive assessment of written language skills.',
    category: 'Academic',
    icon: '✍️',
    color: 'purple',
    usageCount: 0,
    estimatedTime: '60-90 min',
    sections: ['Vocabulary', 'Spelling', 'Logical Sentences']
  },
  {
    id: 'VAS',
    name: 'VAS: Visual Attention Span',
    description: 'Assessment of visual attention and processing span.',
    category: 'Cognitive',
    icon: '👁️',
    color: 'blue',
    usageCount: 0,
    estimatedTime: '15-25 min',
    sections: ['Visual Attention', 'Visual Processing']
  }
];

const AssessmentTemplateSelector = ({ onSelectTemplate, onCancel, studentName = 'Student' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Get unique categories
  const categories = ['all', ...new Set(SIMPLE_TEMPLATES.map(t => t.category))];

  // Filter templates
  const filteredTemplates = SIMPLE_TEMPLATES.filter(template => {
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template) => {
    console.log('Selected template:', template);
    setSelectedTemplate(template);
    
    // Only ADHD-2 and RIPA are ready - others show coming soon
    if (template.id === 'ADHD-2' || template.id === 'RIPA') {
      setShowGenerateModal(true);
    } else {
      alert(`${template.name} template is coming soon! Please select ADHD-2 or RIPA for testing.`);
    }
    
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
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

  const getCategoryColor = (category) => {
    const colors = {
      'Cognitive': 'bg-blue-100 text-blue-800',
      'Cognitive Processing': 'bg-emerald-100 text-emerald-800',
      'Reading Assessment': 'bg-green-100 text-green-800',
      'Cognitive Assessment': 'bg-indigo-100 text-indigo-800',
      'Language': 'bg-yellow-100 text-yellow-800',
      'Executive': 'bg-red-100 text-red-800',
      'Autism': 'bg-pink-100 text-pink-800',
      'ADHD': 'bg-orange-100 text-orange-800',
      'Academic': 'bg-emerald-100 text-emerald-800',
      'Intelligence': 'bg-violet-100 text-violet-800',
      'Diagnostic': 'bg-rose-100 text-rose-800',
      'Summary': 'bg-cyan-100 text-cyan-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Map to template data
  const mappedTemplates = filteredTemplates;

  return (
    <>
      <div className="lg:ml-64 min-h-screen bg-gray-50">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onCancel}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Assessment Templates</h1>
                <p className="text-gray-600">
                  Choose an assessment template for <strong>{studentName}</strong>
                </p>
              </div>
            </div>
            
            <button
              onClick={onCancel}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiX className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Assessments</span>
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
                  placeholder="Search assessment templates..."
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
            {mappedTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`border rounded-xl p-6 cursor-pointer transition-all duration-300 ${getColorClasses(template.color)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-white bg-opacity-80">
                    {template.icon}
                  </div>
                  <div className="flex items-center space-x-2">
                    {template.id === 'ADHD-2' && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                        READY
                      </span>
                    )}
                    <FiArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
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
            ))}
          </div>

          {mappedTemplates.length === 0 && (
            <div className="text-center py-12">
              <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <GenerateReportModal 
          isOpen={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
        />
      )}
    </>
  );
};

export default AssessmentTemplateSelector;
