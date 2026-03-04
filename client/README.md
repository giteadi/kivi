# MindSaid Learning - Educational Therapy Management System

This is the frontend application for MindSaid Learning's educational therapy management system, built with React + Vite.

## Overview

MindSaid Learning is a comprehensive educational therapy management platform designed to help learning centres manage students, therapists, sessions, and educational programmes. The system provides tools for session scheduling, student progress tracking, and centre administration.

## Features

- **Student Management**: Comprehensive student profiles and progress tracking
- **Therapist Management**: Therapist profiles, specialties, and scheduling
- **Session Scheduling**: Book and manage therapy sessions
- **Programme Management**: Educational programmes and therapy services
- **Centre Administration**: Multi-centre support and management
- **Dashboard Analytics**: Real-time insights and reporting
- **Template System**: Standardized session documentation

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Redux Toolkit
- **Icons**: React Icons (Feather Icons)
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
client/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── StudentsList.jsx # Student management
│   │   ├── TherapistsList.jsx # Therapist management
│   │   ├── SessionsList.jsx # Session scheduling
│   │   └── ...
│   ├── services/           # API services
│   ├── store/             # Redux store and slices
│   └── assets/            # Static assets
├── public/                # Public assets
└── dist/                 # Build output
```

## Key Components

### Dashboard
- Overview of centre statistics
- Upcoming sessions
- Top performing therapists
- Quick actions and navigation

### Student Management
- Student profiles and information
- Session history and progress
- Educational assessments
- Family communication

### Therapist Management
- Therapist profiles and qualifications
- Specialties and availability
- Performance metrics
- Session assignments

### Session Management
- Session scheduling and booking
- Template-based documentation
- Progress tracking
- Billing integration

### Centre Administration
- Multi-centre support
- Staff management
- Programme configuration
- Reporting and analytics

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint for code linting and follows React best practices:

- Functional components with hooks
- Component composition patterns
- Proper prop validation
- Consistent naming conventions

## API Integration

The frontend integrates with the MindSaid Learning backend API for:

- Student and therapist data management
- Session scheduling and tracking
- Programme and centre administration
- Authentication and authorization
- Real-time dashboard updates

## Deployment

The application can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
