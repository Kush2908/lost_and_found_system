const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { username, email, password, confirm_password, full_name, phone } = req.body;
    if (!full_name) return res.status(400).json({ error: 'Full name is required.' });
    if (!username) return res.status(400).json({ error: 'Username is required.' });
    if (username.length < 3) return res.status(400).json({ error: 'Username must be at least 3 characters.' });
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores.' });
    if (!email) return res.status(400).json({ error: 'Email is required.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    if (password !== confirm_password) return res.status(400).json({ error: 'Passwords do not match.' });

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(400).json({ error: 'Username or email already exists.' });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username, email, password: hash, full_name, phone: phone || null, role: 'user'
    });

    const userPayload = { id: newUser._id, username, email, role: 'user', full_name };
    const token = jwt.sign(userPayload, process.env.JWT_SECRET || 'your_jwt_secret_here', { expiresIn: '1d' });
    res.cookie('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.json({ message: 'Account created successfully! Welcome, ' + full_name + '!', user: userPayload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

    const user = await User.findOne({ $or: [{ username }, { email: username }] });
    if (!user) return res.status(401).json({ error: 'Invalid username or password.' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid username or password.' });

    const payload = { id: user._id, username: user.username, email: user.email, role: user.role, full_name: user.full_name };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_here', { expiresIn: '1d' });
    res.cookie('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.json({ message: 'Welcome back, ' + user.full_name + '!', user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  res.json({ message: 'Logged out successfully' });
};

exports.getProfile = (req, res) => {
  if (req.user) res.json({ user: req.user });
  else res.status(401).json({ error: 'Not logged in' });
};

