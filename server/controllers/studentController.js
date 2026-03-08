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
      console.log('Request body received:', req.body);
      
      // Map camelCase to snake_case for database
      const studentData = {
        student_id: req.body.studentId || `STU${Date.now()}`,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        date_of_birth: req.body.dateOfBirth,
        gender: req.body.gender,
        centre_id: req.body.centreId || 1, // Default to centre_id 1 if not provided
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip_code: req.body.zipCode,
        emergency_contact_name: req.body.emergencyContactName,
        emergency_contact_phone: req.body.emergencyContactPhone,
        emergency_contact_relation: req.body.emergencyContactRelation,
        learning_needs: req.body.learningNeeds,
        support_requirements: req.body.supportRequirements,
        registration_date: req.body.registrationDate || new Date().toISOString().split('T')[0],
        status: req.body.status || 'active'
      };

      console.log('Processed student data:', studentData);
      
      // Remove undefined values
      Object.keys(studentData).forEach(key => {
        if (studentData[key] === undefined || studentData[key] === '') {
          delete studentData[key];
        }
      });
      
      console.log('Final student data to save:', studentData);
      
      const studentId = await this.studentModel.create(studentData);
      console.log('Student created with ID:', studentId);

      res.status(201).json({
        success: true,
        data: { id: studentId },
        message: 'Student created successfully'
      });
    } catch (error) {
      console.error('Create student error:', error);
      console.error('Error details:', error.sqlMessage || error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.sqlMessage || error.message
      });
    }
  }

  // Update student
  async updateStudent(req, res) {
    try {
      const { id } = req.params;
      
      // Map camelCase to snake_case for database
      const updateData = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        date_of_birth: req.body.dateOfBirth,
        gender: req.body.gender,
        centre_id: req.body.centre,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip_code: req.body.zipCode,
        emergency_contact_name: req.body.emergencyContactName,
        emergency_contact_phone: req.body.emergencyContactPhone,
        emergency_contact_relation: req.body.emergencyContactRelation,
        learning_needs: req.body.learningNeeds,
        support_requirements: req.body.supportRequirements,
        registration_date: req.body.registrationDate,
        status: req.body.status
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

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