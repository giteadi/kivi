-- Seed data for KiviCare database
USE kivi;

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM billing_records;
-- DELETE FROM encounters;
-- DELETE FROM encounter_templates;
-- DELETE FROM appointments;
-- DELETE FROM services;
-- DELETE FROM receptionists;
-- DELETE FROM doctors WHERE id > 0;
-- DELETE FROM patients WHERE id > 0;
-- DELETE FROM clinics WHERE id > 4; -- Keep the first 4 clinics from schema

-- Insert additional Centers (skip if they already exist)
INSERT IGNORE INTO clinics (name, address, city, state, zip_code, phone, email, specialties, description, status, created_at, updated_at) VALUES
('MindSaid Learning Center', '654 Metro Avenue, Medical District', 'Houston', 'TX', '77001', '+1 (555) 654-3210', 'admin@mindsaidlearning.com', 'Internal Medicine,Psychiatry', 'Specialized internal medicine and mental health services', 'inactive', NOW(), NOW());

-- Insert Users for therapists and receptionists
INSERT IGNORE INTO users (id, email, password, role, first_name, last_name, phone, is_active, created_at, updated_at) VALUES
(37, 'receptionist@mindsaidlearning.com', 'password123', 'receptionist', 'Sarah', 'Johnson', '+1 5551234567', TRUE, NOW(), NOW()),
(38, 'therapist.kjaggi@mindsaidlearning.com', 'password123', 'doctor', 'Dr.', 'Kjaggi', '+1 6530 66', TRUE, NOW(), NOW()),
(39, 'therapist.johnson@mindsaidlearning.com', 'password123', 'doctor', 'Dr.', 'Johnson', '+1 5551234567', TRUE, NOW(), NOW()),
(40, 'therapist.wilson@mindsaidlearning.com', 'password123', 'doctor', 'Dr.', 'Wilson', '+1 5559876543', TRUE, NOW(), NOW()),
(41, 'therapist.smith@mindsaidlearning.com', 'password123', 'doctor', 'Dr.', 'Smith', '+1 5551112222', TRUE, NOW(), NOW()),
(42, 'therapist.brown@mindsaidlearning.com', 'password123', 'doctor', 'Dr.', 'Brown', '+1 5553334444', TRUE, NOW(), NOW());

-- Insert Therapists
INSERT INTO doctors (user_id, clinic_id, specialty, qualification, license_number, experience_years, consultation_fee, bio, status, created_at, updated_at) VALUES
(38, 1, 'Learning Therapy', 'M.Ed, PhD Psychology', 'LIC001', 15, 350.00, 'Experienced learning therapist with 15 years of practice in educational psychology', 'active', NOW(), NOW()),
(39, 1, 'Behavioral Therapy', 'M.Ed, Behavioral Psychology', 'LIC002', 12, 500.00, 'Specialist in behavioral interventions and learning support', 'active', NOW(), NOW()),
(40, 2, 'Speech Therapy', 'M.S. Speech Pathology', 'LIC003', 10, 400.00, 'Dedicated speech therapist supporting communication skills', 'active', NOW(), NOW()),
(41, 3, 'Occupational Therapy', 'M.S. Occupational Therapy', 'LIC004', 18, 600.00, 'Expert in sensory integration and motor skills development', 'active', NOW(), NOW()),
(42, 4, 'Educational Psychology', 'PhD Educational Psychology', 'LIC005', 8, 450.00, 'Learning specialist with modern educational approaches', 'active', NOW(), NOW());

