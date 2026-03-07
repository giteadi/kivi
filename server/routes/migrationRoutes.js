const express = require('express');
const { getDb } = require('../database');
const router = express.Router();

// Run migration and check database
router.post('/run-migration', async (req, res) => {
  try {
    const db = getDb();
    
    // Check and add missing columns to kivi_therapists table
    const checkAndAddColumn = async (tableName, columnName, columnDefinition) => {
      try {
        // Check if column exists
        const [columns] = await new Promise((resolve, reject) => {
          db.query(`SHOW COLUMNS FROM ${tableName} LIKE '${columnName}'`, (err, results) => {
            if (err) reject(err);
            else resolve(results);
          });
        });
        
        // If column doesn't exist, add it
        if (columns.length === 0) {
          await new Promise((resolve, reject) => {
            db.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`, (err, results) => {
              if (err) reject(err);
              else resolve(results);
            });
          });
          console.log(`✅ Added column ${columnName} to ${tableName}`);
        } else {
          console.log(`ℹ️  Column ${columnName} already exists in ${tableName}`);
        }
      } catch (error) {
        console.error(`❌ Error with column ${columnName}:`, error.message);
      }
    };
    
    // Add missing columns
    await checkAndAddColumn('kivi_therapists', 'session_duration', 'INT DEFAULT 30');
    await checkAndAddColumn('kivi_therapists', 'login_time', "TIME DEFAULT '09:00:00'");
    await checkAndAddColumn('kivi_therapists', 'logout_time', "TIME DEFAULT '18:00:00'");
    await checkAndAddColumn('kivi_therapists', 'is_available', 'BOOLEAN DEFAULT TRUE');
    await checkAndAddColumn('kivi_therapists', 'last_availability_update', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    
    await checkAndAddColumn('kivi_users', 'profile_image', 'LONGTEXT');
    await checkAndAddColumn('kivi_users', 'last_login', 'TIMESTAMP NULL');
    
    // Check therapist data
    const [therapistCount] = await new Promise((resolve, reject) => {
      db.query('SELECT COUNT(*) as total FROM kivi_therapists', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    // Check sample therapist data (Dr. Katre - ID: 4)
    const [drKatre] = await new Promise((resolve, reject) => {
      db.query(`
        SELECT 
          t.*,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          u.role,
          c.name as centre_name
        FROM kivi_therapists t 
        JOIN kivi_users u ON t.user_id = u.id 
        LEFT JOIN kivi_centres c ON t.centre_id = c.id 
        WHERE t.id = 4
      `, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    // Get table structure
    const structure = await new Promise((resolve, reject) => {
      db.query('DESCRIBE kivi_therapists', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    res.json({
      success: true,
      message: 'Migration completed successfully',
      data: {
        therapistCount: therapistCount.total,
        drKatreData: drKatre ? {
          id: drKatre.id,
          name: `${drKatre.first_name} ${drKatre.last_name}`,
          email: drKatre.email,
          phone: drKatre.phone,
          role: drKatre.role,
          specialty: drKatre.specialty,
          qualification: drKatre.qualification,
          session_fee: drKatre.session_fee,
          experience_years: drKatre.experience_years,
          status: drKatre.status,
          is_available: drKatre.is_available,
          login_time: drKatre.login_time,
          logout_time: drKatre.logout_time,
          centre_name: drKatre.centre_name,
          address: drKatre.address,
          emergency_contact_name: drKatre.emergency_contact_name,
          emergency_contact_phone: drKatre.emergency_contact_phone,
          created_at: drKatre.created_at,
          updated_at: drKatre.updated_at
        } : null,
        tableStructure: structure.map(col => ({
          field: col.Field,
          type: col.Type,
          null: col.Null,
          key: col.Key,
          default: col.Default
        }))
      }
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error.message
    });
  }
});

// Test data integrity
router.get('/test-data', async (req, res) => {
  try {
    const db = getDb();
    
    // Test if frontend data matches backend
    const testResults = await new Promise((resolve, reject) => {
      db.query(`
        SELECT 
          t.id,
          t.user_id,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          u.role,
          t.specialty,
          t.qualification,
          t.session_fee,
          t.experience_years,
          t.status,
          t.is_available,
          t.login_time,
          t.logout_time,
          t.address,
          t.city,
          t.state,
          t.emergency_contact_name,
          t.emergency_contact_phone,
          c.name as centre_name,
          t.created_at,
          t.updated_at
        FROM kivi_therapists t 
        JOIN kivi_users u ON t.user_id = u.id 
        LEFT JOIN kivi_centres c ON t.centre_id = c.id 
        ORDER BY t.id
      `, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    // Check for data integrity issues
    const issues = [];
    testResults.forEach(therapist => {
      if (!therapist.session_fee || therapist.session_fee === '0.00') {
        issues.push(`Therapist ${therapist.id}: Missing session fee`);
      }
      if (!therapist.address) {
        issues.push(`Therapist ${therapist.id}: Missing address`);
      }
      if (!therapist.emergency_contact_name) {
        issues.push(`Therapist ${therapist.id}: Missing emergency contact`);
      }
      if (!therapist.is_available) {
        issues.push(`Therapist ${therapist.id}: Not marked as available`);
      }
    });
    
    res.json({
      success: true,
      data: {
        totalTherapists: testResults.length,
        therapists: testResults,
        issues: issues,
        dataIntegrity: issues.length === 0 ? 'GOOD' : 'NEEDS ATTENTION'
      }
    });
    
  } catch (error) {
    console.error('Test data error:', error);
    res.status(500).json({
      success: false,
      message: 'Data test failed',
      error: error.message
    });
  }
});

// Create or update therapist password
router.post('/create-therapist-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const db = getDb();
    
    // Update the user's password (plain text for now)
    const result = await new Promise((resolve, reject) => {
      db.query(
        'UPDATE kivi_users SET password = ? WHERE email = ?',
        [password, email],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Also update user role to 'therapist' if not already set
    await new Promise((resolve, reject) => {
      db.query(
        'UPDATE kivi_users SET role = ? WHERE email = ?',
        ['therapist', email],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    
    res.json({
      success: true,
      message: 'Password updated successfully',
      data: {
        email: email,
        password: password,
        role: 'therapist'
      }
    });
    
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({
      success: false,
      message: 'Password update failed',
      error: error.message
    });
  }
});

// Add missing therapist columns
router.post('/add-missing-columns', async (req, res) => {
  try {
    const db = getDb();
    
    // Check and add missing columns to kivi_therapists table
    const checkAndAddColumn = async (tableName, columnName, columnDefinition) => {
      try {
        // Check if column exists
        const [columns] = await new Promise((resolve, reject) => {
          db.query(`SHOW COLUMNS FROM ${tableName} LIKE '${columnName}'`, (err, results) => {
            if (err) reject(err);
            else resolve(results);
          });
        });
        
        // If column doesn't exist, add it
        if (!columns || columns.length === 0) {
          await new Promise((resolve, reject) => {
            db.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`, (err, results) => {
              if (err) reject(err);
              else resolve(results);
            });
          });
          console.log(`✅ Added column ${columnName} to ${tableName}`);
          return true;
        } else {
          console.log(`ℹ️  Column ${columnName} already exists in ${tableName}`);
          return false;
        }
      } catch (error) {
        console.error(`❌ Error with column ${columnName}:`, error.message);
        return false;
      }
    };
    
    // Add missing columns for therapists
    const therapistColumns = [
      // Already exists: date_of_birth DATE
      // Already exists: languages JSON
      // Already exists: certifications JSON
      // Already exists: centre_id (Primary Clinic)
      // Already exists: joining_date DATE
      // Already exists: status ENUM
      // Already exists: is_available BOOLEAN
    ];
    
    // Check for any additional columns that might be missing
    const additionalColumns = [
      ['relation', 'VARCHAR(50)'], // Emergency contact relation
      ['primary_clinic_id', 'INT'], // Explicit primary clinic
      ['professional_certifications', 'TEXT'], // Text field for certs
      ['spoken_languages', 'TEXT'], // Text field for languages
      ['date_of_birth_text', 'VARCHAR(20)'], // DOB in text format
      ['availability_status', 'ENUM("available", "unavailable", "busy") DEFAULT "available"']
    ];
    
    let addedCount = 0;
    for (const [columnName, columnDefinition] of additionalColumns) {
      const added = await checkAndAddColumn('kivi_therapists', columnName, columnDefinition);
      if (added) addedCount++;
    }
    
    // Check and add columns to kivi_users table if needed
    const userColumns = [
      ['date_of_birth', 'DATE'],
      ['relation', 'VARCHAR(50)']
    ];
    
    for (const [columnName, columnDefinition] of userColumns) {
      const added = await checkAndAddColumn('kivi_users', columnName, columnDefinition);
      if (added) addedCount++;
    }
    
    // Get current table structure
    const therapistStructure = await new Promise((resolve, reject) => {
      db.query('DESCRIBE kivi_therapists', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    const userStructure = await new Promise((resolve, reject) => {
      db.query('DESCRIBE kivi_users', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    res.json({
      success: true,
      message: `Added ${addedCount} missing columns successfully`,
      data: {
        columnsAdded: addedCount,
        therapistTable: therapistStructure.map(col => ({
          field: col.Field,
          type: col.Type,
          null: col.Null,
          key: col.Key,
          default: col.Default
        })),
        userTable: userStructure.map(col => ({
          field: col.Field,
          type: col.Type,
          null: col.Null,
          key: col.Key,
          default: col.Default
        }))
      }
    });
    
  } catch (error) {
    console.error('Add columns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add columns',
      error: error.message
    });
  }
});

module.exports = router;
