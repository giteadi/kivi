-- Add updated_at column to kivi_programmes table
USE kivi;

ALTER TABLE kivi_programmes
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Show the updated table structure
DESCRIBE kivi_programmes;
