const mongoose = require('mongoose');

const immunizationSchema = mongoose.Schema({
    vaccines: { type: String, required: true },
    doses: { type: String, required: true },
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'MyUsers', required: true }
});

module.exports = mongoose.model('Immunizations', immunizationSchema);
