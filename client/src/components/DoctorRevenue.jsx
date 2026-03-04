import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiDownload, FiUser, FiMail, FiDollarSign } from 'react-icons/fi';
import { useState } from 'react';

const DoctorRevenue = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const doctorRevenueData = [
    {
      id: 1,
      rank: 10,
      sessions: 5,
      doctor: {
        name: 'Dr. Matthew Jackson',
        initials: 'MJ',
        email: 'kjaggi+doctor3@mindsalelearning.com',
        badge: 'DM',
        badgeColor: 'bg-blue-100 text-blue-800'
      },
      clinic: {
        name: 'Downtown Family Clinic',
        initials: 'DF',
        email: 'kjaggi+clinic2@mindsale',
        badge: 'CK',
        badgeColor: 'bg-purple-100 text-purple-800'
      }
    },
    {
      id: 2,
      rank: 9,
      sessions: 4,
      doctor: {
        name: 'Dr. Mark Hall',
        initials: 'MH',
        email: 'kjaggi+doctor2@mindsalelearning.com',
        badge: 'DM',
        badgeColor: 'bg-blue-100 text-blue-800'
      },
      clinic: {
        name: 'Sunrise Health Center',
        initials: 'SH',
        email: 'kjaggi+clinic1@mindsale',
        badge: 'GV',
        badgeColor: 'bg-green-100 text-green-800'
      }
    },
    {
      id: 3,
      rank: 8,
      sessions: 3,
      doctor: {
        name: 'Dr. Samantha Gray',
        initials: 'SG',
        email: 'kjaggi+doctor1@mindsalelearning.com',
        badge: 'DS',
        badgeColor: 'bg-indigo-100 text-indigo-800'
      },
      clinic: {
        name: 'Clinic Kjaggi',
        initials: 'CK',
        email: 'clinic_kjaggi@kivicare.com',
        badge: 'DF',
        badgeColor: 'bg-pink-100 text-pink-800'
      }
    },
    {
      id: 4,
      rank: 7,
      sessions: 2,
      doctor: {
        name: 'Dr. Paul Sanders',
        initials: 'PS',
        email: 'kjaggi+doctor6@mindsalelearning.com',
        badge: 'DP',
        badgeColor: 'bg-blue-100 text-blue-800'
      },
      clinic: {
        name: 'Green Valley Clinic',
        initials: 'GV',
        email: 'kjaggi+clinic3@mindsale',
        badge: 'SH',
        badgeColor: 'bg-yellow-100 text-yellow-800'
      }
    },
    {
      id: 5,
      rank: 6,
      sessions: 1,
      doctor: {
        name: 'Dr. Kjaggi',
        initials: 'DK',
        email: 'doctor_kjaggi@kivicare.com',
        badge: 'DK',
        badgeColor: 'bg-orange-100 text-orange-800'
      },
      clinic: {
        name: 'Clinic Kjaggi',
        initials: 'CK',
        email: 'clinic_kjaggi@kivicare.com',
        badge: 'CK',
        badgeColor: 'bg-blue-100 text-blue-800'
      }
    },
    {
      id: 6,
      rank: 5,
      sessions: 5,
      doctor: {
        name: 'Dr. Matthew Jackson',
        initials: 'MJ',
        email: 'kjaggi+doctor3@mindsalelearning.com',
        badge: 'DM',
        badgeColor: 'bg-blue-100 text-blue-800'
      },
      clinic: {
        name: 'Clinic Kjaggi',
        initials: 'CK',
        email: 'clinic_kjaggi@kivicare.com',
        badge: 'CK',
        badgeColor: 'bg-blue-100 text-blue-800'
      }
    },
    {
      id: 7,
      rank: 4,
      sessions: 4,
      doctor: {
        name: 'Dr. Mark Hall',
        initials: 'MH',
        email: 'kjaggi+doctor2@mindsalelearning.com',
        badge: 'DM',
        badgeColor: 'bg-blue-100 text-blue-800'
      },
      clinic: {
        name: 'Green Valley Clinic',
        initials: 'GV',
        email: 'kjaggi+clinic3@mindsale',
        badge: 'GV',
        badgeColor: 'bg-green-100 text-green-800'
      }
    },
    {
      id: 8,
      rank: 3,
      sessions: 3,
      doctor: {
        name: 'Dr. Samantha Gray',
        initials: 'SG',
        email: 'kjaggi+doctor1@mindsalelearning.com',
        badge: 'DS',
        badgeColor: 'bg-indigo-100 text-indigo-800'
      },
      clinic: {
        name: 'Downtown Family Clinic',
        initials: 'DF',
        email: 'kjaggi+clinic2@mindsale',
        badge: 'DF',
        badgeColor: 'bg-pink-100 text-pink-800'
      }
    },
    {
      id: 9,
      rank: 2,
      sessions: 2,
      doctor: {
        name: 'Dr. Paul Sanders',
        initials: 'PS',
        email: 'kjaggi+doctor6@mindsalelearning.com',
        badge: 'DP',
        badgeColor: 'bg-blue-100 text-blue-800'
      },
      clinic: {
        name: 'Sunrise Health Center',
        initials: 'SH',
        email: 'kjaggi+clinic1@mindsale',
        badge: 'SH',
        badgeColor: 'bg-yellow-100 text-yellow-800'
      }
    },
    {
      id: 10,
      rank: 1,
      sessions: 1,
      doctor: {
        name: 'Dr. Kjaggi',
        initials: 'DK',
        email: 'doctor_kjaggi@kivicare.com',
        badge: 'DK',
        badgeColor: 'bg-orange-100 text-orange-800'
      },
      clinic: {
        name: 'Clinic Kjaggi',
        initials: 'CK',
        email: 'clinic_kjaggi@kivicare.com',
        badge: 'CK',
        badgeColor: 'bg-blue-100 text-blue-800'
      }
    }
  ];

  const filteredData = doctorRevenueData.filter(item =>
    item.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.clinic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Doctor Revenue</h1>
            <p className="text-gray-600">Revenue analysis by doctor performance</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Financial</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Doctor Revenue</span>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search doctors or clinics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span>Filters</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Doctor Revenue Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Clinic
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.sessions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${item.doctor.badgeColor}`}>
                          <span className="text-sm font-semibold">{item.doctor.badge}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.doctor.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FiMail className="w-3 h-3 mr-1" />
                            {item.doctor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${item.clinic.badgeColor}`}>
                          <span className="text-sm font-semibold">{item.clinic.badge}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.clinic.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FiMail className="w-3 h-3 mr-1" />
                            {item.clinic.email}
                          </div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <FiUser className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No revenue data found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Revenue Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{doctorRevenueData.length}</div>
                <div className="text-sm text-gray-600">Total Doctors</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {doctorRevenueData.reduce((sum, item) => sum + item.sessions, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiUser className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.max(...doctorRevenueData.map(item => item.sessions))}
                </div>
                <div className="text-sm text-gray-600">Max Sessions</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {(doctorRevenueData.reduce((sum, item) => sum + item.sessions, 0) / doctorRevenueData.length).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Avg Sessions</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorRevenue;