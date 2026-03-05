# 🎯 SkillMatrix Pro - Application Details

## 📋 Overview

**SkillMatrix Pro** is a full-stack Employee Skill & Project Analytics System with a professional. It enables organizations to track employee skills, manage project assignments, and visualize workforce analytics through interactive dashboards.

### 🎨 Design Theme: Vaporwave Aesthetic
- **Hot Pink**: `#FF71CE` - Primary accent, headers
- **Neon Cyan**: `#01CDFE` - Secondary accent, charts
- **Soft Purple**: `#B967FF` - Tertiary accent, stats
- **Mint Teal**: `#05FFA1` - Success states, highlights

---

## 🚀 Key Features

### 👤 Employee Portal

#### 1. **Dashboard** (`/employee-dashboard`)
- **Profile Overview**: Name, email, role display
- **Skills Summary**: Total skills count with category breakdown
- **Projects Overview**: Active projects timeline
- **Quick Stats Cards**: 
  - Total Skills (Cyan-themed)
  - Active Projects (Pink-themed)
  - Profile Completion (Purple-themed)
  - Recent Activity (Teal-themed)

#### 2. **Skills Management** (`/employee-skills`)
- **My Skills List**: Grouped by category (Frontend, Backend, Database, etc.)
- **Add New Skills**: Modal-based skill assignment
- **Proficiency Levels**: 1-5 scale with visual indicators
- **Skill Categories**: Automatic grouping and filtering
- **Interactive Charts**:
  - Category distribution (Pie Chart)
  - Proficiency radar chart
- **Features**:
  - Search and filter by category
  - Update proficiency levels
  - Remove skills
  - View all available skills

#### 3. **Projects View** (`/employee-projects`)
- **Project Cards**: Professional card layout with:
  - Project name and status badge
  - Description with styled containers
  - Start/End dates with color-coded timeline
  - Assignment date tracking
  - Progress bar with real-time calculation
- **Status Distribution**: Pie chart showing project breakdown
- **Quick Stats**:
  - Total assigned projects
  - Active projects count
  - Projects in planning
  - Completed projects
- **Status Types**:
  - 🚀 Active (Green)
  - 📋 Planning (Blue)
  - ⏸️ On Hold (Yellow)
  - ✅ Completed (Purple)

#### 4. **Profile** (`/employee-profile`)
- View and update personal information
- Profile completion tracking
- Contact details management

---

### 🔐 Admin Portal

#### 1. **Admin Dashboard** (`/admin-dashboard`)
- **Top 20 Skills**: Bar chart visualization
- **Skills by Category**: Distribution analytics
- **Top Projects**: Team size metrics
- **Trending Skills**: Real-time popularity tracking
- **System Statistics**: User, skill, and project counts

#### 2. **User Management** (`/admin-users`)
- **CRUD Operations**: Create, Read, Update, Delete users
- **Role Assignment**: Admin vs Employee roles
- **User List**: Searchable and filterable
- **Profile Management**: View user skills and projects

#### 3. **Skills Management** (`/admin-skills`)
- **Skill Library**: Complete skill catalog
- **Create Skills**: Add new skills to the system
- **Edit/Delete**: Manage existing skills
- **Category Organization**: Group skills logically
- **Usage Analytics**: Track skill adoption

#### 4. **Projects Management** (`/admin-projects`)
- **Project CRUD**: Full project lifecycle management
- **Team Assignment**: Assign users to projects
- **Project Details**:
  - Name, description, status
  - Start and end dates
  - Team member list
- **Project Analytics**: Team size, duration, status distribution

---

## 🛠️ Technical Stack

### Frontend
```
Technology         Version    Purpose
-----------------------------------------
React              18.2       UI Framework
Vite               5.0        Build Tool
React Router       6.20       Navigation
Axios              1.6        HTTP Client
Recharts           2.10       Data Visualization
Tailwind CSS       3.3        Utility-first CSS
```

