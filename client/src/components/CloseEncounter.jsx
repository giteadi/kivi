import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiAlertTriangle, FiCheck, FiX, FiSave, FiLock } from 'react-icons/fi';

const CloseEncounter = ({ onClose, onSave, sessionData }) => {
  const [closeReason, setCloseReason] = useState('');
  const [finalNotes, setFinalNotes] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [confirmClose, setConfirmClose] = useState(false);
  const [saveBeforeClose, setSaveBeforeClose] = useState(true);

  const encounterSummary = {
    patient: sessionData?.student_first_name && sessionData?.student_last_name 
      ? `${sessionData.student_first_name} ${sessionData.student_last_name}` 
      : 'Unknown Examinee',
    date: sessionData?.session_date 
      ? new Date(sessionData.session_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : 'Unknown Date',
    duration: sessionData?.duration ? `${sessionData.duration} minutes` : 'Unknown duration',
    problems: sessionData?.session_goals ? 1 : 0,
    observations: sessionData?.materials_needed ? 1 : 0,
    notes: sessionData?.notes ? 1 : 0,
    status: sessionData?.status || 'Active'
  };

  const closeReasons = [
    'Consultation completed successfully',
    'Patient discharged',
    'Referred to specialist',
    'Follow-up appointment scheduled',
    'Treatment plan established',
    'Emergency situation resolved',
    'Patient cancelled',
    'Other'
  ];

  const handleCloseEncounter = () => {
    if (!closeReason) {
      alert('Please select a reason for closing the encounter');
      return;
    }

    if (saveBeforeClose && onSave) {
      onSave();
    }

    // In a real app, this would close the encounter in the backend
    console.log('Closing encounter with reason:', closeReason);
    console.log('Final notes:', finalNotes);
    console.log('Follow-up required:', followUpRequired);
    
    alert('Encounter closed successfully');
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
      >
        <div className="flex items-start space-x-3">
          <FiAlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-yellow-800 font-medium">Important Notice</h3>
            <p className="text-yellow-700 text-sm mt-1">
              Closing this encounter will lock all data and prevent further modifications. 
              Please ensure all information is complete and accurate before proceeding.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Encounter Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Encounter Summary</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Patient:</span>
                <p className="font-medium text-gray-800">{encounterSummary.patient}</p>
              </div>
              <div>
                <span className="text-gray-500">Date:</span>
                <p className="font-medium text-gray-800">{encounterSummary.date}</p>
              </div>
              <div>
                <span className="text-gray-500">Duration:</span>
                <p className="font-medium text-gray-800">{encounterSummary.duration}</p>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {encounterSummary.status}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-800 mb-2">Data Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Problems:</span>
                  <span className="font-medium">{encounterSummary.problems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Observations:</span>
                  <span className="font-medium">{encounterSummary.observations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Notes:</span>
                  <span className="font-medium">{encounterSummary.notes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Body Chart:</span>
                  <span className="font-medium">2 annotations</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Close Options */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Close Encounter</h3>
          
          <div className="space-y-4">
            {/* Close Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Closing *
              </label>
              <select
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a reason</option>
                {closeReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* Final Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Notes (Optional)
              </label>
              <textarea
                value={finalNotes}
                onChange={(e) => setFinalNotes(e.target.value)}
                placeholder="Add any final notes or comments..."
                className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>

            {/* Follow-up */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={followUpRequired}
                  onChange={(e) => setFollowUpRequired(e.target.checked)}
                  className="text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Follow-up required</span>
              </label>
              
              {followUpRequired && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3"
                >
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </motion.div>
              )}
            </div>

            {/* Save Option */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveBeforeClose}
                  onChange={(e) => setSaveBeforeClose(e.target.checked)}
                  className="text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Save all changes before closing</span>
              </label>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirmation</h3>
        
        <div className="space-y-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmClose}
              onChange={(e) => setConfirmClose(e.target.checked)}
              className="text-red-600 mt-1"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">
                I confirm that I want to close this encounter
              </span>
              <p className="text-xs text-gray-500 mt-1">
                This action cannot be undone. The encounter will be locked and no further modifications will be possible.
              </p>
            </div>
          </label>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-3">
              {saveBeforeClose && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FiSave className="w-4 h-4" />
                  <span>Save Changes</span>
                </motion.button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <FiX className="w-4 h-4" />
                <span>Cancel</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCloseEncounter}
                disabled={!confirmClose || !closeReason}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  confirmClose && closeReason
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiLock className="w-4 h-4" />
                <span>Close Encounter</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CloseEncounter;