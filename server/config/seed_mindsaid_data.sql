-- MindSaid Learning - Comprehensive Seed Data
USE kivi;

-- Clear existing data (except system data)
DELETE FROM communications WHERE id > 0;
DELETE FROM student_progress WHERE id > 0;
DELETE FROM billing_records WHERE id > 0;
DELETE FROM encounters WHERE id > 0;
DELETE FROM sessions WHERE id > 0;
DELETE FROM students WHERE id > 0;
DELETE FROM therapists WHERE id > 0;
DELETE FROM staff WHERE id > 0;
DELETE FROM programmes WHERE id > 8; -- Keep the initial programmes
DELETE FROM centres WHERE id > 4; -- Keep the initial centres
DELETE FROM users WHERE id > 1; -- Keep the admin user

-- Reset auto increment
ALTER TABLE users AUTO_INCREMENT = 2;
ALTER TABLE centres AUTO_INCREMENT = 5;
ALTER TABLE therapists AUTO_INCREMENT = 1;
ALTER TABLE students AUTO_INCREMENT = 1;
ALTER TABLE staff AUTO_INCREMENT = 1;
ALTER TABLE sessions AUTO_INCREMENT = 1;
ALTER TABLE encounters AUTO_INCREMENT = 1;

-- Insert additional users for therapists and staff
INSERT INTO users (email, password, role, first_name, last_name, phone) VALUES
-- Therapists
('dr.sarah.johnson@kivicare.com', 'therapist123', 'therapist', 'Sarah', 'Johnson', '+1-555-0101'),
('dr.michael.chen@kivicare.com', 'therapist123', 'therapist', 'Michael', 'Chen', '+1-555-0102'),
('dr.emily.davis@kivicare.com', 'therapist123', 'therapist', 'Emily', 'Davis', '+1-555-0103'),
('dr.james.wilson@kivicare.com', 'therapist123', 'therapist', 'James', 'Wilson', '+1-555-0104'),
('dr.lisa.brown@kivicare.com', 'therapist123', 'therapist', 'Lisa', 'Brown', '+1-555-0105'),
('dr.david.miller@kivicare.com', 'therapist123', 'therapist', 'David', 'Miller', '+1-555-0106'),
('dr.anna.garcia@kivicare.com', 'therapist123', 'therapist', 'Anna', 'Garcia', '+1-555-0107'),
('dr.robert.taylor@kivicare.com', 'therapist123', 'therapist', 'Robert', 'Taylor', '+1-555-0108'),

-- Staff members
('staff.jennifer.white@kivicare.com', 'staff123', 'staff', 'Jennifer', 'White', '+1-555-0201'),
('staff.mark.anderson@kivicare.com', 'staff123', 'staff', 'Mark', 'Anderson', '+1-555-0202'),
('staff.susan.thomas@kivicare.com', 'staff123', 'staff', 'Susan', 'Thomas', '+1-555-0203'),
('staff.kevin.jackson@kivicare.com', 'staff123', 'staff', 'Kevin', 'Jackson', '+1-555-0204'),

-- Parents/Students (for future use)
('parent.john.smith@gmail.com', 'parent123', 'parent', 'John', 'Smith', '+1-555-0301'),
('parent.mary.jones@gmail.com', 'parent123', 'parent', 'Mary', 'Jones', '+1-555-0302'),
('parent.william.davis@gmail.com', 'parent123', 'parent', 'William', 'Davis', '+1-555-0303'),
('parent.patricia.wilson@gmail.com', 'parent123', 'parent', 'Patricia', 'Wilson', '+1-555-0304');

-- Insert therapists
INSERT INTO therapists (user_id, centre_id, employee_id, specialty, qualification, license_number, experience_years, session_fee, bio, date_of_birth, gender, address, city, state, zip_code, emergency_contact_name, emergency_contact_phone, joining_date, availability, certifications, languages, status) VALUES

(2, 1, 'TH001', 'Learning Therapy', 'M.Ed in Special Education, Ph.D in Educational Psychology', 'LT-2020-001', 8, 150.00, 'Specialized in learning disabilities and cognitive behavioral therapy for children and adolescents. Experienced in working with ADHD, dyslexia, and autism spectrum disorders.', '1985-03-15', 'female', '123 Therapist Lane, New York', 'New York', 'NY', '10001', 'Emergency Contact', '+1-555-9001', '2020-01-15', '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-15:00"]}', '["Certified Learning Therapist", "ADHD Specialist", "Autism Spectrum Specialist"]', '["English", "Spanish"]', 'active'),

