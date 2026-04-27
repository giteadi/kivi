import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import api from "../services/api";
import { examineeApi } from "../services/examineeApi";

// ── tiny helpers ──────────────────────────────────────────────────────────────
const Cell = ({ children, bold, italic, colSpan, rowSpan, className = "", style = {} }) => (
  <td
    colSpan={colSpan}
    rowSpan={rowSpan}
    style={{
      border: "1px solid #555",
      padding: "5px 7px",
      fontSize: 13,
      verticalAlign: "top",
      fontWeight: bold ? "bold" : "normal",
      fontStyle: italic ? "italic" : "normal",
      ...style,
    }}
    className={className}
  >
    {children}
  </td>
);

const SectionHeader = ({ children }) => (
  <tr>
    <td
      colSpan={10}
      style={{
        border: "1px solid #555",
        padding: "6px 8px",
        fontWeight: "bold",
        fontSize: 13,
        background: "#f5f5f5",
      }}
    >
      {children}
    </td>
  </tr>
);

// Editable inline field
const F = ({ value, onChange, wide, placeholder = "" }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      border: "none",
      borderBottom: "1px solid #999",
      outline: "none",
      width: wide ? "100%" : "auto",
      minWidth: wide ? undefined : 120,
      fontSize: 13,
      background: "transparent",
      fontFamily: "inherit",
      padding: "1px 2px",
    }}
  />
);

// Textarea
const TA = ({ value, onChange, rows = 2 }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={rows}
    style={{
      width: "100%",
      border: "none",
      borderBottom: "1px solid #999",
      outline: "none",
      resize: "vertical",
      fontSize: 13,
      background: "transparent",
      fontFamily: "inherit",
      padding: "2px",
    }}
  />
);

// Radio group
const Radio = ({ name, options, value, onChange }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: 10,
      whiteSpace: "nowrap",
    }}
  >
    {options.map((opt) => (
      <label
        key={opt}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        <input
          type="radio"
          name={name}
          value={opt}
          checked={value === opt}
          onChange={() => onChange(opt)}
          style={{ cursor: "pointer" }}
        />
        {opt}
      </label>
    ))}
  </div>
);

// Checkbox
const CB = ({ label, checked, onChange }) => (
  <label style={{ fontSize: 13, cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 4 }}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{ marginTop: 2, cursor: "pointer" }}
    />
    {label}
  </label>
);

