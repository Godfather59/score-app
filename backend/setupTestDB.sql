-- Create the database if it doesn't exist
CREATE DATABASE flashscore_test;

-- Connect to the database
\c flashscore_test;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(200) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin','editor','user')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  founded_year INT,
  logo_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  team_id INT REFERENCES teams(id) ON DELETE SET NULL,
  position VARCHAR(50),
  goals INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  home_team_id INT REFERENCES teams(id) ON DELETE SET NULL,
  away_team_id INT REFERENCES teams(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  league VARCHAR(100),
  status VARCHAR(50),
  home_score INT DEFAULT 0,
  away_score INT DEFAULT 0
);

-- Insert test teams
INSERT INTO teams (name, city, founded_year, logo_url) VALUES
('Manchester United', 'Manchester', 1878, '/logos/manutd.png'),
('Liverpool FC', 'Liverpool', 1892, '/logos/liverpool.png'),
('Chelsea FC', 'London', 1905, '/logos/chelsea.png'),
('Arsenal FC', 'London', 1886, '/logos/arsenal.png')
ON CONFLICT (name) DO NOTHING;

-- Insert test matches
WITH team_ids AS (
  SELECT id, name FROM teams
)
INSERT INTO matches (home_team_id, away_team_id, date, time, league, status, home_score, away_score)
SELECT 
  (SELECT id FROM team_ids WHERE name = 'Manchester United'),
  (SELECT id FROM team_ids WHERE name = 'Liverpool FC'),
  '2024-01-15', '15:00:00', 'Premier League', 'completed', 2, 1
UNION ALL
SELECT 
  (SELECT id FROM team_ids WHERE name = 'Liverpool FC'),
  (SELECT id FROM team_ids WHERE name = 'Chelsea FC'),
  '2024-01-16', '17:30:00', 'Premier League', 'completed', 1, 3
UNION ALL
SELECT 
  (SELECT id FROM team_ids WHERE name = 'Arsenal FC'),
  (SELECT id FROM team_ids WHERE name = 'Manchester United'),
  '2024-01-17', '20:00:00', 'Premier League', 'upcoming', NULL, NULL
UNION ALL
SELECT 
  (SELECT id FROM team_ids WHERE name = 'Chelsea FC'),
  (SELECT id FROM team_ids WHERE name = 'Arsenal FC'),
  '2024-01-18', '19:45:00', 'Premier League', 'upcoming', NULL, NULL
ON CONFLICT DO NOTHING;
