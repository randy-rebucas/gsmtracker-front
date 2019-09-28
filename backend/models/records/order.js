const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    created: { type: Date },
    order: { type: String, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Order', orderSchema);
