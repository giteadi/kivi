import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiPlus, FiTrash2, FiEdit3 } from 'react-icons/fi';

const BodyChart = ({ sessionData, onAnnotationsChange, initialAnnotations = [] }) => {
  console.log('🔍 BodyChart: Component initialized with initialAnnotations:', initialAnnotations);

  const [annotations, setAnnotations] = useState(initialAnnotations.length > 0 ? initialAnnotations : (
    sessionData?.materials_needed
      ? [{ id: 1, x: 50, y: 50, note: sessionData.materials_needed, type: 'observation' }]
      : []
  ));

  console.log('🔍 BodyChart: Final annotations state:', annotations);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState('');

  // Notify parent component when annotations change
  const updateAnnotations = (newAnnotations) => {
    setAnnotations(newAnnotations);
    if (onAnnotationsChange) {
      onAnnotationsChange(newAnnotations);
    }
  };

  const handleBodyClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    if (showAddForm) {
      const newAnnotation = {
        id: Date.now(),
        x,
        y,
        note: newNote || 'New annotation',
        type: 'observation'
      };
      updateAnnotations([...annotations, newAnnotation]);
      setShowAddForm(false);
      setNewNote('');
    }
  };

  const deleteAnnotation = (id) => {
    const newAnnotations = annotations.filter(ann => ann.id !== id);
    updateAnnotations(newAnnotations);
    setSelectedAnnotation(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showAddForm 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <FiPlus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel' : 'Add Annotation'}</span>
          </motion.button>
          
          {showAddForm && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter annotation note"
                className="px-3 py-2 border rounded-lg text-sm"
              />
              <span className="text-sm text-gray-500">Click on body to place</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Annotations: {annotations.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Body Chart */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Body Chart</h3>
            
            <div className="relative bg-gray-50 rounded-lg overflow-hidden" style={{ aspectRatio: '1/1.4' }}>
              {/* Simple body outline using SVG */}
              <svg
                className="w-full h-full cursor-crosshair"
                viewBox="0 0 200 280"
                onClick={handleBodyClick}
              >
                {/* Head */}
                <circle cx="100" cy="30" r="20" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                
                {/* Body */}
                <rect x="80" y="50" width="40" height="80" rx="10" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                
                {/* Arms */}
                <rect x="50" y="60" width="25" height="50" rx="12" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                <rect x="125" y="60" width="25" height="50" rx="12" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                
                {/* Legs */}
                <rect x="85" y="130" width="15" height="80" rx="7" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                <rect x="100" y="130" width="15" height="80" rx="7" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                
                {/* Feet */}
                <ellipse cx="92" cy="220" rx="8" ry="4" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                <ellipse cx="108" cy="220" rx="8" ry="4" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                
                {/* Annotations */}
                {annotations.map((annotation) => (
                  <g key={annotation.id}>
                    <circle
                      cx={annotation.x * 2}
                      cy={annotation.y * 2.8}
                      r="6"
                      fill={annotation.type === 'pain' ? '#ef4444' : '#3b82f6'}
                      className="cursor-pointer hover:opacity-80"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAnnotation(annotation);
                      }}
                    />
                    <text
                      x={annotation.x * 2}
                      y={annotation.y * 2.8 - 8}
                      textAnchor="middle"
                      className="text-xs fill-white font-medium pointer-events-none"
                    >
                      {annotations.indexOf(annotation) + 1}
                    </text>
                  </g>
                ))}
              </svg>
              
              {showAddForm && (
                <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm">
                  Click anywhere on the body to add annotation
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Annotations List */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Annotations</h3>
            
            <div className="space-y-3">
              {annotations.map((annotation) => (
                <motion.div
                  key={annotation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedAnnotation?.id === annotation.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-xs text-white font-medium ${
                            annotation.type === 'pain' ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                        >
                          {annotation.id}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          annotation.type === 'pain' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {annotation.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{annotation.note}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Position: {Math.round(annotation.x)}%, {Math.round(annotation.y)}%
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => setSelectedAnnotation(annotation)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <FiEdit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteAnnotation(annotation.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {annotations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No annotations added yet</p>
                  <p className="text-xs mt-1">Click "Add Annotation" to get started</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Pain/Discomfort</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Observation/Finding</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BodyChart;