# 📋 Centrix - Complete Software Overview

## 🎯 Software Identity
**Name:** Centrix (Kivi)  
**Type:** Educational Therapy Management System  
**Stack:** React + Redux Toolkit + Node.js + Express + MySQL

---

## 🧭 Sidebar Navigation Structure

### **Admin Menu Items**

| Section | Button Name | Route | Purpose |
|---------|-------------|-------|---------|
| **MAIN** | Dashboard | `/dashboard` | Main dashboard with stats and analytics |
| **USERS** | Examinees | `/examinees` | Manage students/examinees |
| **USERS** | Assessment Packages | `/packages` | Manage assessment packages & pricing |
| **NETWORK** | Centres | `/centres` | Manage therapy centers/clinics |
| **USERS** | Therapists | `/therapists` | Manage therapists/doctors |
| **USERS** | Assessment Templates | `/templates` | Create/manage assessment templates |
| **USERS** | Forms | `/forms` | Document/forms management |
| **FINANCIAL** | Centre Revenue | `/centres/revenue` | Revenue reports by center |
| **FINANCIAL** | Taxes | `/taxes` | Tax management |
| **FINANCIAL** | Billing Records | `/billing` | Billing and invoices |
| **ADMIN** | Queries | `/admin/queries` | Contact queries management |
| **ADMIN** | Center Visibility | `/admin/center-visibility` | Center access control |

### **Therapist Menu Items**

| Section | Button Name | Route | Purpose |
|---------|-------------|-------|---------|
| **MAIN** | Dashboard | `/dashboard` | Therapist dashboard |
| **USERS** | Examinees | `/examinees` | View assigned examinees |
| **USERS** | My Profile | `/profile` | Therapist profile view |

### **User/Parent Menu Items**

| Section | Button Name | Route | Purpose |
|---------|-------------|-------|---------|
| **MAIN** | Dashboard | `/user/dashboard` | User dashboard |

---

## 📦 Frontend Components (UI Modules)

### **Authentication Components**

| Component | File | Purpose |
|-----------|------|---------|
| `Login` | `Login.jsx` | User login form |
| `Register` | `Register.jsx` | User registration |
| `Homepage` | `Homepage.jsx` | Public landing page |
| `PrivacyPolicy` | `PrivacyPolicy.jsx` | Privacy policy page |
| `TermsOfService` | `TermsOfService.jsx` | TOS page |

### **Dashboard Components**

| Component | File | Purpose |
|-----------|------|---------|
| `Dashboard` | `Dashboard.jsx` | Admin main dashboard |
| `UserDashboard` | `UserDashboard.jsx` | User/Parent dashboard |
| `TherapistDashboard` | `TherapistDashboard.jsx` | Therapist dashboard (disabled) |
| `StatsCard` | `StatsCard.jsx` | Stat display card |
| `RevenueCard` | `RevenueCard.jsx` | Revenue display card |
| `BookingChart` | `BookingChart.jsx` | Booking analytics chart |

### **Dashboard Quick Actions**

| Button | Icon | Route | Purpose |
|--------|------|-------|---------|
| New Examinee | FiPlus | - | Register new client |
| Create Report | FiFileText | `/templates` | Generate assessment report |
| Forms | FiClipboard | `/forms` | Custom assessment forms |
| Invoice | FiCreditCard | `/billing` | View billing records |
| Network | FiMapPin | `/centres` | Manage therapy centres |

### **User Management Components**

| Component | File | Purpose |
|-----------|------|---------|
| `ExamineesManagement` | `ExamineesManagement.jsx` | Complete examinee management |
| `ExamineeCreateForm` | `ExamineeCreateForm.jsx` | Create new examinee |
| `ExamineeEditForm` | `ExamineeEditForm.jsx` | Edit examinee details |
| `ExamineeDetail` | `ExamineeDetail.jsx` | View examinee profile |
| `ExamineeGroupReport` | `ExamineeGroupReport.jsx` | Group reports for examinees |
| `PackageManagement` | `PackageManagement.jsx` | Assessment packages CRUD management |
| `DoctorsList` | `DoctorsList.jsx` | List all therapists |
| `DoctorProfile` | `DoctorProfile.jsx` | View therapist profile |
| `DoctorEditForm` | `DoctorEditForm.jsx` | Edit therapist details |
| `TherapistCreateForm` | `TherapistCreateForm.jsx` | Create new therapist |
| `ReceptionistsList` | `ReceptionistsList.jsx` | List staff members |
| `ReceptionistProfile` | `ReceptionistProfile.jsx` | View staff profile |
| `ReceptionistEditForm` | `ReceptionistEditForm.jsx` | Edit staff details |

### **Session/Encounter Components**

| Component | File | Purpose |
|-----------|------|---------|
| `EncountersList` | `EncountersList.jsx` | List all sessions |
| `EncounterDetail` | `EncounterDetail.jsx` | View session details |
| `EncounterTemplates` | `EncounterTemplates.jsx` | Session templates |
| `TemplateBasedEncounter` | `TemplateBasedEncounter.jsx` | Create session from template |
| `TemplateSelector` | `TemplateSelector.jsx` | Select template for session |
| `TemplateBuilder` | `TemplateBuilder.jsx` | Build custom templates |
| `TemplateViewer` | `TemplateViewer.jsx` | View template details |
| `TemplateManager` | `TemplateManager.jsx` | Complete template management |
| `SessionList` | `SessionList.jsx` | List scheduled sessions |
| `SessionCreateForm` | `SessionCreateForm.jsx` | Schedule new session |
| `SessionEditForm` | `SessionEditForm.jsx` | Edit session details |
| `AdminSessionsList` | `AdminSessionsList.jsx` | Admin session overview |
| `AssessmentList` | `AssessmentList.jsx` | List assessments |
| `TherapyList` | `TherapyList.jsx` | List therapy sessions |
| `CloseEncounter` | `CloseEncounter.jsx` | Close/finish session |
| `PrintEncounter` | `PrintEncounter.jsx` | Print session report |

### **Template Assessment Components**

| Component | File | Purpose |
|-----------|------|---------|
| `SimpleADHDDSM5Template` | `SimpleADHDDSM5Template.jsx` | ADHD DSM-5 assessment |
| `SimpleADHT2Template` | `SimpleADHT2Template.jsx` | ADHT-2 template |
| `SimpleAstonIndexTemplate` | `SimpleAstonIndexTemplate.jsx` | Aston Index assessment |
| `SimpleBKTTemplate` | `SimpleBKTTemplate.jsx` | BKT template |
| `SimpleBrownEFATemplate` | `SimpleBrownEFATemplate.jsx` | Brown EFA assessment |
| `SimpleDiagnosticReportTemplate` | `SimpleDiagnosticReportTemplate.jsx` | Diagnostic reports |
| `SimpleEACATemplate` | `SimpleEACATemplate.jsx` | EACA template |
| `SimpleGARS3Template` | `SimpleGARS3Template.jsx` | GARS-3 assessment |
| `SimpleGenerateReportModal` | `SimpleGenerateReportModal.jsx` | Generate reports |
| `SimpleNelsonDennyTemplate` | `SimpleNelsonDennyTemplate.jsx` | Nelson-Denny test |
| `SimpleRIPATemplate` | `SimpleRIPATemplate.jsx` | RIPA template |
| `SimpleRavensCPMTemplate` | `SimpleRavensCPMTemplate.jsx` | Raven's CPM |
| `SimpleSummaryEvaluationTemplate` | `SimpleSummaryEvaluationTemplate.jsx` | Summary evaluations |
| `SimpleTAPS3Template` | `SimpleTAPS3Template.jsx` | TAPS-3 assessment |
| `SimpleTOWL4Template` | `SimpleTOWL4Template.jsx` | TOWL-4 template |
| `SimpleVABSTemplate` | `SimpleVABSTemplate.jsx` | VABS template |
| `SimpleWISC4Template` | `SimpleWISC4Template.jsx` | WISC-4 assessment |
| `SimpleWJIIITemplate` | `SimpleWJIIITemplate.jsx` | WJ-III template |
| `SimpleWJIVAchTemplate` | `SimpleWJIVAchTemplate.jsx` | WJ-IV Achievement |
| `SimpleWJIVCogExtTemplate` | `SimpleWJIVCogExtTemplate.jsx` | WJ-IV Cognitive Extended |
| `SimpleWJIVCogStdTemplate` | `SimpleWJIVCogStdTemplate.jsx` | WJ-IV Cognitive Standard |
| `SimpleWRAML2Template` | `SimpleWRAML2Template.jsx` | WRAML-2 template |
| `SimpleWRAT5EngTemplate` | `SimpleWRAT5EngTemplate.jsx` | WRAT-5 English |
| `SimpleWRAT5HindiTemplate` | `SimpleWRAT5HindiTemplate.jsx` | WRAT-5 Hindi |
| `SimpleWRMT3Template` | `SimpleWRMT3Template.jsx` | WRMT-3 template |

