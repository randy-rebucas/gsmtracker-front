const mongoose = require('mongoose');

const recordAssessmentSchema = mongoose.Schema({
    diagnosis: [{
        diagnose: { type: String }
    }],
    treatments: [{
        treatment: { type: String }
    }],
    created: { type: Date },
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Assessment', recordAssessmentSchema);
