-- Add missing columns to kivi_centres table
ALTER TABLE kivi_centres ADD COLUMN parking_available TINYINT(1) DEFAULT 0;
ALTER TABLE kivi_centres ADD COLUMN wheelchair_accessible TINYINT(1) DEFAULT 0;
