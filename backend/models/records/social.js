const mongoose = require('mongoose');

const socialSchema = mongoose.Schema({
    created: { type: Date },
    social: { type: String, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Social', socialSchema);
