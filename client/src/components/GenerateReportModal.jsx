import { useState, useMemo, useRef, useEffect } from 'react';
import api from '../services/api';

/* ═══════════════════════════════════════════════════════════
   ASSESSMENT TEMPLATES - NOW LOADED FROM API
═══════════════════════════════════════════════════════════ */

// Commented out hardcoded array - now using API
// const ASSESSMENT_TEMPLATES = [
//   {
//     id: 'RIPA-Primary',
//     name: 'ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY',
//     description: 'The RIPA-A quantifies & describes cognitive-linguistic deficits in individuals between the ages of 5-0 and 12-11 who face difficulties in attention, memory, orientation, language and communication, problem solving and abstract reasoning.',
//     category: 'Cognitive',
//     icon: '🧠'
//   },
//   ... (rest of the array is now loaded from database API)
// ];

/* ═══════════════════════════════════════════════════════════
   BLANK SCORES TEMPLATE
═══════════════════════════════════════════════════════════ */
const BLANK_SCORES = () => {
  const s = {};
  ['testDate','examiner','language','gradeLevel','reasonForReferral','medications','testingSite',
   'mathRaw','mathStd','mathCI','mathPct','mathCat','mathAge','mathGSV',
   'spellingRaw','spellingStd','spellingCI','spellingPct','spellingCat','spellingAge','spellingGSV',
   'wordReadingRaw','wordReadingStd','wordReadingCI','wordReadingPct','wordReadingCat','wordReadingAge','wordReadingGSV',
   'sentenceRaw','sentenceStd','sentenceCI','sentencePct','sentenceCat','sentenceAge','sentenceGSV',
   'compositeRaw','compositeStd','compositeCI','compositePct','compositeCat',
   'diff_wr_sp','sig_wr_sp','base_wr_sp','diff_wr_mc','sig_wr_mc','base_wr_mc',
   'diff_wr_sc','sig_wr_sc','base_wr_sc','diff_sp_mc','sig_sp_mc','base_sp_mc',
   'diff_sp_sc','sig_sp_sc','base_sp_sc','diff_mc_sc','sig_mc_sc','base_mc_sc',
  ].forEach(k => { s[k] = ''; });
  return s;
};