### **Financial Components**

| Component | File | Purpose |
|-----------|------|---------|
| `BillingRecords` | `BillingRecords.jsx` | Complete billing management |
| `InvoiceScreen` | `InvoiceScreen.jsx` | Invoice creation/viewing |
| `ClinicRevenue` | `ClinicRevenue.jsx` | Center revenue reports |
| `DoctorRevenue` | `DoctorRevenue.jsx` | Therapist revenue (disabled) |
| `TaxList` | `TaxList.jsx` | Tax management |
| `PaymentModal` | `PaymentModal.jsx` | Payment processing |
| `PlansList` | `PlansList.jsx` | Subscription plans |

### **Center Management Components**

| Component | File | Purpose |
|-----------|------|---------|
| `ClinicsList` | `ClinicsList.jsx` | List all centers |
| `ClinicProfile` | `ClinicProfile.jsx` | View center details |
| `ClinicEditForm` | `ClinicEditForm.jsx` | Edit center info |
| `CentreCreateForm` | `CentreCreateForm.jsx` | Create new center |
| `CenterVisibilitySettings` | `CenterVisibilitySettings.jsx` | Access control settings |

### **Service Management Components**

| Component | File | Purpose |
|-----------|------|---------|
| `ServicesList` | `ServicesList.jsx` | List all services |
| `ServiceCards` | `ServiceCards.jsx` | Service display cards |
| `ServiceCreateForm` | `ServiceCreateForm.jsx` | Create new service |
| `ServiceEditForm` | `ServiceEditForm.jsx` | Edit service details |

### **Appointment Components**

| Component | File | Purpose |
|-----------|------|---------|
| `AppointmentsList` | `AppointmentsList.jsx` | List appointments |
| `AppointmentDetail` | `AppointmentDetail.jsx` | View appointment details |
| `AppointmentCard` | `AppointmentCard.jsx` | Appointment card UI |
| `BookingModal` | `BookingModal.jsx` | Booking creation modal |
| `AssessmentCalendar` | `AssessmentCalendar.jsx` | Calendar view |
| `SessionCalendar` | `SessionCalendar.jsx` | Session calendar |

### **Form & Document Components**

| Component | File | Purpose |
|-----------|------|---------|
| `FormsManagement` | `FormsManagement.jsx` | Complete forms management |
| `ConersManagement` | `ConersManagement.jsx` | Conners forms management |
| `DocViewer` | `DocViewer.jsx` | Document viewer |
| `ImportModal` | `ImportModal.jsx` | Data import dialog |
| `ExportDropdown` | `ExportDropdown.jsx` | Export options |

### **Admin Components**

