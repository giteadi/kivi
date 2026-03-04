-- Insert dummy data for KiviCare database
USE kivi;

-- Insert Patients (using INSERT IGNORE to avoid duplicates)
INSERT IGNORE INTO patients (id, first_name, last_name, email, phone, date_of_birth, gender, address, city, state, zip_code, emergency_contact, blood_group, status, created_at, updated_at) VALUES
(1, 'Thomas', 'Thompson', 'kjaggi+patient8@mindsalelearning.com', '+1 5557741269', '1985-03-15', 'male', '123 Patient Street', 'New York', 'NY', '10001', '+1 5557741270', 'O+', 'active', '2026-02-15', NOW()),
(2, 'Larry', 'Lopez', 'kjaggi+patient@mindsalelearning.com', '+1 0286649878', '1978-07-22', 'male', '456 Lopez Avenue', 'New York', 'NY', '10002', '+1 0286649879', 'A+', 'active', '2026-02-10', NOW()),
(3, 'Raymond', 'Rogers', 'kjaggi+patient7@mindsalelearning.com', '+1 4079677682', '1990-11-08', 'male', '789 Rogers Road', 'Los Angeles', 'CA', '90210', '+1 4079677683', 'B+', 'active', '2026-02-08', NOW()),
(4, 'Steven', 'Torres', 'kjaggi+patient@mindsalelearning.com', '+1 7006029677', '1982-05-30', 'male', '321 Torres Lane', 'Miami', 'FL', '33101', '+1 7006029678', 'AB+', 'inactive', '2026-02-05', NOW()),
(5, 'Maria', 'Garcia', 'maria.garcia@example.com', '+1 5551234567', '1975-12-12', 'female', '654 Garcia Street', 'Chicago', 'IL', '60601', '+1 5551234568', 'O-', 'active', '2026-02-01', NOW());

-- Insert Doctors (using existing user IDs 38-42)
INSERT IGNORE INTO doctors (id, user_id, clinic_id, specialty, qualification, license_number, experience_years, consultation_fee, bio, status, created_at, updated_at) VALUES
(1, 38, 1, 'General Medicine', 'MBBS, MD', 'LIC001', 15, 350.00, 'Experienced general physician with 15 years of practice', 'active', NOW(), NOW()),
(2, 39, 1, 'Cardiology', 'MBBS, DM Cardiology', 'LIC002', 12, 500.00, 'Specialist in cardiovascular diseases and treatments', 'active', NOW(), NOW()),
(3, 40, 2, 'Pediatrics', 'MBBS, MD Pediatrics', 'LIC003', 10, 400.00, 'Dedicated pediatrician caring for children\'s health', 'active', NOW(), NOW()),
(4, 41, 3, 'Orthopedics', 'MBBS, MS Orthopedics', 'LIC004', 18, 600.00, 'Expert in bone and joint treatments', 'active', NOW(), NOW()),
(5, 42, 4, 'Dermatology', 'MBBS, MD Dermatology', 'LIC005', 8, 450.00, 'Skin care specialist with modern treatment approaches', 'active', NOW(), NOW());

-- Insert Appointments
INSERT IGNORE INTO appointments (id, patient_id, doctor_id, clinic_id, service_id, appointment_date, appointment_time, duration, status, notes, created_at, updated_at) VALUES
(1, 1, 1, 1, 1, '2026-02-21', '09:00:00', 30, 'scheduled', 'Regular follow-up appointment', NOW(), NOW()),
(2, 2, 2, 1, 2, '2026-02-22', '14:30:00', 45, 'confirmed', 'First time consultation', NOW(), NOW()),
(3, 3, 3, 2, 3, '2026-02-23', '11:15:00', 60, 'scheduled', 'Emergency care needed', NOW(), NOW()),
(4, 4, 4, 3, 4, '2026-02-24', '16:00:00', 20, 'completed', 'Follow-up completed successfully', NOW(), NOW());

-- Insert Encounter Templates
INSERT IGNORE INTO encounter_templates (id, name, description, category, fields, created_by, status, created_at, updated_at) VALUES
(1, 'General Consultation Template', 'Standard template for general medical consultations', 'General', '{"sections": ["Chief Complaint", "History of Present Illness", "Physical Examination", "Assessment", "Plan"]}', 37, 'active', NOW(), NOW()),
(2, 'Pediatric Consultation Template', 'Specialized template for pediatric consultations', 'Pediatrics', '{"sections": ["Chief Complaint", "Growth Assessment", "Developmental Milestones", "Physical Examination", "Immunization Status", "Plan"]}', 37, 'active', NOW(), NOW()),
(3, 'Cardiology Consultation Template', 'Template for cardiovascular consultations', 'Cardiology', '{"sections": ["Cardiac History", "Risk Factors", "Physical Examination", "ECG Findings", "Echo Results", "Treatment Plan"]}', 37, 'active', NOW(), NOW());

-- Insert Encounters
INSERT IGNORE INTO encounters (id, patient_id, doctor_id, clinic_id, encounter_date, encounter_time, chief_complaint, history_present_illness, examination_findings, diagnosis, treatment_plan, status, created_at, updated_at) VALUES
(1, 1, 1, 1, '2026-02-21', '09:00:00', 'Routine checkup', 'Patient reports feeling well, no specific complaints', 'Vital signs stable, no abnormal findings', 'Healthy individual, continue current lifestyle', 'Continue regular exercise and healthy diet, follow up in 6 months', 'completed', NOW(), NOW()),
(2, 4, 4, 3, '2026-02-24', '16:00:00', 'Follow-up for previous treatment', 'Patient reports improvement in symptoms', 'Healing progressing well', 'Good response to treatment', 'Continue current medication, follow up in 2 weeks', 'completed', NOW(), NOW());

-- Insert Receptionists
INSERT IGNORE INTO receptionists (id, user_id, clinic_id, department, shift, status, created_at, updated_at) VALUES
(1, 37, 1, 'Front Desk', 'full_day', 'active', NOW(), NOW());

-- Insert Billing Records
INSERT IGNORE INTO billing_records (id, invoice_number, patient_id, doctor_id, clinic_id, appointment_id, service_ids, subtotal, tax_amount, total_amount, payment_status, payment_method, created_at, updated_at) VALUES
(1, 'INV-2026-001', 1, 1, 1, 1, '[1]', 350.00, 35.00, 385.00, 'paid', 'cash', NOW(), NOW()),
(2, 'INV-2026-002', 4, 4, 3, 4, '[4]', 250.00, 25.00, 275.00, 'paid', 'card', NOW(), NOW());