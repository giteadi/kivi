-- Template Management Enhancement SQL
-- Add columns for Excel upload, copy-paste, and merge operations

-- Add new columns to kivi_templates table for enhanced template operations
ALTER TABLE `kivi_templates` 
ADD COLUMN IF NOT EXISTS `excel_data` longtext DEFAULT NULL COMMENT 'Stored Excel data as JSON' AFTER `template_data`,
ADD COLUMN IF NOT EXISTS `merged_from` json DEFAULT NULL COMMENT 'Array of template IDs this was merged from' AFTER `excel_data`,
ADD COLUMN IF NOT EXISTS `source_template_id` int(11) DEFAULT NULL COMMENT 'Original template ID if copied' AFTER `merged_from`,
ADD COLUMN IF NOT EXISTS `is_merged` tinyint(1) DEFAULT 0 COMMENT 'Flag indicating if template is a merge result' AFTER `source_template_id`,
ADD COLUMN IF NOT EXISTS `copy_count` int(11) DEFAULT 0 COMMENT 'Number of times this template has been copied' AFTER `is_merged`,
ADD COLUMN IF NOT EXISTS `excel_filename` varchar(255) DEFAULT NULL COMMENT 'Original Excel filename' AFTER `copy_count`,
ADD COLUMN IF NOT EXISTS `sheet_data` longtext DEFAULT NULL COMMENT 'Individual sheet data from Excel' AFTER `excel_filename`;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_source_template ON kivi_templates(source_template_id);
CREATE INDEX IF NOT EXISTS idx_is_merged ON kivi_templates(is_merged);

-- Create template_operations table to track copy-paste and merge history
CREATE TABLE IF NOT EXISTS `kivi_template_operations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_id` int(11) NOT NULL,
  `operation_type` enum('copy','paste','merge','excel_import','excel_export') NOT NULL,
  `source_template_ids` json DEFAULT NULL COMMENT 'Source templates for merge/copy operations',
  `operation_data` longtext DEFAULT NULL COMMENT 'Additional operation metadata',
  `performed_by` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_template_id` (`template_id`),
  KEY `idx_operation_type` (`operation_type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create template_cells table for granular cell-level data (for copy-paste operations)
CREATE TABLE IF NOT EXISTS `kivi_template_cells` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_id` int(11) NOT NULL,
  `sheet_name` varchar(100) DEFAULT 'Sheet1',
  `cell_reference` varchar(10) NOT NULL COMMENT 'e.g., A1, B2',
  `cell_value` text DEFAULT NULL,
  `cell_formula` text DEFAULT NULL,
  `cell_style` json DEFAULT NULL,
  `row_index` int(11) NOT NULL,
  `col_index` int(11) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cell` (`template_id`,`sheet_name`,`cell_reference`),
  KEY `idx_template_sheet` (`template_id`,`sheet_name`),
  KEY `idx_row_col` (`row_index`,`col_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key constraints
ALTER TABLE `kivi_templates` 
ADD CONSTRAINT IF NOT EXISTS `fk_source_template` 
FOREIGN KEY (`source_template_id`) REFERENCES `kivi_templates`(`id`) ON DELETE SET NULL;

-- Note: Uncomment below if users table exists and you want to add foreign key
-- ALTER TABLE `kivi_template_operations` 
-- ADD CONSTRAINT `fk_template_operations_user` 
-- FOREIGN KEY (`performed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL;
