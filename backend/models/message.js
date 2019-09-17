const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  message: { type: String, required: true },
  status: { type: Number, default: 0  },
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true},
  personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true }
});

module.exports = mongoose.model('Messages', messageSchema);
