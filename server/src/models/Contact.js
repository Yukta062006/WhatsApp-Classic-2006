const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nickname: { type: String, default: '' },
  group: { type: String, enum: ['favorites', 'friends', 'family', 'work'], default: 'friends' },
}, { timestamps: true });

schema.index({ user: 1, contact: 1 }, { unique: true });
module.exports = mongoose.model('Contact', schema);
