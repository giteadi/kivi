const Student = require('../models/Student');

class StudentController {
  constructor() {
    this.studentModel = new Student();
  }

  // Get all students
  async getStudents(req, res) {
    try {
      console.log('Fetching students with filters:', req.query);
      const filters = req.query;
      const students = await this.studentModel.getStudents(filters);
      console.log(`Found ${students.length} students`);

      res.json({
        success: true,
        data: students
      });
    } catch (error) {
      console.error('Get students error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Database error'
      });
    }
  }

  // Get single student
  async getStudent(req, res) {
    try {
      const { id } = req.params;
      const student = await this.studentModel.getStudentWithSessions(id);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      res.json({
        success: true,
        data: student
      });
    } catch (error) {
      console.error('Get student error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create student
  async createStudent(req, res) {
    try {
      const studentData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };

      const studentId = await this.studentModel.create(studentData);

      res.status(201).json({
        success: true,
        data: { id: studentId },
        message: 'Student created successfully'
      });
    } catch (error) {
      console.error('Create student error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update student
  async updateStudent(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updated = await this.studentModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      res.json({
        success: true,
        message: 'Student updated successfully'
      });
    } catch (error) {
      console.error('Update student error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete student
  async deleteStudent(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.studentModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      res.json({
        success: true,
        message: 'Student deleted successfully'
      });
    } catch (error) {
      console.error('Delete student error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = StudentController;