-- Insert Patients
INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, gender, address, city, state, zip_code, emergency_contact, blood_group, clinic_id, status, created_at, updated_at) VALUES
('Thomas', 'Thompson', 'kjaggi+patient8@mindsalelearning.com', '+1 5557741269', '1985-03-15', 'male', '123 Patient Street', 'New York', 'NY', '10001', '+1 5557741270', 'O+', 1, 'active', '2026-02-15', NOW()),
('Larry', 'Lopez', 'kjaggi+patient@mindsalelearning.com', '+1 0286649878', '1978-07-22', 'male', '456 Lopez Avenue', 'New York', 'NY', '10002', '+1 0286649879', 'A+', 1, 'active', '2026-02-10', NOW()),
('Raymond', 'Rogers', 'kjaggi+patient7@mindsalelearning.com', '+1 4079677682', '1990-11-08', 'male', '789 Rogers Road', 'Los Angeles', 'CA', '90210', '+1 4079677683', 'B+', 2, 'active', '2026-02-08', NOW()),
('Steven', 'Torres', 'kjaggi+patient@mindsalelearning.com', '+1 7006029677', '1982-05-30', 'male', '321 Torres Lane', 'Miami', 'FL', '33101', '+1 7006029678', 'AB+', 3, 'active', '2026-02-05', NOW()),
('Maria', 'Garcia', 'maria.garcia@example.com', '+1 5551234567', '1975-12-12', 'female', '654 Garcia Street', 'Chicago', 'IL', '60601', '+1 5551234568', 'O-', 4, 'active', '2026-02-01', NOW()),
('John', 'Doe', 'john.doe@example.com', '+1 5556667777', '1988-09-20', 'male', '111 Main Street', 'Boston', 'MA', '02101', '+1 5556667778', 'A-', 1, 'active', '2026-01-28', NOW()),
('Jane', 'Smith', 'jane.smith@example.com', '+1 5558889999', '1992-04-12', 'female', '222 Oak Avenue', 'Seattle', 'WA', '98101', '+1 5558889998', 'B-', 2, 'active', '2026-01-25', NOW());

-- Insert Services
INSERT INTO services (service_id, name, description, category, price, duration, clinic_id, status, created_at, updated_at) VALUES
('GC', 'General Consultation', 'General medical consultation with experienced physicians', 'Consultation', 100.00, 30, 1, 'active', NOW(), NOW()),
('PS', 'Psychology Counseling', 'Individual psychology counseling and therapy sessions', 'Psychology Services', 200.00, 50, 1, 'active', NOW(), NOW()),
('WM', 'Weight Management Consultation', 'Comprehensive weight management and nutrition consultation', 'Weight Management', 180.00, 45, 3, 'active', NOW(), NOW()),
('DC', 'Dental Cleaning', 'Professional dental cleaning and oral hygiene', 'Dentistry', 120.00, 60, 4, 'active', NOW(), NOW()),
('LP', 'Lipid Profile', 'Complete lipid profile blood test', 'Laboratory', 80.00, 10, 2, 'active', NOW(), NOW()),
('CX', 'Chest X-Ray', 'Digital chest X-ray imaging service', 'Radiology', 100.00, 15, 2, 'active', NOW(), NOW()),
('AU', 'Abdominal Ultrasound', 'Comprehensive abdominal ultrasound examination', 'Radiology', 200.00, 45, 2, 'active', NOW(), NOW()),
('MW', 'Minor Wound Suturing', 'Professional wound suturing service for minor cuts and injuries', 'General', 150.00, 30, 2, 'active', NOW(), NOW());

-- Insert Appointments
INSERT INTO appointments (patient_id, doctor_id, clinic_id, service_id, appointment_date, appointment_time, duration, status, notes, created_at, updated_at) VALUES
(1, 1, 1, 1, '2026-02-21', '09:00:00', 30, 'scheduled', 'Follow Up Visit - Regular follow-up appointment', NOW(), NOW()),
(2, 2, 1, 2, '2026-02-22', '14:30:00', 45, 'confirmed', 'Initial Consultation - First time consultation', NOW(), NOW()),
(3, 3, 2, 3, '2026-02-23', '11:15:00', 60, 'scheduled', 'Emergency Visit - Emergency care needed', NOW(), NOW()),
(4, 4, 3, 4, '2026-02-24', '16:00:00', 20, 'completed', 'Follow-up completed successfully', NOW(), NOW()),
(5, 5, 2, 5, '2026-02-25', '10:30:00', 30, 'scheduled', 'Routine checkup appointment', NOW(), NOW()),
(6, 1, 1, 1, '2026-02-26', '15:00:00', 30, 'confirmed', 'Follow-up consultation', NOW(), NOW());

