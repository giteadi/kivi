-- Migration: Add service requirement columns to kivi_students table
-- This adds requires_assessment and requires_therapy fields

ALTER TABLE kivi_students 
ADD COLUMN requires_assessment BOOLEAN DEFAULT FALSE COMMENT 'Student requires psycho-educational assessment',
ADD COLUMN requires_therapy BOOLEAN DEFAULT FALSE COMMENT 'Student requires remedial therapy';
