const mongoose = require('mongoose');

const recordComplaintSchema = mongoose.Schema({
    created: { type: Date },
    complaints: { type: String, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Complaint', recordComplaintSchema);
