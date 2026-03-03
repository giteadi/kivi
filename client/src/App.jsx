import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MobileMenu from './components/MobileMenu';

function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
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
        {activeItem === 'dashboard' && <Dashboard />}
        {activeItem !== 'dashboard' && (
          <div className="lg:ml-64 p-4 lg:p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border text-center"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 capitalize">
                {activeItem}
              </h2>
              <p className="text-gray-600">
                This section is under development
              </p>
            </motion.div>
          </div>
        )}
      </motion.main>
    </div>
  );
}

export default App;
