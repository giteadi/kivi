-- Change established_date column from DATE to DATETIME to accept ISO format
ALTER TABLE kivi_centres MODIFY COLUMN established_date DATETIME;
