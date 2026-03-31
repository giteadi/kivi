import { useState } from 'react';
import { FiSearch, FiRotateCcw } from 'react-icons/fi';

const Report = () => {
  const [activeTab, setActiveTab] = useState('report');
  const [reportType, setReportType] = useState('single');
  const [includeSubAccounts, setIncludeSubAccounts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedExaminee, setSelectedExaminee] = useState(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Mock examinee data
  const examinees = [
    { id: 1, systemId: '30816596', lastName: 'Sharma', firstName: 'Aditya', examineeId: 'as/msl/260331', birthDate: '23/05/2000', gender: 'Male' },
    { id: 2, systemId: '30664804', lastName: 'Sh', firstName: 'Aditya Sh', examineeId: 'as/msl/2234', birthDate: '20/02/2015', gender: 'Male' },
    { id: 3, systemId: '30770350', lastName: 'Chamariya', firstName: 'Darsh', examineeId: 'DC/MSL/260318', birthDate: '16/10/2013', gender: 'Male' },
    { id: 4, systemId: '30746724', lastName: 'Sharma', firstName: 'Devraj', examineeId: 'DS/MSL/260312', birthDate: '08/01/2014', gender: 'Male' },
    { id: 5, systemId: '30742268', lastName: 'Giki', firstName: 'Mudassar', examineeId: 'MG/MSL/260307', birthDate: '17/01/2020', gender: 'Male' },
    { id: 6, systemId: '30740569', lastName: 'Menezes', firstName: 'Ayesha', examineeId: 'AM/MSL/260305', birthDate: '23/10/2008', gender: 'Female' },
    { id: 7, systemId: '30652226', lastName: 'Bosch', firstName: 'Berta', examineeId: 'BB/MSL/260215', birthDate: '30/12/2011', gender: 'Female' },
    { id: 8, systemId: '30591908', lastName: 'Joshi', firstName: 'Anaika', examineeId: 'aj/msl/26311', birthDate: '08/04/2014', gender: 'Female' },
    { id: 9, systemId: '30569914', lastName: 'Nagpal', firstName: 'Himnish', examineeId: 'hn/msl/26120', birthDate: '16/10/2014', gender: 'Male' },
    { id: 10, systemId: '30550546', lastName: 'Rao', firstName: 'Aditya', examineeId: 'AR/MSL/26120', birthDate: '25/01/2018', gender: 'Male' },
  ];

  const totalRecords = 210;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

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
                {examinees.map((examinee, index) => (
                  <tr
                    key={examinee.id}
                    className={`hover:bg-blue-50 cursor-pointer border-b last:border-b-0 ${
                      selectedExaminee === examinee.id ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => handleExamineeSelect(examinee.id)}
                  >
                    <td className="px-3 py-3 border-r text-center text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-3 py-3 border-r text-center">
                      <input
                        type="checkbox"
                        checked={selectedExaminee === examinee.id}
                        onChange={() => handleExamineeSelect(examinee.id)}
                        className="rounded border-gray-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-3 py-3 border-r text-center text-gray-700">
                      {examinee.systemId}
                    </td>
                    <td className="px-3 py-3 border-r text-center text-gray-700">
                      {examinee.lastName}
                    </td>
                    <td className="px-3 py-3 border-r text-center text-gray-700">
                      {examinee.firstName}
                    </td>
                    <td className="px-3 py-3 border-r text-center text-gray-700">
                      {examinee.examineeId}
                    </td>
                    <td className="px-3 py-3 border-r text-center text-gray-700">
                      {examinee.birthDate}
                    </td>
                    <td className="px-3 py-3 text-center text-gray-700">
                      {examinee.gender}
                    </td>
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
      </div>
    </div>
  );
};

export default Report;
