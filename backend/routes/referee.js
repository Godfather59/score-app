const express = require('express');
const { body, validationResult } = require('express-validator');
const Referee = require('../models/refereeModel');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all referees
router.get('/', authenticateToken, async (req, res) => {
  try {
    const referees = await Referee.getAll();
    res.json(referees);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching referees', error: err.message });
  }
});

// Get referee by id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const referee = await Referee.findById(req.params.id);
    if (!referee) return res.status(404).json({ message: 'Referee not found' });
    res.json(referee);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching referee', error: err.message });
  }
});

// Create referee
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  body('name').notEmpty(),
  body('country').optional(),
  body('matches').optional().isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const referee = await Referee.create(req.body);
      res.status(201).json(referee);
    } catch (err) {
      res.status(500).json({ message: 'Error creating referee', error: err.message });
    }
  }
);

// Update referee
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  body('name').notEmpty(),
  body('country').optional(),
  body('matches').optional().isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const updatedReferee = await Referee.update(req.params.id, req.body);
      if (!updatedReferee) return res.status(404).json({ message: 'Referee not found' });
      res.json(updatedReferee);
    } catch (err) {
      res.status(500).json({ message: 'Error updating referee', error: err.message });
    }
  }
);

// Delete referee
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      await Referee.delete(req.params.id);
      res.json({ message: 'Referee deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting referee', error: err.message });
    }
  }
);

module.exports = router;
