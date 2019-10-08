const mongoose = require('mongoose');

const pulseRateSchema = mongoose.Schema({
    pulserate: { type: String, required: true },
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('PulseRate', pulseRateSchema);
