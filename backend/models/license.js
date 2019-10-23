const mongoose = require('mongoose');

const licenseSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  licenseActivated: { type: Boolean, default: false }, // true = paid, false = free
  licenseSubscribed: { type: Date, default: Date.now },
  licenseKey: { type: String, required: true }
});

module.exports = mongoose.model('License', licenseSchema);
