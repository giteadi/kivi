const BaseModel = require('./BaseModel');

class CenterVisibility extends BaseModel {
  constructor() {
    super('center_visibility_settings');
  }

  // Get visibility settings for a center
  async getVisibilityByCenterId(centerId) {
    try {
      const sql = 'SELECT * FROM center_visibility_settings WHERE center_id = ?';
      const results = await this.query(sql, [centerId]);
      
      if (results.length === 0) {
        // Create default settings if not exists
        return await this.createDefaultSettings(centerId);
      }
      
      return results[0];
    } catch (error) {
      console.error('Error getting visibility settings:', error);
      throw error;
    }
  }

  // Create default visibility settings for a center
  async createDefaultSettings(centerId) {
    try {
      const sql = `
        INSERT INTO center_visibility_settings (
          center_id, show_revenue, show_billing_records, show_payment_details,
          show_tax_info, show_patient_contact_info, show_patient_medical_history,
          show_patient_assessments, show_patient_personal_info, show_session_details,
          show_session_notes, show_therapy_plans, show_center_financials,
          show_center_staff_list, show_center_analytics, show_examinee_contact_info,
          show_examinee_assessment_results, show_examinee_reports
        ) VALUES (?, true, true, true, false, true, false, true, true, true, false, true, false, true, true, true, true, true)
      `;
      
      const result = await this.query(sql, [centerId]);
      
      return {
        id: result.insertId,
        center_id: centerId,
        show_revenue: true,
        show_billing_records: true,
        show_payment_details: true,
        show_tax_info: false,
        show_patient_contact_info: true,
        show_patient_medical_history: false,
        show_patient_assessments: true,
        show_patient_personal_info: true,
        show_session_details: true,
        show_session_notes: false,
        show_therapy_plans: true,
        show_center_financials: false,
        show_center_staff_list: true,
        show_center_analytics: true,
        show_examinee_contact_info: true,
        show_examinee_assessment_results: true,
        show_examinee_reports: true
      };
    } catch (error) {
      console.error('Error creating default visibility settings:', error);
      throw error;
    }
  }

  // Update visibility settings
  async updateVisibility(centerId, settings) {
    try {
      const allowedFields = [
        'show_revenue', 'show_billing_records', 'show_payment_details', 'show_tax_info',
        'show_patient_contact_info', 'show_patient_medical_history', 'show_patient_assessments',
        'show_patient_personal_info', 'show_session_details', 'show_session_notes',
        'show_therapy_plans', 'show_center_financials', 'show_center_staff_list',
        'show_center_analytics', 'show_examinee_contact_info', 'show_examinee_assessment_results',
        'show_examinee_reports'
      ];

      const updates = [];
      const values = [];

      for (const [key, value] of Object.entries(settings)) {
        if (allowedFields.includes(key)) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (updates.length === 0) {
        return false;
      }

      values.push(centerId);
      const sql = `UPDATE center_visibility_settings SET ${updates.join(', ')} WHERE center_id = ?`;
      
      const result = await this.query(sql, values);
      
      if (result.affectedRows === 0) {
        // Settings don't exist, create them first
        await this.createDefaultSettings(centerId);
        // Try updating again
        const retryResult = await this.query(sql, values);
        return retryResult.affectedRows > 0;
      }

      return true;
    } catch (error) {
      console.error('Error updating visibility settings:', error);
      throw error;
    }
  }

  // Get all centers with their visibility settings
  async getAllCentersWithVisibility() {
    try {
      const sql = `
        SELECT 
          c.id,
          c.name,
          c.city,
          c.status,
          v.show_revenue,
          v.show_billing_records,
          v.show_payment_details,
          v.show_tax_info,
          v.show_patient_contact_info,
          v.show_patient_medical_history,
          v.show_patient_assessments,
          v.show_patient_personal_info,
          v.show_session_details,
          v.show_session_notes,
          v.show_therapy_plans,
          v.show_center_financials,
          v.show_center_staff_list,
          v.show_center_analytics,
          v.show_examinee_contact_info,
          v.show_examinee_assessment_results,
          v.show_examinee_reports,
          v.updated_at
        FROM kivi_centres c
        LEFT JOIN center_visibility_settings v ON c.id = v.center_id
        ORDER BY c.name
      `;
      
      const results = await this.query(sql);
      
      // Ensure all centers have default values if visibility settings are null
      return results.map(center => ({
        ...center,
        show_revenue: center.show_revenue ?? true,
        show_billing_records: center.show_billing_records ?? true,
        show_payment_details: center.show_payment_details ?? true,
        show_tax_info: center.show_tax_info ?? false,
        show_patient_contact_info: center.show_patient_contact_info ?? true,
        show_patient_medical_history: center.show_patient_medical_history ?? false,
        show_patient_assessments: center.show_patient_assessments ?? true,
        show_patient_personal_info: center.show_patient_personal_info ?? true,
        show_session_details: center.show_session_details ?? true,
        show_session_notes: center.show_session_notes ?? false,
        show_therapy_plans: center.show_therapy_plans ?? true,
        show_center_financials: center.show_center_financials ?? false,
        show_center_staff_list: center.show_center_staff_list ?? true,
        show_center_analytics: center.show_center_analytics ?? true,
        show_examinee_contact_info: center.show_examinee_contact_info ?? true,
        show_examinee_assessment_results: center.show_examinee_assessment_results ?? true,
        show_examinee_reports: center.show_examinee_reports ?? true
      }));
    } catch (error) {
      console.error('Error getting all centers with visibility:', error);
      throw error;
    }
  }

  // Check if a specific field is visible for a center
  async isFieldVisible(centerId, fieldName) {
    try {
      const settings = await this.getVisibilityByCenterId(centerId);
      return settings[fieldName] ?? true; // Default to true if not set
    } catch (error) {
      console.error('Error checking field visibility:', error);
      return true; // Default to visible on error
    }
  }
}

module.exports = CenterVisibility;
