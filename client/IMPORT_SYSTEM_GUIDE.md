# Import System Guide

## Overview
The KiviCare dashboard now includes a comprehensive import system that allows users to bulk import data for Patients, Doctors, Receptionists, and Appointments. This system provides a user-friendly interface matching the KiviCare design standards.

## Features

### 🔄 Multi-Format Support
- **CSV Files** - Comma-separated values
- **Excel Files** (.xlsx) - Microsoft Excel format
- **JSON Files** - JavaScript Object Notation

### 📋 Data Types Supported
1. **Patients Import**
2. **Doctors Import** 
3. **Receptionists Import**
4. **Appointments Import**

### 🎯 Key Capabilities
- **File Format Validation** - Only accepts supported file types
- **Required Fields Display** - Shows mandatory columns for each import type
- **Sample File Download** - Provides template files for proper formatting
- **Notification Options** - Email and SMS alerts when import completes
- **Progress Tracking** - Visual feedback during upload process
- **Error Handling** - Clear error messages for failed imports

## How to Use

### Step 1: Access Import Feature
Navigate to any of the following sections:
- **Patients** → All Patients → "Import Data" button
- **Doctors** → All Doctors → "Import Data" button  
- **Receptionists** → All Receptionists → "Import Data" button
- **Appointments** → All Appointments → "Import Data" button

### Step 2: Select File Format
Choose from the dropdown:
- CSV
- Excel (.xlsx)
- JSON

### Step 3: Upload Your File
- Click "Click to upload" or drag and drop your file
- Supported file types: .csv, .xlsx, .json
- File validation happens automatically

### Step 4: Download Sample (Optional)
- Click "Download Sample" to get a template file
- Template shows the exact format and required columns
- Use this as a reference for your data structure

### Step 5: Configure Notifications
Choose notification preferences:
- ✅ **Email notification** when import completes
- ✅ **SMS notification** when import completes

### Step 6: Import Data
- Click "Import [Type]" button to start the process
- Progress indicator shows upload status
- Success message displays number of records imported

## Required Fields by Import Type

### Patients Import
```
- first_name
- last_name
- email
- country_calling_code
- country_code
- contact
- gender
```

### Doctors Import
```
- first_name
- last_name
- email
- contact
- specialty
- qualification
- license_number
```

### Receptionists Import
```
- first_name
- last_name
- email
- contact
- department
- shift
- employee_id
```

### Appointments Import
```
- patient_name
- doctor_name
- appointment_date
- appointment_time
- clinic
- service_type
```

## File Format Examples

### CSV Format
```csv
first_name,last_name,email,contact,gender
John,Doe,john.doe@email.com,+1234567890,Male
Jane,Smith,jane.smith@email.com,+1234567891,Female
```

### JSON Format
```json
[
  {
    "first_name": "John",
    "last_name": "Doe", 
    "email": "john.doe@email.com",
    "contact": "+1234567890",
    "gender": "Male"
  },
  {
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@email.com", 
    "contact": "+1234567891",
    "gender": "Female"
  }
]
```

## Error Handling

### Common Errors
- **Missing Required Fields** - File must contain all mandatory columns
- **Invalid File Format** - Only CSV, Excel, and JSON files accepted
- **Empty File** - File must contain data rows
- **Invalid Data Types** - Data must match expected formats

### Error Messages
- Clear, actionable error messages
- Specific field validation errors
- File format validation feedback
- Upload progress errors

## Technical Implementation

### Components
- **ImportModal.jsx** - Main import interface component
- **Integration** - Added to all list components (PatientsList, DoctorsList, etc.)

### State Management
- File selection state
- Format validation state  
- Upload progress tracking
- Notification preferences
- Error handling state

### User Experience
- **Modal Interface** - Clean, focused import experience
- **Drag & Drop** - Intuitive file selection
- **Progress Indicators** - Visual feedback during operations
- **Responsive Design** - Works on all device sizes
- **Accessibility** - Keyboard navigation and screen reader support

## Best Practices

### Data Preparation
1. **Use Sample Files** - Download templates for correct format
2. **Validate Data** - Check required fields before upload
3. **Clean Data** - Remove duplicates and invalid entries
4. **Test Small Batches** - Start with small files to test format

### File Management
1. **Consistent Naming** - Use clear, descriptive file names
2. **Backup Data** - Keep original files as backup
3. **Version Control** - Track different versions of import files
4. **Documentation** - Document any data transformations

## Troubleshooting

### Import Fails
1. Check file format matches selection
2. Verify all required fields are present
3. Ensure data types are correct
4. Try with a smaller file first

### Slow Upload
1. Check file size (large files take longer)
2. Verify internet connection
3. Try during off-peak hours
4. Consider splitting large files

### Data Not Appearing
1. Refresh the page after import
2. Check import success message
3. Verify data format matches requirements
4. Contact support if issues persist

## Future Enhancements

### Planned Features
- **Data Validation** - Advanced field validation rules
- **Duplicate Detection** - Automatic duplicate handling
- **Import History** - Track of previous imports
- **Scheduled Imports** - Automated recurring imports
- **Data Mapping** - Custom field mapping interface
- **Bulk Updates** - Update existing records via import

---

*This import system provides a robust, user-friendly way to manage bulk data operations in the KiviCare dashboard while maintaining data integrity and providing excellent user experience.*