// YES/NO row for academic concerns table
const AcRow = ({ category, label, data, setData }) => (
  <tr>
    <Cell style={{ width: 180 }}>{category}</Cell>
    <Cell style={{ width: 350 }}>{label}</Cell>
    <Cell
      style={{
        width: 120,
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      <Radio
        name={`ac_${label.slice(0, 20)}`}
        options={["YES", "NO"]}
        value={data.yn}
        onChange={(v) => setData({ ...data, yn: v })}
      />
    </Cell>
    <Cell style={{ width: 200 }}>
      <F value={data.comment} onChange={(v) => setData({ ...data, comment: v })} wide />
    </Cell>
  </tr>
);

// Milestone row
const MilestoneRow = ({ label, data, setData }) => (
  <tr>
    <Cell bold>{label}</Cell>
    {["early", "normal", "average", "delayed"].map((k) => (
      <Cell key={k} style={{ textAlign: "center" }}>
        <input
          type="checkbox"
          checked={!!data[k]}
          onChange={(e) => setData({ ...data, [k]: e.target.checked })}
          style={{ cursor: "pointer" }}
        />
      </Cell>
    ))}
    <Cell>
      <F value={data.age} onChange={(v) => setData({ ...data, age: v })} wide />
    </Cell>
    <Cell>
      <F value={data.comment} onChange={(v) => setData({ ...data, comment: v })} wide />
    </Cell>
  </tr>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ExamineeReportForm({
  formData = {},
  evaluationData = {},
  diagnosisData = {},
  historyData = {},
  languageSampleReportData = {},
  educationSampleReportData = {},
  healthSampleReportData = {},
  employmentSampleReportData = {},
  onSave,
  onReportDataChange,
  reportFormData = {},
}) {
  const printRef = useRef();

  // Calculate age from birthDate
  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years} years ${months} months`;
  };

  // Determine if emergency contact is father or mother based on relation
  const emergencyRelation = (formData.emergencyContactRelation || "").toLowerCase();
  const isEmergencyContactFather = emergencyRelation.includes("father") || emergencyRelation.includes("dad") || emergencyRelation.includes("papa") || emergencyRelation.includes("husband");
  const isEmergencyContactMother = emergencyRelation.includes("mother") || emergencyRelation.includes("mom") || emergencyRelation.includes("mum") || emergencyRelation.includes("wife");

  // ── Section I - initialized with formData
  const [s1, setS1] = useState({
    childName: formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : formData.firstName || "",
    birthDate: formData.birthDate || "",
    age: calculateAge(formData.birthDate),
    nationality: "",
    gender: formData.gender || "",
    schoolName: formData.schoolName || "",
    schoolCategory: "",
    handedness: "",
    grade: formData.grade || "",
    motherTongue: formData.languageOfTesting || "",
    languageHome: "",
    previousReports: "",
    // Father - if emergency contact is father, use emergency contact details
    fatherName: isEmergencyContactFather ? formData.emergencyContactName || "" : "",
    fatherPhone: isEmergencyContactFather ? formData.emergencyContactPhone || "" : formData.phone || "",
    fatherEmail: isEmergencyContactFather ? "" : formData.email || "",
    fatherEdu: educationSampleReportData.fatherEducation || "",
    fatherProf: "",
    // Mother - if emergency contact is mother, use emergency contact details
    motherName: isEmergencyContactMother ? formData.emergencyContactName || "" : "",
    motherPhone: isEmergencyContactMother ? formData.emergencyContactPhone || "" : "",
    motherEmail: "",
    motherEdu: educationSampleReportData.motherEducation || "",
    motherProf: "",
    address: formData.address ? `${formData.address}${formData.city ? ', ' + formData.city : ''}${formData.state ? ', ' + formData.state : ''}` : "",
    formBy: "",
    referredBy: historyData.referralSourceName || "",
  });

  // Update s1 when formData changes
  useEffect(() => {
    const relation = (formData.emergencyContactRelation || "").toLowerCase();
    const isFather = relation.includes("father") || relation.includes("dad") || relation.includes("papa") || relation.includes("husband");
    const isMother = relation.includes("mother") || relation.includes("mom") || relation.includes("mum") || relation.includes("wife");

    setS1(prev => ({
      ...prev,
      childName: formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : formData.firstName || prev.childName,
      birthDate: formData.birthDate || prev.birthDate,
      age: calculateAge(formData.birthDate) || prev.age,
      gender: formData.gender || prev.gender,
      schoolName: formData.schoolName || prev.schoolName,
      grade: formData.grade || prev.grade,
      motherTongue: formData.languageOfTesting || prev.motherTongue,
      // Update father info if emergency contact is father
      fatherName: isFather ? formData.emergencyContactName || prev.fatherName : prev.fatherName,
      fatherPhone: isFather ? formData.emergencyContactPhone || prev.fatherPhone : formData.phone || prev.fatherPhone,
      fatherEmail: isFather ? prev.fatherEmail : formData.email || prev.fatherEmail,
      fatherEdu: educationSampleReportData.fatherEducation || prev.fatherEdu,
      // Update mother info if emergency contact is mother
      motherName: isMother ? formData.emergencyContactName || prev.motherName : prev.motherName,
      motherPhone: isMother ? formData.emergencyContactPhone || prev.motherPhone : prev.motherPhone,
      motherEdu: educationSampleReportData.motherEducation || prev.motherEdu,
      address: formData.address ? `${formData.address}${formData.city ? ', ' + formData.city : ''}${formData.state ? ', ' + formData.state : ''}` : prev.address,
      referredBy: historyData.referralSourceName || prev.referredBy,
    }));
  }, [formData, historyData, educationSampleReportData]);

  // ── Section II – Academic Concerns (per row: {yn, comment})
  const acInit = (label) => ({ label, yn: "", comment: "" });
  const [s2, setS2] = useState({
    attendance: "",
    attention: [
      acInit("Is he/she able to put thoughts on paper?"),
      acInit("Can he/she follow instructions/directions?"),
      acInit("Does he/she pay attention in class?"),
      acInit("Is he/she extremely talkative?"),
    ],
    listening: [
      acInit("Can he/she recall information?"),
      acInit("Is there a need for frequent repetition?"),
      acInit("Does he/she misinterpret questions?"),
      acInit("Is he/she better with oral expression skills?"),
    ],
    speaking: [
      acInit("Does he/she find it difficult to frame sentences while speaking?"),
      acInit("Does he/she pause/hesitate a lot during a conversation?"),
      acInit("Does he/she use incomplete or broken sentences often?"),
    ],
    writing: [
      acInit("Is his/her writing easily comprehensible?"),
      acInit("Are there excessive number of spelling errors?"),
      acInit("Does he/she complete his work on time?"),
      acInit("Does he/she utilise proper use of grammar and punctuations while writing?"),
    ],
    reading: [
      acInit("Does he/she track and read with his finger?"),
      acInit("Does he/she guess words while reading?"),
      acInit("Does he/she jump lines or paragraphs while reading?"),
      acInit("Does he/she pause at the appropriate punctuation marks?"),
      acInit("Is he/she a slow reader?"),
    ],
    math: [
      acInit("Does he/she take a long time to complete calculations?"),
      acInit("Is he/she able to fluently recall mental tables?"),
      acInit("Does he/she get confused with mathematical symbols?"),
      acInit("Does he/she find it difficult to solve word problems?"),
      acInit("Does he/she find it difficult to solve Algebraic equations?"),
      acInit("Does he/she find it difficult to draw Geometry figures?"),
    ],
    generalComments: "",
  });

  const updateAcRow = (category, idx, val) => {
    setS2((p) => ({ ...p, [category]: p[category].map((r, i) => (i === idx ? val : r)) }));
  };

  // ── Section III – Family History
  const [s3, setS3] = useState({
    maritalStatus: "", consanguineous: "", separationDate: "",
    fatherAgeMarriage: "", motherAgeMarriage: "",
    fatherAgeBirth: "", motherAgeBirth: "",
    familyType: "",
    siblings: [{ gender: "", age: "", grade: "" }, { gender: "", age: "", grade: "" }, { gender: "", age: "", grade: "" }],
    historyLearning: { learningDiff: false, diagnosed: false, attentionProb: false, alcoholDrug: false, emotional: false, ownAbuse: false, other: false, otherText: "", relation: "" },
    historyLearningYN: "",
    historyDepression: "",
  });

  // ── Section IV – Medical
  const [s4, setS4] = useState({
    prenatal: { edema: false, bp: false, nausea: false, diabetes: false, falls: false, thyroid: false, desc: "" },
    postnatal: { fullTerm: false, csection: false, normal: false, forceps: false, desc: "" },
    weightAvg: false, weightLow: false, cryCry: "", 
    milestones: {
      socialSmile: { early: false, normal: false, average: false, delayed: false, age: "", comment: "" },
      turnedSide: { early: false, normal: false, average: false, delayed: false, age: "", comment: "" },
      crawling: { early: false, normal: false, average: false, delayed: false, age: "", comment: "" },
      pincerGrip: { early: false, normal: false, average: false, delayed: false, age: "", comment: "" },
      walking: { early: false, normal: false, average: false, delayed: false, age: "", comment: "" },
      babbling: { early: false, normal: false, average: false, delayed: false, age: "", comment: "" },
      toiletTraining: { early: false, normal: false, average: false, delayed: false, age: "", comment: "" },
      talkingSingleWords: { early: false, normal: false, average: false, delayed: false, age: "", comment: "" },
      talkingSentences: { early: false, normal: false, average: false, delayed: false, age: "", comment: "" },
      running: { early: false, normal: false, average: false, delayed: false, age: "", comment: "" },
      climbing: { early: false, normal: false, average: false, delayed: false, age: "", comment: "" },
    },
    applicableProblems: {
      buttoning: false, tyingLaces: false, cycling: false, penGrip: false,
      tellingTime: false, tellingLeftRight: false, poorInterpersonal: false, ruleBreaking: false,
      scholasticBackwardness: false, introvert: false, anxious: false, handAches: false,
      roomTidy: false, roomUntidy: false, roomOrganised: false, roomDisorganised: false,
    },
    roomComments: "",
    langDiff: "", eyeExam: "", speechAssessment: "", hearingTest: "",
    psychTest: "", neuroAssessment: "", majorIllnesses: "", adhdHistory: "", medications: "",
  });

  // ── Section V – Educational
  const [s5, setS5] = useState({
    prevSchools: [{ name: "", grade: "" }, { name: "", grade: "" }, { name: "", grade: "" }],
    currentSchoolSatisfied: "",
    satisfactionComments: "",
    problemFirstNoticed: "",
    whoNoticed: "",
    howLong: "",
    difficultSubjects: "",
    generalProgress: "",
    progressComments: "",
    schoolAttitude: "",
    tuitionAttitude: "",
    counselling: "",
    concessions: "",
    childAttitude: "",
    forgetsHomework: "",
    chosenSubjects: "",
    ptmRemarks: "",
  });

  // ── Section VI – Behaviour
  const [s6, setS6] = useState({
    peerRelations: "", siblingRelations: "", stressfulEvents: "", behaviourConcerns: "",
  });

  // ── Section VII – Other
  const [s7, setS7] = useState({
    playInterests: "", freeTime: "", specialTalents: "", forgetsThings: "",
    togetherActivities: "", acknowledgeBehaviour: "", primaryDisciplinarian: "",
    disciplineStrategies: "", pediatrician: "", otherInfo: "",
    howFoundOut: "", schoolRecords: "",
    parentName: formData.emergencyContactName || "", signature: "", date: new Date().toLocaleDateString("en-IN"),
  });

  // ── Pre-fill all sections from available state data ──
  useEffect(() => {
    // First, load saved report form data if available
    if (reportFormData && Object.keys(reportFormData).length > 0) {
      console.log("🔄 Loading saved report form data:", reportFormData);
      
      if (reportFormData.sectionI) {
        console.log("🔄 Loading Section I from saved data");
        setS1(prev => ({ ...prev, ...reportFormData.sectionI }));
      }
      if (reportFormData.sectionII) {
        console.log("🔄 Loading Section II from saved data");
        setS2(prev => ({ ...prev, ...reportFormData.sectionII }));
      }
      if (reportFormData.sectionIII) {
        console.log("🔄 Loading Section III from saved data");
        setS3(prev => ({ ...prev, ...reportFormData.sectionIII }));
      }
      if (reportFormData.sectionIV) {
        console.log("🔄 Loading Section IV from saved data");
        setS4(prev => ({ ...prev, ...reportFormData.sectionIV }));
      }
      if (reportFormData.sectionV) {
        console.log("🔄 Loading Section V from saved data");
        setS5(prev => ({ ...prev, ...reportFormData.sectionV }));
      }
      if (reportFormData.sectionVI) {
        console.log("🔄 Loading Section VI from saved data");
        setS6(prev => ({ ...prev, ...reportFormData.sectionVI }));
      }
      if (reportFormData.sectionVII) {
        console.log("🔄 Loading Section VII from saved data");
        setS7(prev => ({ ...prev, ...reportFormData.sectionVII }));
      }
    }

    // Section II - Academic Concerns from evaluationData
    const evalConcerns = evaluationData || {};
    if (evalConcerns.academicConcerns?.maths || evalConcerns.academicConcerns?.reading || 
        evalConcerns.academicConcerns?.writing || evalConcerns.academicConcerns?.general) {
      setS2(prev => ({
        ...prev,
        generalComments: [
          evalConcerns.academicConcerns?.maths && "Mathematics concerns present",
          evalConcerns.academicConcerns?.reading && "Reading concerns present",
          evalConcerns.academicConcerns?.writing && "Writing concerns present",
          evalConcerns.academicConcerns?.general && "General academic concerns present",
        ].filter(Boolean).join(". ") || prev.generalComments,
      }));
    }

    // Section III - Family History from historyData
    if (historyData) {
      setS3(prev => ({
        ...prev,
        historyLearning: {
          ...prev.historyLearning,
          learningDiff: historyData.schoolRelatedConcerns || prev.historyLearning.learningDiff,
          attentionProb: historyData.cognitiveConcerns || prev.historyLearning.attentionProb,
          emotional: historyData.socialEmotionalConcerns || prev.historyLearning.emotional,
        },
      }));
    }

    // Section IV - Medical from healthSampleReportData
    if (healthSampleReportData) {
      setS4(prev => ({
        ...prev,
        langDiff: healthSampleReportData.additionalInfo || prev.langDiff,
        majorIllnesses: [
          ...(healthSampleReportData.pastDiagnosed || []),
          ...(healthSampleReportData.currentDiagnosed || []),
        ].join(", ") || prev.majorIllnesses,
        medications: healthSampleReportData.currentMedications || prev.medications,
      }));
    }

    // Section V - Educational from educationSampleReportData
    if (educationSampleReportData) {
      setS5(prev => ({
        ...prev,
        prevSchools: educationSampleReportData.schoolName ? 
          [{ name: educationSampleReportData.schoolName, grade: educationSampleReportData.currentYear || "" }, ...prev.prevSchools.slice(1)] : 
          prev.prevSchools,
        currentSchoolSatisfied: educationSampleReportData.currentPerformance ? "YES" : prev.currentSchoolSatisfied,
        satisfactionComments: educationSampleReportData.currentPerformance || prev.satisfactionComments,
        difficultSubjects: [
          ...(educationSampleReportData.personalWeaknesses || []),
          ...(educationSampleReportData.learningDisabilities || []),
        ].join(", ") || prev.difficultSubjects,
      }));
    }

    // Section VI - Behaviour from evaluationData
    if (evalConcerns.behaviourConcerns || evalConcerns.mentalHealth) {
      setS6(prev => ({
        ...prev,
        behaviourConcerns: [
          evalConcerns.behaviourConcerns?.aggression && "Aggression",
          evalConcerns.behaviourConcerns?.attentionHyperactivity && "Attention/Hyperactivity",
          evalConcerns.mentalHealth?.anxiety && "Anxiety",
          evalConcerns.mentalHealth?.depression && "Depression",
        ].filter(Boolean).join(". ") || prev.behaviourConcerns,
      }));
    }

    // Section VII - Other
    setS7(prev => ({
      ...prev,
      parentName: formData.emergencyContactName || prev.parentName,
    }));
  }, [evaluationData, historyData, healthSampleReportData, educationSampleReportData, formData, reportFormData]);

  // ── Load saved report data from API (DISABLED - now using reportFormData prop) ──
  // Data is now loaded via reportFormData prop from parent component to avoid double loading
  // useEffect(() => {
  //   const loadSavedReport = async () => {
  //     const examineeId = formData?.id || formData?.studentId || formData?.examineeId;
  //     if (!examineeId) return;

  //     try {
  //       console.log("🔍 Loading saved report for examinee ID:", examineeId);
  //       const response = await examineeApi.getReportForm(examineeId);
  //       
  //       if (response.success && response.data) {
  //         const data = response.data;
  //         
  //         if (data.sectionI && Object.keys(data.sectionI).length > 0) {
  //           setS1(prev => ({ ...prev, ...data.sectionI }));
  //         }
  //         if (data.sectionII && Object.keys(data.sectionII).length > 0) {
  //           setS2(prev => ({ ...prev, ...data.sectionII }));
  //         }
  //         if (data.sectionIII && Object.keys(data.sectionIII).length > 0) {
  //           setS3(prev => ({ ...prev, ...data.sectionIII }));
  //         }
  //         if (data.sectionIV && Object.keys(data.sectionIV).length > 0) {
  //           setS4(prev => ({ ...prev, ...data.sectionIV }));
  //         }
  //         if (data.sectionV && Object.keys(data.sectionV).length > 0) {
  //           setS5(prev => ({ ...prev, ...data.sectionV }));
  //         }
  //         if (data.sectionVI && Object.keys(data.sectionVI).length > 0) {
  //           setS6(prev => ({ ...prev, ...data.sectionVI }));
  //         }
  //         if (data.sectionVII && Object.keys(data.sectionVII).length > 0) {
  //           setS7(prev => ({ ...prev, ...data.sectionVII }));
  //         }
  //       }
  //     } catch (error) {
  //       console.warn("⚠️ Could not load saved report (may not exist yet):", error.message);
  //     }
  //   };

  //   loadSavedReport();
  // }, [formData?.id, formData?.studentId]);

  // ── PDF Export with Print-Optimized Layout ──
  const handleExportPdf = async () => {
    try {
      console.log("📄 Creating print-optimized PDF...");

      // Create a clean print container
      const printContainer = document.createElement("div");
      printContainer.style.cssText = `
        width: 794px;
        margin: 0 auto;
        background: #fff;
        font-family: 'Times New Roman', Georgia, serif;
        font-size: 11px;
        line-height: 1.3;
        color: #000;
        padding: 20px;
        box-sizing: border-box;
      `;

      // Helper for radio symbols
      const radioSymbol = (value, option) => value === option ? "●" : "○";

      // Build the print HTML with proper table structure
      printContainer.innerHTML = `
        <style>
          .print-table { width: 100%; border-collapse: collapse; table-layout: fixed; border: 1px solid #555; margin-bottom: 15px; }
          .print-table td { border: 1px solid #555; padding: 5px; vertical-align: top; word-break: break-word; overflow-wrap: break-word; }
          .print-table .header { font-weight: bold; background: #f0f0f0; }
          .print-table .section { font-weight: bold; background: #f5f5f5; }
          .radio-group { display: flex; gap: 15px; flex-wrap: wrap; }
          .radio-item { white-space: nowrap; }
        </style>

        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 16px; font-weight: bold;">MindSaid Learning Centre</div>
          <div style="font-size: 11px; font-style: italic;">Learning This Ability</div>
          <div style="font-size: 9px;">Psycho-educational Assessment & Intervention Centre</div>
          <div style="width: 100%; height: 2px; background: #00a0e3; margin: 10px 0;"></div>
        </div>

        <table class="print-table">
          <tr>
            <td colspan="4" class="header" style="padding: 6px; font-size: 12px;">EXAMINEE REPORT FORM</td>
          </tr>
          <tr>
            <td colspan="4" class="section">Section I: IDENTIFYING INFORMATION</td>
          </tr>
          <tr>
            <td style="font-weight: bold; width: 20%;">Examinee's Name:</td>
            <td style="width: 30%;">${s1.childName || ''}</td>
            <td style="font-weight: bold; width: 20%;">Birth date:</td>
            <td style="width: 30%;">${s1.birthDate || ''}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Age:</td>
            <td>${s1.age || ''}</td>
            <td style="font-weight: bold;">Gender:</td>
            <td>
              <div class="radio-group">
                <span class="radio-item">${radioSymbol(s1.gender, "Male")} Male</span>
                <span class="radio-item">${radioSymbol(s1.gender, "Female")} Female</span>
                <span class="radio-item">${radioSymbol(s1.gender, "Prefer not to say")} Prefer not to say</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Nationality:</td>
            <td>${s1.nationality || ''}</td>
            <td style="font-weight: bold;">School Category:</td>
            <td>${s1.schoolCategory || ''}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Name of School:</td>
            <td>${s1.schoolName || ''}</td>
            <td style="font-weight: bold;">Grade:</td>
            <td>${s1.grade || ''}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Handedness:</td>
            <td>
              <div class="radio-group">
                <span class="radio-item">${radioSymbol(s1.handedness, "Right")} Right</span>
                <span class="radio-item">${radioSymbol(s1.handedness, "Left")} Left</span>
                <span class="radio-item">${radioSymbol(s1.handedness, "Ambidexterity")} Ambidexterity</span>
              </div>
            </td>
            <td style="font-weight: bold;">Mother Tongue:</td>
            <td>${s1.motherTongue || ''}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Language at home:</td>
            <td colspan="3">${s1.languageHome || ''}</td>
          </tr>
          <tr>
            <td colspan="4" style="font-style: italic; font-size: 9px;">
              Reports of previous psycho-educational assessments: please share reports via email, if applicable
            </td>
          </tr>
          <!-- Father's Details - Fixed column structure -->
          <tr>
            <td rowspan="3" style="font-weight: bold; vertical-align: top;">Father's Details</td>
            <td style="font-weight: bold;">Name:</td>
            <td colspan="2">${s1.fatherName || ''}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Phone:</td>
            <td>${s1.fatherPhone || ''}</td>
            <td>
              <span style="font-weight: bold;">Email:</span> <span style="word-break: break-all;">${s1.fatherEmail || ''}</span>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Education:</td>
            <td>${s1.fatherEdu || ''}</td>
            <td>
              <span style="font-weight: bold;">Profession:</span> ${s1.fatherProf || ''}
            </td>
          </tr>
          <!-- Mother's Details - Fixed column structure -->
          <tr>
            <td rowspan="3" style="font-weight: bold; vertical-align: top;">Mother's Details</td>
            <td style="font-weight: bold;">Name:</td>
            <td colspan="2">${s1.motherName || ''}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Phone:</td>
            <td>${s1.motherPhone || ''}</td>
            <td>
              <span style="font-weight: bold;">Email:</span> <span style="word-break: break-all;">${s1.motherEmail || ''}</span>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Education:</td>
            <td>${s1.motherEdu || ''}</td>
            <td>
              <span style="font-weight: bold;">Profession:</span> ${s1.motherProf || ''}
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Residence Address:</td>
            <td colspan="3">${s1.address || ''}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Form completed by:</td>
            <td>${s1.formBy || ''}</td>
            <td style="font-weight: bold;">Referred by:</td>
            <td>${s1.referredBy || ''}</td>
          </tr>
        </table>

        <!-- Section II: Academic Concerns -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed; border: 1px solid #555;">
          <tr>
            <td colspan="4" style="border: 1px solid #555; padding: 5px; font-weight: bold; background: #f5f5f5;">Section II: PRESENT ACADEMIC CONCERNS</td>
          </tr>
          <tr>
            <td colspan="4" style="border: 1px solid #555; padding: 4px; font-size: 10px;">
              <b>School attendance:</b> No. of days attended in school in one academic year: ${s2?.attendance || ''}
            </td>
          </tr>
          <tr style="background: #f0f0f0;">
            <td style="border: 1px solid #555; padding: 5px; font-weight: bold; width: 15%;">Academic Concerns</td>
            <td style="border: 1px solid #555; padding: 5px; width: 55%;">Write YES if the examinee CAN do this or NO if the examinee CANNOT</td>
            <td style="border: 1px solid #555; padding: 5px; font-weight: bold; width: 15%; text-align: center;">YES/NO</td>
            <td style="border: 1px solid #555; padding: 5px; font-weight: bold; width: 15%;">Comments</td>
          </tr>
          ${Object.entries(s2?.categories || {}).map(([category, data]) => {
            const questions = data.questions || [];
            return questions.map((q, idx) => `
              <tr>
                ${idx === 0 ? `<td rowspan="${questions.length}" style="border: 1px solid #555; padding: 5px; font-weight: bold; vertical-align: top;">${category}</td>` : ''}
                <td style="border: 1px solid #555; padding: 5px;">${q.label}</td>
                <td style="border: 1px solid #555; padding: 5px; text-align: center;">
                  ${radioSymbol(q.yn, "YES")} YES  
                  ${radioSymbol(q.yn, "NO")} NO
                </td>
                <td style="border: 1px solid #555; padding: 5px;">${q.comment || ''}</td>
              </tr>
            `).join('');
          }).join('')}
        </table>

        <!-- Section III: Family History -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed; border: 1px solid #555;">
          <tr>
            <td colspan="2" style="border: 1px solid #555; padding: 5px; font-weight: bold; background: #f5f5f5;">Section III: FAMILY HISTORY</td>
          </tr>
          <tr>
            <td style="border: 1px solid #555; padding: 5px; width: 50%;">
              <div style="font-weight: bold; margin-bottom: 5px;">Is there a history of (the) learning problems in the family?</div>
              <div>${radioSymbol(s3.learningProblemFamily, "Yes")} Yes  ${radioSymbol(s3.learningProblemFamily, "No")} No</div>
            </td>
            <td style="border: 1px solid #555; padding: 5px;">
              <div>${s3.learningProblemFamily === "Yes" ? `
                ${radioSymbol(s3.learningDifficulties, true)} Learning difficulties<br/>
                ${radioSymbol(s3.diagnosedDisorder, true)} Diagnosed disorder(s)<br/>
                ${radioSymbol(s3.attentionProblems, true)} Attention Problems<br/>
                ${radioSymbol(s3.emotionalDifficulties, true)} Emotional difficulties<br/>
                ${radioSymbol(s3.other, true)} Other
              ` : ''}</div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="border: 1px solid #555; padding: 5px;">
              <b>Any history of learning problems in the family (specific subjects, handwriting, etc.):</b><br/>
              ${s3.specificProblems || ''}
            </td>
          </tr>
        </table>

        <!-- Section IV: Medical History -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed; border: 1px solid #555;">
          <tr>
            <td colspan="3" style="border: 1px solid #555; padding: 5px; font-weight: bold; background: #f5f5f5;">Section IV: MEDICAL HISTORY - Pregnancy, Delivery and Examinee's developmental history</td>
          </tr>
          <tr>
            <td rowspan="4" style="border: 1px solid #555; padding: 5px; font-weight: bold; width: 15%;">a) Pre-natal</td>
            <td colspan="2" style="border: 1px solid #555; padding: 5px;">
              <b>Describe Mother's health during pregnancy:</b>
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #555; padding: 4px; width: 40%;">${radioSymbol(s4.prenatal?.edema, true)} Edema</td>
            <td style="border: 1px solid #555; padding: 4px;">${radioSymbol(s4.prenatal?.bloodPressure, true)} Blood pressure: High/Low</td>
          </tr>
          <tr>
            <td style="border: 1px solid #555; padding: 4px;">${radioSymbol(s4.prenatal?.nausea, true)} Nausea & vomiting beyond 3rd month</td>
            <td style="border: 1px solid #555; padding: 4px;">${radioSymbol(s4.prenatal?.diabetes, true)} Diabetes</td>
          </tr>
          <tr>
            <td style="border: 1px solid #555; padding: 4px;">${radioSymbol(s4.prenatal?.falls, true)} Falls / Fainting spells</td>
            <td style="border: 1px solid #555; padding: 4px;">${radioSymbol(s4.prenatal?.thyroid, true)} Thyroid</td>
          </tr>
        </table>

        <div style="font-size: 9px; text-align: center; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
          MindSaid Learning Centre - Psycho-educational Assessment & Intervention Centre
        </div>
      `;

      // Add to body temporarily
      document.body.appendChild(printContainer);

      // Capture with html2canvas
      const canvas = await html2canvas(printContainer, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 794,
        height: printContainer.scrollHeight,
      });

      // Remove from body
      document.body.removeChild(printContainer);

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${s1.childName || "Examinee"}_Report_Form.pdf`);
      console.log("✅ PDF Export successful");
    } catch (err) {
      console.error("❌ PDF Export Error:", err);
      alert("PDF export failed: " + err.message);
    }
  };

  // ── DOCX Export (improved for better content preservation)
  const handleExportDocx = async () => {
    try {
      console.log("[DOCX Export] Starting export for Examinee Report Form");
      
      const element = document.getElementById("print-area");
      if (!element) {
        alert("Print area not found");
        return;
      }

      // Helper functions for DOCX conversion
      const CELL_BORDER = { style: BorderStyle.SINGLE, size: 4, color: "555555" };
      const CELL_BORDERS = { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER };
      const PAGE_CONTENT_WIDTH = 9000; // Slightly wider for better content fit

      const nodeToRuns = (node, inherited = {}) => {
        const runs = [];
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (text && text.trim()) runs.push(new TextRun({ text, ...inherited, size: 20 })); // 10pt font
          return runs;
        }
        const tag = node.tagName?.toLowerCase();
        const style = {
          ...inherited,
          bold: inherited.bold || ["b", "strong", "th"].includes(tag),
          italics: inherited.italics || ["i", "em"].includes(tag),
          strike: inherited.strike || ["s", "del", "strike"].includes(tag),
          ...(tag === "u" ? { underline: {} } : {}),
        };

        if (tag === "br") {
          runs.push(new TextRun({ text: "", break: 1 }));
          return runs;
        }

        for (const child of node.childNodes) runs.push(...nodeToRuns(child, style));
        return runs;
      };

      const estimateColWidths = (trList, totalWidth) => {
        let colCount = 0;
        trList.forEach(tr => {
          let c = 0;
          tr.querySelectorAll("td,th").forEach(cell => {
            c += parseInt(cell.getAttribute("colspan") || "1");
          });
          colCount = Math.max(colCount, c);
        });
        if (colCount <= 1) return [totalWidth];

        const colLengths = Array(colCount).fill(0);
        trList.slice(0, 10).forEach(tr => {
          [...tr.querySelectorAll("td,th")].forEach((cell, i) => {
            if (i < colCount) {
              const text = (cell.textContent || "").trim();
              colLengths[i] = Math.max(colLengths[i], text.length);
            }
          });
        });

        const MIN_FRAC = 0.1;
        const remaining = Math.max(0, 1 - MIN_FRAC * colCount);
        const totalLen = colLengths.reduce((a, b) => a + b, 0) || 1;
        const fracs = colLengths.map(len => MIN_FRAC + (len / totalLen) * remaining);
        const fracSum = fracs.reduce((a, b) => a + b, 0);
        return fracs.map(f => Math.max(500, Math.floor((f / fracSum) * totalWidth)));
      };

      const cellToParagraphs = (tdNode) => {
        const paragraphs = [];
        const isTh = tdNode.tagName?.toLowerCase() === "th";

        const processNode = (node, inherited = {}) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const t = node.textContent;
            if (t && t.trim()) {
              paragraphs.push(new Paragraph({
                children: [new TextRun({ text: t, ...inherited, size: 20 })],
                spacing: { after: 0, before: 0 },
              }));
            }
            return;
          }
          const tag = node.tagName?.toLowerCase();
          if (!tag) return;
          
          // Handle input fields - extract their values
          if (tag === "input") {
            const value = node.value || node.placeholder || "";
            if (value) {
              paragraphs.push(new Paragraph({
                children: [new TextRun({ text: value, ...inherited, size: 20 })],
                spacing: { after: 0, before: 0 },
              }));
            }
            return;
          }
          
          // Handle textarea
          if (tag === "textarea") {
            const value = node.value || "";
            if (value) {
              paragraphs.push(new Paragraph({
                children: [new TextRun({ text: value, ...inherited, size: 20 })],
                spacing: { after: 0, before: 0 },
              }));
            }
            return;
          }
          
          if (tag === "br") {
            paragraphs.push(new Paragraph({ children: [], spacing: { after: 0, before: 0 } }));
            return;
          }
          if (["p", "div", "span", "label"].includes(tag)) {
            const runs = nodeToRuns(node, inherited);
            if (runs.length) {
              paragraphs.push(new Paragraph({ children: runs, spacing: { after: 40, before: 0 } }));
            } else {
              for (const child of node.childNodes) processNode(child, inherited);
            }
            return;
          }
          if (/^h[1-6]$/.test(tag)) {
            const hmap = { h1: HeadingLevel.HEADING_1, h2: HeadingLevel.HEADING_2, h3: HeadingLevel.HEADING_3, h4: HeadingLevel.HEADING_4 };
            paragraphs.push(new Paragraph({
              heading: hmap[tag] || HeadingLevel.HEADING_3,
              children: nodeToRuns(node),
              spacing: { after: 60, before: 40 },
            }));
            return;
          }
          const newInherited = {
            ...inherited,
            bold: inherited.bold || ["b", "strong", "th"].includes(tag),
            italics: inherited.italics || ["i", "em"].includes(tag),
          };
          for (const child of node.childNodes) processNode(child, newInherited);
        };

        for (const child of tdNode.childNodes) processNode(child, { bold: isTh });
        if (!paragraphs.length) paragraphs.push(new Paragraph({ children: [new TextRun({ text: " ", size: 20 })], spacing: { after: 0, before: 0 } }));
        return paragraphs;
      };

      const nodeToDocxElements = async (node) => {
        const els = [];
        if (node.nodeType === Node.TEXT_NODE) {
          const t = node.textContent.trim();
          if (t) els.push(new Paragraph({ children: [new TextRun({ text: t, size: 20 })] }));
          return els;
        }
        const tag = node.tagName?.toLowerCase();
        if (!tag) return els;

        const headingMap = { h1: HeadingLevel.HEADING_1, h2: HeadingLevel.HEADING_2, h3: HeadingLevel.HEADING_3, h4: HeadingLevel.HEADING_4 };
        if (headingMap[tag]) {
          els.push(new Paragraph({ heading: headingMap[tag], children: nodeToRuns(node) }));
          return els;
        }

        if (["p", "div", "section"].includes(tag)) {
          const runs = nodeToRuns(node);
          if (runs.length) {
            els.push(new Paragraph({ children: runs }));
            return els;
          }
          for (const c of node.childNodes) els.push(...await nodeToDocxElements(c));
          return els;
        }

        if (tag === "br") {
          els.push(new Paragraph({ children: [] }));
          return els;
        }

        if (tag === "hr") {
          els.push(new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "AAAAAA", space: 1 } },
            children: [],
          }));
          return els;
        }

        if (tag === "img") {
          // Handle images - skip for now or add image handling
          return els;
        }

        if (tag === "table") {
          const trList = Array.from(node.querySelectorAll("tr"));
          if (!trList.length) return els;

          let colCount = 0;
          trList.forEach(tr => {
            let count = 0;
            tr.querySelectorAll("td,th").forEach(cell => {
              count += parseInt(cell.getAttribute("colspan") || "1");
            });
            colCount = Math.max(colCount, count);
          });
          if (colCount === 0) return els;

          const colWidths = estimateColWidths(trList, PAGE_CONTENT_WIDTH);
          const finalColCount = colWidths.length;

          const rows = trList.map((tr, rowIdx) => {
            const tdList = Array.from(tr.querySelectorAll("td,th"));
            const cells = tdList.map((td, colIdx) => {
              const isHeader = td.tagName.toLowerCase() === "th" || rowIdx === 0;
              const colspan = parseInt(td.getAttribute("colspan") || "1");
              const rowspan = parseInt(td.getAttribute("rowspan") || "1");
              const cellWidth = colspan > 1
                ? colWidths.slice(colIdx, colIdx + colspan).reduce((a, b) => a + b, 0)
                : (colWidths[colIdx] || Math.floor(PAGE_CONTENT_WIDTH / finalColCount));

              return new TableCell({
                borders: CELL_BORDERS,
                columnSpan: colspan > 1 ? colspan : undefined,
                rowSpan: rowspan > 1 ? rowspan : undefined,
                width: { size: cellWidth, type: WidthType.DXA },
                shading: isHeader ? { fill: "E8E8E8", type: ShadingType.CLEAR } : undefined,
                margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: cellToParagraphs(td),
                verticalAlign: "top",
              });
            });

            return new TableRow({ 
              children: cells, 
              tableHeader: rowIdx === 0,
              cantSplit: true, // Prevent row splitting across pages
            });
          });

          els.push(new Table({
            width: { size: PAGE_CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: colWidths,
            rows,
            layout: "fixed",
          }));
          els.push(new Paragraph({ children: [], spacing: { after: 100 } }));
          return els;
        }

        for (const c of node.childNodes) els.push(...await nodeToDocxElements(c));
        return els;
      };

      const htmlToDocxElements = async (html) => {
        const div = document.createElement("div");
        div.innerHTML = html || "";
        
        // Remove no-print elements
        const noPrintElements = div.querySelectorAll(".no-print");
        noPrintElements.forEach(el => el.remove());
        
        const els = [];
        for (const c of div.childNodes) els.push(...await nodeToDocxElements(c));
        if (!els.length) els.push(new Paragraph({ children: [] }));
        return els;
      };

      // Convert HTML to DOCX elements
      console.log("[DOCX Export] Converting HTML to DOCX elements...");
      const children = await htmlToDocxElements(element.innerHTML);
      console.log("[DOCX Export] Generated", children.length, "DOCX elements");

      // Create document with proper page settings
      console.log("[DOCX Export] Creating document...");
      const doc = new Document({
        numbering: {
          config: [
            { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
            { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
          ],
        },
        styles: {
          default: { 
            document: { 
              run: { font: "Times New Roman", size: 20 }, // 10pt
              paragraph: { spacing: { line: 276, before: 0, after: 0 } }
            } 
          },
          paragraphStyles: [
            { 
              id: "Heading1", 
              name: "Heading 1", 
              basedOn: "Normal", 
              next: "Normal", 
              quickFormat: true, 
              run: { size: 28, bold: true, font: "Times New Roman", color: "000000" }, 
              paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } 
            },
            { 
              id: "Heading2", 
              name: "Heading 2", 
              basedOn: "Normal", 
              next: "Normal", 
              quickFormat: true, 
              run: { size: 24, bold: true, font: "Times New Roman" }, 
              paragraph: { spacing: { before: 180, after: 90 }, outlineLevel: 1 } 
            },
          ],
        },
        sections: [{
          properties: {
            page: {
              size: { width: 11906, height: 16838 }, // A4
              margin: { top: 567, right: 567, bottom: 567, left: 567 }, // 0.5 inch margins
            },
          },
          children,
        }],
      });

      console.log("[DOCX Export] Packing to blob...");
      const blob = await Packer.toBlob(doc);
      console.log("[DOCX Export] Blob created, size:", blob.size, "bytes");

      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${s1.childName || "Examinee"}_Report_Form.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      
      console.log("[DOCX Export] Download triggered successfully!");
    } catch (err) {
      console.error("[DOCX Export] FAILED:", err);
      console.error("[DOCX Export] Error stack:", err.stack);
      alert("DOCX export failed: " + err.message);
    }
  };

  // ── Save handler
  const handleSave = async () => {
    const formDataToSave = {
      sectionI: s1,
      sectionII: s2,
      sectionIII: s3,
      sectionIV: s4,
      sectionV: s5,
      sectionVI: s6,
      sectionVII: s7,
      examineeName: s1.childName,
      updatedAt: new Date().toISOString(),
    };

    // DEBUG: Log what we're sending
    console.log("============================================");
    console.log("📝 [FRONTEND] Saving report...");
    console.log("📝 [FRONTEND] Section I (s1):", s1);
    console.log("📝 [FRONTEND] Nationality value:", s1.nationality);
    console.log("📝 [FRONTEND] Handedness value:", s1.handedness);
    console.log("📝 [FRONTEND] Father name:", s1.fatherName);
    console.log("📝 [FRONTEND] Mother name:", s1.motherName);
    console.log("📝 [FRONTEND] Full formDataToSave:", formDataToSave);
    console.log("============================================");

    try {
      // Get examineeId from formData
      const examineeId = formData?.id || formData?.studentId || formData?.examineeId;
      
      if (!examineeId) {
        alert("Examinee ID not found! Cannot save.");
        console.error("No examineeId found in formData:", formData);
        return;
      }

      console.log("📝 [FRONTEND] Examinee ID:", examineeId);
      
      // Call API directly
      const result = await examineeApi.saveReportForm(examineeId, formDataToSave);
      console.log("✅ [FRONTEND] Save result:", result);
      
      alert("Form saved successfully!");
      
      // Update parent component with report form data after successful save
      if (onReportDataChange) {
        onReportDataChange({
          sectionI: s1,
          sectionII: s2,
          sectionIII: s3,
          sectionIV: s4,
          sectionV: s5,
          sectionVI: s6,
          sectionVII: s7,
        });
      }
      
      // Also call onSave prop if provided (for parent component updates)
      if (onSave) {
        await onSave({
          sectionI: s1,
          sectionII: s2,
          sectionIII: s3,
          sectionIV: s4,
          sectionV: s5,
          sectionVI: s6,
          sectionVII: s7,
        });
      }
    } catch (error) {
      console.error("❌ Save failed:", error);
      alert("Failed to save form: " + error.message);
    }
  };

  const handleExportXlsx = () => {
    const wb = XLSX.utils.book_new();
    const rows = [];
    const merges = [];
    let r = 0;

    // ── styling helpers (openpyxl-style via write_cells) ──
    const HEADER_STYLE = { font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 }, fill: { fgColor: { rgb: "3C3C3C" } }, alignment: { horizontal: "left" } };
    const COL_HEADER_STYLE = { font: { bold: true, sz: 10 }, fill: { fgColor: { rgb: "C8C8C8" } }, alignment: { horizontal: "center", wrapText: true } };
    const FIELD_STYLE = { font: { bold: true, sz: 9 }, alignment: { wrapText: true, vertical: "top" } };
    const VALUE_STYLE = { font: { sz: 9 }, alignment: { wrapText: true, vertical: "top" } };

    const sectionHead = (title) => {
      rows.push([{ v: title, s: HEADER_STYLE }]);
      merges.push({ s: { r, c: 0 }, e: { r, c: 3 } });
      r++;
    };

    const colHeaders = (...headers) => {
      rows.push(headers.map((h) => ({ v: h, s: COL_HEADER_STYLE })));
      r++;
    };

    const addRow = (f1, v1, f2, v2) => {
      if (f2 !== undefined) {
        rows.push([
          { v: f1 ?? "", s: FIELD_STYLE },
          { v: v1 ?? "", s: VALUE_STYLE },
          { v: f2 ?? "", s: FIELD_STYLE },
          { v: v2 ?? "", s: VALUE_STYLE },
        ]);
      } else {
        rows.push([
          { v: f1 ?? "", s: FIELD_STYLE },
          { v: v1 ?? "", s: VALUE_STYLE },
        ]);
        merges.push({ s: { r, c: 1 }, e: { r, c: 3 } });
      }
      r++;
    };

    const blankRow = () => { rows.push([]); r++; };

    // ── Mapping helpers ────────────────────────────────────────────────────────
    const LEARNING_HISTORY_LABELS = {
      learningDiff: "Learning difficulties",
      diagnosed: "Diagnosed disorder(s)",
      attentionProb: "Attention problems",
      alcoholDrug: "Alcohol / Drug problems",
      emotional: "Emotional difficulties",
      ownAbuse: "Own history of abuse",
      other: "Other",
    };

    const MILESTONE_LABELS = {
      socialSmile: "1. Social smile",
      turnedSide: "2. Turned side",
      crawling: "3. Crawling",
      pincerGrip: "4. Pincer grip",
      walking: "5. Walking",
      babbling: "6. Babbling",
      toiletTraining: "7. Toilet training",
      talkingSingleWords: "8. Talking – single words",
      talkingSentences: "9. Talking – sentences",
      running: "10. Running",
      climbing: "11. Climbing",
    };

    const APPLICABLE_LABELS = {
      buttoning: "Buttoning", tyingLaces: "Tying laces", cycling: "Cycling", penGrip: "Pen grip",
      tellingTime: "Telling time", tellingLeftRight: "Left/Right", poorInterpersonal: "Poor interpersonal",
      ruleBreaking: "Rule breaking", scholasticBackwardness: "Scholastic backwardness",
      introvert: "Introvert", anxious: "Anxious", handAches: "Hand aches while writing",
    };

    const getFamilyLearningText = (hl) =>
      Object.entries(LEARNING_HISTORY_LABELS).filter(([k]) => hl[k] === true).map(([, lbl]) => lbl).join(", ") || "—";

    const getApplicableText = (ap) =>
      Object.entries(APPLICABLE_LABELS).filter(([k]) => ap[k] === true).map(([, lbl]) => lbl).join(", ") || "—";

    // ── TITLE ──────────────────────────────────────────────────────────────────
    rows.push([{ v: "EXAMINEE REPORT FORM – MindSaid Learning Centre", s: { font: { bold: true, sz: 14 }, alignment: { horizontal: "center" } } }]);
    merges.push({ s: { r, c: 0 }, e: { r, c: 3 } });
    r++;
    blankRow();

    // ── SECTION I ──────────────────────────────────────────────────────────────
    sectionHead("Section I: Identifying Information");
    colHeaders("Field", "Value", "Field", "Value");
    addRow("Examinee Name", s1.childName, "Birth Date", s1.birthDate);
    addRow("Age", s1.age, "Gender", s1.gender);
    addRow("Nationality", s1.nationality, "Handedness", s1.handedness);
    addRow("School Name", s1.schoolName, "Grade", s1.grade);
    addRow("School Category", s1.schoolCategory, "Mother Tongue", s1.motherTongue);
    addRow("Language at Home", s1.languageHome, "Referred By", s1.referredBy);
    addRow("Father Name", s1.fatherName, "Father Phone", s1.fatherPhone);
    addRow("Father Email", s1.fatherEmail, "Father Education", s1.fatherEdu);
    addRow("Father Profession", s1.fatherProf, "", "");
    addRow("Mother Name", s1.motherName, "Mother Phone", s1.motherPhone);
    addRow("Mother Email", s1.motherEmail, "Mother Education", s1.motherEdu);
    addRow("Mother Profession", s1.motherProf, "", "");
    addRow("Address", s1.address, "Form Completed By", s1.formBy);
    addRow("Previous Reports", s1.previousReports);
    blankRow();

    // ── SECTION II ─────────────────────────────────────────────────────────────
    sectionHead("Section II: Present Academic Concerns");
    rows.push([{ v: `School Attendance (days/year):  ${s2.attendance || ""}`, s: { font: { italic: true, sz: 9 } } }]);
    merges.push({ s: { r, c: 0 }, e: { r, c: 3 } }); r++;
    colHeaders("Category", "Concern", "YES / NO", "Comments");

    const acCategories = [
      ["1. Attention", s2.attention],
      ["2. Listening", s2.listening],
      ["3. Speaking", s2.speaking],
      ["4. Writing", s2.writing],
      ["5. Reading", s2.reading],
      ["6. Math", s2.math],
    ];
    acCategories.forEach(([cat, acRows]) => {
      acRows.forEach((acr, i) => {
        rows.push([
          { v: i === 0 ? cat : "", s: FIELD_STYLE },
          { v: acr.label, s: VALUE_STYLE },
          { v: acr.yn || "—", s: { ...VALUE_STYLE, alignment: { horizontal: "center" } } },
          { v: acr.comment || "", s: VALUE_STYLE },
        ]);
        r++;
      });
    });
    addRow("General Comments", s2.generalComments);
    blankRow();

    // ── SECTION III ────────────────────────────────────────────────────────────
    sectionHead("Section III: Family Status / History");
    colHeaders("Field", "Value", "", "");
    addRow("Marital Status", s3.maritalStatus);
    addRow("Consanguineous Marriage", s3.consanguineous);
    addRow("Separation Date (if any)", s3.separationDate);
    addRow("Father Age at Marriage", s3.fatherAgeMarriage);
    addRow("Mother Age at Marriage", s3.motherAgeMarriage);
    addRow("Father Age at Birth", s3.fatherAgeBirth);
    addRow("Mother Age at Birth", s3.motherAgeBirth);
    addRow("Family Type", s3.familyType);
    s3.siblings.forEach((s, i) => addRow(`Sibling ${i + 1}`, `${s.gender || "—"}  |  Age: ${s.age || "—"}  |  Grade: ${s.grade || "—"}`));
    addRow("Family Learning History (applicable items)", getFamilyLearningText(s3.historyLearning));
    addRow("Relation of above", s3.historyLearning.relation);
    addRow("H/o Learning Problems in Family", s3.historyLearningYN);
    addRow("H/o Depression / Anxiety / Conduct Disorder", s3.historyDepression);
    blankRow();

    // ── SECTION IV ─────────────────────────────────────────────────────────────
    sectionHead("Section IV: Medical History");
    colHeaders("Detail", "Description", "", "");

    const prenatalChecked = [
      s4.prenatal.edema && "Edema", s4.prenatal.bp && "BP (High/Low)",
      s4.prenatal.nausea && "Nausea beyond 3rd month", s4.prenatal.diabetes && "Diabetes",
      s4.prenatal.falls && "Falls/Fainting", s4.prenatal.thyroid && "Thyroid",
    ].filter(Boolean).join(", ") || "None";

    const deliveryChecked = [
      s4.postnatal.fullTerm && "Full term", s4.postnatal.csection && "C-section",
      s4.postnatal.normal && "Normal", s4.postnatal.forceps && "Forceps",
    ].filter(Boolean).join(", ") || "None";

    addRow("Pre-natal – Mother's health during pregnancy", s4.prenatal.desc);
    addRow("Pre-natal conditions present", prenatalChecked);
    addRow("Post-natal – Delivery complications", s4.postnatal.desc);
    addRow("Delivery type", deliveryChecked);
    addRow("Birth weight", s4.weightAvg ? "Average" : s4.weightLow ? "Low" : "—");
    addRow("Cry at birth", s4.cryCry || "—");
    blankRow();

    colHeaders("Developmental Milestone", "Timing", "Age Achieved", "Comments");
    Object.entries(s4.milestones).forEach(([key, val]) => {
      const timing = val.early ? "Early" : val.normal ? "Normal" : val.average ? "Average" : val.delayed ? "Delayed" : "—";
      rows.push([
        { v: MILESTONE_LABELS[key] || key, s: FIELD_STYLE },
        { v: timing, s: { ...VALUE_STYLE, alignment: { horizontal: "center" } } },
        { v: val.age || "—", s: { ...VALUE_STYLE, alignment: { horizontal: "center" } } },
        { v: val.comment || "", s: VALUE_STYLE },
      ]);
      r++;
    });
    blankRow();

    addRow("Applicable Problems (ticked)", getApplicableText(s4.applicableProblems));
    const roomDesc = [
      s4.applicableProblems.roomTidy && "Tidy", s4.applicableProblems.roomUntidy && "Untidy",
      s4.applicableProblems.roomOrganised && "Organised", s4.applicableProblems.roomDisorganised && "Disorganised",
    ].filter(Boolean).join(", ") || "—";
    addRow("His/Her Room", `${roomDesc}${s4.roomComments ? "  |  " + s4.roomComments : ""}`);
    blankRow();

    colHeaders("Other Medical Examinations", "Details", "", "");
    [
      ["Language difficulties", s4.langDiff],
      ["Eye examination", s4.eyeExam],
      ["Speech assessment", s4.speechAssessment],
      ["Hearing test", s4.hearingTest],
      ["Psychological test", s4.psychTest],
      ["Neurological assessment", s4.neuroAssessment],
      ["Major illnesses / hospitalisations / injuries", s4.majorIllnesses],
      ["H/o ADHD", s4.adhdHistory],
      ["Current medications (and reason)", s4.medications],
    ].forEach(([lbl, val]) => addRow(lbl, val || "—"));
    blankRow();

    // ── SECTION V ──────────────────────────────────────────────────────────────
    sectionHead("Section V: Educational History");
    colHeaders("Field", "Value", "", "");
    s5.prevSchools.forEach((s, i) => addRow(`Previous School ${i + 1}`, `${s.name || "—"}  |  Grade: ${s.grade || "—"}`));
    [
      ["Satisfied with current school?", s5.currentSchoolSatisfied],
      ["Comments on satisfaction", s5.satisfactionComments],
      ["Age/Grade when problem first noticed & by whom", s5.problemFirstNoticed],
      ["Duration of concern", s5.howLong],
      ["Difficult subjects", s5.difficultSubjects],
      ["General progress before current school", s5.generalProgress],
      ["Progress comments", s5.progressComments],
      ["School's attitude towards problem", s5.schoolAttitude],
      ["Tuition teacher's attitude", s5.tuitionAttitude],
      ["Counselling / therapy (grade & duration)", s5.counselling],
      ["Concessions received in previous school", s5.concessions],
      ["Examinee's attitude towards school performance", s5.childAttitude],
      ["Forgets to submit homework/projects?", s5.forgetsHomework],
      ["Subjects chosen for current year", s5.chosenSubjects],
      ["Recent PTM remarks", s5.ptmRemarks],
    ].forEach(([lbl, val]) => addRow(lbl, val || "—"));
    blankRow();

    // ── SECTION VI ─────────────────────────────────────────────────────────────
    sectionHead("Section VI: Behaviour");
    colHeaders("Question", "Response", "", "");
    [
      ["How does the examinee get along with peers?", s6.peerRelations],
      ["How does the examinee get along with siblings/cousins?", s6.siblingRelations],
      ["Stressful events in the family?", s6.stressfulEvents],
      ["Behaviour concerns", s6.behaviourConcerns],
    ].forEach(([lbl, val]) => addRow(lbl, val || "—"));
    blankRow();

    // ── SECTION VII ────────────────────────────────────────────────────────────
    sectionHead("Section VII: Other");
    colHeaders("Question", "Response", "", "");
    [
      ["Play interests, toy preferences", s7.playInterests],
      ["Free time activities", s7.freeTime],
      ["Special talents (home/academics/sports)", s7.specialTalents],
      ["Forgets important things?", s7.forgetsThings],
      ["Activities enjoyed together", s7.togetherActivities],
      ["Acknowledging good behaviour", s7.acknowledgeBehaviour],
      ["Primary disciplinarian", s7.primaryDisciplinarian],
      ["Discipline strategies at home", s7.disciplineStrategies],
      ["Paediatrician / primary care doctor", s7.pediatrician],
      ["Other information", s7.otherInfo],
      ["How did you find out about MindSaid?", s7.howFoundOut],
      ["Name of parent filling the form", s7.parentName],
      ["Date", s7.date],
    ].forEach(([lbl, val]) => addRow(lbl, val || "—"));

    // ── Build worksheet ────────────────────────────────────────────────────────
    const ws = XLSX.utils.aoa_to_sheet(
      rows.map((row) => row.map((cell) => (cell && cell.v !== undefined ? cell.v : cell ?? "")))
    );

    // Apply styles (xlsx-style / SheetJS Pro supports this; standard xlsx: styles ignored but structure is preserved)
    ws["!merges"] = merges;
    ws["!cols"] = [{ wch: 38 }, { wch: 42 }, { wch: 34 }, { wch: 38 }];

    // Row heights for readability
    ws["!rows"] = rows.map(() => ({ hpt: 18 }));

    XLSX.utils.book_append_sheet(wb, ws, "Examinee Report Form");
    XLSX.writeFile(wb, "examinee_report_form.xlsx");
  };

  // ── Table styles
  const tbl = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 0,
    fontSize: 13,
  };

  const sectionBox = {
    border: "1px solid #e5e7eb",
    marginBottom: 24,
    fontFamily: "'Times New Roman', Times, serif",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  };

  return (
    <div style={{ background: "#e8e8e8", minHeight: "100vh", padding: "20px 0" }}>
      {/* Action Bar */}
      <div
        className="no-print"
        style={{
          maxWidth: 820,
          margin: "0 auto 16px",
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
          padding: "0 10px",
        }}
      >
        <button
          onClick={handleSave}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            border: "1px solid",
            cursor: "pointer",
            transition: "all 0.15s",
            background: "#10B981",
            color: "#fff",
            borderColor: "#10B981",
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save
        </button>
        <button
          onClick={handleExportPdf}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            border: "1px solid",
            cursor: "pointer",
            transition: "all 0.15s",
            background: "#DC2626",
            color: "#fff",
            borderColor: "#DC2626",
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export PDF
        </button>
        <span style={{ fontSize: 12, color: "#555", alignSelf: "center", fontFamily: "Arial" }}>
          All fields are editable — click to type
        </span>
      </div>

      {/* Form */}
      <div
        ref={printRef}
        id="print-area"
        style={{
          width: "100%",
          maxWidth: "1400px",
          padding: "20px",
          background: "#fff",
          margin: "0 auto",
        }}
      >
        {/* ── HEADER / LOGO ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
            borderBottom: "3px solid #29b6f6",
          }}
        >
          <img
            src="https://res.cloudinary.com/bazeercloud/image/upload/v1777305181/MSL-LOGO-MAIN_lbhbid.png"
            alt="MindSaid Learning Logo"
            style={{ width: 450, height: "auto", objectFit: "contain" }}
          />
        </div>

        {/* ══ SECTION I ══════════════════════════════════════════════════════ */}
        <div style={{ padding: "40px" }}>
          <div style={sectionBox}>
            <table style={tbl}>
              <tbody>
                <tr>
                  <td colSpan={6} style={{ border: "1px solid #555", padding: "6px 8px", fontWeight: "bold", fontSize: 14 }}>
                    EXAMINEE REPORT FORM
                  </td>
                </tr>
                <SectionHeader>Section I: IDENTIFYING INFORMATION</SectionHeader>
              <tr>
                <Cell bold colSpan={2}>Examinee's Name:</Cell>
                <Cell colSpan={2}><F value={s1.childName} onChange={(v) => setS1({ ...s1, childName: v })} wide /></Cell>
                <Cell bold>Birth date:</Cell>
                <Cell><F value={s1.birthDate} onChange={(v) => setS1({ ...s1, birthDate: v })} /></Cell>
              </tr>
              <tr>
                <Cell bold colSpan={2}>Age:</Cell>
                <Cell colSpan={4}><F value={s1.age} onChange={(v) => setS1({ ...s1, age: v })} /></Cell>
              </tr>
              <tr>
                <Cell bold colSpan={2}>Nationality:</Cell>
                <Cell><F value={s1.nationality} onChange={(v) => setS1({ ...s1, nationality: v })} wide /></Cell>
                <Cell bold colSpan={2}>Gender:</Cell>
                <Cell>
                  <Radio name="gender" options={["Male", "Female", "Prefer not to say"]} value={s1.gender} onChange={(v) => setS1({ ...s1, gender: v })} />
                </Cell>
              </tr>
              <tr>
                <Cell bold colSpan={2}>Name of School:</Cell>
                <Cell><F value={s1.schoolName} onChange={(v) => setS1({ ...s1, schoolName: v })} wide /></Cell>
                <Cell bold>School Category: <span style={{ fontWeight: "normal", fontStyle: "italic" }}>(IB/IGCSE/ICSE)</span></Cell>
                <Cell colSpan={2}><F value={s1.schoolCategory} onChange={(v) => setS1({ ...s1, schoolCategory: v })} wide /></Cell>
              </tr>
              <tr>
                <Cell bold colSpan={2}>
                  Handedness:&nbsp;
                  <Radio name="hand" options={["Right", "Left", "Ambidexterity (both hands)"]} value={s1.handedness} onChange={(v) => setS1({ ...s1, handedness: v })} />
                </Cell>
                <Cell bold>Grade:</Cell>
                <Cell colSpan={3}><F value={s1.grade} onChange={(v) => setS1({ ...s1, grade: v })} /></Cell>
              </tr>
              <tr>
                <Cell bold colSpan={2}>Mother Tongue:</Cell>
                <Cell><F value={s1.motherTongue} onChange={(v) => setS1({ ...s1, motherTongue: v })} wide /></Cell>
                <Cell bold>Language Spoken at home:</Cell>
                <Cell colSpan={2}><F value={s1.languageHome} onChange={(v) => setS1({ ...s1, languageHome: v })} wide /></Cell>
              </tr>
              <tr>
                <Cell colSpan={6} italic>
                  Reports of previous psycho-educational assessments: (please share reports via email, if applicable)
                  <F value={s1.previousReports} onChange={(v) => setS1({ ...s1, previousReports: v })} wide />
                </Cell>
              </tr>
              {/* Father */}
              <tr>
                <Cell bold rowSpan={3}>Father's Details</Cell>
                <Cell bold>Name:</Cell>
                <Cell colSpan={4}><F value={s1.fatherName} onChange={(v) => setS1({ ...s1, fatherName: v })} wide /></Cell>
              </tr>
              <tr>
                <Cell bold>Phone</Cell>
                <Cell><F value={s1.fatherPhone} onChange={(v) => setS1({ ...s1, fatherPhone: v })} wide /></Cell>
                <Cell bold>Email</Cell>
                <Cell colSpan={2}><F value={s1.fatherEmail} onChange={(v) => setS1({ ...s1, fatherEmail: v })} wide /></Cell>
              </tr>
              <tr>
                <Cell bold>Education</Cell>
                <Cell><F value={s1.fatherEdu} onChange={(v) => setS1({ ...s1, fatherEdu: v })} wide /></Cell>
                <Cell bold>Profession</Cell>
                <Cell colSpan={2}><F value={s1.fatherProf} onChange={(v) => setS1({ ...s1, fatherProf: v })} wide /></Cell>
              </tr>
              {/* Mother */}
              <tr>
                <Cell bold rowSpan={3}>Mother's Details</Cell>
                <Cell bold>Name:</Cell>
                <Cell colSpan={4}><F value={s1.motherName} onChange={(v) => setS1({ ...s1, motherName: v })} wide /></Cell>
              </tr>
              <tr>
                <Cell bold>Phone</Cell>
                <Cell><F value={s1.motherPhone} onChange={(v) => setS1({ ...s1, motherPhone: v })} wide /></Cell>
                <Cell bold>Email</Cell>
                <Cell colSpan={2}><F value={s1.motherEmail} onChange={(v) => setS1({ ...s1, motherEmail: v })} wide /></Cell>
              </tr>
              <tr>
                <Cell bold>Education</Cell>
                <Cell><F value={s1.motherEdu} onChange={(v) => setS1({ ...s1, motherEdu: v })} wide /></Cell>
                <Cell bold>Profession</Cell>
                <Cell colSpan={2}><F value={s1.motherProf} onChange={(v) => setS1({ ...s1, motherProf: v })} wide /></Cell>
              </tr>
              <tr>
                <Cell bold colSpan={2}>Residence Address</Cell>
                <Cell colSpan={4}><F value={s1.address} onChange={(v) => setS1({ ...s1, address: v })} wide /></Cell>
              </tr>
              <tr>
                <Cell bold colSpan={2}>Form completed by</Cell>
                <Cell><F value={s1.formBy} onChange={(v) => setS1({ ...s1, formBy: v })} wide /></Cell>
                <Cell bold colSpan={2}>Referred by:</Cell>
                <Cell><F value={s1.referredBy} onChange={(v) => setS1({ ...s1, referredBy: v })} wide /></Cell>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ══ SECTION II ══════════════════════════════════════════════════════ */}
        <div style={sectionBox}>
          <table style={tbl}>
            <tbody>
              <SectionHeader>Section II: PRESENT ACADEMIC CONCERNS</SectionHeader>
              <tr>
                <Cell bold italic colSpan={4}>
                  School attendance: No. of days attended in school in one academic year:&nbsp;
                  <F value={s2.attendance} onChange={(v) => setS2({ ...s2, attendance: v })} />
                </Cell>
              </tr>
              <tr>
                <Cell colSpan={2} bold>Academic Concerns<br /><span style={{ fontWeight: "bold" }}>Write YES if the examinee CAN do this or NO if the examinee CANNOT</span></Cell>
                <Cell bold style={{ textAlign: "center" }}>YES/NO</Cell>
                <Cell bold>Comments</Cell>
              </tr>
              {/* Attention */}
              {s2.attention.map((row, i) => (
                <AcRow
                  key={i}
                  category={i === 0 ? "1. Attention" : ""}
                  label={row.label}
                  data={row}
                  setData={(v) => updateAcRow("attention", i, v)}
                />
              ))}
              {/* Listening */}
              {s2.listening.map((row, i) => (
                <AcRow key={i} category={i === 0 ? "2. Listening" : ""} label={row.label} data={row} setData={(v) => updateAcRow("listening", i, v)} />
              ))}
              {/* Speaking */}
              {s2.speaking.map((row, i) => (
                <AcRow key={i} category={i === 0 ? "3. Speaking" : ""} label={row.label} data={row} setData={(v) => updateAcRow("speaking", i, v)} />
              ))}
              {/* Writing */}
              {s2.writing.map((row, i) => (
                <AcRow key={i} category={i === 0 ? "4. Writing" : ""} label={row.label} data={row} setData={(v) => updateAcRow("writing", i, v)} />
              ))}
              {/* Reading */}
              {s2.reading.map((row, i) => (
                <AcRow key={i} category={i === 0 ? "5. Reading" : ""} label={row.label} data={row} setData={(v) => updateAcRow("reading", i, v)} />
              ))}
              {/* Math */}
              {s2.math.map((row, i) => (
                <AcRow key={i} category={i === 0 ? "6. Math" : ""} label={row.label} data={row} setData={(v) => updateAcRow("math", i, v)} />
              ))}
              <tr>
                <Cell colSpan={4} bold>
                  Any general comments on the above concerns:
                  <br />
                  <TA value={s2.generalComments} onChange={(v) => setS2({ ...s2, generalComments: v })} rows={2} />
                </Cell>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ══ SECTION III ══════════════════════════════════════════════════════ */}
        <div style={sectionBox}>
          <table style={tbl}>
            <tbody>
              <SectionHeader>Section III: PRESENT FAMILY STATUS / HISTORY</SectionHeader>
              <tr>
                <Cell bold>Marital Status</Cell>
                <Cell colSpan={3}>
                  <Radio name="marital" options={["Yes", "No", "Single Parent"]} value={s3.maritalStatus} onChange={(v) => setS3({ ...s3, maritalStatus: v })} />
                </Cell>
              </tr>
              <tr>
                <Cell bold italic>Consanguineous marriage (marriage with blood relatives)</Cell>
                <Cell colSpan={3}>
                  <Radio name="consang" options={["Yes", "No"]} value={s3.consanguineous} onChange={(v) => setS3({ ...s3, consanguineous: v })} />
                </Cell>
              </tr>
              <tr>
                <Cell bold>If separated, when did the separation occur?</Cell>
                <Cell colSpan={3}><F value={s3.separationDate} onChange={(v) => setS3({ ...s3, separationDate: v })} wide /></Cell>
              </tr>
              <tr>
                <Cell bold>Parents ages at the time of marriage</Cell>
                <Cell colSpan={3}>
                  Father: <F value={s3.fatherAgeMarriage} onChange={(v) => setS3({ ...s3, fatherAgeMarriage: v })} />&nbsp;&nbsp;
                  Mother: <F value={s3.motherAgeMarriage} onChange={(v) => setS3({ ...s3, motherAgeMarriage: v })} />
                </Cell>
              </tr>
              <tr>
                <Cell bold>Parents ages at the time the examinee was born</Cell>
                <Cell colSpan={3}>
                  Father: <F value={s3.fatherAgeBirth} onChange={(v) => setS3({ ...s3, fatherAgeBirth: v })} />&nbsp;&nbsp;
                  Mother: <F value={s3.motherAgeBirth} onChange={(v) => setS3({ ...s3, motherAgeBirth: v })} />
                </Cell>
              </tr>
              <tr>
                <Cell bold>Family Type</Cell>
                <Cell colSpan={3}>
                  <Radio name="famtype" options={["Joint", "Nuclear", "Other"]} value={s3.familyType} onChange={(v) => setS3({ ...s3, familyType: v })} />
                </Cell>
              </tr>
              <tr>
                <Cell bold>No. of siblings</Cell>
                <Cell bold>Gender (brother/sister)</Cell>
                <Cell bold>Age</Cell>
                <Cell bold>Grade</Cell>
              </tr>
              {s3.siblings.map((sib, i) => (
                <tr key={i}>
                  <Cell>{i + 1}.</Cell>
                  <Cell><F value={sib.gender} onChange={(v) => setS3({ ...s3, siblings: s3.siblings.map((s, j) => j === i ? { ...s, gender: v } : s) })} wide /></Cell>
                  <Cell><F value={sib.age} onChange={(v) => setS3({ ...s3, siblings: s3.siblings.map((s, j) => j === i ? { ...s, age: v } : s) })} wide /></Cell>
                  <Cell><F value={sib.grade} onChange={(v) => setS3({ ...s3, siblings: s3.siblings.map((s, j) => j === i ? { ...s, grade: v } : s) })} wide /></Cell>
                </tr>
              ))}
              <tr>
                <Cell bold colSpan={2}>
                  Is there a history of (H/o) learning problems in the family? If Yes, tick what is applicable.
                </Cell>
                <Cell colSpan={2}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                    {[
                      ["learningDiff", "Learning difficulties"],
                      ["diagnosed", "Diagnosed disorder(s)"],
                      ["attentionProb", "Attention Problems"],
                      ["alcoholDrug", "Alcohol/Drug problems"],
                      ["emotional", "Emotional difficulties"],
                      ["ownAbuse", "Own history of abuse"],
                      ["other", "Other"],
                    ].map(([k, lbl]) => (
                      <CB key={k} label={lbl} checked={s3.historyLearning[k]}
                        onChange={(v) => setS3({ ...s3, historyLearning: { ...s3.historyLearning, [k]: v } })} />
                    ))}
                    <div>Relation: <F value={s3.historyLearning.relation} onChange={(v) => setS3({ ...s3, historyLearning: { ...s3.historyLearning, relation: v } })} /></div>
                  </div>
                </Cell>
              </tr>
              <tr>
                <Cell bold colSpan={2}>Any history of learning problems in the family (this includes specific subjects, handwriting, etc.)</Cell>
                <Cell colSpan={2}><Radio name="histLearn" options={["Yes", "No"]} value={s3.historyLearningYN} onChange={(v) => setS3({ ...s3, historyLearningYN: v })} /></Cell>
              </tr>
              <tr>
                <Cell bold colSpan={2}>Any family history of Depression/Anxiety/Conduct disorder / Other</Cell>
                <Cell colSpan={2}><Radio name="histDep" options={["Yes", "No"]} value={s3.historyDepression} onChange={(v) => setS3({ ...s3, historyDepression: v })} /></Cell>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ══ SECTION IV ══════════════════════════════════════════════════════ */}
        <div style={sectionBox}>
          <table style={tbl}>
            <tbody>
              <SectionHeader>Section IV: MEDICAL HISTORY – Pregnancy, Delivery and Examinee's developmental history</SectionHeader>
              {/* Pre-natal */}
              <tr>
                <Cell bold>a) Pre-natal</Cell>
                <Cell colSpan={5}>
                  Describe Mother's health during pregnancy:&nbsp;
                  <F value={s4.prenatal.desc} onChange={(v) => setS4({ ...s4, prenatal: { ...s4.prenatal, desc: v } })} wide />
                </Cell>
              </tr>
              <tr>
                <Cell />
                <Cell colSpan={2}><CB label="Edema" checked={s4.prenatal.edema} onChange={(v) => setS4({ ...s4, prenatal: { ...s4.prenatal, edema: v } })} /></Cell>
                <Cell colSpan={3}><CB label="Blood pressure: High/Low" checked={s4.prenatal.bp} onChange={(v) => setS4({ ...s4, prenatal: { ...s4.prenatal, bp: v } })} /></Cell>
              </tr>
              <tr>
                <Cell />
                <Cell colSpan={2}><CB label="Nausea & vomiting beyond 3rd month" checked={s4.prenatal.nausea} onChange={(v) => setS4({ ...s4, prenatal: { ...s4.prenatal, nausea: v } })} /></Cell>
                <Cell colSpan={3}><CB label="Diabetes" checked={s4.prenatal.diabetes} onChange={(v) => setS4({ ...s4, prenatal: { ...s4.prenatal, diabetes: v } })} /></Cell>
              </tr>
              <tr>
                <Cell />
                <Cell colSpan={2}><CB label="Falls / Fainting spells" checked={s4.prenatal.falls} onChange={(v) => setS4({ ...s4, prenatal: { ...s4.prenatal, falls: v } })} /></Cell>
                <Cell colSpan={3}><CB label="Thyroid" checked={s4.prenatal.thyroid} onChange={(v) => setS4({ ...s4, prenatal: { ...s4.prenatal, thyroid: v } })} /></Cell>
              </tr>
              {/* Post-natal */}
              <tr>
                <Cell bold>b) Post-natal</Cell>
                <Cell colSpan={5}>
                  Describe Mother's health during delivery (any complications):&nbsp;
                  <F value={s4.postnatal.desc} onChange={(v) => setS4({ ...s4, postnatal: { ...s4.postnatal, desc: v } })} wide />
                </Cell>
              </tr>
              <tr>
                <Cell />
                <Cell colSpan={2}><CB label="Delivery – Full term" checked={s4.postnatal.fullTerm} onChange={(v) => setS4({ ...s4, postnatal: { ...s4.postnatal, fullTerm: v } })} /></Cell>
                <Cell colSpan={3}><CB label="C-section" checked={s4.postnatal.csection} onChange={(v) => setS4({ ...s4, postnatal: { ...s4.postnatal, csection: v } })} /></Cell>
              </tr>
              <tr>
                <Cell />
                <Cell colSpan={2}><CB label="Normal" checked={s4.postnatal.normal} onChange={(v) => setS4({ ...s4, postnatal: { ...s4.postnatal, normal: v } })} /></Cell>
                <Cell colSpan={3}><CB label="Forceps" checked={s4.postnatal.forceps} onChange={(v) => setS4({ ...s4, postnatal: { ...s4.postnatal, forceps: v } })} /></Cell>
              </tr>
              {/* Birth details */}
              <tr>
                <Cell bold>c) Examinee's birth details</Cell>
                <Cell colSpan={2}>
                  Weight of the examinee:&nbsp;
                  <Radio name="weight" options={["Average", "Low"]} value={s4.weightAvg ? "Average" : s4.weightLow ? "Low" : ""} onChange={(v) => setS4({ ...s4, weightAvg: v === "Average", weightLow: v === "Low" })} />
                </Cell>
                <Cell colSpan={3}>
                  Cry of the examinee:&nbsp;
                  <Radio name="cry" options={["Immediate", "Delayed"]} value={s4.cryCry} onChange={(v) => setS4({ ...s4, cryCry: v })} />
                </Cell>
              </tr>
              {/* Milestones header */}
              <tr>
                <Cell bold>Developmental Milestones</Cell>
                <Cell bold style={{ textAlign: "center" }}>Early</Cell>
                <Cell bold style={{ textAlign: "center" }}>Normal</Cell>
                <Cell bold style={{ textAlign: "center" }}>Average</Cell>
                <Cell bold style={{ textAlign: "center" }}>Delayed</Cell>
                <Cell bold>Age Achieved</Cell>
                <Cell bold>Comments</Cell>
              </tr>
              {[
                ["socialSmile", "1. Social smile"],
                ["turnedSide", "2. Turned side"],
                ["crawling", "3. Crawling"],
                ["pincerGrip", "4. Pincer grip"],
                ["walking", "5. Walking"],
                ["babbling", "6. Babbling"],
                ["toiletTraining", "7. Toilet training"],
                ["talkingSingleWords", "8. Talking in single words"],
                ["talkingSentences", "9. Talking in sentences"],
                ["running", "10. Running"],
                ["climbing", "11. Climbing"],
              ].map(([key, lbl]) => (
                <MilestoneRow
                  key={key}
                  label={lbl}
                  data={s4.milestones[key]}
                  setData={(v) => setS4({ ...s4, milestones: { ...s4.milestones, [key]: v } })}
                />
              ))}
              {/* Applicable problems */}
              <tr>
                <Cell bold colSpan={2}>Please tick where applicable problem</Cell>
                <Cell colSpan={5}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4 }}>
                    {[
                      ["buttoning", "Buttoning"], ["tyingLaces", "Tying laces"], ["cycling", "Cycling"], ["penGrip", "Pen grip"],
                      ["tellingTime", "Telling time on a wall clock"], ["tellingLeftRight", "Telling left from right"],
                      ["poorInterpersonal", "Poor interpersonal skills"], ["ruleBreaking", "Rule breaking behavior"],
                      ["scholasticBackwardness", "Scholastic Backwardness"], ["introvert", "Introvert"],
                      ["anxious", "Anxious"], ["handAches", "Hand aches while writing"],
                    ].map(([k, lbl]) => (
                      <CB key={k} label={lbl} checked={s4.applicableProblems[k]}
                        onChange={(v) => setS4({ ...s4, applicableProblems: { ...s4.applicableProblems, [k]: v } })} />
                    ))}
                  </div>
                </Cell>
              </tr>
              <tr>
                <Cell bold>His/Her Room</Cell>
                <Cell colSpan={6}>
                  <Radio name="room1" options={["Tidy", "Untidy"]} value={s4.applicableProblems.roomTidy ? "Tidy" : s4.applicableProblems.roomUntidy ? "Untidy" : ""}
                    onChange={(v) => setS4({ ...s4, applicableProblems: { ...s4.applicableProblems, roomTidy: v === "Tidy", roomUntidy: v === "Untidy" } })} />
                  &nbsp;&nbsp;
                  <Radio name="room2" options={["Organised", "Disorganised"]} value={s4.applicableProblems.roomOrganised ? "Organised" : s4.applicableProblems.roomDisorganised ? "Disorganised" : ""}
                    onChange={(v) => setS4({ ...s4, applicableProblems: { ...s4.applicableProblems, roomOrganised: v === "Organised", roomDisorganised: v === "Disorganised" } })} />
                  &nbsp;&nbsp;Comments: <F value={s4.roomComments} onChange={(v) => setS4({ ...s4, roomComments: v })} wide />
                </Cell>
              </tr>
              {/* Other Medical */}
              <tr><Cell colSpan={7} bold>Other Medical Examinations</Cell></tr>
              {[
                ["langDiff", "Does the examinee have any language difficulties? If Yes, elaborate"],
                ["eyeExam", "Has the examinee undergone any eye examination? If Yes, test report in brief:"],
                ["speechAssessment", "Has the examinee had a speech assessment? If YES, test report in brief:"],
                ["hearingTest", "Has the examinee undergone any hearing test? If Yes, test report in brief:"],
                ["psychTest", "Has any psychological test been conducted? If Yes, When/FSIQ/Other:"],
                ["neuroAssessment", "Has the examinee undergone any neurological assessment? If Yes, When/Other"],
                ["majorIllnesses", "Has the examinee suffered any major childhood illnesses / hospitalization / convulsions / seizures / accidents / fractures / head injury? Please specify with treatment given:"],
                ["adhdHistory", "Has the examinee had any history of (H/o) ADHD: H/o hyperactivity / inattention / impulsivity? At home (duration > 6 months) and Age > 7 years:"],
                ["medications", "List of current medicines, if the examinee is on medication, and the reason for taking it."],
              ].map(([key, label]) => (
                <tr key={key}>
                  <Cell colSpan={7}>
                    {label}
                    <br />
                    <F value={s4[key]} onChange={(v) => setS4({ ...s4, [key]: v })} wide />
                  </Cell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ══ SECTION V ══════════════════════════════════════════════════════ */}
        <div style={sectionBox}>
          <table style={tbl}>
            <tbody>
              <SectionHeader>Section V: EDUCATIONAL HISTORY</SectionHeader>
              <tr>
                <Cell colSpan={4}>
                  List the schools the examinee has attended previous to the current school:<br />
                  <strong>Name of School / (upto) Grade level</strong>
                  {s5.prevSchools.map((sch, i) => (
                    <div key={i} style={{ marginTop: 4 }}>
                      {i + 1}:&nbsp;
                      <F value={sch.name} onChange={(v) => setS5({ ...s5, prevSchools: s5.prevSchools.map((s, j) => j === i ? { ...s, name: v } : s) })} />&nbsp;
                      Grade: <F value={sch.grade} onChange={(v) => setS5({ ...s5, prevSchools: s5.prevSchools.map((s, j) => j === i ? { ...s, grade: v } : s) })} />
                    </div>
                  ))}
                </Cell>
              </tr>
              {[
                ["currentSchoolSatisfied", "Overall, are parents satisfied with the current school:", ["YES", "NO"], true],
                ["satisfactionComments", "Comments:", null, false],
                ["problemFirstNoticed", "Mention Age/Grade at which the academic problems were first noticed. Who noticed the problems? Teacher/Parent/Tuition Teacher/Others:", null, false],
                ["howLong", "How long have you had these concerns?", null, false],
                ["difficultSubjects", "Which subjects are difficult for the examinee now?", null, false],
                ["generalProgress", "General academic progress of the examinee, before the current school:", ["Excellent", "Average", "Below Average"], true],
                ["progressComments", "Comments:", null, false],
                ["schoolAttitude", "Attitude of school towards the problem, if any:", null, false],
                ["tuitionAttitude", "Attitude of tuition teacher, if any:", null, false],
                ["counselling", "Has the examinee undergone any counselling/therapy? Yes No. If yes, grade when started and duration of remediation?", null, false],
                ["concessions", "List any concessions received in the previous school. Mention details:", null, false],
                ["childAttitude", "Examinee's attitude towards school performance:", ["Upset", "Anxious", "Bounces back", "Indifferent"], true],
                ["forgetsHomework", "Does he/she forget to submit his/her completed homework/projects?", null, false],
                ["chosenSubjects", "What subjects has he/she chosen for the current academic year?", null, false],
                ["ptmRemarks", "Please provide the remarks given about the examinee during the recent Parent-Teacher Meeting (PTM).", null, false],
              ].map(([key, label, options, isRadio]) => (
                <tr key={key}>
                  <Cell colSpan={4}>
                    {label}&nbsp;
                    {isRadio && options ? (
                      <Radio name={key} options={options} value={s5[key]} onChange={(v) => setS5({ ...s5, [key]: v })} />
                    ) : (
                      <F value={s5[key]} onChange={(v) => setS5({ ...s5, [key]: v })} wide />
                    )}
                  </Cell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ══ SECTION VI ══════════════════════════════════════════════════════ */}
        <div style={sectionBox}>
          <table style={tbl}>
            <tbody>
              <SectionHeader>Section VI: BEHAVIOUR</SectionHeader>
              {[
                ["peerRelations", "How does the examinee get along with his peers?"],
                ["siblingRelations", "How does the examinee get along with his siblings/cousins (in a joint family)?"],
                ["stressfulEvents", "Are there any stressful events occurring in the family?"],
                ["behaviourConcerns", "List any concerns you have about the examinee's behaviour:"],
              ].map(([key, label]) => (
                <tr key={key}>
                  <Cell colSpan={4}>
                    {label}
                    <br />
                    <F value={s6[key]} onChange={(v) => setS6({ ...s6, [key]: v })} wide />
                  </Cell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ══ SECTION VII ══════════════════════════════════════════════════════ */}
        <div style={sectionBox}>
          <table style={tbl}>
            <tbody>
              <SectionHeader>Section VII: OTHER</SectionHeader>
              {[
                ["playInterests", "List the examinee's play interests, toy preferences, and any special talents."],
                ["freeTime", "What does the examinee want to do during his free time?"],
                ["specialTalents", "List the examinee's special talents at home/in academics/sports/extra-curricular activities:"],
                ["forgetsThings", "Does he/she forget important things in school/elsewhere?"],
                ["togetherActivities", "What things do you and the examinee enjoy doing together?"],
                ["acknowledgeBehaviour", "How do you acknowledge and express the examinee's good behaviour?"],
                ["primaryDisciplinarian", "Who is the primary disciplinarian? What strategies do you use at home to implement discipline?"],
                ["pediatrician", "Name of the examinee's pediatrician/primary care doctor:"],
                ["otherInfo", "List any other information not covered above?"],
                ["howFoundOut", "Please tell us how you found out about MindSaid Learning Centre for Learning & Development?"],
              ].map(([key, label]) => (
                <tr key={key}>
                  <Cell colSpan={4}>
                    {label}
                    <br />
                    <F value={s7[key]} onChange={(v) => setS7({ ...s7, [key]: v })} wide />
                  </Cell>
                </tr>
              ))}
              <tr>
                <Cell colSpan={4} bold italic>
                  School Records – please share last 2 years school final reports on WhatsApp - 8928186952/Email –
                  <F value={s7.schoolRecords} onChange={(v) => setS7({ ...s7, schoolRecords: v })} wide />
                </Cell>
              </tr>
              {/* Confirmation */}
              <tr>
                <Cell colSpan={4}>
                  I hereby confirm that all the facts given above are true and correct to the best of my knowledge.
                  <br /><br />
                  Name of parent filling the form:&nbsp;
                  <F value={s7.parentName} onChange={(v) => setS7({ ...s7, parentName: v })} />
                  <br /><br />
                  Signature:&nbsp;
                  <span style={{ display: "inline-block", borderBottom: "1px solid #555", width: 200 }}>&nbsp;</span>
                  <br /><br />
                  Date:&nbsp;
                  <F value={s7.date} onChange={(v) => setS7({ ...s7, date: v })} placeholder={new Date().toLocaleDateString("en-IN")} />
                </Cell>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Print CSS */}
      <style>{`
        #print-area {
          width: 100%;
          max-width: 1400px;
          padding: 20px;
          background: white;
        }
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          #print-area {
            max-width: 100%;
            padding: 15px;
            box-shadow: none;
            page-break-inside: avoid;
          }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          input, textarea { border-bottom: 1px solid #999 !important; }
        }
        @media screen {
          #print-area {
            box-shadow: 0 4px 20px rgba(0,0,0,0.18);
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}
