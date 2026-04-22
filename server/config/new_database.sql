-- MindSaid Learning Database Schema
-- Educational Therapy Management System
DROP DATABASE IF EXISTS kivi;
CREATE DATABASE kivi;
USE kivi;

-- Users table (for authentication and basic user info)
CREATE TABLE kivi_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'therapist', 'staff', 'student', 'parent') DEFAULT 'admin',
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  profile_image LONGTEXT, -- Base64 encoded image
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Learning Centres table (previously clinics)
CREATE TABLE kivi_centres (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  specialties JSON, -- Array of specialties like ["Learning Therapy", "Behavioral Therapy"]
  facilities JSON, -- Array of facilities like ["Assessment Room", "Therapy Room", "Library"]
  description TEXT,
  established_date DATE,
  operating_hours VARCHAR(100),
  emergency_services BOOLEAN DEFAULT FALSE,
  wheelchair_accessible BOOLEAN DEFAULT TRUE,
  parking_available BOOLEAN DEFAULT TRUE,
  languages_supported JSON, -- Array of languages
  insurance_accepted JSON, -- Array of insurance types
  centre_image LONGTEXT, -- Base64 encoded image
  status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Therapists table (previously doctors)
CREATE TABLE kivi_therapists (
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
  profile_image LONGTEXT, -- Base64 encoded image
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  joining_date DATE,
  availability JSON, -- Weekly schedule like {"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"]}
  certifications JSON, -- Array of certifications
  languages JSON, -- Array of languages spoken
  status ENUM('active', 'inactive', 'on_leave', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES kivi_users(id) ON DELETE CASCADE,
  FOREIGN KEY (centre_id) REFERENCES kivi_centres(id) ON DELETE SET NULL
);

-- Students table (previously patients)
CREATE TABLE kivi_students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id VARCHAR(50) UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  date_of_birth DATE,
  age INT,
  gender ENUM('male', 'female', 'other'),
  language_of_testing VARCHAR(50) DEFAULT NULL COMMENT 'Language used for testing (English, Hindi, Demographics, etc.)',
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  centre_id INT,
  
  -- Emergency Contact Information
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relation VARCHAR(50),
  
  -- Educational Information
  learning_needs TEXT,
  support_requirements TEXT,
  current_programmes JSON, -- Array of current programmes
  learning_goals TEXT,
  assessment_notes TEXT,
  
  -- Medical/Health Information (relevant for therapy)
  allergies TEXT,
  medical_conditions TEXT,
  medications TEXT,
  dietary_restrictions TEXT,
  
  -- Service Requirements (for Assessment and Therapy tracking)
  requires_assessment BOOLEAN DEFAULT FALSE COMMENT 'Student requires psycho-educational assessment',
  requires_therapy BOOLEAN DEFAULT FALSE COMMENT 'Student requires remedial therapy',
  
  -- Parent/Guardian Information
  parent_guardian_name VARCHAR(100),
  parent_guardian_phone VARCHAR(20),
  parent_guardian_email VARCHAR(255),
  parent_guardian_relation VARCHAR(50),
  
  -- Files and Images
  profile_image LONGTEXT, -- Base64 encoded image
  documents JSON, -- Array of document objects with base64 data
  
  registration_date DATE,
  last_session_date DATE,
  status ENUM('active', 'inactive', 'on_leave', 'graduated', 'transferred') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (centre_id) REFERENCES kivi_centres(id) ON DELETE SET NULL
);

-- Staff table (previously receptionists)
CREATE TABLE kivi_staff (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  centre_id INT,
  employee_id VARCHAR(50) UNIQUE,
  department VARCHAR(100),
  position VARCHAR(100),
  shift ENUM('morning', 'evening', 'night', 'full_day') DEFAULT 'full_day',
  salary DECIMAL(10,2),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  joining_date DATE,
  profile_image LONGTEXT, -- Base64 encoded image
  permissions JSON, -- Array of permissions
  status ENUM('active', 'inactive', 'on_leave', 'terminated') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES kivi_users(id) ON DELETE CASCADE,
  FOREIGN KEY (centre_id) REFERENCES kivi_centres(id) ON DELETE SET NULL
);

