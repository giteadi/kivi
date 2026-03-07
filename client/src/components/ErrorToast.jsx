import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const ErrorToast = ({ 
  message, 
  type = 'error', 
  duration = 5000, 
  onClose,
  details = null,
  errorId = null 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <FiCheckCircle className="w-5 h-5" />;
      case 'warning': return <FiAlertTriangle className="w-5 h-5" />;
      case 'info': return <FiInfo className="w-5 h-5" />;
      default: return <FiAlertCircle className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getIconColors = () => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-red-600';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className={`fixed top-4 right-4 z-50 max-w-md w-full border rounded-lg shadow-lg ${getColors()}`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className={`flex-shrink-0 ${getIconColors()}`}>
                {getIcon()}
              </div>
              
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">
                  {message}
                </p>
                
                {errorId && (
                  <p className="text-xs mt-1 opacity-75">
                    Error ID: {errorId}
                  </p>
                )}
                
                {details && (
                  <div className="mt-2">
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-xs underline opacity-75 hover:opacity-100"
                    >
                      {showDetails ? 'Hide' : 'Show'} Details
                    </button>
                    
                    {showDetails && (
                      <div className="mt-2 p-2 bg-white bg-opacity-50 rounded text-xs font-mono">
                        {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleClose}
                className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorToast;