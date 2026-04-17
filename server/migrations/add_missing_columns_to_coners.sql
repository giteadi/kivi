-- Migration: Add missing columns to coners table
-- Adds folder_id and client_id columns for coner organization

USE kivi;

-- Add folder_id column if not exists
SET @exists = (SELECT COUNT(*) FROM information_schema.columns
               WHERE table_schema = 'kivi'
               AND table_name = 'coners'
               AND column_name = 'folder_id');

SET @sql = IF(@exists = 0,
              'ALTER TABLE coners ADD COLUMN folder_id INT NULL DEFAULT NULL',
              'SELECT "folder_id column already exists in coners" as message');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add client_id column if not exists
SET @exists2 = (SELECT COUNT(*) FROM information_schema.columns
                WHERE table_schema = 'kivi'
                AND table_name = 'coners'
                AND column_name = 'client_id');

SET @sql2 = IF(@exists2 = 0,
               'ALTER TABLE coners ADD COLUMN client_id INT NULL DEFAULT NULL',
               'SELECT "client_id column already exists in coners" as message');

PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- Add index for folder_id
SET @idx_exists = (SELECT COUNT(*) FROM information_schema.statistics
                   WHERE table_schema = 'kivi'
                   AND table_name = 'coners'
                   AND index_name = 'idx_folder_id');

SET @sql3 = IF(@idx_exists = 0,
               'ALTER TABLE coners ADD INDEX idx_folder_id (folder_id)',
               'SELECT "idx_folder_id already exists in coners" as message');

PREPARE stmt3 FROM @sql3;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

-- Add index for client_id
SET @idx_exists2 = (SELECT COUNT(*) FROM information_schema.statistics
                    WHERE table_schema = 'kivi'
                    AND table_name = 'coners'
                    AND index_name = 'idx_client_id');

SET @sql4 = IF(@idx_exists2 = 0,
               'ALTER TABLE coners ADD INDEX idx_client_id (client_id)',
               'SELECT "idx_client_id already exists in coners" as message');

PREPARE stmt4 FROM @sql4;
EXECUTE stmt4;
DEALLOCATE PREPARE stmt4;

SELECT 'Migration completed: folder_id and client_id columns added to coners table' as status;
