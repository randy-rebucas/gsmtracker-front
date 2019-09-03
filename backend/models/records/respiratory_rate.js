const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordRespiratoryRateSchema = mongoose.Schema({
    respiratoryrate: { type: String, required: true },
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('RespiratoryRate', recordRespiratoryRateSchema);
