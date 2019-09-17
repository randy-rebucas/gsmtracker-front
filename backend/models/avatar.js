const mongoose = require('mongoose');

const avatarSchema = mongoose.Schema({
    imagePath: { type: String, required: true },
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true }
});

module.exports = mongoose.model('Avatar', avatarSchema);
