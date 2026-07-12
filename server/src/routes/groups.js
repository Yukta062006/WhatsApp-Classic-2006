const router = require('express').Router();
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');

router.get('/', auth, async (req, res) => {
  try { res.json(await Chat.find({ participants: req.userId, isGroup: true }).populate('participants', 'name avatar status').populate('groupAdmin', 'name')); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, members } = req.body;
    const all = [...new Set([req.userId, ...members])];
    if (all.length > 10) return res.status(400).json({ message: 'Max 10 members' });
    const chat = await Chat.create({ participants: all, isGroup: true, groupName: name, groupAdmin: req.userId });
    res.status(201).json(await chat.populate('participants', 'name avatar status'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { name, addMember, removeMember } = req.body;
    const chat = await Chat.findById(req.params.id);
    if (!chat || !chat.isGroup) return res.status(404).json({ message: 'Not found' });
    if (name) chat.groupName = name;
    if (addMember) { if (chat.participants.length >= 10) return res.status(400).json({ message: 'Max 10' }); chat.participants.push(addMember); }
    if (removeMember) chat.participants = chat.participants.filter(p => p.toString() !== removeMember);
    await chat.save();
    res.json(await chat.populate('participants', 'name avatar status'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (chat?.groupAdmin?.toString() !== req.userId) return res.status(403).json({ message: 'Only admin' });
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
