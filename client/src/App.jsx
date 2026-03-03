import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AppointmentDetail from './components/AppointmentDetail';
import EncounterDetail from './components/EncounterDetail';
import EncountersList from './components/EncountersList';
import EncounterTemplates from './components/EncounterTemplates';
import MobileMenu from './components/MobileMenu';

function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'appointment-detail', 'encounter-detail'
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const handleAppointmentClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setCurrentView('appointment-detail');
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

  const handleBackToAppointment = () => {
    setCurrentView('appointment-detail');
  };

  const handleBackToEncountersList = () => {
    setActiveItem('encounters-list');
    setCurrentView('encounters-list');
  };

  const renderContent = () => {
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
          onBack={handleBackToDashboard}
          onViewEncounter={handleViewEncounter}
        />
      );
    }

    // Handle main navigation items
    switch (activeItem) {
      case 'dashboard':
        return <Dashboard onAppointmentClick={handleAppointmentClick} />;
      
      case 'encounters-list':
        if (currentView === 'encounters-list') {
          return <EncountersList onViewEncounter={handleViewEncounter} />;
        }
        // If we're in encounter-detail view but encounters-list is active, show encounter detail
        return <EncounterDetail onBack={handleBackToEncountersList} />;
      
      case 'encounter-templates':
        return <EncounterTemplates />;
      
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
