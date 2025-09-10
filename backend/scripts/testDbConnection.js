const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'score_app',  // Using the database name from your .env
  user: 'postgres',
  password: 'saidsaid',
});

async function testConnection() {
  const client = await pool.connect();
  try {
    // Test connection
    const res = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful:', res.rows[0].now);
    
    // Check if matches table exists and has data
    const matchesCount = await client.query('SELECT COUNT(*) FROM matches');
    console.log(`🔢 Number of matches in database: ${matchesCount.rows[0].count}`);
    
    // Get a sample of matches with team names
    if (matchesCount.rows[0].count > 0) {
      const matches = await client.query(`
        SELECT m.id, m.date, m.time, m.status, m.home_score, m.away_score,
               ht.name as home_team_name, 
               at.name as away_team_name
        FROM matches m
        LEFT JOIN teams ht ON m.home_team_id = ht.id
        LEFT JOIN teams at ON m.away_team_id = at.id
        ORDER BY m.date DESC, m.time DESC
        LIMIT 5
      `);
      
      console.log('\n📅 Latest matches:');
      console.table(matches.rows.map(match => ({
        id: match.id,
        match: `${match.home_team_name} vs ${match.away_team_name}`,
        date: match.date,
        time: match.time,
        score: match.status === 'completed' ? `${match.home_score} - ${match.away_score}` : 'vs',
        status: match.status
      })));
    }
    
    // Check teams table
    const teamsCount = await client.query('SELECT COUNT(*) FROM teams');
    console.log(`\n🏟️  Number of teams in database: ${teamsCount.rows[0].count}`);
    
    if (teamsCount.rows[0].count > 0) {
      // Get the actual columns in the teams table
      const teams = await client.query('SELECT * FROM teams LIMIT 5');
      console.log('\n🏆 Sample teams:');
      console.log('Team columns:', Object.keys(teams.rows[0]));
      console.table(teams.rows);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // If matches table doesn't exist, show how to create it
    if (error.message.includes('relation "matches" does not exist')) {
      console.log('\nℹ️  It seems the database tables are not set up. You can run the migrations with:');
      console.log('   node migrations/runMigrations.js');
    }
    
  } finally {
    client.release();
    await pool.end();
  }
}

testConnection();
