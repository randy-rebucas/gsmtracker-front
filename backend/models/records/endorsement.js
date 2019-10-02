const mongoose = require('mongoose');

const recordEndorsementSchema = mongoose.Schema({
    endorsementRef: { type: String, required: true },
    endorsement: { type: String, required: true },
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});
module.exports = mongoose.model('Endorsement', recordEndorsementSchema);
