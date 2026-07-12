const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, default: '' },
  password: { type: String, required: true, select: false },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['online', 'away', 'busy', 'invisible', 'offline'], default: 'online' },
  customStatus: { type: String, default: '' },
  lastSeen: { type: Date, default: Date.now },
  theme: { type: String, default: 'blue' },
}, { timestamps: true });

schema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

schema.methods.comparePassword = function(p) { return bcrypt.compare(p, this.password); };

module.exports = mongoose.model('User', schema);
