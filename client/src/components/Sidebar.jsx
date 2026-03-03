import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiCalendar, 
  FiUsers, 
  FiUser, 
  FiUserCheck, 
  FiSettings,
  FiMapPin,
  FiChevronDown,
  FiChevronRight,
  FiList,
  FiFileText
} from 'react-icons/fi';
import { useState, useEffect } from 'react';

const Sidebar = ({ activeItem, setActiveItem, shouldExpandEncounters }) => {
  const [expandedSections, setExpandedSections] = useState({});

  // Auto-expand encounters section when needed
  useEffect(() => {
    if (shouldExpandEncounters) {
      setExpandedSections(prev => ({
        ...prev,
        encounters: true
      }));
    }
  }, [shouldExpandEncounters]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome, section: 'MAIN' },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar, section: 'MAIN' },
    { 
      id: 'encounters', 
      label: 'Encounters', 
      icon: FiUsers, 
      section: 'MAIN',
      hasSubmenu: true,
      submenu: [
        { id: 'encounters-list', label: 'Encounters List', icon: FiList },
        { id: 'encounter-templates', label: 'Encounter Templates', icon: FiFileText }
      ]
    },
    { id: 'patients', label: 'Patients', icon: FiUser, section: 'USERS' },
    { id: 'doctors', label: 'Doctors', icon: FiUserCheck, section: 'USERS' },
    { id: 'receptionists', label: 'Receptionists', icon: FiUser, section: 'USERS' },
    { id: 'clinics', label: 'Clinics', icon: FiMapPin, section: 'CLINIC' },
  ];

  const sections = ['MAIN', 'USERS', 'CLINIC'];

  const toggleSection = (itemId) => {
    setExpandedSections(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleItemClick = (itemId, hasSubmenu = false) => {
    if (hasSubmenu) {
      toggleSection(itemId);
    } else {
      setActiveItem(itemId);
    }
  };

  const isActiveItem = (itemId) => {
    if (itemId === 'encounters') {
      return activeItem === 'encounters-list' || activeItem === 'encounter-templates';
    }
    return activeItem === itemId;
  };

  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="hidden lg:block w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10 overflow-y-auto"
    >
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">KiviCare</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-4">
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
                <div key={item.id}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => handleItemClick(item.id, item.hasSubmenu)}
                    className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors ${
                      isActiveItem(item.id)
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.hasSubmenu && (
                      <motion.div
                        animate={{ rotate: expandedSections[item.id] ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Submenu */}
                  <AnimatePresence>
                    {item.hasSubmenu && expandedSections[item.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {item.submenu.map((subItem) => (
                          <motion.button
                            key={subItem.id}
                            whileHover={{ x: 4 }}
                            onClick={() => setActiveItem(subItem.id)}
                            className={`w-full flex items-center px-12 py-2 text-left transition-colors ${
                              activeItem === subItem.id
                                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <subItem.icon className="w-4 h-4 mr-3" />
                            <span className="font-medium text-sm">{subItem.label}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="absolute bottom-4 left-0 right-0 px-6">
        <motion.button
          whileHover={{ x: 4 }}
          className="w-full flex items-center px-3 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <FiSettings className="w-5 h-5 mr-3" />
          <span className="font-medium">Settings</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;