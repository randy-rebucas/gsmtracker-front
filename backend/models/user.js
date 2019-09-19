const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userType: { type: String, default: 'patient' },
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
    licenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'License', required: true },
    metaData: [{
      label: { type: String },
      value: { type: String }
    }]
}, { strict: false });

module.exports = mongoose.model('User', userSchema);
