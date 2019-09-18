const mongoose = require('mongoose');

const licenseSchema = mongoose.Schema({
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
    licenseType: { type: Boolean, default: false }, // true = paid, false = free
    licenseKey: { type: String, required: true }
});

module.exports = mongoose.model('License', licenseSchema);