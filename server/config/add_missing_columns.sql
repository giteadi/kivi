-- Migration script to add missing columns and ensure therapist table is complete
USE kivi;

-- Check if kivi_therapists table exists, if not create it
CREATE TABLE IF NOT EXISTS kivi_therapists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  centre_id INT,
  employee_id VARCHAR(50) UNIQUE,
  specialty VARCHAR(255) NOT NULL,
  qualification VARCHAR(255) NOT NULL,
  license_number VARCHAR(100),
  experience_years INT DEFAULT 0,
  session_fee DECIMAL(10,2) DEFAULT 0,
  bio TEXT,
  profile_image LONGTEXT,
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  joining_date DATE,
  availability JSON,
  certifications JSON,
  languages JSON,
  session_duration INT DEFAULT 30, -- Session duration in minutes
  login_time TIME DEFAULT '09:00:00',
  logout_time TIME DEFAULT '18:00:00',
  is_available BOOLEAN DEFAULT TRUE,
  last_availability_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive', 'on_leave', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES kivi_users(id) ON DELETE CASCADE,
  FOREIGN KEY (centre_id) REFERENCES kivi_centres(id) ON DELETE SET NULL
);

-- Add missing columns if they don't exist
ALTER TABLE kivi_therapists 
ADD COLUMN IF NOT EXISTS session_duration INT DEFAULT 30 COMMENT 'Session duration in minutes',
ADD COLUMN IF NOT EXISTS login_time TIME DEFAULT '09:00:00' COMMENT 'Daily login time',
ADD COLUMN IF NOT EXISTS logout_time TIME DEFAULT '18:00:00' COMMENT 'Daily logout time',
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE COMMENT 'Current availability status',
ADD COLUMN IF NOT EXISTS last_availability_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Last time availability was updated';

-- Add missing columns to kivi_users table if they don't exist
ALTER TABLE kivi_users
ADD COLUMN IF NOT EXISTS profile_image LONGTEXT COMMENT 'Base64 encoded profile image',
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL COMMENT 'Last login timestamp';

-- Ensure therapist role exists in users table
ALTER TABLE kivi_users 
MODIFY COLUMN role ENUM('admin', 'therapist', 'staff', 'student', 'parent') DEFAULT 'admin';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_therapists_user_id ON kivi_therapists(user_id);
CREATE INDEX IF NOT EXISTS idx_therapists_centre_id ON kivi_therapists(centre_id);
CREATE INDEX IF NOT EXISTS idx_therapists_status ON kivi_therapists(status);
CREATE INDEX IF NOT EXISTS idx_therapists_specialty ON kivi_therapists(specialty);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_role ON kivi_users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON kivi_users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON kivi_users(is_active);

-- Insert sample therapist if not exists (for testing)
INSERT IGNORE INTO kivi_users (email, password, role, first_name, last_name, phone) 
VALUES ('therapist@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'therapist', 'Test', 'Therapist', '9876543210');

-- Get the user_id for the test therapist
SET @therapist_user_id = (SELECT id FROM kivi_users WHERE email = 'therapist@test.com');

-- Insert corresponding therapist record
INSERT IGNORE INTO kivi_therapists (
  user_id, centre_id, employee_id, specialty, qualification, license_number, 
  experience_years, session_fee, bio, date_of_birth, gender, address, city, state,
  emergency_contact_name, emergency_contact_phone, joining_date
) VALUES (
  @therapist_user_id, 1, 'TH001', 'Learning Therapy', 'M.Ed Special Education', 
  'LIC123456', 5, 1500.00, 'Experienced learning therapist', '1990-01-01', 
  'female', '123 Test St', 'Test City', 'Test State', 'Emergency Contact', 
  '9876543210', '2020-01-01'
);

-- Show final table structure
DESCRIBE kivi_therapists;

-- Show sample data
SELECT COUNT(*) as total_therapists FROM kivi_therapists;

-- Test data integrity
SELECT 
  t.id, 
  u.first_name, 
  u.last_name, 
  u.email,
  t.specialty,
  t.session_fee,
  t.is_available,
  t.login_time,
  t.logout_time
FROM kivi_therapists t 
JOIN kivi_users u ON t.user_id = u.id 
LIMIT 5;
