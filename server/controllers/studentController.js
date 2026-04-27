const Student = require('../models/Student');
const cache = require('../utils/cache');

// Helper function to generate short unique student ID
// Format: First letter of first name + First letter of last name + Last 2 digits of year + Random 2 digits
// Example: Aditya Sharma, DOB 15/05/1990 → AS9023
function generateStudentId(firstName, lastName, dateOfBirth) {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : 'X';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : 'X';
  
  // Get last 2 digits of year from DOB or current year
  let yearDigits;
  if (dateOfBirth) {
    const year = new Date(dateOfBirth).getFullYear();
    yearDigits = year.toString().slice(-2);
  } else {
    yearDigits = new Date().getFullYear().toString().slice(-2);
  }
  
  // Random 2 digit number (01-99) for uniqueness
  const randomNum = Math.floor(Math.random() * 99) + 1;
  const randomDigits = randomNum.toString().padStart(2, '0');
  
  return `${firstInitial}${lastInitial}${yearDigits}${randomDigits}`;
}

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
      
      console.log('\n' + '═'.repeat(80));
      console.log('🔍 GET STUDENT - DETAILED FLOW');
      console.log('═'.repeat(80));
      console.log(`📌 Student ID: ${id}`);
      console.log(`🗄️ Cache Key: ${cacheKey}`);
      
      // 🔥 TEMPORARILY DISABLE CACHE FOR TESTING (uncomment after testing)
      // Try to get from cache first
      // const cachedStudent = cache.get(cacheKey);
      // if (cachedStudent) {
      //   console.log(`✅ CACHE HIT: Student ${id} retrieved from cache`);
      //   console.log(`📦 Cached Data Keys:`, Object.keys(cachedStudent));
      //   console.log(`📊 Cached Data Sample:`, {
      //     id: cachedStudent.id,
      //     name: `${cachedStudent.first_name} ${cachedStudent.last_name}`,
      //     school_name: cachedStudent.school_name,
      //     grade: cachedStudent.grade,
      //     has_evaluation_data: !!cachedStudent.evaluation_data,
      //     has_diagnosis_data: !!cachedStudent.diagnosis_data,
      //     has_history_data: !!cachedStudent.history_data
      //   });
      //   console.log('═'.repeat(80) + '\n');
      //   return res.json({
      //     success: true,
      //     data: cachedStudent
      //   });
      // }
      
      console.log(`🗄️ CACHE DISABLED (testing mode) - Fetching fresh from database`);
      console.log(`💾 DB QUERY: Executing getStudentWithSessions...`);
      const student = await this.studentModel.getStudentWithSessions(id);

      if (!student) {
        console.log(`❌ NOT FOUND: Student with ID ${id} does not exist`);
        console.log('═'.repeat(80) + '\n');
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      console.log(`✅ STUDENT FOUND: ${student.first_name} ${student.last_name} (${student.student_id})`);
      console.log(`📊 Database Fields Retrieved:`);
      console.log(`   - first_name: ${student.first_name}`);
      console.log(`   - middle_name: ${student.middle_name || 'NULL'}`);
      console.log(`   - last_name: ${student.last_name}`);
      console.log(`   - school_name: ${student.school_name || 'NULL'}`);
      console.log(`   - grade: ${student.grade || 'NULL'}`);
      console.log(`   - language_of_testing: ${student.language_of_testing || 'NULL'}`);
      console.log(`   - comment: ${student.comment ? student.comment.substring(0, 50) + '...' : 'NULL'}`);
      console.log(`   - requires_assessment: ${student.requires_assessment}`);
      console.log(`   - requires_therapy: ${student.requires_therapy}`);

      // Documents are already parsed in the Student model
      if (student.documents && Array.isArray(student.documents)) {
        console.log(`📎 DOCUMENTS: ${student.documents.length} documents found`);
        console.log(`📄 DOCUMENT NAMES:`, student.documents.map(d => d.name));
      } else {
        console.log(`📎 DOCUMENTS: No documents found for student ${id}`);
        student.documents = [];
      }

      // Parse JSON fields if they exist
      console.log(`🔍 Parsing JSON Fields:`);
      if (student.evaluation_data && typeof student.evaluation_data === 'string') {
        try {
          const parsed = JSON.parse(student.evaluation_data);
          console.log(`   ✅ evaluation_data: ${student.evaluation_data.length} chars → Parsed successfully`);
          console.log(`      Keys:`, Object.keys(parsed));
          student.evaluation_data = parsed;
        } catch (e) {
          console.error(`   ❌ evaluation_data: Parse error -`, e.message);
          student.evaluation_data = null;
        }
      } else {
        console.log(`   ℹ️ evaluation_data: ${student.evaluation_data ? 'Already parsed' : 'NULL'}`);
      }
      
      if (student.diagnosis_data && typeof student.diagnosis_data === 'string') {
        try {
          const parsed = JSON.parse(student.diagnosis_data);
          console.log(`   ✅ diagnosis_data: ${student.diagnosis_data.length} chars → Parsed successfully`);
          console.log(`      Keys:`, Object.keys(parsed));
          student.diagnosis_data = parsed;
        } catch (e) {
          console.error(`   ❌ diagnosis_data: Parse error -`, e.message);
          student.diagnosis_data = null;
        }
      } else {
        console.log(`   ℹ️ diagnosis_data: ${student.diagnosis_data ? 'Already parsed' : 'NULL'}`);
      }
      
      if (student.history_data && typeof student.history_data === 'string') {
        try {
          const parsed = JSON.parse(student.history_data);
          console.log(`   ✅ history_data: ${student.history_data.length} chars → Parsed successfully`);
          console.log(`      Top-level Keys:`, Object.keys(parsed));
          
          // 🔥 CHECK NESTED DATA
          if (parsed.languageSampleReportData) {
            console.log(`      ✅ languageSampleReportData exists with keys:`, Object.keys(parsed.languageSampleReportData));
          } else {
            console.log(`      ❌ languageSampleReportData MISSING`);
          }
          
          if (parsed.educationSampleReportData) {
            console.log(`      ✅ educationSampleReportData exists with keys:`, Object.keys(parsed.educationSampleReportData));
          } else {
            console.log(`      ❌ educationSampleReportData MISSING`);
          }
          
          if (parsed.healthSampleReportData) {
            console.log(`      ✅ healthSampleReportData exists with keys:`, Object.keys(parsed.healthSampleReportData));
          } else {
            console.log(`      ❌ healthSampleReportData MISSING`);
          }
          
          if (parsed.employmentSampleReportData) {
            console.log(`      ✅ employmentSampleReportData exists with keys:`, Object.keys(parsed.employmentSampleReportData));
          } else {
            console.log(`      ❌ employmentSampleReportData MISSING`);
          }
          
          student.history_data = parsed;
        } catch (e) {
          console.error(`   ❌ history_data: Parse error -`, e.message);
          student.history_data = null;
        }
      } else {
        console.log(`   ℹ️ history_data: ${student.history_data ? 'Already parsed' : 'NULL'}`);
      }

      // Cache the result (5 minutes TTL) - DISABLED FOR TESTING
      // cache.set(cacheKey, student, 5 * 60 * 1000);
      // console.log(`🗄️ CACHE STORE: Student ${id} cached for 5 minutes`);
      console.log(`🗄️ CACHE: Disabled for testing`);

      console.log(`✅ GET SUCCESS: Returning student data`);
      console.log('═'.repeat(80) + '\n');
      res.json({
        success: true,
        data: student
      });
    } catch (error) {
      console.error(`❌ GET ERROR: Failed to fetch student ${req.params.id}:`, error);
      console.error(`❌ ERROR STACK:`, error.stack);
      console.log('═'.repeat(80) + '\n');
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
        student_id: req.body.studentId || generateStudentId(req.body.firstName, req.body.lastName, req.body.dateOfBirth),
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
        language_of_testing: req.body.languageOfTesting,
        custom_language: req.body.customLanguage,
        registration_date: req.body.registrationDate || new Date().toISOString().split('T')[0],
        status: req.body.status || 'active',
        requires_assessment: req.body.requiresAssessment || false,
        requires_therapy: req.body.requiresTherapy || false,
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
        student_id: req.body.studentId,
        first_name: req.body.firstName,
        middle_name: req.body.middleName,
        last_name: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        date_of_birth: req.body.dateOfBirth,
        school_name: req.body.schoolName,
        grade: req.body.grade,
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
        language_of_testing: req.body.languageOfTesting,
        custom_language: req.body.customLanguage,
        status: req.body.status,
        registration_date: req.body.registrationDate,
        requires_assessment: req.body.requiresAssessment,
        requires_therapy: req.body.requiresTherapy,
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