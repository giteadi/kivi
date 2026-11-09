import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiCalendar,
  FiUser,
  FiUserCheck,
  FiMapPin,
  FiChevronRight,
  FiFileText,
  FiCreditCard,
  FiActivity,
  FiMenu,
  FiSidebar,
  FiMessageSquare,
  FiShield,
  FiUpload,
  FiPackage,
  FiChevronLeft
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import LogoImage from './LogoImage';

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
  'conners': '/conners',
  'clinics': '/centres',
  'assessment-calendar': '/assessment-calendar',
  'clinic-revenue': '/centres/revenue',
  'taxes': '/taxes',
  'billing-records': '/billing',
  'financial-packages': '/packages/financial',
  'invoices': '/invoices',
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

const sectionLabels = {
  MAIN: 'Overview',
  USERS: 'Clinical',
  NETWORK: 'Centers',
  FINANCIAL: 'Financials',
  ADMIN: 'System'
};

const Sidebar = ({ activeItem, setActiveItem, shouldExpandEncounters, sidebarCollapsed, setSidebarCollapsed }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

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
      { id: 'patients', label: 'Examinees', icon: FiUser, section: 'USERS' },
      { id: 'doctors', label: 'Therapists', icon: FiUserCheck, section: 'USERS' },
      { id: 'template-manager', label: 'Report Templates', icon: FiFileText, section: 'USERS' },
      { id: 'forms', label: 'Forms', icon: FiUpload, section: 'USERS' },
      { id: 'conners', label: 'Conners Rating', icon: FiActivity, section: 'USERS' },
      { id: 'clinics', label: 'Centers', icon: FiMapPin, section: 'NETWORK' },
      { id: 'assessment-calendar', label: 'Calendar', icon: FiCalendar, section: 'NETWORK' },
      { id: 'billing-records', label: 'Billing Records', icon: FiCreditCard, section: 'FINANCIAL' },
      { id: 'financial-packages', label: 'Packages', icon: FiPackage, section: 'FINANCIAL' },
      { id: 'invoices', label: 'Invoices', icon: FiFileText, section: 'FINANCIAL' },
      { id: 'queries', label: 'Inquiries', icon: FiMessageSquare, section: 'ADMIN' },
      { id: 'center-visibility', label: 'Visibility', icon: FiShield, section: 'ADMIN' },
    ];

    const therapistMenuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: FiHome, section: 'MAIN' },
      { id: 'patients', label: 'Examinees', icon: FiUser, section: 'USERS' },
      { id: 'profile', label: 'My Profile', icon: FiUser, section: 'USERS' },
    ];

    switch (user?.role) {
      case 'admin':
        return adminMenuItems;
      case 'therapist':
        return therapistMenuItems;
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: FiHome, section: 'MAIN' },
        ];
    }
  };

  const menuItems = getMenuItems();
  const sections = ['MAIN', 'USERS', 'NETWORK', 'FINANCIAL', 'ADMIN'];

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
    const currentPath = location.pathname;
    const mappedRoute = routeMapping[itemId];
    if (mappedRoute && (currentPath === mappedRoute || currentPath.startsWith(mappedRoute + '/'))) {
      return true;
    }
    return activeItem === itemId;
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 68 : 248 }}
      transition={{ type: "spring", stiffness: 350, damping: 32 }}
      className="hidden lg:flex flex-col bg-[#fbfbfd]/90 backdrop-blur-xl border-r border-slate-200/75 h-screen fixed left-0 top-0 z-30 overflow-hidden select-none transition-colors duration-200"
    >
      {/* Brand Header */}
      <div className="h-14 px-3 flex items-center justify-between border-b border-slate-200/60 flex-shrink-0">
        <Link 
          to="/dashboard"
          className="flex items-center gap-2.5 overflow-hidden transition-opacity hover:opacity-85"
        >
          <LogoImage 
            size={28} 
            variant={sidebarCollapsed ? "mark" : "full"} 
          />
        </Link>

        {/* Apple-style Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-black/[0.04] active:scale-95 transition-all flex-shrink-0"
          title={sidebarCollapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
        >
          {sidebarCollapsed ? (
            <FiSidebar className="w-4 h-4" />
          ) : (
            <FiChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-thin">
        {sections.map((section) => {
          const items = menuItems.filter(item => item.section === section);
          if (items.length === 0) return null;

          return (
            <div key={section}>
              {/* Apple-style Micro Section Header */}
              {!sidebarCollapsed ? (
                <div className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {sectionLabels[section] || section}
                </div>
              ) : (
                <div className="h-px bg-slate-200/50 my-2 mx-2" />
              )}

              {/* Items List */}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const active = isActiveItem(item.id);
                  const Icon = item.icon;

                  return (
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
                        title={sidebarCollapsed ? item.label : undefined}
                        className={`group relative flex items-center ${
                          sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-2.5'
                        } py-2 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                          active
                            ? 'bg-[#0071e3] text-white shadow-[0_1px_3px_rgba(0,113,227,0.3)] font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-black/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 ${
                            active ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                          }`} />
                          
                          {!sidebarCollapsed && (
                            <span className="truncate tracking-[-0.01em]">
                              {item.label}
                            </span>
                          )}
                        </div>

                        {item.hasSubmenu && !sidebarCollapsed && (
                          <motion.div
                            animate={{ rotate: expandedSections[item.id] ? 90 : 0 }}
                            transition={{ duration: 0.15 }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleSection(item.id);
                            }}
                          >
                            <FiChevronRight className={`w-3.5 h-3.5 ${active ? 'text-white/80' : 'text-slate-400'}`} />
                          </motion.div>
                        )}
                      </Link>

                      {/* Submenu if present */}
                      <AnimatePresence initial={false}>
                        {item.hasSubmenu && expandedSections[item.id] && !sidebarCollapsed && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="overflow-hidden pl-7 pr-1 py-0.5 space-y-0.5"
                          >
                            {item.submenu.map((subItem) => {
                              const subActive = activeItem === subItem.id;
                              const SubIcon = subItem.icon;
                              return (
                                <Link
                                  key={subItem.id}
                                  to={routeMapping[subItem.id] || `/`}
                                  onClick={() => setActiveItem(subItem.id)}
                                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    subActive
                                      ? 'bg-blue-50 text-blue-600 font-semibold'
                                      : 'text-slate-500 hover:text-slate-800 hover:bg-black/[0.03]'
                                  }`}
                                >
                                  <SubIcon className="w-3.5 h-3.5" />
                                  <span className="truncate">{subItem.label}</span>
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Micro-Card Footer */}
      <div className="p-2 border-t border-slate-200/60 bg-white/50 flex-shrink-0">
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2.5 px-2'} py-1.5 rounded-xl`}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border border-black/[0.08] flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-700">
              {user?.first_name ? user.first_name[0].toUpperCase() : 'A'}
            </span>
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                {user?.first_name || 'Admin'} {user?.last_name || ''}
              </p>
              <p className="text-[10px] text-slate-400 font-medium capitalize truncate">
                {user?.role || 'Administrator'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
