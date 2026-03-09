-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  order_id VARCHAR(255) NOT NULL UNIQUE,
  payment_id VARCHAR(255) NOT NULL UNIQUE,
  signature TEXT,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'INR',
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_payment_id (payment_id),
  INDEX idx_order_id (order_id),
  INDEX idx_status (status),
  INDEX idx_paid_at (paid_at),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL
);

-- Create plans table if not exists
CREATE TABLE IF NOT EXISTS plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('session', 'subscription', 'package') DEFAULT 'session',
  price DECIMAL(10, 2) NOT NULL,
  duration VARCHAR(100),
  description TEXT,
  features JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample plans if table is empty
INSERT IGNORE INTO plans (id, name, type, price, duration, description, features) VALUES
(1, 'Remedial Therapy', 'session', 2000.00, '1 Hour', 'Comprehensive remedial therapy sessions for learning difficulties', 
 JSON_ARRAY('One-on-one therapy session', 'Customized learning approach', 'Progress tracking', 'Parent consultation')),
(2, 'Occupational Therapy', 'session', 1500.00, '1 Hour', 'Specialized occupational therapy for daily living skills',
 JSON_ARRAY('Sensory integration therapy', 'Fine motor skill development', 'Daily living activities', 'Equipment recommendations')),
(3, 'Speech Language Therapy', 'session', 1500.00, '1 Hour', 'Professional speech and language development therapy',
 JSON_ARRAY('Speech articulation training', 'Language development', 'Communication skills', 'Swallowing therapy')),
(4, 'Counselling', 'session', 1500.00, '1 Hour', 'Professional counselling and psychological support',
 JSON_ARRAY('Individual counselling', 'Behavioral therapy', 'Emotional support', 'Coping strategies'));
