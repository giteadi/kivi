const BaseModel = require('./BaseModel');

class Programme extends BaseModel {
  constructor() {
    super('kivi_programmes');
  }

  // Create new programme
  async create(programmeData) {
    const fields = Object.keys(programmeData).join(', ');
    const placeholders = Object.keys(programmeData).map(() => '?').join(', ');
    const values = Object.values(programmeData);

    const sql = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`;
    const result = await this.query(sql, values);
    return result.insertId;
  }

  async getProgrammes(filters = {}) {
    let conditions = `
      LEFT JOIN kivi_therapists th ON p.therapist_id = th.id
      LEFT JOIN kivi_users u ON th.user_id = u.id
      LEFT JOIN kivi_centres c ON p.centre_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.search) {
      conditions += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.programme_id LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (filters.centreId) {
      conditions += ' AND p.centre_id = ?';
      params.push(filters.centreId);
    }

    if (filters.category) {
      conditions += ' AND p.category = ?';
      params.push(filters.category);
    }

    if (filters.status) {
      conditions += ' AND p.status = ?';
      params.push(filters.status);
    }

    if (filters.therapistId) {
      conditions += ' AND p.therapist_id = ?';
      params.push(filters.therapistId);
    }

    conditions += ' ORDER BY p.name';

    const sql = `
      SELECT p.*,
             u.first_name as therapist_first_name,
             u.last_name as therapist_last_name,
             th.specialty as therapist_specialty,
             th.employee_id as therapist_employee_id,
             c.name as centre_name
      FROM kivi_programmes p ${conditions}
    `;

    return await this.query(sql, params);
  }

  // Get programmes by centre
  async getProgrammesByCentre(centreId) {
    const conditions = `
      LEFT JOIN kivi_therapists th ON p.therapist_id = th.id
      LEFT JOIN kivi_users u ON th.user_id = u.id
      LEFT JOIN kivi_centres c ON p.centre_id = c.id
      WHERE p.centre_id = ? AND p.status = "active" ORDER BY p.name
    `;
    const sql = `
      SELECT p.*,
             u.first_name as therapist_first_name,
             u.last_name as therapist_last_name,
             th.specialty as therapist_specialty,
             th.employee_id as therapist_employee_id,
             c.name as centre_name
      FROM kivi_programmes p ${conditions}
    `;
    return await this.query(sql, [centreId]);
  }

  // Get programmes by therapist
  async getProgrammesByTherapist(therapistId) {
    const conditions = `
      LEFT JOIN kivi_therapists th ON p.therapist_id = th.id
      LEFT JOIN kivi_users u ON th.user_id = u.id
      LEFT JOIN kivi_centres c ON p.centre_id = c.id
      WHERE p.therapist_id = ? AND p.status = "active" ORDER BY p.name
    `;
    const sql = `
      SELECT p.*,
             u.first_name as therapist_first_name,
             u.last_name as therapist_last_name,
             th.specialty as therapist_specialty,
             th.employee_id as therapist_employee_id,
             c.name as centre_name
      FROM kivi_programmes p ${conditions}
    `;
    return await this.query(sql, [therapistId]);
  }

  // Get available therapists for programmes
  async getAvailableTherapistsForProgramme(centreId) {
    const sql = `
      SELECT th.id, th.employee_id, u.first_name, u.last_name, th.specialty, th.status
      FROM kivi_therapists th
      LEFT JOIN kivi_users u ON th.user_id = u.id
      WHERE th.centre_id = ? AND th.status = 'active'
      ORDER BY u.first_name, u.last_name
    `;
    return await this.query(sql, [centreId]);
  }
}

module.exports = Programme;