const GenerateReportModal = ({ isOpen, onClose }) => {
  // Local state for data
  const [examinees, setExaminees] = useState([]);
  const [selectedExaminee, setSelectedExaminee] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Fetch data on component mount
  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      fetchExaminees();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      setTemplatesLoading(true);
      const response = await api.getTemplates();
      if (response.success) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setTemplatesLoading(false);
    }
  };

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
  
  // Step 1 state
  const [step, setStep] = useState(1);
  const [examinee, setExaminee] = useState({
    firstName:'', middleName:'', lastName:'', examineeId:'', gender:'Male', dob:'',
    email:'', comment:'', custom1:'', custom2:'', custom3:'', custom4:'',
  });
  const [errors, setErrors] = useState({});

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [useTemplate, setUseTemplate] = useState(false);

  // Fetch templates when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  // Step 2 state
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [assess, setAssess] = useState({
    deliveryMethod:'Manual Entry', testDate:'', examiner:'',
    language:'English', gradeLevel:'Please select...', reasonForReferral:'Please select...',
    medications:'', testingSite:'',
  });
  const [scores, setScores] = useState(BLANK_SCORES());

  // Step 3 state
  const [opts, setOpts] = useState({
    includeExamineeName:true, scoreSummaryCol:'GSV',
    confidenceLevel:'95%', comparisonGroup:'Age group', includeDiscrepancy:false,
  });

  const [generatedReport, setGeneratedReport] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // When an existing examinee is selected, populate examinee form too
  const handleSelectExaminee = (ex) => {
    setSelectedExaminee(ex);
    setExaminee({
      firstName:ex.firstName, middleName:ex.middleName||'', lastName:ex.lastName,
      examineeId:ex.examineeId, gender:ex.gender, dob:ex.dob,
      email:ex.email||'', comment:ex.comment||'',
      custom1:ex.custom1||'', custom2:ex.custom2||'', custom3:ex.custom3||'', custom4:ex.custom4||'',
    });
    setErrors({});
  };
  const handleClearSelected = () => {
    setSelectedExaminee(null);
    setExaminee({
      firstName:'', middleName:'', lastName:'', examineeId:'', gender:'Male', dob:'',
      email:'', comment:'', custom1:'', custom2:'', custom3:'', custom4:'',
    });
    setErrors({});
  };

  const validate1 = () => {
    const e={};
    if (!examinee.firstName.trim()) e.firstName='First name is required';
    if (!examinee.lastName.trim()) e.lastName='Last name is required';
    if (!examinee.examineeId.trim()) e.examineeId='Examinee ID is required';
    if (!examinee.gender) e.gender='Gender is required';
    if (!examinee.dob.trim()) e.dob='Date of birth is required';
    else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(examinee.dob)) e.dob='Format: DD/MM/YYYY';
    setErrors(e); return !Object.keys(e).length;
  };
  
  const validate2 = () => {
    const e={};
    if (!assess.testDate.trim()) e.testDate='Test Date is required';
    else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(assess.testDate)) e.testDate='Format: DD/MM/YYYY';
    setErrors(e); return !Object.keys(e).length;
  };

  const next = async () => {
    if (step===1 && !validate1()) return;
    if (step===2 && !validate2()) return;
    
    setErrors({});
    
    // If on step 1 and user created a new examinee, save it first
    if (step===1 && !selectedExaminee) {
      try {
        const result = await api.request('/examinees', {
          method: 'POST',
          body: JSON.stringify(examinee)
        });
        if (!result.success) {
          alert('Failed to create examinee: ' + result.message);
          return;
        }
        setSelectedExaminee(result.data);
      } catch (error) {
        alert('Failed to create examinee: ' + error.message);
        return;
      }
    }
    
    setStep(step+1);
  };

  const prev = () => setStep(step-1);

  // Get template data based on template type and examinee data (now uses API-loaded templates)
  const getTemplateData = (templateId, examinee, assessment, templates) => {
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      console.error('Template not found:', templateId);
      return null;
    }

    switch (template.id) {
      case 'RIPA-Primary':
        return {
          type: 'RIPA-Primary',
          name: 'ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY',
          examinee: examinee,
          assessment: assessment,
          templateData: template.templateData,
          formulaConfig: template.formulaConfig,
          scoringRules: template.scoringRules
        };
      
      case 'WRAT5':
        return {
          type: 'WRAT5',
          name: 'WIDE RANGE ACHIEVEMENT TEST- WRAT-5 (ENGLISH)',
          examinee: examinee,
          assessment: assessment,
          templateData: template.templateData,
          formulaConfig: template.formulaConfig,
          scoringRules: template.scoringRules
        };
      
      case 'WISC-4':
        return {
          type: 'WISC-4',
          name: 'WECHSLER\'S INTELLIGENCE SCALE FOR CHILDREN -WISC-IV India',
          examinee: examinee,
          assessment: assessment,
          templateData: template.templateData,
          formulaConfig: template.formulaConfig,
          scoringRules: template.scoringRules
        };
      
      default:
        return {
          type: template.id,
          name: template.name,
          examinee: examinee,
          assessment: assessment,
          templateData: template.templateData,
          formulaConfig: template.formulaConfig,
          scoringRules: template.scoringRules
        };
    }
  };

  const generate = async () => {
    const activeEx = selectedExaminee || examinee;
    if (!activeEx || !assess.testDate) {
      alert('Missing required information');
      return;
    }

    setIsGenerating(true);
    try {
      let reportData;

      if (useTemplate && selectedTemplate) {
        // Generate report using selected assessment template
        console.log('📄 Generating report using template:', selectedTemplate.name);
        
        // Get template data based on selected template (now using API-loaded templates)
        const templateData = getTemplateData(selectedTemplate.id, activeEx, assess, templates);
        
        const customData = {
          testDate: assess.testDate,
          examiner: assess.examiner,
          // Add any other assessment data that should override template
        };
        
        const result = await api.generateReportFromTemplate(selectedTemplate.id, examineeId, customData);
        
        if (result.success) {
          reportData = result.data;
        } else {
          throw new Error(result.message || 'Failed to generate report from template');
        }
      } else {
        // Generate custom report
        reportData = {
          type: 'Custom',
          name: 'Custom Assessment Report',
          examinee: activeEx,
          assessment: assess,
          scores: scores,
          options: opts
        };
      }

      // Store the generated report data
      setGeneratedReport(reportData);
      
      // Automatically open preview
      setTimeout(() => setIsPreviewOpen(true), 300);
      
    } catch (error) {
      console.error('❌ Failed to generate report:', error);
      console.error('Error details:', error?.message || JSON.stringify(error));
      alert('Failed to generate report: ' + (error?.message || 'Unknown error. Check console for details.'));
    } finally {
      setIsGenerating(false);
    }
  };

  // Load examinees on mount
  useEffect(() => {
    fetchExaminees();
  }, []);

  if (!isOpen) return null;

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(8,18,38,0.62)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10000,padding:16}}>
      <div style={{background:'white',borderRadius:12,width:'100%',maxWidth:1200,maxHeight:'90vh',overflow:'hidden',boxShadow:'0 25px 50px -12px rgba(0,0,0,0.25)',position:'relative'}}>
        {/* HEADER */}
        <div style={{padding:'24px 32px',borderBottom:'1px solid #e5e7eb',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <h2 style={{margin:0,fontSize:'24px',fontWeight:600,color:'#1f2937'}}>Generate Assessment Report</h2>
            <p style={{margin:'4px 0 0',fontSize:'14px',color:'#6b7280'}}>Create comprehensive assessment reports with templates</p>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:'24px',cursor:'pointer',color:'#9ca3af',padding:4}}>×</button>
        </div>

        <div style={{display:'flex',height:'calc(90vh - 180px)'}}>
          {/* MAIN CONTENT */}
          <div style={{flex:1,padding:'32px',overflowY:'auto'}}>
            {step===1 && (
              <Step1
                examinee={examinee} setExaminee={setExaminee}
                errors={errors}
                selectedExaminee={selectedExaminee}
                onSelectExaminee={handleSelectExaminee}
                onClearSelected={handleClearSelected}
                examinees={examinees}
              />
            )}
            {step===2 && (
              <Step2
                assess={assess} setAssess={setAssess}
                scores={scores} setScores={setScores}
                errors={errors}
                selectedExaminee={selectedExaminee}
                selectedAssessment={selectedAssessment} setSelectedAssessment={setSelectedAssessment}
                isPrefilled={isPrefilled} setIsPrefilled={setIsPrefilled}
                templates={templates}
                templatesLoading={templatesLoading}
                selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}
                useTemplate={useTemplate} setUseTemplate={setUseTemplate}
              />
            )}
            {step===3 && <Step3 opts={opts} setOpts={setOpts} />}
          </div>
          <Sidebar step={step} ex={selectedExaminee || examinee} assess={assess} scores={scores} selectedAssessment={selectedAssessment}/>
        </div>

        {/* FOOTER */}
        <div style={{padding:'20px 32px',borderTop:'1px solid #e5e7eb',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:'14px',color:'#6b7280'}}>
            Step {step} of 3
          </div>
          <div style={{display:'flex',gap:12}}>
            {step>1 && (
              <button
                onClick={prev}
                style={{padding:'10px 20px',border:'1px solid #d1d5db',background:'white',color:'#374151',borderRadius:6,cursor:'pointer',fontSize:'14px',fontWeight:500}}
              >
                Previous
              </button>
            )}
            {step<3 ? (
              <button
                onClick={next}
                style={{padding:'10px 20px',border:'none',background:'#3b82f6',color:'white',borderRadius:6,cursor:'pointer',fontSize:'14px',fontWeight:500}}
              >
                Next
              </button>
            ) : (
              <button
                onClick={generate}
                disabled={isGenerating}
                style={{padding:'10px 20px',border:'none',background:'#10b981',color:'white',borderRadius:6,cursor:'pointer',fontSize:'14px',fontWeight:500,opacity:isGenerating?0.7:1}}
              >
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {isPreviewOpen && generatedReport && (
        <ReportPreview
          reportData={generatedReport}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};

// Step Components (simplified for brevity)
const Step1 = ({ examinee, setExaminee, errors, selectedExaminee, onSelectExaminee, onClearSelected, examinees }) => (
  <div>
    <h3 style={{marginBottom:24}}>Examinee Information</h3>
    
    {/* Existing Examinee Selection */}
    <div style={{marginBottom:24}}>
      <label style={{display:'block',marginBottom:8,fontWeight:500,color:'#374151'}}>Select Existing Examinee (Optional)</label>
      <select
        value={selectedExaminee?.id || ''}
        onChange={(e) => {
          const ex = examinees.find(ex => ex.id === parseInt(e.target.value));
          if (ex) onSelectExaminee(ex);
        }}
        style={{width:'100%',padding:12,border:'1px solid #d1d5db',borderRadius:6,fontSize:14}}
      >
        <option value="">-- Select Examinee --</option>
        {examinees.map(ex => (
          <option key={ex.id} value={ex.id}>
            {ex.firstName} {ex.lastName} ({ex.examineeId})
          </option>
        ))}
      </select>
      {selectedExaminee && (
        <button
          onClick={onClearSelected}
          style={{marginTop:8,padding:'6px 12px',background:'#ef4444',color:'white',border:'none',borderRadius:4,fontSize:12,cursor:'pointer'}}
        >
          Clear Selection
        </button>
      )}
    </div>

    {/* New Examinee Form */}
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))',gap:16}}>
      <div>
        <label style={{display:'block',marginBottom:4,fontWeight:500,color:'#374151'}}>First Name *</label>
        <input
          value={examinee.firstName}
          onChange={(e) => setExaminee({...examinee, firstName:e.target.value})}
          style={{width:'100%',padding:10,border:'1px solid #d1d5db',borderRadius:6,fontSize:14}}
          placeholder="Enter first name"
        />
        {errors.firstName && <div style={{color:'#ef4444',fontSize:12,marginTop:4}}>{errors.firstName}</div>}
      </div>
      
      <div>
        <label style={{display:'block',marginBottom:4,fontWeight:500,color:'#374151'}}>Middle Name</label>
        <input
          value={examinee.middleName}
          onChange={(e) => setExaminee({...examinee, middleName:e.target.value})}
          style={{width:'100%',padding:10,border:'1px solid #d1d5db',borderRadius:6,fontSize:14}}
          placeholder="Enter middle name"
        />
      </div>
      
      <div>
        <label style={{display:'block',marginBottom:4,fontWeight:500,color:'#374151'}}>Last Name *</label>
        <input
          value={examinee.lastName}
          onChange={(e) => setExaminee({...examinee, lastName:e.target.value})}
          style={{width:'100%',padding:10,border:'1px solid #d1d5db',borderRadius:6,fontSize:14}}
          placeholder="Enter last name"
        />
        {errors.lastName && <div style={{color:'#ef4444',fontSize:12,marginTop:4}}>{errors.lastName}</div>}
      </div>
      
      <div>
        <label style={{display:'block',marginBottom:4,fontWeight:500,color:'#374151'}}>Examinee ID *</label>
        <input
          value={examinee.examineeId}
          onChange={(e) => setExaminee({...examinee, examineeId:e.target.value})}
          style={{width:'100%',padding:10,border:'1px solid #d1d5db',borderRadius:6,fontSize:14}}
          placeholder="Enter examinee ID"
        />
        {errors.examineeId && <div style={{color:'#ef4444',fontSize:12,marginTop:4}}>{errors.examineeId}</div>}
      </div>
      
      <div>
        <label style={{display:'block',marginBottom:4,fontWeight:500,color:'#374151'}}>Gender *</label>
        <select
          value={examinee.gender}
          onChange={(e) => setExaminee({...examinee, gender:e.target.value})}
          style={{width:'100%',padding:10,border:'1px solid #d1d5db',borderRadius:6,fontSize:14}}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <div style={{color:'#ef4444',fontSize:12,marginTop:4}}>{errors.gender}</div>}
      </div>
      
      <div>
        <label style={{display:'block',marginBottom:4,fontWeight:500,color:'#374151'}}>Date of Birth *</label>
        <input
          type="text"
          value={examinee.dob}
          onChange={(e) => setExaminee({...examinee, dob:e.target.value})}
          style={{width:'100%',padding:10,border:'1px solid #d1d5db',borderRadius:6,fontSize:14}}
          placeholder="DD/MM/YYYY"
        />
        {errors.dob && <div style={{color:'#ef4444',fontSize:12,marginTop:4}}>{errors.dob}</div>}
      </div>
    </div>
  </div>
);

