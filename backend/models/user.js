const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userType:  { type: String, default: 'Patient' },
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true }
});

module.exports = mongoose.model('User', userSchema);
