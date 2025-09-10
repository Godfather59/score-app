-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(200) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin','editor','user')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  league VARCHAR(100),
  founded INT
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  team_id INT REFERENCES teams(id) ON DELETE SET NULL,
  position VARCHAR(50),
  goals INT DEFAULT 0
);

-- Matches table
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

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  match_id INT REFERENCES matches(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  minute INT NOT NULL,
  player VARCHAR(100),
  team VARCHAR(100)
);

-- Referees table
CREATE TABLE IF NOT EXISTS referees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(100),
  matches INT DEFAULT 0
);
