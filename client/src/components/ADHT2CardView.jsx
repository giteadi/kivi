import { FiArrowLeft, FiFileText } from 'react-icons/fi';

// ADHT2 Product Card View - Shows cards, click to open template
const ADHT2CardView = ({ onOpenTemplate, onBack }) => {
  const templates = [
    {
      id: 'ADHT-2',
      name: 'ADHT-2',
      fullName: 'Attention-Deficit/Hyperactivity Disorder Test-Second Edition',
      category: 'ADHD Assessment',
      icon: '🧠',
      color: 'orange'
    },
    {
      id: 'ADHD-DSM5',
      name: 'ADHD - DSM 5 Checklist',
      fullName: 'ADHD DSM-5 Criteria - Parent Completion',
      category: 'ADHD Diagnostic',
      icon: '📋',
      color: 'blue'
    },
    {
      id: 'ASTON-INDEX',
      name: 'Aston Index',
      fullName: 'Comprehensive Battery of Testing and Diagnosing Language Difficulties',
      category: 'Language Assessment',
      icon: '📊',
      color: 'green'
    },
    {
      id: 'BKT',
      name: 'Binet Kamath Test',
      fullName: 'Binet Kamath Test of Intelligence (BKT)',
      category: 'Intelligence Assessment',
      icon: '🧮',
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      orange: 'border-orange-200 hover:border-orange-400 bg-orange-50',
      blue: 'border-blue-200 hover:border-blue-400 bg-blue-50',
      green: 'border-green-200 hover:border-green-400 bg-green-50',
      purple: 'border-purple-200 hover:border-purple-400 bg-purple-50',
    };
    return colors[color] || 'border-gray-200 hover:border-gray-400 bg-gray-50';
  };

  const getIconBg = (color) => {
    const colors = {
      orange: 'bg-orange-100 group-hover:bg-orange-200',
      blue: 'bg-blue-100 group-hover:bg-blue-200',
      green: 'bg-green-100 group-hover:bg-green-200',
      purple: 'bg-purple-100 group-hover:bg-purple-200',
    };
    return colors[color] || 'bg-gray-100 group-hover:bg-gray-200';
  };

  const getBadgeClasses = (color) => {
    const colors = {
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[color] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Assessment Templates</h1>
              <p className="text-sm text-gray-600">Click on a template to open</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Card Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => onOpenTemplate(template.id)}
              className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 group ${getColorClasses(template.color)}`}
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-full ${getIconBg(template.color)} flex items-center justify-center text-3xl mb-4 transition-colors`}>
                  {template.icon}
                </div>
                
                {/* Title */}
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {template.name}
                </h3>
                
                {/* Full Name */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {template.fullName}
                </p>
                
                {/* Category Badge */}
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getBadgeClasses(template.color)}`}>
                  {template.category}
                </span>
                
                {/* Action Hint */}
                <div className="mt-4 text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                  Click to open template →
                </div>
              </div>
            </div>
          ))}

          {/* Placeholder for future templates */}
          <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl mb-4">
              📋
            </div>
            <h3 className="font-semibold text-gray-500 mb-2">
              More Templates
            </h3>
            <p className="text-xs text-gray-400">
              Coming soon...
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ADHT2CardView;
