const mongoose = require('mongoose');

const encounterSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  status: { type: Number, default: 0 },
  myUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'MyUsers', required: true },
  licenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'License', required: true }
});

module.exports = mongoose.model('Encounter', encounterSchema);
