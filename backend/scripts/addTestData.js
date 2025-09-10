const pool = require('../db');

async function addTestData() {
  try {
    // Add test teams if they don't exist
    await pool.query(`
      INSERT INTO teams (name, logo, founded, city, stadium, league)
      VALUES 
        ('Arsenal', 'arsenal.png', 1886, 'London', 'Emirates Stadium', 'Premier League'),
        ('Manchester United', 'manutd.png', 1878, 'Manchester', 'Old Trafford', 'Premier League'),
        ('Liverpool', 'liverpool.png', 1892, 'Liverpool', 'Anfield', 'Premier League'),
        ('Chelsea', 'chelsea.png', 1905, 'London', 'Stamford Bridge', 'Premier League')
      ON CONFLICT (name) DO NOTHING
    `);

    // Get team IDs
    const teams = await pool.query('SELECT id, name FROM teams');
    const teamMap = teams.rows.reduce((acc, team) => {
      acc[team.name] = team.id;
      return acc;
    }, {});

    // Add test matches
    await pool.query(`
      INSERT INTO matches (home_team_id, away_team_id, date, time, league, status, home_score, away_score)
      VALUES 
        ($1, $2, '2023-10-01', '15:00:00', 'Premier League', 'FT', 2, 1),
        ($3, $4, '2023-10-01', '17:30:00', 'Premier League', 'FT', 1, 1),
        ($1, $3, '2023-10-15', '16:30:00', 'Premier League', 'LIVE', 1, 0),
        ($2, $4, '2023-10-22', '14:00:00', 'Premier League', 'UPCOMING', NULL, NULL)
      ON CONFLICT DO NOTHING
    `, [
      teamMap['Arsenal'],
      teamMap['Manchester United'],
      teamMap['Liverpool'],
      teamMap['Chelsea']
    ]);

    console.log('Test data added successfully');
  } catch (error) {
    console.error('Error adding test data:', error);
  } finally {
    await pool.end();
    process.exit();
  }
}

addTestData();
