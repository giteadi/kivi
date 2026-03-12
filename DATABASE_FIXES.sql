-- =====================================================
-- KIVI DATABASE FIXES FOR DASHBOARD SESSION FILTERING
-- =====================================================
-- Run these queries in your MySQL client (phpMyAdmin, MySQL Workbench, etc.)

-- 1. Add created_by column to sessions table
ALTER TABLE kivi_sessions ADD COLUMN created_by INT NULL AFTER programme_id;

-- 2. Add foreign key constraint (optional but recommended)
-- ALTER TABLE kivi_sessions ADD CONSTRAINT fk_sessions_created_by 
-- FOREIGN KEY (created_by) REFERENCES kivi_users(id) ON DELETE SET NULL;

-- 3. Add index for better performance
CREATE INDEX idx_sessions_created_by ON kivi_sessions(created_by);

-- 4. Check if column was added successfully
DESCRIBE kivi_sessions;

-- =====================================================
-- ALTERNATIVE: If you want to update existing sessions
-- =====================================================

-- Update existing sessions to set created_by based on payments
-- This will link sessions to the user who paid for them
UPDATE kivi_sessions s 
JOIN kivi_payments p ON p.session_id = s.id 
SET s.created_by = p.user_id 
WHERE p.user_id IS NOT NULL;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check sessions with created_by
SELECT COUNT(*) as sessions_with_created_by 
FROM kivi_sessions 
WHERE created_by IS NOT NULL;

-- Check Mary Jones sessions (replace 5 with actual user ID)
SELECT s.id, s.session_date, s.session_time, s.status, s.created_by,
       CONCAT(u.first_name, ' ', u.last_name) as created_by_user
FROM kivi_sessions s
LEFT JOIN kivi_users u ON u.id = s.created_by
WHERE s.created_by = 5;  -- Replace 5 with Mary Jones's actual user ID

-- =====================================================
-- ROLLBACK (if needed)
-- =====================================================
-- ALTER TABLE kivi_sessions DROP INDEX idx_sessions_created_by;
-- ALTER TABLE kivi_sessions DROP COLUMN created_by;
