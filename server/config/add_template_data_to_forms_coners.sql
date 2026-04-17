-- Migration: Add template_data column to forms and coners tables
-- This enables the "New Report" feature to work properly by storing parsed document structure

-- Add template_data column to forms table
ALTER TABLE forms 
ADD COLUMN IF NOT EXISTS template_data LONGTEXT NULL COMMENT 'Parsed document structure (JSON) for New Report feature';

-- Add template_data column to coners table  
ALTER TABLE coners 
ADD COLUMN IF NOT EXISTS template_data LONGTEXT NULL COMMENT 'Parsed document structure (JSON) for New Report feature';

-- Verify columns were added
SELECT 
    'forms' as table_name,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'forms' 
  AND COLUMN_NAME = 'template_data'
UNION ALL
SELECT 
    'coners' as table_name,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'coners' 
  AND COLUMN_NAME = 'template_data';
