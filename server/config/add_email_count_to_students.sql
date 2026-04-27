-- Add email count tracking for examinees
USE kivi;

-- Add email_count column to track how many times emails have been sent to this examinee
ALTER TABLE kivi_students 
ADD COLUMN IF NOT EXISTS email_count INT DEFAULT 0 COMMENT 'Count of emails sent to this examinee',
ADD COLUMN IF NOT EXISTS last_email_sent_date TIMESTAMP NULL COMMENT 'Date when last email was sent',
ADD COLUMN IF NOT EXISTS email_history JSON DEFAULT NULL COMMENT 'History of emails sent with dates and types';

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_email_count ON kivi_students(email_count);

SELECT 'Email count columns added to kivi_students table' as status;
