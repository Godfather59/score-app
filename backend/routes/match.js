const express = require('express');
const { body, validationResult } = require('express-validator');
const Match = require('../models/matchModel');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all matches
router.get('/', authenticateToken, async (req, res) => {
  try {
    const matches = await Match.getAll();
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching matches', error: err.message });
  }
});

// Get match by id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching match', error: err.message });
  }
});

// Create match
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'editor'),
  body('home_team_id').isInt(),
  body('away_team_id').isInt(),
  body('date').isDate(),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const match = await Match.create(req.body);
      res.status(201).json(match);
    } catch (err) {
      res.status(500).json({ message: 'Error creating match', error: err.message });
    }
  }
);

// Update match
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'editor'),
  body('home_team_id').isInt(),
  body('away_team_id').isInt(),
  body('date').isDate(),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const updatedMatch = await Match.update(req.params.id, req.body);
      if (!updatedMatch) return res.status(404).json({ message: 'Match not found' });
      res.json(updatedMatch);
    } catch (err) {
      res.status(500).json({ message: 'Error updating match', error: err.message });
    }
  }
);

// Delete match
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'editor'),
  async (req, res) => {
    try {
      await Match.delete(req.params.id);
      res.json({ message: 'Match deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting match', error: err.message });
    }
  }
);

module.exports = router;
