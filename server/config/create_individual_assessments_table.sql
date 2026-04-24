-- Create individual assessments table for pricing management
CREATE TABLE IF NOT EXISTS kivi_individual_assessments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assessment_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL DEFAULT 5500.00,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_category (category)
);

-- Insert default individual assessments
INSERT INTO kivi_individual_assessments (assessment_id, name, category, price, description) VALUES
-- Screening Tools
('wj3-screening', 'WJ-3 Screening Tool', 'Screening', 5500.00, 'Woodcock Johnson Screening Tool'),
('nimhans-sld', 'NIMHANS SLD Test', 'Screening', 5500.00, 'NIMHANS - Specific Learning Difficulty Test'),

-- Cognitive Tools
('wisc-5', 'WISC-5', 'Cognitive', 5500.00, 'Weschler Intelligence Scale for Children (Latest Version)'),
('wisc-4', 'WISC-4', 'Cognitive', 5500.00, 'Weschler Intelligence Scale for Children'),
('wj4-cognitive', 'WJ-4 Cognitive Battery', 'Cognitive', 5500.00, 'Woodcock Johnson Cognitive Battery'),
('misic', 'MISIC', 'Cognitive', 5500.00, 'Malins Intelligence Scale for Indian Children'),
('niti', 'NIEPID NITI', 'Cognitive', 5500.00, 'NIEPID Indian Test of Intelligence'),
('ravens-cpm', 'Ravens CPM', 'Cognitive', 5500.00, 'Ravens Progressive Matrices - Coloured'),
('ravens-spm', 'Ravens SPM', 'Cognitive', 5500.00, 'Ravens Progressive Matrices - Standard'),
('bkt', 'BKT', 'Cognitive', 5500.00, 'Binet Kamat Test of Intelligence'),
('draw-man', 'Draw a Man Test', 'Cognitive', 5500.00, 'Draw a Man Test'),

-- Achievement Tools
('wj3-brief', 'WJ-3 Brief Battery', 'Achievement', 5500.00, 'Woodcock Johnson Brief Battery'),
('wj4-achievement', 'WJ-4 Achievement Battery', 'Achievement', 5500.00, 'Woodcock Johnson Achievement Battery'),
('aali', 'AALI', 'Achievement', 5500.00, 'Ann Arbor Learning Inventory'),
('aston-index', 'Aston Index', 'Achievement', 5500.00, 'Aston Index'),
('bgvmt', 'BGVMT', 'Achievement', 5500.00, 'Bender-Gestalt Visual-Motor Test'),
('beery-vmi', 'Beery VMI', 'Achievement', 5500.00, 'Beery Buktenica Development Test of Visual-Motor Integration'),
('gort', 'GORT', 'Achievement', 5500.00, 'Gray Oral Reading Test'),
('nelson-denny', 'Nelson-Denny Reading Test', 'Achievement', 5500.00, 'Nelson-Denny Reading Test - Forms I&J'),
('ripa-3', 'RIPA-3', 'Achievement', 5500.00, 'Ross Information Processing Assessment'),
('taps-4', 'TAPS-4', 'Achievement', 5500.00, 'Test of Auditory Perceptual Skills'),
('towl-4', 'TOWL-4', 'Achievement', 5500.00, 'Test of Written Language'),
('wrat-5', 'WRAT-5', 'Achievement', 5500.00, 'Wide Range Achievement Test - English, Hindi, Marathi, Tamil'),
('wrmt-3', 'WRMT-3', 'Achievement', 5500.00, 'Woodcock Reading Mastery Tests'),
('wiat-4', 'WIAT-4', 'Achievement', 5500.00, 'Weschlers Individual Achievement Test'),

-- Handwriting Tools
('dash', 'DASH', 'Handwriting', 5500.00, 'Detailed Assessment of Speed Handwriting'),
('beery-vmi-handwriting', 'Beery VMI (Handwriting)', 'Handwriting', 5500.00, 'Beery Buktenica Development Test of Visual Motor Integration'),

-- ADHD Tools
('adhdt-2', 'ADHDT-2', 'ADHD', 5500.00, 'Attention-Deficit/Hyperactivity Disorder Test - Second Edition'),
('dsm5-adhd', 'DSM-5 ADHD Checklist', 'ADHD', 5500.00, 'Diagnostic and Statistical Manual of Mental Disorders - ADHD Checklist'),
('brown-efa', 'Brown EF/A Scales', 'ADHD', 5500.00, 'Brown Executive Function/Attention Scales'),
('conners-3', 'Conners-3', 'ADHD', 5500.00, 'Conners Comprehensive Behavior Rating Scales'),

-- Autism & Intellectual Disability
('cars', 'CARS', 'Autism', 5500.00, 'Childhood Autism Rating Scale'),
('gars-3', 'GARS-3', 'Autism', 5500.00, 'Gilliam Autism Rating Scale'),
('mchat', 'M-CHAT', 'Autism', 5500.00, 'Modified Checklist for Autism in Toddlers'),
('vabs-3', 'VABS-3', 'Adaptive Behavior', 5500.00, 'Vineland Adaptive Behavior Scales'),
('isaa', 'ISAA', 'Autism', 5500.00, 'Indian Scale for Assessment of Autism'),
('ablls-r', 'ABLLS-R', 'Autism', 5500.00, 'Assessment of Basic Language & Learning Skills'),

-- Projective Tests
('epq', 'Eysencks Personality Questionnaire', 'Personality', 5500.00, 'Eysencks Personality Questionnaire'),
('cat', 'CAT', 'Personality', 5500.00, 'Children\'s Apperception Test'),
('tat', 'TAT', 'Personality', 5500.00, 'Thematic Apperception Test'),
('rorschach', 'Rorschach Test', 'Personality', 5500.00, 'Rorschach Test with Manual'),

-- Career Assessment Tools
('dat', 'DAT', 'Career', 5500.00, 'Differential Aptitude Test'),
('mcmf', 'MCMF', 'Career', 5500.00, 'My Choice My Future'),
('cdm', 'CDM', 'Career', 5500.00, 'Career Decision Making'),
('mgti', 'MGTI', 'Career', 5500.00, 'Mixed Group Test of Intelligence'),

-- Additional Common Assessments
('16pf', '16PF', 'Personality', 5500.00, 'Sixteen Personality Factor Questionnaire'),
('bai', 'BAI', 'Anxiety', 5500.00, 'Beck Anxiety Inventory'),
('basc3-bess-college', 'BASC-3 BESS College', 'Behavior', 5500.00, 'Behavior Assessment System for Children - College'),
('basc3-bess-parent-child', 'BASC-3 BESS Parent Child', 'Behavior', 5500.00, 'Behavior Assessment System for Children - Parent/Child'),
('cars-2', 'CARS-2', 'Autism', 5500.00, 'Childhood Autism Rating Scale - Second Edition'),
('brief-2', 'BRIEF-2', 'Executive Function', 5500.00, 'Behavior Rating Inventory of Executive Function - Second Edition'),
('srs-2', 'SRS-2', 'Social Skills', 5500.00, 'Social Responsiveness Scale - Second Edition');

SELECT 'Individual assessments table created successfully!' AS result;
