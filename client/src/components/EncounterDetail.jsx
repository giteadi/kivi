import { motion } from 'framer-motion';
import { FiArrowLeft, FiMail, FiMapPin, FiUser, FiTrash2 } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import api from '../services/api';
import BodyChart from './BodyChart';
import PrintEncounter from './PrintEncounter';
import CloseEncounter from './CloseEncounter';

const EncounterDetail = ({ encounterId, onBack }) => {
  console.log('🔍 EncounterDetail: Component initialized with encounterId:', encounterId);

  const [activeTab, setActiveTab] = useState('clinical-details');
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [problems, setProblems] = useState([]);
  const [observations, setObservations] = useState([]);
  const [recommendedNotes, setRecommendedNotes] = useState([]);
  const [problemsText, setProblemsText] = useState('');
  const [observationsText, setObservationsText] = useState('');
  const [bodyChartAnnotations, setBodyChartAnnotations] = useState([]);

  // Fetch session data when component mounts
  useEffect(() => {
    console.log('🔍 EncounterDetail: useEffect triggered, encounterId:', encounterId);

    const fetchData = async () => {
      if (!encounterId) {
        console.log('🔍 EncounterDetail: No encounterId provided, setting loading to false');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 EncounterDetail: Fetching session data for ID:', encounterId);
        const response = await api.request(`/sessions/${encounterId}`);
        console.log('🔍 EncounterDetail: API response received:', response);

        if (response.success) {
          const session = response.data;
          console.log('🔍 EncounterDetail: Session data received:', session);
          setSessionData(session);

          // Set initial data from session
          const initialNotes = session.notes || '';
          const initialProblemsText = session.session_goals || '';
          const initialObservationsText = session.materials_needed || '';
          const initialRecommendedNotes = session.preparation_notes ? [session.preparation_notes] : [];

          console.log('🔍 EncounterDetail: Setting initial data:', {
            notes: initialNotes,
            problemsText: initialProblemsText,
            observationsText: initialObservationsText,
            recommendedNotes: initialRecommendedNotes
          });

          setNotes(initialNotes);
          setProblemsText(initialProblemsText);
          setObservationsText(initialObservationsText);
          setProblems(initialProblemsText ? [{ id: Date.now(), text: initialProblemsText }] : []);
          setObservations(initialObservationsText ? [{ id: Date.now(), text: initialObservationsText }] : []);
          setRecommendedNotes(initialRecommendedNotes);

          // Now check if there's an existing encounter for this session
          console.log('🔍 EncounterDetail: Checking for existing encounter data...');
          console.log('🔍 EncounterDetail: Current session ID:', encounterId);
          try {
            const encountersResponse = await api.request('/encounters', {
              method: 'GET'
            });
            console.log('🔍 EncounterDetail: Encounters API response:', encountersResponse);
            console.log('🔍 EncounterDetail: Number of encounters found:', encountersResponse.data?.length || 0);

            if (encountersResponse.success && encountersResponse.data) {
              console.log('🔍 EncounterDetail: All encounters:', encountersResponse.data.map(enc => ({ id: enc.id, session_id: enc.session_id, has_body_annotations: !!enc.body_chart_annotations })));
              
              // Find encounters for this session
              const sessionEncounters = encountersResponse.data.filter(enc => enc.session_id == encounterId);
              console.log('🔍 EncounterDetail: Encounters for this session:', sessionEncounters.length);
              
              // Find the most recent encounter that has body chart annotations, or the most recent one if none have annotations
              let existingEncounter = null;
              
              // First try to find the most recent encounter with body chart annotations
              const encountersWithAnnotations = sessionEncounters.filter(enc => enc.body_chart_annotations);
              if (encountersWithAnnotations.length > 0) {
                // Sort by ID descending (most recent first)
                encountersWithAnnotations.sort((a, b) => b.id - a.id);
                existingEncounter = encountersWithAnnotations[0];
                console.log('🔍 EncounterDetail: Found most recent encounter with annotations:', existingEncounter.id);
              } else {
                // If no encounters have annotations, use the most recent encounter
                sessionEncounters.sort((a, b) => b.id - a.id);
                existingEncounter = sessionEncounters[0];
                console.log('🔍 EncounterDetail: Found most recent encounter (no annotations):', existingEncounter.id);
              }
              
              console.log('🔍 EncounterDetail: Using encounter:', existingEncounter);

              if (existingEncounter) {
                console.log('🔍 EncounterDetail: Found existing encounter:', existingEncounter);
                console.log('🔍 EncounterDetail: Encounter ID:', existingEncounter.id);
                console.log('🔍 EncounterDetail: Session ID in encounter:', existingEncounter.session_id);
                console.log('🔍 EncounterDetail: Checking body_chart_annotations:', existingEncounter.body_chart_annotations);
                console.log('🔍 EncounterDetail: body_chart_annotations type:', typeof existingEncounter.body_chart_annotations);
                console.log('🔍 EncounterDetail: All encounter keys:', Object.keys(existingEncounter));
                
                // Load the saved encounter data
                setProblemsText(existingEncounter.session_goals || '');
                setObservationsText(existingEncounter.behavioral_observations || '');
                setNotes(existingEncounter.progress_notes || '');
                setRecommendedNotes(existingEncounter.recommendations ? [existingEncounter.recommendations] : []);
                
                // Load body chart annotations if available
                if (existingEncounter.body_chart_annotations) {
                  try {
                    console.log('🔍 EncounterDetail: Raw body_chart_annotations from DB:', existingEncounter.body_chart_annotations);
                    const annotations = JSON.parse(existingEncounter.body_chart_annotations);
                    console.log('🔍 EncounterDetail: Parsed body chart annotations:', annotations);
                    console.log('🔍 EncounterDetail: Annotations array length:', annotations.length);
                    setBodyChartAnnotations(annotations);
                    console.log('🔍 EncounterDetail: Set bodyChartAnnotations state successfully');
                  } catch (parseError) {
                    console.error('🔍 EncounterDetail: Error parsing body chart annotations:', parseError);
                    console.error('🔍 EncounterDetail: Raw data that failed to parse:', existingEncounter.body_chart_annotations);
                    setBodyChartAnnotations([]);
                  }
                } else {
                  console.log('🔍 EncounterDetail: No body_chart_annotations field found in encounter data');
                  console.log('🔍 EncounterDetail: Available fields in encounter:', Object.keys(existingEncounter));
                  setBodyChartAnnotations([]);
                }
                
                // Update the arrays for saving
                setProblems(existingEncounter.session_goals ? [{ id: existingEncounter.id, text: existingEncounter.session_goals }] : []);
                setObservations(existingEncounter.behavioral_observations ? [{ id: existingEncounter.id, text: existingEncounter.behavioral_observations }] : []);
                
                console.log('🔍 EncounterDetail: Loaded saved encounter data');
              } else {
                console.log('🔍 EncounterDetail: No existing encounter found for this session');
              }
            }
          } catch (encounterError) {
            console.error('🔍 EncounterDetail: Error checking for existing encounters:', encounterError);
            // Continue with session data only - don't fail the whole component
          }
        } else {
          console.error('🔍 EncounterDetail: API returned error:', response);
        }
      } catch (error) {
        console.error('🔍 EncounterDetail: Error fetching session data:', error);
      } finally {
        console.log('🔍 EncounterDetail: Setting loading to false');
        setLoading(false);
      }
    };

    fetchData();
  }, [encounterId]);

  console.log('🔍 EncounterDetail: Current state:', {
    activeTab,
    loading,
    sessionData: sessionData ? 'present' : 'null',
    notes,
    problemsCount: problems.length,
    observationsCount: observations.length,
    recommendedNotesCount: recommendedNotes.length,
    problemsText: problemsText.substring(0, 50) + (problemsText.length > 50 ? '...' : ''),
    observationsText: observationsText.substring(0, 50) + (observationsText.length > 50 ? '...' : '')
  });

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
    console.log('🔍 EncounterDetail: handleSave called');

    try {
      // Prepare encounter data for saving
      const encounterData = {
        session_id: encounterId,
        student_id: sessionData.student_id,
        therapist_id: sessionData.therapist_id,
        centre_id: sessionData.centre_id,
        encounter_date: sessionData.session_date ? new Date(sessionData.session_date).toISOString().split('T')[0] : null,
        encounter_time: sessionData.session_time,
        session_goals: problems.map(p => p.text).join('\n'),
        behavioral_observations: observations.map(o => o.text).join('\n'),
        progress_notes: notes,
        recommendations: recommendedNotes.join('\n'),
        body_chart_annotations: JSON.stringify(bodyChartAnnotations),
        status: 'completed'
      };

      console.log('🔍 EncounterDetail: Prepared encounter data for saving:', encounterData);

      // Save encounter data
      const response = await api.request('/encounters', {
        method: 'POST',
        body: JSON.stringify(encounterData)
      });

      console.log('🔍 EncounterDetail: Save API response:', response);

      if (response.success) {
        console.log('🔍 EncounterDetail: Encounter data saved successfully');
        alert('Encounter data saved successfully');
        onBack();
      } else {
        console.error('🔍 EncounterDetail: Failed to save encounter data:', response);
        alert('Failed to save encounter data');
      }
    } catch (error) {
      console.error('🔍 EncounterDetail: Error saving encounter data:', error);
      alert('Error saving encounter data');
    }
  };

  const handleSaveProgress = async () => {
    console.log('🔍 EncounterDetail: handleSaveProgress called');

    try {
      // Prepare progress data for saving (draft status)
      const progressData = {
        session_id: encounterId,
        student_id: sessionData.student_id,
        therapist_id: sessionData.therapist_id,
        centre_id: sessionData.centre_id,
        encounter_date: sessionData.session_date ? new Date(sessionData.session_date).toISOString().split('T')[0] : null,
        encounter_time: sessionData.session_time,
        session_goals: problemsText,
        behavioral_observations: observationsText,
        progress_notes: notes,
        recommendations: recommendedNotes.join('\n'),
        body_chart_annotations: JSON.stringify(bodyChartAnnotations),
        status: 'draft' // Save as draft, not completed
      };

      console.log('🔍 EncounterDetail: Prepared progress data for saving:', progressData);

      // Save progress data
      const response = await api.request('/encounters', {
        method: 'POST',
        body: JSON.stringify(progressData)
      });

      console.log('🔍 EncounterDetail: Save progress API response:', response);

      if (response.success) {
        console.log('🔍 EncounterDetail: Progress saved successfully');
        alert('Progress saved successfully! You can continue working or close the encounter later.');
      } else {
        console.error('🔍 EncounterDetail: Failed to save progress:', response);
        alert('Failed to save progress. Please try again.');
      }
    } catch (error) {
      console.error('🔍 EncounterDetail: Error saving progress:', error);
      alert('Error saving progress. Please try again.');
    }
  };

  const renderTabContent = () => {
    console.log('🔍 EncounterDetail: renderTabContent called with activeTab:', activeTab);

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
                        <strong>Note:</strong> Write the patient's problems or concerns below
                      </p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Problems/Concerns</h4>
                      <textarea
                        placeholder="Describe the patient's problems, concerns, or issues..."
                        className="w-full p-3 border rounded-lg resize-none h-32"
                        rows="4"
                        value={problemsText}
                        onChange={(e) => {
                          const text = e.target.value;
                          setProblemsText(text);
                          // Also update the problems array for saving
                          setProblems(text ? [{ id: problems[0]?.id || Date.now(), text: text }] : []);
                        }}
                      />
                    </div>
                  </div>

                  {/* Observations */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Observations</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-600 text-sm">
                        <strong>Note:</strong> Write your behavioral observations and findings below
                      </p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Behavioral Observations</h4>
                      <textarea
                        placeholder="Describe your behavioral observations, patient responses, or clinical findings..."
                        className="w-full p-3 border rounded-lg resize-none h-32"
                        rows="4"
                        value={observationsText}
                        onChange={(e) => {
                          const text = e.target.value;
                          setObservationsText(text);
                          // Also update the observations array for saving
                          setObservations(text ? [{ id: observations[0]?.id || Date.now(), text: text }] : []);
                        }}
                      />
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
                      <div className="flex justify-between items-center mt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSaveProgress}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                        >
                          Save Progress
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                        >
                          Add
                        </motion.button>
                      </div>
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
            <BodyChart 
              sessionData={sessionData}
              onAnnotationsChange={setBodyChartAnnotations}
              initialAnnotations={bodyChartAnnotations}
            />
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