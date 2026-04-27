 import api from './api';

// Examinee API functions
export const examineeApi = {
  // Get all examinees with their assessments
  getExaminees: async () => {
    const response = await api.request('/examinees');
    return response.data;
  },

  // Create new examinee
  createExaminee: async (examineeData) => {
    const response = await api.request('/examinees', {
      method: 'POST',
      body: JSON.stringify(examineeData),
    });
    return response.data;
  },

  // Create assessment with scores
  createAssessmentWithScores: async (assessmentData) => {
    const response = await api.request('/examinees/assessment', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
    return response.data;
  },
};
