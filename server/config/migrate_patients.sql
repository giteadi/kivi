-- Migration to add clinic_id to patients table
USE kivi;

-- Add clinic_id column if it doesn't exist
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS clinic_id INT,
ADD CONSTRAINT fk_patient_clinic 
FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE SET NULL;

-- Update existing patients with clinic associations
UPDATE patients SET clinic_id = 1 WHERE id IN (1, 2, 6);  -- Clinic Kjaggi
UPDATE patients SET clinic_id = 2 WHERE id IN (3, 7);     -- Green Valley Clinic  
UPDATE patients SET clinic_id = 3 WHERE id = 4;           -- Sunrise Health Center
UPDATE patients SET clinic_id = 4 WHERE id = 5;           -- Downtown Family Clinic