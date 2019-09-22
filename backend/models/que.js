const mongoose = require('mongoose');

const queSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  queNumber: { type: String, required: true },
  personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
  licenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'License', required: true }
});

module.exports = mongoose.model('Que', queSchema);