(3, 1, 'TH002', 'Behavioral Therapy', 'M.A. in Clinical Psychology, Board Certified Behavior Analyst', 'BT-2019-002', 6, 175.00, 'Expert in applied behavior analysis and positive behavior interventions. Specializes in challenging behaviors and social skills development.', '1988-07-22', 'male', '456 Behavior St, New York', 'New York', 'NY', '10002', 'Emergency Contact', '+1-555-9002', '2019-03-20', '{"monday": ["10:00-18:00"], "tuesday": ["10:00-18:00"], "wednesday": ["10:00-18:00"], "thursday": ["10:00-18:00"], "friday": ["10:00-16:00"]}', '["Board Certified Behavior Analyst", "Social Skills Specialist"]', '["English", "Mandarin"]', 'active'),

(4, 2, 'TH003', 'Speech Therapy', 'M.S. in Speech-Language Pathology', 'ST-2021-003', 4, 125.00, 'Certified speech-language pathologist with expertise in articulation disorders, language delays, and communication development in children.', '1990-11-08', 'female', '789 Speech Ave, Los Angeles', 'Los Angeles', 'CA', '90210', 'Emergency Contact', '+1-555-9003', '2021-06-10', '{"monday": ["08:00-16:00"], "tuesday": ["08:00-16:00"], "wednesday": ["08:00-16:00"], "thursday": ["08:00-16:00"], "friday": ["08:00-14:00"]}', '["Certified Speech-Language Pathologist", "Early Intervention Specialist"]', '["English", "French"]', 'active'),

(5, 2, 'TH004', 'Occupational Therapy', 'M.S. in Occupational Therapy', 'OT-2018-004', 7, 140.00, 'Pediatric occupational therapist specializing in sensory processing disorders, fine motor skills, and activities of daily living.', '1986-05-30', 'male', '321 OT Boulevard, Los Angeles', 'Los Angeles', 'CA', '90211', 'Emergency Contact', '+1-555-9004', '2018-08-15', '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-15:00"]}', '["Licensed Occupational Therapist", "Sensory Integration Specialist"]', '["English", "Spanish"]', 'active'),

(6, 3, 'TH005', 'Educational Psychology', 'Ph.D in Educational Psychology', 'EP-2017-005', 10, 200.00, 'Educational psychologist with extensive experience in learning assessments, cognitive evaluations, and educational planning for students with diverse needs.', '1982-12-12', 'female', '654 Psychology Dr, Miami', 'Miami', 'FL', '33101', 'Emergency Contact', '+1-555-9005', '2017-09-01', '{"monday": ["10:00-18:00"], "tuesday": ["10:00-18:00"], "wednesday": ["10:00-18:00"], "thursday": ["10:00-18:00"], "friday": ["10:00-16:00"]}', '["Licensed Educational Psychologist", "Assessment Specialist"]', '["English", "Portuguese"]', 'active'),

(7, 3, 'TH006', 'Special Needs Support', 'M.Ed in Special Education', 'SNS-2020-006', 5, 130.00, 'Special education specialist focusing on individualized education programs, adaptive learning strategies, and inclusive education practices.', '1989-09-18', 'female', '987 Special Ed Way, Miami', 'Miami', 'FL', '33102', 'Emergency Contact', '+1-555-9006', '2020-02-14', '{"monday": ["08:00-16:00"], "tuesday": ["08:00-16:00"], "wednesday": ["08:00-16:00"], "thursday": ["08:00-16:00"], "friday": ["08:00-14:00"]}', '["Special Education Specialist", "IEP Coordinator"]', '["English", "Spanish"]', 'active'),

(8, 4, 'TH007', 'Family Counseling', 'M.A. in Marriage and Family Therapy', 'FC-2019-007', 6, 180.00, 'Licensed family therapist specializing in family dynamics, parent-child relationships, and family support for children with learning differences.', '1987-04-25', 'male', '147 Family Circle, Chicago', 'Chicago', 'IL', '60601', 'Emergency Contact', '+1-555-9007', '2019-05-20', '{"monday": ["11:00-19:00"], "tuesday": ["11:00-19:00"], "wednesday": ["11:00-19:00"], "thursday": ["11:00-19:00"], "friday": ["11:00-17:00"]}', '["Licensed Marriage and Family Therapist", "Parent Training Specialist"]', '["English"]', 'active'),