-- Programmes table (previously services)
CREATE TABLE kivi_programmes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  programme_id VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  centre_id INT,
  fee DECIMAL(10,2) NOT NULL,
  duration INT DEFAULT 30, -- in minutes
  description TEXT,
  objectives TEXT,
  target_age_group VARCHAR(50),
  prerequisites TEXT,
  materials_required TEXT,
  programme_image LONGTEXT, -- Base64 encoded image
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (centre_id) REFERENCES kivi_centres(id) ON DELETE SET NULL
);

-- Sessions table (previously appointments)
CREATE TABLE kivi_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id VARCHAR(50) UNIQUE,
  student_id INT NOT NULL,
  therapist_id INT NOT NULL,
  centre_id INT NOT NULL,
  programme_id INT,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  duration INT DEFAULT 30,
  session_type ENUM('individual', 'group', 'assessment', 'consultation') DEFAULT 'individual',
  status ENUM('scheduled', 'confirmed', 'awaiting_confirmation', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
  notes TEXT,
  preparation_notes TEXT,
  room_number VARCHAR(20),
  materials_needed TEXT,
  session_goals TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES kivi_students(id) ON DELETE CASCADE,
  FOREIGN KEY (therapist_id) REFERENCES kivi_therapists(id) ON DELETE CASCADE,
  FOREIGN KEY (centre_id) REFERENCES kivi_centres(id) ON DELETE CASCADE,
  FOREIGN KEY (programme_id) REFERENCES kivi_programmes(id) ON DELETE SET NULL
);

-- Encounter templates table
CREATE TABLE kivi_encounter_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  template_type ENUM('session', 'assessment', 'progress_report', 'behavioral_report') DEFAULT 'session',
  fields JSON, -- Template structure with field definitions
  sections JSON, -- Template sections and their order
  estimated_time INT DEFAULT 15, -- minutes to complete
  created_by INT,
  usage_count INT DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'inactive', 'draft') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES kivi_users(id) ON DELETE SET NULL
);

