import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiCalendar, 
  FiUsers, 
  FiUser, 
  FiUserCheck, 
  FiSettings,
  FiMapPin
} from 'react-icons/fi';

const Sidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome, section: 'MAIN' },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar, section: 'MAIN' },
    { id: 'encounters', label: 'Encounters', icon: FiUsers, section: 'MAIN' },
    { id: 'patients', label: 'Patients', icon: FiUser, section: 'USERS' },
    { id: 'doctors', label: 'Doctors', icon: FiUserCheck, section: 'USERS' },
    { id: 'receptionists', label: 'Receptionists', icon: FiUser, section: 'USERS' },
    { id: 'clinics', label: 'Clinics', icon: FiMapPin, section: 'CLINIC' },
  ];

  const sections = ['MAIN', 'USERS', 'CLINIC'];

  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="hidden lg:block w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10"
    >
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">KiviCare</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-4">
        {sections.map((section) => (
          <div key={section} className="mb-6">
            <div className="px-6 mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section}
              </span>
            </div>
            {menuItems
              .filter(item => item.section === section)
              .map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                    activeItem === item.id
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="absolute bottom-4 left-0 right-0 px-6">
        <motion.button
          whileHover={{ x: 4 }}
          className="w-full flex items-center px-3 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <FiSettings className="w-5 h-5 mr-3" />
          <span className="font-medium">Settings</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;