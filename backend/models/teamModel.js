const pool = require('../db');

const Team = {
  async create({ name, league, founded }) {
    const result = await pool.query(
      'INSERT INTO teams (name, league, founded) VALUES ($1, $2, $3) RETURNING *',
      [name, league, founded]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query('SELECT * FROM teams');
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM teams WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, { name, league, founded }) {
    const result = await pool.query(
      'UPDATE teams SET name = $1, league = $2, founded = $3 WHERE id = $4 RETURNING *',
      [name, league, founded, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM teams WHERE id = $1', [id]);
  }
};

module.exports = Team;
