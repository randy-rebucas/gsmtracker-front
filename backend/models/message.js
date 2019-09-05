const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const messageSchema = mongoose.Schema({
  created: { type: Date },
  message: { type: String, required: true },
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true},
  personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true }
});

module.exports = mongoose.model('Messages', messageSchema);
