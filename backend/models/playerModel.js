const pool = require('../db');

const Player = {
  async create({ name, team_id, position, goals }) {
    const result = await pool.query(
      'INSERT INTO players (name, team_id, position, goals) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, team_id, position, goals || 0]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query('SELECT * FROM players');
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM players WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, { name, team_id, position, goals }) {
    const result = await pool.query(
      'UPDATE players SET name = $1, team_id = $2, position = $3, goals = $4 WHERE id = $5 RETURNING *',
      [name, team_id, position, goals, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM players WHERE id = $1', [id]);
  }
};

module.exports = Player;
