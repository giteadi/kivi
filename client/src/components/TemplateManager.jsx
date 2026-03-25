import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiCopy, FiSearch, FiFilter } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import ADHDT2Template from './ADHDT2Template';
import ADHTBSMTemplate from './ADHTBSMTemplate';
import AstonIndexTemplate from './AstonIndexTemplate';
import TemplateTypeSelector from './TemplateTypeSelector';

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

  // Static templates data for design purposes
  const staticTemplates = [
    {
      id: 1,
      name: 'ADHT-DSM 5 Checklist',
      type: 'ADHT-BSM',
      description: 'DSM-5 ADHD Checklist with checkbox-based criteria selection for inattention and hyperactivity',
      template_data: {
        type: 'ADHT-BSM',
        name: 'ADHD-DSM 5 Checklist',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        inattentionCriteria: [
          { id: 'A1', text: 'Often fails to give close attention to details or makes careless mistakes', checked: false },
          { id: 'A2', text: 'Often has trouble sustaining attention in tasks or play activities', checked: false },
          { id: 'A3', text: 'Often does not seem to listen when spoken to directly', checked: false },
          { id: 'A4', text: 'Often does not follow through on instructions', checked: false },
          { id: 'A5', text: 'Often has difficulty organizing tasks and activities', checked: false },
          { id: 'A6', text: 'Often avoids tasks that require mental effort', checked: false },
          { id: 'A7', text: 'Often loses things necessary for tasks', checked: false },
          { id: 'A8', text: 'Is often easily distracted by extraneous stimuli', checked: false },
          { id: 'A9', text: 'Is often forgetful in daily activities', checked: false }
        ],
        hyperactivityCriteria: [
          { id: 'A10', text: 'Often fidgets with or taps hands or feet', checked: false },
          { id: 'A11', text: 'Often leaves seat when remaining seated is expected', checked: false },
          { id: 'A12', text: 'Often runs about or climbs in inappropriate situations', checked: false }
        ],
        inattentionTotal: 0,
        hyperactivityTotal: 0,
        remarks: ''
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Aston Index Assessment',
      type: 'Aston-Index',
      description: 'Comprehensive battery of tests for diagnosing language difficulties in children',
      template_data: {
        type: 'Aston-Index',
        name: 'Aston Index Assessment',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        description: 'The Aston Index is a comprehensive battery of tests for diagnosing language difficulties in children.',
        generalUnderlyingAbility: [
          { id: 1, test: 'Picture Recognition', score: '9', remarks: '' },
          { id: 2, test: 'Vocabulary', score: '5/6 years', remarks: '' },
          { id: 3, test: 'Good-enough draw-a-man', score: '4 years(MA)', remarks: '' },
          { id: 4, test: 'Copying geometric designs', score: '6', remarks: '' },
          { id: 5, test: 'Grapheme-Phoneme correspondence', score: 'Could identify the uppercase and lower case letter, but could not say the individual specific sounds', remarks: '' },
          { id: 6, test: 'Schonell\'s reading test', score: 'NA', remarks: '' },
          { id: 7, test: 'Schonell\'s spelling test', score: 'NA', remarks: '' },
          { id: 8, test: 'Visual discrimination test', score: '9', remarks: '' }
        ],
        performanceItems: [
          { id: 9, test: 'Child\'s laterality', score: 'Left', remarks: '' },
          { id: 10, test: 'Copying name', score: '8', remarks: '' },
          { id: 11, test: 'Free writing', score: 'NA', remarks: '' },
          { id: 12, test: 'Visual sequential memory (pictorial)', score: '3', remarks: '' },
          { id: 13, test: 'Auditory sequential memory', score: '6 (8 forward, 4 reverse)', remarks: '' },
          { id: 14, test: 'Sound Blending', score: '4', remarks: '' },
          { id: 15, test: 'Visual Sequential memory (symbolic)', score: '7', remarks: '' },
          { id: 16, test: 'Sound discrimination', score: '9', remarks: '' },
          { id: 17, test: 'Grapho-motor test', score: 'NA', remarks: '' }
        ],
        interpretation: `Interpretation:
General Underlying Ability and Attainment
1. Picture Recognition- On this subtest, ABC was able to recognize and give names of 9 pictures and was able to tag common objects in the environment.
2. Vocabulary- On this subtest ABC's vocabulary was equivalent to that of a 5 year old child.
She showed some difficulty with verbal expression of meaning of words presented to her, and had difficulty in describing and defining words adequately, which was suggestive of underdevelopment of understanding of verbal concepts for ABC.
3. Good-enough draw-a-man test- On this subtest, ABC's mental age was found to be 4 years which is lower than her chronological age.
4. Copying Geometric designs-ABC was able to copy geometric designs and her basic shapes were adequately defined except for her diamond shape. However, she showed difficulty with motor control.`,
        conclusions: 'Based on the assessment results, the student shows strengths in certain areas while requiring support in others.',
        recommendations: 'Recommendations include targeted interventions to strengthen specific language and cognitive skills identified during assessment.'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'ADHDT-2 Assessment',
      type: 'ADHDT2',
      description: 'Attention-Deficit/Hyperactivity Disorder Test-Second Edition with comprehensive scoring',
      template_data: {
        type: 'ADHDT2',
        name: 'ADHDT-2 Assessment Report',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        description: 'The Attention-Deficit/Hyperactivity Disorder Test-Second Edition (ADHDT-2) is a norm-referenced assessment.',
        subscales: [
          { name: 'Inattention', rawScore: 0, percentileRank: 0, scaledScore: 0 },
          { name: 'Hyperactivity/Impulsivity', rawScore: 0, percentileRank: 0, scaledScore: 0 }
        ],
        adhdIndex: 0,
        remark: '',
        disclaimer: 'The scores listed in the table imply that it is \'very likely\' that the student has symptoms of ADHD.'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Use static templates for design purposes
    loadStaticTemplates();
  }, [searchTerm, filterType]);

  const loadStaticTemplates = () => {
    setLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      let filteredTemplates = staticTemplates;
      
      // Apply search filter
      if (searchTerm) {
        filteredTemplates = filteredTemplates.filter(template =>
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply type filter
      if (filterType) {
        filteredTemplates = filteredTemplates.filter(template =>
          template.type === filterType
        );
      }
      
      setTemplates(filteredTemplates);
      setLoading(false);
    }, 500);
  };

  const createDefaultAstonIndexTemplate = async () => {
    try {
      const defaultAstonIndexData = {
        name: 'Aston Index Assessment',
        type: 'Aston-Index',
        description: 'Comprehensive battery of tests for diagnosing language difficulties in children',
        template_data: {
          name: 'Aston Index Assessment',
          studentName: '',
          examinerName: '',
          testDate: new Date().toISOString().split('T')[0],
          description: 'The Aston Index is a comprehensive battery of tests for diagnosing language difficulties in children. It provides a systematic approach to identifying specific areas of difficulty in language development, including underlying abilities and attainment levels.',
          performanceItems: [
            { id: 1, test: 'Child\'s laterality', score: 'Left', remarks: '' },
            { id: 2, test: 'Copying name', score: '8', remarks: '' },
            { id: 3, test: 'Free writing', score: 'NA', remarks: '' },
            { id: 4, test: 'Visual sequential memory (pictorial)', score: '3', remarks: '' },
            { id: 5, test: 'Auditory sequential memory', score: '6 (8 forward, 4 reverse)', remarks: '' },
            { id: 6, test: 'Sound Blending', score: '4', remarks: '' },
            { id: 7, test: 'Visual Sequential memory (symbolic)', score: '7', remarks: '' },
            { id: 8, test: 'Sound discrimination', score: '9', remarks: '' },
            { id: 9, test: 'Grapho-motor test', score: 'NA', remarks: '' }
          ],
          interpretation: 'The student demonstrates varying abilities across different cognitive and language domains. In picture recognition, the student shows age-appropriate visual processing skills. Vocabulary development appears to be within expected range for the age group.',
          conclusions: 'Based on the assessment results, the student shows strengths in certain areas while requiring support in others.',
          recommendations: 'Recommendations include targeted interventions to strengthen specific language and cognitive skills identified during assessment.'
        }
      };

      const response = await api.createTemplate(defaultAstonIndexData);
      if (response.success) {
        toast.success('Default Aston Index template created successfully');
        fetchTemplates(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating default Aston Index template:', error);
      toast.error('Failed to create default template');
    }
  };

  const handleTemplateSave = (templateData) => {
    if (isEditing && selectedTemplate) {
      // Update existing template in static list
      setTemplates(prev => prev.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, template_data: templateData, updated_at: new Date().toISOString() }
          : t
      ));
      toast.success('Template updated successfully (Design Mode)');
    } else {
      // Create new template in static list
      const newTemplate = {
        id: Date.now(),
        name: templateData.name || 'New Template',
        description: templateData.description || '',
        type: templateData.type || 'ADHDT2',
        template_data: templateData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast.success('Template created successfully (Design Mode)');
    }
    handleBackToList();
  };

  const handleTemplateCancel = () => {
    handleBackToList();
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setIsEditing(false);
    setShowCreateForm(true);
    setViewMode('template-select');
  };

  const handleTemplateTypeSelect = (type) => {
    setSelectedTemplate({ template_data: { type } });
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
    if (window.confirm(`Are you sure you want to delete "${template.name}"? (Design Mode)`)) {
      setTemplates(prev => prev.filter(t => t.id !== template.id));
      toast.success('Template deleted successfully (Design Mode)');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ADHDT2':
        return <FiFileText className="w-5 h-5 text-blue-500" />;
      default:
        return <FiFileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type, templateName) => {
    if (type === 'ADHT-BSM' || templateName?.toLowerCase().includes('dsm')) {
      return 'bg-green-100 text-green-800';
    }
    if (type === 'Aston-Index' || templateName?.toLowerCase().includes('aston')) {
      return 'bg-purple-100 text-purple-800';
    }
    switch (type) {
      case 'ADHDT2':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'template-select') {
    return (
      <TemplateTypeSelector
        onSelect={handleTemplateTypeSelect}
        onCancel={handleBackToList}
      />
    );
  }

  if (viewMode === 'edit' || showCreateForm) {
    const templateType = selectedTemplate?.template_data?.type || 
                        (selectedTemplate?.name?.toLowerCase().includes('dsm') ? 'ADHT-BSM' : 
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('dsm') ? 'ADHT-BSM' : 
                         selectedTemplate?.name?.toLowerCase().includes('aston') ? 'Aston-Index' :
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('aston') ? 'Aston-Index' : 'ADHDT2');
    
    if (templateType === 'ADHT-BSM') {
      return (
        <ADHTBSMTemplate
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }

    if (templateType === 'Aston-Index') {
      return (
        <AstonIndexTemplate
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }
    
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
                <span className={`inline-block px-3 py-1 text-sm rounded-full ${getTypeColor(selectedTemplate.template_data?.type, selectedTemplate.template_data?.name || selectedTemplate.name)}`}>
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
                {/* Template-specific Preview */}
                {selectedTemplate.template_data?.type === 'ADHT-BSM' || 
                 selectedTemplate?.name?.toLowerCase().includes('dsm') || 
                 selectedTemplate?.template_data?.name?.toLowerCase().includes('dsm') ? (
                  <div className="bg-white rounded-lg border-2 border-gray-200">
                    <div className="p-8">
                      {/* Template Header */}
                      <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                          ATTENTION-DEFICIT/HYPERACTIVITY DISORDER - DSM 5 CHECKLIST
                        </h1>
                        <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                          <span>Student: <strong className="text-green-600">{selectedTemplate.template_data?.studentName || '[Student Name]'}</strong></span>
                          <span>Examiner: <strong className="text-green-600">{selectedTemplate.template_data?.examinerName || '[Examiner Name]'}</strong></span>
                          <span>Date: <strong className="text-green-600">{selectedTemplate.template_data?.testDate || '[Test Date]'}</strong></span>
                        </div>
                      </div>

                      {/* Excel-style Preview */}
                      <div className="border border-black">
                        {/* Inattention Preview */}
                        <div className="border-b border-black">
                          <div className="bg-gray-100 p-2 text-center font-semibold text-sm">
                            INATTENTION
                          </div>
                          {(selectedTemplate.template_data?.inattentionCriteria || [
                            { id: 'A1', text: 'Often fails to give close attention to details or makes careless mistakes in schoolwork, at work, or during other activities', checked: false },
                            { id: 'A2', text: 'Often has trouble sustaining attention in tasks or play activities', checked: false },
                            { id: 'A3', text: 'Often does not seem to listen when spoken to directly', checked: false },
                            { id: 'A4', text: 'Often does not follow through on instructions and fails to finish schoolwork, chores, or duties in the workplace', checked: false },
                            { id: 'A5', text: 'Often has difficulty organizing tasks and activities', checked: false },
                            { id: 'A6', text: 'Often avoids, dislikes, or is reluctant to engage in tasks that require sustained mental effort', checked: false },
                            { id: 'A7', text: 'Often loses things necessary for tasks or activities', checked: false },
                            { id: 'A8', text: 'Is often easily distracted by extraneous stimuli', checked: false },
                            { id: 'A9', text: 'Is often forgetful in daily activities', checked: false }
                          ]).map((criteria) => (
                            <div key={criteria.id} className="border-b border-black">
                              <div className="grid grid-cols-12">
                                <div className="col-span-1 border-r border-black p-2 text-center font-medium text-xs">
                                  {criteria.id}
                                </div>
                                <div className="col-span-10 border-r border-black p-2 text-xs">
                                  {criteria.text}
                                </div>
                                <div className="col-span-1 p-2 text-center text-xs font-semibold">
                                  {criteria.checked ? 'Y' : ''}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="grid grid-cols-12">
                            <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">
                              TOTAL
                            </div>
                            <div className="col-span-10 border-r border-black p-2"></div>
                            <div className="col-span-1 p-2 text-center font-bold underline text-xs">
                              {selectedTemplate.template_data?.inattentionTotal || 0}
                            </div>
                          </div>
                        </div>

                        {/* Hyperactivity Preview */}
                        <div>
                          <div className="bg-gray-100 p-2 text-center font-semibold text-sm">
                            HYPERACTIVITY AND IMPULSIVITY
                            <div className="text-xs font-normal">
                              (Only behaviours occurring for 6 months or more are ticked)
                            </div>
                          </div>
                          {(selectedTemplate.template_data?.hyperactivityCriteria || [
                            { id: 'A10', text: 'Often fidgets with or taps hands or feet or squirms in seat', checked: false },
                            { id: 'A11', text: 'Often leaves seat in situations when remaining seated is expected', checked: false },
                            { id: 'A12', text: 'Often runs about or climbs in situations where it is inappropriate', checked: false }
                          ]).map((criteria) => (
                            <div key={criteria.id} className="border-b border-black">
                              <div className="grid grid-cols-12">
                                <div className="col-span-1 border-r border-black p-2 text-center font-medium text-xs">
                                  {criteria.id}
                                </div>
                                <div className="col-span-10 border-r border-black p-2 text-xs">
                                  {criteria.text}
                                </div>
                                <div className="col-span-1 p-2 text-center text-xs font-semibold">
                                  {criteria.checked ? 'Y' : ''}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="grid grid-cols-12">
                            <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">
                              TOTAL
                            </div>
                            <div className="col-span-10 border-r border-black p-2"></div>
                            <div className="col-span-1 p-2 text-center font-bold underline text-xs">
                              {selectedTemplate.template_data?.hyperactivityTotal || 0}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Remarks */}
                      {selectedTemplate.template_data?.remarks && (
                        <div className="mt-4">
                          <h6 className="font-semibold text-gray-800 mb-2">Remarks</h6>
                          <p className="text-sm text-gray-700">{selectedTemplate.template_data.remarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : selectedTemplate.template_data?.type === 'Aston-Index' || 
                 selectedTemplate?.name?.toLowerCase().includes('aston') || 
                 selectedTemplate?.template_data?.name?.toLowerCase().includes('aston') ? (
                  /* Aston Index Preview */
                  <div className="bg-white rounded-lg border-2 border-gray-200">
                    <div className="p-8">
                      {/* Template Header */}
                      <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                          ASTON INDEX ASSESSMENT REPORT
                        </h1>
                        <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                          <span>Student: <strong className="text-purple-600">{selectedTemplate.template_data?.studentName || '[Student Name]'}</strong></span>
                          <span>Examiner: <strong className="text-purple-600">{selectedTemplate.template_data?.examinerName || '[Examiner Name]'}</strong></span>
                          <span>Date: <strong className="text-purple-600">{selectedTemplate.template_data?.testDate || '[Test Date]'}</strong></span>
                        </div>
                      </div>

                      {/* Performance Items Table */}
                      <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">1. ASTON INDEX</h2>
                        <div className="border border-black">
                          <div className="bg-purple-50 p-2 text-center font-semibold text-sm border-b border-black">
                            1. ASTON INDEX
                          </div>
                          
                          <div className="p-3 border-b border-black">
                            <p className="text-xs text-gray-700 leading-relaxed">
                              The Aston Index is a comprehensive battery of tests for diagnosing language difficulties in children. 
                              It identifies children with special educational needs, language difficulties, auditory and visual 
                              perception difficulties, reading and spelling difficulties. The index contains 16 tests.
                            </p>
                          </div>

                          {/* Section I */}
                          <div className="border-b border-black">
                            <div className="bg-gray-100 p-2 text-center font-semibold text-sm border-b border-black">
                              SECTION I: GENERAL UNDERLYING ABILITY AND ATTAINMENT
                            </div>
                            <div className="grid grid-cols-12 border-b border-black bg-gray-50">
                              <div className="col-span-1 border-r border-black p-1 text-center font-bold text-xs">S.No</div>
                              <div className="col-span-8 border-r border-black p-1 text-center font-bold text-xs">Test</div>
                              <div className="col-span-3 p-1 text-center font-bold text-xs">Score</div>
                            </div>
                            {(selectedTemplate.template_data?.generalUnderlyingAbility || [
                              { id: 1, test: 'Picture Recognition', score: '9' },
                              { id: 2, test: 'Vocabulary', score: '5/6 years' },
                              { id: 3, test: 'Good-enough draw-a-man', score: '4 years(MA)' },
                              { id: 4, test: 'Copying geometric designs', score: '6' },
                              { id: 5, test: 'Grapheme-Phoneme correspondence', score: 'Could identify the uppercase and lower case letter, but could not say the individual specific sounds' },
                              { id: 6, test: 'Schonell\'s reading test', score: 'NA' },
                              { id: 7, test: 'Schonell\'s spelling test', score: 'NA' },
                              { id: 8, test: 'Visual discrimination test', score: '9' }
                            ]).map((item, index) => (
                              <div key={item.id} className="border-b border-black">
                                <div className="grid grid-cols-12">
                                  <div className="col-span-1 border-r border-black p-1 text-center text-xs">
                                    {index + 1}
                                  </div>
                                  <div className="col-span-8 border-r border-black p-1 text-xs">
                                    {item.test}
                                  </div>
                                  <div className="col-span-3 p-1 text-center text-xs">
                                    {item.score}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Section II */}
                          <div>
                            <div className="bg-gray-100 p-2 text-center font-semibold text-sm border-b border-black">
                              SECTION II: PERFORMANCE ITEMS
                            </div>
                            <div className="grid grid-cols-12 border-b border-black bg-gray-50">
                              <div className="col-span-1 border-r border-black p-1 text-center font-bold text-xs">S.No</div>
                              <div className="col-span-8 border-r border-black p-1 text-center font-bold text-xs">Test</div>
                              <div className="col-span-3 p-1 text-center font-bold text-xs">Score</div>
                            </div>
                            {(selectedTemplate.template_data?.performanceItems || [
                              { id: 9, test: 'Child\'s laterality', score: 'Left' },
                              { id: 10, test: 'Copying name', score: '8' },
                              { id: 11, test: 'Free writing', score: 'NA' },
                              { id: 12, test: 'Visual sequential memory (pictorial)', score: '3' },
                              { id: 13, test: 'Auditory sequential memory', score: '6 (8 forward, 4 reverse)' },
                              { id: 14, test: 'Sound Blending', score: '4' },
                              { id: 15, test: 'Visual Sequential memory (symbolic)', score: '7' },
                              { id: 16, test: 'Sound discrimination', score: '9' },
                              { id: 17, test: 'Grapho-motor test', score: 'NA' }
                            ]).map((item, index) => (
                              <div key={item.id} className="border-b border-black">
                                <div className="grid grid-cols-12">
                                  <div className="col-span-1 border-r border-black p-1 text-center text-xs">
                                    {index + 1}
                                  </div>
                                  <div className="col-span-8 border-r border-black p-1 text-xs">
                                    {item.test}
                                  </div>
                                  <div className="col-span-3 p-1 text-center text-xs">
                                    {item.score}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Interpretation */}
                      {selectedTemplate.template_data?.interpretation && (
                        <div className="mb-6">
                          <h2 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h2>
                          <div className="bg-purple-50 rounded-lg p-6">
                            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                              {selectedTemplate.template_data.interpretation}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Conclusions */}
                      {selectedTemplate.template_data?.conclusions && (
                        <div className="mb-6">
                          <h2 className="text-xl font-semibold text-gray-800 mb-4">Conclusions</h2>
                          <div className="bg-blue-50 rounded-lg p-6">
                            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                              {selectedTemplate.template_data.conclusions}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      {selectedTemplate.template_data?.recommendations && (
                        <div className="mb-6">
                          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h2>
                          <div className="bg-green-50 rounded-lg p-6">
                            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                              {selectedTemplate.template_data.recommendations}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* ADHDT-2 Preview */
                  <div className="bg-white rounded-lg border-2 border-gray-200">
                    <div className="p-8">
                      {/* Template Header */}
                      <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                          {selectedTemplate.template_data?.name || 'Assessment Report'}
                        </h1>
                        <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                          <span>Student: <strong className="text-blue-600">{selectedTemplate.template_data?.studentName || '[Student Name]'}</strong></span>
                          <span>Examiner: <strong className="text-blue-600">{selectedTemplate.template_data?.examinerName || '[Examiner Name]'}</strong></span>
                          <span>Date: <strong className="text-blue-600">{selectedTemplate.template_data?.testDate || '[Test Date]'}</strong></span>
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
                              {selectedTemplate.template_data?.subscales?.map((subscale, index) => (
                                <tr key={index} className="hover:bg-blue-50 transition-colors">
                                  <td className="border-2 border-gray-300 px-6 py-4 font-medium text-gray-800">{subscale.name}</td>
                                  <td className="border-2 border-gray-300 px-6 py-4 text-center font-semibold text-blue-600">{subscale.rawScore}</td>
                                  <td className="border-2 border-gray-300 px-6 py-4 text-center font-semibold text-blue-600">{subscale.percentileRank}</td>
                                  <td className="border-2 border-gray-300 px-6 py-4 text-center font-semibold text-blue-600">{subscale.scaledScore}</td>
                                </tr>
                              ))}
                              <tr className="bg-gradient-to-r from-gray-100 to-gray-200 font-bold">
                                <td className="border-2 border-gray-300 px-6 py-4 font-bold text-gray-800">ADHD Index</td>
                                <td className="border-2 border-gray-300 px-6 py-4 text-center font-bold text-red-600" colSpan="3">
                                  {selectedTemplate.template_data?.adhdIndex || 0}
                                </td>
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
                              {selectedTemplate.template_data.remark}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Disclaimer */}
                      <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Disclaimer</h2>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6">
                          <p className="text-gray-700 leading-relaxed text-base">
                            {selectedTemplate.template_data?.disclaimer || 'The scores listed in the table imply that it is \'very likely\' that [Student Name] has symptoms of ADHD. However, the checklist cannot be fully endorsed by the tester due to the one-to-one situation. The scores are based on the reports from the mother.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
          
          <div className="flex space-x-2">
          <button
            onClick={createDefaultAstonIndexTemplate}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Aston Index
          </button>
          <button
            onClick={handleCreateTemplate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Template
          </button>
        </div>
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
                  <option value="ADHT-BSM">ADHT-BSM</option>
                  <option value="Aston-Index">Aston Index</option>
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
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(template.template_data?.type, template.template_data?.name || template.name)}`}>
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
