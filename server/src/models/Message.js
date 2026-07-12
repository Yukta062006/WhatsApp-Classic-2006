const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, default: '' },
  type: { type: String, enum: ['text', 'image', 'audio', 'contact'], default: 'text' },
  fileUrl: { type: String, default: '' },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
}, { timestamps: true });

module.exports = mongoose.model('Message', schema);
