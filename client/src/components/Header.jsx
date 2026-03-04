import { motion } from 'framer-motion';
import { FiBell, FiChevronDown, FiMenu } from 'react-icons/fi';

const Header = ({ onMenuClick, onBackClick, showBackButton = false }) => {
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
      </div>
    </motion.header>
  );
};

export default Header;