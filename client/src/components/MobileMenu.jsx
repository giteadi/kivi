import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLogOut, FiCheckCircle } from 'react-icons/fi';
import { 
  FiHome, 
  FiCalendar, 
  FiUser, 
  FiUserCheck, 
  FiMapPin,
  FiFileText, 
  FiCreditCard, 
  FiActivity,
  FiUpload,
  FiPackage,
  FiMessageSquare,
  FiShield
} from 'react-icons/fi';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import LogoImage from './LogoImage';

const routeMapping = {
  'dashboard': '/dashboard',
  'patients': '/examinees',
  'doctors': '/therapists',
  'template-manager': '/templates',
  'forms': '/forms',
  'conners': '/conners',
  'clinics': '/centres',
  'assessment-calendar': '/assessment-calendar',
  'billing-records': '/billing',
  'financial-packages': '/packages/financial',
  'invoices': '/invoices',
  'queries': '/admin/queries',
  'center-visibility': '/admin/center-visibility',
};

const MobileMenu = ({ isOpen, setIsOpen, activeItem, setActiveItem }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome, section: 'MAIN' },
    { id: 'patients', label: 'Examinees', icon: FiUser, section: 'USERS' },
    { id: 'doctors', label: 'Therapists', icon: FiUserCheck, section: 'USERS' },
    { id: 'template-manager', label: 'Report Templates', icon: FiFileText, section: 'USERS' },
    { id: 'forms', label: 'Clinical Forms', icon: FiUpload, section: 'USERS' },
    { id: 'conners', label: 'Conners Rating', icon: FiActivity, section: 'USERS' },
    { id: 'clinics', label: 'Centers Network', icon: FiMapPin, section: 'CENTER' },
    { id: 'assessment-calendar', label: 'Calendar', icon: FiCalendar, section: 'CENTER' },
    { id: 'billing-records', label: 'Billing Records', icon: FiCreditCard, section: 'FINANCIAL' },
    { id: 'financial-packages', label: 'Packages', icon: FiPackage, section: 'FINANCIAL' },
    { id: 'invoices', label: 'Invoices', icon: FiFileText, section: 'FINANCIAL' },
  ];

  const sections = ['MAIN', 'USERS', 'CENTER', 'FINANCIAL'];
  const sectionLabels = {
    MAIN: 'Overview',
    USERS: 'Clinical',
    CENTER: 'Centers',
    FINANCIAL: 'Billing'
  };

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    setIsOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  const isActiveItem = (itemId) => activeItem === itemId;

  const userInitials = user?.first_name 
    ? `${user.first_name[0]}${user?.last_name ? user.last_name[0] : ''}`.toUpperCase()
    : 'AD';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* iOS Frosted Dimmer Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
          />
          
          {/* Native iOS Navigation Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed left-0 top-0 w-[82vw] max-w-[300px] h-full bg-[#fbfbfd]/95 backdrop-blur-2xl shadow-2xl z-50 lg:hidden flex flex-col border-r border-slate-200/80"
          >
            {/* Header with Centrix Logo */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-slate-200/70 bg-white/60">
              <LogoImage size={26} variant="full" />
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-black/[0.04] active:scale-95 transition-all"
                aria-label="Close menu"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Items (Compact iOS Inset Grouping) */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-3 scrollbar-none">
              {sections.map((section) => (
                <div key={section}>
                  <div className="px-2.5 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {sectionLabels[section] || section}
                  </div>
                  <div className="space-y-0.5">
                    {menuItems
                      .filter(item => item.section === section)
                      .map((item) => {
                        const active = isActiveItem(item.id);
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.id}
                            to={routeMapping[item.id] || '/'}
                            onClick={() => handleItemClick(item.id)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all active:scale-[0.98] ${
                              active
                                ? 'bg-[#0071e3] text-white font-semibold shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-black/[0.04]'
                            }`}
                          >
                            <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>

            {/* User Mini-Card Footer with One-Tap Sign Out */}
            <div className="p-3 border-t border-slate-200/70 bg-white/80 flex flex-col gap-2">
              <div className="flex items-center gap-2.5 px-1.5 py-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0071e3] to-[#6366f1] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {userInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                    {user?.first_name || 'Admin'} {user?.last_name || ''}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize truncate mt-0.5">
                    {user?.role || 'Staff'} • {user?.email || 'admin@centrix'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-red-600 rounded-xl bg-red-50/70 hover:bg-red-100/70 active:scale-[0.98] transition-all"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
