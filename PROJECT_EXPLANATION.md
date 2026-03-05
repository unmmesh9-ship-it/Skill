# 📘 SkillMatrix Pro - Complete Project Explanation

## 🎯 What is SkillMatrix Pro?

**SkillMatrix Pro** is a full-stack web application designed for **Employee Skill & Project Analytics Management**. It helps organizations:
- Track employee skills and proficiency levels
- Manage projects and team assignments
- Analyze skill distribution across the organization
- Monitor project progress and team composition

---

## 🏗️ Architecture Overview

### **Tech Stack**

#### **Backend (Server)**
- **Framework:** Node.js with Express.js
- **Database:** PostgreSQL (Relational Database)
- **Authentication:** JWT (JSON Web Tokens) + Bcrypt for password hashing
- **Architecture:** MVC (Model-View-Controller) Pattern

#### **Frontend (Client)**
- **Framework:** React 18.2 with Vite
- **Routing:** React Router DOM v6
- **State Management:** Context API (AuthContext)
- **Styling:** Tailwind CSS
- **Charts:** Recharts for data visualization
- **HTTP Client:** Axios

---

## 📂 Project Structure

```
SKILLS/
├── server/                    # Backend Application
│   ├── config/
│   │   └── database.js       # PostgreSQL connection pool
│   ├── controllers/          # Business logic handlers
│   │   ├── authController.js      # Login, Register, Logout
│   │   ├── userController.js      # User CRUD operations
│   │   ├── skillController.js     # Skill management
│   │   └── projectController.js   # Project management
│   ├── models/               # Database models
│   │   ├── User.js           # User model with bcrypt hashing
│   │   ├── Skill.js          # Skill model
│   │   └── Project.js        # Project model
│   ├── middlewares/          # Express middlewares
│   │   ├── auth.js           # JWT verification & role-based access
│   │   ├── errorHandler.js   # Global error handling
│   │   └── validation.js     # Input validation with express-validator
│   ├── routes/               # API route definitions
│   │   ├── authRoutes.js     # /api/auth/*
│   │   ├── userRoutes.js     # /api/users/*
│   │   ├── skillRoutes.js    # /api/skills/*
│   │   └── projectRoutes.js  # /api/projects/*
│   ├── server.js             # Main Express server
│   ├── demo-server.js        # Demo server with mock data
│   ├── update-passwords.js   # Password reset utility
│   ├── add-projects.js       # Database seeding script
│   ├── .env                  # Environment variables
│   └── package.json          # Backend dependencies
│
├── client/                    # Frontend Application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── AdminLayout.jsx    # Admin sidebar & navigation
│   │   │   ├── EmployeeLayout.jsx # Employee sidebar & navigation
│   │   │   └── ProtectedRoute.jsx # Route authentication wrapper
│   │   ├── context/          # React Context for state
│   │   │   └── AuthContext.jsx    # Global authentication state
│   │   ├── pages/            # Page components
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Register.jsx       # Registration page
│   │   │   ├── AdminDashboard.jsx # Admin analytics dashboard
│   │   │   ├── AdminUsers.jsx     # User management page
│   │   │   ├── AdminSkills.jsx    # Skills management page
│   │   │   ├── AdminProjects.jsx  # Projects management page
│   │   │   └── EmployeeDashboard.jsx # Employee personal dashboard
│   │   ├── services/         # API service layers
│   │   │   ├── api.js            # Axios configuration & interceptors
│   │   │   ├── authService.js    # Authentication APIs
│   │   │   ├── userService.js    # User APIs
│   │   │   ├── skillService.js   # Skill APIs
│   │   │   └── projectService.js # Project APIs
│   │   ├── App.jsx           # Main app with routing
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles (Tailwind)
│   ├── vite.config.js        # Vite configuration (proxy to backend)
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── package.json          # Frontend dependencies
│
├── database/
│   └── schema.sql            # Complete database schema + sample data
│
└── Documentation Files
    ├── README.md             # Main project documentation
    ├── QUICKSTART.md         # Quick setup guide
    ├── API_REFERENCE.md      # Complete API documentation
    ├── DEVELOPMENT.md        # Development guidelines
    ├── DEPLOYMENT.md         # Production deployment guide
    ├── DATABASE_SETUP.md     # Database setup instructions
    └── LOGIN_CREDENTIALS.md  # Login credentials reference
```

---

## 🗄️ Database Schema

### **Tables**

#### 1. **users** - User accounts
```sql
- id (Primary Key)
- full_name
- email (Unique)
- password (Bcrypt hashed)
- role (admin / employee)
- profile_completion (percentage)
- created_at
```

#### 2. **skills** - Available skills
```sql
- id (Primary Key)
- name (e.g., "JavaScript", "Python")
- category (e.g., "Programming", "Frontend")
- created_at
```

