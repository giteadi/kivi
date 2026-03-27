import { useState, useEffect, createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { setCredentials } from './store/slices/authSlice';
import { fetchDoctors } from './store/slices/doctorSlice';
import { fetchServices } from './store/slices/serviceSlice';
import { deletePatient, fetchPatients } from './store/slices/patientSlice';
import api from './services/api';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorToast from './components/ErrorToast';
import useErrorHandler from './hooks/useErrorHandler';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// Create Sidebar Context
const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  // Return context or a default value to prevent errors
  return context || { sidebarCollapsed: false, setSidebarCollapsed: () => {} };
};

import Login from './components/Login';
import Register from './components/Register';
import Homepage from './components/Homepage';
import UserDashboard from './components/UserDashboard';
// import TherapistDashboard from './components/TherapistDashboard'; // Temporarily disabled
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AppointmentsList from './components/AppointmentsList';
import AppointmentDetail from './components/AppointmentDetail';
import PatientsList from './components/PatientsList';
import PatientProfile from './components/PatientProfile';
import ExamineeEditForm from './components/ExamineeEditForm';
import DoctorsList from './components/DoctorsList';
import DoctorProfile from './components/DoctorProfile';
import DoctorEditForm from './components/DoctorEditForm';
import TherapistCreateForm from './components/TherapistCreateForm';
import ReceptionistsList from './components/ReceptionistsList';
import ReceptionistProfile from './components/ReceptionistProfile';
import ReceptionistEditForm from './components/ReceptionistEditForm';
import EncounterDetail from './components/EncounterDetail';
import EncountersList from './components/EncountersList';
import MobileMenu from './components/MobileMenu';
import ClinicRevenue from './components/ClinicRevenue';
import DoctorRevenue from './components/DoctorRevenue';
import TaxList from './components/TaxList';
import BillingRecords from './components/BillingRecords';
import ClinicsList from './components/ClinicsList';
import ClinicProfile from './components/ClinicProfile';
import ClinicEditForm from './components/ClinicEditForm';
import ServicesList from './components/ServicesList';
import ServiceCards from './components/ServiceCards';
import ServiceCreateForm from './components/ServiceCreateForm';
import ServiceEditForm from './components/ServiceEditForm';
import ExamineeCreateForm from './components/ExamineeCreateForm';
import ExamineeDetail from './components/ExamineeDetail';
// import TherapistCreateForm from './components/TherapistCreateForm'; // Temporarily disabled
import SessionCreateForm from './components/SessionCreateForm';
import SessionEditForm from './components/SessionEditForm';
import SessionList from './components/SessionList';
import PlansList from './components/PlansList';
import AdminSessionsList from './components/AdminSessionsList';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const { services: servicesData } = useSelector((state) => state.services);
  const { errors, removeError, handleApiError } = useErrorHandler();
  
  // All useState hooks at the top level
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showHomepage, setShowHomepage] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedExamineeId, setSelectedExamineeId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedReceptionistId, setSelectedReceptionistId] = useState(null);
  const [selectedClinicId, setSelectedClinicId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSessionCreateModalOpen, setIsSessionCreateModalOpen] = useState(false);
  const [isSessionEditModalOpen, setIsSessionEditModalOpen] = useState(false);
  const [selectedEncounterId, setSelectedEncounterId] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState(['dashboard']);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          dispatch(setCredentials({ user: parsedUser, token: storedToken }));
          setShowLogin(false);
          setShowHomepage(false); // Don't show homepage if already authenticated
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setShowLogin(false);
          setShowHomepage(true); // Show homepage for new users
        }
      } else {
        setShowLogin(false);
        setShowHomepage(true); // Show homepage for new users
      }
      setIsInitialized(true);
    };

    checkAuth();
  }, [dispatch]);

  // Show loading screen while checking authentication
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <img 
              src="https://res.cloudinary.com/bazeercloud/image/upload/v1765087953/Gemini_Generated_Image_o8ciwko8ciwko8ci-removebg-preview_l4nnui.png" 
              alt="MindSaid Learning Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading MindSaid Learning...</p>
        </div>
      </div>
    );
  }

  // Handle back navigation
  const handleBackNavigation = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      
      setNavigationHistory(newHistory);
      setActiveItem(previousPage);
      setCurrentView(previousPage);
    } else {
      // If no history, go to dashboard
      setActiveItem('dashboard');
      setCurrentView('dashboard');
      setNavigationHistory(['dashboard']);
    }
  };

  // Update navigation history when activeItem changes
  const updateNavigationHistory = (newItem) => {
    setNavigationHistory(prev => {
      const newHistory = [...prev];
      if (newHistory[newHistory.length - 1] !== newItem) {
        newHistory.push(newItem);
      }
      return newHistory;
    });
  };

  // Enhanced setActiveItem to track navigation
  const handleSetActiveItem = (item) => {
    setActiveItem(item);
    // Reset currentView when navigating to main sections to avoid conflicts
    if (item === 'sessions' || item === 'dashboard' || item === 'patients' || item === 'doctors' || item === 'clinics' || item === 'services') {
      setCurrentView(item);
    }
    updateNavigationHistory(item);
  };

  // Check if back button should be shown
  const shouldShowBackButton = navigationHistory.length > 1 && activeItem !== 'dashboard';

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowHomepage(false);
    
    // If there's a selected plan, we need to trigger payment modal
    // This will be handled in the UserDashboard component
  };

  const handleShowRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
    setShowHomepage(false);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
    setShowHomepage(false);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    setShowLogin(true);
    setShowHomepage(false);
  };

  const handleShowLogin = () => {
    setShowHomepage(false);
    setShowLogin(true);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowHomepage(false);
    setShowLogin(true);
  };

  // Show homepage first for non-authenticated users
  if (!isAuthenticated && showHomepage && !showLogin && !showRegister) {
    return (
      <Homepage 
        onSelectPlan={handleSelectPlan}
        onShowLogin={handleShowLogin}
      />
    );
  }

  // Show register screen
  if (showRegister) {
    return (
      <Register 
        onBackToLogin={handleBackToLogin}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  // Show login screen if not authenticated or showLogin is true
  if (showLogin || (!isAuthenticated && !showHomepage)) {
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onShowRegister={handleShowRegister}
        selectedPlan={selectedPlan}
      />
    );
  }

  // Role-based dashboard rendering
  if (isAuthenticated && user) {
    // Show role-specific dashboard for non-admin users
    // if (user.role === 'therapist') {
    //   return <TherapistDashboard />;
    // } else 
    if (user.role !== 'admin') {
      return <UserDashboard selectedPlan={selectedPlan} />;
    }
    
    // Show admin dashboard for admin users
    // (existing admin dashboard code continues...)
  }

  const handleAppointmentClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setCurrentView('appointment-detail');
    setActiveItem('encounters-list'); // Set to encounters section
  };

  const handleViewAllAppointments = () => {
    setActiveItem('sessions');
    setCurrentView('sessions');
  };

  // const handleViewAllTherapists = () => {
