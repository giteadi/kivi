import { motion } from 'framer-motion';
import { FiArrowLeft, FiMail, FiMapPin, FiUser, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';
import BodyChart from './BodyChart';
import PrintEncounter from './PrintEncounter';
import CloseEncounter from './CloseEncounter';

const EncounterDetail = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('clinical-details');
  const [notes, setNotes] = useState('');

  const patientData = {
    name: 'Patient Kjaggi',
    email: 'patient_kjaggi@kivicare.com',
    encounterDate: 'February 20, 2026',
    address: '1957 Forest Blvd'
  };

  const clinicData = {
    name: 'Clinic Kjaggi',
    doctor: 'Dr. Kjaggi'
  };

  const problems = [
    {
      id: 1,
      text: 'Family history of hypertension (father) and breast cancer (mother)'
    },
    {
      id: 2,
      text: 'Penicillin allergy - causes rash and difficulty'
    }
  ];

  const observations = [
    {
      id: 1,
      text: 'Mild heart murmur detected during physical exam'
    },
    {
      id: 2,
      text: 'Mild heart murmur detected during physical exam'
    }
  ];

  const recommendedNotes = [
    'Recommended daily exercise and improved dietary habits',
    'Appendectomy performed in 2015 - no complications'
  ];

  const tabs = [
    { id: 'clinical-details', label: 'Clinical Details', color: 'blue' },
    { id: 'body-chart', label: 'Body Chart', color: 'blue' },
    { id: 'print-encounter', label: 'Print Encounter', color: 'blue' },
    { id: 'close-encounter', label: 'Close Encounter', color: 'red' }
  ];

  const handleSave = () => {
    // In a real app, this would save all encounter data
    console.log('Saving encounter data...');
    alert('Encounter data saved successfully');
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 text-sm">Initial consultation and</p>
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
            <BodyChart />
          </div>
        );

      case 'print-encounter':
        return (
          <div className="p-6">
            <PrintEncounter />
          </div>
        );

      case 'close-encounter':
        return (
          <div className="p-6">
            <CloseEncounter onClose={onBack} onSave={handleSave} />
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