(9, 4, 'TH008', 'Child Development', 'M.S. in Child Development', 'CD-2021-008', 3, 145.00, 'Child development specialist with expertise in early childhood development, developmental assessments, and intervention planning for young children.', '1992-01-10', 'male', '258 Development St, Chicago', 'Chicago', 'IL', '60602', 'Emergency Contact', '+1-555-9008', '2021-01-25', '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-15:00"]}', '["Child Development Specialist", "Early Intervention Certified"]', '["English", "German"]', 'active');

-- Insert staff members
INSERT INTO staff (user_id, centre_id, employee_id, department, position, shift, salary, date_of_birth, gender, address, city, state, zip_code, emergency_contact_name, emergency_contact_phone, joining_date, permissions, status) VALUES

(10, 1, 'ST001', 'Front Desk', 'Receptionist', 'full_day', 35000.00, '1990-06-15', 'female', '111 Staff St, New York', 'New York', 'NY', '10001', 'Emergency Contact', '+1-555-8001', '2020-03-01', '["schedule_sessions", "view_students", "manage_billing"]', 'active'),

(11, 2, 'ST002', 'Student Registration', 'Registration Coordinator', 'morning', 40000.00, '1988-09-22', 'male', '222 Admin Ave, Los Angeles', 'Los Angeles', 'CA', '90210', 'Emergency Contact', '+1-555-8002', '2019-07-15', '["register_students", "manage_records", "generate_reports"]', 'active'),

(12, 3, 'ST003', 'Session Scheduling', 'Scheduling Coordinator', 'full_day', 38000.00, '1985-12-03', 'female', '333 Schedule Blvd, Miami', 'Miami', 'FL', '33101', 'Emergency Contact', '+1-555-8003', '2018-11-20', '["schedule_sessions", "manage_calendar", "send_reminders"]', 'active'),

(13, 4, 'ST004', 'Billing', 'Billing Specialist', 'morning', 42000.00, '1987-03-28', 'male', '444 Billing Dr, Chicago', 'Chicago', 'IL', '60601', 'Emergency Contact', '+1-555-8004', '2020-08-10', '["manage_billing", "process_payments", "generate_invoices"]', 'active');

-- Insert students
INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth, age, gender, address, city, state, zip_code, centre_id, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, learning_needs, support_requirements, current_programmes, learning_goals, parent_guardian_name, parent_guardian_phone, parent_guardian_email, parent_guardian_relation, registration_date, status) VALUES

('ST001', 'Emma', 'Thompson', 'kjaggi+student1@kivicare.com', '+1-555-7001', '2010-03-15', 14, 'female', '100 Student Lane, New York', 'New York', 'NY', '10001', 1, 'Sarah Thompson', '+1-555-7101', 'Mother', 'Reading comprehension difficulties, attention challenges', 'Individual attention, visual learning aids, frequent breaks', '["Learning Support Session", "Behavioral Assessment"]', 'Improve reading fluency and attention span', 'Sarah Thompson', '+1-555-7101', 'sarah.thompson@email.com', 'Mother', '2023-01-15', 'active'),

('ST002', 'Liam', 'Rodriguez', 'kjaggi+student2@kivicare.com', '+1-555-7002', '2012-07-22', 12, 'male', '200 Learning St, New York', 'New York', 'NY', '10002', 1, 'Maria Rodriguez', '+1-555-7102', 'Mother', 'Math anxiety, processing speed delays', 'Step-by-step instructions, extra time for tasks', '["Learning Support Session"]', 'Build confidence in mathematics and improve processing speed', 'Carlos Rodriguez', '+1-555-7102', 'carlos.rodriguez@email.com', 'Father', '2023-02-20', 'active'),

