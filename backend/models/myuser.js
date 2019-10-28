const mongoose = require('mongoose');

const myUserSchema = mongoose.Schema({
  userType: { type: mongoose.Schema.Types.ObjectId, ref: 'Type', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notifications: [{
    type: { type: String },
    status: { type: Boolean, default: true }
  }],
});

module.exports = mongoose.model('MyUsers', myUserSchema);
