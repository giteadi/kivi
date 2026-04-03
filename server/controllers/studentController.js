const Student = require('../models/Student');
const cache = require('../utils/cache');

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
      const cacheKey = `student:${id}`;
      
      console.log(`🔍 GET STUDENT: Fetching student with ID: ${id}`);
      
      // Try to get from cache first
      const cachedStudent = cache.get(cacheKey);
      if (cachedStudent) {
        console.log(`🗄️ CACHE RETURN: Student ${id} retrieved from cache`);
        return res.json({
          success: true,
          data: cachedStudent
        });
      }
      
      console.log(`💾 DB QUERY: Fetching student ${id} from database`);
      const student = await this.studentModel.getStudentWithSessions(id);

      if (!student) {
        console.log(`❌ GET FAILED: Student not found with ID: ${id}`);
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      console.log(`🔍 STUDENT FOUND: ${student.first_name} ${student.last_name} (${student.student_id})`);

      // Documents are already parsed in the Student model
      if (student.documents && Array.isArray(student.documents)) {
        console.log(`📎 DOCUMENTS: ${student.documents.length} documents found`);
        console.log(`📄 DOCUMENT NAMES:`, student.documents.map(d => d.name));
      } else {
        console.log(`📎 DOCUMENTS: No documents found for student ${id}`);
        student.documents = [];
      }

      // Cache the result (5 minutes TTL)
      cache.set(cacheKey, student, 5 * 60 * 1000);
      console.log(`🗄️ CACHE STORE: Student ${id} cached for 5 minutes`);

      // Parse JSON fields if they exist
      if (student.evaluation_data && typeof student.evaluation_data === 'string') {
        try {
          student.evaluation_data = JSON.parse(student.evaluation_data);
        } catch (e) {
          console.error('Error parsing evaluation_data:', e.message);
          student.evaluation_data = null;
        }
      }
      if (student.diagnosis_data && typeof student.diagnosis_data === 'string') {
        try {
          student.diagnosis_data = JSON.parse(student.diagnosis_data);
        } catch (e) {
          console.error('Error parsing diagnosis_data:', e.message);
          student.diagnosis_data = null;
        }
      }
      if (student.history_data && typeof student.history_data === 'string') {
        try {
          student.history_data = JSON.parse(student.history_data);
        } catch (e) {
          console.error('Error parsing history_data:', e.message);
          student.history_data = null;
        }
      }

      console.log(`✅ GET SUCCESS: Student ${id} retrieved with ${student.documents.length} documents`);
      res.json({
        success: true,
        data: student
      });
    } catch (error) {
      console.error(`❌ GET ERROR: Failed to fetch student ${id}:`, error);
      console.error(`❌ ERROR STACK:`, error.stack);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create student
  async createStudent(req, res) {
    try {
      // 📋 COMPREHENSIVE REQUEST TRACING FOR CREATE
      console.log('\n' + '═'.repeat(80));
      console.log('🆕 CREATE STUDENT - COMPLETE REQUEST TRACE');
      console.log('═'.repeat(80));
      console.log(`📦 Request Method: ${req.method}`);
      console.log(`🌐 Request URL: ${req.originalUrl}`);
      console.log(`📨 Content-Type: ${req.headers['content-type']}`);
      console.log(`👤 Authorization: ${req.headers.authorization ? '✓ Present' : '✗ Missing'}`);
      
      // COUNT AND LIST ALL FIELDS
      console.log('\n📤 INCOMING DATA SUMMARY:');
      console.log(`   Total Fields: ${Object.keys(req.body).length}`);
      console.log(`   Fields: ${Object.keys(req.body).join(', ')}`);
      
      // FIELD-BY-FIELD ANALYSIS
      console.log('\n📝 FIELD-BY-FIELD ANALYSIS:');
      Object.keys(req.body).forEach(key => {
        const value = req.body[key];
        const type = Array.isArray(value) ? `Array[${value.length}]` : typeof value;
        const preview = type === 'object' 
          ? JSON.stringify(value).substring(0, 40) + (JSON.stringify(value).length > 40 ? '...' : '')
          : (String(value).length > 50 ? String(value).substring(0, 50) + '...' : value);
        console.log(`   ✓ ${key.padEnd(25)} : ${String(preview).padEnd(30)} (${type})`);
      });
      
      // DOCUMENTS DEEP DIVE
      if (req.body.documents && Array.isArray(req.body.documents)) {
        console.log('\n📎 DOCUMENTS DETAILS:');
        console.log(`   Count: ${req.body.documents.length}`);
        req.body.documents.forEach((doc, idx) => {
          const sizeKB = (doc.size / 1024).toFixed(2);
          console.log(`   [${idx}] ${doc.name} | Type: ${doc.type} | Size: ${sizeKB}KB`);
          if (doc.data) {
            const dataSize = doc.data.length;
            console.log(`        Base64 Data Size: ${(dataSize / 1024 / 1024).toFixed(2)}MB`);
          }
        });
      } else {
        console.log('\n📎 DOCUMENTS: None provided');
      }
      
      console.log('═'.repeat(80) + '\n');
      
      // Map camelCase to snake_case for database
      const studentData = {
        student_id: req.body.studentId || `STU${Date.now()}`,
        first_name: req.body.firstName,
        middle_name: req.body.middleName,
        last_name: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        date_of_birth: req.body.dateOfBirth,
        gender: req.body.gender,
        centre_id: req.body.centreId || 1,
        centre_name: req.body.centreName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip_code: req.body.zipCode,
        emergency_contact_name: req.body.emergencyContactName,
        emergency_contact_phone: req.body.emergencyContactPhone,
        emergency_contact_relation: req.body.emergencyContactRelation,
        learning_needs: req.body.learningNeeds,
        support_requirements: req.body.supportRequirements,
        comment: req.body.comment,
        custom_field_1: req.body.customField1,
        custom_field_2: req.body.customField2,
        custom_field_3: req.body.customField3,
        custom_field_4: req.body.customField4,
        registration_date: req.body.registrationDate || new Date().toISOString().split('T')[0],
        status: req.body.status || 'active',
        evaluation_data: req.body.evaluationData ? JSON.stringify(req.body.evaluationData) : null,
        diagnosis_data: req.body.diagnosisData ? JSON.stringify(req.body.diagnosisData) : null,
        history_data: req.body.historyData ? JSON.stringify(req.body.historyData) : null
      };

      // Handle documents if provided
      if (req.body.documents && Array.isArray(req.body.documents)) {
        console.log(`📎 DOCUMENTS: Processing ${req.body.documents.length} documents for new student`);
        studentData.documents = JSON.stringify(req.body.documents);
        console.log(`📄 DOCUMENTS JSON SIZE: ${studentData.documents.length} characters`);
      } else {
        console.log(`📎 DOCUMENTS: No documents provided for new student`);
      }

      console.log('🆕 STUDENT DATA:', {
        student_id: studentData.student_id,
        first_name: studentData.first_name,
        last_name: studentData.last_name,
        email: studentData.email,
        hasDocuments: !!studentData.documents
      });
      
      // Remove undefined values
      Object.keys(studentData).forEach(key => {
        if (studentData[key] === undefined || studentData[key] === '') {
          delete studentData[key];
        }
      });
      
      console.log('🆕 FINAL STUDENT DATA TO SAVE:', Object.keys(studentData));
      
      const studentId = await this.studentModel.create(studentData);
      console.log(`✅ CREATE SUCCESS: Student created with ID: ${studentId}`);

      res.status(201).json({
        success: true,
        data: { id: studentId },
        message: 'Student created successfully'
      });
    } catch (error) {
      console.error('❌ CREATE ERROR: Failed to create student:', error);
      console.error('❌ ERROR DETAILS:', error.sqlMessage || error.message);
      console.error('❌ ERROR STACK:', error.stack);
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
      const cacheKey = `student:${id}`;
      
      // 📋 COMPREHENSIVE REQUEST TRACING
      console.log('\n' + '═'.repeat(80));
      console.log('🔄 UPDATE STUDENT - COMPLETE REQUEST TRACE');
      console.log('═'.repeat(80));
      console.log(`📌 Student ID: ${id}`);
      console.log(`📦 Request Method: ${req.method}`);
      console.log(`🌐 Request URL: ${req.originalUrl}`);
      console.log(`📨 Content-Type: ${req.headers['content-type']}`);
      console.log(`👤 Authorization: ${req.headers.authorization ? '✓ Present' : '✗ Missing'}`);
      
      // COUNT AND LIST ALL FIELDS
      console.log('\n📤 INCOMING DATA SUMMARY:');
      console.log(`   Total Fields: ${Object.keys(req.body).length}`);
      console.log(`   Fields: ${Object.keys(req.body).join(', ')}`);
      
      // FIELD-BY-FIELD ANALYSIS
      console.log('\n📝 FIELD-BY-FIELD ANALYSIS:');
      Object.keys(req.body).forEach(key => {
        const value = req.body[key];
        const type = Array.isArray(value) ? `Array[${value.length}]` : typeof value;
        const preview = type === 'object' 
          ? JSON.stringify(value).substring(0, 40) + (JSON.stringify(value).length > 40 ? '...' : '')
          : (String(value).length > 50 ? String(value).substring(0, 50) + '...' : value);
        console.log(`   ✓ ${key.padEnd(25)} : ${String(preview).padEnd(30)} (${type})`);
      });
      
      // DOCUMENTS DEEP DIVE
      if (req.body.documents && Array.isArray(req.body.documents)) {
        console.log('\n📎 DOCUMENTS DETAILS:');
        console.log(`   Count: ${req.body.documents.length}`);
        req.body.documents.forEach((doc, idx) => {
          const sizeKB = (doc.size / 1024).toFixed(2);
          console.log(`   [${idx}] ${doc.name} | Type: ${doc.type} | Size: ${sizeKB}KB`);
          if (doc.data) {
            const dataSize = doc.data.length;
            console.log(`        Base64 Data Size: ${(dataSize / 1024 / 1024).toFixed(2)}MB`);
          }
        });
      } else {
        console.log('\n📎 DOCUMENTS: None provided');
      }
      
      // RAW JSON DUMP (truncated for readability)
      console.log('\n📋 FULL REQUEST BODY (Raw JSON):');
      const jsonStr = JSON.stringify(req.body, null, 2);
      const truncated = jsonStr.length > 3000;
      console.log(jsonStr.substring(0, 3000) + (truncated ? '\n... [truncated - total size: ' + jsonStr.length + ' chars]' : ''));
      console.log('═'.repeat(80) + '\n');
      
      // Clear cache for this student
      cache.delete(cacheKey);
      console.log(`🗄️ CACHE INVALIDATE: Cleared cache for student ${id}`);
      
      // Map camelCase to snake_case for database
      const updateData = {
        first_name: req.body.firstName,
        middle_name: req.body.middleName,
        last_name: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        date_of_birth: req.body.dateOfBirth,
        gender: req.body.gender,
        centre_id: req.body.centreId || req.body.centre,
        centre_name: req.body.centreName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip_code: req.body.zipCode,
        emergency_contact_name: req.body.emergencyContactName,
        emergency_contact_phone: req.body.emergencyContactPhone,
        emergency_contact_relation: req.body.emergencyContactRelation,
        learning_needs: req.body.learningNeeds,
        support_requirements: req.body.supportRequirements,
        comment: req.body.comment,
        custom_field_1: req.body.customField1,
        custom_field_2: req.body.customField2,
        custom_field_3: req.body.customField3,
        custom_field_4: req.body.customField4,
        registration_date: req.body.registrationDate,
        status: req.body.status,
        evaluation_data: req.body.evaluationData ? JSON.stringify(req.body.evaluationData) : null,
        diagnosis_data: req.body.diagnosisData ? JSON.stringify(req.body.diagnosisData) : null,
        history_data: req.body.historyData ? JSON.stringify(req.body.historyData) : null
      };

      // Handle documents if provided
      if (req.body.documents && Array.isArray(req.body.documents)) {
        console.log(`📎 DOCUMENTS: Processing ${req.body.documents.length} documents`);
        updateData.documents = JSON.stringify(req.body.documents);
        console.log(`📄 DOCUMENTS JSON SIZE: ${updateData.documents.length} characters`);
      } else {
        console.log(`📎 DOCUMENTS: No documents provided`);
      }

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      console.log(`🔄 UPDATE DATA:`, Object.keys(updateData));
      const updated = await this.studentModel.update(id, updateData);

      if (!updated) {
        console.log(`❌ UPDATE FAILED: Student not found with ID: ${id}`);
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      console.log(`✅ UPDATE SUCCESS: Student ${id} updated successfully`);
      res.json({
        success: true,
        message: 'Student updated successfully'
      });
    } catch (error) {
      console.error(`❌ UPDATE ERROR: Failed to update student ${id}:`, error);
      console.error(`❌ ERROR DETAILS:`, {
        message: error.message,
        sqlMessage: error.sqlMessage,
        errno: error.errno,
        code: error.code,
        stack: error.stack
      });
      console.error(`❌ REQUEST BODY DEBUG:`, JSON.stringify(req.body, null, 2));
      
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          sqlMessage: error.sqlMessage,
          code: error.code
        } : {}
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

  // Export students data
  async exportStudents(req, res) {
    try {
      const { format, studentIds } = req.body;
      const filters = studentIds && studentIds.length > 0 ? { ids: studentIds } : req.query;
      
      console.log(`📤 EXPORT: Requested format: ${format}, Student IDs: ${studentIds || 'all'}`);
      
      const students = await this.studentModel.getStudents(filters);
      console.log(`📤 EXPORT: Found ${students.length} students to export`);

      if (!students || students.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No students found to export'
        });
      }

      // Transform data for export
      const exportData = students.map(student => ({
        'System ID': `SYS${student.id.toString().padStart(6, '0')}`,
        'First Name': student.first_name || '',
        'Last Name': student.last_name || '',
        'Examinee ID': student.student_id || `STU${student.id}`,
        'Birth Date': student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString('en-GB') : '',
        'Gender': student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : '',
        'Email': student.email || '',
        'Phone': student.phone || '',
        'Center': student.centre_name || 'MindSaid Learning Centre',
        'Status': student.status === 'active' ? 'Active' : 'Inactive',
        'Registration Date': student.registration_date || '',
        'Address': student.address || '',
        'City': student.city || '',
        'State': student.state || '',
        'Zip Code': student.zip_code || ''
      }));

      console.log(`📤 EXPORT: Transformed data for ${format} format`);

      res.json({
        success: true,
        data: exportData,
        format: format,
        count: exportData.length,
        filename: `examinees_${new Date().toISOString().split('T')[0]}`
      });
    } catch (error) {
      console.error('❌ EXPORT ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = StudentController;