const express = require('express');
const router = express.Router();
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const USERS_FILE = './data/users.json';
const SECRET_KEY = 'your-secret-key'; // Store securely in production

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: 'All fields required' });

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  }

  const userExists = users.find(u => u.username === username);
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), username, password: hashed };
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ message: 'User registered' });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: 'All fields required' });

  if (!fs.existsSync(USERS_FILE)) return res.status(401).json({ message: 'No users yet' });

  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1d' });
  res.json({ token });
});

module.exports = router;
