-- Create assessment packages table for Examinee Management
CREATE TABLE IF NOT EXISTS kivi_assessment_packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    package_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Assessment',
    price DECIMAL(10,2) NOT NULL,
    age_range VARCHAR(100),
    description TEXT,
    includes JSON,
    is_active BOOLEAN DEFAULT TRUE,
    centre_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (centre_id) REFERENCES kivi_centres(id) ON DELETE SET NULL
);

-- Insert default assessment packages
INSERT INTO kivi_assessment_packages (package_id, name, category, price, age_range, description, includes) VALUES
('PE-BASIC', 'Psycho-Educational Assessment', 'PE Assessment', 18500.00, '6.11-16.11 years', 'WISC-IV (Manual scoring), WRAT-V (Computerised), WJ-III Ach (Computerised), ADHDT-2', 
 '["WISC-IV Manual", "WRAT-V", "WJ-III Ach", "ADHDT-2"]'),

('PE-STANDARD', 'Psycho-Educational Assessment', 'PE Assessment', 22500.00, '6.11-16.11 years', 'WISC-V (Computerised), WRAT-V (Computerised), WJ-III Ach (Computerised), Brown\'s EF/A Scales', 
 '["WISC-V", "WRAT-V", "WJ-III Ach", "Brown EF/A"]'),

('PE-COMPREHENSIVE', 'Psycho-Educational Assessment', 'PE Assessment', 38500.00, '6.11-90 years', 'WJ-IV Cog (Standard & Extended), WJ-IV Ach (Standard & Extended), Conners-4th Edition', 
 '["WJ-IV Cog", "WJ-IV Ach", "Conners-4"]'),

('AUTISM-EVAL', 'Autism Evaluation', 'Specialized', 22500.00, 'All ages', 'ISAA, CARS-2, WJ-III Ach, DSM-5 ADHD/Autism, School Checklists, VABS (Computerised)', 
 '["ISAA", "CARS-2", "WJ-III Ach", "DSM-5", "VABS"]'),

('EARLY-YEARS', 'Early Years Assessment', 'Early Childhood', 28500.00, '2.6-7.11 years', 'WJ IV ECAD (with software), WJ-III Form-C, ADHDT-2, DSM-5, ISAA, GARS, GRS', 
 '["WJ IV ECAD", "WJ-III Form-C", "ADHDT-2", "ISAA", "GARS", "GRS"]'),

('REMEDIAL', 'Remedial Sessions', 'Therapy', 2500.00, 'All ages', 'Per hour remedial therapy sessions. WRAT-5 available in any Indian language.', 
 '["1 Hour Session", "WRAT-5 Multilingual"]');

-- Create student packages table to track assigned packages
CREATE TABLE IF NOT EXISTS kivi_student_packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    package_id INT NOT NULL,
    assigned_by INT,
    price_at_assignment DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (student_id) REFERENCES kivi_students(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES kivi_assessment_packages(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES kivi_users(id) ON DELETE SET NULL
);

-- Add index for faster lookups
CREATE INDEX idx_assessment_packages_active ON kivi_assessment_packages(is_active);
CREATE INDEX idx_assessment_packages_category ON kivi_assessment_packages(category);
CREATE INDEX idx_student_packages_student ON kivi_student_packages(student_id);
CREATE INDEX idx_student_packages_status ON kivi_student_packages(status);

SELECT 'Assessment packages tables created successfully!' AS result;

SHOW TABLES LIKE '%assessment%';

SELECT * FROM kivi_assessment_packages;