#### 3. **employee_skills** - User-Skill relationship
```sql
- id (Primary Key)
- user_id (Foreign Key → users)
- skill_id (Foreign Key → skills)
- proficiency_level (1-5 scale)
- years_of_experience
- assigned_at
```

#### 4. **projects** - Project information
```sql
- id (Primary Key)
- name
- description
- created_by (Foreign Key → users)
- created_at
- updated_at
```

#### 5. **project_assignments** - Project-User relationship
```sql
- id (Primary Key)
- project_id (Foreign Key → projects)
- user_id (Foreign Key → users)
- assigned_at
```

---

## 🔐 Authentication Flow

### **1. User Registration**
```
Client → POST /api/auth/register
         { full_name, email, password, role }
         ↓
Server → Validate input
         Hash password with bcrypt
         Insert into database
         Generate JWT token
         ↓
Client ← Receive token + user data
         Store in localStorage
         Redirect to dashboard
```

### **2. User Login**
```
Client → POST /api/auth/login
         { email, password }
         ↓
Server → Find user by email
         Compare password with bcrypt
         Generate JWT token (expires in 7 days)
         Set HTTP-only cookie
         ↓
Client ← Receive token + user data
         Store in localStorage
         Redirect based on role:
         - Admin → /admin/dashboard
         - Employee → /employee/dashboard
```

### **3. Protected Routes**
```
Client → Request to protected endpoint
         Send JWT in Authorization header
         ↓
Server → Verify JWT token
         Decode user ID from token
         Fetch user from database
         Check role authorization
         ↓
         If valid → Process request
         If invalid → 401 Unauthorized
```

---

## 🎨 User Interfaces

### **Admin Portal**

#### **Dashboard** (`/admin/dashboard`)
- **Statistics Cards:**
  - Total Users
  - Total Skills
  - Total Projects
  - Active Employees

- **Skill Distribution Chart:**
  - Bar chart showing employee count per skill
  - Top 10 most popular skills

- **Top Projects Table:**
  - Project names with team sizes
  - Sorted by team size

- **Trending Skills Grid:**
  - Visual skill badges
  - Employee count per skill

#### **Users Page** (`/admin/users`)
- View all users (admins + employees)
- Filter by role (All / Admin / Employee)
- User cards with profile completion progress bars
- Delete user functionality
- Shows join date and role badges

#### **Skills Page** (`/admin/skills`)
- View skills grouped by category
- 10 categories: Programming, Frontend, Backend, Database, Cloud, DevOps, Mobile, Design, Testing, Other
- Add/Edit/Delete skills
- Employee count per skill
- Search and filter capabilities

#### **Projects Page** (`/admin/projects`)
- View all projects in card layout
- Project details: name, description, team size, creator
- Add/Edit/Delete projects
- Modal forms for CRUD operations
- Created date display

### **Employee Portal**

#### **Dashboard** (`/employee/dashboard`)
- Personal welcome message
- My skills with proficiency levels (1-5 stars)
- Assigned projects list
- Profile completion percentage
- Personal statistics

---

## 🔌 API Endpoints

### **Authentication Routes** (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| POST | `/logout` | Logout user | Private |

### **User Routes** (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all users | Admin |
| GET | `/analytics/distribution` | Skill distribution data | Admin |
| GET | `/:id` | Get user by ID | Private |
| PUT | `/:id` | Update user | Private |
| DELETE | `/:id` | Delete user | Admin |

### **Skill Routes** (`/api/skills`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all skills | Private |
| GET | `/analytics/top` | Top skills by usage | Admin |
| GET | `/:id` | Get skill by ID | Private |
| POST | `/` | Create skill | Admin |
| PUT | `/:id` | Update skill | Admin |
| DELETE | `/:id` | Delete skill | Admin |

### **Project Routes** (`/api/projects`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all projects | Private |
| GET | `/my-projects` | Get my projects | Private |
| GET | `/analytics/top` | Top projects by team size | Admin |
| GET | `/:id` | Get project by ID | Private |
| POST | `/` | Create project | Admin |
| PUT | `/:id` | Update project | Admin |
| DELETE | `/:id` | Delete project | Admin |
| POST | `/:id/assign` | Assign user to project | Admin |
| DELETE | `/:id/assign/:userId` | Remove user from project | Admin |

---

## 🛡️ Security Features

### **1. Password Security**
- Passwords hashed with **bcrypt** (10 salt rounds)
- Never stored in plain text
- Secure comparison during login

### **2. JWT Authentication**
- Tokens expire after 7 days
- Stored in:
  - localStorage (client access)
  - HTTP-only cookies (XSS protection)
- Includes user ID in payload

### **3. Role-Based Access Control (RBAC)**
- Two roles: `admin` and `employee`
- Middleware checks authorization for protected routes
- Admin-only routes return 403 Forbidden for employees

### **4. Input Validation**
- Express-validator for all form inputs
- SQL injection prevention (parameterized queries)
- XSS protection (React auto-escaping)

