import { motion } from 'framer-motion';
import { FiTrendingUp, FiDollarSign, FiCalendar, FiDownload } from 'react-icons/fi';
import { useState } from 'react';

const ClinicRevenue = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Export');

  // Revenue data for pie chart
  const revenueData = [
    { clinic: 'Clinic Kjaggi', amount: 660000, color: 'bg-blue-500', percentage: 30 },
    { clinic: 'Downtown Family Clinic', amount: 550000, color: 'bg-green-500', percentage: 25 },
    { clinic: 'Green Valley Clinic', amount: 440000, color: 'bg-yellow-500', percentage: 20 },
    { clinic: 'Sunrise Health Center', amount: 550000, color: 'bg-red-500', percentage: 25 }
  ];

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);

  // Monthly revenue data for bar chart
  const monthlyData = [
    { month: 'Jan', 'Sunrise Health Center': 800, 'Green Valley Clinic': 600, 'Downtown Family Clinic': 900, 'Clinic Kjaggi': 700 },
    { month: 'Feb', 'Sunrise Health Center': 900, 'Green Valley Clinic': 700, 'Downtown Family Clinic': 800, 'Clinic Kjaggi': 800 },
    { month: 'Mar', 'Sunrise Health Center': 1000, 'Green Valley Clinic': 800, 'Downtown Family Clinic': 1100, 'Clinic Kjaggi': 900 },
    { month: 'Apr', 'Sunrise Health Center': 850, 'Green Valley Clinic': 650, 'Downtown Family Clinic': 950, 'Clinic Kjaggi': 750 },
    { month: 'May', 'Sunrise Health Center': 1100, 'Green Valley Clinic': 900, 'Downtown Family Clinic': 1200, 'Clinic Kjaggi': 1000 },
    { month: 'Jun', 'Sunrise Health Center': 950, 'Green Valley Clinic': 750, 'Downtown Family Clinic': 1050, 'Clinic Kjaggi': 850 }
  ];

  const maxValue = Math.max(...monthlyData.flatMap(month => 
    Object.values(month).filter(val => typeof val === 'number')
  ));

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Clinic Revenue</h1>
            <p className="text-gray-600">Overall revenue analysis and clinic performance</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Export">Export</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Financial</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Clinic Revenue</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Clinic Revenue Overall - Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Clinic Revenue (Overall)</h2>
              <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                <option>Export</option>
              </select>
            </div>

            <div className="flex items-center justify-center mb-6">
              {/* Pie Chart Representation */}
              <div className="relative w-64 h-64">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                  />
                  
                  {/* Blue segment - Clinic Kjaggi - 30% */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="16"
                    strokeDasharray="150.8 502.4"
                    strokeDashoffset="0"
                    transform="rotate(-90 100 100)"
                  />
                  
                  {/* Green segment - Downtown Family Clinic - 25% */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="16"
                    strokeDasharray="125.6 502.4"
                    strokeDashoffset="-150.8"
                    transform="rotate(-90 100 100)"
                  />
                  
                  {/* Yellow segment - Green Valley Clinic - 20% */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="16"
                    strokeDasharray="100.48 502.4"
                    strokeDashoffset="-276.4"
                    transform="rotate(-90 100 100)"
                  />
                  
                  {/* Red segment - Sunrise Health Center - 25% */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="16"
                    strokeDasharray="125.6 502.4"
                    strokeDashoffset="-376.88"
                    transform="rotate(-90 100 100)"
                  />
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-lg font-bold text-gray-800">₹{(totalRevenue / 100000).toFixed(1)}L/-</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {revenueData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-600">{item.clinic}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Clinic Revenue Detail - Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Clinic Revenue (Detail)</h2>

            {/* Bar Chart */}
            <div className="h-80">
              <div className="flex items-end justify-between h-full space-x-2">
                {monthlyData.map((month, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="flex flex-col items-center justify-end h-64 space-y-1">
                      {/* Sunrise Health Center */}
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${(month['Sunrise Health Center'] / maxValue) * 100}%` }}
                      ></div>
                      {/* Green Valley Clinic */}
                      <div 
                        className="w-full bg-green-500"
                        style={{ height: `${(month['Green Valley Clinic'] / maxValue) * 100}%` }}
                      ></div>
                      {/* Downtown Family Clinic */}
                      <div 
                        className="w-full bg-yellow-500"
                        style={{ height: `${(month['Downtown Family Clinic'] / maxValue) * 100}%` }}
                      ></div>
                      {/* Clinic Kjaggi */}
                      <div 
                        className="w-full bg-red-500 rounded-b"
                        style={{ height: `${(month['Clinic Kjaggi'] / maxValue) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 transform rotate-45">{month.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Y-axis labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-4">
              <span>0</span>
              <span>200</span>
              <span>400</span>
              <span>600</span>
              <span>800</span>
              <span>1,000</span>
              <span>1,200</span>
              <span>1,400</span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Sunrise Health Center</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Green Valley Clinic</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Downtown Family Clinic</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Clinic Kjaggi</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Revenue Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">₹{(totalRevenue / 100000).toFixed(1)}L</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiTrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">+12.5%</div>
                <div className="text-sm text-gray-600">Growth Rate</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiCalendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">4</div>
                <div className="text-sm text-gray-600">Active Clinics</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiDownload className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">₹{(revenueData[0].amount / 100000).toFixed(1)}L</div>
                <div className="text-sm text-gray-600">Top Clinic</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClinicRevenue;