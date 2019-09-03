const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordAllergySchema = mongoose.Schema({
    allergy: { type: String, required: true },
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Allergy', recordAllergySchema);