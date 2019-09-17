const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
    userType:  { type: String, default: 'Patient' },
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
