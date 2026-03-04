import { motion } from 'framer-motion';

const BookingChart = ({ data = [] }) => {
  // Process data to calculate totals and percentages
  const processChartData = () => {
    if (!data || data.length === 0) {
      return {
        total: 10,
        segments: [
          { status: 'confirmed', count: 6, color: '#10b981', percentage: 60 },
          { status: 'scheduled', count: 3, color: '#3b82f6', percentage: 30 },
          { status: 'cancelled', count: 1, color: '#ef4444', percentage: 10 }
        ]
      };
    }

    const total = data.reduce((sum, item) => sum + item.count, 0);
    
    const colorMap = {
      'confirmed': '#10b981',
      'scheduled': '#3b82f6', 
      'pending': '#f59e0b',
      'completed': '#8b5cf6',
      'cancelled': '#ef4444',
      'no_show': '#6b7280'
    };

    const segments = data.map(item => ({
      status: item.status,
      count: item.count,
      color: colorMap[item.status] || '#6b7280',
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
    }));

    return { total, segments };
  };

  const { total, segments } = processChartData();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-6 shadow-sm border"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Booking Status</h3>
      </div>
      
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Donut Chart */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="3"
            />
            
            {/* Dynamic segments */}
            {segments.map((segment, index) => {
              let offset = 0;
              for (let i = 0; i < index; i++) {
                offset += segments[i].percentage;
              }
              
              return (
                <path
                  key={segment.status}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="3"
                  strokeDasharray={`${segment.percentage}, ${100 - segment.percentage}`}
                  strokeDashoffset={-offset}
                  className={index === 0 ? "animate-pulse" : ""}
                />
              );
            })}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{total}</span>
            <span className="text-xs text-gray-500">Total Bookings</span>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 space-y-2">
        {segments.map((segment) => (
          <div key={segment.status} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="text-gray-600 capitalize">
                {segment.status.replace('_', ' ')}
              </span>
            </div>
            <span className="font-medium">{segment.count}</span>
          </div>
        ))}
        
        {segments.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No booking data available
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BookingChart;