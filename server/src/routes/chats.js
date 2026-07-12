const router = require('express').Router();
const auth = require('../middleware/auth');

const memoryChats = [];

function slow3G() { return new Promise(r => setTimeout(r, 600 + Math.random() * 1200)); }

router.get('/', auth, async (req, res) => {
  await slow3G();
  try {
    let Chat;
    try { Chat = require('../models/Chat'); } catch {}
    if (Chat && Chat.db?.readyState === 1) {
      return res.json(await Chat.find({ participants: req.userId }).populate('participants', 'name avatar status').populate('lastMessage').sort({ updatedAt: -1 }));
    }
    // Fallback
    const { memoryUsers } = require('./auth');
    const chats = memoryChats.filter(c => c.participants.some(p => p._id === req.userId || p === req.userId));
    const populated = chats.map(c => ({
      ...c,
      participants: c.participants.map(pid => {
        const u = memoryUsers.find(u => u._id === pid || u._id === pid._id);
        return u ? { _id: u._id, name: u.name, avatar: u.avatar || '', status: u.status } : { _id: pid, name: 'Unknown', avatar: '', status: 'offline' };
      })
    }));
    res.json(populated);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  await slow3G();
  try {
    const { participantId } = req.body;
    let Chat;
    try { Chat = require('../models/Chat'); } catch {}
    if (Chat && Chat.db?.readyState === 1) {
      let chat = await Chat.findOne({ participants: { $all: [req.userId, participantId], $size: 2 }, isGroup: false });
      if (chat) return res.json(chat);
      chat = await Chat.create({ participants: [req.userId, participantId] });
      return res.status(201).json(await chat.populate('participants', 'name avatar status'));
    }
    // Fallback
    let chat = memoryChats.find(c => !c.isGroup && c.participants.includes(req.userId) && c.participants.includes(participantId));
    if (chat) return res.json(chat);
    chat = { _id: Date.now().toString(36) + Math.random().toString(36).slice(2), participants: [req.userId, participantId], isGroup: false, lastMessage: null, updatedAt: new Date().toISOString() };
    memoryChats.push(chat);
    const { memoryUsers } = require('./auth');
    chat.participants = chat.participants.map(pid => {
      const u = memoryUsers.find(u => u._id === pid);
      return u ? { _id: u._id, name: u.name, avatar: u.avatar || '', status: u.status } : { _id: pid, name: 'Unknown' };
    });
    res.status(201).json(chat);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.memoryChats = memoryChats;
module.exports = router;
