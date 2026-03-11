# 🎯 SkillMatrix Pro

**Employee Skill & Project Management System**

A comprehensive full-stack web application for managing employee skills, projects, and team analytics with a beautiful, responsive UI featuring dark/light mode support.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-14%2B-blue.svg)

## 📥 Import / Clone This Repository

**Repository URL:** `https://github.com/unmmesh9-ship-it/Skill`

| Method | Command |
|--------|---------|
| **HTTPS** | `git clone https://github.com/unmmesh9-ship-it/Skill.git` |
| **SSH** | `git clone git@github.com:unmmesh9-ship-it/Skill.git` |
| **GitHub CLI** | `gh repo clone unmmesh9-ship-it/Skill` |

- 🔗 **[View on GitHub](https://github.com/unmmesh9-ship-it/Skill)**
- 📋 **[Fork this repository](https://github.com/unmmesh9-ship-it/Skill/fork)**
- 📦 **[Import into your GitHub account](https://github.com/new/import?import_url=https://github.com/unmmesh9-ship-it/Skill)**

## ✨ Features

### 👨‍💼 Admin Dashboard
- **Real-time Analytics** - Interactive charts showing skill distribution, top skills, and project metrics
- **User Management** - Complete CRUD operations for managing employees and administrators
- **Skills Management** - Organize and categorize company skills library
- **Project Management** - Create projects, assign teams, and track progress
- **Beautiful Charts** - Bar charts, pie charts, area charts, and radar charts using Recharts

### 👤 Employee Portal
- **Personal Dashboard** - View assigned projects and skill overview
- **Skills Management** - Add, update, and rate personal skills with proficiency levels
- **Project View** - See all assigned projects with team information
- **Profile Management** - Update personal information and credentials

### 🎨 UI/UX Features
- **Dark/Light Mode** - Full theme support with smooth transitions
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Modern UI** - Beautiful glassmorphism effects and gradient designs
- **Interactive Components** - Clickable cards, hover effects, and smooth animations

## 🚀 Tech Stack

### Frontend
- **React 18.2** - Modern UI library
- **Vite 5.0** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful chart library
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for database operations
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/unmmesh9-ship-it/Skill.git
cd Skill
```

### 2. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 3. Configure Database

Create a PostgreSQL database named `skillmatrix_db`:
```bash
psql -U postgres
CREATE DATABASE skillmatrix_db;
\q
```

### 4. Setup Environment Variables

Create `server/.env` file:
```env
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=skillmatrix_db
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 5. Initialize Database

Run the database setup script:
```bash
cd server
node migrate-database.js
node seed-database.js
```

### 6. Start the Application

**Backend (Terminal 1):**
```bash
cd server
npm start
```

**Frontend (Terminal 2):**
```bash
cd client
npm run dev
```

Access the application at: **http://localhost:5173**

## 🔐 Default Credentials

**Admin Account:**
- Email: `admin@skillmatrix.com`
- Password: `password123`

**Employee Account:**
- Email: `unmesh@company.com`
- Password: `password123`

## 📊 Database Schema

### Tables
- **users** - User accounts (admin/employee)
- **skills** - Company skills library (47 pre-loaded skills)
- **projects** - Project information
- **employee_skills** - User-skill relationships with proficiency levels
- **project_assignments** - User-project assignments

### Sample Data Included
- ✅ 17 users (1 admin + 16 employees)
- ✅ 47 skills across 13 categories
- ✅ 9 active projects
- ✅ 53 skill assignments
- ✅ 17 project assignments

## 📁 Project Structure

```
Skill/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context (Auth, Theme)
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   └── package.json
├── server/                  # Backend Node.js application
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Custom middleware
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   └── package.json
├── database/               # SQL schema files
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/:id` - Get skill by ID
- `POST /api/skills` - Create skill (Admin)
- `PUT /api/skills/:id` - Update skill (Admin)
- `DELETE /api/skills/:id` - Delete skill (Admin)
- `GET /api/skills/analytics/top` - Get top skills
- `GET /api/skills/analytics/distribution` - Get skill distribution

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)
- `GET /api/projects/my-projects` - Get user's projects

## 🎨 Features in Detail

### Dark Mode
Toggle between light and dark themes with a single click. Theme preference is saved in localStorage.

### Analytics Dashboard
- **Skill Distribution** - Bar chart showing skills by category
- **Skill Breakdown** - Pie chart showing skill distribution percentages
- **Skill Popularity** - Area chart showing top trending skills
- **360° Skill Matrix** - Radar chart for category distribution
- **Top 20 Skills** - Detailed table with rankings and proficiency
- **Active Projects** - Project cards with team size visualization

### Clickable Stats Cards
Dashboard stat cards are interactive - click to navigate:
- Users card → Navigate to User Management
- Skills card → Navigate to Skills Management
- Projects card → Navigate to Projects Management

## 🔧 Development

### Run in Development Mode

**Backend with hot reload:**
```bash
cd server
npm run dev
```

**Frontend with hot reload:**
```bash
cd client
npm run dev
```

### Build for Production

**Frontend:**
```bash
cd client
npm run build
```

The production build will be created in `client/dist/`

## 📝 Scripts Available

### Backend (`server/`)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend (`client/`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🐛 Troubleshooting

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check credentials in `.env` file
3. Ensure database exists: `CREATE DATABASE skillmatrix_db;`

### Port Already in Use
- Backend (5001): `netstat -ano | findstr :5001` (Windows) or `lsof -ti:5001` (Mac/Linux)
- Frontend (5173): `netstat -ano | findstr :5173` (Windows) or `lsof -ti:5173` (Mac/Linux)

### Clear Browser Cache
Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac) to hard refresh

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**unmmesh9-ship-it**
- GitHub: [@unmmesh9-ship-it](https://github.com/unmmesh9-ship-it)

## 🙏 Acknowledgments

- React team for the amazing library
- Recharts for beautiful chart components
- Tailwind CSS for utility-first styling
- All open-source contributors

## 📞 Support

For support, email unmmesh9@skillmatrix.com or open an issue in this repository.

---

**⭐ Star this repository if you find it helpful!**
