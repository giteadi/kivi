# 🗄️ Database Schema & Models Reference

> Core tables, schemas, relationships, and queries for the `kivi` MySQL database.

---

## 1. Primary Tables

### `kivi_users`
User accounts across all roles (Admin, Superadmin, Therapist, Parent, Student).
- `id` (INT, PK, AUTO_INCREMENT)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR, hashed or plain for legacy)
- `role` (`admin`, `therapist`, `parent`, `student`, `receptionist`)
- `first_name`, `last_name` (VARCHAR)
- `phone` (VARCHAR)
- `status` (TINYINT)
- `created_at` (DATETIME)

### `kivi_students` / Examinees
Clinical clients/patients/examinees.
- `id` (INT, PK, AUTO_INCREMENT)
- `client_id` (INT)
- `name` (VARCHAR)
- `dob` (DATE)
- `gender` (VARCHAR)
- `parent_name`, `parent_email`, `parent_phone` (VARCHAR)
- `address` (TEXT)
- `baseline_scores` (JSON / TEXT)
- `notes` (TEXT)
- `created_at` (DATETIME)

### `forms`
Uploaded and managed assessment forms, rating scales, and clinical tools.
- `id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR)
- `type` (`excel`, `word`, `csv`, `pdf`)
- `file_path` (VARCHAR)
- `file_size` (INT)
- `folder_id` (INT, FK to `folders.id`)
- `client_id` (INT)
- `template_data` (LONGTEXT JSON):
  - `sheets`: 2D array of rows and cells
  - `sheetNames`: Array of sheet tab names
  - `formulas`: `{ "sheetName": { "r_c": "=FORMULA" } }`
  - `cell_styles`: `{ "sheetName": { "r_c": CSS } }`
  - `merges`: `{ "sheetName": [[r1, c1, r2, c2], ...] }`
  - `row_heights`, `col_widths`
- `created_by` (INT)
- `created_at` (DATETIME)

### `templates`
Report templates used by `TemplateManager` to generate clinical evaluation reports.
- `id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR)
- `type` (`import`, `docx`, `excel`)
- `description` (TEXT)
- `template_data` (LONGTEXT JSON)
- `excel_filename` (VARCHAR)
- `created_at` (DATETIME)

### `kivi_sessions`
Clinical therapy and assessment sessions.
- `id` (INT, PK, AUTO_INCREMENT)
- `student_id` (INT)
- `therapist_id` (INT)
- `session_date` (DATETIME)
- `duration_minutes` (INT)
- `status` (`scheduled`, `completed`, `cancelled`)
- `session_notes` (TEXT)
- `fee` (DECIMAL)

### `invoices` & `packages`
Billing, payments, and multi-session package tracking.
- `invoices`: `id`, `patient_id`, `amount`, `status`, `razorpay_order_id`, `razorpay_payment_id`, `items`, `created_at`
- `packages`: `id`, `name`, `sessions_count`, `price`, `description`, `active`

