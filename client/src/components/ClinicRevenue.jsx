import { motion } from 'framer-motion';
import { FiTrendingUp, FiDollarSign, FiCalendar, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useToast } from './Toast';

const ClinicRevenue = () => {
  const toast = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('Export');
  const [revenueData, setRevenueData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClinicRevenue();
  }, []);

  const fetchClinicRevenue = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/financial/clinic-revenue');
      const result = await response.json();

      if (result.success) {
        // Transform the data for the component
        const transformedData = result.data.map((clinic, index) => ({
          clinic: clinic.clinic_name,
          amount: parseFloat(clinic.total_revenue) || 0,
          transactions: parseInt(clinic.total_transactions) || 0,
          avgTransaction: parseFloat(clinic.avg_transaction) || 0,
          color: ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-indigo-500'][index % 6]
        }));

        // Calculate percentages
        const totalRevenue = transformedData.reduce((sum, item) => sum + item.amount, 0);
        const dataWithPercentages = transformedData.map(item => ({
          ...item,
          percentage: totalRevenue > 0 ? Math.round((item.amount / totalRevenue) * 100) : 0
        }));

        setRevenueData(dataWithPercentages);

        // Generate monthly data (simplified - in real app, this would come from a separate API)
        generateMonthlyData(dataWithPercentages);

      } else {
        setError(result.message || 'Failed to fetch clinic revenue data');
        toast.error(result.message || 'Failed to fetch clinic revenue data');
      }
    } catch (error) {
      console.error('Error fetching clinic revenue:', error);
      setError('Error loading clinic revenue data');
      toast.error('Error loading clinic revenue data');
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyData = (clinicData) => {
    // Generate mock monthly data based on clinic data
    // In a real application, this would come from a separate API endpoint
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthly = months.map(month => {
      const monthData = { month };
      clinicData.forEach(clinic => {
        // Generate random monthly values based on total revenue
        const baseValue = clinic.amount / 6;
        const variation = baseValue * 0.2; // 20% variation
        monthData[clinic.clinic] = Math.round(baseValue + (Math.random() - 0.5) * variation);
      });
      return monthData;
    });

    setMonthlyData(monthly);
  };

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);

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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiRefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-500">Loading clinic revenue data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-red-800">{error}</div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchClinicRevenue}
                className="flex items-center space-x-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
              >
                <FiRefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </motion.button>
            </div>
          </div>
        )}

        {/* Revenue Data */}
        {!loading && !error && (
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
                  
                  {/* Dynamic segments */}
                  {revenueData.map((clinic, index) => {
                    const prevPercentage = revenueData.slice(0, index).reduce((sum, item) => sum + item.percentage, 0);
                    const strokeDasharray = `${(clinic.percentage / 100) * 502.4} 502.4`;
                    const strokeDashoffset = `-${(prevPercentage / 100) * 502.4}`;
                    
                    return (
                      <circle
                        key={clinic.clinic}
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke={
                          clinic.color === 'bg-blue-500' ? '#3b82f6' :
                          clinic.color === 'bg-green-500' ? '#10b981' :
                          clinic.color === 'bg-yellow-500' ? '#f59e0b' :
                          clinic.color === 'bg-red-500' ? '#ef4444' :
                          clinic.color === 'bg-purple-500' ? '#8b5cf6' :
                          clinic.color === 'bg-indigo-500' ? '#6366f1' :
                          '#6b7280'
                        }
                        strokeWidth="16"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 100 100)"
                      />
                    );
                  })}
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
                  <div className="text-sm text-gray-800">
                    ₹{(item.amount / 100000).toFixed(1)}L ({item.percentage}%)
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
                      {revenueData.map((clinic, clinicIndex) => (
                        <div
                          key={clinic.clinic}
                          className={`w-full ${clinic.color} ${clinicIndex === 0 ? 'rounded-t' : clinicIndex === revenueData.length - 1 ? 'rounded-b' : ''}`}
                          style={{
                            height: `${(month[clinic.clinic] || 0) / maxValue * 100}%`,
                            minHeight: '1px'
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 transform rotate-45">{month.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Y-axis labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-4">
              <span>0</span>
              <span>{Math.round(maxValue * 0.2)}</span>
              <span>{Math.round(maxValue * 0.4)}</span>
              <span>{Math.round(maxValue * 0.6)}</span>
              <span>{Math.round(maxValue * 0.8)}</span>
              <span>{Math.round(maxValue)}</span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 text-sm">
              {revenueData.map((clinic) => (
                <div key={clinic.clinic} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${clinic.color} rounded`}></div>
                  <span>{clinic.clinic}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ClinicRevenue;