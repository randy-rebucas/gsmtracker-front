const mongoose = require('mongoose');

const attachmentSchema = mongoose.Schema({
  src: { type: String },
  thumb: { type: String },
  name: { type: String },
  type: { type: String },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attachments', attachmentSchema);