| Component | File | Purpose |
|-----------|------|---------|
| `Queries` | `Queries.jsx` | Contact query management |
| `GroupAdministration` | `GroupAdministration.jsx` | User group management |
| `Report` | `Report.jsx` | Report generation |
| `GenerateReportModal` | `GenerateReportModal.jsx` | Report creation modal |
| `ReportSheetViewer` | `ReportSheetViewer.jsx` | View generated reports |

### **Layout/UI Components**

| Component | File | Purpose |
|-----------|------|---------|
| `Sidebar` | `Sidebar.jsx` | Main navigation sidebar |
| `UserSidebar` | `UserSidebar.jsx` | User-specific sidebar |
| `Header` | `Header.jsx` | Top navigation header |
| `MobileMenu` | `MobileMenu.jsx` | Mobile navigation |
| `FiltersPanel` | `FiltersPanel.jsx` | Data filtering panel |
| `ErrorBoundary` | `ErrorBoundary.jsx` | Error handling |
| `ErrorToast` | `ErrorToast.jsx` | Error notifications |
| `Toast` | `Toast.jsx` | Toast notifications |
| `LogoImage` | `LogoImage.jsx` | Logo component |
| `SpreadsheetGrid` | `SpreadsheetGrid.jsx` | Spreadsheet-style data grid |
| `TAPS3StaticCard` | `TAPS3StaticCard.jsx` | Static TAPS-3 display |

---

## 🗄️ Redux Store Slices (State Management)

| Slice | File | Purpose |
|-------|------|---------|
| `authSlice` | `authSlice.js` | Authentication state |
| `dashboardSlice` | `dashboardSlice.js` | Dashboard data & filters |
| `appointmentSlice` | `appointmentSlice.js` | Appointments state |
| `patientSlice` | `patientSlice.js` | Patients/examinees state |
| `doctorSlice` | `doctorSlice.js` | Therapists state |
| `serviceSlice` | `serviceSlice.js` | Services state |
| `clinicSlice` | `clinicSlice.js` | Centers state |
| `encounterSlice` | `encounterSlice.js` | Encounters state |
| `sessionSlice` | `sessionSlice.js` | Sessions state |
| `examineeSlice` | `examineeSlice.js` | Examinees state |
| `plansSlice` | `plansSlice.js` | Subscription plans |
| `templateSlice` | `templateSlice.js` | Templates state |
| `assessmentSlice` | `assessmentSlice.js` | Assessments state |
| `bookingSlice` | `bookingSlice.js` | Bookings state |

---

## 🔌 Backend API Routes

### **Authentication Routes** (`/api/auth`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/login` | POST | User login |
| `/register` | POST | User registration |
| `/profile` | GET | Get user profile |

### **User Routes** (`/api/users`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET | List all users |
| `/:id` | GET/PUT/DELETE | CRUD operations |

### **Student Routes** (`/api/students`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/POST | List/Create students |
| `/:id` | GET/PUT/DELETE | CRUD operations |
| `/:id/assessments` | GET | Get student assessments |

### **Therapist Routes** (`/api/therapists`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/POST | List/Create therapists |
| `/:id` | GET/PUT/DELETE | CRUD operations |
| `/:id/sessions` | GET | Get therapist sessions |
| `/:id/stats` | GET | Get therapist stats |

### **Session Routes** (`/api/sessions`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/POST | List/Create sessions |
| `/:id` | GET/PUT/DELETE | CRUD operations |
| `/today` | GET | Today's sessions |
| `/upcoming` | GET | Upcoming sessions |

### **Appointment Routes** (`/api/appointments`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/POST | List/Create appointments |
| `/:id` | GET/PUT/DELETE | CRUD operations |
| `/:id/status` | PUT | Update status |

### **Center Routes** (`/api/centres`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/POST | List/Create centers |
| `/:id` | GET/PUT/DELETE | CRUD operations |
| `/:id/revenue` | GET | Center revenue |

