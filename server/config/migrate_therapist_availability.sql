-- Migration to add availability management fields to therapists table
USE kivi;

-- Add availability management fields to therapists table
ALTER TABLE kivi_therapists
ADD COLUMN login_time TIME DEFAULT '09:00:00',
ADD COLUMN logout_time TIME DEFAULT '18:00:00',
ADD COLUMN is_available BOOLEAN DEFAULT TRUE,
ADD COLUMN last_availability_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update existing therapists with default availability
UPDATE kivi_therapists SET
  login_time = '09:00:00',
  logout_time = '18:00:00',
  is_available = TRUE
WHERE login_time IS NULL;
