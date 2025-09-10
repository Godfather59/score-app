const { Pool } = require('pg');
require('dotenv').config();

console.log('Environment variables from .env:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '*** (set)' : '!! NOT SET !!');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false
});

async function testConnection() {
  let client;
  try {
    console.log('\nAttempting to connect to the database...');
    client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL!');
    
    const result = await client.query('SELECT version()');
    console.log('\nPostgreSQL version:');
    console.log(result.rows[0].version);
    
    return true;
  } catch (err) {
    console.error('\n❌ Connection failed!');
    console.error('Error details:', err.message);
    
    if (err.code) {
      console.error('Error code:', err.code);
    }
    
    if (err.message.includes('password authentication failed')) {
      console.log('\n💡 Tip: Check your DB_PASSWORD in the .env file');
    } else if (err.message.includes('database "score_app" does not exist')) {
      console.log('\n💡 Tip: The database does not exist. You need to create it first.');
    } else if (err.message.includes('connection refused')) {
      console.log('\n💡 Tip: Make sure PostgreSQL is running and accessible');
    }
    
    return false;
  } finally {
    if (client) {
      await client.release();
    }
    await pool.end();
  }
}

// Run the test
testConnection().then(success => {
  console.log('\nTest completed:', success ? '✅ SUCCESS' : '❌ FAILED');
  process.exit(success ? 0 : 1);
});
