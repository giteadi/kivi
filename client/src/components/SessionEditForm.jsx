import { motion } from 'framer-motion';
import { FiX, FiCalendar, FiClock, FiUser, FiBook, FiMapPin, FiDollarSign, FiFileText } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatients } from '../store/slices/patientSlice';
import { fetchDoctors } from '../store/slices/doctorSlice';
import { fetchClinics } from '../store/slices/clinicSlice';
import { fetchServices } from '../store/slices/serviceSlice';
import api from '../services/api';

const SessionEditForm = ({ isOpen, onClose, onSave, sessionId }) => {
  const dispatch = useDispatch();
  const { patients } = useSelector((state) => state.patients);
  const { doctors } = useSelector((state) => state.doctors);
  const { clinics } = useSelector((state) => state.clinics);
  const { services } = useSelector((state) => state.services);

  const [formData, setFormData] = useState({
    student_id: '',
    therapist_id: '',
    centre_id: '',
    programme_id: '',
    session_date: '',
    session_time: '',
    duration: 30,
    session_type: 'individual',
    notes: '',
    preparation_notes: '',
    materials_needed: '',
    session_goals: '',
    status: 'scheduled'
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    if (isOpen && sessionId) {
      dispatch(fetchPatients());
      dispatch(fetchDoctors());
      dispatch(fetchClinics());
      dispatch(fetchServices());
      loadSessionData();
    }
  }, [dispatch, isOpen, sessionId]);

  // Load existing session data
  const loadSessionData = async () => {
    try {
      setLoading(true);
      const response = await api.request(`/sessions/${sessionId}`);
      if (response.success) {
        const session = response.data;
        setFormData({
          student_id: session.student_id || '',
          therapist_id: session.therapist_id || '',
          centre_id: session.centre_id || '',
          programme_id: session.programme_id || '',
          session_date: session.session_date ? session.session_date.split('T')[0] : '',
          session_time: session.session_time || '',
          duration: session.duration || 30,
          session_type: session.session_type || 'individual',
          notes: session.notes || '',
          preparation_notes: session.preparation_notes || '',
          materials_needed: session.materials_needed || '',
          session_goals: session.session_goals || '',
          status: session.status || 'scheduled'
        });

        // Set selected student and service
        if (session.student_id) {
          const student = patients.find(p => p.id === session.student_id);
          setSelectedStudent(student);
        }
        if (session.programme_id) {
          const service = services.find(s => s.id === session.programme_id);
          setSelectedService(service);
        }
      }
    } catch (error) {
      console.error('Error loading session data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate amounts when service changes
  useEffect(() => {
    if (selectedService) {
      const servicePrice = parseFloat(selectedService.fee || 0);
      const tax = servicePrice * 0.18; // 18% GST
      setTotalAmount(servicePrice + tax);
      setTaxAmount(tax);
    } else {
      setTotalAmount(0);
      setTaxAmount(0);
    }
  }, [selectedService]);

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  useEffect(() => {
    setAvailableSlots(generateTimeSlots());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Handle student selection
    if (name === 'student_id') {
      const student = patients.find(p => p.id === parseInt(value));
      setSelectedStudent(student);
    }

    // Handle service selection
    if (name === 'programme_id') {
      const service = services.find(s => s.id === parseInt(value));
      setSelectedService(service);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const sessionData = {
      ...formData,
      student_id: parseInt(formData.student_id),
      therapist_id: parseInt(formData.therapist_id),
      centre_id: parseInt(formData.centre_id),
      programme_id: parseInt(formData.programme_id),
      duration: parseInt(formData.duration),
      total_amount: totalAmount,
      tax_amount: taxAmount
    };

    onSave(sessionData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      student_id: '',
      therapist_id: '',
      centre_id: '',
      programme_id: '',
      session_date: '',
      session_time: '',
      duration: 30,
      session_type: 'individual',
      notes: '',
      preparation_notes: '',
      materials_needed: '',
      session_goals: '',
      status: 'scheduled'
    });
    setSelectedStudent(null);
    setSelectedService(null);
    setTotalAmount(0);
    setTaxAmount(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Edit Session</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading session data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Select Student */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Student *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="student_id"
                      value={formData.student_id}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Student</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name} - {patient.student_id}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedStudent && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {selectedStudent.first_name?.[0]}{selectedStudent.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {selectedStudent.first_name} {selectedStudent.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Phone: {selectedStudent.phone} | Email: {selectedStudent.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking For Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-4">Session Details</h3>
                  
                  {/* Select Centre */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Centre *
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        name="centre_id"
                        value={formData.centre_id}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Centre</option>
                        {clinics.map(clinic => (
                          <option key={clinic.id} value={clinic.id}>
                            {clinic.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Select Therapist */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Therapist *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        name="therapist_id"
                        value={formData.therapist_id}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Therapist</option>
                        {doctors.map(doctor => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.first_name} {doctor.last_name} - {doctor.specialty}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Select Programme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Programme *
                    </label>
                    <div className="relative">
                      <FiBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        name="programme_id"
                        value={formData.programme_id}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Programme</option>
                        {services.map(service => (
                          <option key={service.id} value={service.id}>
                            {service.name} - ₹{service.fee}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Session Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Date *
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="date"
                        name="session_date"
                        value={formData.session_date}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Time *
                    </label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        name="session_time"
                        value={formData.session_time}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Time</option>
                        {availableSlots.map(slot => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Session Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Session Type & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Type
                    </label>
                    <select
                      name="session_type"
                      value={formData.session_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="individual">Individual</option>
                      <option value="group">Group</option>
                      <option value="assessment">Assessment</option>
                      <option value="consultation">Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="15"
                      max="180"
                      step="15"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Session Goals */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Goals
                  </label>
                  <textarea
                    name="session_goals"
                    value={formData.session_goals}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter session objectives and goals..."
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Materials Needed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Materials Needed
                  </label>
                  <textarea
                    name="materials_needed"
                    value={formData.materials_needed}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="List any materials or resources needed..."
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Preparation Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preparation Notes
                  </label>
                  <textarea
                    name="preparation_notes"
                    value={formData.preparation_notes}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Any preparation notes for the therapist..."
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter any additional notes..."
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Fee Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                    <FiDollarSign className="w-4 h-4 mr-2" />
                    Fee Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Programme Fee:</span>
                      <span>₹{selectedService?.fee || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18% GST):</span>
                      <span>₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg border-t pt-2">
                      <span>Total Amount:</span>
                      <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Update Session
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default SessionEditForm;
