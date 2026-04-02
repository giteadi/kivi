const AssessmentResult = require('../models/AssessmentResult');

class AssessmentResultController {
  constructor() {
    this.assessmentResultModel = new AssessmentResult();
  }

  // Save assessment item responses
  async saveResults(req, res) {
    try {
      const { assessmentId, studentId, items, totalScore, maxScore, completionPercentage } = req.body;

      console.log('Saving assessment results:', {
        assessmentId,
        studentId,
        itemCount: items?.length,
        totalScore,
        maxScore
      });

      if (!assessmentId || !studentId || !items || !Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: assessmentId, studentId, items'
        });
      }

      // Save each item response
      const savedResults = [];
      for (const item of items) {
        const resultData = {
          assessment_id: assessmentId,
          student_id: studentId,
          item_number: item.itemNumber,
          response_value: item.response,
          response_text: item.responseText || null,
          is_correct: item.isCorrect || null,
          score: item.score || null,
          time_taken: item.timeTaken || null
        };

        const resultId = await this.assessmentResultModel.create(resultData);
        savedResults.push({ id: resultId, itemNumber: item.itemNumber });
      }

      // Update assessment with summary data
      const Assessment = require('../models/Assessment');
      const assessmentModel = new Assessment();
      await assessmentModel.update(assessmentId, {
        total_score: totalScore || null,
        max_score: maxScore || null,
        completion_percentage: completionPercentage || Math.round((items.length / 24) * 100), // Assuming 24 items
        status: completionPercentage >= 100 ? 'Completed' : 'In Progress'
      });

      res.json({
        success: true,
        data: {
          savedResults,
          totalItems: items.length
        },
        message: `Successfully saved ${items.length} assessment responses`
      });
    } catch (error) {
      console.error('Save assessment results error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save assessment results',
        error: error.message
      });
    }
  }

  // Get assessment results for a specific assessment
  async getResults(req, res) {
    try {
      const { assessmentId } = req.params;

      const results = await this.assessmentResultModel.getResultsByAssessment(assessmentId);

      res.json({
        success: true,
        data: results,
        count: results.length
      });
    } catch (error) {
      console.error('Get assessment results error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch assessment results'
      });
    }
  }

  // Delete assessment results
  async deleteResults(req, res) {
    try {
      const { assessmentId } = req.params;

      await this.assessmentResultModel.deleteByAssessment(assessmentId);

      res.json({
        success: true,
        message: 'Assessment results deleted successfully'
      });
    } catch (error) {
      console.error('Delete assessment results error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete assessment results'
      });
    }
  }
}

module.exports = AssessmentResultController;
