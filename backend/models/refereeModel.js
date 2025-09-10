const pool = require('../db');

const Referee = {
  async create({ name, country, matches }) {
    const result = await pool.query(
      'INSERT INTO referees (name, country, matches) VALUES ($1, $2, $3) RETURNING *',
      [name, country, matches || 0]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query('SELECT * FROM referees');
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM referees WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, { name, country, matches }) {
    const result = await pool.query(
      'UPDATE referees SET name = $1, country = $2, matches = $3 WHERE id = $4 RETURNING *',
      [name, country, matches, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM referees WHERE id = $1', [id]);
  }
};

module.exports = Referee;
