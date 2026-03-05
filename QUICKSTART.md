# Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Database Setup
```bash
# Create PostgreSQL database
createdb skillmatrix_db

# Run schema
psql -d skillmatrix_db -f database/schema.sql
```

### Step 2: Backend Setup
```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and update:
# - DB_PASSWORD (your PostgreSQL password)
# - JWT_SECRET (any random string)

# Start server
npm run dev
```

### Step 3: Frontend Setup
```bash
# Open new terminal
# Navigate to client
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

### Step 4: Access Application

1. Open browser: `http://localhost:5173`
2. Login with demo account:
   - Admin: admin@skillmatrix.com / password123
   - Employee: john@company.com / password123

## ⚠️ Common Issues

### Port Already in Use
```bash
# Backend (Port 5000)
# Change PORT in server/.env

# Frontend (Port 5173)
# Change port in client/vite.config.js
```

### Database Connection Error
- Verify PostgreSQL is running
- Check credentials in server/.env
- Ensure database exists

### Module Not Found
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 NPM Scripts

### Server
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 Next Steps

1. Explore Admin Dashboard
2. Add new skills
3. Create projects
4. Assign employees to projects
5. View analytics

## 📚 Need Help?

- Check README.md for detailed documentation
- Review API endpoints
- Check database schema in database/schema.sql
