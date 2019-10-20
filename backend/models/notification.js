const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  type: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Notification', notificationSchema);