('ST003', 'Sophia', 'Anderson', 'kjaggi+student3@kivicare.com', '+1-555-7003', '2008-11-08', 15, 'female', '300 Education Ave, Los Angeles', 'Los Angeles', 'CA', '90210', 2, 'Jennifer Anderson', '+1-555-7103', 'Mother', 'Speech articulation issues, social communication challenges', 'Speech therapy, social skills practice', '["Speech Therapy", "Group Social Skills"]', 'Improve speech clarity and social interaction skills', 'Jennifer Anderson', '+1-555-7103', 'jennifer.anderson@email.com', 'Mother', '2023-01-10', 'active'),

('ST004', 'Noah', 'Chen', 'kjaggi+student4@kivicare.com', '+1-555-7004', '2011-05-30', 13, 'male', '400 Therapy Blvd, Los Angeles', 'Los Angeles', 'CA', '90211', 2, 'Lisa Chen', '+1-555-7104', 'Mother', 'Fine motor skill delays, sensory processing issues', 'Occupational therapy, sensory breaks', '["Occupational Therapy"]', 'Develop fine motor skills and sensory regulation', 'Michael Chen', '+1-555-7104', 'michael.chen@email.com', 'Father', '2023-03-05', 'active'),

('ST005', 'Ava', 'Williams', 'kjaggi+student5@kivicare.com', '+1-555-7005', '2009-12-12', 14, 'female', '500 Assessment Dr, Miami', 'Miami', 'FL', '33101', 3, 'Amanda Williams', '+1-555-7105', 'Mother', 'Learning disabilities, executive functioning challenges', 'Educational psychology support, organizational strategies', '["Educational Psychology"]', 'Improve executive functioning and academic performance', 'Amanda Williams', '+1-555-7105', 'amanda.williams@email.com', 'Mother', '2023-02-28', 'active'),

('ST006', 'Ethan', 'Davis', 'kjaggi+student6@kivicare.com', '+1-555-7006', '2013-09-18', 11, 'male', '600 Special Needs Way, Miami', 'Miami', 'FL', '33102', 3, 'Rebecca Davis', '+1-555-7106', 'Mother', 'Autism spectrum disorder, communication delays', 'Special needs support, structured environment', '["Special Needs Support"]', 'Improve communication skills and adaptive behaviors', 'Rebecca Davis', '+1-555-7106', 'rebecca.davis@email.com', 'Mother', '2023-04-12', 'active'),

('ST007', 'Mia', 'Johnson', 'kjaggi+student7@kivicare.com', '+1-555-7007', '2010-04-25', 14, 'female', '700 Family Circle, Chicago', 'Chicago', 'IL', '60601', 4, 'Patricia Johnson', '+1-555-7107', 'Mother', 'Behavioral challenges, family dynamics issues', 'Family counseling, behavioral interventions', '["Family Counseling"]', 'Improve family relationships and behavioral regulation', 'Patricia Johnson', '+1-555-7107', 'patricia.johnson@email.com', 'Mother', '2023-01-20', 'active'),

('ST008', 'Lucas', 'Brown', 'kjaggi+student8@kivicare.com', '+1-555-7008', '2014-01-10', 10, 'male', '800 Development St, Chicago', 'Chicago', 'IL', '60602', 4, 'Michelle Brown', '+1-555-7108', 'Mother', 'Developmental delays, early intervention needs', 'Child development support, developmental activities', '["Child Development Assessment"]', 'Support overall development and school readiness', 'Michelle Brown', '+1-555-7108', 'michelle.brown@email.com', 'Mother', '2023-03-15', 'active'),

('ST009', 'Isabella', 'Wilson', 'kjaggi+student9@kivicare.com', '+1-555-7009', '2011-08-14', 13, 'female', '900 Learning Path, New York', 'New York', 'NY', '10003', 1, 'Karen Wilson', '+1-555-7109', 'Mother', 'ADHD, attention and focus difficulties', 'Behavioral therapy, attention training', '["Behavioral Therapy", "Learning Support Session"]', 'Improve attention span and academic focus', 'Karen Wilson', '+1-555-7109', 'karen.wilson@email.com', 'Mother', '2023-02-10', 'active'),

('ST010', 'Mason', 'Garcia', 'kjaggi+student10@kivicare.com', '+1-555-7010', '2012-06-05', 12, 'male', '1000 Therapy Lane, Los Angeles', 'Los Angeles', 'CA', '90212', 2, 'Rosa Garcia', '+1-555-7110', 'Mother', 'Language delays, bilingual language development', 'Speech therapy, bilingual support', '["Speech Therapy"]', 'Develop language skills in both English and Spanish', 'Rosa Garcia', '+1-555-7110', 'rosa.garcia@email.com', 'Mother', '2023-04-01', 'active');

