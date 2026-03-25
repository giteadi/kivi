-- Create templates table for ADHDT-2 and other assessment templates
CREATE TABLE IF NOT EXISTS `kivi_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT 'ADHDT2',
  `description` text DEFAULT NULL,
  `template_data` longtext NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample ADHDT-2 template
INSERT INTO `kivi_templates` (`name`, `type`, `description`, `template_data`, `created_by`) VALUES 
('ADHDT-2 Assessment Report Template', 'ADHDT2', 'Standard ADHDT-2 assessment report template with subscales for Inattention and Hyperactivity/Impulsivity', JSON_OBJECT(
  'name', 'ADHDT-2 Assessment Report',
  'studentName', 'ABC',
  'examinerName', 'Dr. Smith',
  'testDate', '2026-03-25',
  'description', 'The Attention-Deficit/Hyperactivity Disorder Test-Second Edition (ADHDT-2) is a norm-referenced assessment instrument designed to help identify ADHD in individuals. Based on the diagnostic criteria for ADHD from the DSM-5, the ADHDT-2 provides a comprehensive measure of ADHD symptoms across multiple settings. The test evaluates both inattention and hyperactivity/impulsivity symptoms, providing valuable information for diagnostic decision-making and treatment planning. This assessment consists of behavior rating scales that measure the frequency and severity of ADHD symptoms, allowing for a standardized approach to ADHD evaluation that can be used in clinical, educational, and research settings.',
  'subscales', JSON_ARRAY(
    JSON_OBJECT('name', 'Inattention', 'rawScore', 26, 'percentileRank', 25, 'scaledScore', 8),
    JSON_OBJECT('name', 'Hyperactivity/Impulsivity', 'rawScore', 21, 'percentileRank', 6, 'scaledScore', 9)
  ),
  'adhdIndex', 92,
  'remark', 'The scores listed in the table imply that it is \'very likely\' that ABC has symptoms of ADHD. However, the checklist cannot be fully endorsed by the tester due to the one-to-one situation. The scores are based on the reports from the mother.',
  'disclaimer', 'The scores listed in the table imply that it is \'very likely\' that [Student Name] has symptoms of ADHD. However, the checklist cannot be fully endorsed by the tester due to the one-to-one situation. The scores are based on the reports from the mother.',
  'isTemplate', true
), NULL);

-- Add foreign key constraint if users table exists
-- ALTER TABLE `kivi_templates` ADD CONSTRAINT `fk_templates_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL;
