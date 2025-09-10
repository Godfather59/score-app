const pool = require('../db');

async function seedData() {
  try {
    // Seed users
    console.log('Seeding users...');
    await pool.query(`
      INSERT INTO users (username, password_hash, role) VALUES
      ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
      ('editor', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'editor'),
      ('user', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
      ('testuser', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user')
      ON CONFLICT DO NOTHING
    `);

    // Seed teams
    console.log('Seeding teams...');
    await pool.query(`
      INSERT INTO teams (name, league, founded) VALUES
      ('Manchester United', 'Premier League', 1878),
      ('Liverpool FC', 'Premier League', 1892),
      ('Chelsea FC', 'Premier League', 1905),
      ('Arsenal FC', 'Premier League', 1886)
      ON CONFLICT DO NOTHING
    `);

    // Seed matches
    console.log('Seeding matches...');
    await pool.query(`
      INSERT INTO matches (home_team_id, away_team_id, date, time, league, status, home_score, away_score) VALUES
      (1, 2, '2024-01-15', '15:00', 'Premier League', 'completed', 2, 1),
      (2, 3, '2024-01-16', '17:30', 'Premier League', 'completed', 1, 3),
      (3, 1, '2024-01-17', '20:00', 'Premier League', 'completed', 0, 2),
      (1, 4, '2024-01-18', '16:00', 'Premier League', 'completed', 3, 1),
      (2, 4, '2024-01-19', '18:30', 'Premier League', 'completed', 2, 2),
      (3, 4, '2024-01-20', '15:45', 'Premier League', 'completed', 1, 0),
      (1, 2, '2024-01-21', '19:00', 'Premier League', 'completed', 4, 1),
      (2, 3, '2024-01-22', '17:15', 'Premier League', 'completed', 0, 3),
      (1, 3, '2024-01-25', '20:30', 'Premier League', 'upcoming', NULL, NULL),
      (2, 4, '2024-01-26', '16:45', 'Premier League', 'upcoming', NULL, NULL),
      (3, 1, '2024-01-27', '18:00', 'Premier League', 'upcoming', NULL, NULL)
      ON CONFLICT DO NOTHING
    `);

    console.log('Data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedData();
