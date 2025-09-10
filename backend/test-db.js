const pool = require('./db');

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
  console.log('✅ Database connection successful!');
  console.log('Current database time:', res.rows[0].now);
  process.exit(0);
});
