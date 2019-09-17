const mongoose = require('mongoose');

const recordTemperatureSchema = mongoose.Schema({
    temperature: { type: String, required: true },
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Temperature', recordTemperatureSchema);
