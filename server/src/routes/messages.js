const router = require('express').Router();
const auth = require('../middleware/auth');

const memoryMessages = [];

function slow3G() { return new Promise(r => setTimeout(r, 500 + Math.random() * 1000)); }

router.get('/:chatId', auth, async (req, res) => {
  await slow3G();
  try {
    let Message;
    try { Message = require('../models/Message'); } catch {}
    if (Message && Message.db?.readyState === 1) {
      return res.json(await Message.find({ chat: req.params.chatId }).populate('sender', 'name avatar').sort({ createdAt: 1 }).limit(100));
    }
    // Fallback
    const { memoryUsers } = require('./auth');
    const msgs = memoryMessages.filter(m => m.chat === req.params.chatId).map(m => {
      const sender = memoryUsers.find(u => u._id === m.sender) || { _id: m.sender, name: 'You', avatar: '' };
      return { ...m, sender: { _id: sender._id, name: sender.name, avatar: sender.avatar || '' } };
    });
    res.json(msgs);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  await slow3G();
  try {
    const { chatId, text, type, fileUrl } = req.body;
    let Message, Chat;
    try { Message = require('../models/Message'); Chat = require('../models/Chat'); } catch {}
    if (Message && Message.db?.readyState === 1) {
      const msg = await Message.create({ chat: chatId, sender: req.userId, text, type: type || 'text', fileUrl: fileUrl || '' });
      await Chat.findByIdAndUpdate(chatId, { lastMessage: msg._id });
      const populated = await msg.populate('sender', 'name avatar');
      const chat = await Chat.findById(chatId);
      const { getIO } = require('../config/socket');
      chat.participants.forEach(p => { if (p.toString() !== req.userId) getIO().to(p.toString()).emit('new_message', populated); });
      return res.status(201).json(populated);
    }
    // Fallback
    const { memoryUsers } = require('./auth');
    const { memoryChats } = require('./chats');
    const msg = {
      _id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      chat: chatId,
      sender: req.userId,
      text: text || '',
      type: type || 'text',
      fileUrl: fileUrl || '',
      status: 'sent',
      createdAt: new Date().toISOString()
    };
    memoryMessages.push(msg);
    // Update lastMessage on chat
    const chat = memoryChats.find(c => c._id === chatId);
    if (chat) { chat.lastMessage = msg; chat.updatedAt = msg.createdAt; }
    const sender = memoryUsers.find(u => u._id === req.userId) || { _id: req.userId, name: 'You', avatar: '' };
    const populated = { ...msg, sender: { _id: sender._id, name: sender.name, avatar: sender.avatar || '' } };
    // Emit via socket
    try {
      const { getIO } = require('../config/socket');
      if (chat) {
        const otherIds = Array.isArray(chat.participants) ? chat.participants.filter(p => (p._id || p) !== req.userId) : [];
        otherIds.forEach(p => getIO().to(p._id || p).emit('new_message', populated));
      }
    } catch {}
    res.status(201).json(populated);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    let Message;
    try { Message = require('../models/Message'); } catch {}
    if (Message && Message.db?.readyState === 1) {
      await Message.findOneAndDelete({ _id: req.params.id, sender: req.userId });
      return res.json({ ok: true });
    }
    const idx = memoryMessages.findIndex(m => m._id === req.params.id && m.sender === req.userId);
    if (idx >= 0) memoryMessages.splice(idx, 1);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
