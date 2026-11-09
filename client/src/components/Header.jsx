import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiChevronDown, FiMenu, FiLogOut, FiUser, FiCheckCircle } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useState, useEffect, useRef } from 'react';
import { useSidebar } from '../App';
import LogoImage from './LogoImage';

const Header = ({ onMenuClick, onBackClick, showBackButton = false }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef(null);
  const { sidebarCollapsed } = useSidebar();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
  };

  const userInitials = user?.first_name 
    ? `${user.first_name[0]}${user?.last_name ? user.last_name[0] : ''}`.toUpperCase()
    : 'AD';

  return (
    <header
      className={`sticky top-0 z-20 h-13 sm:h-14 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 transition-all duration-200 flex items-center justify-between px-3 sm:px-6 select-none ${
        sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[248px]'
      }`}
    >
      {/* Left side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-black/[0.04] active:scale-95 transition-all"
          aria-label="Open mobile menu"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Identity */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <LogoImage size={24} variant="compact" />
        </div>

        {/* Back button */}
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-black/[0.04] transition-colors flex items-center gap-1 text-xs font-medium"
            title="Go Back"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
        )}

        {/* Desktop Breadcrumb / Status Badge */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100/80 text-[11px] font-medium text-slate-600 border border-slate-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Workspace</span>
          </div>
          <span className="text-xs font-semibold text-slate-700 tracking-tight">
            Centrix OS
          </span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Notifications Button */}
        <button
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-black/[0.04] active:scale-95 transition-all"
          title="Notifications"
        >
          <FiBell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#0071e3] rounded-full ring-2 ring-white" />
        </button>

        {/* User Pill Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-1.5 pr-1.5 sm:pr-2.5 py-1 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 shadow-sm transition-all duration-150 active:scale-95"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0071e3] to-[#6366f1] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              {userInitials}
            </div>

            <div className="hidden md:flex flex-col text-left leading-none">
              <span className="text-xs font-semibold text-slate-800 tracking-tight">
                {user?.first_name || 'Admin'}
              </span>
              <span className="text-[10px] text-slate-400 capitalize">
                {user?.role || 'Staff'}
              </span>
            </div>

            <FiChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Apple-grade Popover Dropdown */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-52 sm:w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.06)] py-1.5 z-50 overflow-hidden"
              >
                {/* User info header */}
                <div className="px-3.5 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">
                    {user?.first_name} {user?.last_name || ''}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {user?.email || 'admin@centrix.internal'}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-[10px] font-semibold text-blue-700">
                    <FiCheckCircle className="w-3 h-3" />
                    <span className="capitalize">{user?.role || 'Admin'} Session</span>
                  </div>
                </div>

                {/* Logout option */}
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
