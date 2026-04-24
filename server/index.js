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
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Increase JSON payload limit to 50MB to support document uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
    app.use('/api/therapists', require('./routes/therapistRoutes')); // Re-enabled
    app.use('/api/centres', require('./routes/centreRoutes'));
    app.use('/api/programmes', require('./routes/programmeRoutes'));
    app.use('/api/reports', require('./routes/reportRoutes'));
    app.use('/api/examinees', require('./routes/examineeRoutes'));
    app.use('/api/assessments', require('./routes/assessmentRoutes')); // Added assessment routes
    app.use('/api/assessment-results', require('./routes/assessmentResultRoutes')); // Assessment item results
    app.use('/api/invoices', require('./routes/invoiceRoutes')); // Invoice email routes
    app.use('/api/assessment-packages', require('./routes/assessmentPackageRoutes')); // Assessment packages
    app.use('/api/individual-assessments', require('./routes/individualAssessmentRoutes')); // Individual assessments
    
    // Direct assessment routes (temporary fix)
    app.post('/api/assessments/:id', async (req, res) => {
      try {
        const AssessmentController = require('./controllers/assessmentController');
        const controller = new AssessmentController();
        await controller.updateAssessment(req, res);
      } catch (error) {
        console.error('Direct route error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    });
    
    // Legacy routes for backward compatibility (if needed)
    app.use('/api/appointments', require('./routes/appointmentRoutes'));
    app.use('/api/patients', require('./routes/patientRoutes'));
    app.use('/api/doctors', require('./routes/doctorRoutes'));
    app.use('/api/receptionists', require('./routes/receptionistRoutes'));
    app.use('/api/services', require('./routes/serviceRoutes'));
    
    app.use('/api/encounters', require('./routes/encounterRoutes'));
    app.use('/api/templates', require('./routes/templateRoutes'));
    app.use('/api/forms', require('./routes/formRoutes'));
    app.use('/api/coners', require('./routes/conerRoutes'));
    app.use('/api/calendar', require('./routes/calendarRoutes'));
    app.use('/api/financial', require('./routes/financialRoutes'));
    app.use('/api/contact-queries', require('./routes/contactQueryRoutes'));
    app.use('/api/center-visibility', require('./routes/centerVisibilityRoutes'));
    
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

    // Cache monitoring endpoint
    app.get('/api/cache/stats', (req, res) => {
      try {
        const cache = require('./utils/cache');
        const stats = cache.getStats();
        
        res.json({ 
          success: true, 
          message: 'Cache statistics',
          ...stats,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to get cache stats',
          error: error.message
        });
      }
    });

    // Cache cleanup endpoint
    app.post('/api/cache/cleanup', (req, res) => {
      try {
        const cache = require('./utils/cache');
        const cleaned = cache.cleanup();
        
        res.json({ 
          success: true, 
          message: `Cache cleanup completed`,
          cleanedEntries: cleaned,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to cleanup cache',
          error: error.message
        });
      }
    });

    // Cache clear endpoint
    app.post('/api/cache/clear', (req, res) => {
      try {
        const cache = require('./utils/cache');
        cache.clear();
        
        res.json({ 
          success: true, 
          message: 'Cache cleared successfully',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to clear cache',
          error: error.message
        });
      }
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