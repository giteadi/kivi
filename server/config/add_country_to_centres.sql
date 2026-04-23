-- Add country column to kivi_centres table
ALTER TABLE kivi_centres ADD COLUMN country VARCHAR(100) DEFAULT 'India' AFTER zip_code;

-- Update existing records to have India as default country
UPDATE kivi_centres SET country = 'India' WHERE country IS NULL OR country = '';
