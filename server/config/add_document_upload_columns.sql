-- Add document upload columns to kivi_students table
USE kivi;

-- Add document storage columns
ALTER TABLE kivi_students 
ADD COLUMN documents JSON DEFAULT NULL COMMENT 'Array of uploaded documents with base64 data and metadata';

-- Alternative approach: Add individual document columns if JSON is not preferred
-- ALTER TABLE kivi_students 
-- ADD COLUMN document1_name VARCHAR(255) DEFAULT NULL,
-- ADD COLUMN document1_type VARCHAR(100) DEFAULT NULL,
-- ADD COLUMN document1_data LONGTEXT DEFAULT NULL,
-- ADD COLUMN document2_name VARCHAR(255) DEFAULT NULL,
-- ADD COLUMN document2_type VARCHAR(100) DEFAULT NULL,
-- ADD COLUMN document2_data LONGTEXT DEFAULT NULL,
-- ADD COLUMN document3_name VARCHAR(255) DEFAULT NULL,
-- ADD COLUMN document3_type VARCHAR(100) DEFAULT NULL,
-- ADD COLUMN document3_data LONGTEXT DEFAULT NULL;

SELECT 'Document upload columns added to kivi_students table' as status;
