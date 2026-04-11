-- Create center_visibility_settings table for controlling what data is visible to center handlers
USE kivi;

-- Table for storing visibility settings per center
CREATE TABLE IF NOT EXISTS center_visibility_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  center_id INT NOT NULL,
  
  -- Financial Data Visibility
  show_revenue BOOLEAN DEFAULT true,
  show_billing_records BOOLEAN DEFAULT true,
  show_payment_details BOOLEAN DEFAULT true,
  show_tax_info BOOLEAN DEFAULT false,
  
  -- User/Patient Data Visibility
  show_patient_contact_info BOOLEAN DEFAULT true,
  show_patient_medical_history BOOLEAN DEFAULT false,
  show_patient_assessments BOOLEAN DEFAULT true,
  show_patient_personal_info BOOLEAN DEFAULT true,
  
  -- Session/Therapy Data Visibility
  show_session_details BOOLEAN DEFAULT true,
  show_session_notes BOOLEAN DEFAULT false,
  show_therapy_plans BOOLEAN DEFAULT true,
  
  -- Center Data Visibility
  show_center_financials BOOLEAN DEFAULT false,
  show_center_staff_list BOOLEAN DEFAULT true,
  show_center_analytics BOOLEAN DEFAULT true,
  
  -- Examinee Data Visibility
  show_examinee_contact_info BOOLEAN DEFAULT true,
  show_examinee_assessment_results BOOLEAN DEFAULT true,
  show_examinee_reports BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_center (center_id),
  INDEX idx_center_id (center_id),
  
  FOREIGN KEY (center_id) REFERENCES kivi_centres(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings for existing centers
INSERT INTO center_visibility_settings (center_id)
SELECT id FROM kivi_centres
WHERE id NOT IN (SELECT center_id FROM center_visibility_settings);
