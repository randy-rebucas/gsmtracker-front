const mongoose = require('mongoose');

const recordComplaintSchema = mongoose.Schema({
    complaints: [{
        complaint: { type: String }
    }],
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Complaint', recordComplaintSchema);
