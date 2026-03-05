@echo off
echo ==========================================
echo SkillMatrix Pro - Database Setup
echo ==========================================
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL first from: https://www.postgresql.org/download/windows/
    echo.
    pause
    exit /b 1
)

echo [1/4] PostgreSQL found!
echo.

REM Prompt for password
set /p PGPASSWORD="Enter PostgreSQL password for user 'postgres': "
echo.

REM Create database
echo [2/4] Creating database 'skillmatrix_db'...
psql -U postgres -c "DROP DATABASE IF EXISTS skillmatrix_db;"
psql -U postgres -c "CREATE DATABASE skillmatrix_db;"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create database. Please check your password.
    pause
    exit /b 1
)

echo [SUCCESS] Database created!
echo.

REM Run schema
echo [3/4] Loading schema and sample data...
psql -U postgres -d skillmatrix_db -f "%~dp0database\schema.sql"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to load schema.
    pause
    exit /b 1
)

echo [SUCCESS] Schema and sample data loaded!
echo.

REM Update .env file
echo [4/4] Updating server configuration...
cd server
if not exist .env (
    copy .env.example .env
)

REM Show success message
echo.
echo ==========================================
echo    DATABASE SETUP COMPLETED!
echo ==========================================
echo.
echo Database: skillmatrix_db
echo Host: localhost
echo Port: 5432
echo User: postgres
echo.
echo Sample users created:
echo   Admin:    admin@skillmatrix.com (password: password123)
echo   Employee: john@company.com (password: password123)
echo.
echo NEXT STEPS:
echo 1. Update server/.env with your PostgreSQL password
echo 2. Stop the demo server (Ctrl+C in terminal)
echo 3. Start the full server: cd server ^&^& npm start
echo.
echo ==========================================
pause
