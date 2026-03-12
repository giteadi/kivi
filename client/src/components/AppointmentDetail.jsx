import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiPhone } from 'react-icons/fi';

const AppointmentDetail = ({ appointmentData, onBack, onViewEncounter, onCreateNewEncounter }) => {
  // Use the passed appointment data or fallback to mock data if not provided
  const data = appointmentData || {
    id: '#1',
    title: 'Follow Up Session',
    description: 'Regular checkup session',
    date: 'February 21, 2026',
    time: '9:00 am',
    serviceName: 'General Consultation, Follow Up Session',
    bookingStatus: 'Booked',
    paymentMode: 'Manual',
    paymentStatus: 'paid',
    grandTotal: '₹350.00/-',
    student: {
      name: 'Student Kjaggi',
      id: '+194',
      phone: '6315 039',
      initials: 'SK'
    },
    center: {
      name: 'MindSaid Learning Center',
      id: '+165',
      phone: '5000 000',
      initials: 'ML'
    },
    therapist: {
      name: 'Therapist Kjaggi',
      id: '9424',
      phone: '6530 66',
      initials: 'TK'
    },
    session: {
      description: 'Initial consultation and assessment',
      status: 'ACTIVE'
    }
  };

  // If appointmentData is provided, format the dynamic data
  if (appointmentData) {
    data.id = `#${appointmentData.id}`;
    data.title = `Session with ${appointmentData.patient}`;
    data.description = `Therapy session scheduled`;
    data.date = appointmentData.date;
    data.time = appointmentData.time;
    data.serviceName = appointmentData.patient ? `Consultation for ${appointmentData.patient}` : 'General Consultation';
    data.bookingStatus = 'Booked';
    data.paymentMode = 'Manual';
    data.paymentStatus = 'paid';
    data.grandTotal = '₹350.00/-';
    
    // Student details - use actual contact data if available
    data.student = {
      name: appointmentData.patient,
      id: `+${appointmentData.id}`,
      phone: appointmentData.userPhone || appointmentData.studentPhone || 'N/A',
      initials: appointmentData.initials
    };

    // Center details - use actual centre data if available
    data.center = {
      name: appointmentData.clinic || 'Unknown Centre',
      id: `+${appointmentData.id}`,
      phone: appointmentData.centrePhone || 'N/A',
      initials: appointmentData.clinic ? appointmentData.clinic.split(' ').map(word => word[0]).join('').toUpperCase() : 'CC'
    };

    // Therapist details
    data.therapist = {
      name: appointmentData.doctor,
      id: `+${appointmentData.id}`,
      phone: appointmentData.therapistPhone || 'N/A',
      initials: appointmentData.doctor ? appointmentData.doctor.split(' ').map(word => word[0]).join('').toUpperCase() : 'TD'
    };

    // Session details
    data.session = {
      description: 'Therapy session scheduled',
      status: 'ACTIVE'
    };
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Sessions</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Session Detail</span>
        </div>

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
              <h1 className="text-2xl font-semibold text-gray-800">{data.title}</h1>
              <p className="text-gray-600">Description: {data.description}</p>
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4 lg:mb-0">Session Detail</h2>
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
                <span className="font-semibold text-green-600">{data.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Appointment Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="text-sm text-gray-500">Session ID:</label>
              <p className="font-semibold text-gray-800">{data.id}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Date & Time:</label>
              <p className="font-semibold text-gray-800">{data.date}</p>
              <p className="font-semibold text-gray-800">{data.time}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Service Name:</label>
              <p className="font-semibold text-gray-800">{data.serviceName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Booking Status:</label>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {data.bookingStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">Payment Mode:</label>
              <p className="font-semibold text-gray-800">{data.paymentMode}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Grand Total:</label>
              <p className="text-2xl font-bold text-blue-600">{data.grandTotal}</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-gray-500">Description:</label>
            <p className="font-semibold text-gray-800">{data.description}</p>
          </div>
        </motion.div>

        {/* Details Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Student Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Detail</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-700">{data.student.initials}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{data.student.name}</h4>
                <p className="text-sm text-gray-500">{data.student.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiPhone className="w-4 h-4" />
              <span className="text-sm">{data.student.phone}</span>
            </div>
          </motion.div>

          {/* Center Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Center Detail</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-700">{data.center.initials}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{data.center.name}</h4>
                <p className="text-sm text-gray-500">{data.center.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiPhone className="w-4 h-4" />
              <span className="text-sm">{data.center.phone}</span>
            </div>
          </motion.div>

          {/* Therapist Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Therapist Detail</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-green-700">{data.therapist.initials}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{data.therapist.name}</h4>
                <p className="text-sm text-gray-500">{data.therapist.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiPhone className="w-4 h-4" />
              <span className="text-sm">{data.therapist.phone}</span>
            </div>
          </motion.div>
        </div>

        {/* Session Detail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Session Detail</h3>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCreateNewEncounter && onCreateNewEncounter({
                  id: data.student.id,
                  name: data.student.name,
                  phone: data.student.phone
                })}
                className="text-sm px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                New Plan
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onViewEncounter}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Details
              </motion.button>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {data.session.status}
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-500">Description:</label>
            <p className="font-semibold text-gray-800">{data.session.description}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppointmentDetail;