-- Add therapist_id column to kivi_programmes table
USE kivi;

ALTER TABLE kivi_programmes
ADD COLUMN therapist_id INT AFTER centre_id;

-- Add foreign key constraint
ALTER TABLE kivi_programmes
ADD FOREIGN KEY (therapist_id) REFERENCES kivi_therapists(id) ON DELETE SET NULL;

-- Show the updated table structure
DESCRIBE kivi_programmes;
