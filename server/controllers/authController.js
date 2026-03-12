const User = require('../models/User');

class AuthController {
  constructor() {
    this.userModel = new User();
  }

  // Login
  async login(req, res) {
    try {
      console.log('🔐 Login attempt:', { body: req.body, headers: req.headers });
      const { email, password } = req.body;

      if (!email || !password) {
        console.log('❌ Missing credentials:', { email: !!email, password: !!password });
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user by email
      console.log('🔍 Finding user by email:', email);
      const user = await this.userModel.findByEmail(email);
      console.log('👤 User found:', { found: !!user, userId: user?.id, role: user?.role });
      
      if (!user) {
        console.log('❌ User not found for email:', email);
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Direct password comparison (no hashing as requested)
      console.log('🔑 Comparing passwords');
      if (user.password !== password) {
        console.log('❌ Password mismatch for email:', email);
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      const token = `token_${user.id}_${Date.now()}`;
      console.log('✅ Login successful for user:', { id: user.id, email: user.email, role: user.role });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          token: token
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Register
  async register(req, res) {
    try {
      const { email, password, role, first_name, last_name, phone } = req.body;

      if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({
          success: false,
          message: 'Required fields are missing'
        });
      }

      // Check if user already exists
      const existingUser = await this.userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Create new user
      const userData = {
        email,
        password, // Direct storage without hashing
        role: role || 'admin',
        first_name,
        last_name,
        phone
      };

      const userId = await this.userModel.create(userData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { userId }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = req.user; // Set by authentication middleware

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      // Check if user is a therapist and get therapist details
      let therapistData = null;
      if (user.role === 'therapist') {
        const Therapist = require('../models/Therapist');
        const therapistModel = new Therapist();
        const therapistQuery = await therapistModel.query(
          'SELECT * FROM kivi_therapists WHERE user_id = ?',
          [user.id]
        );
        if (therapistQuery.length > 0) {
          therapistData = therapistQuery[0];
        }
      }

      res.json({
        success: true,
        data: {
          ...userWithoutPassword,
          ...(therapistData && {
            specialty: therapistData.specialty,
            qualification: therapistData.qualification,
            experience_years: therapistData.experience_years,
            session_fee: therapistData.session_fee,
            bio: therapistData.bio,
            address: therapistData.address,
            emergency_contact_name: therapistData.emergency_contact_name,
            emergency_contact_phone: therapistData.emergency_contact_phone
          })
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = AuthController;