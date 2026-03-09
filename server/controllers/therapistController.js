const Therapist = require('../models/Therapist');

class TherapistController {
  constructor() {
    // Don't instantiate model here to avoid database issues during module loading
  }

  // Lazy getter for therapist model
  get therapistModel() {
    if (!this._therapistModel) {
      this._therapistModel = new Therapist();
    }
    return this._therapistModel;
  }

  // Get all therapists
  async getTherapists(req, res) {
    try {
      const filters = req.query;
      const therapists = await this.therapistModel.getTherapists(filters);

      res.json({
        success: true,
        data: therapists
      });
    } catch (error) {
      console.error('Get therapists error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single therapist
  async getTherapist(req, res) {
    try {
      const { id } = req.params;
      const therapist = await this.therapistModel.getTherapistWithStats(id);

      if (!therapist) {
        return res.status(404).json({
          success: false,
          message: 'Therapist not found'
        });
      }

      res.json({
        success: true,
        data: therapist
      });
    } catch (error) {
      console.error('Get therapist error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create therapist
  async createTherapist(req, res) {
    try {
      const therapistData = req.body;

      // Check if user_id is provided, if not create a new user
      let userId = therapistData.user_id;
      if (!userId) {
        // Create user first
        const User = require('../models/User');
        const userModel = new User();

        const userData = {
          email: therapistData.email,
          password: therapistData.password || 'therapist123', // Use provided password or default
          role: 'therapist',
          first_name: therapistData.first_name,
          last_name: therapistData.last_name,
          phone: therapistData.phone,
          is_active: true
        };

        userId = await userModel.create(userData);
      }

      // Prepare therapist data
      const finalTherapistData = {
        user_id: userId,
        centre_id: therapistData.centre_id || 1,
        employee_id: therapistData.employee_id || `TH${Date.now()}`,
        specialty: therapistData.specialty,
        qualification: therapistData.qualification,
        license_number: therapistData.license_number,
        experience_years: therapistData.experience_years || 0,
        session_fee: therapistData.session_fee || 0,
        bio: therapistData.bio,
        date_of_birth: therapistData.date_of_birth,
        gender: therapistData.gender,
        address: therapistData.address,
        city: therapistData.city,
        state: therapistData.state,
        zip_code: therapistData.zip_code,
        emergency_contact_name: therapistData.emergency_contact_name,
        emergency_contact_phone: therapistData.emergency_contact_phone,
        joining_date: therapistData.joining_date,
        status: therapistData.status || 'active',
        created_at: new Date(),
        updated_at: new Date()
      };

      const therapistId = await this.therapistModel.create(finalTherapistData);

      res.status(201).json({
        success: true,
        data: { id: therapistId },
        message: 'Therapist created successfully'
      });
    } catch (error) {
      console.error('Create therapist error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update therapist
  async updateTherapist(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      // Separate user data and therapist data
      const userData = {};
      const therapistData = {};

      // Fields that go to kivi_users table
      if (updateData.first_name !== undefined) userData.first_name = updateData.first_name;
      if (updateData.last_name !== undefined) userData.last_name = updateData.last_name;
      if (updateData.email !== undefined) userData.email = updateData.email;
      if (updateData.phone !== undefined) userData.phone = updateData.phone;
      if (updateData.password !== undefined) userData.password = updateData.password;
      if (updateData.date_of_birth !== undefined) {
        // Format date properly - handle both ISO strings and date objects
        if (updateData.date_of_birth) {
          const date = new Date(updateData.date_of_birth);
          userData.date_of_birth = date.toISOString().split('T')[0];
        } else {
          userData.date_of_birth = null;
        }
      }
      if (updateData.relation !== undefined) userData.relation = updateData.relation;

      // Fields that go to kivi_therapists table
      const therapistFields = [
        'specialty', 'qualification', 'license_number', 'experience_years', 
        'session_fee', 'bio', 'date_of_birth', 'date_of_birth_text', 'gender', 'address', 'city', 
        'state', 'zip_code', 'emergency_contact_name', 'emergency_contact_phone',
        'joining_date', 'status', 'centre_id', 'languages', 'certifications', 
        'professional_certifications', 'spoken_languages', 'relation', 
        'primary_clinic_id', 'availability_status', 'session_duration', 
        'login_time', 'logout_time', 'is_available'
      ];

      therapistFields.forEach(field => {
        if (updateData[field] !== undefined) {
          // Handle date fields specifically
          if (field === 'date_of_birth' || field === 'joining_date') {
            if (updateData[field]) {
              const date = new Date(updateData[field]);
              therapistData[field] = date.toISOString().split('T')[0];
            } else {
              therapistData[field] = null;
            }
          } else if (Array.isArray(updateData[field])) {
            // Convert arrays to JSON strings for JSON fields
            therapistData[field] = JSON.stringify(updateData[field]);
          } else {
            therapistData[field] = updateData[field];
          }
        }
      });

      therapistData.updated_at = new Date();

      // Get therapist to find user_id
      const therapist = await this.therapistModel.findById(id);
      if (!therapist) {
        return res.status(404).json({
          success: false,
          message: 'Therapist not found'
        });
      }

      // Update user table if there's user data
      if (Object.keys(userData).length > 0) {
        const User = require('../models/User');
        const userModel = new User();
        
        await userModel.update(therapist.user_id, userData);
      }

      // Update therapist table
      const updated = await this.therapistModel.update(id, therapistData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Therapist not found'
        });
      }

      res.json({
        success: true,
        message: 'Therapist updated successfully'
      });
    } catch (error) {
      console.error('Update therapist error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete therapist
  async deleteTherapist(req, res) {
    try {
      const { id } = req.params;

      const deleted = await this.therapistModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Therapist not found'
        });
      }

      res.json({
        success: true,
        message: 'Therapist deleted successfully'
      });
    } catch (error) {
      console.error('Delete therapist error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get therapist availability
  async getTherapistAvailability(req, res) {
    try {
      const { id } = req.params;
      const availability = await this.therapistModel.getTherapistAvailability(id);

      res.json({
        success: true,
        data: availability
      });
    } catch (error) {
      console.error('Get therapist availability error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update therapist availability
  async updateTherapistAvailability(req, res) {
    try {
      const { id } = req.params;
      const therapistModel = new Therapist();

      // Only allow therapist to update their own availability or admin to update any
      if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to update this therapist availability'
        });
      }

      const updateData = {
        login_time: req.body.login_time,
        logout_time: req.body.logout_time,
        is_available: req.body.is_available,
        last_availability_update: new Date()
      };

      const updated = await therapistModel.updateAvailability(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Therapist not found'
        });
      }

      res.json({
        success: true,
        message: 'Therapist availability updated successfully'
      });
    } catch (error) {
      console.error('Update therapist availability error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get current user's therapist availability (for therapist dashboard)
  async getMyAvailability(req, res) {
    try {
      // Find therapist record for current user
      const therapistQuery = await this.therapistModel.query(
        'SELECT id FROM kivi_therapists WHERE user_id = ?',
        [req.user.id]
      );

      if (therapistQuery.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Therapist profile not found'
        });
      }

      const therapistId = therapistQuery[0].id;
      const availability = await this.therapistModel.getTherapistAvailability(therapistId);

      res.json({
        success: true,
        data: availability
      });
    } catch (error) {
      console.error('Get my availability error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get current user's therapist sessions
  async getMySessions(req, res) {
    try {
      // Find therapist record for current user
      const therapistQuery = await this.therapistModel.query(
        'SELECT id FROM kivi_therapists WHERE user_id = ?',
        [req.user.id]
      );

      if (therapistQuery.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Therapist profile not found'
        });
      }

      const therapistId = therapistQuery[0].id;

      // Get sessions for this therapist with student and programme details
      const sessions = await this.therapistModel.query(`
        SELECT
          s.id,
          s.session_id,
          s.session_date,
          s.session_time,
          s.duration,
          s.status,
          s.notes,
          s.session_type,
          s.created_at,
          -- Student details
          st.student_id,
          st.first_name as student_first_name,
          st.last_name as student_last_name,
          st.email as student_email,
          st.phone as student_phone,
          st.age,
          st.gender,
          -- Programme details
          p.name as programme_name,
          p.fee as programme_fee,
          -- Centre details
          c.name as centre_name
        FROM kivi_sessions s
        LEFT JOIN kivi_students st ON s.student_id = st.id
        LEFT JOIN kivi_programmes p ON s.programme_id = p.id
        LEFT JOIN kivi_centres c ON s.centre_id = c.id
        WHERE s.therapist_id = ?
        ORDER BY s.session_date DESC, s.session_time DESC
      `, [therapistId]);

      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('Get my sessions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update current user's therapist profile
  async updateMyProfile(req, res) {
    try {
      const userId = req.user.id;

      // Find therapist record for current user
      const therapistQuery = await this.therapistModel.query(
        'SELECT id FROM kivi_therapists WHERE user_id = ?',
        [userId]
      );

      if (therapistQuery.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Therapist profile not found'
        });
      }

      const therapistId = therapistQuery[0].id;

      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      // Separate user data and therapist data
      const userData = {};
      const therapistData = {};

      // Fields that go to kivi_users table
      if (updateData.first_name !== undefined) userData.first_name = updateData.first_name;
      if (updateData.last_name !== undefined) userData.last_name = updateData.last_name;
      if (updateData.email !== undefined) userData.email = updateData.email;
      if (updateData.phone !== undefined) userData.phone = updateData.phone;

      // Fields that go to kivi_therapists table
      const therapistFields = [
        'specialty', 'qualification', 'license_number', 'experience_years', 
        'session_fee', 'bio', 'date_of_birth', 'date_of_birth_text', 'gender', 'address', 'city', 
        'state', 'zip_code', 'emergency_contact_name', 'emergency_contact_phone',
        'joining_date', 'status', 'centre_id', 'languages', 'certifications', 
        'professional_certifications', 'spoken_languages', 'relation', 
        'primary_clinic_id', 'availability_status', 'session_duration', 
        'login_time', 'logout_time', 'is_available'
      ];

      therapistFields.forEach(field => {
        if (updateData[field] !== undefined) {
          // Handle date fields specifically
          if (field === 'date_of_birth' || field === 'joining_date') {
            if (updateData[field]) {
              const date = new Date(updateData[field]);
              therapistData[field] = date.toISOString().split('T')[0];
            } else {
              therapistData[field] = null;
            }
          } else if (Array.isArray(updateData[field])) {
            // Convert arrays to JSON strings for JSON fields
            therapistData[field] = JSON.stringify(updateData[field]);
          } else {
            therapistData[field] = updateData[field];
          }
        }
      });

      therapistData.updated_at = new Date();

      // Update user table if there's user data
      if (Object.keys(userData).length > 0) {
        const User = require('../models/User');
        const userModel = new User();
        
        await userModel.update(userId, userData);
      }

      // Update therapist table
      const updated = await this.therapistModel.update(therapistId, therapistData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Therapist not found'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Update my profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = TherapistController;