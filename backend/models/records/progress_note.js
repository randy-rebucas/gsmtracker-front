const mongoose = require('mongoose');

const recordProgressNoteSchema = mongoose.Schema({
  note: { type: String, required: true },
  created: { type: Date },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('ProgressNote', recordProgressNoteSchema);