### Backend
```
Technology         Version    Purpose
-----------------------------------------
Node.js            18+        Runtime
Express            4.18       Web Framework
PostgreSQL         14+        Database
Sequelize          6.37       ORM
JWT                9.0        Authentication
Bcrypt.js          2.4        Password Hashing
```

---

## 🗄️ Database Schema

### Tables

#### 1. **users**
```sql
- id (PRIMARY KEY)
- email (UNIQUE)
- password (hashed)
- first_name
- last_name
- role (admin/employee)
- created_at
- updated_at
```

#### 2. **skills**
```sql
- id (PRIMARY KEY)
- name (UNIQUE)
- category (VARCHAR)
- created_at
- updated_at
```

#### 3. **projects**
```sql
- id (PRIMARY KEY)
- name
- description
- status (Active/Planning/On Hold/Completed)
- start_date
- end_date
- created_by (FK -> users)
- created_at
- updated_at
```

#### 4. **employee_skills** (Junction Table)
```sql
- id (PRIMARY KEY)
- user_id (FK -> users)
- skill_id (FK -> skills)
- proficiency_level (1-5)
- years_of_experience
- created_at
- updated_at
```

#### 5. **project_assignments** (Junction Table)
```sql
- id (PRIMARY KEY)
- user_id (FK -> users)
- project_id (FK -> projects)
- assigned_at
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/me              - Get current user
PUT    /api/auth/update-profile  - Update profile
```

### Skills
```
GET    /api/skills               - Get all skills
GET    /api/skills/:id           - Get skill by ID
POST   /api/skills               - Create skill (Admin)
PUT    /api/skills/:id           - Update skill (Admin)
DELETE /api/skills/:id           - Delete skill (Admin)
GET    /api/skills/my-skills     - Get user's skills
POST   /api/skills/assign        - Assign skill to user
PUT    /api/skills/update-level  - Update proficiency
DELETE /api/skills/remove/:id    - Remove user's skill
GET    /api/skills/analytics/top - Top skills (Admin)
GET    /api/skills/analytics/category - Skills by category
```

### Projects
```
GET    /api/projects             - Get all projects
GET    /api/projects/:id         - Get project by ID
POST   /api/projects             - Create project (Admin)
PUT    /api/projects/:id         - Update project (Admin)
DELETE /api/projects/:id         - Delete project (Admin)
GET    /api/projects/my-projects - Get user's projects
POST   /api/projects/:id/assign  - Assign user to project
DELETE /api/projects/:id/assign/:userId - Remove from project
GET    /api/projects/:id/team    - Get project team
```

### Users (Admin Only)
```
GET    /api/users                - Get all users
GET    /api/users/:id            - Get user by ID
POST   /api/users                - Create user
PUT    /api/users/:id            - Update user
DELETE /api/users/:id            - Delete user
```

---

## 🎨 UI Components

### Professional Card System
```css
.card-professional
- White background with subtle shadows
- Smooth hover transitions
- Professional typography
- Refined borders and spacing

.card-3d
- Enhanced hover effects
- Subtle transform on hover
- Multi-layer vaporwave shadows
- Scale animation

.glass / .glass-dark
- White-based glassmorphism (90%/80% opacity)
- Backdrop blur effects
- Subtle border gradients
```

### Layout Components
- **EmployeeLayout**: Professional sidebar with mint teal accents
- **AdminLayout**: Similar professional styling for admin portal
- **PremiumLoading**: Animated loading states with vaporwave colors
- **ProtectedRoute**: Authentication wrapper

---

## 🔐 Authentication & Authorization

### User Roles
1. **Admin**
   - Full system access
   - User management
   - Skill/Project CRUD
   - Analytics access

2. **Employee**
   - Personal dashboard
   - Skill management (own)
   - View assigned projects
   - Update profile

### Security
- **JWT Tokens**: Stored in localStorage
- **Password Hashing**: Bcrypt with salt rounds
- **Protected Routes**: Frontend + backend validation
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Express-validator

---

## 📊 Data Visualization

### Charts Implemented
1. **Pie Charts**
   - Project status distribution
   - Skills category breakdown
   - Proficiency distribution

