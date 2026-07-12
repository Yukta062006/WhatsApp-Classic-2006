const router = require('express').Router();
const auth = require('../middleware/auth');
const Contact = require('../models/Contact');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try { res.json(await Contact.find({ user: req.userId }).populate('contact', 'name phone avatar status customStatus lastSeen')); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { phone, nickname, group } = req.body;
    const contactUser = await User.findOne({ phone });
    if (!contactUser) return res.status(404).json({ message: 'User not found' });
    if (contactUser._id.toString() === req.userId) return res.status(400).json({ message: 'Cannot add yourself' });
    const c = await Contact.create({ user: req.userId, contact: contactUser._id, nickname, group: group || 'friends' });
    res.status(201).json(await c.populate('contact', 'name phone avatar status'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try { await Contact.findOneAndDelete({ _id: req.params.id, user: req.userId }); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
