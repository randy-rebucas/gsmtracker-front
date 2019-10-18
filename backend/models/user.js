const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    avatarPath: { type: String },
    userType: { type: mongoose.Schema.Types.ObjectId, ref: 'Type', required: true },
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
    licenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'License', required: true },
    metaData: [{
        label: { type: String },
        value: { type: String }
    }]
}, { strict: false });

module.exports = mongoose.model('User', userSchema);