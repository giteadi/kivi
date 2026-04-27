import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ExportDropdown from './ExportDropdown';

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
  <span style={{ display: "inline-flex", gap: 14, flexWrap: "wrap" }}>
    {options.map((opt) => (
      <label key={opt} style={{ fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
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
  </span>
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
    <Cell style={{ width: 160 }}>{category}</Cell>
    <Cell style={{ minWidth: 280 }}>{label}</Cell>
    <Cell style={{ width: 80, textAlign: "center" }}>
      <Radio
        name={`ac_${label.slice(0, 20)}`}
        options={["YES", "NO"]}
        value={data.yn}
        onChange={(v) => setData({ ...data, yn: v })}
      />
    </Cell>
    <Cell style={{ minWidth: 120 }}>
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
  }, [evaluationData, historyData, healthSampleReportData, educationSampleReportData, formData]);

  // ── Export handlers
  const handlePrint = () => window.print();

  const handleExportXlsx = async () => {
    // Export to Excel using XLSX library
    const rows = [
      ["Field", "Value"],
      ["Examinee Name", s1.childName], ["Birth Date", s1.birthDate], ["Age", s1.age],
      ["Nationality", s1.nationality], ["Gender", s1.gender], ["School", s1.schoolName],
      ["Grade", s1.grade], ["Mother Tongue", s1.motherTongue], ["Language at Home", s1.languageHome],
      ["Father Name", s1.fatherName], ["Father Phone", s1.fatherPhone], ["Father Email", s1.fatherEmail],
      ["Father Education", s1.fatherEdu], ["Father Profession", s1.fatherProf],
      ["Mother Name", s1.motherName], ["Mother Phone", s1.motherPhone], ["Mother Email", s1.motherEmail],
      ["Mother Education", s1.motherEdu], ["Mother Profession", s1.motherProf],
      ["Address", s1.address], ["Form Completed By", s1.formBy], ["Referred By", s1.referredBy],
    ];
    // Add academic concerns
    ["attention", "listening", "speaking", "writing", "reading", "math"].forEach((cat) => {
      s2[cat].forEach((row) => {
        rows.push([`[${cat}] ${row.label}`, row.yn + (row.comment ? " | " + row.comment : "")]);
      });
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), "Examinee Report Form");
    XLSX.writeFile(wb, "examinee_report_form.xlsx");
  };

  const handleExportPdf = async () => {
    // Export to PDF using html2canvas + jsPDF
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('examinee_report_form.pdf');
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
        <ExportDropdown
          onExportXlsx={handleExportXlsx}
          onExportPdf={handleExportPdf}
        />
        <button
          onClick={handlePrint}
          style={{
            background: "#c0392b",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: "bold",
            cursor: "pointer",
            fontFamily: "Arial, sans-serif",
          }}
        >
           Print / PDF
        </button>
        <span style={{ fontSize: 12, color: "#555", alignSelf: "center", fontFamily: "Arial" }}>
          All fields are editable — click to type
        </span>
      </div>

      {/* Form */}
      <div
        ref={printRef}
        id="form-to-print"
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "#fff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
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
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          #form-to-print { max-width: 100%; padding: 0; box-shadow: none; }
          input, textarea { border-bottom: 1px solid #999 !important; }
        }
        @media screen {
          #form-to-print { box-shadow: 0 4px 20px rgba(0,0,0,0.18); }
        }
      `}</style>
    </div>
  );
}
