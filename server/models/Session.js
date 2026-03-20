const BaseModel = require('./BaseModel');

class Session extends BaseModel {
  constructor() {
    super('kivi_sessions');
  }

  // Create new session
  async create(sessionData) {
    const fields = Object.keys(sessionData).join(', ');
    const placeholders = Object.keys(sessionData).map(() => '?').join(', ');
    const values = Object.values(sessionData);

    const sql = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`;
    const result = await this.query(sql, values);
    return result.insertId;
  }

  // Get sessions with related data
  async getSessions(filters = {}) {
    let conditions = `
      LEFT JOIN kivi_students st ON s.student_id = st.id
      LEFT JOIN kivi_users u ON s.created_by = u.id
      LEFT JOIN kivi_therapists t ON s.therapist_id = t.id
      LEFT JOIN kivi_users tu ON t.user_id = tu.id
      LEFT JOIN kivi_centres c ON s.centre_id = c.id
      LEFT JOIN kivi_programmes p ON (CASE 
        WHEN s.programme_id LIKE 'P%' THEN s.programme_id 
        ELSE CONCAT('P', s.programme_id) 
      END) = p.programme_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.studentId) {
      conditions += ' AND s.student_id = ?';
      params.push(filters.studentId);
    }

    if (filters.therapistId) {
      conditions += ' AND s.therapist_id = ?';
      params.push(filters.therapistId);
    }

    if (filters.centreId) {
      conditions += ' AND s.centre_id = ?';
      params.push(filters.centreId);
    }

    if (filters.status) {
      conditions += ' AND s.status = ?';
      params.push(filters.status);
    }

    if (filters.date) {
      conditions += ' AND DATE(s.session_date) = ?';
      params.push(filters.date);
    }

    conditions += ' ORDER BY s.session_date DESC, s.session_time DESC';

    if (filters.limit) {
      conditions += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const sql = `
      SELECT s.*, 
             -- Client details with proper fallback logic
             CASE 
               WHEN st.id IS NOT NULL THEN 
                 COALESCE(st.first_name, u.first_name)
               ELSE 
                 COALESCE(u.first_name, 'Unknown')
             END as client_first_name,
             CASE 
               WHEN st.id IS NOT NULL THEN 
                 COALESCE(st.last_name, u.last_name)
               ELSE 
                 COALESCE(u.last_name, 'Client')
             END as client_last_name,
             CASE 
               WHEN st.id IS NOT NULL THEN 
                 COALESCE(st.email, u.email)
               ELSE 
                 COALESCE(u.email, 'No email')
             END as client_email,
             CASE 
               WHEN st.id IS NOT NULL THEN 
                 COALESCE(st.phone, u.phone)
               ELSE 
                 COALESCE(u.phone, 'No phone')
             END as client_phone,
             CASE 
               WHEN st.id IS NOT NULL THEN 'student'
               WHEN u.id IS NOT NULL THEN COALESCE(u.role, 'user')
               ELSE 'unknown'
             END as client_type,
             -- Original fields for backward compatibility
             st.first_name as student_first_name, st.last_name as student_last_name,
             u.first_name as user_first_name, u.last_name as user_last_name,
             u.email as user_email, u.phone as user_phone, u.role as user_role,
             tu.first_name as therapist_first_name, tu.last_name as therapist_last_name,
             tu.email as therapist_email, tu.phone as therapist_phone,
             t.specialty as therapist_specialty,
             c.name as centre_name, c.phone as centre_phone, c.address as centre_address,
             p.name as programme_name, p.fee as programme_fee
      FROM kivi_sessions s ${conditions}
    `;

    return await this.query(sql, params);
  }

  // Get single session with related data
  async findById(id) {
    const sql = `
      SELECT s.*, 
             -- Client details with proper fallback logic
             CASE 
               WHEN st.id IS NOT NULL THEN 
                 COALESCE(st.first_name, u.first_name)
               ELSE 
                 COALESCE(u.first_name, 'Unknown')
             END as client_first_name,
             CASE 
               WHEN st.id IS NOT NULL THEN 
                 COALESCE(st.last_name, u.last_name)
               ELSE 
                 COALESCE(u.last_name, 'Client')
             END as client_last_name,
             CASE 
               WHEN st.id IS NOT NULL THEN 
                 COALESCE(st.email, u.email)
               ELSE 
                 COALESCE(u.email, 'No email')
             END as client_email,
             CASE 
               WHEN st.id IS NOT NULL THEN 
                 COALESCE(st.phone, u.phone)
               ELSE 
                 COALESCE(u.phone, 'No phone')
             END as client_phone,
             CASE 
               WHEN st.id IS NOT NULL THEN 'student'
               WHEN u.id IS NOT NULL THEN COALESCE(u.role, 'user')
               ELSE 'unknown'
             END as client_type,
             -- Original fields for compatibility
             st.first_name as student_first_name, 
             st.last_name as student_last_name, 
             st.email as student_email,
             u.first_name as user_first_name, 
             u.last_name as user_last_name,
             u.email as user_email, 
             u.phone as user_phone, 
             u.role as user_role,
             -- Therapist details
             tu.first_name as therapist_first_name, 
             tu.last_name as therapist_last_name,
             tu.email as therapist_email, 
             tu.phone as therapist_phone,
             t.specialty as therapist_specialty,
             -- Centre and Programme details
             c.name as centre_name,
             c.phone as centre_phone, 
             c.address as centre_address,
             p.name as programme_name, 
             p.fee as programme_fee
      FROM kivi_sessions s
      LEFT JOIN kivi_students st ON s.student_id = st.id
      LEFT JOIN kivi_users u ON s.created_by = u.id
      LEFT JOIN kivi_therapists t ON s.therapist_id = t.id
      LEFT JOIN kivi_users tu ON t.user_id = tu.id
      LEFT JOIN kivi_centres c ON s.centre_id = c.id
      LEFT JOIN kivi_programmes p ON (CASE 
        WHEN s.programme_id LIKE 'P%' THEN s.programme_id 
        ELSE CONCAT('P', s.programme_id) 
      END) = p.programme_id
      WHERE s.id = ?
    `;
    
    const result = await this.query(sql, [id]);
    return result.length > 0 ? result[0] : null;
  }

