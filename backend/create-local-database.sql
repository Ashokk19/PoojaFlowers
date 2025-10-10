-- ========================================
-- Floro Local Database Setup Script
-- ========================================
-- Run this in pgAdmin or psql to create the database

-- Create the database
CREATE DATABASE floro_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Connect to the database (in psql, run: \c floro_db)

-- The Spring Boot application will automatically create all tables
-- when you run it for the first time (thanks to hibernate.ddl-auto=update)

-- Verify connection
SELECT 'Database floro_db created successfully!' as status;

