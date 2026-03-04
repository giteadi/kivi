# 🎓 MindSaid Learning - Complete Educational Therapy Management System

A comprehensive educational therapy management system built with **React**, **Redux Toolkit**, **Node.js**, **Express**, and **MySQL2**.

## ✨ Features

### 🔐 **Authentication System**
- Login/Register with Redux Toolkit
- JWT-like token management
- Protected routes and components
- Demo credentials included

### 📊 **Dashboard with Real-time Analytics**
- Live statistics (sessions, students, therapists, centers)
- Interactive date range filtering
- Revenue tracking and charts
- Upcoming sessions overview
- Top therapists performance

### 👥 **Complete User Management**
- **Students**: Full CRUD with profiles and learning history
- **Therapists**: Specialties, qualifications, and performance tracking
- **Staff**: Department management and shift tracking
- **Centers**: Multi-location support with analytics

### 📅 **Session System**
- Scheduling and management
- Status tracking (scheduled, confirmed, completed, cancelled)
- Therapist and center assignment
- Service integration

### 🎓 **Educational Sessions**
- Template-based session creation
- Customizable session forms
- Learning history tracking
- Treatment plan documentation

### 💰 **Financial Management**
- Billing and invoicing
- Revenue tracking by center/therapist
- Tax management
- Payment status tracking

### 🔧 **Services Management**
- Category-based service organization
- Pricing and duration management
- Service usage analytics

## 🚀 **Technology Stack**

### **Frontend**
- **React 19** - Modern UI library
- **Redux Toolkit** - State management
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first styling
- **React Icons** - Icon library
- **Axios** - HTTP client
- **Vite** - Fast build tool

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📋 **Prerequisites**

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)

## 🛠️ **Installation & Setup**

### **1. Clone Repository**
```bash
git clone <repository-url>
cd mindsaid-learning
```

### **2. Backend Setup**
```bash
cd server

# Install dependencies
npm install

# Configure environment variables
# Update .env file with your MySQL credentials:
DATABASE=mindsaid_learning
HOST=localhost
DB_USER=root
PASSWORD=your_mysql_password
PORT=3005

# Start server (automatically creates database and tables)
npm run dev
```

The server will:
- ✅ Automatically create the `mindsaid_learning` database
- ✅ Create all required tables with relationships
- ✅ Insert sample data
- ✅ Start on port 3005

### **3. Frontend Setup**
```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on port 5173.

## 🔑 **Default Login Credentials**

```
Email: admin@mindsaidlearning.com
Password: admin123
```

## 📁 **Project Structure**

```
mindsaid-learning/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # React Components
│   │   ├── store/             # Redux Store & Slices
│   │   │   ├── store.js       # Main store configuration
│   │   │   └── slices/        # Redux slices
│   │   │       ├── authSlice.js
│   │   │       ├── dashboardSlice.js
│   │   │       ├── appointmentSlice.js
│   │   │       └── ...
│   │   ├── services/          # API service layer
│   │   └── ...
│   └── package.json
│
├── server/                     # Node.js Backend
│   ├── config/
│   │   └── database.sql       # Database schema & sample data
│   ├── controllers/           # Route controllers
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── index.js              # Server entry point
│   └── package.json
│
└── README.md
```

## 🔌 **API Endpoints**

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### **Dashboard**
- `GET /api/dashboard/data` - Complete dashboard data
- `GET /api/dashboard/stats` - Statistics with filtering
- `GET /api/dashboard/upcoming-sessions` - Upcoming sessions
- `GET /api/dashboard/top-therapists` - Top performing therapists
- `GET /api/dashboard/booking-chart` - Booking status chart

### **CRUD Operations**
- `GET|POST|PUT|DELETE /api/sessions` - Sessions management
- `GET|POST|PUT|DELETE /api/students` - Students management
- `GET|POST|PUT|DELETE /api/therapists` - Therapists management
- `GET|POST|PUT|DELETE /api/centers` - Centers management
- `GET|POST|PUT|DELETE /api/services` - Services management
- `GET|POST|PUT|DELETE /api/encounters` - Sessions management

## 🎯 **Key Features Implemented**

### **✅ Redux Toolkit Integration**
- Complete state management for all entities
- Async thunks for API calls
- Error handling and loading states
- Centralized data flow

### **✅ Working Dashboard Filters**
- Date range filtering with calendar picker
- Real-time data updates
- Filter persistence
- Loading states and error handling

### **✅ Automatic Database Setup**
- Server automatically creates database on startup
- All tables created with proper relationships
- Sample data insertion
- No manual SQL execution required

### **✅ Authentication Flow**
- Login screen with validation
- Token-based authentication
- Protected routes
- User session management

### **✅ Responsive Design**
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Consistent UI across devices

## 🔧 **Development Commands**

### **Backend**
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
npm run init-db  # Initialize database only
```

### **Frontend**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌟 **Advanced Features**

### **Smart Filtering System**
- Date range filtering across all modules
- Multi-criteria filtering (status, category, etc.)
- Real-time search functionality
- Filter persistence across sessions

### **Template-Based Sessions**
- Customizable session templates
- Dynamic form generation
- Field validation and requirements
- Template usage analytics

### **Import/Export System**
- CSV, Excel, and JSON support
- Bulk data import with validation
- Sample file downloads
- Import progress tracking

### **Financial Analytics**
- Revenue tracking by time periods
- Therapist performance metrics
- Center profitability analysis
- Tax calculation and management

## 🚀 **Production Deployment**

### **Backend Deployment**
1. Set environment variables for production
2. Configure MySQL connection
3. Run `npm start`
4. Set up reverse proxy (nginx recommended)

### **Frontend Deployment**
1. Run `npm run build`
2. Serve the `dist` folder
3. Configure API base URL for production

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 **License**

This project is licensed under the ISC License.

## 🆘 **Support**

For support and questions:
- Check the documentation
- Review the API endpoints
- Examine the Redux store structure
- Test with the provided demo credentials

---

**Built with ❤️ for modern educational therapy management**