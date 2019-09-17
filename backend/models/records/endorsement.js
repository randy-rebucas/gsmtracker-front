const mongoose = require('mongoose');

const recordEndorsementSchema = mongoose.Schema({
    to: { type: String, required: true },
    content: { type: String, required: true },
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Endorsement', recordEndorsementSchema);
