const mongoose = require('mongoose');

const recordTestResultSchema = mongoose.Schema({
    test: { type: String, required: true },
    specimen: { type: String, required: true },
    conventional_unit: { type: String, required: true },
    si_unit: { type: Number, required: true },
    created: { type: Date },
    patientid: { type: mongoose.Schema.Types.ObjectId, ref: 'MyUsers', required: true }
});

module.exports = mongoose.model('TestResult', recordTestResultSchema);