-- Insert sample sessions
INSERT INTO sessions (session_id, student_id, therapist_id, centre_id, programme_id, session_date, session_time, duration, session_type, status, notes, session_goals, room_number) VALUES

('SES001', 1, 1, 1, 1, '2024-03-05', '09:00:00', 30, 'individual', 'scheduled', 'First session focusing on reading assessment', 'Assess current reading level and identify specific challenges', 'Room 101'),
('SES002', 2, 1, 1, 1, '2024-03-05', '10:00:00', 30, 'individual', 'scheduled', 'Math anxiety intervention session', 'Introduce relaxation techniques for math tasks', 'Room 101'),
('SES003', 3, 3, 2, 3, '2024-03-05', '11:00:00', 30, 'individual', 'confirmed', 'Speech articulation practice', 'Work on /r/ and /l/ sound production', 'Room 201'),
('SES004', 4, 4, 2, 4, '2024-03-05', '14:00:00', 45, 'individual', 'scheduled', 'Fine motor skills development', 'Practice handwriting and cutting skills', 'Room 202'),
('SES005', 5, 5, 3, 5, '2024-03-06', '09:00:00', 50, 'individual', 'scheduled', 'Educational psychology assessment', 'Conduct cognitive and academic assessments', 'Room 301'),
('SES006', 6, 6, 3, 1, '2024-03-06', '10:30:00', 30, 'individual', 'confirmed', 'Special needs support session', 'Work on communication and social skills', 'Room 302'),
('SES007', 7, 7, 4, 6, '2024-03-06', '15:00:00', 60, 'individual', 'scheduled', 'Family counseling session', 'Address behavioral challenges at home', 'Room 401'),
('SES008', 8, 8, 4, 7, '2024-03-07', '09:00:00', 90, 'individual', 'scheduled', 'Comprehensive development assessment', 'Evaluate developmental milestones', 'Room 402'),
('SES009', 9, 2, 1, 2, '2024-03-07', '11:00:00', 45, 'individual', 'confirmed', 'ADHD behavioral assessment', 'Assess attention and behavioral patterns', 'Room 103'),
('SES010', 10, 3, 2, 3, '2024-03-07', '14:00:00', 30, 'individual', 'scheduled', 'Bilingual speech therapy', 'Work on English and Spanish language skills', 'Room 203');

-- Insert sample encounters (session reports)
INSERT INTO encounters (encounter_id, session_id, student_id, therapist_id, centre_id, template_id, encounter_date, encounter_time, encounter_type, session_goals, activities_conducted, student_response, progress_notes, recommendations, next_session_plan, completion_percentage, status) VALUES

('ENC001', 1, 1, 1, 1, 1, '2024-03-05', '09:00:00', 'session_report', 'Assess current reading level and identify specific challenges', 'Reading assessment using standardized tools, phonics evaluation, comprehension tasks', 'Student showed good effort but struggled with multi-syllabic words and reading comprehension', 'Reading level assessed at grade 4.2, needs support with decoding strategies and comprehension skills', 'Continue with phonics-based interventions, introduce graphic organizers for comprehension', 'Focus on consonant blends and sight word recognition', 100, 'completed'),

('ENC002', 3, 3, 3, 2, 1, '2024-03-05', '11:00:00', 'session_report', 'Work on /r/ and /l/ sound production', 'Articulation exercises, tongue placement practice, word-level practice with target sounds', 'Student demonstrated good understanding of tongue placement, achieved 70% accuracy at word level', 'Significant improvement in /r/ sound production, /l/ sound still needs work', 'Continue with /l/ sound practice, introduce sentence-level practice for /r/ sound', 'Practice /l/ sound in different word positions', 100, 'completed'),

('ENC003', 6, 6, 6, 3, 1, '2024-03-06', '10:30:00', 'session_report', 'Work on communication and social skills', 'Social stories, role-playing activities, communication board practice', 'Student engaged well with visual supports, showed improvement in requesting help', 'Better use of communication strategies, increased eye contact during interactions', 'Expand vocabulary on communication board, practice social greetings', 'Focus on peer interaction skills and turn-taking', 100, 'completed');

