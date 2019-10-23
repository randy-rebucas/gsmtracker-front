const mongoose = require('mongoose');

const queSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  queNumber: { type: String, required: true },
  myUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'MyUsers', required: true },
  licenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'License', required: true }
});

module.exports = mongoose.model('Que', queSchema);
