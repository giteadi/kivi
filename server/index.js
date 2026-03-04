const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Database
const initializeDatabase = async () => {
  try {
    // First connect without database to create it
    const connection = mysql.createConnection({
      host: process.env.HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.PASSWORD || '',
      multipleStatements: true
    });

    console.log('🔄 Initializing database...');

    // Read and execute SQL file
    const sqlFile = path.join(__dirname, 'config', 'database.sql');
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

    connection.end();

    // Now connect to the specific database
    const db = mysql.createConnection({
      host: process.env.HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.PASSWORD || '',
      database: process.env.DATABASE || 'kivi'
    });

    db.connect((err) => {
      if (err) {
        console.error('❌ Database connection failed:', err);
        return;
      }
      console.log('✅ Connected to MySQL database');
    });

    // Make db available globally
    global.db = db;
    return db;

  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
};

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    
    // Routes (after database initialization)
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/dashboard', require('./routes/dashboardRoutes'));
    app.use('/api/appointments', require('./routes/appointmentRoutes'));
    app.use('/api/patients', require('./routes/patientRoutes'));
    app.use('/api/doctors', require('./routes/doctorRoutes'));
    app.use('/api/receptionists', require('./routes/receptionistRoutes'));
    app.use('/api/clinics', require('./routes/clinicRoutes'));
    app.use('/api/services', require('./routes/serviceRoutes'));
    app.use('/api/encounters', require('./routes/encounterRoutes'));
    app.use('/api/templates', require('./routes/templateRoutes'));
    app.use('/api/financial', require('./routes/financialRoutes'));

    // Test endpoint
    app.get('/api/test', (req, res) => {
      res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
      });
    });

    // Database test endpoint
    app.get('/api/test/db', async (req, res) => {
      try {
        const result = await new Promise((resolve, reject) => {
          global.db.query('SELECT 1 as test', (err, results) => {
            if (err) reject(err);
            else resolve(results);
          });
        });
        res.json({ 
          success: true, 
          message: 'Database connection working',
          result: result[0]
        });
      } catch (error) {
        res.status(500).json({ 
          success: false, 
          message: 'Database connection failed',
          error: error.message
        });
      }
    });

    // Error handling middleware (must be after routes)
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
      });
    });

    // 404 handler (must be last)
    app.use((req, res) => {
      res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
      });
    });

    const PORT = process.env.PORT || 3005;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard/data`);
      console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();