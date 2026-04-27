 import api from './api';

// Examinee API functions (uses /students endpoints)
export const examineeApi = {
  // Get all examinees with their assessments
  getExaminees: async () => {
    const response = await api.request('/students');
    return response.data;
  },

  // Create new examinee
  createExaminee: async (examineeData) => {
    const response = await api.request('/students', {
      method: 'POST',
      body: JSON.stringify(examineeData),
    });
    return response.data;
  },

  // Create assessment with scores
  createAssessmentWithScores: async (assessmentData) => {
    const response = await api.request('/students/assessments', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
    return response.data;
  },

  // Save Report Form Data
  saveReportForm: async (examineeId, reportData) => {
    const response = await api.request(`/students/${examineeId}/report`, {
      method: 'PUT',
      body: JSON.stringify(reportData),
    });
    return response.data;
  },

  // Get Report Form Data
  getReportForm: async (examineeId) => {
    const response = await api.request(`/students/${examineeId}/report`);
    return response.data;
  },
};
