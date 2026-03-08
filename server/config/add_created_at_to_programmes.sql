-- Add created_at column to kivi_programmes table
USE kivi;

-- Check if column exists before adding
SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'kivi'
  AND TABLE_NAME = 'kivi_programmes'
  AND COLUMN_NAME = 'created_at'
);

SET @sql = IF(@column_exists = 0, 
  'ALTER TABLE kivi_programmes ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER programme_image',
  'SELECT "created_at column already exists" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Show the updated table structure
DESCRIBE kivi_programmes;
