const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

// Use environment variables or fallback to defaults from .env.example
const dbConfig = {
  host: process.env.DB_HOST || 'localhost', // Default to 'localhost' if not set
  port: parseInt(process.env.DB_PORT, 10) || 5432, // Default to 5432 if not set
  database: process.env.DB_NAME || 'score_app', // Default to 'score_app' if not set
  user: process.env.DB_USER || 'postgres', // Default to 'postgres' if not set
  password: process.env.DB_PASSWORD, // No default, will error if not set
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

console.log('Attempting to connect with the following configuration:');
console.log({
  ...dbConfig,
  password: dbConfig.password ? '*** (password is set)' : '!! PASSWORD NOT SET !!',
});

const pool = new Pool(dbConfig);

async function testConnection() {
  try {
    console.log('\nTesting database connection...');
    const client = await pool.connect();
    
    console.log('\nConnected to PostgreSQL database!');
    console.log('Server version:', (await client.query('SELECT version()')).rows[0].version);
    
    console.log('\nListing all tables in the database:');
    const tables = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    console.table(tables.rows);
    
    console.log('\nChecking users table:');
    try {
      const users = await client.query('SELECT * FROM users LIMIT 5');
      console.log(`Found ${users.rowCount} users:`);
      console.table(users.rows.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        created_at: u.created_at
      })));
    } catch (err) {
      console.error('Error querying users table:', err.message);
    }
    
    client.release();
  } catch (err) {
    console.error('\nError connecting to the database:');
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    console.error('\nTroubleshooting tips:');
    console.log('- Make sure PostgreSQL is running');
    console.log('- Verify your database credentials');
    console.log('- Check if the database exists');
    console.log('- Ensure the user has proper permissions');
    console.log('- Check if the server is accepting connections');
  } finally {
    await pool.end();
    process.exit();
  }
}

testConnection();
