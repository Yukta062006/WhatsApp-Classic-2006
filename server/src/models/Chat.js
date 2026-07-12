const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  isGroup: { type: Boolean, default: false },
  groupName: { type: String, default: '' },
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Chat', schema);