-- Encounters table (session reports)
CREATE TABLE kivi_encounters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  encounter_id VARCHAR(50) UNIQUE,
  session_id INT,
  student_id INT NOT NULL,
  therapist_id INT NOT NULL,
  centre_id INT NOT NULL,
  template_id INT,
  encounter_date DATE NOT NULL,
  encounter_time TIME NOT NULL,
  encounter_type ENUM('session_report', 'assessment', 'progress_report', 'behavioral_report') DEFAULT 'session_report',
  
  -- Session Information
  session_goals TEXT,
  activities_conducted TEXT,
  student_response TEXT,
  progress_notes TEXT,
  challenges_faced TEXT,
  recommendations TEXT,
  next_session_plan TEXT,
  
  -- Assessment Information
  assessment_type VARCHAR(100),
  assessment_results TEXT,
  scores JSON, -- Assessment scores and metrics
  
  -- Behavioral Information
  behavioral_observations TEXT,
  interventions_used TEXT,
  behavioral_goals TEXT,
  
  -- Files and Media
  attachments JSON, -- Array of file objects with base64 data
  images JSON, -- Array of image objects with base64 data
  audio_recordings JSON, -- Array of audio files with base64 data
  
  -- Template Data
  encounter_data JSON, -- Dynamic data based on template
  completion_percentage INT DEFAULT 0,
  
  -- Parent Communication
  parent_feedback TEXT,
  home_activities TEXT,
  parent_signature LONGTEXT, -- Base64 encoded signature
  
  status ENUM('draft', 'completed', 'reviewed', 'signed', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES kivi_sessions(id) ON DELETE SET NULL,
  FOREIGN KEY (student_id) REFERENCES kivi_students(id) ON DELETE CASCADE,
  FOREIGN KEY (therapist_id) REFERENCES kivi_therapists(id) ON DELETE CASCADE,
  FOREIGN KEY (centre_id) REFERENCES kivi_centres(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES kivi_encounter_templates(id) ON DELETE SET NULL
);

-- Billing records table
CREATE TABLE kivi_billing_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  student_id INT NOT NULL,
  therapist_id INT,
  centre_id INT NOT NULL,
  session_id INT,
  encounter_id INT,
  programme_ids JSON, -- Array of programme IDs
  
  -- Billing Details
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Payment Information
  payment_status ENUM('pending', 'partial', 'paid', 'refunded', 'cancelled') DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_date TIMESTAMP NULL,
  due_date DATE,
  
  -- Additional Information
  billing_address TEXT,
  notes TEXT,
  receipt_image LONGTEXT, -- Base64 encoded receipt image
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES kivi_students(id) ON DELETE CASCADE,
  FOREIGN KEY (therapist_id) REFERENCES kivi_therapists(id) ON DELETE SET NULL,
  FOREIGN KEY (centre_id) REFERENCES kivi_centres(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES kivi_sessions(id) ON DELETE SET NULL,
  FOREIGN KEY (encounter_id) REFERENCES kivi_encounters(id) ON DELETE SET NULL
);

-- Taxes table
CREATE TABLE kivi_taxes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  rate DECIMAL(5,2) NOT NULL,
  type ENUM('percentage', 'fixed') DEFAULT 'percentage',
  applicable_to ENUM('all', 'programmes', 'sessions', 'assessments') DEFAULT 'all',
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Student Progress Tracking
CREATE TABLE kivi_student_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  therapist_id INT NOT NULL,
  programme_id INT,
  assessment_date DATE NOT NULL,
  progress_type ENUM('weekly', 'monthly', 'quarterly', 'annual') DEFAULT 'monthly',
  
  -- Progress Metrics
  learning_goals_met JSON, -- Array of goals and their completion status
  skill_improvements JSON, -- Skills and their improvement levels
  behavioral_changes TEXT,
  academic_progress TEXT,
  social_skills_progress TEXT,
  
  -- Ratings (1-10 scale)
  attention_rating INT,
  participation_rating INT,
  cooperation_rating INT,
  progress_rating INT,
  
  -- Recommendations
  recommendations TEXT,
  next_goals TEXT,
  parent_involvement TEXT,
  
  -- Files
  progress_charts LONGTEXT, -- Base64 encoded charts/graphs
  assessment_documents JSON, -- Array of document objects
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES kivi_students(id) ON DELETE CASCADE,
  FOREIGN KEY (therapist_id) REFERENCES kivi_therapists(id) ON DELETE CASCADE,
  FOREIGN KEY (programme_id) REFERENCES kivi_programmes(id) ON DELETE SET NULL
);

-- Communication Log (between therapists, parents, staff)
CREATE TABLE kivi_communications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  sender_id INT NOT NULL,
  receiver_id INT,
  communication_type ENUM('email', 'sms', 'call', 'meeting', 'note') DEFAULT 'note',
  subject VARCHAR(255),
  message TEXT,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  attachments JSON, -- Array of file objects with base64 data
  is_read BOOLEAN DEFAULT FALSE,
  response_required BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES kivi_students(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES kivi_users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES kivi_users(id) ON DELETE SET NULL
);

-- System Settings
CREATE TABLE kivi_system_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert admin user
INSERT INTO kivi_users (email, password, role, first_name, last_name, phone) VALUES
('admin@kivi.com', 'admin123', 'admin', 'Admin', 'User', '+91-9876543210');