### **5. CORS Configuration**
- Only allows requests from `http://localhost:5173`
- Credentials enabled for cookie sharing

---

## 🔄 Data Flow Example

### **Viewing Projects as Admin**

```
1. User clicks "Projects" in sidebar
   ↓
2. React Router navigates to /admin/projects
   ↓
3. AdminProjects component mounts
   ↓
4. useEffect calls projectService.getAllProjects()
   ↓
5. axios sends GET /api/projects with JWT token
   ↓
6. Backend auth middleware verifies token
   ↓
7. projectController.getAllProjects() executes
   ↓
8. Project.getAll() queries PostgreSQL database
   ↓
9. SQL query joins projects with users and counts team members
   ↓
10. Database returns project rows
    ↓
11. Controller sends JSON response
    ↓
12. Axios receives data in frontend
    ↓
13. React sets state with projects
    ↓
14. Component re-renders with project cards
```

---

## 📊 Current Database Content

### **Users (5 total)**
1. **Admin User** - admin@skillmatrix.com (admin123)
2. **John Doe** - john@company.com (password123)
3. **Jane Smith** - jane@company.com (password123)
4. **Mike Johnson** - mike@company.com (password123)
5. **Sarah Williams** - sarah@company.com (password123)

### **Skills (20 total)**
- **Programming:** JavaScript, Python, Java, C++, TypeScript
- **Frontend:** React, Angular, Vue.js, HTML/CSS
- **Backend:** Node.js, Express.js, Django
- **Database:** PostgreSQL, MongoDB, MySQL
- **Cloud:** AWS, Azure
- **DevOps:** Docker, Kubernetes
- **Other:** Git, Agile, REST API

### **Projects (6 total)**
1. **E-Commerce Platform** (2 team members)
2. **Mobile Banking App** (2 team members)
3. **AI Analytics Dashboard** (2 team members)
4. **Healthcare Portal** (1 team member)
5. **Full Stack Web Application** (2 team members) - Recently added
6. **Python Data Analysis Project** (2 team members) - Recently added

---

## 🚀 How to Run the Project

### **Development Mode**

**Backend:**
```bash
cd server
npm start
# Runs on http://localhost:5001
```

**Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### **Production Mode**

**Backend:**
```bash
cd server
NODE_ENV=production npm start
```

**Frontend:**
```bash
cd client
npm run build
# Creates optimized production build
```

---

## 🎯 Key Features

### **For Administrators**
✅ Complete user management (view, edit, delete)
✅ Skills management with categories
✅ Projects management with team assignments
✅ Analytics dashboard with charts
✅ Skill distribution visualization
✅ Role-based access control

### **For Employees**
✅ Personal dashboard
✅ View assigned skills
✅ View assigned projects
✅ Profile management
✅ Skill proficiency tracking

### **Technical Features**
✅ Full authentication & authorization
✅ RESTful API architecture
✅ Real-time data updates
✅ Responsive design (mobile-friendly)
✅ Database persistence
✅ Password encryption
✅ Token-based authentication
✅ Error handling & validation
✅ Clean code structure (MVC pattern)

---

## 🔧 Configuration Files

### **Backend (.env)**
```env
PORT=5001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=Unmesh@27
DB_NAME=skillmatrix_db
JWT_SECRET=skillmatrix_super_secret_jwt_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
```

### **Frontend (vite.config.js)**
```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:5001',
      changeOrigin: true
    }
  }
}
```

---

## 📈 Future Enhancement Ideas

1. **Advanced Analytics**
   - Skill gap analysis
   - Employee growth tracking
   - Project timeline visualization

2. **Additional Features**
   - File uploads (resumes, certifications)
   - Skill endorsements from peers
   - Project progress tracking
   - Calendar integration
   - Notifications system

3. **Performance Optimization**
   - Redis caching
   - Database indexing optimization
   - Lazy loading for large datasets
   - Image optimization

4. **Security Enhancements**
   - Two-factor authentication (2FA)
   - Password strength requirements
   - Session management
   - Rate limiting

---

## 🎓 Learning Takeaways

This project demonstrates:
- **Full-stack development** with modern technologies
- **Database design** with proper normalization
- **Authentication & Authorization** implementation
- **RESTful API** design principles
- **React patterns** (Context API, hooks, routing)
- **State management** without Redux
- **Security best practices**
- **MVC architecture** in Node.js
- **SQL queries** with joins and aggregations

---

## 📞 Summary

**SkillMatrix Pro** is a production-ready full-stack application that demonstrates industry-standard practices for building secure, scalable web applications. It combines a powerful React frontend with a robust Node.js/Express backend, leveraging PostgreSQL for data persistence and JWT for authentication.

The application serves as an excellent portfolio piece showcasing:
- Full CRUD operations
- User authentication & authorization
- Role-based access control
- Data visualization
- Responsive UI design
- RESTful API development
- Database relationships
- Security implementation

**Current Status:** ✅ Fully functional and running with real database integration.
