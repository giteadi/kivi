-- Calendar Events Table for Assessment Calendar
CREATE TABLE IF NOT EXISTS calendar_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    client_name VARCHAR(255),
    event_date DATE NOT NULL,
    event_time TIME,
    duration_minutes INT DEFAULT 60,
    event_type ENUM('assessment', 'therapy', 'evaluation', 'followup', 'meeting') DEFAULT 'assessment',
    notes TEXT,
    created_by INT,
    centre_id INT,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (centre_id) REFERENCES centres(id) ON DELETE SET NULL
);

-- Index for faster date-based queries
CREATE INDEX idx_calendar_events_date ON calendar_events(event_date);
CREATE INDEX idx_calendar_events_type ON calendar_events(event_type);
CREATE INDEX idx_calendar_events_status ON calendar_events(status);
CREATE INDEX idx_calendar_events_centre ON calendar_events(centre_id);
