# Student/Examinee Module - Complete Documentation

## 📋 Overview
This document provides complete details about the Student/Examinee module including database structure, API endpoints, data flow, and field mappings.

**Table:** `kivi_students` (in database: `kivi`)
**Module:** Educational Therapy Management Dashboard
**Frontend Component:** `ExamineeCreateForm.jsx`, `ExamineesManagement.jsx`
**Backend Controller:** `studentController.js`
**Routes:** `studentRoutes.js`

---

## 🗄️ Database Schema

### Table: `kivi_students`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | int | NO | AUTO_INCREMENT | Primary key |
| `student_id` | varchar(50) | YES | NULL | Unique student identifier |
| `first_name` | varchar(100) | YES | NULL | Student first name |
| `middle_name` | varchar(100) | YES | NULL | Student middle name |
| `last_name` | varchar(100) | YES | NULL | Student last name |
| `email` | varchar(100) | YES | NULL | Email address |
| `phone` | varchar(20) | YES | NULL | Phone number |
| `date_of_birth` | date | YES | NULL | Birth date |
| `age` | int | YES | NULL | Calculated age |
| `gender` | enum('male','female','other') | YES | NULL | Gender |
| `centre_id` | int | YES | NULL | Associated centre ID |
| `centre_name` | varchar(255) | YES | NULL | Centre name |
| `registration_date` | date | YES | CURRENT_DATE | Registration date |
| `status` | enum('active','inactive','graduated','transferred') | YES | 'active' | Student status |
| `user_id` | int | YES | NULL | Associated user ID |
| `address` | text | YES | NULL | Street address |
| `city` | varchar(100) | YES | NULL | City |
| `state` | varchar(100) | YES | NULL | State/Province |
| `zip_code` | varchar(20) | YES | NULL | ZIP/Postal code |
| `emergency_contact_name` | varchar(100) | YES | NULL | Emergency contact name |
| `emergency_contact_phone` | varchar(20) | YES | NULL | Emergency contact phone |
| `emergency_contact_relation` | varchar(50) | YES | NULL | Emergency contact relation |
| `learning_needs` | text | YES | NULL | Learning requirements |
| `support_requirements` | text | YES | NULL | Support needs |
| `comment` | text | YES | NULL | General comments |
| `created_at` | timestamp | YES | CURRENT_TIMESTAMP | Record creation time |
| `updated_at` | timestamp | YES | CURRENT_TIMESTAMP | Last update time |
| `custom_field_1` | varchar(255) | YES | NULL | Custom field 1 (Center 1) |
| `custom_field_2` | varchar(255) | YES | NULL | Custom field 2 (Center 2) |
| `custom_field_3` | varchar(255) | YES | NULL | Custom field 3 (Center 3) |
| `custom_field_4` | varchar(255) | YES | NULL | Custom field 4 (Center 4) |
| `groups` | varchar(255) | YES | NULL | Assigned groups |
| `legacy_id` | varchar(100) | YES | NULL | Legacy system ID |
| `documents` | json | YES | NULL | Attached documents (JSON array) |

---

## 🔗 API Routes

Base URL: `https://dashboard.iplanbymsl.in/api`

### Student Routes (`studentRoutes.js`)

| Method | Endpoint | Description | Controller Function |
|--------|----------|-------------|---------------------|
| GET | `/students` | Get all students | `getStudents()` |
| GET | `/students/:id` | Get single student | `getStudent()` |
| POST | `/students` | Create new student | `createStudent()` |
| PUT | `/students/:id` | Update student | `updateStudent()` |
| DELETE | `/students/:id` | Delete student | `deleteStudent()` |
| GET | `/students/:studentId/assessments` | Get student assessments | `getAssessments()` |

### Assessment Routes (via studentRoutes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/students/assessments` | Create assessment |
| DELETE | `/students/assessments/:id` | Delete assessment |
| POST | `/students/assessments/generate-report` | Generate report |

---

## 🔄 Data Flow & Field Mapping

### 1. Frontend State (formData)

```javascript
const [formData, setFormData] = useState({
  firstName: '',           // First Name
  middleName: '',          // Middle Name
  lastName: '',            // Last Name
  examineeId: '',          // Student ID (mapped to studentId)
  gender: '',              // Gender (Male/Female/Other)
  birthDate: '',           // Date of Birth (mapped to dateOfBirth)
  email: '',               // Email
  comment: '',             // Comment
  account: 'MINDSAID LEARNING CENTRE',  // Centre Name (mapped to centreName)
  center1: '',             // Custom Field 1
  center2: '',             // Custom Field 2
  center3: '',             // Custom Field 3
  center4: ''              // Custom Field 4
});
```

### 2. API Request Data (camelCase)

