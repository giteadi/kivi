# Individual Assessments Price Management

## Overview
Individual assessment tools ka price management system jo admin ko har assessment ka price edit karne deta hai.

## Changes Made

### 1. Database Table Created
**Table:** `kivi_individual_assessments`

```sql
CREATE TABLE kivi_individual_assessments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assessment_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL DEFAULT 5500.00,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Default Assessments Inserted:**
- 16PF (Personality) - ₹5,500
- BAI (Anxiety) - ₹5,500
- BASC-3 BESS College (Behavior) - ₹5,500
- BASC-3 BESS Parent Child (Behavior) - ₹5,500
- Brown EF/A Scales (Executive Function) - ₹5,500
- Conners-3 (ADHD) - ₹5,500
- GARS-3 (Autism) - ₹5,500
- WISC-V (Cognitive) - ₹5,500
- WRAT-5 (Achievement) - ₹5,500
- WJ-IV (Achievement) - ₹5,500
- VABS-3 (Adaptive Behavior) - ₹5,500
- CARS-2 (Autism) - ₹5,500
- ADHDT-2 (ADHD) - ₹5,500
- BRIEF-2 (Executive Function) - ₹5,500
- SRS-2 (Social Skills) - ₹5,500

### 2. Backend API Created

**Controller:** `individualAssessmentController.js`
**Routes:** `individualAssessmentRoutes.js`

**API Endpoints:**
```
GET    /api/individual-assessments          - Get all assessments
GET    /api/individual-assessments/:id      - Get single assessment
POST   /api/individual-assessments          - Create assessment
PUT    /api/individual-assessments/:id      - Update assessment
DELETE /api/individual-assessments/:id      - Delete assessment
GET    /api/individual-assessments/categories - Get categories
```

### 3. Frontend Integration

**AssignAssessmentScreen.jsx Updated:**
- ✅ Removed hardcoded `ASSESSMENT_PRICE = 5500`
- ✅ Now fetches assessments from API
- ✅ Each assessment shows its own price
- ✅ Total calculation uses individual prices
- ✅ Selected items show correct prices

**Changes:**
```javascript
// Before
const ASSESSMENT_PRICE = 5500;
total += selectedAssessments.length * ASSESSMENT_PRICE;

// After
selectedAssessments.forEach(assId => {
  const ass = individualAssessments.find(a => a.id === assId);
  if (ass) {
    total += ass.price;
  }
});
```

### 4. PackageManagement Component
Admin can manage individual assessments similar to packages:
- Create new assessments
- Edit assessment details
- Update prices
- Delete assessments
- Search & filter

## Database Migration

**File:** `server/config/create_individual_assessments_table.sql`

**Run Migration:**
```bash
mysql -u root -pTiger@123 kivi < server/config/create_individual_assessments_table.sql
```

## API Usage Examples

### Get All Assessments
```javascript
GET /api/individual-assessments
Response: {
  "success": true,
  "data": [
    {
      "id": 1,
      "assessment_id": "16pf",
      "name": "16PF",
      "category": "Personality",
      "price": 5500.00,
      "description": "Sixteen Personality Factor Questionnaire",
      "is_active": true
    }
  ]
}
```

### Update Assessment Price
```javascript
PUT /api/individual-assessments/1
{
  "price": 6000
}
```

### Create New Assessment
```javascript
POST /api/individual-assessments
{
  "assessment_id": "new-test",
  "name": "New Assessment Test",
  "category": "Cognitive",
  "price": 7500,
  "description": "Description here"
}
```

## Features

### ✅ Dynamic Pricing
- Each assessment has its own price
- Prices fetched from database
- No hardcoded values

### ✅ Admin Control
- Create new assessments
- Edit existing assessments
- Update prices anytime
- Soft delete (is_active flag)

### ✅ Automatic Updates
- AssignAssessmentScreen automatically uses latest prices
- Total calculation updates dynamically
- No code changes needed for price updates

## Testing Checklist

- [x] Database table created
- [x] Migration script ready
- [x] Backend API working
- [x] Frontend fetches from API
- [x] Prices display correctly
- [x] Total calculation accurate
- [x] Selected items show correct prices
- [x] CRUD operations functional

## Deployment Steps

### 1. Run Database Migration
```bash
# On production server
mysql -u root -pTiger@123 kivi < /tmp/create_individual_assessments_table.sql
```

### 2. Upload Backend Files
```bash
# Upload controller
scp server/controllers/individualAssessmentController.js aditya@195.35.45.17:/tmp/

# Upload routes
scp server/routes/individualAssessmentRoutes.js aditya@195.35.45.17:/tmp/

# On server
sudo cp /tmp/individualAssessmentController.js /root/dashboard/server/controllers/
sudo cp /tmp/individualAssessmentRoutes.js /root/dashboard/server/routes/
```

### 3. Update server/index.js
Already added:
```javascript
app.use('/api/individual-assessments', require('./routes/individualAssessmentRoutes'));
```

### 4. Restart Backend
```bash
pm2 restart dashboard
```

### 5. Deploy Frontend
```bash
# Build and upload
cd client && npm run build
tar -czf /tmp/kivi-dist.tar.gz -C dist .
scp /tmp/kivi-dist.tar.gz aditya@195.35.45.17:/tmp/

# On server
sudo rm -rf /var/www/dashboard/*
sudo tar -xzf /tmp/kivi-dist.tar.gz -C /var/www/dashboard/
sudo chown -R www-data:www-data /var/www/dashboard
```

## Future Enhancements

- [ ] Bulk price update
- [ ] Price history tracking
- [ ] Discount management
- [ ] Package-specific pricing
- [ ] Center-specific pricing
- [ ] Seasonal pricing

---

**Status:** ✅ Complete and Ready for Deployment
**Last Updated:** April 24, 2026
**Version:** 1.0.0
