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
      let availability;
      try {
        availability = typeof therapist.availability === 'string' ? JSON.parse(therapist.availability) : (therapist.availability || {});
      } catch (e) {
        console.error('Error parsing therapist availability:', e);
        availability = {};
      }

      // Fallback: if no availability set, use login/logout times for weekdays
      if ((!availability || Object.keys(availability).length === 0) && therapist.login_time && therapist.logout_time) {
        const start = therapist.login_time.substring(0, 5); // e.g., '09:00'
        const end = therapist.logout_time.substring(0, 5); // e.g., '18:00'
        availability = {
          "monday": { start: start, end: end },
          "tuesday": { start: start, end: end },
          "wednesday": { start: start, end: end },
          "thursday": { start: start, end: end },
          "friday": { start: start, end: end }
        };
        console.log(`🔍 Therapist ${therapistId}: Using fallback availability:`, availability);
      }

      // Extract available days from the availability object
      const availableDays = Object.keys(availability);
      const workingHours = availability;

      // Check if the date is in available days
      if (!date) return [];
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return [];
      const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      console.log(`🔍 Therapist ${therapistId}: Checking availability for date ${date}, dayOfWeek: ${dayOfWeek}, availableDays: ${availableDays}`);
      if (!availableDays.includes(dayOfWeek)) {
        console.log(`❌ Therapist ${therapistId}: No availability for ${dayOfWeek}`);
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

      // Generate available time slots
      const daySchedule = workingHours[dayOfWeek];
      if (!daySchedule || !daySchedule.start || !daySchedule.end) {
        return [];
      }

      const startTime = new Date(`${date} ${daySchedule.start}`);
      const endTime = new Date(`${date} ${daySchedule.end}`);
      const slotDuration = 60; // 60 minutes slots
      const slots = [];

      // Generate all possible slots
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