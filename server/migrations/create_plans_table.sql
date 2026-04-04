-- Migration: Create kivi_plans table if it doesn't exist
-- Run this on the production server

CREATE TABLE IF NOT EXISTS kivi_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- 'session' or 'assessment'
  price DECIMAL(10,2) NOT NULL,
  duration VARCHAR(100),
  sessions_count INT DEFAULT 1,
  features TEXT, -- JSON array of features
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_price (price),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
