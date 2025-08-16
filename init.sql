-- CitizenGate Database Initialization Script
-- This script runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist (handled by POSTGRES_DB env var)
-- The main database is created automatically by the PostgreSQL image

-- You can add any initial database setup here
-- For example:

-- Create extensions if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create any initial tables, indexes, or data here
-- Note: NestJS with TypeORM will handle most schema creation automatically

-- Example: Create a health check table
CREATE TABLE IF NOT EXISTS health_check (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'healthy',
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial health check record
INSERT INTO health_check (status) VALUES ('healthy') ON CONFLICT DO NOTHING;

-- Add any other initialization queries here
