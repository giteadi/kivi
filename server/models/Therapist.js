const BaseModel = require('./BaseModel');

class Therapist extends BaseModel {
  constructor() {
    super('kivi_therapists');
  }

  // Get therapists with user info
  async getTherapists(filters = {}) {
    let conditions = `
      LEFT JOIN kivi_users u ON t.user_id = u.id
      LEFT JOIN kivi_centres c ON t.centre_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.search) {
      conditions += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR t.specialty LIKE ? OR t.employee_id LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (filters.centreId) {
      conditions += ' AND t.centre_id = ?';
      params.push(filters.centreId);
    }

    if (filters.specialty) {
      conditions += ' AND t.specialty = ?';
      params.push(filters.specialty);
    }

    if (filters.status) {
      conditions += ' AND t.status = ?';
      params.push(filters.status);
    }

    conditions += ' ORDER BY u.first_name, u.last_name';

    const sql = `
      SELECT t.*, 
             u.first_name, u.last_name, u.email, u.phone,
             c.name as centre_name
      FROM kivi_therapists t ${conditions}
    `;

    return await this.query(sql, params);
  }

  // Get therapist with stats
  async getTherapistWithStats(id) {
    const sql = `
      SELECT t.*, 
             u.first_name, u.last_name, u.email, u.phone, u.password,
             c.name as centre_name,
             COUNT(s.id) as total_sessions,
             AVG(CASE WHEN s.status = 'completed' THEN 5 ELSE 0 END) as avg_rating
      FROM kivi_therapists t
      LEFT JOIN kivi_users u ON t.user_id = u.id
      LEFT JOIN kivi_centres c ON t.centre_id = c.id
      LEFT JOIN kivi_sessions s ON t.id = s.therapist_id
      WHERE t.id = ?
      GROUP BY t.id
    `;
    const results = await this.query(sql, [id]);
    return results[0] || null;
  }

  // Get therapist availability
  async getTherapistAvailability(therapistId, date) {
    try {
      const sql = `
        SELECT 
          t.id,
          u.first_name,
          u.last_name,
          t.specialty,
          t.experience_years,
          t.availability as working_hours,
          t.availability as available_days,
          s.session_date,
          s.session_time,
          s.status as session_status
        FROM kivi_therapists t
        LEFT JOIN kivi_users u ON t.user_id = u.id
        LEFT JOIN kivi_sessions s ON t.id = s.therapist_id 
          AND s.session_date = ? 
          AND s.status IN ('scheduled', 'confirmed')
        WHERE t.id = ? AND t.status = 'active'
        ORDER BY s.session_time
      `;
      
      const results = await this.query(sql, [date || null, therapistId]);
      return results;
    } catch (error) {
      console.error('Error in getTherapistAvailability:', error);
      throw error;
    }
  }

  // Get all available therapists with their schedules
  async getAvailableTherapists(date = null, specialty = null) {
    try {
      let whereConditions = "WHERE t.status = 'active'";
      const params = [];

      if (specialty) {
        whereConditions += ' AND t.specialty = ?';
        params.push(specialty);
      }

      const sql = `
        SELECT 
          t.id,
          u.first_name,
          u.last_name,
          t.specialty,
          t.experience_years,
          t.qualification,
          t.is_available,
          t.login_time,
          t.logout_time,
          u.email,
          u.phone,
          c.name as centre_name,
          COUNT(s.id) as total_sessions_today,
          GROUP_CONCAT(
            CASE WHEN s.session_date = ? AND s.status IN ('scheduled', 'confirmed')
            THEN CONCAT(s.session_time, '-', s.status)
            END
          ) as booked_slots
        FROM kivi_therapists t
        LEFT JOIN kivi_users u ON t.user_id = u.id
        LEFT JOIN kivi_centres c ON t.centre_id = c.id
        LEFT JOIN kivi_sessions s ON t.id = s.therapist_id 
          AND s.session_date = ?
        ${whereConditions}
        GROUP BY t.id
        ORDER BY u.first_name, u.last_name
      `;

      const queryParams = date ? [date, date, ...params] : [null, null, ...params];
      return await this.query(sql, queryParams);
    } catch (error) {
      console.error('Error in getAvailableTherapists:', error);
      throw error;
    }
  }

  // Get available time slots for a therapist on a specific date
  async getAvailableTimeSlots(therapistId, date) {
    try {
      // First get therapist's availability data
      const therapistSql = `
        SELECT availability, login_time, logout_time
        FROM kivi_therapists
        WHERE id = ? AND status = 'active'
      `;

      const therapistResults = await this.query(therapistSql, [therapistId]);
      if (therapistResults.length === 0) {
        return [];
      }

      const therapist = therapistResults[0];
      console.log(`🔍 Therapist ${therapistId}: Login time: ${therapist.login_time}, Logout time: ${therapist.logout_time}`);

      // Check if therapist has login/logout times set
      if (!therapist.login_time || !therapist.logout_time) {
        console.log(`❌ Therapist ${therapistId}: No login/logout times set`);
        return [];
      }

      // Check if the date is a working day (Monday-Friday for now)
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return [];
      const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

      // Only allow bookings Monday-Friday for now
      const workingDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      if (!workingDays.includes(dayOfWeek)) {
        console.log(`❌ Therapist ${therapistId}: ${dayOfWeek} is not a working day`);
        return [];
      }

      // Get already booked slots
      const bookedSql = `
        SELECT session_time, status
        FROM kivi_sessions
        WHERE therapist_id = ? AND session_date = ?
        AND status IN ('scheduled', 'confirmed')
      `;

      const bookedSlots = await this.query(bookedSql, [therapistId, date]);

      // Generate available time slots based on login/logout times
      const startTime = new Date(`${date} ${therapist.login_time}`);
      const endTime = new Date(`${date} ${therapist.logout_time}`);
      const slotDuration = 60; // 60 minutes slots
      const slots = [];

      console.log(`🔍 Therapist ${therapistId}: Generating slots from ${therapist.login_time} to ${therapist.logout_time} on ${date}`);

      // Generate all possible slots within login/logout time range
      let currentTime = new Date(startTime);
      while (currentTime < endTime) {
        const timeString = currentTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });

        // Check if this slot is booked
        const isBooked = bookedSlots.some(slot => {
          const bookedTime = new Date(`${date} ${slot.session_time}`);
          return Math.abs(bookedTime - currentTime) < slotDuration * 60 * 1000;
        });

        if (!isBooked) {
          slots.push({
            time: timeString,
            available: true,
            therapist_id: therapistId,
            date: date
          });
        }

        currentTime = new Date(currentTime.getTime() + slotDuration * 60 * 1000);
      }

      console.log(`✅ Therapist ${therapistId}: Generated ${slots.length} available slots`);
      return slots;
    } catch (error) {
      console.error('Error in getAvailableTimeSlots:', error);
      throw error;
    }
  }

  // Update therapist availability
  async updateAvailability(therapistId, availabilityData) {
    try {
      const sql = `
        UPDATE kivi_therapists
        SET login_time = ?, logout_time = ?, is_available = ?, last_availability_update = ?
        WHERE id = ?
      `;

      const params = [
        availabilityData.login_time,
        availabilityData.logout_time,
        availabilityData.is_available,
        availabilityData.last_availability_update,
        therapistId
      ];

      const result = await this.query(sql, params);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in updateAvailability:', error);
      throw error;
    }
  }
}

module.exports = Therapist;