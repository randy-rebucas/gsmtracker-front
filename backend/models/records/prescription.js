const mongoose = require('mongoose');

const recordPrescriptionSchema = mongoose.Schema({
    created: { type: Date },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prescriptions: [{
      maintenableFlg: { type: Boolean },
      medicine: { type: String },
      preparation: { type: String },
      sig: { type: String },
      quantity: { type: Number }
    }]
});

module.exports = mongoose.model('Prescription', recordPrescriptionSchema);
