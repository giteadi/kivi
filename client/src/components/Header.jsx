import { motion } from 'framer-motion';
import { FiBell, FiChevronDown, FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useState, useEffect, useRef } from 'react';

const Header = ({ onMenuClick, onBackClick, showBackButton = false }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef(null);

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
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-sm border-b lg:ml-64 px-4 lg:px-6 py-4 flex items-center justify-between"
    >
      {/* Left side - Mobile menu button and back button */}
      <div className="flex items-center space-x-3">
        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <FiMenu className="w-5 h-5 text-gray-600" />
        </motion.button>

        {/* Back button - show when needed */}
        {showBackButton && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackClick}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Go Back"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative"
        >
          <FiBell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </motion.button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="https://res.cloudinary.com/bazeercloud/image/upload/v1765087953/Gemini_Generated_Image_o8ciwko8ciwko8ci-removebg-preview_l4nnui.png" 
                alt="User Avatar" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <FiChevronDown className="w-4 h-4 text-gray-600" />
          </motion.button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50"
            >
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-800">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;