-- Insert Encounter Templates
INSERT INTO encounter_templates (name, description, category, fields, created_by, status, created_at, updated_at) VALUES
('General Consultation Template', 'Standard template for general medical consultations', 'General', '{"sections": ["Chief Complaint", "History of Present Illness", "Physical Examination", "Assessment", "Plan"]}', 37, 'active', NOW(), NOW()),
('Pediatric Consultation Template', 'Specialized template for pediatric consultations', 'Pediatrics', '{"sections": ["Chief Complaint", "Growth Assessment", "Developmental Milestones", "Physical Examination", "Immunization Status", "Plan"]}', 37, 'active', NOW(), NOW()),
('Cardiology Consultation Template', 'Template for cardiovascular consultations', 'Cardiology', '{"sections": ["Cardiac History", "Risk Factors", "Physical Examination", "ECG Findings", "Echo Results", "Treatment Plan"]}', 37, 'active', NOW(), NOW());

-- Insert Encounters
INSERT INTO encounters (patient_id, doctor_id, clinic_id, encounter_date, encounter_time, chief_complaint, history_present_illness, examination_findings, diagnosis, treatment_plan, status, created_at, updated_at) VALUES
(1, 1, 1, '2026-02-20', '09:00:00', 'Routine checkup', 'Patient reports feeling well, no specific complaints', 'Vital signs stable, no abnormal findings', 'Healthy individual, continue current lifestyle', 'Continue regular exercise and healthy diet, follow up in 6 months', 'completed', NOW(), NOW()),
(2, 2, 1, '2026-02-19', '14:30:00', 'Chest pain', 'Patient reports intermittent chest pain for 2 days', 'ECG normal, blood pressure elevated', 'Hypertension, rule out cardiac issues', 'Start antihypertensive medication, follow up in 1 week', 'completed', NOW(), NOW()),
(3, 3, 2, '2026-02-18', '11:15:00', 'Fever and cough', 'Child has fever and persistent cough for 3 days', 'Temperature 101°F, chest clear', 'Upper respiratory tract infection', 'Symptomatic treatment, rest, follow up if symptoms worsen', 'completed', NOW(), NOW()),
(4, 4, 3, '2026-02-24', '16:00:00', 'Follow-up for previous treatment', 'Patient reports improvement in symptoms', 'Healing progressing well', 'Good response to treatment', 'Continue current medication, follow up in 2 weeks', 'completed', NOW(), NOW());

-- Insert Receptionists
INSERT INTO receptionists (user_id, clinic_id, department, shift, status, created_at, updated_at) VALUES
(37, 1, 'Front Desk', 'full_day', 'active', NOW(), NOW());

-- Insert Billing Records
INSERT INTO billing_records (invoice_number, patient_id, doctor_id, clinic_id, appointment_id, service_ids, subtotal, tax_amount, total_amount, payment_status, payment_method, created_at, updated_at) VALUES
('INV-2026-001', 1, 1, 1, 1, '[1]', 350.00, 35.00, 385.00, 'paid', 'cash', NOW(), NOW()),
('INV-2026-002', 4, 4, 3, 4, '[4]', 250.00, 25.00, 275.00, 'paid', 'card', NOW(), NOW());

-- Insert Taxes
INSERT INTO taxes (name, rate, type, status, created_at, updated_at) VALUES
('GST', 10.00, 'percentage', 'active', NOW(), NOW()),
('Service Tax', 5.00, 'percentage', 'active', NOW(), NOW());