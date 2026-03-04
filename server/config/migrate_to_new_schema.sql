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
DESCRIBE users;
DESCRIBE centres;
DESCRIBE therapists;
DESCRIBE students;
DESCRIBE programmes;
DESCRIBE sessions;
DESCRIBE encounters;

-- Check if sample data was inserted
SELECT COUNT(*) as total_centres FROM centres;
SELECT COUNT(*) as total_programmes FROM programmes;
SELECT COUNT(*) as total_templates FROM encounter_templates;
SELECT COUNT(*) as total_users FROM users;

-- Display sample data
SELECT id, name, city, status FROM centres;
SELECT id, name, category, fee FROM programmes;
SELECT id, name, template_type FROM encounter_templates;
SELECT id, email, role, first_name, last_name FROM users;