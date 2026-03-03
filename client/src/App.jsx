import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AppointmentsList from './components/AppointmentsList';
import AppointmentDetail from './components/AppointmentDetail';
import EncounterDetail from './components/EncounterDetail';
import EncountersList from './components/EncountersList';
import EncounterTemplates from './components/EncounterTemplates';
import TemplateBuilder from './components/TemplateBuilder';
import TemplateViewer from './components/TemplateViewer';
import TemplateSelector from './components/TemplateSelector';
import TemplateBasedEncounter from './components/TemplateBasedEncounter';
import MobileMenu from './components/MobileMenu';

function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'appointment-detail', 'encounter-detail', 'template-builder', 'template-viewer', 'template-selector', 'template-based-encounter'
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleAppointmentClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setCurrentView('appointment-detail');
    setActiveItem('appointments'); // Set to appointments section
  };

  const handleViewAllAppointments = () => {
    setActiveItem('appointments');
    setCurrentView('appointments-list');
  };

  const handleViewEncounter = (encounterId = null) => {
    // Always navigate to encounters section when viewing encounter details
    setActiveItem('encounters-list');
    setCurrentView('encounter-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedAppointmentId(null);
    setActiveItem('dashboard');
  };

  const handleBackToAppointments = () => {
    setCurrentView('appointments-list');
    setActiveItem('appointments');
  };

  const handleBackToAppointment = () => {
    setCurrentView('appointment-detail');
  };

  const handleBackToEncountersList = () => {
    setActiveItem('encounters-list');
    setCurrentView('encounters-list');
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setCurrentView('template-builder');
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setCurrentView('template-builder');
  };

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template);
    setCurrentView('template-viewer');
  };

  const handleDuplicateTemplate = (template) => {
    const duplicatedTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copy)`,
      usageCount: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setSelectedTemplate(duplicatedTemplate);
    setCurrentView('template-builder');
  };

  const handleDeleteTemplate = (template) => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      // In a real app, this would delete from backend
      alert('Template deleted successfully!');
      handleBackToTemplates();
    }
  };

  const handleSaveTemplate = (templateData) => {
    // In a real app, this would save to backend
    console.log('Saving template:', templateData);
    alert('Template saved successfully!');
    handleBackToTemplates();
  };

  const handleCancelTemplate = () => {
    handleBackToTemplates();
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
    setCurrentView('encounter-templates');
    setActiveItem('encounter-templates');
  };

  const handleCreateNewEncounter = (patientData = null) => {
    setSelectedPatient(patientData || {
      id: 'P001',
      name: 'Patient Kjaggi',
      age: '35',
      gender: 'Male'
    });
    setCurrentView('template-selector');
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setCurrentView('template-based-encounter');
  };

  const handleCancelTemplateSelection = () => {
    setSelectedPatient(null);
    setCurrentView('encounters-list');
    setActiveItem('encounters-list');
  };

  const handleSaveEncounter = (encounterData) => {
    // In a real app, this would save to backend
    console.log('Saving encounter:', encounterData);
    alert('Encounter report created successfully!');
    setSelectedTemplate(null);
    setSelectedPatient(null);
    setCurrentView('encounters-list');
    setActiveItem('encounters-list');
  };

  const handleCancelEncounter = () => {
    setCurrentView('template-selector');
  };

  const renderContent = () => {
    // Handle template-based encounter creation
    if (currentView === 'template-based-encounter') {
      return (
        <TemplateBasedEncounter
          template={selectedTemplate}
          patientData={selectedPatient}
          onSave={handleSaveEncounter}
          onCancel={handleCancelEncounter}
        />
      );
    }

    // Handle template selection
    if (currentView === 'template-selector') {
      return (
        <TemplateSelector
          onSelectTemplate={handleSelectTemplate}
          onCancel={handleCancelTemplateSelection}
          patientData={selectedPatient}
        />
      );
    }

    // Handle template viewer
    if (currentView === 'template-viewer') {
      return (
        <TemplateViewer
          template={selectedTemplate}
          onBack={handleBackToTemplates}
          onEdit={handleEditTemplate}
          onDuplicate={handleDuplicateTemplate}
          onDelete={handleDeleteTemplate}
        />
      );
    }

    // Handle template builder view
    if (currentView === 'template-builder') {
      return (
        <TemplateBuilder
          template={selectedTemplate}
          onSave={handleSaveTemplate}
          onCancel={handleCancelTemplate}
        />
      );
    }

    // Handle encounter detail view
    if (currentView === 'encounter-detail') {
      return (
        <EncounterDetail onBack={handleBackToEncountersList} />
      );
    }

    // Handle appointment detail view
    if (currentView === 'appointment-detail') {
      return (
        <AppointmentDetail 
          appointmentId={selectedAppointmentId}
          onBack={handleBackToAppointments}
          onViewEncounter={handleViewEncounter}
          onCreateNewEncounter={handleCreateNewEncounter}
        />
      );
    }

    // Handle main navigation items
    switch (activeItem) {
      case 'dashboard':
        return <Dashboard onAppointmentClick={handleAppointmentClick} onCreateNewEncounter={handleCreateNewEncounter} onViewAllAppointments={handleViewAllAppointments} />;
      
      case 'appointments':
        if (currentView === 'appointments-list' || currentView === 'dashboard') {
          return <AppointmentsList onViewAppointment={handleAppointmentClick} onCreateNewAppointment={() => alert('Create new appointment functionality')} />;
        }
        return <AppointmentsList onViewAppointment={handleAppointmentClick} onCreateNewAppointment={() => alert('Create new appointment functionality')} />;
      
      case 'encounters-list':
        return <EncountersList onViewEncounter={handleViewEncounter} onCreateNewEncounter={handleCreateNewEncounter} />;
      
      case 'encounter-templates':
        return (
          <EncounterTemplates 
            onCreateTemplate={handleCreateTemplate}
            onEditTemplate={handleEditTemplate}
            onViewTemplate={handleViewTemplate}
            onDuplicateTemplate={handleDuplicateTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        );
      
      default:
        // Other menu items
        return (
          <div className="lg:ml-64 p-4 lg:p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border text-center"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 capitalize">
                {activeItem.replace('-', ' ')}
              </h2>
              <p className="text-gray-600">
                This section is under development
              </p>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeItem={activeItem} 
        setActiveItem={setActiveItem} 
        shouldExpandEncounters={activeItem === 'encounters-list' || activeItem === 'encounter-templates'}
      />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen}
        activeItem={activeItem} 
        setActiveItem={setActiveItem} 
      />
      <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.main>
    </div>
  );
}

export default App;
