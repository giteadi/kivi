import ExamineeReportForm from './ExamineeReportForm';

const ExamineeReportTab = ({
  formData,
  evaluationData,
  diagnosisData,
  historyData,
  languageSampleReportData,
  educationSampleReportData,
  healthSampleReportData,
  employmentSampleReportData,
  onSave,
  onReportDataChange,
  reportFormData,
}) => {
  return (
    <ExamineeReportForm
      formData={formData}
      evaluationData={evaluationData}
      diagnosisData={diagnosisData}
      historyData={historyData}
      languageSampleReportData={languageSampleReportData}
      educationSampleReportData={educationSampleReportData}
      healthSampleReportData={healthSampleReportData}
      employmentSampleReportData={employmentSampleReportData}
      onSave={onSave}
      onReportDataChange={onReportDataChange}
      reportFormData={reportFormData}
    />
  );
};

export default ExamineeReportTab;
