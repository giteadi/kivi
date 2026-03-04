# MindSaid Learning Backend API

A comprehensive educational therapy management system backend built with Node.js, Express, and MySQL2.

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
   DATABASE=mindsaid_learning
   HOST=localhost
   DB_USER=root
   PASSWORD=your_mysql_password
   JWT_SECRET=mindsaid_learning_secret
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
- `GET /api/dashboard/upcoming-sessions` - Get upcoming sessions
- `GET /api/dashboard/top-therapists` - Get top performing therapists
- `GET /api/dashboard/booking-chart` - Get booking status chart data

### Sessions (Appointments)
- `GET /api/appointments` - Get all sessions
- `GET /api/appointments/:id` - Get session by ID
- `POST /api/appointments` - Create new session
- `PUT /api/appointments/:id` - Update session
- `DELETE /api/appointments/:id` - Delete session

### Students (Patients)
- `GET /api/patients` - Get all students
- `GET /api/patients/:id` - Get student by ID
- `POST /api/patients` - Create new student
- `PUT /api/patients/:id` - Update student
- `DELETE /api/patients/:id` - Delete student

### Therapists (Doctors)
- `GET /api/doctors` - Get all therapists
- `GET /api/doctors/:id` - Get therapist by ID
- `POST /api/doctors` - Create new therapist
- `PUT /api/doctors/:id` - Update therapist
- `DELETE /api/doctors/:id` - Delete therapist

### Centres (Clinics)
- `GET /api/clinics` - Get all centres
- `GET /api/clinics/:id` - Get centre by ID
- `POST /api/clinics` - Create new centre
- `PUT /api/clinics/:id` - Update centre
- `DELETE /api/clinics/:id` - Delete centre

### Programmes (Services)
- `GET /api/services` - Get all programmes
- `GET /api/services/:id` - Get programme by ID
- `POST /api/services` - Create new programme
- `PUT /api/services/:id` - Update programme
- `DELETE /api/services/:id` - Delete programme

## Dashboard Filtering

The dashboard supports advanced filtering with the following query parameters:

- `startDate` - Filter by start date (YYYY-MM-DD)
- `endDate` - Filter by end date (YYYY-MM-DD)
- `centreId` - Filter by specific centre
- `therapistId` - Filter by specific therapist

Example:
```
GET /api/dashboard/data?startDate=2026-01-01&endDate=2026-12-31&centreId=1
```

## Database Schema

The system includes the following main entities:

- **Users** - Authentication and user management
- **Centres** - Learning centres and facilities
- **Therapists** - Educational therapists and specialists
- **Students** - Student records and profiles
- **Receptionists** - Administrative staff
- **Programmes** - Educational programmes and therapy services
- **Sessions** - Session scheduling and management
- **Encounters** - Educational encounters/visits
- **Encounter Templates** - Reusable encounter forms
- **Billing Records** - Financial transactions
- **Taxes** - Tax configuration

## Default Login Credentials

```
Email: admin@mindsaidlearning.com
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