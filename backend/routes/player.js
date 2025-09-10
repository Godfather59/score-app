const express = require('express');
const { body, validationResult } = require('express-validator');
const Player = require('../models/playerModel');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Search players
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q: query } = req.query;
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters long' });
    }
    const players = await Player.search(query);
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: 'Error searching players', error: err.message });
  }
});

// Get all players
router.get('/', authenticateToken, async (req, res) => {
  try {
    const players = await Player.getAll();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching players', error: err.message });
  }
});

// Get player by id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching player', error: err.message });
  }
});

// Create player
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'editor'),
  body('name').notEmpty(),
  body('team_id').isInt(),
  body('position').notEmpty(),
  body('goals').optional().isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const player = await Player.create(req.body);
      res.status(201).json(player);
    } catch (err) {
      res.status(500).json({ message: 'Error creating player', error: err.message });
    }
  }
);

// Update player
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'editor'),
  body('name').notEmpty(),
  body('team_id').isInt(),
  body('position').notEmpty(),
  body('goals').optional().isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const updatedPlayer = await Player.update(req.params.id, req.body);
      if (!updatedPlayer) return res.status(404).json({ message: 'Player not found' });
      res.json(updatedPlayer);
    } catch (err) {
      res.status(500).json({ message: 'Error updating player', error: err.message });
    }
  }
);

// Delete player
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'editor'),
  async (req, res) => {
    try {
      await Player.delete(req.params.id);
      res.json({ message: 'Player deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting player', error: err.message });
    }
  }
);

module.exports = router;
