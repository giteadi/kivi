import React, { useState, useEffect } from 'react';
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
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setShowCreateForm(true);
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const response = await api.deleteTemplate(templateId);
      if (response.success) {
        toast.success('Template deleted successfully');
        fetchTemplates();
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const handleDuplicateTemplate = async (template) => {
    try {
      const duplicatedTemplate = {
        ...template.template_data,
        name: `${template.template_data.name} (Copy)`,
        id: null
      };

      const response = await api.createTemplate(duplicatedTemplate);
      if (response.success) {
        toast.success('Template duplicated successfully');
        fetchTemplates();
      }
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Failed to duplicate template');
    }
  };

  const handleTemplateSave = (templateData) => {
    setShowCreateForm(false);
    setSelectedTemplate(null);
    setIsEditing(false);
    fetchTemplates();
  };

  const handleTemplateCancel = () => {
    setShowCreateForm(false);
    setSelectedTemplate(null);
    setIsEditing(false);
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

  if (showCreateForm) {
    return (
      <ADHDT2Template
        templateData={selectedTemplate?.template_data}
        onSave={handleTemplateSave}
        onCancel={handleTemplateCancel}
        isEditing={isEditing}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Template Manager</h2>
          <p className="text-gray-600 mt-1">Manage assessment templates</p>
        </div>
        <button
          onClick={handleCreateTemplate}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Create Template
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="ADHDT2">ADHDT-2</option>
            </select>
          </div>
        </div>
      </div>

      {/* Templates List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12">
          <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterType ? 'Try adjusting your search or filters' : 'Create your first template to get started'}
          </p>
          <button
            onClick={handleCreateTemplate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Create Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  {getTypeIcon(template.template_data?.type)}
                  <div className="ml-2">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {template.template_data?.name || 'Untitled Template'}
                    </h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(template.template_data?.type)}`}>
                      {template.template_data?.type || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {template.template_data?.description || 'No description available'}
                </p>
              </div>

              {template.template_data?.studentName && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500">
                    Student: {template.template_data.studentName}
                  </p>
                </div>
              )}

              {template.template_data?.subscales && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500">
                    {template.template_data.subscales.length} subscales
                  </p>
                </div>
              )}

              <div className="mb-3">
                <p className="text-xs text-gray-500">
                  Created: {new Date(template.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit Template"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicateTemplate(template)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Duplicate Template"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete Template"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
