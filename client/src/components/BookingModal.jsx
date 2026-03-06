import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiMapPin, FiStar, FiCheck, FiX } from 'react-icons/fi';
import {
  fetchAvailableTherapists,
  fetchAvailableTimeSlots,
  bookSession,
  nextStep,
  previousStep,
  setSelectedDate,
  setSelectedTherapist,
  setSelectedTime,
  setBookingNotes,
  closeBookingModal
} from '../store/slices/bookingSlice';

const BookingModal = ({ isOpen, onClose, selectedPlan, onSuccess }) => {
  const dispatch = useDispatch();
  const {
    isBookingModalOpen,
    currentStep,
    selectedPlan: selectedPlanRedux,
    selectedDate,
    selectedTherapist,
    selectedTime,
    bookingNotes,
    availableTherapists,
    availableTimeSlots,
    loading,
    errors,
    bookingSuccess,
    bookingResult
  } = useSelector((state) => state.booking);

  // Local state for UI only
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentStep === 2 && selectedDate) {
      dispatch(fetchAvailableTherapists({ date: selectedDate }));
    }
  }, [isOpen, currentStep, selectedDate, dispatch]);

  useEffect(() => {
    if (selectedTherapist && selectedDate) {
      dispatch(fetchAvailableTimeSlots({ therapistId: selectedTherapist.id, date: selectedDate }));
    }
  }, [selectedTherapist, selectedDate, dispatch]);

  // Handle booking success
  useEffect(() => {
    if (bookingSuccess && bookingResult) {
      onSuccess?.();
      onClose?.();
    }
  }, [bookingSuccess, bookingResult, onSuccess, onClose]);

  const handleDateSelect = (date) => {
    dispatch(setSelectedDate(date));
    dispatch(nextStep());
  };

  const handleTherapistSelect = (therapist) => {
    dispatch(setSelectedTherapist(therapist));
  };

  const handleTimeSelect = (time) => {
    dispatch(setSelectedTime(time));
  };

  const handleBooking = async () => {
    try {
      setLocalLoading(true);
      const bookingData = {
        therapistId: selectedTherapist.id,
        date: selectedDate,
        time: selectedTime,
        notes: bookingNotes,
        planId: selectedPlanRedux?.id
      };
      
      const result = await dispatch(bookSession(bookingData));
      if (result.meta.requestStatus === 'fulfilled') {
        // Success will be handled by useEffect
      }
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeBookingModal());
    onClose?.();
  };

  // Generate dates for next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    
    return dates;
  };

  if (!isOpen && !isBookingModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Book Your Session</h2>
              {selectedPlanRedux && (
                <p className="text-blue-100 mt-1">Plan: {selectedPlanRedux.name}</p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep ? 'bg-white text-blue-600' : 'bg-blue-400 text-white'
                }`}>
                  {step < currentStep ? <FiCheck className="w-4 h-4" /> : step}
                </div>
                {step < 4 && <div className={`w-8 h-1 ${
                  step < currentStep ? 'bg-white' : 'bg-blue-400'
                }`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Select a Date</h3>
              <div className="grid grid-cols-4 gap-3">
                {generateDates().map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateSelect(date.toISOString().split('T')[0])}
                    className="p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-sm font-medium">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-lg font-bold">
                      {date.getDate()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {date.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Available Therapists</h3>
              {loading.therapists ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading therapists...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableTherapists.map((therapist) => (
                    <div
                      key={therapist.id}
                      onClick={() => handleTherapistSelect(therapist)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedTherapist?.id === therapist.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {therapist.first_name} {therapist.last_name}
                          </h4>
                          <p className="text-sm text-gray-600">{therapist.specialty}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <FiStar className="w-3 h-3 text-yellow-500 mr-1" />
                            {therapist.experience_years} years experience
                          </div>
                          {therapist.centre_name && (
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <FiMapPin className="w-3 h-3 mr-1" />
                              {therapist.centre_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
              {loading.timeSlots ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading time slots...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 border rounded-lg transition-colors ${
                        !slot.available
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedTime === slot.time
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <FiClock className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-sm font-medium">{slot.time}</div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Therapist:</span>
                  <span className="font-medium">
                    {selectedTherapist?.first_name} {selectedTherapist?.last_name}
                  </span>
                </div>
                {selectedPlanRedux && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">{selectedPlanRedux.name}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (optional)
                </label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => dispatch(setBookingNotes(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Any specific requirements or notes for therapist..."
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          <button
            onClick={currentStep > 1 ? () => dispatch(previousStep()) : handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {currentStep > 1 ? 'Back' : 'Cancel'}
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={() => dispatch(nextStep())}
              disabled={
                (currentStep === 1 && !selectedDate) ||
                (currentStep === 2 && !selectedTherapist) ||
                (currentStep === 3 && !selectedTime)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleBooking}
              disabled={loading.booking || localLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {(loading.booking || localLoading) ? 'Booking...' : 'Confirm Booking'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BookingModal;
