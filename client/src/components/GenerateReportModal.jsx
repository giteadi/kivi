import { useState, useMemo, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchExaminees, createExaminee, createAssessmentWithScores, setSelectedExaminee, clearSelectedExaminee } from '../store/slices/examineeSlice';
import api from '../services/api';

/* ═══════════════════════════════════════════════════════════
   MOCK DATA  (replace with real API calls in production)
═══════════════════════════════════════════════════════════ */
const MOCK_EXAMINEES = [
  {
    id: 1, firstName: 'Darsh', middleName: '', lastName: 'Chamariya',
    examineeId: 'DC/MSL/260318', gender: 'Male', dob: '16/10/2013',
    email: '', comment: '', custom1:'', custom2:'', custom3:'', custom4:'',
    assessments: [
      {
        id: 'A-58415507', name: 'WRAT5-India Blue Form', date: '18/03/2026',
        deliveryMethod: 'Manual Entry', examiner: 'JAGGI, KRUTIKA',
        language: 'English', gradeLevel: '7', reasonForReferral: 'Low academic achievement',
        medications: '', testingSite: '',
        scores: {
          mathRaw:'30',  mathStd:'84',  mathCI:'76 - 92', mathPct:'14', mathCat:'Low Average',   mathAge:'9:04', mathGSV:'494',
          spellingRaw:'22', spellingStd:'73', spellingCI:'65 - 81', spellingPct:'4', spellingCat:'Very Low', spellingAge:'7:03', spellingGSV:'461',
          wordReadingRaw:'32', wordReadingStd:'68', wordReadingCI:'61 - 75', wordReadingPct:'2', wordReadingCat:'Extremely Low', wordReadingAge:'7:00', wordReadingGSV:'453',
          sentenceRaw:'8', sentenceStd:'85', sentenceCI:'80 - 90', sentencePct:'16', sentenceCat:'Low Average', sentenceAge:'9:02', sentenceGSV:'474',
          compositeRaw:'153', compositeStd:'74', compositeCI:'69 - 79', compositePct:'4', compositeCat:'Very Low',
          diff_wr_sp:'-5', sig_wr_sp:'NS', base_wr_sp:'-',
          diff_wr_mc:'-16', sig_wr_mc:'<.05', base_wr_mc:'<=25%',
          diff_wr_sc:'-17', sig_wr_sc:'<.05', base_wr_sc:'<=15%',
          diff_sp_mc:'-11', sig_sp_mc:'<.10', base_sp_mc:'<=25%',
          diff_sp_sc:'-12', sig_sp_sc:'<.05', base_sp_sc:'<=25%',
          diff_mc_sc:'-1',  sig_mc_sc:'NS',   base_mc_sc:'-',
        }
      }
    ]
  },
  {
    id: 2, firstName: 'Priya', middleName: '', lastName: 'Sharma',
    examineeId: 'PS/MSL/260112', gender: 'Female', dob: '05/04/2015',
    email: 'priya@example.com', comment: '', custom1:'', custom2:'', custom3:'', custom4:'',
    assessments: []
  },
  {
    id: 3, firstName: 'Arjun', middleName: 'Kumar', lastName: 'Verma',
    examineeId: 'AV/MSL/250890', gender: 'Male', dob: '22/07/2012',
    email: '', comment: '', custom1:'', custom2:'', custom3:'', custom4:'',
    assessments: [
      {
        id: 'A-58410001', name: 'WRAT5-India Blue Form', date: '10/01/2026',
        deliveryMethod: 'Manual Entry', examiner: 'JAGGI, KRUTIKA',
        language: 'English', gradeLevel: '9', reasonForReferral: 'Learning disability evaluation',
        medications: '', testingSite: '',
        scores: {
          mathRaw:'42', mathStd:'95', mathCI:'88-102', mathPct:'37', mathCat:'Average', mathAge:'11:06', mathGSV:'530',
          spellingRaw:'35', spellingStd:'88', spellingCI:'82-94', spellingPct:'21', spellingCat:'Low Average', spellingAge:'10:04', spellingGSV:'508',
          wordReadingRaw:'48', wordReadingStd:'92', wordReadingCI:'86-98', wordReadingPct:'30', wordReadingCat:'Average', wordReadingAge:'11:02', wordReadingGSV:'522',
          sentenceRaw:'12', sentenceStd:'90', sentenceCI:'84-96', sentencePct:'25', sentenceCat:'Average', sentenceAge:'11:00', sentenceGSV:'515',
          compositeRaw:'190', compositeStd:'90', compositeCI:'85-95', compositePct:'25', compositeCat:'Average',
          diff_wr_sp:'4', sig_wr_sp:'NS', base_wr_sp:'-',
          diff_wr_mc:'-3', sig_wr_mc:'NS', base_wr_mc:'-',
          diff_wr_sc:'2', sig_wr_sc:'NS', base_wr_sc:'-',
          diff_sp_mc:'-7', sig_sp_mc:'NS', base_sp_mc:'-',
          diff_sp_sc:'-2', sig_sp_sc:'NS', base_sp_sc:'-',
          diff_mc_sc:'5', sig_mc_sc:'NS', base_mc_sc:'-',
        }
      }
    ]
  },
];

