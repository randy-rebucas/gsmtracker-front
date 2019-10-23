const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    created: { type: Date },
    order: { type: String, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'MyUsers', required: true }
});

module.exports = mongoose.model('Order', orderSchema);
