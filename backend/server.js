const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/team');
const playerRoutes = require('./routes/player');
const matchRoutes = require('./routes/match');
const refereeRoutes = require('./routes/referee');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/referees', refereeRoutes);
app.use('/api/users', userRoutes);

// For referees and users, similar routes can be added, but for brevity, I'll assume similar structure.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
