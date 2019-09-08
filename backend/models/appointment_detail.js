const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const appointmentDetailSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  midlename: { type: String, required: true },
  lastname: { type: String, required: true },
  contact: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, default: 1 }, // 0 = my-patient, 1 = not-registered
  status: { type: Number, default: 0  }, // 0 = pending, 1 = confirmed, 2 = canceled
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true}
});

module.exports = mongoose.model('AppointmentDetail', appointmentDetailSchema);