### **Service/Programme Routes** (`/api/services`, `/api/programmes`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/POST | List/Create services |
| `/:id` | GET/PUT/DELETE | CRUD operations |
| `/categories` | GET | Service categories |

### **Financial Routes** (`/api/financial`, `/api/invoices`, `/api/billing`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/revenue` | GET | Revenue reports |
| `/taxes` | GET/POST | Tax management |
| `/invoices` | GET/POST | Invoices |
| `/billing` | GET | Billing records |

### **Assessment Routes** (`/api/assessments`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/POST | List/Create assessments |
| `/:id` | GET/PUT/DELETE | CRUD operations |
| `/:id/results` | GET/POST | Assessment results |
| `/:id/assign` | POST | Assign assessment |

### **Template Routes** (`/api/templates`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/POST | List/Create templates |
| `/:id` | GET/PUT/DELETE | CRUD operations |
| `/:id/duplicate` | POST | Duplicate template |

### **Form Routes** (`/api/forms`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/POST | List/Create forms |
| `/:id` | GET/PUT/DELETE | CRUD operations |
| `/:id/submit` | POST | Submit form |

### **Coners Routes** (`/api/coners`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/POST | List/Create Conners forms |
| `/:id` | GET/PUT/DELETE | CRUD operations |
| `/:id/score` | POST | Score assessment |

### **Dashboard Routes** (`/api/dashboard`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/data` | GET | Complete dashboard |
| `/stats` | GET | Statistics |
| `/upcoming-sessions` | GET | Upcoming sessions |
| `/top-therapists` | GET | Top therapists |
| `/booking-chart` | GET | Booking chart data |

### **Calendar Routes** (`/api/calendar`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET | Calendar events |
| `/events` | POST | Create event |
| `/:id` | PUT/DELETE | Update/Delete event |

### **Report Routes** (`/api/reports`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/POST | List/Generate reports |
| `/:id` | GET | View report |
| `/:id/pdf` | GET | Download PDF |

### **Payment Routes** (`/api/payments`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/create-order` | POST | Create payment order |
| `/verify` | POST | Verify payment |
| `/plans` | GET | Subscription plans |

### **Contact Query Routes** (`/api/contact-queries`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/POST | List/Create queries |
| `/:id` | PUT/DELETE | Update/Delete query |
| `/:id/respond` | POST | Respond to query |

### **Center Visibility Routes** (`/api/center-visibility`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/PUT | Get/Update visibility |
| `/users/:userId` | GET | Get user visibility |

### **Booking Routes** (`/api/bookings`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/POST | List/Create bookings |
| `/:id` | GET/PUT/DELETE | CRUD operations |
| `/:id/confirm` | POST | Confirm booking |
| `/:id/cancel` | POST | Cancel booking |

### **Receptionist/Staff Routes** (`/api/receptionists`, `/api/staff`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET/POST | List/Create staff |
| `/:id` | GET/PUT/DELETE | CRUD operations |

---

## 🎛️ Backend Controllers

| Controller | File | Purpose |
|------------|------|---------|
| `authController` | `authController.js` | Authentication logic |
| `userController` | `userController.js` | User management |
| `studentController` | `studentController.js` | Student CRUD |
| `therapistController` | `therapistController.js` | Therapist management |
| `sessionController` | `sessionController.js` | Session management |
| `appointmentController` | `appointmentController.js` | Appointment handling |
| `centreController` | `centreController.js` | Center management |
| `clinicController` | `clinicController.js` | Clinic operations |
| `serviceController` | `serviceController.js` | Service management |
| `programmeController` | `programmeController.js` | Programme handling |
| `financialController` | `financialController.js` | Financial operations |
| `invoiceController` | `invoiceController.js` | Invoice management |
| `assessmentController` | `assessmentController.js` | Assessment handling |
| `assessmentResultController` | `assessmentResultController.js` | Assessment results |
| `templateController` | `templateController.js` | Template management |
| `formController` | `formRoutes.js` | Form handling |
| `conerController` | `conerRoutes.js` | Conners form handling |
| `dashboardController` | `dashboardController.js` | Dashboard data |
| `calendarController` | `calendarController.js` | Calendar operations |
| `reportController` | `reportController.js` | Report generation |
| `paymentController` | `paymentController.js` | Payment processing |
| `contactQueryController` | `contactQueryController.js` | Query management |
| `centerVisibilityController` | `centerVisibilityController.js` | Visibility control |
| `bookingController` | `bookingController.js` | Booking management |
| `receptionistController` | `receptionistController.js` | Staff management |
| `encounterController` | `encounterController.js` | Encounter handling |
| `examineeController` | `examineeController.js` | Examinee operations |
| `doctorController` | `doctorController.js` | Doctor management |
| `patientController` | `patientController.js` | Patient handling |
| `planController` | `planController.js` | Plan management |

