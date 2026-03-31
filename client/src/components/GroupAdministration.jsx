import { useState } from 'react';
import { FiPlus, FiTrash2, FiAlertTriangle } from 'react-icons/fi';

const GroupAdministration = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [includeSubAccounts, setIncludeSubAccounts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data for demonstration
  const mockGroups = [
    { id: 1, systemId: 'GRP001', groupName: 'Assessment Group A', assessments: 5, examinees: 12, accountName: 'Main Account' },
    { id: 2, systemId: 'GRP002', groupName: 'Learning Centre B', assessments: 3, examinees: 8, accountName: 'Sub Account 1' },
    { id: 3, systemId: 'GRP003', groupName: 'Test Group C', assessments: 7, examinees: 25, accountName: 'Main Account' },
  ];

  const handleNewGroup = () => {
    // TODO: Implement new group creation
    alert('New Group functionality to be implemented');
  };

  const handleDeleteGroup = () => {
    if (selectedGroups.length === 0) {
      alert('Please select at least one group to delete');
      return;
    }
    // TODO: Implement delete functionality
    alert(`Delete ${selectedGroups.length} group(s)`);
  };

  const handleSelectGroup = (groupId) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedGroups(mockGroups.map(g => g.id));
    } else {
      setSelectedGroups([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Group Administration</h1>
          <p className="text-sm text-gray-600 mt-2">
            Below is a list of current groups. Click on a group row to select the group. 
            Access rosters, a list of Examinees in group, and the assessment list from the group's page.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gray-50 border-b flex items-center gap-4">
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

        {/* Content */}
        <div className="p-6">
          {mockGroups.length === 0 ? (
            <div className="flex items-center gap-2 text-yellow-600 mb-4">
              <FiAlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">No records were found.</span>
            </div>
          ) : null}

          {/* Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3 border-b border-r text-center w-12">
                    <input
                      type="checkbox"
                      checked={selectedGroups.length === mockGroups.length && mockGroups.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                    System ID
                  </th>
                  <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                    Group Name
                  </th>
                  <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                    Number of Assessments
                  </th>
                  <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                    Number of Examinees
                  </th>
                  <th className="px-3 py-3 border-b text-center font-semibold text-gray-700">
                    Account Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockGroups.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-3 py-8 text-center text-gray-500 text-sm">
                      No records to view
                    </td>
                  </tr>
                ) : (
                  mockGroups.map((group) => (
                    <tr 
                      key={group.id} 
                      className="hover:bg-gray-50 border-b last:border-b-0 cursor-pointer"
                      onClick={() => handleSelectGroup(group.id)}
                    >
                      <td className="px-3 py-3 border-r text-center">
                        <input
                          type="checkbox"
                          checked={selectedGroups.includes(group.id)}
                          onChange={() => handleSelectGroup(group.id)}
                          className="rounded border-gray-300"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-3 py-3 border-r text-center text-gray-700">
                        {group.systemId}
                      </td>
                      <td className="px-3 py-3 border-r text-center text-gray-700 font-medium">
                        {group.groupName}
                      </td>
                      <td className="px-3 py-3 border-r text-center text-gray-700">
                        {group.assessments}
                      </td>
                      <td className="px-3 py-3 border-r text-center text-gray-700">
                        {group.examinees}
                      </td>
                      <td className="px-3 py-3 text-center text-gray-700">
                        {group.accountName}
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
              <span>Page</span>
              <input
                type="text"
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value) || 1)}
                className="w-12 px-2 py-1 border rounded text-center text-sm"
              />
              <span>of {Math.ceil(mockGroups.length / itemsPerPage) || 1}</span>
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
              {mockGroups.length === 0 ? 'No records to view' : `${mockGroups.length} records found`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupAdministration;