2. **Bar Charts**
   - Top 20 skills (Admin dashboard)
   - Skills by category

3. **Line Charts**
   - Skill growth over time (planned)

4. **Radar Charts**
   - Skill proficiency visualization

### Chart Features
- Vaporwave color palette
- Interactive tooltips
- Animated transitions
- Responsive design
- Legend support

---

## 🗝️ Default Credentials

### Admin Account
```
Email:    admin@skillmatrix.com
Password: admin123
```

### Employee Account
```
Email:    unmesh@company.com
Password: password123
```

---

## 🌐 Application URLs

### Development
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001

### Routes
#### Public
- `/` - Login page
- `/register` - Registration page

#### Employee Routes
- `/employee-dashboard` - Main dashboard
- `/employee-skills` - Skills management
- `/employee-projects` - Projects view
- `/employee-profile` - Profile settings

#### Admin Routes
- `/admin-dashboard` - Admin overview
- `/admin-users` - User management
- `/admin-skills` - Skills management
- `/admin-projects` - Projects management

---

## 🎯 Current Status

### ✅ Completed Features
- Full authentication system (JWT)
- Employee portal with vaporwave styling
- Skills management with CRUD operations
- Projects view with status tracking
- Professional card-based UI
- Database seeded with sample data:
  - 46 skills across 8 categories
  - 10 projects with varying statuses
  - 34 skill assignments
  - 26 project assignments
- Backend API with proper error handling
- Frontend state management (Context API)
- Responsive design (Tailwind CSS)
- Chart visualizations (Recharts)

### 🔄 Known Issues (Recently Fixed)
- ✅ Skills not displaying - Fixed database column issue
- ✅ Projects serialization - Fixed Sequelize JSON conversion
- ✅ Professional styling - Applied enterprise-grade design

### 🚧 Planned Enhancements
- Admin dashboard analytics enhancement
- Profile page vaporwave transformation
- Export functionality (CSV/PDF)
- Advanced filtering and search
- Real-time notifications
- Skill endorsements
- Project collaboration features

---

## 📦 Dependencies

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2",
  "recharts": "^2.10.3"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "pg": "^8.11.3",
  "sequelize": "^6.37.7",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

---

## 🚀 Running the Application

### Start Backend
```bash
cd server
node server.js
```

### Start Frontend
```bash
cd client
npm run dev
```

### Access Application
1. Open browser: http://localhost:5173
2. Login with credentials above
3. Navigate through the application

---

## 💾 Database Information

**Database Name**: `skillmatrix_db`  
**User**: `postgres`  
**Port**: `5432` (default)  

**Sample Data Seeded**:
- 46 Skills (Frontend, Backend, Database, DevOps, etc.)
- 10 Projects (Various statuses)
- 2 Users (Admin + Employee)
- 34 Skill Assignments
- 26 Project Assignments

---

## 🎨 Design Philosophy

### Professional Vaporwave Aesthetic
The UI combines:
- **Professional Enterprise Design**: Clean cards, refined shadows, proper spacing
- **Vaporwave Color Palette**: Retro-futuristic neon colors with modern balance
- **Subtle Animations**: Smooth transitions without excessive effects
- **Glassmorphism**: White-based transparent backgrounds with blur
- **Typography**: Bold, uppercase labels with proper tracking

### User Experience
- **Intuitive Navigation**: Clear sidebar menus with icons
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Animated premium loading components
- **Error Handling**: User-friendly error messages
- **Visual Feedback**: Hover states, focus indicators, success animations

---

## 📝 Notes

- All passwords stored as bcrypt hashes
- JWT tokens expire after 7 days
- Frontend uses Context API for global state
- Backend uses Sequelize ORM for database operations
- CORS configured for localhost development
- Professional console logging for debugging
- Database queries optimized with proper indexing

---

## 🆘 Support

For issues or questions:
1. Check browser console (F12) for errors
2. Check backend terminal for API errors
3. Verify database connection
4. Ensure both servers are running
5. Clear browser cache if needed

---

**Last Updated**: February 27, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
