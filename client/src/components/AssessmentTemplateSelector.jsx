import React, { useState, useEffect } from 'react';
import { FiSearch, FiFileText, FiArrowRight, FiClock, FiUsers, FiArrowLeft, FiX, FiCpu, FiUser, FiEye, FiBook, FiActivity } from 'react-icons/fi';
import TAPS3StaticCard from './TAPS3StaticCard';
import api from '../services/api';

const AssessmentTemplateSelector = ({ onSelectTemplate, onCancel, studentName = 'ABC' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await api.getTemplates();
        if (response.success) {
          setTemplates(response.data);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Get unique categories from templates
  const categories = ['all', ...new Set(templates && templates.map ? templates.map(t => t.category).filter(Boolean) : [])];

  // Filter templates based on search and category
  const filteredTemplates = templates && templates.filter ? templates.filter(template => {
    const matchesSearch = !searchTerm || 
      template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) : [];

  const handleTemplateSelect = (template) => {
    console.log('Selected template:', template);
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

  // Map API template data to component format
  const mappedTemplates = filteredTemplates.map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    usageCount: template.usage_count || 0,
    estimatedTime: template.estimated_time || '30-60 min',
    icon: FiFileText, // Default icon, can be mapped from template.icon
    color: 'blue', // Default color, can be mapped from template.category
    type: template.type,
    sections: template.template_data?.subtests || ['Assessment']
  }));

  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
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
          
          {mappedTemplates && mappedTemplates.map && mappedTemplates.map((template) => {
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
                      {(template.sections && template.sections.length) || 0} sections
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.sections && template.sections.slice(0, 3).map((section, idx) => (
                        <span key={idx} className="text-xs bg-white bg-opacity-60 px-2 py-1 rounded">
                          {section}
                        </span>
                      ))}
                      {template.sections && template.sections.length > 3 && (
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

        {mappedTemplates && mappedTemplates.length === 0 && (
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