-- Insert sample billing records
INSERT INTO billing_records (invoice_number, student_id, therapist_id, centre_id, session_id, programme_ids, subtotal, tax_amount, total_amount, payment_status, due_date) VALUES

('INV-2024-001', 1, 1, 1, 1, '[1]', 150.00, 27.00, 177.00, 'pending', '2024-03-20'),
('INV-2024-002', 3, 3, 2, 3, '[3]', 100.00, 18.00, 118.00, 'paid', '2024-03-20'),
('INV-2024-003', 6, 6, 3, 6, '[1]', 150.00, 27.00, 177.00, 'pending', '2024-03-21'),
('INV-2024-004', 7, 7, 4, 7, '[6]', 200.00, 36.00, 236.00, 'pending', '2024-03-21');

-- Insert sample student progress records
INSERT INTO student_progress (student_id, therapist_id, programme_id, assessment_date, progress_type, learning_goals_met, skill_improvements, behavioral_changes, academic_progress, attention_rating, participation_rating, cooperation_rating, progress_rating, recommendations, next_goals) VALUES

(1, 1, 1, '2024-03-01', 'monthly', '["Phonics awareness: 75%", "Reading fluency: 60%", "Comprehension: 50%"]', '{"decoding": "improved", "sight_words": "significant_improvement", "comprehension": "needs_work"}', 'Increased confidence in reading tasks, less avoidance behavior', 'Reading level improved from 3.8 to 4.2 grade equivalent', 7, 8, 9, 7, 'Continue phonics-based approach, add more comprehension strategies', 'Achieve 80% accuracy in phonics tasks, improve reading comprehension to grade level'),

(3, 3, 3, '2024-03-01', 'monthly', '["Sound production /r/: 70%", "Sound production /l/: 40%", "Sentence level practice: 30%"]', '{"articulation": "good_progress", "intelligibility": "improved", "confidence": "increased"}', 'More willing to speak in group settings, increased verbal participation', 'Speech intelligibility improved from 60% to 75%', 8, 9, 8, 8, 'Continue articulation therapy, add social communication goals', 'Achieve 80% accuracy for /l/ sound, practice conversational speech'),

(6, 6, 1, '2024-03-01', 'monthly', '["Communication requests: 80%", "Social greetings: 60%", "Turn-taking: 50%"]', '{"communication": "significant_improvement", "social_skills": "progressing", "attention": "improved"}', 'Decreased challenging behaviors, increased appropriate communication', 'Better engagement in learning activities, following 2-step instructions', 6, 7, 8, 7, 'Expand communication opportunities, work on peer interactions', 'Increase spontaneous communication, improve peer social skills');

-- Insert sample communications
INSERT INTO communications (student_id, sender_id, receiver_id, communication_type, subject, message, priority, is_read, response_required) VALUES

(1, 1, 14, 'email', 'Emma Thompson - Weekly Progress Update', 'Emma has shown great improvement in her reading skills this week. She is becoming more confident with phonics and is starting to tackle longer words. Please continue practicing sight words at home.', 'medium', FALSE, FALSE),

(3, 3, 15, 'note', 'Sophia Anderson - Speech Therapy Progress', 'Sophia made excellent progress today with her /r/ sound production. She achieved 70% accuracy at the word level. Please encourage her to practice the exercises we discussed during our parent meeting.', 'medium', TRUE, FALSE),

(6, 6, 16, 'email', 'Ethan Davis - Behavioral Strategies Update', 'Ethan responded very well to the new visual schedule we implemented. His communication attempts have increased significantly. I recommend continuing with the same strategies at home and school.', 'high', FALSE, TRUE);

-- Update system settings with current data
UPDATE system_settings SET setting_value = '15' WHERE setting_key = 'default_session_duration';
UPDATE system_settings SET setting_value = 'KiviCare - Educational Therapy Management' WHERE setting_key = 'system_name';

-- Verify data insertion
SELECT 'Data insertion completed successfully' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_therapists FROM therapists;
SELECT COUNT(*) as total_students FROM students;
SELECT COUNT(*) as total_staff FROM staff;
SELECT COUNT(*) as total_sessions FROM sessions;
SELECT COUNT(*) as total_encounters FROM encounters;
SELECT COUNT(*) as total_billing_records FROM billing_records;