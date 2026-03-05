# Database Setup Instructions

## Complete PostgreSQL Setup for SkillMatrix Pro

---

## Option 1: Automated Setup (EASIEST) ⚡

### After installing PostgreSQL, run:

**Windows PowerShell (Recommended):**
```powershell
cd "d:\OneDrive - Aligned Automation Services Private Limited\Desktop\SKILLS"
.\setup-database.ps1
```

**Or Command Prompt:**
```cmd
cd "d:\OneDrive - Aligned Automation Services Private Limited\Desktop\SKILLS"
setup-database.bat
```

This will automatically:
- Create the database
- Load all tables and sample data
- Update your server configuration

---

## Option 2: Manual Setup 📋

### Step 1: Open Command Prompt or PowerShell

### Step 2: Set PostgreSQL Password Environment Variable
```powershell
$env:PGPASSWORD = "your_postgres_password"
```

### Step 3: Create Database
```bash
psql -U postgres -c "CREATE DATABASE skillmatrix_db;"
```

### Step 4: Load Schema
```bash
cd "d:\OneDrive - Aligned Automation Services Private Limited\Desktop\SKILLS"
psql -U postgres -d skillmatrix_db -f "database\schema.sql"
```

### Step 5: Update Server Configuration
Edit `server\.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=skillmatrix_db
```

---

## Option 3: Using pgAdmin (GUI) 🖥️

### Step 1: Open pgAdmin 4
(Installed with PostgreSQL)

### Step 2: Connect to PostgreSQL Server
- Right-click "Servers" → "Register" → "Server"
- Name: Local
- Host: localhost
- Port: 5432
- Username: postgres
- Password: (your password)

### Step 3: Create Database
- Right-click "Databases" → "Create" → "Database"
- Database name: `skillmatrix_db`
- Owner: postgres
- Click "Save"

### Step 4: Run Schema
- Click on `skillmatrix_db`
- Click "Tools" → "Query Tool"
- Open file: `database\schema.sql`
- Click "Execute" button (▶️)

### Step 5: Verify Data
Run this query to check:
```sql
SELECT * FROM users;
SELECT * FROM skills;
SELECT * FROM projects;
```

You should see:
- 5 users (1 admin, 4 employees)
- 20 skills
- 4 projects

---

## Option 4: Using Docker 🐳

### If you have Docker Desktop installed:

```bash
cd "d:\OneDrive - Aligned Automation Services Private Limited\Desktop\SKILLS"
docker-compose -f docker-compose-db.yml up -d
```

This will:
- Start PostgreSQL in a container
- Automatically create the database
- Load all sample data

---

## Sample Data Included 📊

### Users (5)
1. **Admin User** - admin@skillmatrix.com (password: password123)
2. **John Doe** - john@company.com (password: password123)
3. **Jane Smith** - jane@company.com (password: password123)
4. **Mike Johnson** - mike@company.com (password: password123)
5. **Sarah Williams** - sarah@company.com (password: password123)

### Skills (20)
Categorized across:
- Programming (JavaScript, Python, Java)
- Frontend (React, Angular, Vue.js)
- Backend (Node.js, Express.js, Django)
- Database (PostgreSQL, MongoDB, MySQL)
- Cloud (AWS, Azure)
- DevOps (Docker, Kubernetes)
- Version Control (Git)
- Methodology (Agile, Scrum)
- API Design (REST API)

### Projects (4)
1. E-Commerce Platform
2. Mobile Banking App
3. AI Analytics Dashboard
4. Healthcare Portal

### Employee Skills
- Pre-assigned skills to employees with proficiency levels (1-5)
- Multiple skill assignments per employee

### Project Assignments
- Employees assigned to various projects
- Team collaboration data

---

## Verification ✅

### Test Database Connection:

**PowerShell:**
```powershell
$env:PGPASSWORD = "your_password"
psql -U postgres -d skillmatrix_db -c "SELECT COUNT(*) FROM users;"
```

Expected output: `count: 5`

### Test with Application:

1. **Stop demo server** (Ctrl+C in terminal)
2. **Start production server:**
   ```powershell
   cd server
   npm start
   ```
3. **Login at:** http://localhost:5173
   - Email: admin@skillmatrix.com
   - Password: password123

---

## Troubleshooting 🔧

### "psql: command not found"
- Add PostgreSQL to PATH:
  - Default location: `C:\Program Files\PostgreSQL\16\bin`
  - System Properties → Environment Variables → Path → Add

### "password authentication failed"
- Double-check your PostgreSQL password
- Try resetting: `ALTER USER postgres PASSWORD 'newpassword';`

### "database already exists"
- Drop first: `psql -U postgres -c "DROP DATABASE skillmatrix_db;"`
- Then create again

### "permission denied"
- Run PowerShell/CMD as Administrator

### Port 5432 in use
- Check if PostgreSQL service is running
- Or change port in .env file

---

## After Setup 🚀

### Switch from Demo to Production:

1. **Kill demo server terminal**
2. **Update .env** with correct database password
3. **Start production server:**
   ```bash
   cd server
   npm start
   ```
4. **Refresh browser** at http://localhost:5173
5. **Login** with sample credentials

You'll now have:
- ✅ Real database persistence
- ✅ Full CRUD operations
- ✅ Data survives server restarts
- ✅ All features working

---

## Need Help?

Check the main README.md for more details or run:
```powershell
cat README.md
```
