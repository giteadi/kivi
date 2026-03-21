import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Icons as inline SVGs to avoid dependency issues
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const SpinnerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

const WR5Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <div style={{
      background: '#1a4a8a',
      color: '#fff',
      fontWeight: '900',
      fontSize: '13px',
      padding: '3px 7px',
      borderRadius: '4px',
      letterSpacing: '0.5px',
      fontFamily: 'Georgia, serif'
    }}>WR</div>
    <div style={{ fontWeight: '900', fontSize: '22px', color: '#1a4a8a', fontFamily: 'Georgia, serif', letterSpacing: '-1px' }}>WRAT5</div>
    <div style={{ fontSize: '10px', color: '#1a4a8a', fontWeight: '700', marginBottom: '10px' }}>INDIA</div>
  </div>
);

const Checkbox = ({ checked, onChange, label }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
    <div
      onClick={onChange}
      style={{
        width: '18px', height: '18px',
        borderRadius: '3px',
        border: checked ? '2px solid #0066cc' : '2px solid #bbb',
        background: checked ? '#0066cc' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, cursor: 'pointer', transition: 'all 0.15s'
      }}
    >
      {checked && <CheckIcon />}
    </div>
    <span style={{ fontSize: '14px', color: '#333' }}>{label}</span>
  </label>
);