-- Insert sample learning centres
INSERT INTO kivi_centres (name, address, city, state, zip_code, phone, email, website, specialties, facilities, description, established_date, operating_hours, emergency_services) VALUES
('MindSaid Learning Centre', '123 Education Drive, Learning District', 'New York', 'NY', '10001', '+1 (555) 123-4567', 'center_main@kivicare.com', 'www.kivicare.com', '["Learning Therapy", "Behavioral Therapy", "Speech Therapy"]', '["Assessment Room", "Therapy Room", "Sensory Room", "Library", "Computer Lab"]', 'Premier educational therapy center providing comprehensive learning support services', '2020-01-15', '8:00 AM - 8:00 PM', TRUE),
('Green Valley Learning Centre', '456 Green Valley Road, Education Plaza', 'Los Angeles', 'CA', '90210', '+1 (555) 987-6543', 'greenvalley@kivicare.com', 'www.greenvalleylearning.com', '["Occupational Therapy", "Educational Psychology", "Special Needs Support"]', '["Therapy Rooms", "Assessment Center", "Parent Meeting Room", "Playground"]', 'Specialized center for occupational therapy and special needs support', '2018-06-20', '7:00 AM - 9:00 PM', TRUE),
('Sunrise Learning Centre', '789 Sunrise Boulevard, Learning Complex', 'Miami', 'FL', '33101', '+1 (555) 456-7890', 'sunrise@kivicare.com', 'www.sunriselearning.com', '["Learning Support", "Therapy Services", "Assessment"]', '["Individual Therapy Rooms", "Group Session Room", "Testing Center", "Family Room"]', 'Comprehensive learning support center with 24/7 emergency services', '2019-03-10', '24/7', TRUE),
('Downtown Learning Centre', '321 Downtown Street, City Center', 'Chicago', 'IL', '60601', '+1 (555) 321-0987', 'downtown@kivicare.com', 'www.downtownlearning.com', '["Family Support", "Child Development", "Educational Guidance"]', '["Consultation Rooms", "Play Therapy Room", "Parent Education Center"]', 'Family-focused learning center specializing in child development', '2017-11-05', '8:00 AM - 6:00 PM', FALSE);

-- Insert sample therapist users
INSERT INTO kivi_users (email, password, role, first_name, last_name, phone) VALUES
('dr.sarah.johnson@mindsaidlearning.com', 'therapist123', 'therapist', 'Sarah', 'Johnson', '+91-9876543211'),
('dr.michael.brown@mindsaidlearning.com', 'therapist123', 'therapist', 'Michael', 'Brown', '+91-9876543212'),
('dr.emily.davis@mindsaidlearning.com', 'therapist123', 'therapist', 'Emily', 'Davis', '+91-9876543213');

-- Insert sample therapists
INSERT INTO kivi_therapists (user_id, centre_id, employee_id, specialty, qualification, license_number, experience_years, session_fee, bio, date_of_birth, gender, joining_date, status) VALUES
(3, 1, 'TH001', 'Learning Therapy', 'M.Ed, Ph.D in Special Education', 'LIC123456', 8, 2000.00, 'Experienced learning therapist specializing in remedial education and special needs support.', '1985-03-15', 'female', '2020-01-15', 'active'),
(4, 2, 'TH002', 'Occupational Therapy', 'BOT, MOT in Occupational Therapy', 'LIC123457', 6, 1500.00, 'Certified occupational therapist with expertise in sensory integration and motor skills development.', '1987-07-22', 'male', '2021-03-10', 'active'),
(5, 3, 'TH003', 'Speech Language Therapy', 'MASLP in Speech Language Pathology', 'LIC123458', 5, 1500.00, 'Speech language pathologist focused on communication disorders and language development.', '1988-11-08', 'female', '2022-05-20', 'active');

-- Set availability for dummy therapists (Monday to Friday, 9 AM to 5 PM)
UPDATE kivi_therapists SET availability = '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-17:00"]}' WHERE id = 1;
UPDATE kivi_therapists SET availability = '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-17:00"]}' WHERE id = 2;
UPDATE kivi_therapists SET availability = '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-17:00"]}' WHERE id = 3;

-- Insert sample student user
INSERT INTO kivi_users (email, password, role, first_name, last_name, phone) VALUES
('student@example.com', 'student123', 'student', 'John', 'Doe', '+91-9876543214');

