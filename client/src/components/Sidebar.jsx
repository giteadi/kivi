import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiCalendar, 
  FiUsers, 
  FiUser, 
  FiUserCheck, 
  FiMapPin,
  FiChevronDown,
  FiChevronRight,
  FiList,
  FiFileText,
  FiDollarSign,
  FiPercent,
  FiCreditCard,
  FiTrendingUp,
  FiActivity
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
    { 
      id: 'encounters', 
      label: 'Sessions', 
      icon: FiUsers, 
      section: 'MAIN',
      hasSubmenu: true,
      submenu: [
        { id: 'encounters-list', label: 'Sessions List', icon: FiList },
        { id: 'encounter-templates', label: 'Session Templates', icon: FiFileText }
      ]
    },
    { id: 'services', label: 'Programs', icon: FiActivity, section: 'MAIN' },
    { id: 'patients', label: 'Students', icon: FiUser, section: 'USERS' },
    { id: 'doctors', label: 'Therapists', icon: FiUserCheck, section: 'USERS' },
    { id: 'receptionists', label: 'Staff', icon: FiUser, section: 'USERS' },
    { id: 'clinics', label: 'Centres', icon: FiMapPin, section: 'CENTRE' },
    { id: 'clinic-revenue', label: 'Centre Revenue', icon: FiTrendingUp, section: 'FINANCIAL' },
    { id: 'doctor-revenue', label: 'Therapist Revenue', icon: FiDollarSign, section: 'FINANCIAL' },
    { id: 'taxes', label: 'Taxes', icon: FiPercent, section: 'FINANCIAL' },
    { id: 'billing-records', label: 'Billing Records', icon: FiCreditCard, section: 'FINANCIAL' },
  ];

  const sections = ['MAIN', 'USERS', 'CENTRE', 'FINANCIAL'];

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
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src="https://res.cloudinary.com/bazeercloud/image/upload/v1765087953/Gemini_Generated_Image_o8ciwko8ciwko8ci-removebg-preview_l4nnui.png" 
              alt="MindSaid Learning Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-semibold text-gray-800">MindSaid Learning</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-4">
        {sections.map((section) => (
          <div key={section} className="mb-4">
            <div className="px-6 mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section}
              </span>
            </div>
            <div className="space-y-1">
            {menuItems
              .filter(item => item.section === section)
              .map((item) => (
                <div key={item.id}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => handleItemClick(item.id, item.hasSubmenu)}
                    className={`w-full flex items-center justify-between px-6 py-2.5 text-left transition-colors ${
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
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Sidebar;