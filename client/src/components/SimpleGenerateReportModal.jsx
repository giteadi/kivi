import { useState, useEffect } from 'react';
import api from '../services/api';
import ADHD2Template from './templates/ADHD2Template';

// Simple Template List - No database, just hardcoded for now
const SIMPLE_TEMPLATES = [
  {
    id: 'ADHD-2',
    name: 'ADHDT-2: Attention-Deficit/Hyperactivity Disorder Test',
    icon: '🧠',
    component: 'ADHD2Template'
  },
  {
    id: 'ADHD-DSM5',
    name: 'ADHD - DSM 5 Checklist',
    icon: '📋',
    component: null // Will add later
  },
  {
    id: 'Aston-Index',
    name: 'Aston Index',
    icon: '📊',
    component: null
  },
  {
    id: 'BKT',
    name: 'BKT - Battery of Kaufman Tests',
    icon: '📝',
    component: null
  },
  {
    id: 'Brown-EF-A',
    name: 'Brown EF-A Scale',
    icon: '🎯',
    component: null
  },
  {
    id: 'EACA',
    name: 'EACA - Executive Abilities Composite Assessment',
    icon: '🔍',
    component: null
  },
  {
    id: 'GARS-3',
    name: 'GARS-3: Gilliam Autism Rating Scale',
    icon: '🧩',
    component: null
  },
  {
    id: 'Nelson-Denny',
    name: 'Nelson Denny Reading Test',
    icon: '📚',
    component: null
  },
  {
    id: 'Ravens-CPM',
    name: "Raven's CPM: Coloured Progressive Matrices",
    icon: '🎨',
    component: null
  },
  {
    id: 'RIPA',
    name: 'RIPA: Ross Information Processing Assessment',
    icon: '💭',
    component: null
  },
  {
    id: 'TAPS-3',
    name: 'TAPS-3: Test of Auditory Perceptual Skills',
    icon: '👂',
    component: null
  },
  {
    id: 'TOWL-4',
    name: 'TOWL-4: Test of Written Language',
    icon: '✍️',
    component: null
  },
  {
    id: 'VAS',
    name: 'VAS: Visual Attention Span',
    icon: '👁️',
    component: null
  }
];

const SimpleGenerateReportModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [examinees, setExaminees] = useState([]);
  const [selectedExaminee, setSelectedExaminee] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Template selection
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Fetch examinees on mount
  useEffect(() => {
    if (isOpen) {
      fetchExaminees();
    }
  }, [isOpen]);

  const fetchExaminees = async () => {
    try {
      setLoading(true);
      const response = await api.request('/examinees');
      if (response.success) {
        setExaminees(response.data);
      }
    } catch (error) {
      console.error('Error fetching examinees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExaminee = (ex) => {
    setSelectedExaminee(ex);
  };

  const next = () => {
    if (step === 1 && !selectedExaminee) {
      alert('Please select an examinee');
      return;
    }
    if (step === 2 && !selectedTemplate) {
      alert('Please select a template');
      return;
    }
    setStep(step + 1);
  };

  const prev = () => setStep(step - 1);

  const reset = () => {
    setStep(1);
    setSelectedExaminee(null);
    setSelectedTemplate(null);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: 16
    }}>
      <div style={{
        background: 'white',
        borderRadius: 12,
        width: '100%',
        maxWidth: 1000,
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* HEADER */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#1e40af',
          color: 'white'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
              Generate Assessment Report
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.9 }}>
              Step {step} of 3: {step === 1 ? 'Select Examinee' : step === 2 ? 'Choose Template' : 'Fill Template'}
            </p>
          </div>
          <button 
            onClick={() => { reset(); onClose(); }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'white',
              padding: 4
            }}
          >
            ×
          </button>
        </div>

        {/* CONTENT */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          background: '#f9fafb'
        }}>
          {/* STEP 1: SELECT EXAMINEE */}
          {step === 1 && (
            <div>
              <h3 style={{ marginBottom: 20, color: '#374151' }}>Select an Examinee</h3>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
                  Loading examinees...
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 12
                }}>
                  {examinees.map((ex) => (
                    <div
                      key={ex.id}
                      onClick={() => handleSelectExaminee(ex)}
                      style={{
                        padding: 16,
                        border: selectedExaminee?.id === ex.id ? '2px solid #1e40af' : '1px solid #d1d5db',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: selectedExaminee?.id === ex.id ? '#eff6ff' : 'white',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 16, color: '#1f2937' }}>
                        {ex.firstName} {ex.lastName}
                      </div>
                      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                        ID: {ex.examineeId} | {ex.gender}
                      </div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                        DOB: {ex.dob}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {examinees.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
                  No examinees found. Please add examinees first.
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SELECT TEMPLATE */}
          {step === 2 && (
            <div>
              <h3 style={{ marginBottom: 20, color: '#374151' }}>
                Choose Assessment Template for {selectedExaminee?.firstName} {selectedExaminee?.lastName}
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 12
              }}>
                {SIMPLE_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    style={{
                      padding: 16,
                      border: selectedTemplate?.id === template.id ? '2px solid #1e40af' : '1px solid #d1d5db',
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: selectedTemplate?.id === template.id ? '#eff6ff' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{template.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1f2937' }}>
                      {template.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                      {template.component ? '✅ Ready to use' : '⏳ Coming soon'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: TEMPLATE FORM */}
          {step === 3 && selectedTemplate && (
            <div>
              {selectedTemplate.id === 'ADHD-2' ? (
                <ADHD2Template examinee={selectedExaminee} />
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: 60,
                  background: 'white',
                  borderRadius: 8
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
                  <h3 style={{ color: '#374151', marginBottom: 8 }}>
                    Template Coming Soon
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    The {selectedTemplate.name} template is under development.
                    <br />
                    Please select ADHD-2 template for testing.
                  </p>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      marginTop: 20,
                      padding: '10px 20px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer'
                    }}
                  >
                    Go Back
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'white'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            {selectedExaminee && step > 1 && (
              <span>Examinee: <strong>{selectedExaminee.firstName} {selectedExaminee.lastName}</strong></span>
            )}
            {selectedTemplate && step > 2 && (
              <span> | Template: <strong>{selectedTemplate.name}</strong></span>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
            {step > 1 && (
              <button
                onClick={prev}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  color: '#374151',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                Previous
              </button>
            )}
            
            {step < 3 ? (
              <button
                onClick={next}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  background: '#1e40af',
                  color: 'white',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => { reset(); onClose(); }}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  background: '#10b981',
                  color: 'white',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleGenerateReportModal;
