const pool = require('../db');

const User = {
  async create({ username, email, password, role }) {
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, password, role]
    );
    return result.rows[0];
  },

  async findByUsername(username) {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM users WHERE user_id = $1',
      [id]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query('SELECT user_id as id, username, email, role FROM users');
    return result.rows;
  },

  async update(id, { username, email, role }) {
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2, role = $3 WHERE user_id = $4 RETURNING user_id as id, username, email, role',
      [username, email, role, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM users WHERE user_id = $1', [id]);
  }
};

module.exports = User;
