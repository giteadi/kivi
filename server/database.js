const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let dbInstance = null;

const initializeDatabase = async () => {
  try {
    // First connect without database to check if it exists
    const connection = mysql.createConnection({
      host: process.env.HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.PASSWORD || '',
      multipleStatements: true
    });

    console.log('🔄 Checking database...');

    // Check if database exists
    const dbExists = await new Promise((resolve, reject) => {
      connection.query('SHOW DATABASES LIKE ?', [process.env.DATABASE || 'kivi'], (err, results) => {
        if (err) reject(err);
        else resolve(results.length > 0);
      });
    });

    if (!dbExists) {
      console.log('🔄 Database not found, creating new database...');

      // Read and execute SQL file only if database doesn't exist
      const sqlFile = path.join(__dirname, 'config', 'new_database.sql');
      const sqlContent = fs.readFileSync(sqlFile, 'utf8');

      // Execute SQL commands
      await new Promise((resolve, reject) => {
        connection.query(sqlContent, (err, results) => {
          if (err) {
            console.error('❌ Database initialization failed:', err);
            reject(err);
          } else {
            console.log('✅ Database and tables created successfully');
            resolve(results);
          }
        });
      });
    } else {
      console.log('✅ Database already exists, skipping initialization');
    }

    connection.end();

    // Now connect to the specific database
    dbInstance = mysql.createConnection({
      host: process.env.HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.PASSWORD || '',
      database: process.env.DATABASE || 'kivi'
    });

    await new Promise((resolve, reject) => {
      dbInstance.connect((err) => {
        if (err) {
          console.error('❌ Database connection failed:', err);
          reject(err);
        } else {
          console.log('✅ Connected to MySQL database');
          resolve();
        }
      });
    });

    return dbInstance;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
};

const getDb = () => {
  if (!dbInstance) {
    throw new Error('Database not initialized');
  }
  return dbInstance;
};

module.exports = { initializeDatabase, getDb };
