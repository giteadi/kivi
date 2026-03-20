const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initializeDatabase, getDb } = require('./database');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://127.0.0.1:5173', 
    'http://127.0.0.1:3000',
    'https://dashboard.iplanbymsl.in'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    headers: { 'content-type': req.headers['content-type'], authorization: req.headers.authorization ? '***' : undefined }
  });
  next();
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Wait for database initialization
    await initializeDatabase();
    
    // Routes (after database initialization)
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/dashboard', require('./routes/dashboardRoutes'));
    app.use('/api/payment', require('./routes/paymentRoutes'));
    app.use('/api/user', require('./routes/userRoutes'));
    app.use('/api/plans', require('./routes/planRoutes'));
    app.use('/api/booking', require('./routes/bookingRoutes'));
    
    // New routes with updated naming
    app.use('/api/sessions', require('./routes/sessionRoutes'));
    app.use('/api/students', require('./routes/studentRoutes'));
    // app.use('/api/therapists', require('./routes/therapistRoutes')); // Temporarily disabled
    app.use('/api/centres', require('./routes/centreRoutes'));
    app.use('/api/programmes', require('./routes/programmeRoutes'));
    
    // Legacy routes for backward compatibility (if needed)
    app.use('/api/appointments', require('./routes/appointmentRoutes'));
    app.use('/api/patients', require('./routes/patientRoutes'));
    app.use('/api/doctors', require('./routes/doctorRoutes'));
    app.use('/api/receptionists', require('./routes/receptionistRoutes'));
    app.use('/api/clinics', require('./routes/clinicRoutes'));
    app.use('/api/services', require('./routes/serviceRoutes'));
    
    app.use('/api/encounters', require('./routes/encounterRoutes'));
    app.use('/api/templates', require('./routes/templateRoutes'));
    app.use('/api/financial', require('./routes/financialRoutes'));
    
    // Migration routes (for database maintenance)
    app.use('/api/migration', require('./routes/migrationRoutes'));

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
        const db = getDb();
        const result = await new Promise((resolve, reject) => {
          db.query('SELECT 1 as test', (err, results) => {
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