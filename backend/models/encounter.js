const mongoose = require('mongoose');

const encounterSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  status: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  licenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'License', required: true }
});

module.exports = mongoose.model('Encounter', encounterSchema);
