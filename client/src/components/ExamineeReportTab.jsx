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
    />
  );
};

export default ExamineeReportTab;