```javascript
const apiData = {
  firstName: formData.firstName,
  middleName: formData.middleName,
  lastName: formData.lastName,
  studentId: formData.examineeId,        // form.examineeId -> studentId
  gender: formData.gender.toLowerCase(),  // "Male" -> "male"
  dateOfBirth: formData.birthDate,        // form.birthDate -> dateOfBirth
  email: formData.email,
  comment: formData.comment,
  centreName: formData.account,          // form.account -> centreName
  customField1: formData.center1,        // form.center1 -> customField1
  customField2: formData.center2,
  customField3: formData.center3,
  customField4: formData.center4,
  status: 'active'
};
```

**API Call:**
```javascript
const response = await api.request('/students', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(apiData)
});
```

### 3. Backend Controller Mapping (snake_case)

**Controller:** `studentController.js` -> `createStudent()` / `updateStudent()`

```javascript
// Map camelCase (API) to snake_case (Database)
const studentData = {
  student_id: req.body.studentId || `STU${Date.now()}`,
  first_name: req.body.firstName,
  middle_name: req.body.middleName,       // NEW: Added 2026-04-01
  last_name: req.body.lastName,
  email: req.body.email,
  phone: req.body.phone,
  date_of_birth: req.body.dateOfBirth,
  gender: req.body.gender,
  centre_id: req.body.centreId || 1,
  centre_name: req.body.centreName,       // NEW: Added 2026-04-01
  address: req.body.address,
  city: req.body.city,
  state: req.body.state,
  zip_code: req.body.zipCode,
  emergency_contact_name: req.body.emergencyContactName,
  emergency_contact_phone: req.body.emergencyContactPhone,
  emergency_contact_relation: req.body.emergencyContactRelation,
  learning_needs: req.body.learningNeeds,
  support_requirements: req.body.supportRequirements,
  comment: req.body.comment,              // NEW: Added 2026-04-01
  custom_field_1: req.body.customField1, // NEW: Added 2026-04-01
  custom_field_2: req.body.customField2,
  custom_field_3: req.body.customField3,
  custom_field_4: req.body.customField4,
  registration_date: req.body.registrationDate || new Date().toISOString().split('T')[0],
  status: req.body.status || 'active'
};

// Handle documents (JSON)
if (req.body.documents && Array.isArray(req.body.documents)) {
  studentData.documents = JSON.stringify(req.body.documents);
}

// Remove undefined/empty values
Object.keys(studentData).forEach(key => {
  if (studentData[key] === undefined || studentData[key] === '') {
    delete studentData[key];
  }
});
```

### 4. Database Storage

Direct storage of `studentData` (snake_case fields) into `kivi_students` table.

---

## 📝 Complete Field Mapping Table

| Frontend (formData) | API Request | Controller (req.body) | Database Column | Notes |
|---------------------|-------------|----------------------|-----------------|-------|
| `firstName` | `firstName` | `req.body.firstName` | `first_name` | Required |
| `middleName` | `middleName` | `req.body.middleName` | `middle_name` | Optional |
| `lastName` | `lastName` | `req.body.lastName` | `last_name` | Required |
| `examineeId` | `studentId` | `req.body.studentId` | `student_id` | Auto-generated if empty |
| `gender` | `gender` (lowercase) | `req.body.gender` | `gender` | enum: male/female/other |
| `birthDate` | `dateOfBirth` | `req.body.dateOfBirth` | `date_of_birth` | Date format: YYYY-MM-DD |
| `email` | `email` | `req.body.email` | `email` | Optional |
| `comment` | `comment` | `req.body.comment` | `comment` | NEW: Added 2026-04-01 |
| `account` | `centreName` | `req.body.centreName` | `centre_name` | NEW: Added 2026-04-01 |
| `center1` | `customField1` | `req.body.customField1` | `custom_field_1` | Center 1 |
| `center2` | `customField2` | `req.body.customField2` | `custom_field_2` | Center 2 |
| `center3` | `customField3` | `req.body.customField3` | `custom_field_3` | Center 3 |
| `center4` | `customField4` | `req.body.customField4` | `custom_field_4` | Center 4 |
| - | `phone` | `req.body.phone` | `phone` | Not in form yet |
| - | `address` | `req.body.address` | `address` | Not in form yet |
| - | `city` | `req.body.city` | `city` | Not in form yet |
| - | `state` | `req.body.state` | `state` | Not in form yet |
| - | `zipCode` | `req.body.zipCode` | `zip_code` | Not in form yet |
| - | `emergencyContactName` | `req.body.emergencyContactName` | `emergency_contact_name` | Not in form yet |
| - | `emergencyContactPhone` | `req.body.emergencyContactPhone` | `emergency_contact_phone` | Not in form yet |
| - | `emergencyContactRelation` | `req.body.emergencyContactRelation` | `emergency_contact_relation` | Not in form yet |
| - | `learningNeeds` | `req.body.learningNeeds` | `learning_needs` | Not in form yet |
| - | `supportRequirements` | `req.body.supportRequirements` | `support_requirements` | Not in form yet |
| - | `documents` | `req.body.documents` (Array) | `documents` (JSON) | File uploads |

---

## 🧪 Example API Request/Response

### Create Student (POST /api/students)

