const Assessment = require('../models/Assessment');

class AssessmentController {
  constructor() {
    this.assessmentModel = new Assessment();
  }

  // Get assessments for a specific student
  async getAssessments(req, res) {
    try {
      const { studentId } = req.params;
      const assessments = await this.assessmentModel.getAssessmentsByStudent(studentId);

      res.json({
        success: true,
        data: assessments
      });
    } catch (error) {
      console.error('Get assessments error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Database error'
      });
    }
  }

  // Create new assessment
  async createAssessment(req, res) {
    try {
      console.log('Request body received:', req.body);
      
      // Map camelCase to snake_case for database
      const assessmentData = {
        student_id: req.body.examineeId,
        assessment_type: req.body.assessmentType,
        delivery_method: req.body.deliveryMethod,
        scheduled_date: req.body.scheduledDate,
        scheduled_time: req.body.scheduledTime,
        duration: req.body.duration,
        examiner: req.body.examiner,
        room: req.body.room,
        materials: req.body.materials,
        notes: req.body.notes,
        status: 'Scheduled',
        created_at: new Date()
      };

      // Only include assessment_name if provided
      if (req.body.assessmentName && req.body.assessmentName.trim()) {
        assessmentData.assessment_name = req.body.assessmentName.trim();
      }

      console.log('Processed assessment data:', assessmentData);
      
      // Remove undefined values
      Object.keys(assessmentData).forEach(key => {
        if (assessmentData[key] === undefined || assessmentData[key] === '') {
          delete assessmentData[key];
        }
      });
      
      console.log('Final assessment data to save:', assessmentData);
      
      const assessmentId = await this.assessmentModel.create(assessmentData);
      console.log('Assessment created with ID:', assessmentId);

      // Fetch the created assessment to return full data
      const createdAssessment = await this.assessmentModel.getAssessment(assessmentId);

      res.status(201).json({
        success: true,
        data: createdAssessment,
        message: 'Assessment created successfully'
      });
    } catch (error) {
      console.error('Create assessment error:', error);
      console.error('Error details:', error.sqlMessage || error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.sqlMessage || error.message
      });
    }
  }

  // Delete assessment
  async deleteAssessment(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.assessmentModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
      }

      res.json({
        success: true,
        message: 'Assessment deleted successfully'
      });
    } catch (error) {
      console.error('Delete assessment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update assessment
  async updateAssessment(req, res) {
    try {
      const { id } = req.params;
      console.log('Updating assessment:', id, req.body);
      
      // Map camelCase to snake_case for database
      const assessmentData = {
        assessment_type: req.body.assessment_type,
        delivery_method: req.body.delivery_method,
        scheduled_date: req.body.scheduled_date,
        scheduled_time: req.body.scheduled_time,
        duration: req.body.duration,
        examiner: req.body.examiner,
        room: req.body.room,
        materials: req.body.materials,
        notes: req.body.notes,
        status: req.body.status,
        updated_at: new Date()
      };

      console.log('Assessment data to update:', assessmentData);
      const updateSuccess = await this.assessmentModel.update(id, assessmentData);
      console.log('Update success result:', updateSuccess);
      
      if (updateSuccess) {
        console.log('Fetching updated assessment...');
        // Fetch updated assessment to return to frontend
        const updatedAssessment = await this.assessmentModel.getAssessment(id);
        console.log('Updated assessment fetched:', updatedAssessment);
        
        console.log('Sending success response...');
        res.json({
          success: true,
          data: updatedAssessment,
          message: 'Assessment updated successfully'
        });
      } else {
        console.log('Update failed, sending 404...');
        res.status(404).json({
          success: false,
          message: 'Assessment not found or no changes made'
        });
      }
    } catch (error) {
      console.error('Update assessment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Database error'
      });
    }
  }

  // Generate assessment report
  async generateReport(req, res) {
    try {
      const { assessmentIds } = req.body;
      
      // This would generate actual reports in a real implementation
      // For now, just return success
      
      res.json({
        success: true,
        message: `Report generated for ${assessmentIds.length} assessment(s)`
      });
    } catch (error) {
      console.error('Generate report error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = AssessmentController;
