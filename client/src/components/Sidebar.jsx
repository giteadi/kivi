import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
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
  FiActivity,
  FiMenu,
  FiX,
  FiMessageSquare,
  FiShield,
  FiUpload
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Route mapping for navigation
const routeMapping = {
  'dashboard': '/dashboard',
  'sessions': '/sessions',
  'encounters': '/encounters',
  'encounters-list': '/encounters/list',
  'encounter-templates': '/encounters/templates',
  'assessment-list': '/encounters/assessments',
  'therapy-list': '/encounters/therapies',
  'patients': '/examinees',
  'doctors': '/therapists',
  'template-manager': '/templates',
  'forms': '/forms',
  'clinics': '/centres',
  'clinic-revenue': '/centres/revenue',
  'taxes': '/taxes',
  'billing-records': '/billing',
  'queries': '/admin/queries',
  'center-visibility': '/admin/center-visibility',
  'groups': '/groups',
  'report': '/reports',
  'plans': '/plans',
  'receptionists': '/staff',
  'services': '/services',
  'profile': '/profile',
  'user-dashboard': '/user/dashboard',
  'appointments': '/appointments',
  'my-therapist': '/my-therapist',
  'payments': '/payments',
  'admin-sessions': '/admin/sessions',
  'service-create': '/services/create',
  'service-edit': '/services/:id/edit',
  'clinic-create': '/centres/create',
  'clinic-edit': '/centres/:id/edit',
  'doctor-create': '/therapists/create',
  'doctor-edit': '/therapists/:id/edit',
  'receptionist-edit': '/staff/:id/edit',
  'patient-create': '/examinees/create',
  'patient-edit': '/examinees/:id/edit'
};

