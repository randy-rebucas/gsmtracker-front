const mongoose = require('mongoose');

const recordHeightSchema = mongoose.Schema({
    height: { type: String, required: true },
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'MyUsers', required: true }
});

module.exports = mongoose.model('Height', recordHeightSchema);
