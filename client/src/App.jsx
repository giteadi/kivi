import { useState, useEffect, createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { setCredentials } from './store/slices/authSlice';
import { fetchDoctors } from './store/slices/doctorSlice';
import { fetchServices } from './store/slices/serviceSlice';
import { fetchPatients } from './store/slices/patientSlice';
import { fetchAppointments } from './store/slices/appointmentSlice';
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
import EncounterTemplates from './components/EncounterTemplates';
import TemplateBuilder from './components/TemplateBuilder';
import TemplateViewer from './components/TemplateViewer';
import TemplateSelector from './components/TemplateSelector';
import TemplateBasedEncounter from './components/TemplateBasedEncounter';
import MobileMenu from './components/MobileMenu';
import GroupAdministration from './components/GroupAdministration';
import Report from './components/Report';
import ExamineeGroupReport from './components/ExamineeGroupReport';
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
import TemplateManager from './components/TemplateManager';
import FormsManagement from './components/FormsManagement';
import ConnersManagement from './components/ConnersManagement';
import ExamineesManagement from './components/ExamineesManagement';
import AssessmentList from './components/AssessmentList';
import TherapyList from './components/TherapyList';
import Queries from './components/Queries';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import CenterVisibilitySettings from './components/CenterVisibilitySettings';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const { services: servicesData } = useSelector((state) => state.services);
  const { errors, removeError, handleApiError } = useErrorHandler();
  
  // All useState hooks at the top level
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showHomepage, setShowHomepage] = useState(true); // Show homepage by default
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
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
  
  // React Router hooks
  const location = useLocation();
  const navigate = useNavigate();
  
  // Sync activeItem with URL path
  useEffect(() => {
    const pathToItem = {
      '/dashboard': 'dashboard',
      '/examinees': 'patients',
      '/therapists': 'doctors',
      '/templates': 'template-manager',
      '/centres': 'clinics',
      '/centres/revenue': 'clinic-revenue',
      '/taxes': 'taxes',
      '/billing': 'billing-records',
      '/admin/queries': 'queries',
      '/admin/center-visibility': 'center-visibility',
      '/groups': 'groups',
      '/reports': 'report',
      '/plans': 'plans',
      '/encounters/assessments': 'assessment-list',
      '/encounters/therapies': 'therapy-list',
      '/encounters': 'encounters-list',
      '/staff': 'receptionists',
      '/services': 'services',
      '/profile': 'profile',
      '/admin/sessions': 'admin-sessions',
    };
    // Note: Detail routes like /examinees/:id, /therapists/:id, etc. 
    // will match their parent routes above and highlight correctly
    
    const path = location.pathname;
    // Find matching route (exact match or parent route)
    for (const [route, itemId] of Object.entries(pathToItem)) {
      if (path === route || path.startsWith(route + '/')) {
        if (activeItem !== itemId) {
          setActiveItem(itemId);
        }
        break;
      }
    }
  }, [location.pathname]);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-[#1c1c1e] dark:to-[#0f0f10] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <img
              src="https://res.cloudinary.com/bazeercloud/image/upload/v1765087953/Gemini_Generated_Image_o8ciwko8ciwko8ci-removebg-preview_l4nnui.png"
              alt="MindSaid Learning Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading MindSaid Learning...</p>
        </div>
      </div>
    );
  }

  // Handle back button navigation
  const handleBackNavigation = () => {
    if (navigationHistory.length > 1) {
      // Remove current page from history
      const newHistory = [...navigationHistory];
      newHistory.pop();
      
      // Get the previous page
      const previousPage = newHistory[newHistory.length - 1];
      
      setNavigationHistory(newHistory);
      setActiveItem(previousPage);
      setCurrentView(previousPage);
      // Clear all selected states when navigating back
      setSelectedAppointmentId(null);
      setSelectedPatientId(null);
      setSelectedDoctorId(null);
      setSelectedReceptionistId(null);
      setSelectedClinicId(null);
      setSelectedTemplate(null);
      setSelectedEncounterId(null);
      setSelectedExamineeId(null);
    } else {
      // If no history, go to dashboard
      setActiveItem('dashboard');
      setCurrentView('dashboard');
      setNavigationHistory(['dashboard']);
      // Clear all selected states
      setSelectedAppointmentId(null);
      setSelectedPatientId(null);
      setSelectedDoctorId(null);
      setSelectedReceptionistId(null);
      setSelectedClinicId(null);
      setSelectedTemplate(null);
      setSelectedEncounterId(null);
      setSelectedExamineeId(null);
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
    // Map item to route and navigate
    const itemToRoute = {
      'dashboard': '/dashboard',
      'patients': '/examinees',
      'doctors': '/therapists',
      'template-manager': '/templates',
      'clinics': '/centres',
      'clinic-revenue': '/centres/revenue',
      'taxes': '/taxes',
      'billing-records': '/billing',
      'queries': '/admin/queries',
      'center-visibility': '/admin/center-visibility',
      'groups': '/groups',
      'report': '/reports',
      'plans': '/plans',
      'encounters-list': '/encounters',
      'receptionists': '/staff',
      'services': '/services',
      'profile': '/profile',
      'admin-sessions': '/admin/sessions',
    };
    
    const route = itemToRoute[item];
    if (route && location.pathname !== route) {
      navigate(route);
    }
    
    setActiveItem(item);
    // Always reset currentView to match the active item for smooth navigation
    setCurrentView(item);
    // Clear all selected states when navigating to avoid confusion
    setSelectedAppointmentId(null);
    setSelectedPatientId(null);
    setSelectedDoctorId(null);
    setSelectedReceptionistId(null);
    setSelectedClinicId(null);
    setSelectedTemplate(null);
    setSelectedEncounterId(null);
    setSelectedExamineeId(null);
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

  const handleShowPrivacyPolicy = () => {
    setShowHomepage(false);
    setShowPrivacyPolicy(true);
    setShowTermsOfService(false);
  };

  const handleShowTermsOfService = () => {
    setShowHomepage(false);
    setShowTermsOfService(true);
    setShowPrivacyPolicy(false);
  };

  const handleBackToHome = () => {
    setShowHomepage(true);
    setShowPrivacyPolicy(false);
    setShowTermsOfService(false);
    setShowLogin(false);
    setShowRegister(false);
  };

  // Show Privacy Policy
  if (showPrivacyPolicy) {
    return <PrivacyPolicy />;
  }

  // Show Terms of Service
  if (showTermsOfService) {
    return <TermsOfService />;
  }

  // Show homepage first for non-authenticated users
  if (!isAuthenticated && showHomepage && !showLogin && !showRegister) {
    return (
      <Homepage 
        onSelectPlan={handleSelectPlan}
        onShowLogin={handleShowLogin}
        onShowPrivacyPolicy={handleShowPrivacyPolicy}
        onShowTermsOfService={handleShowTermsOfService}
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
    navigate(`/encounters/appointments/${appointmentId}`);
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
    if (encounterId) {
      navigate(`/encounters/${encounterId}/detail`);
    }
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

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setCurrentView('template-builder');
    navigate('/templates/create');
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setCurrentView('template-builder');
    navigate(`/templates/${template.id}/edit`);
  };

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template);
    setCurrentView('template-viewer');
    navigate(`/templates/${template.id}`);
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
    // Open session creation modal instead of template selector
    setIsSessionCreateModalOpen(true);
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
    setSelectedExamineeId(patientId);
    setCurrentView('examinee-detail');
    setActiveItem('patients');
    // Navigate to detail URL
    navigate(`/examinees/${patientId}`);
  };

  const handleBackToPatients = () => {
    setSelectedPatientId(null);
    setSelectedExamineeId(null);
    setCurrentView('patients-list');
    setActiveItem('patients');
    navigate('/examinees');
  };

  const handleViewDoctor = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setCurrentView('doctor-profile');
    setActiveItem('doctors');
    navigate(`/therapists/${doctorId}`);
  };

  const handleBackToDoctors = () => {
    setSelectedDoctorId(null);
    setCurrentView('doctors-list');
    setActiveItem('doctors');
    navigate('/therapists');
  };

  const handleViewReceptionist = (receptionistId) => {
    setSelectedReceptionistId(receptionistId);
    setCurrentView('receptionist-profile');
    setActiveItem('receptionists');
    navigate(`/staff/${receptionistId}`);
  };

  const handleBackToReceptionists = () => {
    setSelectedReceptionistId(null);
    setCurrentView('receptionists-list');
    setActiveItem('receptionists');
    navigate('/staff');
  };

  const handleViewClinic = (clinicId) => {
    setSelectedClinicId(clinicId);
    setCurrentView('clinic-profile');
    setActiveItem('clinics');
    navigate(`/centres/${clinicId}`);
  };

  const handleBackToClinics = () => {
    setSelectedClinicId(null);
    setCurrentView('clinics-list');
    setActiveItem('clinics');
    navigate('/centres');
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
  const handleDeletePatient = async (patientIds) => {
    const ids = Array.isArray(patientIds) ? patientIds : [patientIds];
    
    if (ids.length === 0) {
      toast.error('No examinees selected for deletion');
      return;
    }
    
    const confirmMessage = ids.length === 1 
      ? 'Are you sure you want to delete this examinee?' 
      : `Are you sure you want to delete ${ids.length} examinees?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        console.log('🗑️ Deleting students:', ids);
        
        // Delete each student
        const results = await Promise.all(
          ids.map(id => 
            api.request(`/students/${id}`, {
              method: 'DELETE'
            })
          )
        );
        
        const allSuccessful = results.every(r => r.success);
        
        if (allSuccessful) {
          toast.success(ids.length === 1 ? 'Examinee deleted successfully!' : `${ids.length} examinees deleted successfully!`);
          // Refresh the students list
          dispatch(fetchPatients());
        } else {
          toast.error('Some deletions failed. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting examinee(s):', error);
        toast.error('Failed to delete examinee(s). Please try again.');
      }
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this therapist?')) {
      try {
        const response = await api.request(`/therapists/${doctorId}`, {
          method: 'DELETE'
        });
        
        if (response.success) {
          toast.success('Therapist deleted successfully!');
          dispatch(fetchDoctors());
        } else {
          toast.error('Failed to delete therapist');
        }
      } catch (error) {
        console.error('Error deleting therapist:', error);
        toast.error('Failed to delete therapist. Please try again.');
      }
    }
  };

  const handleDeleteReceptionist = async (receptionistId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const response = await api.request(`/receptionists/${receptionistId}`, {
          method: 'DELETE'
        });
        
        if (response.success) {
          toast.success('Staff member deleted successfully!');
          // Refresh the page to update the list (no Redux slice for receptionists)
          window.location.reload();
        } else {
          toast.error('Failed to delete staff member');
        }
      } catch (error) {
        console.error('Error deleting staff member:', error);
        toast.error('Failed to delete staff member. Please try again.');
      }
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        const response = await api.request(`/appointments/${appointmentId}`, {
          method: 'DELETE'
        });
        
        if (response.success) {
          toast.success('Session deleted successfully!');
          // Refresh the list
          dispatch(fetchAppointments());
        } else {
          toast.error('Failed to delete session');
        }
      } catch (error) {
        console.error('Error deleting session:', error);
        toast.error('Failed to delete session. Please try again.');
      }
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
    alert('Create new centre functionality - Form coming soon');
  };

  const handleCreateNewAppointment = () => {
    // Navigate to template selector for appointment-based session creation
    setSelectedPatient({
      id: 'P001',
      name: 'Examinee',
      age: '12',
      gender: 'Male'
    });
    setCurrentView('template-selector');
    setActiveItem('encounters-list');
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
        return <ExamineesManagement onViewPatient={handleViewPatient} onEditPatient={handleEditPatient} onDeletePatient={handleDeletePatient} onCreateNewPatient={handleCreateNewPatient} />;
      
      case 'groups':
        return <GroupAdministration />;
      
      case 'report':
        return <Report />;
      
      case 'examinee-group-report':
        return <ExamineeGroupReport />;
      
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
        // Show PlansList for Sessions List
        return <PlansList />;
      
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
      
      case 'sessions':
        return <PlansList />;

      case 'assessment-list':
        return <AssessmentList />;
      
      case 'therapy-list':
        return <TherapyList />;
      
      case 'template-manager':
        return <TemplateManager />;
      
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
      
      case 'queries':
        return <Queries />;
      
      case 'center-visibility':
        return <CenterVisibilitySettings />;
      
      default:
        // Other menu items
        return (
          <div className="lg:ml-64 p-4 lg:p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#1c1c1e] rounded-xl p-6 lg:p-8 shadow-sm border dark:border-gray-800 text-center transition-colors duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 capitalize">
                {activeItem.replace('-', ' ')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
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
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f10] transition-colors duration-300">
          {/* Hide outer sidebar when TemplateManager is active */}
          {activeItem !== 'template-manager' && (
            <Sidebar 
              activeItem={activeItem} 
              setActiveItem={handleSetActiveItem} 
              shouldExpandEncounters={activeItem === 'encounters-list' || activeItem === 'encounter-templates'}
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
            />
          )}
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
          className={`transition-all duration-300 ${activeItem === 'template-manager' ? 'ml-0' : ''}`}
        >
          <Routes>
            <Route path="/dashboard" element={
              currentView === 'dashboard' ? (
                <Dashboard 
                  onAppointmentClick={handleAppointmentClick} 
                  onCreateNewEncounter={handleCreateNewEncounter} 
                  onViewAllAppointments={handleViewAllAppointments} 
                  setActiveItem={handleSetActiveItem}
                />
              ) : renderContent()
            } />
            <Route path="/examinees" element={
              currentView === 'patients' || currentView === 'patients-list' ? (
                <ExamineesManagement 
                  onViewPatient={handleViewPatient} 
                  onEditPatient={handleEditPatient} 
                  onDeletePatient={handleDeletePatient} 
                  onCreateNewPatient={handleCreateNewPatient} 
                />
              ) : renderContent()
            } />
            <Route path="/examinees/:id" element={renderContent()} />
            <Route path="/examinees/create" element={renderContent()} />
            <Route path="/examinees/:id/edit" element={renderContent()} />
            <Route path="/therapists" element={
              currentView === 'doctors' || currentView === 'doctors-list' ? (
                <DoctorsList 
                  onViewDoctor={handleViewDoctor} 
                  onEditDoctor={handleEditDoctor} 
                  onDeleteDoctor={handleDeleteDoctor} 
                  onCreateNewDoctor={handleCreateNewDoctor} 
                />
              ) : renderContent()
            } />
            <Route path="/therapists/:id" element={renderContent()} />
            <Route path="/therapists/create" element={renderContent()} />
            <Route path="/therapists/:id/edit" element={renderContent()} />
            <Route path="/templates" element={<TemplateManager />} />
            <Route path="/templates/create" element={renderContent()} />
            <Route path="/templates/:id" element={renderContent()} />
            <Route path="/templates/:id/edit" element={renderContent()} />
            <Route path="/forms" element={<FormsManagement />} />
            <Route path="/conners" element={<ConnersManagement />} />
            <Route path="/centres" element={
              currentView === 'clinics' || currentView === 'clinics-list' ? (
                <ClinicsList 
                  onViewClinic={handleViewClinic} 
                  onEditClinic={handleEditClinic} 
                  onCreateNewClinic={handleCreateNewClinic} 
                />
              ) : renderContent()
            } />
            <Route path="/centres/:id" element={renderContent()} />
            <Route path="/centres/:id/edit" element={renderContent()} />
            <Route path="/centres/create" element={renderContent()} />
            <Route path="/centres/revenue" element={<ClinicRevenue />} />
            <Route path="/taxes" element={<TaxList />} />
            <Route path="/billing" element={<BillingRecords />} />
            <Route path="/admin/queries" element={<Queries />} />
            <Route path="/admin/center-visibility" element={<CenterVisibilitySettings />} />
            <Route path="/groups" element={<GroupAdministration />} />
            <Route path="/reports" element={<Report />} />
            <Route path="/plans" element={<PlansList />} />
            <Route path="/encounters" element={renderContent()} />
            <Route path="/encounters/appointments/:id" element={renderContent()} />
            <Route path="/encounters/:id/detail" element={renderContent()} />
            <Route path="/encounters/*" element={renderContent()} />
            <Route path="/staff" element={<ReceptionistsList />} />
            <Route path="/staff/:id" element={renderContent()} />
            <Route path="/staff/:id/edit" element={renderContent()} />
            <Route path="/services" element={<ServicesList />} />
            <Route path="/services/:id" element={renderContent()} />
            <Route path="/services/:id/edit" element={renderContent()} />
            <Route path="/services/create" element={renderContent()} />
            <Route path="/profile" element={<UserDashboard />} />
            <Route path="/admin/sessions" element={<AdminSessionsList />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
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
