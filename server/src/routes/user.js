const router = require('express').Router();
const auth = require('../middleware/auth');

// Simulate 3G delay
function slow3G() {
  return new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
}

router.get('/', auth, async (req, res) => {
  await slow3G();
  try {
    let User;
    try { User = require('../models/User'); } catch {}

    if (User && User.db?.readyState === 1) {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json(user);
    }

    // Fallback: in-memory
    const { memoryUsers } = require('./auth');
    const user = memoryUsers.find(u => u._id === req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password, ...safe } = user;
    res.json(safe);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/profile', auth, async (req, res) => {
  await slow3G();
  try {
    const { name, email, customStatus, status, theme } = req.body;
    let User;
    try { User = require('../models/User'); } catch {}

    if (User && User.db?.readyState === 1) {
      const update = {};
      if (name) update.name = name;
      if (email !== undefined) update.email = email;
      if (customStatus !== undefined) update.customStatus = customStatus;
      if (status) update.status = status;
      if (theme) update.theme = theme;
      return res.json(await User.findByIdAndUpdate(req.userId, update, { new: true }));
    }

    // Fallback: in-memory
    const { memoryUsers } = require('./auth');
    const user = memoryUsers.find(u => u._id === req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (email !== undefined) user.email = email;
    if (customStatus !== undefined) user.customStatus = customStatus;
    if (status) user.status = status;
    if (theme) user.theme = theme;
    const { password, ...safe } = user;
    res.json(safe);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/search', auth, async (req, res) => {
  await slow3G();
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    let User;
    try { User = require('../models/User'); } catch {}

    if (User && User.db?.readyState === 1) {
      return res.json(await User.find({ _id: { $ne: req.userId }, $or: [{ name: new RegExp(q, 'i') }, { phone: new RegExp(q, 'i') }] }).limit(20).select('name phone avatar status'));
    }

    // Fallback
    const { memoryUsers } = require('./auth');
    const results = memoryUsers.filter(u => u._id !== req.userId && (u.name.toLowerCase().includes(q.toLowerCase()) || u.phone.includes(q)));
    res.json(results.map(u => ({ _id: u._id, name: u.name, phone: u.phone, avatar: u.avatar, status: u.status })));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
