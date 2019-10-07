const mongoose = require('mongoose');

const recordWeightSchema = mongoose.Schema({
    weight: { type: String, required: true },
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Weight', recordWeightSchema);
