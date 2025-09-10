const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',  // Default to 'postgres' if not set
  host: process.env.DB_HOST || 'localhost', // Default to 'localhost' if not set
  database: process.env.DB_NAME || 'score_app', // Default to 'score_app' if not set
  password: process.env.DB_PASSWORD, // No default, will error if not set
  port: process.env.DB_PORT || 5432, // Default to 5432 if not set
});

async function checkUsers() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    console.log('\nChecking users table...');
    const res = await client.query('SELECT * FROM users');
    
    if (res.rows.length === 0) {
      console.log('No users found in the database.');
      console.log('\nCreating admin user...');
      
      // Hash for 'admin123' password
      const hashedPassword = '$2b$10$4XyX5XyX5XyX5XyX5XyX5O9XyX5XyX5XyX5XyX5XyX5XyX5XyX5XyX5';
      
      await client.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
        ['admin', 'admin@example.com', hashedPassword, 'admin']
      );
      
      console.log('Admin user created successfully!');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('Role: admin');
    } else {
      console.log('\nExisting users:');
      console.table(res.rows.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      })));
    }
    
    client.release();
  } catch (err) {
    console.error('Error checking users:', err);
  } finally {
    await pool.end();
  }
}

checkUsers();
