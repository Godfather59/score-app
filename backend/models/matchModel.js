const pool = require('../db');

const Match = {
  async create({ home_team_id, away_team_id, date, time, league, status, home_score, away_score }) {
    const result = await pool.query(
      'INSERT INTO matches (home_team_id, away_team_id, date, time, league, status, home_score, away_score) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [home_team_id, away_team_id, date, time, league, status, home_score || 0, away_score || 0]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(
      `SELECT m.*, 
        ht.name AS home_team_name, 
        ht.logo AS home_team_logo,
        at.name AS away_team_name,
        at.logo AS away_team_logo
      FROM matches m
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id`
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT m.*, 
        ht.name AS home_team_name, 
        ht.logo AS home_team_logo,
        at.name AS away_team_name,
        at.logo AS away_team_logo
      FROM matches m
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      WHERE m.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async update(id, { home_team_id, away_team_id, date, time, league, status, home_score, away_score }) {
    const result = await pool.query(
      'UPDATE matches SET home_team_id = $1, away_team_id = $2, date = $3, time = $4, league = $5, status = $6, home_score = $7, away_score = $8 WHERE id = $9 RETURNING *',
      [home_team_id, away_team_id, date, time, league, status, home_score, away_score, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM matches WHERE id = $1', [id]);
  }
};

module.exports = Match;
