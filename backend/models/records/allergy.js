const mongoose = require('mongoose');

const allergySchema = mongoose.Schema({
    created: { type: Date, default: Date.now },
    allergy: { type: String, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Allergy', allergySchema);
