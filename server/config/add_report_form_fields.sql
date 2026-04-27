-- Add Report Form fields to kivi_students table
-- This migration adds all the fields needed for the ExamineeReportForm component
-- MySQL doesn't support IF NOT EXISTS with ADD COLUMN, so we use a stored procedure

DELIMITER $$

DROP PROCEDURE IF EXISTS add_report_form_columns$$

CREATE PROCEDURE add_report_form_columns()
BEGIN
    -- Section I: Identifying Information fields
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'nationality') THEN
        ALTER TABLE kivi_students ADD COLUMN nationality VARCHAR(100) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'handedness') THEN
        ALTER TABLE kivi_students ADD COLUMN handedness VARCHAR(20) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'school_category') THEN
        ALTER TABLE kivi_students ADD COLUMN school_category VARCHAR(50) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'mother_tongue') THEN
        ALTER TABLE kivi_students ADD COLUMN mother_tongue VARCHAR(50) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'language_home') THEN
        ALTER TABLE kivi_students ADD COLUMN language_home VARCHAR(50) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'referred_by') THEN
        ALTER TABLE kivi_students ADD COLUMN referred_by VARCHAR(100) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'previous_reports') THEN
        ALTER TABLE kivi_students ADD COLUMN previous_reports TEXT DEFAULT NULL;
    END IF;

    -- Father details
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'father_name') THEN
        ALTER TABLE kivi_students ADD COLUMN father_name VARCHAR(100) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'father_phone') THEN
        ALTER TABLE kivi_students ADD COLUMN father_phone VARCHAR(20) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'father_email') THEN
        ALTER TABLE kivi_students ADD COLUMN father_email VARCHAR(255) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'father_education') THEN
        ALTER TABLE kivi_students ADD COLUMN father_education VARCHAR(100) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'father_profession') THEN
        ALTER TABLE kivi_students ADD COLUMN father_profession VARCHAR(100) DEFAULT NULL;
    END IF;

    -- Mother details
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'mother_name') THEN
        ALTER TABLE kivi_students ADD COLUMN mother_name VARCHAR(100) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'mother_phone') THEN
        ALTER TABLE kivi_students ADD COLUMN mother_phone VARCHAR(20) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'mother_email') THEN
        ALTER TABLE kivi_students ADD COLUMN mother_email VARCHAR(255) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'mother_education') THEN
        ALTER TABLE kivi_students ADD COLUMN mother_education VARCHAR(100) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'mother_profession') THEN
        ALTER TABLE kivi_students ADD COLUMN mother_profession VARCHAR(100) DEFAULT NULL;
    END IF;

    -- Form details
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'form_completed_by') THEN
        ALTER TABLE kivi_students ADD COLUMN form_completed_by VARCHAR(100) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'residence_address') THEN
        ALTER TABLE kivi_students ADD COLUMN residence_address TEXT DEFAULT NULL;
    END IF;

    -- Section II-VII: JSON fields for complex data
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'report_form_data') THEN
        ALTER TABLE kivi_students ADD COLUMN report_form_data JSON DEFAULT NULL COMMENT 'Full report form data backup';
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'academic_concerns') THEN
        ALTER TABLE kivi_students ADD COLUMN academic_concerns JSON DEFAULT NULL COMMENT 'Section II: Academic Concerns';
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'family_history') THEN
        ALTER TABLE kivi_students ADD COLUMN family_history JSON DEFAULT NULL COMMENT 'Section III: Family History';
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'medical_history') THEN
        ALTER TABLE kivi_students ADD COLUMN medical_history JSON DEFAULT NULL COMMENT 'Section IV: Medical History';
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'educational_history') THEN
        ALTER TABLE kivi_students ADD COLUMN educational_history JSON DEFAULT NULL COMMENT 'Section V: Educational History';
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'behaviour_data') THEN
        ALTER TABLE kivi_students ADD COLUMN behaviour_data JSON DEFAULT NULL COMMENT 'Section VI: Behaviour Data';
    END IF;
    
    IF NOT EXISTS (SELECT * FROM information_schema.columns 
                   WHERE table_schema = 'kivi' AND table_name = 'kivi_students' AND column_name = 'other_info') THEN
        ALTER TABLE kivi_students ADD COLUMN other_info JSON DEFAULT NULL COMMENT 'Section VII: Other Information';
    END IF;
END$$

DELIMITER ;

-- Execute the stored procedure
CALL add_report_form_columns();

-- Drop the stored procedure
DROP PROCEDURE IF EXISTS add_report_form_columns;