-- Insert sample student
INSERT INTO kivi_students (student_id, first_name, last_name, email, phone, date_of_birth, age, gender, centre_id, registration_date, status, user_id) VALUES
('ST001', 'John', 'Doe', 'student@example.com', '+91-9876543214', '2010-05-15', 14, 'male', 1, '2024-01-15', 'active', 6);

-- Insert sample sessions for the student with therapist
INSERT INTO kivi_sessions (session_id, student_id, therapist_id, centre_id, programme_id, session_date, session_time, duration, session_type, status, notes) VALUES
('SES001', 1, 3, 1, 1, '2026-03-10', '10:00:00', 60, 'individual', 'scheduled', 'Initial assessment and goal setting'),
('SES002', 1, 3, 1, 1, '2026-03-05', '14:00:00', 60, 'individual', 'completed', 'Good progress in reading comprehension'),
('SES003', 1, 3, 1, 1, '2026-02-28', '10:00:00', 60, 'individual', 'completed', 'Worked on phonetic awareness');

-- Insert sample programmes
INSERT INTO kivi_programmes (programme_id, name, category, centre_id, fee, duration, description, objectives, target_age_group) VALUES
('LS', 'Learning Support Session', 'Learning Support', 1, 150.00, 30, 'Individual learning support session for academic improvement', 'Improve reading, writing, and math skills through personalized instruction', '6-18 years'),
('BA', 'Behavioral Assessment', 'Educational Assessment', 1, 200.00, 45, 'Comprehensive behavioral assessment for learning needs', 'Assess behavioral patterns and develop intervention strategies', '4-16 years'),
('ST', 'Speech Therapy', 'Speech Therapy', 2, 100.00, 30, 'Speech therapy session for communication development', 'Improve speech clarity, language skills, and communication abilities', '3-12 years'),
('OT', 'Occupational Therapy', 'Occupational Therapy', 2, 120.00, 45, 'Occupational therapy for skill development', 'Develop fine motor skills, sensory processing, and daily living skills', '4-14 years'),
('EP', 'Educational Psychology', 'Educational Psychology', 3, 180.00, 50, 'Educational psychology consultation and therapy sessions', 'Address learning difficulties and emotional challenges affecting education', '6-18 years'),
('FC', 'Family Counseling', 'Family Counseling', 4, 200.00, 60, 'Family counseling and support sessions', 'Improve family dynamics and support student learning at home', 'All ages'),
('CD', 'Child Development Assessment', 'Assessment', 4, 250.00, 90, 'Comprehensive child development assessment', 'Evaluate developmental milestones and create intervention plans', '2-12 years'),
('GS', 'Group Social Skills', 'Social Skills', 1, 80.00, 45, 'Group sessions for developing social skills', 'Improve peer interaction, communication, and social awareness', '8-16 years');

-- Insert sample taxes
INSERT INTO kivi_taxes (name, rate, type, applicable_to) VALUES
('GST 18%', 18.00, 'percentage', 'all'),
('GST 12%', 12.00, 'percentage', 'programmes'),
('GST 5%', 5.00, 'percentage', 'assessments'),
('Service Tax', 100.00, 'fixed', 'sessions');

-- Insert default encounter templates
INSERT INTO kivi_encounter_templates (name, description, category, template_type, fields, sections, estimated_time, created_by, is_default) VALUES
('General Session Report', 'Standard template for regular therapy sessions', 'General', 'session', 
'[{"name": "session_goals", "type": "textarea", "required": true}, {"name": "activities", "type": "textarea", "required": true}, {"name": "student_response", "type": "select", "options": ["Excellent", "Good", "Fair", "Needs Improvement"], "required": true}, {"name": "progress_notes", "type": "textarea", "required": true}]',
'[{"title": "Session Overview", "fields": ["session_goals", "activities"]}, {"title": "Student Performance", "fields": ["student_response", "progress_notes"]}]',
15, 1, TRUE),

