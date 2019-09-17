const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  allDay: { type: Boolean, default: true },
  backgroundColor: { type: String },
  borderColor: { type: String },
  textColor: { type: String },
  status: { type: Number, default: 0  }, // 0 = pending, 1 = confirmed, 2 = canceled
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
