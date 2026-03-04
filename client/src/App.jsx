import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AppointmentsList from './components/AppointmentsList';
import AppointmentDetail from './components/AppointmentDetail';
import PatientsList from './components/PatientsList';
import PatientProfile from './components/PatientProfile';
import PatientEditForm from './components/PatientEditForm';
import DoctorsList from './components/DoctorsList';
import DoctorProfile from './components/DoctorProfile';
import DoctorEditForm from './components/DoctorEditForm';
import ReceptionistsList from './components/ReceptionistsList';
import ReceptionistProfile from './components/ReceptionistProfile';
import ReceptionistEditForm from './components/ReceptionistEditForm';
import EncounterDetail from './components/EncounterDetail';
import EncountersList from './components/EncountersList';
import EncounterTemplates from './components/EncounterTemplates';
import TemplateBuilder from './components/TemplateBuilder';
import TemplateViewer from './components/TemplateViewer';
import TemplateSelector from './components/TemplateSelector';
import TemplateBasedEncounter from './components/TemplateBasedEncounter';
import MobileMenu from './components/MobileMenu';
import ClinicRevenue from './components/ClinicRevenue';
import DoctorRevenue from './components/DoctorRevenue';
import TaxList from './components/TaxList';
import BillingRecords from './components/BillingRecords';
import ClinicsList from './components/ClinicsList';
import ClinicProfile from './components/ClinicProfile';
import ClinicEditForm from './components/ClinicEditForm';
import ServicesList from './components/ServicesList';

function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'appointment-detail', 'encounter-detail', 'template-builder', 'template-viewer', 'template-selector', 'template-based-encounter', 'patient-profile', 'patient-edit', 'doctor-profile', 'doctor-edit', 'receptionist-profile', 'receptionist-edit'
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedReceptionistId, setSelectedReceptionistId] = useState(null);
  const [selectedClinicId, setSelectedClinicId] = useState(null);

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

  const handleViewPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setCurrentView('patient-profile');
    setActiveItem('patients');
  };

  const handleBackToPatients = () => {
    setSelectedPatientId(null);
    setCurrentView('patients-list');
    setActiveItem('patients');
  };

  const handleViewDoctor = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setCurrentView('doctor-profile');
    setActiveItem('doctors');
  };

  const handleBackToDoctors = () => {
    setSelectedDoctorId(null);
    setCurrentView('doctors-list');
    setActiveItem('doctors');
  };

  const handleViewReceptionist = (receptionistId) => {
    setSelectedReceptionistId(receptionistId);
    setCurrentView('receptionist-profile');
    setActiveItem('receptionists');
  };

  const handleBackToReceptionists = () => {
    setSelectedReceptionistId(null);
    setCurrentView('receptionists-list');
    setActiveItem('receptionists');
  };

  const handleViewClinic = (clinicId) => {
    setSelectedClinicId(clinicId);
    setCurrentView('clinic-profile');
    setActiveItem('clinics');
  };

  const handleBackToClinics = () => {
    setSelectedClinicId(null);
    setCurrentView('clinics-list');
    setActiveItem('clinics');
  };

  const handleSaveReceptionist = (updatedData) => {
    // In a real app, this would save to backend
    console.log('Saving receptionist:', updatedData);
    alert(`Receptionist ${updatedData.name} updated successfully!`);
    setSelectedReceptionistId(null);
    setCurrentView('receptionists-list');
    setActiveItem('receptionists');
  };

  const handleCancelReceptionistEdit = () => {
    setCurrentView('receptionists-list');
    setActiveItem('receptionists');
  };

  const handleSavePatient = (updatedData) => {
    // In a real app, this would save to backend
    console.log('Saving patient:', updatedData);
    alert(`Patient ${updatedData.name} updated successfully!`);
    setSelectedPatientId(null);
    setCurrentView('patients-list');
    setActiveItem('patients');
  };

  const handleCancelPatientEdit = () => {
    setCurrentView('patients-list');
    setActiveItem('patients');
  };

  const handleSaveDoctor = (updatedData) => {
    // In a real app, this would save to backend
    console.log('Saving doctor:', updatedData);
    alert(`Doctor ${updatedData.name} updated successfully!`);
    setSelectedDoctorId(null);
    setCurrentView('doctors-list');
    setActiveItem('doctors');
  };

  const handleCancelDoctorEdit = () => {
    setCurrentView('doctors-list');
    setActiveItem('doctors');
  };

  // Edit handlers
  const handleEditPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setCurrentView('patient-edit');
    setActiveItem('patients');
  };

  const handleEditDoctor = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setCurrentView('doctor-edit');
    setActiveItem('doctors');
  };

  const handleEditReceptionist = (receptionistId) => {
    setSelectedReceptionistId(receptionistId);
    setCurrentView('receptionist-edit');
    setActiveItem('receptionists');
  };

  const handleEditAppointment = (appointmentId) => {
    alert(`Edit appointment ${appointmentId} - Edit form coming soon`);
  };

  const handleEditEncounter = (encounterId) => {
    alert(`Edit encounter ${encounterId} - Edit form coming soon`);
  };

  // Delete handlers
  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      alert(`Patient ${patientId} deleted successfully!`);
    }
  };

  const handleDeleteDoctor = (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      alert(`Doctor ${doctorId} deleted successfully!`);
    }
  };

  const handleDeleteReceptionist = (receptionistId) => {
    if (window.confirm('Are you sure you want to delete this receptionist?')) {
      alert(`Receptionist ${receptionistId} deleted successfully!`);
    }
  };

  const handleDeleteAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      alert(`Appointment ${appointmentId} deleted successfully!`);
    }
  };

  const handleDeleteEncounter = (encounterId) => {
    if (window.confirm('Are you sure you want to delete this encounter?')) {
      alert(`Encounter ${encounterId} deleted successfully!`);
    }
  };

  const handleDeleteClinic = (clinicId) => {
    if (window.confirm('Are you sure you want to delete this clinic?')) {
      alert(`Clinic ${clinicId} deleted successfully!`);
    }
  };

  const handleEditClinic = (clinicId) => {
    setSelectedClinicId(clinicId);
    setCurrentView('clinic-edit');
    setActiveItem('clinics');
  };

  const handleSaveClinic = (updatedData) => {
    // In a real app, this would save to backend
    console.log('Saving clinic:', updatedData);
    alert(`Clinic ${updatedData.name} updated successfully!`);
    setSelectedClinicId(null);
    setCurrentView('clinics-list');
    setActiveItem('clinics');
  };

  const handleCancelClinicEdit = () => {
    setCurrentView('clinics-list');
    setActiveItem('clinics');
  };

  const renderContent = () => {
    // Handle doctor edit form
    if (currentView === 'doctor-edit') {
      return (
        <DoctorEditForm
          doctorId={selectedDoctorId}
          onSave={handleSaveDoctor}
          onCancel={handleCancelDoctorEdit}
        />
      );
    }

    // Handle patient edit form
    if (currentView === 'patient-edit') {
      return (
        <PatientEditForm
          patientId={selectedPatientId}
          onSave={handleSavePatient}
          onCancel={handleCancelPatientEdit}
        />
      );
    }

    // Handle receptionist edit form
    if (currentView === 'receptionist-edit') {
      return (
        <ReceptionistEditForm
          receptionistId={selectedReceptionistId}
          onSave={handleSaveReceptionist}
          onCancel={handleCancelReceptionistEdit}
        />
      );
    }

    // Handle receptionist profile view
    if (currentView === 'receptionist-profile') {
      return (
        <ReceptionistProfile
          receptionistId={selectedReceptionistId}
          onBack={handleBackToReceptionists}
        />
      );
    }

    // Handle clinic profile view
    if (currentView === 'clinic-profile') {
      return (
        <ClinicProfile
          clinicId={selectedClinicId}
          onBack={handleBackToClinics}
        />
      );
    }

    // Handle clinic edit form
    if (currentView === 'clinic-edit') {
      return (
        <ClinicEditForm
          clinicId={selectedClinicId}
          onSave={handleSaveClinic}
          onCancel={handleCancelClinicEdit}
        />
      );
    }

    // Handle doctor profile view
    if (currentView === 'doctor-profile') {
      return (
        <DoctorProfile
          doctorId={selectedDoctorId}
          onBack={handleBackToDoctors}
        />
      );
    }

    // Handle patient profile view
    if (currentView === 'patient-profile') {
      return (
        <PatientProfile
          patientId={selectedPatientId}
          onBack={handleBackToPatients}
        />
      );
    }

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
          return <AppointmentsList onViewAppointment={handleAppointmentClick} onEditAppointment={handleEditAppointment} onDeleteAppointment={handleDeleteAppointment} onCreateNewAppointment={() => alert('Create new appointment functionality')} />;
        }
        return <AppointmentsList onViewAppointment={handleAppointmentClick} onEditAppointment={handleEditAppointment} onDeleteAppointment={handleDeleteAppointment} onCreateNewAppointment={() => alert('Create new appointment functionality')} />;
      
      case 'patients':
        if (currentView === 'patients-list' || currentView === 'dashboard') {
          return <PatientsList onViewPatient={handleViewPatient} onEditPatient={handleEditPatient} onDeletePatient={handleDeletePatient} onCreateNewPatient={() => alert('Create new patient functionality')} />;
        }
        return <PatientsList onViewPatient={handleViewPatient} onEditPatient={handleEditPatient} onDeletePatient={handleDeletePatient} onCreateNewPatient={() => alert('Create new patient functionality')} />;
      
      case 'doctors':
        if (currentView === 'doctors-list' || currentView === 'dashboard') {
          return <DoctorsList onViewDoctor={handleViewDoctor} onEditDoctor={handleEditDoctor} onDeleteDoctor={handleDeleteDoctor} onCreateNewDoctor={() => alert('Create new doctor functionality')} />;
        }
        return <DoctorsList onViewDoctor={handleViewDoctor} onEditDoctor={handleEditDoctor} onDeleteDoctor={handleDeleteDoctor} onCreateNewDoctor={() => alert('Create new doctor functionality')} />;
      
      case 'receptionists':
        if (currentView === 'receptionists-list' || currentView === 'dashboard') {
          return <ReceptionistsList onViewReceptionist={handleViewReceptionist} onEditReceptionist={handleEditReceptionist} onDeleteReceptionist={handleDeleteReceptionist} onCreateNewReceptionist={() => alert('Create new receptionist functionality')} />;
        }
        return <ReceptionistsList onViewReceptionist={handleViewReceptionist} onEditReceptionist={handleEditReceptionist} onDeleteReceptionist={handleDeleteReceptionist} onCreateNewReceptionist={() => alert('Create new receptionist functionality')} />;
      
      case 'services':
        return <ServicesList onViewService={(id) => alert(`View service ${id}`)} onEditService={(id) => alert(`Edit service ${id}`)} onDeleteService={(id) => alert(`Delete service ${id}`)} onCreateNewService={() => alert('Create new service functionality')} />;
      
      case 'clinics':
        if (currentView === 'clinics-list' || currentView === 'dashboard') {
          return <ClinicsList onViewClinic={handleViewClinic} onEditClinic={handleEditClinic} onDeleteClinic={handleDeleteClinic} onCreateNewClinic={() => alert('Create new clinic functionality')} />;
        }
        return <ClinicsList onViewClinic={handleViewClinic} onEditClinic={handleEditClinic} onDeleteClinic={handleDeleteClinic} onCreateNewClinic={() => alert('Create new clinic functionality')} />;
      
      case 'encounters-list':
        return <EncountersList onViewEncounter={handleViewEncounter} onEditEncounter={handleEditEncounter} onDeleteEncounter={handleDeleteEncounter} onCreateNewEncounter={handleCreateNewEncounter} />;
      
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
      
      case 'clinic-revenue':
        return <ClinicRevenue />;
      
      case 'doctor-revenue':
        return <DoctorRevenue />;
      
      case 'taxes':
        return <TaxList onViewTax={(id) => alert(`View tax ${id}`)} onEditTax={(id) => alert(`Edit tax ${id}`)} onDeleteTax={(id) => alert(`Delete tax ${id}`)} onCreateNewTax={() => alert('Create new tax functionality')} />;
      
      case 'billing-records':
        return <BillingRecords onViewBilling={(id) => alert(`View billing ${id}`)} onEditBilling={(id) => alert(`Edit billing ${id}`)} onDeleteBilling={(id) => alert(`Delete billing ${id}`)} onCreateNewBilling={() => alert('Create new billing functionality')} />;
      
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
