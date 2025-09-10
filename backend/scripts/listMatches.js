const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'score_app',
  user: 'postgres',
  password: 'saidsaid',
});

async function listMatches() {
  const client = await pool.connect();
  try {
    // Get matches with team names
    const result = await client.query(`
      SELECT 
        m.id, 
        m.date, 
        m.time, 
        m.status, 
        m.home_score, 
        m.away_score,
        ht.name as home_team,
        at.name as away_team
      FROM matches m
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      ORDER BY m.date DESC, m.time DESC
      LIMIT 10
    `);

    console.log('\n⚽ Latest Matches:');
    result.rows.forEach(match => {
      console.log('\n----------------------------------------');
      console.log(`Match ID: ${match.id}`);
      console.log(`Teams: ${match.home_team} vs ${match.away_team}`);
      console.log(`Date: ${match.date} ${match.time}`);
      console.log(`Status: ${match.status}`);
      if (match.status === 'completed') {
        console.log(`Score: ${match.home_score} - ${match.away_score}`);
      }
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

listMatches();
