const mongoose = require('mongoose');

const recordAssessmentSchema = mongoose.Schema({
    diagnosis: { type: String },
    treatments: { type: String },
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Assessment', recordAssessmentSchema);