const BLANK_SCORES = () => {
  const s = {};
  ['mathRaw','mathStd','mathCI','mathPct','mathCat','mathAge','mathGSV',
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

/* ═══════════════════════════════════════════════════════════
   INJECTED CSS
═══════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');
  @keyframes grm-spin { to { transform:rotate(360deg); } }
  @keyframes grm-up   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes grm-sl   { from{opacity:0;transform:translateX(14px)} to{opacity:1;transform:translateX(0)} }
  @keyframes grm-pop  { 0%{transform:scale(.96);opacity:0} 100%{transform:scale(1);opacity:1} }
  .grm * { box-sizing:border-box; font-family:'Source Sans 3',Arial,sans-serif; }
  .grm-in {
    width:100%; padding:7px 10px; border:1px solid #c4cdd8; border-radius:3px;
    font-size:13.5px; color:#1a1a1a; background:#fff; outline:none;
    transition:border-color .15s,box-shadow .15s;
  }
  .grm-in:focus { border-color:#0066cc; box-shadow:0 0 0 3px rgba(0,102,204,.13); }
  .grm-in.err   { border-color:#cc3333; }
  .grm-sel { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 9px center; padding-right:28px; }
  .grm-label { font-size:13px; font-weight:600; color:#444; margin-bottom:5px; display:block; }
  .grm-err-txt { font-size:12px; color:#cc3333; margin-top:3px; }
  .grm-req { color:#cc3333; margin-left:2px; }
  .grm-or  { background:#f5a623; color:#fff; border:none; border-radius:3px; padding:10px 20px; font-size:14px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:background .15s; }
  .grm-or:hover { background:#e09310; }
  .grm-or:disabled { background:#bbb; cursor:not-allowed; }
  .grm-bl  { background:#fff; color:#1e3a5f; border:1.5px solid #1e3a5f; border-radius:3px; padding:10px 20px; font-size:14px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:all .15s; }
  .grm-bl:hover { background:#eef2f8; }
  .grm-gr  { background:#2e7d32; color:#fff; border:none; border-radius:3px; padding:10px 20px; font-size:14px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:background .15s; }
  .grm-gr:hover { background:#1b5e20; }
  .grm-ghost { background:none; border:1px solid #aaa; border-radius:3px; padding:6px 14px; font-size:13px; color:#555; cursor:pointer; transition:all .15s; }
  .grm-ghost:hover { background:#f0f0f0; border-color:#666; }
  .grm-section { animation:grm-sl .22s ease; }
  .grm-tr:hover > div { background:#eef5ff !important; }
  .grm-ex-card { border:1.5px solid #d0d8e4; border-radius:4px; padding:12px 14px; cursor:pointer; transition:all .15s; background:#fff; margin-bottom:8px; }
  .grm-ex-card:hover { border-color:#0066cc; background:#f0f6ff; }
  .grm-ex-card.sel { border-color:#0066cc; background:#e8f0ff; }
  .grm-pill { display:inline-flex; align-items:center; gap:5px; background:#e8f0ff; color:#1e3a5f; border-radius:20px; padding:3px 10px; font-size:12px; font-weight:600; }
  .grm-pill-green { background:#e8f5e9; color:#2e7d32; }
  .grm-rl { display:flex; align-items:center; gap:9px; cursor:pointer; font-size:13.5px; color:#333; margin-bottom:8px; user-select:none; }
  .grm-cl { display:flex; align-items:center; gap:9px; cursor:pointer; font-size:13.5px; color:#333; user-select:none; }
  .grm-tab-btn { padding:8px 18px; border:none; background:none; font-size:13.5px; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .15s; }
  .grm-score-input { text-align:center; padding:5px 4px; font-size:13px; }
  .grm-th { padding:9px 6px; text-align:center; font-size:11.5px; font-weight:700; color:#fff; border-right:1px solid #2e4f7a; }
  .grm-td { padding:5px 4px; border-right:1px solid #e0e6ef; display:flex; align-items:center; justify-content:center; }
  .grm-prefill-badge { font-size:11px; background:#fff3cd; color:#856404; border:1px solid #ffc107; border-radius:3px; padding:1px 7px; font-weight:600; }
`;

/* ═══════════════════════════════════════════════════════════
   TINY SVG ICONS
═══════════════════════════════════════════════════════════ */
const Chk = ({c='#fff',s=11}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const X18 = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const Dl  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const Sp  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:'grm-spin .8s linear infinite'}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>;
const ChR = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const ChD = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const SrchIco = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const PlusIco = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const EditIco = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

/* ═══════════════════════════════════════════════════════════
   SMALL PRIMITIVES
═══════════════════════════════════════════════════════════ */
const WR5Logo = () => (
  <div style={{display:'flex',alignItems:'center',gap:5}}>
    <div style={{background:'#1a4a8a',color:'#fff',fontWeight:900,fontSize:12,padding:'3px 6px',borderRadius:3,fontFamily:'Georgia,serif'}}>WR</div>
    <span style={{fontWeight:900,fontSize:19,color:'#1a4a8a',fontFamily:'Georgia,serif',letterSpacing:-0.5}}>WRAT5</span>
    <span style={{fontSize:9,color:'#1a4a8a',fontWeight:700,marginBottom:10}}>INDIA</span>
  </div>
);

const RadioBtn = ({checked,onChange,label}) => (
  <label className="grm-rl" onClick={onChange}>
    <div style={{width:17,height:17,borderRadius:'50%',border:`2px solid ${checked?'#0066cc':'#aaa'}`,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      {checked && <div style={{width:8,height:8,borderRadius:'50%',background:'#0066cc'}}/>}
    </div>
    {label}
  </label>
);
const CheckBox = ({checked,onChange,label}) => (
  <label className="grm-cl" onClick={onChange}>
    <div style={{width:17,height:17,borderRadius:3,border:`2px solid ${checked?'#0066cc':'#aaa'}`,background:checked?'#0066cc':'#fff',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .15s'}}>
      {checked && <Chk/>}
    </div>
    {label}
  </label>
);
const Field = ({label,required,error,children,style}) => (
  <div style={{marginBottom:14,...style}}>
    {label && <label className="grm-label">{label}{required && <span className="grm-req">*</span>}</label>}
    {children}
    {error && <div className="grm-err-txt">{error}</div>}
  </div>
);
const calcAge = (dob) => {
  if (!dob || !/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) return '';
  const [d,m,y] = dob.split('/').map(Number);
  const b = new Date(y,m-1,d); const now = new Date();
  let yr = now.getFullYear()-b.getFullYear(); let mo = now.getMonth()-b.getMonth();
  if (mo<0){yr--;mo+=12;}
  return `${yr} yrs ${mo} mos`;
};

/* ═══════════════════════════════════════════════════════════
   STEP INDICATOR
═══════════════════════════════════════════════════════════ */
const StepBar = ({current}) => {
  const steps = ['Examinee Details','Assessment & Scores','Report Configuration'];
  return (
    <div style={{display:'flex',alignItems:'center',padding:'13px 24px',background:'#eef2f8',borderBottom:'1px solid #d0d8e4',flexShrink:0}}>
      {steps.map((label,i)=>{
        const n=i+1; const done=n<current; const active=n===current;
        return (
          <div key={n} style={{display:'flex',alignItems:'center',flex:i<2?1:'none'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:27,height:27,borderRadius:'50%',background:done?'#2e7d32':active?'#1e3a5f':'#b8c4d4',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,flexShrink:0,transition:'all .2s'}}>
                {done?<Chk s={12}/>:n}
              </div>
              <span style={{fontSize:12.5,fontWeight:active?700:400,color:active?'#1e3a5f':done?'#2e7d32':'#888',whiteSpace:'nowrap'}}>{label}</span>
            </div>
            {i<2 && <div style={{flex:1,height:2,background:done?'#2e7d32':'#cdd5e0',margin:'0 12px',minWidth:20,transition:'background .3s'}}/>}
          </div>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   RIGHT SUMMARY SIDEBAR
═══════════════════════════════════════════════════════════ */
const Sidebar = ({step,ex,assess,scores,selectedAssessment}) => {
  const fullName = [ex.lastName,ex.firstName].filter(Boolean).join(', ');
  const isPrefilled = !!selectedAssessment;
  return (
    <div style={{width:258,flexShrink:0,background:'#f8fafc',borderLeft:'1px solid #d0d8e4',padding:'20px 16px',overflowY:'auto',display:'flex',flexDirection:'column',gap:0}}>
      <div style={{fontWeight:700,fontSize:15,color:'#1e3a5f',borderBottom:'2px solid #1e3a5f',paddingBottom:7,marginBottom:14}}>Summary</div>

      {/* Examinee */}
      <SideBlock title="Examinee">
        {fullName ? (
          <div style={{fontSize:13,lineHeight:1.85,color:'#222'}}>
            <div style={{fontWeight:700}}>{fullName}</div>
            {ex.dob && <div>{ex.dob}{calcAge(ex.dob)?` | ${calcAge(ex.dob)}`:''}</div>}
            {ex.examineeId && <div style={{color:'#555'}}>{ex.examineeId}</div>}
            {ex.gender && ex.gender!=='Please Select...' && <div>{ex.gender}</div>}
            <div style={{color:'#bbb',fontStyle:'italic'}}>{ex.email||'(no e-mail)'}</div>
          </div>
        ) : <Muted>Complete Step 1 to see details</Muted>}
      </SideBlock>

      {/* Assessment */}
      <SideBlock title="Assessment">
        {assess.testDate ? (
          <div style={{fontSize:13,lineHeight:1.85,color:'#222'}}>
            <WR5Logo/>
            <div style={{marginTop:6}}>WRAT5-India Blue Form</div>
            <div>Delivery: {assess.deliveryMethod}</div>
            <div>{assess.testDate}</div>
            {isPrefilled && <div style={{marginTop:6}}><span className="grm-prefill-badge">Pre-filled from saved data</span></div>}
          </div>
        ) : <Muted>Complete Step 2 to see details</Muted>}
      </SideBlock>

      {/* Score mini-preview */}
      {(scores.mathStd||scores.spellingStd||scores.wordReadingStd||scores.sentenceStd) && (
        <SideBlock title="Score Preview">
          {[
            {l:'Math Computation',v:scores.mathStd,cat:scores.mathCat},
            {l:'Spelling',v:scores.spellingStd,cat:scores.spellingCat},
            {l:'Word Reading',v:scores.wordReadingStd,cat:scores.wordReadingCat},
            {l:'Sentence Comp.',v:scores.sentenceStd,cat:scores.sentenceCat},
          ].filter(r=>r.v).map(r=>(
            <div key={r.l} style={{marginBottom:6}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12.5,color:'#333',fontWeight:600}}>
                <span>{r.l}</span><span>SS: {r.v}</span>
              </div>
              {r.cat && r.cat!=='' && r.cat!=='Please select...' &&
                <div style={{fontSize:11.5,color:getCatColor(r.cat),marginTop:1}}>{r.cat}</div>}
            </div>
          ))}
          {scores.compositeStd && (
            <div style={{borderTop:'1px solid #d0d8e4',paddingTop:7,marginTop:4}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'#1e3a5f',fontWeight:800}}>
                <span>Reading Composite</span><span>SS: {scores.compositeStd}</span>
              </div>
              {scores.compositeCat && <div style={{fontSize:11.5,color:getCatColor(scores.compositeCat),marginTop:1}}>{scores.compositeCat}</div>}
            </div>
          )}
        </SideBlock>
      )}

      {step===3 && (
        <div style={{background:'#fff',border:'1px solid #d0d8e4',borderRadius:4,padding:'12px 13px',marginTop:4}}>
          <div style={{display:'flex',gap:9,alignItems:'flex-start'}}>
            <div style={{background:'#2e7d32',borderRadius:'50%',width:21,height:21,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}><Chk s={11}/></div>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:'#222'}}>WRAT5-India Score Report</div>
              <div style={{fontSize:12,color:'#666',marginTop:3}}>0 usage charged for this report.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const SideBlock = ({title,children}) => (
  <div style={{marginBottom:14}}>
    <div style={{fontSize:11,fontWeight:700,color:'#888',textTransform:'uppercase',letterSpacing:.7,marginBottom:7}}>{title}</div>
    {children}
    <hr style={{border:'none',borderTop:'1px solid #e4eaf2',margin:'14px 0 0 0'}}/>
  </div>
);
const Muted = ({children}) => <div style={{fontSize:12.5,color:'#bbb',fontStyle:'italic'}}>{children}</div>;
const getCatColor = (cat) => {
  if (!cat) return '#888';
  const c = cat.toLowerCase();
  if (c.includes('extremely low')) return '#b71c1c';
  if (c.includes('very low')) return '#d32f2f';
  if (c.includes('low average')) return '#e64a19';
  if (c.includes('average')) return '#2e7d32';
  if (c.includes('high') || c.includes('very high') || c.includes('extremely high')) return '#1565c0';
  return '#555';
};

/* ═══════════════════════════════════════════════════════════
   REPORT PREVIEW MODAL
═══════════════════════════════════════════════════════════ */
const ReportPreviewModal = ({isOpen, reportData, onClose, onDownload}) => {
  if (!isOpen || !reportData) return null;

  const subScores = [
    {label: 'Math Computation', raw: reportData.scores.mathRaw, std: reportData.scores.mathStd, pct: reportData.scores.mathPct, cat: reportData.scores.mathCat},
    {label: 'Spelling', raw: reportData.scores.spellingRaw, std: reportData.scores.spellingStd, pct: reportData.scores.spellingPct, cat: reportData.scores.spellingCat},
    {label: 'Word Reading', raw: reportData.scores.wordReadingRaw, std: reportData.scores.wordReadingStd, pct: reportData.scores.wordReadingPct, cat: reportData.scores.wordReadingCat},
    {label: 'Sentence Comp.', raw: reportData.scores.sentenceRaw, std: reportData.scores.sentenceStd, pct: reportData.scores.sentencePct, cat: reportData.scores.sentenceCat},
  ];

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(8,18,38,0.62)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10000,padding:16}}>
      <div style={{background:'#fff',borderRadius:6,width:'100%',maxWidth:900,maxHeight:'90vh',display:'flex',flexDirection:'column',boxShadow:'0 24px 70px rgba(0,0,0,0.35)',overflow:'hidden'}}>
        
        {/* Header */}
        <div style={{background:'#1e3a5f',color:'#fff',padding:'20px 24px',borderBottom:'1px solid #d0d8e4',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div style={{fontSize:18,fontWeight:700}}>📄 Report Preview</div>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#fff',cursor:'pointer',fontSize:24}}>×</button>
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:'auto',padding:'30px 40px'}}>
          
          {/* Title */}
          <div style={{textAlign:'center',marginBottom:30,borderBottom:'2px solid #1e3a5f',paddingBottom:20}}>
            <div style={{fontSize:24,fontWeight:700,color:'#1e3a5f',marginBottom:5}}>WRAT5-India Score Report</div>
            <div style={{fontSize:13,color:'#666'}}>Wide Range Achievement Test - India Blue Form</div>
          </div>

          {/* Examinee Section */}
          <div style={{marginBottom:25}}>
            <div style={{fontSize:14,fontWeight:700,color:'#1e3a5f',background:'#eef2f8',padding:'10px 12px',marginBottom:12}}>EXAMINEE INFORMATION</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px 24px',fontSize:13}}>
              <div><span style={{fontWeight:600}}>Name:</span> {reportData.examinee.firstName} {reportData.examinee.lastName}</div>
              <div><span style={{fontWeight:600}}>Examinee ID:</span> {reportData.examinee.examineeId}</div>
              <div><span style={{fontWeight:600}}>Date of Birth:</span> {reportData.examinee.dob}</div>
              <div><span style={{fontWeight:600}}>Gender:</span> {reportData.examinee.gender}</div>
            </div>
          </div>

          {/* Assessment Section */}
          <div style={{marginBottom:25}}>
            <div style={{fontSize:14,fontWeight:700,color:'#1e3a5f',background:'#eef2f8',padding:'10px 12px',marginBottom:12}}>ASSESSMENT DETAILS</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px 24px',fontSize:13}}>
              <div><span style={{fontWeight:600}}>Test Date:</span> {reportData.assessment.testDate}</div>
              <div><span style={{fontWeight:600}}>Examiner:</span> {reportData.assessment.examiner}</div>
              <div><span style={{fontWeight:600}}>Method:</span> {reportData.assessment.deliveryMethod}</div>
              <div><span style={{fontWeight:600}}>Language:</span> {reportData.assessment.language}</div>
            </div>
          </div>

          {/* Scores Section */}
          <div style={{marginBottom:25}}>
            <div style={{fontSize:14,fontWeight:700,color:'#1e3a5f',background:'#eef2f8',padding:'10px 12px',marginBottom:12}}>SCORE SUMMARY</div>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <thead>
                <tr style={{background:'#1e3a5f',color:'#fff'}}>
                  <th style={{padding:'10px',textAlign:'left',borderRight:'1px solid #2e4f7a'}}>Subtest</th>
                  <th style={{padding:'10px',textAlign:'center',borderRight:'1px solid #2e4f7a'}}>Raw Score</th>
                  <th style={{padding:'10px',textAlign:'center',borderRight:'1px solid #2e4f7a'}}>Std Score</th>
                  <th style={{padding:'10px',textAlign:'center',borderRight:'1px solid #2e4f7a'}}>Percentile</th>
                  <th style={{padding:'10px',textAlign:'left'}}>Category</th>
                </tr>
              </thead>
              <tbody>
                {subScores.map((s,i) => (
                  <tr key={s.label} style={{background:i%2===0?'#fff':'#f9f9f9',borderBottom:'1px solid #e0e0e0'}}>
                    <td style={{padding:'10px',borderRight:'1px solid #e0e0e0'}}>{s.label}</td>
                    <td style={{padding:'10px',textAlign:'center',borderRight:'1px solid #e0e0e0'}}>{s.raw||'—'}</td>
                    <td style={{padding:'10px',textAlign:'center',borderRight:'1px solid #e0e0e0',fontWeight:600}}>{s.std||'—'}</td>
                    <td style={{padding:'10px',textAlign:'center',borderRight:'1px solid #e0e0e0'}}>{s.pct||'—'}</td>
                    <td style={{padding:'10px',color:getCatColor(s.cat)}}>{s.cat||'—'}</td>
                  </tr>
                ))}
                <tr style={{background:'#eef2f8',borderTop:'2px solid #1e3a5f',fontWeight:700}}>
                  <td style={{padding:'10px',borderRight:'1px solid #c0ccde'}}>Reading Composite</td>
                  <td style={{padding:'10px',textAlign:'center',borderRight:'1px solid #c0ccde'}}>{reportData.scores.compositeRaw||'—'}</td>
                  <td style={{padding:'10px',textAlign:'center',borderRight:'1px solid #c0ccde'}}>{reportData.scores.compositeStd||'—'}</td>
                  <td style={{padding:'10px',textAlign:'center',borderRight:'1px solid #c0ccde'}}>{reportData.scores.compositePct||'—'}</td>
                  <td style={{padding:'10px',color:getCatColor(reportData.scores.compositeCat)}}>{reportData.scores.compositeCat||'—'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{fontSize:11,color:'#999',textAlign:'right',marginTop:30,paddingTop:20,borderTop:'1px solid #ddd'}}>
            Generated: {reportData.timestamp}
          </div>
        </div>

        {/* Footer */}
        <div style={{padding:'15px 24px',borderTop:'1px solid #d0d8e4',display:'flex',gap:10,justifyContent:'flex-end',background:'#f9f9f9',flexShrink:0}}>
          <button onClick={onClose} style={{padding:'10px 20px',border:'1.5px solid #1e3a5f',background:'#fff',color:'#1e3a5f',borderRadius:3,cursor:'pointer',fontWeight:600,fontSize:13}}>
            Back to Edit
          </button>
          <button onClick={onDownload} style={{padding:'10px 20px',background:'#2e7d32',color:'#fff',border:'none',borderRadius:3,cursor:'pointer',fontWeight:600,fontSize:13,display:'flex',alignItems:'center',gap:8}}>
            ⬇️ Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   STEP 1 — EXAMINEE (search/select OR create new)
═══════════════════════════════════════════════════════════ */
const Step1 = ({examinee,setExaminee,errors,selectedExaminee,onSelectExaminee,onClearSelected}) => {
  const [mode, setMode] = useState(selectedExaminee ? 'select' : 'select'); // 'select' | 'new'
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Demographics');
  
  const dispatch = useDispatch();
  const { examinees, isLoading } = useSelector((state) => state.examinees);

  // Fetch examinees from Redux
  useEffect(() => {
    dispatch(fetchExaminees());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return examinees;
    return examinees.filter(e =>
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
      e.examineeId.toLowerCase().includes(q)
    );
  }, [query, examinees]);

  const switchToNew = () => {
    onClearSelected();
    setMode('new');
  };
  const switchToSearch = () => {
    setMode('select');
  };

  return (
    <div className="grm-section" style={{padding:'24px 28px'}}>

      {/* Mode toggle */}
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
        <button className={mode==='select'?'grm-or':'grm-bl'} onClick={switchToSearch} style={{padding:'8px 16px',fontSize:13}}>
          Search Existing Examinee
        </button>
        <span style={{color:'#aaa',fontSize:13}}>or</span>
        <button className={mode==='new'?'grm-or':'grm-bl'} onClick={switchToNew} style={{padding:'8px 16px',fontSize:13,display:'flex',alignItems:'center',gap:6}}>
          <PlusIco/> Add New Examinee
        </button>
      </div>

      {/* ── SEARCH / SELECT MODE ── */}
      {mode==='select' && (
        <div>
          <div style={{position:'relative',marginBottom:14}}>
            <div style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)'}}>
              <SrchIco/>
            </div>
            <input className="grm-in" style={{paddingLeft:32}} placeholder="Search by name or examinee ID…"
              value={query} onChange={e=>setQuery(e.target.value)} />
          </div>

          {selectedExaminee && (
            <div style={{marginBottom:12,padding:'10px 14px',background:'#e8f0ff',border:'1.5px solid #0066cc',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{background:'#0066cc',borderRadius:'50%',width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center'}}><Chk s={11}/></div>
                <div>
                  <div style={{fontWeight:700,fontSize:13.5,color:'#1e3a5f'}}>{selectedExaminee.lastName}, {selectedExaminee.firstName}</div>
                  <div style={{fontSize:12,color:'#555'}}>{selectedExaminee.examineeId} &nbsp;·&nbsp; {selectedExaminee.dob} &nbsp;·&nbsp; {selectedExaminee.gender}</div>
                </div>
              </div>
              <button className="grm-ghost" onClick={onClearSelected} style={{fontSize:12,padding:'4px 10px'}}>Change</button>
            </div>
          )}

          <div style={{maxHeight:320,overflowY:'auto',paddingRight:2}}>
            {isLoading && (
              <div style={{textAlign:'center',padding:'30px 0',color:'#bbb',fontSize:13}}>
                <div style={{display:'inline-block',width:20,height:20,border:'2px solid #ddd',borderTop:'2px solid #0066cc',borderRadius:'50%',animation:'grm-spin 1s linear infinite',marginBottom:10}}></div>
                <div>Loading examinees...</div>
              </div>
            )}
            {!isLoading && filtered.length===0 && (
              <div style={{textAlign:'center',padding:'30px 0',color:'#bbb',fontSize:13}}>No examinees found</div>
            )}
            {!isLoading && filtered.map(ex => {
              const isSel = selectedExaminee?.id===ex.id;
              return (
                <div key={ex.id} className={`grm-ex-card${isSel?' sel':''}`} onClick={()=>onSelectExaminee(ex)}>
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:14,color:'#1a1a1a',marginBottom:3}}>
                        {ex.lastName}, {ex.firstName} {ex.middleName}
                        {isSel && <span style={{marginLeft:8,fontSize:11,background:'#0066cc',color:'#fff',borderRadius:20,padding:'1px 8px',fontWeight:600,verticalAlign:'middle'}}>Selected</span>}
                      </div>
                      <div style={{fontSize:12.5,color:'#666',display:'flex',flexWrap:'wrap',gap:'4px 16px'}}>
                        <span>ID: {ex.examineeId}</span>
                        <span>DOB: {ex.dob}</span>
                        <span>{ex.gender}</span>
                        <span>Age: {calcAge(ex.dob)}</span>
                      </div>
                    </div>
                    <div>
                      {ex.assessments.length>0
                        ? <span className="grm-pill grm-pill-green">✓ {ex.assessments.length} Assessment{ex.assessments.length>1?'s':''}</span>
                        : <span className="grm-pill" style={{background:'#f5f5f5',color:'#999'}}>No assessments</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {errors.examinee && <div className="grm-err-txt" style={{marginTop:8}}>{errors.examinee}</div>}
        </div>
      )}

      {/* ── NEW EXAMINEE FORM ── */}
      {mode==='new' && (
        <div>
          <div style={{display:'flex',borderBottom:'1px solid #d0d8e4',marginBottom:22}}>
            {['Demographics','Evaluation','History'].map(t=>(
              <button key={t} className="grm-tab-btn" onClick={()=>setActiveTab(t)}
                style={{fontWeight:activeTab===t?700:400,color:activeTab===t?'#1e3a5f':'#666',borderBottomColor:activeTab===t?'#1e3a5f':'transparent'}}>
                {t}
              </button>
            ))}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 32px'}}>
            <div>
              <Field label="First Name" required error={errors.firstName}>
                <input className={`grm-in${errors.firstName?' err':''}`} placeholder="First Name"
                  value={examinee.firstName} onChange={e=>setExaminee(p=>({...p,firstName:e.target.value}))}/>
              </Field>
              <Field label="Middle Name">
                <input className="grm-in" placeholder="Middle Name"
                  value={examinee.middleName} onChange={e=>setExaminee(p=>({...p,middleName:e.target.value}))}/>
              </Field>
              <Field label="Last Name">
                <input className="grm-in" placeholder="Last Name"
                  value={examinee.lastName} onChange={e=>setExaminee(p=>({...p,lastName:e.target.value}))}/>
              </Field>
              <Field label="Examinee ID">
                <input className="grm-in" placeholder="e.g. DC/MSL/260318"
                  value={examinee.examineeId} onChange={e=>setExaminee(p=>({...p,examineeId:e.target.value}))}/>
              </Field>
              <Field label="Gender">
                <select className="grm-in grm-sel" value={examinee.gender} onChange={e=>setExaminee(p=>({...p,gender:e.target.value}))}>
                  {['Please Select...','Male','Female','Non-binary','Prefer not to say'].map(g=><option key={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Birth Date" required error={errors.dob}>
                <input className={`grm-in${errors.dob?' err':''}`} placeholder="DD/MM/YYYY"
                  value={examinee.dob} onChange={e=>setExaminee(p=>({...p,dob:e.target.value}))}/>
                {examinee.dob && /^\d{2}\/\d{2}\/\d{4}$/.test(examinee.dob) &&
                  <div style={{fontSize:12,color:'#555',marginTop:4}}>Age: {calcAge(examinee.dob)}</div>}
              </Field>
              <Field label="Email">
                <input className="grm-in" type="email" placeholder="Email address"
                  value={examinee.email} onChange={e=>setExaminee(p=>({...p,email:e.target.value}))}/>
              </Field>
            </div>
            <div>
              {['Custom Field 1','Custom Field 2','Custom Field 3','Custom Field 4'].map((cf,i)=>(
                <Field key={cf} label={cf}>
                  <input className="grm-in" value={examinee[`custom${i+1}`]}
                    onChange={e=>setExaminee(p=>({...p,[`custom${i+1}`]:e.target.value}))}/>
                </Field>
              ))}
              <Field label="Comment">
                <textarea className="grm-in" rows={5} placeholder="Optional notes…"
                  value={examinee.comment} onChange={e=>setExaminee(p=>({...p,comment:e.target.value}))} style={{resize:'vertical'}}/>
                <div style={{fontSize:11.5,color:'#888',textAlign:'right'}}>{500-(examinee.comment?.length||0)} Characters remaining</div>
              </Field>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   STEP 2 — ASSESSMENT + SCORES  (pre-fill if available)
═══════════════════════════════════════════════════════════ */
const SUBTESTS = [
  {label:'Math Computation',   rk:'mathRaw',        sk:'mathStd',        ck:'mathCI',        pk:'mathPct',        catk:'mathCat',        ak:'mathAge',        gk:'mathGSV'},
  {label:'Spelling',           rk:'spellingRaw',    sk:'spellingStd',    ck:'spellingCI',    pk:'spellingPct',    catk:'spellingCat',    ak:'spellingAge',    gk:'spellingGSV'},
  {label:'Word Reading',       rk:'wordReadingRaw', sk:'wordReadingStd', ck:'wordReadingCI', pk:'wordReadingPct', catk:'wordReadingCat', ak:'wordReadingAge', gk:'wordReadingGSV'},
  {label:'Sentence Comp.',     rk:'sentenceRaw',    sk:'sentenceStd',    ck:'sentenceCI',    pk:'sentencePct',    catk:'sentenceCat',    ak:'sentenceAge',    gk:'sentenceGSV'},
];
const CATS = ['','Extremely Low','Very Low','Low Average','Average','High Average','Very High','Extremely High'];
const COMP_ROWS = [
  {l:'Word Reading vs. Spelling',                  dk:'diff_wr_sp',sigk:'sig_wr_sp',bk:'base_wr_sp'},
  {l:'Word Reading vs. Math Computation',          dk:'diff_wr_mc',sigk:'sig_wr_mc',bk:'base_wr_mc'},
  {l:'Word Reading vs. Sentence Comprehension',    dk:'diff_wr_sc',sigk:'sig_wr_sc',bk:'base_wr_sc'},
  {l:'Spelling vs. Math Computation',              dk:'diff_sp_mc',sigk:'sig_sp_mc',bk:'base_sp_mc'},
  {l:'Spelling vs. Sentence Comprehension',        dk:'diff_sp_sc',sigk:'sig_sp_sc',bk:'base_sp_sc'},
  {l:'Math Computation vs. Sentence Comprehension',dk:'diff_mc_sc',sigk:'sig_mc_sc',bk:'base_mc_sc'},
];
const COLS = '156px 76px 86px 104px 86px 148px 76px 80px';

const SI = ({val,onChange}) => (
  <input className="grm-in grm-score-input" placeholder="—" value={val||''} onChange={e=>onChange(e.target.value)}/>
);

const Step2 = ({assess,setAssess,scores,setScores,errors,selectedExaminee,selectedAssessment,setSelectedAssessment,isPrefilled,setIsPrefilled,templates,selectedTemplate,setSelectedTemplate,useTemplate,setUseTemplate}) => {
  const [showAssessmentPicker, setShowAssessmentPicker] = useState(false);

  const availableAssessments = selectedExaminee?.assessments || [];

  const loadAssessment = (a) => {
    setSelectedAssessment(a);
    setAssess(prev=>({...prev,
      deliveryMethod: a.deliveryMethod||prev.deliveryMethod,
      testDate: a.date||prev.testDate,
      examiner: a.examiner||prev.examiner,
      language: a.language||prev.language,
      gradeLevel: a.gradeLevel||prev.gradeLevel,
      reasonForReferral: a.reasonForReferral||prev.reasonForReferral,
      medications: a.medications||prev.medications,
      testingSite: a.testingSite||prev.testingSite,
    }));
    setScores({...BLANK_SCORES(), ...a.scores});
    setIsPrefilled(true);
    setShowAssessmentPicker(false);
  };

  const clearPrefill = () => {
    setSelectedAssessment(null);
    setAssess(p=>({...p,testDate:'',examiner:'',gradeLevel:'Please select...',reasonForReferral:'Please select...'}));
    setScores(BLANK_SCORES());
    setIsPrefilled(false);
  };

  return (
    <div className="grm-section" style={{padding:'24px 28px'}}>

      {/* Pre-fill banner */}
      {availableAssessments.length > 0 && (
        <div style={{marginBottom:20,padding:'12px 16px',background:isPrefilled?'#e8f5e9':'#fff3cd',border:`1px solid ${isPrefilled?'#81c784':'#ffc107'}`,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{fontSize:20}}>{isPrefilled?'✅':'📋'}</div>
            <div>
              {isPrefilled ? (
                <div>
                  <div style={{fontWeight:700,fontSize:13.5,color:'#1b5e20'}}>Scores pre-filled from saved assessment</div>
                  <div style={{fontSize:12.5,color:'#388e3c'}}>{selectedAssessment?.name} &nbsp;·&nbsp; {selectedAssessment?.date} &nbsp;·&nbsp; You can edit any field below</div>
                </div>
              ) : (
                <div>
                  <div style={{fontWeight:700,fontSize:13.5,color:'#856404'}}>Saved assessments available for this examinee</div>
                  <div style={{fontSize:12.5,color:'#795548'}}>{availableAssessments.length} assessment(s) found — load scores automatically</div>
                </div>
              )}
            </div>
          </div>
          <div style={{display:'flex',gap:8,flexShrink:0}}>
            {!isPrefilled && (
              <button className="grm-or" style={{padding:'7px 14px',fontSize:13}} onClick={()=>setShowAssessmentPicker(true)}>
                Load Assessment
              </button>
            )}
            {isPrefilled && (
              <button className="grm-ghost" style={{fontSize:12.5}} onClick={clearPrefill}>Clear &amp; Enter Manually</button>
            )}
            {availableAssessments.length > 1 && isPrefilled && (
              <button className="grm-bl" style={{padding:'6px 12px',fontSize:12.5}} onClick={()=>setShowAssessmentPicker(true)}>
                Switch Assessment
              </button>
            )}
          </div>
        </div>
      )}

      {/* Assessment picker dropdown */}
      {showAssessmentPicker && (
        <div style={{marginBottom:16,background:'#fff',border:'1.5px solid #0066cc',borderRadius:4,padding:'14px 16px',animation:'grm-pop .18s ease'}}>
          <div style={{fontWeight:700,fontSize:13.5,color:'#1e3a5f',marginBottom:12}}>Select an Assessment to Load</div>
          {availableAssessments.map(a=>(
            <div key={a.id} className="grm-ex-card" style={{marginBottom:8}} onClick={()=>loadAssessment(a)}>
              <div style={{fontWeight:700,fontSize:13.5,color:'#1a1a1a',marginBottom:3}}>{a.name}</div>
              <div style={{fontSize:12.5,color:'#666',display:'flex',gap:16}}>
                <span>Date: {a.date}</span>
                <span>Examiner: {a.examiner}</span>
                <span>Delivery: {a.deliveryMethod}</span>
              </div>
            </div>
          ))}
          <button className="grm-ghost" style={{marginTop:4,fontSize:13}} onClick={()=>setShowAssessmentPicker(false)}>Cancel</button>
        </div>
      )}

      {/* Template Selection */}
      {templates && templates.length > 0 && (
        <div style={{marginBottom:20,padding:'12px 16px',background:useTemplate?'#e3f2fd':'#f8f9fa',border:'1px solid #2196f3',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{fontSize:20}}>📋</div>
            <div>
              <div style={{fontWeight:700,fontSize:13.5,color:'#1976d2'}}>Use Template for Report</div>
              <div style={{fontSize:12.5,color:'#666'}}>
                {useTemplate ? (
                  <>Using template: {selectedTemplate?.template_data?.name || 'Selected template'}</>
                ) : (
                  <>{templates.length} template(s) available — generate report using a template</>
                )}
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            {useTemplate && (
              <select 
                className="grm-in grm-sel" 
                value={selectedTemplate?.id || ''} 
                onChange={(e) => {
                  const template = templates.find(t => t.id === parseInt(e.target.value));
                  setSelectedTemplate(template);
                }}
                style={{width:200,fontSize:12.5}}
              >
                <option value="">Select Template</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.template_data?.name || 'Untitled Template'}
                  </option>
                ))}
              </select>
            )}
            <button 
              className="grm-ghost" 
              style={{fontSize:13,padding:'6px 12px'}}
              onClick={() => {
                if (useTemplate) {
                  setUseTemplate(false);
                  setSelectedTemplate(null);
                } else {
                  setUseTemplate(true);
                }
              }}
            >
              {useTemplate ? 'Clear Template' : 'Use Template'}
            </button>
          </div>
        </div>
      )}

      {/* Administration Settings */}
      <div style={{fontWeight:700,fontSize:15,color:'#1e3a5f',marginBottom:14}}>Administration Settings</div>
      <div style={{background:'#fff',border:'1px solid #d0d8e4',borderRadius:4,padding:'18px 20px',marginBottom:20}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0 24px'}}>
          <Field label="Delivery Method">
            <select className="grm-in grm-sel" value={assess.deliveryMethod} onChange={e=>setAssess(p=>({...p,deliveryMethod:e.target.value}))}>
              {['Manual Entry','Online'].map(o=><option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Administration Date" required error={errors.testDate}>
            <input className={`grm-in${errors.testDate?' err':''}`} placeholder="DD/MM/YYYY"
              value={assess.testDate} onChange={e=>setAssess(p=>({...p,testDate:e.target.value}))}/>
          </Field>
          <Field label="Examiner">
            <input className="grm-in" placeholder="Examiner name"
              value={assess.examiner} onChange={e=>setAssess(p=>({...p,examiner:e.target.value}))}/>
          </Field>
        </div>
      </div>

      {/* Assessment Demographics */}
      <div style={{fontWeight:700,fontSize:15,color:'#1e3a5f',marginBottom:14}}>Assessment Demographics</div>
      <div style={{background:'#fff',border:'1px solid #d0d8e4',borderRadius:4,padding:'18px 20px',marginBottom:20}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0 24px'}}>
          <Field label="Language of Testing">
            <select className="grm-in grm-sel" value={assess.language} onChange={e=>setAssess(p=>({...p,language:e.target.value}))}>
              {['English','Hindi','Gujarati','Marathi','Tamil'].map(o=><option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Current / Most Recent Grade Level">
            <select className="grm-in grm-sel" value={assess.gradeLevel} onChange={e=>setAssess(p=>({...p,gradeLevel:e.target.value}))}>
              {['Please select...','Pre-K','K','1','2','3','4','5','6','7','8','9','10','11','12','College','Adult'].map(o=><option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Reason for Referral">
            <select className="grm-in grm-sel" value={assess.reasonForReferral} onChange={e=>setAssess(p=>({...p,reasonForReferral:e.target.value}))}>
              {['Please select...','Low academic achievement','Learning disability evaluation','ADHD evaluation','Gifted evaluation','Educational planning','Other'].map(o=><option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Current Medications (optional)">
            <input className="grm-in" placeholder="None" value={assess.medications} onChange={e=>setAssess(p=>({...p,medications:e.target.value}))}/>
          </Field>
          <Field label="Testing Site (optional)">
            <input className="grm-in" placeholder="Testing site" value={assess.testingSite} onChange={e=>setAssess(p=>({...p,testingSite:e.target.value}))}/>
          </Field>
        </div>
      </div>

      {/* Score Entry */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:15,color:'#1e3a5f'}}>Subtest Score Entry</div>
        {isPrefilled && <span className="grm-prefill-badge" style={{fontSize:12}}><EditIco/> &nbsp;All fields editable</span>}
      </div>
      <div style={{background:'#fff',border:'1px solid #d0d8e4',borderRadius:4,overflow:'hidden',marginBottom:20}}>
        {/* Header */}
        <div style={{display:'grid',gridTemplateColumns:COLS,background:'#1e3a5f'}}>
          {['Subtest','Raw Score','Standard Score','95% CI','Percentile Rank','Descriptive Category','Age Equiv.','GSV'].map((h,i)=>(
            <div key={h} className="grm-th" style={{borderRight:i<7?'1px solid #2e4f7a':'none'}}>{h}</div>
          ))}
        </div>
        {/* Subtest rows */}
        {SUBTESTS.map((sub,idx)=>(
          <div key={sub.label} className="grm-tr" style={{display:'grid',gridTemplateColumns:COLS,borderBottom:'1px solid #e8edf3',background:idx%2===0?'#fff':'#fafbfd',transition:'background .1s'}}>
            <div style={{padding:'6px 10px',fontWeight:600,fontSize:13,color:'#222',display:'flex',alignItems:'center',borderRight:'1px solid #e8edf3',background:'inherit'}}>{sub.label}</div>
            <div className="grm-td" style={{background:'inherit'}}><SI val={scores[sub.rk]} onChange={v=>setScores(p=>({...p,[sub.rk]:v}))}/></div>
            <div className="grm-td" style={{background:'inherit'}}><SI val={scores[sub.sk]} onChange={v=>setScores(p=>({...p,[sub.sk]:v}))}/></div>
            <div className="grm-td" style={{background:'inherit'}}><SI val={scores[sub.ck]} onChange={v=>setScores(p=>({...p,[sub.ck]:v}))}/></div>
            <div className="grm-td" style={{background:'inherit'}}><SI val={scores[sub.pk]} onChange={v=>setScores(p=>({...p,[sub.pk]:v}))}/></div>
            <div style={{padding:'5px 4px',borderRight:'1px solid #e8edf3',display:'flex',alignItems:'center',background:'inherit'}}>
              <select className="grm-in grm-sel" style={{fontSize:12,padding:'5px 20px 5px 6px'}}
                value={scores[sub.catk]||''} onChange={e=>setScores(p=>({...p,[sub.catk]:e.target.value}))}>
                {CATS.map(c=><option key={c} value={c}>{c||'Select…'}</option>)}
              </select>
            </div>
            <div className="grm-td" style={{background:'inherit'}}><SI val={scores[sub.ak]} onChange={v=>setScores(p=>({...p,[sub.ak]:v}))}/></div>
            <div className="grm-td" style={{borderRight:'none',background:'inherit'}}><SI val={scores[sub.gk]} onChange={v=>setScores(p=>({...p,[sub.gk]:v}))}/></div>
          </div>
        ))}
        {/* Composite */}
        <div style={{display:'grid',gridTemplateColumns:COLS,background:'#eef3fa',borderTop:'2px solid #c0ccde'}}>
          <div style={{padding:'6px 10px',fontWeight:800,fontSize:13,color:'#1e3a5f',display:'flex',alignItems:'center',borderRight:'1px solid #c0ccde'}}>Reading Composite</div>
          {['compositeRaw','compositeStd','compositeCI','compositePct'].map(k=>(
            <div key={k} style={{padding:'5px 4px',borderRight:'1px solid #c0ccde',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <input className="grm-in grm-score-input" style={{fontWeight:700}} placeholder="—" value={scores[k]||''} onChange={e=>setScores(p=>({...p,[k]:e.target.value}))}/>
            </div>
          ))}
          <div style={{padding:'5px 4px',borderRight:'1px solid #c0ccde',display:'flex',alignItems:'center'}}>
            <select className="grm-in grm-sel" style={{fontSize:12,padding:'5px 20px 5px 6px'}} value={scores.compositeCat||''} onChange={e=>setScores(p=>({...p,compositeCat:e.target.value}))}>
              {CATS.map(c=><option key={c} value={c}>{c||'Select…'}</option>)}
            </select>
          </div>
          <div className="grm-td" style={{borderRight:'1px solid #c0ccde'}}><span style={{color:'#bbb',fontSize:13}}>—</span></div>
          <div className="grm-td" style={{borderRight:'none'}}><span style={{color:'#bbb',fontSize:13}}>—</span></div>
        </div>
      </div>

      {/* Comparisons */}
      <div style={{fontWeight:700,fontSize:15,color:'#1e3a5f',marginBottom:14}}>Standard Score Comparisons</div>
      <div style={{background:'#fff',border:'1px solid #d0d8e4',borderRadius:4,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 96px 130px 116px',background:'#1e3a5f'}}>
          {['Comparisons','Difference','Significance Level','Base Rate'].map((h,i)=>(
            <div key={h} className="grm-th" style={{borderRight:i<3?'1px solid #2e4f7a':'none'}}>{h}</div>
          ))}
        </div>
        {COMP_ROWS.map((row,idx)=>(
          <div key={row.l} className="grm-tr" style={{display:'grid',gridTemplateColumns:'1fr 96px 130px 116px',borderBottom:'1px solid #e8edf3',background:idx%2===0?'#fff':'#fafbfd',transition:'background .1s'}}>
            <div style={{padding:'7px 10px',fontSize:13,color:'#333',borderRight:'1px solid #e8edf3',background:'inherit'}}>{row.l}</div>
            {[row.dk,row.sigk,row.bk].map((k,ki)=>(
              <div key={k} style={{padding:'5px 6px',borderRight:ki<2?'1px solid #e8edf3':'none',display:'flex',alignItems:'center',justifyContent:'center',background:'inherit'}}>
                <input className="grm-in grm-score-input" placeholder="—" value={scores[k]||''} onChange={e=>setScores(p=>({...p,[k]:e.target.value}))}/>
              </div>
            ))}
          </div>
        ))}
        <div style={{padding:'8px 12px',fontSize:12,color:'#777',fontStyle:'italic',borderTop:'1px solid #eee'}}>
          Note. A negative difference indicates the second subtest has a higher score than the first.
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   STEP 3 — REPORT CONFIGURATION
═══════════════════════════════════════════════════════════ */
const Step3 = ({opts,setOpts,isGenerated}) => {
  const [discOpen,setDiscOpen] = useState(false);
  const upOpt = (k,v) => setOpts(p=>({...p,[k]:v}));
  return (
    <div className="grm-section" style={{padding:'24px 28px'}}>
      <div style={{fontWeight:700,fontSize:16,color:'#1e3a5f',marginBottom:18}}>Report Selection &amp; Configurations</div>

      {/* Report card */}
      <div style={{border:'2px solid #1e3a5f',borderRadius:4,marginBottom:22,overflow:'hidden'}}>
        <div style={{background:'#1e3a5f',color:'#fff',padding:'8px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:13}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}><Chk s={12}/><span style={{fontWeight:700}}>Selected</span></div>
          <button style={{background:'none',border:'none',color:'#90b4d8',cursor:'pointer',fontSize:13}}>Deselect</button>
        </div>
        <div style={{background:'#fff',padding:'16px 18px',display:'flex',gap:20,alignItems:'flex-start'}}>
          <WR5Logo/>
          <div style={{fontSize:13.5,color:'#333',lineHeight:1.75}}>
            <div style={{fontWeight:700,fontSize:15,color:'#111',marginBottom:4}}>WRAT5-India Score Report</div>
            <div>Inventory Needed: <strong>0</strong></div>
            <div>Unlimited report usages</div>
            <div>Subscription expires 07/12/2026</div>
          </div>
        </div>
      </div>

      {/* Config */}
      <div style={{background:'#fff',border:'1px solid #d0d8e4',borderRadius:4,padding:'20px 22px'}}>
        <div style={{fontWeight:700,fontSize:15,color:'#0066cc',borderBottom:'2px solid #0066cc',paddingBottom:6,marginBottom:16}}>Configurations</div>
        <div style={{marginBottom:14}}>
          <div style={{fontWeight:600,fontSize:13.5,color:'#333',marginBottom:5}}>Report File Type</div>
          <div style={{fontSize:13,color:'#666'}}>Adobe PDF — <em>This report is only available as a PDF.</em></div>
        </div>
        <hr style={{border:'none',borderTop:'1px solid #eee',margin:'12px 0'}}/>
        <div style={{marginBottom:14}}>
          <div style={{fontWeight:600,fontSize:13.5,color:'#333',marginBottom:8}}>Report Options</div>
          <div style={{fontSize:13,color:'#777',marginBottom:10}}>Select options to include in the report.</div>
          <CheckBox checked={opts.includeExamineeName} onChange={()=>upOpt('includeExamineeName',!opts.includeExamineeName)} label="Examinee Name"/>
        </div>
        <hr style={{border:'none',borderTop:'1px solid #eee',margin:'12px 0'}}/>
        <div style={{fontWeight:600,fontSize:13.5,color:'#333',marginBottom:14}}>Settings</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28}}>
          <div>
            <div style={{fontSize:13,color:'#555',fontWeight:600,marginBottom:10}}>Score summary last column</div>
            {['GSV','NCE','Stanine'].map(v=><RadioBtn key={v} checked={opts.scoreSummaryCol===v} onChange={()=>upOpt('scoreSummaryCol',v)} label={v}/>)}
          </div>
          <div>
            <div style={{fontSize:13,color:'#555',fontWeight:600,marginBottom:10}}>Confidence Level</div>
            {['90%','95%'].map(v=><RadioBtn key={v} checked={opts.confidenceLevel===v} onChange={()=>upOpt('confidenceLevel',v)} label={v}/>)}
            <div style={{fontSize:13,color:'#555',fontWeight:600,marginBottom:10,marginTop:14}}>Comparisons Reference Group</div>
            {['Overall','Age group'].map(v=><RadioBtn key={v} checked={opts.comparisonGroup===v} onChange={()=>upOpt('comparisonGroup',v)} label={v}/>)}
          </div>
        </div>
        <hr style={{border:'none',borderTop:'1px solid #eee',margin:'16px 0 10px 0'}}/>
        <button onClick={()=>setDiscOpen(p=>!p)} style={{display:'flex',alignItems:'center',gap:7,background:'none',border:'none',cursor:'pointer',color:'#0066cc',fontWeight:700,fontSize:14,padding:0}}>
          {discOpen?<ChD/>:<ChR/>} Ability-Achievement Discrepancy Analysis
        </button>
        {discOpen && (
          <div style={{marginTop:14,padding:14,background:'#f8fafc',borderRadius:4}}>
            <CheckBox checked={opts.includeDiscrepancy} onChange={()=>upOpt('includeDiscrepancy',!opts.includeDiscrepancy)} label="Include Ability-Achievement Discrepancy Analysis"/>
            {opts.includeDiscrepancy && (
              <Field label="Cognitive Ability Score (optional)" style={{marginTop:12}}>
                <input className="grm-in" placeholder="e.g. WISC-V FSIQ = 95"/>
              </Field>
            )}
          </div>
        )}
      </div>

      {isGenerated && (
        <div style={{marginTop:20,background:'#e8f5e9',border:'1px solid #81c784',borderRadius:4,padding:'14px 18px',display:'flex',alignItems:'center',gap:12,animation:'grm-pop .2s ease'}}>
          <div style={{background:'#2e7d32',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Chk s={13}/></div>
          <div>
            <div style={{fontWeight:700,color:'#1b5e20',fontSize:14}}>Report Generated Successfully!</div>
            <div style={{fontSize:13,color:'#388e3c'}}>WRAT5-India Score Report is ready for download.</div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════ */
const GenerateReportModal = ({ isOpen, onClose, examineeData }) => {
  const dispatch = useDispatch();
  const { isCreatingAssessment, examinees } = useSelector((state) => state.examinees);
  
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [errors, setErrors] = useState({});

  // Template state
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [useTemplate, setUseTemplate] = useState(false);

  // Step 1 state
  const [selectedExaminee, setSelectedExaminee] = useState(null);
  const [examinee, setExaminee] = useState({
    id: null,
    firstName:'', middleName:'', lastName:'', examineeId:'',
    gender:'Please Select...', dob:'', email:'', comment:'',
    custom1:'', custom2:'', custom3:'', custom4:'',
  });

  // Auto-populate when modal opens with examineeData
  useEffect(() => {
    if (isOpen && examineeData) {
      // Find the examinee in the list to get full data with assessments
      const fullExamineeData = examinees.find(ex => ex.id === examineeData.id) || examineeData;
      
      if (fullExamineeData) {
        setSelectedExaminee(fullExamineeData);
        setExaminee({
          id: fullExamineeData.id,
          firstName: fullExamineeData.firstName || '',
          middleName: fullExamineeData.middleName || '',
          lastName: fullExamineeData.lastName || '',
          examineeId: fullExamineeData.examineeId || '',
          gender: fullExamineeData.gender || 'Please Select...',
          dob: fullExamineeData.dob || '',
          email: fullExamineeData.email || '',
          comment: fullExamineeData.comment || '',
          custom1: fullExamineeData.custom1 || '',
          custom2: fullExamineeData.custom2 || '',
          custom3: fullExamineeData.custom3 || '',
          custom4: fullExamineeData.custom4 || '',
        });
        // Automatically move to Step 2
        setStep(2);
      }
    }
  }, [isOpen, examineeData, examinees]);

  // Fetch templates when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      const response = await api.getTemplates();
      if (response.success) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

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
    setExaminee({id: null, firstName:'',middleName:'',lastName:'',examineeId:'',gender:'Please Select...',dob:'',email:'',comment:'',custom1:'',custom2:'',custom3:'',custom4:''});
    setIsPrefilled(false); setSelectedAssessment(null); setScores(BLANK_SCORES());
  };

  const validate1 = () => {
    if (selectedExaminee) return true;  // existing selection = valid
    const e={};
    if (!examinee.firstName.trim()) e.firstName='First Name is required';
    if (!examinee.dob.trim()) e.dob='Birth Date is required';
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
        const newExamineeData = {
          firstName: examinee.firstName,
          lastName: examinee.lastName,
          middleName: examinee.middleName,
          examineeId: examinee.examineeId,
          gender: examinee.gender,
          dob: examinee.dob,
          email: examinee.email,
          comment: examinee.comment,
          custom1: examinee.custom1,
          custom2: examinee.custom2,
          custom3: examinee.custom3,
          custom4: examinee.custom4,
        };
        
        const result = await dispatch(createExaminee(newExamineeData)).unwrap();
        
        if (result && result.id) {
          // Update local examinee with returned ID
          setExaminee(prev => ({...prev, id: result.id}));
          setStep(s=>s+1);
        } else {
          alert('Failed to create examinee. Please check the form and try again.');
        }
      } catch (error) {
        console.error('Error creating examinee:', error);
        alert('Failed to save examinee. Please try again.');
      }
    } else {
      // Existing examinee or moving forward from other steps
      setStep(s=>s+1);
    }
  };

  const generate = async () => {
    setIsGenerating(true);
    
    try {
      // Get examinee ID - try multiple sources to be safe
      let examineeId = selectedExaminee?.id || examinee?.id;
      
      console.log('🔍 Debug info:', {
        selectedExaminee: selectedExaminee?.id,
        examinee: examinee?.id,
        resolvedId: examineeId,
        useTemplate,
        selectedTemplate: selectedTemplate?.id
      });

      if (!examineeId) {
        console.error('❌ No examinee ID found. State:', {selectedExaminee, examinee});
        alert('Error: Examinee ID not found. Please go back and select an examinee.');
        setIsGenerating(false);
        return;
      }

      let reportData;

      if (useTemplate && selectedTemplate) {
        // Generate report using template
        console.log('📄 Generating report using template:', selectedTemplate.template_data?.name);
        
        const customData = {
          testDate: assess.testDate,
          examiner: assess.examiner,
          // Add any other assessment data that should override template
        };

        const result = await api.generateReportFromTemplate(selectedTemplate.id, examineeId, customData);
        
        if (result.success) {
          reportData = {
            examinee: activeEx,
            template: result.data,
            options: opts,
            timestamp: new Date().toLocaleString(),
            isTemplateBased: true
          };
        } else {
          throw new Error(result.message || 'Failed to generate report from template');
        }
      } else {
        // Generate report normally (existing logic)
        console.log('📊 Generating report normally');
        
        // Create assessment with scores
        const assessmentData = {
          examineeId: examineeId,
          deliveryMethod: assess.deliveryMethod,
          testDate: assess.testDate,
          examiner: assess.examiner,
          language: assess.language,
          gradeLevel: assess.gradeLevel,
          reasonForReferral: assess.reasonForReferral,
          medications: assess.medications,
          testingSite: assess.testingSite,
          scores: scores
        };

        console.log('📤 Sending assessment data to API:', {
          examineeId,
          deliveryMethod: assess.deliveryMethod,
          testDate: assess.testDate,
          ...assessmentData
        });

        const result = await dispatch(createAssessmentWithScores(assessmentData)).unwrap();
        
        console.log('✅ Assessment created successfully:', result);

        if (result.success || result.id || result.data) {
          reportData = {
            examinee: activeEx,
            assessment: assessmentData,
            scores: scores,
            options: opts,
            timestamp: new Date().toLocaleString(),
            isTemplateBased: false
          };
        }
      }

      // Store report data for preview
      setReportData(reportData);
      setIsGenerated(true);
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

  const close = () => {
    setStep(1);
    setIsGenerated(false);
    setIsPreviewOpen(false);
    setReportData(null);
    setErrors({});
    setSelectedExaminee(null);
    setSelectedAssessment(null);
    setExaminee({id: null, firstName:'',middleName:'',lastName:'',examineeId:'',gender:'Please Select...',dob:'',email:'',comment:'',custom1:'',custom2:'',custom3:'',custom4:''});
    setIsPrefilled(false);
    setScores(BLANK_SCORES());
    setAssess({deliveryMethod:'Manual Entry', testDate:'', examiner:'', language:'English', gradeLevel:'Please select...', reasonForReferral:'Please select...', medications:'', testingSite:''});
    // Reset template state
    setSelectedTemplate(null);
    setUseTemplate(false);
    onClose?.();
  };

  const downloadPDF = () => {
    if (!reportData) return;
    
    // Create a simple HTML report
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>WRAT5-India Score Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e3a5f; padding-bottom: 20px; }
          .title { font-size: 28px; color: #1e3a5f; font-weight: bold; margin-bottom: 5px; }
          .subtitle { font-size: 14px; color: #666; }
          .section { margin: 25px 0; }
          .section-title { font-size: 16px; font-weight: bold; color: #1e3a5f; background: #eef2f8; padding: 10px; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #1e3a5f; color: white; padding: 10px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e0e0e0; }
          tr:nth-child(even) { background: #f9f9f9; }
          .label { font-weight: bold; color: #333; width: 30%; }
          .value { color: #666; }
          .timestamp { text-align: right; font-size: 12px; color: #999; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">WRAT5-India Score Report</div>
          <div class="subtitle">Wide Range Achievement Test - India Blue Form</div>
        </div>

        <div class="section">
          <div class="section-title">Examinee Information</div>
          <table>
            <tr><td class="label">Name:</td><td class="value">${reportData.examinee.firstName} ${reportData.examinee.lastName}</td></tr>
            <tr><td class="label">Examinee ID:</td><td class="value">${reportData.examinee.examineeId}</td></tr>
            <tr><td class="label">Date of Birth:</td><td class="value">${reportData.examinee.dob}</td></tr>
            <tr><td class="label">Gender:</td><td class="value">${reportData.examinee.gender}</td></tr>
            <tr><td class="label">Age:</td><td class="value">${reportData.examinee.email}</td></tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Assessment Administration</div>
          <table>
            <tr><td class="label">Test Date:</td><td class="value">${reportData.assessment.testDate}</td></tr>
            <tr><td class="label">Examiner:</td><td class="value">${reportData.assessment.examiner}</td></tr>
            <tr><td class="label">Delivery Method:</td><td class="value">${reportData.assessment.deliveryMethod}</td></tr>
            <tr><td class="label">Language:</td><td class="value">${reportData.assessment.language}</td></tr>
            <tr><td class="label">Grade Level:</td><td class="value">${reportData.assessment.gradeLevel}</td></tr>
            <tr><td class="label">Reason for Referral:</td><td class="value">${reportData.assessment.reasonForReferral}</td></tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Subtest Scores Summary</div>
          <table>
            <thead>
              <tr>
                <th>Subtest</th>
                <th>Raw Score</th>
                <th>Standard Score</th>
                <th>Percentile</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Math Computation</td>
                <td>${reportData.scores.mathRaw || '—'}</td>
                <td>${reportData.scores.mathStd || '—'}</td>
                <td>${reportData.scores.mathPct || '—'}</td>
                <td>${reportData.scores.mathCat || '—'}</td>
              </tr>
              <tr>
                <td>Spelling</td>
                <td>${reportData.scores.spellingRaw || '—'}</td>
                <td>${reportData.scores.spellingStd || '—'}</td>
                <td>${reportData.scores.spellingPct || '—'}</td>
                <td>${reportData.scores.spellingCat || '—'}</td>
              </tr>
              <tr>
                <td>Word Reading</td>
                <td>${reportData.scores.wordReadingRaw || '—'}</td>
                <td>${reportData.scores.wordReadingStd || '—'}</td>
                <td>${reportData.scores.wordReadingPct || '—'}</td>
                <td>${reportData.scores.wordReadingCat || '—'}</td>
              </tr>
              <tr>
                <td>Sentence Comprehension</td>
                <td>${reportData.scores.sentenceRaw || '—'}</td>
                <td>${reportData.scores.sentenceStd || '—'}</td>
                <td>${reportData.scores.sentencePct || '—'}</td>
                <td>${reportData.scores.sentenceCat || '—'}</td>
              </tr>
              <tr style="background: #eef2f8; font-weight: bold;">
                <td>Reading Composite</td>
                <td>${reportData.scores.compositeRaw || '—'}</td>
                <td>${reportData.scores.compositeStd || '—'}</td>
                <td>${reportData.scores.compositePct || '—'}</td>
                <td>${reportData.scores.compositeCat || '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="timestamp">
          Generated on: ${reportData.timestamp}
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WRAT5-Report-${reportData.examinee.examineeId}-${new Date().getTime()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    setIsPreviewOpen(false);
    close();
  };

  // Active examinee for sidebar
  const activeEx = selectedExaminee
    ? {firstName:selectedExaminee.firstName,lastName:selectedExaminee.lastName,dob:selectedExaminee.dob,
       examineeId:selectedExaminee.examineeId,gender:selectedExaminee.gender,email:selectedExaminee.email}
    : examinee;

  if (!isOpen) return null;

  return (
    <>
      <style>{STYLES}</style>
      <div style={{position:'fixed',inset:0,background:'rgba(8,18,38,0.62)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:16}}>
        <div className="grm" style={{
          background:'#f4f6f9', borderRadius:5, width:'100%',
          maxWidth:step===2?1140:980,
          maxHeight:'94vh', display:'flex', flexDirection:'column',
          boxShadow:'0 24px 70px rgba(0,0,0,0.35)',
          animation:'grm-up .22s ease', overflow:'hidden',
        }}>

          {/* HEADER */}
          <div style={{background:'#1e3a5f',color:'#fff',padding:'13px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <div>
                <div style={{fontWeight:700,fontSize:16}}>
                  {step===1?'Examinee Selection':step===2?'Assessment Details & Score Entry':'Report Selection & Configurations'}
                </div>
                <div style={{fontSize:12,color:'#90b4d8',marginTop:1}}>MINDSAID LEARNING CENTRE &nbsp;•&nbsp; WRAT5-India Blue Form</div>
              </div>
            </div>
            <button onClick={close} style={{background:'none',border:'none',color:'#fff',cursor:'pointer',padding:4,borderRadius:4,opacity:0.85}}>
              <X18/>
            </button>
          </div>

          {/* STEP BAR */}
          <StepBar current={step}/>

          {/* BODY */}
          <div style={{display:'flex',flex:1,overflow:'hidden'}}>
            <div style={{flex:1,overflowY:'auto'}}>
              {step===1 && (
                <Step1
                  examinee={examinee} setExaminee={setExaminee}
                  errors={errors}
                  selectedExaminee={selectedExaminee}
                  onSelectExaminee={handleSelectExaminee}
                  onClearSelected={handleClearSelected}
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
                  selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}
                  useTemplate={useTemplate} setUseTemplate={setUseTemplate}
                />
              )}
              {step===3 && <Step3 opts={opts} setOpts={setOpts} isGenerated={isGenerated}/>}
            </div>
            <Sidebar step={step} ex={activeEx} assess={assess} scores={scores} selectedAssessment={selectedAssessment}/>
          </div>

          {/* FOOTER */}
          <div style={{padding:'13px 24px',borderTop:'1px solid #d0d8e4',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#fff',flexShrink:0}}>
            <div style={{fontSize:12.5,color:'#999'}}>
              {step===1 && !selectedExaminee && '• Select an existing examinee or fill the new examinee form'}
              {step===1 && selectedExaminee && <span style={{color:'#2e7d32',fontWeight:600}}>✓ Examinee selected: {selectedExaminee.firstName} {selectedExaminee.lastName}</span>}
              {step===2 && !isGenerated && '• Enter scores manually or load from saved assessment'}
              {step===3 && !isGenerated && '• Review configuration, then click Create Report'}
              {isGenerated && <span style={{color:'#2e7d32',fontWeight:600}}>✓ Report ready — click Download to save</span>}
            </div>
            <div style={{display:'flex',gap:10}}>
              {step>1 && <button className="grm-bl" onClick={()=>{setStep(s=>s-1);setIsGenerated(false);setErrors({});}}>← Back</button>}
              <button className="grm-bl" onClick={close}>Cancel</button>
              {step<3 && <button className="grm-or" onClick={next}>{step===1?'Next: Assessment →':'Proceed to Report →'}</button>}
              {step===3 && !isGenerated && (
                <button className="grm-or" onClick={generate} disabled={isGenerating || isCreatingAssessment} style={{minWidth:148}}>
                  {isGenerating || isCreatingAssessment ?<><Sp/> Generating…</>:<><Dl/> Create Report</>}
                </button>
              )}
              {step===3 && isGenerated && (
                <button className="grm-gr" onClick={() => setIsPreviewOpen(true)} style={{minWidth:160}}>
                  <Dl/> View & Download Report
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Preview Modal */}
      <ReportPreviewModal 
        isOpen={isPreviewOpen} 
        reportData={reportData}
        onClose={() => setIsPreviewOpen(false)}
        onDownload={downloadPDF}
      />
    </>
  );
};

export default GenerateReportModal;
