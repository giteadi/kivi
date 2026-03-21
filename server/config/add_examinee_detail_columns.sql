-- Add missing columns for ExamineeDetail UI
-- Migration script for kivi_students table

USE kivi;

-- Add custom fields for examinee detail screen
ALTER TABLE kivi_students 
ADD COLUMN IF NOT EXISTS custom_field_1 VARCHAR(255) DEFAULT NULL COMMENT 'Custom field 1 for examinee details',
ADD COLUMN IF NOT EXISTS custom_field_2 VARCHAR(255) DEFAULT NULL COMMENT 'Custom field 2 for examinee details',
ADD COLUMN IF NOT EXISTS custom_field_3 VARCHAR(255) DEFAULT NULL COMMENT 'Custom field 3 for examinee details',
ADD COLUMN IF NOT EXISTS custom_field_4 VARCHAR(255) DEFAULT NULL COMMENT 'Custom field 4 for examinee details';

-- Add groups column for examinee categorization
ALTER TABLE kivi_students 
ADD COLUMN IF NOT EXISTS groups VARCHAR(255) DEFAULT NULL COMMENT 'Groups or categories for examinee';

-- Add legacy ID for compatibility with old systems
ALTER TABLE kivi_students 
ADD COLUMN IF NOT EXISTS legacy_id VARCHAR(100) DEFAULT NULL COMMENT 'Legacy system ID for compatibility';

-- Add account holder information columns (for completeness)
ALTER TABLE kivi_students 
ADD COLUMN IF NOT EXISTS account_email VARCHAR(255) DEFAULT NULL COMMENT 'Account holder email',
ADD COLUMN IF NOT EXISTS account_phone VARCHAR(20) DEFAULT NULL COMMENT 'Account holder phone';

-- Update the getStudentWithSessions method to include centre_name
-- This will be handled in the model, but adding a note here for reference

SELECT 'Examinee detail columns added successfully' as status;
