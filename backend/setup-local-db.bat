@echo off
REM ========================================
REM Floro Local Database Setup Script
REM ========================================
echo.
echo ========================================
echo Floro Database Setup for Windows
echo ========================================
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PostgreSQL not found!
    echo.
    echo Please install PostgreSQL first:
    echo https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
    echo.
    echo After installation, add PostgreSQL bin folder to PATH:
    echo Example: C:\Program Files\PostgreSQL\15\bin
    echo.
    pause
    exit /b 1
)

echo [OK] PostgreSQL is installed
echo.

REM Prompt for password
set /p PGPASSWORD="Enter your PostgreSQL password (default: postgres123): " || set PGPASSWORD=postgres123

echo.
echo Creating database 'floro_db'...
echo.

REM Create database
psql -U postgres -c "CREATE DATABASE floro_db;" 2>nul

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Database 'floro_db' created successfully!
) else (
    echo [INFO] Database 'floro_db' may already exist (this is okay)
)

echo.
echo Verifying database...
psql -U postgres -d floro_db -c "SELECT current_database();"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Database setup complete!
    echo ========================================
    echo.
    echo Database Details:
    echo   Host:     localhost
    echo   Port:     5432
    echo   Database: floro_db
    echo   Username: postgres
    echo   Password: %PGPASSWORD%
    echo.
    echo Next steps:
    echo 1. Update application.properties if password differs
    echo 2. Run: mvn spring-boot:run
    echo 3. Tables will be created automatically!
    echo.
) else (
    echo [ERROR] Could not connect to database
    echo Please check your PostgreSQL password
)

echo.
pause

