const mongoose = require('mongoose');

const recordBloodPressureSchema = mongoose.Schema({
    systolic: { type: String, required: true },
    diastolic: { type: String, required: true },
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('BloodPressure', recordBloodPressureSchema);
