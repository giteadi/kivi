const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let dbPool = null;

const initializeDatabase = async () => {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database initialization timeout after 10 seconds')), 10000);
    });

    const initPromise = (async () => {
      // First connect without database to check if it exists
      const tempPool = mysql.createPool({
        user: 'root',
        password: 'Tiger@123',
        socketPath: '/var/run/mysqld/mysqld.sock',
        multipleStatements: true,
        connectionLimit: 1
      });

      console.log('🔄 Checking database...');

      // Check if database exists
      const dbExists = await new Promise((resolve, reject) => {
        tempPool.query('SHOW DATABASES LIKE ?', ['kivi'], (err, results) => {
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
          tempPool.query(sqlContent, (err, results) => {
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

      tempPool.end();

      // Now create pool for the specific database
      dbPool = mysql.createPool({
        user: 'root',
        password: 'Tiger@123',
        database: 'kivi',
        socketPath: '/var/run/mysqld/mysqld.sock',
        multipleStatements: true,
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0,
        connectTimeout: 60000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      });

      console.log('✅ Connected to MySQL database with connection pool');

      const tablesExist = await checkTablesExist();
      if (!tablesExist) {
        console.log('🔄 Tables missing, creating tables...');
        await createTables();
      } else {
        console.log('✅ Tables exist');
      }

      return dbPool;
    })();

    // Race between initialization and timeout
    await Promise.race([initPromise, timeoutPromise]);
    return dbPool;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
};

const checkTablesExist = async () => {
  try {
    const requiredTables = ['kivi_users', 'kivi_centres', 'kivi_therapists', 'kivi_students', 'kivi_sessions', 'kivi_encounters', 'kivi_plans', 'kivi_assessments', 'kivi_templates'];
    
    for (const table of requiredTables) {
      const result = await new Promise((resolve, reject) => {
        dbPool.query('SHOW TABLES LIKE ?', [table], (err, results) => {
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

const createTables = async () => {
  try {
    // First create the main tables
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
          dbPool.query(statement + ';', (err, results) => {
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
    
    // Now create additional tables
    try {
      console.log('🔄 Creating assessments table...');
      const assessmentsSql = fs.readFileSync(path.join(__dirname, 'config', 'create_assessments_table.sql'), 'utf8');
      await new Promise((resolve, reject) => {
        dbPool.query(assessmentsSql, (err, results) => {
          if (err) {
            console.log('Assessments table may already exist or error occurred:', err.message);
            resolve();
          } else {
            console.log('✅ Assessments table created successfully');
            resolve(results);
          }
        });
      });
    } catch (error) {
      console.log('Error creating assessments table:', error.message);
    }
    
    // Create templates table if needed
    try {
      console.log('🔄 Checking/Creating templates table...');
      const templatesCheck = await new Promise((resolve, reject) => {
        dbPool.query('SHOW TABLES LIKE ?', ['kivi_templates'], (err, results) => {
          if (err) reject(err);
          else resolve(results.length > 0);
        });
      });
      
      if (!templatesCheck) {
        const templatesSql = `
          CREATE TABLE kivi_templates (
            id INT PRIMARY KEY AUTO_INCREMENT,
            type VARCHAR(100) NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            category VARCHAR(100),
            icon VARCHAR(100),
            template_data JSON,
            formula_config JSON,
            scoring_rules JSON,
            age_range JSON,
            languages JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          );
        `;
        await new Promise((resolve, reject) => {
          dbPool.query(templatesSql, (err, results) => {
            if (err) reject(err);
            else resolve(results);
          });
        });
        console.log('✅ Templates table created successfully');
      }
    } catch (error) {
      console.log('Error creating templates table:', error.message);
    }
    
    console.log('✅ Tables and data created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

const getDb = () => {
  if (!dbPool) {
    throw new Error('Database pool not initialized');
  }
  
  return dbPool;
};

module.exports = { initializeDatabase, getDb };
