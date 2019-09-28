const mongoose = require('mongoose');

const familyHistorySchema = mongoose.Schema({
    created: { type: Date },
    familyHistory: { type: String, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('FamilyHistory', familyHistorySchema);