('Behavioral Assessment', 'Template for behavioral assessments and observations', 'Assessment', 'assessment',
'[{"name": "behavioral_observations", "type": "textarea", "required": true}, {"name": "interventions_used", "type": "checkbox", "options": ["Positive Reinforcement", "Token System", "Break Cards", "Visual Schedules"], "required": false}, {"name": "behavioral_goals", "type": "textarea", "required": true}]',
'[{"title": "Observations", "fields": ["behavioral_observations"]}, {"title": "Interventions", "fields": ["interventions_used", "behavioral_goals"]}]',
20, 1, TRUE),

('Progress Report', 'Monthly progress report template', 'Progress', 'progress_report',
'[{"name": "learning_progress", "type": "textarea", "required": true}, {"name": "skill_development", "type": "textarea", "required": true}, {"name": "recommendations", "type": "textarea", "required": true}, {"name": "parent_feedback", "type": "textarea", "required": false}]',
'[{"title": "Academic Progress", "fields": ["learning_progress", "skill_development"]}, {"title": "Recommendations", "fields": ["recommendations", "parent_feedback"]}]',
25, 1, TRUE);

-- Insert system settings
INSERT INTO kivi_system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('system_name', 'KiviCare', 'string', 'System name displayed in the application', TRUE),
('default_session_duration', '30', 'number', 'Default session duration in minutes', FALSE),
('max_file_size', '10485760', 'number', 'Maximum file size for uploads in bytes (10MB)', FALSE),
('supported_image_formats', '["jpg", "jpeg", "png", "gif", "webp"]', 'json', 'Supported image file formats', FALSE),
('backup_frequency', 'daily', 'string', 'Database backup frequency', FALSE),
('session_reminder_hours', '24', 'number', 'Hours before session to send reminder', FALSE);

-- Create plans table for therapy and assessment packages
CREATE TABLE IF NOT EXISTS kivi_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('session', 'assessment') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(50),
    description TEXT,
    features JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create user_plans table to track user selected plans
CREATE TABLE IF NOT EXISTS kivi_user_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES kivi_users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES kivi_plans(id) ON DELETE CASCADE
);

-- Insert therapy session plans
INSERT INTO kivi_plans (name, type, price, duration, description, features) VALUES
('Remedial Therapy', 'session', 2000.00, '1 Hour', 'Comprehensive remedial therapy sessions for learning difficulties', 
 '["One-on-one therapy session", "Customized learning approach", "Progress tracking", "Parent consultation"]'),
('Occupational Therapy', 'session', 1500.00, '1 Hour', 'Specialized occupational therapy for daily living skills', 
 '["Sensory integration therapy", "Fine motor skill development", "Daily living activities", "Equipment recommendations"]'),
('Speech Language Therapy', 'session', 1500.00, '1 Hour', 'Professional speech and language development therapy', 
 '["Speech articulation training", "Language development", "Communication skills", "Swallowing therapy"]'),
('Counselling', 'session', 1500.00, '1 Hour', 'Professional counselling and psychological support', 
 '["Individual counselling", "Behavioral therapy", "Emotional support", "Coping strategies"]');

-- Insert assessment packages
INSERT INTO kivi_plans (name, type, price, description, features) VALUES
('Package I - Comprehensive Assessment', 'assessment', 45500.00, 'Complete psycho-educational assessment with detailed report', 
 '["Full cognitive assessment", "Academic achievement testing", "Behavioral evaluation", "Detailed written report", "Parent consultation", "School recommendations"]'),
('Package II - Standard Assessment', 'assessment', 32500.00, 'Standard psycho-educational assessment package', 
 '["Cognitive assessment", "Academic testing", "Written report", "Parent consultation", "Basic recommendations"]'),
('Package III - Essential Assessment', 'assessment', 28500.00, 'Essential assessment for learning difficulties', 
 '["Core cognitive testing", "Academic screening", "Summary report", "Parent meeting"]'),
('Package IV - Basic Assessment', 'assessment', 15500.00, 'Basic screening and assessment package', 
 '["Basic cognitive screening", "Academic review", "Brief report", "Consultation"]');