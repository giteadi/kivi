-- Update calendar_events table to add holiday event types
-- Run this in MySQL after selecting the kivi database

USE kivi;

-- First check current event_type column
SHOW COLUMNS FROM calendar_events LIKE 'event_type';

-- Update the event_type ENUM to include all event types
ALTER TABLE calendar_events 
MODIFY COLUMN event_type ENUM(
    'assessment', 
    'therapy', 
    'evaluation', 
    'followup', 
    'meeting',
    'ot_si',
    'speech',
    'behaviour',
    'counselling',
    'holiday',
    'halfday'
) DEFAULT 'ot_si';

-- Verify the change
SHOW COLUMNS FROM calendar_events LIKE 'event_type';

-- Show success message
SELECT '✅ Calendar event types updated successfully!' AS Status;
SELECT 'Event types now include: assessment, therapy, evaluation, followup, meeting, ot_si, speech, behaviour, counselling, holiday, halfday' AS Info;