const Sidebar = ({ activeItem, setActiveItem, shouldExpandEncounters, sidebarCollapsed, setSidebarCollapsed }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Get current route from URL
  const getCurrentRoute = () => {
    const path = location.pathname;
    // Find the key that matches the current path
    for (const [key, route] of Object.entries(routeMapping)) {
      if (path === route || path.startsWith(route + '/')) {
        return key;
      }
    }
    return activeItem;
  };

  // Auto-expand encounters section when needed
  useEffect(() => {
    if (shouldExpandEncounters) {
      setExpandedSections(prev => ({
        ...prev,
        encounters: true
      }));
    }
  }, [shouldExpandEncounters]);

  // Define menu items based on user role
  const getMenuItems = () => {
    const adminMenuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: FiHome, section: 'MAIN' },
      /* { 
        id: 'encounters', 
        label: 'Sessions', 
        icon: FiUsers, 
        section: 'MAIN',
        hasSubmenu: true,
        submenu: [
          { id: 'assessment-list', label: 'Assessment List', icon: FiFileText },
          { id: 'therapy-list', label: 'Therapy List', icon: FiActivity }
        ]
      }, */
      { id: 'patients', label: 'Examinees', icon: FiUser, section: 'USERS' },
    { id: 'doctors', label: 'Therapists', icon: FiUserCheck, section: 'USERS' },
    { id: 'template-manager', label: 'Assessment Templates', icon: FiFileText, section: 'USERS' },
    { id: 'forms', label: 'Forms', icon: FiUpload, section: 'USERS' },
    // { id: 'receptionists', label: 'Staff', icon: FiUser, section: 'USERS' }, // Temporarily disabled for future use
    { id: 'clinics', label: 'Centres', icon: FiMapPin, section: 'CENTRE' },
    { id: 'clinic-revenue', label: 'Centre Revenue', icon: FiTrendingUp, section: 'FINANCIAL' },
    // { id: 'doctor-revenue', label: 'Therapist Revenue', icon: FiDollarSign, section: 'FINANCIAL' }, // Temporarily disabled 
    { id: 'taxes', label: 'Taxes', icon: FiPercent, section: 'FINANCIAL' },
    { id: 'billing-records', label: 'Billing Records', icon: FiCreditCard, section: 'FINANCIAL' },
    { id: 'queries', label: 'Queries', icon: FiMessageSquare, section: 'ADMIN' },
    { id: 'center-visibility', label: 'Center Visibility', icon: FiShield, section: 'ADMIN' },
  ];

  const therapistMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome, section: 'MAIN' },
    /* { 
      id: 'encounters', 
      label: 'Sessions', 
      icon: FiUsers, 
      section: 'MAIN',
      hasSubmenu: true,
      submenu: [
        { id: 'assessment-list', label: 'Assessment List', icon: FiFileText },
        { id: 'therapy-list', label: 'Therapy List', icon: FiActivity }
      ]
    }, */
    { id: 'patients', label: 'Examinees', icon: FiUser, section: 'USERS' },
    { id: 'profile', label: 'My Profile', icon: FiUser, section: 'USERS' },
  ];

  // Return menu items based on user role
  switch (user?.role) {
    case 'admin':
      return adminMenuItems;
    case 'therapist':
      return therapistMenuItems;
    default:
      // For parents and other users, return minimal menu
      return [
        { id: 'dashboard', label: 'Dashboard', icon: FiHome, section: 'MAIN' },
      ];
  }
};

  const menuItems = getMenuItems();
  const sections = ['MAIN', 'USERS', 'CENTRE', 'FINANCIAL', 'ADMIN'];

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
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 256 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
      className="hidden lg:block bg-white dark:bg-[#1c1c1e] shadow-lg dark:shadow-black/20 h-screen fixed left-0 top-0 z-10 overflow-y-auto will-change-[width] transition-colors duration-300"
    >
      {/* Logo */}
      <div className="p-6 border-b dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'hidden' : ''}`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src="https://res.cloudinary.com/bazeercloud/image/upload/q_auto/f_auto/v1775895427/ChatGPT_Image_Apr_11_2026_01_45_49_PM_trwcph.png"
                alt="Centrix Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">Centrix</span>
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2c2c2e] transition-colors dark:text-gray-300"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <FiMenu className="w-5 h-5" /> : <FiX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-4">
        {sections.map((section) => (
          <div key={section} className="mb-4">
            <div className={`${sidebarCollapsed ? 'px-2' : 'px-6'} mb-2`}>
              <span className={`text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider ${
                sidebarCollapsed ? 'hidden' : ''
              }`}>
                {section}
              </span>
            </div>
            <div className="space-y-1">
            {menuItems
              .filter(item => item.section === section)
              .map((item) => (
                <div key={item.id}>
                  <Link
                    to={routeMapping[item.id] || `/`}
                    onClick={(e) => {
                      if (item.hasSubmenu) {
                        e.preventDefault();
                        handleItemClick(item.id, true);
                      } else {
                        setActiveItem(item.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between ${
                      sidebarCollapsed ? 'px-2' : 'px-6'
                    } py-2.5 text-left duration-150 ease-out transition-colors ${
                      isActiveItem(item.id)
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2c2c2e]'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className={`font-medium ${sidebarCollapsed ? 'hidden' : ''}`}>{item.label}</span>
                    </div>
                    {item.hasSubmenu && !sidebarCollapsed && (
                      <motion.div
                        animate={{ rotate: expandedSections[item.id] ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSection(item.id);
                        }}
                      >
                        <FiChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </Link>

                  {/* Submenu */}
                  <AnimatePresence initial={false}>
                    {item.hasSubmenu && expandedSections[item.id] && !sidebarCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "tween", duration: 0.15, ease: "easeOut" }}
                        className="overflow-hidden will-change-[height,opacity]"
                      >
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.id}
                            to={routeMapping[subItem.id] || `/`}
                            onClick={() => setActiveItem(subItem.id)}
                            className={`w-full flex items-center px-12 py-2 text-left duration-150 ease-out transition-colors ${
                              activeItem === subItem.id
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2c2c2e]'
                            }`}
                          >
                            <subItem.icon className="w-4 h-4 mr-3" />
                            <span className="font-medium text-sm">{subItem.label}</span>
                          </Link>
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