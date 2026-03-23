const Patient = require('../models/Patient');

class PatientController {
  constructor() {
    this.patientModel = new Patient(); // Use Patient model which now maps to students table
  }

  // Get all patients
  async getPatients(req, res) {
    try {
      console.log('Fetching patients with filters:', req.query);
      const filters = req.query;
      const patients = await this.patientModel.getPatients(filters);
      console.log(`Found ${patients.length} patients`);

      res.json({
        success: true,
        data: patients
      });
    } catch (error) {
      console.error('Get patients error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Database error'
      });
    }
  }

  // Get single patient
  async getPatient(req, res) {
    try {
      const { id } = req.params;
      const patient = await this.patientModel.getPatientWithAppointments(id);

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      res.json({
        success: true,
        data: patient
      });
    } catch (error) {
      console.error('Get patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create patient
  async createPatient(req, res) {
    try {
      // 📋 COMPREHENSIVE REQUEST TRACING FOR CREATE
      console.log('\n' + '═'.repeat(80));
      console.log('🆕 CREATE PATIENT - COMPLETE REQUEST TRACE');
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
      
      const patientData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };

      const patientId = await this.patientModel.create(patientData);

      res.status(201).json({
        success: true,
        data: { id: patientId },
        message: 'Patient created successfully'
      });
    } catch (error) {
      console.error('Create patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update patient
  async updatePatient(req, res) {
    try {
      const { id } = req.params;
      
      // 📋 TRACE ALL INCOMING DATA
      console.log('\n' + '═'.repeat(80));
      console.log('🔄 UPDATE PATIENT - FULL REQUEST TRACE');
      console.log('═'.repeat(80));
      console.log(`📌 Patient ID: ${id}`);
      console.log(`📦 Request Method: ${req.method}`);
      console.log(`🌐 Request URL: ${req.originalUrl}`);
      console.log(`📨 Content-Type: ${req.headers['content-type']}`);
      
      // ALL FIELDS RECEIVED
      console.log('\n📤 ALL FIELDS FROM FRONTEND:');
      console.log(`   Total Fields Received: ${Object.keys(req.body).length}`);
      console.log(`   Fields List: ${Object.keys(req.body).join(', ')}`);
      
      // FIELD BY FIELD DETAILS
      console.log('\n📝 FIELD-BY-FIELD BREAKDOWN:');
      Object.keys(req.body).forEach(key => {
        const value = req.body[key];
        const type = Array.isArray(value) ? `Array[${value.length}]` : typeof value;
        const preview = type === 'object' ? '{...}' : (String(value).length > 50 ? String(value).substring(0, 50) + '...' : value);
        console.log(`   ✓ ${key}: ${preview} (${type})`);
      });
      
      // SPECIAL HANDLING FOR DOCUMENTS
      if (req.body.documents) {
        console.log('\n📎 DOCUMENTS ANALYSIS:');
        console.log(`   Documents Count: ${req.body.documents.length}`);
        if (Array.isArray(req.body.documents)) {
          req.body.documents.forEach((doc, idx) => {
            console.log(`   [${idx}] Name: ${doc.name}, Type: ${doc.type}, Size: ${doc.size} bytes`);
          });
        }
      } else {
        console.log('\n📎 DOCUMENTS: None provided');
      }
      
      // RAW JSON DUMP
      console.log('\n📋 RAW REQUEST BODY JSON:');
      try {
        const bodyStr = JSON.stringify(req.body, null, 2);
        console.log(bodyStr.substring(0, 2000) + (bodyStr.length > 2000 ? '\n... [truncated]' : ''));
      } catch (e) {
        console.log('   [Could not stringify body]');
      }
      console.log('═'.repeat(80) + '\n');
      
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      // Handle documents if provided
      if (updateData.documents && Array.isArray(updateData.documents)) {
        updateData.documents = JSON.stringify(updateData.documents);
      }

      const updated = await this.patientModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      res.json({
        success: true,
        message: 'Patient updated successfully'
      });
    } catch (error) {
      console.error('Update patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete patient
  async deletePatient(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.patientModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      res.json({
        success: true,
        message: 'Patient deleted successfully'
      });
    } catch (error) {
      console.error('Delete patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = PatientController;