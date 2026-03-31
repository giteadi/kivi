import { useState } from 'react';
import { FiPlus, FiTrash2, FiAlertTriangle, FiSearch, FiRotateCcw } from 'react-icons/fi';

const ExamineeGroupReport = () => {
  const [activeTab, setActiveTab] = useState('group');
  
  // Group Administration state
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [includeSubAccounts, setIncludeSubAccounts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Examinee Search state
  const [examinees, setExaminees] = useState([
    { id: 1, systemId: '30816596', lastName: 'Sharma', firstName: 'Aditya', examineeId: 'as/msl/260331', birthDate: '23/05/2000', gender: 'Male' },
    { id: 2, systemId: '30664804', lastName: 'Sh', firstName: 'Aditya Sh', examineeId: 'as/msl/2234', birthDate: '20/02/2015', gender: 'Male' },
    { id: 3, systemId: '30770350', lastName: 'Chamariya', firstName: 'Darsh', examineeId: 'DC/MSL/260318', birthDate: '16/10/2013', gender: 'Male' },
    { id: 4, systemId: '30746724', lastName: 'Sharma', firstName: 'Devraj', examineeId: 'DS/MSL/260312', birthDate: '08/01/2014', gender: 'Male' },
    { id: 5, systemId: '30742268', lastName: 'Giki', firstName: 'Mudassar', examineeId: 'MG/MSL/260307', birthDate: '17/01/2020', gender: 'Male' },
  ]);
  const [selectedExaminee, setSelectedExaminee] = useState(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [examineeCurrentPage, setExamineeCurrentPage] = useState(1);
  const [examineeItemsPerPage, setExamineeItemsPerPage] = useState(10);

  // Report state
  const [reportType, setReportType] = useState('single');
  const [reportIncludeSubAccounts, setReportIncludeSubAccounts] = useState(false);

  const totalRecords = 210;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const examineeTotalPages = Math.ceil(totalRecords / examineeItemsPerPage);

  // Group handlers
  const handleNewGroup = () => {
    alert('New Group functionality to be implemented');
  };

  const handleDeleteGroup = () => {
    if (selectedGroups.length === 0) {
      alert('Please select at least one group to delete');
      return;
    }
    alert(`Delete ${selectedGroups.length} group(s)`);
  };

  const handleSelectGroup = (groupId) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Examinee handlers
  const handleExamineeSelect = (examineeId) => {
    setSelectedExaminee(examineeId === selectedExaminee ? null : examineeId);
  };

  const handleGenerateReport = () => {
    if (!selectedExaminee) {
      alert('Please select an examinee first');
      return;
    }
    alert(`Generating report for examinee ID: ${selectedExaminee}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex mb-0">
          <button
            onClick={() => setActiveTab('examinee')}
            className={`px-6 py-2 text-sm font-semibold rounded-t-lg border-t border-l border-r transition-all ${
              activeTab === 'examinee'
                ? 'bg-white text-gray-800'
                : 'bg-green-100 text-gray-700 hover:bg-green-200'
            }`}
          >
            Examinee
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`px-6 py-2 text-sm font-semibold rounded-t-lg border-t border-l border-r transition-all ${
              activeTab === 'group'
                ? 'bg-white text-gray-800'
                : 'bg-green-100 text-gray-700 hover:bg-green-200'
            }`}
          >
            Group Administration
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-6 py-2 text-sm font-semibold rounded-t-lg border-t border-l border-r transition-all ${
              activeTab === 'report'
                ? 'bg-white text-gray-800'
                : 'bg-green-100 text-gray-700 hover:bg-green-200'
            }`}
          >
            Report
          </button>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-b-lg rounded-tr-lg shadow-lg border">
          
          {/* Examinee Tab Content */}
          {activeTab === 'examinee' && (
            <div className="p-6">
              <h1 className="text-xl font-bold text-blue-800 mb-4">Advanced Examinee Search</h1>
              
              <p className="text-sm text-gray-700 mb-4">
                Select an Examinee to view details or perform actions.
              </p>

              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded border border-green-300 text-sm font-medium transition-colors"
                >
                  <FiSearch className="w-4 h-4" />
                  Advanced Search
                </button>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={includeSubAccounts}
                    onChange={(e) => setIncludeSubAccounts(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Include Sub-Accounts
                </label>
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

              {/* Examinee Table */}
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-3 border-b border-r text-center w-12">#</th>
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">System ID</th>
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">Last Name</th>
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">First Name</th>
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">Examinee ID</th>
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">Birth Date</th>
                      <th className="px-3 py-3 border-b text-center font-semibold text-gray-700">Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examinees.map((examinee, index) => (
                      <tr
                        key={examinee.id}
                        className={`hover:bg-blue-50 cursor-pointer border-b last:border-b-0 ${
                          selectedExaminee === examinee.id ? 'bg-blue-100' : ''
                        }`}
                        onClick={() => handleExamineeSelect(examinee.id)}
                      >
                        <td className="px-3 py-3 border-r text-center text-gray-700">{index + 1}</td>
                        <td className="px-3 py-3 border-r text-center">
                          <input
                            type="checkbox"
                            checked={selectedExaminee === examinee.id}
                            onChange={() => handleExamineeSelect(examinee.id)}
                            className="rounded border-gray-300"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="px-3 py-3 border-r text-center text-gray-700">{examinee.systemId}</td>
                        <td className="px-3 py-3 border-r text-center text-gray-700">{examinee.lastName}</td>
                        <td className="px-3 py-3 border-r text-center text-gray-700">{examinee.firstName}</td>
                        <td className="px-3 py-3 border-r text-center text-gray-700">{examinee.examineeId}</td>
                        <td className="px-3 py-3 border-r text-center text-gray-700">{examinee.birthDate}</td>
                        <td className="px-3 py-3 text-center text-gray-700">{examinee.gender}</td>
                      </tr>
                    ))}
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
                    value={examineeCurrentPage}
                    onChange={(e) => setExamineeCurrentPage(Number(e.target.value) || 1)}
                    className="w-12 px-2 py-1 border rounded text-center text-sm"
                  />
                  <span>of {examineeTotalPages}</span>
                  <button className="px-2 py-1 border rounded hover:bg-gray-100">&gt;</button>
                  <button className="px-2 py-1 border rounded hover:bg-gray-100">&gt;&gt;</button>
                  <button className="px-2 py-1 border rounded hover:bg-gray-100">&gt;|</button>
                  <select
                    value={examineeItemsPerPage}
                    onChange={(e) => setExamineeItemsPerPage(Number(e.target.value))}
                    className="ml-4 px-2 py-1 border rounded text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  View 1 - {Math.min(examineeItemsPerPage, totalRecords)} of {totalRecords}
                </div>
              </div>
            </div>
          )}

          {/* Group Administration Tab Content */}
          {activeTab === 'group' && (
            <div className="p-6">
              <h1 className="text-xl font-bold text-blue-800 mb-2">Group Administration</h1>
              <p className="text-sm text-gray-600 mb-4">
                Below is a list of current groups. Click on a group row to select the group. Access rosters, a list of Examinees in group, and the assessment list from the group's page.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={handleNewGroup}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded border border-green-300 text-sm font-medium transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  New Group
                </button>
                <button
                  onClick={handleDeleteGroup}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 text-sm font-medium transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete Group
                </button>
                <label className="flex items-center gap-2 text-sm text-gray-700 ml-4">
                  <input
                    type="checkbox"
                    checked={includeSubAccounts}
                    onChange={(e) => setIncludeSubAccounts(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Include Sub-Accounts
                </label>
              </div>

              {/* No Records Message */}
              {groups.length === 0 && (
                <div className="flex items-center gap-2 text-yellow-600 mb-4">
                  <FiAlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-medium">No records were found.</span>
                </div>
              )}

              {/* Group Table */}
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-3 border-b border-r text-center w-12">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">System ID</th>
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">Group Name</th>
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">Number of Assessments</th>
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">Number of Examinees</th>
                      <th className="px-3 py-3 border-b text-center font-semibold text-gray-700">Account Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="6" className="px-3 py-8 text-center text-gray-500 text-sm">
                        No records to view
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>Page</span>
                  <input
                    type="text"
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value) || 1)}
                    className="w-12 px-2 py-1 border rounded text-center text-sm"
                  />
                  <span>of {totalPages}</span>
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
                  No records to view
                </div>
              </div>
            </div>
          )}

          {/* Report Tab Content */}
          {activeTab === 'report' && (
            <div className="p-6">
              <h1 className="text-xl font-bold text-blue-800 mb-4">Generate Report</h1>

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

                <label className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                  <input
                    type="checkbox"
                    checked={reportIncludeSubAccounts}
                    onChange={(e) => setReportIncludeSubAccounts(e.target.checked)}
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
                <span className="text-sm font-semibold text-gray-700">210 Records</span>
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
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">System ID</th>
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">Last Name</th>
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">First Name</th>
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">Examinee ID</th>
                      <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">Birth Date</th>
                      <th className="px-3 py-3 border-b text-center font-semibold text-gray-700">Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examinees.map((examinee, index) => (
                      <tr
                        key={examinee.id}
                        className={`hover:bg-blue-50 cursor-pointer border-b last:border-b-0 ${
                          selectedExaminee === examinee.id ? 'bg-blue-100' : ''
                        }`}
                        onClick={() => handleExamineeSelect(examinee.id)}
                      >
                        <td className="px-3 py-3 border-r text-center text-gray-700">{index + 1}</td>
                        <td className="px-3 py-3 border-r text-center">
                          <input
                            type="checkbox"
                            checked={selectedExaminee === examinee.id}
                            onChange={() => handleExamineeSelect(examinee.id)}
                            className="rounded border-gray-300"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="px-3 py-3 border-r text-center text-gray-700">{examinee.systemId}</td>
                        <td className="px-3 py-3 border-r text-center text-gray-700">{examinee.lastName}</td>
                        <td className="px-3 py-3 border-r text-center text-gray-700">{examinee.firstName}</td>
                        <td className="px-3 py-3 border-r text-center text-gray-700">{examinee.examineeId}</td>
                        <td className="px-3 py-3 border-r text-center text-gray-700">{examinee.birthDate}</td>
                        <td className="px-3 py-3 text-center text-gray-700">{examinee.gender}</td>
                      </tr>
                    ))}
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
                    value={examineeCurrentPage}
                    onChange={(e) => setExamineeCurrentPage(Number(e.target.value) || 1)}
                    className="w-12 px-2 py-1 border rounded text-center text-sm"
                  />
                  <span>of {examineeTotalPages}</span>
                  <button className="px-2 py-1 border rounded hover:bg-gray-100">&gt;</button>
                  <button className="px-2 py-1 border rounded hover:bg-gray-100">&gt;&gt;</button>
                  <button className="px-2 py-1 border rounded hover:bg-gray-100">&gt;|</button>
                  <select
                    value={examineeItemsPerPage}
                    onChange={(e) => setExamineeItemsPerPage(Number(e.target.value))}
                    className="ml-4 px-2 py-1 border rounded text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  View 1 - {Math.min(examineeItemsPerPage, totalRecords)} of {totalRecords}
                </div>
              </div>

              {/* Generate Report Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleGenerateReport}
                  disabled={!selectedExaminee}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Generate Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamineeGroupReport;
