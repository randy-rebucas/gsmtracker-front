const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  message: { type: String, required: true },
  status: { type: Number, default: 0  },
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Messages', messageSchema);