const Step2 = ({ assess, setAssess, scores, setScores, errors, templates, templatesLoading, selectedTemplate, setSelectedTemplate, useTemplate, setUseTemplate }) => (
  <div>
    <h3 style={{marginBottom:24}}>Assessment Details</h3>
    
    {/* Template Selection */}
    <div style={{marginBottom:24}}>
      <label style={{display:'flex',alignItems:'center',marginBottom:8,fontWeight:500,color:'#374151'}}>
        <input
          type="checkbox"
          checked={useTemplate}
          onChange={(e) => setUseTemplate(e.target.checked)}
          style={{marginRight:8}}
        />
        Use Assessment Template
      </label>
      
      {useTemplate && (
        <div>
          {templatesLoading ? (
            <div style={{padding:12,background:'#f3f4f6',borderRadius:6,color:'#6b7280',fontSize:14}}>
              Loading templates...
            </div>
          ) : (
            <select
              value={selectedTemplate?.id || ''}
              onChange={(e) => {
                const template = templates.find(t => t.id === e.target.value);
                setSelectedTemplate(template);
              }}
              style={{width:'100%',padding:12,border:'1px solid #d1d5db',borderRadius:6,fontSize:14,marginTop:8}}
            >
              <option value="">-- Select Template --</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.icon} {template.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>

    {/* Assessment Form */}
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))',gap:16}}>
      <div>
        <label style={{display:'block',marginBottom:4,fontWeight:500,color:'#374151'}}>Test Date *</label>
        <input
          type="text"
          value={assess.testDate}
          onChange={(e) => setAssess({...assess, testDate:e.target.value})}
          style={{width:'100%',padding:10,border:'1px solid #d1d5db',borderRadius:6,fontSize:14}}
          placeholder="DD/MM/YYYY"
        />
        {errors.testDate && <div style={{color:'#ef4444',fontSize:12,marginTop:4}}>{errors.testDate}</div>}
      </div>
      
      <div>
        <label style={{display:'block',marginBottom:4,fontWeight:500,color:'#374151'}}>Examiner</label>
        <input
          value={assess.examiner}
          onChange={(e) => setAssess({...assess, examiner:e.target.value})}
          style={{width:'100%',padding:10,border:'1px solid #d1d5db',borderRadius:6,fontSize:14}}
          placeholder="Enter examiner name"
        />
      </div>
      
      <div>
        <label style={{display:'block',marginBottom:4,fontWeight:500,color:'#374151'}}>Language</label>
        <select
          value={assess.language}
          onChange={(e) => setAssess({...assess, language:e.target.value})}
          style={{width:'100%',padding:10,border:'1px solid #d1d5db',borderRadius:6,fontSize:14}}
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
        </select>
      </div>
    </div>
  </div>
);

const Step3 = ({ opts, setOpts }) => (
  <div>
    <h3 style={{marginBottom:24}}>Report Options</h3>
    
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',gap:20}}>
      <div>
        <label style={{display:'flex',alignItems:'center',marginBottom:8,fontWeight:500,color:'#374151'}}>
          <input
            type="checkbox"
            checked={opts.includeExamineeName}
            onChange={(e) => setOpts({...opts, includeExamineeName:e.target.checked})}
            style={{marginRight:8}}
          />
          Include Examinee Name
        </label>
      </div>
      
      <div>
        <label style={{display:'block',marginBottom:4,fontWeight:500,color:'#374151'}}>Score Summary Column</label>
        <select
          value={opts.scoreSummaryCol}
          onChange={(e) => setOpts({...opts, scoreSummaryCol:e.target.value})}
          style={{width:'100%',padding:10,border:'1px solid #d1d5db',borderRadius:6,fontSize:14}}
        >
          <option value="GSV">GSV</option>
          <option value="Standard Score">Standard Score</option>
          <option value="Percentile">Percentile</option>
        </select>
      </div>
    </div>
  </div>
);

const Sidebar = ({ step, ex, assess, scores, selectedAssessment }) => {
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={{width:280,background:'#f8fafc',padding:24,borderLeft:'1px solid #e5e7eb'}}>
      <div style={{textAlign:'center',marginBottom:24}}>
        <div style={{
          width:64,height:64,background:'#3b82f6',color:'white',borderRadius:'50%',
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:'bold',margin:'0 auto 12px'
        }}>
          {getInitials(ex?.firstName + ' ' + ex?.lastName)}
        </div>
        <div style={{fontWeight:600,color:'#1f2937'}}>{ex?.firstName} {ex?.lastName}</div>
        <div style={{fontSize:14,color:'#6b7280'}}>{ex?.examineeId}</div>
        <div style={{fontSize:12,color:'#9ca3af'}}>{ex?.gender} • {ex?.dob}</div>
      </div>

      <div style={{marginBottom:24}}>
        <h4 style={{margin:'0 0 12px',fontSize:14,fontWeight:600,color:'#374151'}}>Progress</h4>
        {[1,2,3].map(s => (
          <div
            key={s}
            style={{
              display:'flex',alignItems:'center',marginBottom:8,
              opacity: s <= step ? 1 : 0.3
            }}
          >
            <div style={{
              width:24,height:24,borderRadius:'50%',background:s <= step ? '#3b82f6' : '#e5e7eb',
              display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:12,fontWeight:'bold',marginRight:8
            }}>
              {s}
            </div>
            <span style={{fontSize:14,color:s <= step ? '#374151' : '#9ca3af'}}>
              {s === 1 ? 'Examinee Info' : s === 2 ? 'Assessment Details' : 'Report Options'}
            </span>
          </div>
        ))}
      </div>

      {assess.testDate && (
        <div>
          <h4 style={{margin:'0 0 12px',fontSize:14,fontWeight:600,color:'#374151'}}>Assessment Info</h4>
          <div style={{fontSize:12,color:'#6b7280',lineHeight:1.5}}>
            <div><strong>Date:</strong> {assess.testDate}</div>
            <div><strong>Examiner:</strong> {assess.examiner || 'Not specified'}</div>
            <div><strong>Language:</strong> {assess.language}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportPreview = ({ reportData, onClose }) => (
  <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10001}}>
    <div style={{background:'white',borderRadius:8,width:'90%',maxWidth:1000,height:'90%',maxHeight:800,overflow:'hidden'}}>
      <div style={{padding:20,borderBottom:'1px solid #e5e7eb',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3 style={{margin:0,fontSize:18,fontWeight:600,color:'#1f2937'}}>Report Preview</h3>
        <button onClick={onClose} style={{background:'none',border:'none',fontSize:20,cursor:'pointer',color:'#6b7280'}}>×</button>
      </div>
      <div style={{padding:20,height:'calc(100% - 80px)',overflow:'auto'}}>
        <div style={{background:'white',padding:40,fontSize:12,lineHeight:1.6}}>
          <h2 style={{textAlign:'center',marginBottom:30,fontSize:20,fontWeight:'bold'}}>
            {reportData.name || 'Assessment Report'}
          </h2>
          
          {reportData.examinee && (
            <div style={{marginBottom:30}}>
              <h3 style={{marginBottom:15,fontSize:16,fontWeight:600}}>Examinee Information</h3>
              <p><strong>Name:</strong> {reportData.examinee.firstName} {reportData.examinee.lastName}</p>
              <p><strong>ID:</strong> {reportData.examinee.examineeId}</p>
              <p><strong>Gender:</strong> {reportData.examinee.gender}</p>
              <p><strong>Date of Birth:</strong> {reportData.examinee.dob}</p>
            </div>
          )}
          
          {reportData.assessment && (
            <div style={{marginBottom:30}}>
              <h3 style={{marginBottom:15,fontSize:16,fontWeight:600}}>Assessment Details</h3>
              <p><strong>Test Date:</strong> {reportData.assessment.testDate}</p>
              <p><strong>Examiner:</strong> {reportData.assessment.examiner}</p>
              <p><strong>Language:</strong> {reportData.assessment.language}</p>
            </div>
          )}
          
          <div style={{textAlign:'center',marginTop:40,fontSize:12,color:'#6b7280'}}>
            <p>This report was generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default GenerateReportModal;
