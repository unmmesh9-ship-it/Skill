# 🗄️ Skill Matrix Database - Simple Guide

> **Database Name:** `skillmatrix_db`  
> **Type:** PostgreSQL  
> **Port:** 5432  
> **User:** postgres

---

## 📊 Database Structure (6 Tables)

### 1. **users** - All Users (Admins + Employees)
```
- id (Primary Key)
- full_name
- email (unique)
- password (hashed)
- role (admin/employee)
- profile_completion (0-100%)
- created_at
- updated_at
```

### 2. **skills** - All Available Skills
```
- id (Primary Key)
- name (e.g., "React", "Python")
- category (e.g., "Frontend", "Backend")
- created_at
- updated_at
```

### 3. **employee_skills** - Who Has Which Skill
```
- id (Primary Key)
- user_id → links to users
- skill_id → links to skills
- proficiency_level (1-5: Novice to Expert)
- created_at
- updated_at
```

### 4. **projects** - All Projects
```
- id (Primary Key)
- name
- description
- status (Active/Completed/On Hold)
- start_date
- end_date
- created_at
- updated_at
```

### 5. **project_assignments** - Who Works on Which Project
```
- id (Primary Key)
- user_id → links to users
- project_id → links to projects
- assigned_at
```

### 6. **skill_requests** - Employee Skill Requests
```
- id (Primary Key)
- user_id → who requested
- skill_id → which skill
- proficiency_level (1-5)
- status (pending/approved/rejected)
- request_message
- admin_response
- reviewed_by → admin user_id
- reviewed_at
- created_at
- updated_at
```

---

## 🔄 How to Backup Your Database

### Option 1: PowerShell Script (Recommended)
```powershell
.\backup-database.ps1
```
- Creates: `backup_skillmatrix_YYYY-MM-DD_HHMMSS.sql`
- Uses PostgreSQL's official pg_dump tool
- Best for complete backup with structure

### Option 2: Node.js Exporter (Simple)
```bash
node export-database.js
```
- Creates: `skillmatrix_export_YYYY-MM-DD.sql`
- No external tools needed
- Human-readable SQL file

---

## 📥 How to Restore/Import Backup

### Step 1: Make sure PostgreSQL is running
```powershell
# Check if running
Get-Service postgresql*
```

### Step 2: Import the backup
```bash
# Import to existing database (will add data)
psql -U postgres -d skillmatrix_db -f backup_file.sql

# Or create NEW database and import
createdb -U postgres my_new_database
psql -U postgres -d my_new_database -f backup_file.sql
```

---

## 🔍 Quick Database Queries

### View All Users
```sql
SELECT id, full_name, email, role FROM users;
```

### View All Skills by Category
```sql
SELECT category, COUNT(*) as count 
FROM skills 
GROUP BY category 
ORDER BY count DESC;
```

### See Who Has Which Skills
```sql
SELECT 
  u.full_name,
  s.name as skill,
  s.category,
  es.proficiency_level
FROM employee_skills es
JOIN users u ON es.user_id = u.id
JOIN skills s ON es.skill_id = s.id
ORDER BY u.full_name, s.category;
```

### View Pending Skill Requests
```sql
SELECT 
  u.full_name as employee,
  s.name as requested_skill,
  sr.status,
  sr.request_message,
  sr.created_at
FROM skill_requests sr
JOIN users u ON sr.user_id = u.id
JOIN skills s ON sr.skill_id = s.id
WHERE sr.status = 'pending'
ORDER BY sr.created_at DESC;
```

### See Project Assignments
```sql
SELECT 
  p.name as project,
  u.full_name as employee,
  p.status,
  pa.assigned_at
FROM project_assignments pa
JOIN projects p ON pa.project_id = p.id
JOIN users u ON pa.user_id = u.id
ORDER BY p.name;
```

---

## 🛠️ Database Management Tools

### Using pgAdmin (GUI)
1. Open pgAdmin
2. Connect to localhost:5432
3. Username: `postgres`
4. Password: `Unmesh@27`
5. Database: `skillmatrix_db`

### Using Command Line
```bash
# Connect to database
psql -U postgres -d skillmatrix_db

# List all tables
\dt

# Describe a table
\d users

# Exit
\q
```

---

## 📈 Current Database Content

| Table | Records |
|-------|---------|
| Users | ~10 (5 employees + admins) |
| Skills | 46 skills across 10 categories |
| Employee Skills | ~30+ skill assignments |
| Projects | ~10 active projects |
| Project Assignments | ~40 assignments |
| Skill Requests | Varies (pending/approved) |

---

## 🔐 Default Login Credentials

### Admin Account
- Email: `admin@skillmatrix.com`
- Password: `admin123`

### Employee Accounts
- Email: `unmesh@company.com`
- Password: `password123`

---

## ⚙️ Database Settings

Located in: `server/.env`

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=Unmesh@27
DB_NAME=skillmatrix_db
```

---

## 🆘 Troubleshooting

### Can't connect to database
```bash
# Check if PostgreSQL is running
Get-Service postgresql*

# Start it if stopped
Start-Service postgresql-x64-16  # or your version
```

### Reset database to fresh state
```bash
# Drop and recreate database
dropdb -U postgres skillmatrix_db
createdb -U postgres skillmatrix_db

# Import fresh data
psql -U postgres -d skillmatrix_db -f backup_file.sql
```

### View database size
```sql
SELECT pg_size_pretty(pg_database_size('skillmatrix_db'));
```

---

## 📝 Notes

- All passwords are hashed with bcrypt
- User IDs and Skill IDs are auto-incrementing
- Foreign keys maintain data integrity
- Timestamps are in UTC
- Database uses UTF-8 encoding

---

## 🎯 Next Steps

1. **Backup regularly**: Run `.\backup-database.ps1` weekly
2. **Keep exports**: Store SQL files in safe location
3. **Document changes**: Note any custom modifications
4. **Test restores**: Verify backups actually work
5. **Monitor size**: Check database size monthly

---

**Last Updated:** March 2, 2026  
**Database Version:** PostgreSQL 16
