const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all users
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// Get user by id
router.get('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

// Create user
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  body('username').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin', 'editor', 'user']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword, role });
      res.status(201).json({ message: 'User created', user: { id: user.user_id, username: user.username, email: user.email, role: user.role } });
    } catch (err) {
      res.status(500).json({ message: 'Error creating user', error: err.message });
    }
  }
);

// Update user
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  body('username').isLength({ min: 3 }),
  body('email').isEmail(),
  body('role').isIn(['admin', 'editor', 'user']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updatedUser = await User.update(req.params.id, req.body);
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: 'Error updating user', error: err.message });
    }
  }
);

// Delete user
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      await User.delete(req.params.id);
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
  }
);

module.exports = router;
