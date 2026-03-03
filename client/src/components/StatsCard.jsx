import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, title, value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300"
    >
      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full ${colorClasses[color]} flex items-center justify-center mb-4`}>
          <Icon className="w-8 h-8" />
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
      </div>
    </motion.div>
  );
};

export default StatsCard;