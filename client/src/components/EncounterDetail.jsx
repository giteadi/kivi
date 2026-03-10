import { motion } from 'framer-motion';
import { FiArrowLeft, FiMail, FiMapPin, FiUser, FiTrash2 } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import api from '../services/api';
import BodyChart from './BodyChart';
import PrintEncounter from './PrintEncounter';
import CloseEncounter from './CloseEncounter';

const EncounterDetail = ({ encounterId, onBack }) => {
  const [activeTab, setActiveTab] = useState('clinical-details');
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [problems, setProblems] = useState([]);
  const [observations, setObservations] = useState([]);
  const [recommendedNotes, setRecommendedNotes] = useState([]);

  // Fetch session data when component mounts
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!encounterId) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching session data for ID:', encounterId);
        const response = await api.request(`/sessions/${encounterId}`);
        console.log('API response:', response);
        
        if (response.success) {
          const session = response.data;
          console.log('Session data:', session);
          setSessionData(session);
          
          // Set initial data from session
          setNotes(session.notes || '');
          setProblems(session.session_goals ? [{ id: 1, text: session.session_goals }] : []);
          setObservations(session.materials_needed ? [{ id: 1, text: session.materials_needed }] : []);
          setRecommendedNotes(session.preparation_notes ? [session.preparation_notes] : []);
        } else {
          console.error('API returned error:', response);
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [encounterId]);

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading session data...</span>
      </div>
    );
  }

  // Show error state if no session data
  if (!sessionData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Session not found</h3>
          <p className="text-gray-600 mb-4">The session you're looking for doesn't exist.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Use real session data
  const patientData = {
    name: sessionData.student_first_name && sessionData.student_last_name 
      ? `${sessionData.student_first_name} ${sessionData.student_last_name}` 
      : 'Unknown Student',
    email: sessionData.student_email || 'No email available',
    encounterDate: sessionData.session_date 
      ? new Date(sessionData.session_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : 'Unknown Date',
    address: sessionData.centre_name || 'No address available'
  };

  const clinicData = {
    name: sessionData.centre_name || 'Unknown Centre',
    doctor: sessionData.therapist_first_name && sessionData.therapist_last_name
      ? `${sessionData.therapist_first_name} ${sessionData.therapist_last_name}`
      : 'Unknown Therapist'
  };

  const tabs = [
    { id: 'clinical-details', label: 'Clinical Details', color: 'blue' },
    { id: 'body-chart', label: 'Body Chart', color: 'blue' },
    { id: 'print-encounter', label: 'Print Encounter', color: 'blue' },
    { id: 'close-encounter', label: 'Close Encounter', color: 'red' }
  ];

  const handleSave = async () => {
    try {
      // Prepare encounter data for saving
      const encounterData = {
        session_id: encounterId,
        student_id: sessionData.student_id,
        therapist_id: sessionData.therapist_id,
        centre_id: sessionData.centre_id,
        encounter_date: sessionData.session_date,
        encounter_time: sessionData.session_time,
        session_goals: problems.map(p => p.text).join('\n'),
        behavioral_observations: observations.map(o => o.text).join('\n'),
        progress_notes: notes,
        recommendations: recommendedNotes.join('\n'),
        status: 'completed'
      };

      // Save encounter data
      const response = await api.request('/encounters', {
        method: 'POST',
        body: JSON.stringify(encounterData)
      });

      if (response.success) {
        alert('Encounter data saved successfully');
        onBack();
      } else {
        alert('Failed to save encounter data');
      }
    } catch (error) {
      console.error('Error saving encounter data:', error);
      alert('Error saving encounter data');
    }
  };

  const handleCloseEncounter = () => {
    // In a real app, this would close the encounter and navigate back
    alert('Encounter closed successfully');
    onBack();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'clinical-details':
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Patient & Clinic Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* About Patient */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">About Patient</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-700">P</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{patientData.name}</h4>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <FiMail className="w-3 h-3" />
                          <span>{patientData.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Encounter Date:</span>
                        <p className="font-medium text-gray-800">{patientData.encounterDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Address:</span>
                        <p className="font-medium text-gray-800">{patientData.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Clinic */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">About Clinic</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-700">C</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{clinicData.name}</h4>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <FiUser className="w-3 h-3" />
                          <span>{clinicData.doctor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Session Details</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><strong>Programme:</strong> {sessionData.programme_name || 'Not specified'}</div>
                    <div><strong>Time:</strong> {sessionData.session_time || 'Not set'} ({sessionData.duration || 0} minutes)</div>
                    <div><strong>Type:</strong> {sessionData.session_type || 'Not specified'}</div>
                    <div><strong>Status:</strong> {sessionData.status || 'Unknown'}</div>
                  </div>
                </div>
              </div>

              {/* Right Columns - Problems, Observations, Notes */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Problems */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Problems</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-600 text-sm">
                        <strong>Note:</strong> Type and press enter to create new problem
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Select Problems</h4>
                      <select className="w-full p-2 border rounded-lg text-gray-600">
                        <option>Select or type to add problem</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      {problems.map((problem, index) => (
                        <div key={problem.id} className="flex items-start space-x-2">
                          <span className="text-sm text-gray-500 mt-1">{index + 1}.</span>
                          <div className="flex-1 flex items-start justify-between">
                            <p className="text-sm text-gray-700">{problem.text}</p>
                            <button className="text-red-500 hover:text-red-700 ml-2">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observations */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Observations</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-600 text-sm">
                        <strong>Note:</strong> Type and press enter to create new observation
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Select Observations</h4>
                      <select className="w-full p-2 border rounded-lg text-gray-600">
                        <option>Select or type to add observation</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      {observations.map((observation, index) => (
                        <div key={observation.id} className="flex items-start space-x-2">
                          <span className="text-sm text-gray-500 mt-1">{index + 1}.</span>
                          <div className="flex-1 flex items-start justify-between">
                            <p className="text-sm text-gray-700">{observation.text}</p>
                            <button className="text-red-500 hover:text-red-700 ml-2">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes</h3>
                    
                    <div className="mb-4">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter notes"
                        className="w-full p-3 border rounded-lg resize-none h-24"
                        rows="3"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                      >
                        Add
                      </motion.button>
                    </div>

                    <div className="space-y-3">
                      {recommendedNotes.map((note, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <span className="text-sm text-gray-500 mt-1">{index + 1}.</span>
                          <p className="text-sm text-gray-700">{note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'body-chart':
        return (
          <div className="p-6">
            <BodyChart sessionData={sessionData} />
          </div>
        );

      case 'print-encounter':
        return (
          <div className="p-6">
            <PrintEncounter 
              sessionData={sessionData} 
              problems={problems}
              observations={observations}
              notes={notes}
            />
          </div>
        );

      case 'close-encounter':
        return (
          <div className="p-6">
            <CloseEncounter onClose={onBack} onSave={handleSave} sessionData={sessionData} />
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
          </div>
          
          {/* Header Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg border bg-white">
              <FiUser className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Admin</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg border bg-white">
              <img src="https://flagcdn.com/w20/us.png" alt="US Flag" className="w-4 h-3" />
              <span className="text-sm text-gray-600">English (United States)</span>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Encounter List</span>
          <span className="mx-2">›</span>
          <span>Encounter dashboard</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Clinical Details</span>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border"
        >
          {/* Title */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-semibold text-gray-800">Encounter Details</h1>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex space-x-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? tab.color === 'red'
                        ? 'border-red-600 text-red-600 bg-red-50'
                        : 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  } ${tab.color === 'red' && activeTab !== tab.id ? 'hover:text-red-600 hover:bg-red-50' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default EncounterDetail;