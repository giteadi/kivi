-- Create assessments table for assessment management
USE kivi;

CREATE TABLE IF NOT EXISTS kivi_assessments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    assessment_name VARCHAR(255) NOT NULL,
    assessment_type VARCHAR(100) DEFAULT 'WRAT5',
    delivery_method VARCHAR(50) DEFAULT 'Manual Entry',
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration INT DEFAULT 30 COMMENT 'Duration in minutes',
    examiner VARCHAR(255),
    room VARCHAR(50),
    materials TEXT,
    notes TEXT,
    status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Report Generated') DEFAULT 'Scheduled',
    admin_date DATE COMMENT 'Actual administration date',
    completion_date DATE COMMENT 'Date when assessment was completed',
    report_generated BOOLEAN DEFAULT FALSE,
    report_path VARCHAR(500) COMMENT 'Path to generated report file',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES kivi_students(id) ON DELETE CASCADE,
    
    INDEX idx_student_assessments (student_id),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_status (status),
    INDEX idx_assessment_type (assessment_type)
);

-- Insert sample assessment data for testing
INSERT INTO kivi_assessments (
    student_id, 
    assessment_name, 
    assessment_type, 
    delivery_method, 
    scheduled_date, 
    scheduled_time, 
    duration, 
    examiner, 
    room, 
    status
) VALUES 
(
    1, 
    'WRAT5-India Blue Form', 
    'WRAT5', 
    'Manual Entry', 
    '2026-03-18', 
    '10:00:00', 
    45, 
    'Dr. Sarah Johnson', 
    'Room 101', 
    'Report Generated'
),
(
    1, 
    'Reading Comprehension Test', 
    'Custom', 
    'Digital', 
    '2026-03-25', 
    '14:00:00', 
    30, 
    'Dr. Michael Brown', 
    'Room 102', 
    'Scheduled'
);

SELECT 'Assessments table created and sample data inserted' as status;