---

## 🔄 Key Workflows

### **1. Authentication Flow**
```
Homepage → Login/Register → Dashboard (Role-based)
                    ↓
         Token stored in localStorage
                    ↓
         Protected Routes Access
```

### **2. Examinee Management Flow**
```
Sidebar → Examinees → List View → Create/Edit/View
                              ↓
                    Detail View → Sessions History
                              ↓
                    Reports → Generate PDF
```

### **3. Session/Encounter Flow**
```
Sidebar → Assessment Templates → Create Template
                    ↓
         Examinee Profile → New Session
                    ↓
         Select Template → Fill Assessment
                    ↓
         Save → Generate Report → Print/PDF
```

### **4. Financial Flow**
```
Sidebar → Centre Revenue → View Reports
                    ↓
         Taxes → Manage Tax Rates
                    ↓
         Billing Records → Create Invoice
                    ↓
         Payment → Razorpay Integration
```

### **5. Booking Flow**
```
User Dashboard → View Plans → Select Plan
                    ↓
         Login/Register → Payment
                    ↓
         Book Session → Select Center/Therapist
                    ↓
         Calendar → Confirm Booking
```

---

## 🎨 UI Icons Reference

| Icon | Import | Usage |
|------|--------|-------|
| `FiHome` | react-icons/fi | Dashboard |
| `FiCalendar` | react-icons/fi | Sessions/Calendar |
| `FiUsers` | react-icons/fi | User groups |
| `FiUser` | react-icons/fi | Examinees/Patients |
| `FiUserCheck` | react-icons/fi | Therapists |
| `FiMapPin` | react-icons/fi | Centers |
| `FiFileText` | react-icons/fi | Templates/Reports |
| `FiDollarSign` | react-icons/fi | Revenue |
| `FiPercent` | react-icons/fi | Taxes |
| `FiCreditCard` | react-icons/fi | Billing |
| `FiTrendingUp` | react-icons/fi | Analytics |
| `FiActivity` | react-icons/fi | Therapy |
| `FiMessageSquare` | react-icons/fi | Queries |
| `FiShield` | react-icons/fi | Admin/Visibility |
| `FiUpload` | react-icons/fi | Forms/Import |
| `FiBook` | react-icons/fi | Templates |
| `FiLayers` | react-icons/fi | Conners/Forms |
| `FiPlus` | react-icons/fi | Create actions |
| `FiSearch` | react-icons/fi | Search |
| `FiFilter` | react-icons/fi | Filters |
| `FiEdit` | react-icons/fi | Edit |
| `FiTrash2` | react-icons/fi | Delete |
| `FiEye` | react-icons/fi | View |
| `FiDownload` | react-icons/fi | Export |
| `FiPrinter` | react-icons/fi | Print |
| `FiX` | react-icons/fi | Close/Cancel |
| `FiCheck` | react-icons/fi | Confirm |
| `FiChevronDown` | react-icons/fi | Expand |
| `FiChevronRight` | react-icons/fi | Collapse |
| `FiMenu` | react-icons/fi | Mobile menu |
| `FiMoreHorizontal` | react-icons/fi | More options |
| `FiArrowUpRight` | react-icons/fi | External link |
| `FiClock` | react-icons/fi | Time/Schedule |
| `FiCheckSquare` | react-icons/fi | Completed |
| `FiHeart` | react-icons/fi | Favorite |
| `FiClipboard` | react-icons/fi | Notes |

