import { motion } from 'framer-motion';

const AppointmentCard = ({ patient, date, time, clinic, doctor, initials, bgColor = 'bg-purple-100', onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-all cursor-pointer border border-transparent hover:border-blue-200"
    >
      <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
        <span className={`text-sm font-semibold ${
          bgColor === 'bg-green-100' ? 'text-green-700' : 
          bgColor === 'bg-purple-100' ? 'text-purple-700' : 
          bgColor === 'bg-red-100' ? 'text-red-700' : 
          'text-blue-700'
        }`}>{initials}</span>
      </div>
      
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{patient}</h4>
        <p className="text-sm text-red-400 font-medium">{date} {time}</p>
        <p className="text-xs text-gray-500">{clinic}</p>
        <p className="text-xs text-gray-600">By {doctor}</p>
      </div>
      
      {/* Arrow indicator */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  );
};

export default AppointmentCard;