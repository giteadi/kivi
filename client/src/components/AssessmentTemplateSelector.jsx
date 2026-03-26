import React, { useState } from 'react';
import { FiSearch, FiFileText, FiArrowRight, FiClock, FiUsers, FiArrowLeft, FiX, FiCpu, FiUser, FiEye, FiBook, FiActivity } from 'react-icons/fi';
import TAPS3StaticCard from './TAPS3StaticCard';

const AssessmentTemplateSelector = ({ onSelectTemplate, onCancel, studentName = 'ABC' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Comprehensive assessment templates
  const templates = [
    {
      id: 1,
      name: 'ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY',
      description: 'Cognitive-linguistic assessment for ages 5-0 to 12-11 years focusing on memory and processing',
      category: 'Cognitive Processing',
      usageCount: 15,
      estimatedTime: '60-75 min',
      icon: FiCpu,
      color: 'emerald',
      type: 'RIPA-Primary',
      sections: [
        'Immediate Memory', 'Recent Memory', 'Recall of General Information', 'Spatial Orientation'
      ]
    },
    {
      id: 2,
      name: 'RAVEN\'S COLOURED PROGRESSIVE MATRICES',
      description: 'Non-verbal cognitive assessment measuring clear-thinking ability for ages 5:0-11:0 years',
      category: 'Cognitive Assessment',
      usageCount: 42,
      estimatedTime: '30-45 min',
      icon: FiEye,
      color: 'indigo',
      type: 'Ravens-CPM',
      sections: [
        'Set A (12 items)', 'Set Ab (12 items)', 'Set B (12 items)'
      ]
    },
    {
      id: 3,
      name: 'NELSON-DENNY READING TEST',
      description: 'Comprehensive reading assessment with vocabulary, comprehension, and reading rate subtests',
      category: 'Reading Assessment',
      usageCount: 35,
      estimatedTime: '45-60 min',
      icon: FiBook,
      color: 'blue',
      type: 'Nelson-Denny',
      sections: [
        'Vocabulary Subtest', 'Comprehension Subtest', 'Reading Rate'
      ]
    },
    {
      id: 4,
      name: 'ADHD-T2 ASSESSMENT',
      description: 'Attention-Deficit/Hyperactivity Disorder Test based on DSM-5 criteria',
      category: 'Attention Assessment',
      usageCount: 67,
      estimatedTime: '20-30 min',
      icon: FiActivity,
      color: 'purple',
      type: 'ADHDT2',
      sections: [
        'Inattention Subscale', 'Hyperactivity/Impulsivity Subscale', 'DSM-5 Criteria Analysis'
      ]
    },
    {
      id: 5,
      name: 'GILLIAM AUTISM RATING SCALE-3 (GARS-3)',
      description: 'Autism assessment with 6 subscales for identifying autism spectrum disorders',
      category: 'Autism Assessment',
      usageCount: 23,
      estimatedTime: '35-50 min',
      icon: FiCpu,
      color: 'pink',
      type: 'GARS-3',
      sections: [
        'Restricted/Repetitive Behaviors', 'Social Interaction', 'Social Communication',
        'Emotional Regulation', 'Cognitive Style', 'Maladaptive Speech'
      ]
    },
    {
      id: 6,
      name: 'BROWN EXECUTIVE FUNCTION ASSESSMENT SCALE',
      description: 'Comprehensive assessment of executive functioning abilities',
      category: 'Executive Function',
      usageCount: 19,
      estimatedTime: '40-55 min',
      icon: FiCpu,
      color: 'orange',
      type: 'Brown-EF-A',
      sections: [
        'Inhibition', 'Shifting', 'Emotional Control', 'Initiation',
        'Working Memory', 'Planning/Organization', 'Organization of Materials', 'Self-Monitoring'
      ]
    },
    {
      id: 7,
      name: 'ADHD-DSM5 CHECKLIST',
      description: 'DSM-5 based ADHD assessment with detailed criteria analysis',
      category: 'Attention Assessment',
      usageCount: 31,
      estimatedTime: '25-35 min',
      icon: FiActivity,
      color: 'red',
      type: 'ADHT-BSM',
      sections: [
        'Inattention Criteria', 'Hyperactivity/Impulsivity Criteria', 'DSM-5 Diagnosis'
      ]
    },
    {
      id: 8,
      name: 'ASTON INDEX',
      description: 'Learning difficulties assessment for children with developmental delays',
      category: 'Learning Assessment',
      usageCount: 26,
      estimatedTime: '30-40 min',
      icon: FiCpu,
      color: 'yellow',
      type: 'Aston-Index',
      sections: [
        'Visual-Motor Skills', 'Language Skills', 'Cognitive Skills', 'Social Skills'
      ]
    },
    {
      id: 9,
      name: 'BENDER GESTALT TEST (BKT)',
      description: 'Visual-motor functioning assessment using geometric figure reproduction',
      category: 'Motor Assessment',
      usageCount: 18,
      estimatedTime: '15-20 min',
      icon: FiActivity,
      color: 'green',
      type: 'BKT',
      sections: [
        'Figure Reproduction', 'Motor Coordination', 'Visual Perception'
      ]
    },
    {
      id: 10,
      name: 'EACA AUTISM ASSESSMENT',
      description: 'Educational Assessment for Children with Autism - comprehensive evaluation',
      category: 'Autism Assessment',
      usageCount: 22,
      estimatedTime: '50-65 min',
      icon: FiCpu,
      color: 'cyan',
      type: 'EACA',
      sections: [
        'Communication Skills', 'Social Interaction', 'Behavioral Patterns', 'Cognitive Abilities'
      ]
    }
  ];

  const categories = [
    'all', 'Auditory Processing', 'Cognitive Processing', 'Cognitive Assessment',
    'Reading Assessment', 'Attention Assessment', 'Autism Assessment',
    'Executive Function', 'Learning Assessment', 'Motor Assessment'
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const handleTemplateSelect = (template) => {
    // Import and render the appropriate template component
    let componentPath = '';
    switch (template.type) {
      case 'TAPS-3':
        componentPath = './TAPS3Template';
        break;
      case 'RIPA-Primary':
        componentPath = './RIPAPrimaryTemplate';
        break;
      case 'Ravens-CPM':
        componentPath = './RavensCPMTemplate';
        break;
      case 'Nelson-Denny':
        componentPath = './NelsonDennyReadingTestTemplate';
        break;
      case 'ADHDT2':
        componentPath = './ADHDT2Template';
        break;
      case 'GARS-3':
        componentPath = './GARS3Template';
        break;
      case 'Brown-EF-A':
        componentPath = './BrownEFAScaleTemplate';
        break;
      case 'ADHT-BSM':
        componentPath = './ADHTBSMTemplate';
        break;
      case 'Aston-Index':
        componentPath = './AstonIndexTemplate';
        break;
      case 'BKT':
        componentPath = './BKTTemplate';
        break;
      case 'EACA':
        componentPath = './EACAAutismTemplate';
        break;
      default:
        componentPath = './TAPS3Template';
    }

    import(componentPath).then((module) => {
      const TemplateComponent = module.default;
      const templateWrapper = {
        ...template,
        component: TemplateComponent,
        isAssessmentTemplate: true
      };
      onSelectTemplate(templateWrapper);
    }).catch(error => {
      console.error('Error loading template:', error);
      // Fallback to basic template
      onSelectTemplate(template);
    });
  };

  return (
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
          {/* Static TAPS-3 Card */}
          <TAPS3StaticCard onSelect={onSelectTemplate} />
          
          {filteredTemplates.map((template) => {
            const IconComponent = template.icon;
            return (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`border rounded-xl p-6 cursor-pointer transition-all duration-300 ${getColorClasses(template.color)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconColor(template.color)}`}>
                    <IconComponent className="w-6 h-6" />
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
          })}
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

export default AssessmentTemplateSelector;
