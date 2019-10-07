const mongoose = require('mongoose');

const recordRespiratoryRateSchema = mongoose.Schema({
    respiratoryrate: { type: String, required: true },
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('RespiratoryRate', recordRespiratoryRateSchema);
