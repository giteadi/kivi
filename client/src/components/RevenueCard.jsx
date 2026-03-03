import { motion } from 'framer-motion';
import { FiSettings, FiLock } from 'react-icons/fi';

const RevenueCard = ({ title, value, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="text-3xl font-bold text-gray-800 mb-2"
      >
        {value}
      </motion.div>
      
      <p className="text-gray-600 text-sm font-medium">{title}</p>
    </motion.div>
  );
};

export default RevenueCard;