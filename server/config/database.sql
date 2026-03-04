-- KiviCare Database Schema
CREATE DATABASE IF NOT EXISTS kivi;
USE kivi;

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'receptionist') DEFAULT 'admin',
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clinics table
CREATE TABLE IF NOT EXISTS clinics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(255),
  specialties TEXT,
  description TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  clinic_id INT,
  specialty VARCHAR(255),
  qualification VARCHAR(255),
  license_number VARCHAR(100),
  experience_years INT DEFAULT 0,
  consultation_fee DECIMAL(10,2) DEFAULT 0,
  bio TEXT,
  profile_image VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE SET NULL
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  emergency_contact VARCHAR(20),
  blood_group VARCHAR(10),
  allergies TEXT,
  medical_history TEXT,
  profile_image VARCHAR(255),
  clinic_id INT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE SET NULL
);

-- Receptionists table
CREATE TABLE IF NOT EXISTS receptionists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  clinic_id INT,
  department VARCHAR(100),
  shift ENUM('morning', 'evening', 'night', 'full_day') DEFAULT 'full_day',
  employee_id VARCHAR(50),
  salary DECIMAL(10,2),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE SET NULL
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  service_id VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  clinic_id INT,
  price DECIMAL(10,2) NOT NULL,
  duration INT DEFAULT 30, -- in minutes
  description TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE SET NULL
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  clinic_id INT NOT NULL,
  service_id INT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration INT DEFAULT 30,
  status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- Encounter templates table
CREATE TABLE IF NOT EXISTS encounter_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  fields JSON,
  created_by INT,
  usage_count INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Encounters table
CREATE TABLE IF NOT EXISTS encounters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id INT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  clinic_id INT NOT NULL,
  template_id INT,
  encounter_date DATE NOT NULL,
  encounter_time TIME NOT NULL,
  chief_complaint TEXT,
  history_present_illness TEXT,
  examination_findings TEXT,
  diagnosis TEXT,
  treatment_plan TEXT,
  medications TEXT,
  follow_up_instructions TEXT,
  encounter_data JSON,
  status ENUM('draft', 'completed', 'signed') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES encounter_templates(id) ON DELETE SET NULL
);

-- Billing records table
CREATE TABLE IF NOT EXISTS billing_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  patient_id INT NOT NULL,
  doctor_id INT,
  clinic_id INT NOT NULL,
  appointment_id INT,
  encounter_id INT,
  service_ids JSON,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status ENUM('pending', 'partial', 'paid', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_date TIMESTAMP NULL,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
  FOREIGN KEY (encounter_id) REFERENCES encounters(id) ON DELETE SET NULL
);

-- Taxes table
CREATE TABLE IF NOT EXISTS taxes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  rate DECIMAL(5,2) NOT NULL,
  type ENUM('percentage', 'fixed') DEFAULT 'percentage',
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT IGNORE INTO users (email, password, role, first_name, last_name) 
VALUES ('admin@kivicare.com', 'admin123', 'admin', 'Admin', 'User');

-- Insert sample clinics
INSERT IGNORE INTO clinics (name, address, city, state, phone, email, specialties) VALUES
('Clinic Kjaggi', '123 Main St', 'Mumbai', 'Maharashtra', '+91-9876543210', 'clinic_kjaggi@kivicare.com', 'General Medicine, Cardiology'),
('Sunrise Health Center', '456 Health Ave', 'Delhi', 'Delhi', '+91-9876543211', 'kjaggi+clinic1@mindsale', 'Pediatrics, Orthopedics'),
('Downtown Family Clinic', '789 Family Rd', 'Bangalore', 'Karnataka', '+91-9876543212', 'kjaggi+clinic2@mindsale', 'Family Medicine, Dentistry'),
('Green Valley Clinic', '321 Valley St', 'Chennai', 'Tamil Nadu', '+91-9876543213', 'kjaggi+clinic3@mindsalelearning', 'Radiology, Laboratory');

-- Insert sample services
INSERT IGNORE INTO services (service_id, name, category, clinic_id, price, duration, description) VALUES
('GC', 'General Consultation', 'Consultation', 1, 100, 30, 'General medical consultation with experienced physicians'),
('PS', 'Psychology Counseling', 'Psychology Services', 1, 200, 50, 'Individual psychology counseling and therapy sessions'),
('WM', 'Weight Management Consultation', 'Weight Management', 2, 180, 45, 'Comprehensive weight management and nutrition consultation'),
('DC', 'Dental Cleaning', 'Dentistry', 3, 120, 60, 'Professional dental cleaning and oral hygiene'),
('LP', 'Lipid Profile', 'Laboratory', 4, 80, 10, 'Complete lipid profile blood test'),
('CX', 'Chest X-Ray', 'Radiology', 4, 100, 15, 'Digital chest X-ray imaging service'),
('AU', 'Abdominal Ultrasound', 'Radiology', 4, 200, 45, 'Comprehensive abdominal ultrasound examination'),
('MW', 'Minor Wound Suturing', 'General', 4, 150, 30, 'Professional wound suturing service for minor cuts and injuries');

-- Insert sample taxes
INSERT IGNORE INTO taxes (name, rate, type) VALUES
('GST 18%', 18.00, 'percentage'),
('GST 12%', 12.00, 'percentage'),
('GST 5%', 5.00, 'percentage'),
('Service Tax', 100.00, 'fixed');