const RadioButton = ({ checked, onChange, label }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
    <div
      onClick={onChange}
      style={{
        width: '18px', height: '18px',
        borderRadius: '50%',
        border: checked ? '2px solid #0066cc' : '2px solid #bbb',
        background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, cursor: 'pointer'
      }}
    >
      {checked && <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#0066cc' }} />}
    </div>
    <span style={{ fontSize: '14px', color: '#333' }}>{label}</span>
  </label>
);

const SectionDivider = ({ title }) => (
  <div style={{ margin: '18px 0 14px 0' }}>
    <button style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      background: 'none', border: 'none', cursor: 'pointer',
      color: '#0066cc', fontWeight: '600', fontSize: '14px', padding: 0
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
      {title}
    </button>
  </div>
);

const GenerateReportModal = ({ isOpen, onClose, selectedAssessments = ['58415507'], examineeData }) => {
  const defaultExaminee = examineeData || {
    name: 'Chamariya, Darsh',
    dob: '16/10/2013',
    age: '12 yrs 5 mos',
    id: 'DC/MSL/260318',
    gender: 'Male',
    email: null,
    assessment: 'WRAT5-India Blue Form',
    delivery: 'Manual Entry',
    testDate: '18/03/2026',
  };

  const [reportOptions, setReportOptions] = useState({
    includeExamineeName: true,
    scoreSummaryCol: 'GSV',      // GSV | NCE | Stanine
    confidenceLevel: '95',       // 90 | 95
    comparisonGroup: 'age',      // overall | age
    includeAbilityAchievement: false,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const toggle = (key) => setReportOptions(p => ({ ...p, [key]: !p[key] }));
  const set = (key, val) => setReportOptions(p => ({ ...p, [key]: val }));

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));
    setIsGenerating(false);
    setIsGenerated(true);
  };

  const handleClose = () => {
    setIsGenerated(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '16px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{
            background: '#f5f5f5',
            borderRadius: '4px',
            width: '100%',
            maxWidth: '980px',
            maxHeight: '92vh',
            overflowY: 'auto',
            boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
            fontFamily: 'Arial, Helvetica, sans-serif',
          }}
        >
          {/* Top header - Pearson style dark blue */}
          <div style={{
            background: '#1e3a5f',
            color: '#fff',
            padding: '14px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderRadius: '4px 4px 0 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <span style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '0.3px' }}>
                Report Selection &amp; Configurations
              </span>
            </div>
            <button
              onClick={handleClose}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
            >
              <XIcon />
            </button>
          </div>

          {/* Main body: left content + right summary */}
          <div style={{ display: 'flex', minHeight: '520px' }}>

            {/* LEFT - Report config */}
            <div style={{ flex: 1, padding: '24px 28px', borderRight: '1px solid #ddd' }}>

              {/* Report card - selected */}
              <div style={{
                border: '2px solid #1e3a5f',
                borderRadius: '4px',
                marginBottom: '20px',
                overflow: 'hidden'
              }}>
                {/* Selected bar */}
                <div style={{
                  background: '#1e3a5f', color: '#fff',
                  padding: '8px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontSize: '13px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckIcon /> <span style={{ fontWeight: '600' }}>Selected</span>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: '#adc8e8', cursor: 'pointer', fontSize: '13px' }}>
                    Deselect
                  </button>
                </div>

                {/* Report info row */}
                <div style={{ background: '#fff', padding: '16px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, marginTop: '2px' }}>
                    <WR5Logo />
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#333', lineHeight: '1.7' }}>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a1a', marginBottom: '4px' }}>
                      WRAT5-India Score Report
                    </div>
                    <div>Inventory Needed: <strong>0</strong></div>
                    <div>Unlimited report usages</div>
                    <div>Subscription expires 07/12/2026</div>
                  </div>
                </div>
              </div>

              {/* Configurations */}
              <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '4px', padding: '20px 22px' }}>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#0066cc', marginBottom: '16px', borderBottom: '2px solid #0066cc', paddingBottom: '6px' }}>
                  Configurations
                </div>

                {/* File type */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontWeight: '600', fontSize: '13.5px', color: '#333', marginBottom: '5px' }}>Report File Type</div>
                  <div style={{ fontSize: '13px', color: '#555' }}>
                    Adobe PDF – <em>This report is only available as a PDF.</em>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '14px 0' }} />

                {/* Report Options */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '600', fontSize: '13.5px', color: '#333', marginBottom: '10px' }}>Report Options</div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>Select options to include in the report.</div>
                  <Checkbox
                    checked={reportOptions.includeExamineeName}
                    onChange={() => toggle('includeExamineeName')}
                    label="Examinee Name"
                  />
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '14px 0' }} />

                {/* Settings */}
                <div style={{ fontWeight: '600', fontSize: '13.5px', color: '#333', marginBottom: '14px' }}>Settings</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                  {/* Score Summary */}
                  <div>
                    <div style={{ fontSize: '13px', color: '#555', fontWeight: '600', marginBottom: '10px' }}>Score summary last column</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['GSV', 'NCE', 'Stanine'].map(opt => (
                        <RadioButton
                          key={opt}
                          checked={reportOptions.scoreSummaryCol === opt}
                          onChange={() => set('scoreSummaryCol', opt)}
                          label={opt}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Confidence Level */}
                  <div>
                    <div style={{ fontSize: '13px', color: '#555', fontWeight: '600', marginBottom: '10px' }}>Confidence Level</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                      {['90%', '95%'].map(opt => (
                        <RadioButton
                          key={opt}
                          checked={reportOptions.confidenceLevel === opt.replace('%', '')}
                          onChange={() => set('confidenceLevel', opt.replace('%', ''))}
                          label={opt}
                        />
                      ))}
                    </div>

                    <div style={{ fontSize: '13px', color: '#555', fontWeight: '600', marginBottom: '10px' }}>Comparisons Reference Group</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[{ val: 'overall', label: 'Overall' }, { val: 'age', label: 'Age group' }].map(opt => (
                        <RadioButton
                          key={opt.val}
                          checked={reportOptions.comparisonGroup === opt.val}
                          onChange={() => set('comparisonGroup', opt.val)}
                          label={opt.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ability-Achievement Discrepancy */}
                <SectionDivider title="Ability-Achievement Discrepancy Analysis" />
                <div style={{ fontSize: '13px', color: '#888', paddingLeft: '22px' }}>
                  (Expand to configure discrepancy analysis options)
                </div>
              </div>
            </div>

            {/* RIGHT - Summary sidebar */}
            <div style={{ width: '280px', flexShrink: 0, padding: '24px 20px', background: '#f9f9f9' }}>
              <div style={{
                fontWeight: '700', fontSize: '16px', color: '#1e3a5f',
                borderBottom: '2px solid #1e3a5f', paddingBottom: '8px', marginBottom: '16px'
              }}>
                Summary
              </div>

              {/* Examinee block */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#444', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Examinee</div>
                <div style={{ fontSize: '13.5px', color: '#222', lineHeight: '1.75' }}>
                  <div style={{ fontWeight: '700' }}>{defaultExaminee.name}</div>
                  <div>{defaultExaminee.dob} &nbsp;|&nbsp; {defaultExaminee.age}</div>
                  <div>{defaultExaminee.id}</div>
                  <div>{defaultExaminee.gender}</div>
                  <div style={{ color: '#999', fontStyle: 'italic' }}>{defaultExaminee.email || '(no e-mail)'}</div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '12px 0' }} />

              {/* Assessment block */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#444', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assessment</div>
                <div style={{ fontSize: '13.5px', color: '#222', lineHeight: '1.75' }}>
                  <div>{defaultExaminee.assessment}</div>
                  <div>Delivery: {defaultExaminee.delivery}</div>
                  <div>{defaultExaminee.testDate}</div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '12px 0' }} />

              {/* Selected report with green check */}
              {isGenerated ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: '#e8f5e9', border: '1px solid #66bb6a',
                    borderRadius: '4px', padding: '12px 14px', marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ background: '#43a047', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      <CheckIcon />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '13.5px', color: '#1b5e20' }}>Report Generated!</div>
                      <div style={{ fontSize: '12.5px', color: '#388e3c', marginTop: '3px' }}>WRAT5-India Score Report</div>
                      <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>0 usage charged</div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div style={{
                  background: '#fff', border: '1px solid #ddd',
                  borderRadius: '4px', padding: '12px 14px', marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ background: '#43a047', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      <CheckIcon />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '13.5px', color: '#333' }}>WRAT5-India Score Report</div>
                      <div style={{ fontSize: '12.5px', color: '#555', marginTop: '3px' }}>You will be charged 0 usage for this report.</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Create Report button */}
              {!isGenerated ? (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  style={{
                    width: '100%',
                    background: isGenerating ? '#f0a030' : '#f5a623',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '13px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    transition: 'background 0.15s',
                    marginBottom: '10px',
                    letterSpacing: '0.3px'
                  }}
                >
                  {isGenerating ? (
                    <>
                      <SpinnerIcon />
                      Generating...
                    </>
                  ) : (
                    <>
                      <DownloadIcon />
                      Create Report
                    </>
                  )}
                </button>
              ) : (
                <button
                  style={{
                    width: '100%',
                    background: '#1a6bc7',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '13px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <DownloadIcon />
                  Download Report
                </button>
              )}

              <button
                onClick={handleClose}
                style={{
                  width: '100%',
                  background: 'none',
                  color: '#0066cc',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '6px',
                  textDecoration: 'underline'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GenerateReportModal;