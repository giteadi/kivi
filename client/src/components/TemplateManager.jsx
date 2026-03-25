import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiCopy, FiSearch, FiFilter } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import ADHDT2Template from './ADHDT2Template';

const TemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'view', 'edit'
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'preview'

  useEffect(() => {
    fetchTemplates();
  }, [searchTerm, filterType]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (filterType) filters.type = filterType;

      const response = await api.getTemplates(filters);
      if (response.success) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setIsEditing(false);
    setShowCreateForm(true);
    setViewMode('edit');
  };

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template);
    setViewMode('view');
    setActiveTab('details');
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setViewMode('edit');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedTemplate(null);
    setIsEditing(false);
    setShowCreateForm(false);
  };

  const handleDuplicateTemplate = (template) => {
    const newTemplate = {
      ...template,
      name: `${template.name} (Copy)`,
      id: Date.now()
    };
    setTemplates(prev => [...prev, newTemplate]);
    toast.success('Template duplicated successfully');
  };

  const handleDeleteTemplate = (template) => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      setTemplates(prev => prev.filter(t => t.id !== template.id));
      toast.success('Template deleted successfully');
    }
  };

  const handleTemplateSave = (templateData) => {
    if (isEditing && selectedTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, template_data: templateData }
          : t
      ));
      toast.success('Template updated successfully');
    } else {
      // Create new template
      const newTemplate = {
        id: Date.now(),
        name: templateData.name || 'New Template',
        description: templateData.description || '',
        template_data: templateData,
        type: templateData.type || 'ADHDT2',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast.success('Template created successfully');
    }
    handleBackToList();
  };

  const handleTemplateCancel = () => {
    handleBackToList();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ADHDT2':
        return <FiFileText className="w-5 h-5 text-blue-500" />;
      default:
        return <FiFileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'ADHDT2':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'edit' || showCreateForm) {
    return (
      <ADHDT2Template
        templateData={selectedTemplate?.template_data}
        onSave={handleTemplateSave}
        onCancel={handleTemplateCancel}
        isEditing={isEditing}
      />
    );
  }

  if (viewMode === 'view' && selectedTemplate) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToList}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiFileText className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Template Details</h1>
              <p className="text-gray-600">View and manage template information</p>
            </div>
          </div>

          {/* Template Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 border-b">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'preview'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                Preview
              </button>
            </div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {selectedTemplate.template_data?.name || selectedTemplate.name || 'Untitled Template'}
                </h2>
                <span className={`inline-block px-3 py-1 text-sm rounded-full ${getTypeColor(selectedTemplate.template_data?.type)}`}>
                  {selectedTemplate.template_data?.type || selectedTemplate.type || 'Unknown'}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditTemplate(selectedTemplate)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                >
                  <FiEdit2 className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDuplicateTemplate(selectedTemplate)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-colors"
                >
                  <FiCopy className="w-4 h-4 mr-2" />
                  Duplicate
                </button>
                <button
                  onClick={() => handleDeleteTemplate(selectedTemplate)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center transition-colors"
                >
                  <FiTrash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600">
                    {selectedTemplate.description || selectedTemplate.template_data?.description || 'No description available'}
                  </p>
                </div>

                {selectedTemplate.template_data?.studentName && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Student Name</h3>
                    <p className="text-gray-600">{selectedTemplate.template_data.studentName}</p>
                  </div>
                )}

                {selectedTemplate.template_data?.examinerName && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Examiner Name</h3>
                    <p className="text-gray-600">{selectedTemplate.template_data.examinerName}</p>
                  </div>
                )}

                {selectedTemplate.template_data?.subscales && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Subscales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTemplate.template_data.subscales.map((subscale, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-800">{subscale.name}</h4>
                          <p className="text-sm text-gray-600">Raw Score: {subscale.rawScore}</p>
                          <p className="text-sm text-gray-600">Scaled Score: {subscale.scaledScore}</p>
                          {subscale.percentileRank && (
                            <p className="text-sm text-gray-600">Percentile: {subscale.percentileRank}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Template Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Created:</span>
                      <span className="ml-2 text-gray-600">
                        {new Date(selectedTemplate.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Updated:</span>
                      <span className="ml-2 text-gray-600">
                        {new Date(selectedTemplate.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Complete Template Preview */}
                <div className="bg-white rounded-lg border-2 border-gray-200">
                  <div className="p-8">
                    {/* Template Header */}
                    <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
                      <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        {selectedTemplate.template_data?.name || 'Assessment Report'}
                      </h1>
                      <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                        <span>Student: <strong className="text-blue-600">[Student Name]</strong></span>
                        <span>Examiner: <strong className="text-blue-600">[Examiner Name]</strong></span>
                        <span>Date: <strong className="text-blue-600">[Test Date]</strong></span>
                      </div>
                    </div>

                    {/* Template Description */}
                    {selectedTemplate.template_data?.description && (
                      <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Assessment Description</h2>
                        <div className="bg-blue-50 rounded-lg p-6">
                          <p className="text-gray-700 leading-relaxed text-base">
                            {selectedTemplate.template_data.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Test Results Section */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Test Results</h2>
                      
                      {/* Results Table */}
                      <div className="overflow-x-auto mb-8">
                        <table className="w-full border-collapse border-2 border-gray-300 shadow-lg">
                          <thead>
                            <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                              <th className="border-2 border-gray-300 px-6 py-4 text-left font-bold text-gray-800">Subscales</th>
                              <th className="border-2 border-gray-300 px-6 py-4 text-center font-bold text-gray-800">Raw Scores</th>
                              <th className="border-2 border-gray-300 px-6 py-4 text-center font-bold text-gray-800">Percentile Ranks</th>
                              <th className="border-2 border-gray-300 px-6 py-4 text-center font-bold text-gray-800">Scaled Scores</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-blue-50 transition-colors">
                              <td className="border-2 border-gray-300 px-6 py-4 font-medium text-gray-800">Inattention</td>
                              <td className="border-2 border-gray-300 px-6 py-4 text-center font-semibold text-blue-600">0</td>
                              <td className="border-2 border-gray-300 px-6 py-4 text-center font-semibold text-blue-600">0</td>
                              <td className="border-2 border-gray-300 px-6 py-4 text-center font-semibold text-blue-600">0</td>
                            </tr>
                            <tr className="hover:bg-blue-50 transition-colors">
                              <td className="border-2 border-gray-300 px-6 py-4 font-medium text-gray-800">Hyperactivity/Impulsivity</td>
                              <td className="border-2 border-gray-300 px-6 py-4 text-center font-semibold text-blue-600">0</td>
                              <td className="border-2 border-gray-300 px-6 py-4 text-center font-semibold text-blue-600">0</td>
                              <td className="border-2 border-gray-300 px-6 py-4 text-center font-semibold text-blue-600">0</td>
                            </tr>
                            <tr className="bg-gradient-to-r from-gray-100 to-gray-200 font-bold">
                              <td className="border-2 border-gray-300 px-6 py-4 font-bold text-gray-800">ADHD Index</td>
                              <td className="border-2 border-gray-300 px-6 py-4 text-center font-bold text-red-600" colSpan="3">0</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Assessment Remark */}
                    {selectedTemplate.template_data?.remark && (
                      <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Assessment Remark</h2>
                        <div className="bg-green-50 rounded-lg p-6">
                          <p className="text-gray-700 leading-relaxed text-base">
                            [Assessment Remark]
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Disclaimer */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Disclaimer</h2>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6">
                        <p className="text-gray-700 leading-relaxed text-base">
                          The scores listed in the table imply that it is 'very likely' that [Student Name] has symptoms of ADHD. However, the checklist cannot be fully endorsed by the tester due to the one-to-one situation. The scores are based on the reports from the mother.
                        </p>
                      </div>
                    </div>

                    {/* Footer Information */}
                    <div className="mt-12 pt-6 border-t-2 border-gray-200">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Template ID: {selectedTemplate.id}</span>
                        <span>Created: {new Date(selectedTemplate.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Assessment Templates</h1>
            <p className="text-gray-600">Create and manage assessment templates</p>
          </div>
          
          <button
            onClick={handleCreateTemplate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Template
          </button>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
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
            </div>
            <div className="lg:w-48">
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="">All Types</option>
                  <option value="ADHDT2">ADHDT-2</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Templates List */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterType ? 'Try adjusting your search or filters' : 'Create your first template to get started'}
            </p>
            <button
              onClick={handleCreateTemplate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Template
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleViewTemplate(template)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      {getTypeIcon(template.template_data?.type)}
                      <div className="ml-2">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {template.template_data?.name || template.name || 'Untitled Template'}
                        </h3>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(template.template_data?.type)}`}>
                          {template.template_data?.type || template.type || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {template.description || template.template_data?.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Created: {new Date(template.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTemplate(template);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateTemplate(template);
                        }}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Duplicate"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TemplateManager;
