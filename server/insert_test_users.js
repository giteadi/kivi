const mysql = require('mysql2');
require('dotenv').config();

// Create database connection
const db = mysql.createConnection({
  host: process.env.HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.PASSWORD || '',
  database: process.env.DATABASE || 'kivi'
});

console.log('🔄 Inserting test users into database...');

// Test users to insert
const testUsers = [
  {
    email: 'admin@mindsaidlearning.com',
    password: 'admin123',
    role: 'admin',
    first_name: 'Admin',
    last_name: 'User',
    phone: '+1-555-0001'
  },
  {
    email: 'dr.sarah.johnson@mindsaidlearning.com',
    password: 'therapist123',
    role: 'therapist',
    first_name: 'Sarah',
    last_name: 'Johnson',
    phone: '+1-555-0101'
  },
  {
    email: 'parent.john.smith@gmail.com',
    password: 'parent123',
    role: 'parent',
    first_name: 'John',
    last_name: 'Smith',
    phone: '+1-555-0301'
  }
];

async function insertTestUsers() {
  try {
    for (const user of testUsers) {
      const query = `
        INSERT INTO users (email, password, role, first_name, last_name, phone, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, NOW())
        ON DUPLICATE KEY UPDATE
        password = VALUES(password),
        role = VALUES(role),
        first_name = VALUES(first_name),
        last_name = VALUES(last_name),
        phone = VALUES(phone)
      `;

      await new Promise((resolve, reject) => {
        db.query(query, [user.email, user.password, user.role, user.first_name, user.last_name, user.phone], (err, result) => {
          if (err) {
            console.error(`❌ Error inserting user ${user.email}:`, err);
            reject(err);
          } else {
            console.log(`✅ Inserted/Updated user: ${user.email}`);
            resolve(result);
          }
        });
      });
    }

    console.log('🎉 All test users inserted successfully!');
    console.log('\n📋 Test login credentials:');
    console.log('Admin: admin@mindsaidlearning.com / admin123');
    console.log('Therapist: dr.sarah.johnson@mindsaidlearning.com / therapist123');
    console.log('Parent: parent.john.smith@gmail.com / parent123');

  } catch (error) {
    console.error('❌ Failed to insert test users:', error);
  } finally {
    db.end();
  }
}

insertTestUsers();
