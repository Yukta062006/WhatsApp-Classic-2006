const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory user store (fallback when MongoDB is unavailable)
const memoryUsers = [];

// Simulate 3G connection delay (1.5 - 3.5 seconds)
function slow3G() {
  const delay = 1500 + Math.random() * 2000;
  return new Promise(resolve => setTimeout(resolve, delay));
}

router.post('/register', async (req, res) => {
  await slow3G();
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 4) return res.status(400).json({ message: 'Password must be at least 4 characters' });

    // Try MongoDB first
    let User;
    try { User = require('../models/User'); } catch {}

    if (User && User.db?.readyState === 1) {
      if (await User.findOne({ phone })) return res.status(400).json({ message: 'Phone number already registered' });
      const user = await User.create({ name, phone, password });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({ user: { _id: user._id, name: user.name, phone: user.phone, status: user.status }, token });
    }

    // Fallback: in-memory store
    const existing = memoryUsers.find(u => u.phone === phone);
    if (existing) return res.status(400).json({ message: 'Phone number already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      _id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      name,
      phone,
      password: hashed,
      avatar: '',
      status: 'online',
      customStatus: '',
      theme: 'blue',
      createdAt: new Date()
    };
    memoryUsers.push(newUser);
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      user: { _id: newUser._id, name: newUser.name, phone: newUser.phone, status: newUser.status, avatar: '', customStatus: '' },
      token
    });
  } catch (e) {
    console.error('Register error:', e.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  await slow3G();
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ message: 'Phone and password are required' });

    // Try MongoDB first
    let User;
    try { User = require('../models/User'); } catch {}

    if (User && User.db?.readyState === 1) {
      const user = await User.findOne({ phone }).select('+password');
      if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid phone number or password' });
      user.status = 'online'; user.lastSeen = new Date(); await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ user: { _id: user._id, name: user.name, phone: user.phone, avatar: user.avatar, status: user.status, customStatus: user.customStatus, theme: user.theme }, token });
    }

    // Fallback: in-memory store
    const user = memoryUsers.find(u => u.phone === phone);
    if (!user) return res.status(401).json({ message: 'Invalid phone number or password' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid phone number or password' });

    user.status = 'online';
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      user: { _id: user._id, name: user.name, phone: user.phone, avatar: user.avatar || '', status: user.status, customStatus: user.customStatus || '', theme: user.theme || 'blue' },
      token
    });
  } catch (e) {
    console.error('Login error:', e.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Export memoryUsers for other routes to use
router.memoryUsers = memoryUsers;

module.exports = router;
