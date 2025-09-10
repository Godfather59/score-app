-- Create database
CREATE DATABASE score_app;

-- Connect to the database
\c score_app

-- Create user with password
CREATE USER score_app_user WITH PASSWORD 'saidsaid';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE score_app TO score_app_user;

-- Create extension for UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
\i migrations/001_create_tables.sql

-- Insert initial data
\i migrations/seedTeams.sql
\i migrations/seedMatches.sql

-- Grant privileges on all tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO score_app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO score_app_user;

-- List all databases
\l

-- List all users
\du
