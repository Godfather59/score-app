# Script to set up PostgreSQL database and user
# Run this script as a PostgreSQL superuser

# Database configuration
$DB_NAME = "score_app"
$DB_USER = "score_app_user"
$DB_PASSWORD = "saidsaid"  # In production, use a more secure password

# Check if psql is available
try {
    $psqlVersion = & psql --version
    Write-Host "PostgreSQL client version: $psqlVersion"
} catch {
    Write-Error "PostgreSQL client (psql) is not installed or not in PATH"
    exit 1
}

# Connect to PostgreSQL and execute setup commands
$setupSQL = @"
-- Create database if it doesn't exist
SELECT 'CREATE DATABASE $DB_NAME'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Connect to the database
\c $DB_NAME

-- Create user if it doesn't exist
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';
    END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- List databases
\l

-- List users
\du
"@

# Execute the SQL script
$setupSQL | & psql -U postgres -v ON_ERROR_STOP=1

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to set up the database"
    exit 1
}

Write-Host "Database setup completed successfully!"
Write-Host "Database name: $DB_NAME"
Write-Host "Database user: $DB_USER"
