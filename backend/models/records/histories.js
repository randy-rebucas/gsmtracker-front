const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordHistoriesSchema = mongoose.Schema({
    type: { type: String, required: true },
    description: { type: String, required: true },
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Histories', recordHistoriesSchema);
