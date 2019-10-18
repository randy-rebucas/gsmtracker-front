const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    avatarPath: { type: String },
    metaData: [{
      label: { type: String },
      value: { type: String }
    }],
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true }
}, { strict: false });

module.exports = mongoose.model('User', userSchema);
