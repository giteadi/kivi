# KiviCare Backend API

A comprehensive healthcare management system backend built with Node.js, Express, and MySQL2.

## Features

- **MVC Architecture**: Clean separation of concerns with Models, Views, and Controllers
- **MySQL2 Database**: Robust database operations with connection pooling
- **RESTful API**: Complete CRUD operations for all entities
- **Dashboard Analytics**: Real-time statistics and filtering
- **Authentication**: Simple login/register system (no bcrypt as requested)
- **CORS Enabled**: Cross-origin resource sharing for frontend integration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL2
- **Environment**: dotenv
- **Development**: Nodemon

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   
   Update the `.env` file with your database credentials:
   ```env
   DATABASE=kivi
   HOST=localhost
   DB_USER=root
   PASSWORD=your_mysql_password
   JWT_SECRET=kivi
   NODE_ENV=development
   PORT=3005
   ```

4. **Setup Database**
   
   Create the database and tables by running the SQL script:
   ```bash
   mysql -u root -p < config/database.sql
   ```

5. **Start the server**
   
   Development mode:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/data` - Get complete dashboard data
- `GET /api/dashboard/upcoming-appointments` - Get upcoming appointments
- `GET /api/dashboard/top-doctors` - Get top performing doctors
- `GET /api/dashboard/booking-chart` - Get booking status chart data

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Clinics
- `GET /api/clinics` - Get all clinics
- `GET /api/clinics/:id` - Get clinic by ID
- `POST /api/clinics` - Create new clinic
- `PUT /api/clinics/:id` - Update clinic
- `DELETE /api/clinics/:id` - Delete clinic

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

## Dashboard Filtering

The dashboard supports advanced filtering with the following query parameters:

- `startDate` - Filter by start date (YYYY-MM-DD)
- `endDate` - Filter by end date (YYYY-MM-DD)
- `clinicId` - Filter by specific clinic
- `doctorId` - Filter by specific doctor

Example:
```
GET /api/dashboard/data?startDate=2026-01-01&endDate=2026-12-31&clinicId=1
```

## Database Schema

The system includes the following main entities:

- **Users** - Authentication and user management
- **Clinics** - Healthcare facilities
- **Doctors** - Medical practitioners
- **Patients** - Patient records
- **Receptionists** - Administrative staff
- **Services** - Medical services offered
- **Appointments** - Appointment scheduling
- **Encounters** - Medical encounters/visits
- **Encounter Templates** - Reusable encounter forms
- **Billing Records** - Financial transactions
- **Taxes** - Tax configuration

## Default Login Credentials

```
Email: admin@kivicare.com
Password: admin123
```

## Development

The server uses nodemon for development with hot reloading:

```bash
npm run dev
```

## Error Handling

The API includes comprehensive error handling:

- **400** - Bad Request (validation errors)
- **401** - Unauthorized (authentication required)
- **404** - Not Found (resource doesn't exist)
- **409** - Conflict (duplicate resources)
- **500** - Internal Server Error

## CORS Configuration

CORS is enabled for all origins in development. For production, configure specific origins in the CORS middleware.

## Security Notes

- Passwords are stored in plain text as requested (no bcrypt)
- JWT tokens are simple strings for demo purposes
- In production, implement proper security measures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.