-- Migration: Create folders table for hierarchical form organization
-- Run this on the production server

CREATE TABLE IF NOT EXISTS folders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  parent_id INT NULL,
  client_id INT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_parent (parent_id),
  INDEX idx_client (client_id),
  INDEX idx_created_by (created_by),
  INDEX idx_deleted_at (deleted_at),
  FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add folder_id to forms table
ALTER TABLE forms ADD COLUMN IF NOT EXISTS folder_id INT NULL;
ALTER TABLE forms ADD COLUMN IF NOT EXISTS client_id INT NULL;
ALTER TABLE forms ADD INDEX idx_folder_id (folder_id);
ALTER TABLE forms ADD INDEX idx_client_id (client_id);
