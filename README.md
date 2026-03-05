# SkillMatrix Pro - Employee Skill & Project Analytics System

A production-ready full-stack web application for managing employee skills and project assignments with comprehensive analytics dashboards.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🚀 Features

### Admin Portal
- **Dashboard Analytics**
  - Top 20 Skills visualization
  - Top Projects by team size
  - Skill category distribution (Bar & Pie charts)
  - Trending skills section
  - Real-time statistics

- **User Management**
  - CRUD operations for users
  - Role-based access control
  - Profile completion tracking

- **Skill Management**
  - Create, update, delete skills
  - Category-based organization
  - Proficiency level tracking (1-5)

- **Project Management**
  - CRUD operations for projects
  - Team assignment functionality
  - Project analytics

### Employee Portal
- **Personal Dashboard**
  - Profile completion progress bar
  - Skills overview
  - Projects timeline
  - Skill growth chart

- **Skill Management**
  - Add/update personal skills
  - Proficiency level updates
  - Skill categorization

- **Project View**
  - Assigned projects list
  - Project details and descriptions

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JSON Web Tokens (JWT)** - Authentication
- **Bcrypt.js** - Password hashing
- **Express Validator** - Input validation

## 📁 Project Structure

```
SKILLS/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── EmployeeLayout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/          # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── EmployeeDashboard.jsx
│   │   ├── services/         # API service layer
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── skillService.js
│   │   │   ├── projectService.js
│   │   │   └── userService.js
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                    # Backend Node.js application
│   ├── config/               # Configuration files
│   │   └── database.js       # PostgreSQL connection
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── skillController.js
│   │   └── projectController.js
│   ├── models/               # Database models
│   │   ├── User.js
│   │   ├── Skill.js
│   │   └── Project.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── skillRoutes.js
│   │   └── projectRoutes.js
│   ├── middlewares/          # Custom middlewares
│   │   ├── auth.js           # JWT verification
│   │   ├── errorHandler.js   # Error handling
│   │   └── validation.js     # Input validation
│   ├── server.js             # Entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── database/                  # Database files
│   └── schema.sql            # PostgreSQL schema
│
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Database Setup

1. **Install PostgreSQL**
   - Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)

2. **Create Database**
   ```bash
   # Login to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE skillmatrix_db;

   # Exit psql
   \q
   ```

3. **Run Schema**
   ```bash
   psql -U postgres -d skillmatrix_db -f database/schema.sql
   ```

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy example env file
   cp .env.example .env

   # Edit .env file with your configuration
   # Update DB credentials and JWT secret
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
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

   Application will run on `http://localhost:5173`

## 🔐 Demo Credentials

### Admin Account
- **Email**: admin@skillmatrix.com
- **Password**: password123

### Employee Account
- **Email**: john@company.com
- **Password**: password123

## 📡 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login user
GET    /api/auth/me          # Get current user
POST   /api/auth/logout      # Logout user
```

### User Endpoints (Admin Only)

```
GET    /api/users            # Get all users
GET    /api/users/:id        # Get user by ID
PUT    /api/users/:id        # Update user
DELETE /api/users/:id        # Delete user
PUT    /api/users/profile    # Update own profile
```

### Skill Endpoints

```
GET    /api/skills                        # Get all skills
GET    /api/skills/:id                    # Get skill by ID
POST   /api/skills                        # Create skill (Admin)
PUT    /api/skills/:id                    # Update skill (Admin)
DELETE /api/skills/:id                    # Delete skill (Admin)
GET    /api/skills/employee/my-skills     # Get employee's skills
POST   /api/skills/employee/add           # Add skill to employee
PUT    /api/skills/employee/:id           # Update employee skill
DELETE /api/skills/employee/:id           # Delete employee skill
GET    /api/skills/analytics/top          # Get top skills (Admin)
GET    /api/skills/analytics/distribution # Get skill distribution (Admin)
```

### Project Endpoints

```
GET    /api/projects                     # Get all projects
GET    /api/projects/:id                 # Get project by ID
POST   /api/projects                     # Create project (Admin)
PUT    /api/projects/:id                 # Update project (Admin)
DELETE /api/projects/:id                 # Delete project (Admin)
GET    /api/projects/my-projects         # Get user's projects
GET    /api/projects/:id/team            # Get project team
POST   /api/projects/:id/assign          # Assign user to project (Admin)
DELETE /api/projects/:id/assign/:userId  # Remove user from project (Admin)
GET    /api/projects/analytics/top       # Get top projects (Admin)
```

## 🎨 Color Themes

### Admin Portal
- **Primary**: Dark Blue (#1e3a8a)
- **Secondary**: Teal (#0d9488)
- **Accent**: Orange (#f97316)

### Employee Portal
- **Primary**: Purple (#7c3aed)
- **Secondary**: Green (#10b981)
- **Background**: Light Gray (#f3f4f6)

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Protection against XSS attacks
- **Role-Based Access Control**: Admin and employee roles
- **Input Validation**: Express-validator for request validation
- **SQL Injection Prevention**: Parameterized queries
- **Error Handling**: Centralized error handler
- **Environment Variables**: Sensitive data protection

## 🗄️ Database Schema

### Tables

1. **users**
   - User accounts with role-based access
   - Stores credentials and profile information

2. **skills**
   - Master list of all available skills
   - Categorized for organization

3. **employee_skills**
   - Junction table linking users to skills
   - Proficiency level tracking (1-5)

4. **projects**
   - Project information and metadata
   - Created by admin users

5. **project_assignments**
   - Junction table for project-user relationships
   - Tracks team assignments

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 📦 Building for Production

### Frontend Build
```bash
cd client
npm run build
```

### Backend Production
```bash
cd server
NODE_ENV=production npm start
```

## 🚀 Deployment

### Backend Deployment (Heroku Example)
```bash
cd server
heroku create skillmatrix-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Frontend Deployment (Vercel Example)
```bash
cd client
vercel deploy --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Senior Full Stack Architect**

## 🙏 Acknowledgments

- React team for the amazing framework
- PostgreSQL for the robust database
- Tailwind CSS for the utility-first CSS framework
- Recharts for beautiful chart components

## 📞 Support

For support, email support@skillmatrix.com or open an issue in the repository.

## 🔄 Version History

- **1.0.0** (2026-02-20)
  - Initial release
  - Admin and Employee portals
  - Complete CRUD operations
  - Analytics dashboards
  - JWT authentication
  - Role-based access control

---

**Built with ❤️ using React, Node.js, and PostgreSQL**
