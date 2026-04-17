import { useState, useEffect } from 'react';
import { FiSearch, FiRotateCcw, FiEdit, FiEye, FiFileText } from 'react-icons/fi';
import api from '../services/api';

const Report = () => {
  const [activeTab, setActiveTab] = useState('report');
  const [reportType, setReportType] = useState('single');
  const [includeSubAccounts, setIncludeSubAccounts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedExaminee, setSelectedExaminee] = useState(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  // Real data states
  const [examinees, setExaminees] = useState([]);
  const [examineeAssessments, setExamineeAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExamineeData, setSelectedExamineeData] = useState(null);
  const [showAssessmentDetails, setShowAssessmentDetails] = useState(false);

  const totalRecords = examinees.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;

  // Fetch examinees from API
  useEffect(() => {
    fetchExaminees();
  }, []);

  const fetchExaminees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/examinees');
      if (response.success && Array.isArray(response.data)) {
        setExaminees(response.data);
      } else if (Array.isArray(response)) {
        setExaminees(response);
      }
    } catch (error) {
      console.error('Error fetching examinees:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle examinee selection - assessments already included in examinee data
  const handleExamineeSelect = (examinee) => {
    if (selectedExaminee === examinee.id) {
      setSelectedExaminee(null);
      setSelectedExamineeData(null);
      setExamineeAssessments([]);
      setShowAssessmentDetails(false);
      return;
    }
    
    setSelectedExaminee(examinee.id);
    setSelectedExamineeData(examinee);
    // Assessments already included in examinee data from API
    setExamineeAssessments(examinee.assessments || []);
    setShowAssessmentDetails(true);
  };

  const handleGenerateReport = () => {
    if (!selectedExaminee) {
      alert('Please select an examinee first');
      return;
    }
    if (examineeAssessments.length === 0) {
      alert('No assessments found for this examinee. Please create an assessment first.');
      return;
    }
    alert(`Generating report for ${selectedExamineeData?.firstName} ${selectedExamineeData?.lastName} with ${examineeAssessments.length} assessment(s)`);
  };

  const handleEditAssessment = (assessment) => {
    alert(`Edit assessment: ${assessment.name || assessment.assessment_name}`);
    // TODO: Navigate to assessment edit page or open modal
  };

  const handleViewAssessment = (assessment) => {
    alert(`View assessment details:\n${assessment.name || assessment.assessment_name}\nDate: ${assessment.date || assessment.scheduled_date}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border">
        {/* Tabs */}
        <div className="flex border-b bg-gradient-to-r from-green-50 to-green-100">
          <button
            onClick={() => setActiveTab('examinee')}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'examinee'
                ? 'bg-white text-gray-800 border-t-2 border-l border-r border-gray-300'
                : 'text-gray-600 hover:bg-green-200'
            }`}
          >
            Examinee
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'group'
                ? 'bg-white text-gray-800 border-t-2 border-l border-r border-gray-300'
                : 'text-gray-600 hover:bg-green-200'
            }`}
          >
            Group Administration
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'report'
                ? 'bg-white text-gray-800 border-t-2 border-l border-r border-gray-300'
                : 'text-gray-600 hover:bg-green-200'
            }`}
          >
            Report
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Generate Report</h1>

          {/* Report Type Selection */}
          <div className="space-y-3 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="reportType"
                value="single"
                checked={reportType === 'single'}
                onChange={(e) => setReportType(e.target.value)}
                className="mt-1"
              />
              <span className="text-sm text-gray-700">
                Generate a report for one Examinee.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="reportType"
                value="multiple"
                checked={reportType === 'multiple'}
                onChange={(e) => setReportType(e.target.value)}
                className="mt-1"
              />
              <div className="text-sm text-gray-700">
                <p>Generate a report type that includes more than one Examinee.</p>
                <p className="text-gray-500 mt-1">
                  Reports that include more than one Examinee are processed in a queue for later download.{" "}
                  <a href="#" className="text-blue-600 hover:underline">Download processed reports here.</a>
                </p>
              </div>
            </label>
          </div>

          <hr className="border-gray-200 my-6" />

          {/* Search Section */}
          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-4">
              Select an Examinee with reportable assessment records.
            </p>

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded border border-green-300 text-sm font-medium transition-colors"
              >
                <FiSearch className="w-4 h-4" />
                Advanced Examinee Search
              </button>
            </div>

            {showAdvancedSearch && (
              <div className="bg-gray-50 p-4 rounded-lg border mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Last Name:</label>
                    <input type="text" className="w-full px-3 py-2 text-sm border rounded" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">First Name:</label>
                    <input type="text" className="w-full px-3 py-2 text-sm border rounded" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Examinee ID:</label>
                    <input type="text" className="w-full px-3 py-2 text-sm border rounded" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    Search
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
                    Clear
                  </button>
                </div>
              </div>
            )}

            <label className="flex items-center gap-2 text-sm text-gray-700 mb-4">
              <input
                type="checkbox"
                checked={includeSubAccounts}
                onChange={(e) => setIncludeSubAccounts(e.target.checked)}
                className="rounded border-gray-300"
              />
              Include Sub-Accounts
            </label>
          </div>

          {/* Table Controls */}
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm">
              <FiRotateCcw className="w-4 h-4" />
              Reset Sort Order
            </button>
            <span className="text-sm font-semibold text-gray-700">{totalRecords} Records</span>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3 border-b border-r text-center w-12">#</th>
                  <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                    System ID
                  </th>
                  <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                    Last Name
                  </th>
                  <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                    First Name
                  </th>
                  <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                    Examinee ID
                  </th>
                  <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                    Birth Date
                  </th>
                  <th className="px-3 py-3 border-b text-center font-semibold text-gray-700">
                    Gender
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-3 py-8 text-center text-gray-500">
                      Loading examinees...
                    </td>
                  </tr>
                ) : examinees.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-3 py-8 text-center text-gray-500">
                      No examinees found. Please add examinees first.
                    </td>
                  </tr>
                ) : (
                  examinees.map((examinee, index) => (
                    <tr
                      key={examinee.id}
                      className={`hover:bg-blue-50 cursor-pointer border-b last:border-b-0 ${
                        selectedExaminee === examinee.id ? 'bg-blue-100' : ''
                      }`}
                      onClick={() => handleExamineeSelect(examinee)}
                    >
                      <td className="px-3 py-3 border-r text-center text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-3 py-3 border-r text-center">
                        <input
                          type="checkbox"
                          checked={selectedExaminee === examinee.id}
                          onChange={() => handleExamineeSelect(examinee)}
                          className="rounded border-gray-300"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-3 py-3 border-r text-center text-gray-700">
                        {examinee.systemId || examinee.system_id || `SYS${String(examinee.id).padStart(6, '0')}`}
                      </td>
                      <td className="px-3 py-3 border-r text-center text-gray-700">
                        {examinee.lastName || examinee.last_name}
                      </td>
                      <td className="px-3 py-3 border-r text-center text-gray-700">
                        {examinee.firstName || examinee.first_name}
                      </td>
                      <td className="px-3 py-3 border-r text-center text-gray-700">
                        {examinee.examineeId || examinee.examinee_id || examinee.student_id}
                      </td>
                      <td className="px-3 py-3 border-r text-center text-gray-700">
                        {examinee.birthDate || examinee.date_of_birth || examinee.dob}
                      </td>
                      <td className="px-3 py-3 text-center text-gray-700">
                        {examinee.gender}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 border rounded hover:bg-gray-100">|&lt;</button>
              <button className="px-2 py-1 border rounded hover:bg-gray-100">&lt;&lt;</button>
              <button className="px-2 py-1 border rounded hover:bg-gray-100">&lt;</button>
              <span>Page</span>
              <input
                type="text"
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value) || 1)}
                className="w-12 px-2 py-1 border rounded text-center text-sm"
              />
              <span>of {totalPages}</span>
              <button className="px-2 py-1 border rounded hover:bg-gray-100">&gt;</button>
              <button className="px-2 py-1 border rounded hover:bg-gray-100">&gt;&gt;</button>
              <button className="px-2 py-1 border rounded hover:bg-gray-100">&gt;|</button>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="ml-4 px-2 py-1 border rounded text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              View 1 - {Math.min(itemsPerPage, totalRecords)} of {totalRecords}
            </div>
          </div>

          {/* Assessment Details Section - Shows when examinee is selected */}
          {showAssessmentDetails && selectedExamineeData && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-blue-800">
                  <FiFileText className="inline mr-2" />
                  Assessments for {selectedExamineeData.firstName || selectedExamineeData.first_name} {selectedExamineeData.lastName || selectedExamineeData.last_name}
                </h3>
                <span className="text-sm text-blue-600">
                  {examineeAssessments.length} assessment(s) found
                </span>
              </div>
              
              {examineeAssessments.length === 0 ? (
                <div className="bg-white rounded-lg p-4 text-center text-gray-500">
                  No assessments found for this examinee.
                  <br />
                  <span className="text-sm">Please create an assessment from the Examinees section first.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {examineeAssessments.map((assessment, idx) => (
                    <div key={assessment.id || idx} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {assessment.name || assessment.assessment_name || `Assessment #${idx + 1}`}
                          </h4>
                          <div className="text-sm text-gray-600 mt-1 space-x-4">
                            <span>📅 {(assessment.date || assessment.scheduled_date) ? new Date(assessment.date || assessment.scheduled_date).toLocaleDateString() : 'No date'}</span>
                            <span>👤 {assessment.examiner || assessment.examiner_name || 'No examiner'}</span>
                            <span>📝 {assessment.deliveryMethod || assessment.delivery_method || 'Manual Entry'}</span>
                            <span className={`px-2 py-1 rounded text-xs ${assessment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {assessment.status || 'Pending'}
                            </span>
                          </div>
                          {assessment.price && (
                            <div className="text-sm text-green-600 mt-1">
                              💰 ₹{assessment.price}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleViewAssessment(assessment)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEditAssessment(assessment)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded transition-colors"
                            title="Edit Assessment"
                          >
                            <FiEdit className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Generate Report Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleGenerateReport}
              disabled={!selectedExaminee || examineeAssessments.length === 0}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Generate Report ({examineeAssessments.length} assessment{examineeAssessments.length !== 1 ? 's' : ''})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
