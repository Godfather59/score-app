const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Team = require('../models/teamModel');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all teams
router.get('/', authenticateToken, async (req, res) => {
  try {
    const teams = await Team.getAll();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching teams', error: err.message });
  }
});

// Get team by id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching team', error: err.message });
  }
});

// Create team
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'editor'),
  upload.single('logo'),
  body('name').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const teamData = {
        name: req.body.name,
        league: req.body.league,
        founded: req.body.founded,
        logo: req.file ? req.file.filename : null
      };
      const team = await Team.create(teamData);
      res.status(201).json(team);
    } catch (err) {
      res.status(500).json({ message: 'Error creating team', error: err.message });
    }
  }
);

// Update team
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'editor'),
  upload.single('logo'),
  body('name').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const teamData = {
        name: req.body.name,
        league: req.body.league,
        founded: req.body.founded,
        logo: req.file ? req.file.filename : req.body.logo
      };
      const updatedTeam = await Team.update(req.params.id, teamData);
      if (!updatedTeam) return res.status(404).json({ message: 'Team not found' });
      res.json(updatedTeam);
    } catch (err) {
      res.status(500).json({ message: 'Error updating team', error: err.message });
    }
  }
);

// Delete team
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'editor'),
  async (req, res) => {
    try {
      await Team.delete(req.params.id);
      res.json({ message: 'Team deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting team', error: err.message });
    }
  }
);

module.exports = router;
