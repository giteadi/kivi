-- Add holiday and halfday event types to calendar_events table
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
) DEFAULT 'assessment';
