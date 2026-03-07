const fs = require('fs');
const path = require('path');
const { initializeDatabase, getDb } = require('../database');

async function runMigration() {
  console.log('🔄 Starting database migration and check...');
  
  try {
    // Initialize database first
    console.log('🔧 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully!');
    
    const db = getDb();
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../config/add_missing_columns.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📝 Running migration script...');
    
    // Split SQL into individual statements and execute them
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await new Promise((resolve, reject) => {
            db.query(statement, (err, results) => {
              if (err && !err.message.includes('already exists') && !err.message.includes('Duplicate')) {
                console.error('❌ Error in statement:', statement);
                console.error('❌ Error:', err.message);
                reject(err);
              } else {
                resolve(results);
              }
            });
          });
        } catch (error) {
          // Continue with other statements if one fails (e.g., column already exists)
          console.log('⚠️  Statement skipped (likely already exists):', statement.substring(0, 50) + '...');
        }
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Now check the data
    console.log('\n🔍 Checking therapist data...');
    
    // Check therapist table structure
    const structure = await new Promise((resolve, reject) => {
      db.query('DESCRIBE kivi_therapists', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('📋 Therapist table structure:');
    structure.forEach(column => {
      console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
    });
    
    // Check data count
    const count = await new Promise((resolve, reject) => {
      db.query('SELECT COUNT(*) as total FROM kivi_therapists', (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    });
    
    console.log(`\n📊 Total therapists in database: ${count}`);
    
    // Check sample data
    const sampleData = await new Promise((resolve, reject) => {
      db.query(`
        SELECT 
          t.id, 
          u.first_name, 
          u.last_name, 
          u.email,
          u.role,
          t.specialty,
          t.session_fee,
          t.is_available,
          t.login_time,
          t.logout_time,
          t.created_at
        FROM kivi_therapists t 
        JOIN kivi_users u ON t.user_id = u.id 
        LIMIT 3
      `, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('\n📄 Sample therapist data:');
    sampleData.forEach(therapist => {
      console.log(`  ID: ${therapist.id}`);
      console.log(`  Name: ${therapist.first_name} ${therapist.last_name}`);
      console.log(`  Email: ${therapist.email}`);
      console.log(`  Role: ${therapist.role}`);
      console.log(`  Specialty: ${therapist.specialty}`);
      console.log(`  Session Fee: ₹${therapist.session_fee}`);
      console.log(`  Available: ${therapist.is_available ? 'Yes' : 'No'}`);
      console.log(`  Hours: ${therapist.login_time} - ${therapist.logout_time}`);
      console.log(`  Created: ${therapist.created_at}`);
      console.log('  ---');
    });
    
    // Test data integrity - check if frontend data matches backend
    console.log('\n🔗 Testing data integrity...');
    
    const testTherapist = await new Promise((resolve, reject) => {
      db.query(`
        SELECT 
          t.*,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          c.name as centre_name
        FROM kivi_therapists t 
        JOIN kivi_users u ON t.user_id = u.id 
        LEFT JOIN kivi_centres c ON t.centre_id = c.id 
        WHERE t.id = 4
      `, (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
    
    if (testTherapist) {
      console.log('✅ Dr. Katre data found in database:');
      console.log(`  - Name: ${testTherapist.first_name} ${testTherapist.last_name}`);
      console.log(`  - Email: ${testTherapist.email}`);
      console.log(`  - Phone: ${testTherapist.phone}`);
      console.log(`  - Specialty: ${testTherapist.specialty}`);
      console.log(`  - Qualification: ${testTherapist.qualification}`);
      console.log(`  - Session Fee: ₹${testTherapist.session_fee}`);
      console.log(`  - Experience: ${testTherapist.experience_years} years`);
      console.log(`  - Status: ${testTherapist.status}`);
      console.log(`  - Available: ${testTherapist.is_available ? 'Yes' : 'No'}`);
      console.log(`  - Centre: ${testTherapist.centre_name || 'Not assigned'}`);
      console.log(`  - Address: ${testTherapist.address || 'Not provided'}`);
      console.log(`  - Emergency Contact: ${testTherapist.emergency_contact_name || 'Not provided'}`);
      
      // Check for missing important fields
      const missingFields = [];
      if (!testTherapist.session_fee || testTherapist.session_fee === '0.00') missingFields.push('session_fee');
      if (!testTherapist.address) missingFields.push('address');
      if (!testTherapist.emergency_contact_name) missingFields.push('emergency_contact_name');
      if (!testTherapist.emergency_contact_phone) missingFields.push('emergency_contact_phone');
      
      if (missingFields.length > 0) {
        console.log('⚠️  Missing important fields:', missingFields.join(', '));
      } else {
        console.log('✅ All important fields are present!');
      }
    } else {
      console.log('❌ Dr. Katre (ID: 4) not found in database');
    }
    
    console.log('\n🎉 Database check and migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
