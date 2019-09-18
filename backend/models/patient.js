const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    bloodType: { type: String, default: null },
    comments: { type: String, default: null },
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    licenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'License', required: true } //license
});

module.exports = mongoose.model('Patients', patientSchema);