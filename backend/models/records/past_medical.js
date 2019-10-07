const mongoose = require('mongoose');

const pastMedicalSchema = mongoose.Schema({
    created: { type: Date },
    pastMedical: { type: String, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('PastMedical', pastMedicalSchema);
