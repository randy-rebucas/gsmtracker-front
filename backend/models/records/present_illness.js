const mongoose = require('mongoose');

const presentIllnessSchema = mongoose.Schema({
    created: { type: Date },
    presentIllness: { type: String, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('PresentIllness', presentIllnessSchema);