//   setActiveItem('doctors');
//   setCurrentView('doctors-list');
// };

  const handleViewEncounter = (encounterId = null) => {
    // Set the selected encounter ID and navigate to encounter details
    setSelectedEncounterId(encounterId);
    setActiveItem('encounters-list');
    setCurrentView('encounter-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedAppointmentId(null);
    setActiveItem('dashboard');
  };

  const handleBackToAppointments = () => {
    // Go back to sessions view instead of appointments-list to maintain consistency
    setCurrentView('sessions');
    setActiveItem('sessions');
    setSelectedAppointmentId(null); // Clear the selected appointment
  };

  const handleBackToAppointment = () => {
    setCurrentView('appointment-detail');
  };

  const handleBackToEncountersList = () => {
    setActiveItem('encounters-list');
    setCurrentView('encounters-list');
  };

  const handleCreateNewEncounter = (patientData = null) => {
    // Open session creation modal instead of template selector
    setIsSessionCreateModalOpen(true);
  };

  const handleCreateNewAppointment = () => {
    // Navigate directly to appointment creation
    setSelectedPatient({
      id: 'P001',
      name: 'Examinee',
      age: '12',
      gender: 'Male'
    });
    setCurrentView('session-create');
    setActiveItem('encounters-list');
  };

  const handleViewPatient = (patientId) => {
    setSelectedExamineeId(patientId);
    setCurrentView('examinee-detail');
    setActiveItem('patients');
  };

  const handleBackToPatients = () => {
    setSelectedPatientId(null);
    setSelectedExamineeId(null);
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
    console.log('Saving examinee:', updatedData);
    if (updatedData) {
      const studentName = updatedData.firstName && updatedData.lastName 
        ? `${updatedData.firstName} ${updatedData.lastName}`
        : updatedData.name || 'Examinee';
      toast.success(`Examinee ${studentName} updated successfully!`);
    } else {
      toast.success('Examinee updated successfully!');
    }
    setSelectedPatientId(null);
    setCurrentView('patients-list');
    setActiveItem('patients');
  };

  const handleCancelPatientEdit = () => {
    setCurrentView('patients-list');
    setActiveItem('patients');
  };

  const handleSaveDoctor = async (updatedData) => {
    try {
      console.log(' Creating therapist:', updatedData);
      
      // Remove client-side id and prepare data for API
      const therapistData = {
        first_name: updatedData.firstName,
        last_name: updatedData.lastName,
        email: updatedData.email,
        phone: updatedData.phone,
        specialty: updatedData.specialty,
        license_number: updatedData.licenseNumber,
        joining_date: updatedData.joiningDate,
        centre_id: 1, // Default centre, should be configurable
        status: 'active'
      };

      console.log(' Sending therapist data:', therapistData);

      const response = await api.request('/therapists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(therapistData),
      });

      const result = await response.json();
      console.log(' Therapist creation response:', result);

      if (result.success) {
        toast.success(`Therapist ${updatedData.firstName} ${updatedData.lastName} created successfully!`);
        setCurrentView('doctors-list');
        setActiveItem('doctors');
        // Refresh the doctors list
        dispatch(fetchDoctors());
      } else {
        toast.error(`Failed to create therapist: ${result.message}`);
      }
    } catch (error) {
      console.error(' Error saving therapist:', error);
      toast.error('Failed to save therapist. Please try again.');
    }
  };

