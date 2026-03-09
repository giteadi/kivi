const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.PASSWORD || '',
  database: process.env.DATABASE || 'kivi'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to database');

  // Query all therapists data
  connection.query(`
    SELECT t.id, u.first_name, u.last_name, t.is_available, t.login_time, t.logout_time, t.specialty
    FROM kivi_therapists t
    JOIN kivi_users u ON t.user_id = u.id
    LIMIT 10
  `, (err, results) => {
    if (err) {
      console.error('Query error:', err);
    } else {
      console.log('All therapists data:', JSON.stringify(results, null, 2));
    }
    connection.end();
  });
});
