import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronRight } from 'react-icons/fi';
import { 
  FiHome, 
  FiCalendar, 
  FiUsers, 
  FiUser, 
  FiUserCheck, 
  FiMapPin,
  FiList,
  FiFileText,
  FiDollarSign,
  FiPercent,
  FiCreditCard,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';
import { useState } from 'react';

const MobileMenu = ({ isOpen, setIsOpen, activeItem, setActiveItem }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome, section: 'MAIN' },
    { 
      id: 'encounters', 
      label: 'Assessments', 
      icon: FiUsers, 
      section: 'MAIN',
      hasSubmenu: true,
      submenu: [
        { id: 'encounters-list', label: 'Assessment List', icon: FiList },
        { id: 'encounter-templates', label: 'Assessment Templates', icon: FiFileText }
      ]
    },
    { 
      id: 'services', 
      label: 'Programs', 
      icon: FiActivity, 
      section: 'MAIN',
      hasSubmenu: true,
      submenu: [
        { id: 'services-list', label: 'Program List', icon: FiList },
        { id: 'service-cards', label: 'Program Cards', icon: FiActivity }
      ]
    },
    { id: 'patients', label: 'Examinees', icon: FiUser, section: 'USERS' },
    { id: 'doctors', label: 'Therapists', icon: FiUserCheck, section: 'USERS' },
    // { id: 'receptionists', label: 'Staff', icon: FiUser, section: 'USERS' }, // Temporarily disabled
    { id: 'clinics', label: 'Centres', icon: FiMapPin, section: 'CENTRE' },
    { id: 'clinic-revenue', label: 'Centre Revenue', icon: FiTrendingUp, section: 'FINANCIAL' },
    // { id: 'doctor-revenue', label: 'Therapist Revenue', icon: FiDollarSign, section: 'FINANCIAL' }, // Temporarily disabled
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
      setIsOpen(false);
    }
  };

  const isActiveItem = (itemId) => {
    if (itemId === 'encounters') {
      return activeItem === 'encounters-list' || activeItem === 'encounter-templates';
    }
    if (itemId === 'services') {
      return activeItem === 'services-list' || activeItem === 'service-cards';
    }
    return activeItem === itemId;
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
            className="fixed left-0 top-0 w-80 h-full bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-semibold text-gray-800">MindSaid Learning</span>
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
                          whileTap={{ scale: 0.95 }}
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
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleItemClick(subItem.id)}
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
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;