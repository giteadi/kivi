-- Add price column to kivi_assessments table
USE kivi;

-- Add price column (check if exists first)
SET @exists = (SELECT COUNT(*) FROM information_schema.columns 
               WHERE table_schema = 'kivi' 
               AND table_name = 'kivi_assessments' 
               AND column_name = 'price');

SET @sql = IF(@exists = 0, 
              'ALTER TABLE kivi_assessments ADD COLUMN price DECIMAL(10,2) DEFAULT 5500.00',
              'SELECT "Price column already exists" as message');
              
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing records with default price
UPDATE kivi_assessments 
SET price = 5500.00 
WHERE price IS NULL;

SELECT 'Price column added/updated in kivi_assessments' as status;
