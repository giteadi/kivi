import { motion } from 'framer-motion';
import { FiMail, FiX } from 'react-icons/fi';
import { useState } from 'react';

const EmailAlert = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 relative"
    >
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 p-1 hover:bg-yellow-100 rounded"
      >
        <FiX className="w-4 h-4 text-yellow-600" />
      </button>
      
      <div className="flex items-start space-x-3">
        <FiMail className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <p className="text-yellow-800 text-sm">
            Please make sure your server has Email Server (SMTP) setup! Without proper email configuration, emails may not be delivered.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-3 px-4 py-2 bg-red-400 hover:bg-red-500 text-white text-sm rounded-lg transition-colors"
          >
            Send Test Email
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailAlert;