-- Migration Script: Old KiviCare to New MindSaid Learning Schema
-- This script will backup existing data (if any) and create the new schema

-- Step 1: Backup existing data (optional - uncomment if you want to preserve data)
-- CREATE DATABASE IF NOT EXISTS kivi_backup;
-- CREATE TABLE kivi_backup.users_backup AS SELECT * FROM kivi.users;
-- CREATE TABLE kivi_backup.clinics_backup AS SELECT * FROM kivi.clinics;
-- CREATE TABLE kivi_backup.doctors_backup AS SELECT * FROM kivi.doctors;
-- CREATE TABLE kivi_backup.patients_backup AS SELECT * FROM kivi.patients;
-- CREATE TABLE kivi_backup.appointments_backup AS SELECT * FROM kivi.appointments;
-- CREATE TABLE kivi_backup.services_backup AS SELECT * FROM kivi.services;

-- Step 2: Drop old database
DROP DATABASE IF EXISTS kivi;

-- Step 3: Create new database with updated schema
-- (The new_database.sql content will be executed separately)

-- Step 4: Verify new schema
USE kivi;

-- Show all tables in new database
SHOW TABLES;

-- Verify key tables structure
DESCRIBE kivi_users;
DESCRIBE kivi_centres;
DESCRIBE kivi_therapists;
DESCRIBE kivi_students;
DESCRIBE kivi_programmes;
DESCRIBE kivi_sessions;
DESCRIBE kivi_encounters;

-- Check if sample data was inserted
SELECT COUNT(*) as total_centres FROM kivi_centres;
SELECT COUNT(*) as total_programmes FROM kivi_programmes;
SELECT COUNT(*) as total_templates FROM kivi_encounter_templates;
SELECT COUNT(*) as total_users FROM kivi_users;

-- Display sample data
SELECT id, name, city, status FROM kivi_centres;
SELECT id, name, category, fee FROM kivi_programmes;
SELECT id, name, template_type FROM kivi_encounter_templates;
SELECT id, email, role, first_name, last_name FROM kivi_users;