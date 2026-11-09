# 🏗️ Kivi Dashboard — System Architecture & Technical Specifications

> Complete architectural reference for the Kivi mental health, clinic management, assessment & invoicing platform.

---

## 1. System Architecture Overview

```
                      ┌───────────────────────────────────────────────┐
                      │              User Browser Client              │
                      │  React 19 + Vite 7 + TailwindCSS + UniverJS   │
                      └──────────────────────┬────────────────────────┘
                                             │ HTTPS (443)
                                             ▼
                      ┌───────────────────────────────────────────────┐
                      │                 Nginx 1.24                    │
                      │      Reverse Proxy & Static Asset Server      │
                      │      Host: dashboard.iplanbymsl.in            │
                      └──────────────┬────────────────┬───────────────┘
                                     │                │
            / (Static UI Assets)     │                │ /api/* (Backend API)
                                     ▼                ▼
                      ┌──────────────────┐  ┌─────────────────────────┐
                      │ /var/www/        │  │ PM2: dashboard (3005)   │
                      │ dashboard/       │  │ Node.js 22 / Express    │
                      └──────────────────┘  └────────────┬────────────┘
                                                         │
                                      ┌──────────────────┴──────────────────┐
                                      │                                     │
                                      ▼                                     ▼
                      ┌───────────────────────────────┐     ┌───────────────────────────────┐
                      │     MySQL 8.0 (Port 3306)     │     │      Python 3 Parser          │
                      │   DB: kivi, Auth: Tiger@123   │     │  server/scripts/parse_excel.py│
                      └───────────────────────────────┘     └───────────────────────────────┘
```

---

## 2. Core Modules & Subsystems

### A. Examinee & Clinical Management
- **Patients / Examinees (`ExamineesManagement`, `ExamineeDetail`, `ExamineeEditForm`)**:
  - Full profile lifecycle, demographic tracking, diagnosis, medical history, baseline scores.
  - Multi-tier search and filtering.
- **Appointments & Sessions (`AppointmentsList`, `SessionList`, `SessionCreateForm`)**:
  - Calendar integration, recurrence rules, therapist assignments, attendance, notes.
- **Therapist Management (`DoctorsList`, `DoctorProfile`, `DoctorRevenue`)**:
  - Revenue tracking, session logs, commission calculation.

### B. Assessment Tools & Spreadsheets
The platform contains sophisticated Excel and Word document parsing, display, editing, and formula calculation engines:
1. **Forms Management (`client/src/components/FormsManagement.jsx`)**:
   - Manage clinical forms, templates, multi-sheet documents.
   - Upload Excel (.xlsx), Word (.docx), CSV, and PDF.
   - Support for folders, duplication, and custom reports.
2. **Conners Management (`client/src/components/ConnersManagement.jsx`)**:
   - Specific scoring forms for ADHD and behavioral assessment rating scales (Conners 3, Vineland, CARS).
3. **Template Manager (`client/src/components/TemplateManager.jsx`)**:
   - Reusable report templates, token replacements (e.g. `{{STUDENT_NAME}}`), automated patient report generation.
4. **Spreadsheet Engines**:
   - **Univer Spreadsheet (`client/src/components/UniverSpreadsheet.jsx`)**: Built on `@univerjs/presets` and `@univerjs/preset-sheets-core`. Includes formula bar, full 500+ Excel function calculation engine, styling, column resizing, and sheet tabs.
   - **Classic Grid / Report Viewer (`client/src/components/ReportSheetViewer.jsx`)**: Custom HTML/canvas grid for fallback viewing, multi-pass cascading formula calculation (`reEvaluateFormulas`), and Word/HTML iframe document rendering.

### C. Excel Processing Pipeline
```
[Excel .xlsx Upload] ──> [/forms/upload API]
                             │
                             ▼
               [Python parse_excel.py (spawn)]
               - Unzips OpenXML structure
               - Parses sheet XML + shared strings + styles
               - Detects <f> tags -> stores in formulas dict
               - Injects formula text (=...) into cell grid
                             │
                             ▼
               [Stored in DB: template_data JSON]
               { sheets: {...}, formulas: {...}, cell_styles: {...} }
                             │
                             ▼
               [Frontend Hydration]
               - Univer: buildStyledSheet strips .v/.t, passes .f
               - CalculationMode: FORCED (0) calculates all formulas
               - Classic: reEvaluateFormulas computes cascaded formulas
```

### D. Billing, Invoicing & Packages
- **Invoices (`client/src/components/Invoices.jsx`, `client/src/utils/invoice.js`)**:
  - Professional invoice generation, GST/Tax handling, status tracking (Paid, Pending, Overdue).
  - Razorpay payment gateway integration for online payments.
- **Packages (`client/src/components/Packages.jsx`, `PackageManagement.jsx`)**:
  - Multi-session package creation, discount pricing, remaining session deductions.

---

## 3. Technology Stack & Key Dependencies

### Frontend (`client/package.json`)
- **Core:** React `19.2.0`, React DOM `19.2.0`, Vite `7.3.1`, React Router `7.14.0`
- **State:** `@reduxjs/toolkit` `2.11.2`, `react-redux` `9.2.0`
- **Spreadsheet:** `@univerjs/presets` `0.25.1`, `@univerjs/preset-sheets-core` `0.25.1`, `univer-file-import` `1.2.3`, `xlsx` `0.18.5`
- **UI & Motion:** `framer-motion` `12.34.4`, `react-icons` `5.5.0`, `react-hot-toast` `2.6.0`, `@dnd-kit/core`
- **PDF & Export:** `jspdf` `4.2.1`, `jspdf-autotable`, `html2canvas`, `html2pdf.js`, `mammoth`, `docx`

### Backend (`server/package.json`)
- **Runtime:** Node.js `22.x`, Express `4.x`
- **Process Manager:** PM2 (running as `dashboard`)
- **Database:** MySQL2 with connection pool
- **Parsing:** Python 3 (`xml.etree.ElementTree`, `zipfile`), `mammoth`, `multer`
- **Auth:** JWT (`jsonwebtoken`), `bcryptjs`
- **Payments:** `razorpay` SDK

