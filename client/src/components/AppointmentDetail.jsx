import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiPhone } from 'react-icons/fi';

const AppointmentDetail = ({ appointmentId, onBack }) => {
  // Mock data - in real app this would come from API based on appointmentId
  const appointmentData = {
    id: '#1',
    title: 'Follow Up Visit',
    description: 'Regular checkup appointment',
    date: 'February 21, 2026',
    time: '9:00 am',
    serviceName: 'General Consultation, Follow Up Visit',
    bookingStatus: 'Booked',
    paymentMode: 'Manual',
    paymentStatus: 'paid',
    grandTotal: '₹350.00/-',
    patient: {
      name: 'Patient Kjaggi',
      id: '+194',
      phone: '6315 039',
      initials: 'PK'
    },
    clinic: {
      name: 'Clinic Kjaggi',
      id: '+165',
      phone: '5000 000',
      initials: 'CK'
    },
    doctor: {
      name: 'Dr. Kjaggi',
      id: '9424',
      phone: '6530 66',
      initials: 'DK'
    },
    encounter: {
      description: 'Initial consultation and physical examination',
      status: 'ACTIVE'
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-blue-600" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{appointmentData.title}</h1>
              <p className="text-gray-600">Description: {appointmentData.description}</p>
            </div>
          </div>
        </div>

        {/* Appointment Detail Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 lg:mb-0">Appointment Detail</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                <span>Download Invoice</span>
              </motion.button>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-600">Payment Status: </span>
                <span className="font-semibold text-green-600">{appointmentData.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Appointment Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="text-sm text-gray-500">Appointment ID:</label>
              <p className="font-semibold text-gray-800">{appointmentData.id}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Date & Time:</label>
              <p className="font-semibold text-gray-800">{appointmentData.date}</p>
              <p className="font-semibold text-gray-800">{appointmentData.time}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Service Name:</label>
              <p className="font-semibold text-gray-800">{appointmentData.serviceName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Booking Status:</label>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {appointmentData.bookingStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">Payment Mode:</label>
              <p className="font-semibold text-gray-800">{appointmentData.paymentMode}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Grand Total:</label>
              <p className="text-2xl font-bold text-blue-600">{appointmentData.grandTotal}</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-gray-500">Description:</label>
            <p className="font-semibold text-gray-800">{appointmentData.description}</p>
          </div>
        </motion.div>

        {/* Details Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Patient Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Detail</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-700">{appointmentData.patient.initials}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{appointmentData.patient.name}</h4>
                <p className="text-sm text-gray-500">{appointmentData.patient.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiPhone className="w-4 h-4" />
              <span className="text-sm">{appointmentData.patient.phone}</span>
            </div>
          </motion.div>

          {/* Clinic Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Clinic Detail</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-700">{appointmentData.clinic.initials}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{appointmentData.clinic.name}</h4>
                <p className="text-sm text-gray-500">{appointmentData.clinic.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiPhone className="w-4 h-4" />
              <span className="text-sm">{appointmentData.clinic.phone}</span>
            </div>
          </motion.div>

          {/* Doctor Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Doctor Detail</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-green-700">{appointmentData.doctor.initials}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{appointmentData.doctor.name}</h4>
                <p className="text-sm text-gray-500">{appointmentData.doctor.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiPhone className="w-4 h-4" />
              <span className="text-sm">{appointmentData.doctor.phone}</span>
            </div>
          </motion.div>
        </div>

        {/* Encounter Detail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Encounter Detail</h3>
            <div className="flex items-center space-x-4">
              <button className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {appointmentData.encounter.status}
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-500">Description:</label>
            <p className="font-semibold text-gray-800">{appointmentData.encounter.description}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppointmentDetail;