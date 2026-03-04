import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Login from './components/Login';
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
import ServiceCreateForm from './components/ServiceCreateForm';
import ServiceEditForm from './components/ServiceEditForm';
import StudentCreateForm from './components/StudentCreateForm';
import TherapistCreateForm from './components/TherapistCreateForm';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showLogin, setShowLogin] = useState(!isAuthenticated);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'appointment-detail', 'encounter-detail', 'template-builder', 'template-viewer', 'template-selector', 'template-based-encounter', 'patient-profile', 'patient-edit', 'patient-create', 'doctor-profile', 'doctor-edit', 'doctor-create', 'receptionist-profile', 'receptionist-edit', 'service-create', 'service-edit'
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedReceptionistId, setSelectedReceptionistId] = useState(null);
  const [selectedClinicId, setSelectedClinicId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  // Show login screen if not authenticated
  if (showLogin || !isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const handleAppointmentClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setCurrentView('appointment-detail');
    setActiveItem('encounters-list'); // Set to encounters section
  };

  const handleViewAllAppointments = () => {
    setActiveItem('encounters-list');
    setCurrentView('appointments-list');
  };

  const handleViewAllTherapists = () => {
    setActiveItem('doctors');
    setCurrentView('doctors-list');
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
    setActiveItem('encounters-list');
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
    console.log('Saving staff member:', updatedData);
    alert(`Staff member ${updatedData.name} updated successfully!`);
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
    console.log('Saving student:', updatedData);
    alert(`Student ${updatedData.name} updated successfully!`);
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
    console.log('Saving therapist:', updatedData);
    alert(`Therapist ${updatedData.name} updated successfully!`);
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
    if (window.confirm('Are you sure you want to delete this student?')) {
      alert(`Student ${patientId} deleted successfully!`);
    }
  };

  const handleDeleteDoctor = (doctorId) => {
    if (window.confirm('Are you sure you want to delete this therapist?')) {
      alert(`Therapist ${doctorId} deleted successfully!`);
    }
  };

  const handleDeleteReceptionist = (receptionistId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      alert(`Staff member ${receptionistId} deleted successfully!`);
    }
  };

  const handleDeleteAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      alert(`Session ${appointmentId} deleted successfully!`);
    }
  };

  const handleDeleteEncounter = (encounterId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      alert(`Session ${encounterId} deleted successfully!`);
    }
  };

  // Create handlers
  const handleCreateNewPatient = () => {
    setCurrentView('patient-create');
    setActiveItem('patients');
  };

  const handleCreateNewDoctor = () => {
    setCurrentView('doctor-create');
    setActiveItem('doctors');
  };

  const handleCreateNewService = () => {
    setCurrentView('service-create');
    setActiveItem('services');
  };

  const handleCreateNewReceptionist = () => {
    alert('Create new staff member functionality - Form coming soon');
  };

  const handleCreateNewClinic = () => {
    alert('Create new centre functionality - Form coming soon');
  };

  const handleCreateNewAppointment = () => {
    alert('Create new session functionality - Form coming soon');
  };

  // Service CRUD handlers
  const handleViewService = (serviceId) => {
    alert(`View service ${serviceId} - Detail view coming soon`);
  };

  const handleEditService = (serviceId) => {
    setSelectedServiceId(serviceId);
    setCurrentView('service-edit');
    setActiveItem('services');
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this programme?')) {
      alert(`Programme ${serviceId} deleted successfully!`);
    }
  };

  const handleSaveService = (serviceData) => {
    // In a real app, this would save to backend
    console.log('Saving service:', serviceData);
    alert(`Programme "${serviceData.name}" saved successfully!`);
    setCurrentView('services-list');
    setActiveItem('services');
  };

  const handleCancelServiceEdit = () => {
    setCurrentView('services-list');
    setActiveItem('services');
  };

  const handleDeleteClinic = (clinicId) => {
    if (window.confirm('Are you sure you want to delete this centre?')) {
      alert(`Centre ${clinicId} deleted successfully!`);
    }
  };

  const handleEditClinic = (clinicId) => {
    setSelectedClinicId(clinicId);
    setCurrentView('clinic-edit');
    setActiveItem('clinics');
  };

  const handleSaveClinic = (updatedData) => {
    // In a real app, this would save to backend
    console.log('Saving center:', updatedData);
    alert(`Center ${updatedData.name} updated successfully!`);
    setSelectedClinicId(null);
    setCurrentView('clinics-list');
    setActiveItem('clinics');
  };

  const handleCancelClinicEdit = () => {
    setCurrentView('clinics-list');
    setActiveItem('clinics');
  };

  const renderContent = () => {
    // Handle service create form
    if (currentView === 'service-create') {
      return (
        <ServiceCreateForm
          onSave={handleSaveService}
          onCancel={handleCancelServiceEdit}
        />
      );
    }

    // Handle service edit form
    if (currentView === 'service-edit') {
      return (
        <ServiceEditForm
          serviceId={selectedServiceId}
          onSave={handleSaveService}
          onCancel={handleCancelServiceEdit}
        />
      );
    }

    // Handle student create form
    if (currentView === 'patient-create') {
      return (
        <StudentCreateForm
          onSave={handleSavePatient}
          onCancel={handleCancelPatientEdit}
        />
      );
    }

    // Handle therapist create form
    if (currentView === 'doctor-create') {
      return (
        <TherapistCreateForm
          onSave={handleSaveDoctor}
          onCancel={handleCancelDoctorEdit}
        />
      );
    }

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
        return <Dashboard onAppointmentClick={handleAppointmentClick} onCreateNewEncounter={handleCreateNewEncounter} onViewAllAppointments={handleViewAllAppointments} onViewAllTherapists={handleViewAllTherapists} />;
      
      case 'patients':
        if (currentView === 'patients-list' || currentView === 'dashboard') {
          return <PatientsList onViewPatient={handleViewPatient} onEditPatient={handleEditPatient} onDeletePatient={handleDeletePatient} onCreateNewPatient={handleCreateNewPatient} />;
        }
        return <PatientsList onViewPatient={handleViewPatient} onEditPatient={handleEditPatient} onDeletePatient={handleDeletePatient} onCreateNewPatient={handleCreateNewPatient} />;
      
      case 'doctors':
        if (currentView === 'doctors-list' || currentView === 'dashboard') {
          return <DoctorsList onViewDoctor={handleViewDoctor} onEditDoctor={handleEditDoctor} onDeleteDoctor={handleDeleteDoctor} onCreateNewDoctor={handleCreateNewDoctor} />;
        }
        return <DoctorsList onViewDoctor={handleViewDoctor} onEditDoctor={handleEditDoctor} onDeleteDoctor={handleDeleteDoctor} onCreateNewDoctor={handleCreateNewDoctor} />;
      
      case 'receptionists':
        if (currentView === 'receptionists-list' || currentView === 'dashboard') {
          return <ReceptionistsList onViewReceptionist={handleViewReceptionist} onEditReceptionist={handleEditReceptionist} onDeleteReceptionist={handleDeleteReceptionist} onCreateNewReceptionist={handleCreateNewReceptionist} />;
        }
        return <ReceptionistsList onViewReceptionist={handleViewReceptionist} onEditReceptionist={handleEditReceptionist} onDeleteReceptionist={handleDeleteReceptionist} onCreateNewReceptionist={handleCreateNewReceptionist} />;
      
      case 'services':
        return <ServicesList onViewService={handleViewService} onEditService={handleEditService} onDeleteService={handleDeleteService} onCreateNewService={handleCreateNewService} />;
      
      case 'clinics':
        if (currentView === 'clinics-list' || currentView === 'dashboard') {
          return <ClinicsList onViewClinic={handleViewClinic} onEditClinic={handleEditClinic} onDeleteClinic={handleDeleteClinic} onCreateNewClinic={handleCreateNewClinic} />;
        }
        return <ClinicsList onViewClinic={handleViewClinic} onEditClinic={handleEditClinic} onDeleteClinic={handleDeleteClinic} onCreateNewClinic={handleCreateNewClinic} />;
      
      case 'encounters-list':
        if (currentView === 'appointments-list') {
          return <AppointmentsList onViewAppointment={handleAppointmentClick} onEditAppointment={handleEditAppointment} onDeleteAppointment={handleDeleteAppointment} onCreateNewAppointment={handleCreateNewAppointment} />;
        }
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
