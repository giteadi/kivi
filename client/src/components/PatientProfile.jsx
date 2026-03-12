import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit3, FiPhone, FiMail, FiMapPin, FiCalendar, FiUser, FiFileText, FiActivity, FiClock, FiDollarSign } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useToast } from './Toast';
import api from '../services/api';

const PatientProfile = ({ patientId, onBack }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('PatientProfile rendered with patientId:', patientId); // Debug log

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        setError('No patient ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await api.request(`/patients/${patientId}`);
        const result = await response.json();

        if (result.success) {
          const patient = result.data;
          console.log('Raw patient data from API:', patient); // Debug log

          // Transform the data to match component expectations
          const transformedData = {
            id: `#${patient.student_id || patient.id}`,
            name: `${patient.first_name || 'Unknown'} ${patient.last_name || 'Unknown'}`,
            initials: `${(patient.first_name || '')[0] || ''}${(patient.last_name || '')[0] || ''}`.toUpperCase(),
            email: patient.email || 'Not provided',
            phone: patient.phone || 'Not provided',
            clinic: 'MindSaid Learning Centre', // Default clinic name
            status: patient.status ? patient.status.charAt(0).toUpperCase() + patient.status.slice(1) : 'Unknown',
            registrationDate: patient.registration_date ? new Date(patient.registration_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Not provided',
            dateOfBirth: patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Not provided',
            age: patient.date_of_birth ? calculateAge(patient.date_of_birth) : 'Not available',
            gender: patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'Not specified',
            address: patient.address ? `${patient.address}${patient.city ? `, ${patient.city}` : ''}${patient.state ? `, ${patient.state}` : ''}${patient.zip_code ? ` ${patient.zip_code}` : ''}`.trim() : 'Not provided',
            emergencyContact: {
              name: patient.emergency_contact_name || 'Not provided',
              relation: patient.emergency_contact_relation || 'Not provided',
              phone: patient.emergency_contact_phone || 'Not provided'
            },
            medicalInfo: {
              allergies: [], // Students table doesn't have allergies - could be added later
              chronicConditions: [], // Students table doesn't have chronic conditions
              currentMedications: [], // Students table doesn't have medications
              lastVisit: patient.last_appointment ? new Date(patient.last_appointment).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'No visits yet',
              nextAppointment: 'Not scheduled' // Would need appointments API
            },
            appointments: [], // Would need separate appointments API
            encounters: [], // Would need separate encounters API
            billing: [] // Would need separate billing API
          };

          console.log('Transformed patient data:', transformedData); // Debug log
          setPatientData(transformedData);
        } else {
          setError(result.message || 'Failed to fetch patient data');
          toast.error(result.message || 'Failed to fetch patient data');
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setError('Error loading patient data');
        toast.error('Error loading patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]); // Removed toast from dependencies

  const calculateAge = (dateOfBirth) => {
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      
      if (isNaN(birthDate.getTime())) {
        return 'Invalid date';
      }
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age > 0 ? `${age} years` : 'Less than 1 year';
    } catch (error) {
      return 'Not available';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar },
    { id: 'encounters', label: 'Medical Records', icon: FiFileText },
    { id: 'billing', label: 'Billing', icon: FiDollarSign }
  ];

  const getStatusColor = (status) => {
    const statusStr = String(status || '').toLowerCase();
    switch (statusStr) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-sm text-gray-800">{patientData.dateOfBirth}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Age</label>
                  <p className="text-sm text-gray-800">{patientData.age}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <p className="text-sm text-gray-800">{patientData.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Blood Group</label>
                  <p className="text-sm text-gray-800">{patientData.bloodGroup}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Registration Date</label>
                  <p className="text-sm text-gray-800">{patientData.registrationDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(patientData.status)}`}>
                    {patientData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-800">{patientData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPhone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-800">{patientData.phone}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiMapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <span className="text-sm text-gray-800">{patientData.address}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-sm text-gray-800">{patientData.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Relation</label>
                  <p className="text-sm text-gray-800">{patientData.emergencyContact.relation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-sm text-gray-800">{patientData.emergencyContact.phone}</p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Allergies</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patientData.medicalInfo.allergies.map((allergy, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Chronic Conditions</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patientData.medicalInfo.chronicConditions.map((condition, index) => (
                      <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Medications</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patientData.medicalInfo.currentMedications.map((medication, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {medication}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Visit</label>
                  <p className="text-sm text-gray-800">{patientData.medicalInfo.lastVisit}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clinic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patientData.appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.date}</div>
                        <div className="text-sm text-gray-500">{appointment.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.doctor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.clinic}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'encounters':
        return (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patientData.encounters.map((encounter) => (
                    <tr key={encounter.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {encounter.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {encounter.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {encounter.doctor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {encounter.diagnosis}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(encounter.status)}`}>
                          {encounter.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patientData.billing.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bill.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bill.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bill.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bill.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                          {bill.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
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
              <h1 className="text-2xl font-semibold text-gray-800">Patient Profile</h1>
              <p className="text-gray-600">Complete patient information and medical history</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FiEdit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </motion.button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading patient data...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Patient Data */}
        {patientData && !loading && !error && (
        <>
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Patients</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Patient Profile</span>
        </div>

        {/* Patient Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{patientData.initials}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{patientData.name}</h2>
                  <p className="text-gray-600">Patient ID: {patientData.id}</p>
                  <p className="text-gray-600">Primary Clinic: {patientData.clinic}</p>
                </div>
                
                <div className="flex flex-col lg:items-end space-y-2 mt-4 lg:mt-0">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(patientData.status)}`}>
                    {patientData.status}
                  </span>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FiCalendar className="w-4 h-4" />
                      <span>Last Visit: {patientData.medicalInfo.lastVisit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
        </>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;