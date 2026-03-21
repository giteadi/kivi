-- Add final missing columns for ExamineeDetail UI
USE kivi;

-- Add groups column (using backticks to avoid reserved keyword conflict)
ALTER TABLE kivi_students ADD COLUMN `groups` VARCHAR(255) DEFAULT NULL COMMENT 'Groups or categories for examinee';

-- Add legacy ID for compatibility with old systems
ALTER TABLE kivi_students ADD COLUMN legacy_id VARCHAR(100) DEFAULT NULL COMMENT 'Legacy system ID for compatibility';

SELECT 'Final missing examinee columns added successfully' as status;
