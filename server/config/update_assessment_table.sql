-- Update assessment table for new requirements
USE kivi;

-- 1. Change duration from minutes to days (update existing data)
-- Convert existing minutes to days (assuming 8 hours per day = 480 minutes)
UPDATE kivi_assessments 
SET duration = CASE 
    WHEN duration <= 480 THEN 1 
    WHEN duration <= 960 THEN 2 
    WHEN duration <= 1440 THEN 3 
    ELSE CEIL(duration / 480)
END
WHERE duration IS NOT NULL;

-- 2. Modify duration column comment to reflect days
ALTER TABLE kivi_assessments 
MODIFY COLUMN duration INT DEFAULT 1 COMMENT 'Duration in days';

-- 3. Update delivery_method to only allow Online and Offline
-- First update existing values to Online/Offline
UPDATE kivi_assessments 
SET delivery_method = CASE 
    WHEN delivery_method IN ('Digital', 'Manual Entry') THEN 'Online'
    WHEN delivery_method IN ('Paper-Based', 'Oral', 'Observation', 'Interview') THEN 'Offline'
    ELSE delivery_method
END;

-- 4. Modify the delivery_method column to only allow Online and Offline
ALTER TABLE kivi_assessments 
MODIFY COLUMN delivery_method ENUM('Online', 'Offline') DEFAULT 'Online';

-- 5. Make assessment_name nullable if we want to remove it from the form
ALTER TABLE kivi_assessments 
MODIFY COLUMN assessment_name VARCHAR(255) NULL;

-- 6. Update room field to default to 'MindSaid Learning'
UPDATE kivi_assessments 
SET room = 'MindSaid Learning' 
WHERE room IS NULL OR room = '';

-- 7. Add comment for room field
ALTER TABLE kivi_assessments 
MODIFY COLUMN room VARCHAR(50) DEFAULT 'MindSaid Learning' COMMENT 'Location - defaults to MindSaid Learning';

SELECT 'Assessment table updated successfully' as status;
