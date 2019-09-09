const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const settingSchema = mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clinicOwner: { type: String, required: true },
  clinicName: { type: String },
  clinicAddress: { type: String },
  clinicEmail: { type: String },
  clinicUrl: { type: String },
  prc: { type: String },
  ptr: { type: String },
  s2: { type: String },
  clinicPhone: [{
    contact: { type: String }
  }],
  clinicHours: [{
    morningOpen: { type: String },
    morningClose: { type: String },
    afternoonOpen: { type: String },
    afternoonClose: { type: String }
  }]
});


module.exports = mongoose.model('Setting', settingSchema);
