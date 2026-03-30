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
    },
    {
      id: 'BROWN-EFA',
      name: 'Brown EF/A Scale',
      fullName: 'Brown Executive Function/Attention Scales',
      category: 'Executive Function',
      icon: '📈',
      color: 'teal'
    },
    {
      id: 'EACA',
      name: 'EACA',
      fullName: 'Educational Assessment of Children with Autism',
      category: 'Autism Education',
      icon: '📊',
      color: 'orange'
    },
    {
      id: 'GARS-3',
      name: 'GARS-3',
      fullName: 'Gilliam Autism Rating Scale - Third Edition',
      category: 'Autism Assessment',
      icon: '🧩',
      color: 'pink'
    },
    {
      id: 'NELSON-DENNY',
      name: 'Nelson Denny',
      fullName: 'Nelson Denny Reading Test',
      category: 'Reading Assessment',
      icon: '📖',
      color: 'indigo'
    },
    {
      id: 'WRAML-2',
      name: 'WRAML-2',
      fullName: 'Wide Range Assessment of Memory and Learning - Second Edition',
      category: 'Memory Assessment',
      icon: '🧠',
      color: 'cyan'
    },
    {
      id: 'RAVENS-CPM',
      name: "Raven's CPM",
      fullName: "Raven's Coloured Progressive Matrices",
      category: 'Non-verbal Intelligence',
      icon: '🔷',
      color: 'violet'
    },
    {
      id: 'RIPA',
      name: 'RIPA',
      fullName: 'Ross Information Processing Assessment',
      category: 'Cognitive-Linguistic',
      icon: '🧠',
      color: 'rose'
    },
    {
      id: 'TAPS-3',
      name: 'TAPS-3',
      fullName: 'Test of Auditory Perceptual Skills - Third Edition',
      category: 'Auditory Processing',
      icon: '👂',
      color: 'amber'
    },
    {
      id: 'TOWL-4',
      name: 'TOWL-4',
      fullName: 'Test of Written Language - Fourth Edition',
      category: 'Writing Assessment',
      icon: '✍️',
      color: 'emerald'
    },
    {
      id: 'VABS',
      name: 'VABS',
      fullName: 'Vineland Adaptive Behavior Scales',
      category: 'Adaptive Behavior',
      icon: '📋',
      color: 'sky'
    },
    {
      id: 'WISC-IV',
      name: 'WISC-IV',
      fullName: 'Wechsler Intelligence Scale for Children',
      category: 'Intelligence Assessment',
      icon: '🧠',
      color: 'purple'
    },
    {
      id: 'WJ-III',
      name: 'WJ-III',
      fullName: 'Woodcock-Johnson Tests of Achievement',
      category: 'Academic Assessment',
      icon: '📚',
      color: 'blue'
    },
    {
      id: 'WJ-IV-Cog-Std',
      name: 'WJ-IV COG Std',
      fullName: 'WJ-IV Tests of Cognitive Abilities - Standard Battery',
      category: 'Cognitive Assessment',
      icon: '🎯',
      color: 'indigo'
    },
    {
      id: 'WJ-IV-Cog-Ext',
      name: 'WJ-IV COG Ext',
      fullName: 'WJ-IV Tests of Cognitive Abilities - Extended Battery',
      category: 'Cognitive Assessment',
      icon: '🎯',
      color: 'violet'
    },
    {
      id: 'WJ-IV-Ach',
      name: 'WJ-IV ACH',
      fullName: 'WJ-IV Tests of Achievement',
      category: 'Academic Assessment',
      icon: '📝',
      color: 'emerald'
    },
    {
      id: 'WRAT-5-English',
      name: 'WRAT-5 English',
      fullName: 'Wide Range Achievement Test (English)',
      category: 'Academic Assessment',
      icon: '🇬🇧',
      color: 'blue'
    },
    {
      id: 'WRAT-5-Hindi',
      name: 'WRAT-5 Hindi',
      fullName: 'Wide Range Achievement Test (Hindi)',
      category: 'Academic Assessment',
      icon: '🇮🇳',
      color: 'orange'
    },
    {
      id: 'WRMT-III',
      name: 'WRMT-III',
      fullName: 'Woodcock Reading Mastery Tests - Third Edition',
      category: 'Reading Assessment',
      icon: '📖',
      color: 'green'
    },
    {
      id: 'Diagnostic-Report',
      name: 'Diagnostic Report',
      fullName: 'Diagnostic Impression, Recommendations & Accommodations',
      category: 'Summary Report',
      icon: '📋',
      color: 'cyan'
    },
    {
      id: 'Summary-Evaluation',
      name: 'Summary Evaluation',
      fullName: 'Comprehensive Summary of All Assessment Results',
      category: 'Summary Report',
      icon: '📊',
      color: 'teal'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      orange: 'border-orange-200 hover:border-orange-400 bg-orange-50',
      blue: 'border-blue-200 hover:border-blue-400 bg-blue-50',
      green: 'border-green-200 hover:border-green-400 bg-green-50',
      purple: 'border-purple-200 hover:border-purple-400 bg-purple-50',
      teal: 'border-teal-200 hover:border-teal-400 bg-teal-50',
      pink: 'border-pink-200 hover:border-pink-400 bg-pink-50',
      indigo: 'border-indigo-200 hover:border-indigo-400 bg-indigo-50',
      cyan: 'border-cyan-200 hover:border-cyan-400 bg-cyan-50',
      violet: 'border-violet-200 hover:border-violet-400 bg-violet-50',
      amber: 'border-amber-200 hover:border-amber-400 bg-amber-50',
      rose: 'border-rose-200 hover:border-rose-400 bg-rose-50',
      sky: 'border-sky-200 hover:border-sky-400 bg-sky-50',
      emerald: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50'
    };
    return colors[color] || 'border-gray-200 hover:border-gray-400 bg-gray-50';
  };

  const getIconBg = (color) => {
    const colors = {
      orange: 'bg-orange-100 group-hover:bg-orange-200',
      blue: 'bg-blue-100 group-hover:bg-blue-200',
      green: 'bg-green-100 group-hover:bg-green-200',
      purple: 'bg-purple-100 group-hover:bg-purple-200',
      teal: 'bg-teal-100 group-hover:bg-teal-200',
      pink: 'bg-pink-100 group-hover:bg-pink-200',
      indigo: 'bg-indigo-100 group-hover:bg-indigo-200',
      cyan: 'bg-cyan-100 group-hover:bg-cyan-200',
      violet: 'bg-violet-100 group-hover:bg-violet-200',
      amber: 'bg-amber-100 group-hover:bg-amber-200',
      rose: 'bg-rose-100 group-hover:bg-rose-200',
      sky: 'bg-sky-100 group-hover:bg-sky-200',
      emerald: 'bg-emerald-100 group-hover:bg-emerald-200'
    };
    return colors[color] || 'bg-gray-100 group-hover:bg-gray-200';
  };

  const getBadgeClasses = (color) => {
    const colors = {
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      teal: 'bg-teal-100 text-teal-800 border-teal-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      violet: 'bg-violet-100 text-violet-800 border-violet-200',
      amber: 'bg-amber-100 text-amber-800 border-amber-200',
      rose: 'bg-rose-100 text-rose-800 border-rose-200',
      sky: 'bg-sky-100 text-sky-800 border-sky-200',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200'
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
