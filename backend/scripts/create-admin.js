const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'score_app',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'saidsaid',
  ssl: false
});

async function createAdminUser() {
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');

    // Check if admin user already exists
    const checkUser = await client.query(
      'SELECT * FROM users WHERE username = $1',
      ['admin']
    );

    if (checkUser.rows.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const result = await client.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      ['admin', 'admin@example.com', hashedPassword, 'admin']
    );

    await client.query('COMMIT');
    console.log('Admin user created successfully:');
    console.log({
      id: result.rows[0].user_id,
      username: result.rows[0].username,
      email: result.rows[0].email,
      role: result.rows[0].role
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating admin user:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

createAdminUser();
