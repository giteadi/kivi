--- Add missing school_name, grade, and middle_name columns to kivi_students
--- These fields are used in the examinee edit form

USE kivi;

--- Add middle_name column if it doesn't exist
ALTER TABLE kivi_students 
ADD COLUMN IF NOT EXISTS middle_name VARCHAR(100) DEFAULT NULL COMMENT 'Middle name of the student';

--- Add school_name column if it doesn't exist
ALTER TABLE kivi_students 
ADD COLUMN IF NOT EXISTS school_name VARCHAR(255) DEFAULT NULL COMMENT 'Name of the school the student attends';

--- Add grade column if it doesn't exist
ALTER TABLE kivi_students 
ADD COLUMN IF NOT EXISTS grade VARCHAR(50) DEFAULT NULL COMMENT 'Current grade/class of the student';

--- Show the updated table structure
DESCRIBE kivi_students;

SELECT 'School name, grade, and middle_name columns added successfully' as status;
