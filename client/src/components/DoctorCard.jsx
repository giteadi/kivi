import { motion } from 'framer-motion';

const DoctorCard = ({ name, clinic, appointments, initials, bgColor = 'bg-blue-100' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-all"
    >
      <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}>
        <span className="text-sm font-semibold text-blue-700">{initials}</span>
      </div>
      
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{name}</h4>
        <p className="text-sm text-gray-500">{clinic}</p>
        <p className="text-xs text-red-400 font-medium">{appointments} Appointments</p>
      </div>
    </motion.div>
  );
};

export default DoctorCard;