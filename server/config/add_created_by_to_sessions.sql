-- Add created_by column to kivi_sessions table
ALTER TABLE kivi_sessions ADD COLUMN created_by INT NULL;

-- Add foreign key constraint to kivi_users table
ALTER TABLE kivi_sessions ADD CONSTRAINT fk_sessions_created_by 
FOREIGN KEY (created_by) REFERENCES kivi_users(id) ON DELETE SET NULL;

-- Add index for better performance
CREATE INDEX idx_sessions_created_by ON kivi_sessions(created_by);
