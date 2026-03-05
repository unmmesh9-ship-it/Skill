# SkillMatrix Pro - Database Setup Script
# PowerShell version

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   SkillMatrix Pro - Database Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psqlPath) {
    Write-Host "[ERROR] PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL first from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[1/4] PostgreSQL found at: $($psqlPath.Source)" -ForegroundColor Green
Write-Host ""

# Prompt for password
$password = Read-Host "Enter PostgreSQL password for user 'postgres'" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
$env:PGPASSWORD = $plainPassword

Write-Host ""
Write-Host "[2/4] Creating database 'skillmatrix_db'..." -ForegroundColor Yellow

# Drop existing database
psql -U postgres -c "DROP DATABASE IF EXISTS skillmatrix_db;" 2>$null

# Create database
psql -U postgres -c "CREATE DATABASE skillmatrix_db;"

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to create database. Please check your password." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[SUCCESS] Database created!" -ForegroundColor Green
Write-Host ""

# Run schema
Write-Host "[3/4] Loading schema and sample data..." -ForegroundColor Yellow
$schemaPath = Join-Path $PSScriptRoot "database\schema.sql"
psql -U postgres -d skillmatrix_db -f $schemaPath

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to load schema." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[SUCCESS] Schema and sample data loaded!" -ForegroundColor Green
Write-Host ""

# Update .env file
Write-Host "[4/4] Updating server configuration..." -ForegroundColor Yellow
$serverPath = Join-Path $PSScriptRoot "server"
$envPath = Join-Path $serverPath ".env"
$envExamplePath = Join-Path $serverPath ".env.example"

if (-not (Test-Path $envPath)) {
    Copy-Item $envExamplePath $envPath
}

# Update password in .env
$envContent = Get-Content $envPath
$envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$plainPassword"
$envContent | Set-Content $envPath

Write-Host "[SUCCESS] Configuration updated!" -ForegroundColor Green
Write-Host ""

# Show success message
Write-Host "==========================================" -ForegroundColor Green
Write-Host "   DATABASE SETUP COMPLETED!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Database: skillmatrix_db" -ForegroundColor Cyan
Write-Host "Host: localhost" -ForegroundColor Cyan
Write-Host "Port: 5432" -ForegroundColor Cyan
Write-Host "User: postgres" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sample users created:" -ForegroundColor Yellow
Write-Host "  Admin:    admin@skillmatrix.com (password: password123)" -ForegroundColor White
Write-Host "  Employee: john@company.com (password: password123)" -ForegroundColor White
Write-Host ""
Write-Host "Sample Data Loaded:" -ForegroundColor Yellow
Write-Host "  - 5 Users (1 admin, 4 employees)" -ForegroundColor White
Write-Host "  - 20 Skills across 6 categories" -ForegroundColor White
Write-Host "  - 4 Projects" -ForegroundColor White
Write-Host "  - Multiple skill assignments" -ForegroundColor White
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Stop the demo server (if running)" -ForegroundColor White
Write-Host "2. Start the full server:" -ForegroundColor White
Write-Host "   cd server" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Clear password from environment
$env:PGPASSWORD = $null

Read-Host "Press Enter to exit"
