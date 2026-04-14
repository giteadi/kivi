-- Migration: Create forms table
-- Run this on the production server

CREATE TABLE IF NOT EXISTS forms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- 'excel', 'csv', 'word', 'pdf'
  file_path VARCHAR(500) NOT NULL,
  file_size INT,
  sheet_data LONGTEXT, -- JSON data for editable forms
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_type (type),
  INDEX idx_created_by (created_by),
  INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
