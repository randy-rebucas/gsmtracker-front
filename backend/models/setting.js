const mongoose = require('mongoose');

const settingSchema = mongoose.Schema({
    licenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'License', required: true },
    logoPath: { type: String },
    clinicOwner: { type: String, required: true },
    clinicName: { type: String },
    clinicAddress: { type: String },
    clinicEmail: { type: String },
    prc: { type: String },
    ptr: { type: String },
    s2: { type: String },
    nobreak: { type: Boolean },
    clinicPhone: [{
        contact: { type: String }
    }],
    clinicHours: [{
        morningOpen: { type: String },
        afternoonClose: { type: String }
    }]
});


module.exports = mongoose.model('Setting', settingSchema);