**Request:**
```bash
curl -X POST https://dashboard.iplanbymsl.in/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "Rahul",
    "middleName": "Kumar",
    "lastName": "Sharma",
    "studentId": "STU2024001",
    "gender": "male",
    "dateOfBirth": "2010-05-15",
    "email": "rahul@example.com",
    "comment": "Special attention needed",
    "centreName": "MINDSAID LEARNING CENTRE",
    "customField1": "Center A",
    "customField2": "Center B",
    "customField3": "",
    "customField4": "",
    "status": "active"
  }'
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 7
  },
  "message": "Student created successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Column 'middle_name' does not exist"
}
```

### Get All Students (GET /api/students)

**Request:**
```bash
curl -X GET https://dashboard.iplanbymsl.in/api/students \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "student_id": "STU2024001",
      "first_name": "Rahul",
      "middle_name": "Kumar",
      "last_name": "Sharma",
      "email": "rahul@example.com",
      "date_of_birth": "2010-05-15",
      "gender": "male",
      "centre_name": "MINDSAID LEARNING CENTRE",
      "custom_field_1": "Center A",
      "status": "active"
    }
  ]
}
```

### Update Student (PUT /api/students/:id)

**Request:**
```bash
curl -X PUT https://dashboard.iplanbymsl.in/api/students/7 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "Rahul Updated",
    "lastName": "Sharma",
    "comment": "Updated comment"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully"
}
```

---

## 🗂️ File Locations

### Local Development
```
/Users/adityasharma/Desktop/kivi/
├── client/src/components/
│   ├── ExamineeCreateForm.jsx      # Create student form
│   ├── ExamineesManagement.jsx     # List/manage students
│   ├── ExamineeDetail.jsx          # Student detail view
│   └── ExamineeEditForm.jsx        # Edit student form
├── client/src/services/
│   └── api.js                      # API service
├── server/controllers/
│   └── studentController.js        # Backend controller
├── server/routes/
│   └── studentRoutes.js            # API routes
└── server/models/
    └── Student.js                  # Database model
```

### Production Server
```
/root/dashboard/
├── client/src/components/
│   └── ExamineeCreateForm.jsx      # Frontend form
├── server/controllers/
│   └── studentController.js        # Backend controller
├── server/routes/
│   └── studentRoutes.js            # API routes
└── server/models/
    └── Student.js                  # Database model
```

### Nginx Web Root
```
/var/www/dashboard/                  # Built frontend files
```

---

## 🔧 Recent Changes (2026-04-01)

### Database Changes
Added columns to `kivi_students`:
```sql
ALTER TABLE kivi_students 
  ADD COLUMN middle_name VARCHAR(100) AFTER first_name,
  ADD COLUMN centre_name VARCHAR(255) AFTER centre_id,
  ADD COLUMN comment TEXT AFTER support_requirements;
```

### Controller Changes (`studentController.js`)
- Added `middle_name` mapping in `createStudent()` and `updateStudent()`
- Added `centre_name` mapping
- Added `comment` mapping
- Added `custom_field_1` through `custom_field_4` mappings

### Frontend Changes (`ExamineeCreateForm.jsx`)
- Changed API data format from snake_case to camelCase
- Fixed field mappings to match controller expectations

---

## ⚠️ Important Notes

1. **Case Sensitivity:** API expects camelCase, database uses snake_case. Controller handles the conversion.

2. **Auto-generated ID:** If `studentId` is not provided, controller generates: `STU${Date.now()}`

3. **Default Values:**
   - `centre_id`: 1 (if not provided)
   - `status`: 'active'
   - `registration_date`: Current date

4. **Documents:** Must be sent as JSON array, stored as JSON string in database

5. **Gender:** Must be lowercase ('male', 'female', 'other')

6. **Date Format:** Use ISO format `YYYY-MM-DD`

7. **Cache:** Backend uses 5-minute cache for student records (cleared on update)

---

## 🐛 Troubleshooting

### Issue: "Unknown column 'middle_name'"
**Fix:** Run the ALTER TABLE commands to add missing columns

### Issue: "Failed to create examinee"
**Check:** 
- API request format (must be camelCase)
- Required fields: firstName, lastName, birthDate, gender
- Network connectivity

### Issue: API returns 500
**Check:**
- Backend logs: `pm2 logs kivi`
- Database connection
- Missing columns in database

---

## 📞 Quick Commands

```bash
# Check backend logs
sshpass -p 'Bazeer@12345' ssh root@195.35.45.17 "pm2 logs kivi --lines 50"

# Check database columns
sshpass -p 'Bazeer@12345' ssh root@195.35.45.17 "mysql -u root -pTiger@123 kivi -e 'DESCRIBE kivi_students;'"

# Restart backend
sshpass -p 'Bazeer@12345' ssh root@195.35.45.17 "cd /root/dashboard/server && pm2 restart kivi"

# Test API
curl -X POST https://dashboard.iplanbymsl.in/api/students \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"Student","gender":"male","dateOfBirth":"2010-01-01"}'
```

---

**Last Updated:** April 1, 2026
**Author:** Aditya Sharma
**Status:** Production Ready
