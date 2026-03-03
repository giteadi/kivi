import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { 
  FiHome, 
  FiCalendar, 
  FiUsers, 
  FiUser, 
  FiUserCheck, 
  FiSettings,
  FiMapPin
} from 'react-icons/fi';

const MobileMenu = ({ isOpen, setIsOpen, activeItem, setActiveItem }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome, section: 'MAIN' },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar, section: 'MAIN' },
    { id: 'encounters', label: 'Encounters', icon: FiUsers, section: 'MAIN' },
    { id: 'patients', label: 'Patients', icon: FiUser, section: 'USERS' },
    { id: 'doctors', label: 'Doctors', icon: FiUserCheck, section: 'USERS' },
    { id: 'receptionists', label: 'Receptionists', icon: FiUser, section: 'USERS' },
    { id: 'clinics', label: 'Clinics', icon: FiMapPin, section: 'CLINIC' },
  ];

  const sections = ['MAIN', 'USERS', 'CLINIC'];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />
          
          {/* Mobile Menu */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 w-80 h-full bg-white shadow-xl z-50 lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <span className="text-xl font-semibold text-gray-800">KiviCare</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="py-4 overflow-y-auto h-full pb-20">
              {sections.map((section) => (
                <div key={section} className="mb-6">
                  <div className="px-6 mb-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {section}
                    </span>
                  </div>
                  {menuItems
                    .filter(item => item.section === section)
                    .map((item) => (
                      <motion.button
                        key={item.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                          activeItem === item.id
                            ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </motion.button>
                    ))}
                </div>
              ))}
              
              {/* Settings */}
              <div className="px-6 mt-8">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center px-3 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FiSettings className="w-5 h-5 mr-3" />
                  <span className="font-medium">Settings</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;