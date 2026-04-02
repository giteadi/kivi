-- Create table for assessment item responses
USE kivi;

CREATE TABLE IF NOT EXISTS kivi_assessment_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assessment_id INT NOT NULL,
    student_id INT NOT NULL,
    item_number INT NOT NULL,
    response_value VARCHAR(255),
    response_text TEXT,
    is_correct BOOLEAN DEFAULT NULL,
    score DECIMAL(5,2) DEFAULT NULL,
    time_taken INT DEFAULT NULL COMMENT 'Time taken in seconds',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (assessment_id) REFERENCES kivi_assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES kivi_students(id) ON DELETE CASCADE,
    
    INDEX idx_assessment_results (assessment_id),
    INDEX idx_student_results (student_id),
    INDEX idx_item_number (item_number)
);

-- Add columns to kivi_assessments for invoice and payment tracking
ALTER TABLE kivi_assessments 
ADD COLUMN IF NOT EXISTS invoice_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS invoice_sent_date TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS invoice_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_status ENUM('pending', 'paid', 'partial', 'waived') DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS total_score DECIMAL(10,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS max_score DECIMAL(10,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS percentile DECIMAL(5,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS completion_percentage INT DEFAULT 0;

SELECT 'Assessment results table created and assessment table updated' as status;