---

## 🗃️ Database Models (Server-side)

| Model | Purpose |
|-------|---------|
| `users` | System users (admin, therapist, parent) |
| `students` | Examinees/students data |
| `therapists` | Therapist profiles |
| `centres` | Therapy centers |
| `sessions` | Scheduled sessions |
| `appointments` | Appointments |
| `services` | Available services |
| `programmes` | Therapy programmes |
| `assessments` | Assessment records |
| `assessment_results` | Assessment results |
| `templates` | Assessment templates |
| `forms` | Custom forms |
| `conners_forms` | Conners assessments |
| `invoices` | Invoice records |
| `payments` | Payment transactions |
| `taxes` | Tax configurations |
| `contact_queries` | Contact form submissions |
| `bookings` | Booking records |
| `plans` | Subscription plans |
| `encounters` | Session encounters |
| `receptionists` | Staff members |
| `calendar_events` | Calendar entries |
| `reports` | Generated reports |

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, hamburger menu |
| Tablet | 640px - 1024px | Two columns, condensed sidebar |
| Desktop | > 1024px | Full sidebar, multi-column |

---

## 🔐 Role-Based Access

| Feature | Admin | Therapist | User/Parent |
|---------|-------|-----------|-----------|
| Dashboard | ✅ Full | ✅ Limited | ✅ User only |
| Examinees | ✅ CRUD | ✅ View assigned | ✅ Own child only |
| Therapists | ✅ CRUD | ✅ View self | ❌ |
| Templates | ✅ CRUD | ✅ View | ❌ |
| Sessions | ✅ All | ✅ Own only | ✅ Booked only |
| Centers | ✅ CRUD | ❌ | ❌ |
| Revenue | ✅ Full | ❌ | ❌ |
| Billing | ✅ Full | ❌ | ✅ Own only |
| Queries | ✅ CRUD | ❌ | ✅ Create only |
| Reports | ✅ All | ✅ Own | ✅ Own |
| Admin Settings | ✅ Full | ❌ | ❌ |

---

## 🌐 External Integrations

| Service | Purpose | File |
|---------|---------|------|
| Razorpay | Payment processing | `PaymentModal.jsx`, `paymentController.js` |
| Cloudinary | Image storage | Logo URLs in components |
| Email Service | Notifications | Server email configuration |

---

## 📂 Project File Structure

```
kivi/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # 70+ React components
│   │   ├── store/
│   │   │   ├── store.js            # Redux store config
│   │   │   └── slices/             # 14 Redux slices
│   │   ├── services/               # API services
│   │   ├── hooks/                  # Custom hooks
│   │   ├── contexts/               # React contexts
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # Entry point
│   ├── public/                     # Static assets
│   └── package.json
│
├── server/                          # Node.js Backend
│   ├── config/                     # Database config
│   ├── controllers/                # 28 controllers
│   ├── models/                     # Database models
│   ├── routes/                     # 31 API routes
│   ├── middleware/                 # Auth middleware
│   ├── migrations/                 # DB migrations
│   ├── scripts/                    # Utility scripts
│   ├── database.js                 # DB connection
│   └── index.js                    # Server entry
│
└── Documentation files (*.md)
```

---

## 🚀 Quick Command Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` (server) | Start backend with nodemon |
| `npm run dev` (client) | Start frontend dev server |
| `npm start` (server) | Start production server |
| `npm run build` (client) | Build for production |
| `npm run lint` | Run ESLint |

---

## 👤 Default Credentials

```
Email: admin@kivi.com
Password: admin123
```

---

*Generated for Centrix (Kivi) - Educational Therapy Management System*
