const AssessmentResult = require('../models/AssessmentResult');

class AssessmentResultController {
  constructor() {
    this.assessmentResultModel = new AssessmentResult();
  }

  // Save assessment item responses
  async saveResults(req, res) {
    try {
      console.log('📥 [saveResults] Request received:', {
        body: req.body,
        headers: req.headers,
        path: req.path,
        method: req.method
      });
      
      const { assessmentId, studentId, items, totalScore, maxScore, completionPercentage } = req.body;

      console.log('Saving assessment results:', {
        assessmentId,
        studentId,
        itemCount: items?.length,
        totalScore,
        maxScore
      });

      console.log('🔍 [saveResults] Validation check:', {
        hasAssessmentId: !!assessmentId,
        hasStudentId: !!studentId,
        hasItems: !!items,
        isItemsArray: Array.isArray(items),
        itemsLength: items?.length
      });

      if (!assessmentId || !studentId || !items || !Array.isArray(items)) {
        console.log('❌ [saveResults] Validation FAILED - Missing required fields');
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: assessmentId, studentId, items'
        });
      }
      
      console.log('✅ [saveResults] Validation PASSED');
      
      // Check if items array is empty
      if (items.length === 0) {
        console.log('⚠️ [saveResults] WARNING: Items array is empty!');
        return res.status(400).json({
          success: false,
          message: 'No responses to save. Please enter at least one response.',
          data: { totalItems: 0 }
        });
      }

      // Save each item response
      const savedResults = [];
      console.log('💾 [saveResults] Starting to save', items.length, 'items');
      
      for (const item of items) {
        console.log('📝 [saveResults] Processing item:', item);
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

        console.log('💾 [saveResults] Saving resultData:', resultData);
        
        const resultId = await this.assessmentResultModel.create(resultData);
        console.log('✅ [saveResults] Saved item, resultId:', resultId);
        savedResults.push({ id: resultId, itemNumber: item.itemNumber });
      }

      // Update assessment with summary data
      console.log('📝 [saveResults] Updating assessment summary:', {
        assessmentId,
        totalScore,
        maxScore,
        completionPercentage,
        calculatedCompletion: Math.round((items.length / 24) * 100)
      });
      
      const Assessment = require('../models/Assessment');
      const assessmentModel = new Assessment();
      await assessmentModel.update(assessmentId, {
        total_score: totalScore || null,
        max_score: maxScore || null,
        completion_percentage: completionPercentage || Math.round((items.length / 24) * 100), // Assuming 24 items
        status: completionPercentage >= 100 ? 'Completed' : 'In Progress'
      });
      
      console.log('✅ [saveResults] Assessment summary updated successfully');

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
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage
      });
      res.status(500).json({
        success: false,
        message: 'Failed to save assessment results',
        error: error.message,
        sqlError: error.sqlMessage || null
      });
    }
  }

  // Get assessment results for a specific assessment
  async getResults(req, res) {
    try {
      console.log('📥 [getResults] Request received:', {
        params: req.params,
        headers: req.headers,
        path: req.path,
        method: req.method
      });
      
      const { assessmentId } = req.params;
      console.log('🔍 [getResults] Fetching results for assessmentId:', assessmentId);

      const results = await this.assessmentResultModel.getResultsByAssessment(assessmentId);
      
      console.log('✅ [getResults] Found', results.length, 'results');

      res.json({
        success: true,
        data: results,
        count: results.length
      });
    } catch (error) {
      console.error('❌ [getResults] Error:', {
        message: error.message,
        code: error.code,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        message: 'Failed to fetch assessment results',
        error: error.message
      });
    }
  }

  // Delete assessment results
  async deleteResults(req, res) {
    try {
      console.log('📥 [deleteResults] Request received:', {
        params: req.params,
        headers: req.headers,
        path: req.path,
        method: req.method
      });
      
      const { assessmentId } = req.params;
      console.log('🗑️ [deleteResults] Deleting results for assessmentId:', assessmentId);

      await this.assessmentResultModel.deleteByAssessment(assessmentId);
      
      console.log('✅ [deleteResults] Results deleted successfully');

      res.json({
        success: true,
        message: 'Assessment results deleted successfully'
      });
    } catch (error) {
      console.error('❌ [deleteResults] Error:', {
        message: error.message,
        code: error.code,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        message: 'Failed to delete assessment results',
        error: error.message
      });
    }
  }
}

module.exports = AssessmentResultController;