  // Get available time slots for a therapist on a specific date
  async getAvailableTimeSlots(therapistId, date, duration = 30) {
    console.log(`=== DEBUG getAvailableTimeSlots ===`);
    console.log(`Therapist ID: ${therapistId}, Date: ${date}, Duration: ${duration}`);
    
    try {
      // Get therapist's availability
      const therapistSql = `
        SELECT t.availability, t.session_duration
        FROM kivi_therapists t
        WHERE t.id = ?
      `;
      const therapistResult = await this.query(therapistSql, [therapistId]);
      console.log(`Therapist query result:`, therapistResult);

      if (!therapistResult.length) {
        console.log(`Therapist ${therapistId} not found`);
        return [];
      }

      const therapist = therapistResult[0];
      const sessionDuration = therapist.session_duration || duration;
      console.log(`Therapist data:`, therapist);
      
      const availability = therapist.availability ? JSON.parse(therapist.availability) : {};
      console.log(`Parsed availability:`, availability);

      // Get day of week
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const dayAvailability = availability[dayOfWeek] || [];
      console.log(`Day of week: ${dayOfWeek}`);
      console.log(`Day availability:`, dayAvailability);

      if (dayAvailability.length === 0) {
        console.log(`No availability for ${dayOfWeek}`);
        return [];
      }

      // Get existing sessions for that date
      const existingSessionsSql = `
        SELECT session_time, duration
        FROM kivi_sessions 
        WHERE therapist_id = ? AND session_date = ? 
        AND status NOT IN ('cancelled', 'no_show')
        ORDER BY session_time
      `;
      const existingSessions = await this.query(existingSessionsSql, [therapistId, date]);
      console.log(`Existing sessions:`, existingSessions);

      // Generate all possible time slots
      const availableSlots = [];

      for (const timeRange of dayAvailability) {
        console.log(`Processing time range: ${timeRange}`);
        const [startTime, endTime] = timeRange.split('-');
        console.log(`Start time: ${startTime}, End time: ${endTime}`);

        if (!startTime || !endTime) {
          console.log(`Invalid time range format: ${timeRange}`);
          continue;
        }

        const slots = this.generateTimeSlots(startTime.trim(), endTime.trim(), sessionDuration);
        console.log(`Generated ${slots.length} slots:`, slots);

        // Filter out slots that conflict with existing sessions
        for (const slot of slots) {
          const isAvailable = !this.hasTimeConflict(slot, existingSessions, sessionDuration);
          console.log(`Slot ${slot} available: ${isAvailable}`);
          if (isAvailable) {
            availableSlots.push({
              time: slot,
              available: true,
              therapist_id: therapistId,
              date: date,
              duration: sessionDuration
            });
          }
        }
      }

      console.log(`Final available slots: ${availableSlots.length}`);
      return availableSlots;
    } catch (error) {
      console.error('Error getting available time slots:', error);
      return [];
    }
  }
  
  // Generate time slots between start and end time
  generateTimeSlots(startTime, endTime, duration) {
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    // Convert to minutes for easier calculation
    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;
    let currentTotalMin = startTotalMin;
    
    while (currentTotalMin + duration <= endTotalMin) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      slots.push(timeStr);
      
      // Add duration in minutes
      currentTotalMin += duration;
      currentHour = Math.floor(currentTotalMin / 60);
      currentMin = currentTotalMin % 60;
    }
    
    return slots;
  }
  
  // Check if time slot conflicts with existing sessions
  hasTimeConflict(slotTime, existingSessions, duration) {
    const slotStart = this.timeToMinutes(slotTime);
    const slotEnd = slotStart + duration;
    
    for (const session of existingSessions) {
      const sessionStart = this.timeToMinutes(session.session_time);
      const sessionEnd = sessionStart + (session.duration || duration);
      
      // Check if slots overlap
      if (slotStart < sessionEnd && slotEnd > sessionStart) {
        return true;
      }
    }
    
    return false;
  }
  
  // Convert time string to minutes
  timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Get upcoming sessions
  async getUpcomingSessions(limit = 5, filters = {}) {
    let conditions = `
      LEFT JOIN kivi_students st ON s.student_id = st.id
      LEFT JOIN kivi_therapists t ON s.therapist_id = t.id
      LEFT JOIN kivi_users tu ON t.user_id = tu.id
      WHERE s.session_date >= CURDATE() AND s.status IN ('scheduled', 'confirmed', 'awaiting_confirmation')
    `;
    const params = [];

    if (filters.centreId) {
      conditions += ' AND s.centre_id = ?';
      params.push(filters.centreId);
    }

    if (filters.therapistId) {
      conditions += ' AND s.therapist_id = ?';
      params.push(filters.therapistId);
    }

    conditions += ' ORDER BY s.session_date ASC, s.session_time ASC LIMIT ?';
    params.push(parseInt(limit));

    const sql = `
      SELECT s.*, 
             st.first_name as student_first_name, st.last_name as student_last_name,
             tu.first_name as therapist_first_name, tu.last_name as therapist_last_name
      FROM kivi_sessions s ${conditions}
    `;

    return await this.query(sql, params);
  }
}

module.exports = Session;