const handleCancelDoctorEdit = () => {
setCurrentView('doctors-list');
setActiveItem('doctors');
};

  // Handle doctor edit (separate from create)
  const handleSaveDoctorEdit = async (updatedData) => {
    // This function is called by DoctorEditForm after successful update
    // Just handle navigation, no need for duplicate API call or toast
    setCurrentView('doctors-list');
    setActiveItem('doctors');
    // Dispatch fetchDoctors to refresh the list
    dispatch(fetchDoctors());
  };

  // Edit handlers
  const handleEditPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setCurrentView('patient-edit');
    setActiveItem('patients');
  };

  const handleEditExamineeFromDetail = (examineeId) => {
    setSelectedPatientId(examineeId);
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
    setSelectedSessionId(encounterId);
    setIsSessionEditModalOpen(true);
  };

  // Delete handlers
  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this examinee?')) {
      try {
        await dispatch(deletePatient(patientId.replace('#', '')));
        // Refresh the patients list to show updated data
        await dispatch(fetchPatients());
        toast.success('Examinee deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete examinee: ' + error.message);
      }
    }
  };

  const handleDeleteDoctor = (doctorId) => {
    if (window.confirm('Are you sure you want to delete this therapist?')) {
      toast.success(`Therapist ${doctorId} deleted successfully!`);
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

  const handleDeleteEncounter = async (encounterId) => {
    if (window.confirm('Are you sure you want to delete this programme?')) {
      try {
        // Call the delete API endpoint
        const response = await api.request(`/services/${encounterId}`, {
          method: 'DELETE'
        });
        
        if (response.success) {
          alert('Programme deleted successfully!');
          // Refresh the list by dispatching fetchServices again
          dispatch(fetchServices());
        } else {
          alert('Failed to delete programme');
        }
      } catch (error) {
        console.error('Error deleting programme:', error);
        alert('Error deleting programme');
      }
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
    setCurrentView('clinic-create');
    setActiveItem('clinics');
  };

  const handleSaveSession = (sessionData) => {
    console.log('Creating new session:', sessionData);
    alert('Session scheduled successfully!');
    setIsSessionCreateModalOpen(false);
    // Here you would typically dispatch an action to create the session
    // dispatch(createSession(sessionData));
    
    // Refresh the encounters list to show the new session
    // You might want to add this session to the Redux store
  };

  const handleSaveSessionEdit = (sessionData) => {
    console.log('Updating session:', sessionData);
    alert('Session updated successfully!');
    setIsSessionEditModalOpen(false);
    setSelectedSessionId(null);
    // Here you would typically dispatch an action to update the session
    // dispatch(updateSession(sessionData));
    
    // Refresh the encounters list to show the updated session
  };

  // Service CRUD handlers
  const handleViewService = (serviceId) => {
    // Find the service data and show details in a modal or navigate to detail view
    const service = servicesData.find(s => s.id === serviceId);
    if (service) {
      const details = `
╔════════════════════════════════════════╗
║         SERVICE DETAILS                 ║
╚════════════════════════════════════════╝

📋 NAME: ${service.name}
🏷️  CATEGORY: ${service.category}
💰 FEE: ₹${service.fee}
⏱️  DURATION: ${service.duration} minutes
📍 CENTRE: Centre ${service.centre_id}
📊 STATUS: ${service.status.toUpperCase()}
🆔 PROGRAMME ID: ${service.programme_id}

📝 DESCRIPTION:
${service.description || 'No description available'}

🎯 OBJECTIVES:
${service.objectives || 'No objectives specified'}

👥 TARGET AGE GROUP:
${service.target_age_group || 'Not specified'}

      `;
      alert(details);
    }
  };

  const handleEditService = (serviceId) => {
    setSelectedServiceId(serviceId);
    setCurrentView('service-edit');
    setActiveItem('services');
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this programme?')) {
      try {
        const response = await api.request(`/programmes/${serviceId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const result = await response.json();

        if (result.success) {
          toast.success(`Programme deleted successfully!`);
          // Refresh the services data
          const servicesResponse = await api.request('/programmes');
          const servicesResult = await servicesResponse.json();

          if (servicesResult.success) {
            // Update Redux store
            dispatch({ type: 'services/fetchServices/fulfilled', payload: servicesResult.data });
          }
        } else {
          toast.error(`Failed to delete programme: ${result.message}`);
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('An error occurred while deleting the programme. Please try again.');
      }
    }
  };

  const handleSaveService = async (serviceData) => {
    try {
      console.log('=== Saving service ===', serviceData);

      // Determine if this is a create or update operation
      const isUpdate = serviceData.id && serviceData.id !== 'undefined' && serviceData.id !== undefined;

      // Prepare data for API
      const apiData = {
        programme_id: serviceData.programme_id || serviceData.name.substring(0, 2).toUpperCase(), // Use existing programme_id or generate from name
        name: serviceData.name,
        category: serviceData.category,
        centre_id: parseInt(serviceData.centre_id || serviceData.centre),
        fee: parseFloat(serviceData.fee || serviceData.price),
        duration: parseInt(serviceData.duration),
        description: serviceData.description,
        status: serviceData.status,
        // therapist_id: serviceData.therapist_id || null
      };

      const url = isUpdate 
        ? `/programmes/${serviceData.id}`
        : '/programmes';

      const method = isUpdate ? 'PUT' : 'POST';

      const response = await api.request(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();

      if (result.success) {
        console.log('=== Service saved successfully ===');
        const action = isUpdate ? 'updated' : 'created';
        alert(`Programme "${serviceData.name}" ${action} successfully!`);

        // Refresh services data
        const servicesResponse = await api.request('/programmes');
        const servicesResult = await servicesResponse.json();

        if (servicesResult.success) {
          // Update Redux store
          dispatch({ type: 'services/fetchServices/fulfilled', payload: servicesResult.data });
        }

        setCurrentView('services-list');
        setActiveItem('services');
      } else {
        console.error('=== Save failed ===', result);
        alert('Failed to save programme. Please try again.');
      }
    } catch (error) {
      console.error('=== Save error ===', error);
      alert('An error occurred while saving the programme. Please try again.');
    }
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

    // Handle examinee create form
    if (currentView === 'patient-create') {
      return (
        <ExamineeCreateForm
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
          onSave={handleSaveDoctorEdit}
          onCancel={handleCancelDoctorEdit}
        />
      );
    }

    // Handle examinee edit form
    if (currentView === 'patient-edit') {
      return (
        <ExamineeEditForm
          studentId={selectedPatientId}
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
          onEditProfile={handleEditDoctor}
        />
      );
    }

    // Handle examinee detail view
    if (currentView === 'examinee-detail') {
      return (
        <ExamineeDetail
          examineeId={selectedExamineeId}
          onBack={handleBackToPatients}
          onEditExaminee={handleEditExamineeFromDetail}
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

    // Handle template selection (removed - using Redux now)
    if (currentView === 'template-selector') {
      // Redirect to session creation instead
      return <SessionCreateForm onSave={handleSaveSession} onCancel={() => setIsSessionCreateModalOpen(false)} />;
    }

    // Handle encounter detail view
    if (currentView === 'encounter-detail') {
      return (
        <EncounterDetail 
          encounterId={selectedEncounterId}
          onBack={handleBackToEncountersList} 
        />
      );
    }

    // Handle appointment detail view
    if (currentView === 'appointment-detail') {
      return (
        <AppointmentDetail 
          appointmentData={selectedAppointmentId}
          onBack={handleBackToAppointments}
          onViewEncounter={handleViewEncounter}
          onCreateNewEncounter={handleCreateNewEncounter}
        />
      );
    }

    // Handle main navigation items
    switch (activeItem) {
      case 'dashboard':
        return <Dashboard 
          onAppointmentClick={handleAppointmentClick} 
          onCreateNewEncounter={handleCreateNewEncounter} 
          onViewAllAppointments={handleViewAllAppointments} 
          // onViewAllTherapists={handleViewAllTherapists}
          setActiveItem={handleSetActiveItem}
        />;
      
      case 'patients':
        return <PatientsList onViewPatient={handleViewPatient} onEditPatient={handleEditPatient} onDeletePatient={handleDeletePatient} onCreateNewPatient={handleCreateNewPatient} />;
      
      case 'doctors':
        return <DoctorsList onViewDoctor={handleViewDoctor} onEditDoctor={handleEditDoctor} onDeleteDoctor={handleDeleteDoctor} onCreateNewDoctor={handleCreateNewDoctor} />;
      
      case 'receptionists':
        return <ReceptionistsList onViewReceptionist={handleViewReceptionist} onEditReceptionist={handleEditReceptionist} onDeleteReceptionist={handleDeleteReceptionist} onCreateNewReceptionist={handleCreateNewReceptionist} />;
      
      case 'services':
      case 'services-list':
        return <ServicesList onViewService={handleViewService} onEditService={handleEditService} onDeleteService={handleDeleteService} onCreateNewService={handleCreateNewService} />;
      
      case 'service-cards':
        return <ServiceCards onViewService={handleViewService} onEditService={handleEditService} onDeleteService={handleDeleteService} onCreateNewService={handleCreateNewService} />;
      
      case 'clinics':
        if (currentView === 'clinics-list' || currentView === 'dashboard') {
          return <ClinicsList onViewClinic={handleViewClinic} onEditClinic={handleEditClinic} onCreateNewClinic={handleCreateNewClinic} />;
        }
        return <ClinicsList onViewClinic={handleViewClinic} onEditClinic={handleEditClinic} onCreateNewClinic={handleCreateNewClinic} />;
      
      case 'encounters-list':
        if (currentView === 'appointments-list') {
          return <AppointmentsList onViewAppointment={handleAppointmentClick} onEditAppointment={handleEditAppointment} onDeleteAppointment={handleDeleteAppointment} onCreateNewAppointment={handleCreateNewAppointment} />;
        }
        // Show PlansList for sessions
        return <PlansList />;
      
      case 'sessions':
        return <PlansList />;
      
      case 'clinic-revenue':
        return <ClinicRevenue />;
      
      case 'doctor-revenue':
        return <DoctorRevenue />;
      
      case 'taxes':
        return <TaxList onViewTax={(id) => alert(`View tax ${id}`)} onEditTax={(id) => alert(`Edit tax ${id}`)} onDeleteTax={(id) => alert(`Delete tax ${id}`)} onCreateNewTax={() => alert('Create new tax functionality')} />;
      
      case 'billing-records':
        return <BillingRecords onViewBilling={(id) => alert(`View billing ${id}`)} onEditBilling={(id) => alert(`Edit billing ${id}`)} onDeleteBilling={(id) => alert(`Delete billing ${id}`)} onCreateNewBilling={() => alert('Create new billing functionality')} />;
      
      case 'admin-sessions':
        return <AdminSessionsList />;
      
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
    <ErrorBoundary>
      <SidebarContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed }}>
        <div className="min-h-screen bg-gray-50">
          <Sidebar 
            activeItem={activeItem} 
            setActiveItem={handleSetActiveItem} 
            shouldExpandEncounters={activeItem === 'encounters-list'}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
          />
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          setIsOpen={setIsMobileMenuOpen}
          activeItem={activeItem} 
          setActiveItem={handleSetActiveItem} 
        />
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          onBackClick={handleBackNavigation}
          showBackButton={shouldShowBackButton}
        />
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="transition-all duration-300"
        >
          {renderContent()}
        </motion.main>

        {/* Session Create Modal */}
        {isSessionCreateModalOpen && (
          <SessionCreateForm
            isOpen={isSessionCreateModalOpen}
            onClose={() => setIsSessionCreateModalOpen(false)}
            onSave={handleSaveSession}
          />
        )}

        {/* Session Edit Modal */}
        {isSessionEditModalOpen && (
          <SessionEditForm
            isOpen={isSessionEditModalOpen}
            onClose={() => {
              setIsSessionEditModalOpen(false);
              setSelectedSessionId(null);
            }}
            onSave={handleSaveSessionEdit}
            sessionId={selectedSessionId}
          />
        )}

        {/* Error Toasts */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {errors.map((error) => (
            <ErrorToast
              key={error.id}
              message={error.message}
              type="error"
              details={error.details}
              errorId={error.id}
              onClose={() => removeError(error.id)}
            />
          ))}
        </div>

        {/* React Hot Toast */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </SidebarContext.Provider>
  </ErrorBoundary>
  );
}

export default App;
