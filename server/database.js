const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let dbInstance = null;

const initializeDatabase = async () => {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database initialization timeout after 10 seconds')), 10000);
    });

    const initPromise = (async () => {
      // First connect without database to check if it exists
      const connection = mysql.createConnection({
        user: 'root',
        password: 'Tiger@123',
        socketPath: '/var/run/mysqld/mysqld.sock',
        multipleStatements: true
      });

      console.log('🔄 Checking database...');

      // Check if database exists
      const dbExists = await new Promise((resolve, reject) => {
        connection.query('SHOW DATABASES LIKE ?', ['kivi'], (err, results) => {
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
        console.log('✅ Database exists, checking tables...');
      }

      connection.end();

      // Now connect to the specific database
      dbInstance = mysql.createConnection({
        user: 'root',
        password: 'Tiger@123',
        database: 'kivi',
        socketPath: '/var/run/mysqld/mysqld.sock',
        multipleStatements: true
      });

      console.log('✅ Connected to MySQL database');

      const tablesExist = await checkTablesExist(dbInstance);
      if (!tablesExist) {
        console.log('🔄 Tables missing, creating tables...');
        await createTables(dbInstance);
      } else {
        console.log('✅ Tables exist');
      }

      return dbInstance;
    })();

    // Race between initialization and timeout
    await Promise.race([initPromise, timeoutPromise]);
    return dbInstance;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
};

const checkTablesExist = async (db) => {
  try {
    const requiredTables = ['kivi_users', 'kivi_centres', 'kivi_therapists', 'kivi_students', 'kivi_sessions', 'kivi_encounters', 'kivi_plans'];
    
    for (const table of requiredTables) {
      const result = await new Promise((resolve, reject) => {
        db.query('SHOW TABLES LIKE ?', [table], (err, results) => {
          if (err) reject(err);
          else resolve(results.length > 0);
        });
      });
      
      if (!result) {
        console.log(`❌ Table ${table} missing`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error checking tables:', error);
    return false;
  }
};

const createTables = async (db) => {
  try {
    const sqlFile = path.join(__dirname, 'config', 'new_database.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split by semicolon to get individual statements
    const statements = sqlContent.split(';').map(stmt => stmt.trim()).filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      // Skip database creation/drop statements
      if (statement.toUpperCase().includes('DROP DATABASE') || 
          statement.toUpperCase().includes('CREATE DATABASE') ||
          statement.toUpperCase().includes('USE ')) {
        continue;
      }
      
      if (statement.trim()) {
        await new Promise((resolve, reject) => {
          db.query(statement + ';', (err, results) => {
            if (err) {
              // Ignore table already exists errors
              if (err.code === 'ER_TABLE_EXISTS_ERROR') {
                console.log('Table already exists, skipping...');
                resolve();
              } else {
                reject(err);
              }
            } else {
              resolve(results);
            }
          });
        });
      }
    }
    
    console.log('✅ Tables and data created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

const getDb = () => {
  if (!dbInstance) {
    throw new Error('Database not initialized');
  }
  return dbInstance;
};

module.exports = { initializeDatabase, getDb };
